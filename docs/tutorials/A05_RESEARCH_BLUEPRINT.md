# A05 — Statistics for bioimaging without pseudoreplication: research-first teaching blueprint

Date: 2026-11-14. Source branch: `feature/advanced-tutorial-cycle-a03`. Development branch: `feature/advanced-tutorial-cycle-a05`.
Canonical: `content/chapters/A05_COMPLETE.md` (G01–G06, CAPSTONE, separate delayed REVIEW).
Local research pipeline: `projects/advanced/a05/analysis.py`, `projects/advanced/a05/README.md`.
Do not merge to main or alter UI-first-2 until learner approval.

## First-principles question

**What can a few Python lines actually enable?** A single microscope dataset may contain many field/cell rows but only a handful of independent worms. A publishable-looking p-value from pooled rows may be wrong even when the arithmetic is perfect. Build one end-to-end defensible *synthetic* experiment: correctly join metadata, preserve exclusions, collapse field measurements to independent subjects, use a declared paired/unpaired design, resample the **biological unit**, and export a unit-labelled estimate and uncertainty caveat. The generated viewer teaches and checks *software mechanics*, not independent replication, causal inference or statistically stable uncertainty.

## Verified resources and adapted insights

1. **Practical statistics for bioimage analysis — a guide to experimental design and data interpretation** (2026), https://pmc.ncbi.nlm.nih.gov/articles/PMC13286366/:  distinct experimental repetition and biologically meaningful effects/controls matter more than arbitrary significance; repeated microscope fields are not independent experiment repeats. **Adaptation**: depict fields as nested inside worms, and never use p-value prizes.
2. **Determining how many cells to average for statistical testing of microscopy experiments**, https://pmc.ncbi.nlm.nih.gov/articles/PMC11199906/: technical cells within the same sample generally do not constitute independent replicates. **Adaptation**: show equal-animal weighting versus pooled fields and downstream unit counts.
3. **Pseudoreplication in physiology: More means less**, https://pmc.ncbi.nlm.nih.gov/articles/PMC7814346/: naive cell-level tests can produce artificial significance. **Adaptation**: explicitly refuse field-level uncertainty intervals.
4. **A biologist's guide to planning and performing quantitative bioimaging experiments**, https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.3002167: use controls, appropriate sample design and transparent graphics. **Adaptation**: annotated animal-point figure data, units and exclusions before the final result.
5. Existing A05 CLI requires independent n >=3 per group or complete pair, prespecified design, audit, original file hashes and version evidence. Its percentile bootstrap is a computational tool, not a guarantee of credible CI with tiny n.

## Teaching sequence (18 stages with original source-linked scientific SVG)

| Scene | Canonical competency | Learner action / visualization |
|--:|--|--|
| 1 | G01 | Bigger picture: raw image fields → metadata → animal means → effect/uncertainty → audit |
| 2 | G01 | Correct field ID join, explicit missing/duplicate metadata |
| 3 | G01 | Duplicate metadata should halt or flag, never be silently overwritten |
| 4 | G02 | Six fields in two animals: unequal field counts and pooled mean bias |
| 5 | G02 | Compare per-animal mean, pooled field mean, and independent n |
| 6 | G03 | Preserve excluded observations and reasons before filtering |
| 7 | G03 | Recalculate means after documented exclusions, without deleting provenance |
| 8 | G04 | Matched before/after worms: paired difference, not independent samples |
| 9 | G04 | Split/incorrect IDs destroy valid pair designs; require complete pairs |
| 10 | G04 | **Prediction withheld**: compute paired mean difference for novel paired data |
| 11 | G04 | Reveal paired difference, showing worm-level arithmetic |
| 12 | G05 | Bootstrap samples **worms** with replacement, never image fields |
| 13 | G05 | Seeded bootstrap with percentile CI, explicitly tiny-n demonstration only |
| 14 | G05 | Small n and narrow CI are not automatically biological certainty |
| 15 | G06 | Chart the **animal points** and group means, label y-axis and units |
| 16 | G06 | Two-level graphics show within-worm fields without falsely increasing n |
| 17 | CAPSTONE | Reproducible per-animal effect, explicit field_n/animal_n, audit and no causal claim |
| 18 | CAPSTONE | Independent changed dataset and local-run transfer, NO solved Prove/review |

Prediction target is not in scene 10 narration, output or visual values. Scene 11 provides a single reveal. Any hard-coded synthetic output must reproduce in fresh native CPython. Do not reveal the answers to A05-REVIEW.

## Statistical contract

- Experimental unit = actual independent randomized/treated/repeated unit (e.g. worm or independently treated culture), **not necessarily the animal ID**; explicitly flag shared plate, batch and litter confounding.
- Metadata joining must reject duplicated keys and flag missing field IDs. Exclusions are not eliminated from the audit.
- Unequal field counts: pooled mean weighs the over-imaged worm more heavily, while subject-level mean gives each independent worm one point.
- Paired design requires the same independently identified pair measured in both conditions. Bootstrap complete **pair differences**; unpaired designs resample control and treated independent animals **within groups**, separately, with replacement. Cannot swap the two designs after seeing the result.
- Percentile bootstrap numeric examples with fixed seed and explicitly labelled insufficient sample size; never report a generalizable confidence claim based on invented n=2 or n=3.
- A statistical figure must state the biological unit, n, what is represented by dots, measurement units, and exclusion counts. No uncalibrated µm² claim or inferred molecular concentration.
- Every scene's code must be executable with real Python; demonstrate failure paths and new inputs.
- A05 exit gate per repo remains local real CSV, >=3 independently justified subjects per group or pairs, analysis.py results and actual clean checkout; CI is not human mastery.

## Engineering and QA

- New `src/tutorials/a05-data.js` integrated in `index.html` after A03 and before `p01-viewer.js`.
- Add 18 original vector diagrams `DATA05` to `src/tutorials/advanced-illustrations.js`. Each narration scene has a unique diagram or informative variation (subject hierarchy, pairing, box/per-animal chart, CI uncertainty). Use existing shared viewer, voice and highlights. No new permanent UI.
- Native Node suite `tests/a05_tutorials.test.mjs` verifies source goals, 18 scenes, hidden prediction, visual coverage, all executable CPython outputs and changed input experiments.
- Chromium browser suite `tests/test_a05_tutorial_browser.py` checks 390px/1280px, Learn-only, diagram, prediction hold/reveal, audio controls, untouched CodeMirror/localStorage, no Apply/Prove/review spoiler and no advanced navigation on ordinary route.
- Dedicated CI workflow with pinned dependencies, cumulative A00–A05 tests and source/real browser regressions. If failure: inspect job log, correct underlying issue, rerun. Do not equate green software QA to 9.5+/10 pedagogical quality.
- Keep PR draft, stacked on A03. After green, continue canonical A06, then A07; A04 conditional and not silently inserted.

GO for source-led tutorial generation. Scientific performance claim: NOT YET.
