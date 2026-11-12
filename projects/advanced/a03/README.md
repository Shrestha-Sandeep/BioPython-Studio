# A03 — Validate instance segmentation on independently annotated images

**Code status:** local adapter, matching metrics and parameter-frozen evaluation implemented. **Scientific status:** no learner-independent, external dataset benchmark certified. This project cannot be considered complete until a documented real evaluation and delayed transfer exist.

## Reference dataset and origin

Recommended first dataset: [Broad Bioimage Benchmark Collection BBBC038v1](https://bbbc.broadinstitute.org/BBBC038) (2018 Data Science Bowl nuclei). Download **stage1_train.zip** directly from that page, extract it locally and verify the source archive. The public training set provides biological image PNG files and *individual nucleus masks* as separate PNGs under each ImageId directory. Official source reports CC0 for BBBC038v1. No images/annotations are bundled into this repository.

Source publication: Caicedo et al., *Nature Methods* (2019), [Nucleus segmentation across imaging experiments](https://pmc.ncbi.nlm.nih.gov/articles/PMC6919559/). The paper calls the manually produced labels **target masks**, not infallible ground truth. The dataset spans multiple experiments and imaging conditions. **Do not claim experiment-disjoint generalization from arbitrary ImageIds.**

Alternative for a later *native 16-bit microscopy* experiment: [BBBC039v1](https://bbbc.broadinstitute.org/BBBC039) provides 200 16-bit TIFF images and color-coded instance annotations, with official train/validation/test partitions. **That distinct mask encoding is not handled by the BBBC038 loader in this version.** A separate color-instance decoder and official split adapter are required.

## Manifest contract

Make a local `dataset_manifest.json` with:

```json
{
  "schema_version": "bps.advanced.dataset.v1",
  "records": [
    {
      "sample_id": "REPLACE_WITH_REAL_IMAGE_ID_1",
      "image": "stage1_train/REPLACE_WITH_REAL_IMAGE_ID_1/images/REPLACE_WITH_REAL_IMAGE_ID_1.png",
      "annotation_dir": "stage1_train/REPLACE_WITH_REAL_IMAGE_ID_1/masks",
      "group_id": "REPLACE_WITH_VERIFIED_OR_DECLARED_GROUP_A",
      "split": "calibration"
    },
    {
      "sample_id": "REPLACE_WITH_REAL_IMAGE_ID_2",
      "image": "stage1_train/REPLACE_WITH_REAL_IMAGE_ID_2/images/REPLACE_WITH_REAL_IMAGE_ID_2.png",
      "annotation_dir": "stage1_train/REPLACE_WITH_REAL_IMAGE_ID_2/masks",
      "group_id": "REPLACE_WITH_VERIFIED_OR_DECLARED_GROUP_B",
      "split": "holdout"
    }
  ]
}
```

**Important:** The software rejects the same `group_id` in both subsets. That check establishes only *declared* group separation. A random unique group ID per image does **not** establish biological/experiment independence. If experiment identities are unknown, call results an *image-level holdout*, not experiment-level generalization.

Paths are interpreted relative to `--root`; path traversal, duplicate image entries and overlapping individual mask files are rejected. Only local PNG masks (one PNG per nucleus) are supported. Explicitly select an RGB channel. Never use an arbitrary blend as if it were an original calibrated fluorescence channel.

## Two-stage evaluation

Run from the repository root, with data outside the source repo:

**1. Calibration and freeze**

```sh
python -m projects.advanced.a03.benchmark \
  --phase calibration \
  --root /path/to/BBBC038 \
  --manifest /path/to/dataset_manifest.json \
  --config projects/advanced/a02/segmentation-config.json \
  --channel 0 --min-iou 0.5 \
  --out outputs/advanced/calibration \
  --lock outputs/advanced/locked-parameters.json
```

Use real calibration annotations to inspect errors, then *freeze* the configuration and manifest for final evaluation. The `--channel 0` shown is a **technical example only**, not a scientifically recommended channel for every BBBC038 image.

**2. Held-out test**

```sh
python -m projects.advanced.a03.benchmark \
  --phase holdout \
  --root /path/to/BBBC038 \
  --manifest /path/to/dataset_manifest.json \
  --channel 0 --min-iou 0.5 \
  --out outputs/advanced/holdout \
  --lock outputs/advanced/locked-parameters.json
```

No new config is accepted in holdout mode. The tool checks hashes of the config and manifest, and refuses changed channel/IoU settings. **It cannot prevent a researcher from manually peeking at holdout annotations; that is a procedural requirement.**

### Generated evidence

- Native candidate label TIFFs and per-image region geometry in `benchmark_report.json`.
- Diagnostic PNG overlays: **cyan** reference boundaries, **red** candidate boundaries, **yellow** overlap.
- SHA-256 of source image, each annotation PNG and dataset manifest.
- Object-level **one-to-one IoU matching**, precision, recall, F1, FP/FN and count error.
- Foreground pixel IoU/Dice recorded separately, with empty-mask policies documented.
- Macro arithmetic averages **across images**, explicitly **not across biological specimens**.

A merge of two nuclei may have perfect foreground pixel IoU but poor object F1. A synthetic test verifies this distinction. A match with IoU >= 0.5 is a scored detection, not proof of nuclear identity.

## Acceptance gate

Before G3 can be considered scientifically validated:

1. Evaluate actual BBBC038 or equivalent **independent annotations** obtained from the original source.
2. Declare source and experiment-group provenance and keep calibration groups disjoint from holdout.
3. Check difficult images manually: touching, dim, saturated, out of focus, edges, mixed modalities.
4. Record original errors, compare no-split versus watershed and parameter sensitivity, and do not tune after viewing holdout results.
5. Report per-image distributions and failure classes; do not report cell-level (n) as independent sample count.
6. Run a blind, delayed transfer on new annotated data and reproduce outputs on another machine.

Software CI currently uses **synthetic** image/mask fixtures to test code behavior only. No claim of high sensitivity, research-grade segmentation or held-out biological performance follows from a green CI run.


## Supplemental annotation reliability — compare annotators

[`annotator_agreement.py`](annotator_agreement.py) evaluates two independent instance-label maps at the *same original pixel coordinates*, with one-to-one matched objects, foreground pixel Dice/IoU and unmatched-object counts. It uses [A03's existing instance matching](metrics.py) and always marks **human review required**.

```python
from projects.advanced.a03.annotator_agreement import annotator_agreement
# annotation_a and annotation_b must be real integer YX masks.
agreement = annotator_agreement(annotation_a, annotation_b, min_iou=0.5)
print(agreement["object_f1"], agreement["warning"])
```

For genuine annotation disagreement, use a written target-object rule and independent repeated annotations; examine touching, faint, partially visible, ambiguous and excluded structures. Agreement between annotators is **not** proof either annotation is biologically true. Never use held-out reference annotations to change thresholds and still call them untouched.
