"""Synthetic QA for A02b mode-aware routing and original BBBC039 adapter.

Do not treat a passing synthetic contract as a result on actual U2OS nuclei.
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pytest
import tifffile
from PIL import Image

from projects.advanced.a02.segmentation import SegmentConfig
from projects.advanced.a02b.modality import inspect_intensity, segment_routed
from projects.advanced.a03.bbbc039 import colored_mask_to_instances, load_original_pair, official_partitions
from projects.advanced.a03.dataset import DatasetError
from projects.advanced.a03.run_external_bbbc039 import run


def test_source_only_router_handles_brightfield_dark_objects_and_fluorescent_objects():
    dark_nuclei = np.full((48, 48), 240, dtype=np.uint8)
    dark_nuclei[15:27, 15:27] = 30
    image, report = inspect_intensity(dark_nuclei)
    assert image.dtype == dark_nuclei.dtype
    assert report["inferred_foreground_polarity"] == "dark"
    assert report["pixel_source"] == "native_single_channel"
    fluorescent = np.zeros((48, 48), dtype=np.uint16)
    fluorescent[15:27, 15:27] = 40000
    image2, report2 = inspect_intensity(fluorescent)
    assert image2.dtype == np.uint16
    assert report2["inferred_foreground_polarity"] == "bright"
    cfg = SegmentConfig(method="otsu", gaussian_sigma=0, min_area=20,
                        closing_radius=0, separate_touching=False)
    a, info = segment_routed(dark_nuclei, cfg)
    b, info2 = segment_routed(fluorescent, cfg)
    assert a.max() == b.max() == 1
    assert np.array_equal(a > 0, b > 0)
    assert info["segmentation"]["parameters"]["foreground"] == "dark"
    assert info2["segmentation"]["parameters"]["foreground"] == "bright"


def test_rgb_derivation_is_explicit_and_unsupported_data_refused():
    color = np.full((20, 20, 3), 250, dtype=np.uint8)
    color[6:13, 6:13] = [50, 30, 120]
    data, info = inspect_intensity(color)
    assert data.shape == (20, 20)
    assert data.dtype == np.float64
    assert info["pixel_source"] == "computed_RGB_luminance_not_quantitative_channel"
    assert info["inferred_foreground_polarity"] == "dark"
    with pytest.raises(ValueError, match="Signed"):
        inspect_intensity(np.zeros((6, 6), dtype=np.int16))
    with pytest.raises(ValueError, match="Expected"):
        inspect_intensity(np.zeros((2, 3, 4, 5), dtype=np.uint16))
    with pytest.raises(ValueError, match="without finite"):
        inspect_intensity(np.full((3, 3), np.nan))


def test_official_annotation_classes_count_interiors_only(tmp_path):
    path = tmp_path / "classes.png"
    mask = np.zeros((35, 50, 4), dtype=np.uint8)
    mask[..., 3] = 255
    mask[6:14, 6:14, 0] = 1
    mask[6:14, 23:31, 0] = 1
    mask[6:14, 14:23, 0] = 2  # border pixels are not separate nuclei
    mask[20:24, 25:30, 0] = 3
    Image.fromarray(mask, "RGBA").save(path)
    truth, meta = colored_mask_to_instances(path)
    assert truth.dtype == np.uint32
    assert truth.max() == 2
    assert meta["mask_class_codes"]["2"] == 8 * 9
    assert meta["reference_object_count"] == 2
    mask[10, 10, 0] = 99
    Image.fromarray(mask, "RGBA").save(path)
    with pytest.raises(DatasetError, match="unexpected"):
        colored_mask_to_instances(path)


def test_original_16bit_pair_preserves_native_pixels_and_annotations(tmp_path):
    root = tmp_path
    (root / "images").mkdir()
    (root / "masks").mkdir()
    original = np.zeros((35, 50), dtype=np.uint16)
    original[6:14, 6:14] = 25000
    filename = "IXM_example.png"
    tifffile.imwrite(root / "images" / "IXM_example.tif", original)
    mask = np.zeros((35, 50, 4), dtype=np.uint8)
    mask[..., 3] = 255
    mask[6:14, 6:14, 0] = 1
    Image.fromarray(mask, "RGBA").save(root / "masks" / filename)
    img, truth, meta = load_original_pair(root, filename)
    assert img.dtype == np.uint16
    assert np.array_equal(img, original)
    assert truth.max() == 1
    assert meta["source_sha256"]
    assert meta["official_mask_sha256"]


def _synthetic_bbbc039(tmp_path: Path) -> Path:
    root = tmp_path / "bbbc039"
    for name in ("images", "masks", "metadata"):
        (root / name).mkdir(parents=True)
    counts = {"training": 100, "validation": 50, "test": 50}
    for split, n in counts.items():
        names = []
        for k in range(n):
            name = f"IXM_{split}_{k:03d}.png"
            names.append(name)
            img = np.zeros((24, 24), dtype=np.uint16)
            img[6:15, 7:16] = 32000
            tifffile.imwrite(root / "images" / name.replace(".png", ".tif"), img)
            labels = np.zeros((24, 24, 4), dtype=np.uint8)
            labels[..., 3] = 255
            labels[6:15, 7:16, 0] = 1
            Image.fromarray(labels, "RGBA").save(root / "masks" / name)
        (root / "metadata" / f"{split}.txt").write_text(
            "\n".join(names) + "\n", encoding="utf-8")
    return root


def test_official_fixed_test_only_runs_no_source_changes(tmp_path):
    root = _synthetic_bbbc039(tmp_path)
    splits = official_partitions(root)
    assert len(splits["test"]) == 50
    assert len(splits["training"]) == 100
    assert len(splits["validation"]) == 50
    source = root / "images" / "IXM_test_001.tif"
    saved = source.read_bytes()
    out = tmp_path / "results"
    result = run(root, out)
    assert result["official_test_image_count"] == 50
    assert result["reference_objects"] == 50
    assert result["native_source_dtype"] == "uint16"
    assert len(result["per_image"]) == 50
    assert result["inferred_polarities"]["bright"] == 50
    assert source.read_bytes() == saved
    assert (out / "BBBC039_EXTERNAL_RESULTS.json").is_file()
    assert (out / "BBBC039_EXTERNAL_PER_IMAGE.csv").is_file()
    assert (out / "BBBC039_EXTERNAL_RESULTS.md").is_file()


def test_disjoint_splits_and_output_protection(tmp_path):
    root = _synthetic_bbbc039(tmp_path)
    test_file = root / "metadata" / "test.txt"
    original = test_file.read_text(encoding="utf-8")
    first_training = (root / "metadata" / "training.txt").read_text().splitlines()[0]
    test_file.write_text(first_training + "\n" + original, encoding="utf-8")
    with pytest.raises(DatasetError, match="multiple splits"):
        official_partitions(root)
    test_file.write_text(original, encoding="utf-8")
    with pytest.raises(ValueError, match="outside"):
        run(root, root / "illegal-output")
