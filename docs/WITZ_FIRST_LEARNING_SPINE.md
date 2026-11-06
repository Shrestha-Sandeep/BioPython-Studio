# BioPython Studio — Witz-first learning spine

**Decision (6 November 2026):** Build and maintain the app **in GitHub**. Publish/offer a standalone HTML build only as a distributable from that same source; do not maintain two competing apps.

**Main teaching reference:** Guillaume Witz, [*Image Processing for Beginners*](https://github.com/guiwitz/PyImageCourse_beginner), University of Bern, BSD-3-Clause (notebook material). The primary course assumes no prior coding and aims to reach useful image-analysis scripts rapidly. Its nine numbered notebook chapters and seven exercise notebook sets provide the starting *teaching progression*, example types and exercise ideas. We do **not** present a 156-item checklist as 156 mandatory pages.

## One clear learning path

| Stage | Skills in the unchanged v3 inventory | Mini-missions | What the learner can build |
|---|---:|---:|---|
| **Python** | 36 | 6 | A small script that loads sample identifiers, filters fields, and packages measurement/QC logic into tested functions |
| **Microscopy** | 91 | 13 | Load real images, inspect pixels and channels, crop ROIs, threshold, filter, label/measure objects, evaluate errors and run a reproducible multi-image pipeline |
| **NGS** | 17 | 4 | Sequence/FASTA/FASTQ quality assessment and an auditable analysis of counts |
| **ML** | 12 | 3 | Leak-free baseline model and independently evaluated biological predictions |
| **Total** | **156** | **26** | Cumulative source-led research workflows |

**Everything is unlocked.** The graph recommends a sensible path but is never an access gate. Competency IDs, preserved 61 legacy aliases and saved progress do not change. The earlier broad v3 curriculum remains a *competency coverage contract*, not a competing teaching order.

## Actual Witz teaching sequence, adapted to the learner

1. **Python essentials and structured records:** Witz 01, e01, 08/e08, and functions/structures appendices; keep the biological context and move the loops material earlier than Witz's chapter number where it supports real coding.
2. **Images as arrays:** Witz 02/e02. Practice array construction, shape, indexing, masks, dtype and vectorized measurements on genuine images.
3. **More on images:** Witz 03/e03. Display channels, histograms, ROI crops and image axes. Scientific source images should appear early, not after dozens of theory-only lessons.
4. **Thresholding and filtering:** Witz 04/e04, 05/e05. Compare justified thresholds, morphological cleanup and their failure modes.
5. **Regions and tables:** Witz 06/e06, backed by NumPy/Pandas material. Candidate objects are not validated cells; report overlays, physical units and ambiguous detections.
6. **Reproducible pipeline:** Witz 07 and Demo. Use multiple Cell Atlas images to examine nuclear/nuclear-envelope signal and summarize specimen-level observations.
7. **Deeper defensible practice:** supplement Witz with testing, notebooks, file paths, error handling, microscopy metadata, biological replicates, segmentation validation, uncertainty and independent transfers.
8. **Only then NGS and ML:** the Biopython Tutorial, Python for Biologists, VanderPlas and scikit-learn are specialist sources. No need to repeat Python foundations.

### How every mini-mission teaches

**Learn:** a sourced worked example, one original exercise or adaptation when rights allow, prediction/explanation and gradually faded hints.

**Apply:** extend a cumulative Python program to achieve the *named biological deliverable*; changing input/data is necessary.

**Prove:** solve a related but not identical problem on unseen input, then explain scientifically what the output does and does not establish. Reusing the Apply solution unchanged should not pass as independent evidence. Delayed retrieval is separate from immediate completion.

There should be no repeated intro to variables, masks or plotting just because a new track begins. Each semantic competency belongs to exactly one mission; later use counts as application or recall.

## Exactly which original source exercises are mapped?

The machine-readable [`curriculum/witz_spine.json`](../curriculum/witz_spine.json) identifies source notebook files and exercise cell ranges per mission, with hyperlinks. Witz exercise sheets e01, e02, e03, e04, e05, e06 and e08 are all represented. Some mission references point to chapter demonstrations or appendices rather than an exercise because Witz does not teach that advanced topic. The mapping marks these as **candidate source exercises** until individual lesson implementation is separately audited; it does **not** assert that all 54 exercise prompts have been included already.

Representative examples:
- e01 cells 1–6: values, types, strings and transformations → Python sample-ID scripts.
- e08 cells 1–6: loops, conditional filtering and collecting values → microscope-field QC.
- e02 cells 1–9: arrays, indexing, arithmetic and Boolean selection → pixel operations.
- e03 cells 2–12: image import, dimensionality, display, histograms and ROI crops.
- e04 cells 3–7: channel isolation and comparing threshold approaches.
- e05 cells 2–5: edge filtering, mask erosion and skeletonization.
- e06 cells 2–8: segmentation labels, region properties and intensity histograms.

## Source reuse and images

Witz's notebook material carries **BSD-3-Clause** terms; retain attribution, copyright and disclaimer as already documented in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Book prose with different licensing is linked, not copied. The Witz Cell Atlas imagery is sourced from the Human Protein Atlas and needs **asset-specific license/provenance confirmation**, attribution, preservation of original color/channel meaning and clear distinction between composited 8-bit JPEG teaching pixels and calibrated raw microscopy data.

Use real licensed examples. Do not present connected bright regions as confirmed nuclei/cells without annotated validation. Nuclear-edge localization is a scientific *measurement hypothesis*, not proof from a thresholded picture.

## What this branch changes, and what it does not

Implemented in this branch:
- A **verified, topologically sorted**, source-backed path across all 156 stable skills and 26 mini-missions.
- One-stage navigation Python → Microscopy → NGS → ML; Python shrinks from the old broad 88-skill grouping to 36 essentials before the dedicated microscopy stage.
- The current mini-goal appears within the existing lesson breadcrumb, without a new dashboard or extra menu.
- Both current and historical lesson views use the same source-first course map.
- Automated tests enforce source links, complete coverage, one-to-one assignment, no prerequisite conflicts, stable legacy behavior and unlocked navigation.

**Not claimed complete:** converting each cited Witz exercise into a fully interactive assessment, adding new image asset files, full live Pyodide and CORS verification for every exercise, or proving that a learner can independently reproduce the full scientific pipeline. Those are content/runtime milestones and require explicit test evidence. The in-app Predict/Run/Investigate/Modify/Write/Debug stages are retained; grouped Learn/Apply/Prove mastery needs to be applied and validated at mission level.

**Release policy:** Keep this as a separate development PR until it is reconciled with Codex's work; do not merge other in-progress PRs automatically or silently replace production.
