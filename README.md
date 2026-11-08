# BioPython Studio — scientific Python learning workspace

BioPython Studio is a personal, minimally cluttered browser IDE for learning transferable scientific Python through biological research problems. Its primary applied pathway is microscopy; sequencing/NGS and machine learning are optional later pathways.

## Repository and implementation status

- **Curriculum authority:** the frozen v3 design in [docs/CURRICULUM_V3_FROZEN.md](https://github.com/Shrestha-Sandeep/BioPython-Studio/blob/docs/frozen-v3-curriculum/docs/CURRICULUM_V3_FROZEN.md) defines 156 distinct competencies and safe prerequisite ordering. The [Witz-first mission map](curriculum/witz_spine.json) defines 26 connected missions. These are **not 156 shipped interactive lessons**.
- **Current development integration:** P01–P06 (six missions; 36 distinct canonical competencies), each with Learn, Apply, Prove, a capstone and a delayed-review activity. P01–P03 remain protected by their original regression suites.
- **Production:** this is an isolated draft branch; `main` is unchanged. The frozen UI structure remains intact.
- **Quality status:** automated browser and content tests do not establish retained learner skill, independent scientific truth, or an empirically measured 9.5+/10 learning score.

## Current chapter sequence

| Chapter | Mission | Central deliverable |
|---|---|---|
| P01 | First scientific Python script | Specimen report and unit conversion |
| P02 | Trustworthy sample labels | Strict identifier and QC validator |
| P03 | Filter microscope fields | Source-preserving field-QC audit |
| P04 | Organize experimental metadata | Deduplicated, traceable metadata registry |
| P05 | Make a reusable analysis function | Documented, tested field-measurement functions |
| P06 | Save and reproduce a real script | JSON audit export plus **manual** local Python/venv/Git verification |

Each exercise places its immediate task as concise `#` comments inside the editable Python editor. Detailed concepts, predictions, optional walkthroughs, staged hints, changed-input feedback and scientific limitations remain in the lesson panel.

## Runtime and interface

- **Actual Python:** version-pinned Pyodide in a Web Worker, loaded on the first Python Run. Normal Python stdout, traceback and changed-input checks are displayed. No simulated outputs or hidden secure grading.
- **Editor:** locally vendored CodeMirror with editable code, Python highlighting, keyboard navigation and separate saved drafts for each chapter/goal/phase.
- **Interface:** frozen clean IDE layout with compact lesson controls, a results console, optional image viewer, focus mode and responsive layouts.
- **Persistence:** existing `biopython.p01.v1`, `biopython.p02.v1`, and `biopython.p03.v1` are retained. New `biopython.p04.v1`, `biopython.p05.v1`, and `biopython.p06.v1` store new drafts separately. Do not infer independent mastery from old completion data.
- **Export:** completed capstone and review scripts can be downloaded as standalone `.py` files with one supplied example input.
- **Source images:** attributed Witz/Human Protein Atlas teaching images are contextual. They are not calibrated TIFF stacks and do not authorize quantitative fluorescence claims.

Run locally from the repository root:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000` and select Python foundations. Internet access is required to download the Pyodide runtime on first Run.

## Scientific Python microscopy missions (draft PR #18)

The frozen 26-mission course places the scientific-computing foundation inside applied microscopy missions, rather than in an unrelated additional chapter series. The combined full microscopy integration branch adds **91 distinct competencies** and real Python execution to these missions:

| Mission | Core techniques | Competencies |
|---|---|---:|
| I01 | NumPy arrays, real credited Witz/HPA PNG bytes, shape, dtype, provenance | 8 |
| I02 | ROI cropping, views and copies, axis labels, synthetic TIFF I/O | 6 |
| I03 | Vectorization, broadcasting, masks, missingness, statistics, dtype overflow, ROI | 10 |
| I04 | Real Matplotlib line/scatter/histograms, contrast, figure panels | 6 |
| I07 | Pandas tables, explicit-typed CSV, QC, duplicate and missing records | 7 |
| I08 | Safe metadata joins, group summaries, reshaping, timestamps, plots and exports | 8 |

The original six scientific-foundation missions account for 45 goals. This development integration adds seven further microscopy missions (46 goals), resulting in **13 missions and 91 distinct canonical competencies**. Competency 068 is now taught with biological replication in I12. Real learner mastery and biological validity remain unverified.

Source hygiene: The bundled `assets/witz/fluorescence-single.png` is a **real attributed published notebook figure based on Human Protein Atlas**, decoded into actual pixels in Pyodide. It is not a calibrated raw HPA TIFF. Synthetic numerical examples and synthetic TIFF files remain explicitly labeled. An OME-looking TIFF Description tag is not validated OME metadata.

The pinned scientific Python worker lazily imports NumPy, Pillow, Pandas, Matplotlib, SciPy and scikit-image. Actual Matplotlib figures render in the results console, not precomputed stock pictures. First import needs a network connection. I01 and other Python mission progress keys are kept separate; stage switching does not overwrite prior drafts. The image-analysis stage displays the existing frozen IDE and its image-preview panel.

This is a **draft learner pilot**, not scientifically validated quantitative image analysis or demonstrated learner mastery.

## Full microscopy course — I01–I13 (isolated draft)

`integration/microscopy-i05-i13-complete` integrates the seven remaining missions into the original frozen IDE. All 91 microscopy skills now have a goal-specific Learn, Apply and independent Prove exercise, plus a mission capstone and delayed review.

| Mission | Content | Goals |
|---|---|---:|
| I05 | Background, denoising, thresholds and sensitivity | 6 |
| I06 | Morphology, watershed, connected objects and 3D limitations | 7 |
| I09 | Candidate-region properties, intensity, colocalization and proximity | 6 |
| I10 | Tracking and segmentation validation against synthetic annotations | 6 |
| I11 | Biological units, QC, batch structure and normalization | 7 |
| I12 | Replicate-aware uncertainty, testing and plots | 9 |
| I13 | Source-aware integrated real-image pipeline and visualization | 5 |

**Scientific boundary:** The bundled Witz/HPA PNG is a credited published *rendered RGB figure*, not a raw calibrated microscope image. Exercises run real scientific Python, including actual pixel decoding and candidate segmentation, but no validated nucleus/exopher detection, nuclear-edge localization, raw intensity or biological effect estimate is claimed. Those require real raw data, calibrated metadata, controls, manual annotations and biological replicates.

The development release remains draft until complete CPython and Pyodide QA, desktop/mobile checks, standalone exported scripts and a real learner trial pass. The new QA scripts are `tests/test_microscopy_complete_import.py`, `tests/test_microscopy_complete_reference.py` and `tests/test_microscopy_complete_browser.py`.

## P06 local-machine limit

Browser Python can create genuine temporary files in its own virtual filesystem, encode JSON and execute assertions. **It cannot create your computer's .venv, run local Git, verify an on-disk repository, or certify a local notebook kernel.**

Use [P06 local verification guide](docs/P06_LOCAL_HANDOFF.md) to export the script and run it in a real local environment, verify interpreter and tests, and record an actual commit hash. P06's browser checks record practice only; competencies 032 and 036 require local evidence.

## QA commands

```sh
node --test tests/preview.test.mjs tests/witz_sources.test.mjs
python tests/test_p01_import.py
python tests/test_p02_import.py
python tests/test_p03_import.py
python tests/test_editor_briefs.py
python tests/test_p04_p06_import.py
python tests/test_p04_p06_reference.py
```

Browser tests additionally require Playwright and Chromium; see `.github/workflows/p04-p06-integration.yml` for Python foundations and `.github/workflows/scientific-python-integration.yml` for real NumPy/Pandas/Matplotlib microscopy missions. Scientific CPython QA runs `tests/test_scientific_foundation_import.py` and `tests/test_scientific_foundation_reference.py`; complete real Pyodide QA runs `tests/test_i01_browser.py` and `tests/test_scientific_foundation_browser.py`. They run the original frozen-shell regression and P01–P06 chapter flows, changed-input checks in genuine Pyodide, exported script execution in CPython, draft preservation and mobile/tablet/desktop layout tests.


## Authentic microscopy file workflow — new draft feature

For real image practice, use **Open images** in the microscopy viewer. Selected TIFF/OME-TIFF and RGB files (maximum eight, 32 MB each, 96 MB total) are copied into **local browser Pyodide memory** without scaling or conversion through the RGB viewer. The learner code receives them through the Python list `uploaded_image_paths`. Source bytes are never sent to the BioPython Studio server, and selecting **Clear files** then running again removes them from the worker filesystem. They are not saved across page reloads.

Use the **Witz TIFF pair** button to fetch two original TIFF *files* on demand from the Witz course repository. These HPA-derived files were converted from JPEG, so they are **not original calibrated instrument data**. Their provenance and license are documented in [the real-data learning guide](projects/real-microscopy/START_HERE.md).

The [I13 real-data project](projects/real-microscopy/START_HERE.md) adds a reproducible local TIFF batch-analysis script, documented QC outputs, source hashes and a [blind independent transfer challenge](projects/real-microscopy/INDEPENDENT_CHALLENGE.md) with a delayed learning rubric. Project tests exercise 16-bit OME-TIFF, preserved image pixel values, explicit channels/axes and live browser file transport. Desktop Bio-Formats and independently annotated raw experimental image datasets are still necessary for wider vendor formats and research-grade validation.

## Learning sources and scientific safeguards

Witz [Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner) is the primary source spine. Supporting references include the [Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/), [Python for Biologists](https://www.pythonforbiologists.org/), [Introduction to Bioimage Analysis](https://bioimagebook.github.io/) and [Bio-image Analysis Notebooks](https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/).

Synthetic specimen IDs, cutoffs, calibrations and field scores are for programming education only. Image fields are not independent biological replicates; connected regions are not validated cell/exopher detections. Calibrated quantitative microscopy requires original raw images and independent validation beyond the rendered figure.

**Release policy:** Keep this branch in draft until the exact-commit QA suite, a real-device learner pilot and a deployment preview are confirmed. Do not merge or update production automatically.
