# BioPython Studio — source inventory and reuse policy

**Audited:** 2026-11-06. This is the provenance ledger for the clean rebuild; the source exercise mapping is expanded as content is implemented. No generic “referenced” badge implies permission to copy.

| Priority | Resource | Purpose and selected material | Rights/asset treatment |
|---|---|---|---|
| **PRIMARY** | [Guillaume Witz, Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner) | 9 main notebooks (Python, images as arrays, more on images, thresholding, filtering, regions, pipeline, logical flow, advanced), 7 exercise notebooks, functions/structures appendices, nuclear/edge localization demo | Repo's BSD-3-Clause teaching content with retained attribution/license; its HPA images have separate CC terms (repo describes CC BY-SA 3.0). Verify current license per image. |
| Supporting | [Jake VanderPlas, Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/) | NumPy/dtypes, slicing, Pandas merges/groupby, Matplotlib and introductory scikit-learn | Code MIT; prose CC BY-NC-ND. Link text, adapt eligible code with notice; **do not modify/reproduce whole chapters**. |
| Supporting | [Python for Biologists](https://www.pythonforbiologists.org/) | Biology-specific beginner Python, strings/GC, debugging, files, genomic motif exercises | Reuse authorization for page prose/exercises not independently established; link/reference and write original variants until checked. Do not confuse site with similarly named print books. |
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