# I09 — Measure nuclear features and protein signal

**Status:** Technical learner pilot, not independently validated mastery.

Source: https://github.com/guiwitz/PyImageCourse_beginner/blob/master/06-Regions.ipynb

Credited rendered image: [Witz/HPA provenance](../../assets/witz/CREDITS.md). Exercises are synthetic and do not establish real biological segmentation accuracy.

## I09-G01 — Measure region area and centroid

Separate geometry from channel intensity; every measured feature needs a label ID.

- regionprops returns area and row-column centroid for labeled regions.
- Without trustworthy scale, area is pixel count rather than µm².
- The input labels, tracking correspondences and intensity values are synthetic teaching examples; a real study requires independent annotation and acquisition controls.

**Predict:** Predict the printed value and identify the biological assumption that is not tested.

```python
from skimage.measure import regionprops
import numpy as np
x=np.array([[0,1,1],[0,0,0]])
print([(r.label,r.area,r.centroid) for r in regionprops(x)])
```

**Apply:** Measure each candidate in data.labels; return result as label-sorted list of dicts with label, area and centroid_yx.

**Prove:** Recompute source candidate areas in physical µm² using sample.pixel_um (synthetic scale); return ordered list result.

**Debug:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Limitations:** Synthetic labels, intensities and positions do not establish calibrated biological signal or validated objects.

## I09-G02 — Measure protein channel intensity per region

Image intensity must be sampled from the correct channel and exact label footprint.

- regionprops intensity_image supplies mean intensity for each labeled candidate.
- RGB display values are not calibrated fluorophore concentration.
- The input labels, tracking correspondences and intensity values are synthetic teaching examples; a real study requires independent annotation and acquisition controls.

**Predict:** Predict the printed value and identify the biological assumption that is not tested.

```python
from skimage.measure import regionprops
import numpy as np
print([r.mean_intensity for r in regionprops(np.array([[1,1],[0,0]]),intensity_image=np.array([[4,6],[1,1]]))])
```

**Apply:** With data.labels and data.signal, compute regionprops mean intensities; return list of floats result.

**Prove:** Compute region mean values after subtracting the median *outside all labels* (clip at zero); return ordered result.

**Debug:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Limitations:** Synthetic labels, intensities and positions do not establish calibrated biological signal or validated objects.

## I09-G03 — Compare candidate nuclear and extranuclear signal

A candidate region mask is not a validated cytoplasmic compartment.

- A per-image ratio requires an explicit denominator and a nonempty complement.
- Background and non-cell pixels in a complement will bias a naive ratio.
- The input labels, tracking correspondences and intensity values are synthetic teaching examples; a real study requires independent annotation and acquisition controls.

**Predict:** Predict the printed value and identify the biological assumption that is not tested.

```python
import numpy as np
x=np.array([3,6,9]);print(float(x.mean()))
```

**Apply:** Use data.labels>0 as candidate nuclear mask and its complement; return {'nuclear_mean','outside_mean','ratio'} with None for zero denominator.

**Prove:** Compute mean sample.second within labels and outside; return difference (inside − outside) as result.

**Debug:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Limitations:** Synthetic labels, intensities and positions do not establish calibrated biological signal or validated objects.

## I09-G04 — Audit image-channel colocalization

Pixel correlation alone cannot prove molecular co-localization.

- Calculate Pearson correlation only where two channels vary and share a declared ROI.
- Acquisition bleed-through and common background can inflate correlations.
- The input labels, tracking correspondences and intensity values are synthetic teaching examples; a real study requires independent annotation and acquisition controls.

**Predict:** Predict the printed value and identify the biological assumption that is not tested.

```python
import numpy as np
print(np.corrcoef([1,2,3],[1,3,5])[0,1])
```

**Apply:** Inside data.labels>0, calculate Pearson r between data.signal and data.second; return None if either SD is zero.

**Prove:** Compute Manders-like fraction of sample.signal>threshold pixels also positive in second, restricted to labels; guard zero denominator.

**Debug:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Limitations:** Synthetic labels, intensities and positions do not establish calibrated biological signal or validated objects.

## I09-G05 — Detect candidate fluorescent puncta peaks

Peak picking must report spatial separation and threshold settings.

- peak_local_max identifies local maxima but does not verify protein aggregates.
- Small or merged puncta may be missed or duplicated depending on min_distance.
- The input labels, tracking correspondences and intensity values are synthetic teaching examples; a real study requires independent annotation and acquisition controls.

**Predict:** Predict the printed value and identify the biological assumption that is not tested.

```python
import numpy as np
from skimage.feature import peak_local_max
print(peak_local_max(np.array([[0,0,0],[0,9,0],[0,0,0]]),exclude_border=False))
```

**Apply:** Use peak_local_max on data.signal with min_distance and threshold_abs; store peak y,x coordinates in result.

**Prove:** Return the candidate peak count in sample.second using threshold_abs and min_distance=1.

**Debug:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Limitations:** Synthetic labels, intensities and positions do not establish calibrated biological signal or validated objects.

## I09-G06 — Measure spatial proximity to candidate centers

A distance in pixels becomes physical only with trustworthy calibration.

- Nearest-neighbor distances require a declared coordinate convention (y,x).
- Close spatial proximity does not imply molecular interaction or trafficking.
- The input labels, tracking correspondences and intensity values are synthetic teaching examples; a real study requires independent annotation and acquisition controls.

**Predict:** Predict the printed value and identify the biological assumption that is not tested.

```python
import numpy as np
from scipy.spatial.distance import cdist
print(cdist([[0,0]],[[3,4]]))
```

**Apply:** Use cdist between data.points and data.centers; return shortest pixel distance per point in result.

**Prove:** Return sample point-to-center minimum distances in synthetic micrometres using sample.pixel_um.

**Debug:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Limitations:** Synthetic labels, intensities and positions do not establish calibrated biological signal or validated objects.

## I09-CAPSTONE — Report candidate-region protein intensities and limitations

Synthesize this chapter into a source-safe numerical analysis and report its unresolved biological limits.

- Use explicit parameters and preserve the original synthetic source arrays.
- Quantitative summaries must distinguish computational candidates from manually validated measurements.
- Do not call image fields independent biological replicates or rendered RGB calibrated signal.

**Predict:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
print(np.asarray([[1,0],[0,1]]).shape)
```

**Apply:** From data.labels and data.signal, return result with rows (label, pixel area, mean display signal) and validated=False.

**Prove:** On fresh sample labels, compare edge and core intensity per candidate using binary erosion; return area-verified rows and raw=False.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Limitations:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I09-REVIEW — Check intensity by a new candidate-label rule

Reconstruct the method after a delay on a fresh input.

- Reproduce the key numerical decision from memory.
- Check edge behavior and compare to a second input.
- Do not equate remembered code with biological validation.

**Predict:** Predict the printed numerical result and one limitation before execution.

**Apply:** Recall the relevant algorithm and predict a new failure mode before Prove.

**Prove:** Compute mean of sample.second within candidate regions only; return None if no pixels.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Limitations:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## Release gates

- All 3 changed-input cases per public phase must pass CPython and Pyodide.
- The independent Prove starter is intentionally blank.
- Learner and real data/annotation validation remain required.
