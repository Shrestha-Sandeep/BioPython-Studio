# A03 research → annotated-instance tutorial → QA → iteration log

**Date:** 2026-11-14; **draft PR:** #60 stacked on A02 PR #59.
**Blueprint committed before code:** `docs/tutorials/A03_RESEARCH_BLUEPRINT.md`.

## Implementation and numerical evaluation

- 17 science-first A03 scenes with 17 original accessible SVG annotated-mask/matching diagrams, one withheld one-to-one matching prediction, reveal and separate unsolved transfer/delayed A03-REVIEW.
- Every scientific numeric example is run by real CPython NumPy/SciPy; changed inputs probe greedy assignment failures, IoU-threshold rejection, missed class/zero metric policy, specimen-group leakage, different annotation types and merged object maps.
- Key scientific result: two labeled reference instances can share the same foreground pixels as a single predicted instance (foreground pixel IoU 1.0) while one-to-one object counts differ. Capstone: invented merged candidate has pixel IoU 0.8 but object TP=0, FP=1, FN=2, F1=0 at cutoff0.5.
- Cardinality-first assignment at fixed qualified IoU threshold uses explicit `scipy.optimize.linear_sum_assignment` cost, not a misleading greedy maximum-IoU strategy.
- Source/annotation quality, false splits/merges, biological n and locked held-out groups are separate required scientific evidence.

## QA and correction

- Before CI, adjusted A02's old illustration-count test so it checks `DATA02` alone after addition of `DATA03`. No regression suites or genuine checks were removed.
- [GitHub Actions run 43633833124](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/43633833124): **SUCCESS**. Includes cumulative A00/A01/A02/A03 original illustration and exact native Python output tests, adversarial input tests and actual 390/1280px Chromium, P01 regression, frozen editor/localStorage/Apply/Prove/review safety.
- No demonstrated *human* learner retention, annotation quality or independence across genuine microscopy datasets. Successful synthetic code tests do not certify any biological accuracy.

**Verdict:** Technical GO for draft learner review, **HOLD** scientific claims and production merge. Next canonical chapter is **A05** (biological replicates, paired statistics and bootstrap uncertainty); A04 is conditional and is intentionally not treated as the next mandatory chapter.
