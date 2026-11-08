# I02 — Crop and inspect image planes

**Status:** learner-pilot chapter. Successful public checks are practice, not independent or retained mastery.

Use genuine NumPy ROI slicing, views/copies, declared 5D axes, scale conversion on explicitly synthetic metadata, and actual TIFF-container decoding without misrepresenting OME conformance or HPA PNG calibration.

**Primary reference:** [Witz, Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/03-More_on_images.ipynb); source image and licensing [credits](../../assets/witz/CREDITS.md). Supporting principles: NumPy, Pandas, Matplotlib and Introduction to Bioimage Analysis.

**Scientific limit:** No verified source raw OME-TIFF or calibrated intensity is supplied. Synthetic TIFF tags do not establish standards conformance.

## I02-G01 — Slice a rectangular numerical subarray

**Purpose:** ROI slices are half-open and use row-first indexing; a wrong right endpoint shifts experimental selection.

NumPy slicing uses `arr[y0:y1,x0:x1]`, with the final index excluded. A rectangle's height is `y1-y0` and width is `x1-x0`.

A slice preserves coordinate relationships: the first ROI pixel corresponds to the original image location `(y0,x0)`.

An empty ROI is a computational selection, not evidence that a field contains zero biological objects.

**Predict:** Predict the displayed output and its scientific limitation.

**Runnable worked example (not the Apply/Prove answer):**

```python
import numpy as np
image=np.arange(20).reshape(4,5)
roi=image[1:3,2:5]
print(roi.shape,roi.tolist())
```

**Prediction feedback:** Use declared axes and given source; no result verifies raw-fluorescence calibration.

**Guided reasoning:**

1. Identify array shape, declared axes, image source and the requested output.
2. Predict the example, run it in real Python and change a bound or record.
3. Explain which result is data processing and which biological conclusion is unsupported.

**Experiment and investigate:**

- Try alternative bounds or empty inputs when the contract permits.
- Compare a view and a copy or inspect a TIFF tag explicitly.
- State what calibration and source information would be necessary for real microscopy.

### Apply — changed-input practice

From image_rows create NumPy image, crop roi using y0:y1, x0:x1, and set roi_shape and roi_sum.

```python
# I02-G01 | APPLY | Slice a rectangular numerical subarray
# TASK: From image_rows create NumPy image, crop roi using y0:y1, x0:x1, and set
#   roi_shape and roi_sum.
# INPUTS: image_rows, y0, y1, x0, x1
```

**Public checks:** 3 input variants. What could go wrong if coordinate conventions, TIFF provenance or calibration were assumed in slice a rectangular numerical subarray?

### Prove — unfamiliar transfer

Given stack_data in (Z,Y,X) order, slice selected z and bounding rectangle into crop. Set crop_size and source_yx=(y0,x0).

```python
# I02-G01 | PROVE | Slice a rectangular numerical subarray
# TASK: Given stack_data in (Z,Y,X) order, slice selected z and bounding
#   rectangle into crop. Set crop_size and source_yx=(y0,x0).
# INPUTS: stack_data, z, y0, y1, x0, x1
```

**Public checks:** 3 input variants. What could go wrong if coordinate conventions, TIFF provenance or calibration were assumed in slice a rectangular numerical subarray?

**Debug task:** Diagnose one mistake in slice a rectangular numerical subarray and demonstrate how changed-input Python checks would detect it.

**Misconception:** A PNG or synthetic TIFF automatically provides correct raw microscope units and acquisition metadata.

**Scientific interpretation boundary:** Published HPA/Witz notebook PNG is authentic visual content but not calibrated raw fluorescence; the in-memory TIFF examples are synthetic, and their OME text is a claim, not validated OME metadata.

## I02-G02 — Distinguish NumPy views from independent copies

**Purpose:** Unintended changes to original pixel data can invalidate an audit and make an analysis irreproducible.

Basic NumPy slices normally return *views* into source arrays. Changing a view can alter original stored values.

An explicit `.copy()` creates independent storage so downstream mask and display transformations cannot alter original pixels.

Treat original image arrays as immutable in scientific pipelines unless deliberate in-place edits are documented.

**Predict:** Will changing a slice affect the source?

**Runnable worked example (not the Apply/Prove answer):**

```python
import numpy as np
original=np.array([[1,2],[3,4]])
view=original[:1,:]
safe=view.copy()
view[0,0]=99
print(original.tolist(),safe.tolist())
```

**Prediction feedback:** Basic slices are views; `.copy()` protects original storage.

**Guided reasoning:**

1. Identify array shape, declared axes, image source and the requested output.
2. Predict the example, run it in real Python and change a bound or record.
3. Explain which result is data processing and which biological conclusion is unsupported.

**Experiment and investigate:**

- Try alternative bounds or empty inputs when the contract permits.
- Compare a view and a copy or inspect a TIFF tag explicitly.
- State what calibration and source information would be necessary for real microscopy.

### Apply — changed-input practice

Create source array from rows; make view=source[:,:2] and safe_copy=view.copy(). Record before=int(source[0,0]), then set view[0,0]=mark. Set source_changed and copy_unchanged booleans.

```python
# I02-G02 | APPLY | Distinguish NumPy views from independent copies
# TASK: Create source array from rows; make view=source[:,:2] and
#   safe_copy=view.copy(). Record before=int(source[0,0]), then set
#   view[0,0]=mark. Set source_changed and copy_unchanged booleans.
# INPUTS: rows, mark
```

**Public checks:** 3 input variants. What could go wrong if coordinate conventions, TIFF provenance or calibration were assumed in distinguish numpy views from independent copies?

### Prove — unfamiliar transfer

Create values from readings, slice view=values[1:3], independent=values[1:3].copy(). Store initial independent values, then set view[0]=replacement. Set original_after=int(values[1]) and protected=bool(independent[0]==initial).

```python
# I02-G02 | PROVE | Distinguish NumPy views from independent copies
# TASK: Create values from readings, slice view=values[1:3],
#   independent=values[1:3].copy(). Store initial independent values, then set
#   view[0]=replacement. Set original_after=int(values[1]) and
#   protected=bool(independent[0]==initial).
# INPUTS: readings, replacement
```

**Public checks:** 3 input variants. What could go wrong if coordinate conventions, TIFF provenance or calibration were assumed in distinguish numpy views from independent copies?

**Debug task:** Diagnose one mistake in distinguish numpy views from independent copies and demonstrate how changed-input Python checks would detect it.

**Misconception:** A PNG or synthetic TIFF automatically provides correct raw microscope units and acquisition metadata.

**Scientific interpretation boundary:** Published HPA/Witz notebook PNG is authentic visual content but not calibrated raw fluorescence; the in-memory TIFF examples are synthetic, and their OME text is a claim, not validated OME metadata.

## I02-G03 — Crop a documented image region

**Purpose:** A crop is only interpretable if its exact source bounds are retained.

Extracting an ROI from a real file is a pixel-selection operation, not object detection. Use explicit row/column bounds and preserve full-image dimensions.

For the credited Witz/HPA PNG, cropping demonstrates genuine RGB-array operations but cannot recover original fluorescence intensities or calibration.

Record the bounding rectangle and avoid interpreting crop mean as biological signal.

**Predict:** Predict the displayed output and its scientific limitation.

**Runnable worked example (not the Apply/Prove answer):**

```python
from PIL import Image
import numpy as np
rgb=np.asarray(Image.open(image_path).convert('RGB'))
roi=rgb[0:20,0:30]
print(roi.shape)
```

**Prediction feedback:** Use declared axes and given source; no result verifies raw-fluorescence calibration.

**Guided reasoning:**

1. Identify array shape, declared axes, image source and the requested output.
2. Predict the example, run it in real Python and change a bound or record.
3. Explain which result is data processing and which biological conclusion is unsupported.

**Experiment and investigate:**

- Try alternative bounds or empty inputs when the contract permits.
- Compare a view and a copy or inspect a TIFF tag explicitly.
- State what calibration and source information would be necessary for real microscopy.

### Apply — changed-input practice

Load image_path as RGB, make crop using bounds y0:y1 and x0:x1, set crop_shape and bounds=(y0,y1,x0,x1).

```python
# I02-G03 | APPLY | Crop a documented image region
# TASK: Load image_path as RGB, make crop using bounds y0:y1 and x0:x1, set
#   crop_shape and bounds=(y0,y1,x0,x1).
# INPUTS: image_path, y0, y1, x0, x1
```

**Public checks:** 3 input variants. What could go wrong if coordinate conventions, TIFF provenance or calibration were assumed in crop a documented image region?

### Prove — unfamiliar transfer

Read the Witz/HPA RGB figure. Create green_crop from RGB component 1 using roi_y:roi_y+roi_h and roi_x:roi_x+roi_w. Set pixels_selected and is_raw=False.

```python
# I02-G03 | PROVE | Crop a documented image region
# TASK: Read the Witz/HPA RGB figure. Create green_crop from RGB component 1
#   using roi_y:roi_y+roi_h and roi_x:roi_x+roi_w. Set pixels_selected and
#   is_raw=False.
# INPUTS: image_path, roi_y, roi_x, roi_h, roi_w
```

**Public checks:** 3 input variants. What could go wrong if coordinate conventions, TIFF provenance or calibration were assumed in crop a documented image region?

**Debug task:** Diagnose one mistake in crop a documented image region and demonstrate how changed-input Python checks would detect it.

**Misconception:** A PNG or synthetic TIFF automatically provides correct raw microscope units and acquisition metadata.

**Scientific interpretation boundary:** Published HPA/Witz notebook PNG is authentic visual content but not calibrated raw fluorescence; the in-memory TIFF examples are synthetic, and their OME text is a claim, not validated OME metadata.

## I02-G04 — Convert pixel geometry with declared calibration

**Purpose:** Physical area depends quadratically on pixel size and cannot be guessed from a rendered source figure.

To convert area from pixel² to µm², multiply by `(micrometres_per_pixel)²`. A length uses the factor only once.

These exercises provide an explicit *synthetic* pixel size; do not apply the factor to the HPA teaching screenshot as if it were microscope metadata.

Keep the units and provenance in the returned report. Reject invalid nonpositive scale to avoid nonsensical physical area.

**Predict:** Which pixel-size conversion has squared units?

**Runnable worked example (not the Apply/Prove answer):**

```python
pixel_count=50
um_per_pixel=0.2
print(pixel_count*um_per_pixel**2)
```

**Prediction feedback:** Area scales with the square of micrometres-per-pixel, using documented calibration only.

**Guided reasoning:**

1. Identify array shape, declared axes, image source and the requested output.
2. Predict the example, run it in real Python and change a bound or record.
3. Explain which result is data processing and which biological conclusion is unsupported.

**Experiment and investigate:**

- Try alternative bounds or empty inputs when the contract permits.
- Compare a view and a copy or inspect a TIFF tag explicitly.
- State what calibration and source information would be necessary for real microscopy.

### Apply — changed-input practice

Given pixel_count and synthetic um_per_pixel, compute area_um2 or None for invalid scale. Set calibration_is_source=False.

```python
# I02-G04 | APPLY | Convert pixel geometry with declared calibration
# TASK: Given pixel_count and synthetic um_per_pixel, compute area_um2 or None
#   for invalid scale. Set calibration_is_source=False.
# INPUTS: pixel_count, um_per_pixel
```

**Public checks:** 3 input variants. What could go wrong if coordinate conventions, TIFF provenance or calibration were assumed in convert pixel geometry with declared calibration?

### Prove — unfamiliar transfer

Convert pixel dimensions width_px and height_px using synthetic pixels_per_um. Set width_um,height_um and area_um2, or all None if invalid scale.

```python
# I02-G04 | PROVE | Convert pixel geometry with declared calibration
# TASK: Convert pixel dimensions width_px and height_px using synthetic
#   pixels_per_um. Set width_um,height_um and area_um2, or all None if invalid
#   scale.
# INPUTS: width_px, height_px, pixels_per_um
```

**Public checks:** 3 input variants. What could go wrong if coordinate conventions, TIFF provenance or calibration were assumed in convert pixel geometry with declared calibration?

**Debug task:** Diagnose one mistake in convert pixel geometry with declared calibration and demonstrate how changed-input Python checks would detect it.

**Misconception:** A PNG or synthetic TIFF automatically provides correct raw microscope units and acquisition metadata.

**Scientific interpretation boundary:** Published HPA/Witz notebook PNG is authentic visual content but not calibrated raw fluorescence; the in-memory TIFF examples are synthetic, and their OME text is a claim, not validated OME metadata.

## I02-G05 — Inspect multidimensional axes explicitly

**Purpose:** A 5D image shape is uninterpretable without the stored axis order.

Microscopy arrays may have time, channel, z, y and x axes. A declared layout `TCZYX` maps each axis label to a shape length.

Never assume the largest axis is X or a three-element axis is biological channels. Check the file metadata and source documentation.

`dict(zip(axis_names, arr.shape))` can summarize declared axes; unequal counts must be rejected rather than silently truncated.

**Predict:** Predict the displayed output and its scientific limitation.

**Runnable worked example (not the Apply/Prove answer):**

```python
import numpy as np
stack=np.zeros((2,3,1,4,5))
labels='TCZYX'
print(dict(zip(labels,stack.shape)))
```

**Prediction feedback:** Use declared axes and given source; no result verifies raw-fluorescence calibration.

**Guided reasoning:**

1. Identify array shape, declared axes, image source and the requested output.
2. Predict the example, run it in real Python and change a bound or record.
3. Explain which result is data processing and which biological conclusion is unsupported.

**Experiment and investigate:**

- Try alternative bounds or empty inputs when the contract permits.
- Compare a view and a copy or inspect a TIFF tag explicitly.
- State what calibration and source information would be necessary for real microscopy.

### Apply — changed-input practice

Create NumPy volume from stack_data and given axis_names. Set axis_lengths=dict(zip(axis_names,volume.shape)) only if lengths match; set valid_axes boolean.

```python
# I02-G05 | APPLY | Inspect multidimensional axes explicitly
# TASK: Create NumPy volume from stack_data and given axis_names. Set
#   axis_lengths=dict(zip(axis_names,volume.shape)) only if lengths match; set
#   valid_axes boolean.
# INPUTS: stack_data, axis_names
```

**Public checks:** 3 input variants. What could go wrong if coordinate conventions, TIFF provenance or calibration were assumed in inspect multidimensional axes explicitly?

### Prove — unfamiliar transfer

Given named_axes and dimensions list, reject length mismatch or repeated axis labels. Produce axis_map (dictionary) and axes_ok; preserve original names.

```python
# I02-G05 | PROVE | Inspect multidimensional axes explicitly
# TASK: Given named_axes and dimensions list, reject length mismatch or repeated
#   axis labels. Produce axis_map (dictionary) and axes_ok; preserve original
#   names.
# INPUTS: named_axes, dimensions
```

**Public checks:** 4 input variants. What could go wrong if coordinate conventions, TIFF provenance or calibration were assumed in inspect multidimensional axes explicitly?

**Debug task:** Diagnose one mistake in inspect multidimensional axes explicitly and demonstrate how changed-input Python checks would detect it.

**Misconception:** A PNG or synthetic TIFF automatically provides correct raw microscope units and acquisition metadata.

**Scientific interpretation boundary:** Published HPA/Witz notebook PNG is authentic visual content but not calibrated raw fluorescence; the in-memory TIFF examples are synthetic, and their OME text is a claim, not validated OME metadata.

## I02-G06 — Inspect real TIFF containers and OME metadata claims

**Purpose:** Reading TIFF pixel bytes and reading trustworthy OME axes metadata are related but distinct operations.

Pillow can create and decode a genuine TIFF container. A TIFF's ImageDescription tag may contain ordinary text or OME-XML metadata; the presence of a string beginning with `<OME` is not sufficient to validate OME conformance.

These exercises create **synthetic TIFF pixels** with explicit tag values, not an authentic raw microscopy acquisition or complete multiscale OME-TIFF.

A full OME-TIFF workflow later requires reading the raw source file, verified units, channel metadata, axes order and possibly multi-plane pages; never infer them from this toy TIFF.

**Predict:** Predict the displayed output and its scientific limitation.

**Runnable worked example (not the Apply/Prove answer):**

```python
from PIL import Image
import numpy as np, io
sample=Image.fromarray(np.array([[1,2],[3,4]],dtype=np.uint16))
b=io.BytesIO();sample.save(b,format='TIFF',tiffinfo={270:'synthetic teaching TIFF'})
b.seek(0);opened=Image.open(b)
print(opened.size,opened.tag_v2.get(270))
```

**Prediction feedback:** Use declared axes and given source; no result verifies raw-fluorescence calibration.

**Guided reasoning:**

1. Identify array shape, declared axes, image source and the requested output.
2. Predict the example, run it in real Python and change a bound or record.
3. Explain which result is data processing and which biological conclusion is unsupported.

**Experiment and investigate:**

- Try alternative bounds or empty inputs when the contract permits.
- Compare a view and a copy or inspect a TIFF tag explicitly.
- State what calibration and source information would be necessary for real microscopy.

### Apply — changed-input practice

Import Pillow, numpy and io. Save pixel_rows as uint16 TIFF to BytesIO with ImageDescription description; reopen and set recovered_shape, recovered_description, is_ome_claim based only on description beginning '<OME'.

```python
# I02-G06 | APPLY | Inspect real TIFF containers and OME metadata claims
# TASK: Import Pillow, numpy and io. Save pixel_rows as uint16 TIFF to BytesIO
#   with ImageDescription description; reopen and set recovered_shape,
#   recovered_description, is_ome_claim based only on description beginning
#   '<OME'.
# INPUTS: pixel_rows, description
```

**Public checks:** 3 input variants. What could go wrong if coordinate conventions, TIFF provenance or calibration were assumed in inspect real tiff containers and ome metadata claims?

### Prove — unfamiliar transfer

Write uint16 TIFF from intensity_rows and tag note, reopen using PIL. Set verified_pixels=bool(np.array_equal(...)), file_type='TIFF', metadata_claim=bool(note.strip().startswith('<OME')). Do not claim validated OME.

```python
# I02-G06 | PROVE | Inspect real TIFF containers and OME metadata claims
# TASK: Write uint16 TIFF from intensity_rows and tag note, reopen using PIL.
#   Set verified_pixels=bool(np.array_equal(...)), file_type='TIFF',
#   metadata_claim=bool(note.strip().startswith('<OME')). Do not claim validated
#   OME.
# INPUTS: intensity_rows, note
```

**Public checks:** 3 input variants. What could go wrong if coordinate conventions, TIFF provenance or calibration were assumed in inspect real tiff containers and ome metadata claims?

**Debug task:** Diagnose one mistake in inspect real tiff containers and ome metadata claims and demonstrate how changed-input Python checks would detect it.

**Misconception:** A PNG or synthetic TIFF automatically provides correct raw microscope units and acquisition metadata.

**Scientific interpretation boundary:** Published HPA/Witz notebook PNG is authentic visual content but not calibrated raw fluorescence; the in-memory TIFF examples are synthetic, and their OME text is a claim, not validated OME metadata.

## I02-CAPSTONE — Export a traceable ROI inspection script

**Purpose:** A researcher must state exactly which display pixels were cropped and avoid turning notebook pixels into a calibrated measurement.

Use Pillow to decode the genuine credited PNG, retain exact source coordinates and copy the selected ROI to protect source arrays.

Report width, height and mean RGB display-code values, explicitly flagging them as not raw fluorescence.

Use independent bounds for Prove and include the scientific caveat in the exported script.

**Predict:** Predict the displayed output and its scientific limitation.

**Runnable worked example (not the Apply/Prove answer):**

```python
from PIL import Image
import numpy as np
rgb=np.asarray(Image.open(image_path).convert('RGB'))
roi=rgb[0:10,0:15].copy()
print(roi.shape,'display pixels only')
```

**Prediction feedback:** Use declared axes and given source; no result verifies raw-fluorescence calibration.

**Guided reasoning:**

1. Identify array shape, declared axes, image source and the requested output.
2. Predict the example, run it in real Python and change a bound or record.
3. Explain which result is data processing and which biological conclusion is unsupported.

**Experiment and investigate:**

- Try alternative bounds or empty inputs when the contract permits.
- Compare a view and a copy or inspect a TIFF tag explicitly.
- State what calibration and source information would be necessary for real microscopy.

### Apply — changed-input practice

Load image_path as RGB. Create roi=rgb[y0:y1,x0:x1].copy(); set report with shape, bounds, rgb_mean and calibrated False. Print report.

```python
# I02-CAPSTONE | APPLY | Export a traceable ROI inspection script
# TASK: Load image_path as RGB. Create roi=rgb[y0:y1,x0:x1].copy(); set report
#   with shape, bounds, rgb_mean and calibrated False. Print report.
# INPUTS: image_path, y0, y1, x0, x1
```

**Public checks:** 3 input variants. What could go wrong if coordinate conventions, TIFF provenance or calibration were assumed in export a traceable roi inspection script?

### Prove — unfamiliar transfer

From credited RGB file select channel_index and a rectangle. Report {'source_bounds':(top,left,bottom,right),'n_display_pixels':N,'raw_data':False}. Print report.

```python
# I02-CAPSTONE | PROVE | Export a traceable ROI inspection script
# TASK: From credited RGB file select channel_index and a rectangle. Report
#   {'source_bounds':(top,left,bottom,right),'n_display_pixels':N,'raw_data':False}.
#   Print report.
# INPUTS: image_path, channel_index, top, bottom, left, right
```

**Public checks:** 3 input variants. What could go wrong if coordinate conventions, TIFF provenance or calibration were assumed in export a traceable roi inspection script?

**Debug task:** Diagnose one mistake in export a traceable roi inspection script and demonstrate how changed-input Python checks would detect it.

**Misconception:** A PNG or synthetic TIFF automatically provides correct raw microscope units and acquisition metadata.

**Scientific interpretation boundary:** Published HPA/Witz notebook PNG is authentic visual content but not calibrated raw fluorescence; the in-memory TIFF examples are synthetic, and their OME text is a claim, not validated OME metadata.

**Capstone passes:**

1. Open the credited source and inspect its actual RGB dimensions.
2. Select a precise ROI with exclusive upper bounds.
3. Copy the ROI to avoid mutating the source array.
4. Report pixel-only statistics and explicit noncalibrated status.
5. Reconstruct on a changed rectangle in Prove.

**Explain in your own words:**

- What was the source image and its raw-data status?
- How were row/column axes established?
- Which measurements require verified pixel calibration?

## I02-REVIEW — Reconstruct crop geometry without a solution

**Purpose:** A delayed independent attempt should retain coordinate and provenance reasoning.

Rebuild a crop from new bounds without using code from prior examples.

Report a pixel count and preserve the source image rather than claiming biological detection.

Use synthetic calibrated geometry only for the explicit toy examples, not for the HPA figure.

**Predict:** Predict the displayed output and its scientific limitation.

**Prediction feedback:** Use declared axes and given source; no result verifies raw-fluorescence calibration.

**Guided reasoning:**

1. Identify array shape, declared axes, image source and the requested output.
2. Predict the example, run it in real Python and change a bound or record.
3. Explain which result is data processing and which biological conclusion is unsupported.

**Experiment and investigate:**

- Try alternative bounds or empty inputs when the contract permits.
- Compare a view and a copy or inspect a TIFF tag explicitly.
- State what calibration and source information would be necessary for real microscopy.

### Apply — changed-input practice

Write pseudocode comments to check source dimensions, record ROI bounds and avoid altering source.

```python
# I02-REVIEW | APPLY | Reconstruct crop geometry without a solution
# TASK: Write pseudocode comments to check source dimensions, record ROI bounds
#   and avoid altering source.
```

**Public checks:** 0 input variants. What could go wrong if coordinate conventions, TIFF provenance or calibration were assumed in reconstruct crop geometry without a solution?

### Prove — unfamiliar transfer

From rgb image_path make selected crop defined by y_start,x_start,height,width; report selected_shape and pixel_count. Set calibrated=False.

```python
# I02-REVIEW | PROVE | Reconstruct crop geometry without a solution
# TASK: From rgb image_path make selected crop defined by
#   y_start,x_start,height,width; report selected_shape and pixel_count. Set
#   calibrated=False.
# INPUTS: image_path, y_start, x_start, height, width
```

**Public checks:** 3 input variants. What could go wrong if coordinate conventions, TIFF provenance or calibration were assumed in reconstruct crop geometry without a solution?

**Debug task:** Diagnose one mistake in reconstruct crop geometry without a solution and demonstrate how changed-input Python checks would detect it.

**Misconception:** A PNG or synthetic TIFF automatically provides correct raw microscope units and acquisition metadata.

**Scientific interpretation boundary:** Published HPA/Witz notebook PNG is authentic visual content but not calibrated raw fluorescence; the in-memory TIFF examples are synthetic, and their OME text is a claim, not validated OME metadata.

**Explain in your own words:**

- What was the source image and its raw-data status?
- How were row/column axes established?
- Which measurements require verified pixel calibration?

## Independent handoff

Export a traceable source-image crop report with pixel-only geometry and honest source limitations.

Export `inspect_image_roi.py` after completing Prove. Keep source files, units and acquisition provenance. Imported Witz/HPA PNG data are rendered RGB—not raw calibrated microscopy. Synthetic Pandas measurements have no external biological-provenance evidence. Real image segmentation and statistical inference require later chapters and independent validation.
