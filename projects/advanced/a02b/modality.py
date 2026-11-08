"""A02b — transparent, frozen, input-only image-foreground polarity routing.

The rule uses image intensities and dtype, never segmentation labels.
It is a deliberately interpretable heuristic: NOT a learned modality classifier.
No claim that a simple threshold truly identifies brightfield or fluorescence.
"""
from __future__ import annotations

from dataclasses import replace

import numpy as np

from projects.advanced.a02.segmentation import SegmentConfig, segment


ROUTER_VERSION = "a02b.intensity-polarity.1"
BRIGHT_BG_FRACTION_OF_DTYPE = 0.55


def inspect_intensity(image: np.ndarray) -> tuple[np.ndarray, dict]:
    """Preserve scalar native pixels or convert explicit RGB to grayscale.

    RGB luminance is a *derived* signal and is not calibrated fluorescence.
    Integer image backgrounds are compared to the representable maximum, not
    to an image-normalized percentile (which confuses bright fluorescence).
    """
    raw = np.asarray(image)
    if raw.ndim == 3 and raw.shape[-1] in (3, 4):
        if raw.dtype.kind not in "uif":
            raise ValueError("RGB image must be numerical")
        image2d = (0.2126 * raw[..., 0].astype(np.float64)
                   + 0.7152 * raw[..., 1].astype(np.float64)
                   + 0.0722 * raw[..., 2].astype(np.float64))
        source = "computed_RGB_luminance_not_quantitative_channel"
        d = raw.dtype
    elif raw.ndim == 2:
        if raw.dtype.kind not in "uif":
            raise ValueError("Image must be numerical")
        image2d = raw
        source = "native_single_channel"
        d = raw.dtype
    else:
        raise ValueError("Expected YX scalar or YXC RGB/RGBA image; no inferred T/Z")
    if not image2d.size:
        raise ValueError("Cannot route an empty image")
    finite = np.isfinite(image2d)
    if not finite.any():
        raise ValueError("Cannot route an image without finite pixels")
    arr = np.asarray(image2d, dtype=np.float64)
    border = np.concatenate([arr[0, :], arr[-1, :], arr[1:-1, 0], arr[1:-1, -1]])
    border = border[np.isfinite(border)]
    if not border.size:
        border = arr[finite]
    border_median = float(np.median(border))
    if d.kind == "u":
        expected_peak = float(np.iinfo(d).max)
        rule = "border_median >= 0.55 * unsigned_dtype_max"
    elif d.kind == "i":
        # Signed counts need an explicit rule; do not silently assume unsigned.
        raise ValueError("Signed integer intensities have ambiguous display range; supply unsigned/float")
    else:
        # Floating point data might be raw or normalized. Keep the decision
        # deterministic, but warn that the convention must be checked.
        expected_peak = 1.0 if float(np.quantile(arr[finite], .999)) <= 1.0 else float(np.quantile(arr[finite], .999))
        rule = "border_median >= 0.55 * float_reference_level_unverified"
    background_bright = bool(border_median >= BRIGHT_BG_FRACTION_OF_DTYPE * expected_peak)
    return image2d, {
        "router_version": ROUTER_VERSION,
        "input_shape": list(raw.shape), "input_dtype": str(raw.dtype),
        "pixel_source": source,
        "border_median": border_median,
        "reference_intensity": expected_peak,
        "rule": rule,
        "inferred_foreground_polarity": "dark" if background_bright else "bright",
        "warning": "Intensity polarity is a heuristic, not a reliable modality/stain classifier or validated biological segmentation.",
    }


def segment_routed(image: np.ndarray, config: SegmentConfig
                   ) -> tuple[np.ndarray, dict]:
    data, route = inspect_intensity(image)
    chosen = replace(config, foreground=route["inferred_foreground_polarity"])
    labels, diagnostics = segment(data, chosen)
    return labels, {"route": route, "segmentation": diagnostics}
