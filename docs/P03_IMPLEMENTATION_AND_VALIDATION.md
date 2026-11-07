# P03 — Implementation and scientific-validation record

**Chapter:** P03 — Filter recorded microscope fields  
**Learner integration branch:** `integration/p03-ui-first` (draft PR #16)  
**Authoring branch:** `content/p03-complete-v1` (draft PR #15)  
**Frozen UI baseline:** `feature/ui-first-ide-workspace`, unchanged  
**Production `main`:** unchanged  
**Status:** technically implemented; must pass final integration CI and a later human learning trial.

## Source-of-truth and curriculum

Master Blueprint v2.1 and frozen 26-chapter / 156-competency route remain authoritative. Exactly seven P03 skills are assigned, in dependency-respecting teaching order:

- P03-G01 (016): indexing and slicing field-ID lists
- P03-G02 (017): copying, appending and removing without mutating source records
- P03-G03 (018): tuple records and safe unpacking
- P03-G04 (012): iteration, acceptance counts and explicit missing observations
- P03-G05 (013): range, enumerate and display numbering
- P03-G06 (014): bounded while loops
- P03-G07 (015): continue/break with explicit exclusions

The capstone and later-return exercise are transfer activities with **no additional competency IDs**.

## Teaching content

The 7,000-plus-word original chapter manuscript accompanies short in-IDE explanations with editable real Python, prediction reveals, optional walkthroughs, progressive Apply hints, a new-input Prove task, debugging guidance and a distinction between numeric zero and missing None. A credited Witz/Human Protein Atlas figure is contextual; real calibrated microscopy analysis starts later in the curriculum.

The capstone constructs `field_qc_report.py`: accepted_ids, rejected_ids, missing_ids and invalid_ids; duplicate-ID handling; source-preserving input; a bounded scan; an explicit STOP marker and a traceable summary. The independent transfer reverses pair order and uses END. A later recall task changes the stop marker to DONE.

All inputs are synthetic and cutoff rules are illustrative. Neither a passing quality score nor a field count is a defensible biological effect or number of independent biological replicates.

## App integration contract

The app uses the existing frozen Python workspace, original CodeMirror, same pinned Pyodide Worker, original tabs and existing responsive geometry. The chapter selector gains P03. Progress keys:

- P01: `biopython.p01.v1` (unchanged)
- P02: `biopython.p02.v1` (unchanged)
- P03: `biopython.p03.v1` (new)
- Last selected chapter: `biopython.course-selected.v1` (unchanged)

The P03 learner build contains `content/p03/lesson.json` and `content/chapters/P03_COMPLETE.md`, **not** `content/author/p03_reference.json`.

## QA gates

1. Content branch: `python -m unittest discover -s content/tests -v`, including P03's 85 real CPython author reference cases.
2. Integration branch: `python tests/test_p01_import.py && python tests/test_p02_import.py && python tests/test_p03_import.py`.
3. Node syntax and frozen UI unit tests remain green.
4. `python tests/browser_smoke.py` verifies the original frozen shell with the lesson adapter intentionally excluded.
5. `python tests/test_p01_browser.py` and `python tests/test_p02_browser.py` remain green, protecting earlier real-Python functionality, source storage and exports.
6. `python tests/test_p03_browser.py` runs all 85 P03 changed-input checks in real Pyodide, rejects a hardcoded answer, exercises the capstone and delayed return, exports a standalone Python script executed by CPython, preserves P01/P02 drafts and checks mobile/desktop layouts.
7. Three-chapter GitHub CI green on the exact final commit and Vercel READY for the matching isolated preview deployment.
8. A real learner tries P03 and reports clarity, effort, mistakes and whether the independent field-QC task can be completed without copying an answer.

## Technical and epistemic limits

- The Pyodide Worker is not a hardened execution security sandbox; internet is required on first use.
- Public browser assertions are visible practice checks, not secure independent assessment or automated scientific review.
- Local timestamps and progress can be modified and are not reliable scientific evidence.
- Synthetic ID and focus data do not justify claims about raw-image quality, biological replication, fluorescence measurements or publication-ready QC.
- Passing automation verifies implementation behavior only. The intended 9.5+/10 teaching quality requires actual learner use, which remains unmeasured.

## Release decision

Keep draft PRs #15 and #16 open until final CI and visual QA are green. Do not modify production `main` or the frozen UI branch. P04 should follow the completed chapter sequence only after considering P03's actual learning experience.
