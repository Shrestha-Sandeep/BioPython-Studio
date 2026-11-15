# A06 — Research-first tutorial blueprint: reproducible source-safe microscopy batch analysis

Date: 2026-11-14. Parent: `feature/advanced-tutorial-cycle-a05` (A05 draft PR #61, native + Chromium QA green).
Canonical: `content/chapters/A06_COMPLETE.md` (G01–G06, CAPSTONE, separate delayed REVIEW).
Actual local CLI: `projects/advanced/a06/batch.py`, `projects/advanced/a06/README.md`.
Branch: `feature/advanced-tutorial-cycle-a06`. Draft only; preserve original/frozen routes, editor and saved progress.

## Scientific reason

A single TIFF pipeline is not research-ready merely because it works on one example. A real microscopy core may receive a folder of original OME-TIFFs where one image is missing, a second is duplicated, one C/Z/T selection is ambiguous, a field is associated with the wrong animal, a parameter file changed, and part of a batch failed after writing results. **Silently producing a polished but incomplete CSV is worse than visibly refusing an invalid run.** The learner's destination: a source-preserving, reproducible *candidate-only* multi-image report with traceable sources, parameters, exclusions and independent animals.

## External research and adapted design

- **Reproducible image handling and analysis** (EMBO J, 2021), https://pmc.ncbi.nlm.nih.gov/articles/PMC7849301/ — reproducible image-analysis package requires *original data, code and workflow description* including versions/parameters. Teach manifest-based lineage and project replay.
- **REMBI Lab Guide, BioImage Archive** (EMBL-EBI), https://www.ebi.ac.uk/bioimage-archive/rembi-help-lab/ — preserve original vendor formats where possible, standardized images/annotations/tables and source association. Teach source image → derived mask/CSV association.
- **Snakemake tutorial**, https://snakemake.org/snakemake-tutorial — explicit inputs, outputs and targets as a dependency graph; this A06 tutorial teaches the provenance idea but **does not claim it implements Snakemake**.
- **Bioimage analysis in Galaxy** (Journal of Microscopy, Sept 2026), https://doi.org/10.1111/jmi.70165 — workflows should preserve explicit, exportable provenance; show metadata and versions without claiming FAIR certification.
- The actual A06 local CLI is authoritative: the output directory must be *new* and outside source data; preflight manifest IDs/source paths/biological group assignments, explicit C/Z/T plane; stores original hashes, candidates and exclusions; creates an INCOMPLETE marker if a run fails. No source overwrite.

## 18-scene storyboard and distinctive diagrams

| # | Goal | Visual and cognitive task |
|--:|--|--|
| 1 | G01 | Destination: several original TIFFs → audit → native candidate masks → A05-ready field/animal CSV |
| 2 | G01 | Pure numeric correction on a synthetic uint16 field: cast before subtract |
| 3 | G01 | Same pure function on changed input, original source unchanged |
| 4 | G02 | Named YX versus TCZYX and explicit T/C/Z selectors |
| 5 | G02 | Refuse a missing selector on a multi-channel image |
| 6 | G02 | Correct explicit named channel selection produces a verifiable YX shape |
| 7 | G03 | Manifest contains duplicate image IDs — refuse |
| 8 | G03 | Manifest preflight flags missing TIFFs, even when other files exist |
| 9 | G03 | **Withheld prediction:** can the new manifest start? |
| 10 | G03 | Reveal duplicate/missing IDs and fail-closed decision |
| 11 | G04 | Hash exact source bytes, not a display thumbnail or filename |
| 12 | G04 | Canonical config SHA and environment identity are separate |
| 13 | G05 | Changed-input test catches threshold boundary regression |
| 14 | G05 | Invalid input must be tested explicitly; never assume happy path |
| 15 | G06 | Compare source/config/output fingerprints across two runs |
| 16 | G06 | Same outputs without same data/config/environment is not full reproducibility |
| 17 | CAPSTONE | Source-preserving synthetic multi-image candidate-by-field/animal report |
| 18 | CAPSTONE | Independent new-TIFF local transfer; no solved Prove/REVIEW |

All 18 scenes have original SVG diagrams; one per-scene data-specific diagram using new useful audit/manifest layouts and existing scientific painters. An output can be reproduced only if raw input/parameters and environment are controlled; hashed identity **cannot** certify biological accuracy.

## Numeric / software invariants

- Pure transform: `np.maximum(0, np.asarray(pixels,dtype=float)-background)`, candidate mask `>threshold`; never mutate source.
- For `axes='TCZYX', shape=(2,3,2,4,5)`, a selection of `T=1,C=2,Z=0` yields YX=(4,5). Missing any non-singleton T,C,Z must be reported; don't silently squeeze/choose 0. Metadata declaration must be verified from source in a genuine CLI.
- Preflight manifest must reject duplicate image_id even if paths differ; missing source reports IDs; parent animal ID never invented. Correct relative path/source root checks happen in native A06.
- Checkpoint scene 9: new rows include duplicate F2 and a missing F3. Do not reveal `can_start` or actual missing/duplicate list until scene 10; prediction is required before reveal.
- Source: `hashlib.sha256(raw_bytes)` uses exact bytes; canonical config JSON uses sorted keys and fixed separators, hash identity separately from source; versions included in environment fingerprint.
- Regression tests check an equality threshold and wrong min_area/axis scenarios; assertion failure is a valid QA discovery, not evidence of scientific failure.
- Manifests compare source_hash, config_hash and output_hash before calling a replay exact. An environment mismatch must be reported even if output hashes happen to agree.
- Capstone has several synthetic fields with parent animal IDs; `field_counts` and per-animal mean differ; *candidate_only=True*. No biological N beyond the number of verified independent declared animals. Explicit field exclusion reasons for a real batch.
- A06-REVIEW and Apply/Prove exercises remain untouched and unsolved.

## Implementation gates and decision

- New `src/tutorials/a06-data.js`, new 18 SVG `DATA06` in existing `advanced-illustrations.js`, one new script include before existing viewer.
- Node native test checks 18 exact goal/steps, withheld scene 9, 15+ actual CPython numeric snippets, changed inputs (missing selector/IDs, invalid sources, hash change, config canonical, changed thresholds and animal grouping), no fabricated stats.
- Playwright real desktop 1280x850 and mobile 390x844 checks all 18 scenes, audit visual, prediction/reveal, browser TTS controls, no horizontal overflow, editor/localStorage state unchanged, Apply/Prove/REVIEW hidden, normal route unchanged.
- Cumulative A00–A06 tests run in dedicated GitHub workflow with pinned NumPy/SciPy/scikit-image/tifffile/browser versions; inspect any red job, repair and rerun before A07.
- Honest science exit: original sources+versioned config+real A06 local CLI+unchanged SHA hashes+independent checks by another scientist. Not achieved by invented tutorial fixtures. No merge to production.

Verdict: GO for code and QA, HOLD real-data research claim. Next existing A07 independent unfamiliar-data research capstone.
