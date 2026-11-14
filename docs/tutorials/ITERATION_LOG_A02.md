# A02 research → scientific implementation → QA → revision log

**Date:** 2026-11-14. **Draft PR:** #59, stacked on A01 PR #58.  
**Blueprint first:** `docs/tutorials/A02_RESEARCH_BLUEPRINT.md` grounded in Bankhead bioimage analysis and scikit-image threshold, label and watershed documentation.

## Implemented

- 17 science-first narrated scenes with 17 original scientific SVGs, canonical A02-G01–G05 and capstone, one withheld prediction at scene 9 and reveal at 10, and unsolved independent transfer.
- Real NumPy/SciPy/scikit-image output for background cast/clip, bright/dark foreground, border polarity *heuristic*, explicit 4-connected regions vs 8-connected diagonals, minimum-area exclusion, seeded watershed, sensitivity IoU and changed-pixel fraction.
- Scientific provenance: invented pixel fixtures only, candidate segmentation not biological ground truth, no claim that between-mask agreement proves accuracy.
- Frozen Learn-only viewer, ordinary 26-chapter route, code editor, saved progress, Apply/Prove and delayed review remain intact.

## QA and correction

- During diagram implementation, detected that 5-row pixel arrays would overflow the 520×190 SVG viewport. Changed pixel-cell sizing and centered diagrams inside the fixed frame before browser QA (commit `58c5bfe`).
- The A01 regression originally counted all diagrams after `DATA01` and would falsely fail when A02 diagrams were added. Scoped it to the A01 array only (commit `5db065f`).
- Dedicated [GitHub Actions run 43633232768](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/43633232768): **SUCCESS**. Includes exact actual Python outputs and eight changed-input validations plus A00/A01/A02/P01 mobile+desktop real Chromium browser checks, prediction and no-spoiler safeguards.
- No downstream scientific accuracy claim from automated technical testing. Existing source-aware local A02 TIFF pipeline and annotation-based A03 validation remain separate experimental gates.

**Verdict:** Technical **GO for draft learner review**, scientific **NOT VALIDATED**. Next canonical chapter A03 is mandatory for meaningful error evaluation before making biological segmentation-performance claims. No production promotion or merging.
