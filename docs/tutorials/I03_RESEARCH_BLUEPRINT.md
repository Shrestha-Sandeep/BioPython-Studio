# I03 research + tutorial blueprint — responsible numerical pixel processing

Date: 2026-11-13. Branch: feature/imaging-tutorial-cycle-i03.
Predecessors: docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md, and I01–I02 completed iteration log.
Canonical source: content/chapters/I03_COMPLETE.md — 10 goals + capstone.

## Evidence and decisions
- Witz Image Processing for Beginners, 02-Images_as_arrays.ipynb: scientific NumPy introduction — https://github.com/guiwitz/PyImageCourse_beginner
- NumPy broadcasting rules: align from trailing axes, only equal-size or size-one dimensions are compatible — https://numpy.org/doc/stable/user/basics.broadcasting
- NumPy dtype promotion/overflow: converting unsigned data before summing/correcting prevents plausible-looking integer wraparound — https://numpy.org/doc/stable/reference/arrays.promotion.html
- Witz/HPA PNG: published **display** image, not verified detector-derived intensity — assets/witz/CREDITS.md.
- Pedagogy: paced code-tracing, one misconception per diagram, independent changed-input transfer, no filler.

## One coherent scientific problem

A scientist wants to summarize a numerical ROI from an imaging experiment. Before such a summary means anything, the code must apply consistent corrections, declare axis meanings, use Boolean masks, preserve raw values, handle missing records, avoid overflow and state the statistical limitation of treating pixels as biological replicates.

**Scientific contract:** Every runnable array in the tutorial is synthetic. Published Witz/HPA PNGs appear only as credited **context**. Do not claim the invented numbers were extracted from the displayed microscopy figure.

## Scene inventory (planned)

| Scene | Goal | Concept/visual | Prediction or test |
|---|---|---|---|
| 1 | G01 | Published microscopy destination and numerical provenance | Identify what is not measured |
| 2 | G01 | Vectorization and element-wise operation | sqrt([1,4,9]) |
| 3 | G02 | Two-channel background correction and broadcasting | shape alignment |
| 4 | G02 | Wrong axis/background shape | diagnostic mismatch |
| 5 | G03 | Boolean mask with NaN | exclude missing, not zero |
| 6 | G04 | Copy before masked modification | verify raw values untouched |
| 7 | G05 | Mean over rows versus columns | axis effect |
| 8 | G06 | NaN-aware summary and explicit denominator | 2 valid vs 3 supplied |
| 9 | G06 | Prediction checkpoint | ask about NaN treatment; do not reveal |
| 10 | G06 | Reveal and interpret missingness | correct comparison |
| 11 | G07 | Percentile and rank | no implicit biological significance |
| 12 | G08 | Reproducible RNG | same seed same simulated counts |
| 13 | G09 | uint8 overflow and safe widened arithmetic | 250+10 wraps vs 260 |
| 14 | G10 | ROI Boolean mask | measured pixels are not replicate animals |
| 15 | Capstone | Audit an ROI summary | source, valid/missing count, safe mean |
| 16 | Capstone | Relation to future real image analysis | marked conceptual preview |
| 17 | Capstone | independent changed-input transfer | no worked solution |

## Quality gate

- Exact mapping I03-G01 through I03-G10 plus I03-CAPSTONE; 17 scenes, one unrevealed checkpoint.
- Every shown code/output pair executed in fresh Python (NumPy), including changing inputs.
- Unit/axis/denominator checks; uint8 behavior validated against installed NumPy rather than guessed.
- No biological interpretation from rendered PNG. No cell counts called independent biological replicates.
- At least 8 meaningful original visual diagrams, no answer leakage at the checkpoint.
- Same optional viewer; mobile 390px and desktop 1280px; saved draft/progress untouched; narration fallback preserved.
- On failure: correct blueprint assumptions or code, rerun numerical and browser QA, log cause and correction.

Decision after QA: GO only when all blocking checks pass. Passing CI is not evidence of user mastery.
