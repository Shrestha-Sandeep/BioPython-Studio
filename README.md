# BioPython Studio — microscopy-first scientific Python trainer

**Status:** Standalone **v0.1 prototype** with an executable, eleven-skill learning route. This is original software, not a reproduction of either reference course. The live AppDeploy ImageLab and ImageLab Arcade were **not modified**.

## Purpose

Target learner: a scientist experienced in molecular biology and fluorescence microscopy who is learning Python. Use an authentic scientific workflow, not programming trivia: begin with specimen metadata and small calculations, progress to real NumPy image arrays and masks, work with Pandas tables, and generate a real Matplotlib figure. The final task asks for a reusable Python function across new scientific input cases.

**Research objective:** develop the Python skills needed to turn microscopy measurements into reproducible scientific evidence. At this stage the built-in micrographs are **synthetic** training examples. The threshold task counts **pixels**, not nuclei, cells, puncta, or exophers. Real segmentation, calibration, biological replicates, and model evaluation are out of scope for v0.1.

## Contents

- `index.html` — main responsive training interface
- `styles.css` — layout, contrast, keyboard and mobile styles
- `app.js` — original curriculum, synthetic datasets, navigation, practice progression and results visualization
- `worker.js` — Pyodide-based real Python interpreter and changed-input assessment harness
- `CURRICULUM.md` — full source alignment and future phases
- `TEST_REPORT.md` — verification and remaining production gates
- `tests/test_harness.py` — 27 automated tests against local CPython

## Run locally (Windows, macOS or Linux)

The app needs a normal local HTTP server because browsers usually restrict Web Workers on `file://` URLs.

1. Unzip the entire folder.
2. In a terminal inside the folder, run:

   ```bash
   python -m http.server 8000
   ```

   On Windows, `py -m http.server 8000` is another option.
3. Open `http://localhost:8000` in a browser.
4. Select the first mission, edit the Python code, then click **Run Python & check**.

The first run downloads the Pyodide Python runtime from jsDelivr. Later stages download NumPy, Pandas and Matplotlib on demand. **An internet connection is necessary for the runtime and packages.** This prototype does not use a backend, account, or AppDeploy, and your scripts remain inside the local browser session. The browser does contact a package CDN to download the runtime; consult that service's privacy practices if relevant.

For a public installation, upload the **whole folder** to a static host such as GitHub Pages or Vercel. Do not upload private microscopy images: this version does not support them.

## How learning is assessed

Each task evaluates user-written **real Python** against two or three different cases. The expected skill is more general than one matching printed number. For example, a hardcoded specimen ID fails the changed-input cases. Masks must be actual NumPy arrays equal to the image-to-threshold comparison; tables must be genuine Pandas DataFrames; and the plotted bar values must be derived from provided variables.

The app differentiates **independent** completion from **guided** completion after a hint, without penalties, scores, or streaks. Results and code drafts are saved in the browser's localStorage. The data are not synchronized across browsers or devices.

Keyboard shortcuts:

| Action | Shortcut |
|---|---|
| Run Python | Ctrl+Enter (Cmd+Enter on macOS) |
| Continue (when unlocked) | Shift+Enter |
| Back | Ctrl+Shift+Enter (Cmd+Shift+Enter on macOS) |
| Indent code | Tab |

## References and content policy

These are **curriculum references**, not copied lessons:

1. Guillaume Witz, *Image Processing for Beginners*: https://github.com/guiwitz/PyImageCourse_beginner. Relevant chapters: Python essentials, images as arrays, thresholding, regions, pipelines and logic.
2. Jake VanderPlas, *Python Data Science Handbook*: https://jakevdp.github.io/PythonDataScienceHandbook/ . Relevant parts: Jupyter/IPython, NumPy, Pandas, Matplotlib, and ML. See the repository for text and code licenses: https://github.com/jakevdp/PythonDataScienceHandbook . Handbook **text** is CC BY-NC-ND; code is MIT. This app does **not** republish the book text or figures.

All exercise wording, synthetic data, interface elements and instructional checks were written specifically for this prototype. Links take users to original resources and do not imply affiliation or endorsement.

## Limitations and follow-up priorities

- **Browser Pyodide download not verified live in this environment.** The Python harness passed 27 local CPython tests; UI interactions were tested using a simulated Worker, not the CDN-backed browser runtime. A network-enabled end-to-end run is a release gate.
- This is a tailored curriculum, not yet an AI tutor. There is no conversation model or spaced-repetition algorithm; guidance comes from authored hints and changed-input checks.
- Python execution is isolated in a Web Worker and bounded by output, source-length and step limits, but it is **not a hardened sandbox** for untrusted third-party code. It is intended for the user's own practice scripts only.
- Image examples are original synthetic arrays. Real microscopy images should be introduced later with valid licenses, provenance, axes/channel metadata, pixel size and known annotated reference labels.
- A Jupyter notebook is a distinct environment from this embedded code editor. Genuine Jupyter/Colab transfer exercises are needed before claiming notebook fluency.
- Long-term topics (scikit-image segmentation, measurement QA, time-lapse, real replicate statistics, scikit-learn and exopher/aggregate analysis) must be added after foundation mastery, not merely simulated as finished tasks.

## Testing

With `pytest`, NumPy, Pandas and Matplotlib installed locally:

```bash
python -m pytest -q tests/test_harness.py
```

Local UI previews were generated with Playwright and Chromium using in-page JavaScript injection because this environment restricts network navigation, so full browser runtime delivery remains unverified.