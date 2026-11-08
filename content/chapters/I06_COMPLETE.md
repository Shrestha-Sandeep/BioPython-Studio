# I06 — Clean a mask and label candidate nuclei

**Status:** independent learner trial required. Public checks do not certify object detection, biology or retention.

Witz source: https://github.com/guiwitz/PyImageCourse_beginner/blob/master/05-Filtering.ipynb. Credited HPA figure: [provenance](../../assets/witz/CREDITS.md).

## Teaching sequence

Predict → Run → Investigate → Apply → independent Prove → delayed review.

Scientific boundary: The credited source is a rendered HPA notebook figure, not raw calibrated image data; labels are candidates, not verified objects.

## I06-G01 — Clean a candidate mask using morphology

Distinguish closing gaps from opening isolated pixels.

- Binary closing can fill narrow gaps and join neighboring bright components.
- Binary opening removes thin protrusions but may erase true small objects.
- Structuring-element size must be predeclared relative to expected biological scale.

**Predict and investigate:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
from skimage.morphology import binary_closing,disk
print(binary_closing(np.eye(3,dtype=bool),footprint=disk(1)).astype(int))
```

**Apply:** Apply binary closing with disk(1) to data.mask and store the cleaned Boolean mask in result.

**Prove (new input):** Independently use binary opening with disk(1) on sample.mask; return a Boolean result.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I06-G02 — Label connected candidate regions

Understand how 4- versus 8-neighbor connectivity changes counts.

- A connected-component label is an algorithmic identity, not a confirmed cell.
- Connectivity=1 in 2D uses face (4-neighbor) relationships.
- Diagonal touching can change counts when using connectivity=2.

**Predict and investigate:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
from skimage.measure import label
print(label(np.eye(3,dtype=bool),connectivity=1))
```

**Apply:** Label Boolean data.mask using connectivity=1; result is {'labels': array, 'count': int}.

**Prove (new input):** Repeat independently using connectivity=2 on sample.mask and return a count and label array.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I06-G03 — Filter labeled objects by measured size

Make size exclusions explicit and retain an audit trail.

- Region areas are pixel counts until a valid scale is provided.
- Removing small components changes the apparent object count.
- Keep the original binary mask and report the excluded labels separately.

**Predict and investigate:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
from skimage.measure import label,regionprops
print([r.area for r in regionprops(label(np.eye(4,dtype=bool)))])
```

**Apply:** Label data.mask and keep components with area >= data.min_size. Set result to filtered Boolean mask and removed count.

**Prove (new input):** Use a two-sided area range [sample.min_size, sample.min_size+2]; return kept component areas sorted ascending.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I06-G04 — Exclude objects touching acquisition borders

Avoid comparing truncated edge objects with complete objects.

- An object touching an image boundary may have underestimated area or shape.
- Border removal must be applied consistently, not only to inconvenient samples.
- Record exclusions; cropped ROIs can create artificial new borders.

**Predict and investigate:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
from skimage.segmentation import clear_border
print(clear_border(np.array([[1,0,0],[0,1,0],[0,0,0]],bool)))
```

**Apply:** Use clear_border on Boolean data.mask and return the remaining Boolean candidate mask.

**Prove (new input):** Return the area of objects retained after border clearing of sample.mask, using 4-neighbor labeling.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I06-G05 — Split touching candidates with marker watershed

Learn when watershed creates plausible but unvalidated object boundaries.

- Distance-transform watershed separates touching foreground when markers are credible.
- Poor markers can split one object or merge two; review the source pixels.
- An algorithmically separated component is not yet an annotated nucleus.

**Predict and investigate:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
from scipy import ndimage as ndi
from skimage.segmentation import watershed
mask=np.array([[0,1,1],[0,1,1],[0,1,0]],bool); seeds=np.array([[0,1,0],[0,0,2],[0,0,0]]); print(watershed(-ndi.distance_transform_edt(mask),seeds,mask=mask))
```

**Apply:** Use distance-transform watershed of data.mask with data.markers; result is an integer label image.

**Prove (new input):** Repeat watershed on sample.mask with sample.markers; report the unique nonzero marker-derived labels.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I06-G06 — Check why 2D labels cannot prove 3D continuity

Respect z-axis connectivity and max-projection ambiguities.

- Two apparently overlapping XY objects may be distinct across optical sections.
- True 3D labeling requires a volume with known z-spacing and connectivity.
- A maximum-intensity projection can merge objects separated in z.

**Predict and investigate:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
from skimage.measure import label
volume=np.zeros((2,3,3),bool);volume[0,1,1]=1;volume[1,1,1]=1;print(label(volume,connectivity=1).max())
```

**Apply:** Label synthetic 3D data.volume at connectivity=1. Store {'volume_count': int, 'shape': tuple}.

**Prove (new input):** Compare the number of components after XY max-projection with real 3D labeling; return both counts.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I06-G07 — Make a reusable segmentation function

Turn threshold, connectivity and minimum area into explicit parameters.

- A pipeline should accept new images without changing its source code.
- Store threshold, connectivity, and size cutoffs beside each output.
- Synthetic segmentation remains a candidate unless independently validated on annotations.

**Predict and investigate:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
from skimage.measure import label
print(label(np.array([[0,1],[0,1]],bool)).max())
```

**Apply:** Define segment(image,threshold,min_size) using 4-neighbor labeling and area filtering; set result to kept candidate count.

**Prove (new input):** Write measure_candidates(image,threshold,min_size) returning kept component areas and count, not just mask.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I06-CAPSTONE — Document a reproducible candidate-object mask

Combine real computational techniques into a source-preserving, interpretable report.

- Document inputs, parameters, units and outputs together.
- A successful candidate mask may fail validation on unseen annotated images.
- Do not treat fields, display RGB intensities or connected regions as independent biological truth.

**Predict and investigate:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
print(np.asarray([[0,1],[1,0]]).shape)
```

**Apply:** Threshold data.image, filter 4-neighbor objects with area >= data.min_size, report retained areas and candidate count, and mark verified=False.

**Prove (new input):** Using new sample.mask, report the count after border clearing and >=min_size filtering, recording rejected candidate count.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Scientific boundary:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I06-REVIEW — Diagnose border-exclusion failures

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
