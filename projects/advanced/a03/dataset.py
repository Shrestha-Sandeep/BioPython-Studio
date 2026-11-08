"""Conservative local BBBC038-style PNG + per-object PNG annotation adapter.

Only provided/locally downloaded data are read. This loader does not fetch,
redistribute or claim ownership of any biological image or annotation.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image


class DatasetError(ValueError):
    pass


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def _safe_child(root: Path, relative: str) -> Path:
    if not isinstance(relative, str) or not relative:
        raise DatasetError("Dataset paths must be nonempty relative path strings")
    candidate = (root / relative).resolve()
    if not candidate.is_relative_to(root.resolve()) or Path(relative).is_absolute():
        raise DatasetError("Refusing paths outside the dataset root")
    return candidate


def read_manifest(path: Path, root: Path) -> list[dict]:
    """Validate declared study groups and prevent split/identity leakage."""
    manifest = json.loads(Path(path).read_text(encoding="utf-8"))
    if manifest.get("schema_version") != "bps.advanced.dataset.v1":
        raise DatasetError("Unsupported dataset manifest schema")
    records = manifest.get("records")
    if not isinstance(records, list) or not records:
        raise DatasetError("Dataset manifest requires nonempty records")
    ids: set[str] = set()
    images: set[Path] = set()
    groups: dict[str, str] = {}
    has_splits = set()
    valid = []
    for row in records:
        if not isinstance(row, dict):
            raise DatasetError("Each record must be an object")
        identity = row.get("sample_id")
        group = row.get("group_id")
        split = row.get("split")
        if not isinstance(identity, str) or not identity.strip() or identity in ids:
            raise DatasetError("Each sample_id must be unique and nonempty")
        if not isinstance(group, str) or not group.strip():
            raise DatasetError("group_id is mandatory; do not guess biological groups")
        if split not in ("calibration", "holdout"):
            raise DatasetError("split must be calibration or holdout")
        if group in groups and groups[group] != split:
            raise DatasetError(f"Group {group!r} appears in calibration and holdout")
        img = _safe_child(root, row.get("image"))
        mask_dir = _safe_child(root, row.get("annotation_dir"))
        if img in images:
            raise DatasetError("One image appears more than once in the manifest")
        if img.suffix.lower() != ".png":
            raise DatasetError("BBBC038 adapter expects image PNG")
        if not img.is_file() or not mask_dir.is_dir():
            raise DatasetError(f"Missing image or mask folder for {identity}")
        if not any(mask_dir.glob("*.png")):
            raise DatasetError(f"No instance PNG masks for {identity}")
        ids.add(identity)
        images.add(img)
        groups[group] = split
        has_splits.add(split)
        valid.append({
            "sample_id": identity, "group_id": group,
            "split": split, "image": img, "annotation_dir": mask_dir,
        })
    if has_splits != {"calibration", "holdout"}:
        raise DatasetError("Manifest needs both calibration and holdout groups")
    return valid


def load_instance_annotations(folder: Path, shape_yx: tuple[int, int]) -> np.ndarray:
    """Load individual per-object binary mask PNGs; reject pixel overlap."""
    files = sorted(Path(folder).glob("*.png"))
    if not files:
        raise DatasetError(f"No annotation masks in {folder}")
    if len(files) > np.iinfo(np.uint32).max:
        raise DatasetError("Too many instances for uint32 labels")
    labels = np.zeros(shape_yx, dtype=np.uint32)
    for idx, item in enumerate(files, 1):
        with Image.open(item) as raw:
            mask = np.asarray(raw)
        if mask.ndim == 3:
            mask = np.any(mask[..., :3] != 0, axis=2)
        elif mask.ndim == 2:
            mask = mask != 0
        else:
            raise DatasetError(f"Unsupported mask dimensionality: {item}")
        if mask.shape != shape_yx:
            raise DatasetError(f"Annotation mask {item} shape mismatch")
        if not np.any(mask):
            raise DatasetError(f"Empty annotation object mask: {item}")
        if np.any(labels[mask] != 0):
            raise DatasetError(f"Overlapping instance annotations in {item}")
        labels[mask] = idx
    return labels


def load_sample_image(path: Path, channel: int | None = None) -> np.ndarray:
    """Keep selected native PNG channel; do not silently collapse RGB."""
    with Image.open(path) as image:
        values = np.asarray(image)
    if values.ndim == 2:
        if channel not in (None, 0):
            raise DatasetError("Grayscale PNG has no separate channel")
        return values
    if values.ndim == 3 and values.shape[2] in (3, 4):
        if channel is None:
            raise DatasetError("RGB/RGBA PNG requires an explicit --channel")
        if not 0 <= channel < values.shape[2]:
            raise DatasetError("Requested RGB channel index out of range")
        return values[..., channel]
    raise DatasetError(f"Unsupported PNG image shape {values.shape}")
