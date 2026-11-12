# BioPython Studio — Core Advancement implementation and release QA

**Report date:** 9 November 2026  
**Branch:** `advancement/a00-a05-a07-core-and-qa` · **Draft PR:** [#27](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/27) · **Base:** draft PR #26.  
**Release status:** Technical development / learner pilot only. **No main merge or new deployed Vercel preview confirmed.**

## 1. Completed implementation inventory

| Chapter | Mini-goals | Capstone | Delayed review | Total |
|---|---:|---:|---:|---:|
| A00 — Local scientific Python | 5 | 1 | 1 | 7 |
| A01 — Native image axes, acquisition/scale | 4 | 1 | 1 | 6 |
| A02 — Classical segmentation, source intensity | 5 | 1 | 1 | 7 |
| A03 — Annotation object and experimental validation | 5 | 1 | 1 | 7 |
| A05 — Biological units and statistics | 6 | 1 | 1 | 8 |
| A06 — Reproducible TIFF batch engineering | 6 | 1 | 1 | 8 |
| A07 — Independent research evidence | 7 | 1 | 1 | 9 |
| **Total** | **38** | **7** | **7** | **52** |

The advanced lab is an **opt-in** `/?lab=advanced` route. Standard `/` keeps the original 26-chapter 156-competency course and unchanged learner storage keys. In advanced mode, the existing compact Python IDE, Run/Check, hints, task comments, saved drafts and exported Python scripts are reused without adding a new permanent stage.

A04 (conditional 3D/time-lapse) and specialization electives X01 Fiji/napari, X02 ML, X03 NGS, X04 research data and X05 LLM-assisted scientific coding were **not developed** in this core implementation. They are separate, nonblocking extensions of the original advancement blueprint.

## 2. Scientific code, actual inputs and limits

- **A00**: [local CSV/virtual-environment bridge](../projects/advanced/a00/bridge.py), SHA-256, interpreter/package identity, file/path error handling, local pytest/Git procedure.
- **A01**: [native source audit](../projects/advanced/a01/image_audit.py), [image-quality/sampling diagnostics](../projects/advanced/a01/quality.py), original axes/dtypes, optical/pixel scale only when verified; detector maximum not equated to instrument saturation.
- **A02**: [source-preserving TIFF segmentation](../projects/advanced/a02/run_tiff.py), [classical method parameter sensitivity](../projects/advanced/a02/sensitivity.py), [LoG puncta/core-rim](../projects/advanced/a02/puncta.py); candidate regions **not** proven exophers/aggregates.
- **A03**: [one-to-one annotation metrics](../projects/advanced/a03/metrics.py), [BBBC038 real annotation benchmark](BBBC038_REAL_BENCHMARK_2026-11-08.md), [BBBC039 original 16-bit test](A02B_REAL_MODALITY_TEST_2026-11-08.md), [independent annotator agreement](../projects/advanced/a03/annotator_agreement.py), group-leakage and uncertainty caveats.
- **A05**: [biological statistics CLI](../projects/advanced/a05/analysis.py): per-animal/pair aggregation, transparent exclusions, sample-size/design checks, seeded percentile bootstrap **over independent biological units**, signal plotting, source/environment audit, **not** causal inference.
- **A06**: [real TIFF batch pipeline](../projects/advanced/a06/batch.py): explicit C/Z/T plane selections, input/config hashes, native label maps, full image and excluded-row manifests, A05-compatible animal/field CSV and incomplete-run failure marker.
- **A07**: [seven-checkpoint evidence gate](../projects/advanced/a07/evidence_check.py) checking preregistered-like method plan, image hashes, group-disjoint holdout, independently sourced annotation rules, matched TP/FP/FN, real-checkout claim, failure gallery and limitations memo. It **never** declares scientific or human-mastered success based solely on file structure.

The [source-reference map](../curriculum/advanced_reference_map_v1.json) associates **each of the 52 activities** with a scientific source family, relevant concept, original adaptation, input and reproducibility limits, and license/copyright safeguards. No copied third-party textbook chapters, microscopy originals or pretrained weights are embedded.

## 3. Verified technical evidence

- [All eleven GitHub Actions workflows at implementation head `6baef732`](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/27/checks) **PASSED**. This includes all original Python foundations, NGS/ML browser, full I01–I13 microscopy, old 16-bit TIFF workflow, frontend and the advanced lab.
- [Native scientific Python QA](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/42574301729): **55 tests PASS**, including 128 new real CPython changed-input scenarios, original A01–A03 80 cases, TIFF/source checks, animal/pair bootstrap, code replay invariants, annotator agreement and seven research-evidence refusal checks.
- [New advanced browser/Pyodide QA](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/42574301658): four new chapter flows, **128/128 changed-input checks**, four runnable standalone Python capstone exports, separately stored progress and responsive viewports.
- [Original advanced A01–A03 browser QA](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/42574301718): **80/80 real Pyodide changed-input checks**, a browser-loaded original-16-bit synthetic OME-TIFF and source-preservation checks. **208 real Pyodide changed-input cases in total** across the seven advanced chapters.
- [Full original microscopy learner QA](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/42574301699) and [sequence/ML learner QA](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/42574301657) were run unchanged.
- The original 26 chapter files and progress IDs were **not edited**. The route only adds optional advanced IDs and selected-chapter storage.

**Coverage distinction:** The above are software/authoring checks on synthetic teaching fixtures. They are not a calibrated microscopy accuracy measurement or evidence of delayed human mastery. Native scikit-image/NumPy tests emit existing third-party deprecation warnings, which should be addressed only with care for reproducibility of benchmark outputs.

## 4. Original annotated real-data benchmarks (not claims of new performance)

- **BBBC038v1 official 65-image published stage1 test:** classical fixed bright Otsu/watershed object micro-F1 **0.3849**; 4,152 reference nuclei; inconsistent results across diverse imaging.
- **BBBC038 40 training-image polarity diagnostic:** image-macro object F1 increased **0.6904→0.7730** but is **retrospective training-only**, not independent test validation.
- **BBBC039 original 50-image native uint16 official test:** object micro-F1 **0.8413** for both baseline and polarity-aware method; the router makes no difference on these bright-on-dark fluorescence images. BBBC039 overlaps partly with BBBC038 and uses different annotation conventions.

These results were obtained in prior real-data GitHub Actions experiments. They cannot be used to claim successful exopher detection or accuracy on the learner's own microscopy. No A05–A07 biological experiment has been performed by the learner yet.

## 5. Release blockers / what remains **not completed**

1. **Actual G0/A00 learner trial:** The user must execute a real fresh Windows/macOS/Linux local environment, demonstrate a Git commit, package freeze, source hashes, troubleshooting and fresh checkout.
2. **Actual independent A07 capstone:** The learner must choose an unfamiliar annotated microscopy dataset, verify biological grouping, freeze method before holdout, generate predictions and an honest error/failure report, and reproduce outputs independently.
3. **Human scientific judgment:** Annotation reliability, interpretation of biological replicates, exclusion decisions, uncertainty, object definition and scientific relevance cannot be auto-certified.
4. **Production/release:** PR #27 is stacked on unmerged #26 and the earlier draft PR chain; no production or hosted-preview deployment is claimed. Vercel previously imposed a build-rate-limit/account quota.
5. **Optional future expansions:** A04 3D/tracking and X01–X05 specializations are still deferred.

**Verdict:** **GO for core technical learner pilot. HOLD production merge and claims of independent scientific competence.** Automated coding and source-fingerprint exercises can be complete while the evidence-level E3–E5 gates still require actual user-driven independent work.
