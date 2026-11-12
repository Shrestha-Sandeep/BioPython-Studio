# A02 — Candidate segmentation and sensitivity

**Status:** Optional advanced-learning pilot; browser exercises have computational checks but no demonstrated human learner mastery.

## Objective

Build traceable threshold/morphology/watershed pipelines; quantify candidate regions and parameter sensitivity, not biological truth.

## Learning sequence

### 1. Background subtraction and binary mask (A02-G01)

Unsigned numeric overflow or unreviewed background subtraction can corrupt candidate masks.

**Task:** Convert data.image to float, subtract data.background, clip at zero, threshold > data.threshold and return result={'positive_pixels':int,'corrected_max':float}.

**Independent transfer:** Convert data.image to float, subtract data.background, clip at zero, threshold > data.threshold and return result={'positive_pixels':int,'corrected_max':float}.

**Scientific boundary:** Practice arrays and sample masks are synthetic. Real segmentation needs independent annotations and the same prespecified method on held-out images.

### 2. Choose the correct foreground polarity (A02-G02)

Bright nuclei and dark nuclei require opposite mask polarity.

**Task:** Inspect border median versus data.max_possible (uint8=255 or uint16=65535). Choose 'dark' if border median >=55% of maximum, else 'bright'; count pixels above/below data.threshold as result={'polarity':str,'pixels':int}.

**Independent transfer:** Inspect border median versus data.max_possible (uint8=255 or uint16=65535). Choose 'dark' if border median >=55% of maximum, else 'bright'; count pixels above/below data.threshold as result={'polarity':str,'pixels':int}.

**Scientific boundary:** Practice arrays and sample masks are synthetic. Real segmentation needs independent annotations and the same prespecified method on held-out images.

### 3. Filter small objects without silently merging (A02-G03)

The size filter can remove noise or erase meaningful small objects.

**Task:** Treat data.mask as binary 2-D; label 4-connected objects and keep only components with pixel area >= data.min_area; return result={'kept_objects':int,'kept_pixels':int}.

**Independent transfer:** Treat data.mask as binary 2-D; label 4-connected objects and keep only components with pixel area >= data.min_area; return result={'kept_objects':int,'kept_pixels':int}.

**Scientific boundary:** Practice arrays and sample masks are synthetic. Real segmentation needs independent annotations and the same prespecified method on held-out images.

### 4. Separate connected candidates using watershed seeds (A02-G04)

Touching nuclei may be undercounted, while inappropriate seeds cause oversegmentation.

**Task:** From data.mask and data.seeds (YX coordinates), create watershed markers on a distance transform. Return result={'objects':int,'total_px':int} with all mask pixels assigned.

**Independent transfer:** From data.mask and data.seeds (YX coordinates), create watershed markers on a distance transform. Return result={'objects':int,'total_px':int} with all mask pixels assigned.

**Scientific boundary:** Practice arrays and sample masks are synthetic. Real segmentation needs independent annotations and the same prespecified method on held-out images.

### 5. Measure parameter sensitivity, not accuracy (A02-G05)

Parameter instability indicates sensitivity but does not measure segmentation validity.

**Task:** Compare data.baseline and data.variant binary masks; return result={'foreground_iou':float,'changed_fraction':float,'verified_accuracy':False}.

**Independent transfer:** Compare data.baseline and data.variant binary masks; return result={'foreground_iou':float,'changed_fraction':float,'verified_accuracy':False}.

**Scientific boundary:** Practice arrays and sample masks are synthetic. Real segmentation needs independent annotations and the same prespecified method on held-out images.

### 6. Generate traceable candidate objects (A02-CAPSTONE)

An end-to-end classical mask must preserve parameters, error cases and candidate status.

**Task:** Threshold 2-D data.image using data.threshold and data.foreground ('bright'/'dark'), label 4-connected regions, filter area >= data.min_area; result={'candidate_count':int,'areas_px':sorted list,'validated':False}.

**Independent transfer:** Threshold 2-D data.image using data.threshold and data.foreground ('bright'/'dark'), label 4-connected regions, filter area >= data.min_area; result={'candidate_count':int,'areas_px':sorted list,'validated':False}.

**Scientific boundary:** Practice arrays and sample masks are synthetic. Real segmentation needs independent annotations and the same prespecified method on held-out images.

### 7. Return later: independent segmentation transfer (A02-REVIEW)

Recall and transfer must be evaluated later without looking up the solution.

**Task:** Return candidate count and foreground-pixel count from data.image threshold/polarity without copying the capstone; result={'candidate_count':int,'foreground_pixels':int,'validated':False}.

**Independent transfer:** Return candidate count and foreground-pixel count from data.image threshold/polarity without copying the capstone; result={'candidate_count':int,'foreground_pixels':int,'validated':False}.

**Scientific boundary:** Practice arrays and sample masks are synthetic. Real segmentation needs independent annotations and the same prespecified method on held-out images.

## Independent real-data project

Use the executable [project guide](../../projects/advanced/a02/README.md) and the original-source data, not the synthetic practice arrays.

```sh
python -m projects.advanced.a02.run_tiff --input /path/to/source.ome.tif --config projects/advanced/a02/segmentation-config.json --channel 0 --out outputs/a02/candidates
```

### Evidence required to pass

Inspect original source and candidate labels, compare a three-variant parameter sweep, report false splits and false merges.

### Limits and interpretation

The real heterogeneous BBBC038 official test gave only 0.385 micro object F1 for fixed Otsu/watershed; do not call candidate labels validated cells.

Your output requires independent validation against genuine annotations, proper biological-group definitions and a reproducible environment. The app's automatic checks are **public practice checks**, not a secure assessment or 9.5/10 teaching-quality certification.

## Progress and delayed review

Learn: predict and modify; Apply: solve changing inputs with hints; Prove: solve independent cases with hints hidden; capstone: export runnable code; review: return on a later day and record the actual elapsed interval and assistance used. Complete real-data work locally.

## Navigation

Open the optional path at `/?lab=advanced`. The ordinary 26-chapter course opens at `/` and retains its original browser progress. This chapter's advanced draft and progress have a separate storage key.
