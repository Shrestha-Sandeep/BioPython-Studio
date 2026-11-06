# BioPython Studio — Implemented 61-lesson legacy map

> **Curriculum freeze (6 November 2026):** This document describes the **61 currently implemented lesson designs** on the expanded feature branch; it is retained as the historical implementation map. The **finalized future learning syllabus** has **156 distinct prerequisite-linked competencies**, not 156 shipped lessons. See [Frozen Curriculum v3](docs/CURRICULUM_V3_FROZEN.md) and its [machine-readable migration manifest](curriculum/v3_manifest.json). All 61 old IDs remain mapped for progress preservation. No deployment or full-course implementation is implied.

**Product goal:** Enable a molecular biologist with advanced microscopy knowledge but beginner Python skills to go from basic scripts to traceable biological image analysis, reproducible experiment summaries and starter bioinformatics/ML workflows. All tasks should teach real transferable programming—not trivia or gameplay.

**Scope:** 61 completed executable lesson designs, browser app, editable Python, iterative feedback, progress, real HPA fluorescence JPEGs, and a separate reproducible Jupyter companion notebook. More specialized research methods remain explicitly out of scope.

## Curriculum inventory

| # | Lesson ID | Lesson |
|---:|---|---|
| 1 | `sample` | Sample identity |
| 2 | `change` | Treatment effect |
| 3 | `replicates` | Multiple fields |
| 4 | `function` | Reusable measurement |
| 5 | `shape` | Discover image dimensions |
| 6 | `pixel` | Inspect one pixel |
| 7 | `mask` | Threshold bright pixels |
| 8 | `table` | Create a measurements table |
| 9 | `group` | Compare conditions |
| 10 | `plot` | Plot the measured groups |
| 11 | `transfer` | Your own small analysis |
| 12 | `sample_parts` | Decode a sample ID |
| 13 | `gc_fraction` | DNA GC percentage |
| 14 | `quality_filter` | Filter low-quality fields |
| 15 | `metadata_dict` | Build a metadata record |
| 16 | `roi_crop` | Crop a region of interest |
| 17 | `roi_mean` | Mean signal in an ROI |
| 18 | `bright_fraction` | Fraction of bright pixels |
| 19 | `background_subtract` | Subtract background safely |
| 20 | `intensity_hist` | Make an intensity histogram |
| 21 | `candidate_regions` | Find connected regions |
| 22 | `missing_records` | Handle missing measurements |
| 23 | `join_metadata` | Join image and sample metadata |
| 24 | `replicate_means` | Respect biological replicates |
| 25 | `field_report` | Reusable microscopy report |
| 26 | `dtype_conversion` | Understand pixel bit depth |
| 27 | `axis_selection` | Understand stacked image axes |
| 28 | `pixel_area` | Convert pixels to physical area |
| 29 | `percentile_mask` | Adapt threshold to each field |
| 30 | `gaussian_smooth` | Reduce image noise |
| 31 | `percentile_background` | Subtract an estimated background |
| 32 | `morphological_open` | Clean a binary mask |
| 33 | `skimage_label` | Label candidate regions |
| 34 | `remove_small` | Filter small connected regions |
| 35 | `region_table` | Measure each segmented region |
| 36 | `segmentation_precision` | Evaluate a segmentation mask |
| 37 | `imaging_pipeline` | Build an image-measurement function |
| 38 | `csv_import` | Read a measurements CSV |
| 39 | `clean_ids` | Standardize sample identifiers |
| 40 | `schema_missing` | Flag incomplete sample metadata |
| 41 | `duplicate_ids` | Detect duplicate records |
| 42 | `batch_normalize` | Normalize within acquisition batches |
| 43 | `paired_change` | Analyze paired biological samples |
| 44 | `bio_replicate_n` | Count true biological replicates |
| 45 | `standard_error` | Calculate biological-replicate SEM |
| 46 | `confidence_interval` | Estimate a 95% confidence interval |
| 47 | `robust_median` | Use a robust summary when appropriate |
| 48 | `errorbar_plot` | Plot replicates with uncertainty |
| 49 | `reproducible_report` | Build a reproducible experiment summary |
| 50 | `reverse_complement` | Reverse-complement a DNA sequence |
| 51 | `fasta_parse` | Read a FASTA file |
| 52 | `trim_quality` | Trim low-quality read tails |
| 53 | `fastq_qc` | Inspect FASTQ quality |
| 54 | `kmer_counts` | Count short DNA motifs |
| 55 | `read_coverage` | Compute reference coverage |
| 56 | `count_cpm` | Normalize NGS counts to CPM |
| 57 | `puncta_peaks` | Detect candidate fluorescence peaks |
| 58 | `track_displacement` | Estimate motion from paired coordinates |
| 59 | `group_safe_split` | Prevent biological-replicate data leakage |
| 60 | `ml_classifier` | Train a transparent baseline classifier |
| 61 | `final_research_pipeline` | Complete your independent research workflow |

## Learning sources

Primary: [Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner) and [Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/).
Imaging: [Introduction to Bioimage Analysis](https://bioimagebook.github.io/), [Bio-image Analysis Notebooks](https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/), [The Carpentries Image Processing](https://datacarpentry.github.io/image-processing/), [scikit-image](https://scikit-image.org/docs/stable/).
Biological and computational: [Python for Biologists](https://www.pythonforbiologists.org/), [Biopython](https://biopython.org/DIST/docs/tutorial/Tutorial.html), [scikit-learn](https://scikit-learn.org/stable/user_guide.html).

## Learning system and acceptance criteria

- One task, supplied data, editor, Run and feedback on the default screen; course map and extended guidance collapsed. A microscope image is shown only when used in the current task.
- Every new lesson evaluates code on three changing datasets; wrong/hardcoded answers fail. Correct independently solved lessons and guided solutions are recorded distinctly.
- Each lesson has three explanatory steps, expected result, check semantics, two hints, scientific relevance and a scientifically honest caution.
- Preserve earlier `id` keys, `localStorage` key and lesson order through future changes. Never move or remove the original 25 without an explicit migration.
- Browser image arrays must come from actual decoded HPA source JPEGs; no fake fallback masquerading as real data. Show errors/retry on corrupted or inaccessible source files.
- Python evaluation uses a real interpreter and bounded educational source/step limits. This is NOT an adversarial multi-tenant sandbox.

## Scientific evidence boundaries

- RGB JPEG intensity is not quantitative raw microscope intensity, nor does an integer array cast recover original bit depth.
- Exercise pixel_size_um numbers, FASTA/FASTQ examples, tracking coordinates, replicate tables, ML feature vectors and comparison masks are constructed teaching data—not actual scientific observations.
- Connected-component counts, selected mask pixels and local maxima do not establish biological object identity. Evaluation against manually annotated truth is required for cells, exophers or puncta.
- Report the number of **independent biological replicates**, distinct from the number of microscope fields. Do not claim treatment effects from illustrative sample values.
- The optional notebook demonstrates real image decoding, masks, candidate measurements, provenance and a real-TIFF inspection workflow when a local TIFF is supplied. It does not automatically provide a calibrated original TIFF.

## Release criteria

- Python: original and new cases pass; code repair, updated NumPy indexing and overfitting rejection tested across 61 lessons.
- Browser: minimum three viewport sizes, all lesson navigation, progress persistence, live image view, corrupt-image retry and final notebook download link.
- Deployment: preview branch exact SHA + test results before promotion; production alias and SHA inspected afterwards.
- Runtime: verify a cold Pyodide load and a heavy advanced package import in an actual deployed browser. Log this as **unverified** if network or protected deployments prevent it.

## Not currently in the app

- Live user-supplied raw TIFF/OME-TIFF upload and decoding in the web app; arbitrary microscopy upload requires security, file-size/axes/metadata and performance handling.
- Manually annotated HPA object boundaries, validated exopher detection, complete segmentation model QA or a trained model ready for research inference.
- Full NGS analysis stack (FASTQ to alignment and variant calls), advanced statistics, interactive conversational AI tutor, or cloud progress synchronization.

## Development organization

All previous planning chunks are consolidated into this map and [README.md](README.md); do not create redundant one-off blueprints. Source truth: GitHub `main`; deployment: connected Vercel project `biopython`. Keep independent BioCompute and AppDeploy ImageLab unchanged.