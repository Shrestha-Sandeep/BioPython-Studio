# Advanced tutorial production checkpoint — 2026-11-14

**Purpose:** Canonical resumption record for the user-requested loop: research and blueprint → tutorial/art → independent numeric/browser QA → correct and rerun → next existing advanced chapter.

**Production safety:** All tutorials are in stacked **draft** pull requests. Do not merge any into `main` or modify `frozen/ui-first-2-2026-11-12` without learner review and release gates.

## Completed research-led tutorial drafts

| Chapter | Title / scientific competency | Scenes | Original diagrams | Research and QA artifacts | Stacked draft | Verified green CI |
|---|---|---:|---:|---|---|---|
| A00 | Local environment, path security, biological n, changed-input tests and hashes | 16 | 16 | `A00_RESEARCH_BLUEPRINT.md`, `ITERATION_LOG_A00.md` | [PR #57](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/57) | [43631831638](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/43631831638) |
| A01 | Native TIFF axes/dtype, uint16 fidelity, calibrated-vs-declared scale, source fingerprint | 17 | 17 | `A01_RESEARCH_BLUEPRINT.md`, `ITERATION_LOG_A01.md` | [PR #58](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/58) | [43632505785](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/43632505785) |
| A02 | Foreground/background polarity, 4-neighbor connected components, watershed, sensitivity | 17 | 17 | `A02_RESEARCH_BLUEPRINT.md`, `ITERATION_LOG_A02.md` | [PR #59](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/59) | [43633232768](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/43633232768) |
| A03 | True vs predicted instances, cardinality-first IoU matching, TP/FP/FN, F1, heldout groups | 17 | 17 | `A03_RESEARCH_BLUEPRINT.md`, `ITERATION_LOG_A03.md` | [PR #60](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/60) | [43633833124](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/43633833124) |
| **Total** | Four complete technical tutorial cycles | **67** | **67** | Blueprints first and independent browser/code checks | All draft | All technical QA green |

## Reproducibility / verified tests

- Every nonempty expected tutorial stdout is verified against real CPython and scientific Python packages, and changed-input perturbations are tested.
- Real Chromium checks at 390px and 1280px for each chapter: existing Learn-only narrated viewer, visible/correct original diagram, prediction hidden until reveal, voice/rate controls, unchanged CodeMirror and chapter localStorage, no Apply/Prove or delayed-review spoiler, and no advanced navigation in default 26-chapter route.
- All changed JS, native tests and UI scope checks were committed to GitHub rather than reported from memory. All four latest dedicated workflows were green **before their final log-only commits**; any subsequent merge needs the checks reverified against its exact head SHA.
- The code does not establish independent acquisition calibration, scientific annotation validity or actual learner mastery. Candidate masks are not verified biological objects. Real TIFF provenance, independent reference, leakage-safe biological groups and learner transfer remain open.

## Known limitations, not hidden

1. Human learning quality cannot be scored 9.5+/10 from the automated CI results alone.
2. A00 needs real desktop interpreter/environment + fresh-checkout replay, and verified file source identity.
3. A01 needs genuine native image, instrument metadata/scale verification and source-aware inspection.
4. A02 needs challenging real-data examples and annotated false splits/merges.
5. A03 needs locked independent annotation-based evaluation and group/source provenance.
6. Stacked PRs #57–#60 must be integrated sequentially only after user review and CI/rebase checks. Latest tutorial layer is A03.

## Exact next canonical chapter

**A05 — independent biological units, paired comparisons and bootstrap uncertainty.** A04 is a conditional imaging branch, not the mandatory next step. Read `content/chapters/A05_COMPLETE.md`, `projects/advanced/a05/` and the research-led production loop, then commit `docs/tutorials/A05_RESEARCH_BLUEPRINT.md` **before** any tutorial code. Introduce pseudoreplication, paired-vs-unpaired designs, animal-level aggregation, confidence intervals and robust uncertainty, not raw pixel-level p-value farming. Require real statistical counterexamples and two viewport browser tests. After A05, the existing route continues A06, A07.
