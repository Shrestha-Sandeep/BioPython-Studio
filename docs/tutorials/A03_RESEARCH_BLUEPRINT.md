# A03 — Research-led annotated-object validation and leakage-safe microscopy tutorial blueprint

**Date:** 2026-11-14
**Parent:** `feature/advanced-tutorial-cycle-a02` (draft PR #59, automated CPython + Chromium pass).
**Canonical:** `content/chapters/A03_COMPLETE.md` — A03-G01 to G05 plus CAPSTONE, A03-REVIEW stays unsolved.
**Local project:** `projects/advanced/a03/README.md`, `metrics.py`, `benchmark.py`, `annotator_agreement.py`.
**Production:** no main merge; stacked draft for human later review.

## 1. Scientific research and key traps

- [Broad Bioimage Benchmark Collection](https://bbbc.broadinstitute.org/bbbc): provides curated images and **different kinds of ground truth** (counts, masks/outlines, biologic labels). Not all datasets support pixel/instance accuracy, and released annotation is not infallible. This chapter will distinguish these claims.
- [BBBC image sets](https://bbbc.broadinstitute.org/image_sets): BBBC038 670 fields and BBBC039 200 fields serve related but not interchangeable nuclear datasets. A03's exact group overlap and potential BBBC038/039 image overlap must be declared before trusting generalization.
- [scikit-image segmentation metrics example](https://scikit-image.org/docs/stable/auto_examples/segmentation/plot_metrics.html): over/under-segmentation needs reference annotations; pixel overlap and object error count respond differently to merges/splits.
- [SciPy linear_sum_assignment](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.linear_sum_assignment.html): assignment finds one-to-one optimal matches, but **maximizing raw total IoU is not always equivalent to maximizing the number of threshold-qualified matches**. Use a cardinality-first cost with explicit cutoff and tie-break score. Don't incorrectly equate a greedy highest-IoU pair with optimal object F1.
- [Segment Anything for Microscopy](https://www.nature.com/articles/s41592-024-02580-4): instance matches at IoU thresholds count TP, FP, FN; a single scalar from one threshold is conditional on reference quality and object matching policy.
- Existing `A03_COMPLETE.md`: specifically asks max count of one-to-one IoU-qualified matches, group leakage check, precision/recall/F1 and independent biological n, annotation types, and auditable capstone.
- Related microscopy evaluation: image fields cannot be promoted into animal biological replicates. Separate per-object metric from independent-image, batch and animal-level generalization; do not tune on locked holdout.

## 2. Driving scientific question

**Why did a threshold mask that looked good in A02 fail on a new experiment?** Use invented reference *instance* labels versus a candidate mask that merges objects. One example has perfect binary foreground IoU but two true objects versus only one predicted object — the difference between a pixel-level mask and an object-level claim is visible immediately. Then show proper one-to-one matching, refusal to evaluate without correct annotation types, group-disjoint holdout, and honest units.

`Reference mask + prediction → per-instance IoU matrix → one-to-one threshold-qualified assignment → TP/FP/FN → F1 + biological n → failure gallery`.

All annotation arrays are synthetic programming fixtures; real annotations, experimental sampling and label definitions need human validation. A03's historically reported benchmark metrics from the repo apply only to their listed source/conditions.

## 3. The 17 narrated scenes and original diagram storyboard

| # | Goal | Core principle | Scientific diagram |
|---:|---|---|---|
| 1 | G01 | Destination: annotated-object evaluation and audit | reference vs model → overlap → errors |
| 2 | G01 | Perfect foreground overlap but merged true instances | true 2 / predicted 1 |
| 3 | G01 | Pixel IoU formula and false impression of accuracy | binary intersection/union |
| 4 | G01 | Source class and instance IDs must be explicit | original label map |
| 5 | G02 | Per-reference/per-prediction IoU matrix | matrix of candidate qualified matches |
| 6 | G02 | One prediction cannot match two references | one-to-one grid |
| 7 | G02 | Greedy highest-IoU can lose an extra TP | crossing assignment |
| 8 | G02 | Cardinality-first matching with Hungarian and cutoff | optimal pair lines |
| 9 | G02 | **Withheld prediction:** TP/FP/FN for changed IoU matrix | matrix with hidden counts |
| 10 | G02 | Reveal proper one-to-one TP/FP/FN | matched assignment |
| 11 | G03 | Same animal in calibration and holdout is leakage | overlapping IDs |
| 12 | G03 | Group-disjoint split; images and animals distinct | held-out animals |
| 13 | G04 | Precision/recall/F1 arithmetic with zero policy | metric fractions |
| 14 | G04 | Biological n counts independent animals, not objects | subject groups |
| 15 | G05 | Counts-only reference cannot establish pixel IoU | annotation capability matrix |
| 16 | CAPSTONE | Real Python end-to-end instance matching on merged candidate, with `validated=False` biological caveat | foreground vs instance report |
| 17 | CAPSTONE | Independent new annotated image/holdout evaluation with no code | unsolved transfer / error gallery |

A03-REVIEW and independent Prove remain without worked answer or hints. Prediction scene 9 must not show computed TP/FP/FN until scene 10.

## 4. Numeric truth and matching contract

- Pixel IoU is intersection of nonzero **foreground masks** divided by union. If truth has `[1,0,2]` and prediction `[1,0,1]`, binary foreground IoU is 1.0 yet truth has two objects and predicted one. Evaluating instances requires **one-to-one** matching.
- For an instance IoU matrix `[[.90,.80],[.81,.10]]` with cutoff `.5`, greedy `.9` first gets only one TP; optimal cross assignment `.8` and `.81` yields **two** TP. Use `linear_sum_assignment(np.where(iou>=cutoff,-1-iou/1000,0))` to maximize *qualified match cardinality first*, then small IoU tie-breaking. Do not claim raw Hungarian maximizing total IoU is always equivalent. Only score qualified matched pairs.
- For modified challenge `[[.60,.10],[.70,.80]]`, cutoff `.5`: two qualified diagonal matches `.6,.8`, TP=2, FP=0, FN=0; withheld until reveal.
- For `TP=2,FP=1,FN=3`, positive precision=2/3, recall=2/5, F1=4/8=0.5. Use explicit zero handling and cite policy for no reference/prediction objects.
- A locked group split is valid only when no animal/group appears in both training calibration and final holdout; image-level split is insufficient.
- Counts-only annotations support count absolute error, but not pixel overlap, instance matching or IoU/F1; do not claim that counts are equivalent to pixel-masks.
- Capstone: `truth=[[1,1,0,2,2]]`, `pred=[[1,1,1,1,1]]`; pixel foreground IoU 4/5=0.8, two truth objects vs one predicted, each object IoU2/5=0.4 below cutoff0.5, so TP=0, FP=1, FN=2, F1=0; `biological_validated=False`. This demonstrates false merge clearly.
- Separate annotation agreement, locked evaluation sources and independent animal/sample groups. A high F1 for any published nuclear dataset cannot certify exopher detection.

## 5. Development and QA gates

1. Add `src/tutorials/a03-data.js` with 17 scenes, mapped exactly to G01–G05, CAPSTONE; one withheld checkpoint and independent final transfer. Append original scientific SVGs `DATA03` to existing advanced artwork, with IoU matrix and source/predicted instance diagrams. Keep Learn-only existing viewer, 26-chapter default route and progress unchanged.
2. Native CPython with NumPy/SciPy executed on every displayed output: pixel vs object difference, cutoff and one-to-one assignment, no qualification, empty classes, class-aware metrics and group leakage. Changed inputs must demonstrate **greedy failure**, zero-denominator policy, counts-only refusal and source-sensitive annotation types.
3. Real Playwright Chromium at 390 and 1280 pixels; 17 scenes, matrix visualization, withheld/reveal, selectable voice/speed, Escape, preserved editor and localStorage, Apply/Prove/REVIEW hidden and default route unaffected.
4. Dedicated GitHub Actions workflow runs A00–A03 native and mobile-browser tests plus original P01 viewer. Gate must complete successfully before moving to A05. Fix any actual defects, record revisions in Markdown log.
5. No independent biological/generalization validity without real reference labels, sample/source provenance, reviewer-controlled holdout and actual image-level failure examples.

**Decision:** GO to draft if green and scientifically honest. Do not replace A03 with a nicer A02 mask overlay: **validation is the essential next step.**
