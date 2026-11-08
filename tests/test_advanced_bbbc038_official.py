"""Contract tests for BBBC038 official-test workflow using SYNTHETIC fixtures.

These tests cannot establish benchmark performance on true microscopy images.
The separate real-data GitHub workflow downloads original CC0 BBBC038 files.
"""
from __future__ import annotations

import csv
import json
from pathlib import Path

import numpy as np
import pytest
from PIL import Image

from projects.advanced.a03.dataset import DatasetError, read_manifest
from projects.advanced.a03.prepare_bbbc038 import (
    build_manifest, decode_rle, discover_pngs, materialize_solution_masks,
)
from projects.advanced.a03.run_official_bbbc038 import run


def _encode_rle(mask: np.ndarray) -> str:
    flat = np.asarray(mask, bool).flatten(order="F")
    padded = np.concatenate(([False], flat, [False])).astype(np.uint8)
    changes = np.flatnonzero(np.diff(padded.astype(int)))
    parts = []
    for i in range(0, len(changes), 2):
        parts += [str(int(changes[i]) + 1), str(int(changes[i + 1] - changes[i]))]
    return " ".join(parts)


def _make_original(root: Path, ident: str, *, is_train: bool,
                   center: tuple[int, int]) -> tuple[str, np.ndarray]:
    directory = root / ident
    (directory / "images").mkdir(parents=True)
    if is_train:
        (directory / "masks").mkdir()
    yy, xx = np.indices((40, 40))
    mask = (yy-center[0])**2 + (xx-center[1])**2 <= 7**2
    image = np.zeros(mask.shape, dtype=np.uint8)
    image[mask] = 240
    Image.fromarray(image).save(directory / "images" / f"{ident}.png")
    if is_train:
        Image.fromarray((mask * 255).astype(np.uint8)).save(
            directory / "masks" / "00001.png"
        )
    return ident, mask


def test_rle_decode_column_major_and_refusals():
    mask = np.zeros((5, 7), dtype=bool)
    mask[0, 1] = True
    mask[1, 1] = True
    mask[3:5, 6] = True
    encoded = _encode_rle(mask)
    assert np.array_equal(decode_rle(encoded, mask.shape), mask)
    with pytest.raises(DatasetError, match="empty"):
        decode_rle("", (5, 7))
    with pytest.raises(DatasetError, match="pairs"):
        decode_rle("1 3 4", (5, 7))
    with pytest.raises(DatasetError, match="exceeds"):
        decode_rle("35 4", (5, 7))
    with pytest.raises(DatasetError, match="Overlapping"):
        decode_rle("1 4 3 2", (5, 7))


def test_official_train_vs_test_manifest_and_full_pipeline_with_synthetic_data(tmp_path):
    root = tmp_path / "source"
    train = root / "stage1_train"
    test = root / "stage1_test"
    test_rle = {}
    for index in range(6):
        _make_original(train, f"train{index:02d}", is_train=True,
                       center=(17 + index % 3, 18))
    for index in range(5):
        ident, mask = _make_original(test, f"test{index:02d}", is_train=False,
                                     center=(17 + index % 3, 21))
        test_rle[ident] = _encode_rle(mask)
    assert len(discover_pngs(train, require_masks=True)) == 6
    solution = root / "stage1_solution.csv"
    with solution.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=["ImageId", "EncodedPixels"])
        writer.writeheader()
        for ident, rle in sorted(test_rle.items()):
            writer.writerow({"ImageId": ident, "EncodedPixels": rle})
    manifest = tmp_path / "dataset_manifest.json"
    prov = build_manifest(data_root=root, train_root=train, test_root=test,
                          solution_csv=solution, out=manifest, calibration_size=5)
    assert prov["images_train_original"] == 6
    assert prov["images_calibration_selected"] == 5
    assert prov["images_official_stage1_test"] == 5
    assert prov["test_annotation_objects_decoded"] == 5
    rows = read_manifest(manifest, root)
    assert len(rows) == 10
    assert len({r["group_id"] for r in rows}) == 10
    assert set(r["split"] for r in rows) == {"calibration", "holdout"}
    before = (test / "test00" / "images" / "test00.png").read_bytes()
    results = run(data_root=root, manifest=manifest,
                  output_root=tmp_path / "results", channel=0)
    assert results["official_test_set"]["n_images"] == 5
    assert results["official_test_set"]["reference_objects"] == 5
    assert results["official_test_object_micro_f1"] > 0
    assert len(results["calibration_candidates"]) == 3
    assert results["best_config"] in {"otsu", "adaptive", "watershed"}
    assert results["calibration_candidates"][0]["name"] == "otsu"
    assert not any(r["image_id"].startswith("train") for r in results["per_image"])
    assert (tmp_path / "results" / "official_test_per_image.csv").is_file()
    assert (tmp_path / "results" / "REAL_BBBC038_RESULTS.md").is_file()
    assert (tmp_path / "results" / "frozen_parameters.json").is_file()
    assert (test / "test00" / "images" / "test00.png").read_bytes() == before


def test_cross_mask_overlap_and_train_test_duplicate_image_refused(tmp_path):
    testdir = tmp_path / "test"
    _, mask = _make_original(testdir, "same", is_train=False, center=(18, 18))
    with pytest.raises(DatasetError, match="overlap"):
        materialize_solution_masks({"same": {"shape_yx": mask.shape}},
                                   {"same": ["1 2", "2 3"]}, tmp_path / "out")
    with pytest.raises(DatasetError, match="disagree"):
        materialize_solution_masks({"same": {"shape_yx": mask.shape}},
                                   {"other": ["1 2"]}, tmp_path / "other")


def test_official_test_preparation_is_idempotence_protected(tmp_path):
    testdir = tmp_path / "test"
    _, mask = _make_original(testdir, "id1", is_train=False, center=(18, 18))
    target = tmp_path / "test_annotations"
    materialize_solution_masks({"id1": {"shape_yx": mask.shape}},
                               {"id1": [_encode_rle(mask)]}, target)
    with pytest.raises(DatasetError, match="already contains"):
        materialize_solution_masks({"id1": {"shape_yx": mask.shape}},
                                   {"id1": [_encode_rle(mask)]}, target)
