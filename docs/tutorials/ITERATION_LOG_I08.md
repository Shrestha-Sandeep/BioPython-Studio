# I08 tutorial iteration log — safe joins, sampling units and descriptive figure exports

**Date:** 2026-11-13  
**Blueprint:** `docs/tutorials/I08_RESEARCH_BLUEPRINT.md`, committed before implementation  
**Branch:** `feature/imaging-tutorial-cycle-i08`; stacked draft PR #44  
**Verdict:** GO for code/content review; production `main` unchanged.

## Scope

19 narrated scenes map I08-G01–G08 + capstone, including many-to-one join validation, `MergeError` on conflicting metadata keys, unmatched left join auditing, per-specimen summaries versus field-level pseudoreplication, reshaping, timestamp/category contracts, CSV with text IDs, descriptive scatter, SVG and PNG export, and a source-preserving audit. One withheld melt-shape prediction and a genuinely independent transfer task. 16 original I08 diagrams increase the imaging library to 106 across I01–I08.

All numerical records are synthetic, not measurements extracted from credited Witz/HPA notebook figures. Scatter point counts do not prove independent biological replicates.

## QA iteration

1. Initial GitHub Actions checks **43519535683** and **43519500221**: 44/45 JS/node unit tests passed, exact-output test failed on the Matplotlib y-limit scene. Under NumPy 2.3.5, printed NumPy scalar tuples appeared as `(np.float64(0.0), np.float64(8.0))` instead of bare `(0.0, 8.0)`. The numerical limits were correct, but output was less readable and environment-dependent.
2. Tutorial code changed to `tuple(float(v) for v in ax.get_ylim())` (commit **6546d334d2defe9d566285a059ee73e66f7ba385**) to normalize display to true Python floats. Test expectation remained `(0.0, 8.0)`.
3. Rerun GitHub Actions **43519737670**: **SUCCESS**. Real fresh Python output parity, changed-input null-key joining/merge validation, diagram count/checkpoint privacy, 390px and 1280px browser navigation, published-image loading, editor/localStorage isolation, and Apply/Prove boundary all passed.
4. No deletion of source measurement records, no invented inferential tests or p-values, no MP4/download feature.

## Remaining evidence limits

Validate human interpretation, user-selected TTS voice quality and genuine scientific replication design separately. A synthetic source report and passing CI do not establish independent learner competence or publication-ready analysis.

**Decision:** GO to I09. Keep stacked PR #44 unmerged for review until the complete tutorial sequence is approved.
