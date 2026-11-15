# A02 — Research-led image segmentation and parameter sensitivity tutorial blueprint

**Date:** 2026-11-14
**Parent:** `feature/advanced-tutorial-cycle-a01`, draft PR #58.
**Canonical:** `content/chapters/A02_COMPLETE.md`: G01–G05 + CAPSTONE; independent A02-REVIEW excluded from solved tutorial.
**Local project:** `projects/advanced/a02/README.md`, `run_tiff.py`, `segmentation.py`, `sensitivity.py`.
**Scientific caution:** Candidate masks are **not independently verified cell, nucleus, exopher or aggregate labels**. Real official BBBC038 benchmark documented in the course has poor fixed-method micro object F1 ≈0.385; no generalization claim allowed.

## 1. Research, comparable teaching and improvements

- [Pete Bankhead, Introduction to Bioimage Analysis: thresholding](https://bioimagebook.github.io/chapters/2-processing/3-thresholding/thresholding.html): image segmentation converts continuous intensities to binary decisions; values depend on contrast, background, and specific biological object definitions. **Application:** explicitly visualize background, strict inequality, and the pre/post threshold arrays.
- [Pete Bankhead, processing vs image analysis](https://bioimagebook.github.io/chapters/2-processing/1-processing_and_analysis/processing_and_analysis.html): distinguish image processing from measurement and scientific interpretation. **Application:** report candidate metrics and source limitations; never teach a numeric object count as truth.
- [scikit-image measure.label API](https://scikit-image.org/docs/stable/api/skimage.measure.html): 2D connectivity=1 is four-connected; connectivity=2 is eight-connected. **Application:** demonstrate diagonal pixels that merge only under 8-connectivity. The frozen A02 learner contract uses four-connected labels.
- [scikit-image watershed documentation](https://scikit-image.org/docs/stable/api/skimage.segmentation.html): seeded watershed on negative distance transform partitions a candidate mask; seeds must be valid/in-mask and changed seeds change instance count. **Application:** use explicit seed markers on one connected mask and verify foreground coverage.
- [scikit-image Watershed example](https://scikit-image.org/docs/stable/auto_examples/segmentation/plot_watershed.html): touching objects may need a distance transform to split; automatic seeds can oversegment. **Application:** quantify and visualize one-versus-two seed outcomes and failure modes.
- [scikit-image Otsu/threshold methods](https://scikit-image.org/docs/stable/auto_examples/applications/plot_thresholding_guide.html): threshold choice depends on histogram and scene conditions. **Application:** introduce manual threshold as auditable fixture, mention Otsu only when foreground-background assumptions fit; do not imply universal correctness.
- Existing `A02_COMPLETE.md` is authoritative for five goals and capstone; the actual advanced local segmentation implementation is a longer native project. Keep tutorial aligned to four-neighbor areas, seed validation and mask instability.

**Pedagogy:** The strongest example is a *failure gallery*: identical invented microscopy pixels give distinct counts when background, polarity, connectivity, minimum size and seeds change. Show why plausible masks can be wrong **before** claiming any analysis capability. Keep a single motivating flow and independent proof.

## 2. 17 scenes, each with original diagram and executable code

| # | Competency | Concept and checkpoint | Visual |
|---:|---|---|---|
| 1 | G01 | Destination: raw plane → corrected image → mask → components → sensitivity report | source-to-candidates route |
| 2 | G01 | Explicit float conversion before subtract and clamp | native vs corrected pixel tiles |
| 3 | G01 | Strict `>` threshold on background-corrected image | candidate pixels highlighted |
| 4 | G02 | Bright foreground threshold polarity | light-on-dark grid |
| 5 | G02 | Dark foreground threshold polarity | dark-on-light grid |
| 6 | G02 | Border-median polarity is **only a heuristic** with known failure conditions | border and sample contrast |
| 7 | G03 | Four- vs eight-connectivity of diagonals | orthogonal vs diagonal adjacency |
| 8 | G03 | `min_area` can remove noise **or real small objects** | size-filtered candidate grid |
| 9 | G03 | **Withheld prediction:** how many four-connected objects survive `min_area=2`? | hidden candidate count |
| 10 | G03 | Reveal count, pixel areas and lost objects | visible region labels |
| 11 | G04 | Distance transform of one connected shape | seed topology grid |
| 12 | G04 | Watershed with two explicit in-mask markers | two split candidate instances |
| 13 | G04 | Wrong seed count under-/oversegments | compare one/two/three seeds |
| 14 | G05 | Foreground IoU and changed fraction between threshold variants | mask-overlap diagram |
| 15 | G05 | Stable mask is not verified accuracy | threshold sensitivity/ground truth gap |
| 16 | CAPSTONE | Native NumPy/scikit-image segmentation candidate report, areas, params, `validated=False` | audit summary |
| 17 | CAPSTONE | Independent unsolved transfer: new array, polarity, seeds, thresholds, artifacts | independent checklist |

No A02-REVIEW answer; independent G01–G05 Apply/Prove and CAPSTONE hidden starter are unchanged.

## 3. Code and scientific contracts

1. Use `np.asarray(image, dtype=np.float64)` **before** background subtraction and `np.maximum(0, ...)`. Show corrected_max and candidate pixel count.
2. `bright` candidates are `image > cutoff`; `dark` candidates are `image < cutoff`. The border-median threshold at 55% of datatype max is a *course heuristic*, not microscopy truth.
3. Use `skimage.measure.label(mask, connectivity=1)` for four-connected image components; setting 2 joins diagonals. Check `min_area>=1` and reason about removal of tiny real structures.
4. When demonstrating watershed, use `scipy.ndimage.distance_transform_edt(mask)`, construct integer marker array from in-mask seed coordinates, then `skimage.segmentation.watershed(-distance,markers,mask=mask)`. Ensure distinct seeds and check `np.count_nonzero(labels)==np.count_nonzero(mask)`; all retained mask pixels assigned when conditions are met. A label is an algorithmic candidate, not truth.
5. Foreground mask intersection-over-union: `intersection/union` with explicit empty union convention; changed_fraction = XOR count / total number of image pixels. Comparing two candidate masks to each other **cannot** verify either.
6. Prevent leakage of numerical checkpoint answer before scene 10 (code can still be visible, but displayed output, note, narration and diagram hide count).
7. Source and original pixel values are invented. A local real TIFF output must preserve source hashes, axes and params and inspect failure examples. No semantic biological object identity from brightness alone.

## 4. UI and QA

- Add `src/tutorials/a02-data.js` with 17 scenes (one per learning subtopic) and extend `src/tutorials/advanced-illustrations.js` with 17 new A02 diagrams using existing accessible `role="img"` markup, distinct scientific grids and comparison cards.
- Register tutorial data in `index.html` before existing viewer. No code editor, route, learner progress, Apply/Prove or TTS changes.
- Node test `tests/a02_tutorials.test.mjs` checks exactly 17 scenes, full goal coverage, independent unsolved transfer, original illustration count and **all literal code outputs actually verified in CPython with NumPy/SciPy/scikit-image**.
- At least 8 changed-input assertions: alternative background, dark/bright, diagonal connectivity, size cutoff, invalid seeds, zero-mask, sensitivity IoU/changed-fraction, 1 seed vs 2 seeds; avoid fake biological accuracy.
- Playwright Chromium at width 390px and 1280px, chapter A02 only in `?lab=advanced` Learn, all diagrams, checkpoint, narration controls, editor and saved state invariant, no Apply/Prove/REVIEW spoilers.
- GH Actions install pinned native science packages and run A00/A01/A02 regression; workflow must turn green, with correction logged if anything fails.
- Human local test on genuinely independent TIFF and annotations is a separate scientific exit gate, not certified by automated UI QA.

## 5. Decision

**GO for draft A02** if all code/test/browser gates pass. **NO** to interpreting candidate counts as biological accuracy. Move on to canonical A03 annotation-based validation only after the A02 technical gates are green.
