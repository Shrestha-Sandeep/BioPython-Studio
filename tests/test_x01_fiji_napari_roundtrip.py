"""Native TIFF+Fiji ROI ZIP exchange regression; not desktop-application or biological QA."""
from __future__ import annotations

import json
import sys
import tempfile
import zipfile
from pathlib import Path

import numpy as np
import pytest
import tifffile
from roifile import roiread

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "projects" / "advanced" / "x01"))
from roi_roundtrip import boxes_for_labels, sha256, validate_inputs, write_bundle


def example(tmp_path: Path):
    image = np.arange(80, dtype=np.uint16).reshape(8, 10) * 200
    labels = np.zeros((8, 10), dtype=np.uint16)
    labels[1:4, 3:6] = 1
    labels[2, 4] = 0   # Irregular object: ROI box is not equivalent to true mask
    labels[7, 9] = 4   # Boundary-touching and nonconsecutive label
    src = tmp_path / "original.tif"
    ann = tmp_path / "annotations.tif"
    tifffile.imwrite(src, image)
    tifffile.imwrite(ann, labels)
    return image, labels, src, ann


def test_byte_preserving_sources_and_true_label_export(tmp_path: Path):
    image, labels, src, ann = example(tmp_path)
    hashes = [sha256(src), sha256(ann)]
    out = tmp_path / "exchange"
    audit = write_bundle(src, ann, out)
    assert audit["shape_yx"] == [8, 10]
    assert audit["label_count"] == 2
    assert audit["source_image_dtype"] == "uint16"
    assert [b["id"] for b in audit["labels"]] == [1, 4]
    assert sha256(src) == hashes[0] and sha256(ann) == hashes[1]
    assert np.array_equal(tifffile.imread(src), image)
    assert np.array_equal(tifffile.imread(out / "napari_fiji_labels.tif"), labels)
    assert tifffile.imread(out / "napari_fiji_labels.tif").dtype == np.uint16
    disk = json.loads((out / "exchange_audit.json").read_text())
    assert disk == audit
    assert disk["human_fiji_napari_open_check"] is False
    assert disk["scientific_validation"] is False


def test_roi_zip_rectangles_are_only_inspection_boxes(tmp_path: Path):
    _, labels, src, ann = example(tmp_path)
    out = tmp_path / "exchange"
    audit = write_bundle(src, ann, out)
    rois = roiread(out / "Fiji_RoiSet.zip")
    assert isinstance(rois, list) and len(rois) == 2
    for roi, obj in zip(rois, audit["labels"]):
        assert (roi.left, roi.top, roi.right, roi.bottom) == (
            obj["x_min"], obj["y_min"], obj["x_max_exclusive"], obj["y_max_exclusive"]
        )
    assert audit["labels"][0]["pixels"] == 8
    assert (audit["labels"][0]["x_max_exclusive"] - audit["labels"][0]["x_min"]) * (
        audit["labels"][0]["y_max_exclusive"] - audit["labels"][0]["y_min"]
    ) == 9  # Must not claim a bounding ROI is identical to an irregular instance.


def test_all_background_is_valid_and_produces_empty_roi_zip(tmp_path: Path):
    image, _, src, ann = example(tmp_path)
    tifffile.imwrite(ann, np.zeros(image.shape, dtype=np.uint8))
    out = tmp_path / "empty"
    audit = write_bundle(src, ann, out)
    assert audit["label_count"] == 0
    with zipfile.ZipFile(out / "Fiji_RoiSet.zip") as zf:
        assert zf.namelist() == []


def test_existing_output_refused_and_no_overwrites(tmp_path: Path):
    _, _, src, ann = example(tmp_path)
    out = tmp_path / "existing"
    out.mkdir()
    (out / "important.txt").write_text("keep me")
    with pytest.raises(FileExistsError):
        write_bundle(src, ann, out)
    assert (out / "important.txt").read_text() == "keep me"
    assert not (out / "exchange_audit.json").exists()


@pytest.mark.parametrize("bad", ["shape", "negative", "color", "overlimit", "nonfinite"])
def test_bad_geometry_rejected_before_creating_output(tmp_path: Path, bad: str):
    image, labels, src, ann = example(tmp_path)
    if bad == "shape":
        labels = labels[:7, :]
    elif bad == "negative":
        labels = labels.astype(np.int16)
        labels[0, 0] = -1
    elif bad == "color":
        image = np.repeat(image[:, :, None], 3, axis=2)
    elif bad == "overlimit":
        labels = labels.astype(np.uint32)
        labels[0, 0] = 65536
    elif bad == "nonfinite":
        image = image.astype(float)
        image[0, 0] = np.nan
    tifffile.imwrite(src, image)
    tifffile.imwrite(ann, labels)
    output = tmp_path / "no-export"
    with pytest.raises(ValueError):
        write_bundle(src, ann, output)
    assert not output.exists()


def test_not_just_a_copy_of_pixel_count(tmp_path: Path):
    _, labels, _, _ = example(tmp_path)
    boxes = boxes_for_labels(labels)
    assert len(boxes) == 2
    assert boxes[0] == {
        "id": 1, "x_min": 3, "y_min": 1,
        "x_max_exclusive": 6, "y_max_exclusive": 4, "pixels": 8,
    }
    assert boxes[1]["pixels"] == 1


def test_original_and_label_cannot_be_same_file(tmp_path: Path):
    _, _, src, _ = example(tmp_path)
    with pytest.raises(ValueError, match="distinct"):
        write_bundle(src, src, tmp_path / "out")
