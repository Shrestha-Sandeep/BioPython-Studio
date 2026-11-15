# L02 — research-led interpretable ML baseline tutorial blueprint

**Date:** 2026-11-14  
**Branch:** `feature/ml-tutorial-cycle-l02` stacked on green L01 PR #54.  
**Canonical:** `content/chapters/L02_COMPLETE.md`: L02-G01–G04 and CAPSTONE.  
**Method:** `docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md`.  
**Data provenance:** All training/test values, subject labels, feature names and model scores are *synthetic teaching fixtures*, not actual microscopy phenotype data. The models themselves must execute in real scikit-learn.

## Research before writing code

1. scikit-learn [DummyClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html): `most_frequent` ignores X and predicts the most frequent class based only on `y_train`. A classifier is not useful merely because accuracy exceeds 50%; a majority baseline and per-class error matter.
2. scikit-learn [common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html): Pipeline preprocessing must be fitted only with training data, then applied to held-out data. It must not be tuned using the held-out labels.
3. scikit-learn [LinearRegression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html): least-squares slope/prediction are associations, not proof of biological causality; an extrapolation outside the training range is especially weak.
4. scikit-learn [LogisticRegression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html): regularization parameter `C` controls penalty strength (smaller C stronger regularization); `predict_proba` yields a model score, not an empirically calibrated risk across new imaging batches.
5. scikit-learn [DecisionTreeClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html): restrict `max_depth` explicitly to reduce complexity; test labels must not select `max_depth`. A tree boundary does not establish a biological mechanism.
6. Canonical L01 grouped split and train-only preprocessing: this tutorial receives **already partitioned** train/test synthetic data; it does not claim that arbitrarily supplied samples are group-safe.

## One motivating experiment

A researcher has already withheld different synthetic animals. Can a one-feature fluorescence-derived *toy number* predict an invented binary class more usefully than the training majority? Work from transparent baselines (dummy and linear regression) to a standardized regularized logistic classifier and a shallow decision tree, while never fitting to the reserved test labels and never claiming clinical or biological validation.

## 18-scene storyboard and original visuals

| Scene | Goal | Main distinction | Diagram |
|---:|---|---|---|
| 1 | G01 | Destination: defensible baseline vs real model | train → baseline/model → untouched test |
| 2 | G01 | DummyClassifier predicts majority without reading X | majority flow |
| 3 | G01 | Show class imbalance at *training-subject* level | class count boxes |
| 4 | G01 | Training majority accuracy ≠ held-out usefulness | train/test labels |
| 5 | G01 | **Withheld prediction:** dummy on held-out [0,1] | no output until reveal |
| 6 | G01 | Reveal dummy predictions [0,0], test accuracy 0.5 | confusion |
| 7 | G02 | LinearRegression slope=2, intercept=1 and prediction | straight line |
| 8 | G02 | Extrapolate beyond observed range: numerical ≠ validated | out-of-range warning |
| 9 | G02 | Evaluate residual on toy held-out measurement | expected vs predicted |
| 10 | G03 | StandardScaler + LogisticRegression trained on train | two-stage pipeline |
| 11 | G03 | Positive-class probability is a model output | score label |
| 12 | G03 | Smaller C stronger regularization and smaller coefficient | coefficient comparison |
| 13 | G03 | Model probability not necessarily calibrated | score vs actual frequency |
| 14 | G04 | Depth-limited tree follows a simple split | decision boundary |
| 15 | G04 | Compare tree vs dummy on *one* toy holdout | side-by-side test accuracy |
| 16 | G04 | Never choose tree depth using test performance | validation/test separation |
| 17 | CAPSTONE | Real train-only logistic vs dummy on held-out data | source-aware comparison |
| 18 | CAPSTONE | Unassisted transfer on group-held-out changed inputs | unsolved checklist |

Checkpoint at scene 5 is a *worked* toy dataset, not hidden Apply/Prove answers. Scene 6 reveals it. Final independent scene has no solution code or stdout.

## QA and release contract

- Exactly 18 scenes, G01–G04+CAPSTONE, one withheld prediction, 18 original SVG descriptors drawn locally, one meaningful image per scene, no decorative overload.
- Real CPython + scikit-learn 1.9.1 in CI; explicit StandardScaler→LogisticRegression(C=1,max_iter=300,random_state=0), DummyClassifier(most_frequent), LinearRegression, DecisionTreeClassifier(max_depth=2,random_state=0). Avoid floating exactness without documented rounding.
- Changed-input guards: majority ties/predictions, X-irrelevance of dummy, linear slope and extrapolation, C influence, tree depth and test-label swap without refitting.
- Mobile/desktop 390/1280px Chrome dialog visual, one prediction/reveal, voice/speed controls, no learner code/localStorage mutation and tutorial hidden during Apply, Prove and delayed review.
- Run cumulative sequence tutorials and L01 tests alongside L02, and record failures/corrections. No production merge/deployment until explicit learner review.
- After L02 genuinely green: L03 grouped cross-validation, imbalanced metrics and probability diagnostics, starting with its own research blueprint.
