# BioPython Studio — Research-led chapter tutorial production blueprint v1.0

**Status:** Development contract; editable blueprint, not evidence of completed chapters.
**Created:** 2026-11-13.
**Baseline:** `feature/foundation-visual-explanations` (P01–P06 guided tutorials and 40 nonredundant step diagrams).
**Implementation branch:** `feature/imaging-tutorial-cycle-i01-i02`.
**Production boundary:** Do not change `main`, frozen `ui-first-2`, or learner-progress storage contracts.

## 1. Decision and scope

The app's actual chapter sequence after P06 is **I01–I13 (Microscopy)**, then **N01–N04 (Sequence Analysis)** and **L01–L03 (Machine Learning)**. There is no P07. The v3 competency manifest is a longer-term competency map and must not be mistaken for already shipped lesson screens.

Build one *chapter-level narrated worked example* per existing chapter, with visual explanations that relate to the canonical Learn → Apply → Prove activities. Do **not** create parallel lessons, mark an exercise complete because a tutorial was watched, or add clutter to the frozen UI.

An individual chapter's tutorial should follow the established **Predict → Run → Investigate → Modify → Write → Debug/Transfer** cycle and ultimately return the learner to actual Python execution.

## 2. External research and operational implications

| Evidence/source | Finding relevant to the app | Implementation implication |
|---|---|---|
| Witz, *Image Processing for Beginners*, https://github.com/guiwitz/PyImageCourse_beginner | Teaches image processing with real HPA-derived microscopy images and progresses from arrays to thresholds, regions, pipeline. | Keep Witz as primary scientific spine; map source notebook and image rights explicitly. |
| Bankhead, *Introduction to Bioimage Analysis*, https://bioimagebook.github.io/index.html and https://bioimagebook.github.io/chapters/1-concepts/1-images_and_pixels/images_and_pixels.html | Distinguishes numerical pixel values, images and display mappings. | Separate image data from LUT/display and from biological interpretation. |
| Haase et al., *Bio-image Analysis Notebooks*, https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/ | Moves from beginner 2D examples to 3D/time-lapse biological datasets. | Teach shape/axes clearly before assuming Z, T or C, then introduce multidimensional data. |
| NumPy official quickstart, https://numpy.org/doc/stable/user/quickstart | Specifies shape, dtype, ndarray indexing, slicing and views/copies. | Scripts must execute under NumPy, using row-major examples, consistent dtype and appropriate copying. |
| Muldner et al. 2023, *A Review of Worked Examples in Programming Activities*, https://eric.ed.gov/?id=EJ1381113 | Code tracing and code generation require distinct scaffolding; worked examples are a researched teaching format. | Include code tracing and predicted outputs, followed by independent changed-input writing. |
| Review of cognitive-load design strategies, https://pmc.ncbi.nlm.nih.gov/articles/PMC7940870/ | Coherence, signaling, spatial contiguity, redundancy reduction and segmentation support learning. | One salient visual idea per step; no repetitive cards, unnecessary motion or detached diagrams. |
| Mayer/Pilegard on segmenting, https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-for-managing-essential-processing-in-multimedia-learning-segmenting-pretraining-and-modality-principles/DD24C2F48B9B1277CE59F78276110258 | Learner-paced, shorter segments limit essential overload. | Keep Back/Next/Pause/Reveal; never force continuous narration. |
| Browser voice constraint | Speech synthesis word-boundary events vary by voice/browser. | Highlight based on actual boundary events when available; keep complete static diagrams as the fallback. |

**Evidence distinction:** These sources support design choices; none proves a 9.5/10 learning outcome for this individual learner. Actual learning requires an unassisted transfer task.

## 3. The repeating cycle (always in order)

1. **RESEARCH + MAP** — Read the canonical chapter markdown, goal IDs, Apply/Prove expectations, source material and existing browser contract. Determine what visual would eliminate a concrete misconception.
2. **WRITE BLUEPRINT** — Specify a single motivating workflow, 12–20 learner-paced scenes, mappings to every chapter goal and capstone, one prediction checkpoint before any answer, code snippets/output, visual and provenance requirements, interactive input, and independent transfer. Commit Markdown **before** implementing the tutorial.
3. **BUILD** — Add one optional chapter data module. Reuse existing viewer/navigation, preserve data, and create only needed diagrams. Avoid adding a new panel or autoplaying effects.
4. **QA** — Validate data schema, goal/scene coverage, syntax, all shown Python outputs and failure messages under fresh Python, changed-input behavior, boundary/copy/axis errors, figure licensing, responsive browser layout, voice/checkpoint behavior, keyboard interactions, and editor/storage isolation.
5. **REVIEW + REWORK** — Explicitly inspect failing checks and pedagogical gaps (misleading scientific claim, repetition, awkward pacing). Revise the blueprint *and* lesson if needed, rerun the entire relevant gate; log the correction.
6. **FREEZE CHAPTER** — Only mark ready after all automated gates pass. Never claim learner comprehension has been proved by CI.
7. **ADVANCE** — Start step 1 for the next canonical chapter. Keep an iteration log and failure/revision decision for each chapter.

**Stop criteria:** Any incorrect executable output, unverifiable figure provenance, leakage into Apply/Prove, hidden-state dependency, broken mobile interaction, or misrepresented scientific data is a blocking defect.

## 4. General lesson-data contract

Keep the established `scene(title, say, code, focus, visual, output, note, goal, extra)` model.

- `goals`: exact canonical ordered `CHAPTER-G01` ... `CHAPTER-CAPSTONE` IDs, excluding delayed REVIEW.
- `steps`: at least one scene for each goal plus capstone, 12–20 total when genuinely useful; never pad a lesson to reach a count.
- First scene: real scientific destination with explicit image *status and source*. If source is illustrative, say so.
- Each subsequent scene: one new distinction; concise narration; progressive code-line highlighting; a diagram only where it adds understanding.
- Exactly one explicit `checkpoint:true` with empty output; pressing Reveal must show the result.
- Output is a **preview**, not an execution result; user returns to real editor to run Python.
- Scenes with code and output must be independently runnable from a clean interpreter; do not rely on hidden notebook state, transient `image_path`, browser-only files or uninstalled packages.
- If a demonstration is pseudocode or needs externally staged data, avoid printing a fabricated output; label it as conceptual.
- Always distinguish real PNG display pixels, raw acquisition data, in-memory synthetic arrays, and hypothetical metadata or calibration.
- Every tutorial ends with a **new-input transfer challenge** without the worked solution.
- Optional diagram is synchronized with the present step; default to no diagram when prose, highlighted code or value cards already suffice.

## 5. Scientific provenance rules

1. The credited Witz/HPA PNG assets are genuine **rendered notebook figures**, not raw TIFFs and not known physical calibrations. Never use them to claim fluorescence intensity or measured biological object counts.
2. Two published figures may be different examples; never claim they are a validated before/after of the same input unless source notebook links and image identity establish it.
3. Numeric `uint8` / `uint16` / floating point arrays created in code are synthetic **training data**. A numeric array represents pixels only if source and acquisition provenance justify that association.
4. For physical length or area, state the scale and units. In particular pixel count × (µm/pixel)^2 is area, not a physical length.
5. Shape alone does not identify `T`, `C`, `Z`, `Y`, `X` axis meanings; metadata and channel declarations are needed.
6. `ndarray` views can mutate underlying data. Teach explicit source preservation, zero-based indexes and half-open slices.
7. Exclusion counts and biological replicate IDs remain traceable. A microscope field is not automatically an independent biological replicate.
8. Keep exact licensing credits on displayed upstream assets and distinguish them from original educational SVG/DOM illustrations.

## 6. Canonical progression after P06

| Chapter | Scientific storytelling anchor | Strongest visual | Primary transfer target |
|---|---|---|---|
| I01 — Open a real microscopy image | Published image figure versus numerical representation and provenance | labeled 2×3 pixels / (Y,X,C) axes / RGB triplet | inspect unfamiliar `shape`, `dtype`, coordinates and image source |
| I02 — Crop and inspect image planes | Single documented ROI with source coordinates and scale | row/column grid with bounded ROI and source-to-crop correspondence | changed ROI, copy vs view, Z/T axes and synthetic TIFF warning |
| I03 — Calculate useful pixel measurements | Compute an honest summary of arrays without invalid scientific interpretation | masked array → elementwise transform → axis aggregation | new masks, missing entries, overflow and units |
| I04 — Display an interpretable microscopy image | Source data versus display LUT and figure labels | source values / display mapping / plotted histogram | redraw labels/bins on unknown input |
| I05 — Interpret thresholds | Gray values and candidate mask | image → threshold → binary pixels | changed threshold and invalid segmentation |
| I06 — Filter and clean | Image noise versus true object boundaries | mask before/after and lost-object warning | kernel and morphology sensitivity |
| I07 — Measure connected regions | Labels and per-region metadata | labeled objects, border flags and table | measurements on new image |
| I08–I13 | Complete pipeline, QA, registration, time, stats and reproducibility | relevant real-data or clearly synthetic pipeline stage | independent unseen inputs and error diagnosis |
| N01–N04 | Sequence verification, files and NGS counts | base/quality annotations, reads and sample-level coverage | new FASTA/FASTQ/ambiguous inputs |
| L01–L03 | Data splits, honest baseline and evaluation | specimen-level split, leakage and confusion matrix | leakage-safe unseen validation |

Each new chapter must use its *actual shipped goals*. The table is a planning guide, not permission to invent chapter content.

## 7. First implementation cycle — I01

**Source:** `content/chapters/I01_COMPLETE.md`; Witz notebook `02-Images_as_arrays.ipynb`; NumPy quickstart.

**Goal IDs:** I01-G01 through I01-G08 + I01-CAPSTONE.

**Coherent story:** A colleague shares a microscopy PNG. Before analyzing biology, inspect source provenance, decode what the displayed image actually contains, identify row/column/channel axes, understand dtype and describe what cannot be inferred.

**Must include**:
- distinguish Python list repetition from NumPy elementwise arithmetic;
- inspect shape, ndim and size and distinguish row, column, and RGB component;
- trace `array[row, column]` on a 2D synthetic example;
- published PNG preview with explicit Witz/HPA credit and synthetic-data disclaimers;
- pure-Python runnable toy RGB triplet examples separate from image files;
- dtype range example and warning that `uint8` display values are not calibrated intensity;
- prediction checkpoint (row/column confusion) and Reveal;
- final honest report: array shape/type/source plus limitations;
- independent transfer challenge with a new array and explicitly different dimensions.

**Key tests**: 9/9 goal mappings; no fabricated image-derived measurements; expected output parity; incorrect axis change detected; published PNG loads; desktop/mobile; no editor or progress changes.

## 8. Second implementation cycle — I02

**Source:** `content/chapters/I02_COMPLETE.md`; Witz notebook `03-More_on_images.ipynb`; NumPy copies/views.

**Goal IDs:** I02-G01 through I02-G06 + I02-CAPSTONE.

**Coherent story:** A scientist has located a useful image region. Crop it reproducibly, preserve its original (row,column) coordinates, distinguish view from copy, and record scale and axis assumptions without claiming a calibrated image.

**Must include**:
- half-open row-first slicing with highlighted source and crop pixels;
- view mutation versus independent copy, demonstrable with runnable NumPy;
- verify bounding boxes and source coordinate offsets; reject or explicitly handle empty/out-of-range bounds;
- show *illustrative* µm calibration and conversion units;
- declared 5D axes (TCZYX) versus shape alone;
- synthetic TIFF-container example must never be presented as OME-conformant;
- prediction checkpoint on copy/view or slice endpoint;
- independent changed-bounds transfer challenge and traceable ROI report.

**Key tests**: 7/7 goal mappings; real Python on all output examples; source ROI unchanged after copying; correct half-open dimensions; synthetic TIFF labelled; reliable mobile/desktop checks and no progress leak.

## 9. QA gates (per chapter)

- **Schema:** 100% scene IDs map to actual shipped goals, one prediction break, proper independent transfer.
- **Code:** 100% executable examples with displayed outputs match fresh Python; deliberate tracebacks match exception *type*.
- **Scientific:** 100% source declarations and scope limitations verified; no claims about unmeasured TIFF biology or invented physical scale.
- **Visual:** 0 clipped labels or invisible contrast at 390 px and 1280 px; diagrams correctly step-sequenced, static fallback without speech events.
- **Product:** Voice/Next/Pause/Reveal work; Apply and Prove do not show solved walkthroughs; editor text and local progress state unchanged on tutorial open/close.
- **Robustness:** Changed-input and boundary tests, no external CDN, JS syntax check, browser smoke, production not changed.

**Decision standard:** GO only after all blocker checks pass. No numeric "9.5/10" claim without direct learner test; score code/visual consistency separately from pedagogical efficacy.

## 10. Revisions, QA trail and future-loop policy

Append each completed cycle to a Markdown log with: branch SHA; affected chapter IDs; initial failure/misconception; changes; exact test command/results; reviewed screenshot paths (if any); unresolved caveats; final GO/MAYBE/NO.

**Execution limit:** This development process repeats on explicit user turns or within a single active development run. It does not claim to continue running or make commits unattended after a chat turn ends. Future chapters can be built from this blueprint without redefining the curriculum.
