# BioPython Studio v0.1 — test report

Date: 2026-11-05.

## Verified

- Python harness extracted from the Web Worker and executed with real local CPython.
- **27 tests passed**: correct generalized solutions for all eleven tasks; rejection of eleven incorrect/hardcoded answers; syntax-error handling; import limitations; NumPy mask data for overlay; Pandas result table; actual Matplotlib PNG generation.
- JavaScript source passed `node --check` for `app.js` and `worker.js`.
- Desktop rendering at 1366px, mobile at 390px: no runtime JavaScript errors from the UI, correct initial mission and 11 listed skills, no mobile horizontal overflow.
- Editor, hint, mock Worker success feedback, local progress, navigation with Shift+Enter and Ctrl+Shift+Enter passed UI checks. **The UI test Worker was simulated.**
- Responsive mobile sidebar starts closed so the scientific lesson is immediately visible.

## Not yet verified

- Live external CDN delivery of Pyodide 0.28.3 in a browser; this environment restricts network navigation. Consequently the app's real in-browser scientific-package execution is **not** production-certified, even though the Python harness works locally.
- Production deployment, web performance, package loading on mobile internet, accessibility screen-reader audit, and upload of user images. User images are deliberately unsupported.

## How to close the primary verification gap

1. Serve the folder over HTTP(S) and connect to the internet.
2. Open the first mission in a clean browser and run `print(sample_id)`. Expect three hidden-case checks and a successful result.
3. Advance by passing the first four foundation tasks, then check NumPy image dimensions, pixel indexing and threshold overlay.
4. Check Pandas table rendering and condition groupby, then verify the final Matplotlib figure renders as an actual generated image.
5. Repeat at narrow mobile width, refresh to test local progress, and induce a syntax error to verify the recovery message.

## Safety and scientific integrity

- Microscopy-array lessons use HPA fluorescence composite JPEGs. No results claim automated cell/object counting; non-image examples remain illustrative.
- Pixel masks count pixels and field-level measurements are not independent biological replicates.
- All sample data are fictitious; no user files or health data are read or sent to the server.
- The educational Python Worker is bounded but not a hardened sandbox; untrusted code must not be executed.

## v0.2 image-source upgrade QA
- `node --check app.js` and `node --check worker.js`: PASS.
- `pytest -q tests/test_harness.py`: 27 tests PASS (Python assessment regression, including revised `[20, 25]` pixel coordinate).
- Real HPA JPEGs fetched successfully (three intact JPEG files, original resolutions 1728×1728, 2048×2048 and 1728×1728).
- The browser image loading and actual HPA mask overlay still require a real deployed browser run; do not present them as verified until that is done.
- Numerical table, arithmetic, percent-change and plot cases intentionally remain illustrative rather than claiming to be derived from those image files.

## Image-loading repair checks (November 5, 2026)

- Confirmed the GitHub JPEG copies were truncated (~1.5 KB). The browser accepted the dimensions but displayed a blank field. Removed the broken copies; the browser now uses direct HPA HTTPS images with CORS.
- Verified the first HPA origin responds with HTTP 200, `Content-Type: image/jpeg`, `Access-Control-Allow-Origin: *`, and 245,282 bytes. Its decoded RGB image is 1728 × 1728 and nonblank.
- Verified browser-loading logic using Playwright + deterministic full-size JPEG fixtures: visible microscopy pixels, mobile rendering, incomplete JPEG rejection, Retry recovery, and matching NumPy image dimensions.
- All 27 CPython harness tests passed; JavaScript syntax check passed. Remote, deployed Pyodide + external HPA integration is a separate final browser check.