# L01 — Frame a biologically defensible prediction

Turn scientific measurements into a prediction problem without splitting fields from the same animal across train/test or fitting preprocessing on the test set.

**Scientific boundary:** Repeated microscopy fields are correlated within animals. All sample IDs, labels and signal values here are synthetic; model evaluation cannot establish new experimental effects.

**Prerequisites:** Python foundations plus NumPy, Pandas and biological-replicate reasoning from microscopy I07/I11/I12. Datasets are synthetic, but scikit-learn executes for real.

## Mini-goals

### L01-G01 — Choose the actual biological prediction unit (139)

State target label and subject/group ID explicitly; summarize classes at the animal level rather than counting fields as biological replicates.

Treating each image field as an independent animal exaggerates sample size.

**Predict, then run:**

```python
records=[{'animal':'A','label':0},{'animal':'A','label':0},{'animal':'B','label':1}]
print(len(records),len({x['animal'] for x in records}))
```

**Apply:** From data.records return result={'fields':int,'animals':int,'labels_by_animal':dict mapping subject to its unique label}; assert each animal has one consistent label.

**Independent Prove:** Return result={'n_subjects':int,'class_counts':label→number of distinct biological subjects} using sample.records; do not count fields twice.

**Design question:** Would multiple cells per animal count as independent samples in your experiment?

### L01-G02 — Detect subject overlap and data leakage (140)

A valid holdout must have disjoint subject group IDs; duplicated fields or related acquisitions across sets violate independence.

Random field-level splits can produce apparently high accuracy even when there is zero transfer to unseen animals.

**Predict, then run:**

```python
train={'A','B'};test={'B','C'}
print(sorted(train & test))
```

**Apply:** From data.train_groups and data.test_groups return result={'leak':bool,'overlap':[sorted shared group IDs]}.

**Independent Prove:** Return result={'safe':bool,'only_train':[sorted unique training group IDs absent from test],'only_test':[sorted unique test IDs absent from train]} from sample.

**Design question:** What if images differ but come from the same biological preparation?

### L01-G03 — Perform a group-aware training/test split (141)

GroupShuffleSplit partitions subject groups together and keeps all fields from one animal in one side.

Scikit-learn train_test_split without groups is usually inappropriate for repeated-image experiments.

**Predict, then run:**

```python
from sklearn.model_selection import GroupShuffleSplit
idx=list(GroupShuffleSplit(n_splits=1,test_size=.5,random_state=0).split([0,1,2,3],[0,0,1,1],groups=['A','A','B','B']))
print(len(idx[0][0]),len(idx[0][1]))
```

**Apply:** Use GroupShuffleSplit(n_splits=1,test_size=0.34,random_state=data.seed) on data.records grouped by animal. Return result={'train_idx':list of ints,'test_idx':list of ints}; groups must be disjoint.

**Independent Prove:** Use group-aware split on sample.records with test_size=.34 and seed; return result={'train_subjects':sorted IDs,'test_subjects':sorted IDs,'all_rows_accounted':bool}.

**Design question:** Why is random_state alone insufficient to prevent data leakage?

### L01-G04 — Fit missing-value preprocessing only on training data (142)

A sklearn Pipeline chains SimpleImputer and StandardScaler, fitted on training rows only.

Computing medians or standard deviations on train+test leaks future information into the model.

**Predict, then run:**

```python
import numpy as np
from sklearn.impute import SimpleImputer
imp=SimpleImputer(strategy='median').fit(np.array([[1.],[3.],[np.nan]]))
print(imp.statistics_.tolist())
```

**Apply:** Fit SimpleImputer(strategy='median') on data.train_X only; transform data.test_X; return result={'train_medians':list,'test_shape':tuple}. Do not use test rows for fit.

**Independent Prove:** Build a Pipeline(SimpleImputer(median), StandardScaler) fitted on sample.train_X; return result={'mean_after_scaling':list of training column means rounded to 7 decimals,'test_rows':int}.

**Design question:** Could standardized test features reveal information about the test labels?

## Capstone — Create a leakage-safe microscopy feature handoff

Combine animal-level partitioning and train-only preprocessing before a model is fitted.

**Apply:** GroupShuffleSplit data.records by animal with test_size=.34/seed; fit StandardScaler only on training signal; return result={'train_animals':sorted list,'test_animals':sorted list,'train_mean_raw':float raw train mean}.

**Prove:** For sample.records return result={'train_count':number rows,'test_count':number rows,'overlap':sorted shared animal groups} using group-aware split with sample.seed, test_size=.34.

## Delayed review

From sample.train_groups and sample.test_groups return result={'leaked_groups':sorted overlap,'safe':bool,'n_independent_train':unique training groups}.

No worked Prove solution or Prove hints are shown to the learner. Statistical software cannot replace independent experimental design.

## Further reading

- https://scikit-learn.org/stable/common_pitfalls.html
- https://scikit-learn.org/stable/user_guide.html
