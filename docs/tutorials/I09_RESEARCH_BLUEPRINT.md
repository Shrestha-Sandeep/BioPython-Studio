# I09 — research-first quantitative signal tutorial blueprint

**Date:** 2026-11-13  
**Branch:** feature/imaging-tutorial-cycle-i09, based on I08 PR #44  
**Canonical:** `content/chapters/I09_COMPLETE.md` (six goals, one capstone)  
**Method:** `docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md`

## External references and non-negotiable scientific interpretation

- Witz, `06-Regions.ipynb`: https://github.com/guiwitz/PyImageCourse_beginner/blob/master/06-Regions.ipynb . A motivating example of measuring properties from labeled regions; teaching PNGs are display figures, *not raw calibrated microscopy*.
- scikit-image 0.26 `regionprops` and `regionprops_table`: https://scikit-image.org/docs/stable/api/skimage.measure.html . Background label 0 is ignored. Image-label axes must agree; pixel area, centroid y/x and mean intensity use declared label footprints and channel arrays.
- scikit-image `peak_local_max`: https://scikit-image.org/docs/stable/api/skimage.feature.html . Min distance, threshold, border exclusion and plateaus affect reported peaks. Since skimage 0.18, equal-height neighbors within suppression radius may produce an arbitrary single coordinate; do not claim deterministic biological punctum identification.
- SciPy pairwise `cdist`: https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.distance.cdist.html . Input coordinates must consistently represent y/x, and calibration must be declared before interpreting physical distances.
- Image-analysis essentials: https://bioimagebook.github.io/ . Contrast/brightness values and colocalization must be interpreted with corrections, segmentation validation, channel crosstalk controls and biological units, not only a Pearson coefficient.

### Critical misconceptions to preempt

1. **Candidate region is not verified nucleus**. Segmentation/labeling errors propagate into geometry, intensity and "nuclear/cytoplasmic" comparisons.
2. **Complement of a candidate nucleus mask is not the cytoplasm.** A whole-frame complement contains background and other cells; call it "outside candidate" not cytoplasm unless a second cell mask is actually provided.
3. **Pearson r measures pixel association, not molecular interaction.** Shared background, saturation, bleed-through, ROI selection, misregistration, and tiny sample size can create apparent association.
4. **Peak detection ≠ puncta detection** until validated against human annotations and controls. Report threshold, spacing, border policy, coordinate order and missed peaks.
5. **Distances are pixels until real scale exists.** 2D XY proximity does not prove 3D molecular interaction; coordinate convention must be explicit.
6. **Experimental units:** pixels, regions and fields cannot be counted as independent biological replicates.

## One motivating arc

I08 concluded with source-preserving field tables. Here, a fictional micrograph consists of separate **synthetic** channel intensity matrices and an already **supplied** candidate-label image. Learn how to compute signal measurements without losing object IDs, guard denominators and spatial scales, and produce a report that states what it cannot establish.

No measurements are attributed to the Witz/HPA rendered example shown at the opening.

## Scene inventory (target 17–19 scenes)

| Scene | Goal | Teaching distinction / prediction | Visual |
|---:|---|---|---|
| 1 | G01 | Published teaching context versus synthetic region measurements | Original image + scope |
| 2 | G01 | `regionprops` label, area and y/x centroid | Label grid → table |
| 3 | G01 | Scale converts pixel area using square, not linear factor | Pixel/µm² cards |
| 4 | G02 | `regionprops(..., intensity_image=...) ` exact footprint means | Array overlay |
| 5 | G02 | Channel axes and shape mismatch are explicit failures | Mask/channel alignment |
| 6 | G03 | Inside-candidate mean versus whole-frame outside-candidate mean | Two masks |
| 7 | G03 | Empty complement/zero denominator → None | Edge-case guard |
| 8 | G03 | Predict inside/outside ratio on a new input, output withheld | Unknown answer |
| 9 | G03 | Reveal stable two means and explicitly stated ROI | Output and denominator |
| 10 | G04 | Pearson of two synthetic channel pixel series | Correlation scatter |
| 11 | G04 | Constant channel and background inflation/bleedthrough caveats | Scientific warning |
| 12 | G04 | Threshold-based overlap fraction: conditional on ROI and cutoff | Two synthetic masks |
| 13 | G05 | `peak_local_max` threshold and min_distance | Peak locations |
| 14 | G05 | Border exclusion removes edge maxima | Before/after |
| 15 | G06 | y/x coordinates and Euclidean distance with `cdist` | Points vs centers |
| 16 | G06 | Physical-scale multiplication; no z-distance inference | px→µm |
| 17 | CAPSTONE | Reproducible label+intensity+distance candidate report, verified=False | Audit flow |
| 18 | CAPSTONE | Independent unfamiliar-input transfer task | Unsolved |

Use at least 13 nonredundant diagrams, favor original array masks and coordinate visuals over repetitive text cards. Exactly one `checkpoint:true`, empty output, followed by reveal. Every runnable snippet from clean Python, truthfully matching fresh scikit-image 0.26/SciPy/NumPy.

## QA contract

- I09-G01–G06 and CAPSTONE each covered, 17–19 concise learner-paced scenes.
- Region area/centroid must be y/x and pixel-squared; do not accidentally infer physical scale.
- Use explicit `intensity_image` same shape as labels, or show caught error type; no raw image-dependent hidden environment.
- Handle empty inside, empty outside, zero denominator and constant-channel Pearson without fabricated NaN as strong evidence.
- `peak_local_max` examples avoid plateau tie ambiguity, use `exclude_border` explicitly and verify coordinates across input variants.
- `cdist` input shape and y/x coordinate order specified; no hidden assumptions about segmentation validity.
- Every diagram matches code-derived synthetic values. Published PNGs never treated as raw measured intensity.
- Full existing browser QA at 390px and 1280px: image loads, narration, withholding/reveal, no editor/localStorage changes, Apply/Prove isolation.
- Log all failures and fixes, rerun; draft review only, no production merge or claims of mastered science.

**Verdict gate:** Automated QA can establish tutorial correctness and software behavior on specified synthetic cases, but not actual biological image analysis accuracy or retained learning.
