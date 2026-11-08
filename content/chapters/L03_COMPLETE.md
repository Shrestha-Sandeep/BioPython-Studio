# L03 — Evaluate genuinely unseen biological data

Evaluate models with grouped cross-validation, class-aware metrics, honest calibration diagnostics, and a final group-safe project.

**Scientific boundary:** All subject groups and labels are synthetic. Three-fold CV on six simulated animals is only a method demonstration; it does not provide reliable biological accuracy or calibrated probabilities.

**Prerequisites:** Python foundations plus NumPy, Pandas and biological-replicate reasoning from microscopy I07/I11/I12. Datasets are synthetic, but scikit-learn executes for real.

## Mini-goals

### L03-G01 — Run group-disjoint cross-validation (147)

GroupKFold partitions all fields of a subject together. Each fold must have zero overlapping animal IDs.

Ordinary KFold randomizes fields, not biological animals, and can overestimate new-animal performance.

**Predict, then run:**

```python
from sklearn.model_selection import GroupKFold
x=list(range(6));g=['A','A','B','B','C','C'];print(len(list(GroupKFold(3).split(x,groups=g))))
```

**Apply:** Use GroupKFold(n_splits=3) on data.records grouped by animal. Return result list of {'train_subjects':sorted unique IDs,'validation_subjects':sorted IDs} for each fold.

**Independent Prove:** Using GroupKFold(n_splits=3), return result={'folds':3,'all_validation_rows_once':bool,'max_group_overlap':max overlap count} from sample.records.

**Design question:** How would you stratify if each animal contributed thousands of correlated image fields?

### L03-G02 — Evaluate imbalanced outcomes with useful metrics (148)

Precision, recall and balanced accuracy reveal different failure modes; declare positive label and zero-division handling.

A classifier predicting every sample as negative can be highly accurate but have zero positive-class recall.

**Predict, then run:**

```python
from sklearn.metrics import balanced_accuracy_score,recall_score
print(balanced_accuracy_score([0,0,0,1],[0,0,0,0]),recall_score([0,0,0,1],[0,0,0,0],zero_division=0))
```

**Apply:** Using data.eval_y/eval_pred return result={'precision':float,'recall':float,'balanced_accuracy':float} with scikit-learn and zero_division=0.

**Independent Prove:** Return result={'TP':int,'FP':int,'FN':int,'TN':int,'positive_recall':float or 0 if no positives} for sample.eval_y/pred.

**Design question:** Which metric matters if false negatives are scientifically expensive?

### L03-G03 — Diagnose probabilistic errors and calibration (149)

Brier score measures mean squared difference between predicted positive-class probability and actual 0/1 outcome.

Low Brier score on eight synthetic samples does not prove calibration or transfer to other acquisition batches.

**Predict, then run:**

```python
from sklearn.metrics import brier_score_loss
print(brier_score_loss([0,1],[.2,.8]))
```

**Apply:** Compute result={'brier':float,'mean_probability':float,'positive_rate':float} for data.eval_y/eval_prob, without fitting on truth.

**Independent Prove:** For sample.eval_y and eval_prob return result={'high_confidence_errors':int number of wrong predictions at threshold .5 with confidence >=.75,'n':number of observations}.

**Design question:** Why would a reliability diagram based on eight examples be unstable?

### L03-G04 — Complete a group-safe model evaluation summary (156)

A model is trained only on the training fold; report the dummy baseline and a regularized classifier without inspecting held-out labels during fitting.

Choosing model hyperparameters based on the final test fold gives optimistic validation estimates.

**Predict, then run:**

```python
from sklearn.metrics import balanced_accuracy_score
print(balanced_accuracy_score([0,0,1,1],[0,1,1,1]))
```

**Apply:** Perform GroupKFold(3) on data.records; fit DummyClassifier and StandardScaler+LogisticRegression on training folds only (signal feature). Return result={'logistic_balanced_accuracy':list of 3 floats,'dummy_balanced_accuracy':list of 3 floats,'group_leaks':0}.

**Independent Prove:** Run GroupKFold(3) on sample.records using only animal for groups; return result={'n_folds':3,'subject_validation_counts':dict each subject appears as validation exactly once,'total_fields':int}.

**Design question:** Why do 3-fold results from only six synthetic animals remain too uncertain for a biological claim?

## Capstone — Produce an auditable group-safe ML report

Finish the ML pathway by running an explicit subject-group CV comparison and producing interpretable outcomes.

**Apply:** Using GroupKFold(3) on data.records, compute result={'folds':3,'leak_count':0,'validation_n':total field count across folds}; do not alter records.

**Prove:** Return result={'cv_subjects':number unique animal IDs,'heldout_once':bool every subject appears exactly once as validation,'n_predictions':total validation rows} on sample.records.

## Delayed review

For sample records and eval_y/prob, return result={'biological_n':unique animal count,'brier':mean squared probability error,'fields':number recorded image fields}.

No worked Prove solution or Prove hints are shown to the learner. Statistical software cannot replace independent experimental design.

## Further reading

- https://scikit-learn.org/stable/modules/cross_validation.html
- https://scikit-learn.org/stable/user_guide.html
