"""A03 annotation disagreement diagnostic (NOT infallible ground truth).

Compare two independent same-image annotation maps without assuming one
annotator is correct. Inspect split/merge/ambiguous objects before agreeing on
a reference standard. Requires equal raw pixel coordinates and no resizing.
"""
from __future__ import annotations

import numpy as np

from projects.advanced.a03.metrics import evaluate_instances


def annotator_agreement(first: np.ndarray, second: np.ndarray,
                        *, min_iou: float = 0.5) -> dict:
    a=np.asarray(first)
    b=np.asarray(second)
    if a.ndim!=2 or b.shape!=a.shape:
        raise ValueError("Annotators need identical native 2D coordinates")
    metric=evaluate_instances(a,b,min_iou=min_iou)
    return {
        "annotation_a_objects":metric["objects_truth"],
        "annotation_b_objects":metric["objects_prediction"],
        "one_to_one_matched":metric["true_positives"],
        "unmatched_a":metric["false_negatives"],
        "unmatched_b":metric["false_positives"],
        "object_f1":metric["f1"],
        "foreground_pixel_dice":metric["foreground_pixel_dice"],
        "foreground_pixel_iou":metric["foreground_pixel_iou"],
        "matches":metric["matches"],
        "annotation_disagreement_present":bool(
            metric["false_negatives"] or metric["false_positives"]
            or metric["foreground_pixel_iou"]<1
        ),
        "review_required":True,
        "warning":"Both annotators are fallible; agreement does not establish biological truth.",
    }
