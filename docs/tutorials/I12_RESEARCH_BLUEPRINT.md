# I12 — research-led uncertainty and reproducible statistical reporting blueprint

**Date:** 2026-11-13  
**Branch:** feature/imaging-tutorial-cycle-i12, stacked above I11 PR #47  
**Canonical:** `content/chapters/I12_COMPLETE.md` (9 Gxx goals and capstone)  
**Process:** `docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md`

## Research sources and constraints

- 2026 bioimage statistics perspective: https://pmc.ncbi.nlm.nih.gov/articles/PMC13286366/ ; correctly identify independent experimental units and effect sizes, repeated controlled experiments, and uncertainty rather than pseudo-significance.
- Nature Communications replicate guidelines: https://www.nature.com/documents/Biological_and_technical_replicates_guidelines.pdf ; biological versus technical replication and reporting n.
- SciPy `stats.t` distribution and `stats.bootstrap`: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.t.html ; https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html ; replicate-level resampling; percentile interval is a simple teaching example but not universally optimal for low n.
- SciPy paired/Welch t-tests: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_rel.html and https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_ind.html ; define paired versus independent from design *before* testing, not by looking at p-values.
- Statsmodels Holm multiple-testing adjustment: https://www.statsmodels.org/stable/generated/statsmodels.stats.multitest.multipletests.html ; `method="holm"` corrects a declared family, preserves original order.
- Matplotlib scatter / errorbars: https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.errorbar.html ; readable labels must state interval type and observation unit.

## Essential statistical critiques

1. Sample SD measures the spread of independent replicate values; SEM expresses estimated uncertainty of the **mean** under assumptions, not the spread of biological values. More microscope fields from the *same* unit do not create new biological n.
2. Student-t CI needs independent unit-level observations, an effective n>=2 and a stated distributional approximation. A realized 95% frequentist CI should **not** be described as a 95% probability that the fixed parameter lies in the calculated interval.
3. Bootstrapping field rows rather than the independent experimental unit invents precision. Resampling 10,000 times cannot create 10,000 biological experiments.
4. Small sample bootstrap percentiles and outlier handling are not generally robust; show median/IQR and caution.
5. Paired treatment-control differences use matched units; independent groups may call for Welch, not pairing by row order.
6. Report absolute effect and units alongside transparent n, CI, uncertainty type, multiplicity family and unadjusted/adjusted p-values. Neither arbitrary p thresholds nor corrected p-values prove biological relevance.
7. One bar or errorbar cannot convey individual biological values, distribution or sample identity; prefer points and paired trajectories.
8. All examples are invented synthetic biological-replicate values: never infer actual experiments, significance or biological causality.

## Single coherent story

I11 produced a QC-preserving synthetic table with a declared independent biological unit and paired samples. I12 turns **one value per assumed independent experimental unit** into defensible descriptive uncertainty, comparisons and a reproducible plot+JSON report. It must continually remind the learner that independence is established by the design, not the `DataFrame`.

## Tutorial storyboard (target 22 scenes)

| Scene | Goal | Concept |
|---:|---|---|
| 1 | G01 | Destination: biological replicate-level values and explicit uncertainty in a report |
| 2 | G01 | Distinguish between-unit sample SD and mean SEM |
| 3 | G01 | Contrast three biological units with dozens of technical fields |
| 4 | G02 | Median, quartiles and IQR with an outlier |
| 5 | G02 | Mean versus median; no blind outlier deletion |
| 6 | G03 | Transparent 95% Student-t interval on n biological replicates |
| 7 | G03 | Frequentist interpretation and minimum n caveat |
| 8 | G04 | Seeded replicate-level bootstrap percentile interval |
| 9 | G04 | Small n and resamples cannot create new biological evidence |
| 10 | G05 | Paired matched values vs independent Welch test |
| 11 | G05 | Design choice declared before p-value |
| 12 | G06 | Mean effect plus Holm adjusted p-values with original order preserved |
| 13 | G06 | Family-wise correction vs single test and non-significant effect |
| 14 | G07 | Actual scatter of one point per biological unit |
| 15 | G07 | Predict how many independent points/trajectories are plotted; withhold output |
| 16 | G07 | Reveal count; show plotted n and pairing |
| 17 | G08 | JSON includes source, unit, n, seed, method and alpha |
| 18 | G08 | CSV export/reload without silently collapsing replicate IDs |
| 19 | G09 | Explicit SD vs SEM vs CI labels |
| 20 | G09 | Real Matplotlib errorbar figure with declared SD |
| 21 | CAPSTONE | One coherent paired-replicate effect + t CI + source + figure report |
| 22 | CAPSTONE | Independent transfer: unseen field hierarchy, missingness and paired vs Welch choice |

At least 16 *nonredundant* diagrams, particularly biological-unit hierarchy, uncertainty shape and sampling/interval visuals. Numerical outputs verified by fresh CPython with pinned NumPy, SciPy, Pandas and Matplotlib. Exactly one withheld prediction.

## QA and release boundaries

- All nine canonical I12 goals + capstone covered; 22 scenes; transfer unsolved; code and diagram line focus valid.
- Test changed n=1 (no unqualified t interval), zero-variance, missing paired units, unequal technical field counts and list-order-sensitive Holm adjustments.
- Resample unit-level values, fixed seed, display a *percentile* interval by name, and warn about n.
- Actual scatter/errorbars, not simulated figure bytes; axis units and n explicit.
- Verify mobile 390px / desktop 1280px tutorial, voice fallback, diagram checkpoint privacy, no editor/progress modification, Learn-only access.
- Iterate fixes and rerun complete QA, log outcome. Never merge production automatically.

**Pedagogical gate:** Verifying example arithmetic is not equivalent to valid independent real experimental units or a measured learner mastery score.
