"""A06: deterministic, source-preserving, metadata-aware TIFF batch analysis.

One image/field per manifest row. Candidate counts/areas are algorithm outputs,
not independently validated nuclei or exophers. All rows are audited before
execution. A run fails closed and never silently overwrites original data.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import platform
import sys
from dataclasses import asdict
from importlib import metadata
from pathlib import Path

import numpy as np
import tifffile

from projects.advanced.a01.image_audit import AuditError, audit_image, select_yx_plane
from projects.advanced.a02.segmentation import SegmentConfig, region_table, segment


class BatchError(ValueError):
    """Invalid batch metadata, ambiguous source axes or unsafe output paths."""


def sha256_file(path: Path) -> str:
    d = hashlib.sha256()
    with path.open("rb") as fh:
        for block in iter(lambda: fh.read(1024 * 1024), b""):
            d.update(block)
    return d.hexdigest()


def load_manifest(path: Path, root: Path) -> list[dict]:
    """Return records with explicit biological IDs and declared source axes."""
    with path.open("r", newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        required = {"image_id", "source_path", "animal_id", "condition",
                    "channel", "z", "time"}
        if not required.issubset(reader.fieldnames or []):
            raise BatchError(f"Missing manifest columns {sorted(required-set(reader.fieldnames or []))}")
        records = list(reader)
    if not records:
        raise BatchError("Manifest has no images")
    identifiers: set[str] = set()
    paths: set[Path] = set()
    assigned_groups: dict[str, str] = {}
    result = []
    root = root.resolve()
    for line, item in enumerate(records, 2):
        ident = (item.get("image_id") or "").strip()
        animal = (item.get("animal_id") or "").strip()
        group = (item.get("condition") or "").strip()
        if not ident or not animal or not group:
            raise BatchError(f"Line {line} requires image ID, animal and condition")
        if ident in identifiers:
            raise BatchError(f"Duplicate image ID {ident!r}")
        if animal in assigned_groups and assigned_groups[animal] != group:
            raise BatchError(f"Animal {animal!r} assigned to multiple conditions")
        source_string = (item.get("source_path") or "").strip()
        if not source_string or Path(source_string).is_absolute():
            raise BatchError("source_path must be nonempty and relative to input root")
        path = (root / source_string).resolve()
        if not path.is_relative_to(root) or path.suffix.lower() not in (".tif", ".tiff"):
            raise BatchError("Source path must be an in-root TIFF, without traversal")
        if path in paths or not path.is_file():
            raise BatchError(f"Duplicate or missing source TIFF: {source_string!r}")
        indices = {}
        for axis, value in (("channel", item["channel"]), ("z", item["z"]), ("time", item["time"])):
            val = (value or "").strip()
            try:
                indices[axis] = int(val) if val else None
            except ValueError as exc:
                raise BatchError(f"Line {line}: {axis} must be a nonnegative integer or blank") from exc
            if indices[axis] is not None and indices[axis] < 0:
                raise BatchError(f"Line {line}: {axis} cannot be negative")
        identifiers.add(ident)
        paths.add(path)
        assigned_groups[animal] = group
        result.append({
            "image_id": ident, "source": path, "source_path": source_string,
            "animal_id": animal, "condition": group,
            "exclude_reason": (item.get("exclude_reason") or "").strip(),
            **indices,
        })
    return result


def batch_run(*, data_root: Path, manifest_csv: Path, config_file: Path,
              output_root: Path, max_mib: int = 256) -> dict:
    data_root, manifest_csv, config_file, output_root = [
        Path(p).resolve() for p in (data_root, manifest_csv, config_file, output_root)
    ]
    if max_mib < 1:
        raise BatchError("Memory limit must be >=1 MiB")
    if (output_root.exists() or output_root == data_root or output_root.is_relative_to(data_root)
            or data_root.is_relative_to(output_root)
            or manifest_csv.is_relative_to(output_root)
            or config_file.is_relative_to(output_root)):
        raise BatchError("Choose a NEW output directory outside all source data and configuration")
    raw_config = json.loads(config_file.read_text(encoding="utf-8"))
    if set(raw_config) != {"segmentation"} or not isinstance(raw_config["segmentation"], dict):
        raise BatchError("Config must contain exactly one segmentation parameters object")
    cfg = SegmentConfig(**raw_config["segmentation"])
    records = load_manifest(manifest_csv, data_root)
    # Source hashes and IDs are evaluated once before any outputs are produced.
    source_hashes = {row["image_id"]: sha256_file(row["source"]) for row in records}
    output_root.mkdir(parents=True, exist_ok=False)
    outputs = []
    try:
        mask_root = output_root / "masks"
        mask_root.mkdir()
        for n, row in enumerate(records, 1):
            identity = row["image_id"]
            audit = audit_image(row["source"], channel=row["channel"],
                                z=row["z"], time=row["time"],
                                max_uncompressed_bytes=max_mib * 1024 * 1024)
            if audit["source_sha256"] != source_hashes[identity]:
                raise BatchError(f"Source changed between manifest audit and analysis: {identity}")
            if row["exclude_reason"]:
                outputs.append({
                    "image_id": identity, "animal_id": row["animal_id"],
                    "condition": row["condition"], "source_path": row["source_path"],
                    "source_sha256": source_hashes[identity], "candidate_count": None,
                    "included": False, "exclude_reason": row["exclude_reason"],
                    "label_file": None, "candidate_areas_px": [],
                    "technical_field_mean_candidate_area_px": None,
                    "pixel_size_independently_verified": False,
                })
                continue
            with tifffile.TiffFile(row["source"]) as handle:
                series = handle.series[0]
                plane, _ = select_yx_plane(series.asarray(), series.axes,
                                            channel=row["channel"], z=row["z"],
                                            time=row["time"])
            labels, diagnostics = segment(plane, cfg)
            # Stable row order, unguessable source names never used as an output path.
            mask_name = f"field_{n:04d}.tif"
            mask_file = mask_root / mask_name
            tifffile.imwrite(mask_file, labels, photometric="minisblack")
            area = diagnostics["candidate_areas_px"]
            outputs.append({
                "image_id": identity, "animal_id": row["animal_id"],
                "condition": row["condition"], "source_path": row["source_path"],
                "source_sha256": source_hashes[identity],
                "candidate_count": diagnostics["candidate_count"],
                "included": True, "exclude_reason": "",
                "label_file": "masks/" + mask_name,
                "label_sha256": sha256_file(mask_file),
                "candidate_areas_px": area,
                "technical_field_mean_candidate_area_px": float(np.mean(area)) if area else None,
                "pixel_size_independently_verified": False,
                "segmentation_diagnostics": diagnostics,
                "image_audit": audit,
            })
        # A05 input: one field measurement per image, no independent cell counts.
        with (output_root / "a05_measurements.csv").open("w", newline="", encoding="utf-8") as fh:
            writer = csv.DictWriter(fh, fieldnames=[
                "animal_id", "condition", "field_id", "signal", "exclusion_reason",
            ])
            writer.writeheader()
            for row in outputs:
                writer.writerow({
                    "animal_id": row["animal_id"], "condition": row["condition"],
                    "field_id": row["image_id"],
                    "signal": row["candidate_count"] if row["included"] else "",
                    "exclusion_reason": row["exclude_reason"],
                })
        report = {
            "schema_version": "bps.advanced.batch-analysis.v1",
            "source_root_file_count": len(outputs),
            "included_fields": sum(bool(row["included"]) for row in outputs),
            "excluded_fields": sum(not row["included"] for row in outputs),
            "manifest_sha256": sha256_file(manifest_csv),
            "segmentation_config_sha256": sha256_file(config_file),
            "segmentation_parameters": asdict(cfg),
            "python_version": platform.python_version(),
            "package_versions": {x: metadata.version(x) for x in
                                 ("numpy", "tifffile", "scikit-image")},
            "biological_unit": "animal_id, NOT field_id or segmented-object label",
            "warning": "These are candidate objects, not validated nuclei/exophers. Physical scale is independently unverified.",
            "images": outputs,
        }
        (output_root / "batch_report.json").write_text(
            json.dumps(report, ensure_ascii=False, indent=2, allow_nan=False) + "\n",
            encoding="utf-8"
        )
        return report
    except Exception:
        (output_root / "INCOMPLETE.txt").write_text(
            "Run failed. Ignore all partial outputs; create a fresh output directory.\n",
            encoding="utf-8"
        )
        raise


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--data-root", type=Path, required=True)
    p.add_argument("--manifest", type=Path, required=True)
    p.add_argument("--config", type=Path, required=True)
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--max-mib", type=int, default=256)
    args = p.parse_args(argv)
    try:
        data = batch_run(data_root=args.data_root, manifest_csv=args.manifest,
                         config_file=args.config, output_root=args.out,
                         max_mib=args.max_mib)
        print(f"A06: processed {data['included_fields']} images; "
              f"{data['excluded_fields']} excluded by declared QC")
        return 0
    except (ValueError, OSError, AuditError, tifffile.TiffFileError) as exc:
        print(f"A06 failed closed: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
