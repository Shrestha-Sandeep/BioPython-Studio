# N04 tutorial research–build–QA iteration log

**Date:** 2026-11-14  
**Blueprint committed before implementation:** `docs/tutorials/N04_RESEARCH_BLUEPRINT.md`.  
**Draft review:** PR #53 stacked above N03 #52; `main` and frozen UI unchanged.

## Cycle 1 — research, chapter implementation, technical evaluation

- Research reconciled real SAMtools flagstat alignment flags versus the lesson's simplified one-source-read-one-category representation, Pandas `pivot_table` explicit `sum` and `fill_value=0`, and the limitations of assigned-count CPM versus differential expression.
- Implemented 20 scenes mapped to canonical N04-G01–G05 + CAPSTONE, 20 original local SVG descriptions, one withheld two-gene CPM prediction and an independent changed-input transfer.
- Added auditable checks for mapped-any/uniquely mapped denominators, zero-based half-open coverage and clipping, overlapping depth versus covered bases, duplicate sample-feature count aggregation, zero-filled absent rows and zero-assigned-count CPM `None`.
- Cumulative N01–N04 CI runs Node test contracts, genuine Pandas-backed CPython printed-output parity and changed-input cases, plus 390/1280px Chromium/Playwright tutorial navigation, SVG visuals, prediction/reveal and editor/storage/Apply/Prove/review independence.
- **GitHub Actions `Sequence narrated tutorial research-loop QA` run 43584287734: SUCCESS.** All steps passed on N04 PR #53 head `807afb65`.

## Review outcome

**GO for draft learner review** after passing code, source-boundary and responsive browser gates. This is not evidence of actual RNA-seq mapping quality, statistical power, correct transcript annotation, trained learner mastery or biological differential expression. Missing feature counts filled as zero represent the *declared teaching policy*, not a universal data interpretation.

Production remains unchanged. **Next:** L01 — group-safe biological machine learning, with new blueprint before implementation.
