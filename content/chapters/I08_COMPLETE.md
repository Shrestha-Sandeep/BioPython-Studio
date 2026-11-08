# I08 — Merge measurements and make a report

**Status:** learner-pilot chapter. Successful public checks are practice, not independent or retained mastery.

Join source metadata and microscope-field measurements without multiplying rows, summarize explicitly, reshape safely, preserve timestamps, export traceable CSVs and actual Matplotlib plots. Inference/uncertainty is reserved for I12.

**Primary reference:** [Witz, Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/07-Pipeline.ipynb); source image and licensing [credits](../../assets/witz/CREDITS.md). Supporting principles: NumPy, Pandas, Matplotlib and Introduction to Bioimage Analysis.

**Scientific limit:** Synthetic field data and plotting exercises do not justify a biological effect estimate, replication claim or publication-ready figure.

## I08-G01 — Join imaging data to specimen metadata safely

**Purpose:** A nonunique specimen table can multiply imaging records during a merge and distort a reported experiment.

Use `pd.merge` with explicit join keys, `how='left'`, and `validate='many_to_one'` when many image fields may belong to a single specimen.

Before merging, inspect whether source metadata contain duplicated specimen IDs. Reject an ambiguous source rather than silently multiplying rows.

Unmatched image fields must be reported with their original IDs. A successful join cannot independently validate biological specimen identity.

**Predict:** What output would the data produce, and what scientific conclusion does it not justify?

**Runnable worked example (not the Apply/Prove answer):**

```python
import pandas as pd
fields=pd.DataFrame({'specimen':['A','A','B'],'field':['F1','F2','F3']})
meta=pd.DataFrame({'specimen':['A','B'],'condition':['ctrl','heat']})
print(fields.merge(meta,on='specimen',validate='many_to_one').shape)
```

**Prediction feedback:** The output follows actual source rows or plotting objects. Source validity and biological replication need separate evidence.

**Guided reasoning:**

1. Check column names and whether keys can appear once or multiple times.
2. Predict the result and run real Pandas or Matplotlib with changed inputs.
3. Explain the origin of the experimental unit and which inference is unsupported.

**Experiment and investigate:**

- Try missing rows, changed keys or an invalid metadata join.
- Preserve source IDs and record the exact descriptive output.
- Test whether plot axes or file exports maintain stated units and provenance.

### Apply — changed-input practice

Build fields DataFrame from field_rows and metadata DataFrame from sample_rows. Set metadata_unique; if true, left-merge on 'sample_id' with validate='many_to_one', else joined=None. Set unmatched_fields for missing condition, or [] when metadata invalid.

```python
# I08-G01 | APPLY | Join imaging data to specimen metadata safely
# TASK: Build fields DataFrame from field_rows and metadata DataFrame from
#   sample_rows. Set metadata_unique; if true, left-merge on 'sample_id' with
#   validate='many_to_one', else joined=None. Set unmatched_fields for missing
#   condition, or [] when metadata invalid.
# INPUTS: field_rows, sample_rows
```

**Public checks:** 4 input variants. What row-identity, group-unit or export limitation would matter if you changed join imaging data to specimen metadata safely?

### Prove — unfamiliar transfer

Audit unfamiliar acquisition and treatment records keyed by specimen. When treatment keys repeat, refuse to join; otherwise keep all acquisition rows and count unmatched IDs. Return result_rows (records list or []) and unknown_ids.

```python
# I08-G01 | PROVE | Join imaging data to specimen metadata safely
# TASK: Audit unfamiliar acquisition and treatment records keyed by specimen.
#   When treatment keys repeat, refuse to join; otherwise keep all acquisition
#   rows and count unmatched IDs. Return result_rows (records list or []) and
#   unknown_ids.
# INPUTS: acquisitions, treatments
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed join imaging data to specimen metadata safely?

**Debug task:** Find an unsafe assumption in join imaging data to specimen metadata safely and demonstrate it with a new input.

**Misconception:** A merged table or attractive figure proves data are independent biological replicates or publication-ready.

**Scientific interpretation boundary:** All field and specimen measurements are synthetic training data. Display plots and grouped field means are descriptive only, never evidence of statistical significance.

## I08-G02 — Aggregate observations without pseudoreplication

**Purpose:** A mean across fields is descriptive; a mean across biological specimens addresses a different level of replication.

Group image-field rows by their `specimen_id` with Pandas `groupby`, retaining counts of observed fields and descriptive means.

Missing values should be excluded from numeric means with their absence recorded rather than treated as zero.

These summaries are not hypothesis tests or independent biological sample sizes. The correct experimental unit must be identified before inference.

**Predict:** What output would the data produce, and what scientific conclusion does it not justify?

**Runnable worked example (not the Apply/Prove answer):**

```python
import pandas as pd
df=pd.DataFrame({'specimen':['A','A','B'],'value':[2,4,8]})
print(df.groupby('specimen',sort=False)['value'].mean().to_dict())
```

**Prediction feedback:** The output follows actual source rows or plotting objects. Source validity and biological replication need separate evidence.

**Guided reasoning:**

1. Check column names and whether keys can appear once or multiple times.
2. Predict the result and run real Pandas or Matplotlib with changed inputs.
3. Explain the origin of the experimental unit and which inference is unsupported.

**Experiment and investigate:**

- Try missing rows, changed keys or an invalid metadata join.
- Preserve source IDs and record the exact descriptive output.
- Test whether plot axes or file exports maintain stated units and provenance.

### Apply — changed-input practice

From records containing specimen_id and value, create specimen_summary per specimen preserving first appearance. Each row has specimen_id, field_count, observed and mean_value (None if entirely missing).

```python
# I08-G02 | APPLY | Aggregate observations without pseudoreplication
# TASK: From records containing specimen_id and value, create specimen_summary
#   per specimen preserving first appearance. Each row has specimen_id,
#   field_count, observed and mean_value (None if entirely missing).
# INPUTS: records
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed aggregate observations without pseudoreplication?

### Prove — unfamiliar transfer

For independent batch_rows, group by replicate and return summaries containing replicate, n_observed and mean_signal, preserving input order. Missing-only replicates have None means.

```python
# I08-G02 | PROVE | Aggregate observations without pseudoreplication
# TASK: For independent batch_rows, group by replicate and return summaries
#   containing replicate, n_observed and mean_signal, preserving input order.
#   Missing-only replicates have None means.
# INPUTS: batch_rows
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed aggregate observations without pseudoreplication?

**Debug task:** Find an unsafe assumption in aggregate observations without pseudoreplication and demonstrate it with a new input.

**Misconception:** A merged table or attractive figure proves data are independent biological replicates or publication-ready.

**Scientific interpretation boundary:** All field and specimen measurements are synthetic training data. Display plots and grouped field means are descriptive only, never evidence of statistical significance.

## I08-G03 — Reshape wide and long measurement tables

**Purpose:** A convenient table layout must not change the identity or pairing of biological measurements.

`pd.melt` transforms wide channel columns into long rows while preserving specimen identifiers. Its inverse may need uniqueness checks.

`pivot` requires unique identifier-channel pairs. Repeated pairs must be reported, not silently averaged or overwritten.

A reshaped table changes representation, not observations, replicates or calibration.

**Predict:** What output would the data produce, and what scientific conclusion does it not justify?

**Runnable worked example (not the Apply/Prove answer):**

```python
import pandas as pd
df=pd.DataFrame({'id':['A'],'GFP':[2],'DAPI':[5]})
print(df.melt(id_vars='id',var_name='channel',value_name='value').to_dict('records'))
```

**Prediction feedback:** The output follows actual source rows or plotting objects. Source validity and biological replication need separate evidence.

**Guided reasoning:**

1. Check column names and whether keys can appear once or multiple times.
2. Predict the result and run real Pandas or Matplotlib with changed inputs.
3. Explain the origin of the experimental unit and which inference is unsupported.

**Experiment and investigate:**

- Try missing rows, changed keys or an invalid metadata join.
- Preserve source IDs and record the exact descriptive output.
- Test whether plot axes or file exports maintain stated units and provenance.

### Apply — changed-input practice

Build wide DataFrame from records with sample_id,GFP,DAPI. Melt into long_df with sample_id,channel,signal; return long_records preserving source and channel order.

```python
# I08-G03 | APPLY | Reshape wide and long measurement tables
# TASK: Build wide DataFrame from records with sample_id,GFP,DAPI. Melt into
#   long_df with sample_id,channel,signal; return long_records preserving source
#   and channel order.
# INPUTS: records
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed reshape wide and long measurement tables?

### Prove — unfamiliar transfer

From long data with specimen,channel,score, only pivot when each specimen-channel pair is unique. Set unique_pairs; if false wide=None, otherwise wide DataFrame indexed by specimen, columns channel.

```python
# I08-G03 | PROVE | Reshape wide and long measurement tables
# TASK: From long data with specimen,channel,score, only pivot when each
#   specimen-channel pair is unique. Set unique_pairs; if false wide=None,
#   otherwise wide DataFrame indexed by specimen, columns channel.
# INPUTS: rows
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed reshape wide and long measurement tables?

**Debug task:** Find an unsafe assumption in reshape wide and long measurement tables and demonstrate it with a new input.

**Misconception:** A merged table or attractive figure proves data are independent biological replicates or publication-ready.

**Scientific interpretation boundary:** All field and specimen measurements are synthetic training data. Display plots and grouped field means are descriptive only, never evidence of statistical significance.

## I08-G04 — Handle timestamps and experimental categories

**Purpose:** Incorrect timestamps and treatment labels can silently misassign acquisitions to the wrong experimental group.

Use `pd.to_datetime(...,utc=True,errors='coerce')` to parse explicit timestamps consistently. Invalid input becomes `NaT`, not a fabricated time.

Categorical variables represent experimental conditions, not measurements; preserving original spelling is important for provenance.

A UTC timestamp does not alone establish temporal acquisition order or instrument-clock synchronization.

**Predict:** What output would the data produce, and what scientific conclusion does it not justify?

**Runnable worked example (not the Apply/Prove answer):**

```python
import pandas as pd
print(pd.to_datetime(['2026-01-01T12:00:00Z','bad'],utc=True,errors='coerce').isna().tolist())
```

**Prediction feedback:** The output follows actual source rows or plotting objects. Source validity and biological replication need separate evidence.

**Guided reasoning:**

1. Check column names and whether keys can appear once or multiple times.
2. Predict the result and run real Pandas or Matplotlib with changed inputs.
3. Explain the origin of the experimental unit and which inference is unsupported.

**Experiment and investigate:**

- Try missing rows, changed keys or an invalid metadata join.
- Preserve source IDs and record the exact descriptive output.
- Test whether plot axes or file exports maintain stated units and provenance.

### Apply — changed-input practice

Build DataFrame from acquisitions with specimen_id,time,condition. Parse time as UTC to column parsed_time, classify invalid_times by specimen ID, and preserve original condition labels.

```python
# I08-G04 | APPLY | Handle timestamps and experimental categories
# TASK: Build DataFrame from acquisitions with specimen_id,time,condition. Parse
#   time as UTC to column parsed_time, classify invalid_times by specimen ID,
#   and preserve original condition labels.
# INPUTS: acquisitions
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed handle timestamps and experimental categories?

### Prove — unfamiliar transfer

From records with run_id, recorded_at, treatment, parse recorded_at UTC and set missing_run_ids for unparseable times, category_names for distinct treatments in first-seen order.

```python
# I08-G04 | PROVE | Handle timestamps and experimental categories
# TASK: From records with run_id, recorded_at, treatment, parse recorded_at UTC
#   and set missing_run_ids for unparseable times, category_names for distinct
#   treatments in first-seen order.
# INPUTS: records
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed handle timestamps and experimental categories?

**Debug task:** Find an unsafe assumption in handle timestamps and experimental categories and demonstrate it with a new input.

**Misconception:** A merged table or attractive figure proves data are independent biological replicates or publication-ready.

**Scientific interpretation boundary:** All field and specimen measurements are synthetic training data. Display plots and grouped field means are descriptive only, never evidence of statistical significance.

## I08-G05 — Export and reload a traceable dataset

**Purpose:** A reproducible tabular report should preserve specimen IDs and missing values on an actual read/write round trip.

Use DataFrame `.to_csv` with `index=False` to avoid exporting an accidental integer index as a scientific column.

Read back with explicit string ID dtype, preserve missingness as missing, and verify expected columns and row count.

A successful CSV round trip verifies a software artifact, not that source specimens or measured signals were correct.

**Predict:** What output would the data produce, and what scientific conclusion does it not justify?

**Runnable worked example (not the Apply/Prove answer):**

```python
import pandas as pd,io
df=pd.DataFrame({'id':['001','002'],'value':[1,None]})
s=io.StringIO();df.to_csv(s,index=False)
print(pd.read_csv(io.StringIO(s.getvalue()),dtype={'id':'string'})['id'].tolist())
```

**Prediction feedback:** The output follows actual source rows or plotting objects. Source validity and biological replication need separate evidence.

**Guided reasoning:**

1. Check column names and whether keys can appear once or multiple times.
2. Predict the result and run real Pandas or Matplotlib with changed inputs.
3. Explain the origin of the experimental unit and which inference is unsupported.

**Experiment and investigate:**

- Try missing rows, changed keys or an invalid metadata join.
- Preserve source IDs and record the exact descriptive output.
- Test whether plot axes or file exports maintain stated units and provenance.

### Apply — changed-input practice

Given specimen_rows with specimen_id and value, export DataFrame to csv_text using StringIO without index; read back with specimen_id as string into restored. Set preserved_ids, missing_count.

```python
# I08-G05 | APPLY | Export and reload a traceable dataset
# TASK: Given specimen_rows with specimen_id and value, export DataFrame to
#   csv_text using StringIO without index; read back with specimen_id as string
#   into restored. Set preserved_ids, missing_count.
# INPUTS: specimen_rows
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed export and reload a traceable dataset?

### Prove — unfamiliar transfer

Round-trip field_records with field_id,score in CSV text. Preserve leading zeros, original order, and separate zero from missing. Return reloaded table, missing_ids, is_traceable boolean.

```python
# I08-G05 | PROVE | Export and reload a traceable dataset
# TASK: Round-trip field_records with field_id,score in CSV text. Preserve
#   leading zeros, original order, and separate zero from missing. Return
#   reloaded table, missing_ids, is_traceable boolean.
# INPUTS: field_records
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed export and reload a traceable dataset?

**Debug task:** Find an unsafe assumption in export and reload a traceable dataset and demonstrate it with a new input.

**Misconception:** A merged table or attractive figure proves data are independent biological replicates or publication-ready.

**Scientific interpretation boundary:** All field and specimen measurements are synthetic training data. Display plots and grouped field means are descriptive only, never evidence of statistical significance.

## I08-G06 — Compare groups without inventing independent replicates

**Purpose:** A group plot should show individual specimen summaries and make their sampling unit unambiguous.

Descriptive group comparison can display individual measured specimen values using scatter plots; do not infer significance without a replication-aware model.

A bar of field-level means may conceal heterogeneity and pseudoreplication. Start with explicit points and clearly labeled unit of observation.

Label the plotted quantity and state whether the values are synthetic or represent biological sample-level summaries.

**Predict:** What output would the data produce, and what scientific conclusion does it not justify?

**Runnable worked example (not the Apply/Prove answer):**

```python
import matplotlib.pyplot as plt
fig,ax=plt.subplots()
ax.scatter([0,0,1],[2,4,3])
ax.set(xlabel='Condition index',ylabel='Specimen-level value')
print(len(ax.collections))
```

**Prediction feedback:** The output follows actual source rows or plotting objects. Source validity and biological replication need separate evidence.

**Guided reasoning:**

1. Check column names and whether keys can appear once or multiple times.
2. Predict the result and run real Pandas or Matplotlib with changed inputs.
3. Explain the origin of the experimental unit and which inference is unsupported.

**Experiment and investigate:**

- Try missing rows, changed keys or an invalid metadata join.
- Preserve source IDs and record the exact descriptive output.
- Test whether plot axes or file exports maintain stated units and provenance.

### Apply — changed-input practice

Given group_labels and values, plot individual points at group indices in first-seen order. Create group_order, plotted_count and ax with y label 'Specimen summary (a.u.)'.

```python
# I08-G06 | APPLY | Compare groups without inventing independent replicates
# TASK: Given group_labels and values, plot individual points at group indices
#   in first-seen order. Create group_order, plotted_count and ax with y label
#   'Specimen summary (a.u.)'.
# INPUTS: group_labels, values
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed compare groups without inventing independent replicates?

### Prove — unfamiliar transfer

Plot individual replicate means for treatments and measurements using scatter. Set unique_treatments in first-seen order, observations count and no_significance_test=True.

```python
# I08-G06 | PROVE | Compare groups without inventing independent replicates
# TASK: Plot individual replicate means for treatments and measurements using
#   scatter. Set unique_treatments in first-seen order, observations count and
#   no_significance_test=True.
# INPUTS: treatments, measurements
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed compare groups without inventing independent replicates?

**Debug task:** Find an unsafe assumption in compare groups without inventing independent replicates and demonstrate it with a new input.

**Misconception:** A merged table or attractive figure proves data are independent biological replicates or publication-ready.

**Scientific interpretation boundary:** All field and specimen measurements are synthetic training data. Display plots and grouped field means are descriptive only, never evidence of statistical significance.

## I08-G07 — Choose honest scales and accessible plot design

**Purpose:** Plot style affects interpretation; truncated axes and unlabeled quantities can exaggerate differences.

Specify axes labels, numerical units and chart meaning rather than choosing colors alone. Good figures remain interpretable in grayscale or on low-contrast screens.

For quantities with meaningful zero, state whether the y-axis starts at zero. Changes to axis limits can visually exaggerate small effects.

Accessible design requires labels and marker distinctions, not color as the only encoded property; avoid claiming publication readiness without reviewer-level audit.

**Predict:** What output would the data produce, and what scientific conclusion does it not justify?

**Runnable worked example (not the Apply/Prove answer):**

```python
import matplotlib.pyplot as plt
fig,ax=plt.subplots()
ax.plot([0,1],[2,3],marker='o')
ax.set(xlabel='Time (min)',ylabel='Mean signal (a.u.)',ylim=(0,4))
print(ax.get_ylim())
```

**Prediction feedback:** The output follows actual source rows or plotting objects. Source validity and biological replication need separate evidence.

**Guided reasoning:**

1. Check column names and whether keys can appear once or multiple times.
2. Predict the result and run real Pandas or Matplotlib with changed inputs.
3. Explain the origin of the experimental unit and which inference is unsupported.

**Experiment and investigate:**

- Try missing rows, changed keys or an invalid metadata join.
- Preserve source IDs and record the exact descriptive output.
- Test whether plot axes or file exports maintain stated units and provenance.

### Apply — changed-input practice

Plot x and y with marker='o'; label x_label and y_label, ensure y lower limit=0, and set limits_ok and marker_used. Preserve input data.

```python
# I08-G07 | APPLY | Choose honest scales and accessible plot design
# TASK: Plot x and y with marker='o'; label x_label and y_label, ensure y lower
#   limit=0, and set limits_ok and marker_used. Preserve input data.
# INPUTS: x, y, x_label, y_label
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed choose honest scales and accessible plot design?

### Prove — unfamiliar transfer

For categories and values, make an accessible bar plot with y-axis starting at zero, named x='Condition' and y='Descriptive count'. Set accessible=True only when labels, noncolor categorical distinctions and zero baseline are present.

```python
# I08-G07 | PROVE | Choose honest scales and accessible plot design
# TASK: For categories and values, make an accessible bar plot with y-axis
#   starting at zero, named x='Condition' and y='Descriptive count'. Set
#   accessible=True only when labels, noncolor categorical distinctions and zero
#   baseline are present.
# INPUTS: categories, values
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed choose honest scales and accessible plot design?

**Debug task:** Find an unsafe assumption in choose honest scales and accessible plot design and demonstrate it with a new input.

**Misconception:** A merged table or attractive figure proves data are independent biological replicates or publication-ready.

**Scientific interpretation boundary:** All field and specimen measurements are synthetic training data. Display plots and grouped field means are descriptive only, never evidence of statistical significance.

## I08-G08 — Export reproducible vector and raster figures

**Purpose:** A figure must be exportable with stable labels, provenance and appropriate format rather than existing only in a transient browser canvas.

Matplotlib's `fig.savefig` can produce SVG vector graphics or PNG raster data. Record the target format, resolution and source as part of report provenance.

A large PNG byte stream proves file generation, not correct scientific interpretation. Browser output may be embedded but local use should preserve the original source image and script.

Do not call a figure publication-ready solely because it is 300 DPI; annotations, statistics, accessibility and data validity require independent review.

**Predict:** What output would the data produce, and what scientific conclusion does it not justify?

**Runnable worked example (not the Apply/Prove answer):**

```python
import matplotlib.pyplot as plt,io
fig,ax=plt.subplots();ax.plot([0,1],[1,2])
buf=io.BytesIO();fig.savefig(buf,format='png',dpi=150)
print(len(buf.getvalue())>100)
```

**Prediction feedback:** The output follows actual source rows or plotting objects. Source validity and biological replication need separate evidence.

**Guided reasoning:**

1. Check column names and whether keys can appear once or multiple times.
2. Predict the result and run real Pandas or Matplotlib with changed inputs.
3. Explain the origin of the experimental unit and which inference is unsupported.

**Experiment and investigate:**

- Try missing rows, changed keys or an invalid metadata join.
- Preserve source IDs and record the exact descriptive output.
- Test whether plot axes or file exports maintain stated units and provenance.

### Apply — changed-input practice

Draw x,y with Matplotlib, label axes, save fig to io.BytesIO as SVG (using UTF-8 bytes) and PNG at 150 dpi. Set png_bytes, svg_contains_label and exported_formats=['svg','png'].

```python
# I08-G08 | APPLY | Export reproducible vector and raster figures
# TASK: Draw x,y with Matplotlib, label axes, save fig to io.BytesIO as SVG
#   (using UTF-8 bytes) and PNG at 150 dpi. Set png_bytes, svg_contains_label
#   and exported_formats=['svg','png'].
# INPUTS: x, y, label
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed export reproducible vector and raster figures?

### Prove — unfamiliar transfer

Build and export a labeled scatter figure from positions and values to PNG BytesIO (dpi=200). Set is_png_signature, byte_count, dpi_used=200 and exported_locally=False; do not claim an actual downloaded local file.

```python
# I08-G08 | PROVE | Export reproducible vector and raster figures
# TASK: Build and export a labeled scatter figure from positions and values to
#   PNG BytesIO (dpi=200). Set is_png_signature, byte_count, dpi_used=200 and
#   exported_locally=False; do not claim an actual downloaded local file.
# INPUTS: positions, values
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed export reproducible vector and raster figures?

**Debug task:** Find an unsafe assumption in export reproducible vector and raster figures and demonstrate it with a new input.

**Misconception:** A merged table or attractive figure proves data are independent biological replicates or publication-ready.

**Scientific interpretation boundary:** All field and specimen measurements are synthetic training data. Display plots and grouped field means are descriptive only, never evidence of statistical significance.

## I08-CAPSTONE — Build a joined and traceable microscopy reporting workflow

**Purpose:** A valid report must retain identities, avoid join-driven row multiplication, keep missing data visible and create a clear figure without pretending to perform biological inference.

Start from field-level synthetic measurement rows and specimen metadata; validate uniqueness of sample keys before joining.

Preserve every field row, report unmatched specimen IDs and explicit missing values, and generate descriptive per-sample summaries.

Create an actual Matplotlib display of descriptive values with units, while avoiding statistical claims based on fields or an unverified biological unit.

**Predict:** What output would the data produce, and what scientific conclusion does it not justify?

**Runnable worked example (not the Apply/Prove answer):**

```python
import pandas as pd
fields=pd.DataFrame({'sample_id':['A','A'],'field_id':['F1','F2'],'value':[1,2]})
meta=pd.DataFrame({'sample_id':['A'],'condition':['ctrl']})
print(fields.merge(meta,on='sample_id',validate='many_to_one').shape)
```

**Prediction feedback:** The output follows actual source rows or plotting objects. Source validity and biological replication need separate evidence.

**Guided reasoning:**

1. Check column names and whether keys can appear once or multiple times.
2. Predict the result and run real Pandas or Matplotlib with changed inputs.
3. Explain the origin of the experimental unit and which inference is unsupported.

**Experiment and investigate:**

- Try missing rows, changed keys or an invalid metadata join.
- Preserve source IDs and record the exact descriptive output.
- Test whether plot axes or file exports maintain stated units and provenance.

### Apply — changed-input practice

From field_rows (sample_id,field_id,value) and metadata_rows (sample_id,condition), refuse nonunique metadata. Otherwise left-join, set report={'rows':N,'unmatched':[field IDs],'missing':[field IDs with absent value],'join_safe':bool}, and plot observed field points labeled 'Field value (a.u.)'.

```python
# I08-CAPSTONE | APPLY | Build a joined and traceable microscopy reporting workflow
# TASK: From field_rows (sample_id,field_id,value) and metadata_rows
#   (sample_id,condition), refuse nonunique metadata. Otherwise left-join, set
#   report={'rows':N,'unmatched':[field IDs],'missing':[field IDs with absent
#   value],'join_safe':bool}, and plot observed field points labeled 'Field
#   value (a.u.)'.
# INPUTS: field_rows, metadata_rows
```

**Public checks:** 4 input variants. What row-identity, group-unit or export limitation would matter if you changed build a joined and traceable microscopy reporting workflow?

### Prove — unfamiliar transfer

Join independent observations (specimen,tag,value) to treatments (specimen,treatment) only when treatments are unique. Set audit={'safe':bool,'rows':N,'unknown':[tag IDs]}, create CSV text with source IDs when safe and preserve order.

```python
# I08-CAPSTONE | PROVE | Build a joined and traceable microscopy reporting workflow
# TASK: Join independent observations (specimen,tag,value) to treatments
#   (specimen,treatment) only when treatments are unique. Set
#   audit={'safe':bool,'rows':N,'unknown':[tag IDs]}, create CSV text with
#   source IDs when safe and preserve order.
# INPUTS: observations, treatments
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed build a joined and traceable microscopy reporting workflow?

**Debug task:** Find an unsafe assumption in build a joined and traceable microscopy reporting workflow and demonstrate it with a new input.

**Misconception:** A merged table or attractive figure proves data are independent biological replicates or publication-ready.

**Scientific interpretation boundary:** All field and specimen measurements are synthetic training data. Display plots and grouped field means are descriptive only, never evidence of statistical significance.

**Capstone passes:**

1. Validate metadata key uniqueness before merging, and stop on ambiguous keys.
2. Preserve field rows and report unmatched and missing values.
3. Prepare specimen-level descriptive summaries before any group inference.
4. Create a labeled, auditable plot and a traceable CSV export.
5. Repeat Prove using a new join-key layout without copying earlier code.

**Explain in your own words:**

- Which source rows were preserved and which were unmatched?
- Is each field an independent biological replicate?
- What would be required for defensible statistical inference and published figures?

## I08-REVIEW — Independently repair an unsafe table join

**Purpose:** Returning to unfamiliar metadata should expose row multiplication risks rather than encourage one-off scripts.

Inspect the intended key cardinality before joining two data tables.

Reject repeated metadata keys when each specimen is supposed to have exactly one metadata record.

Report unmatched IDs and actual row count separately from biological effect or replicate count.

**Predict:** What output would the data produce, and what scientific conclusion does it not justify?

**Prediction feedback:** The output follows actual source rows or plotting objects. Source validity and biological replication need separate evidence.

**Guided reasoning:**

1. Check column names and whether keys can appear once or multiple times.
2. Predict the result and run real Pandas or Matplotlib with changed inputs.
3. Explain the origin of the experimental unit and which inference is unsupported.

**Experiment and investigate:**

- Try missing rows, changed keys or an invalid metadata join.
- Preserve source IDs and record the exact descriptive output.
- Test whether plot axes or file exports maintain stated units and provenance.

### Apply — changed-input practice

Write pseudocode for an auditable one-to-many join, including duplicate detection and missing sample metadata.

```python
# I08-REVIEW | APPLY | Independently repair an unsafe table join
# TASK: Write pseudocode for an auditable one-to-many join, including duplicate
#   detection and missing sample metadata.
```

**Public checks:** 0 input variants. What row-identity, group-unit or export limitation would matter if you changed independently repair an unsafe table join?

### Prove — unfamiliar transfer

Join sample observations to unique batch metadata only when batch keys are unique; set safe_join, missing_tags and n_rows. Refuse duplicated metadata by returning n_rows=0 and missing_tags=[].

```python
# I08-REVIEW | PROVE | Independently repair an unsafe table join
# TASK: Join sample observations to unique batch metadata only when batch keys
#   are unique; set safe_join, missing_tags and n_rows. Refuse duplicated
#   metadata by returning n_rows=0 and missing_tags=[].
# INPUTS: observed, batches
```

**Public checks:** 3 input variants. What row-identity, group-unit or export limitation would matter if you changed independently repair an unsafe table join?

**Debug task:** Find an unsafe assumption in independently repair an unsafe table join and demonstrate it with a new input.

**Misconception:** A merged table or attractive figure proves data are independent biological replicates or publication-ready.

**Scientific interpretation boundary:** All field and specimen measurements are synthetic training data. Display plots and grouped field means are descriptive only, never evidence of statistical significance.

**Explain in your own words:**

- Which source rows were preserved and which were unmatched?
- Is each field an independent biological replicate?
- What would be required for defensible statistical inference and published figures?

## Independent handoff

Export an executable safe join, metadata audit and descriptive figure, maintaining every source field ID.

Export `traceable_image_measurement_report.py` after completing Prove. Keep source files, units and acquisition provenance. Imported Witz/HPA PNG data are rendered RGB—not raw calibrated microscopy. Synthetic Pandas measurements have no external biological-provenance evidence. Real image segmentation and statistical inference require later chapters and independent validation.
