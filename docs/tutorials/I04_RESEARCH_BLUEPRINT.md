# I04 — Research and design blueprint: scientific figures that do not mislead

**Date:** 2026-11-13
**Development branch:** feature/imaging-tutorial-cycle-i04
**Baseline:** feature/imaging-tutorial-cycle-i03
**Canonical goal source:** content/chapters/I04_COMPLETE.md.
**Parent process:** docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md.

## 1. Research used

- Witz, *Image Processing for Beginners* (https://github.com/guiwitz/PyImageCourse_beginner): source-led image display, thresholding, and visual data analysis; reference the original notebooks rather than inventing a lookalike experiment.
- Bankhead, *Introduction to Bioimage Analysis*, "Images and pixels" (https://bioimagebook.github.io/chapters/1-concepts/1-images_and_pixels/images_and_pixels.html): recorded intensity versus displayed RGB/brightness, projections and display transformations.
- Matplotlib official figure/axes and imshow documentation (https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.imshow.html; https://matplotlib.org/stable/users/explain/axes/axes_intro.html): figure objects, axes, vmin/vmax, imshow interpolation and colorbars.
- NumPy histogram reference (https://numpy.org/doc/stable/reference/generated/numpy.histogram.html): bins, edges, counts, and sample-size interpretation.
- Cognitive-load and multimedia principles (as catalogued in the parent blueprint): short coherent chunks, captions aligned with visual evidence, one surprise/prediction, no decorative animations or redundant panels.

**Evidence boundary:** the image files bundled in BioPython are *credited Witz/Human Protein Atlas rendered notebook PNGs*. They are not verifiable raw acquisition files or calibrated fluorescence measurements. The tutorial must not treat an actual published image histogram as proof of detector counts or biological fluorescence intensity.

## 2. One story and scientific decision

A researcher needs a defensible figure for a microscopy report. Starting with synthetic numerical observations, create labeled Matplotlib figures; choose plot forms consistent with data ordering; inspect histogram counts and bin boundaries; compare panels; change display contrast without mutating the image array; finally connect a credited *rendered* microscopy image to its display pixels and limitations.

The real instructional task is **distinguishing numerical data, graphical display, and biological inference**.

Canonical goals:
- I04-G01 — Build a labeled Matplotlib figure
- I04-G02 — Compare line and scatter representations
- I04-G03 — Show a numerical distribution honestly
- I04-G04 — Arrange comparable scientific panels
- I04-G05 — Change display contrast without changing pixels
- I04-G06 — Inspect a real image's display-pixel histogram
- I04-CAPSTONE — Produce a traceable two-panel RGB display report

## 3. Scene plan

| # (1-based) | Goal | Demonstration | Purpose of a diagram |
|---|---|---|---|
| 1 | G01 | Credited image preview vs published figure claims | Explicit provenance and destination |
| 2 | G01 | Figure, axes, labelled x/y and title | Show structural difference |
| 3 | G01 | Missing axis units and corrected units | Reveal why labels matter |
| 4 | G02 | Line order vs independent points | Demonstrate scientific graph grammar |
| 5 | G02 | Different series/replicate grouping | Avoid apparent trends caused by arbitrary record order |
| 6 | G03 | Numeric histogram with fixed bins and conserved counts | Count total vs bins |
| 7 | G03 | Bin edges and empty/bin-boundary behavior | Diagnose data distribution |
| 8 | G04 | Two panels, explicitly different analyses | Number of axes and meaning |
| 9 | G05 | Synthetic 2×2 pixels and imshow(vmin,vmax) | Input values vs displayed colors |
| 10 | G05 | Predict: does display scaling mutate source? | **Checkpoint, no answer** |
| 11 | G05 | Reveal: array unchanged, color limits different | True Python output and source-preservation check |
| 12 | G06 | Real PNG can be decoded *only after a real file is staged* | Contextual pattern with no invented output |
| 13 | G06 | Synthetic RGB display component histogram | Computation separated from biological meaning |
| 14 | Capstone | Source-preserving 2-panel numerical figure + report | Whole consistent script |
| 15 | Capstone | Forward bridge into thresholding/segmentation | Implications and provenance constraints |
| 16 | Capstone | Independent transfer using changed data | No solved code |

**Scene pacing:** one conceptual distinction per stage; one prediction break; output must appear only after reveal.

## 4. Execution and scientific gates

- Python examples in scenes must run in fresh CPython with NumPy and Matplotlib under the noninteractive Agg backend. Each exact stdout matches expected output; tests also modify the inputs.
- Any code mentioning an externally staged \`image_path\` must have no claimed output, and be clearly identified as a runnable *pattern conditional on a real image file*.
- Numeric histograms use synthetic observations; \`len(observations)\` or sum of actual bin counts is not a count of biological replicates unless explicitly specified and grounded.
- \`imshow(vmin,vmax)\` and \`get_clim()\` demonstrate display settings. Test \`np.array_equal(pixels,copy)\` and \`np.shares_memory\` as appropriate. This is not proof of an unaltered source file on disk.
- **No misleading figure preview**: Witz/HPA PNG is not the source of the invented plotted observations, nor a validated biological measurement.
- Exactly 6 goal IDs + capstone; 16 scenes; no tutorial in Apply/Prove or late Review; one checkpoint with empty result; independent transfer.
- Prefer 8–10 targeted original diagrams, using existing SVG framework, readable at 390 and 1280 px. Avoid repetitive summary cards.
- Browser QA: switching to I04, published image loads, visual checkpoint/reveal, voice controls, editor and localStorage untouched, no overflow, navigation preserved.
- CI must run Node+Python parity checks, changed-input tests and Playwright desktop/mobile. Fix actual errors before claiming GO.
- No automatic merge or release into production. A user still needs to attempt an independent transfer before any subjective learning-effectiveness score.

## 5. Gate decision and iteration

If output, provenance, visual interpretation, or browser tests fail, write root cause to the iteration log, correct data *or the blueprint* as warranted, and rerun all relevant checks. Only after green results: freeze I04 and proceed to I05, which concerns thresholding and candidate segmentation. I04 work should never inflate its visual count just to meet a quota.
