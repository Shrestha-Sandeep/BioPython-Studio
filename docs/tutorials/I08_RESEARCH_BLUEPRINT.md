# I08 research blueprint — join fields safely and make a traceable report

**Date:** 2026-11-13  
**Canonical contract:** `content/chapters/I08_COMPLETE.md`, exact eight I08 goals plus capstone  
**Base:** I07 Pandas QC tutorial branch, review PR #43  
**Process:** `docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md`

## Evidence and design choices

- Witz, `07-Pipeline.ipynb`: https://github.com/guiwitz/PyImageCourse_beginner/blob/master/07-Pipeline.ipynb . Use a pipeline narrative; diagrams must not pretend published notebook figures were processed by these synthetic scripts.
- Pandas `merge(validate="many_to_one")`: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html . With many imaging fields per specimen, the metadata key must be unique on the right. A many-to-many join creates multiplicative output rows; `validate="many_to_many"` offers no safeguard.
- Pandas join guide: https://pandas.pydata.org/docs/user_guide/merging.html . Protect unique keys before joining, inspect unmatched left rows and account for pandas matching null keys to null keys (unlike SQL).
- Matplotlib savefig: https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html . SVG is vector; PNG uses DPI raster. File existence does not validate content quality or science.
- Source of distinct biological unit: design of study and metadata, not a DataFrame row or `groupby` call. Avoid field-level pseudoreplication and inferential statistics in I08; reserve formal uncertainty work for I12.

## Main scientific destination

Transform **invented field-level microscopy measurements** into a coherent report: read and retain source field IDs, join validated specimen metadata, audit unmatched IDs, summarize within specimen first, reshape for display, preserve timestamps, produce labeled descriptive plots, and export traceable table + figures. Published image is background context; numerical values are synthetic.

A key guardrail: imaging fields are nested within specimens, and multiple specimen records may belong to the same experimental unit. The example must explicitly distinguish grouping keys and avoid automatically declaring specimens independent biological replicates.

## Storyboard (target 19 scenes)

| Scene | Goal | New concept / misconception blocked |
|---:|---|---|
| 1 | G01 | Scientific destination: image→candidate regions→field table→specimen report; state source status |
| 2 | G01 | `merge(..., validate="many_to_one")` keeps field row count |
| 3 | G01 | Duplicate metadata causes `MergeError`; do not mask it by dropping rows |
| 4 | G01 | Left join with `indicator=True` finds unmatched specimens |
| 5 | G02 | Summarize multiple fields **within** each specimen |
| 6 | G02 | Four fields ≠ four biological replicates |
| 7 | G03 | Wide→long with `melt` and stable IDs |
| 8 | G03 | Predict row count after melting, withholding answer |
| 9 | G03 | Reveal melted rows and return to identical source |
| 10 | G04 | Parse recorded timestamps; invalid values remain missing |
| 11 | G04 | Explicit ordered category, no inferred causal timeline |
| 12 | G05 | In-memory CSV export/reload with text ID schema |
| 13 | G05 | Record units, data source status and schema in provenance |
| 14 | G06 | Scatter individual specimen summaries; no p-value claim |
| 15 | G06 | Avoid field-mean bars or invented independent n |
| 16 | G07 | Clear labeled axis units and non-misleading scales |
| 17 | G08 | Export real SVG and PNG bytes with format/DPI explicitly chosen |
| 18 | CAPSTONE | Source-preserving merged and audited specimen report with plot |
| 19 | CAPSTONE | Independent fresh-input transfer with no precomputed solution |

At least 14 original *nonredundant* teaching diagrams, especially join duplication, hierarchy and wide-to-long transformations; use tables and groups rather than repetitive outcome cards. Keep narration word-by-word highlight optional, and complete static visuals when boundary events are absent.

## QA gates

1. Canonical goals I08-G01–G08 + I08-CAPSTONE all represented; one withheld prediction followed by reveal.
2. Python samples are isolated, runnable with fresh pandas + Matplotlib, truthful outputs with changed input and empty/unmatched-key cases, no hidden variable dependencies.
3. Demonstrate a *caught* MergeError by type (avoid exact version-dependent message). Verify missing identifiers remain visible; do not accidentally merge null keys.
4. CSV roundtrip preserves `0003` and units column; identify float NA parsing behavior and missingness explicitly.
5. SVG/PNG exports via `io.BytesIO/StringIO` need no file downloads or MP4 controls; labels and data provenance remain visible.
6. Browser mobile 390px and desktop 1280px, prediction privacy, original accredited Witz/HPA figure, TTS fallback, editor/localStorage unchanged, Apply/Prove examples hidden.
7. If any CI fails, document the defect and correct both blueprint and code as required; rerun all relevant checks.
8. Do not merge into production `main` before all staged tutorials and user review.

**Release evidence limit:** Automation can establish software behavior and checked synthetic arithmetic, not valid experimental biology, interpretation, actual figure accessibility for every human viewer or retained learner competence.
