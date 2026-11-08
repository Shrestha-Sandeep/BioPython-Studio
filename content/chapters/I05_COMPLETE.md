# I05 — Separate image foreground from background

**Status:** independent learner trial required. Public checks do not certify object detection, biology or retention.

Witz source: https://github.com/guiwitz/PyImageCourse_beginner/blob/master/04-Image_processing.ipynb. Credited HPA figure: [provenance](../../assets/witz/CREDITS.md).

## Teaching sequence

Predict → Run → Investigate → Apply → independent Prove → delayed review.

Scientific boundary: The credited source is a rendered HPA notebook figure, not raw calibrated image data; labels are candidates, not verified objects.

## I05-G01 — Estimate and subtract image background

Quantify a declared background estimator instead of treating every display pixel as signal.

- A percentile of a chosen image plane gives a reproducible background estimate.
- Clip background-subtracted values at zero only if that physical convention is declared.
- A rendered RGB figure is not calibrated fluorescence; background choices can remove real features.

**Predict and investigate:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
x=np.array([2.,3.,8.,15.]); print(np.percentile(x,25))
```

**Apply:** Estimate the percentile background of data.image; store result as {'background': float, 'corrected': NumPy array}, clipped at zero.

**Prove (new input):** Independently estimate a border-median background from sample.image and return the clipped corrected image in result.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I05-G02 — Apply Gaussian smoothing without silent data loss

Control smoothing width and preserve original intensity scale.

- A Gaussian filter is a local weighted average; sigma is measured in pixels here.
- Smoothing attenuates high-frequency variation and may merge neighboring objects.
- Estimate whether filtering changes the feature size before interpreting a segmentation.

**Predict and investigate:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
from skimage.filters import gaussian
print(gaussian(np.eye(4),sigma=0.5,preserve_range=True).shape)
```

**Apply:** Convert data.image to float and set result to Gaussian-smoothed pixels with data.sigma; preserve range.

**Prove (new input):** Apply a *different* Gaussian width (1.5 × sample.sigma) and return the result without changing sample.image.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I05-G03 — Contrast impulse and Gaussian denoising

Choose a filter according to the noise model, not its attractive appearance.

- A median filter suppresses isolated bright/salt-and-pepper pixels without averaging them.
- Gaussian filtering changes edge contrast and spatial resolution; document its sigma.
- No denoiser can restore a biological feature that has been filtered away.

**Predict and investigate:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
from skimage.filters import median
print(median(np.array([[0,0,0],[0,9,0],[0,0,0]])))
```

**Apply:** Produce result={'median': median-filtered image, 'gaussian': Gaussian image}; use disk(1) and sigma=data.sigma.

**Prove (new input):** Return sample.image filtered with disk(1) median; also record whether it preserves image shape.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I05-G04 — Define a global threshold mask

Make inclusive/exclusive cutoff behavior explicit.

- Threshold operators produce Boolean candidate masks; they do not prove object identity.
- A strict greater-than rule excludes pixels exactly equal to the chosen threshold.
- Inspect the candidate count and exposure sensitivity, not only the overlay.

**Predict and investigate:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
print((np.array([0,5,10])>5).tolist())
```

**Apply:** Set result to a Boolean NumPy mask where data.image is strictly greater than data.threshold.

**Prove (new input):** Use *inclusive* comparison for sample.image and sample.threshold; result must be Boolean.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I05-G05 — Compare automatic and manual thresholds

Treat automatically selected thresholds as candidates requiring inspection.

- Otsu thresholding maximizes between-class separation of histogram intensities.
- Otsu can fail when signal is unimodal or when background occupies most pixels.
- Report the numerical cutoff; never equate a high-intensity region with a cell.

**Predict and investigate:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
from skimage.filters import threshold_otsu
print(threshold_otsu(np.array([0,0,0,10,10,10])))
```

**Apply:** Return result containing Otsu threshold and Boolean mask of pixels strictly above the cutoff.

**Prove (new input):** Compare Otsu with the sample.percentile cutoff: return numerical thresholds and both candidate pixel counts.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I05-G06 — Measure sensitivity to segmentation threshold

Estimate how unstable candidate area is under reasonable parameter changes.

- Vary the threshold around the declared decision boundary, rather than optimizing by eye.
- Report both candidate counts and proportion of selected pixels.
- Threshold robustness does not replace ground-truth segmentation validation.

**Predict and investigate:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
x=np.array([0,10,20,30]); print([int((x>t).sum()) for t in (5,15,25)])
```

**Apply:** Calculate candidate counts at thresholds data.threshold−15, threshold, and threshold+15; store ordered list result.

**Prove (new input):** Compare two sample masks (cutoff and cutoff+20) and set result={'iou': float, 'area_change': int}. Empty union has IoU 1.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I05-CAPSTONE — Audit real rendered-pixel threshold sensitivity

Combine real computational techniques into a source-preserving, interpretable report.

- Document inputs, parameters, units and outputs together.
- A successful candidate mask may fail validation on unseen annotated images.
- Do not treat fields, display RGB intensities or connected regions as independent biological truth.

**Predict and investigate:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
print(np.asarray([[0,1],[1,0]]).shape)
```

**Apply:** Load the credited PNG at image_path; crop the 32×32 RGB component ROI at x0,y0 and count display pixels above threshold. Return result with count, area and calibrated=False.

**Prove (new input):** On a new ROI from the credited image, compare strict thresholds low and high and return {'low': count, 'high': count, 'raw':False}.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I05-REVIEW — Re-evaluate a new threshold perturbation

Reconstruct the method after a delay on a fresh input.

- Reproduce the key numerical decision from memory.
- Check edge behavior and compare to a second input.
- Do not equate remembered code with biological validation.

**Predict and investigate:** Predict the printed numerical result and one limitation before execution.

**Apply:** Return to this method later without copying the solved example.

**Prove (new input):** On a fresh sample, reproduce the specified method independently; store the checked variables in result.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## Release requirements

- Execute all public changed-input cases in genuine browser Pyodide and CPython.
- Confirm standalone script export and saved draft preservation.
- Trial with the intended learner; test delayed independent work.
- Validate raw data, controls and annotations before any quantitative biological claim.
