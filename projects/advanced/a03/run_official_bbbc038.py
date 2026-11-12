"""Execute prespecified classical baselines on BBBC038 and official stage1 test.

Calibration: select exactly one of three *predeclared* candidate configurations
based on image-macro F1 from a deterministic subset of original stage1_train.
Freeze parameters AND manifest before evaluating published stage1_test images.
The publicly released test masks are not a secret/blind test and no
experiment-disjoint generalization is implied.
"""
from __future__ import annotations

import argparse
import csv
import json
import math
from dataclasses import asdict
from pathlib import Path

import numpy as np

from projects.advanced.a02.segmentation import SegmentConfig
from projects.advanced.a03.benchmark import digest_json, evaluate_split, main as benchmark_main
from projects.advanced.a03.dataset import read_manifest, sha256_file


CONFIGS = {
    "otsu": SegmentConfig(method="otsu", gaussian_sigma=1.0, min_area=20,
                          opening_radius=0, closing_radius=1, foreground="bright"),
    "adaptive": SegmentConfig(method="local", local_block_size=31, gaussian_sigma=1.0,
                              min_area=20, opening_radius=1, closing_radius=1,
                              foreground="bright"),
    "watershed": SegmentConfig(method="otsu", gaussian_sigma=1.0, min_area=20,
                               opening_radius=0, closing_radius=1, foreground="bright",
                               separate_touching=True, peak_min_distance=7),
}


def _mean(values: list[float]) -> float:
    return float(np.mean(values)) if values else 0.0


def _quantile(values: list[float], q: float) -> float:
    return float(np.quantile(values, q)) if values else 0.0


def report_metrics(data: dict, provenance: dict, calibration_choices: list[dict],
                   chosen: str) -> dict:
    image_results = data["image_results"]
    rows = []
    for item in image_results:
        m = item["instance_metrics"]
        rows.append({
            "image_id": item["sample_id"],
            "source_sha256": item["image_sha256"],
            "objects_reference": m["objects_truth"],
            "objects_predicted": m["objects_prediction"],
            "true_positives": m["true_positives"],
            "false_positives": m["false_positives"],
            "false_negatives": m["false_negatives"],
            "object_precision": m["precision"],
            "object_recall": m["recall"],
            "object_f1": m["f1"],
            "pixel_iou": m["foreground_pixel_iou"],
            "pixel_dice": m["foreground_pixel_dice"],
            "absolute_count_error": m["count_absolute_error"],
            "no_objects_in_both": m["no_objects_in_both"],
        })
    totals = {
        "n_images": len(rows),
        "reference_objects": sum(r["objects_reference"] for r in rows),
        "predicted_objects": sum(r["objects_predicted"] for r in rows),
        "TP": sum(r["true_positives"] for r in rows),
        "FP": sum(r["false_positives"] for r in rows),
        "FN": sum(r["false_negatives"] for r in rows),
    }
    precision = totals["TP"] / max(1, totals["TP"] + totals["FP"])
    recall = totals["TP"] / max(1, totals["TP"] + totals["FN"])
    micro_f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
    sorted_errors = sorted(rows, key=lambda x: (x["object_f1"], -x["absolute_count_error"]))
    metrics = {
        "schema_version": "bps.advanced.real-bbbc038-results.v1",
        "benchmark": "BBBC038v1 / official stage1_test versus original published stage1_solution.csv masks",
        "metric": "one-to-one instance F1 at IoU >= 0.5 (NOT Kaggle official mAP)",
        "calibration_description": "Deterministic 40-image original stage1_train subset, 3 prespecified parameterizations",
        "best_config": chosen,
        "calibration_candidates": calibration_choices,
        "official_test_set": totals,
        "official_test_object_micro_precision": float(precision),
        "official_test_object_micro_recall": float(recall),
        "official_test_object_micro_f1": float(micro_f1),
        "official_test_object_macro_image_f1": _mean([r["object_f1"] for r in rows]),
        "official_test_median_image_f1": _quantile([r["object_f1"] for r in rows], 0.5),
        "official_test_first_quartile_image_f1": _quantile([r["object_f1"] for r in rows], 0.25),
        "official_test_third_quartile_image_f1": _quantile([r["object_f1"] for r in rows], 0.75),
        "official_test_macro_pixel_iou": _mean([r["pixel_iou"] for r in rows]),
        "official_test_mean_abs_count_error": _mean([r["absolute_count_error"] for r in rows]),
        "images_with_no_predicted_objects": sum(r["objects_predicted"] == 0 for r in rows),
        "images_with_no_iou_matched_objects": sum(r["true_positives"] == 0 for r in rows),
        "lowest_object_f1_images": sorted_errors[:8],
        "source_provenance": provenance,
        "scientific_limits": [
            "A publicly annotated official test set is not a blind prospective test.",
            "Split is official stage1 train vs stage1 test, not proven independent experiments.",
            "RGB images use the red channel; a single global baseline is expected to fail across modalities.",
            "Target masks are expert manual annotations, not error-free ground truth.",
            "No score is a validated cell/exopher model or evidence of generalization to user's microscope.",
            "Kaggle 2018 competition average precision uses several IoU thresholds, not this object F1 at 0.5.",
        ],
        "per_image": rows,
    }
    return metrics


def write_summary(metrics: dict, out: Path) -> None:
    results = metrics["official_test_set"]
    text = [
        "# BioPython Studio — BBBC038 real annotated test results",
        "",
        "Dataset: Broad BBBC038v1 (2018 Data Science Bowl). Official stage1 training annotations for calibration,",
        "published stage1 test set + stage1_solution.csv for final evaluation. Source: https://bbbc.broadinstitute.org/BBBC038",
        "",
        f"**Best predeclared baseline:** {metrics['best_config']}",
        f"**Images in official stage1 test:** {results['n_images']}",
        f"**Reference annotated nuclei:** {results['reference_objects']}",
        f"**Candidate objects predicted:** {results['predicted_objects']}",
        f"**IoU>=0.5 one-to-one matches:** TP={results['TP']}, FP={results['FP']}, FN={results['FN']}",
        f"**Object micro F1:** {metrics['official_test_object_micro_f1']:.4f}",
        f"**Image-macro object F1:** {metrics['official_test_object_macro_image_f1']:.4f}",
        f"**Median image object F1:** {metrics['official_test_median_image_f1']:.4f}",
        f"**Mean foreground pixel IoU (image macro):** {metrics['official_test_macro_pixel_iou']:.4f}",
        f"**Mean absolute object count error/image:** {metrics['official_test_mean_abs_count_error']:.2f}",
        f"**Images with no candidate objects:** {metrics['images_with_no_predicted_objects']}",
        "",
        "## Prespecified model selection (calibration only)",
        "",
        "| Method | Calibration image-macro object F1 | Calibration mean absolute count error |",
        "|---|---:|---:|",
    ]
    for row in metrics["calibration_candidates"]:
        text.append(
            f"| {row['name']} | {row['macro_image_object_f1']:.4f} | "
            f"{row['mean_abs_count_error']:.2f} |"
        )
    text += [
        "",
        "## Failures and interpretation",
        "",
        "The output contains per-image TP/FP/FN, object F1, count error and pixel IoU, plus diagnostic overlays.",
        "Inspect the worst-scoring cases before drawing any conclusions. A bad result is informative about",
        "the limitations of a globally configured classical pipeline on heterogeneous imagery.",
        "",
        "A green software test does not establish accurate nuclei detection. The publicly released official",
        "stage1 test set cannot establish prospective performance; the selected image-level",
        "test split also cannot establish disjoint biological experiments.",
        "All source images/annotations stay outside Git. No held-out test thresholds were retuned.",
        "",
        "This benchmark uses **object F1 at IoU 0.5**, not the original Kaggle scoring metric.",
        "",
    ]
    out.write_text("\n".join(text), encoding="utf-8")


def run(*, data_root: Path, manifest: Path, output_root: Path, channel: int = 0) -> dict:
    rows = read_manifest(manifest, data_root)
    calibration = [r for r in rows if r["split"] == "calibration"]
    holdout = [r for r in rows if r["split"] == "holdout"]
    if len(calibration) < 5 or len(holdout) < 5:
        raise ValueError("Require >=5 calibration and >=5 official test images")
    output_root = output_root.resolve()
    if output_root.is_relative_to(data_root.resolve()):
        raise ValueError("Evaluation outputs must be outside original data directory")
    output_root.mkdir(parents=True, exist_ok=True)

    choices = []
    for name, config in CONFIGS.items():
        report = evaluate_split(
            root=data_root, manifest=manifest, cfg=config,
            split="calibration", out=output_root / "calibration_candidates" / name,
            channel=channel,
        )
        m = report["image_macro"]["macro_image_metrics"]
        choice = {
            "name": name,
            "config": asdict(config),
            "config_sha256": digest_json(asdict(config)),
            "macro_image_object_f1": m["f1"],
            "mean_abs_count_error": m["count_absolute_error"],
        }
        choices.append(choice)
        print(
            f"CALIBRATION_ONLY {name}: image-macro F1={m['f1']:.4f}; "
            f"mean abs count error={m['count_absolute_error']:.2f}", flush=True
        )
    # Prespecified selection objective, no holdout data consulted here.
    selected = sorted(
        choices, key=lambda m: (-m["macro_image_object_f1"],
                                m["mean_abs_count_error"], m["name"])
    )[0]
    name = selected["name"]
    frozen_config = output_root / "selected_config.json"
    frozen_config.write_text(json.dumps(selected["config"], indent=2) + "\n",
                             encoding="utf-8")
    selection = {
        "source_manifest_sha256": sha256_file(manifest),
        "selection_rule": "max image-macro object F1, tie min mean abs count error, then name",
        "used_holdout_for_selection": False,
        "selected_name": name,
        "candidates": choices,
    }
    (output_root / "calibration_selection.json").write_text(
        json.dumps(selection, indent=2) + "\n", encoding="utf-8"
    )
    lock = output_root / "frozen_parameters.json"
    if benchmark_main([
        "--phase", "calibration",
        "--root", str(data_root), "--manifest", str(manifest),
        "--out", str(output_root / "final_calibration"),
        "--config", str(frozen_config), "--lock", str(lock),
        "--channel", str(channel), "--min-iou", "0.5",
    ]) != 0:
        raise RuntimeError("Failed to establish calibration lock")
    print(f"FROZEN_PARAMETERS sha256={sha256_file(lock)}; now testing official partition.", flush=True)
    if benchmark_main([
        "--phase", "holdout",
        "--root", str(data_root), "--manifest", str(manifest),
        "--out", str(output_root / "official_test"),
        "--lock", str(lock),
        "--channel", str(channel), "--min-iou", "0.5",
    ]) != 0:
        raise RuntimeError("Official test evaluation failed")
    holdout_report = json.loads(
        (output_root / "official_test" / "benchmark_report.json").read_text(encoding="utf-8")
    )
    provenance = json.loads((manifest.parent / "bbbc038_provenance.json").read_text(encoding="utf-8"))
    metrics = report_metrics(holdout_report, provenance, choices, name)
    (output_root / "REAL_BBBC038_RESULTS.json").write_text(
        json.dumps(metrics, indent=2, ensure_ascii=False, allow_nan=False) + "\n", encoding="utf-8"
    )
    write_summary(metrics, output_root / "REAL_BBBC038_RESULTS.md")
    all_rows = metrics["per_image"]
    with (output_root / "official_test_per_image.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(all_rows[0]))
        writer.writeheader()
        writer.writerows(all_rows)
    print("BEGIN_REAL_BBBC038_SUMMARY")
    print(json.dumps(
        {key: value for key, value in metrics.items()
         if key != "per_image" and key != "source_provenance" and key != "lowest_object_f1_images"},
        sort_keys=True
    ), flush=True)
    print("END_REAL_BBBC038_SUMMARY", flush=True)
    return metrics


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data-root", required=True, type=Path)
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--output-root", required=True, type=Path)
    parser.add_argument("--channel", type=int, default=0)
    args = parser.parse_args(argv)
    try:
        run(data_root=args.data_root, manifest=args.manifest,
            output_root=args.output_root, channel=args.channel)
        return 0
    except (OSError, ValueError, RuntimeError) as exc:
        parser.exit(2, f"BBBC038 benchmark failed: {exc}\n")


if __name__ == "__main__":
    raise SystemExit(main())
