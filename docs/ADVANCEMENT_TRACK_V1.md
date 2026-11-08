# BioPython Studio — Advanced Research Lab (implementation contract)

**Branch status:** G0/G1 preparation only; NOT a released or validated advanced course.
**Parent:** frozen 26-chapter/156-competency pilot at PR #21, commit bf488eb.
**Architecture:** optional A00–A07 research projects, with conditional A04 and X01–X05 electives. The existing P/I/N/L course is untouched.

## Why advance?

The foundation curriculum has working Python and introductory image analysis, but browser passing checks are not evidence of independent biological validity. Advanced work must explicitly address source images, axes, provenance, segmentation accuracy, annotation uncertainty, biological units and clean local reproduction. Do not add deep-learning tools simply to make the app look more sophisticated.

## Planned path

| Gate | Project and output | Objective pass condition | State |
|---|---|---|---|
| G0 | Independent learner pilot of P01, I05, I13, N01, L01; full technical inventory | Documented real learner attempts, no regressions | Prepared, not passed |
| G1 | A00 local-Python bridge; A01 native-image literacy | Actual local Python; truthful OME axes/scale audit with 16-bit round-trips | Initial working slice; local user evidence pending |
| G2 | A02 classical segmentation with parameter sensitivity | Reproducible masks/measurements, real failure cases | Native implementation and synthetic QA; real-image learner gate pending |
| G3 | A03 annotations, detection matching and held-out validation | Object-aware metrics and group-disjoint holdout | Native benchmark/annotation loader implemented; independent real-data evaluation pending |
| G4 | A05 biological statistics, A06 reproducible batch software | Correct animal/field units, clean checkout output equivalence | Not started |
| G5 | A07 independent unknown-dataset capstone | Blind interpretation and reproducible outputs | Not started |
| G6 | Conditional A04 3D/tracking; X01 Fiji/napari; X02 ML; X03 NGS; X04 data management; X05 LLM | Only after a demonstrated use case | Deferred |

## Fixed safety constraints

1. No modification of existing P01–P06, I01–I13, N01–N04, L01–L03 goals, frozen UI, old localStorage keys or IDs 001–156.
2. No production/main merge or deployment without explicit release review.
3. TIFF is not synonymous with raw microscopy. OME scale is metadata *declaration*, not independent proof of calibration. JPEG-derived Witz/HPA teaching images remain uncalibrated.
4. Synthetic test fixtures prove code behavior but do not validate biological segmentation or model accuracy.
5. Public client-side lesson files are never secure hidden examinations.
6. Unfamiliar datasets and independent annotations are prerequisites to G3 onward.
7. If a dataset contains only manual counts, it supports count error, not pixel IoU.
8. The advanced stage must not clutter the existing UI; postpone UI integration until projects are technically and educationally proven.

## First implemented slice

See `projects/advanced/a00/START_HERE.md` for the independent desktop setup and `projects/advanced/a01/README.md` for the original TIFF/OME-TIFF image audit. The A01 tool refuses ambiguous T/C/Z selections, preserves original data bytes, returns SHA-256 and native pixel statistics, and never claims verified physical calibration. It uses the existing numpy + tifffile stack.

## What remains unverified

- No person has yet passed the G0 independent learner pilot.
- No external/independent annotated biological dataset has yet been evaluated by this new track.
- No physical microscope calibration or vendor-format support has been established.
- No real Windows or macOS local venv/Git session has been witnessed or recorded.
- CI/native tests must be green for exact commit before calling even this early slice technically verified.

## Evidence policy

E0 exposure; E1 guided code; E2 independent changed inputs; E3 blind annotated-data transfer; E4 fresh-environment reproduction + delayed attempt; E5 new real dataset with documented scientific limitations. No automatic E3–E5 badges.

Never assign a numerical 9.5/10 teaching quality from automated CI.

## A02/A03 native research components (development branch)

- [A02 scientific segmentation project](../projects/advanced/a02/README.md): Gaussian/background handling, Otsu/local/manual thresholds, morphology, optional watershed and source-preserving native TIFF candidate labels with region geometry.
- [A02 parameter sensitivity](../projects/advanced/a02/sensitivity.py): run fixed variant configurations on unchanged source pixels and compare candidate counts and foreground mask instability; this is **not** an annotation-based accuracy score.
- [A03 annotated-data benchmark](../projects/advanced/a03/README.md): BBBC038-style separate per-nucleus PNG annotations, explicit group and split manifest, IoU-thresholded one-to-one object matching, pixel versus object metrics, cyan/red QC overlays, frozen calibration parameters and held-out-only evaluation.
- Python tests produce **synthetic** PNG/TIFF/masks and validate contracts, source protection, error cases and exact metrics. These are engineering tests, not demonstrated real biological segmentation performance.
- The BBBC038 archive is **not bundled**; the user must download its original images and target masks, verify experimental groups, and run the benchmark before asserting G3 scientific completion.

A00–A07 remains the intended route; no advanced frontend stage is released until research workflows and independent teaching quality are demonstrated.

## A02b — real modality/foreground-polarity diagnostic (8 Nov 2026)

See [the full original-image benchmark report](A02B_REAL_MODALITY_TEST_2026-11-08.md) and [A02b's independent-learning instructions](../projects/advanced/a02b/README.md).

- 40 retrospective **BBBC038 training images**: image-macro object F1 0.6904 fixed versus 0.7730 input-only polarity. This is **not held-out evidence**; dark foreground selected on 7 / 40.
- External **BBBC039 official test** (50 original 16-bit images): image-micro object F1 0.8413, image-macro F1 0.8390, mean foreground pixel IoU 0.8142; polarity route made **no change at all** (bright on all 50).
- BBBC039 has partial source overlap with BBBC038 and a different nucleus boundary encoding; no independent experiment-level generalization established. Actual source images/masks are not bundled.
- A04 is **still reserved for 3D/time-lapse**; the new modality-experiment label is A02b to keep the blueprint consistent.
- Keep the advancement PR stack draft. The frozen 26 chapters, frontend and original progress keys have **not** changed.

