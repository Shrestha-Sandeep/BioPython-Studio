# I11 research blueprint — experimental units, pairing and acquisition batches

**Date:** 2026-11-13  
**Branch:** feature/imaging-tutorial-cycle-i11, based on I10 #46  
**Canonical:** `content/chapters/I11_COMPLETE.md` (I11-G01...G07, capstone)  
**Course contract:** `docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md`.

## Research anchors

- 2026 perspective, **Practical statistics for bioimage analysis**: https://pmc.ncbi.nlm.nih.gov/articles/PMC13286366/ . Different fields/cells from the same experimental source should not generally be substituted for independently repeated experiments; data quality and controls matter more than inflated n.
- 2019 **Empowering statistical methods for cellular and molecular biologists**: https://pmc.ncbi.nlm.nih.gov/articles/PMC6724699/ . Define replicate hierarchy relative to population and treatment assignment; pooling non-independent technical measurements can understate variance.
- Nature Communications reproducibility guidance: https://www.nature.com/documents/Biological_and_technical_replicates_guidelines.pdf . Specify biological vs technical replication in figures and research claims.
- Bioconductor study-design guide: https://bioconductor.org/books/release/OSTA/pages/bkg-exp-design.html . Distinguish experimental unit, observation unit and biological unit; randomize acquisition batches where practical.
- Pandas groupby/merge documentation: https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.mean.html ; https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html .

## Scientific controls and reviewer objections

- Field count, segmented nuclei, images or frames are **not** automatic biological replicate count.
- For paired designs, identify matched biological source before computing within-pair treatment minus control differences, with explicit unmatched/duplicate audits.
- Missing-score exclusions may correlate with treatment (poor imaging, toxicity) and bias estimated treatment differences. Retain rejection reasons, n and attrition per group.
- The estimand (e.g. mean per-donor paired difference) must be declared before analysis. Avoid selecting summaries that happen to support a desired claim.
- Acquisition batch can be completely confounded with treatment; no downstream correction can recover a treatment effect if every treated sample is in one batch and every control in the other without bridging information.
- Within-batch centering is a transformation, not evidence that batch effects were removed; may also remove the treatment effect when condition and batch are confounded.
- Synthetic paired numbers are for learning only; the course should never claim independent real bioimage replication.

## One coherent story: a microscopy field table from several preparations

Start with invented fields nested in biological units and experiments. Audit `biological_id`, `field_id`, `condition`, `batch`, `pair_id`. Demonstrate aggregation, attrition, pairing, a predeclared descriptive estimand and truthful batch normalization, ending with a full QC-preserving table.

### 18-scene storyboard

| Scene | Goal | Key concept | Visual |
|---:|---|---|---|
| 1 | G01 | Microscope image → fields → experimental units; synthetic context | Nested hierarchy |
| 2 | G01 | Six cells/fields but two biological units | Count hierarchy |
| 3 | G01 | Nested/cluster labels without inferring independence | Source-preserving table |
| 4 | G02 | Explicit unique pair IDs match control/treated | Before and after |
| 5 | G02 | Reject duplicate and incomplete pair IDs | Paired audit |
| 6 | G03 | Missing/excluded images remain in QC table | Attrition by condition |
| 7 | G03 | Comparing means after exclusions may change descriptive effect | Selection bias warning |
| 8 | G04 | Declare estimand as mean of matched biological-unit differences | Unit-level differences |
| 9 | G04 | Predict paired mean difference, output withheld | Prediction |
| 10 | G04 | Reveal mean of paired differences | Reveal |
| 11 | G05 | Aggregate fields into one value per independent unit first | Means by biological ID |
| 12 | G05 | Unequal numbers of fields distort raw pooled means | Equal biological-unit weighting |
| 13 | G06 | Confounded acquisition batch and condition | Perfectly aligned batch/condition |
| 14 | G06 | Balanced batch-condition cross-tab as necessary evidence | Coverage table |
| 15 | G07 | Within-batch centering with source values retained | Raw vs centered |
| 16 | G07 | Confounding means centering cannot rescue causal inference | Guardrail |
| 17 | CAPSTONE | Full hierarchy/QC/attrition/batch/paired effect report, source untouched | Audit report |
| 18 | CAPSTONE | Independent synthetic transfer with incomplete pairs and batch risk | No solution |

At least 12 nonredundant diagrams; use original nested hierarchy and before/after transformations rather than motivational text. One prediction/reveal, stable browser narration and independent transfer.

## Test gates

1. Exact I11-G01–G07 + capstone mapping; 18 scenes; one withheld answer.
2. Every displayed Python/Pandas value verified with pinned fresh CPython on changed synthetic units, missing, duplicate pair IDs and unmatched conditions.
3. No hidden false claim of independent biological units: use conditional language and state a design assumption whenever an ID is called biological.
4. Correct denominator and attrition by treatment; never auto-delete missing or excluded source.
5. Confounded 2×2 batch/condition remains flagged despite numerical normalization.
6. Mobile 390px/desktop 1280px, real diagrams, TTS, no localStorage/editor mutation, Learn-only entry.
7. Record failures, correct and rerun. Keep stacked review branches and production unchanged.

**QA output limitation:** tests can verify arithmetic and scope guardrails on synthetic data, not experimental validity or learning retention.
