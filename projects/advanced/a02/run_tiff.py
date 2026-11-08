"""A02 standalone native TIFF candidate segmentation with source-aware export.

Run with: python -m projects.advanced.a02.run_tiff --help
This script NEVER certifies nuclear/cell/exopher identities.
"""
from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path

import numpy as np
import tifffile

from projects.advanced.a01.image_audit import AuditError, audit_image, select_yx_plane
from projects.advanced.a02.segmentation import SegmentConfig, region_table, segment


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--config", required=True, type=Path, help="Explicit segmentation JSON")
    parser.add_argument("--channel", type=int, default=None)
    parser.add_argument("--z", type=int, default=None)
    parser.add_argument("--time", type=int, default=None)
    parser.add_argument("--max-mib", type=int, default=256)
    args = parser.parse_args(argv)
    try:
        if (args.out.resolve() in (args.input.resolve(), args.input.parent.resolve())
                or args.input.resolve().is_relative_to(args.out.resolve())):
            raise ValueError("Refusing to write candidate outputs over source image/folder")
        config = SegmentConfig(**json.loads(args.config.read_text(encoding="utf-8")))
        audit = audit_image(args.input, channel=args.channel, z=args.z,
                            time=args.time,
                            max_uncompressed_bytes=args.max_mib * 1024 * 1024)
        with tifffile.TiffFile(args.input) as handle:
            series = handle.series[0]
            plane, _ = select_yx_plane(
                series.asarray(), series.axes,
                channel=args.channel, z=args.z, time=args.time
            )
        labels, diagnostics = segment(plane, config)
        args.out.mkdir(parents=True, exist_ok=True)
        tifffile.imwrite(args.out / "candidate_labels.tif", labels,
                         photometric="minisblack")
        measurements = region_table(labels)
        with (args.out / "candidate_regions.csv").open("w", newline="", encoding="utf-8") as stream:
            fields = ["label", "area_px", "centroid_y", "centroid_x",
                      "min_row", "min_col", "max_row_exclusive", "max_col_exclusive"]
            writer = csv.DictWriter(stream, fieldnames=fields)
            writer.writeheader()
            writer.writerows(measurements)
        payload = {
            "source_audit": audit,
            "segmentation_diagnostics": diagnostics,
            "note": "Unverified candidate segmentation, no biological counts or calibrated area.",
            "outputs": ["candidate_labels.tif", "candidate_regions.csv"],
        }
        (args.out / "analysis.json").write_text(
            json.dumps(payload, indent=2, allow_nan=False, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        print(f"Candidate objects: {diagnostics['candidate_count']}")
        print("Wrote source-aware audit, label TIFF and candidate region table.")
        return 0
    except (ValueError, AuditError, OSError, tifffile.TiffFileError) as exc:
        print(f"A02 refused: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
