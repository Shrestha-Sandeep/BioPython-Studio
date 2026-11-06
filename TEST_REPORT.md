# BioPython Studio — QA status

**Verified:** 6 November 2026. **Scope:** development continuation `feature/v3-foundations-collections`, stacked on `feature/v3-learning-engine-pilot`, based on frozen v3 commit `87b87a9` and 61-lesson baseline `c6aaae5`. Production and curriculum PR #1 remain unmerged.

## Repository reconciliation

- `main` is `615f59b`, the earlier applied-Python implementation.
- `feature/complete-61-lesson-curriculum` is `c6aaae5`.
- Draft PR #1 targets that 61-lesson branch from `docs/frozen-v3-curriculum` (`87b87a9`). Its quality run #8 and Vercel check succeeded before implementation.
- The existing pilot branch initially pointed to the exact frozen-design commit. Development continues there. No syllabus, competency ID, prerequisite or optional-route change was required.

## Automated verification

- **250 CPython tests passed**, covering all historical assessments, wrong-answer rejection, actual Matplotlib output, companion notebook execution with a controlled image response, frozen 156-node graph, 28 activities and all three delayed-transfer input sets. Notebook mocking is limited to its existing controlled image response; it is not evidence of a live notebook HPA download.
- **11 Node state tests passed:** complete 25/61 legacy fixtures, byte-preserved snapshots, no inferred mastery, real local prerequisites for optional paths, assistance-aware evidence, delayed review, fresh-prompt requirements, and lossless conflict archives.
- JavaScript syntax and whitespace checks passed.
- **Live Chromium pilot walkthrough passed all 28 activities** using a real Web Worker and Pyodide 0.28.3, including real `help`, intentional traceback, NumPy import and execution. There is no mocked Worker or simulated Python in this test.
- Live pilot QA passed saved-state reload, hint-assisted versus independent evidence, delayed review with an advanced test clock, a second fresh transfer, completed-prompt replay prevention, genuine HPA image retry without draft loss, 1440/1024/390-pixel overflow checks and a 61-ID export/import → legacy-editor handoff. Clock advancement tests scheduling mechanics, not actual human retention.
- Existing 61-lesson UI regression tests passed at 1440/1024/390 pixels, including truncated-image rejection/recovery. Those older UI tests intentionally mock their Worker and image fixtures; they are supplementary to the live pilot test.

Reproduce with the commands in [README.md](README.md). CI includes both the deterministic assessment tests and the live browser walkthrough. The prior pilot commit `1d39cfa` passed GitHub quality run #11; its usability follow-up `b1603d6` passed quality run #13. The live test depends on CDN/publisher network availability.

## Baseline deployed-runtime and microscopy evidence

The protected Vercel preview associated with PR #1 was tested in Chromium. The authenticated Vercel connector retrieved its deployed HTML, CSS and JavaScript; those exact assets were relayed to Chromium at the deployment origin because unauthenticated navigation redirects to Vercel login. Runtime and package CDN downloads, Worker execution and HPA CORS requests remained real, without synthetic replacements.

- Cold-start specimen task executed successfully across three inputs; completion survived reload.
- Real shape, Gaussian filtering, connected-component labeling, FASTA parsing and logistic-classifier tasks succeeded across their three changed inputs, exercising NumPy, SciPy, scikit-image, Biopython and scikit-learn.
- Original publisher images decoded over CORS:

| HPA source | Bytes | Decoded dimensions |
|---|---:|---:|
| 8346 / 22_C1_1 | 245,282 | 1728 × 1728 |
| 46658 / 784_B12_1 | 266,575 | 2048 × 2048 |
| 23394 / 182_H7_1 | 375,883 | 1728 × 1728 |

The live pilot separately loaded and decoded the first original HPA image and recovered after an intentionally failed request. Managed-browser TLS trust was scoped to the environment’s installed proxy CA public keys; general TLS validation was not disabled.

## Release limits and next increment

- Direct authenticated browser navigation to the protected Vercel preview remains an access limitation. The artifact-relay test verifies deployed application assets and execution, but is not an unrestricted deployment-navigation sign-off.
- Pilot effectiveness and real elapsed delayed retention still need learner evaluation. Three finite transfer prompts are available per activity; exhausted prompts do not recycle into new retention claims.
- The other 128 competencies remain planned. Optional sequence/NGS and ML readiness is implemented from the graph; those v3 lessons are not claimed as shipped.
- Existing scikit-image deprecation warnings concern the historical `min_size` API. They do not fail the current checks; migration should be a separate compatibility increment because the replacement has different boundary semantics.
- Next: evaluate the pilot, finish G2 migration/prerequisite UX with learner feedback, then extend foundations and the notebook/venv/Git handoff in the unchanged default route. Calibrated/annotated microscopy and scientific inference remain later release gates.

HPA JPEG composites are visualization/array teaching assets, not calibrated raw fluorescence. Candidate regions are not validated biological objects. BioCompute and AppDeploy ImageLab were not changed.

## Pilot usability review follow-up

Repository review found and corrected three concrete issues: a failure on changed input 2/3 previously displayed the first input’s output and hid the actual traceback; importing into a fresh landing record could archive rather than restore its saved progress; and due delayed reviews had no visible reminder. The UI now shows the failing input/traceback, restores untouched records and saved position, and presents a compact due-review action. Provided values use Python `True`/`False`/`None` spelling. Imports are blocked while a Python run is active to avoid changing the record receiving that run’s result. These are automated usability findings, not a completed human learner evaluation.

## Foundation continuation verification

The first 15 activities and every frozen competency/legacy ID remain unchanged. Thirteen activities follow the next default-route entries, with authored biological records, independent blank-editor checks and three fresh delayed prompts each. Tests cover empty inputs, inclusive QC boundaries, list-copy preservation, tuple typing across JavaScript/Python transport, sentinel stop/skip rules, nested-key errors, stable set output and unequal-length zip rejection.

The real-browser walkthrough runs all 28 activities and reloads the completed first-15 state before entering the continuation. Notebook QA runs analysis before setup (NameError), setup then analysis, edits without executing (stale output), reruns setup (updated output), restarts the actual Worker/runtime and verifies missing state, then downloads and validates the notebook with nbformat and executes its code cells in a clean CPython namespace. Ordinary assessments cannot read notebook state. Ctrl+Enter runs the focused notebook cell. The real Jupyter GUI itself and learner effectiveness are not claimed as verified.

The next implementation increment is function parameters/defaults, scope, docstrings, errors/imports/files and the prerequisite-safe local environment/Git handoff. Optional sequence/NGS and ML content remains separate from the default microscopy route.

Activity feedback can record clarity, explanation needs or technical blockers with optional notes. It stays local and travels in progress exports; feedback does not award evidence. Browser QA uses an explicitly labeled automated feedback fixture, not human evaluation data.
