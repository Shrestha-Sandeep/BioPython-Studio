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

Browser tests additionally require Playwright and Chromium; see `.github/workflows/p04-p06-integration.yml`. They run the original frozen-shell regression and P01–P06 chapter flows, changed-input checks in genuine Pyodide, exported script execution in CPython, draft preservation and mobile/tablet/desktop layout tests.

## Learning sources and scientific safeguards

Witz [Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner) is the primary source spine. Supporting references include the [Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/), [Python for Biologists](https://www.pythonforbiologists.org/), [Introduction to Bioimage Analysis](https://bioimagebook.github.io/) and [Bio-image Analysis Notebooks](https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/).

Synthetic specimen IDs, cutoffs, calibrations and field scores are for programming education only. Image fields are not independent biological replicates; connected regions are not validated cell/exopher detections. Calibrated quantitative image analysis belongs to later I01–I13 missions.

**Release policy:** Keep this branch in draft until the exact-commit QA suite, a real-device learner pilot and a deployment preview are confirmed. Do not merge or update production automatically.
