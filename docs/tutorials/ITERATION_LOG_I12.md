# I12 tutorial iteration log — uncertainty and honest statistical inference

**Date:** 2026-11-13  
**Blueprint:** `docs/tutorials/I12_RESEARCH_BLUEPRINT.md` created before code  
**Review branch:** `feature/imaging-tutorial-cycle-i12`, PR #48  
**Verdict:** GO to I13, not production promotion.

22 narrated scenes span nine I12 goals and capstone: independent biological n, SD/SEM, skewed summaries, Student-t 95% interval, seeded unit-level percentile bootstrap, paired vs Welch, original-order Holm and Bonferroni, actual biological-unit scatter/trajectories, JSON/CSV provenance and explicitly labeled SD errorbars. One withheld plotted-n prediction and independent transfer. 18 original diagrams, cumulative 172 through I12.

## Quality iteration

1. Initial GitHub Actions run **43522174335**: all displayed fresh Python outputs, bootstrap and changed-input numeric cases passed; the diagram-inventory gate detected 17 images versus the blueprint's promised 18.
2. Added a *nonredundant* explicit frequentist coverage-versus-posterior interpretation diagram for I12 scene 7 (commit **7ddaacb9ad77504b9a8007bf03f567c17fbc0336**). Did not reduce diagram expectation.
3. Complete GitHub Actions runs **43522472573** and **43522480946**: **SUCCESS**, including scientific Python/Pandas/SciPy/Matplotlib parity, 172 diagram inventory and withheld answer, mobile 390px/desktop 1280px browser navigation and original preview, unchanged code editor/localStorage/Apply-Prove boundaries.

## Scientific evidence limits

Every example is synthetic and assumes its units genuinely independent; the course does not claim a real treatment effect. CI frequentist coverage is explained accurately. Seeded bootstrap is resampled at unit level but cannot create new experiments, and small-n percentile CI uncertainty is disclosed.

Learner mastery and real-world study design are untested. Review before merging.
