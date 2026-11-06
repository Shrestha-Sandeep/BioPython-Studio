# BioPython Studio — Frozen Curriculum v3 (design contract)

**Frozen:** 6 November 2026. **Status:** finalized syllabus, not 156 completed app lessons.  
**Base:** 61-lesson branch `feature/complete-61-lesson-curriculum`, commit `c6aaae508ff50e87958222ecb5826e2f0b367a96`.  
**Machine-readable authority:** [`curriculum/v3_manifest.json`](../curriculum/v3_manifest.json) records every distinct competency, its prerequisites, and a preservation map for all 61 legacy IDs.

## Current presentation policy — user-directed update, 6 November 2026

The current user instruction is **one open path: Python → Microscopy → NGS → ML**, with no prerequisite or completion locks on implemented exercises/stages. This supersedes the earlier optional-path/default-route presentation below. `recommended_complete_route` is the new 156-entry, prerequisite-safe teaching order; the older route arrays remain for historical compatibility. The 156 semantic IDs, competency objectives, prerequisite edges and 61 preservation aliases are unchanged. Duplicate aliases share one course entry; raw historical drafts stay available. Current and nonoverlapping historical exercises expose 78 distinct entries, without claiming that every historical exercise is a completed v3 upgrade.

Goals/evaluation tools are secondary, collapsed controls. Early transfer is practice; exposed prompts cannot later become unseen retention checks. Source-first exercise reuse is preferred when licensing permits: the existing array examples now adapt credited Witz exercises and VanderPlas code, with notices in `docs/THIRD_PARTY_NOTICES.md`. No additional duplicate competency was introduced. This is an explicit user-directed change to access and presentation, not an automatic mastery award or production sign-off.

## Final decision

**156 distinct competencies**, not 160 obligatory lessons. Starting from the v2 inventory, eight tasks that tested previously learned skills or repeated report construction become embedded practice/transfer assessments. Four genuinely needed competencies are added: local Python environment, Git, robust statistics and GC composition. The 61 saved lesson IDs are preserved as migration aliases.

Teach a scientist with deep biology/microscopy experience but novice Python syntax. Introduce an attributed genuine microscopy image on day one as *context*; do not require advanced NumPy processing until its prerequisites have been learned. Microscopy is the recommended applied pathway. Sequence/NGS and ML are separate electives, not requirements for all 156 skills.

**Pedagogy:** predict → run/investigate → modify → write → debug/transfer. Fade worked examples; give meaningful explanations on errors; distinguish guided, independent and retained mastery with delayed unseen transfer. A completed test is not proof of retained programming ability or a valid biological result. Reviews and projects should reuse previously learned techniques without reteaching or inflating task totals.

## Module inventory

| Module | Goal | Distinct competencies | Path |
|---|---|---:|---|
| M00 | Orientation, execution, errors and notebooks | 4 | foundation |
| M01 | Python values, decisions and iteration | 11 | foundation |
| M02 | Collections and structured scientific records | 9 | foundation |
| M03 | Functions, files, testing and actual tools | 12 | foundation |
| M04 | NumPy arrays and numerical reasoning | 14 | foundation |
| M05 | Pandas, biological metadata and data QA | 12 | foundation |
| M06 | Scientific figures and communication | 8 | foundation |
| M07 | Real microscopy images, provenance and axes | 11 | microscopy |
| M08 | Image filtering, thresholds and segmentation | 14 | microscopy |
| M09 | Measurements, motion and validation | 12 | microscopy |
| M10 | Scientific statistics, units and reproducibility | 15 | shared_scientific |
| M11 | Biopython, DNA sequences and introductory NGS | 16 | sequence |
| M12 | Defensible baseline ML for biological data | 11 | ml |
| M13 | Unseen-data independent projects | 7 | projects |
| **Total** | | **156** | Prerequisite graph |

## Default learning route (deterministic, but flexible)

The complete catalog is **156 distinct competencies**. The default microscopy-first route contains **127** of those competencies. The sequence/NGS branch contains **17** (including its project), and the ML branch contains **12** (including its project). The branches may be unlocked whenever their *actual local prerequisites* are met; they are not blocked behind unrelated microscopy modules.

**Recommended first 15 competencies**, in prerequisite-safe teaching order (distinct from the catalog number order):

1. Run a short Python cell (001); see the provenance of a real fluorescence image (071).
2. Assign a specimen variable (005), format a label (008), calculate (006), and inspect types (007).
3. Compare values (010), express a QC condition (011), learn list indexing (016), and iterate over fields (012).
4. Write a first function (025), read a traceback (002), consult documentation (003), construct a NumPy array (037), and inspect its shape (038).

This is a pilot sequence of 15 **competencies** that can contain 12–15 initial **learner activities** by combining or staging small interactions. Later tasks include real array decoding, coordinate selection, ROI and threshold transfer. Every subsequent default-route competency is listed in the machine-readable `recommended_default_route`, a validated topological order. UI navigation should present one next action, not this entire list.

## Exact competency list and immediate prerequisites

Competency numbers are display order only; immutable semantic IDs in the manifest protect progress if the path order changes. Module IDs do **not** enforce a linear study sequence.

### M00 — Orientation, execution, errors and notebooks

| # | Distinct learning objective | Prerequisite numbers |
|---:|---|---|
| 001 | Run a scientific Python cell | Start |
| 002 | Read an error traceback | 001 |
| 003 | Use documentation and help | 001 |
| 004 | Understand a notebook workflow | 001 |

### M01 — Python values, decisions and iteration

| # | Distinct learning objective | Prerequisite numbers |
|---:|---|---|
| 005 | Name a specimen using variables | 001 |
| 006 | Calculate with physical quantities | 005 |
| 007 | Explain int, float and bool | 006 |
| 008 | Build informative strings | 005 |
| 009 | Parse a specimen identifier | 008 |
| 010 | Compare measurements safely | 006, 007 |
| 011 | Write conditional quality rules | 010 |
| 012 | Iterate and summarize microscope-field lists | 016, 011 |
| 013 | Use range and enumerate | 012 |
| 014 | Make a bounded while loop | 011 |
| 015 | Skip and stop intentionally | 012, 011 |

### M02 — Collections and structured scientific records

| # | Distinct learning objective | Prerequisite numbers |
|---:|---|---|
| 016 | Index and slice a list | 005 |
| 017 | Change a list safely | 016 |
| 018 | Unpack immutable tuples | 016 |
| 019 | Map IDs to metadata | 008 |
| 020 | Navigate nested records | 019 |
| 021 | Deduplicate using sets | 016 |
| 022 | Express a simple comprehension | 012, 016 |
| 023 | Iterate over dictionary records | 019, 012 |
| 024 | Pair related arrays with zip | 016, 012 |

### M03 — Functions, files, testing and actual tools

| # | Distinct learning objective | Prerequisite numbers |
|---:|---|---|
| 025 | Return results from a function | 012 |
| 026 | Define parameters and defaults | 025 |
| 027 | Understand scope | 025 |
| 028 | Write docstrings and type hints | 025 |
| 029 | Raise and handle exceptions | 011, 025 |
| 030 | Use imports and small modules | 025, 003 |
| 031 | Read and write a text file | 008, 003 |
| 032 | Create and run a local Python virtual environment | 030, 031, 004 |
| 033 | Serialize a metadata record | 019, 031 |
| 034 | Test a function with pytest-style checks | 025, 002 |
| 035 | Package a tiny workflow | 030, 031, 034 |
| 036 | Inspect and commit a reproducible Git change | 032, 035 |

### M04 — NumPy arrays and numerical reasoning

| # | Distinct learning objective | Prerequisite numbers |
|---:|---|---|
| 037 | Construct typed arrays | 016, 003 |
| 038 | Understand shape and ndim | 037 |
| 039 | Index rows, columns and planes | 038 |
| 040 | Slice a subarray | 039 |
| 041 | Distinguish views from copies | 040 |
| 042 | Apply ufuncs and vectorization | 037 |
| 043 | Use broadcasting correctly | 038, 042 |
| 044 | Construct Boolean masks | 037, 010 |
| 045 | Make masked assignments | 044, 041 |
| 046 | Aggregate over an axis | 038, 042 |
| 047 | Treat missing numbers explicitly | 046 |
| 048 | Calculate percentiles and sorting ranks | 046 |
| 049 | Use seeded random simulation responsibly | 037 |
| 050 | Check numeric precision and overflow | 037 |

### M05 — Pandas, biological metadata and data QA

| # | Distinct learning objective | Prerequisite numbers |
|---:|---|---|
| 051 | Create and inspect a DataFrame | 019, 016 |
| 052 | Read a typed CSV table | 051, 031 |
| 053 | Select rows and columns | 051 |
| 054 | Validate column schemas | 051, 020 |
| 055 | Normalize messy sample IDs | 051, 009 |
| 056 | Find duplicates and conflicting keys | 051, 021 |
| 057 | Handle missing records | 051 |
| 058 | Join sample and imaging tables | 051, 055 |
| 059 | Group and aggregate descriptive data | 051, 046 |
| 060 | Reshape wide and long tables | 051, 053 |
| 061 | Handle timestamps and categories | 051 |
| 062 | Export a traceable dataset | 052, 054, 057 |

### M06 — Scientific figures and communication

| # | Distinct learning objective | Prerequisite numbers |
|---:|---|---|
| 063 | Build a Matplotlib figure | 037, 003 |
| 064 | Show scatter and line relationships | 063 |
| 065 | Show a numerical distribution | 063, 048 |
| 066 | Compare grouped observations | 063, 059 |
| 067 | Arrange multiple panels | 063 |
| 068 | Represent uncertainty | 063, 115 |
| 069 | Choose scales and accessible design | 063 |
| 070 | Export publication-ready graphics | 063, 062 |

### M07 — Real microscopy images, provenance and axes

| # | Distinct learning objective | Prerequisite numbers |
|---:|---|---|
| 071 | Document a real source image | 001 |
| 072 | Decode an image into an array | 037, 071 |
| 073 | Separate color/channel data | 072, 038 |
| 074 | Understand image coordinate conventions | 039, 072 |
| 075 | Interpret pixel dtype and range | 037, 072 |
| 076 | View contrast without changing data | 072, 063 |
| 077 | Crop a biological ROI | 040, 074, 072 |
| 078 | Quantify a selected ROI | 077, 046 |
| 079 | Convert pixel area to physical units | 077, 006, 071 |
| 080 | Inspect axes in multidimensional images | 038, 073 |
| 081 | Inspect a TIFF/OME-TIFF in a notebook | 080, 031, 032 |

### M08 — Image filtering, thresholds and segmentation

| # | Distinct learning objective | Prerequisite numbers |
|---:|---|---|
| 082 | Explore an intensity histogram | 072, 048, 063 |
| 083 | Estimate and subtract background | 075, 082 |
| 084 | Apply Gaussian filtering | 072, 037 |
| 085 | Choose a denoiser | 084 |
| 086 | Make a global threshold mask | 044, 072 |
| 087 | Compare automatic thresholds | 086, 048 |
| 088 | Quantify threshold sensitivity | 086, 046 |
| 089 | Apply binary morphology | 086 |
| 090 | Label connected components | 086 |
| 091 | Filter components by measured size | 090, 046 |
| 092 | Handle objects touching borders | 090 |
| 093 | Split touching candidates | 090, 092 |
| 094 | Handle 3D segmentation limits | 080, 090 |
| 095 | Compose a parameterized segmentation pipeline | 025, 083, 084, 086, 090, 091 |

### M09 — Measurements, motion and validation

| # | Distinct learning objective | Prerequisite numbers |
|---:|---|---|
| 096 | Measure region properties | 090, 051 |
| 097 | Measure intensity in regions | 096, 078 |
| 098 | Compare compartment signals | 097 |
| 099 | Audit colocalization reasoning | 073, 098 |
| 100 | Detect candidate puncta peaks | 084, 090 |
| 101 | Analyze spatial proximity | 096 |
| 102 | Estimate motion from paired positions | 018, 079, 096 |
| 103 | Detect mergers and tracking ambiguity | 102 |
| 104 | Build a manual-annotation specification | 071, 090 |
| 105 | Evaluate pixel masks | 086, 104 |
| 106 | Evaluate object detections | 096, 104 |
| 107 | Stress-test an image analysis pipeline | 095, 105, 106 |

### M10 — Scientific statistics, units and reproducibility

| # | Distinct learning objective | Prerequisite numbers |
|---:|---|---|
| 108 | Identify independent experimental units | 059, 020 |
| 109 | Audit paired study designs and compute matched change | 108, 010 |
| 110 | Detect QC exclusions and bias | 057, 109 |
| 111 | Define a treatment effect estimand | 109 |
| 112 | Aggregate within biological replicate | 059, 108 |
| 113 | Spot acquisition-batch confounding | 108, 058 |
| 114 | Implement a transparent normalization | 113, 059 |
| 115 | Distinguish standard deviation from standard error | 112, 046 |
| 116 | Choose a robust descriptive summary | 046, 112 |
| 117 | Construct a confidence interval | 115 |
| 118 | Bootstrap at the correct unit level | 112, 117 |
| 119 | Select a statistical comparison | 109, 117 |
| 120 | Report effect size and multiplicity | 119 |
| 121 | Visualize replicate-level effects | 068, 112 |
| 122 | Produce a reproducible experiment summary | 062, 111, 121 |

### M11 — Biopython, DNA sequences and introductory NGS

| # | Distinct learning objective | Prerequisite numbers |
|---:|---|---|
| 123 | Validate DNA bases and ambiguity policy | 008, 016, 010 |
| 124 | Compute and interpret DNA GC fraction | 123, 006 |
| 125 | Reverse-complement DNA | 123, 019 |
| 126 | Translate a coding sequence | 123 |
| 127 | Use Biopython Seq and SeqRecord | 123, 030 |
| 128 | Parse and write FASTA | 127, 031 |
| 129 | Extract genomic intervals | 128, 039 |
| 130 | Parse FASTQ records | 128, 127 |
| 131 | Summarize base-quality profiles | 130, 046 |
| 132 | Trim reads by a documented rule | 130, 010 |
| 133 | Count k-mers with ambiguity handling | 123, 012 |
| 134 | Perform small pairwise alignments | 127, 125 |
| 135 | Interpret mapping summaries | 129, 130 |
| 136 | Compute read coverage | 129, 037 |
| 137 | Build a count matrix | 128, 051 |
| 138 | Calculate CPM and explain limits | 137, 006 |

### M12 — Defensible baseline ML for biological data

| # | Distinct learning objective | Prerequisite numbers |
|---:|---|---|
| 139 | Frame a prediction problem | 059, 108 |
| 140 | Detect leakage before modeling | 139 |
| 141 | Design a group-aware split | 140, 108 |
| 142 | Build a preprocessing pipeline | 141, 051 |
| 143 | Establish a dummy baseline | 141 |
| 144 | Fit a linear regression baseline | 143, 142 |
| 145 | Fit a regularized classifier | 142, 143 |
| 146 | Compare one interpretable tree model | 145 |
| 147 | Cross-validate with correct groups | 141, 143 |
| 148 | Evaluate imbalanced classes | 145, 147 |
| 149 | Inspect errors and calibration | 148 |

### M13 — Unseen-data independent projects

| # | Distinct learning objective | Prerequisite numbers |
|---:|---|---|
| 150 | Debug an unfamiliar scientific script | 034, 052, 002 |
| 151 | Clean a fresh metadata dataset | 062, 057, 058 |
| 152 | Create a clear figure from new observations | 070, 059 |
| 153 | Audit an unfamiliar microscopy result | 079, 107 |
| 154 | Complete a real-image measurement project | 095, 096, 105, 122 |
| 155 | Complete a small sequence/NGS QC project | 128, 131, 138, 035 |
| 156 | Complete a group-safe biological ML project | 145, 147, 148, 122 |

## Migration of all 61 historical IDs

`KEEP` = retain the objective; `UPGRADE` = extend tests/scientific rigor; `MOVE` = reposition under prerequisites; `MERGE` = historical activity becomes embedded practice in one target. No old code or completion record is discarded. No old completion alone awards new independent/retained mastery.

| Saved lesson ID | Decision | Canonical competency # |
|---|---|---:|
| `sample` | KEEP | 005 |
| `change` | UPGRADE | 006 |
| `sample_parts` | KEEP | 009 |
| `quality_filter` | MOVE | 022 |
| `metadata_dict` | KEEP | 019 |
| `function` | KEEP | 025 |
| `replicates` | UPGRADE | 012 |
| `table` | KEEP | 051 |
| `group` | UPGRADE | 059 |
| `missing_records` | KEEP | 057 |
| `join_metadata` | UPGRADE | 058 |
| `csv_import` | KEEP | 052 |
| `clean_ids` | KEEP | 055 |
| `schema_missing` | KEEP | 054 |
| `duplicate_ids` | UPGRADE | 056 |
| `plot` | UPGRADE | 066 |
| `errorbar_plot` | UPGRADE | 121 |
| `shape` | MOVE | 038 |
| `pixel` | MOVE | 039 |
| `roi_crop` | KEEP | 077 |
| `roi_mean` | UPGRADE | 078 |
| `dtype_conversion` | KEEP | 075 |
| `axis_selection` | UPGRADE | 080 |
| `pixel_area` | UPGRADE | 079 |
| `mask` | UPGRADE | 086 |
| `bright_fraction` | UPGRADE | 088 |
| `background_subtract` | KEEP | 083 |
| `intensity_hist` | KEEP | 082 |
| `candidate_regions` | KEEP | 090 |
| `percentile_mask` | KEEP | 087 |
| `gaussian_smooth` | KEEP | 084 |
| `percentile_background` | MERGE | 083 |
| `morphological_open` | KEEP | 089 |
| `skimage_label` | MERGE | 090 |
| `remove_small` | KEEP | 091 |
| `region_table` | KEEP | 096 |
| `segmentation_precision` | UPGRADE | 105 |
| `puncta_peaks` | UPGRADE | 100 |
| `track_displacement` | UPGRADE | 102 |
| `replicate_means` | KEEP | 112 |
| `batch_normalize` | UPGRADE | 114 |
| `paired_change` | UPGRADE | 109 |
| `bio_replicate_n` | KEEP | 108 |
| `standard_error` | KEEP | 115 |
| `confidence_interval` | KEEP | 117 |
| `robust_median` | KEEP | 116 |
| `gc_fraction` | UPGRADE | 124 |
| `reverse_complement` | UPGRADE | 125 |
| `fasta_parse` | KEEP | 128 |
| `trim_quality` | KEEP | 132 |
| `fastq_qc` | UPGRADE | 131 |
| `kmer_counts` | KEEP | 133 |
| `read_coverage` | UPGRADE | 136 |
| `count_cpm` | UPGRADE | 138 |
| `group_safe_split` | KEEP | 141 |
| `ml_classifier` | UPGRADE | 145 |
| `transfer` | UPGRADE | 035 |
| `field_report` | MERGE | 095 |
| `imaging_pipeline` | UPGRADE | 095 |
| `reproducible_report` | UPGRADE | 122 |
| `final_research_pipeline` | UPGRADE | 154 |

## Non-overlap examples

- `candidate_regions` + `skimage_label` → one **connected-components** competency, with alternative implementation as practice.
- `background_subtract` + `percentile_background` → one **safe background correction** lesson comparing estimator assumptions.
- `field_report` + `imaging_pipeline` → one scaffolded **parameterized segmentation pipeline** lesson.
- `mask`, `percentile_mask`, `segmentation_precision` **remain distinct:** threshold-mask construction, threshold-method selection, and annotated accuracy validation.
- `group`, `replicate_means`, `bio_replicate_n` **remain distinct:** descriptive aggregation, replicate-level summary, and identifying experimental units.
- Reports/projects are **worked example versus independent transfer**, not repeated new instruction.

## Learning-engine and scientific contract

Each competency needs a distinct action/decision, suitable data and provenance, a small annotated example, editable Python, actionable error feedback, staged hints, changed-input and edge tests, and a delayed transfer opportunity. Not every activity needs five separate pages. The roadmap should expose one recommended next task, optional paths, and the true evidence state: unseen / explored / guided / independent / retained (plus needs review).

A Human Protein Atlas fluorescence RGB JPEG is an authentic visualization and an image-array teaching asset, **not raw calibrated fluorescence**. Pixel masks and connected regions are **candidates**, not confirmed cells, puncta or exophers. True quantitative measurement or detection accuracy requires axes/calibration and annotated reference objects. Biological fields are not biological replicates. ML needs group-safe splitting and independent evaluation.

## Ordered development gates

1. **G0:** Live deployed browser test for Pyodide cold start, package imports, original HPA CORS images, Run/check and persistence. Mocked Workers and Vercel `READY` alone cannot pass this gate.
2. **G1:** Implement and evaluate a 12–15-activity PRIMM-inspired teaching pilot with assistance-aware assessment and delayed transfer.
3. **G2:** Implement the 61-ID alias migration and skill prerequisite graph; verify export/import and 25/61 saved-state fixtures without loss.
4. **G3:** Finish the required Python foundation and real Jupyter notebook, terminal/venv and Git handoff.
5. **G4:** Add calibrated/annotated microscopy data and defensible scientific statistics before quantitative research claims.
6. **G5:** Complete optional sequence/NGS and ML paths, independently assessed projects, accessibility/phone UX, latency and full-release QA.

**Production blockers:** missing actual Python execution, broken source images without honest retry, lost progress, false mastery, uncalibrated quantitative claims or candidate counts presented as validated object detection.

## Reference ownership

- [Witz — Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner): Python/images as arrays, thresholding, filtering, regions, pipelines.
- [VanderPlas — Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/): NumPy, Pandas, Matplotlib, Jupyter/IPython and ML fundamentals.
- [Python for Biologists](https://www.pythonforbiologists.org/): biology-grounded foundations, strings, functions, files.
- [Carpentries Image Processing](https://datacarpentry.github.io/image-processing/): authentic hands-on image problems and transfer challenges.
- [Bankhead — Introduction to Bioimage Analysis](https://bioimagebook.github.io/): measurement validity, channels, calibration, microscopy artifacts.
- [Bio-image Analysis Notebooks](https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/): advanced imaging/segmentation and optional scientific workflows.
- [Biopython Tutorial](https://biopython.org/DIST/docs/tutorial/Tutorial.html): sequence objects and file formats.
- [scikit-image](https://scikit-image.org/docs/stable/), [scikit-learn](https://scikit-learn.org/stable/user_guide.html): tested implementation and defensible evaluation.

**Freeze policy:** no more whole-course theoretical redesigns. Amend specific competencies only after pilot evidence, a demonstrated scientific gap, material changed learner goals or a technical blocker. Changes require an ID impact, prerequisite diff, migration and tests. Keep this documentation branch unmerged until the technical release strategy is agreed; **do not alter the production deployment**.


## Implementation evidence — development pilot, 6 November 2026

The syllabus, graph, competency IDs and preservation map above are unchanged. The development branch `feature/v3-learning-engine-pilot` now contains 15 pilot activities matching `recommended_first_15`, with progressive scaffolding, real Python assessments and separate guided/independent/delayed-transfer evidence. The default page is the pilot; `legacy.html` preserves access to all 61 historical lessons. Optional-path readiness uses the complete manifest DAG; remaining competencies are explicitly planned, not claimed as implemented.

The Python runtime and source-image portions of G0 have browser evidence: cold Pyodide execution, reload persistence, original HPA CORS images and NumPy/SciPy/scikit-image/Biopython/scikit-learn tasks ran successfully. The Vercel preview requires authentication; deployed HTML/JS/CSS were retrieved through the authenticated Vercel connector and relayed unchanged into Chromium at that origin. Worker execution, runtime/package downloads and publisher image requests were real and unmocked. Direct authenticated navigation to the protected preview remains an access limitation; this is not a production release sign-off.

Automated pilot walkthrough and 25/61-record preservation fixtures exercise G1/G2 mechanics. Evaluation with a real learner and genuinely elapsed delayed transfer is still required. The three transfer prompts are finite; after they have been attempted the UI does not recycle them into new retention claims. Future expansion follows the unchanged graph and G3–G5 gates. See [TEST_REPORT.md](../TEST_REPORT.md) for reproducible verification and remaining release limits.


### Foundation continuation — development only

The separate branch `feature/v3-foundations-collections` extends the unchanged pilot with the next 13 entries in `recommended_default_route`: 004, 009, 013, 014, 015, 017, 018, 019, 020, 021, 022, 023 and 024. There are 28 implemented v3 activities and 128 still planned. No IDs, prerequisites, legacy aliases, default-route order or optional-path membership changed.

The notebook-workflow competency now demonstrates real persistent Python cell state, a fresh Worker/runtime on kernel restart, isolated clean-state assessments and an unexecuted Jupyter-compatible notebook export. This is a partial G3 handoff; local environment/terminal/Git competencies remain upcoming. Automated usability review corrected changed-input traceback display, untouched-record import restoration and due-review discovery. Human learner evaluation and actual elapsed delayed retention remain outstanding. Neither development PR is production approval.


### Goal-directed pilot evaluation — current development focus

The current exercise-quality increment audits all 47 available Python-stage entries against the reference notebooks, records source ownership/reuse in the manifest and improves check feedback. It adds no competency or prerequisite and keeps all existing progress and access open. The source audit and scientific-task rationale are documented in [CURRICULUM.md](../CURRICULUM.md#python-exercise-source-audit--6-november-2026); human pilot evaluation remains outstanding.

Curriculum expansion is paused at the 28 implemented activities. The active milestone is evaluating the first 15, with the goal and acceptance protocol recorded in [README.md](../README.md#goal-and-current-development-focus). Existing competencies 008, 025 and 038 supply representative independent/delayed checks; this adds no new competency or prerequisite. Written explanations require a recorded human rubric review, and reported difficulties require documented follow-up. The app recommends the next pilot action and exports evidence with explicit self-study/device-clock limits. Technical verification and learner effectiveness remain separate; the final pilot decision and production approval remain human decisions. All 61 aliases and progress records, the first-15 order, the 156-node graph and optional pathways are preserved.
