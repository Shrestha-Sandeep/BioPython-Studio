# I09 tutorial iteration log — region properties and synthetic signal interpretation

**Date:** 2026-11-13  
**Blueprint:** `docs/tutorials/I09_RESEARCH_BLUEPRINT.md`, committed before code  
**Branch:** `feature/imaging-tutorial-cycle-i09` and draft PR #45  
**Decision:** GO for content review, not biological validation or production release.

## Content

18 scenes map I09-G01–G06 and capstone, 15 numerical examples and one withheld ratio prediction. Topics: label area/centroids, explicit squared pixel scale, aligned intensity_image footprints and shape errors, outside-mask means and empty complement, zero-variance Pearson, threshold-conditional overlap, puncta candidate local maxima, border sensitivity, row/column distances and a source-preserving report.

16 new diagrams increase the cumulative library to 122 (I01–I09). Published Witz/HPA rendered figures remain separate context; no numbers were attributed to them.

## Automated QA

Two GitHub Actions workflows **43520327397** and **43520351578** completed **SUCCESS** including JS syntax, scene/canonical-goal schema, all displayed numerical results run in fresh NumPy/SciPy/scikit-image 0.26 CPython, changed-input tests (no candidates, empty denominators, constant correlation, peak border, distances), 122 diagram checks, mobile 390px/desktop 1280px browser navigation, hidden prediction and reveal, published figure loading, editor/localStorage and Apply/Prove isolation.

No source-figure measurements, fluorescent protein concentration or molecular interactions were claimed. Real object validation, channel crosstalk controls, unassisted learning and manual voice QA remain outstanding.

**Go-forward:** I10 tracking/segmentation validation research, while keeping I09 unmerged until learner review.
