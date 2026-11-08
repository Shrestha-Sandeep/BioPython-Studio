# I11 — Respect biological replicates and batches

**Status:** Code and exercise implementation only; not independent or retained learner mastery.

Reference course: https://github.com/guiwitz/PyImageCourse_beginner/blob/master/07-Pipeline.ipynb

**Scope:** Synthetic biological replicate records; genuine NumPy/Pandas/SciPy/Matplotlib calculations. Nothing here establishes experimental validity.

## I11-G01 — Identify the independent experimental unit

Count animals/specimens, not microscope fields, as biological replicate candidates.

- Multiple image fields from one animal share a biological experimental unit.
- A larger field count does not increase the number of independent animals.
- Reported measurements and experiment IDs here are synthetic. No biological significance is inferred from passing code exercises.

**Predict and run:** Predict the numerical result and explain which level of replication it represents.

```python
rows=[{'animal':'A'},{'animal':'A'},{'animal':'B'}];print(len(set(r['animal'] for r in rows)))
```

**Apply:** Return result={'fields':int,'animals':int} from data.records, counting all fields and distinct animals.

**Prove:** Return distinct animals per sample condition after QC inclusion as a dict result.

**Debug:** Find and explain one pseudoreplication, pairing, batch or uncertainty error.

**Scientific boundary:** Input values represent synthetic biological replicates or fields, not independently verified experiments; review the design and missingness.

## I11-G02 — Audit paired design and matched changes

Pair conditions only when the same independent unit contributes both observations.

- For each animal, average QC-accepted fields *within* each condition before subtraction.
- Dropping incomplete pairs may change the estimand and should be disclosed.
- Reported measurements and experiment IDs here are synthetic. No biological significance is inferred from passing code exercises.

**Predict and run:** Predict the numerical result and explain which level of replication it represents.

```python
print({'animal_A':5-3})
```

**Apply:** Compute treated-minus-control mean per animal using QC-approved records; store dict result keyed by animal.

**Prove:** Return the sorted list of matched animal changes from sample.records; do not treat fields as matched pairs.

**Debug:** Find and explain one pseudoreplication, pairing, batch or uncertainty error.

**Scientific boundary:** Input values represent synthetic biological replicates or fields, not independently verified experiments; review the design and missingness.

## I11-G03 — Expose QC exclusion and selection bias

Record rejected fields explicitly instead of silently deleting them.

- An exclusion may differ across conditions and bias estimates.
- A missing observation is not a measured biological zero.
- Reported measurements and experiment IDs here are synthetic. No biological significance is inferred from passing code exercises.

**Predict and run:** Predict the numerical result and explain which level of replication it represents.

```python
rows=[True,False,True];print(sum(not x for x in rows))
```

**Apply:** Count rejected fields per condition in data.records; return result dict with control/treated counts.

**Prove:** Compute the per-condition QC acceptance fraction for sample.records (None if none); return dict result.

**Debug:** Find and explain one pseudoreplication, pairing, batch or uncertainty error.

**Scientific boundary:** Input values represent synthetic biological replicates or fields, not independently verified experiments; review the design and missingness.

## I11-G04 — Define the treatment effect estimand

Specify whether the comparison is paired by animal before calculating differences.

- A matched mean difference weights each biological unit once after field aggregation.
- An average of all field values is not the same estimand when field counts differ.
- Reported measurements and experiment IDs here are synthetic. No biological significance is inferred from passing code exercises.

**Predict and run:** Predict the numerical result and explain which level of replication it represents.

```python
import numpy as np
print(float(np.mean([3,5,7])))
```

**Apply:** Return mean per-animal paired treated-minus-control difference from QC-approved data.records, or None.

**Prove:** Independently compute an *unpaired* difference of condition-specific animal means from sample.records after QC; label result as unpaired.

**Debug:** Find and explain one pseudoreplication, pairing, batch or uncertainty error.

**Scientific boundary:** Input values represent synthetic biological replicates or fields, not independently verified experiments; review the design and missingness.

## I11-G05 — Aggregate fields within biological replicates

Compute one summary per biological unit and condition before group-level inference.

- Each output row should retain sample ID, QC field count and mean.
- Unit-level summaries keep statistical denominators auditable.
- Reported measurements and experiment IDs here are synthetic. No biological significance is inferred from passing code exercises.

**Predict and run:** Predict the numerical result and explain which level of replication it represents.

```python
import pandas as pd
print(pd.DataFrame({'animal':['A','A'],'value':[2,4]}).groupby('animal')['value'].mean().to_dict())
```

**Apply:** Use Pandas to group accepted data.records by animal and condition; return sorted list of {'animal','condition','mean','n_fields'}.

**Prove:** Return the number of distinct QC-approved animals per condition after aggregation, not number of fields.

**Debug:** Find and explain one pseudoreplication, pairing, batch or uncertainty error.

**Scientific boundary:** Input values represent synthetic biological replicates or fields, not independently verified experiments; review the design and missingness.

## I11-G06 — Flag acquisition-batch confounding

Inspect whether treatment and acquisition batch are crossed in the study design.

- A treatment restricted to one imaging day cannot be separated reliably from day effects.
- Balanced batch labels alone do not eliminate all technical bias.
- Reported measurements and experiment IDs here are synthetic. No biological significance is inferred from passing code exercises.

**Predict and run:** Predict the numerical result and explain which level of replication it represents.

```python
import pandas as pd
print(pd.crosstab(['B1','B2'],['control','treated']))
```

**Apply:** Build batch×condition QC-approved field counts as dict result with keys (batch,condition); report all observed cells.

**Prove:** Flag whether each observed batch has both conditions among QC-approved sample.records; return {'crossed': bool,'batches':int}.

**Debug:** Find and explain one pseudoreplication, pairing, batch or uncertainty error.

**Scientific boundary:** Input values represent synthetic biological replicates or fields, not independently verified experiments; review the design and missingness.

## I11-G07 — Normalize transparently within acquisition batches

Normalize only against controls from the same batch and declare missing references.

- Batch-wise reference means can reduce some artifacts, but cannot fix confounded design.
- Controls with zero mean or missing QC make normalization undefined.
- Reported measurements and experiment IDs here are synthetic. No biological significance is inferred from passing code exercises.

**Predict and run:** Predict the numerical result and explain which level of replication it represents.

```python
print(round(8/4,2))
```

**Apply:** Compute batch control means from QC-approved records, then return normalized value per accepted data field in result.

**Prove:** Compute sample-level batch-reference normalized mean for each animal/condition after QC; retain explicit None for missing/zero control.

**Debug:** Find and explain one pseudoreplication, pairing, batch or uncertainty error.

**Scientific boundary:** Input values represent synthetic biological replicates or fields, not independently verified experiments; review the design and missingness.

## I11-CAPSTONE — Produce a QC-preserving biological replicate table

Combine learning goals into a transparent and assumption-aware experimental report.

- Declare and preserve biological experimental units.
- Keep exclusion and batch decisions visible alongside measured effects.
- Simulation and statistical code cannot independently validate real source data.

**Predict and run:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
print(np.mean([1,2,3]))
```

**Apply:** Accept only data QC records; group field values to animal and condition, and report biological n, field n and matched mean change without treating fields as replicates.

**Prove:** Return sample batch/condition QC counts and flag whether both conditions occur in every observed batch; report the number of excluded fields.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I11-REVIEW — Spot pseudoreplication in new field records

Reconstruct the method after a delay on a fresh input.

- Reproduce the key numerical decision from memory.
- Check edge behavior and compare to a second input.
- Do not equate remembered code with biological validation.

**Predict and run:** Predict the printed numerical result and one limitation before execution.

**Apply:** Recall the algorithm without feedback before independent Prove.

**Prove:** Report number of QC fields, unique biological animals and all fields per animal from sample.records.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## Independent release checks

- Execute reference cases with real scientific libraries on new inputs.
- Check figure rendering, exported script, saved progress and mobile UI.
- Manually validate statistical assumptions and actual learner transfer.
