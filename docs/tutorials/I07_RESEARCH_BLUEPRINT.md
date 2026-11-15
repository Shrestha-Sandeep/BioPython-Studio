# I07 research blueprint — auditable microscopy measurements tables

**Date:** 2026-11-13  
**Base:** I06 candidate-label tutorial branch (PR #42)  
**Canonical:** `content/chapters/I07_COMPLETE.md` (I07-G01–G07 + capstone)  
**Research process:** `docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md`

## Research basis and decisions

1. **Witz, PyImageCourse beginner — Regions notebook:** https://github.com/guiwitz/PyImageCourse_beginner/blob/master/06-Regions.ipynb . The transition from candidate image region labels to structured region measurements is useful motivation, but no table here is purported to be extracted from a credited rendered figure.
2. **scikit-image regionprops_table 0.26:** https://scikit-image.org/docs/stable/api/skimage.measure.html . A regionprops table has one detected region per row, not one specimen/biological replicate per row. Its property names, calibration, and original file IDs must be separately tracked.
3. **Pandas read_csv (3.x):** https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html . Explicitly set ID dtype to string; parse numeric columns deliberately. Default missing-value tokens are domain-dependent and can misinterpret specimen IDs.
4. **Pandas 3.1 release warning:** https://pandas.pydata.org/pandas-docs/stable/whatsnew/v3.1.0.html . Category dtype inference can strip leading zeros; avoid `dtype="category"` for acquisition identifiers, and test identifiers like `"0003"`.
5. **Pandas missingness/groupby guidance:** https://pandas.pydata.org/docs/user_guide/groupby.html . Do not silently lose missing IDs or missing scores; `groupby` excludes missing keys by default.
6. **Programming pedagogy:** Worked example → prediction without answer → observable output → independent changed-input transfer, consistent with the frozen learning system; no forced narration or auto-play.

## Central story

I06 delivers *candidate objects* with parameters, exclusions and region areas. I07 teaches how to turn **supplied fictional region-measurement rows** into an **auditable Pandas table**, without confusing field observations, algorithmic labels and biological specimens.

Three IDs must remain conceptually distinct: `specimen_id`, `field_id`, `object_label`. A field may contain many candidate objects; one specimen may have many fields; nothing about row count alone establishes independent biological replication.

## Scientific red flags and safeguards

- Preserve source text identifiers including leading zeros, case and raw whitespace. Normalize only explicitly allowed surrounding whitespace, retaining `raw_id`.
- Never silently `drop_duplicates()` or `dropna()` to make a summary look cleaner.
- A duplicate field ID may indicate a real repeated acquisition or a recording error; conflicting treatment metadata require investigation, not arbitrary selection.
- Missing numeric measurement `NaN` and recorded zero are different. `pd.to_numeric(errors="coerce")` can create missing values from malformed text; count and report them.
- A CSV parser's default NA tokens (including common literals) may be valid scientific IDs. Test explicit `keep_default_na=False` where needed and separate the ID rule from numeric coercion.
- Show original and transformed tables side by side where pedagogically useful, but avoid false claims about actual images, instruments, or calibrated fluorescence.
- No attempt to estimate biological treatment effects; the chapter's output is a data-quality audit.

## Proposed 18 scenes (one coherent example)

| Scene | Goal | Concept and test | Visual |
|---:|---|---|---|
| 1 | G01 | Published image context versus invented object rows, data hierarchy | Three levels of identity |
| 2 | G01 | DataFrame named columns, shape and dtypes | Column schema |
| 3 | G02 | Leading-zero IDs with explicit CSV dtype | Before/after ID |
| 4 | G02 | Convert numeric text under declared error policy | Valid/invalid values |
| 5 | G03 | Filter by score while retaining field IDs | Source row → filtered row |
| 6 | G03 | `.loc` versus `.iloc` after noncontiguous filtering | Index/position |
| 7 | G03 | Predict retained IDs on an unseen score cutoff, output withheld | No answer shown |
| 8 | G03 | Reveal changed-input retained IDs | Reveal |
| 9 | G04 | Schema required columns, missing-key rejection | Explicit fail |
| 10 | G04 | Numeric conversion validity and schema ≠ provenance | Missing/invalid |
| 11 | G05 | Trim external whitespace without changing case | Raw/normalized |
| 12 | G05 | Normalization collision without automatic merge | Preserve both |
| 13 | G06 | Repeated IDs versus conflicting conditions | Audit flags |
| 14 | G06 | Composite ID question: field ID alone may not be unique | Identity hierarchy |
| 15 | G07 | Missing, zero and observed score classifications | Distinct statuses |
| 16 | G07 | Dropping missing scores biases downstream summaries | Preserve rows |
| 17 | CAPSTONE | Single source-preserving table QC: missing, duplicates, conflicts | Audit report |
| 18 | CAPSTONE | Independent changed-input transfer, no solved code | Apply/Prove |

At least 12 original, nonredundant semantic diagrams. A semantic table-type diagram must use actual example values; narrative-only slides should avoid repetitive cards. Exact `checkpoint:true` once; output empty until reveal. Fresh Python/pandas output parity for all runnable scenes.

## Implementation contract

Add `src/tutorials/i07-data.js` as a new optional tutorial module using the existing viewer/voice UI; amend index registration and illustration definitions. No new buttons, no MP4 export, no mutations to editor drafts or learning progress, and no access to Apply/Prove answers.

Use `pd.DataFrame`, `pd.read_csv(io.StringIO(...), dtype={...})`, `pd.to_numeric`, `isna`, `duplicated`, `groupby` only with explicit failure/missing semantics. Test on pandas 2.2 and 3.x-compatible APIs.

## Required QA gates

- Goal mapping exactly I07-G01...G07 + CAPSTONE, at least one scene each, one withheld prediction, source-provenance disclosure, independent transfer.
- All executable output equals fresh CPython+pandas; changes to inputs (leading zeros, case, conflicts, missing, zeros, empty table) behave as claimed.
- Diagrams reflect the actual synthetic table states, accessible static fallback, no answer leakage.
- Browser: 390px/1280px, narration + preview, checkpoint, full navigation, images load, output/diagram visible, Apply/Prove isolation, storage/editor unchanged.
- Any failing QA triggers fix to tutorial and, if a conceptual error, revision here followed by a new complete run.
- Production `main` untouched; stack on I06 until both branches pass QA.
