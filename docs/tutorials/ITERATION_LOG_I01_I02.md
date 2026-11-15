# BioPython tutorial cycle log — I01 and I02

Date: 2026-11-13
Base: feature/foundation-visual-explanations
Branch: feature/imaging-tutorial-cycle-i01-i02
Blueprint: docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md

## I01 — image arrays and provenance

**Status: GO for code and browser review; learner effectiveness not yet tested.**

- Audited canonical content/chapters/I01_COMPLETE.md (8 goals and capstone).
- Built a 16-scene chapter-level narrated tutorial and original diagrams of array shape, indexing, dtype, RGB and source identity.
- Kept real published microscopy figures distinct from synthetic arrays. Image decoding without a staged path is labelled conceptual; no invented image shape or detector intensity.
- Prediction pause: [row=2,col=1] on a synthetic 3×4 array, followed by independently validated output 9.
- First issue: 2×3 diagram showed zero-based *element positions* instead of actual sample values 1..6; corrected and retested.
- Browser test initially attempted to select microscopy I01 from a Python-only stage; fixed the test setup to switch stage before selection.
- Dedicated NumPy/Pillow output parity and mobile/desktop browser checks passed (GitHub Actions run 43405522177).

## I02 — traceable ROI cropping

**Status: GO for code and browser review; learner effectiveness not yet tested.**

- Audited canonical content/chapters/I02_COMPLETE.md (6 goals and capstone).
- Built a 17-scene chapter tutorial with source-indexed half-open ROI slicing, view/copy memory behavior, bound validation, explicit calibration units, declared TCZYX axes and synthetic TIFF-container inspection.
- Added ROI-highlighted numerical grids; prediction checkpoint masks the result until the following Reveal scene.
- First code QA identified an invalid capstone focus-line index (11 where the script had 10 lines); corrected.
- QA test setup referenced its dependency probe before initialization; corrected test construction.
- Browser test incorrectly expected I01's value 9 in I02, whose view-mutation result is 99; corrected per chapter.
- Visual QA found a brief aria-label on one SVG; changed diagram labels to explicitly identify scientific teaching values.
- Final GitHub Actions workflow 43406544777: **success**. It includes Node/Python checks, fresh NumPy + Pillow outputs, 25 I01+I02 original diagrams, source/provenance assertions, and responsive Chromium checks for both chapters.

## Scientific and product boundaries

- Source microscopy figures: published Witz/HPA PNG outputs; cannot be treated as original calibrated fluorescence data.
- The numerical examples are synthetic and explicitly labelled; neither chapter claims to segment or quantify these published images.
- The tutorial viewer is optional; Learn/Apply/Prove, stored progress and editor drafts remain separate.
- Browser voices may lack word-boundary events: all diagrams remain readable without animation.
- CI verifies internal correctness, not that a learner can independently perform unfamiliar scientific coding tasks.

## Decision

**GO to I03 research + blueprint cycle.** Do not merge the stacked branch to main before user review. No production deployment was performed.
