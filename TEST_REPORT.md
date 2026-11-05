# BioPython Studio — QA status

**Release target:** 61 sequential original coding lessons (25 existing plus 36 new), 3 changed-input cases per new lesson, real HPA microscopy image loading, and independently runnable companion notebook.

## Verified during development

- **155 CPython test assertions passed**: original 11, Chunk 1 additions, 36 additional advanced tasks, hardcoded/wrong solution rejection, real Matplotlib PNG output and notebook execution with a controlled image response.
- JavaScript syntax checks passed for `app.js` and `worker.js`.
- Playwright UI walkthrough passed at 1440, 1024 and 390 pixels: 61 distinct lesson IDs, navigation, input metadata, sources, conditional microscopy, notebook link and no horizontal overflow.
- The same UI tests deliberately supplied a truncated JPEG and verified error detection plus Retry recovery, and confirmed the Run/Continue feedback flow with a **mock Worker**. This does not prove Pyodide execution.
- Notebook code cells ran end-to-end in local CPython with the HPA transfer mocked by an in-memory JPEG of comparable dimensions/content. The analytical code and CSV/JSON outputs were real.

## Release gate still requiring independent verification

- Fresh Pyodide download and package loading of SciPy, scikit-image, Biopython and scikit-learn in the **deployed** browser. Browser testing with a mocked Worker cannot certify this path.
- Actual publisher-hosted HPA images should load over CORS for a normal user and scientific-case code should execute in the browser across changed HPA images.
- If any of these checks fails, do not describe the app as fully verified. Correct the defect on a preview branch before release.

## Known constraints

Scientific data sources and validation boundaries are described in [README.md](README.md) and [CURRICULUM.md](CURRICULUM.md). This is a teaching platform, not a validated research-grade segmentation system or clinical/diagnostic classifier.