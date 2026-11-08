# A02b real-data microscopy assessment — 8 November 2026

**Technical status:** implementation and real-data benchmark executed, with reproducible CI and preserved source-file provenance.  
**Research validation status:** independent cross-experiment generalization **NOT established**; no exopher detection claim.  
**Existing learner app:** unchanged (all 26 chapters and UI remain untouched); this is a draft advanced research project.

## Question

Does a transparent, input-only image-intensity polarity router address the **dark-object-on-bright-background failure** of the previously measured classical Otsu+watershed pipeline?

The router has a predeclared rule: on unsigned scientific images, infer **dark foreground** when the border median exceeds 55% of the dtype maximum; otherwise infer **bright**. A 2D RGB/RGBA teaching image is converted explicitly to derived luminance; a native 2D 16-bit image is preserved. This is a heuristic, not a machine-learned modality classifier and not a calibrated fluorescence transform.

## 1. Retrospective original BBBC038 training diagnostic

[Successful train-only run](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/42525845228) on 40 deterministic original `stage1_train` images (not the already evaluated `stage1_test`).

| Measure | Fixed original bright-foreground baseline | Source-only intensity route |
|---|---:|---:|
| Image-macro object F1 at IoU ≥ 0.5 | **0.6904** | **0.7730** |
| Mean absolute object-count error / image | 9.275 | 8.875 |

The router inferred **dark for 7** and **bright for 33** of the 40 training images. This is an increase of **0.0826 F1 points** on the **training images**, not a validated prospective improvement. Method development explicitly followed inspection of the old BBBC038 test failures, so this is a retrospective exploratory result.

**Training-source SHA-256:** `dcb6edc2690f137406638b2309581a71522c4dff19157d118453b448dcddcb68` for the original Broad `stage1_train.zip`.

## 2. Real external BBBC039 fluorescence benchmark

[Successful 50-image original BBBC039 16-bit evaluation](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/42526066200). Original Broad archives: 200 source TIFF images, original PNG class labels, and official metadata split. Evaluation was restricted to the Broad **50-image official test**; the method and router rule were fixed before viewing test labels.

| Measurement | Fixed Otsu + watershed | Image-only polarity router + Otsu + watershed |
|---|---:|---:|
| Reference nuclei (interior connected components) | 4,727 | 4,727 |
| True-positive one-to-one object matches (IoU ≥ 0.5) | 4,341 | 4,341 |
| False-positive candidate objects | 1,252 | 1,252 |
| Missed annotated nuclei | 386 | 386 |
| Object-level micro precision | 0.7761 | 0.7761 |
| Object-level micro recall | 0.9183 | 0.9183 |
| **Object-level micro F1** | **0.8413** | **0.8413** |
| Image-macro object F1 | 0.8390 | 0.8390 |
| Image-macro foreground-pixel IoU | 0.8142 | 0.8142 |
| Mean absolute object-count error / image | 17.56 | 17.56 |

The intensity router inferred bright-object polarity for **all 50** native 16-bit Hoechst fields. **It made no improvement whatsoever on BBBC039** and the two evaluated methods returned identical labels and scores.

### Original source SHA-256

- `images.zip`: `6f30a5d4fe38c928ded972704f085975f8dc0d65d9aa366df00e5a9d449fddd7`
- `masks.zip`: `f9e6043d8ca56344a4886f96a700d804d6ee982f31e2b2cd3194af2a053c2710`
- `metadata.zip`: `a2c1f900bed9ba92a99553efd4c2ae98598433691c7401d818653ab61110deb2`

Downloaded directly from `https://data.broadinstitute.org/bbbc/BBBC039/`; original image/annotation bytes were not committed to GitHub. Per-image metrics and **8 original-image QC boundary overlays** are retained as the GitHub Actions artifact.

### Manual overlay inspection

Source visualization stretches *only the display* to the 1st–99th percentiles. Cyan outlines = reference nuclei, red = segmented candidates, yellow = shared boundaries.

- **`IXMtest_A12_s7_w1...`**: worst evaluated image, **object F1 0.462** with 29 reference nuclei and 23 candidates. Visible fragmented/lobed bright structures and mismatched contours illustrate a failure of simple region separation, even with correct bright foreground.
- **`IXMtest_M12_s7_w1...`**: dense field, **F1 0.759**, 146 reference nuclei and 199 candidates. Visible red boundaries frequently split contiguous objects that expert annotation treats as single nuclei; object-count inflation is the dominant concern in this example.
- **`IXMtest_B02_s9_w1...`**: well-separated nuclei, **F1 0.929**, with mostly coincident outlines and a smaller number of false splits.

The overlay examples support **qualitative error hypotheses**, not a causal ablation of every failure type. The full per-image CSV and source annotations are needed to quantify a specific mechanism.

## 3. Scientific interpretation and uncertainty

The earlier heterogeneous BBBC038 published stage1-test benchmark yielded micro object F1 0.3849, image-macro F1 0.5292. The new BBBC039 official-test benchmark yielded micro F1 0.8413. **Do not subtract these numbers and attribute the difference to the new algorithm**: the algorithm is essentially the same on BBBC039; the datasets differ in image modality, biological material, object density and reference-mask convention.

Importantly, the **[Broad BBBC039 page](https://bbbc.broadinstitute.org/BBBC039)** explicitly notes that a small fraction of the images also appear in BBBC038. That source overlap has **not been excluded image-by-image** in this project. Therefore BBBC039 is a separately released, official test set but **not verified as entirely source-independent** of the earlier evaluated data. The official partitions also do not necessarily correspond to independent experiments or plates.

The original **BBBC039 mask PNG** uses first-channel class code 1 for nucleus interiors, with codes 2/3 marking boundaries. The evaluator labels connected code-1 interiors as individual reference instances and treats code 2/3 as background for pixel-IoU. This convention is clearly declared in code and has an effect on IoU, particularly at object borders. Results are not directly comparable to metrics with boundary-exclusion or BBBC038's original per-object binary annotations.

The original 16-bit TIFF retains native values in computation. It does **not** prove calibrated physical fluorescence units, illumination correction, object identity outside the given expert labels, or acceptable exopher detection accuracy.

## 4. Learning and engineering verdict

- **GO**: Keep the simple polarity router as an *educational, explainable* method and a useful example of research-level generalization failures.
- **MAYBE**: Add a validated modality-aware segmentation pathway after a further truly independent dataset and explicit ablation.
- **NO**: Do not advertise this as a universal nuclei classifier, machine-learning model or research-grade exopher counter.
- **NEXT SCIENTIFIC PROBLEM**: On training/validation data only, investigate watershed-induced **over-segmentation**, uneven nuclei intensities and object-density effects. Choose a method before touching a new holdout.
- **NEXT LEARNING PROBLEM**: Require an independent learner to predict routing, recognize failure cases, and reproduce a source-preserving benchmark locally without copying the solution.

Software CI and source integrity have passed; **no human retention or independent microscopy learner assessment has been performed**. A04 in the frozen blueprint remains reserved for optional 3D/time-lapse; this is A02b.
