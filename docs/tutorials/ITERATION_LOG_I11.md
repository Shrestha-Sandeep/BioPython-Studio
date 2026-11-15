# I11 tutorial iteration log — biological units, pairs and acquisition batches

**Date:** 2026-11-13  
**Research-first blueprint:** `docs/tutorials/I11_RESEARCH_BLUEPRINT.md`  
**Review branch:** `feature/imaging-tutorial-cycle-i11`, draft PR #47  
**Decision:** GO to I12; remain separate from production.

## Scope

18 scenes across all seven canonical I11 goals and capstone, 16 original diagrams (imaging library reaches 154), one withheld matched mean-difference prediction, and independent transfer. The narrative explicitly distinguishes field counts from independent treatment-assigned units, audits incomplete matched pairs and exclusions, contrasts pooled versus equal-unit means and demonstrates why full condition–batch confounding is not solved by within-batch centering.

## Iteration and QA

1. Initial workflow run **43521482590**: all real Pandas numerical and changed-input tests passed, but the semantic coverage test failed because it asserted the literal word `confounded` in narrated text while the lesson used `confounding`. No scientific computation failed.
2. Strengthened the test to inspect `say + note` with a case-insensitive `confound` stem rather than weakening the concept or altering its pedagogical content (commit **858c2f654**).
3. Follow-up complete GitHub Actions run **43521703096**: **SUCCESS**, including real Pandas output parity, mobile 390px/desktop 1280px browser navigation, source-figure loading, 154 semantic diagrams, withheld answer, editor/localStorage and Apply/Prove isolation.

The lesson assumes designated IDs are independent units only for its synthetic illustration. Real sampling designs, animal/donor independence, unrecorded acquisition confounders and learner performance require separate evidence.
