# I13 — Build the complete image-analysis pipeline

**Status:** End-to-end technical learner-pilot implementation. Not a reproduction of calibrated Witz nuclear versus edge findings.

Primary Witz source: https://github.com/guiwitz/PyImageCourse_beginner/blob/master/07-Pipeline.ipynb

Credited Witz/HPA teaching image: [source/licensing](../../assets/witz/CREDITS.md). The supplied PNG is a published rendered figure, **not** a raw instrument file. No scientific segmentation validation is claimed.

## I13-G01 — Debug an unfamiliar scientific image script

Fix numeric overflow and axis mistakes rather than hiding wrong output.

- uint8 arithmetic can wrap or clip; explicitly cast to float before subtraction.
- Rows are y and columns are x; swapping them silently shifts the ROI.
- Technical outputs are inspected using changed source records and parameters; scientific interpretations remain conditional on raw images, acquisition metadata and manual validation.

**Predict:** Predict the numerical result and state why it does not establish an experimental finding.

```python
import numpy as np
print((np.array([250],np.uint8)+np.array([20],np.uint8)).tolist())
```

**Apply:** Convert data.image to float before background subtraction; return nonnegative corrected NumPy array result.

**Prove:** Correctly crop sample.image using sample.roi=[y0,y1,x0,x1]; return result with crop shape and mean (None if empty).

**Debug/transfer:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Scientific limitation:** The bundled Witz/HPA PNG is rendered notebook artwork, not raw calibrated biological microscopy data; no validated nuclear or nuclear-edge localization measurement can be claimed.

## I13-G02 — Clean unfamiliar specimen metadata

A many-to-one join cannot be trusted with conflicting source identifiers.

- Audit duplicate metadata IDs before using them as unique keys.
- Do not silently keep a random duplicate that changes animal or condition assignments.
- Technical outputs are inspected using changed source records and parameters; scientific interpretations remain conditional on raw images, acquisition metadata and manual validation.

**Predict:** Predict the numerical result and state why it does not establish an experimental finding.

```python
from collections import Counter
print(Counter(['img1','img1','img2']))
```

**Apply:** Audit data.metadata by image_id; return result={'unique':bool,'duplicates':sorted list of repeated IDs}.

**Prove:** On sample.metadata and sample.measurements, reject duplicate source IDs; else return joined rows and unmatched measurement IDs.

**Debug/transfer:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Scientific limitation:** The bundled Witz/HPA PNG is rendered notebook artwork, not raw calibrated biological microscopy data; no validated nuclear or nuclear-edge localization measurement can be claimed.

## I13-G03 — Create an interpretable figure from new observations

Avoid hiding biological replicate identity in one summary bar.

- Plot individual experimental-unit values and use explicit axis labels.
- A synthetic figure cannot establish a biological effect without genuine source records and design controls.
- Technical outputs are inspected using changed source records and parameters; scientific interpretations remain conditional on raw images, acquisition metadata and manual validation.

**Predict:** Predict the numerical result and state why it does not establish an experimental finding.

```python
import matplotlib.pyplot as plt
fig,ax=plt.subplots();ax.scatter([0,1],[3,5]);ax.set(xlabel='Group',ylabel='Value');print(len(ax.collections))
```

**Apply:** Plot each data.records value by condition with Matplotlib scatter; set axis labels and return result={'n':record_count}.

**Prove:** Make a new two-condition replicate-level plot of sample.records using one scatter series per condition; return count and method='replicate_points'.

**Debug/transfer:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Scientific limitation:** The bundled Witz/HPA PNG is rendered notebook artwork, not raw calibrated biological microscopy data; no validated nuclear or nuclear-edge localization measurement can be claimed.

## I13-G04 — Audit image provenance, thresholds and calibration

Separate computational reproducibility from source-image validity.

- A declared image source and scale are essential before reporting physical area.
- Rendered RGB, synthetic masks and unvalidated objects cannot support nuclear localization claims.
- Technical outputs are inspected using changed source records and parameters; scientific interpretations remain conditional on raw images, acquisition metadata and manual validation.

**Predict:** Predict the numerical result and state why it does not establish an experimental finding.

```python
print({'raw_calibrated':False,'segmentation_validated':False})
```

**Apply:** Inspect data.source and scale_um; return result with source, calibrated=False, area_unit='pixel²' if scale absent else 'synthetic µm²'.

**Prove:** Quantify mask-count sensitivity on sample.image at cutoff−10 and cutoff+10 and report scale_note as unverified; return dict result.

**Debug/transfer:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Scientific limitation:** The bundled Witz/HPA PNG is rendered notebook artwork, not raw calibrated biological microscopy data; no validated nuclear or nuclear-edge localization measurement can be claimed.

## I13-G05 — Run a real-image ROI measurement project

Measure genuine credited image bytes while explicitly declining raw biological calibration.

- Read the Witz/HPA published RGB PNG through Pillow and convert its pixel component to NumPy.
- The image is a rendered notebook figure; candidate components cannot be identified as nuclei or quantified as true raw fluorescence.
- Technical outputs are inspected using changed source records and parameters; scientific interpretations remain conditional on raw images, acquisition metadata and manual validation.

**Predict:** Predict the numerical result and state why it does not establish an experimental finding.

```python
import numpy as np
print(np.array([[0,100],[255,120]],dtype=np.uint8).shape)
```

**Apply:** Load real image_path, take 48×48 pixels at y0,x0 in component; threshold strictly, label 4-connected regions, retain area>=min_size; return result with count, areas and calibrated=False.

**Prove:** Load a different 48×48 ROI from image_path using top,left,band; return fraction above cutoff and number of >=min_area components, raw=False.

**Debug/transfer:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Scientific limitation:** The bundled Witz/HPA PNG is rendered notebook artwork, not raw calibrated biological microscopy data; no validated nuclear or nuclear-edge localization measurement can be claimed.

## I13-CAPSTONE — Integrate a real-image, source-aware analysis and visual overlay

Make a complete reproducible source-aware numerical analysis, real figure and explicitly unverified candidate measurements.

- Read the attributed published figure from disk and preserve its pixels.
- Produce actual segmentation, region tables and Matplotlib overlay with transparent parameters.
- This is not validated nuclei detection or calibrated HPA fluorescence and does not reproduce an external raw dataset.

**Predict:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
print(np.array([[0,1],[1,0]],bool).sum())
```

**Apply:** Load image_path real RGB, crop 48×48 source component; segment by threshold, label 4-connected objects, filter by min_size, report candidate area, count, raw_calibrated=False and overlay using real Matplotlib.

**Prove:** Independently process the credited image from a new top/left/channel ROI with cutoff: report two candidate counts for cutoff and cutoff+15, n_pixels, source and verified=False.

**Debug/transfer:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific limitation:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I13-REVIEW — Transfer the full source-image threshold audit to a new ROI

Reconstruct the method after a delay on a fresh input.

- Reproduce the key numerical decision from memory.
- Check edge behavior and compare to a second input.
- Do not equate remembered code with biological validation.

**Predict:** Predict the printed numerical result and one limitation before execution.

**Apply:** Reflect on which source, calibration, annotation and replicates would be required for genuine measurement.

**Prove:** Without a worked solution, load image_path; on a 48×48 crop compute foreground fractions at cutoff−15 and cutoff+15. Return two fractions and verified=False.

**Debug/transfer:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific limitation:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## Real-data upgrade path

To reproduce Witz's biological nuclear-versus-edge localization conclusion rather than this rendered-RGB exercise, provide the raw acquisition images, metadata/axes, channel calibration and documented ground-truth annotations. Define biological replicates and preregister QC/exclusions before biological inference.

## Release gates

- All changed-input source-image reference tests in real CPython and Pyodide.
- Successful standalone source-relative capstone export and genuine Matplotlib rendering.
- Learner trial, saved progress and mobile QA.
