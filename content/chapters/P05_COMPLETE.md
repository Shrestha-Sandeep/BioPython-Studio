# P05 — Make a reusable analysis function

**Learning status:** browser learner-pilot chapter. Not independent-mastery certification.

Replace repeated calculations with functions, parameters, local state, documentation, validation and standard-library imports. Build a reusable, reproducible field measurement script.

**Source and provenance:** https://github.com/guiwitz/PyImageCourse_beginner/blob/master/Appendix_Functions.ipynb. Additional explanations follow Python for Biologists, Python Data Science Handbook, and Python standard-library documentation. The lesson data are fictional; source images retain their own attribution.

**Science boundary:** Synthetic numeric training records are not quantitative microscopy.

## P05-G01 — Return values from a measurement function

**Why:** Learn to reuse one unit-correct conversion rather than copying a result using biological measurement records.

A function runs only when called. Parameters are fresh input names, and `return` hands the numeric result to code that calls it. Merely printing a width would show a result once but leave subsequent calculations with `None`.

For widths, divide pixels by pixels-per-micrometre: (pixels)/(pixels/µm) gives µm. Changing calibration must change the answer, and a copied constant must fail the changed-input tests.

Call the same function with two distinct specimens. Return the converted number, print outside the function, and distinguish valid numeric conversion from the separate question of whether scale calibration is trustworthy.

Two calls use the same function definition but different parameters. Predict the results, change one input, and explain why the value changes.

**Predict:** What widths are returned for 48 pixels and 24 pixels at 4 pixels/µm?

**Runnable teaching example (not a solution):**

```python
def pixel_width(pixels, scale):
    return pixels / scale
print(pixel_width(48, 4))
print(pixel_width(24, 4))
```

**Prediction explanation:** 12.0 µm and 6.0 µm. The function returns values; the caller prints them.

**Walkthrough:**

1. Read the stated input and output contract for return values from a measurement function.
2. Predict the worked code's output before pressing Run.
3. Change the shown input and observe an actual changed Python result.
4. Explain a real failure case and distinguish software correctness from scientific validity.

**Investigate:**

- Change one parameter in return values from a measurement function and predict the new result.
- Try a missing, empty or boundary input when relevant.
- Explain whether the operation runs inside Python or needs local-machine evidence.

### Apply

Define to_um(pixels, px_per_um), returning pixels/px_per_um. Set width_um using supplied positive calibration.

```python
# P05-G01 | APPLY | Return values from a measurement function
# TASK: Define to_um(pixels, px_per_um), returning pixels/px_per_um. Set width_um
#   using supplied positive calibration.
# INPUTS: pixels, px_per_um
```

**Practice:** 3 changed-input public cases; not hidden mastery grading.

### Prove independently

Write speed_um_per_min(displacement_px, calibration_px_per_um, interval_min); set speed using the supplied values.

```python
# P05-G01 | PROVE | Return values from a measurement function
# TASK: Write speed_um_per_min(displacement_px, calibration_px_per_um,
#   interval_min); set speed using the supplied values.
# INPUTS: displacement_px, calibration_px_per_um, interval_min
```

**Practice:** 3 changed-input public cases; not hidden mastery grading.

**Debug task:** Identify a real failure mode in return values from a measurement function: which expression or assumption would be responsible, and how would you test it?

**Common mistake:** One successful function call or printed number establishes reusable and scientifically correct analysis.

**Scientific boundary:** All example field IDs, pixel widths and calibrations are synthetic; no raw-image measurement or biological effect is inferred.

## P05-G02 — Use explicit parameters and defaults

**Why:** Learn to make acquisition choices visible in parameter lists using biological measurement records.

A default parameter is a documented fallback used only when the caller omits that argument. `channel='GFP'` does not prevent a later call from specifying `channel='DAPI'`.

Required parameters precede optional ones. Keyword arguments clarify which scientific option is being changed, but Python does not know whether a particular channel or threshold is scientifically justified.

For QC, an inclusive threshold means exactly-equal scores pass. `None` is not zero. Values outside 0–1 are invalid under this illustrative training rule, not exceptionally low or high quality.

The channel default is only used when the caller does not supply one; predict the two labels before running.

**Predict:** What changes between describe('F07') and describe('F07',channel='DAPI')?

**Runnable teaching example (not a solution):**

```python
def describe(field_id, channel='GFP'):
    return f'{field_id} | {channel}'
print(describe('F07'))
print(describe('F07', channel='DAPI'))
```

**Prediction explanation:** Only the channel segment changes: F07 | GFP becomes F07 | DAPI. The ID is unchanged.

**Walkthrough:**

1. Read the stated input and output contract for use explicit parameters and defaults.
2. Predict the worked code's output before pressing Run.
3. Change the shown input and observe an actual changed Python result.
4. Explain a real failure case and distinguish software correctness from scientific validity.

**Investigate:**

- Change one parameter in use explicit parameters and defaults and predict the new result.
- Try a missing, empty or boundary input when relevant.
- Explain whether the operation runs inside Python or needs local-machine evidence.

### Apply

Define describe_field(field_id, channel='GFP') returning 'ID | channel'; call it with supplied field_id and channel to create label.

```python
# P05-G02 | APPLY | Use explicit parameters and defaults
# TASK: Define describe_field(field_id, channel='GFP') returning 'ID | channel';
#   call it with supplied field_id and channel to create label.
# INPUTS: field_id, channel
```

**Practice:** 3 changed-input public cases; not hidden mastery grading.

### Prove independently

Define passes_focus(score, minimum=0.8): False for None or values outside 0..1; otherwise score>=minimum. Set accepted from focus_score, threshold.

```python
# P05-G02 | PROVE | Use explicit parameters and defaults
# TASK: Define passes_focus(score, minimum=0.8): False for None or values outside
#   0..1; otherwise score>=minimum. Set accepted from focus_score, threshold.
# INPUTS: focus_score, threshold
```

**Practice:** 3 changed-input public cases; not hidden mastery grading.

**Debug task:** Identify a real failure mode in use explicit parameters and defaults: which expression or assumption would be responsible, and how would you test it?

**Common mistake:** One successful function call or printed number establishes reusable and scientifically correct analysis.

**Scientific boundary:** All example field IDs, pixel widths and calibrations are synthetic; no raw-image measurement or biological effect is inferred.

## P05-G03 — Separate local state from source data

**Why:** Learn to avoid stale global values and unexpected mutation using biological measurement records.

A function-local list is created anew for every call. If the list is stored outside the function and appended repeatedly, a second specimen can inherit stale results from a previous specimen.

Returning a new list also protects the source: selecting passing scores should not delete missing observations from the original acquisition. This matters for traceability and later data-quality investigations.

A function can be correct on one call yet wrong after multiple calls. Compare results for two thresholds; verify that the original input object remains unchanged and output lists are independent.

An accumulator created inside the function cannot accidentally collect the previous call's observations.

**Predict:** Why does calling keep twice not append new results to an old list?

**Runnable teaching example (not a solution):**

```python
def keep(values, minimum):
    chosen = []
    for value in values:
        if value is not None and value >= minimum:
            chosen.append(value)
    return chosen
print(keep([0.9, None, 0.3], 0.8))
```

**Prediction explanation:** A fresh local list is allocated on each call. The input is never modified.

**Walkthrough:**

1. Read the stated input and output contract for separate local state from source data.
2. Predict the worked code's output before pressing Run.
3. Change the shown input and observe an actual changed Python result.
4. Explain a real failure case and distinguish software correctness from scientific validity.

**Investigate:**

- Change one parameter in separate local state from source data and predict the new result.
- Try a missing, empty or boundary input when relevant.
- Explain whether the operation runs inside Python or needs local-machine evidence.

### Apply

Define keep_scores(scores, minimum): return new list of non-None scores in 0..1 at/above minimum, leaving scores unchanged. Set selected.

```python
# P05-G03 | APPLY | Separate local state from source data
# TASK: Define keep_scores(scores, minimum): return new list of non-None scores in
#   0..1 at/above minimum, leaving scores unchanged. Set selected.
# INPUTS: scores, minimum
```

**Practice:** 3 changed-input public cases; not hidden mastery grading.

### Prove independently

Define scaled_counts(counts, factor) returning a new list of every count multiplied by factor; set scaled without mutating counts.

```python
# P05-G03 | PROVE | Separate local state from source data
# TASK: Define scaled_counts(counts, factor) returning a new list of every count
#   multiplied by factor; set scaled without mutating counts.
# INPUTS: counts, factor
```

**Practice:** 3 changed-input public cases; not hidden mastery grading.

**Debug task:** Identify a real failure mode in separate local state from source data: which expression or assumption would be responsible, and how would you test it?

**Common mistake:** One successful function call or printed number establishes reusable and scientifically correct analysis.

**Scientific boundary:** All example field IDs, pixel widths and calibrations are synthetic; no raw-image measurement or biological effect is inferred.

## P05-G04 — Document types and scientific meaning

**Why:** Learn to state input types, return values and missing-data policy using biological measurement records.

A docstring is the first string literal in a function body, accessible through `function.__doc__`. It should describe purpose, input meaning, output units, and empty or invalid input behavior.

Annotations such as `fields: int` and `-> str` describe expected types, but Python does not automatically validate those types. Scientific calibration and biological identity still require explicit checks.

A useful measurement function can tell another scientist what it returns for empty data and whether the result is pixels, micrometres, or a dimensionless score. Avoid ambiguous return labels.

Distinguish documentation of a function from the actual numeric or text value it returns.

**Predict:** Which information appears in specimen_label.__annotations__, and which in the result?

**Runnable teaching example (not a solution):**

```python
def specimen_label(sample_id: str, fields: int) -> str:
    """Return a specimen identifier and field count."""
    return f'{sample_id}: {fields} fields'
print(specimen_label('WT', 3))
print(specimen_label.__annotations__)
```

**Prediction explanation:** Annotations identify the expected types; the returned string contains the sample label and count.

**Walkthrough:**

1. Read the stated input and output contract for document types and scientific meaning.
2. Predict the worked code's output before pressing Run.
3. Change the shown input and observe an actual changed Python result.
4. Explain a real failure case and distinguish software correctness from scientific validity.

**Investigate:**

- Change one parameter in document types and scientific meaning and predict the new result.
- Try a missing, empty or boundary input when relevant.
- Explain whether the operation runs inside Python or needs local-machine evidence.

### Apply

Define specimen_label(sample_id: str, fields: int) -> str with docstring containing 'fields'. Return 'ID: N fields'; set summary.

```python
# P05-G04 | APPLY | Document types and scientific meaning
# TASK: Define specimen_label(sample_id: str, fields: int) -> str with docstring
#   containing 'fields'. Return 'ID: N fields'; set summary.
# INPUTS: sample_id, fields
```

**Practice:** 3 changed-input public cases; not hidden mastery grading.

### Prove independently

Define mean_or_none(values: list) -> float | None with docstring containing 'mean'; return arithmetic mean or None for empty. Set result.

```python
# P05-G04 | PROVE | Document types and scientific meaning
# TASK: Define mean_or_none(values: list) -> float | None with docstring
#   containing 'mean'; return arithmetic mean or None for empty. Set result.
# INPUTS: values
```

**Practice:** 3 changed-input public cases; not hidden mastery grading.

**Debug task:** Identify a real failure mode in document types and scientific meaning: which expression or assumption would be responsible, and how would you test it?

**Common mistake:** One successful function call or printed number establishes reusable and scientifically correct analysis.

**Scientific boundary:** All example field IDs, pixel widths and calibrations are synthetic; no raw-image measurement or biological effect is inferred.

## P05-G05 — Raise and handle invalid inputs

**Why:** Learn to reject invalid calibrations without fabricating zero using biological measurement records.

Raise `ValueError` when a calibration is zero or negative. Returning zero would conflate an invalid conversion with a real zero-width observation, giving a plausible but incorrect report.

Use a narrow `try/except ValueError` wrapper when a routine must classify expected invalid input. Do not catch `BaseException` or swallow unexpected bugs; those errors should still be visible.

Separate calculation from policy: one function raises a useful error, another records failure as `{'ok':False,'value':None}`. This makes source records auditable without fabricating a measurement.

A nonpositive calibration must produce a visible error, not a width in µm.

**Predict:** What error class is printed when scale is zero, and why?

**Runnable teaching example (not a solution):**

```python
def convert(pixels, scale):
    if scale <= 0:
        raise ValueError('invalid scale')
    return pixels / scale
try:
    print(convert(20, 0))
except ValueError as error:
    print(type(error).__name__)
```

**Prediction explanation:** ValueError. The scale violates the conversion contract; no trustworthy physical width can be returned.

**Walkthrough:**

1. Read the stated input and output contract for raise and handle invalid inputs.
2. Predict the worked code's output before pressing Run.
3. Change the shown input and observe an actual changed Python result.
4. Explain a real failure case and distinguish software correctness from scientific validity.

**Investigate:**

- Change one parameter in raise and handle invalid inputs and predict the new result.
- Try a missing, empty or boundary input when relevant.
- Explain whether the operation runs inside Python or needs local-machine evidence.

### Apply

Define convert_width(pixels,scale) raising ValueError if scale<=0; otherwise divide. Define safe_width with try/except ValueError returning {'ok':True,'value':width} or {'ok':False,'value':None}. Set result.

```python
# P05-G05 | APPLY | Raise and handle invalid inputs
# TASK: Define convert_width(pixels,scale) raising ValueError if scale<=0;
#   otherwise divide. Define safe_width with try/except ValueError returning
#   {'ok':True,'value':width} or {'ok':False,'value':None}. Set result.
# INPUTS: pixels, scale
```

**Practice:** 3 changed-input public cases; not hidden mastery grading.

### Prove independently

Define read_quality(score) raising ValueError for None or outside 0..1; define quality_report(score) catching ValueError and returning 'VALID' or 'INVALID'. Set status.

```python
# P05-G05 | PROVE | Raise and handle invalid inputs
# TASK: Define read_quality(score) raising ValueError for None or outside 0..1;
#   define quality_report(score) catching ValueError and returning 'VALID' or
#   'INVALID'. Set status.
# INPUTS: focus_score
```

**Practice:** 3 changed-input public cases; not hidden mastery grading.

**Debug task:** Identify a real failure mode in raise and handle invalid inputs: which expression or assumption would be responsible, and how would you test it?

**Common mistake:** One successful function call or printed number establishes reusable and scientifically correct analysis.

**Scientific boundary:** All example field IDs, pixel widths and calibrations are synthetic; no raw-image measurement or biological effect is inferred.

## P05-G06 — Import standard-library analysis tools

**Why:** Learn to use explicit imports instead of copied constants using biological measurement records.

Importing `math` gives access to a defined π constant. Copying a rough decimal into every function is fragile, and forgetting the import produces an error when the code runs.

Importing `statistics` gives a standard arithmetic mean; it does not tell you which experimental unit to average. An average of microscope fields is not automatically an estimate across independent biological replicates.

The imported module and function must be available in the standalone script too. Explicit imports make dependencies reproducible when leaving the browser and later packaging a local workflow.

Named modules make constants and descriptive statistics available to Python code.

**Predict:** Which imported module supplies pi, and which supplies the arithmetic mean?

**Runnable teaching example (not a solution):**

```python
import math
import statistics
print(round(math.pi, 3))
print(statistics.mean([2,4,6]))
```

**Prediction explanation:** math supplies pi; statistics supplies mean. Both must be imported in a fresh script.

**Walkthrough:**

1. Read the stated input and output contract for import standard-library analysis tools.
2. Predict the worked code's output before pressing Run.
3. Change the shown input and observe an actual changed Python result.
4. Explain a real failure case and distinguish software correctness from scientific validity.

**Investigate:**

- Change one parameter in import standard-library analysis tools and predict the new result.
- Try a missing, empty or boundary input when relevant.
- Explain whether the operation runs inside Python or needs local-machine evidence.

### Apply

Import math; define circle_area_um2(radius_um) using math.pi * radius_um**2. Return None for radius<0; set area_um2.

```python
# P05-G06 | APPLY | Import standard-library analysis tools
# TASK: Import math; define circle_area_um2(radius_um) using math.pi *
#   radius_um**2. Return None for radius<0; set area_um2.
# INPUTS: radius_um
```

**Practice:** 3 changed-input public cases; not hidden mastery grading.

### Prove independently

Import statistics; define mean_focus(scores) ignoring None, returning None if no valid entries. Set mean_score.

```python
# P05-G06 | PROVE | Import standard-library analysis tools
# TASK: Import statistics; define mean_focus(scores) ignoring None, returning None
#   if no valid entries. Set mean_score.
# INPUTS: scores
```

**Practice:** 3 changed-input public cases; not hidden mastery grading.

**Debug task:** Identify a real failure mode in import standard-library analysis tools: which expression or assumption would be responsible, and how would you test it?

**Common mistake:** One successful function call or printed number establishes reusable and scientifically correct analysis.

**Scientific boundary:** All example field IDs, pixel widths and calibrations are synthetic; no raw-image measurement or biological effect is inferred.

## P05-CAPSTONE — Build a tested, reusable field-measurement module

**Why:** Learn to combine documented unit conversion with traceable field-level QC using biological measurement records.

A useful scientific script must combine documented unit conversion with traceable field-level QC. Distinguish a returned value from a printed diagnostic; a program should be reusable with changed inputs.

A function's parameters make assumptions explicit. The same code must give sensible outputs for missing, empty, changed and boundary data.

Do not mistake synthetic calibration values for verified microscope metadata. A correct calculation alone is not evidence of biological validity.

**Predict:** Why must an unknown width return None rather than zero?

**Runnable teaching example (not a solution):**

```python
def width_um(pixels, scale):
    if pixels is None or scale <= 0:
        return None
    return pixels / scale
print(width_um(40,4))
print(width_um(None,4))
```

**Prediction explanation:** A missing observation is not a recorded zero-width region.

**Walkthrough:**

1. Identify all changing inputs and their physical units.
2. Predict the worked output before executing Python.
3. Change one input and investigate the output or error.

**Investigate:**

- Try a new sample ID, missing observation or zero count.
- Check one boundary without hardcoding a previously printed result.
- Explain why passing code checks is not proof of correct biological calibration.

### Apply

Define evaluate_fields(records, minimum_um) returning {'kept':[IDs], 'low':[IDs], 'invalid':[IDs]} for [ID,pixels,scale]. Invalid when pixels None or scale<=0; otherwise width=pixels/scale and width>=minimum passes. Set audit; print summary 'kept=N; low=N; invalid=N'. Preserve records.

```python
# P05-CAPSTONE | APPLY | Build a tested, reusable field-measurement module
# TASK: Define evaluate_fields(records, minimum_um) returning {'kept':[IDs],
#   'low':[IDs], 'invalid':[IDs]} for [ID,pixels,scale]. Invalid when pixels None
#   or scale<=0; otherwise width=pixels/scale and width>=minimum passes. Set
#   audit; print summary 'kept=N; low=N; invalid=N'. Preserve records.
# INPUTS: records, minimum_um
```

**Practice:** 4 changed-input public cases; not hidden mastery grading.

### Prove independently

Define audit_widths(readings,ceiling_um) for [pixels,tag,scale] returning {'within':[IDs],'above':[IDs],'invalid':[IDs]} with inclusive ceiling and invalid missing pixels/nonpositive scales. Set result; print 'within=N | above=N | invalid=N'.

```python
# P05-CAPSTONE | PROVE | Build a tested, reusable field-measurement module
# TASK: Define audit_widths(readings,ceiling_um) for [pixels,tag,scale] returning
#   {'within':[IDs],'above':[IDs],'invalid':[IDs]} with inclusive ceiling and
#   invalid missing pixels/nonpositive scales. Set result; print 'within=N |
#   above=N | invalid=N'.
# INPUTS: readings, ceiling_um
```

**Practice:** 4 changed-input public cases; not hidden mastery grading.

**Debug task:** A function silently reuses an earlier sample's output. Identify a parameter or state bug.

**Common mistake:** A function that executes once is already a validated scientific measurement method.

**Scientific boundary:** All example field IDs, pixel widths and calibrations are synthetic; no raw-image measurement or biological effect is inferred.

**Capstone build passes:**

1. Define reusable record conversion with explicit input parameters.
2. Keep accepted, low and invalid measurements separately.
3. Return structured output; print a summary only at the top level.
4. Rebuild Prove using changed record ordering and a new ceiling policy.

**Scientific reflection:**

- Which function can be reused on a different specimen?
- What scientific assumptions are not verified by the code?
- How does your code avoid global state and invalid calibration?

## P05-REVIEW — Reconstruct an unfamiliar measurement function

**Why:** Learn to recall a clean function and explicit calibration/missingness behavior using biological measurement records.

A useful scientific script must recall a clean function and explicit calibration/missingness behavior. Distinguish a returned value from a printed diagnostic; a program should be reusable with changed inputs.

A function's parameters make assumptions explicit. The same code must give sensible outputs for missing, empty, changed and boundary data.

Do not mistake synthetic calibration values for verified microscope metadata. A correct calculation alone is not evidence of biological validity.

**Predict:** Predict the printed value and explain the input change.

**Prediction explanation:** Use input values and the specified missing-data policy to predict the result.

**Walkthrough:**

1. Identify all changing inputs and their physical units.
2. Predict the worked output before executing Python.
3. Change one input and investigate the output or error.

**Investigate:**

- Try a new sample ID, missing observation or zero count.
- Check one boundary without hardcoding a previously printed result.
- Explain why passing code checks is not proof of correct biological calibration.

### Apply

Write a short pseudocode plan for a fresh measurement function and its invalid-calibration policy.

```python
# P05-REVIEW | APPLY | Reconstruct an unfamiliar measurement function
# TASK: Write a short pseudocode plan for a fresh measurement function and its
#   invalid-calibration policy.
```

**Practice:** 0 changed-input public cases; not hidden mastery grading.

### Prove independently

Define summarize_measurements(values,scale) returning {'n':N,'mean_um':M}, with a mean of non-None values divided by positive scale. Empty or invalid scale returns {'n':0,'mean_um':None}. Set summary and print 'n=N | mean=M'.

```python
# P05-REVIEW | PROVE | Reconstruct an unfamiliar measurement function
# TASK: Define summarize_measurements(values,scale) returning {'n':N,'mean_um':M},
#   with a mean of non-None values divided by positive scale. Empty or invalid
#   scale returns {'n':0,'mean_um':None}. Set summary and print 'n=N | mean=M'.
# INPUTS: values, scale
```

**Practice:** 4 changed-input public cases; not hidden mastery grading.

**Debug task:** A function silently reuses an earlier sample's output. Identify a parameter or state bug.

**Common mistake:** A function that executes once is already a validated scientific measurement method.

**Scientific boundary:** All example field IDs, pixel widths and calibrations are synthetic; no raw-image measurement or biological effect is inferred.

**Scientific reflection:**

- Which function can be reused on a different specimen?
- What scientific assumptions are not verified by the code?
- How does your code avoid global state and invalid calibration?

## Export and reproduce

Export documented reusable field-measurement functions and their transparent QC classifications.

Export `field_measurement_functions.py` after completing Prove. Browser passing checks alone cannot establish retention, independent problem-solving or calibrated scientific validity.
