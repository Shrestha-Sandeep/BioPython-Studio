# A01 — Research-first native microscopy image audit tutorial blueprint

**Date:** 2026-11-14  
**Parent:** `feature/advanced-tutorial-cycle-a00` (draft PR #57; A00 automated QA green).  
**Branch:** `feature/advanced-tutorial-cycle-a01`; stacked draft, no production merge.  
**Canonical:** `content/chapters/A01_COMPLETE.md` (A01-G01–G04, CAPSTONE and unsolved delayed REVIEW).  
**Real method:** `projects/advanced/a01/image_audit.py`, `quality.py` and source-audit README.  
**Teaching framework:** `docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md`.

## 1. Research and design decisions

- [OME-TIFF data specification](https://docs.openmicroscopy.org/ome-model/5.5.7/ome-tiff/specification.html): a TIFF plane is positioned by OME metadata such as `DimensionOrder`, `TiffData` and `FirstZ/FirstT/FirstC`; TIFF's byte/IFD order is not by itself a trustworthy conceptual mapping to channels or time. **Teaching:** require declared axes, check their lengths, refuse arbitrary axis guesses.
- [tifffile series documentation](https://www.cgohlke.com/docs/tifffile/): multidimensional `series.axes`, `series.shape`, `series.dtype`, `series.asarray()` reflect decoded image structures and metadata. **Teaching:** illustrate a *genuine synthetic TIFF byte round-trip* in CPython, not just `np.arange` arrays; metadata alone is not external calibration.
- [Introduction to Bioimage Analysis: images & pixels](https://bioimagebook.github.io/chapters/1-concepts/1-images_and_pixels/images_and_pixels.html): LUTs/display are separate from numerical pixel values. **Teaching:** never equate a pretty 8-bit preview to the original 16-bit measurement.
- [Introduction to Bioimage Analysis: bit depths](https://bioimagebook.github.io/chapters/1-concepts/3-bit_depths/bit_depths.html): integer ranges and clipping require deliberate handling. **Teaching:** show unsigned subtraction wrap and false 8-bit conversion; do not infer actual camera saturation from `dtype==uint16` or maximum.
- [scikit-image data type guide](https://scikit-image.org/docs/stable/user_guide/data_types.html): type/range conversions can rescale/quantize intensities. **Teaching:** numerical subtraction should cast to floating/wide signed **before** subtracting; `astype(uint8)` is not scientifically lossless.
- Existing A01 source checker `select_yx_plane` is the local authority: explicit T/C/Z selectors, YX/XY handling, ambiguity refusal, 256 MiB default budget. **Teaching:** an example that only demonstrates `array[0]` without checking axes is incomplete.

## 2. Big-picture reason to learn this

Start with a 16-bit synthetic multi-channel Z stack that visually looks fine. If the user chooses the wrong channel, converts 40000 to uint8, subtracts background in unsigned arithmetic, or assumes declared `0.2 µm/pixel` is calibrated, it can generate a plausible-looking but scientifically wrong morphology report. Correct code makes the potential failure *visible and testable*.

`native TIFF bytes → series axes/dtype → explicit T/C/Z → untouched 16-bit values → safe arithmetic → calibration check → source hash → auditable report`.

The training TIFF is fabricated inside CPython from arrays; it is **not** an actual acquisition nor validated segmentation. Contrast, masks and candidate-pixel counts do not establish cell identities.

## 3. 17 learner-paced narrated scenes

| Scene | Goal | Numerical / scientific teaching purpose | Original diagram |
|---:|---|---|---|
| 1 | G01 | Final capability: source file → honest audited plane | End-to-end provenance flow |
| 2 | G01 | Five axes `TCZYX`: understand shape vs metadata | 5D axes strips |
| 3 | G01 | Select T1,C2,Z0 from a synthetic uint16 stack | Plane selection and chosen indices |
| 4 | G01 | Build selectors from axis *names*, not guessed positions | Named-to-index map |
| 5 | G01 | Reject nonexistent channel index without silent clipping | Valid vs out-of-range |
| 6 | G02 | 40000 is valid uint16, but `astype(uint8)` changes it | Numeric data versus display |
| 7 | G02 | Unsigned subtraction wraps below zero | Type/range trap |
| 8 | G02 | Cast before subtraction, then clip negative result | Safe arithmetic |
| 9 | G02 | **Withheld prediction:** how many native pixels are >1000? | Raw values, hidden count |
| 10 | G02 | Reveal true count and explain strict threshold | Mark exactly matching pixels |
| 11 | G02 | Brightness LUT/display mapping does not change raw pixels | Native versus display strip |
| 12 | G03 | OME physical-size declaration is not verified scale | Declared-vs-verified evidence |
| 13 | G03 | When scale verified, convert area with squared units | Area geometry |
| 14 | G04 | Actually round-trip an in-memory **synthetic TIFF** via tifffile | File bytes → decoded uint16 |
| 15 | G04 | Digest original TIFF bytes before/after; avoid fixed digest across library versions | Source hash comparison |
| 16 | CAPSTONE | Run auditable synthetic source → selected YX → pixels above threshold → hash/flags | Concise report with source limits |
| 17 | CAPSTONE | Independent novel C/Z, new source, different uint16 intensities; no answers | Unsolved transfer and source audit |

Independent A01-REVIEW remains hidden and performed later. One withheld checkpoint at scene 9 must remain hidden until scene 10. No image identity, acquisition or calibration claim without independent evidence.

## 4. Test data and numerical contracts

- Use `np.arange(2*3*2*2*3,dtype=np.uint16).reshape(2,3,2,2,3)` and **explicitly** document axis label `TCZYX`; `T=1,C=2,Z=0` produces a `(2,3)` plane. Code must check axis lengths and select by declared labels, not just use a hard-coded position without explanation.
- `np.array([40000],dtype=np.uint16).astype(np.uint8)` produces `64`; label as destructive conversion not physical scaling.
- `uint16(100)-uint16(200)` wraps; `astype(np.float64)` before subtracting yields `-100.0` and subsequent `np.maximum(0,...)` yields `0.0`.
- With `[120,1100,50000]` native uint16 pixels, `(pixels > 1000).sum()==2`; hide result before reveal.
- Unverified `0.2 µm/pixel` must not produce reported µm²; with independent verification, `25 px² ×(0.2 µm/px)^2=1.0 µm²`.
- A synthetic TIFF in `io.BytesIO` genuinely decodes via `tifffile.TiffFile`; confirm `uint16`, native value `40000`, expected `YX` shape. Hash bytes before and after reading, but avoid assuming the specific digest cannot vary with tifffile encoding/version.
- Source audit should never label threshold pixels as nuclei or an exopher. It should capture explicit selectors and declare physical calibration status separately.

## 5. Architecture

- New `src/tutorials/a01-data.js` appended to `window.BioPythonAdvancedTutorials` before viewer, without changing A00 data.
- Add 17 new original diagrams to existing `advanced-illustrations.js`, keyed `A01` in the existing dispatcher. Avoid repeating an uninformative set of three generic cards: use axes, pixel arrays, before/after numerical comparison, digest identity, source-to-report flow.
- Load A01 data before `p01-viewer.js` while retaining all other script order.
- No permanent UI changes: only the existing Learn-only optional dialog, browser voice/speed and synchronized highlighting. Leave Apply/Prove, hidden delayed review, local progress and `ui-first-2` unchanged.
- The normal `/` route must not expose the advanced A00/A01 navigation; no MP4 downloads.

## 6. Required QA and failure conditions

1. JSON-like scene contract: 17 scenes; all G01–G04/CAPSTONE mapped; single hidden checkpoint; independent transfer code empty; no hidden Prove solution.
2. Native CPython/NumPy/tifffile execute all displayed snippets. Tests vary channel/z selection; reject invalid index; preserve 40000; verify overflow vs safe subtraction; unknown vs verified scale; SHA equality of unchanged bytes and inequality after alteration.
3. Real Playwright Chromium at 390 and 1280 pixels; A01 accessible only on advanced Learn, original SVG, correct reveal, code highlight/voice controls, Escape close, no horizontal overflow, stable editor and localStorage. Verify A01-REVIEW has no tutorial.
4. A00 and P01 regressions green after viewer's script additions; no claim that the generated TIFF is an actual microscope acquisition.
5. New workflow for A01 plus cumulative A00 gate; automated **green** on latest SHA required before moving on to A02.
6. Actual source TIFF calibration, identity and scientific interpretation require independent local provenance and human scrutiny. Automated teaching tests do not qualify.

## 7. Release verdict

**GO to draft** when all gates pass. **HOLD production and scientific claims** until independent learner practice on a new local native source. Keep A02 as the next existing chapter; do not invent A04 before the already planned optional sequence.
