# I04 — Display an interpretable microscopy image

**Status:** learner-pilot chapter. Successful public checks are practice, not independent or retained mastery.

Create actual Matplotlib outputs for observations, distributions and microscopy figure panels. Work on credited Witz/HPA rendered PNG pixels while keeping display contrast separate from raw data and biological replication.

**Primary reference:** [Witz, Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/03-More_on_images.ipynb); source image and licensing [credits](../../assets/witz/CREDITS.md). Supporting principles: NumPy, Pandas, Matplotlib and Introduction to Bioimage Analysis.

**Scientific limit:** Displayed RGB figure pixel statistics are not calibrated biological fluorescence intensity.

## I04-G01 — Build a labeled Matplotlib figure

**Purpose:** A numerical report is not interpretable without explicit units, axes and the plotted data source.

Matplotlib's object-oriented interface creates a figure and axes with `fig, ax = plt.subplots()`, then plots data on that axes.

A title and labels are part of scientific communication; missing units or source identity can make a correct-looking plot misleading.

The app renders the real Matplotlib figure produced by Python rather than drawing a fake schematic.

**Predict:** Predict the plotted data, labels and scientific limitation.

**Runnable worked example (not the Apply/Prove answer):**

```python
import matplotlib.pyplot as plt
fig,ax=plt.subplots()
ax.plot([1,2,3],[2,5,4])
ax.set(xlabel='Field',ylabel='Signal (a.u.)',title='Illustrative counts')
print(len(fig.axes))
```

**Prediction feedback:** A figure reflects actual Python Matplotlib objects and the input data, not a simulated picture or certified scientific result.

**Guided reasoning:**

1. Identify plotted data, units, sample/field identity and expected axes.
2. Run actual Python; inspect the figure generated in the results panel.
3. Change a scientific input or display limit and explain which interpretation is still unsupported.

**Experiment and investigate:**

- Try a changed label, data series or histogram bin count.
- Check plot object counts against the data and unchanged source arrays.
- Explain the limits of RGB rendered imagery and grouped biological evidence.

### Apply — changed-input practice

Using times and signals, create fig,ax with a line plot; set xlabel='Time (min)', ylabel='Signal (a.u.)', title=sample_name. Set plotted_points=len(times).

```python
# I04-G01 | APPLY | Build a labeled Matplotlib figure
# TASK: Using times and signals, create fig,ax with a line plot; set xlabel='Time
#   (min)', ylabel='Signal (a.u.)', title=sample_name. Set
#   plotted_points=len(times).
# INPUTS: times, signals, sample_name
```

**Public checks:** 3 input variants. How could build a labeled matplotlib figure mislead if units, display range or biological sampling were not checked?

### Prove — unfamiliar transfer

Plot positions vs distance_um using Matplotlib. Set plot_title as ID + ' displacement', x_label='Frame', y_label='Distance (µm)'; assign those to ax, and line_count=len(ax.lines).

```python
# I04-G01 | PROVE | Build a labeled Matplotlib figure
# TASK: Plot positions vs distance_um using Matplotlib. Set plot_title as ID + '
#   displacement', x_label='Frame', y_label='Distance (µm)'; assign those to ax,
#   and line_count=len(ax.lines).
# INPUTS: positions, distance_um, sample_id
```

**Public checks:** 3 input variants. How could build a labeled matplotlib figure mislead if units, display range or biological sampling were not checked?

**Debug task:** Find a realistic plotting or labeling mistake in build a labeled matplotlib figure and demonstrate a changed-input test.

**Misconception:** A bright, well-styled plot is inherently a defensible biological conclusion.

**Scientific interpretation boundary:** Rendered Witz/HPA notebook PNG provides authentic display pixels only, not raw calibrated fluorescence; simulated numeric values and microscope fields are not biological replicates.

## I04-G02 — Compare line and scatter representations

**Purpose:** Connected lines imply ordered relationships, while scatter plots reveal individual observations.

`ax.plot` connects points in specified order, which suits temporal trajectories only when the order is meaningful.

`ax.scatter` shows individual points without inventing a connected path. Choose based on experimental design, not visual smoothness.

A line across unrelated biological replicates can imply continuity that does not exist.

**Predict:** Predict the plotted data, labels and scientific limitation.

**Runnable worked example (not the Apply/Prove answer):**

```python
import matplotlib.pyplot as plt
fig,ax=plt.subplots()
ax.plot([0,1,2],[1,3,2],label='ordered')
ax.scatter([0,1,2],[1,3,2])
print(len(ax.lines),len(ax.collections))
```

**Prediction feedback:** A figure reflects actual Python Matplotlib objects and the input data, not a simulated picture or certified scientific result.

**Guided reasoning:**

1. Identify plotted data, units, sample/field identity and expected axes.
2. Run actual Python; inspect the figure generated in the results panel.
3. Change a scientific input or display limit and explain which interpretation is still unsupported.

**Experiment and investigate:**

- Try a changed label, data series or histogram bin count.
- Check plot object counts against the data and unchanged source arrays.
- Explain the limits of RGB rendered imagery and grouped biological evidence.

### Apply — changed-input practice

Create fig,ax, plot times/signals as a line and scatter the same data. Set n_lines and n_scatter_groups from ax; label x='Time (min)' and y='Intensity (a.u.)'.

```python
# I04-G02 | APPLY | Compare line and scatter representations
# TASK: Create fig,ax, plot times/signals as a line and scatter the same data. Set
#   n_lines and n_scatter_groups from ax; label x='Time (min)' and y='Intensity
#   (a.u.)'.
# INPUTS: times, signals
```

**Public checks:** 3 input variants. How could compare line and scatter representations mislead if units, display range or biological sampling were not checked?

### Prove — unfamiliar transfer

Display numeric batch_index and observed as scatter only (no connected line); set scatter_points=count, connected=False, xlabel='Batch index', ylabel='Observed value'.

```python
# I04-G02 | PROVE | Compare line and scatter representations
# TASK: Display numeric batch_index and observed as scatter only (no connected
#   line); set scatter_points=count, connected=False, xlabel='Batch index',
#   ylabel='Observed value'.
# INPUTS: batch_index, observed
```

**Public checks:** 3 input variants. How could compare line and scatter representations mislead if units, display range or biological sampling were not checked?

**Debug task:** Find a realistic plotting or labeling mistake in compare line and scatter representations and demonstrate a changed-input test.

**Misconception:** A bright, well-styled plot is inherently a defensible biological conclusion.

**Scientific interpretation boundary:** Rendered Witz/HPA notebook PNG provides authentic display pixels only, not raw calibrated fluorescence; simulated numeric values and microscope fields are not biological replicates.

## I04-G03 — Show a numerical distribution honestly

**Purpose:** Histograms summarize bins of observations, not independent biological replicate counts.

`ax.hist(values,bins=...)` returns bin heights and boundaries; the plotted histogram uses observations in the provided array.

Changing bin count changes apparent distribution even when data do not change. Record bins and sampling unit.

If inputs represent microscope fields from the same culture, their plotted `n` is the field count, not independent biological replication.

**Predict:** Predict the plotted data, labels and scientific limitation.

**Runnable worked example (not the Apply/Prove answer):**

```python
import matplotlib.pyplot as plt
fig,ax=plt.subplots()
counts,edges,patches=ax.hist([1,1,2,3],bins=3)
print(int(counts.sum()))
```

**Prediction feedback:** A figure reflects actual Python Matplotlib objects and the input data, not a simulated picture or certified scientific result.

**Guided reasoning:**

1. Identify plotted data, units, sample/field identity and expected axes.
2. Run actual Python; inspect the figure generated in the results panel.
3. Change a scientific input or display limit and explain which interpretation is still unsupported.

**Experiment and investigate:**

- Try a changed label, data series or histogram bin count.
- Check plot object counts against the data and unchanged source arrays.
- Explain the limits of RGB rendered imagery and grouped biological evidence.

### Apply — changed-input practice

Plot histogram of measurements with n_bins, set observation_count=int(counts.sum()), bar_count=len(patches), xlabel='Field score', ylabel='Fields (not replicates)'.

```python
# I04-G03 | APPLY | Show a numerical distribution honestly
# TASK: Plot histogram of measurements with n_bins, set
#   observation_count=int(counts.sum()), bar_count=len(patches), xlabel='Field
#   score', ylabel='Fields (not replicates)'.
# INPUTS: measurements, n_bins
```

**Public checks:** 3 input variants. How could show a numerical distribution honestly mislead if units, display range or biological sampling were not checked?

### Prove — unfamiliar transfer

Build histogram for sample_values using bins=bin_number, set total=int(heights.sum()), rightmost=float(edges[-1]), and label y='Measurement count'.

```python
# I04-G03 | PROVE | Show a numerical distribution honestly
# TASK: Build histogram for sample_values using bins=bin_number, set
#   total=int(heights.sum()), rightmost=float(edges[-1]), and label y='Measurement
#   count'.
# INPUTS: sample_values, bin_number
```

**Public checks:** 3 input variants. How could show a numerical distribution honestly mislead if units, display range or biological sampling were not checked?

**Debug task:** Find a realistic plotting or labeling mistake in show a numerical distribution honestly and demonstrate a changed-input test.

**Misconception:** A bright, well-styled plot is inherently a defensible biological conclusion.

**Scientific interpretation boundary:** Rendered Witz/HPA notebook PNG provides authentic display pixels only, not raw calibrated fluorescence; simulated numeric values and microscope fields are not biological replicates.

## I04-G04 — Arrange comparable scientific panels

**Purpose:** Different views of the same dataset need shared interpretation and clear labels.

`plt.subplots(1,2)` creates one figure with two separately addressable axes; each panel requires a meaningful role.

A line plot and histogram can coexist without being treated as the same statistical unit. State source and units in labels.

Be cautious with shared scales and implied comparisons when groups have different acquisition settings or replicate structures.

**Predict:** Predict the plotted data, labels and scientific limitation.

**Runnable worked example (not the Apply/Prove answer):**

```python
import matplotlib.pyplot as plt
fig,axes=plt.subplots(1,2)
axes[0].plot([0,1],[1,2]);axes[1].hist([1,2,3])
print(len(fig.axes))
```

**Prediction feedback:** A figure reflects actual Python Matplotlib objects and the input data, not a simulated picture or certified scientific result.

**Guided reasoning:**

1. Identify plotted data, units, sample/field identity and expected axes.
2. Run actual Python; inspect the figure generated in the results panel.
3. Change a scientific input or display limit and explain which interpretation is still unsupported.

**Experiment and investigate:**

- Try a changed label, data series or histogram bin count.
- Check plot object counts against the data and unchanged source arrays.
- Explain the limits of RGB rendered imagery and grouped biological evidence.

### Apply — changed-input practice

Create fig,axes=plt.subplots(1,2): plot x and y on axes[0], histogram y with bins on axes[1]. Set panel_count and panel_titles=['Trajectory','Distribution'].

```python
# I04-G04 | APPLY | Arrange comparable scientific panels
# TASK: Create fig,axes=plt.subplots(1,2): plot x and y on axes[0], histogram y
#   with bins on axes[1]. Set panel_count and
#   panel_titles=['Trajectory','Distribution'].
# INPUTS: x, y, bins
```

**Public checks:** 3 input variants. How could arrange comparable scientific panels mislead if units, display range or biological sampling were not checked?

### Prove — unfamiliar transfer

Make two panels: scatter of coordinates and observations, then histogram of observations with bin_count. Set panel_count and labels='Coordinate','Observed value' for first axes.

```python
# I04-G04 | PROVE | Arrange comparable scientific panels
# TASK: Make two panels: scatter of coordinates and observations, then histogram
#   of observations with bin_count. Set panel_count and
#   labels='Coordinate','Observed value' for first axes.
# INPUTS: coordinates, observations, bin_count
```

**Public checks:** 3 input variants. How could arrange comparable scientific panels mislead if units, display range or biological sampling were not checked?

**Debug task:** Find a realistic plotting or labeling mistake in arrange comparable scientific panels and demonstrate a changed-input test.

**Misconception:** A bright, well-styled plot is inherently a defensible biological conclusion.

**Scientific interpretation boundary:** Rendered Witz/HPA notebook PNG provides authentic display pixels only, not raw calibrated fluorescence; simulated numeric values and microscope fields are not biological replicates.

## I04-G05 — Change display contrast without changing pixels

**Purpose:** Visualization limits can make a bright region appear different even when stored array values are unchanged.

`imshow(image,vmin,vmax)` adjusts display mapping; it does not rescale the underlying NumPy array.

Preserve an immutable original image and compare numerical summaries before and after changing the display range.

Rendered RGB figures do not supply calibrated fluorescence. Brightness on screen is partly a visualization choice.

**Predict:** Predict the plotted data, labels and scientific limitation.

**Runnable worked example (not the Apply/Prove answer):**

```python
import numpy as np
import matplotlib.pyplot as plt
pixels=np.array([[0,100],[150,255]])
original=pixels.copy()
fig,ax=plt.subplots();handle=ax.imshow(pixels,vmin=50,vmax=200)
print(np.array_equal(pixels,original),handle.get_clim())
```

**Prediction feedback:** A figure reflects actual Python Matplotlib objects and the input data, not a simulated picture or certified scientific result.

**Guided reasoning:**

1. Identify plotted data, units, sample/field identity and expected axes.
2. Run actual Python; inspect the figure generated in the results panel.
3. Change a scientific input or display limit and explain which interpretation is still unsupported.

**Experiment and investigate:**

- Try a changed label, data series or histogram bin count.
- Check plot object counts against the data and unchanged source arrays.
- Explain the limits of RGB rendered imagery and grouped biological evidence.

### Apply — changed-input practice

Create original NumPy array from pixel_rows. Draw im=ax.imshow(original,vmin=display_min,vmax=display_max). Set display_limits, pixel_unchanged and actual_max=int(original.max()).

```python
# I04-G05 | APPLY | Change display contrast without changing pixels
# TASK: Create original NumPy array from pixel_rows. Draw
#   im=ax.imshow(original,vmin=display_min,vmax=display_max). Set display_limits,
#   pixel_unchanged and actual_max=int(original.max()).
# INPUTS: pixel_rows, display_min, display_max
```

**Public checks:** 3 input variants. How could change display contrast without changing pixels mislead if units, display range or biological sampling were not checked?

### Prove — unfamiliar transfer

Decode credited RGB figure, select component to 2D, display with vmin/vmax set by low/high; set unchanged, display_limits and data_range from original pixels. No raw fluorescence claim.

```python
# I04-G05 | PROVE | Change display contrast without changing pixels
# TASK: Decode credited RGB figure, select component to 2D, display with vmin/vmax
#   set by low/high; set unchanged, display_limits and data_range from original
#   pixels. No raw fluorescence claim.
# INPUTS: image_path, component, low, high
```

**Public checks:** 3 input variants. How could change display contrast without changing pixels mislead if units, display range or biological sampling were not checked?

**Debug task:** Find a realistic plotting or labeling mistake in change display contrast without changing pixels and demonstrate a changed-input test.

**Misconception:** A bright, well-styled plot is inherently a defensible biological conclusion.

**Scientific interpretation boundary:** Rendered Witz/HPA notebook PNG provides authentic display pixels only, not raw calibrated fluorescence; simulated numeric values and microscope fields are not biological replicates.

## I04-G06 — Inspect a real image's display-pixel histogram

**Purpose:** Histograms of displayed RGB codes cannot be substituted for raw detector intensity histograms.

NumPy's `np.histogram` counts the actual display-code values in a selected component from the credited Witz/HPA figure.

The total number of histogram counts must equal the number of pixels; bins are numerical intervals, not object labels.

Exposure correction, saturation detection and biologically meaningful intensity require original raw microscopy data and metadata.

**Predict:** Predict the plotted data, labels and scientific limitation.

**Runnable worked example (not the Apply/Prove answer):**

```python
from PIL import Image
import numpy as np
rgb=np.asarray(Image.open(image_path).convert('RGB'))
counts,bins=np.histogram(rgb[:,:,0],bins=16,range=(0,256))
print(int(counts.sum()),rgb.shape[:2])
```

**Prediction feedback:** A figure reflects actual Python Matplotlib objects and the input data, not a simulated picture or certified scientific result.

**Guided reasoning:**

1. Identify plotted data, units, sample/field identity and expected axes.
2. Run actual Python; inspect the figure generated in the results panel.
3. Change a scientific input or display limit and explain which interpretation is still unsupported.

**Experiment and investigate:**

- Try a changed label, data series or histogram bin count.
- Check plot object counts against the data and unchanged source arrays.
- Explain the limits of RGB rendered imagery and grouped biological evidence.

### Apply — changed-input practice

Decode image_path to RGB; select color_index plane; compute hist,edges=np.histogram(plane,bins=n_bins,range=(0,256)). Set hist_total and display_only=True; plot a histogram with plt.

```python
# I04-G06 | APPLY | Inspect a real image's display-pixel histogram
# TASK: Decode image_path to RGB; select color_index plane; compute
#   hist,edges=np.histogram(plane,bins=n_bins,range=(0,256)). Set hist_total and
#   display_only=True; plot a histogram with plt.
# INPUTS: image_path, color_index, n_bins
```

**Public checks:** 3 input variants. How could inspect a real image's display-pixel histogram mislead if units, display range or biological sampling were not checked?

### Prove — unfamiliar transfer

Read credited RGB figure, compute histogram for component with bins=bin_count. Set pixel_count, first_bin=int(counts[0]) and has_raw_calibration=False. Draw the bar plot.

```python
# I04-G06 | PROVE | Inspect a real image's display-pixel histogram
# TASK: Read credited RGB figure, compute histogram for component with
#   bins=bin_count. Set pixel_count, first_bin=int(counts[0]) and
#   has_raw_calibration=False. Draw the bar plot.
# INPUTS: image_path, component, bin_count
```

**Public checks:** 3 input variants. How could inspect a real image's display-pixel histogram mislead if units, display range or biological sampling were not checked?

**Debug task:** Find a realistic plotting or labeling mistake in inspect a real image's display-pixel histogram and demonstrate a changed-input test.

**Misconception:** A bright, well-styled plot is inherently a defensible biological conclusion.

**Scientific interpretation boundary:** Rendered Witz/HPA notebook PNG provides authentic display pixels only, not raw calibrated fluorescence; simulated numeric values and microscope fields are not biological replicates.

## I04-CAPSTONE — Produce a traceable two-panel RGB display report

**Purpose:** A scientifically honest image figure shows the source pixels and their distribution while refusing invented calibration.

Build a Matplotlib two-panel figure from an actual credited Witz/HPA notebook PNG: one component image and its display-pixel histogram.

The figure should label the plotted component, histogram x-axis as RGB display code, and indicate the output is not calibrated raw microscopy.

Check that histogram totals equal source component pixel count. The bright-pixel distribution is not a validated cell count.

**Predict:** Predict the plotted data, labels and scientific limitation.

**Runnable worked example (not the Apply/Prove answer):**

```python
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
rgb=np.asarray(Image.open(image_path).convert('RGB'))
fig,axes=plt.subplots(1,2)
axes[0].imshow(rgb[:,:,1],cmap='gray')
axes[1].hist(rgb[:,:,1].ravel(),bins=16)
print('Rendered RGB display, not calibrated raw fluorescence')
```

**Prediction feedback:** A figure reflects actual Python Matplotlib objects and the input data, not a simulated picture or certified scientific result.

**Guided reasoning:**

1. Identify plotted data, units, sample/field identity and expected axes.
2. Run actual Python; inspect the figure generated in the results panel.
3. Change a scientific input or display limit and explain which interpretation is still unsupported.

**Experiment and investigate:**

- Try a changed label, data series or histogram bin count.
- Check plot object counts against the data and unchanged source arrays.
- Explain the limits of RGB rendered imagery and grouped biological evidence.

### Apply — changed-input practice

Decode image_path, choose color_index; make fig,axes with imshow plane and histogram (n_bins, range=(0,256)). Set report={'pixels':plane.size,'hist_total':int(counts.sum()),'raw':False,'panels':2}; label axes[1].x as 'RGB display code'.

```python
# I04-CAPSTONE | APPLY | Produce a traceable two-panel RGB display report
# TASK: Decode image_path, choose color_index; make fig,axes with imshow plane and
#   histogram (n_bins, range=(0,256)). Set
#   Report source pixel count, histogram count, raw False and two figure panels.
#   label axes[1].x as 'RGB display code'.
# INPUTS: image_path, color_index, n_bins
```

**Public checks:** 3 input variants. How could produce a traceable two-panel rgb display report mislead if units, display range or biological sampling were not checked?

### Prove — unfamiliar transfer

Build new figure from credited RGB image for different component. Set fig,axes two panels, a grayscale image and a histogram; summary={'n':int(hist.sum()),'n_pixels':int(plane.size),'calibrated':False}. Plot titles 'Display component' and 'Display histogram'.

```python
# I04-CAPSTONE | PROVE | Produce a traceable two-panel RGB display report
# TASK: Build new figure from credited RGB image for different component. Set
#   fig,axes two panels, a grayscale image and a histogram;
#   summary={'n':int(hist.sum()),'n_pixels':int(plane.size),'calibrated':False}.
#   Plot titles 'Display component' and 'Display histogram'.
# INPUTS: image_path, component, bins
```

**Public checks:** 3 input variants. How could produce a traceable two-panel rgb display report mislead if units, display range or biological sampling were not checked?

**Debug task:** Find a realistic plotting or labeling mistake in produce a traceable two-panel rgb display report and demonstrate a changed-input test.

**Misconception:** A bright, well-styled plot is inherently a defensible biological conclusion.

**Scientific interpretation boundary:** Rendered Witz/HPA notebook PNG provides authentic display pixels only, not raw calibrated fluorescence; simulated numeric values and microscope fields are not biological replicates.

**Capstone passes:**

1. Decode the credited source figure and inspect actual numeric RGB components.
2. Create labeled grayscale component and pixel-code distribution panels.
3. Choose binning and record data counts, not object counts.
4. Return figure and explicit raw_calibrated=False summary.
5. Rebuild on changed component and binning in independent Prove.

**Explain in your own words:**

- Which axis represents data and which is a display transformation?
- Which observation represents an experimental unit?
- What original source/calibration would justify quantitative fluorescence?

## I04-REVIEW — Rebuild a defensible figure without guidance

**Purpose:** Delayed transfer should retain axis labeling, source preservation and the distinction between display and raw data.

Write the figure from changing unfamiliar data values rather than copying a first example.

Clearly label units and number of observations, and avoid interpreting a field count as biological replication.

A plotted visual is evidence of code execution, not automatically a defensible biological comparison.

**Predict:** Predict the plotted data, labels and scientific limitation.

**Prediction feedback:** A figure reflects actual Python Matplotlib objects and the input data, not a simulated picture or certified scientific result.

**Guided reasoning:**

1. Identify plotted data, units, sample/field identity and expected axes.
2. Run actual Python; inspect the figure generated in the results panel.
3. Change a scientific input or display limit and explain which interpretation is still unsupported.

**Experiment and investigate:**

- Try a changed label, data series or histogram bin count.
- Check plot object counts against the data and unchanged source arrays.
- Explain the limits of RGB rendered imagery and grouped biological evidence.

### Apply — changed-input practice

Write pseudocode comments for a new figure with axes, units, data provenance and a justified chart type.

```python
# I04-REVIEW | APPLY | Rebuild a defensible figure without guidance
# TASK: Write pseudocode comments for a new figure with axes, units, data
#   provenance and a justified chart type.
```

**Public checks:** 0 input variants. How could rebuild a defensible figure without guidance mislead if units, display range or biological sampling were not checked?

### Prove — unfamiliar transfer

Create a Matplotlib histogram from data and n_bins; set total=int(heights.sum()), title=label, x='Score (a.u.)', y='Observations'; print total.

```python
# I04-REVIEW | PROVE | Rebuild a defensible figure without guidance
# TASK: Create a Matplotlib histogram from data and n_bins; set
#   total=int(heights.sum()), title=label, x='Score (a.u.)', y='Observations';
#   print total.
# INPUTS: data, n_bins, label
```

**Public checks:** 3 input variants. How could rebuild a defensible figure without guidance mislead if units, display range or biological sampling were not checked?

**Debug task:** Find a realistic plotting or labeling mistake in rebuild a defensible figure without guidance and demonstrate a changed-input test.

**Misconception:** A bright, well-styled plot is inherently a defensible biological conclusion.

**Scientific interpretation boundary:** Rendered Witz/HPA notebook PNG provides authentic display pixels only, not raw calibrated fluorescence; simulated numeric values and microscope fields are not biological replicates.

**Explain in your own words:**

- Which axis represents data and which is a display transformation?
- Which observation represents an experimental unit?
- What original source/calibration would justify quantitative fluorescence?

## Independent handoff

Standalone real Matplotlib 2-panel credited figure and numerical histogram, with explicit display-only provenance.

Export `interpretable_image_figure.py` after completing Prove. Keep source files, units and acquisition provenance. Imported Witz/HPA PNG data are rendered RGB—not raw calibrated microscopy. Synthetic Pandas measurements have no external biological-provenance evidence. Real image segmentation and statistical inference require later chapters and independent validation.
