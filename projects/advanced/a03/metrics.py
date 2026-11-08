"""Object- and pixel-aware instance segmentation evaluation for A03.

Instance matching is one-to-one, thresholded, and maximizes the NUMBER of
qualifying matches before their total IoU. Pixel IoU/Dice are foreground-only
and must never be mistaken for object detection accuracy.
"""
from __future__ import annotations

from collections.abc import Mapping

import numpy as np
from scipy.optimize import linear_sum_assignment


def _labels(source: np.ndarray, name: str) -> np.ndarray:
    arr = np.asarray(source)
    if arr.ndim != 2 or not arr.size:
        raise ValueError(f"{name} must be a nonempty 2-D instance label map")
    if arr.dtype.kind not in "iu" or np.any(arr < 0):
        raise ValueError(f"{name} must contain nonnegative integer instance IDs; 0 is background")
    return arr


def evaluate_instances(truth: np.ndarray, prediction: np.ndarray, *,
                       min_iou: float = 0.5, max_pair_cells: int = 2_000_000) -> dict:
    """Evaluate labels without treating each field as a biological replicate.

    An empty truth + empty prediction returns perfect foreground/object scores;
    the no-object case is explicitly flagged and should not dominate averages.
    """
    t, p = _labels(truth, "truth"), _labels(prediction, "prediction")
    if t.shape != p.shape:
        raise ValueError(f"Shape mismatch: {t.shape} versus {p.shape}; never resize labels silently")
    if not np.isfinite(min_iou) or not 0 < min_iou <= 1:
        raise ValueError("min_iou must be >0 and <=1")

    # Compress arbitrary labels into consecutive internal indices. This avoids
    # allocating arrays indexed by potentially very large original label IDs.
    t_ids, t_idx = np.unique(t, return_inverse=True)
    p_ids, p_idx = np.unique(p, return_inverse=True)
    t_idx = t_idx.reshape(t.shape)
    p_idx = p_idx.reshape(p.shape)
    t_foreground = t > 0
    p_foreground = p > 0
    intersection = int(np.count_nonzero(t_foreground & p_foreground))
    union = int(np.count_nonzero(t_foreground | p_foreground))
    t_count = int(t_foreground.sum())
    p_count = int(p_foreground.sum())
    pixel_iou = intersection / union if union else 1.0
    denom = t_count + p_count
    pixel_dice = 2 * intersection / denom if denom else 1.0

    true_object_ids = [int(v) for v in t_ids if v != 0]
    pred_object_ids = [int(v) for v in p_ids if v != 0]
    nt, npred = len(true_object_ids), len(pred_object_ids)
    if nt * npred > max_pair_cells:
        raise ValueError("Too many objects for dense IoU matching; use a sparse evaluator")
    overlap: np.ndarray = np.zeros((nt, npred), dtype=np.float64)
    if nt and npred:
        # Binary indexed lookup avoids an O(n_objects^2 * n_pixels) loop.
        # Exclude background in either mask; only genuine overlapping pixels.
        t_positions = np.searchsorted(t_ids, t[t_foreground & p_foreground])
        p_positions = np.searchsorted(p_ids, p[t_foreground & p_foreground])
        t_remap = {int(v): i for i, v in enumerate(true_object_ids)}
        p_remap = {int(v): i for i, v in enumerate(pred_object_ids)}
        true_lut = np.full(len(t_ids), -1, dtype=np.int64)
        pred_lut = np.full(len(p_ids), -1, dtype=np.int64)
        for v, i in t_remap.items():
            true_lut[np.searchsorted(t_ids, v)] = i
        for v, i in p_remap.items():
            pred_lut[np.searchsorted(p_ids, v)] = i
        hits = np.bincount(true_lut[t_positions] * npred + pred_lut[p_positions],
                           minlength=nt * npred).reshape(nt, npred)
        t_sizes = np.array([np.count_nonzero(t == v) for v in true_object_ids], dtype=np.float64)
        p_sizes = np.array([np.count_nonzero(p == v) for v in pred_object_ids], dtype=np.float64)
        unions = t_sizes[:, None] + p_sizes[None, :] - hits
        overlap = np.divide(hits, unions, out=np.zeros_like(unions), where=unions > 0)
        valid = (overlap >= min_iou) & (hits > 0)
        # One valid match is more valuable than any aggregate IoU difference:
        # this makes maximum qualifying match count the primary objective.
        priority = float(min(nt, npred) + 1)
        rewards = valid.astype(float) * priority + overlap * valid
        rows, cols = linear_sum_assignment(-rewards)
        matched = [(int(i), int(j)) for i, j in zip(rows, cols) if valid[i, j]]
    else:
        matched = []

    tp = len(matched)
    fp, fn = npred - tp, nt - tp
    obj_precision = tp / (tp + fp) if (tp + fp) else 1.0 if not nt else 0.0
    obj_recall = tp / (tp + fn) if (tp + fn) else 1.0
    obj_f1 = (2 * obj_precision * obj_recall / (obj_precision + obj_recall)
              if obj_precision + obj_recall else 0.0)
    return {
        "schema_version": "bps.advanced.instance-metrics.v1",
        "iou_match_threshold": float(min_iou),
        "objects_truth": nt,
        "objects_prediction": npred,
        "true_positives": tp, "false_positives": fp, "false_negatives": fn,
        "precision": float(obj_precision), "recall": float(obj_recall), "f1": float(obj_f1),
        "mean_matched_iou": float(np.mean([overlap[i, j] for i, j in matched]))
        if matched else None,
        "matches": [
            {"truth_id": true_object_ids[i], "prediction_id": pred_object_ids[j],
             "iou": float(overlap[i, j])} for i, j in matched
        ],
        "count_absolute_error": abs(npred - nt),
        "foreground_pixel_iou": float(pixel_iou),
        "foreground_pixel_dice": float(pixel_dice),
        "no_objects_in_both": not nt and not npred,
        "annotation_is_reference_not_infallible": True,
    }


def aggregate_by_image(results: list[Mapping]) -> dict:
    """Macro means across images (NOT across cells or biological samples)."""
    if not results:
        raise ValueError("At least one evaluated image is required")
    fields = ("f1", "precision", "recall", "foreground_pixel_iou",
              "foreground_pixel_dice", "count_absolute_error")
    return {
        "images_evaluated": len(results),
        "empty_both_images": sum(bool(r["no_objects_in_both"]) for r in results),
        "macro_image_metrics": {
            field: float(np.mean([float(r[field]) for r in results])) for field in fields
        },
        "note": "Image-level aggregation is not a confidence interval and is not animal-level inference.",
    }
