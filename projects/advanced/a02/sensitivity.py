"""A02 parameter sensitivity: fixed variations on the same source pixels.

No annotation is used here. Mask stability is NOT accuracy or biological validity.
Run: python -m projects.advanced.a02.sensitivity --help
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from dataclasses import asdict
from pathlib import Path

import numpy as np
import tifffile

from projects.advanced.a01.image_audit import AuditError, audit_image, select_yx_plane
from projects.advanced.a02.segmentation import SegmentConfig, segment


def compare_variants(image: np.ndarray, variants: list[tuple[str, SegmentConfig]]) -> list[dict]:
    if len(variants) < 2:
        raise ValueError("At least two different parameter variants are required")
    names = [name for name, _ in variants]
    if len(set(names)) != len(names):
        raise ValueError("Variant names must be unique")
    first, _ = segment(image, variants[0][1])
    original_mask = first > 0
    rows = []
    for name, config in variants:
        labels, diag = segment(image, config)
        mask = labels > 0
        union = int(np.count_nonzero(original_mask | mask))
        intersection = int(np.count_nonzero(original_mask & mask))
        rows.append({
            "variant": name, "candidate_count": int(diag["candidate_count"]),
            "foreground_fraction": float(diag["foreground_fraction"]),
            "foreground_iou_to_first": float(intersection / union if union else 1.0),
            "changed_pixel_fraction_to_first": float(np.mean(original_mask != mask)),
            "parameters": asdict(config),
            "labels": labels,
        })
    return rows


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--variant", required=True, action="append",
                        help="NAME=path/to/config.json; repeat >=2 times")
    parser.add_argument("--channel", type=int)
    parser.add_argument("--z", type=int)
    parser.add_argument("--time", type=int)
    parser.add_argument("--max-mib", type=int, default=256)
    args = parser.parse_args(argv)
    try:
        if len(args.variant) < 2:
            raise ValueError("Provide at least two --variant NAME=config.json options")
        if (args.out.resolve() in (args.input.resolve(), args.input.parent.resolve())
                or args.input.resolve().is_relative_to(args.out.resolve())):
            raise ValueError("Refusing to overwrite source TIFF with candidate outputs")
        variants = []
        for v in args.variant:
            if "=" not in v:
                raise ValueError("Expected --variant NAME=config.json")
            name, path = v.split("=", 1)
            if not re.fullmatch(r"[A-Za-z0-9_-]{1,40}", name):
                raise ValueError("Variant names must be 1-40 safe characters")
            config = SegmentConfig(**json.loads(Path(path).read_text(encoding="utf-8")))
            variants.append((name, config))
        audit = audit_image(args.input, channel=args.channel, z=args.z,
                            time=args.time, max_uncompressed_bytes=args.max_mib * 1024 * 1024)
        with tifffile.TiffFile(args.input) as handle:
            series = handle.series[0]
            plane, _ = select_yx_plane(series.asarray(), series.axes,
                                      channel=args.channel, z=args.z, time=args.time)
        rows = compare_variants(plane, variants)
        args.out.mkdir(parents=True, exist_ok=True)
        payload = []
        for row in rows:
            filename = row["variant"] + "_candidate_labels.tif"
            tifffile.imwrite(args.out / filename, row.pop("labels"),
                             photometric="minisblack")
            row["label_file"] = filename
            payload.append(row)
        fields = ["variant", "candidate_count", "foreground_fraction",
                  "foreground_iou_to_first", "changed_pixel_fraction_to_first"]
        with (args.out / "sensitivity.csv").open("w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(payload)
        (args.out / "sensitivity.json").write_text(json.dumps({
            "source_audit": audit, "variants": payload,
            "interpretation": "Parameter sensitivity, not segmentation accuracy or biological truth.",
        }, indent=2, ensure_ascii=False, allow_nan=False) + "\n", encoding="utf-8")
        print(f"Compared {len(rows)} configurations without reference annotations.")
        return 0
    except (ValueError, AuditError, OSError, tifffile.TiffFileError) as exc:
        print(f"A02 sensitivity refused: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
