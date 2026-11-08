"""A02/A03 BBBC038-style local benchmark with *locked* held-out evaluation.

Run with: python -m projects.advanced.a03.benchmark --help
Does not download data, optimize on the holdout, or certify biological validity.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from dataclasses import asdict
from pathlib import Path

import numpy as np
import tifffile
from PIL import Image
from skimage.segmentation import find_boundaries

from projects.advanced.a02.segmentation import SegmentConfig, region_table, segment
from projects.advanced.a03.dataset import DatasetError, load_instance_annotations, load_sample_image, read_manifest, sha256_file
from projects.advanced.a03.metrics import aggregate_by_image, evaluate_instances

LOCK_SCHEMA = "bps.advanced.benchmark-lock.v1"


def canonical_json(obj: object) -> str:
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), allow_nan=False)


def digest_json(obj: object) -> str:
    return hashlib.sha256(canonical_json(obj).encode("utf-8")).hexdigest()


def load_config(path: Path) -> SegmentConfig:
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("Segmentation config must be a JSON object")
    cfg = SegmentConfig(**data)
    # Validating against an actual image happens inside segment().
    return cfg


def _overlay(image: np.ndarray, truth: np.ndarray, predicted: np.ndarray, path: Path) -> None:
    """Only a display overlay: cyan=reference, red=predicted boundaries."""
    vals = image.astype(np.float64)
    finite = np.isfinite(vals)
    if not finite.any():
        raise ValueError("No finite source pixel values")
    low, high = np.percentile(vals[finite], [1, 99])
    if high <= low:
        high = low + 1
    grey = np.clip((np.nan_to_num(vals, nan=low, posinf=high, neginf=low) - low) /
                   (high - low), 0, 1)
    rgb = np.repeat((grey * 255).astype(np.uint8)[..., None], 3, axis=2)
    reference_edges = find_boundaries(truth, mode="outer")
    predicted_edges = find_boundaries(predicted, mode="outer")
    rgb[reference_edges] = [0, 255, 255]
    rgb[predicted_edges] = [255, 70, 70]
    rgb[reference_edges & predicted_edges] = [255, 255, 0]
    Image.fromarray(rgb, mode="RGB").save(path)


def _slug(value: str) -> str:
    prefix = re.sub(r"[^A-Za-z0-9_-]", "_", value)[:55]
    return (prefix or "sample") + "_" + hashlib.sha256(value.encode()).hexdigest()[:8]


def evaluate_split(*, root: Path, manifest: Path, cfg: SegmentConfig, split: str,
                   out: Path, channel: int | None = None, min_iou: float = 0.5) -> dict:
    rows = read_manifest(manifest, root)
    chosen = [r for r in rows if r["split"] == split]
    if not chosen:
        raise DatasetError(f"No {split} images in manifest")
    if out.resolve() == root.resolve():
        raise DatasetError("Never write results directly over the dataset root")
    out.mkdir(parents=True, exist_ok=True)
    image_results = []
    for row in chosen:
        image = load_sample_image(row["image"], channel=channel)
        truth = load_instance_annotations(row["annotation_dir"], image.shape)
        labels, diagnostics = segment(image, cfg)
        metrics = evaluate_instances(truth, labels, min_iou=min_iou)
        name = _slug(row["sample_id"])
        mask_filename = f"{name}_candidate_labels.tif"
        overlay_filename = f"{name}_annotation_comparison.png"
        tifffile.imwrite(out / mask_filename, labels, photometric="minisblack")
        _overlay(image, truth, labels, out / overlay_filename)
        image_results.append({
            "sample_id": row["sample_id"],
            "group_id": row["group_id"], "split": split,
            "image_sha256": sha256_file(row["image"]),
            "annotation_mask_sha256": [
                {"name": f.name, "sha256": sha256_file(f)}
                for f in sorted(row["annotation_dir"].glob("*.png"))
            ],
            "candidate_labels": mask_filename, "overlay": overlay_filename,
            "segmentation_diagnostics": diagnostics,
            "instance_metrics": metrics, "regions": region_table(labels),
        })
    report = {
        "schema_version": "bps.advanced.benchmark.v1",
        "study_split": split,
        "manifest_sha256": sha256_file(manifest),
        "config_sha256": digest_json(asdict(cfg)),
        "source_image_channel": channel,
        "reference_status": "MANUAL_ANNOTATIONS_NOT_INDEPENDENTLY_VERIFIED_BY_APP",
        "no_biological_generalization_claim": True,
        "image_results": image_results,
        "image_macro": aggregate_by_image([r["instance_metrics"] for r in image_results]),
    }
    (out / "benchmark_report.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False, allow_nan=False) + "\n", encoding="utf-8"
    )
    return report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--phase", required=True, choices=("calibration", "holdout"))
    parser.add_argument("--root", required=True, type=Path)
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--config", type=Path, help="For calibration only: explicit JSON parameters")
    parser.add_argument("--lock", required=True, type=Path, help="Frozen configuration lock JSON")
    parser.add_argument("--channel", type=int, default=None,
                        help="Explicit source PNG channel index for RGB/RGBA")
    parser.add_argument("--min-iou", type=float, default=0.5)
    args = parser.parse_args(argv)
    try:
        if args.phase == "calibration":
            if args.config is None:
                raise ValueError("--config is required for calibration")
            cfg = load_config(args.config)
            lock = {
                "schema_version": LOCK_SCHEMA,
                "manifest_sha256": sha256_file(args.manifest),
                "config": asdict(cfg),
                "config_sha256": digest_json(asdict(cfg)),
                "channel": args.channel,
                "min_iou": args.min_iou,
                "note": "Parameter freeze before holdout; user must not inspect or tune on holdout.",
            }
            report = evaluate_split(root=args.root, manifest=args.manifest,
                                    cfg=cfg, split="calibration", out=args.out,
                                    channel=args.channel, min_iou=args.min_iou)
            if args.lock.resolve() == args.manifest.resolve():
                raise ValueError("Refusing to overwrite dataset manifest with lock")
            args.lock.parent.mkdir(parents=True, exist_ok=True)
            args.lock.write_text(json.dumps(lock, indent=2) + "\n", encoding="utf-8")
        else:
            if args.config is not None:
                raise ValueError("Holdout evaluation must use --lock, never a new --config")
            lock = json.loads(args.lock.read_text(encoding="utf-8"))
            if lock.get("schema_version") != LOCK_SCHEMA:
                raise ValueError("Invalid parameter lock")
            if lock.get("manifest_sha256") != sha256_file(args.manifest):
                raise ValueError("Dataset manifest changed since parameter freeze")
            if lock.get("config_sha256") != digest_json(lock.get("config")):
                raise ValueError("Parameter lock has been modified")
            if args.channel != lock["channel"] or args.min_iou != lock["min_iou"]:
                raise ValueError("Channel/IoU threshold differs from frozen calibration settings")
            cfg = SegmentConfig(**lock["config"])
            report = evaluate_split(root=args.root, manifest=args.manifest, cfg=cfg,
                                    split="holdout", out=args.out,
                                    channel=args.channel, min_iou=args.min_iou)
        summary = report["image_macro"]
        print(f"{args.phase}: {summary['images_evaluated']} images evaluated; "
              f"image-macro object F1={summary['macro_image_metrics']['f1']:.3f}")
        print("These are image-reference metrics, not independent biological generalization.")
        return 0
    except (ValueError, DatasetError, OSError, KeyError, TypeError) as exc:
        print(f"Benchmark refused: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
