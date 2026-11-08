"""Prepare the *original Broad* BBBC038 stage1_train and official stage1_test.

Train: original individual nucleus masks. Test: decode published stage1_solution
run-length encoded annotations into independent per-object PNG masks.
No image or annotation pixels are altered; derived test mask PNGs are reversible
representations of source RLE coordinates.

This prepares an official STAGE1 TEST SET holdout, not proof of experiment-
disjoint generalization or a blind test (labels were publicly released).
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
from collections import defaultdict
from pathlib import Path

import numpy as np
from PIL import Image

from projects.advanced.a03.dataset import DatasetError, sha256_file

SCHEMA = "bps.advanced.bbbc038-prep.v1"


def decode_rle(encoded: str, shape_yx: tuple[int, int]) -> np.ndarray:
    """Decode 1-indexed column-major Kaggle nucleus-mask runs into YX pixels."""
    if not isinstance(encoded, str) or not encoded.strip():
        raise DatasetError("A nucleus RLE entry cannot be empty")
    parts = encoded.split()
    if len(parts) % 2 or len(parts) == 0:
        raise DatasetError("Malformed run-length pairs")
    numbers = [int(part) for part in parts]
    if any(x < 1 for x in numbers[::2]) or any(x < 1 for x in numbers[1::2]):
        raise DatasetError("Run indices and lengths must be strictly positive")
    size = int(np.prod(shape_yx))
    data = np.zeros(size, dtype=np.uint8)
    for start, length in zip(numbers[::2], numbers[1::2]):
        offset = start - 1
        if offset + length > size:
            raise DatasetError("RLE mask run exceeds source image size")
        if np.any(data[offset:offset + length]):
            raise DatasetError("Overlapping runs within one RLE mask")
        data[offset:offset + length] = 1
    return data.reshape(shape_yx, order="F")


def discover_pngs(root: Path, *, require_masks: bool) -> dict[str, dict]:
    """Discover source ImageId folder structure, independent of ZIP wrapper."""
    out: dict[str, dict] = {}
    for path in sorted(Path(root).rglob("images/*.png")):
        image_id = path.parent.parent.name
        if image_id in out:
            raise DatasetError(f"Duplicate image ID {image_id} in {root}")
        with Image.open(path) as original:
            if original.width < 1 or original.height < 1:
                raise DatasetError("Source image has no pixels")
            shape = (original.height, original.width)
        masks = path.parent.parent / "masks"
        if require_masks and not list(masks.glob("*.png")):
            raise DatasetError(f"Missing original annotated masks for {image_id}")
        out[image_id] = {
            "image": path, "original_masks": masks,
            "shape_yx": shape,
        }
    if not out:
        raise DatasetError(f"No original ImageId/images/*.png found under {root}")
    return out


def published_solution(path: Path) -> dict[str, list[str]]:
    rows: dict[str, list[str]] = defaultdict(list)
    with Path(path).open("r", newline="", encoding="utf-8-sig") as file:
        reader = csv.DictReader(file)
        fields = set(reader.fieldnames or [])
        if not {"ImageId", "EncodedPixels"}.issubset(fields):
            raise DatasetError(f"Unexpected official CSV fields: {sorted(fields)}")
        for row in reader:
            image_id = (row.get("ImageId") or "").strip()
            runs = (row.get("EncodedPixels") or "").strip()
            if not image_id:
                raise DatasetError("Blank ImageId in official solution")
            if runs:
                rows[image_id].append(runs)
            else:
                rows.setdefault(image_id, [])
    if not rows:
        raise DatasetError("No stage1 test solution records found")
    return dict(rows)


def materialize_solution_masks(test: dict[str, dict], solution: dict[str, list[str]],
                               out: Path) -> dict[str, Path]:
    unknown = set(solution) - set(test)
    missing = set(test) - set(solution)
    if unknown or missing:
        raise DatasetError(
            f"Official solution-image IDs disagree: "
            f"{len(unknown)} unexpected and {len(missing)} missing"
        )
    folders: dict[str, Path] = {}
    for ident, source in sorted(test.items()):
        folder = out / ident / "masks"
        folder.mkdir(parents=True, exist_ok=True)
        # Never leave stale masks from another solution version.
        if any(folder.glob("*.png")):
            raise DatasetError(f"Output folder already contains annotations: {folder}")
        covered = np.zeros(source["shape_yx"], dtype=bool)
        for number, encoded in enumerate(solution[ident], start=1):
            mask = decode_rle(encoded, source["shape_yx"]).astype(bool)
            if np.any(covered & mask):
                raise DatasetError(f"Published target masks overlap for image {ident}")
            covered |= mask
            Image.fromarray((mask * 255).astype(np.uint8)).save(folder / f"{number:05d}.png")
        if not solution[ident]:
            raise DatasetError(f"No nucleus annotations for test image {ident}")
        folders[ident] = folder
    return folders


def build_manifest(*, data_root: Path, train_root: Path, test_root: Path,
                   solution_csv: Path, out: Path, calibration_size: int = 40,
                   seed: str = "biopython-advancement-bbbc038-official-v1") -> dict:
    if calibration_size < 5:
        raise DatasetError("Use at least five calibration images for this pilot")
    train = discover_pngs(train_root, require_masks=True)
    test = discover_pngs(test_root, require_masks=False)
    if set(train) & set(test):
        raise DatasetError("Train and test image IDs overlap")
    if len(train) < calibration_size:
        raise DatasetError(f"Only {len(train)} training images; need {calibration_size}")
    solution = published_solution(solution_csv)
    target_folders = materialize_solution_masks(
        test, solution, data_root / "derived_official_stage1_test_annotations"
    )
    # Deterministic selection prior to examining segmentation/labels.
    order = sorted(train, key=lambda ident:
                   hashlib.sha256((seed + ":" + ident).encode("utf-8")).hexdigest())
    records = []
    for ident in order[:calibration_size]:
        row = train[ident]
        records.append({
            "sample_id": "train_" + ident,
            "image": row["image"].relative_to(data_root).as_posix(),
            "annotation_dir": row["original_masks"].relative_to(data_root).as_posix(),
            "group_id": "unverified_image_" + ident, "split": "calibration",
        })
    for ident, row in sorted(test.items()):
        records.append({
            "sample_id": "test_" + ident,
            "image": row["image"].relative_to(data_root).as_posix(),
            "annotation_dir": target_folders[ident].relative_to(data_root).as_posix(),
            "group_id": "unverified_image_" + ident, "split": "holdout",
        })
    manifest = {
        "schema_version": "bps.advanced.dataset.v1",
        "records": records,
    }
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    provenance = {
        "schema_version": SCHEMA,
        "source": "https://bbbc.broadinstitute.org/BBBC038",
        "train_zip_source": "https://data.broadinstitute.org/bbbc/BBBC038/stage1_train.zip",
        "test_zip_source": "https://data.broadinstitute.org/bbbc/BBBC038/stage1_test.zip",
        "test_annotations_source": "https://data.broadinstitute.org/bbbc/BBBC038/stage1_solution.csv",
        "stage1_solution_sha256": sha256_file(solution_csv),
        "images_train_original": len(train),
        "images_calibration_selected": calibration_size,
        "images_official_stage1_test": len(test),
        "test_annotation_objects_decoded": sum(len(v) for v in solution.values()),
        "calibration_sampling_rule": "sort ImageId by SHA256(seed + ':' + ImageId)",
        "calibration_seed": seed,
        "holdout_description": "Official stage1_test partition, annotations publicly released; no biological experiment-disjointness asserted.",
        "data_files_in_git": False,
    }
    (out.parent / "bbbc038_provenance.json").write_text(
        json.dumps(provenance, indent=2) + "\n", encoding="utf-8"
    )
    return provenance


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data-root", required=True, type=Path)
    parser.add_argument("--train-dir", required=True, type=Path)
    parser.add_argument("--test-dir", required=True, type=Path)
    parser.add_argument("--stage1-solution", required=True, type=Path)
    parser.add_argument("--output-manifest", required=True, type=Path)
    parser.add_argument("--calibration-size", type=int, default=40)
    args = parser.parse_args(argv)
    try:
        result = build_manifest(
            data_root=args.data_root.resolve(),
            train_root=args.train_dir.resolve(),
            test_root=args.test_dir.resolve(),
            solution_csv=args.stage1_solution.resolve(),
            out=args.output_manifest.resolve(),
            calibration_size=args.calibration_size,
        )
        print(json.dumps(result, indent=2))
        return 0
    except (ValueError, DatasetError, OSError) as exc:
        parser.exit(2, f"Dataset preparation failed: {exc}\n")


if __name__ == "__main__":
    raise SystemExit(main())
