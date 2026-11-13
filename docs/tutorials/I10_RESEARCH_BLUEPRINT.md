# I10 — segmentation and tracking validation tutorial research blueprint

**Date:** 2026-11-13  
**Branch:** feature/imaging-tutorial-cycle-i10 (stacked above I09 PR #45)  
**Canonical:** `content/chapters/I10_COMPLETE.md` (G01–G06, capstone)  
**Course method:** `docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md`

## References and design limits

- Witz, `09-Advanced.ipynb`: https://github.com/guiwitz/PyImageCourse_beginner/blob/master/09-Advanced.ipynb ; published teaching images are not raw images or verified annotation masks.
- SciPy `cdist`: https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.distance.cdist.html ; nearest detection is only a distance hypothesis.
- SciPy `linear_sum_assignment`: https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.linear_sum_assignment.html ; solves global minimum-cost one-to-one assignment, not biological lineage, and may force an implausible match unless radius cutoffs and unmatched handling are explicit.
- scikit-image segmentation metrics: https://scikit-image.org/docs/stable/auto_examples/segmentation/plot_metrics.html . Compare pixel/object quality against manually annotated reference where available. Synthetic tutorial truth is not human-annotated biological ground truth.
- 2025 Nature Methods 3D segmentation benchmarking: https://www.nature.com/articles/s41592-025-02887-w . Matching candidate objects to annotations can use overlap and one-to-one assignment, but detection F1 and pixel IoU measure distinct types of error.

## Scientific failure modes that must be shown

1. Unmatched frame detections are not confirmed identities; simply taking a nearest neighbor can swap crossing objects. Two close nearest costs must trigger an ambiguity warning.
2. Displacement in pixels becomes calibrated speed only with valid pixel size and actual frame interval.
3. "Truth" here is an **authored synthetic mask**. Real manual annotations need source image ID/hash, annotator, dimensionality, coordinate order, blinded protocol and disagreement policy.
4. Pixel accuracy can look excellent with almost all background; report IoU/Dice, precision/recall with declared both-empty behavior.
5. Pixel overlap is not object-level TP/FP/FN. Hungarian one-to-one matching plus explicit distance radius (or annotated IoU overlap) prevents one detection counting as multiple true objects. The algorithm alone does not validate a match.
6. Threshold parameter perturbations should be presented even when they worsen the result, not selectively optimized against the same evaluation set.
7. No inference about real exopher biology or cell identity; output is a synthetic validation report.

## Unified story and scene plan (18 scenes)

| Scene | Goal | Distinction illustrated |
|---:|---|---|
| 1 | G01 | Destination: from candidate mask to independently validated evidence, not prettiest segmentation |
| 2 | G01 | y,x frame displacement, then px→µm and time conversion |
| 3 | G01 | Two positions without confirmed correspondence cannot establish a trajectory |
| 4 | G02 | Candidate distance matrix and gap between nearest and runner-up |
| 5 | G02 | Ambiguity flag for near tie; avoid forced link |
| 6 | G03 | Annotation schema image ID, annotator, shape, axes |
| 7 | G03 | Reject shape/coordinate mismatch before scoring |
| 8 | G04 | Pixel IoU vs misleading background accuracy |
| 9 | G04 | Predict pixel intersection/union for perturbed mask — withhold output |
| 10 | G04 | Reveal pixel IoU, explicit empty-mask rule |
| 11 | G05 | One-to-one assignment versus greedy duplicates |
| 12 | G05 | Radius cutoff rejects implausible assignment |
| 13 | G05 | TP, FP, FN, object precision/recall/F1 |
| 14 | G06 | Compare plausible threshold shifts against fixed synthetic truth |
| 15 | G06 | Artifactual corner pixel changes score |
| 16 | CAPSTONE | Full source-preserving candidate IoU + matched-speed report |
| 17 | CAPSTONE | Trace reasons an apparently successful score is not valid biology |
| 18 | CAPSTONE | Independent transfer on novel mask and coordinates |

Exactly one prediction checkpoint, with no answer in code output or diagram until the next scene. 12–16 scientifically useful diagrams with array pairs, correspondence matrix, threshold sensitivity rather than generic cards. Preserve editor and progress. Keep all runnable code outputs verified by fresh Python NumPy + SciPy. Use `linear_sum_assignment` with one-to-one radius **after** assignment and disclose its inability to handle unmatched costs globally without dummy assignment. No invented real segmentation truth.

## QA and release decision

- All 6 Gxx goals + capstone, independent changed-input challenge, code-line focus indices valid.
- Actual outputs match clean Python; changed frames/positions, tied matches, zero-detections, both-empty masks, radius rejection, threshold perturbations.
- Diagrams sourced from synthetic arrays and coherent predictions.
- Playwright full browser chapter checks mobile 390px/desktop 1280px, untouched localStorage/editor and Learn-only tutorial access.
- Fix all discrepancies and rerun, record in `ITERATION_LOG_I10.md`, no production merge before user review.
- Real biological validation and human learning effectiveness remain untested.
