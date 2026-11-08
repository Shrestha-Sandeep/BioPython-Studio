# L02 — Build interpretable ML baselines

Fit simple, transparent scikit-learn models on prepartitioned synthetic measurements and always compare them with a dummy predictor.

**Scientific boundary:** The train/test sets are separate synthetic inputs. This chapter tests coding mechanics, not independent biological model deployment; use group-safe provenance for real microscopy or omics data.

**Prerequisites:** Python foundations plus NumPy, Pandas and biological-replicate reasoning from microscopy I07/I11/I12. Datasets are synthetic, but scikit-learn executes for real.

## Mini-goals

### L02-G01 — Fit a dummy classifier before a real model (143)

DummyClassifier(strategy='most_frequent') provides the majority-class baseline based on training labels only.

Reporting accuracy without class counts can conceal useless predictions on an imbalanced dataset.

**Predict, then run:**

```python
from sklearn.dummy import DummyClassifier
m=DummyClassifier(strategy='most_frequent').fit([[0],[1],[2]],[0,0,1])
print(m.predict([[10],[20]]).tolist())
```

**Apply:** Fit sklearn DummyClassifier(most_frequent) on data.train_X/train_y and predict data.test_X. Return result as a list of predicted integer classes.

**Independent Prove:** Use a training-only DummyClassifier and return result={'majority':integer class,'accuracy':fraction matching sample.test_y} on the held-out sample.test_X.

**Design question:** Which clinical or scientific decisions make majority-class prediction particularly dangerous?

### L02-G02 — Fit and interpret a linear regression baseline (144)

LinearRegression fits a least-squares line; report the coefficient and predictions on new X, not a causal effect.

A fitted slope does not imply that the feature causes the biological response.

**Predict, then run:**

```python
from sklearn.linear_model import LinearRegression
m=LinearRegression().fit([[0],[1],[2]],[1,3,5]);print(round(float(m.coef_[0]),3))
```

**Apply:** Fit LinearRegression on data.reg_X/reg_y and return result={'slope':float,'predictions':list of floats} for data.reg_test.

**Independent Prove:** Fit LinearRegression only on sample.reg_X and y; return result as predictions rounded to 6 decimals for sample.reg_test.

**Design question:** What happens if a fitted model is extrapolated beyond the observed range?

### L02-G03 — Fit a regularized logistic classifier (145)

LogisticRegression(C=1,random_state=0,max_iter=300) with StandardScaler is a transparent classification baseline.

A training probability is not an experimentally calibrated probability for an unseen biological preparation.

**Predict, then run:**

```python
from sklearn.linear_model import LogisticRegression
m=LogisticRegression().fit([[0],[1],[2],[3]],[0,0,1,1]);print(m.predict([[2.5]]).tolist())
```

**Apply:** Fit Pipeline(StandardScaler, LogisticRegression(C=1,max_iter=300,random_state=0)) on data.train_X/y. Return result as list of positive-class probabilities for data.test_X.

**Independent Prove:** Fit the same train-only regularized pipeline; return result={'predictions':integer classes on sample.test_X,'n_features':feature count}.

**Design question:** What additional data and methods are needed to claim the output probabilities are well calibrated?

### L02-G04 — Compare a shallow decision tree on held-out data (146)

DecisionTreeClassifier(max_depth=2,random_state=0) limits depth; compare test performance against a DummyClassifier.

Choosing the best tree depth using test labels turns that test into training.

**Predict, then run:**

```python
from sklearn.tree import DecisionTreeClassifier
m=DecisionTreeClassifier(max_depth=1,random_state=0).fit([[0],[1],[2],[3]],[0,0,1,1]);print(m.get_depth())
```

**Apply:** Fit DecisionTreeClassifier(max_depth=2,random_state=0) on data.train_X/y. Return result={'depth':int,'test_accuracy':float} using data.test_X/y.

**Independent Prove:** Compare depth-2 tree and DummyClassifier on sample.test_X/y; return result={'tree_accuracy':float,'dummy_accuracy':float} without tuning on test.

**Design question:** Why is a tree decision boundary not a mechanistic explanation of fluorescence biology?

## Capstone — Compare baseline classifiers on a reserved holdout

One pipeline should report a baseline and a real model using an untouched test set.

**Apply:** Train DummyClassifier and StandardScaler+LogisticRegression on data.train_X/y only; return result={'dummy':heldout accuracy,'logistic':heldout accuracy,'n_test':number}.

**Prove:** From sample report result={'dummy_preds':list ints,'tree_preds':list ints,'test_labels':original sample.test_y list} using a fixed depth-2 tree and dummy classifier; fit no model on test.

## Delayed review

Fit majority-only DummyClassifier on sample.train_X/y and return result={'majority':int,'test_errors':number incorrect predictions on sample.test_X/y}.

No worked Prove solution or Prove hints are shown to the learner. Statistical software cannot replace independent experimental design.

## Further reading

- https://scikit-learn.org/stable/supervised_learning.html
- https://scikit-learn.org/stable/user_guide.html
