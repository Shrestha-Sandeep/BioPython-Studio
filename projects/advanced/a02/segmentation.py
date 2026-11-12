"""Classical *candidate* object segmentation for A02, not a cell-identity model.

No display normalization, hard-coded pixel size, biological replicates or magic
"accuracy" claims. Caller supplies a 2-D scientific array. All parameters are
explicit so training/holdout use the exact same algorithm.
"""
from __future__ import annotations

from dataclasses import asdict, dataclass

import numpy as np
from scipy import ndimage as ndi
from skimage import feature, filters, measure, morphology, segmentation


@dataclass(frozen=True)
class SegmentConfig:
    method: str = "otsu"                 # "otsu", "local", "manual"
    manual_threshold: float | None = None
    local_block_size: int = 31          # odd, >=3; only for "local"
    gaussian_sigma: float = 1.0
    min_area: int = 20
    opening_radius: int = 0
    closing_radius: int = 1
    foreground: str = "bright"         # "bright" or "dark"
    separate_touching: bool = False
    peak_min_distance: int = 5
    clear_border: bool = False


def _validated_config(config: SegmentConfig, shape: tuple[int, int]) -> None:
    if config.method not in ("otsu", "local", "manual"):
        raise ValueError("method must be otsu, local or manual")
    if config.foreground not in ("bright", "dark"):
        raise ValueError("foreground must be bright or dark")
    if config.method == "manual" and (
        config.manual_threshold is None
        or not np.isfinite(config.manual_threshold)
    ):
        raise ValueError("manual method requires a finite manual_threshold")
    if config.gaussian_sigma < 0 or not np.isfinite(config.gaussian_sigma):
        raise ValueError("gaussian_sigma must be nonnegative and finite")
    if config.min_area < 1 or config.peak_min_distance < 1:
        raise ValueError("min_area and peak_min_distance must be >=1")
    if min(config.opening_radius, config.closing_radius) < 0:
        raise ValueError("morphology radii must be nonnegative")
    if config.local_block_size < 3 or config.local_block_size % 2 == 0:
        raise ValueError("local_block_size must be odd and >=3")
    if config.method == "local" and min(shape) < config.local_block_size:
        raise ValueError("local_block_size exceeds shortest image dimension")


def segment(image: np.ndarray, config: SegmentConfig = SegmentConfig()
            ) -> tuple[np.ndarray, dict]:
    """Return 2-D uint32 instance labels plus provenance-safe diagnostics.

    Connected regions may be touching/split, and labels are *candidates* only.
    Nonfinite pixels are excluded, not implicitly treated as biological zero.
    """
    arr = np.asarray(image)
    if arr.ndim != 2 or arr.size == 0 or arr.dtype.kind not in "uif":
        raise ValueError("Expected a nonempty numeric 2-D image")
    _validated_config(config, arr.shape)
    finite = np.isfinite(arr)
    if not np.any(finite):
        raise ValueError("Image has no finite pixels")
    values = arr.astype(np.float64, copy=True)
    fill = float(np.median(values[finite]))
    values[~finite] = fill
    # Invert only the polarity comparison, not the original intensity units.
    if config.gaussian_sigma:
        smooth = filters.gaussian(values, sigma=config.gaussian_sigma,
                                  preserve_range=True)
    else:
        smooth = values

    constant = bool(np.ptp(smooth[finite]) <= 0)
    if constant and config.method != "manual":
        mask = np.zeros(arr.shape, dtype=bool)
        threshold = None
    elif config.method == "local":
        threshold = filters.threshold_local(smooth, block_size=config.local_block_size)
        mask = smooth > threshold if config.foreground == "bright" else smooth < threshold
    else:
        threshold = (float(config.manual_threshold) if config.method == "manual"
                     else float(filters.threshold_otsu(smooth[finite])))
        mask = smooth > threshold if config.foreground == "bright" else smooth < threshold
    mask &= finite
    if config.opening_radius:
        mask = morphology.binary_opening(mask, morphology.disk(config.opening_radius))
    if config.closing_radius:
        mask = morphology.binary_closing(mask, morphology.disk(config.closing_radius))
    # Restore nonfinite exclusions *after* morphology as well.
    mask &= finite
    mask = morphology.remove_small_objects(mask, min_size=config.min_area)

    if not np.any(mask):
        labels = np.zeros(arr.shape, dtype=np.uint32)
    elif config.separate_touching:
        distance = ndi.distance_transform_edt(mask)
        coordinates = feature.peak_local_max(
            distance, min_distance=config.peak_min_distance,
            labels=mask.astype(np.uint8), exclude_border=False
        )
        markers = np.zeros(mask.shape, dtype=np.int32)
        for index, (y, x) in enumerate(coordinates, 1):
            markers[y, x] = index
        if not coordinates.size:
            markers, _ = ndi.label(mask)
        labels = segmentation.watershed(-distance, markers, mask=mask)
        labels = morphology.remove_small_objects(labels, min_size=config.min_area)
    else:
        labels = measure.label(mask, connectivity=1)
    if config.clear_border:
        labels = segmentation.clear_border(labels)
    labels, _, _ = segmentation.relabel_sequential(labels)
    labels = labels.astype(np.uint32, copy=False)
    regions = measure.regionprops(labels)
    diagnostics = {
        "schema_version": "bps.advanced.segmentation.v1",
        "parameters": asdict(config),
        "input_shape_yx": list(arr.shape),
        "input_dtype": str(arr.dtype),
        "nonfinite_pixels": int((~finite).sum()),
        "threshold": None if threshold is None else (
            {"kind": "local_map", "minimum": float(np.min(threshold)),
             "maximum": float(np.max(threshold))}
            if isinstance(threshold, np.ndarray) else float(threshold)
        ),
        "constant_image": constant,
        "candidate_count": len(regions),
        "candidate_areas_px": [int(region.area) for region in regions],
        "foreground_fraction": float(np.count_nonzero(labels) / arr.size),
        "biological_identity_verified": False,
    }
    return labels, diagnostics


def region_table(labels: np.ndarray) -> list[dict]:
    """Pixel-space region geometry; no inferred physical units."""
    out = []
    for region in measure.regionprops(np.asarray(labels)):
        out.append({
            "label": int(region.label), "area_px": int(region.area),
            "centroid_y": float(region.centroid[0]),
            "centroid_x": float(region.centroid[1]),
            "min_row": int(region.bbox[0]), "min_col": int(region.bbox[1]),
            "max_row_exclusive": int(region.bbox[2]),
            "max_col_exclusive": int(region.bbox[3]),
        })
    return out
