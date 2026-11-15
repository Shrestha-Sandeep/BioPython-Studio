# I05 tutorial iteration log — threshold sensitivity and source integrity

**Date:** 2026-11-13
**Branch:** feature/imaging-tutorial-cycle-i05
**Based on:** feature/imaging-tutorial-cycle-i04
**Blueprint:** docs/tutorials/I05_RESEARCH_BLUEPRINT.md
**State:** GO for review after automated QA; no claim of real-world segmentation validity.

## Research and content

Reviewed the canonical six I05 goals and capstone, Witz 04-Thresholding, Bankhead thresholding (especially sensitivity and bias), official scikit-image filtering/threshold APIs and Microscopy Network Basel's threshold→clean→measure sequence.

Created 16 narrated scenes with one prediction break and independent changed-input challenge, covering:
- percentile background estimation and explicit clipping; 
- Gaussian versus median filtering, including the danger of deleting a genuine small feature;
- strict versus inclusive candidate-pixel thresholding;
- histogram-based Otsu as an initial candidate rather than ground truth;
- threshold perturbations and candidate-mask intersection-over-union;
- a source-preserving synthetic report with documented background, selected pixel counts and mask overlap.

Added 11 original visual explanations to the existing NumPy/Matplotlib library (61 diagrams total across I01–I05), including side-by-side numerical pixel arrays and their *binary candidate masks*. Witz/HPA microscopy remains credited published **rendered PNG context**. All measurable numerical arrays are synthetic.

## QA and revisions

- Initial in-file audit caught invalid focus-line references in the Gaussian-versus-median and Otsu snippets. Corrected them before CI.
- Added NumPy/scikit-image fresh CPython output parity for every code/output scene, changed-input threshold checks and edge-case empty-union IoU behavior.
- Added diagram tests asserting strict >4, >8 and >10 candidate counts (4,2,1) and checkpoint withholding.
- Browser QA covers full I01–I05 tutorial navigation on 390px and 1280px layouts, the I05 one-pixel prediction reveal, real attributed preview image loading, no extra controls, no editor/local progress mutations, and hidden tutorials during Apply/Prove.
- **Green CI:** GitHub Actions workflow run **43409758773** on commit **25d0ebd7c66a08771e8af71666864f868978f27a** passed all focused tests.
- No production release or merge was requested or carried out.

## Review

**GO for code review; learning effectiveness remains unmeasured.** A candidate mask cannot certify true nucleus identities, original intensity calibration, correct segmentation, object counts or biological replicate independence. The next chapter is I06 — morphology, connected component labels, border exclusion and touching objects. Before implementation, read its exact shipped goals and research against Witz and scikit-image APIs.
