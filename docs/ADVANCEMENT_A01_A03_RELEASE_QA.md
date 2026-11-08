# BioPython Studio — A01–A03 advanced learner integration / QA report

**Date:** 2026-11-08. **Status:** isolated draft implementation, **not released** and **not merged** into production.  
**Parent branch:** `advancement/a04-modality-aware-external-bbbc039` (draft PR #25).  
**User experience:** standard course `/`; optional advanced 3-chapter route `/?lab=advanced` (when served from this development branch).

## 1. Delivered scope

| Chapter | Distinct mini-goals | Capstone | Delayed review | Total activities |
|---|---:|---:|---:|---:|
| A01 — Native image source audit | 4 | 1 | 1 | 6 |
| A02 — Candidate segmentation/sensitivity | 5 | 1 | 1 | 7 |
| A03 — Annotated image validation | 5 | 1 | 1 | 7 |
| **Total** | **14** | **3** | **3** | **20** |

Each activity includes a working Learn example, an **unsolved** Apply starter, independent Prove starter, changed-input assertions, tailored scientific context, error explanations and progressive hints. Proof phases have **no hints**. The three chapters connect to original TIFF and BBBC038/039 projects via complete Markdown chapters and local research-code guides. All 20 advanced activity IDs are outside the legacy 001–156 competency numbering.

**Scientific distinction:** Browser arrays/reference masks are **synthetic pedagogical fixtures**. Genuine native TIFF/OME-TIFF and external expert-annotation benchmarks remain in the separate local Python research modules. Browser exercises cannot certify exopher identification, microscope calibration or prospective segmentation performance.

## 2. Automated QA evidence

- **PASS — complete Python tests:** [run #42529671732](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/42529671732). Verified **80/80** Apply/Prove changed-input cases with actual CPython, along with advanced native-source TIFF, classical segmentation, annotation matching, BBBC038 RLE and BBBC039 original-dataset adapter tests. The 26 original chapters retain their **156** canonical competencies.
- **PASS — genuine Pyodide browser:** [run #42529671730](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/42529671730). Verified the same **80/80** changed-input cases in the real browser Python runtime; all 20 advanced activities, in-editor comments, chapter navigation, Save/Reload, capstone export execution in CPython and separate storage.
- **PASS — original 16-bit OME-TIFF:** A browser-uploaded 2×3×7×9 native **uint16** OME-TIFF maintained 50,000-valued source pixels inside Pyodide. Upload/clear was verified, and the source image bytes remained unchanged.
- **PASS — frozen legacy navigation:** Standard route `/` still exposes **13 microscopy chapters**, not the new advanced lessons. `?lab=advanced` exposes 16 microscopy options including A01–A03. Stored `biopython.course-selected.v1` is untouched by the separate `biopython.advanced-selected.v1`. Chapter drafts remain stored in distinct `biopython.a01.v1`, `biopython.a02.v1` and `biopython.a03.v1`.
- **PASS — responsive UI:** Screenshots at **1440×900, 768×920 and 390×844**, without horizontal page overflow. A visual inspection confirmed the existing dark-theme CodeMirror layout, no new permanent nav stage and readable lesson/task controls. [GitHub Actions screenshots](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/42529671730).
- **PASS — existing shell JS:** `node --check`, original frontend Node tests and original unchanged-stage smoke contract passed in the Pyodide workflow.

These are technical and test-content QA results; they are **not a formally measured pedagogical score**.

## 3. Existing external science benchmark evidence

These existing results are still the scientific context, **not a new performance improvement caused by A01–A03 lesson integration**:

| Evaluation | Result | Limit |
|---|---:|---|
| Original BBBC038 official stage1 test, 65 images | object micro-F1 **0.3849** | Original bright-foreground classical pipeline fails on many heterogeneous/dark-nucleus images |
| BBBC038 original 40-image training-only polarity experiment | image macro-F1 **0.6904 → 0.7730** | Retrospective training result; **not independent test** |
| Original BBBC039 50-image 16-bit official test | object micro-F1 **0.8413** | The polarity router did **not** improve it; all 50 routes remained bright; partial image overlap with BBBC038 possible |

See [BBBC038 real benchmark](BBBC038_REAL_BENCHMARK_2026-11-08.md) and [BBBC039/A02b report](A02B_REAL_MODALITY_TEST_2026-11-08.md). Both use public manually produced reference annotations with different mask conventions.

## 4. Scientific and educational boundaries

1. **Original microscope data remain outside the app** until selected by the user. Witz/HPA default images are rendered JPEG-derived teaching data, not verified calibrated raw camera acquisitions.
2. **Public changed-input practice checks are inspectable** and may be passed with help; they cannot certify independent programming, delayed retention or software-engineering mastery.
3. **Biological accuracy requires independent annotations** and held-out images; high foreground overlap alone can hide merged/split nuclei. Study-group independence must be confirmed, not inferred from unique filenames.
4. **No human G0 learner pilot** has been recorded, and no user-local Windows/macOS clean checkout/venv/Git execution has been independently observed.
5. **Old 26 chapters were not edited.** The optional route changes one course-adapter JavaScript file but uses separate saved-progress keys. Broader original-suite pull-request CI still needs to pass before any merge review.
6. The advanced research code still emits some third-party `scikit-image` API deprecation warnings. This is a dependency-upgrade maintenance item; do not change validated benchmark algorithms without rerunning original benchmarks.
7. Vercel previously reported an account build-rate limit; no new hosted preview is claimed until a successful deployment is confirmed.
8. This milestone covers **A01–A03** and the associated A02b scientific experiment. The broader blueprint's A04 3D/time-lapse, A05 biological statistics, A06 reproducible batch engineering and A07 independent real-data capstone are **not finished**.

## 5. Human acceptance / independent skill gate (not automated)

Use `/?lab=advanced` on this branch. Complete A01, A02 and A03 without copying instructor solutions. After the capstone, return on a later day and solve the review without hints. Export the script, recreate a real local environment, run A01 source auditing and A02/03 on previously unseen appropriately annotated source images. Verify input SHA-256, axis/channel interpretation, source-preserving output, model/annotation limitations and experiment-level independence. Record the actual assistance used and failed cases.

## Release recommendation

**GO for draft research/learner review. HOLD for merge into production.**

Code and synthetic changed-input QA are green. A real learner pilot, a real new external-data transfer exercise and the full original browser regression suite after the final PR are still required before calling the advanced track research-ready or human-validated. No fictitious 9.5/10 rating is assigned.
