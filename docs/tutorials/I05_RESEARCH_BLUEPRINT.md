# I05 — Research and tutorial blueprint: thresholding without false objects

**Date:** 2026-11-13
**Branch:** feature/imaging-tutorial-cycle-i05
**Parent:** feature/imaging-tutorial-cycle-i04
**Canonical chapter:** content/chapters/I05_COMPLETE.md (6 goals and capstone).
**Process:** docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md

## Research and critical design

- Guillaume Witz, *Image Processing for Beginners*, 04-Thresholding notebook: https://guiwitz.github.io/PyImageCourse_beginner/04-Thresholding.html — manual threshold, histogram, Otsu and combined candidate masks.
- Pete Bankhead, *Introduction to Bioimage Analysis*, thresholding: https://bioimagebook.github.io/chapters/2-processing/3-thresholding/thresholding.html — threshold selection bias; global threshold can systematically merge, erode or miss objects; Otsu assumptions matter.
- scikit-image filters reference: https://scikit-image.org/docs/stable/api/skimage.filters.html — gaussian, median, threshold_otsu interfaces.
- Microscopy Network Basel preprocessing and segmentation: https://microscopy-network-basel.github.io/mnb-image-analysis/book/image_processing_book.html — source image → preprocessing → candidate segmentation → measurements, not a validated cell count.

**Main scientific misconception to prevent:** A thresholded Boolean mask is a *pixel-selection result*, not identification of biological objects. A histogram-derived threshold is not automatically more accurate than manual choice, and smoothing can erase biological detail.

Use the credited bundled Witz/HPA fluorescence figure only as **published rendered PNG context**. A line of tutorial code may load it when image_path refers to the actual staged file, but *never claim output from an unprovided image*. All runnable numerical arrays must be explicitly synthetic.

## One story

A researcher has a noisy numerical image. Estimate a documented background, compare smoothing and impulse removal, threshold consistently, inspect an automatic Otsu candidate, vary threshold by an explicit amount and report how many *pixels* differ. The outcome is an **auditable candidate mask**; no cell segmentation claim.

## Canonical goal coverage

- I05-G01 — estimate and subtract background, preserve original and document percentile
- I05-G02 — Gaussian smoothing with explicit sigma and float conversion
- I05-G03 — median versus Gaussian; impulse noise and edge loss
- I05-G04 — strict threshold and equality boundary
- I05-G05 — compare Otsu candidate to declared manual cutoff; review assumptions
- I05-G06 — threshold sensitivity and mask intersection-over-union
- I05-CAPSTONE — honest rendered-pixel threshold audit; synthetic demonstration and future credited PNG file path

## Scene plan: 16 steps

1. Published real Witz/HPA microscopy context, no numerical code
2. Percentile background estimator on synthetic values
3. Clip subtraction while preserving original input
4. Gaussian smoothing with specified sigma, showing changed central peak
5. Median removes a synthetic isolated impulse
6. Compare filter effects and scientific loss
7. Strict threshold Boolean mask and selected pixel count
8. Boundary equality (strict vs inclusive)
9. Prediction checkpoint: how many pixels survive a stricter threshold? (no output/answer)
10. Reveal threshold-dependent candidate counts
11. Otsu for two-class synthetic intensity example
12. Manual vs automatic threshold; numerical comparison, not truth
13. Threshold sensitivity across two or three cutoffs
14. IoU between two candidate masks, with explicit denominator
15. Integrated synthetic candidate-mask report and scientific limitations
16. Independent transfer: changed input, background model, masks, sensitivity, error diagnosis

At least one original visual of source numerical intensities and Boolean mask, another of threshold sensitivity. Do not fill 16 scenes with redundant cards just to meet a count. Strict code/output agreement, one checkpoint only.

## QA gates

- 6 exact goal IDs + I05-CAPSTONE; 16 scenes, 1 checkpoint and an independent transfer task.
- 100% executable examples with output tested under fresh CPython NumPy and scikit-image (pin API-compatible version), plus changed-input tests.
- All displayed masks, background-subtracted arrays, Otsu thresholds and IoU ratios exactly match Python computations.
- Never present a true pixel in an image mask as an independently detected cell or biological replicate.
- No threshold chosen after seeing experimental groups unless an independently justified policy is given.
- Browser widths 390px/1280px; exact chapter/goal selection, image provenance, prediction/reveal, voice controls, preserved editor/progress state and no tutorial shown in Apply/Prove.
- Original Witz credits preserved; conceptual file examples have no invented output.
- Failures trigger revision and full rerun. CI success is an engineering claim only; actual understanding requires unassisted learner transfer.

**Decision rule:** GO only when numerical parity, scientific truth, and browser QA pass; production main remains frozen.
