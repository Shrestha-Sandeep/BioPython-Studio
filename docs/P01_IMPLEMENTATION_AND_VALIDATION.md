# BioPython Studio — P01 release-readiness record

**Chapter:** P01 — Your first scientific Python program  
**Implementation branch:** `integration/p01-ui-first-pilot`  
**Content-authoring branch:** `content/p01-complete-v1`  
**UI baseline:** `feature/ui-first-ide-workspace`, preserved unchanged  
**Status:** chapter implementation complete; technical checks required to be green at the head commit; **human learning validation still outstanding**. Do not merge to production automatically.

## What is implemented

- Seven complete, original mini-goals with canonical v3 competencies `001`–`007`, without reassigning IDs or expanding the curriculum.
- In-IDE Learn / Apply / Prove instruction: concept explanations, prediction questions and on-demand answers, investigation prompts, walkthroughs, debugging challenges, practical scientific cautions, relevant examples and optional progressive Apply hints.
- A verified, already-bundled Witz/Human Protein Atlas fluorescence *figure* for context (see `assets/witz/CREDITS.md`), clearly distinguished from raw calibrated image data.
- Real Python through a version-pinned Pyodide Web Worker with actual stdout and tracebacks; changed-input *public* practice checks.
- `P01-CAPSTONE`: a reusable specimen-report script with different Apply and Prove inputs, runnable checks, downloadable `specimen_report.py` including sample input assignments, and locally saved scientific reflections.
- `P01-REVIEW`: an additional unfamiliar return task whose checks can be attempted after a delay. The client distinguishes early vs ≥24-hour practice using local timestamps, but **does not automatically confer retained mastery**.
- Contextual failure diagnostics for NameError, TypeError, ValueError, SyntaxError and calibration problems, without exposing author-side solutions.
- Independent per-goal/per-phase code drafts and reflection preservation, without overwriting the historical `biopython.ui-first.v1` draft store.
- Responsive lesson reader bounded within the existing UI shell; no change to the frozen application architecture.

## Technical evidence required for sign-off

1. Content source branch: run `python -m unittest discover -s content/tests -p 'test_p01_quality.py' -v`. This runs reference solutions on changed inputs and checks coverage, capstone, later retrieval, scientific caution and the chapter manuscript.
2. UI integration branch: run `python tests/test_p01_import.py`. This verifies 7/7 competency IDs, chapter content contract, capstone and review presence, and **absence of author answer keys**.
3. Frontend regression: run the frozen-shell Node tests and `python tests/browser_smoke.py`. The latter intentionally blocks the new P01 adapter to verify that the original shell still behaves as before.
4. Actual P01 browser: run `python tests/test_p01_browser.py` with Playwright Chromium installed. Must verify real Pyodide execution, traceback, changed-input success/failure, capstone, saved reflection, actual exported-script CPython execution, delayed-return classification, preservation of existing drafts, responsive phone/desktop layout, and no browser exceptions.
5. GitHub Actions `P01 UI-first integration` and `UI-first frontend checks` both green **on the same integration HEAD**, with `p01-full-chapter-qa` screenshot artifact available.
6. Vercel preview READY for the same commit (not evidence of usability or of a science-valid result).
7. **Human trial gate:** use P01 without viewing author reference answers; note problems in clarity, time to first output, misconceptions, hints, difficulty and the independent capstone. Only this can establish the claimed quality of the learning experience.

## Scientific and learning limitations

- All P01 numerical inputs and calibration factors are synthetic. HPA/Witz PNGs provide visual context and **must not** be treated as raw measurable fluorescence.
- Imaging fields are not biological replicates. P01 does not teach full image segmentation, TIFF/OME axes, controlled input rejection, or valid inferential statistics; those are later missions.
- Public browser test assertions are inspectable and cannot guarantee secret grading. A passing result is *practice evidence*, not certification of independent or retained skill.
- Local timestamps and reflection data are not tamper-proof; the app does not judge scientific reasoning automatically.
- Pyodide requires network on first load, and its Web Worker is not a hardened security sandbox. Runs execute with fresh lesson variables; full Jupyter kernel-state and reproducibility training are deferred to P06.
- External user-generated code must not be trusted as a securely contained execution environment.

## Import and branch rules

Canonical curriculum files remain unchanged. The UI imports `content/p01/lesson.json` with stable IDs, while `content/author/p01_reference.json` stays on the content branch. No merge of the earlier experimental engine PRs is required. The frozen UI and production `main` must not be modified without a separate, accepted release decision.

## Teaching trial

Open the branch preview and select **P01-G01** in Python foundations. For each mini-goal attempt Predict → Run → Investigate → Apply → Prove. Finish the independent specimen report, record a short scientific explanation, export the `.py` source and later attempt P01-REVIEW. Report confusion or unnecessary difficulty rather than judging the chapter by the number of green checks.

**Decision:** do not develop P02 UI integration or promote to production until this chapter's real-user trial identifies and resolves any material learning blocker.
