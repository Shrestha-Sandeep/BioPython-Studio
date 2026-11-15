# BioPython Studio — complete mandatory advanced tutorial production checkpoint

**Updated:** 2026-11-14  
**Branch:** `feature/advanced-tutorial-cycle-a07`  
**Release state:** all tutorials are stacked **draft PRs**, never merged or deployed to production by this cycle.  
**Production UI and learner state:** frozen standard `/` route, `ui-first-2`, CodeMirror, Apply/Prove/delayed-review and saved drafts retained. Advanced material remains opt-in at `/?lab=advanced`.

## Completed research → blueprint → original narrated tutorial → independent code/browser QA

| Chapter | Main capability | Narrated scenes | Original SVGs | Research blueprint | Iteration log | Draft PR | Full green CI |
|---|---|---:|---:|---|---|---|---|
| A00 | Local Python, safe paths, biological grouping and source hashes | 16 | 16 | [A00](A00_RESEARCH_BLUEPRINT.md) | [Log](ITERATION_LOG_A00.md) | [#57](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/57) | [43631831638](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/43631831638) |
| A01 | Native TIFF axes/dtype, uint16, physical-scale caveats | 17 | 17 | [A01](A01_RESEARCH_BLUEPRINT.md) | [Log](ITERATION_LOG_A01.md) | [#58](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/58) | [43632505785](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/43632505785) |
| A02 | Candidate segmentation, polarity, watershed, sensitivity | 17 | 17 | [A02](A02_RESEARCH_BLUEPRINT.md) | [Log](ITERATION_LOG_A02.md) | [#59](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/59) | [43633232768](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/43633232768) |
| A03 | Independent annotations, 1-to-1 object IoU and error metrics | 17 | 17 | [A03](A03_RESEARCH_BLUEPRINT.md) | [Log](ITERATION_LOG_A03.md) | [#60](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/60) | [43633833124](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/43633833124) |
| A05 | Experimental unit, paired designs and subject-level bootstrap | 18 | 18 | [A05](A05_RESEARCH_BLUEPRINT.md) | [Log](ITERATION_LOG_A05.md) | [#61](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/61) | [43642877845](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/43642877845) |
| A06 | Deterministic original-TIFF batch pipeline, complete manifest and hashes | 18 | 18 | [A06](A06_RESEARCH_BLUEPRINT.md) | [Log](ITERATION_LOG_A06.md) | [#62](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/62) | [43643367414](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/43643367414) |
| A07 | Seven-gate unfamiliar-data evidence packet and human GO/NO-GO | 18 | 18 | [A07](A07_RESEARCH_BLUEPRINT.md) | [Log](ITERATION_LOG_A07.md) | [#63](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/63) | [43643876602](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/43643876602) |
| **TOTAL** | **Seven mandatory advanced tutorials** | **121** | **121** | **7 blueprints** | **7 logs** | **7 draft PRs** | **7 chapter-specific green CI gates** |

**Stack order:** `PR #57 → #58 → #59 → #60 → #61 → #62 → #63`. A07 is stacked on A06. Review and integrate sequentially, reconcile any intervening changes on `main`, and **retest exact integration SHA** before production promotion.

## What CI actually proves

- Every displayed expected numeric stdout was executed by actual native CPython, including NumPy/SciPy/scikit-image/tifffile examples where appropriate; changed inputs challenge source integrity, wrong axis selection, datatype conversion, safe path and source manifest, statistical replicates, group leakage and scientific decision thresholds.
- All A00–A07 scripts loaded into the existing **optional Learn-only** narrated browser viewer with original SVG artwork and voice/speed selection; real Chromium desktop (1280×850) and mobile (390×844), predictions withheld until reveal, no horizontal overflow, no unintended modifications of editor or chapter localStorage, hidden Apply/Prove/REVIEW spoilers.
- The last *code-bearing* commit of A07 was checked by [cumulative green workflow 43643876602](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/43643876602). This status document and iteration log were committed afterward; check CI and exact head SHA again before merging.
- The original foundation P01 narrated viewer regression is included in each advanced cumulative run.

## What is still NOT proved

1. A good pedagogical quality rating (e.g. 9.5/10) **cannot** be inferred from automatic CI. A real learner must attempt unseen Apply/Prove tasks and record confusion, feedback, time spent and delayed review.
2. Biological identity, physical pixel calibration, original image provenance and source annotation validity were not established by synthetic teaching inputs.
3. A05 subject-level bootstrap with tiny toy n illustrates implementation only; not defensible experimental uncertainty or causality.
4. A06 output is numerical **candidates**, not verified nuclei/exophers. The actual local CLI must be replayed on original TIFFs, with true source hashes and all exclusion/audit metadata.
5. A07 independent capstone **has not been performed**. Human review must assess source annotations, independent biological-group splits, object F1/failure cases, clean environment replay, original data and biological interpretation. Even a structurally valid seven-file packet is not automatic scientific certification.
6. Production remains unchanged, and stacked PRs are not yet integrated.

## Release and next development decision

**Technical authoring verdict: GO — seven mandatory advanced chapter narrated tutorials ready for human review.**

**Scientific / pedagogical certification: HOLD.**

**Do not generate A08 or assume A04 is mandatory.** The frozen plan designated A04 as conditional 3D/time-lapse, outside the seven-chapter core. Best next action is learner trial of A05/A07 and independent A00→A07 task completion, then a release/integration branch with exact-head QA. Revisit the blueprint only for observed learner failures, broken examples or scientifically invalid assumptions. This is a quality gate, not idle expansion.
