# I13 — research blueprint for a source-aware end-to-end image-analysis tutorial

**Date:** 2026-11-13  
**Branch:** feature/imaging-tutorial-cycle-i13, stacked above I12 PR #48  
**Canonical:** `content/chapters/I13_COMPLETE.md` (I13-G01–G05 + CAPSTONE)  
**Method:** `docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md` and `assets/witz/CREDITS.md`.

## Source reconciliation before teaching

- Witz `07-Pipeline.ipynb`: https://github.com/guiwitz/PyImageCourse_beginner/blob/master/07-Pipeline.ipynb
- Witz human-protein-atlas rendering attribution and license already recorded in `assets/witz/CREDITS.md`: https://github.com/Shrestha-Sandeep/BioPython-Studio/blob/main/assets/witz/CREDITS.md
- Bundled source: **`assets/witz/fluorescence-single.png`** (87,150 bytes in the current repository), a **published rendered notebook figure**. Do not label it raw TIFF, calibrated fluorescence or validated nuclei.
- Original upstream TIFF resources were linked but are **not bundled** in this repository; honest figure-pixel analysis needs no invented biological identity.
- Pillow: https://pillow.readthedocs.io/en/stable/reference/Image.html ; `Image.open(...).convert("RGB")` yields decoded plot RGB values, not photometrically linear fluorescence.
- scikit-image labels: https://scikit-image.org/docs/stable/api/skimage.measure.html ; binary masks and `regionprops` give *candidate regions* only.
- Matplotlib `imshow` overlay: https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.imshow.html ; visibly distinguish original rendered RGB crop from computed binary overlays.
- Bioimagebook source-image caution: https://bioimagebook.github.io/ ; preservation, bit depth, calibration, segmentation evaluation and image provenance.

## Key design distinction

Earlier I01–I12 used isolated synthetic teaching arrays for numerical claims. I13 must **really load the credited PNG bytes from the checked-out repository** to demonstrate end-to-end file I/O, crop, threshold, connected-component labels and actual Matplotlib visualization, while explicitly prohibiting conclusions about raw channel intensity or confirmed nuclei.

The **narrated tutorial viewer** shows worked source code and static diagrams, not proof that this file is mounted into every browser/Pyodide runtime. State clearly: runnable examples using `Path('assets/witz/...')` assume a local repository checkout; in the browser learning editor, first import/upload or use supplied `image_path` and verify the file is present. Never invent a universal browser filesystem path.

## Scientific and teaching objections

1. NumPy uint8 overflow: safe subtraction requires deliberate float conversion, while handling negative results and missing values. Row/column ROI order must match y/x.
2. Metadata joins can multiply or lose rows; duplicate image IDs and missing metadata must be audited, never fixed by picking a random record.
3. Per-unit plots show each assumed biological unit and measurement source; never turn screenshot pixels into independent replicates.
4. Raw/calibrated/validated flags must be **False** for the bundled PNG. An image shape and RGB values are not raw acquisition metadata.
5. Source figure can include labels, rendering adjustments, saturation and composited channels; segmentation of the plot detects **rendered RGB candidates**, not real nuclei. If a relative filepath is unavailable, the code must fail explicitly with a useful path instruction.
6. A 48×48 ROI must be crop-bound-checked against actual source dimensions, avoid arbitrary guessed biological region, report strict threshold, channel and connectivity. Numbers printed in code are computed from decoded file, never quoted as biological counts.
7. Overlay must be generated using real `imshow`/contours (real Matplotlib) and source copied/preserved, with a provenance report. No MP4 export or extra UI clutter.

## 18-scene proposed storyboard

| Scene | Goal | Concept |
|---:|---|---|
| 1 | G01 | Destination: one source-controlled image-to-audit workflow, not biological result |
| 2 | G01 | uint8 overflow and float-cast subtraction |
| 3 | G01 | Correct row/column ROI order and half-open slices |
| 4 | G02 | Duplicate image-ID detection |
| 5 | G02 | Explicit many-to-one join failures and unmatched image IDs |
| 6 | G03 | Real per-unit scatter plot instead of one misleading bar |
| 7 | G03 | Axis units and caveats on same figure |
| 8 | G04 | Source provenance manifest and calibration limitations |
| 9 | G04 | Threshold sensitivity and why better-looking is not validated |
| 10 | G05 | Actual local Pillow `Image.open` of credited PNG with source path check |
| 11 | G05 | Rendered PNG RGB channel / color representation, no raw data |
| 12 | G05 | Actual first 48×48 ROI and half-open indexing |
| 13 | G05 | Real ROI threshold and 4-neighbor label candidate regions |
| 14 | G05 | Predict **synthetic** thresholded candidate count; output withheld |
| 15 | G05 | Reveal synthetic count; keep separate from computed PNG ROI counts |
| 16 | CAPSTONE | Load actual repo PNG, generate candidate labels + real Matplotlib overlay |
| 17 | CAPSTONE | Hash/source, ROI, threshold, exclusions, raw_calibrated=False, verified=False |
| 18 | CAPSTONE | Independent 48×48 ROI + changed threshold and evidence critique |

At least 14 scientifically useful original diagrams, including source-coordinate ROI, binary threshold, labels, overlay, file-level provenance. Published Witz/HPA PNG preview is a separately credited **source figure**. Its displayed sample should not be re-authored with an image generator or misrepresented as a raw source.

## QA gates

- Exactly five canonical I13 goals + capstone, one withheld synthetic prediction and final transfer; no other internal chapter IDs.
- Full real CPython tests MUST decode `assets/witz/fluorescence-single.png` using Pillow, crop 48×48, calculate actual binary threshold, verify 4-neighbor labels, produce true figure bytes and show unchanged source.
- Data file is part of checkout; if missing, code fails with an explicit message rather than pretending to analyze it.
- Numeric synthetic snippets and displayed outputs must match clean CPython; real-image code can show dynamically calculated values instead of unverifiable hardcoded numeric claims.
- Changed-input tests: uint8 overflow, reversed ROI axes, missing filename, alternate ROI positions, alternative threshold and empty candidate-mask cases.
- Browser mobile 390px/desktop 1280px, narration and preview, checkpoint and diagram, editor/localStorage/Apply-Prove isolation.
- If any gate fails, correct the code or blueprint and fully rerun; record correction in iteration log. No merge to production until user review.
- **Explicit limitation:** Passing the technical tutorial does not reproduce a calibrated human protein atlas localization study nor demonstrate learner mastery.

**Next real scientific step:** use original 16-bit TIFF/OME-TIFF, metadata/axes, calibration, source IDs, reference annotations and independent biological units as described in `projects/real-microscopy/START_HERE.md`.
