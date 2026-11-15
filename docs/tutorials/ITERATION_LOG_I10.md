# I10 iteration log — explicit synthetic tracking and segmentation validation

**Date:** 2026-11-13  
**Blueprint:** `docs/tutorials/I10_RESEARCH_BLUEPRINT.md` (created before implementation)  
**Review branch:** `feature/imaging-tutorial-cycle-i10`, draft PR #46  
**Verdict:** GO to I11; production main unchanged.

18 scenes map all six canonical I10 goals and capstone: calibrated (synthetic) displacement, near-tie tracking ambiguity, source-linked annotation contracts, pixel IoU versus background-dominated accuracy, one-to-one Hungarian candidate/reference matching, radius rejects, object F1 and threshold sensitivity. One prediction checkpoint hides pixel-mask IoU; last challenge asks for independent changed input. 16 original diagrams bring imaging totals to 138.

All reference masks are explicitly synthetic author-created training labels. Neither matched coordinates nor high IoU is presented as real manually validated microscopy. The course states that radius rejection *after* Hungarian assignment may be suboptimal compared with unmatched-aware assignment and does not certify biological identity.

## QA

GitHub Actions runs **43520959081** and **43520976677** finished **SUCCESS**: real NumPy/SciPy numerical output parity and changed-input edge cases including empty masks and zero assignments, diagram registration and hidden answer checks, mobile 390px/desktop 1280px tests, browser TTS/preview, published images, no editor/localStorage mutation and Learn/Apply/Prove isolation. No failed-test changes were necessary.

The downstream evidence still required is held-out human annotation, correct physical calibration/frame time, validated object correspondence and independent learner transfer. Automated green is not equivalent to biological or pedagogical validation.
