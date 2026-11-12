# A03 — Annotation matching and scientific validation

**Status:** Optional advanced-learning pilot; browser exercises have computational checks but no demonstrated human learner mastery.

## Objective

Separate pixel overlap from one-to-one object detection, document annotation conventions, prevent group leakage and count biological replicates.

## Learning sequence

### 1. Pixel overlap is not object accuracy (A03-G01)

Two touching nuclei merged into one region can still have perfect foreground pixel IoU.

**Task:** For data.truth and data.pred arrays of instance IDs (0=background), return result={'pixel_iou':float,'truth_objects':int,'pred_objects':int}.

**Independent transfer:** For data.truth and data.pred arrays of instance IDs (0=background), return result={'pixel_iou':float,'truth_objects':int,'pred_objects':int}.

**Scientific boundary:** Reference labels and split groups in browser exercises are synthetic. Broad annotations are external public references, not infallible and not independent human learner validation.

### 2. Match candidates one-to-one at IoU threshold (A03-G02)

A prediction cannot correctly match two reference nuclei simultaneously.

**Task:** Using data.iou (reference rows x prediction columns) and data.cutoff, choose one-to-one IoU-qualified matches maximizing the number of matches. Return result={'tp':int,'fp':int,'fn':int}.

**Independent transfer:** Using data.iou (reference rows x prediction columns) and data.cutoff, choose one-to-one IoU-qualified matches maximizing the number of matches. Return result={'tp':int,'fp':int,'fn':int}.

**Scientific boundary:** Reference labels and split groups in browser exercises are synthetic. Broad annotations are external public references, not infallible and not independent human learner validation.

### 3. Prevent group leakage before evaluation (A03-G03)

Images from the same experimental group can leak across training and evaluation.

**Task:** For data.records (group_id and split), return result={'safe':boolean,'overlap':sorted group IDs that occur in both calibration and holdout}.

**Independent transfer:** For data.records (group_id and split), return result={'safe':boolean,'overlap':sorted group IDs that occur in both calibration and holdout}.

**Scientific boundary:** Reference labels and split groups in browser exercises are synthetic. Broad annotations are external public references, not infallible and not independent human learner validation.

### 4. Precision, recall, F1 and biological units (A03-G04)

Thousands of measured nuclei do not imply thousands of independent animals.

**Task:** From data.tp/fp/fn and data.animal_ids, return result={'precision':float,'recall':float,'f1':float,'biological_n':int}; avoid division by zero.

**Independent transfer:** From data.tp/fp/fn and data.animal_ids, return result={'precision':float,'recall':float,'f1':float,'biological_n':int}; avoid division by zero.

**Scientific boundary:** Reference labels and split groups in browser exercises are synthetic. Broad annotations are external public references, not infallible and not independent human learner validation.

### 5. Respect what annotation types can establish (A03-G05)

Counts alone cannot support pixel IoU or true-object matching accuracy.

**Task:** For data.annotation_type ('counts' or 'pixel_masks') and numeric data.truth_count,data.pred_count, return result={'pixel_iou_allowed':boolean,'count_abs_error':int,'claim':string}. Use claim 'counts_only' or 'pixel_reference_available'.

**Independent transfer:** For data.annotation_type ('counts' or 'pixel_masks') and numeric data.truth_count,data.pred_count, return result={'pixel_iou_allowed':boolean,'count_abs_error':int,'claim':string}. Use claim 'counts_only' or 'pixel_reference_available'.

**Scientific boundary:** Reference labels and split groups in browser exercises are synthetic. Broad annotations are external public references, not infallible and not independent human learner validation.

### 6. Build an auditable one-to-one object evaluation (A03-CAPSTONE)

An annotated benchmark must separate pixel overlap, instance matching and scientific generalization.

**Task:** Using data.truth/pred integer instance maps and data.cutoff, compute one-to-one object IoU matches. Return result={'tp':int,'fp':int,'fn':int,'f1':float,'foreground_pixel_iou':float,'biological_validated':False}.

**Independent transfer:** Using data.truth/pred integer instance maps and data.cutoff, compute one-to-one object IoU matches. Return result={'tp':int,'fp':int,'fn':int,'f1':float,'foreground_pixel_iou':float,'biological_validated':False}.

**Scientific boundary:** Reference labels and split groups in browser exercises are synthetic. Broad annotations are external public references, not infallible and not independent human learner validation.

### 7. Return later: biological-unit-aware evaluation (A03-REVIEW)

Return on a different day to demonstrate recall rather than copying a solution.

**Task:** Compute result={'object_f1':float,'biological_n':int,'valid_holdout':boolean} from data.tp/fp/fn, data.animals and data.records (group_id/split).

**Independent transfer:** Compute result={'object_f1':float,'biological_n':int,'valid_holdout':boolean} from data.tp/fp/fn, data.animals and data.records (group_id/split).

**Scientific boundary:** Reference labels and split groups in browser exercises are synthetic. Broad annotations are external public references, not infallible and not independent human learner validation.

## Independent real-data project

Use the executable [project guide](../../projects/advanced/a03/README.md) and the original-source data, not the synthetic practice arrays.

```sh
python -m projects.advanced.a03.benchmark --help
```

### Evidence required to pass

Run a frozen calibration/held-out original-data benchmark, inspect worst cases, report TP/FP/FN, object F1, counts and study-group limitations.

### Limits and interpretation

The real BBBC039 official test gave 0.841 micro object F1 on its released 16-bit dataset; some images overlap BBBC038 and it does not prove exopher accuracy.

Your output requires independent validation against genuine annotations, proper biological-group definitions and a reproducible environment. The app's automatic checks are **public practice checks**, not a secure assessment or 9.5/10 teaching-quality certification.

## Progress and delayed review

Learn: predict and modify; Apply: solve changing inputs with hints; Prove: solve independent cases with hints hidden; capstone: export runnable code; review: return on a later day and record the actual elapsed interval and assistance used. Complete real-data work locally.

## Navigation

Open the optional path at `/?lab=advanced`. The ordinary 26-chapter course opens at `/` and retains its original browser progress. This chapter's advanced draft and progress have a separate storage key.
