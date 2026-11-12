# I12 — Report uncertainty without misleading plots

**Status:** Code and exercise implementation only; not independent or retained learner mastery.

Reference course: https://github.com/guiwitz/PyImageCourse_beginner/blob/master/07-Pipeline.ipynb

**Scope:** Synthetic biological replicate records; genuine NumPy/Pandas/SciPy/Matplotlib calculations. Nothing here establishes experimental validity.

## I12-G01 — Distinguish SD from SEM at replicate level

Compute uncertainty only after identifying the biological replicate values.

- Sample SD measures between-replicate dispersion; SEM estimates uncertainty of the mean.
- Increasing the number of imaging fields does not change biological n.
- Reported measurements and experiment IDs here are synthetic. No biological significance is inferred from passing code exercises.

**Predict and run:** Predict the numerical result and explain which level of replication it represents.

```python
import numpy as np
x=np.array([1.,2.,3.]);print(x.std(ddof=1),x.std(ddof=1)/np.sqrt(len(x)))
```

**Apply:** From biological-replicate data.treated, return result={'n','sd','sem'} using sample SD (ddof=1).

**Prove:** Compute sample SEM of within-replicate treated−control changes in sample, not individual field values.

**Debug:** Find and explain one pseudoreplication, pairing, batch or uncertainty error.

**Scientific boundary:** Input values represent synthetic biological replicates or fields, not independently verified experiments; review the design and missingness.

## I12-G02 — Use robust summaries for skewed measurements

Report median and IQR when outliers could dominate small samples.

- Median and quartiles summarize a distribution without a normality assumption.
- These descriptive statistics do not repair biased sampling or batch effects.
- Reported measurements and experiment IDs here are synthetic. No biological significance is inferred from passing code exercises.

**Predict and run:** Predict the numerical result and explain which level of replication it represents.

```python
import numpy as np
print(np.percentile([1,2,3,30],[25,50,75]))
```

**Apply:** Compute data.treated median and IQR (75th−25th percentile); return a dict result.

**Prove:** Return the median absolute deviation around median of sample.treated (unscaled) as a float.

**Debug:** Find and explain one pseudoreplication, pairing, batch or uncertainty error.

**Scientific boundary:** Input values represent synthetic biological replicates or fields, not independently verified experiments; review the design and missingness.

## I12-G03 — Build a transparent t confidence interval

A confidence interval needs the effective n and stated distributional assumptions.

- Use Student-t sampling uncertainty on independent replicate values with ddof=1.
- A 95% CI does not imply 95% probability that a fixed parameter is inside this observed interval.
- Reported measurements and experiment IDs here are synthetic. No biological significance is inferred from passing code exercises.

**Predict and run:** Predict the numerical result and explain which level of replication it represents.

```python
from scipy.stats import t
print(t.ppf(.975,df=3))
```

**Apply:** Calculate two-sided (1−data.alpha) Student-t CI for the mean of data.treated; return lower, upper and mean.

**Prove:** Construct a paired-difference t interval on sample.treated−sample.control, return tuple(lower,upper).

**Debug:** Find and explain one pseudoreplication, pairing, batch or uncertainty error.

**Scientific boundary:** Input values represent synthetic biological replicates or fields, not independently verified experiments; review the design and missingness.

## I12-G04 — Bootstrap the correct experimental unit

Resample independent biological replicates, not individual microscope fields.

- A seeded nonparametric bootstrap makes variability reproducible for checking.
- Small n, systematic bias and nonindependence are not fixed by thousands of resamples.
- Reported measurements and experiment IDs here are synthetic. No biological significance is inferred from passing code exercises.

**Predict and run:** Predict the numerical result and explain which level of replication it represents.

```python
import numpy as np
rng=np.random.default_rng(2);print(rng.choice([1,2,3],size=(2,3),replace=True))
```

**Apply:** Bootstrap the mean of data.treated with 300 replicate-level resamples using data.seed; return 2.5%/97.5% percentile bounds.

**Prove:** Bootstrap matched biological-replicate changes in sample (500 seeded resamples) and return the mean's 5% and 95% bounds.

**Debug:** Find and explain one pseudoreplication, pairing, batch or uncertainty error.

**Scientific boundary:** Input values represent synthetic biological replicates or fields, not independently verified experiments; review the design and missingness.

## I12-G05 — Select paired versus independent comparisons before testing

The experimental design determines a statistical test, not the observed p-value.

- Paired t tests operate on matched biological replicate changes.
- Welch's t test compares independent group means allowing unequal variances; assumptions must be checked.
- Reported measurements and experiment IDs here are synthetic. No biological significance is inferred from passing code exercises.

**Predict and run:** Predict the numerical result and explain which level of replication it represents.

```python
from scipy.stats import ttest_rel
print(ttest_rel([3,4,5],[2,3,4]).pvalue)
```

**Apply:** Use scipy.stats: if data.paired use ttest_rel; otherwise use unequal-variance ttest_ind. Return {'method','pvalue'}.

**Prove:** On sample, report the paired mean change plus a test p-value if sample.paired, otherwise unpaired mean effect plus Welch p.

**Debug:** Find and explain one pseudoreplication, pairing, batch or uncertainty error.

**Scientific boundary:** Input values represent synthetic biological replicates or fields, not independently verified experiments; review the design and missingness.

## I12-G06 — Report effect size and correct multiplicity

Multiple comparisons and small samples require transparent effect reporting.

- A raw mean change and adjusted p-values answer different questions.
- Holm adjustment protects family-wise error under a declared comparison family.
- Reported measurements and experiment IDs here are synthetic. No biological significance is inferred from passing code exercises.

**Predict and run:** Predict the numerical result and explain which level of replication it represents.

```python
import numpy as np
print(np.clip([0.1,1.2],0,1))
```

**Apply:** Calculate mean treated−control effect and Holm-adjust the supplied data.pvalues; return {'effect','adjusted'} preserving original order.

**Prove:** Calculate Bonferroni-adjusted sample.pvalues (clamp at 1) with the same original ordering.

**Debug:** Find and explain one pseudoreplication, pairing, batch or uncertainty error.

**Scientific boundary:** Input values represent synthetic biological replicates or fields, not independently verified experiments; review the design and missingness.

## I12-G07 — Visualize biological replicates, not all fields

A figure should reveal the number of independent samples and the distribution.

- Plot individual biological-replicate points for each condition using real Matplotlib.
- Bar charts alone can conceal replicates, spread, missingness and outliers.
- Reported measurements and experiment IDs here are synthetic. No biological significance is inferred from passing code exercises.

**Predict and run:** Predict the numerical result and explain which level of replication it represents.

```python
import matplotlib.pyplot as plt
fig,ax=plt.subplots();ax.scatter([1,1],[2,3]);ax.set(xlabel='Condition',ylabel='Value');print(len(ax.collections))
```

**Apply:** Plot each data.control and data.treated replicate as scatter points at x=0 and x=1; set descriptive labels and result={'n_control','n_treated'}.

**Prove:** Plot sample paired trajectories as lines from x=0 to x=1 for every matched replicate; set axis labels and return n.

**Debug:** Find and explain one pseudoreplication, pairing, batch or uncertainty error.

**Scientific boundary:** Input values represent synthetic biological replicates or fields, not independently verified experiments; review the design and missingness.

## I12-G08 — Export a reproducible experiment summary

Store sample counts, methods and source identity alongside effect estimates.

- Machine-readable JSON or CSV preserves the analysis decisions.
- Reproducibility does not imply causal validity or truthful original acquisition metadata.
- Reported measurements and experiment IDs here are synthetic. No biological significance is inferred from passing code exercises.

**Predict and run:** Predict the numerical result and explain which level of replication it represents.

```python
import json
print(json.dumps({'unit':'animal','n':3},sort_keys=True))
```

**Apply:** Set result to a JSON-ready dict with unit='biological replicate', n for each group, mean effect, seed and CI alpha; include sorted JSON text in report_json.

**Prove:** Export one CSV row per biological replicate and condition from sample using csv.DictWriter; return CSV string result.

**Debug:** Find and explain one pseudoreplication, pairing, batch or uncertainty error.

**Scientific boundary:** Input values represent synthetic biological replicates or fields, not independently verified experiments; review the design and missingness.

## I12-G09 — Show uncertainty with explicit intervals

Error bars must state whether they represent SD, SEM or a confidence interval.

- Plot group mean with SD labeled explicitly, not silently switching interval type.
- A plot based on independent biological replicates must not inflate n with fields.
- Reported measurements and experiment IDs here are synthetic. No biological significance is inferred from passing code exercises.

**Predict and run:** Predict the numerical result and explain which level of replication it represents.

```python
import numpy as np
x=np.array([2.,4.,6.]);print(x.mean(),x.std(ddof=1))
```

**Apply:** Make a real Matplotlib errorbar graph for control/treated means ± sample SD and return {'kind':'SD','n':...}; label axes.

**Prove:** Plot paired-difference mean ± SEM with explicit title and y label; return {'kind':'SEM','n'}.

**Debug:** Find and explain one pseudoreplication, pairing, batch or uncertainty error.

**Scientific boundary:** Input values represent synthetic biological replicates or fields, not independently verified experiments; review the design and missingness.

## I12-CAPSTONE — Make a replication-aware effect and uncertainty report

Combine learning goals into a transparent and assumption-aware experimental report.

- Declare and preserve biological experimental units.
- Keep exclusion and batch decisions visible alongside measured effects.
- Simulation and statistical code cannot independently validate real source data.

**Predict and run:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
print(np.mean([1,2,3]))
```

**Apply:** Use biological replicate data; report treated−control mean effect, paired/independent design, replicate n and bootstrap interval resampled at unit level; plot replicate data.

**Prove:** Rebuild a 95% Student-t CI of matched replicate change on sample and report n_bio and effect; do not use number of microscope fields.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I12-REVIEW — Independently bootstrap matched replicate changes

Reconstruct the method after a delay on a fresh input.

- Reproduce the key numerical decision from memory.
- Check edge behavior and compare to a second input.
- Do not equate remembered code with biological validation.

**Predict and run:** Predict the printed numerical result and one limitation before execution.

**Apply:** Recall the algorithm without feedback before independent Prove.

**Prove:** On fresh sample, use a seeded bootstrap resampling entire matched replicate changes 300 times; set result=(low2.5,high97.5).

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## Independent release checks

- Execute reference cases with real scientific libraries on new inputs.
- Check figure rendering, exported script, saved progress and mobile UI.
- Manually validate statistical assumptions and actual learner transfer.
