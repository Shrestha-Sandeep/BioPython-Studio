# BioPython Studio — microscopy-first scientific Python trainer

**Status:** Standalone **v0.1 prototype** with an executable, eleven-skill learning route. This is original software, not a reproduction of either reference course. The live AppDeploy ImageLab and ImageLab Arcade were **not modified**.

## Purpose

Target learner: a scientist experienced in molecular biology and fluorescence microscopy who is learning Python. Use an authentic scientific workflow, not programming trivia: begin with specimen metadata and small calculations, progress to real NumPy image arrays and masks, work with Pandas tables, and generate a real Matplotlib figure. The final task asks for a reusable Python function across new scientific input cases.

**Research objective:** develop the Python skills needed to turn microscopy measurements into reproducible scientific evidence. The image lessons use **real Human Protein Atlas fluorescence composites**, fetched from their published source with attribution. Other numerical cases remain illustrative. The threshold task counts **pixels**, not nuclei, cells, puncta, or exophers. Real segmentation, calibration, biological replicates, and model evaluation are out of scope for v0.1.

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
- The microscopy photos are real HPA RGB composites. Their decoded/resampled JPEG pixels are teaching arrays, not calibrated raw fluorescence intensities. For quantitative work, add raw data with axes, pixel units, and annotated reference labels.
- A Jupyter notebook is a distinct environment from this embedded code editor. Genuine Jupyter/Colab transfer exercises are needed before claiming notebook fluency.
- Long-term topics (scikit-image segmentation, measurement QA, time-lapse, real replicate statistics, scikit-learn and exopher/aggregate analysis) must be added after foundation mastery, not merely simulated as finished tasks.

## Testing

With `pytest`, NumPy, Pandas and Matplotlib installed locally:

```bash
python -m pytest -q tests/test_harness.py
```

Local UI previews were generated with Playwright and Chromium using in-page JavaScript injection because this environment restricts network navigation, so full browser runtime delivery remains unverified.

## Real microscopy source data (v0.2)

The original v0.1 synthetic image generator has been **replaced**. BioPython Studio uses **three real fluorescence RGB composite JPEGs hosted by the Human Protein Atlas (HPA)**, including two fields named in the [Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner) teaching materials:

| Source ID | Original HPA image | Educational role |
|---|---|---|
| `HPA-8346-22-C1-1` | https://images.proteinatlas.org/8346/22_C1_1_blue_red_green.jpg | Visible field; first NumPy array |
| `HPA-46658-784-B12-1` | https://images.proteinatlas.org/46658/784_B12_1_blue_red_green.jpg | Changed-size independent Python test |
| `HPA-23394-182-H7-1` | https://images.proteinatlas.org/23394/182_H7_1_blue_red_green.jpg | Third unfamiliar microscopy field |

**Credit:** Human Protein Atlas, [proteinatlas.org](https://www.proteinatlas.org/); Thul PJ et al., *Science* (2017), DOI [10.1126/science.aal3321](https://doi.org/10.1126/science.aal3321). HPA's [current data license](https://www.proteinatlas.org/about/licence) is **CC BY 4.0**, subject to the image's provenance and any third-party conditions. The teaching repository notes an older CC BY-SA 3.0 designation; the JPEGs are fetched **directly from HPA by the browser**, with direct image links preserved here and next to the images in the app. The app does not copy the reference course's written lessons, nor the *Python Data Science Handbook* text. The source course's code uses a BSD 3-Clause license; the handbook's code is MIT, while its text is CC BY-NC-ND.

For the NumPy shape, pixel and threshold exercises, the app draws the real HPA composite and creates actual `uint8` NumPy input arrays by **resampling and taking the blue channel** of that same decoded JPEG in the learner's browser. Threshold overlays are calculated from those arrays. These are **not original raw microscopy files**, and decoded/resampled JPEG intensities are unsuitable for publication-quality quantitative fluorescence measurements. Counts in the other beginner activities, tables, and plots remain clearly labeled as illustrative teaching data, not measurements of these HPA images. The browser checks image response size, type, dimensions and blue-channel variation before accepting it. A missing or truncated image produces an explicit error and Retry action—never a false success label or invented substitute. The previously truncated local JPEG copies have been deleted from this repository.

**Standing project direction:** Keep BioPython Studio a single, low-clutter Python-for-biology training app. Preserve the progression from *Image Processing for Beginners* plus *Python Data Science Handbook*. Prefer a tiny, traceable set of licensed real datasets over fictional microscopy or wholesale forks of upstream teaching repositories. Each data example must have provenance, license, scientific caveats and code that actually uses its data. Source of truth is this GitHub repository; Vercel is its deployment target. Don't change BioCompute or AppDeploy ImageLab.

### Image-loading reliability (November 5, 2026)

The original GitHub image upload inadvertently stored JPEGs truncated to approximately 1.5 KB. Some browsers read the JPEG dimensions but displayed a blank microscopy canvas. We removed these broken copies. The app now fetches full-resolution JPEGs from the HPA publisher over CORS (`Access-Control-Allow-Origin: *` confirmed for the source) and rejects short, invalid or visually empty images. Image failure is visible and retryable without resetting Python output or drafts. This adds a dependency on HPA image hosting and internet connectivity; if HPA is unreachable, the app explains the failure instead of simulating data.

Image browser test with deterministic local JPEG fixtures: `python tests/check_browser_images.py` (requires Playwright/Chromium and Pillow). Real HPA source bytes and headers were checked separately; deployed Pyodide execution still requires a live browser check after new deployments.