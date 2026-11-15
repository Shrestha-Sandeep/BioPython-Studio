# N04 — research-first source-aware mapping, coverage and expression-count tutorial blueprint

**Date:** 2026-11-14  
**Branch:** `feature/sequence-tutorial-cycle-n04`, stacked above N03 PR #52.  
**Canonical:** `content/chapters/N04_COMPLETE.md`; N04-G01–G05 + CAPSTONE.  
**Method:** `docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md`.  
**Input status:** All alignment intervals, categories, feature counts and sample labels in this tutorial are **synthetic**. They do not originate from an aligner/BAM, RNA-seq library or experimentally verified transcript.

## External research and resolved teaching decisions

1. **SAMtools `flagstat` documentation**: https://www.htslib.org/doc/samtools-flagstat — actual SAM/BAM categories are bit flags on *alignment records*: primary/secondary/supplementary, mapped/unmapped, etc. They cannot be equated to this N04 toy one-status-per-read table without explicit deduplication. Consequence: state that `mapped`, `multi` and `unmapped` in the lesson are *mutually exclusive, assumed source-read categories*, not decoded SAM records.
2. **Pandas `pivot_table` current docs**: https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.pivot_table.html and https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.pivot_table.html — default aggregation is mean, so explicitly use `aggfunc='sum'` and `fill_value=0`. Preserve sample and gene identifiers and expose duplicated source rows before pivoting. In genuine experiments, a structurally missing entry may not mean a biological count of zero.
3. **MIT/BaRC 2026 RNA-seq course**: https://barc.wi.mit.edu/education/hot_topics/RNAseq_Feb2026/RNASeq_2026_BaRC_Hot_Topics.slides.4per.pdf — feature counting requires annotation and alignment policy, and naïve raw-count comparisons are not differential expression. Teach only an introductory sample-wise CPM under *assigned-count total*, not length-corrected or compositional normalization.
4. **2025 RNA-seq methodology review**: https://pmc.ncbi.nlm.nih.gov/articles/PMC12522984/ — multimapper assignment policy matters; CPM alone does not correct all composition or biological confounds. A `multi` category does not imply two independent reads or two counted molecules.
5. **Related tutorial foundation:** N03 already requires ID preservation and source-aware settings; N04 reuses the *same* optional Learn-only voice/visual viewer with no Learn/Apply/Prove progress mutation.

## One motivating end-to-end example

**Question:** A researcher receives a synthetic sequencing-summary table with mutually exclusive source-read statuses, toy mapped intervals and a repeated sample×gene count ledger. Can Python produce a traceable report without inflating read mapping, clipping endpoints incorrectly, losing duplicate count rows, or claiming different expression from a CPM change?

The tutorial demonstrates an explicit mini-pipeline: status QC → zero-based half-open coverage → sample×gene aggregation → CPM + zero library safeguard → auditable report. Every source is labeled *synthetic*, every assumption stated.

## Scene plan (20 scenes, exact six canonical goals)

| # | Goal | Distinction | Original visualization |
|---:|---|---|---|
| 1 | G01 | Show the final source-aware audit and its synthetic limitations | statuses → coverage → count matrix → report |
| 2 | G01 | Mapping categories are exclusive source-read labels here, not BAM records | distinct read boxes |
| 3 | G01 | At-least-once mapped includes multi, without counting it twice | 2 mapped + 1 multi + 1 unmapped |
| 4 | G01 | Distinguish uniquely mapped fraction from at least once | fraction comparison |
| 5 | G02 | Zero-based half-open interval [1:4) increments 1,2,3 | indexed reference strip |
| 6 | G02 | Overlap increments depth, not unique read count | two interval tracks and depth |
| 7 | G02 | Clip to reference bounds, exclude multi/unmapped | clipped interval and status |
| 8 | G02 | Coverage fraction vs mean depth are different quantities | depth strip and formulas |
| 9 | G03 | Source ledger contains repeat sample×gene rows; sum before pivot | raw rows → grouped |
| 10 | G03 | `pivot_table` defaults must be explicit (`aggfunc=sum`, `fill_value=0`) | pivot table |
| 11 | G03 | Absence may mean a teaching zero or real missingness | separate zero/missing labels |
| 12 | G04 | Assigned-count CPM denominator: sample total, not raw read length | 10/40 × 1e6 |
| 13 | G04 | **Prediction withheld:** CPM for G1=10, G2=30 | numerator and denominator withheld |
| 14 | G04 | Reveal 250,000/750,000 CPM with real Python | explicit two-gene shares |
| 15 | G04 | Zero-total sample → None rather than divide by zero | empty denominator |
| 16 | G04 | CPM is compositional, not DE; toy denominator matters | same absolute feature, different totals |
| 17 | G05 | Audit mapping fraction and sample assigned count totals | record-linked QC report |
| 18 | G05 | Metadata limitations: feature ID, unique-map policy, source version | provenance ledger |
| 19 | CAPSTONE | Real Pandas aggregation, one-read-one-status mapping and clipped unique depth | synthetic end-to-end report |
| 20 | CAPSTONE | Independent transfer: new overlapping reads, duplicate counts, zero libraries | unsolved decision tree |

One checkpoint only, at scene 13, with **empty** output. Reveal occurs in scene 14. The final transfer does not provide code or solutions, and does not use hidden `data` or `sample` Prove inputs.

## Scientific boundaries and QA traps

- Count **source read IDs**, not every alignment record. Tutorial statuses are simplified, mutually exclusive; do not mislabel them genuine BAM flags.
- Coverage increments each reference base in `[max(start,0):min(end,L))` for status `mapped` in this canonical toy policy, excluding `multi` and `unmapped`. Report any out-of-bounds and clipping.
- Depth sums with overlaps, while covered_positions counts unique positions with depth greater than zero; a mean depth cannot reveal coverage holes.
- Repeated count ledger rows are **summed**, not silently deduplicated. A missing sample×gene combination filled with 0 is a *declared teaching assumption*, not universally correct for incomplete biological data.
- **CPM definition:** one million times each **aggregated feature count / total assigned feature counts for that sample**. No claim that these library totals equal uniquely mapped reads or sequencer output. Zero sample total ⇒ `None`.
- Neither CPM, a mapped fraction nor depth establishes differential expression, technical confound control or biological replication; interpretation requires sample metadata, feature annotation, proper normalization and a statistical design.

## Implementation / QA contract

- `src/tutorials/n04-data.js`, exactly 20 scenes mapped to G01–G05 + capstone; one withheld prediction, final new-input transfer.
- Extend existing `src/tutorials/sequence-illustrations.js` with **20 original SVG descriptors**, no additional panel or animation. Preserve narration and speech-boundary fallback.
- Register the module before the same Learn-only `p01-viewer.js`, do not alter user-visible UI design.
- Validate **100%** of displayed outputs against fresh CPython with Pandas, Biopython 1.86 environment and warnings-as-errors where appropriate. Changed-input tests: no reads, all unmapped, multi, nonnegative/negative interval clipping, overlapping intervals, duplicate sample×gene, missing gene and zero library; no division by zero.
- GitHub Actions runs cumulative N01–N04 Node/Python tests plus Playwright at 390 and 1280px; check code editor and localStorage preservation, Apply/Prove and delayed review isolation, voice controls, diagram labels, prediction/reveal, error-free loading.
- Revise blueprint and implementation if a scientific or technical blocker is found, log exactly what was changed and rerun CI. Keep branch a draft PR; **never merge to `main` without separate review**.

**Next curriculum stage after N04:** L01–L03 machine-learning tutorials. Start with a fresh L01 research blueprint only after N04 reaches technical QA green.
