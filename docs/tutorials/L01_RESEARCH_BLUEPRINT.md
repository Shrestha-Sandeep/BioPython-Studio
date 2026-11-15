# L01 — research-led group-safe microscopy machine-learning tutorial blueprint

**Date:** 2026-11-14  
**Branch:** `feature/ml-tutorial-cycle-l01`, stacked above N04 PR #53.  
**Canonical:** `content/chapters/L01_COMPLETE.md` — L01-G01–G04 and CAPSTONE.  
**Method:** `docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md` (research → blueprint → implementation → exact-output CPython tests → real browser → revision).  
**Scientific provenance:** All animals, microscopy fields, features and labels are **synthetic**, not experimental specimens; machine-learning syntax is demonstrated with genuine scikit-learn.

## External research and conclusions

1. Official scikit-learn [Common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html): preprocessing fitted on the entire dataset before a train/test split leaks information; split first and `fit` only on training data, `transform` the test data later. A `Pipeline` protects against accidental refitting inside CV.
2. Official [grouped cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html): related records from a subject must share the same validation group; ordinary random field splitting violates independence. `GroupShuffleSplit(test_size)` refers to **groups**, not images, and a fixed `random_state` gives reproducibility but does not independently protect against group leakage.
3. Official [GroupShuffleSplit](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupShuffleSplit.html): train/test group partitions are disjoint within each split, but holdout sets from *different* random splits need not be disjoint. Use one split explicitly with source group IDs.
4. Official [SimpleImputer](https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html): median of observed **training** values is learned through `fit`, with missing values transformed using that statistic.
5. Existing BioPython Studio [I11 microscopy biological-replicate tutorial](../tutorials/I11_RESEARCH_BLUEPRINT.md): fields/cells are not biological replicates; ML predictions should be reported with subject n and metadata, not only the count of image fields.

## Motivating scientific task

An imaging project has 4 invented animals, each yielding 2 fields. Fields within an animal may be highly correlated. Determine the target label per animal, detect field-level split leakage, assign entire animals to a reserved holdout with `GroupShuffleSplit`, and learn missing-value median and scaling *only from training animals*. Return group IDs and provenance. No model accuracy claim is made from these fixtures.

## Exact 17-scene storyboard

| Scene | Goal | Scientific point | Visual |
|---:|---|---|---|
| 1 | G01 | Show destination: independent animal-level prediction | field rows → animals → held-out animals |
| 2 | G01 | 4 image fields may mean only 2 animals | field/animal table |
| 3 | G01 | One label per animal and subject class counts | grouped labels |
| 4 | G01 | Inconsistent labels on one animal must be flagged | source QC error |
| 5 | G02 | Intersection of train/test animal sets reveals leakage | shared B highlighted |
| 6 | G02 | Different image fields from same animal are still dependent | field grid by animal |
| 7 | G02 | Disjoint group IDs, preserve batch/sample provenance | explicit groups |
| 8 | G03 | GroupShuffleSplit keeps all fields from each animal together | complete grouped split |
| 9 | G03 | Seed alone does not make a field-level split safe | unsafe/safe comparison |
| 10 | G03 | `test_size=0.5` targets *groups*, not rows | 4 animals / 2 held out |
| 11 | G04 | Fit median imputer on training only | train and test columns |
| 12 | G04 | **Withheld prediction:** train [1,3,NaN], test [100] | median withheld |
| 13 | G04 | Reveal train-only median = 2 (not 3) | explicit observed source values |
| 14 | G04 | Incorrect global median shifts to 3, leaks test | before/after source |
| 15 | G04 | Pipeline Imputer→StandardScaler fit only on train | transformations |
| 16 | CAPSTONE | Real group split + train-only imputation, source unchanged | end-to-end audit |
| 17 | CAPSTONE | Independent new-animal transfer with missing values | no solution |

**Checkpoint:** At scene 12, output must be empty; scene 13 reveals training median `2.0`, even though the held-out test row is 100. No Apply/Prove answers or real protected datasets.

## Design / fidelity gates

- Keep existing frozen UI-first-2, reuse optional voice/speed-controlled Learn-only dialog and stored learning-engine contracts. Introduce `window.BioPythonMLTutorials` and a separate module `src/tutorials/ml-illustrations.js` for 17 original local SVG explanations. No extra panels, brand copy or autoplay.
- Exactly four goals + CAPSTONE, 17 real explainable scenes, one withheld prediction, independent new-input transfer. State source status and why fields are not replicates repeatedly where scientifically necessary.
- Real scikit-learn CPython examples: `GroupShuffleSplit(n_splits=1,test_size=0.5,random_state=0)`, `SimpleImputer(strategy="median")`, `Pipeline`, `StandardScaler`. Never train on test data, infer biology from toy labels, or suggest seed alone ensures independence.
- 100% displayed Python outputs confirmed by clean CPython with `numpy`, `scikit-learn`; changed-input guards (inconsistent subject labels, overlap, varied fields per animal, all-NaN features, train/test imputation perturbation).
- 390px/1280px Playwright: view Learn chapter tutorial, static SVG fallback, prediction/reveal, speed and voice, closing without editor/localStorage mutation; hidden for Apply/Prove and delayed review.
- CI runs all existing N01–N04 and new L01 contracts; log corrections and rerun until green. Do not merge/deploy to production without learner review.

**Next after green L01:** L02 (dummy, regression, regularized logistic, depth-limited decision tree), starting with a separate blueprint.
