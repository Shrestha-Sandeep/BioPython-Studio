"""A02b/A03: PREDECLARED external 16-bit BBBC039 source benchmark.

Two *fixed* algorithms compared; test annotations are used solely for
evaluation, never selected for tuning. BBBC039 may share some source imagery
with BBBC038, so this is an external dataset evaluation with an overlap
caveat, not a guaranteed new-experiment independent challenge.
"""
from __future__ import annotations

import argparse
import csv
import json
import sys
from dataclasses import asdict
from pathlib import Path

import numpy as np
import tifffile

from projects.advanced.a02.segmentation import SegmentConfig, segment
from projects.advanced.a02b.modality import segment_routed
from projects.advanced.a03.bbbc039 import load_original_pair, official_partitions
from projects.advanced.a03.metrics import evaluate_instances

CONFIG = SegmentConfig(method="otsu", gaussian_sigma=1.0, min_area=20,
                       opening_radius=0, closing_radius=1,
                       foreground="bright", separate_touching=True,
                       peak_min_distance=7, clear_border=False)


def run(root: Path, out: Path, *, split: str = "test") -> dict:
    if split != "test":
        raise ValueError("Only the documented held-out official test split is permitted")
    root, out = root.resolve(), out.resolve()
    if out.is_relative_to(root):
        raise ValueError("Store reports outside the original source dataset root")
    partition = official_partitions(root)
    out.mkdir(parents=True, exist_ok=True)
    rows = []
    for n, filename in enumerate(partition["test"], 1):
        image, truth, provenance = load_original_pair(root, filename)
        old_labels, _ = segment(image, CONFIG)
        routed_labels, routed = segment_routed(image, CONFIG)
        old_score = evaluate_instances(truth, old_labels, min_iou=0.5)
        new_score = evaluate_instances(truth, routed_labels, min_iou=0.5)
        rows.append({
            "image_id": Path(filename).stem,
            **provenance,
            "polarity": routed["route"]["inferred_foreground_polarity"],
            "router_rule": routed["route"]["rule"],
            "reference_objects": old_score["objects_truth"],
            "baseline_predicted": old_score["objects_prediction"],
            "routed_predicted": new_score["objects_prediction"],
            "baseline_tp": old_score["true_positives"],
            "baseline_fp": old_score["false_positives"],
            "baseline_fn": old_score["false_negatives"],
            "routed_tp": new_score["true_positives"],
            "routed_fp": new_score["false_positives"],
            "routed_fn": new_score["false_negatives"],
            "baseline_object_f1": old_score["f1"],
            "routed_object_f1": new_score["f1"],
            "baseline_pixel_iou": old_score["foreground_pixel_iou"],
            "routed_pixel_iou": new_score["foreground_pixel_iou"],
            "baseline_count_abs_error": old_score["count_absolute_error"],
            "routed_count_abs_error": new_score["count_absolute_error"],
        })
        print(f"BBBC039 TEST {n:03d}/{len(partition['test'])} "
              f"{filename}: baselineF1={old_score['f1']:.3f}, "
              f"routedF1={new_score['f1']:.3f}", flush=True)
    def collect(prefix: str) -> dict:
        tp = sum(r[f"{prefix}_tp"] for r in rows)
        fp = sum(r[f"{prefix}_fp"] for r in rows)
        fn = sum(r[f"{prefix}_fn"] for r in rows)
        precision = tp / (tp + fp) if tp + fp else 0.
        recall = tp / (tp + fn) if tp + fn else 0.
        micro = 2 * precision * recall / (precision + recall) if precision + recall else 0.
        return {
            "TP": tp, "FP": fp, "FN": fn, "precision_micro": precision,
            "recall_micro": recall, "object_f1_micro": micro,
            "object_f1_image_macro": float(np.mean([r[f"{prefix}_object_f1"] for r in rows])),
            "pixel_iou_image_macro": float(np.mean([r[f"{prefix}_pixel_iou"] for r in rows])),
            "absolute_count_error_image_mean":
                float(np.mean([r[f"{prefix}_count_abs_error"] for r in rows])),
        }
    report = {
        "schema_version": "bps.external.bbbc039.v1",
        "original_source": "https://bbbc.broadinstitute.org/BBBC039",
        "official_test_image_count": len(rows),
        "reference_objects": sum(r["reference_objects"] for r in rows),
        "native_source_dtype": "uint16",
        "prespecified_segmentation": asdict(CONFIG),
        "baseline": collect("baseline"),
        "intensity_polartity_router": collect("routed"),
        "inferred_polarities": {
            "bright": sum(r["polarity"] == "bright" for r in rows),
            "dark": sum(r["polarity"] == "dark" for r in rows),
        },
        "scientific_limits": [
            "This is the official BBBC039 test partition, not biological experiment-disjointness.",
            "BBBC039 overlaps in part with the previously evaluated BBBC038; no verified image-level de-duplication was performed.",
            "Official annotation RGB code 1 interior is labeled; codes 2 and 3 boundary are excluded, not counted as additional cells.",
            "Foreground polarity heuristic uses source intensities only; it was not tuned on BBBC039 labels.",
            "Two fixed methods are BOTH scored, not selected as winners using this test.",
            "A native 16-bit TIFF reader does not demonstrate quantitative intensity calibration.",
            "No exopher detection or new-experiment generalization is established.",
        ],
        "per_image": rows,
    }
    (out / "BBBC039_EXTERNAL_RESULTS.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False, allow_nan=False) + "\n",
        encoding="utf-8")
    with (out / "BBBC039_EXTERNAL_PER_IMAGE.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    with (out / "BBBC039_EXTERNAL_RESULTS.md").open("w", encoding="utf-8") as f:
        f.write("# BBBC039 official test: fixed classical baseline vs predeclared intensity-polarity router\n\n")
        f.write(f"Original source: https://bbbc.broadinstitute.org/BBBC039\n\n")
        f.write(f"Images: {len(rows)} (official test); reference nuclei/interiors: {report['reference_objects']}.\n\n")
        f.write("| Metric | Fixed bright-Otsu+watershed | Automatic intensity-polarity+Otsu+watershed |\n")
        f.write("|---|---:|---:|\n")
        for key in ("object_f1_micro", "object_f1_image_macro",
                    "pixel_iou_image_macro", "absolute_count_error_image_mean"):
            f.write(f"| {key} | {report['baseline'][key]:.4f} | "
                    f"{report['intensity_polartity_router'][key]:.4f} |\n")
        f.write("\n**Interpretation:** Public official test; some possible overlap with earlier BBBC038; "
                "class-code-one nucleus interiors vs predictions; fixed heuristic not a learned image classifier. "
                "These results do not certify general-purpose segmentation.\n")
    print("BEGIN_REAL_BBBC039_SUMMARY")
    print(json.dumps({k: v for k, v in report.items() if k != "per_image"},
                     ensure_ascii=False, sort_keys=True))
    print("END_REAL_BBBC039_SUMMARY")
    return report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    args = parser.parse_args(argv)
    try:
        run(args.root, args.out)
        return 0
    except (ValueError, OSError) as exc:
        parser.exit(2, f"BBBC039 external test refused: {exc}\n")


if __name__ == "__main__":
    raise SystemExit(main())
