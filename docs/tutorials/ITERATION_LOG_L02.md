# L02 tutorial research–implementation–QA iteration log

**Date:** 2026-11-14  
**Research first:** `docs/tutorials/L02_RESEARCH_BLUEPRINT.md`.  
**Draft PR:** #55 stacked above L01 #54. Production unchanged.

## Cycle and correction

- Researched and implemented canonical L02-G01–G04 + CAPSTONE: DummyClassifier baseline, transparent linear regression, train-scaled regularized logistic predictions, shallow decision trees and a same-holdout comparison. All inputs and scores are explicitly synthetic.
- Added 18 narrated scenes, one withheld dummy-majority prediction and a genuinely independent transfer, with 18 original SVG scientific visuals.
- **Caught and corrected a numerical display issue during review:** scikit-learn linear floating predictions can print `6.999999999999998`, `20.999999999999996`, and `3.9999999999999996` even for ideal synthetic linear data. Changed the code examples to round their printed numeric predictions to two decimals rather than overstate exact binary floating arithmetic. Commit `11fcc8f1`.
- Changed-input Python tests verify majority predictions ignore X, altered train class, linear extrapolation, C-regularization effects and constrained tree predictions. Chromium/Playwright tests at 390 and 1280px cover the hidden/revealed baseline checkpoint, regression and logistic visuals, voice controls, and isolation from editor, saved state, Apply/Prove and delayed review.
- **GitHub Actions `Biological machine-learning narrated tutorial QA`, run 43585379461: SUCCESS.** Cumulative N01–N04 and L01 tests also passed.

**Verdict:** GO for draft learner review, not deployment. Numeric code/output parity is established in tested scikit-learn 1.9.1; no authentic classification performance, probability calibration or biological causal inference is established.

**Next:** L03 grouped cross-validation, class-aware metrics and Brier score diagnostics. Research blueprint must precede code.
