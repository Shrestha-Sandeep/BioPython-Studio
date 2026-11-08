# BioPython Studio A03 — REAL BBBC038v1 nucleus benchmark

**Measured:** 8 November 2026 (GitHub Actions).  
**Exact evaluated code:** [`fb3c9779ff4720c429be2bce5166653f4f1d84da`](https://github.com/Shrestha-Sandeep/BioPython-Studio/commit/fb3c9779ff4720c429be2bce5166653f4f1d84da).  
**Real data run:** [GitHub Actions #42522819961](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/42522819961).  
**Source:** [Broad BBBC038v1](https://bbbc.broadinstitute.org/BBBC038), Caicedo et al. *Nature Methods* 2019, CC0 original microscopy images and expert-created target masks.

## The measured result, not a synthetic-unit-test claim

| Measurement | Actual published stage1 test |
|---|---:|
| Source images | **65** |
| Official expert-annotated nucleus instances | **4,152** |
| Candidate objects returned | **3,560** |
| One-to-one true positive matches (IoU ≥ 0.5) | **1,484** |
| False-positive objects | **2,076** |
| Missed nucleus instances (false negatives) | **2,668** |
| Object-level micro precision | **0.4169** |
| Object-level micro recall | **0.3574** |
| **Object-level micro F1** | **0.3849** |
| **Image-macro object F1** | **0.5292** |
| Median image object F1 | 0.5856 |
| Interquartile range, image F1 | 0.2609–0.8276 |
| Image-macro foreground pixel IoU | 0.5605 |
| Mean absolute object-count error / image | 25.02 |
| Images with **zero** IoU-qualifying object matches | **12 of 65** |

**Scientific verdict: NO** for robust automated counting of arbitrary nuclei across this heterogeneous dataset. The output is a valid *baseline benchmark*, not an accurate universal nucleus detector. The image-average F1 is higher than micro F1 because difficult images often contain more nuclei; image and object weighting answer different questions. Pixel IoU measures foreground overlap and cannot stand in for correct separation of individual nuclei.

This metric is **one-to-one object F1 with IoU ≥0.5**, not the Kaggle original multi-threshold mean-average-precision score.

## Prespecified calibration and frozen test

- The source comprises **670** original `stage1_train` images, of which **40** were selected *before inspecting performance* using SHA-256 sorting of image IDs and the fixed seed `biopython-advancement-bbbc038-official-v1`.
- Training annotations are the original per-object PNG nucleus masks. Evaluation uses the official **separate 65-image `stage1_test` archive** with its **published `stage1_solution.csv`**, decoded by the standard 1-indexed column-major RLE convention; 4,152 individual test nuclei were recovered.
- Exactly three baselines were declared before evaluation; **red channel (RGB channel 0)** and **IoU threshold 0.5** were also fixed. The winner was chosen using *calibration-image macro F1*, with count error/name for ties. Its parameters and the dataset manifest were locked before evaluating the published test images.

| Prespecified algorithm | Calibration image-macro object F1 | Mean absolute count error/image |
|---|---:|---:|
| Otsu + morphology | 0.6510 | 15.75 |
| Local adaptive threshold + morphology | 0.1813 | 185.28 |
| **Otsu + distance watershed** | **0.6904** | **9.28** |

No test annotations were used for parameter selection in the automated run. Because stage1 test annotations have long been public, this is an **official, held-out-by-image partition**, not a secret prospective blind test. Experiment identities are not independently verified, so it is **not** a demonstrated experiment-disjoint evaluation.

## Observed failure modes (manual QC on actual diagnostic overlays)

The held-out overlays encode cyan=expert-reference boundary, red=candidate boundary, yellow=coincident boundaries. Both images and the overlays are generated from the real official dataset, **not synthetic pictures**.

1. **`test_259b35151d...`**: **23** annotated nuclei, **268** candidates, **0** IoU-qualifying matches. The visible nuclei are dark on a light textured brightfield background. A bright-foreground assumption causes the algorithm to outline background structures and debris instead of dark nuclei. The result is not merely a slightly inaccurate threshold.
2. **`test_0f1f896d9a...`**: **70** reference nuclei, **180** candidates, **0** qualifying matches. The same polarity/background problem is visible; watershed adds spurious partitions to inappropriate foreground.
3. **`test_191b2b2205...`**: a bright-on-dark microscopy field with **8** reference objects and **8** matched predictions (image F1=1.0). This illustrates the *narrow setting where the baseline works*, not proof of universal performance.

The differences identify a **modality/foreground-polarity failure** as a priority for follow-up. These examples were selected for QC **after evaluation**; changing methods on this same test set would compromise its use as untouched holdout evidence.

## Original Broad source integrity (SHA-256, downloaded and checked in CI)

```
dcb6edc2690f137406638b2309581a71522c4dff19157d118453b448dcddcb68  stage1_train.zip
c097954151884341448a5c77aab21f581815ad9cad203ff2ff38d6947c9f0733  stage1_test.zip
b697d9ae093d72079f45adea7e9823204d3f67dd5ab657f68ce86ab988fc32f9  stage1_solution.csv
```

GitHub Actions downloads these files directly from `https://data.broadinstitute.org/bbbc/BBBC038/`. Source files were not committed to the repository. The separate [run artifact](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/42522819961) holds per-image metrics, original-data hashes, exact frozen parameters, the JSON report and **8 real-image annotation/prediction overlays**.

## Reproducibility

Run [`.github/workflows/bbbc038-real-benchmark.yml`](../.github/workflows/bbbc038-real-benchmark.yml) on this advancement branch, or reproduce using:

1. Install [`projects/advanced/requirements.txt`](../projects/advanced/requirements.txt).
2. Download original `stage1_train.zip`, `stage1_test.zip` and `stage1_solution.csv` from Broad. Keep the source data out of Git.
3. Extract the image archives; run `python -m projects.advanced.a03.prepare_bbbc038 --help`.
4. Run `python -m projects.advanced.a03.run_official_bbbc038 --help`, using the generated manifest.
5. Inspect `REAL_BBBC038_RESULTS.json`, `official_test_per_image.csv` and reference/prediction overlays in the GitHub artifact.

The native GitHub QA also tests synthetic 16-bit TIFF reading, real PNG encode/decode, RLE roundtrip, one-to-one matching, split/lock rejection and frozen 26-chapter curriculum preservation. Passing code tests alone was **never** treated as a biological-accuracy result.

## Advancement gate and decision

- **G0 learner validation:** not performed.
- **G1 native-image audit:** automated native TIFF checks pass; user-local evidence not witnessed.
- **G2 classical segmentation:** implemented and executed on genuinely annotated images, but fails the generalized accuracy goal.
- **G3 annotation evaluation pipeline:** real original-data, published-test, locked-parameter and object-level scoring workflows completed; **scientific generalization gate not passed**.
- **Next intervention:** on *training data only*, compare explicitly documented polarity/channel/modality routes; then evaluate once on an **untouched external dataset** such as the separately released BBBC038 stage2 test (with careful ignored-image handling) or another verified independent microscopy collection.
- **Do not** improve the reported score by retuning against these same 65 test images. Never equate this nucleus dataset with validated exopher detection.

The frozen 26-chapter learner app, production `main` and its progress data are unchanged; this is a separate, unmerged, draft research advancement.
