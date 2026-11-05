# BioPython Studio — personalized learning plan

## Design decision

Target **scientific Python competence**, not completion of a game. The user's expertise in biological experiments and microscopy is treated as an asset: no elementary biology quizzes, no fictional lab safety claims, no XP/streak system, and no arbitrary robot puzzles. Every task should transfer to an actual analysis script or notebook.

Two sources provide complementary structure:

- [Guillaume Witz — Image Processing for Beginners](https://guiwitz.github.io/PyImageCourse_beginner/README.html): fast entry from Python basics to real image processing, focusing on selected Python essentials, NumPy arrays, thresholding, filtering, regions and pipelines.
- [Jake VanderPlas — Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/): deep, more general reference for IPython/Jupyter, NumPy, Pandas, Matplotlib and scikit-learn, with Python fundamentals as an assumed prerequisite.

The material is referenced by topic and linked directly, not copied. Library APIs are updated and exercises are original.

## Implemented v0.1: eleven progressive skills

| Stage | Skill | Python capability | Scientific proof | Sources |
|---|---|---|---|---|
| F01 | Sample identity | variables, printing | correct label for unknown specimen IDs | Witz 01 |
| F02 | Treatment effect | arithmetic, percentages, rounding | correct calculation with changed controls | Witz 01 |
| F03 | Multiple fields | lists, `sum` | sums lists of varying length | Witz 01 |
| F04 | Reusable measurement | function with return | calculates mean for different lists | Witz 08 |
| N01 | Discover image dimensions | NumPy arrays, shape | handles unknown 2D shapes | Witz 02; Handbook NumPy |
| N02 | Inspect one pixel | zero-based NumPy indexing | reads real pixel array values | Witz 02; Handbook NumPy |
| N03 | Threshold bright pixels | Boolean masks, aggregation | correct mask on varied images/thresholds; orange overlay | Witz 04; Handbook NumPy |
| D01 | Create measurements table | Pandas DataFrames | constructs and sums real tabular data | Witz 07; Handbook Pandas |
| D02 | Compare conditions | groupby and means | correct condition-level aggregation on varied rows | Witz 07; Handbook Pandas |
| V01 | Plot measured groups | Matplotlib axes and labels | renders a real Python-generated figure on changed group means | Witz 03; Handbook Matplotlib |
| T01 | Your own analysis | functions, lists, dictionaries | reusable independent per-specimen summary on changed cases | Witz 07 |

### Required feedback semantics

- **Taught** — correct example, clear biological motivation and a simple interaction.
- **Practiced** — learner writes or modifies executable Python and receives actionable checks.
- **Independently demonstrated** — their code works on unseen changed inputs without opening the hint.
- **Guided** — the same correct performance after a hint; valuable learning, not failure.
- **Not demonstrated** — script, scientific semantics, or execution still incorrect.

## Roadmap beyond v0.1 — deliberately not marked implemented

### Phase 2: Real image fundamentals

- Open a TIFF through a reproducible path in a real notebook.
- Bit depth/dtype, channels, axes, calibration, intensity ranges and safe conversion.
- Histogram visualization and scientifically honest threshold selection.
- Noise, filtering, background subtraction, morphology; explain assumptions and artifacts.
- Thresholded pixel area versus connected component object count versus true biological count.
- Manual reference annotations, uncertainty, overlap and double counting.

### Phase 3: Robust microscopy measurement

- Use `scikit-image` to label objects and measure region properties.
- ROI definitions, image crop/scale, pixel units and per-object tables.
- 2D vs 3D; multichannel and time-lapse cases; tracking caution.
- Compare segmentation to annotated truth, evaluate false positives/negatives and boundary errors.
- Perform a dry-run replication using public image datasets with provenance.

### Phase 4: Experimental data handling and defensible inference

- Pandas joins between measurements and sample metadata, missingness, validation, identifiers, and batch conditions.
- Biological versus technical replicates; confidence and pseudoreplication.
- Accurate effect sizes and uncertainty, clear Matplotlib plots and reproducible reports.
- Real Jupyter/IPython workflow: restart kernel, rerun all cells, handle paths and environments.

### Phase 5: Reproducible scientific analysis

- Create independent analysis functions, scripts and notebooks from real inputs.
- Versioning, environments, fixed input/output paths and source provenance.
- Automated quality tests using manually curated expected outputs.
- Project: annotated images → measured objects → tables → descriptive/inferential results → documented limitations.

### Phase 6: Optional specialization

- Fluorescence puncta, C. elegans images, neuronal aggregates and exopher-like structures with domain-specific ground truth.
- Machine learning and scikit-learn for feature-based baselines; train/test leakage, nested replicates, validation errors and model limitations.
- Optional NGS/bioinformatics branch and additional data science projects from the Handbook.

## Release gate for the next version

Before new content: test live Pyodide loading (cold and warm); confirm NumPy/Pandas/Matplotlib packages load from CDN; test different browsers, mobile, accessibility and saved progress; verify all skill checks and exported code. Do not confuse local CPython or mocked-Worker tests with live browser execution.

### Real-image teaching source (2026-11-05)
The NumPy array/shape, pixel reading and mask lessons now use resampled blue-channel pixel values from three **real HPA fluorescence composite images**, not synthetic Gaussian spots. The visible microscopy photograph matches the array from which the mask is derived. This remains a beginner *JPEG-array demonstration*, not calibrated measurement of raw microscopy data. Other numeric and table cases are illustrative until a later verified dataset-based module. See README for exact source image links, attribution, license and future raw-data requirements. This replaces previous synthetic-imaging guidance without changing the Handbook/PyImageCourse skill order. Do not fork whole upstream educational repositories merely to borrow examples; link to lessons and fetch only appropriately licensed and attributed necessary images from their publisher, with integrity checks.

## Chunk 1 completed — Applied Python and image measurements (2026-11-05)

The original 11 lessons remain in the same order and retain their IDs and save-state keys. The 14 new lessons are appended, giving **25 executable activities**. These new lessons check code on three independent inputs each rather than comparing only a displayed sample output.

| Stage | Lesson IDs | Capability | Primary external teaching reference |
|---|---|---|---|
| 06: Scientific Python in the lab | `sample_parts`, `gc_fraction`, `quality_filter`, `metadata_dict` | String parsing, sequence arithmetic, conditional filtering, experimental metadata | Python for Biologists; VanderPlas |
| 07: Quantitative microscopy | `roi_crop`, `roi_mean`, `bright_fraction`, `background_subtract`, `intensity_hist`, `candidate_regions` | NumPy ROI, intensity, masks, uint8-safe subtraction, histograms, SciPy connected components | Bankhead; Carpentries; Haase; Witz; VanderPlas |
| 08: Data integrity and replication | `missing_records`, `join_metadata`, `replicate_means` | Missingness, merge identity, field-to-replicate grouping | VanderPlas; Haase; Bankhead |
| 09: Imaging project | `field_report` | Reusable real-image blue-channel report across unfamiliar images | Haase; Carpentries; Bankhead |

**Scientific limitations:** Source images are Human Protein Atlas RGB composite JPEGs, not calibrated raw microscopy files. Array values are decoded, resized 8-bit blue-channel pixels. Connected regions are candidate components, NOT biological cell counts. The metadata, sequence and Pandas exercise data are original illustrative records; they are not claimed as experimental results. Where metadata input is used, it is supplied by the task rather than inferred from images. Every added lesson links relevant external source(s) under the optional reference section. No book text or image from other sources is copied.

**Further chunk roadmap (update this section, do not create duplicate planning files):**

- **Chunk 2:** Raw TIFF/OME axes, pixel calibration, image loading and provenance, scikit-image filters, threshold selection, morphology, labeling, regionprops and segmentation validation against known truth. Require a genuinely licensed dataset with annotations and a review of each scientific assumption.
- **Chunk 3:** Real scientific tables, biological vs technical replicate structure, missingness policies, plotting uncertainty, descriptive statistics, Jupyter/Colab reproducibility, documented environment and exported notebook/script pipeline.
- **Chunk 4:** Bioinformatics/NGS file processing, qPCR or experimental assay data, time-series and C. elegans puncta / exopher-like imaging, introductory classification with independent train/test assessment. Distinguish technical potential from scientifically validated identification.

**Validation gate:** Existing 27 Python harness checks must stay green. New lessons need good/bad executable Python cases, image loading and science checks, JS syntax, browser navigation, and a GitHub-connected Vercel preview before promotion. Live Pyodide + SciPy browser execution should be verified separately from local CPython tests.

### Additional source links

- Python for Biologists: https://www.pythonforbiologists.org/
- Pete Bankhead, Introduction to Bioimage Analysis: https://bioimagebook.github.io/
- Robert Haase et al., Bio-image Analysis Notebooks: https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/
- The Carpentries Image Processing with Python: https://datacarpentry.github.io/image-processing/
- Guillaume Witz, Image Processing for Beginners: https://guiwitz.github.io/PyImageCourse_beginner/README.html
- Jake VanderPlas, Python Data Science Handbook: https://jakevdp.github.io/PythonDataScienceHandbook/
