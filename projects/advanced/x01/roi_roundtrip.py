"""X01 first vertical slice: preserve 2-D image + label TIFFs across Python/napari/Fiji.

The authoritative segmentation is the integer label TIFF. ImageJ ROIs are
rectangular *inspection boxes* around objects, NOT pixel-perfect outlines.
This script cannot control a desktop Fiji/napari GUI or validate biology.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import zipfile
from pathlib import Path

import numpy as np
import tifffile
from roifile import ImagejRoi, ROI_TYPE, roiread, roiwrite


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def validate_inputs(image: np.ndarray, labels: np.ndarray) -> None:
    if image.ndim != 2 or labels.ndim != 2:
        raise ValueError("X01 bridge accepts one explicitly selected YX image and YX label plane only")
    if image.shape != labels.shape or not all(image.shape):
        raise ValueError("Image/label YX shape mismatch or empty image")
    if image.dtype.kind not in "uif" or labels.dtype.kind != "u":
        raise ValueError("Image must be numeric and labels must be unsigned integer IDs")
    if labels.size and int(labels.max()) > 65535:
        raise ValueError("This Fiji-compatible label TIFF export supports IDs 0..65535")
    if not np.isfinite(image).all():
        raise ValueError("Image includes NaN/Inf; inspect and decide how to handle invalid pixels")


def boxes_for_labels(labels: np.ndarray) -> list[dict[str, int]]:
    result = []
    for label in np.unique(labels):
        number = int(label)
        if number == 0:
            continue
        yy, xx = np.where(labels == number)
        result.append({
            "id": number,
            "x_min": int(xx.min()), "y_min": int(yy.min()),
            "x_max_exclusive": int(xx.max()) + 1,
            "y_max_exclusive": int(yy.max()) + 1,
            "pixels": int(xx.size),
        })
    return result


def write_bundle(image_file: str | Path, labels_file: str | Path, destination: str | Path) -> dict:
    source = Path(image_file).expanduser().resolve(strict=True)
    labels_path = Path(labels_file).expanduser().resolve(strict=True)
    if source == labels_path:
        raise ValueError("Original intensity TIFF and candidate label TIFF must be distinct")
    if source.suffix.lower() not in {".tif", ".tiff"} or labels_path.suffix.lower() not in {".tif", ".tiff"}:
        raise ValueError("Use TIFF files, not rendered image exports, as scientific inputs")
    output = Path(destination).expanduser()
    if output.exists():
        raise FileExistsError("Output directory already exists; originals and previous exports must not be overwritten")
    image = tifffile.imread(source)
    labels = tifffile.imread(labels_path)
    validate_inputs(image, labels)
    before = {source: sha256(source), labels_path: sha256(labels_path)}
    boxes = boxes_for_labels(labels)
    if any(box["x_max_exclusive"] > 60535 or box["y_max_exclusive"] > 60535 for box in boxes):
        raise ValueError("ImageJ ROI coordinates exceed conservative integer ROI bounds")
    output.mkdir(parents=True, exist_ok=False)
    labels_out = output / "napari_fiji_labels.tif"
    zip_out = output / "Fiji_RoiSet.zip"
    tifffile.imwrite(labels_out, labels.astype(np.uint16, copy=False), metadata={"axes": "YX"})
    actual = tifffile.imread(labels_out)
    if not np.array_equal(actual, labels):
        raise AssertionError("Native label IDs changed during TIFF exchange")
    rois = [
        ImagejRoi(
            roitype=ROI_TYPE.RECT,
            left=box["x_min"], top=box["y_min"],
            right=box["x_max_exclusive"], bottom=box["y_max_exclusive"],
            name=f"candidate_{box['id']:05d}",
        )
        for box in boxes
    ]
    if rois:
        roiwrite(zip_out, rois, mode="x")
        restored = roiread(zip_out)
        assert isinstance(restored, list)
        if len(restored) != len(rois):
            raise AssertionError("ROI count changed during Fiji ZIP exchange")
        for expected, got in zip(boxes, restored):
            if (got.left, got.top, got.right, got.bottom) != (
                expected["x_min"], expected["y_min"],
                expected["x_max_exclusive"], expected["y_max_exclusive"]
            ):
                raise AssertionError("ROI pixel bounding-box coordinates changed")
    else:
        with zipfile.ZipFile(zip_out, mode="x"):
            pass
    if {source: sha256(source), labels_path: sha256(labels_path)} != before:
        raise AssertionError("Original microscopy inputs changed")
    audit = {
        "schema": "biopython.x01.exchange.v1",
        "status": "COMPUTATIONAL_EXCHANGE_ONLY_NOT_BIOLOGICAL_VALIDATION",
        "coordinate_convention": "YX array, x is column, y is row, bbox ends exclusive",
        "source_image_name": source.name,
        "source_image_sha256": before[source],
        "source_label_name": labels_path.name,
        "source_label_sha256": before[labels_path],
        "source_image_dtype": str(image.dtype),
        "source_label_dtype": str(labels.dtype),
        "shape_yx": list(image.shape),
        "label_count": len(boxes),
        "labels": boxes,
        "exported_labels_sha256": sha256(labels_out),
        "fiji_roi_zip_sha256": sha256(zip_out),
        "roi_meaning": "Bounding rectangles only. Use label TIFF for exact irregular shapes.",
        "pixel_calibration": None,
        "human_fiji_napari_open_check": False,
        "scientific_validation": False,
    }
    (output / "exchange_audit.json").write_text(
        json.dumps(audit, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    return audit


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("image", help="Original 2-D TIFF (one YX plane)")
    parser.add_argument("labels", help="Candidate integer label TIFF, same YX shape")
    parser.add_argument("destination", help="New output folder; refuses overwrites")
    args = parser.parse_args()
    result = write_bundle(args.image, args.labels, args.destination)
    print(f"Exported {result['label_count']} Fiji inspection boxes and a napari/Fiji label TIFF")
    print("Human GUI open check and independent biological validation remain required")


if __name__ == "__main__":
    main()
