# L03 — research-first group-safe evaluation and probability-diagnostics tutorial blueprint

**Date:** 2026-11-14  
**Branch:** `feature/ml-tutorial-cycle-l03` stacked above L02 PR #55.  
**Canonical:** `content/chapters/L03_COMPLETE.md`, L03-G01–G04 + CAPSTONE.  
**Method:** `docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md`.  
**Provenance:** All animal IDs, fluorescence-like features, class labels and confidence scores below are **synthetic** and are not evidence of a validated biological model.

## Research and science-informed constraints

1. [GroupKFold documentation](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html): each source group appears exactly once as a validation group across all folds; group IDs must not overlap between train and test *within each fold*. Six animals with two fields each are still six biological units, not twelve.
2. [scikit-learn grouped CV guidance](https://scikit-learn.org/stable/modules/cross_validation.html): KFold on fields ignores within-animal dependence; choosing group-aware CV is essential. But group-disjoint folds alone cannot correct batch/litter dependence or tiny biological n.
3. [Balanced accuracy](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.balanced_accuracy_score.html): arithmetic mean of class-specific recalls. An always-negative classifier with three negatives and one positive has 75% accuracy but 0% positive recall and balanced accuracy 0.5.
4. [Brier score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.brier_score_loss.html): a proper scoring rule for probabilistic predictions; binary scores use the mean squared difference of positive-class predicted probabilities from outcomes. Specify positive label 1 and round displayed numerics.
5. [Probability calibration guide](https://scikit-learn.org/stable/modules/calibration): **Brier loss does not isolate calibration**; it also reflects discrimination and uncertainty. A lower Brier alone cannot prove calibration; reliability bins based on 4–8 toy records are too unstable for biological inference.
6. [L01 and L02 source contracts](./L01_RESEARCH_BLUEPRINT.md) and [L02 blueprint](./L02_RESEARCH_BLUEPRINT.md): continue group independence, training-only fitted preprocessing, dummy baseline and fixed hyperparameters. No test-label tuning.

## Core scientific arc

The final synthetic microscopy-ML tutorial evaluates a model whose input fields are paired within six invented animals. It partitions whole animals into three validation folds, reports class-wise errors and the effect of class imbalance, computes probabilistic Brier error and compares a dummy against a regularized logistic classifier without leaking group labels or tuning on the final test observations. It ends with an auditable handoff, **not** a claim of genuine phenotype prediction.

## Planned 20 scenes

| Scene | Goal | Concept / check | Original visual |
|---:|---|---|---|
| 1 | G01 | Destination: honest animal-level validation and performance caveats | groups → folds → metrics → audit |
| 2 | G01 | Six animals, twelve fields: biological n=6 | field/animal groups |
| 3 | G01 | GroupKFold3 gives three folds and group independence | whole-animal folds |
| 4 | G01 | Every subject held out once, not once per field | validation subject matrix |
| 5 | G01 | Unaware KFold can split one animal's fields | unsafe versus safe split |
| 6 | G02 | 75% accuracy can still have zero positive recall | negative-only confusion |
| 7 | G02 | TP/FP/FN/TN are more diagnostic than one scalar | confusion square |
| 8 | G02 | Precision and recall describe different errors | metric fractions |
| 9 | G02 | Undefined positive metric requires explicit zero_division policy | no-positive example |
| 10 | G03 | Brier score is mean squared probability error | outcome vs probability |
| 11 | G03 | Class thresholding throws away probabilistic information | probabilities vs labels |
| 12 | G03 | **Withheld prediction:** Brier for truth [0,1], probabilities [0.1,0.6] | hide numeric |
| 13 | G03 | Reveal Brier = 0.085 | squared-error table |
| 14 | G03 | Equal overall mean confidence and prevalence ≠ calibration | bin mismatch |
| 15 | G03 | Tiny reliability bins are unstable | sparse calibration bins |
| 16 | G04 | Actual GroupKFold with leakage checks and training-only model | cross-validation folds |
| 17 | G04 | Dummy vs standardized regularized logistic balanced accuracy | fold score bars |
| 18 | G04 | Six animals cannot support reliable generalization estimates | n vs fields |
| 19 | CAPSTONE | Real three-fold group-disjoint baseline/model report | source and metrics handoff |
| 20 | CAPSTONE | Independent transfer on new groups, imbalance and probabilities | unanswered audit checklist |

**Prediction checkpoint:** scene 12 withheld, scene 13 reveals `(0.1² + 0.4²)/2 = 0.085`. Keep exact true/score lengths and positive label 1. No hidden Prove values or solved code.

## Implementation and falsifiability tests

- `src/tutorials/l03-data.js`, 20 meaningful short narrated scenes covering G01–G04+CAPSTONE; 20 original vector diagram descriptors in existing `ml-illustrations.js`.
- Do not turn the app into a data science dashboard. Keep Learn-only optional viewer with current browser TTS controls and automatic code highlight, independent Apply/Prove, unchanged localStorage progress and UI-first-2.
- All printed values must execute in fresh CPython with scikit-learn (1.9.1), NumPy and Pandas, with warnings-as-errors; use explicit rounding for float outputs. **Do not fit any preprocessing or model on fold validation features or labels**.
- Changed-input tests: one group split across fields triggers guard, no positive truth leads zero_division=0, imbalanced labels vs balanced accuracy, probability length mismatch, Brier values, three validation appearances exactly once per group, no group overlap; ensure train folds have both classes or explicitly handle invalid class folds.
- Responsive 390/1280px Playwright: visuals, withheld/reveal, narration/voice controls, unchanged editor/storage, Apply/Prove/delayed review isolation and no horizontal overflow.
- Execute cumulative N01–N04 and L01–L03 tests; revise any failed step and document failure in iteration log. All PRs remain drafts, production untouched until learner review.

**Next action after L03 green:** comprehensive integrated review of stacked tutorials and a controlled merge/deployment plan, not another chapter invented outside the frozen curriculum.
