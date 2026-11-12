# I01 — Open a real microscopy image

**Learning mission:** Start NumPy image analysis using real Python, actual attributed Witz/HPA notebook-figure PNG bytes, dtype, axes and precise source provenance. The figure is rendered RGB rather than the original calibrated TIFF: no quantitative fluorescence claims.

**Primary resource:** [Witz, images as arrays](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/02-Images_as_arrays.ipynb). [Source image credits](../../assets/witz/CREDITS.md).

**Scientific boundary:** Source image is genuine Witz/HPA published figure, not raw microscopy TIFF; pixel arrays represent an RGB rendering. The teaching asset is a published notebook PNG derived from HPA imagery, not a raw TIFF. Its pixels can demonstrate decoding, axes and NumPy, but must not be used as calibrated fluorescence measurements.

## I01-G01 — Construct typed NumPy arrays

Array dtype matters: a microscope pixel value is a number with a storage range, not a biological measurement on its own.

NumPy arrays store homogeneous numerical elements and support vectorized work. A list of measurements can become `np.asarray(values, dtype=np.uint16)` with explicit integer type.

The distinction between list and array matters: numeric operations on arrays act elementwise; repeating a Python list with multiplication does not perform elementwise scaling.

A datatype constrains numerical range and precision. It does not tell you whether values are background-subtracted, photon counts or calibrated intensity.

**Predict:** What is the dtype and the result of adding 2?

**Run and modify:**

```python
import numpy as np
scores=np.asarray([10,20,30],dtype=np.uint16)
print(scores.dtype,scores.shape)
print((scores+2).tolist())
```

**Explanation:** uint16, shape (3,), and [12,22,32]. NumPy adds elementwise.

### Walkthrough

1. Predict a file, array or coordinate output before running the code.
2. Run genuine Python, then change a coordinate or array input.
3. Explain the source provenance and scientific interpretation.

### Investigate

- Try different pixel coordinates or numeric arrays.
- Check dtype, shape and data preservation for new inputs.
- Identify any claim that would require original raw fluorescence TIFF.

### Apply

Import numpy; create pixels as a uint16 array from values. Set pixel_count and doubled as a new array of twice the values; preserve values.

```python
# I01-G01 | APPLY | Construct typed NumPy arrays
# TASK: Import numpy; create pixels as a uint16 array from values. Set pixel_count
#   and doubled as a new array of twice the values; preserve values.
# INPUTS: values
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

### Prove independently

From raw_counts create a float32 NumPy array intensities. Set shifted=intensities+offset and total=float(intensities.sum()); keep raw_counts unchanged.

```python
# I01-G01 | PROVE | Construct typed NumPy arrays
# TASK: From raw_counts create a float32 NumPy array intensities. Set
#   shifted=intensities+offset and total=float(intensities.sum()); keep raw_counts
#   unchanged.
# INPUTS: raw_counts, offset
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

**Debug:** Locate an incorrect assumption in construct typed numpy arrays: how would you rule out swapped axes, absent calibration or invented data?

**Misconception:** A rendered HPA/Witz notebook figure is identical to a calibrated raw fluorescence TIFF.

**Scientific limit:** Credited Witz/HPA notebook output is genuine published biological imagery, but RGB PNG pixels are display values, NOT original raw/calibrated fluorescence. Synthetic small arrays are marked as exercises.

## I01-G02 — Inspect array shape and dimensions

The difference between a one-dimensional measurement list and a 2D image is encoded in shape, not in the filename.

A NumPy array's `shape` is its axis lengths; `ndim` is the number of axes. A 2D image is often `(rows, columns)`, not `(x,y)`.

Image geometry may include channel, z and time axes. Always inspect shape and metadata before assuming axis meaning.

The number of pixels is `arr.size`. Array shape alone cannot tell you whether a given axis is a biological channel or timepoint.

**Predict:** How many rows, columns and dimensions exist?

**Run and modify:**

```python
import numpy as np
img=np.array([[1,2,3],[4,5,6]])
print(img.shape,img.ndim,img.size)
```

**Explanation:** Shape (2,3), ndim 2 and size 6; two rows, three columns.

### Walkthrough

1. Predict a file, array or coordinate output before running the code.
2. Run genuine Python, then change a coordinate or array input.
3. Explain the source provenance and scientific interpretation.

### Investigate

- Try different pixel coordinates or numeric arrays.
- Check dtype, shape and data preservation for new inputs.
- Identify any claim that would require original raw fluorescence TIFF.

### Apply

Convert rows to a NumPy array. Set shape as a tuple, dimensions as an integer and element_count. Handle empty rows as a 1D empty array.

```python
# I01-G02 | APPLY | Inspect array shape and dimensions
# TASK: Convert rows to a NumPy array. Set shape as a tuple, dimensions as an
#   integer and element_count. Handle empty rows as a 1D empty array.
# INPUTS: rows
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

### Prove independently

Convert stack_data into NumPy array stack. Set plane_count=stack.shape[0], pixel_count=stack.size and dimensionality=stack.ndim.

```python
# I01-G02 | PROVE | Inspect array shape and dimensions
# TASK: Convert stack_data into NumPy array stack. Set plane_count=stack.shape[0],
#   pixel_count=stack.size and dimensionality=stack.ndim.
# INPUTS: stack_data
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

**Debug:** Locate an incorrect assumption in inspect array shape and dimensions: how would you rule out swapped axes, absent calibration or invented data?

**Misconception:** A rendered HPA/Witz notebook figure is identical to a calibrated raw fluorescence TIFF.

**Scientific limit:** Credited Witz/HPA notebook output is genuine published biological imagery, but RGB PNG pixels are display values, NOT original raw/calibrated fluorescence. Synthetic small arrays are marked as exercises.

## I01-G03 — Index rows, columns and planes

Pixel selection must preserve the difference between zero-based Python row indexing and microscope field identifiers.

Use `array[row,column]` in that order for a 2D image; row increases downward and column increases rightward in common displayed image coordinates.

For a stack with declared order `(plane,row,column)`, a specific scalar is `stack[plane,row,column]`. This axis order is an exercise convention, never an inference from shape alone.

A scientific report should retain the original source ID, plane index and pixel coordinate with its numeric measurement.

**Predict:** What value is at plane 1, row 0, column 1?

**Run and modify:**

```python
import numpy as np
stack=np.array([[[1,2],[3,4]],[[5,6],[7,8]]])
print(stack[1,0,1])
print(stack[0].shape)
```

**Explanation:** 6; selected_plane has shape (2,2).

### Walkthrough

1. Predict a file, array or coordinate output before running the code.
2. Run genuine Python, then change a coordinate or array input.
3. Explain the source provenance and scientific interpretation.

### Investigate

- Try different pixel coordinates or numeric arrays.
- Check dtype, shape and data preservation for new inputs.
- Identify any claim that would require original raw fluorescence TIFF.

### Apply

Import numpy; create stack from planes (plane,row,column). Set selected_plane=stack[plane_index], selected_value=int(stack[plane_index,row,col]), plane_shape=selected_plane.shape.

```python
# I01-G03 | APPLY | Index rows, columns and planes
# TASK: Import numpy; create stack from planes (plane,row,column). Set
#   selected_plane=stack[plane_index],
#   selected_value=int(stack[plane_index,row,col]),
#   plane_shape=selected_plane.shape.
# INPUTS: planes, plane_index, row, col
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

### Prove independently

Given volume (z,y,x), calculate voxel_value=int(volume[z,y,x]) and xy_coordinate=(x,y); set slice_shape for that z. Do not swap x and y.

```python
# I01-G03 | PROVE | Index rows, columns and planes
# TASK: Given volume (z,y,x), calculate voxel_value=int(volume[z,y,x]) and
#   xy_coordinate=(x,y); set slice_shape for that z. Do not swap x and y.
# INPUTS: volume, z, y, x
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

**Debug:** Locate an incorrect assumption in index rows, columns and planes: how would you rule out swapped axes, absent calibration or invented data?

**Misconception:** A rendered HPA/Witz notebook figure is identical to a calibrated raw fluorescence TIFF.

**Scientific limit:** Credited Witz/HPA notebook output is genuine published biological imagery, but RGB PNG pixels are display values, NOT original raw/calibrated fluorescence. Synthetic small arrays are marked as exercises.

## I01-G04 — Document a genuine source image

Image provenance is essential: a published illustration and a raw fluorescence file support fundamentally different claims.

The source figure used here is a real Witz notebook output derived from Human Protein Atlas fluorescence imagery, credited under CC BY-SA 3.0. It is not the raw source TIFF and includes plotting/display transformations.

A minimum provenance record identifies source, filename, license, intended use and whether raw calibration is available. Never guess pixel size, exposure or axes from a screenshot.

The exercise makes explicit the distinction between real biological origin, numerical display pixels and quantitative scientific measurements. The raw Witz TIFF remains necessary for calibrated analysis.

**Predict:** Does authentic biological origin make a rendered PNG a calibrated raw image?

**Run and modify:**

```python
metadata={'origin':'Witz / Human Protein Atlas','format':'rendered PNG','calibrated':False}
print(metadata['origin'])
print(metadata['calibrated'])
```

**Explanation:** No. The publication is authentic, but the rendered notebook figure is not calibrated raw fluorescence.

### Walkthrough

1. Predict a file, array or coordinate output before running the code.
2. Run genuine Python, then change a coordinate or array input.
3. Explain the source provenance and scientific interpretation.

### Investigate

- Try different pixel coordinates or numeric arrays.
- Check dtype, shape and data preservation for new inputs.
- Identify any claim that would require original raw fluorescence TIFF.

### Apply

Build provenance={'filename':filename,'source_url':source_url,'license':license_name,'raw_calibrated':False}. Set can_measure_absolute=False. Preserve all incoming strings.

```python
# I01-G04 | APPLY | Document a genuine source image
# TASK: Build
#   provenance={'filename':filename,'source_url':source_url,'license':license_name,'raw_calibrated':False}.
#   Set can_measure_absolute=False. Preserve all incoming strings.
# INPUTS: filename, source_url, license_name
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

### Prove independently

Create image_record={'id':image_id,'origin':origin,'display_only':True,'pixel_size_um':None} and provenance_ok=bool(origin.strip()). Do not fabricate calibration.

```python
# I01-G04 | PROVE | Document a genuine source image
# TASK: Create
#   image_record={'id':image_id,'origin':origin,'display_only':True,'pixel_size_um':None}
#   and provenance_ok=bool(origin.strip()). Do not fabricate calibration.
# INPUTS: image_id, origin
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

**Debug:** Locate an incorrect assumption in document a genuine source image: how would you rule out swapped axes, absent calibration or invented data?

**Misconception:** A rendered HPA/Witz notebook figure is identical to a calibrated raw fluorescence TIFF.

**Scientific limit:** Credited Witz/HPA notebook output is genuine published biological imagery, but RGB PNG pixels are display values, NOT original raw/calibrated fluorescence. Synthetic small arrays are marked as exercises.

## I01-G05 — Decode the credited image into pixels

Image processing starts when actual file bytes are decoded into a NumPy array, not when a picture is displayed beside code.

The app makes the existing credited Witz/HPA notebook figure accessible as `image_path`. `PIL.Image.open` decodes real PNG bytes, then `np.asarray` exposes pixel values with shape and dtype.

This demonstrates real image-file handling rather than simulated output. Because the asset is a rendered figure, its pixel values reflect a visualization; they must not be reported as calibrated fluorescence intensities.

For quantitative localization or cell detection, the source TIFF and acquisition metadata are required. A missing file should produce a clear error, not silently substitute invented pixels.

**Predict:** Why does a decoded RGB image usually have three dimensions?

**Run and modify:**

```python
from PIL import Image
import numpy as np
img=np.asarray(Image.open(image_path).convert('RGB'))
print(img.shape,img.dtype)
print(img[0,0].tolist())
```

**Explanation:** Rows, columns and three stored display-color components. These are not independently calibrated biological channels.

### Walkthrough

1. Predict a file, array or coordinate output before running the code.
2. Run genuine Python, then change a coordinate or array input.
3. Explain the source provenance and scientific interpretation.

### Investigate

- Try different pixel coordinates or numeric arrays.
- Check dtype, shape and data preservation for new inputs.
- Identify any claim that would require original raw fluorescence TIFF.

### Apply

Open the credited image_path with Pillow, convert to RGB, and make NumPy array image. Set height,width=int sizes, channels, dtype_name and pixel_value as RGB list at (sample_row,sample_col).

```python
# I01-G05 | APPLY | Decode the credited image into pixels
# TASK: Open the credited image_path with Pillow, convert to RGB, and make NumPy
#   array image. Set height,width=int sizes, channels, dtype_name and pixel_value as
#   RGB list at (sample_row,sample_col).
# INPUTS: image_path, sample_row, sample_col
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

### Prove independently

Open image_path and produce rgb NumPy array plus channel_plane=rgb[:,:,color_index]. Set plane_shape, pixel_at=int(channel_plane[row,col]), distinct_levels=int(np.unique(channel_plane).size).

```python
# I01-G05 | PROVE | Decode the credited image into pixels
# TASK: Open image_path and produce rgb NumPy array plus
#   channel_plane=rgb[:,:,color_index]. Set plane_shape,
#   pixel_at=int(channel_plane[row,col]),
#   distinct_levels=int(np.unique(channel_plane).size).
# INPUTS: image_path, color_index, row, col
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

**Debug:** Locate an incorrect assumption in decode the credited image into pixels: how would you rule out swapped axes, absent calibration or invented data?

**Misconception:** A rendered HPA/Witz notebook figure is identical to a calibrated raw fluorescence TIFF.

**Scientific limit:** Credited Witz/HPA notebook output is genuine published biological imagery, but RGB PNG pixels are display values, NOT original raw/calibrated fluorescence. Synthetic small arrays are marked as exercises.

## I01-G06 — Inspect RGB components without inventing channels

Rendered RGB display colors can be separated computationally, but they are not raw detector-channel measurements.

A decoded RGB array has shape `(rows,columns,3)`. `arr[:,:,0]`, `arr[:,:,1]` and `arr[:,:,2]` extract red, green and blue output components respectively.

Compute a component summary to learn indexing and floating-point conversion. The value describes rendered pixels and any overlays, not molecules, exposure-normalized signal or biological abundance.

A true multi-channel TIFF requires its actual stored channel axis and acquisition record. The image shown here is explicitly a teaching figure from Witz's notebook.

**Predict:** What does the final axis represent for this published PNG?

**Run and modify:**

```python
from PIL import Image
import numpy as np
arr=np.asarray(Image.open(image_path).convert('RGB'))
print(arr.shape[-1])
print(int(arr[:,:,0].max()))
```

**Explanation:** Three rendered RGB color components, not verified raw detector channels.

### Walkthrough

1. Predict a file, array or coordinate output before running the code.
2. Run genuine Python, then change a coordinate or array input.
3. Explain the source provenance and scientific interpretation.

### Investigate

- Try different pixel coordinates or numeric arrays.
- Check dtype, shape and data preservation for new inputs.
- Identify any claim that would require original raw fluorescence TIFF.

### Apply

Decode image_path as RGB and select color_index into component. Set component_mean=float(component.mean()), component_min=int(...min()) and component_shape.

```python
# I01-G06 | APPLY | Inspect RGB components without inventing channels
# TASK: Decode image_path as RGB and select color_index into component. Set
#   component_mean=float(component.mean()), component_min=int(...min()) and
#   component_shape.
# INPUTS: image_path, color_index
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

### Prove independently

Read credited RGB image, compute red,green,blue component arrays, and produce means=[float(x.mean()) for x in ...] and brightest_component=int(np.argmax(means)). Do not label it the highest-expressing protein.

```python
# I01-G06 | PROVE | Inspect RGB components without inventing channels
# TASK: Read credited RGB image, compute red,green,blue component arrays, and
#   produce means=[float(x.mean()) for x in ...] and
#   brightest_component=int(np.argmax(means)). Do not label it the
#   highest-expressing protein.
# INPUTS: image_path, offset
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

**Debug:** Locate an incorrect assumption in inspect rgb components without inventing channels: how would you rule out swapped axes, absent calibration or invented data?

**Misconception:** A rendered HPA/Witz notebook figure is identical to a calibrated raw fluorescence TIFF.

**Scientific limit:** Credited Witz/HPA notebook output is genuine published biological imagery, but RGB PNG pixels are display values, NOT original raw/calibrated fluorescence. Synthetic small arrays are marked as exercises.

## I01-G07 — Explain pixel coordinates precisely

Confusing x/y with row/column can silently select the wrong location in an image.

NumPy uses `(row,column)` for 2D image indexing. Common image-display coordinates describe the same location as `(x=column,y=row)`.

Python indexing begins at zero. Positive rows usually move downward in a rendered image; a microscope's physical stage coordinates follow their own conventions.

Preserve both coordinate conventions in traceable output. Changing display orientation never proves the physical sample axis or its pixel size.

**Predict:** Which NumPy element corresponds to displayed (x=1,y=2)?

**Run and modify:**

```python
import numpy as np
arr=np.arange(12).reshape(3,4)
row,col=2,1
print(int(arr[row,col]))
print((col,row))
```

**Explanation:** arr[2,1], value 9. The coordinate pair reverses to (column,row).

### Walkthrough

1. Predict a file, array or coordinate output before running the code.
2. Run genuine Python, then change a coordinate or array input.
3. Explain the source provenance and scientific interpretation.

### Investigate

- Try different pixel coordinates or numeric arrays.
- Check dtype, shape and data preservation for new inputs.
- Identify any claim that would require original raw fluorescence TIFF.

### Apply

Create image array from rows. Select intensity=int(image[row,col]); set display_xy=(col,row) and dimensions=(height,width).

```python
# I01-G07 | APPLY | Explain pixel coordinates precisely
# TASK: Create image array from rows. Select intensity=int(image[row,col]); set
#   display_xy=(col,row) and dimensions=(height,width).
# INPUTS: rows, row, col
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

### Prove independently

Decode image_path as RGB; from selected row, col and component_index create coordinate_report={'x':col,'y':row,'component':component_index,'value':int(pixel)}.

```python
# I01-G07 | PROVE | Explain pixel coordinates precisely
# TASK: Decode image_path as RGB; from selected row, col and component_index create
#   coordinate_report={'x':col,'y':row,'component':component_index,'value':int(pixel)}.
# INPUTS: image_path, row, col, component_index
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

**Debug:** Locate an incorrect assumption in explain pixel coordinates precisely: how would you rule out swapped axes, absent calibration or invented data?

**Misconception:** A rendered HPA/Witz notebook figure is identical to a calibrated raw fluorescence TIFF.

**Scientific limit:** Credited Witz/HPA notebook output is genuine published biological imagery, but RGB PNG pixels are display values, NOT original raw/calibrated fluorescence. Synthetic small arrays are marked as exercises.

## I01-G08 — Interpret pixel dtype and numerical limits

A high display pixel value is not evidence of molecular abundance, and dtype limits can hide overflow.

For an unsigned 8-bit RGB image, 0–255 are display-code values; NumPy `np.iinfo` gives type bounds, not observed biological concentrations.

`arr.min()` and `arr.max()` describe the actual stored pixel range. The dtype's maximum may exceed the observed maximum.

For raw fluorescence, detector bit depth, gain, saturation, calibration and background handling are separate issues. Do not infer them from a notebook PNG.

**Predict:** Does a maximum of 255 mean a protein is saturated?

**Run and modify:**

```python
import numpy as np
arr=np.array([0,128,255],dtype=np.uint8)
print(np.iinfo(arr.dtype).max)
print(int(arr.max()))
```

**Explanation:** No. It is the maximum storage code for uint8 and cannot establish raw detector saturation.

### Walkthrough

1. Predict a file, array or coordinate output before running the code.
2. Run genuine Python, then change a coordinate or array input.
3. Explain the source provenance and scientific interpretation.

### Investigate

- Try different pixel coordinates or numeric arrays.
- Check dtype, shape and data preservation for new inputs.
- Identify any claim that would require original raw fluorescence TIFF.

### Apply

Create NumPy uint8 array from pixels. Set dtype_name, observed_min, observed_max and storage_max using np.iinfo, without interpreting as fluorescence concentration.

```python
# I01-G08 | APPLY | Interpret pixel dtype and numerical limits
# TASK: Create NumPy uint8 array from pixels. Set dtype_name, observed_min,
#   observed_max and storage_max using np.iinfo, without interpreting as
#   fluorescence concentration.
# INPUTS: pixels
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

### Prove independently

Decode image_path to RGB array. Set dtype_name, observed_range=(min,max), display_ceiling=np.iinfo(dtype).max, calibrated=False.

```python
# I01-G08 | PROVE | Interpret pixel dtype and numerical limits
# TASK: Decode image_path to RGB array. Set dtype_name, observed_range=(min,max),
#   display_ceiling=np.iinfo(dtype).max, calibrated=False.
# INPUTS: image_path, unused
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

**Debug:** Locate an incorrect assumption in interpret pixel dtype and numerical limits: how would you rule out swapped axes, absent calibration or invented data?

**Misconception:** A rendered HPA/Witz notebook figure is identical to a calibrated raw fluorescence TIFF.

**Scientific limit:** Credited Witz/HPA notebook output is genuine published biological imagery, but RGB PNG pixels are display values, NOT original raw/calibrated fluorescence. Synthetic small arrays are marked as exercises.

## I01-CAPSTONE — Create an honest Witz/HPA image-inspection report

Opening actual file bytes must produce a traceable shape, dtype and pixel observation without pretending the notebook PNG is raw data.

Decode the attributed published notebook figure using Pillow and NumPy. Record axes as RGB display axes; evaluate a chosen pixel and a 2D display component.

The output contains actual numerical pixels derived from the bundled image, but no calibrated fluorescence, nuclear localization or count can be inferred.

An honest result describes data origin and the limits of what was loaded. A separate raw TIFF data stream is required for later quantitative workflows.

**Predict:** What does the source file establish, and what does it not establish?

**Run and modify:**

```python
from PIL import Image
import numpy as np
rgb=np.asarray(Image.open(image_path).convert('RGB'))
print('shape',rgb.shape,'dtype',rgb.dtype)
print('RGB preview only; not calibrated raw fluorescence')
```

**Explanation:** Compute from the actual image bytes, and do not infer calibrated raw intensity.

### Walkthrough

1. Predict a file, array or coordinate output before running the code.
2. Run genuine Python, then change a coordinate or array input.
3. Explain the source provenance and scientific interpretation.

### Investigate

- Try different pixel coordinates or numeric arrays.
- Check dtype, shape and data preservation for new inputs.
- Identify any claim that would require original raw fluorescence TIFF.

### Apply

Decode image_path as RGB; create image_report={'height':H,'width':W,'components':3,'dtype':'uint8','source':'Witz/HPA rendered figure','calibrated':False,'component_mean':float(selected channel mean)}. Print the source and pixel shape.

```python
# I01-CAPSTONE | APPLY | Create an honest Witz/HPA image-inspection report
# TASK: Decode image_path as RGB; create
#   image_report={'height':H,'width':W,'components':3,'dtype':'uint8','source':'Witz/HPA
#   rendered figure','calibrated':False,'component_mean':float(selected channel
#   mean)}. Print the source and pixel shape.
# INPUTS: image_path, component_index
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

### Prove independently

Decode the same credited RGB figure, and build audit={'shape':tuple(rgb.shape),'component':component_index,'pixel':int(rgb[row,col,component_index]),'raw_calibrated':False}. Print audit and preserve the actual numeric pixel.

```python
# I01-CAPSTONE | PROVE | Create an honest Witz/HPA image-inspection report
# TASK: Decode the same credited RGB figure, and build
#   audit={'shape':tuple(rgb.shape),'component':component_index,'pixel':int(rgb[row,col,component_index]),'raw_calibrated':False}.
#   Print audit and preserve the actual numeric pixel.
# INPUTS: image_path, component_index, row, col
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

**Debug:** Locate an incorrect assumption in create an honest witz/hpa image-inspection report: how would you rule out swapped axes, absent calibration or invented data?

**Misconception:** A rendered HPA/Witz notebook figure is identical to a calibrated raw fluorescence TIFF.

**Scientific limit:** Credited Witz/HPA notebook output is genuine published biological imagery, but RGB PNG pixels are display values, NOT original raw/calibrated fluorescence. Synthetic small arrays are marked as exercises.

### Capstone passes

1. Load the credited Witz/HPA source figure into a NumPy array, not a made-up pixel array.
2. Inspect actual shape, dtype and channel count.
3. Read a chosen RGB component and compute a display-pixel summary.
4. Record source provenance and explicit noncalibration.
5. Rebuild Prove using changed pixel coordinates without reusing the Apply program.

**Explain:** What exactly is the provenance and format of this figure? What does a displayed RGB pixel value represent, and what can it not establish? How do row/column order and missing calibration affect interpretation?

## I01-REVIEW — Read a genuine image independently

Unseen coordinate requests should be solved from the original file bytes without consulting the previous capstone code.

Reconstruct the decoding pipeline from the source and explicit RGB axes.

Report source limitations even if the numeric pixel lookup succeeds.

A returned display pixel describes a rendered image, not calibrated microscopy.

**Predict:** What does the source file establish, and what does it not establish?

**Explanation:** Compute from the actual image bytes, and do not infer calibrated raw intensity.

### Walkthrough

1. Predict a file, array or coordinate output before running the code.
2. Run genuine Python, then change a coordinate or array input.
3. Explain the source provenance and scientific interpretation.

### Investigate

- Try different pixel coordinates or numeric arrays.
- Check dtype, shape and data preservation for new inputs.
- Identify any claim that would require original raw fluorescence TIFF.

### Apply

Write pseudocode comments for loading source pixels and documenting provenance, shape, and pixel coordinate conversion.

```python
# I01-REVIEW | APPLY | Read a genuine image independently
# TASK: Write pseudocode comments for loading source pixels and documenting
#   provenance, shape, and pixel coordinate conversion.
```

**Checks:** 0 public changed-input scenarios. Passing them is practice, not certification.

### Prove independently

Open the credited image_path as RGB and create result={'xy':(col,row),'value':int(rgb[row,col,color_index]),'dimensions':(height,width),'calibrated':False}. Print result.

```python
# I01-REVIEW | PROVE | Read a genuine image independently
# TASK: Open the credited image_path as RGB and create
#   result={'xy':(col,row),'value':int(rgb[row,col,color_index]),'dimensions':(height,width),'calibrated':False}.
#   Print result.
# INPUTS: image_path, row, col, color_index
```

**Checks:** 3 public changed-input scenarios. Passing them is practice, not certification.

**Debug:** Locate an incorrect assumption in read a genuine image independently: how would you rule out swapped axes, absent calibration or invented data?

**Misconception:** A rendered HPA/Witz notebook figure is identical to a calibrated raw fluorescence TIFF.

**Scientific limit:** Credited Witz/HPA notebook output is genuine published biological imagery, but RGB PNG pixels are display values, NOT original raw/calibrated fluorescence. Synthetic small arrays are marked as exercises.

**Explain:** What exactly is the provenance and format of this figure? What does a displayed RGB pixel value represent, and what can it not establish? How do row/column order and missing calibration affect interpretation?

## Export, provenance and next steps

Export `inspect_witz_image.py` to run under local Python with NumPy/Pillow installed. The browser makes the PNG available at `/home/pyodide/witz_published_figure.png`; local use requires replacing that path with the actual file path. The source is a rendered notebook visualization. An original TIFF with explicit axes and acquisition metadata is required for defensible quantitative fluorescence analysis.
