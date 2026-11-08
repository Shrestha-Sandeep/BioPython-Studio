"""Read ORIGINAL BBBC039 Hoechst TIFF and official colored nucleus masks.

Use only official test.txt for final evaluation; metadata filenames supplied by
Broad are treated as authoritative. No source images are redistributed.
"""
from __future__ import annotations

import csv
import hashlib
from pathlib import Path

import numpy as np
import tifffile
from PIL import Image
from skimage.measure import label

from projects.advanced.a03.dataset import DatasetError, sha256_file


SPLITS = {"training": "training.txt", "validation": "validation.txt", "test": "test.txt"}


def official_partitions(root: Path) -> dict[str, list[str]]:
    """Require disjoint official split IDs and original source completeness."""
    root = Path(root)
    all_groups: set[str] = set()
    out = {}
    for split, name in SPLITS.items():
        path = root / "metadata" / name
        rows = [line.strip() for line in path.read_text(encoding="utf-8-sig").splitlines()
                if line.strip()]
        if not rows:
            raise DatasetError(f"Missing official BBBC039 {split} records")
        if len(rows) != len(set(rows)):
            raise DatasetError(f"Duplicate IDs in BBBC039 {split}")
        if any(not name.lower().endswith(".png") or "/" in name or "\\" in name
               for name in rows):
            raise DatasetError(f"Unexpected source filename in {split}")
        if all_groups.intersection(rows):
            raise DatasetError("The official metadata assigns a source to multiple splits")
        all_groups.update(rows)
        for name in rows:
            image = root / "images" / (Path(name).stem + ".tif")
            mask = root / "masks" / name
            if not image.is_file() or not mask.is_file():
                raise DatasetError(f"Missing source TIFF or original mask for {name}")
        out[split] = rows
    if len(all_groups) != 200:
        raise DatasetError(f"Expected 200 official BBBC039 images, got {len(all_groups)}")
    return out


def colored_mask_to_instances(path: Path) -> tuple[np.ndarray, dict]:
    """Interpret BBBC039 RGB(A) channel zero as label-class code.

    First channel: 0 background, 1 nucleus interior, 2 boundary and 3 other
    segmentation-border category. 1-valued disconnected components constitute
    reference nuclei; 2/3 are *not* counted as separate nuclei. Border pixels
    remain zero (excluded from reference objects, but evaluated as background).
    This differs from a full connected-component labeling of all nonzero codes.
    """
    with Image.open(path) as raw:
        data = np.asarray(raw)
    if data.ndim != 3 or data.shape[2] not in (3, 4):
        raise DatasetError("BBBC039 official mask must be RGB/RGBA class image")
    codes = np.asarray(data[..., 0])
    observed = np.unique(codes)
    if not set(map(int, observed)).issubset({0, 1, 2, 3}):
        raise DatasetError("BBBC039 mask contains unexpected class code")
    # Label nucleus interiors ONLY; thresholding all code values would merge
    # touching objects or incorrectly count boundaries as objects.
    truth = label(codes == 1, connectivity=1).astype(np.uint32)
    return truth, {
        "mask_class_codes": {str(x): int(np.count_nonzero(codes == x)) for x in observed},
        "decoding": "connected components of official class code 1; code 2/3 excluded",
        "official_mask_sha256": sha256_file(path),
        "reference_object_count": int(truth.max()),
    }


def load_original_pair(root: Path, mask_filename: str) -> tuple[np.ndarray, np.ndarray, dict]:
    image_path = root / "images" / (Path(mask_filename).stem + ".tif")
    mask_path = root / "masks" / mask_filename
    with tifffile.TiffFile(image_path) as handle:
        series = handle.series[0]
        if len(handle.series) != 1 or series.axes != "YX":
            raise DatasetError(f"Expected native BBBC039 2D YX source: {series.axes}")
        image = series.asarray()
    if image.ndim != 2 or image.dtype != np.uint16:
        raise DatasetError(f"Expected native 16-bit single-channel fluorescence: {image.dtype}")
    truth, target_info = colored_mask_to_instances(mask_path)
    if image.shape != truth.shape:
        raise DatasetError("Native original TIFF does not match annotation pixels")
    return image, truth, {
        "source_sha256": sha256_file(image_path),
        "source_dtype": str(image.dtype), "source_shape": list(image.shape),
        **target_info,
    }
