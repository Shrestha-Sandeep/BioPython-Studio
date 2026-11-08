# I07 — Clean a scientific measurements table

**Status:** learner-pilot chapter. Successful public checks are practice, not independent or retained mastery.

Create Pandas DataFrames, read typed CSV, select records, validate schemas, normalize identifiers cautiously, audit conflicting duplicates and preserve missing image-derived observations. All rows are synthetic educational data, not real biological replicates.

**Primary reference:** [Witz, Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/06-Regions.ipynb); source image and licensing [credits](../../assets/witz/CREDITS.md). Supporting principles: NumPy, Pandas, Matplotlib and Introduction to Bioimage Analysis.

**Scientific limit:** These measurement tables are constructed teaching data; no direct instrument data or raw fluorescence source is implied.

## I07-G01 — Create and inspect a Pandas DataFrame

**Purpose:** A table must keep specimen identity linked to numerical image-derived observations.

A Pandas DataFrame stores named columns with potentially different dtypes. It is not merely an array of numbers.

Record IDs and measurements should remain separate: an imaging field is not necessarily a biological replicate.

DataFrame operations will remain transparent when future genuine per-image measurements are imported.

**Predict:** Predict the table values and explain the input/record contract.

**Runnable worked example (not the Apply/Prove answer):**

```python
import pandas as pd
frame=pd.DataFrame({'sample_id':['WT','mut'],'fields':[3,4]})
print(frame.shape,frame['fields'].dtype)
```

**Prediction feedback:** The DataFrame transformation follows explicit input columns. It does not establish physical sample identity or biological replicates.

**Guided reasoning:**

1. Identify the sample ID column, measurement types and possible missing data.
2. Predict the Pandas output, execute the example and change a realistic input.
3. Explain which data-quality choice would affect downstream biological interpretation.

**Experiment and investigate:**

- Try changed field identities, missing values or duplicate keys.
- Check that original source records remain auditable.
- Distinguish field-level metadata from independent biological units.

### Apply — changed-input practice

Create df=pd.DataFrame(records) from supplied list of dicts. Set column_names=df.columns.tolist(), n_rows=len(df), mean_fields=float(df['fields'].mean()) or None for empty.

```python
# I07-G01 | APPLY | Create and inspect a Pandas DataFrame
# TASK: Create df=pd.DataFrame(records) from supplied list of dicts. Set
#   column_names=df.columns.tolist(), n_rows=len(df),
#   mean_fields=float(df['fields'].mean()) or None for empty.
# INPUTS: records
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of create and inspect a pandas dataframe?

### Prove — unfamiliar transfer

Build measurements DataFrame with columns 'field_id' and 'score' from field_ids,scores. Set n_fields=len(df), missing_scores=int(df['score'].isna().sum()) and valid_ids in order.

```python
# I07-G01 | PROVE | Create and inspect a Pandas DataFrame
# TASK: Build measurements DataFrame with columns 'field_id' and 'score' from
#   field_ids,scores. Set n_fields=len(df),
#   missing_scores=int(df['score'].isna().sum()) and valid_ids in order.
# INPUTS: field_ids, scores
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of create and inspect a pandas dataframe?

**Debug task:** Identify a Pandas schema, identity or missingness bug in create and inspect a pandas dataframe and describe the changed input that reveals it.

**Misconception:** A valid table schema or cleaned ID proves a biological specimen is correctly identified or an imaging field is a replicate.

**Scientific interpretation boundary:** All tabular measurements are synthetic teaching examples; fields and images are not independent biological replicates. No calibrated raw-image measurements are inferred.

## I07-G02 — Read CSV with explicit column types

**Purpose:** Leading zeros in specimen IDs are meaningful and must not be stripped by numeric type inference.

`pd.read_csv(io.StringIO(text),dtype={'specimen':'string'})` reads data while preserving identifier fields as text.

Numeric measurement columns should be converted with a documented error policy, not silently mistaken for specimen labels.

CSV is a text exchange format; validate delimiters, missing values, measurement units and actual source provenance.

**Predict:** Predict the table values and explain the input/record contract.

**Runnable worked example (not the Apply/Prove answer):**

```python
import pandas as pd,io
text='sample_id,fields\n001,2\n002,4\n'
df=pd.read_csv(io.StringIO(text),dtype={'sample_id':'string'})
print(df['sample_id'].tolist())
```

**Prediction feedback:** The DataFrame transformation follows explicit input columns. It does not establish physical sample identity or biological replicates.

**Guided reasoning:**

1. Identify the sample ID column, measurement types and possible missing data.
2. Predict the Pandas output, execute the example and change a realistic input.
3. Explain which data-quality choice would affect downstream biological interpretation.

**Experiment and investigate:**

- Try changed field identities, missing values or duplicate keys.
- Check that original source records remain auditable.
- Distinguish field-level metadata from independent biological units.

### Apply — changed-input practice

Read csv_text via io.StringIO and pd.read_csv with sample_id dtype='string'. Set parsed_ids, numeric_total=int(df['fields'].sum()), leading_zero_preserved bool.

```python
# I07-G02 | APPLY | Read CSV with explicit column types
# TASK: Read csv_text via io.StringIO and pd.read_csv with sample_id
#   dtype='string'. Set parsed_ids, numeric_total=int(df['fields'].sum()),
#   leading_zero_preserved bool.
# INPUTS: csv_text
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of read csv with explicit column types?

### Prove — unfamiliar transfer

Read CSV text with field_id forced to string (retain e.g. '0003'). Convert score to numeric via pd.to_numeric(errors='coerce'); return table, missing_count and passing_ids for numeric >= minimum.

```python
# I07-G02 | PROVE | Read CSV with explicit column types
# TASK: Read CSV text with field_id forced to string (retain e.g. '0003').
#   Convert score to numeric via pd.to_numeric(errors='coerce'); return table,
#   missing_count and passing_ids for numeric >= minimum.
# INPUTS: csv_text, minimum
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of read csv with explicit column types?

**Debug task:** Identify a Pandas schema, identity or missingness bug in read csv with explicit column types and describe the changed input that reveals it.

**Misconception:** A valid table schema or cleaned ID proves a biological specimen is correctly identified or an imaging field is a replicate.

**Scientific interpretation boundary:** All tabular measurements are synthetic teaching examples; fields and images are not independent biological replicates. No calibrated raw-image measurements are inferred.

## I07-G03 — Select rows and columns without losing IDs

**Purpose:** Filtering must keep field identities attached to their numerical values.

`.loc` selects by labels and conditions; `.iloc` selects by integer positions. They are not interchangeable after filtering or reindexing.

Select both field IDs and measurement columns when creating a reporting table, rather than generating a detached list of intensities.

Index position is not biological replicate identity. A new filtered table should be explicitly created from the original.

**Predict:** Predict the table values and explain the input/record contract.

**Runnable worked example (not the Apply/Prove answer):**

```python
import pandas as pd
df=pd.DataFrame({'field_id':['F1','F2','F3'],'score':[.9,.2,.8]})
print(df.loc[df.score>=.8,['field_id','score']].to_dict('records'))
```

**Prediction feedback:** The DataFrame transformation follows explicit input columns. It does not establish physical sample identity or biological replicates.

**Guided reasoning:**

1. Identify the sample ID column, measurement types and possible missing data.
2. Predict the Pandas output, execute the example and change a realistic input.
3. Explain which data-quality choice would affect downstream biological interpretation.

**Experiment and investigate:**

- Try changed field identities, missing values or duplicate keys.
- Check that original source records remain auditable.
- Distinguish field-level metadata from independent biological units.

### Apply — changed-input practice

Build df from records and create selected=df.loc[df['score']>=minimum,['field_id','score']].copy(); set selected_ids and retained_count. Preserve records.

```python
# I07-G03 | APPLY | Select rows and columns without losing IDs
# TASK: Build df from records and create
#   selected=df.loc[df['score']>=minimum,['field_id','score']].copy(); set
#   selected_ids and retained_count. Preserve records.
# INPUTS: records, minimum
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of select rows and columns without losing ids?

### Prove — unfamiliar transfer

Create df from sample_records, get first_record=df.iloc[0].to_dict() if nonempty else None; use .loc to select records whose channel == wanted_channel and store matching_ids.

```python
# I07-G03 | PROVE | Select rows and columns without losing IDs
# TASK: Create df from sample_records, get first_record=df.iloc[0].to_dict() if
#   nonempty else None; use .loc to select records whose channel ==
#   wanted_channel and store matching_ids.
# INPUTS: sample_records, wanted_channel
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of select rows and columns without losing ids?

**Debug task:** Identify a Pandas schema, identity or missingness bug in select rows and columns without losing ids and describe the changed input that reveals it.

**Misconception:** A valid table schema or cleaned ID proves a biological specimen is correctly identified or an imaging field is a replicate.

**Scientific interpretation boundary:** All tabular measurements are synthetic teaching examples; fields and images are not independent biological replicates. No calibrated raw-image measurements are inferred.

## I07-G04 — Validate a scientific table schema

**Purpose:** A table missing its specimen or measurement columns should fail explicitly, not silently merge incorrectly.

Schema checking compares required field names to DataFrame columns, records missing columns and avoids KeyError.

Type validation should check whether numeric values can be converted without losing source strings or inventing measurements.

A schema is a computational contract; correct headers do not guarantee real instrument provenance.

**Predict:** Predict the table values and explain the input/record contract.

**Runnable worked example (not the Apply/Prove answer):**

```python
import pandas as pd
df=pd.DataFrame({'sample_id':['A'],'score':[.9]})
print(set(['sample_id','score']).issubset(df.columns))
```

**Prediction feedback:** The DataFrame transformation follows explicit input columns. It does not establish physical sample identity or biological replicates.

**Guided reasoning:**

1. Identify the sample ID column, measurement types and possible missing data.
2. Predict the Pandas output, execute the example and change a realistic input.
3. Explain which data-quality choice would affect downstream biological interpretation.

**Experiment and investigate:**

- Try changed field identities, missing values or duplicate keys.
- Check that original source records remain auditable.
- Distinguish field-level metadata from independent biological units.

### Apply — changed-input practice

Create df from records, and validate required_columns. Set missing_columns in required order and schema_ok. Empty records may lack columns.

```python
# I07-G04 | APPLY | Validate a scientific table schema
# TASK: Create df from records, and validate required_columns. Set
#   missing_columns in required order and schema_ok. Empty records may lack
#   columns.
# INPUTS: records, required_columns
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of validate a scientific table schema?

### Prove — unfamiliar transfer

Given DataFrame from row_data and must_have columns, create report={'ok':bool,'missing':[names]} and print it; validate without referencing columns that do not exist.

```python
# I07-G04 | PROVE | Validate a scientific table schema
# TASK: Given DataFrame from row_data and must_have columns, create
#   report={'ok':bool,'missing':[names]} and print it; validate without
#   referencing columns that do not exist.
# INPUTS: row_data, must_have
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of validate a scientific table schema?

**Debug task:** Identify a Pandas schema, identity or missingness bug in validate a scientific table schema and describe the changed input that reveals it.

**Misconception:** A valid table schema or cleaned ID proves a biological specimen is correctly identified or an imaging field is a replicate.

**Scientific interpretation boundary:** All tabular measurements are synthetic teaching examples; fields and images are not independent biological replicates. No calibrated raw-image measurements are inferred.

## I07-G05 — Normalize only allowed sample-ID whitespace

**Purpose:** Silent case conversion can create false matches or merge distinct genotypes.

Specimen names may be case-sensitive. `.str.strip()` removes external accidental whitespace without inventing an ID change policy.

Preserve original ID in a `raw_id` column for auditing and create a separate `clean_id` field.

A normalized text match does not verify that the physical specimen was labeled correctly during acquisition.

**Predict:** Predict the table values and explain the input/record contract.

**Runnable worked example (not the Apply/Prove answer):**

```python
import pandas as pd
df=pd.DataFrame({'raw_id':[' N2 ','mutA ','muta']})
df['clean_id']=df.raw_id.str.strip()
print(df.clean_id.tolist())
```

**Prediction feedback:** The DataFrame transformation follows explicit input columns. It does not establish physical sample identity or biological replicates.

**Guided reasoning:**

1. Identify the sample ID column, measurement types and possible missing data.
2. Predict the Pandas output, execute the example and change a realistic input.
3. Explain which data-quality choice would affect downstream biological interpretation.

**Experiment and investigate:**

- Try changed field identities, missing values or duplicate keys.
- Check that original source records remain auditable.
- Distinguish field-level metadata from independent biological units.

### Apply — changed-input practice

Create DataFrame with raw_id from raw_ids, clean_id as trimmed exterior whitespace only; output clean_ids list and changed_count. Preserve case.

```python
# I07-G05 | APPLY | Normalize only allowed sample-ID whitespace
# TASK: Create DataFrame with raw_id from raw_ids, clean_id as trimmed exterior
#   whitespace only; output clean_ids list and changed_count. Preserve case.
# INPUTS: raw_ids
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of normalize only allowed sample-id whitespace?

### Prove — unfamiliar transfer

For acquisition_ids, build table with original_id and normalized_id (strip exterior spaces). Set collisions for normalized IDs appearing more than once, in first duplicated-ID order.

```python
# I07-G05 | PROVE | Normalize only allowed sample-ID whitespace
# TASK: For acquisition_ids, build table with original_id and normalized_id
#   (strip exterior spaces). Set collisions for normalized IDs appearing more
#   than once, in first duplicated-ID order.
# INPUTS: acquisition_ids
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of normalize only allowed sample-id whitespace?

**Debug task:** Identify a Pandas schema, identity or missingness bug in normalize only allowed sample-id whitespace and describe the changed input that reveals it.

**Misconception:** A valid table schema or cleaned ID proves a biological specimen is correctly identified or an imaging field is a replicate.

**Scientific interpretation boundary:** All tabular measurements are synthetic teaching examples; fields and images are not independent biological replicates. No calibrated raw-image measurements are inferred.

## I07-G06 — Audit duplicate and conflicting sample keys

**Purpose:** Repeated keys can duplicate quantitative results during merges and hide mislabeled treatment groups.

`duplicated` flags repeated identifiers while preserving all source rows. A duplicate may be harmless technical repetition or a serious identity conflict.

Compare metadata across rows with the same sample key: two different conditions for one ID require investigation rather than automatic resolution.

Do not drop duplicate rows before assessing biological units, replicate structure and experimental provenance.

**Predict:** Predict the table values and explain the input/record contract.

**Runnable worked example (not the Apply/Prove answer):**

```python
import pandas as pd
df=pd.DataFrame({'id':['A','A','B'],'condition':['ctrl','heat','ctrl']})
print(df.loc[df.id.duplicated(),'id'].tolist())
```

**Prediction feedback:** The DataFrame transformation follows explicit input columns. It does not establish physical sample identity or biological replicates.

**Guided reasoning:**

1. Identify the sample ID column, measurement types and possible missing data.
2. Predict the Pandas output, execute the example and change a realistic input.
3. Explain which data-quality choice would affect downstream biological interpretation.

**Experiment and investigate:**

- Try changed field identities, missing values or duplicate keys.
- Check that original source records remain auditable.
- Distinguish field-level metadata from independent biological units.

### Apply — changed-input practice

Create df from records. Set duplicate_ids with unique IDs occurring more than once, and conflicting_ids with same ID but >1 distinct condition, both in first-appearance order.

```python
# I07-G06 | APPLY | Audit duplicate and conflicting sample keys
# TASK: Create df from records. Set duplicate_ids with unique IDs occurring more
#   than once, and conflicting_ids with same ID but >1 distinct condition, both
#   in first-appearance order.
# INPUTS: records
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of audit duplicate and conflicting sample keys?

### Prove — unfamiliar transfer

For field_rows of [field_id,channel] records, set repeated list for duplicated field_id and ambiguous list if an ID has >1 channel. Preserve input order and unique outputs.

```python
# I07-G06 | PROVE | Audit duplicate and conflicting sample keys
# TASK: For field_rows of [field_id,channel] records, set repeated list for
#   duplicated field_id and ambiguous list if an ID has >1 channel. Preserve
#   input order and unique outputs.
# INPUTS: field_rows
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of audit duplicate and conflicting sample keys?

**Debug task:** Identify a Pandas schema, identity or missingness bug in audit duplicate and conflicting sample keys and describe the changed input that reveals it.

**Misconception:** A valid table schema or cleaned ID proves a biological specimen is correctly identified or an imaging field is a replicate.

**Scientific interpretation boundary:** All tabular measurements are synthetic teaching examples; fields and images are not independent biological replicates. No calibrated raw-image measurements are inferred.

## I07-G07 — Preserve missing measurements explicitly

**Purpose:** Dropping rows with absent measurements can bias a scientific report and erase identifiable imaging fields.

Pandas `isna` detects missing values, while numerical zero remains a valid recorded value.

Compute separate lists of observed and missing fields before filtering. Keep an audit table with all source IDs.

Missingness may depend on acquisition or biological condition; a convenient `.dropna()` is not automatically a scientifically justified exclusion.

**Predict:** Predict the table values and explain the input/record contract.

**Runnable worked example (not the Apply/Prove answer):**

```python
import pandas as pd
df=pd.DataFrame({'id':['F1','F2'],'score':[0,None]})
print(df.score.isna().tolist())
```

**Prediction feedback:** The DataFrame transformation follows explicit input columns. It does not establish physical sample identity or biological replicates.

**Guided reasoning:**

1. Identify the sample ID column, measurement types and possible missing data.
2. Predict the Pandas output, execute the example and change a realistic input.
3. Explain which data-quality choice would affect downstream biological interpretation.

**Experiment and investigate:**

- Try changed field identities, missing values or duplicate keys.
- Check that original source records remain auditable.
- Distinguish field-level metadata from independent biological units.

### Apply — changed-input practice

Build df from records, set missing_ids for score NaN/None, observed_ids for nonmissing score, missing_count and preserved_rows. Do not drop original records.

```python
# I07-G07 | APPLY | Preserve missing measurements explicitly
# TASK: Build df from records, set missing_ids for score NaN/None, observed_ids
#   for nonmissing score, missing_count and preserved_rows. Do not drop original
#   records.
# INPUTS: records
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of preserve missing measurements explicitly?

### Prove — unfamiliar transfer

From field_ids and readings, create audit DataFrame; assign status='MISSING' if None/NaN, 'ZERO' if 0, otherwise 'OBSERVED'. Set status_list and invalid_fraction=missing_count/rows (0 for empty).

```python
# I07-G07 | PROVE | Preserve missing measurements explicitly
# TASK: From field_ids and readings, create audit DataFrame; assign
#   status='MISSING' if None/NaN, 'ZERO' if 0, otherwise 'OBSERVED'. Set
#   status_list and invalid_fraction=missing_count/rows (0 for empty).
# INPUTS: field_ids, readings
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of preserve missing measurements explicitly?

**Debug task:** Identify a Pandas schema, identity or missingness bug in preserve missing measurements explicitly and describe the changed input that reveals it.

**Misconception:** A valid table schema or cleaned ID proves a biological specimen is correctly identified or an imaging field is a replicate.

**Scientific interpretation boundary:** All tabular measurements are synthetic teaching examples; fields and images are not independent biological replicates. No calibrated raw-image measurements are inferred.

## I07-CAPSTONE — Build a source-preserving Pandas QC audit

**Purpose:** Valid tabular analysis must identify missing, duplicate and ambiguous records before any group comparison.

Build a DataFrame from changing acquisition records; keep source specimen IDs and conditions as documented.

Separate unique first-seen records from repeated IDs and missing numeric observations. Do not silently drop rows or infer biological replicates.

Summarize observed, missing and conflicting rows as a reproducible audit, not a biological effect-size calculation.

**Predict:** Predict the table values and explain the input/record contract.

**Runnable worked example (not the Apply/Prove answer):**

```python
import pandas as pd
rows=[{'id':'F1','score':.8},{'id':'F2','score':None}]
df=pd.DataFrame(rows)
print(df.score.isna().tolist())
```

**Prediction feedback:** The DataFrame transformation follows explicit input columns. It does not establish physical sample identity or biological replicates.

**Guided reasoning:**

1. Identify the sample ID column, measurement types and possible missing data.
2. Predict the Pandas output, execute the example and change a realistic input.
3. Explain which data-quality choice would affect downstream biological interpretation.

**Experiment and investigate:**

- Try changed field identities, missing values or duplicate keys.
- Check that original source records remain auditable.
- Distinguish field-level metadata from independent biological units.

### Apply — changed-input practice

Build df from records id/condition/score. Output report={'rows':N,'missing':[unique IDs with missing score],'duplicates':[unique repeated IDs],'conflicts':[IDs with >1 condition]}. Print report; preserve original rows.

```python
# I07-CAPSTONE | APPLY | Build a source-preserving Pandas QC audit
# TASK: Build df from records id/condition/score. Output
#   report={'rows':N,'missing':[unique IDs with missing
#   score],'duplicates':[unique repeated IDs],'conflicts':[IDs with >1
#   condition]}. Print report; preserve original rows.
# INPUTS: records
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of build a source-preserving pandas qc audit?

### Prove — unfamiliar transfer

For rows with specimen_id,field_id,value, construct DataFrame and audit={'n':rows,'missing_fields':[IDs],'duplicate_fields':[unique field IDs]} without removing any records. Print audit.

```python
# I07-CAPSTONE | PROVE | Build a source-preserving Pandas QC audit
# TASK: For rows with specimen_id,field_id,value, construct DataFrame and
#   audit={'n':rows,'missing_fields':[IDs],'duplicate_fields':[unique field IDs]}
#   without removing any records. Print audit.
# INPUTS: rows
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of build a source-preserving pandas qc audit?

**Debug task:** Identify a Pandas schema, identity or missingness bug in build a source-preserving pandas qc audit and describe the changed input that reveals it.

**Misconception:** A valid table schema or cleaned ID proves a biological specimen is correctly identified or an imaging field is a replicate.

**Scientific interpretation boundary:** All tabular measurements are synthetic teaching examples; fields and images are not independent biological replicates. No calibrated raw-image measurements are inferred.

**Capstone passes:**

1. Import synthetic acquisition rows with explicit specimen and field IDs.
2. Validate required columns and preserve case-sensitive identities.
3. Find missing numerical measurements separately from recorded zeros.
4. Report duplicate and conflicting source keys without dropping rows.
5. Rebuild an independent audit for unfamiliar table layout.

**Explain in your own words:**

- Which source rows were preserved?
- What is the true biological replicate unit?
- Which exclusions and duplicates might bias later inference?

## I07-REVIEW — Reconstruct a metadata QC table independently

**Purpose:** Independent coding on a different table should retain source rows and missingness evidence.

Rebuild a table audit without prefilled solutions.

Reject duplicates or missing values explicitly; do not confuse missingness with numeric zero.

Defensible biological inference requires experimental units and acquisition provenance beyond a schema check.

**Predict:** Predict the table values and explain the input/record contract.

**Prediction feedback:** The DataFrame transformation follows explicit input columns. It does not establish physical sample identity or biological replicates.

**Guided reasoning:**

1. Identify the sample ID column, measurement types and possible missing data.
2. Predict the Pandas output, execute the example and change a realistic input.
3. Explain which data-quality choice would affect downstream biological interpretation.

**Experiment and investigate:**

- Try changed field identities, missing values or duplicate keys.
- Check that original source records remain auditable.
- Distinguish field-level metadata from independent biological units.

### Apply — changed-input practice

Write pseudocode comments for validating IDs, missing values, schema and duplicate fields.

```python
# I07-REVIEW | APPLY | Reconstruct a metadata QC table independently
# TASK: Write pseudocode comments for validating IDs, missing values, schema and
#   duplicate fields.
```

**Public checks:** 0 input variants. Which source identity, missing value or duplicate would change the result of reconstruct a metadata qc table independently?

### Prove — unfamiliar transfer

Construct DataFrame from readings [id,score]; set kept IDs where score is not None and >=minimum and missing IDs where score None. Report {'kept':..., 'missing':..., 'rows':N}; print.

```python
# I07-REVIEW | PROVE | Reconstruct a metadata QC table independently
# TASK: Construct DataFrame from readings [id,score]; set kept IDs where score is
#   not None and >=minimum and missing IDs where score None. Report {'kept':...,
#   'missing':..., 'rows':N}; print.
# INPUTS: readings, minimum
```

**Public checks:** 3 input variants. Which source identity, missing value or duplicate would change the result of reconstruct a metadata qc table independently?

**Debug task:** Identify a Pandas schema, identity or missingness bug in reconstruct a metadata qc table independently and describe the changed input that reveals it.

**Misconception:** A valid table schema or cleaned ID proves a biological specimen is correctly identified or an imaging field is a replicate.

**Scientific interpretation boundary:** All tabular measurements are synthetic teaching examples; fields and images are not independent biological replicates. No calibrated raw-image measurements are inferred.

**Explain in your own words:**

- Which source rows were preserved?
- What is the true biological replicate unit?
- Which exclusions and duplicates might bias later inference?

## Independent handoff

A reproducible Pandas audit script preserving source identity, missing values, duplicates and schema failures.

Export `measurement_table_qc.py` after completing Prove. Keep source files, units and acquisition provenance. Imported Witz/HPA PNG data are rendered RGB—not raw calibrated microscopy. Synthetic Pandas measurements have no external biological-provenance evidence. Real image segmentation and statistical inference require later chapters and independent validation.
