# I06 — Research-driven chapter blueprint: cleaning and labeling candidate regions

**Created:** 2026-11-13
**Base:** feature/imaging-tutorial-cycle-i05
**Implementation:** feature/imaging-tutorial-cycle-i06
**Canonical chapter:** content/chapters/I06_COMPLETE.md — 7 existing goals + capstone.
**Parent quality policy:** docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md.

## Research and scientific guardrails

- scikit-image 0.26.0 morphology API: https://scikit-image.org/docs/stable/api/skimage.morphology.html — opening vs closing, connectivity-dependent components and updated remove_small_objects semantics.
- scikit-image 0.26.0 release changes: https://scikit-image.org/docs/stable/release_notes/release_0.26.html — max_size replaces deprecated min_size in small-object removal with different equality semantics. This tutorial instead uses explicit regionprops area checks to avoid API ambiguity.
- scikit-image measure/segmentation APIs: https://scikit-image.org/docs/stable/api/skimage.measure.html ; https://scikit-image.org/docs/stable/api/skimage.segmentation.html — 4-/8-neighbor labels, clear_border, regionprops, marker watershed.
- Witz 05-Filtering and 06-Regions notebooks: https://github.com/guiwitz/PyImageCourse_beginner
- Bankhead, Introduction to Bioimage Analysis: https://bioimagebook.github.io/

**Critical scientific objection:** Algorithms label connected *pixels/voxels*, not verified nuclei. Morphology can destroy legitimate small features; a border-clearing rule can eliminate valid cropped objects; watershed marker choice can fabricate object splits; 2D projections can make separate z objects overlap. The analysis must report parameters and excluded candidates. True biological cell count requires independent annotation validation.

All numerical examples are explicitly synthetic. Credited HPA/Witz figures are published *rendered notebook PNGs*, not raw microscopy files. They are illustrative context only; no measured object count is assigned to them.

## One coherent story

A preliminary threshold yields a noisy binary candidate mask. We must decide connectivity, cleanup and size cutoffs; note rejected and border-touching regions; split touching areas with declared watershed seeds; test 2D versus 3D connectivity; then encapsulate a reproducible candidate-label audit with parameters and unchanged source.

Canonical goals:
- I06-G01 clean candidate masks with binary morphology
- I06-G02 label connected candidate components with 4 vs 8 connectivity
- I06-G03 filter candidate regions by explicit pixel-area range
- I06-G04 audit and exclude border-touching components
- I06-G05 demonstrate marker watershed and seed sensitivity
- I06-G06 prove XY projection cannot recover z-separated candidates
- I06-G07 encapsulate segmentation in a source-preserving, parameterized function
- I06-CAPSTONE report verified=False, counts, exclusions, source limitations

## Chapter scene inventory

Target 16–18 scenes, narratively coherent with one prediction checkpoint.

1. Credited microscopy context and why a threshold mask is only a candidate.
2. Binary opening vs closing: separate isolated pixels and fill gaps.
3. Changing a footprint can erase a true small object.
4. Label a diagonal synthetic mask with connectivity=1.
5. Repeat with connectivity=2 and compare counts.
6. Prediction: how many separate 4-connected components exist? (no revealed result).
7. Reveal connected-component counts.
8. Regionprops pixel-area measurement and explicit filtering of small components.
9. Border-touching candidate and clear_border effect; document exclusions.
10. Crop changes border definition; no automatic validation.
11. Marker-controlled watershed: two seeds, two labels, but not two proven nuclei.
12. Bad marker count: one marker collapses candidates; seed choices control result.
13. 2D XY max projection merges distinct z-plane candidates.
14. 3D connectivity with explicit z/y/x semantics; no biological identity claims.
15. A reusable threshold-and-area candidate-label function.
16. Capstone: synthetic labels, parameters, rejection list, verified=False and unchanged raw source.
17. Independent changed-input transfer task (no finished solution).

If an additional demonstration is necessary, adjust the blueprint before implementing it, rather than padding with redundant diagrams.

## Implementation and QA gates

- Exactly 7 Gxx goal IDs + capstone; at least one scene per goal, one checkpoint with empty output, independent final transfer.
- Use genuine NumPy/SciPy/scikit-image code only. Labeling connectivity=1 in 2D means 4-neighbor; connectivity=2 means diagonal inclusion. Do not generalize face adjacency incorrectly for 3D.
- All runtime output should be verified by fresh CPython on pinned scikit-image 0.26.0; test changed masks, marker counts, diagonal contact and empty/border-only cases.
- Do not rely on ambiguous library default connectivity or deprecated min_size semantics. Use explicit >= area in regionprops.
- Report border filtering on same candidate mask and quantify excluded labels.
- Marker watershed needs a specified distance transform and real seeded markers; no fabricated detector measurements.
- Distinguish 2D XY projection from full ZYX connected-label topology.
- Original display PNG cannot be used to claim a verified measured nucleus count. Never label a candidate as "cell" without qualification.
- Add only 10–13 meaningful diagrams depicting masks, labels, connectivity, border changes or z continuity. No answer leaks in checkpoint diagrams.
- Test desktop/mobile 390/1280 widths, accessible SVG labels, narrator controls, independent Apply/Prove and preservation of editor/local progress.
- If any mismatch or scientifically misleading figure appears, revise narrative and blueprint and rerun QA. Production remains unchanged until user review.

**Acceptance:** GO only after complete numeric/browser QA; no automatic assertion of learner mastery.
