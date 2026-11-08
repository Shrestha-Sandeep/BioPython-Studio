"""Native A02/A03 acceptance checks with synthetic gold labels only.

Synthetic checks validate implementation contracts, NOT external biological
accuracy. First independent BBBC038 validation requires downloaded data.
"""
from __future__ import annotations

import json
from dataclasses import asdict
from pathlib import Path

import numpy as np
import pytest
from PIL import Image

from projects.advanced.a02.segmentation import SegmentConfig, region_table, segment
from projects.advanced.a03.benchmark import digest_json, main
from projects.advanced.a03.dataset import DatasetError, load_instance_annotations, load_sample_image, read_manifest
from projects.advanced.a03.metrics import aggregate_by_image, evaluate_instances


def _disc(shape=(48, 48), center=(24, 24), radius=8):
    y, x = np.indices(shape)
    return (y - center[0]) ** 2 + (x - center[1]) ** 2 <= radius ** 2


def test_two_dimensional_native_segmentation_and_nonfinite_policy():
    image = np.zeros((48, 48), dtype=np.uint16)
    image[_disc()] = 35000
    original = image.copy()
    labels, report = segment(image, SegmentConfig(gaussian_sigma=0, min_area=20,
                                                  opening_radius=0, closing_radius=0))
    assert labels.dtype == np.uint32
    assert labels.shape == image.shape
    assert np.array_equal(image, original)
    assert report["input_dtype"] == "uint16"
    assert report["candidate_count"] == 1
    assert not report["biological_identity_verified"]
    assert region_table(labels)[0]["area_px"] > 100
    bad = image.astype(float)
    bad[24, 24] = np.nan
    labels_bad, diag = segment(bad, SegmentConfig(gaussian_sigma=0, closing_radius=0))
    assert diag["nonfinite_pixels"] == 1
    assert labels_bad[24, 24] == 0


def test_background_constant_image_and_parameter_rejection():
    blank = np.zeros((25, 25), dtype=np.float32)
    labels, details = segment(blank, SegmentConfig(method="otsu", gaussian_sigma=0))
    assert labels.sum() == 0
    assert details["constant_image"] is True
    with pytest.raises(ValueError, match="manual_threshold"):
        segment(blank, SegmentConfig(method="manual"))
    with pytest.raises(ValueError, match="odd"):
        segment(blank, SegmentConfig(method="local", local_block_size=8))
    with pytest.raises(ValueError, match="shortest"):
        segment(blank, SegmentConfig(method="local", local_block_size=31))
    with pytest.raises(ValueError, match="numeric"):
        segment(np.array([["x"]]), SegmentConfig())


def test_local_threshold_and_optional_watershed_are_real():
    image = np.zeros((72, 72), dtype=np.float32)
    image[_disc((72, 72), (28, 27), 11)] = 4
    image[_disc((72, 72), (28, 44), 11)] = 5
    labels, diag = segment(image, SegmentConfig(separate_touching=True,
                                                peak_min_distance=7,
                                                gaussian_sigma=1, min_area=5))
    assert diag["candidate_count"] >= 1
    assert sorted(set(np.unique(labels).tolist())) == list(range(diag["candidate_count"] + 1))
    mask, diag2 = segment(image, SegmentConfig(method="local", local_block_size=11,
                                              min_area=5))
    assert mask.shape == image.shape
    assert diag2["threshold"]["kind"] == "local_map"


def test_object_matching_penalizes_merge_and_split_even_with_good_pixel_overlap():
    truth = np.zeros((20, 25), dtype=np.int64)
    truth[3:9, 3:9] = 10000
    truth[3:9, 13:19] = 90000
    perfect = evaluate_instances(truth, truth)
    assert perfect["true_positives"] == 2
    assert perfect["f1"] == 1.0
    assert perfect["foreground_pixel_iou"] == 1.0
    merged = truth.copy()
    merged[merged == 90000] = 10000
    result = evaluate_instances(truth, merged, min_iou=0.5)
    assert result["foreground_pixel_iou"] == 1.0
    assert result["true_positives"] == 1
    assert result["false_negatives"] == 1
    assert result["f1"] < 1
    split = truth.copy()
    split[3:6, 3:9] = 70000
    result2 = evaluate_instances(truth, split, min_iou=0.5)
    assert result2["foreground_pixel_iou"] == 1.0
    assert result2["false_positives"] == 1
    assert result2["f1"] < 1


def test_no_objects_single_sided_and_shape_validation():
    empty = np.zeros((6, 6), dtype=np.uint8)
    one = empty.copy()
    one[1:3, 1:3] = 1
    both_empty = evaluate_instances(empty, empty)
    assert both_empty["f1"] == 1
    assert both_empty["no_objects_in_both"]
    result = evaluate_instances(one, empty)
    assert result["recall"] == 0
    assert result["false_negatives"] == 1
    assert evaluate_instances(empty, one)["false_positives"] == 1
    with pytest.raises(ValueError, match="Shape mismatch"):
        evaluate_instances(one, one[:5])
    with pytest.raises(ValueError, match="integer"):
        evaluate_instances(one, one.astype(float))
    with pytest.raises(ValueError, match="min_iou"):
        evaluate_instances(one, one, min_iou=0)
    with pytest.raises(ValueError, match="dense"):
        evaluate_instances(one, one, max_pair_cells=0)
    with pytest.raises(ValueError, match="At least one"):
        aggregate_by_image([])


def _make_sample(root: Path, name: str, center: tuple[int, int]) -> tuple[str, str]:
    location = root / name
    folder = location / "images"
    masks = location / "masks"
    folder.mkdir(parents=True)
    masks.mkdir(parents=True)
    image = np.zeros((40, 40), dtype=np.uint8)
    mask = _disc((40, 40), center, 6)
    image[mask] = 235
    Image.fromarray(image).save(folder / f"{name}.png")
    Image.fromarray((mask * 255).astype(np.uint8)).save(masks / "0001.png")
    return f"{name}/images/{name}.png", f"{name}/masks"


def _make_dataset(tmp_path):
    root = tmp_path / "data"
    entries = []
    for name, center, group, split in (
        ("a", (18, 18), "experiment_A", "calibration"),
        ("b", (21, 21), "experiment_B", "holdout"),
    ):
        image, annotation_dir = _make_sample(root, name, center)
        entries.append(dict(sample_id=name, image=image, annotation_dir=annotation_dir,
                            group_id=group, split=split))
    manifest = tmp_path / "manifest.json"
    manifest.write_text(json.dumps({"schema_version": "bps.advanced.dataset.v1",
                                    "records": entries}), encoding="utf-8")
    config = tmp_path / "cfg.json"
    config.write_text(json.dumps(dict(method="manual", manual_threshold=100,
                                      gaussian_sigma=0, min_area=15,
                                      opening_radius=0, closing_radius=0)),
                      encoding="utf-8")
    return root, manifest, config


def test_real_png_roundtrip_and_group_locked_benchmark(tmp_path):
    root, manifest, cfg = _make_dataset(tmp_path)
    records = read_manifest(manifest, root)
    assert len(records) == 2
    img = load_sample_image(records[0]["image"])
    gt = load_instance_annotations(records[0]["annotation_dir"], img.shape)
    assert gt.max() == 1
    lock = tmp_path / "frozen.json"
    cal = tmp_path / "calibration_out"
    held = tmp_path / "heldout_out"
    assert main(["--phase", "calibration", "--root", str(root),
                 "--manifest", str(manifest), "--out", str(cal),
                 "--config", str(cfg), "--lock", str(lock)]) == 0
    assert lock.is_file()
    assert main(["--phase", "holdout", "--root", str(root),
                 "--manifest", str(manifest), "--out", str(held),
                 "--lock", str(lock)]) == 0
    report = json.loads((held / "benchmark_report.json").read_text())
    assert report["study_split"] == "holdout"
    assert report["image_macro"]["images_evaluated"] == 1
    assert report["image_results"][0]["sample_id"] == "b"
    assert list(held.glob("*_candidate_labels.tif"))
    assert list(held.glob("*_annotation_comparison.png"))
    assert report["image_results"][0]["instance_metrics"]["f1"] == 1.0
    assert report["no_biological_generalization_claim"] is True
    assert not any(r["sample_id"] == "a" for r in report["image_results"])


def test_lock_tampering_manifest_change_and_split_overlap_rejected(tmp_path):
    root, manifest, cfg = _make_dataset(tmp_path)
    lock = tmp_path / "frozen.json"
    assert main(["--phase", "calibration", "--root", str(root),
                 "--manifest", str(manifest), "--out", str(tmp_path / "cal"),
                 "--config", str(cfg), "--lock", str(lock)]) == 0
    locked = json.loads(lock.read_text())
    assert locked["config_sha256"] == digest_json(locked["config"])
    locked["config"]["min_area"] += 5
    lock.write_text(json.dumps(locked))
    assert main(["--phase", "holdout", "--root", str(root),
                 "--manifest", str(manifest), "--out", str(tmp_path / "held"),
                 "--lock", str(lock)]) == 2
    with pytest.raises(DatasetError, match="calibration and holdout"):
        j = json.loads(manifest.read_text())
        j["records"][1]["group_id"] = "experiment_A"
        manifest.write_text(json.dumps(j))
        read_manifest(manifest, root)


def test_overlapping_annotation_masks_and_unsafe_dataset_paths_rejected(tmp_path):
    root, manifest, _ = _make_dataset(tmp_path)
    location = root / "a" / "masks"
    Image.fromarray(np.pad(np.ones((4, 4), dtype=np.uint8) * 255,
                           ((16, 20), (16, 20)))).save(location / "0002.png")
    with pytest.raises(DatasetError, match="Overlapping"):
        load_instance_annotations(location, (40, 40))
    manifest_data = json.loads(manifest.read_text())
    manifest_data["records"][0]["image"] = "../../private.png"
    manifest.write_text(json.dumps(manifest_data))
    with pytest.raises(DatasetError, match="outside"):
        read_manifest(manifest, root)


def test_rgb_never_silently_collapsed(tmp_path):
    folder = tmp_path / "rgb.png"
    Image.fromarray(np.zeros((8, 8, 3), dtype=np.uint8)).save(folder)
    with pytest.raises(DatasetError, match="explicit"):
        load_sample_image(folder)
    assert load_sample_image(folder, channel=1).shape == (8, 8)
