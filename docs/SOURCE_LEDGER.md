# BioPython Studio — source inventory and reuse policy

**Audited:** 2026-11-06. This is the provenance ledger for the clean rebuild; the source exercise mapping is expanded as content is implemented. No generic “referenced” badge implies permission to copy.

| Priority | Resource | Purpose and selected material | Rights/asset treatment |
|---|---|---|---|
| **PRIMARY** | [Guillaume Witz, Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner) | 9 main notebooks (Python, images as arrays, more on images, thresholding, filtering, regions, pipeline, logical flow, advanced), 7 exercise notebooks, functions/structures appendices, nuclear/edge localization demo | Repo's BSD-3-Clause teaching content with retained attribution/license; its HPA images have separate CC terms (repo describes CC BY-SA 3.0). Verify current license per image. |
| Supporting | [Jake VanderPlas, Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/) | NumPy/dtypes, slicing, Pandas merges/groupby, Matplotlib and introductory scikit-learn | Code MIT; prose CC BY-NC-ND. Link text, adapt eligible code with notice; **do not modify/reproduce whole chapters**. |
| Supporting | [Martin Jones, *Python for Biologists*](https://pythonforbiologists.com/) | Beginner Python, biological strings and file-processing practice, DNA and protein tasks | The book and exercise downloads are source references; do not copy copyrighted book prose or problems without reuse permission. Link the official source and author original variants. |
| Supporting | [Data Carpentry Image Processing](https://datacarpentry.github.io/image-processing/) | Image basics, histograms, thresholds, connected components, scientific challenges | Text CC BY 4.0 unless specified; third-party images require separate checks. Use attributed select challenges without duplicating Witz. |
| Supporting | [Pete Bankhead, Introduction to Bioimage Analysis](https://bioimagebook.github.io/) | Digital images, segmentation quality, intensity measurement, optics/analysis limitations | Original content CC BY 4.0; microscopy images may belong to others. |
| Deepening | [Bio-image Analysis Notebooks](https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/) | Filtering, morphologies, segment validation, tracking, 3D/OME-TIFF, image ML and feature extraction | Broad CC BY 4.0/BSD3 statements subject to individual notebooks and images. |
| Reference | [scikit-image](https://scikit-image.org/docs/stable/) | Official image processing APIs/tests/examples; adapt to supported current versions | Check example/data attribution, package license and documentation media individually. |
| NGS | [Biopython Tutorial](https://biopython.org/DIST/docs/tutorial/Tutorial.html) | Seq/SeqRecord, SeqIO, FASTA/FASTQ, simple sequence QC | Use official documentation/API; verify material and data reuse rights before copying exercises. |
| ML | [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html) | Pipeline, group-aware splitting, baseline classification, validation and error analysis | Official APIs and source references; check dataset/example licensing when bundling assets. |
| Data | [Human Protein Atlas Cell Atlas](https://www.proteinatlas.org/humanproteome/cell) | Real cellular fluorescence composites; Witz's nuclear-localization example images | Source-specific license/attribution, stable local teaching copies when allowed; composites are not calibrated raw fluorescence. |

## Specific Witz exercise mapping (candidates, NOT fully built)

| Source notebook | Representative original tasks | Intended learning result |
|---|---|---|
| e01-Python_basics.ipynb | Variables, types, strings, image import | First specimen script and image entry |
| e08-Loops_conditions.ipynb | Squaring/filtering lists with for/if | QC for microscope fields |
| e02-Numpy_basics.ipynb | 6-by-4 array of ones, indexing, multiplication, Boolean masking | Learn pixel-array reasoning |
| e03-More_on_Images.ipynb | Image shape, dtype, histogram and cropping | Real-image inspection |
| e04-Thresholding.ipynb | Isolate green channel, choose and compare thresholds | Foreground mask |
| e05-Filtering.ipynb | Edge filtering, erosion and skeletonization | Mask cleanup and failure analysis |
| e06-Regions.ipynb | Label mask, measure region properties, plot intensities | Candidate nuclei table |
| 07-Pipeline.ipynb + Demo.ipynb | Reusable functions, multiple HPA images, nuclear versus nuclear-edge signal | Reproducible research pipeline |

For every selected source element record: repository and pinned commit/blob SHA, notebook path, cell index, task owner, dataset SHA/license, source acknowledgement, any API modernization, answer contract, independent transfer and explicit “new / adapted / referenced / excluded” state.

## Do not confuse source availability with course completion

Witz and Carpentries contain ready-made problems, not a fully tested browser learning engine. Most require adapting notebook state, data URLs, packages, tests, feedback and learning scaffolds. Witz is the primary sequential source; supporting references should fill gaps without a second curriculum competing for attention.
## Historical Witz ingestion (early source-first preview; not current implementation status)

- Indexed **12** Witz main/appendix/demo notebooks with **90** headings and **7** exercise notebooks with **54** numbered source tasks. Full source-cell provenance and original texts reside in [`curriculum/witz_exercise_inventory.json`](../curriculum/witz_exercise_inventory.json).
- **12** original worked-code excerpts from Witz's lesson notebooks are available in the Learn interface with their original notebook paths and cell indices. They may require preceding notebook setup and are not claimed to be ready-to-run standalone code.
- **47** of the numbered source tasks are currently surfaced as step-by-step exercises inside eight connected Python/image-analysis preview missions; the remaining seven are still inventoried. This is **not yet a completion or mastery claim** because the real Python engine is not installed in this clean rebuild.
- Bundled **six** Witz-rendered figures under [`assets/witz/`](../assets/witz/) with copyright, notebook cell and HPA attribution in [`assets/witz/CREDITS.md`](../assets/witz/CREDITS.md). The source TIFF images are linked but not bundled. All pixel-based measurements await actual scientific array files.
- Added targeted support from VanderPlas, Martin Jones, Carpentries, Bankhead, BioImageAnalysisNotebooks and scikit-image to address meaningful gaps without establishing a competing syllabus.

**Distinction:** Martin Jones's *Python for Biologists* books and exercise files are at `pythonforbiologists.com`; `pythonforbiologists.org` is a separate online genomics-oriented course, useful as an additional reference but not the same book.

## Frozen v3 optional sequence/NGS and ML curriculum (November 2026)

- **Biopython chapters N01–N04:** Original author-created synthetic records, explicit FASTA/FASTQ/Phred quality examples, DNA ambiguity policies, 0-based genomic intervals, k-mer counting, transparent small alignments, source-linked mapping summaries, coverage and CPM. Main API reference: [Biopython Tutorial](https://biopython.org/docs/latest/Tutorial/) and [Biopython library](https://biopython.org/). Pyodide 314.0.7 includes Biopython 1.87, while separately installed desktop Python may use a different version. No external biological sequence is silently attributed to a database or real specimen.
- **ML chapters L01–L03:** Original author-created synthetic image-feature records with explicit animal grouping, train-only preprocessing, DummyClassifier, LinearRegression, LogisticRegression, DecisionTreeClassifier, GroupShuffleSplit/GroupKFold, balanced metrics and Brier score. Library reference: [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html), [common pitfalls and data leakage](https://scikit-learn.org/stable/common_pitfalls.html). The Pyodide 314.0.7 package list includes scikit-learn 1.8.0. No claims of external generalization or calibrated clinical/biological probabilities.
- **Assessment:** All new chapter starter scripts are independent from author-side reference programs in tests/reference_n*.json and tests/reference_l*.json. Three changed-input scenarios per Apply/Prove (except ungraded Review Apply) and distinct test sets are intended for technical verification, not a published claim of learner retention.
- **Data and licensing:** All new input strings, record IDs, animal labels, numeric features and quality arrays are synthetic material written for this app. No Witz/HPA figures or real sequence reads are redistributed as part of these new chapters. Existing Witz credits and licensing remain unchanged.
