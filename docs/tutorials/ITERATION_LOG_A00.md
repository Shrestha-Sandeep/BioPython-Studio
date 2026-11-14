# A00 research → implementation → QA → revision log

**Date:** 2026-11-14  
**Draft:** PR #57 stacked on L03 PR #56.  
**Blueprint:** `docs/tutorials/A00_RESEARCH_BLUEPRINT.md` was committed first.  
**Teaching artifact:** 16 A00 scenes, 16 original accessible SVG diagrams, real Python outputs, protected independent transfer and actual desktop exit boundary.

## Results

- Verified exact A00-G01–G05 and CAPSTONE coverage, one withheld prediction and separate delayed A00-REVIEW.
- CPython output parity of every reported numeric example; changed-input tests for root containment, subject counts, boundary/missing QC, canonical config and SHA-256.
- QA iteration 1: the initial GitHub Actions run `43631772810` failed, correctly detecting an **error in a changed-input test**: `def ok(...): return ...; print(...)` ran the print as part of the function body. Corrected test-source scope using an actual newline in commit `c870727`. The tutorial's numeric printed examples were green in that initial run.
- [Successful GitHub Actions run 43631831638](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/43631831638): Node, original JS diagrams, real CPython output, real Chromium phone + desktop, original P01 viewer regression, unchanged CodeMirror and localStorage, no Apply/Prove or delayed-review solution leakage.
- The original L03 numeric test from `main` was reconciled into this stacked branch, avoiding silent regression of the predecessor.
- **Human mastery / independent local research validity remain untested.** Actual local venv, packages, source TIFF/CSV, independently executed pytest, clean checkout and Git commit are required.

**Verdict:** Automated technical GO to draft learner review; **do not merge into production** or imply a local research gate was passed.

**Next:** A01 original microscopy axes, uint16 integrity, unverified physical calibration, exact source digest. Fresh blueprint before code.
