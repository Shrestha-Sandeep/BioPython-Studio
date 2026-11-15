# L01 tutorial research–build–QA iteration log

**Date:** 2026-11-14  
**Research blueprint committed first:** `docs/tutorials/L01_RESEARCH_BLUEPRINT.md`.  
**Draft PR:** #54 stacked on N04 #53. Production `main` and frozen UI unchanged.

## Cycle 1

- Researched scikit-learn grouped splits, fit/transform leakage and SimpleImputer/Pipeline recommendations. Defined a synthetic four-animal, two-field-per-animal scientific story without making claims of biological prediction validity.
- Built 17 scenes covering G01–G04 + capstone; one withheld train-only imputation median prediction, independent new-input transfer and 17 original SVG diagrams for fields/animals, group overlap and imputation.
- Extended the existing Learn-only narrated viewer to display ML chapters without changing learner progress persistence or leaking solutions to Apply/Prove.
- Added real scikit-learn CPython exact-output and changed-input tests: subject-class inconsistencies, leaked groups under a reproducible field-level split, whole-animal GroupShuffleSplit, unchanged training median despite test extreme, and Pipeline train-only scaling. Ran 390px and 1280px Chromium/Playwright tests with editor/localStorage/Apply/Prove/delayed-review isolation.
- **GitHub Actions `Biological machine-learning narrated tutorial QA` run 43584824209: SUCCESS** on L01 PR #54 commit `8dffcf69`. This includes cumulative N01–N04 sequence tutorial checks.

**Verdict:** GO for draft learner review. Python outputs and responsive UI are technically verified; actual learner competence, generalization to new microscope sessions, biological n adequacy and deployed model performance are not established by this testing. Draft remains unmerged.

**Next:** L02 (dummy majority classifier, linear regression, logistic pipeline and shallow tree), beginning with research blueprint.
