# I03 — Calculate useful pixel measurements

**Status:** learner-pilot chapter. Successful public checks are practice, not independent or retained mastery.

Learn NumPy vectorization, broadcasting, Boolean masks, source-preserving transformations, axis aggregation, missingness, percentiles, seeded simulation, dtype overflow and ROI summaries. Credited Witz/HPA published PNG is used as real display-pixel context, never raw calibrated fluorescence.

**Primary reference:** [Witz, Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/02-Images_as_arrays.ipynb); source image and licensing [credits](../../assets/witz/CREDITS.md). Supporting principles: NumPy, Pandas, Matplotlib and Introduction to Bioimage Analysis.

**Scientific limit:** Thresholds and ROI means computed on synthetic values or rendered RGB do not identify verified nuclei, exophers or fluorescent intensity.

## I03-G01 — Use vectorized NumPy operations

**Purpose:** Pixel-wise transformations should operate on arrays rather than hardcoded scalar loops.

NumPy ufuncs such as `np.sqrt` and array arithmetic apply to all elements and preserve shape.

A mathematical transform can change a signal scale. It should not silently rewrite the original pixel array.

Never interpret a transformed display pixel as calibrated fluorescence merely because a formula is mathematically correct.

**Predict:** Predict the numerical output and its biological interpretation.

**Runnable worked example (not the Apply/Prove answer):**

```python
import numpy as np
x=np.asarray([1,4,9],dtype=float)
print(np.sqrt(x).tolist())
```

**Prediction feedback:** The mathematical result follows actual NumPy operations, not an automatic biological inference.

**Guided reasoning:**

1. Identify shape, dtype, mask and denominators before execution.
2. Predict the worked result and change one threshold, axis or missing observation.
3. Explain whether the data describe real source pixels, synthetic examples or biological units.

**Experiment and investigate:**

- Try an empty or boundary input when the contract specifies behavior.
- Check how results differ after adjusting an explicit parameter.
- Explain why a candidate mask or field mean is not independently validated biological evidence.

### Apply — changed-input practice

Convert values to float NumPy arr, set transformed=arr*factor+offset and root=np.sqrt(np.clip(arr,0,None)). Preserve values.

```python
# I03-G01 | APPLY | Use vectorized NumPy operations
# TASK: Convert values to float NumPy arr, set transformed=arr*factor+offset and
#   root=np.sqrt(np.clip(arr,0,None)). Preserve values.
# INPUTS: values, factor, offset
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of use vectorized numpy operations?

### Prove — unfamiliar transfer

Calculate measured=np.asarray(counts,dtype=float), corrected=np.maximum(measured-background,0), and ratio=corrected/reference for positive reference; otherwise ratio=np.full_like(corrected,np.nan).

```python
# I03-G01 | PROVE | Use vectorized NumPy operations
# TASK: Calculate measured=np.asarray(counts,dtype=float),
#   corrected=np.maximum(measured-background,0), and ratio=corrected/reference
#   for positive reference; otherwise ratio=np.full_like(corrected,np.nan).
# INPUTS: counts, background, reference
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of use vectorized numpy operations?

**Debug task:** Identify a realistic failure in use vectorized numpy operations and demonstrate a changed-input test that would reveal it.

**Misconception:** A numerical array output or high RGB value automatically identifies true biological signal or independent observations.

**Scientific interpretation boundary:** Numerical arrays are synthetic training data except explicitly credited Witz/HPA rendered RGB pixels; no raw calibration, validated object segmentation or independent biological replication.

## I03-G02 — Apply broadcasting with known axes

**Purpose:** Subtracting a per-channel background from the wrong axis can corrupt measurements even without raising an error.

Broadcasting expands compatible dimensions; for a rows×channels table, a 1D channel background aligns with the final dimension.

A `(rows,1)` divisor or offset applies per row instead. Shape annotations and explicit `[:,None]` reduce mistakes.

Validate the biological meaning of axes before applying the mathematically allowed broadcasting rule.

**Predict:** Predict the numerical output and its biological interpretation.

**Runnable worked example (not the Apply/Prove answer):**

```python
import numpy as np
img=np.array([[10,20],[30,40]])
print((img-np.array([1,2])).tolist())
```

**Prediction feedback:** The mathematical result follows actual NumPy operations, not an automatic biological inference.

**Guided reasoning:**

1. Identify shape, dtype, mask and denominators before execution.
2. Predict the worked result and change one threshold, axis or missing observation.
3. Explain whether the data describe real source pixels, synthetic examples or biological units.

**Experiment and investigate:**

- Try an empty or boundary input when the contract specifies behavior.
- Check how results differ after adjusting an explicit parameter.
- Explain why a candidate mask or field mean is not independently validated biological evidence.

### Apply — changed-input practice

Given data rows×channels and channel_background of matching final dimension, create corrected=np.maximum(np.asarray(data)-np.asarray(channel_background),0) and corrected_shape.

```python
# I03-G02 | APPLY | Apply broadcasting with known axes
# TASK: Given data rows×channels and channel_background of matching final
#   dimension, create
#   corrected=np.maximum(np.asarray(data)-np.asarray(channel_background),0) and
#   corrected_shape.
# INPUTS: data, channel_background
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of apply broadcasting with known axes?

### Prove — unfamiliar transfer

Given table rows and positive row_factors, divide each row by its factor using [:,None]. Set normalized and source_shape; do not divide columns by the wrong axis.

```python
# I03-G02 | PROVE | Apply broadcasting with known axes
# TASK: Given table rows and positive row_factors, divide each row by its factor
#   using [:,None]. Set normalized and source_shape; do not divide columns by
#   the wrong axis.
# INPUTS: table, row_factors
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of apply broadcasting with known axes?

**Debug task:** Identify a realistic failure in apply broadcasting with known axes and demonstrate a changed-input test that would reveal it.

**Misconception:** A numerical array output or high RGB value automatically identifies true biological signal or independent observations.

**Scientific interpretation boundary:** Numerical arrays are synthetic training data except explicitly credited Witz/HPA rendered RGB pixels; no raw calibration, validated object segmentation or independent biological replication.

## I03-G03 — Make Boolean masks that respect missingness

**Purpose:** A missing score must not be silently treated as a failed biological sample or a real zero measurement.

A Boolean mask is an array of True/False positions. Conditions can be combined with `&` and parentheses.

Convert optional numeric values to float and use `np.isfinite` before threshold comparison; None becomes NaN in an appropriate float array.

A threshold identifies numerical candidates only; it is not a validated object classifier.

**Predict:** Predict the numerical output and its biological interpretation.

**Runnable worked example (not the Apply/Prove answer):**

```python
import numpy as np
values=np.array([.9,np.nan,.5])
mask=np.isfinite(values)&(values>=.8)
print(mask.tolist())
```

**Prediction feedback:** The mathematical result follows actual NumPy operations, not an automatic biological inference.

**Guided reasoning:**

1. Identify shape, dtype, mask and denominators before execution.
2. Predict the worked result and change one threshold, axis or missing observation.
3. Explain whether the data describe real source pixels, synthetic examples or biological units.

**Experiment and investigate:**

- Try an empty or boundary input when the contract specifies behavior.
- Check how results differ after adjusting an explicit parameter.
- Explain why a candidate mask or field mean is not independently validated biological evidence.

### Apply — changed-input practice

Convert scores with None to float array. Build valid=np.isfinite(arr), mask=valid & (arr>=minimum), and selected_indices=np.flatnonzero(mask).tolist().

```python
# I03-G03 | APPLY | Make Boolean masks that respect missingness
# TASK: Convert scores with None to float array. Build valid=np.isfinite(arr),
#   mask=valid & (arr>=minimum), and
#   selected_indices=np.flatnonzero(mask).tolist().
# INPUTS: scores, minimum
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of make boolean masks that respect missingness?

### Prove — unfamiliar transfer

From intensity_rows build image array. Create mask for pixels strictly greater than cutoff and set foreground_count=int(mask.sum()) and foreground_fraction=mask.mean() (0 if empty).

```python
# I03-G03 | PROVE | Make Boolean masks that respect missingness
# TASK: From intensity_rows build image array. Create mask for pixels strictly
#   greater than cutoff and set foreground_count=int(mask.sum()) and
#   foreground_fraction=mask.mean() (0 if empty).
# INPUTS: intensity_rows, cutoff
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of make boolean masks that respect missingness?

**Debug task:** Identify a realistic failure in make boolean masks that respect missingness and demonstrate a changed-input test that would reveal it.

**Misconception:** A numerical array output or high RGB value automatically identifies true biological signal or independent observations.

**Scientific interpretation boundary:** Numerical arrays are synthetic training data except explicitly credited Witz/HPA rendered RGB pixels; no raw calibration, validated object segmentation or independent biological replication.

## I03-G04 — Apply masked edits without damaging sources

**Purpose:** In-place masking can destroy the raw record and undermine reproducibility.

Boolean indexing selects array elements matching a condition. Assignments into a view or shared array can alter source pixels.

Use `array.copy()` before masking and retain source/processed arrays with clear names.

Mask values are computed quality rules on numerical data; a selected region is not automatically a validated cell.

**Predict:** Predict the numerical output and its biological interpretation.

**Runnable worked example (not the Apply/Prove answer):**

```python
import numpy as np
original=np.array([1,9,3])
processed=original.copy();processed[processed<5]=0
print(processed.tolist(),original.tolist())
```

**Prediction feedback:** The mathematical result follows actual NumPy operations, not an automatic biological inference.

**Guided reasoning:**

1. Identify shape, dtype, mask and denominators before execution.
2. Predict the worked result and change one threshold, axis or missing observation.
3. Explain whether the data describe real source pixels, synthetic examples or biological units.

**Experiment and investigate:**

- Try an empty or boundary input when the contract specifies behavior.
- Check how results differ after adjusting an explicit parameter.
- Explain why a candidate mask or field mean is not independently validated biological evidence.

### Apply — changed-input practice

Create original from values and cleaned=original.copy(); replace cleaned values below threshold with zero. Set original_untouched=True if original still matches input values.

```python
# I03-G04 | APPLY | Apply masked edits without damaging sources
# TASK: Create original from values and cleaned=original.copy(); replace cleaned
#   values below threshold with zero. Set original_untouched=True if original
#   still matches input values.
# INPUTS: values, threshold
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of apply masked edits without damaging sources?

### Prove — unfamiliar transfer

From readings create float array original, repaired=original.copy(); set readings outside valid 0..1 and None to np.nan in repaired. Set invalid_count and preserved boolean.

```python
# I03-G04 | PROVE | Apply masked edits without damaging sources
# TASK: From readings create float array original, repaired=original.copy(); set
#   readings outside valid 0..1 and None to np.nan in repaired. Set
#   invalid_count and preserved boolean.
# INPUTS: readings
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of apply masked edits without damaging sources?

**Debug task:** Identify a realistic failure in apply masked edits without damaging sources and demonstrate a changed-input test that would reveal it.

**Misconception:** A numerical array output or high RGB value automatically identifies true biological signal or independent observations.

**Scientific interpretation boundary:** Numerical arrays are synthetic training data except explicitly credited Witz/HPA rendered RGB pixels; no raw calibration, validated object segmentation or independent biological replication.

## I03-G05 — Aggregate image values over an explicit axis

**Purpose:** A channel mean, per-row mean and field mean answer different questions.

NumPy reductions such as `np.mean` collapse a chosen axis, producing a shape based on the remaining axes.

For `(rows,cols)` data, `axis=0` aggregates down rows to per-column means. `axis=1` aggregates across columns to per-row means.

Decide the scientific unit before aggregating; microscope fields are not automatically independent replicates.

**Predict:** Predict the numerical output and its biological interpretation.

**Runnable worked example (not the Apply/Prove answer):**

```python
import numpy as np
m=np.array([[2,4,6],[8,10,12]])
print(m.mean(axis=0).tolist())
print(m.mean(axis=1).tolist())
```

**Prediction feedback:** The mathematical result follows actual NumPy operations, not an automatic biological inference.

**Guided reasoning:**

1. Identify shape, dtype, mask and denominators before execution.
2. Predict the worked result and change one threshold, axis or missing observation.
3. Explain whether the data describe real source pixels, synthetic examples or biological units.

**Experiment and investigate:**

- Try an empty or boundary input when the contract specifies behavior.
- Check how results differ after adjusting an explicit parameter.
- Explain why a candidate mask or field mean is not independently validated biological evidence.

### Apply — changed-input practice

Create arr from matrix and calculate column_means=arr.mean(axis=0), row_means=arr.mean(axis=1) and overall_mean=float(arr.mean()).

```python
# I03-G05 | APPLY | Aggregate image values over an explicit axis
# TASK: Create arr from matrix and calculate column_means=arr.mean(axis=0),
#   row_means=arr.mean(axis=1) and overall_mean=float(arr.mean()).
# INPUTS: matrix
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of aggregate image values over an explicit axis?

### Prove — unfamiliar transfer

Given stack_data in (fields,rows,cols) order, calculate mean_image=arr.mean(axis=0), field_means=arr.mean(axis=(1,2)), and field_count.

```python
# I03-G05 | PROVE | Aggregate image values over an explicit axis
# TASK: Given stack_data in (fields,rows,cols) order, calculate
#   mean_image=arr.mean(axis=0), field_means=arr.mean(axis=(1,2)), and
#   field_count.
# INPUTS: stack_data
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of aggregate image values over an explicit axis?

**Debug task:** Identify a realistic failure in aggregate image values over an explicit axis and demonstrate a changed-input test that would reveal it.

**Misconception:** A numerical array output or high RGB value automatically identifies true biological signal or independent observations.

**Scientific interpretation boundary:** Numerical arrays are synthetic training data except explicitly credited Witz/HPA rendered RGB pixels; no raw calibration, validated object segmentation or independent biological replication.

## I03-G06 — Handle NaN and missing numerical records

**Purpose:** An absent signal measurement must be excluded transparently rather than converted into zero.

None may become NaN in a float NumPy array. `np.isfinite` separates observed numeric values from missing, infinite or invalid entries.

Compute an arithmetic mean over finite values, explicitly returning `None` when no observations remain.

The missingness mechanism itself may bias a biological result. A computational mean cannot justify ignoring systematic exclusions.

**Predict:** Predict the numerical output and its biological interpretation.

**Runnable worked example (not the Apply/Prove answer):**

```python
import numpy as np
arr=np.asarray([2,None,4],dtype=float)
valid=arr[np.isfinite(arr)]
print(valid.mean())
```

**Prediction feedback:** The mathematical result follows actual NumPy operations, not an automatic biological inference.

**Guided reasoning:**

1. Identify shape, dtype, mask and denominators before execution.
2. Predict the worked result and change one threshold, axis or missing observation.
3. Explain whether the data describe real source pixels, synthetic examples or biological units.

**Experiment and investigate:**

- Try an empty or boundary input when the contract specifies behavior.
- Check how results differ after adjusting an explicit parameter.
- Explain why a candidate mask or field mean is not independently validated biological evidence.

### Apply — changed-input practice

Convert values to float; compute observed_count, missing_count, and finite_mean=float(mean of finite numbers) or None when none.

```python
# I03-G06 | APPLY | Handle NaN and missing numerical records
# TASK: Convert values to float; compute observed_count, missing_count, and
#   finite_mean=float(mean of finite numbers) or None when none.
# INPUTS: values
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of handle nan and missing numerical records?

### Prove — unfamiliar transfer

Given labelled observations [id,value], create accepted_ids for finite numeric values, rejected_ids for None or nonfinite, and mean_value of accepted values or None.

```python
# I03-G06 | PROVE | Handle NaN and missing numerical records
# TASK: Given labelled observations [id,value], create accepted_ids for finite
#   numeric values, rejected_ids for None or nonfinite, and mean_value of
#   accepted values or None.
# INPUTS: observations
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of handle nan and missing numerical records?

**Debug task:** Identify a realistic failure in handle nan and missing numerical records and demonstrate a changed-input test that would reveal it.

**Misconception:** A numerical array output or high RGB value automatically identifies true biological signal or independent observations.

**Scientific interpretation boundary:** Numerical arrays are synthetic training data except explicitly credited Witz/HPA rendered RGB pixels; no raw calibration, validated object segmentation or independent biological replication.

## I03-G07 — Use percentiles and ranks responsibly

**Purpose:** Different threshold choices can give very different candidate counts on the same field.

`np.percentile` computes an interpolated empirical percentile. It is not automatically the brightest 25% as an integer count.

Sorting an array reveals ordered values but loses original spatial positions unless indices are kept separately.

A 75th percentile of pixel values is a numerical criterion, not a universally validated biological segmentation threshold.

**Predict:** Predict the numerical output and its biological interpretation.

**Runnable worked example (not the Apply/Prove answer):**

```python
import numpy as np
values=np.array([0,1,2,3,4])
print(np.percentile(values,75))
print(np.sort(values).tolist())
```

**Prediction feedback:** The mathematical result follows actual NumPy operations, not an automatic biological inference.

**Guided reasoning:**

1. Identify shape, dtype, mask and denominators before execution.
2. Predict the worked result and change one threshold, axis or missing observation.
3. Explain whether the data describe real source pixels, synthetic examples or biological units.

**Experiment and investigate:**

- Try an empty or boundary input when the contract specifies behavior.
- Check how results differ after adjusting an explicit parameter.
- Explain why a candidate mask or field mean is not independently validated biological evidence.

### Apply — changed-input practice

For values numeric, produce sorted_values=np.sort(arr).tolist(), percentile=float(np.percentile(arr,percentile)) and above_count=int((arr>percentile).sum()). Nonempty inputs.

```python
# I03-G07 | APPLY | Use percentiles and ranks responsibly
# TASK: For values numeric, produce sorted_values=np.sort(arr).tolist(),
#   percentile=float(np.percentile(arr,percentile)) and
#   above_count=int((arr>percentile).sum()). Nonempty inputs.
# INPUTS: values, percentile
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of use percentiles and ranks responsibly?

### Prove — unfamiliar transfer

For intensities create threshold_value as NumPy percentile at q and candidate_indices from values strictly above that cutoff. Return sorted_indices=np.argsort(arr).tolist().

```python
# I03-G07 | PROVE | Use percentiles and ranks responsibly
# TASK: For intensities create threshold_value as NumPy percentile at q and
#   candidate_indices from values strictly above that cutoff. Return
#   sorted_indices=np.argsort(arr).tolist().
# INPUTS: intensities, q
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of use percentiles and ranks responsibly?

**Debug task:** Identify a realistic failure in use percentiles and ranks responsibly and demonstrate a changed-input test that would reveal it.

**Misconception:** A numerical array output or high RGB value automatically identifies true biological signal or independent observations.

**Scientific interpretation boundary:** Numerical arrays are synthetic training data except explicitly credited Witz/HPA rendered RGB pixels; no raw calibration, validated object segmentation or independent biological replication.

## I03-G08 — Use reproducible seeded random simulations

**Purpose:** Teaching simulations must be reproducible and clearly distinguished from observed biological experiments.

`np.random.default_rng(seed)` creates a seeded generator; identical seeds and algorithms reproduce identical example draws.

A new seed changes the simulation but is not a new biological replicate. Record the generator, parameters and model assumptions.

Synthetic Poisson counts can help learn variability, yet real experiment design and between-sample variation cannot be replaced by simulation.

**Predict:** Predict the numerical output and its biological interpretation.

**Runnable worked example (not the Apply/Prove answer):**

```python
import numpy as np
rng=np.random.default_rng(17)
print(rng.poisson(3,size=5).tolist())
```

**Prediction feedback:** The mathematical result follows actual NumPy operations, not an automatic biological inference.

**Guided reasoning:**

1. Identify shape, dtype, mask and denominators before execution.
2. Predict the worked result and change one threshold, axis or missing observation.
3. Explain whether the data describe real source pixels, synthetic examples or biological units.

**Experiment and investigate:**

- Try an empty or boundary input when the contract specifies behavior.
- Check how results differ after adjusting an explicit parameter.
- Explain why a candidate mask or field mean is not independently validated biological evidence.

### Apply — changed-input practice

Create rng=np.random.default_rng(seed), draw simulations=rng.poisson(mean_count,size=n), and set reproducible comparing with a new generator same seed.

```python
# I03-G08 | APPLY | Use reproducible seeded random simulations
# TASK: Create rng=np.random.default_rng(seed), draw
#   simulations=rng.poisson(mean_count,size=n), and set reproducible comparing
#   with a new generator same seed.
# INPUTS: seed, mean_count, n
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of use reproducible seeded random simulations?

### Prove — unfamiliar transfer

Simulate integers with default_rng(seed).integers(low,high,size=n) where high is exclusive. Set draws, same_seed_equal and min_bound_ok, preserving input values.

```python
# I03-G08 | PROVE | Use reproducible seeded random simulations
# TASK: Simulate integers with default_rng(seed).integers(low,high,size=n) where
#   high is exclusive. Set draws, same_seed_equal and min_bound_ok, preserving
#   input values.
# INPUTS: seed, low, high, n
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of use reproducible seeded random simulations?

**Debug task:** Identify a realistic failure in use reproducible seeded random simulations and demonstrate a changed-input test that would reveal it.

**Misconception:** A numerical array output or high RGB value automatically identifies true biological signal or independent observations.

**Scientific interpretation boundary:** Numerical arrays are synthetic training data except explicitly credited Witz/HPA rendered RGB pixels; no raw calibration, validated object segmentation or independent biological replication.

## I03-G09 — Avoid overflow and precision traps

**Purpose:** Unsigned image data can wrap around when arithmetic exceeds the storage range.

`uint8` stores 0–255; adding 10 to 250 in uint8 arithmetic wraps instead of producing 260, so promote dtype before arithmetic.

Use an integer type with sufficient range for sums and a float dtype for noninteger means. Inspect `np.iinfo` and `np.finfo` rather than guessing precision.

Saturation in a raw detector and overflow in a processed array are distinct problems requiring different diagnostics.

**Predict:** What does uint8 overflow do at its maximum?

**Runnable worked example (not the Apply/Prove answer):**

```python
import numpy as np
raw=np.array([250],dtype=np.uint8)
print((raw+np.uint8(10)).tolist())
print((raw.astype(np.int64)+10).tolist())
```

**Prediction feedback:** uint8 arithmetic can wrap; promote dtype before calculating sums or transforms.

**Guided reasoning:**

1. Identify shape, dtype, mask and denominators before execution.
2. Predict the worked result and change one threshold, axis or missing observation.
3. Explain whether the data describe real source pixels, synthetic examples or biological units.

**Experiment and investigate:**

- Try an empty or boundary input when the contract specifies behavior.
- Check how results differ after adjusting an explicit parameter.
- Explain why a candidate mask or field mean is not independently validated biological evidence.

### Apply — changed-input practice

Create raw uint8 array from values; set safe_sum=raw.astype(np.int64)+added, wrapped=(raw+np.uint8(added)), and overflow_detected=bool(any difference). Added between 0 and 255.

```python
# I03-G09 | APPLY | Avoid overflow and precision traps
# TASK: Create raw uint8 array from values; set
#   safe_sum=raw.astype(np.int64)+added, wrapped=(raw+np.uint8(added)), and
#   overflow_detected=bool(any difference). Added between 0 and 255.
# INPUTS: values, added
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of avoid overflow and precision traps?

### Prove — unfamiliar transfer

For uint8 counts create safe_total=int(arr.astype(np.int64).sum()), unsafe_total=int(arr.sum(dtype=np.uint8)), and overflow=unsafe_total != safe_total.

```python
# I03-G09 | PROVE | Avoid overflow and precision traps
# TASK: For uint8 counts create safe_total=int(arr.astype(np.int64).sum()),
#   unsafe_total=int(arr.sum(dtype=np.uint8)), and overflow=unsafe_total !=
#   safe_total.
# INPUTS: counts
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of avoid overflow and precision traps?

**Debug task:** Identify a realistic failure in avoid overflow and precision traps and demonstrate a changed-input test that would reveal it.

**Misconception:** A numerical array output or high RGB value automatically identifies true biological signal or independent observations.

**Scientific interpretation boundary:** Numerical arrays are synthetic training data except explicitly credited Witz/HPA rendered RGB pixels; no raw calibration, validated object segmentation or independent biological replication.

## I03-G10 — Quantify a defined ROI without overclaiming

**Purpose:** ROI measurements need a documented mask and denominator; selecting pixels does not validate an object.

An ROI mask selects numerical pixels. Mean or sum are defined only for the selected array and the specific channel or data type.

When no pixels are selected, return None for the mean instead of inventing zero. Keep pixel count separate from number of objects or independent biological samples.

These lessons use explicitly synthetic small matrices for formula correctness. Real fluorescence requires raw source, validated segmentation and background/calibration.

**Predict:** Predict the numerical output and its biological interpretation.

**Runnable worked example (not the Apply/Prove answer):**

```python
import numpy as np
img=np.array([[1,2],[3,4]])
mask=img>=3
print(int(mask.sum()),float(img[mask].mean()))
```

**Prediction feedback:** The mathematical result follows actual NumPy operations, not an automatic biological inference.

**Guided reasoning:**

1. Identify shape, dtype, mask and denominators before execution.
2. Predict the worked result and change one threshold, axis or missing observation.
3. Explain whether the data describe real source pixels, synthetic examples or biological units.

**Experiment and investigate:**

- Try an empty or boundary input when the contract specifies behavior.
- Check how results differ after adjusting an explicit parameter.
- Explain why a candidate mask or field mean is not independently validated biological evidence.

### Apply — changed-input practice

Convert pixels and same-shaped region_mask to arrays; set selected_count=int(mask.sum()), selected_mean=float(arr[mask].mean()) or None when empty, and selected_sum=float(arr[mask].sum()).

```python
# I03-G10 | APPLY | Quantify a defined ROI without overclaiming
# TASK: Convert pixels and same-shaped region_mask to arrays; set
#   selected_count=int(mask.sum()), selected_mean=float(arr[mask].mean()) or
#   None when empty, and selected_sum=float(arr[mask].sum()).
# INPUTS: pixels, region_mask
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of quantify a defined roi without overclaiming?

### Prove — unfamiliar transfer

For numeric field and cutoff, create mask=(field>=cutoff), set area_pixels, mean_selected (or None), and fraction_selected. Do not call area_pixels a cell count.

```python
# I03-G10 | PROVE | Quantify a defined ROI without overclaiming
# TASK: For numeric field and cutoff, create mask=(field>=cutoff), set
#   area_pixels, mean_selected (or None), and fraction_selected. Do not call
#   area_pixels a cell count.
# INPUTS: field, cutoff
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of quantify a defined roi without overclaiming?

**Debug task:** Identify a realistic failure in quantify a defined roi without overclaiming and demonstrate a changed-input test that would reveal it.

**Misconception:** A numerical array output or high RGB value automatically identifies true biological signal or independent observations.

**Scientific interpretation boundary:** Numerical arrays are synthetic training data except explicitly credited Witz/HPA rendered RGB pixels; no raw calibration, validated object segmentation or independent biological replication.

## I03-CAPSTONE — Build an honest pixel-ROI summary

**Purpose:** Combine actual image decoding, array masks and numeric summaries without presenting display pixels as calibrated signal.

Decode the credited Witz/HPA notebook PNG and choose a rectangular component crop. Apply a display-code threshold using NumPy.

Report ROI pixel count, candidate-mask count and mean selected display intensity, and explicitly mark the calculation as uncalibrated.

Changed thresholds must change numerical results. Neither an RGB mask nor a bright patch is automatically a nucleus or biological replicate.

**Predict:** Predict the numerical output and its biological interpretation.

**Runnable worked example (not the Apply/Prove answer):**

```python
from PIL import Image
import numpy as np
rgb=np.asarray(Image.open(image_path).convert('RGB'))
plane=rgb[:10,:10,1]
print(plane.shape,'display RGB, not raw signal')
```

**Prediction feedback:** The mathematical result follows actual NumPy operations, not an automatic biological inference.

**Guided reasoning:**

1. Identify shape, dtype, mask and denominators before execution.
2. Predict the worked result and change one threshold, axis or missing observation.
3. Explain whether the data describe real source pixels, synthetic examples or biological units.

**Experiment and investigate:**

- Try an empty or boundary input when the contract specifies behavior.
- Check how results differ after adjusting an explicit parameter.
- Explain why a candidate mask or field mean is not independently validated biological evidence.

### Apply — changed-input practice

Decode RGB image_path. Select plane from y0:y1,x0:x1 and channel_index, create mask=(plane>=threshold), set report with area_pixels, selected_mean or None, raw_calibrated=False. Print report.

```python
# I03-CAPSTONE | APPLY | Build an honest pixel-ROI summary
# TASK: Decode RGB image_path. Select plane from y0:y1,x0:x1 and channel_index,
#   create mask=(plane>=threshold), set report with area_pixels, selected_mean
#   or None, raw_calibrated=False. Print report.
# INPUTS: image_path, y0, y1, x0, x1, channel_index, threshold
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of build an honest pixel-roi summary?

### Prove — unfamiliar transfer

From credited RGB image, choose ROI and component, create passed=roi>limit and summary={'n':count,'fraction':fraction,'raw':False}. Print summary; source must remain unmodified.

```python
# I03-CAPSTONE | PROVE | Build an honest pixel-ROI summary
# TASK: From credited RGB image, choose ROI and component, create
#   passed=roi>limit and summary={'n':count,'fraction':fraction,'raw':False}.
#   Print summary; source must remain unmodified.
# INPUTS: image_path, top, bottom, left, right, component, limit
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of build an honest pixel-roi summary?

**Debug task:** Identify a realistic failure in build an honest pixel-roi summary and demonstrate a changed-input test that would reveal it.

**Misconception:** A numerical array output or high RGB value automatically identifies true biological signal or independent observations.

**Scientific interpretation boundary:** Numerical arrays are synthetic training data except explicitly credited Witz/HPA rendered RGB pixels; no raw calibration, validated object segmentation or independent biological replication.

**Capstone passes:**

1. Decode the credited Witz/HPA rendered image into real NumPy RGB pixels.
2. Select a component and explicit pixel ROI without mutating the source.
3. Construct a threshold mask and inspect numeric consequences.
4. Return a clear summary with source provenance and raw_calibrated False.
5. Repeat Prove with changed ROI and threshold without copying the Apply solution.

**Explain in your own words:**

- What actual source was measured?
- What do missingness, thresholds and denominators mean?
- Why is the result not a calibrated biological effect or object count?

## I03-REVIEW — Rebuild numerical ROI decisions after a delay

**Purpose:** Independent practice should transfer array-masking and missingness rules to unfamiliar data.

Use explicit mask and array dtype and verify denominator.

Keep empty ROI means distinct from a measured zero.

Independently count numerical candidate pixels without claiming validated biological objects.

**Predict:** Predict the numerical output and its biological interpretation.

**Prediction feedback:** The mathematical result follows actual NumPy operations, not an automatic biological inference.

**Guided reasoning:**

1. Identify shape, dtype, mask and denominators before execution.
2. Predict the worked result and change one threshold, axis or missing observation.
3. Explain whether the data describe real source pixels, synthetic examples or biological units.

**Experiment and investigate:**

- Try an empty or boundary input when the contract specifies behavior.
- Check how results differ after adjusting an explicit parameter.
- Explain why a candidate mask or field mean is not independently validated biological evidence.

### Apply — changed-input practice

Write pseudocode comments for a numeric ROI report that distinguishes missing data, zeros and object counts.

```python
# I03-REVIEW | APPLY | Rebuild numerical ROI decisions after a delay
# TASK: Write pseudocode comments for a numeric ROI report that distinguishes
#   missing data, zeros and object counts.
```

**Public checks:** 0 input variants. How could a changed threshold, missing value, axis or datatype alter the result of rebuild numerical roi decisions after a delay?

### Prove — unfamiliar transfer

Given new numeric matrix, compute selected_count, selected_sum and selected_mean (or None) for values strictly above cutoff. Return report and print it.

```python
# I03-REVIEW | PROVE | Rebuild numerical ROI decisions after a delay
# TASK: Given new numeric matrix, compute selected_count, selected_sum and
#   selected_mean (or None) for values strictly above cutoff. Return report and
#   print it.
# INPUTS: matrix, cutoff
```

**Public checks:** 3 input variants. How could a changed threshold, missing value, axis or datatype alter the result of rebuild numerical roi decisions after a delay?

**Debug task:** Identify a realistic failure in rebuild numerical roi decisions after a delay and demonstrate a changed-input test that would reveal it.

**Misconception:** A numerical array output or high RGB value automatically identifies true biological signal or independent observations.

**Scientific interpretation boundary:** Numerical arrays are synthetic training data except explicitly credited Witz/HPA rendered RGB pixels; no raw calibration, validated object segmentation or independent biological replication.

**Explain in your own words:**

- What actual source was measured?
- What do missingness, thresholds and denominators mean?
- Why is the result not a calibrated biological effect or object count?

## Independent handoff

Export a transparent NumPy ROI report with threshold sensitivity, missingness rules and explicitly uncalibrated source provenance.

Export `pixel_roi_summary.py` after completing Prove. Keep source files, units and acquisition provenance. Imported Witz/HPA PNG data are rendered RGB—not raw calibrated microscopy. Synthetic Pandas measurements have no external biological-provenance evidence. Real image segmentation and statistical inference require later chapters and independent validation.
