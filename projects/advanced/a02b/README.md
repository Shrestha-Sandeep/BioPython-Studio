# A02b — Understand why microscopy segmentation changes across modalities

**Status:** a native scientific-Python research exercise. It is not an in-app chapter or a verified general-purpose image classifier.

## Biological problem

A nucleus can look bright against a dark fluorescence background, or dark against a brightfield/histology background. If a threshold assumes the wrong foreground polarity, a technically valid mask can segment the **background** instead of the cells. This was observed in the real BBBC038 test failures: some fields had zero correct object matches despite reasonable foreground pixel coverage.

An additional complication: true native 16-bit images can span a different dynamic range from a rendered RGB JPEG/PNG. Do not reduce them to display-normalized 8-bit arrays before quantitative analysis.

## Skills and prerequisites

Prior: P05–P06 and I01–I06/I09–I13. New focus: source-aware channel choice, unverified modality heuristics, masking failures, no annotation leakage and transfer between experiments.

## Learn → Apply → Prove

### Learn — Predict before running

Consider (a) an 8-bit image whose border is near 240 and whose nucleus pixels are around 30; (b) a native 16-bit fluorescence image with background near 50 and nuclei near 30,000. Which pixels should count as foreground in each image? Why should the dtype maximum not be silently replaced by a per-image percentile?

Read `modality.py`: `inspect_intensity` chooses dark foreground if an unsigned image's border median exceeds **55% of the dtype maximum**, else bright. This is a fixed, human-readable **heuristic**, not a known-optimal threshold, calibrated intensity or biologically validated modality classification. RGB inputs use an explicit *derived luminance* image, which is never suitable for recovering absolute fluorescence.

### Apply — Investigate deliberate failure cases

In local Python, import `inspect_intensity` and `segment_routed`. Load a source image and compare these with the fixed `SegmentConfig` from A02. Use the *same* parameters and native source pixels. Inspect candidate overlays; do not call objects nuclei without reference annotations.

Investigate at least four image regimes: dark nuclei / bright background, bright nuclei / dark background, dense fluorescence where >50% of image is foreground, and low-contrast/saturated/uneven-illumination images. Mark where the simple border-intensity rule fails.

### Prove — Independent evaluation

1. Fix the complete preprocessing, routing rule, segmentation parameters and object-IoU definition **before opening** an unfamiliar source file.
2. Run the original method and the routed variant on that image without tuning either from its annotation.
3. Compare object-level F1 **and** foreground pixel IoU **against suitable independent expert masks**. Separate merges/splits from false positives.
4. Report how many images the router sends to dark versus bright, and whether any route changes the result.
5. Preserve original 16-bit pixels and source SHA; record the reference annotation convention and image/experiment source.

A passing unit test is *not* a passing transfer. If the new source lacks verified independent annotations, report only candidate segmentation and sensitivity.

## Real results and limitations

- **BBBC038 stage1 test:** previous fixed bright-Otsu/watershed image-macro F1 0.529, object-micro F1 0.385. The router is **not retuned on this previously examined test**. The observed dark-nucleus polarity failures motivated this training-stage exercise.
- **BBBC039 official test:** 50 native 16-bit Hoechst fields and released color-coded expert annotations. The predeclared intensity router selected **bright in all 50 images**. It therefore **did not improve** the fixed baseline. Both gave object-micro F1 **0.8413** and image-macro foreground IoU **0.8142**. This is not an experiment-disjoint external benchmark: Broad explicitly states that a small fraction of BBBC039 images occur in BBBC038.
- **BBBC038 original training images only:** `probe_bbbc038_training.py` is a retrospective diagnostic after seeing previous errors, not held-out evidence. It must not be used to claim improved generalization.

The datasets also use **different expert mask encodings**. BBBC039 has color-code-1 nucleus interiors and special 2/3 boundary codes, so its IoU values must not be treated as a clean controlled comparison against BBBC038's individual per-nucleus binary target masks.

## Decision gate

Retain this heuristic **only as an instructive baseline**. If its retrospective training improvement is small or inconsistent, do not expand its complexity; move to an explicit learned or validated modality-routing method only when additional independent dataset evidence justifies the effort.

A04 remains the reserved optional *3D/time-lapse* advanced chapter in the frozen advancement blueprint. This modality experiment is named **A02b** deliberately, to avoid changing the promised A04 syllabus.

## Provenance

- [BBBC038](https://bbbc.broadinstitute.org/BBBC038) — original stage1 training and published stage1-test annotations
- [BBBC039](https://bbbc.broadinstitute.org/BBBC039) — original native TIFF and color-mask dataset; metadata split defined by Broad
- [Official BBBC039 mask decoding gist](https://gist.github.com/jccaicedo/15e811722fca51e3ae90e8b43057f075) — source explanation of mask class representation

No Broad images, masks or scientific Python reference book prose are committed to the application.
