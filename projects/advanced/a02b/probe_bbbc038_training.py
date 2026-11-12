"""Training-only BBBC038 diagnostic for the newly proposed polarity router.

A deliberately retrospective method-development exercise:
- image IDs selected using predeclared deterministic SHA sorting,
- reads ONLY stage1_train native PNGs and target masks,
- compares fixed red bright-Otsu/watershed to fixed input-only polarity routing,
- NEVER evaluates the already-inspected official stage1_test.
These scores are exploratory training scores, NOT independent model evidence.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

from projects.advanced.a02.segmentation import SegmentConfig, segment
from projects.advanced.a02b.modality import segment_routed
from projects.advanced.a03.dataset import load_instance_annotations, sha256_file
from projects.advanced.a03.metrics import evaluate_instances

RULE_SEED = "biopython-advancement-bbbc038-official-v1"
CONFIG = SegmentConfig(method="otsu", gaussian_sigma=1.0, min_area=20,
                       opening_radius=0, closing_radius=1, foreground="bright",
                       separate_touching=True, peak_min_distance=7)


def run(train: Path, out: Path, *, count: int = 40) -> dict:
    train, out = train.resolve(), out.resolve()
    if out.is_relative_to(train):
        raise ValueError("Output must not be inside the original training archive")
    images = {
        p.parent.parent.name: p for p in sorted(train.rglob("images/*.png"))
        if "__MACOSX" not in p.parts
    }
    if len(images) < count or count < 5:
        raise ValueError("Training source insufficient for requested deterministic subset")
    ids = sorted(
        images, key=lambda i: hashlib.sha256((RULE_SEED + ":" + i).encode()).hexdigest()
    )[:count]
    rows = []
    for image_id in ids:
        path = images[image_id]
        with Image.open(path) as src:
            raw = np.asarray(src)
        if raw.ndim == 3 and raw.shape[2] in (3, 4):
            baseline_pixels = raw[..., 0]
        elif raw.ndim == 2:
            baseline_pixels = raw
        else:
            raise ValueError(f"Unsupported BBBC038 source PNG dimensions {raw.shape}")
        truth = load_instance_annotations(path.parent.parent / "masks", raw.shape[:2])
        fixed, _ = segment(baseline_pixels, CONFIG)
        routed, meta = segment_routed(raw, CONFIG)
        a = evaluate_instances(truth, fixed)
        b = evaluate_instances(truth, routed)
        rows.append({
            "image_id": image_id,
            "source_sha256": sha256_file(path),
            "router_polarity": meta["route"]["inferred_foreground_polarity"],
            "router_pixel_source": meta["route"]["pixel_source"],
            "reference_nuclei": a["objects_truth"],
            "baseline_objects": a["objects_prediction"],
            "routed_objects": b["objects_prediction"],
            "baseline_object_f1": a["f1"],
            "routed_object_f1": b["f1"],
            "baseline_pixel_iou": a["foreground_pixel_iou"],
            "routed_pixel_iou": b["foreground_pixel_iou"],
            "baseline_abs_count_error": a["count_absolute_error"],
            "routed_abs_count_error": b["count_absolute_error"],
        })
    report = {
        "schema_version": "bps.advanced.training-polarity-diagnostic.v1",
        "source": "https://bbbc.broadinstitute.org/BBBC038",
        "evaluation_status": "RETROSPECTIVE_TRAINING_ONLY_NOT_HELDOUT",
        "images_used": count,
        "selection": "SHA256(seed:ImageId), from original stage1_train ONLY",
        "seed": RULE_SEED,
        "method_development_after_earlier_test_failure": True,
        "baseline_macro_image_object_f1": float(np.mean([r["baseline_object_f1"] for r in rows])),
        "routed_macro_image_object_f1": float(np.mean([r["routed_object_f1"] for r in rows])),
        "baseline_mean_abs_count_error": float(np.mean([r["baseline_abs_count_error"] for r in rows])),
        "routed_mean_abs_count_error": float(np.mean([r["routed_abs_count_error"] for r in rows])),
        "routed_dark_images": sum(r["router_polarity"] == "dark" for r in rows),
        "routed_bright_images": sum(r["router_polarity"] == "bright" for r in rows),
        "no_claim_of_generalization": True,
        "per_image": rows,
    }
    out.mkdir(parents=True, exist_ok=True)
    (out / "BBBC038_TRAINING_ROUTER_DIAGNOSTIC.json").write_text(
        json.dumps(report, indent=2, allow_nan=False) + "\n", encoding="utf-8")
    with (out / "BBBC038_TRAINING_PER_IMAGE.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    print("BEGIN_BBBC038_TRAINING_ROUTER_DIAGNOSTIC")
    print(json.dumps({k: v for k, v in report.items() if k != "per_image"}))
    print("END_BBBC038_TRAINING_ROUTER_DIAGNOSTIC")
    return report


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--train", type=Path, required=True)
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--count", type=int, default=40)
    args = p.parse_args(argv)
    try:
        run(args.train, args.out, count=args.count)
        return 0
    except (OSError, ValueError) as exc:
        p.exit(2, f"Training-only diagnostic failed: {exc}\n")


if __name__ == "__main__":
    raise SystemExit(main())
