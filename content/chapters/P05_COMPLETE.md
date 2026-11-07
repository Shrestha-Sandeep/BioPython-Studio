# P05 — Make a reusable analysis function

**Learning status:** browser learner-pilot chapter. Not independent-mastery certification.

Replace repeated calculations with functions, parameters, local state, documentation, validation and standard-library imports. Build a reusable, reproducible field measurement script.

**Source and provenance:** https://github.com/guiwitz/PyImageCourse_beginner/blob/master/Appendix_Functions.ipynb. Additional explanations follow Python for Biologists, the Python Data Science Handbook and Python standard-library documentation. Scientific data in lessons are fictional; image references must retain attribution in `assets/witz/CREDITS.md`.

**Science boundary:** Synthetic numeric training records are not quantitative microscopy.

## P05-G01 — Return values from a measurement function

**Why:** Learn to reuse one unit-correct conversion rather than copying a result using biological measurement records.

A useful scientific script must reuse one unit-correct conversion rather than copying a result. Distinguish a returned value from a printed diagnostic; a program should be reusable with changed inputs.

A function's parameters make assumptions explicit. The same code must give sensible outputs for missing, empty, changed and boundary data.

Do not mistake synthetic calibration values for verified microscope metadata. A correct calculation alone is not evidence of biological validity.

**Predict:** How does the return value change when pixel width halves?

**Runnable teaching example (not the solution):**

```python
def pixel_width(pixels, scale):
    return pixels / scale
print(pixel_width(48, 4))
print(pixel_width(24, 4))
```

**Prediction explanation:** The returned physical width halves from 12.0 to 6.0; the same function handles both inputs.

**Walkthrough:**

1. Identify all changing inputs and their physical units.
2. Predict the worked output before executing Python.
3. Change one input and investigate the output or error.

**Investigate:**

- Try a new sample ID, missing observation or zero count.
- Check one boundary without hardcoding a previously printed result.
- Explain why passing code checks is not proof of correct biological calibration.

### Apply

Define to_um(pixels, px_per_um), returning pixels/px_per_um. Set width_um using supplied positive calibration.

```python
# P05-G01 | APPLY | Return values from a measurement function
# TASK: Define to_um(pixels, px_per_um), returning pixels/px_per_um. Set width_um
#   using supplied positive calibration.
# INPUTS: pixels, px_per_um
```

**Practice:** 3 changed-input public cases; no private mastery grading.

### Prove independently

Write speed_um_per_min(displacement_px, calibration_px_per_um, interval_min); set speed using the supplied values.

```python
# P05-G01 | PROVE | Return values from a measurement function
# TASK: Write speed_um_per_min(displacement_px, calibration_px_per_um,
#   interval_min); set speed using the supplied values.
# INPUTS: displacement_px, calibration_px_per_um, interval_min
```

**Practice:** 3 changed-input public cases; no private mastery grading.

**Debugging exercise:** A function silently reuses an earlier sample's output. Identify a parameter or state bug.

**Misconception:** A function that executes once is already a validated scientific measurement method.

**Scientific limit:** All example field IDs, pixel widths and calibrations are synthetic; no raw-image measurement or biological effect is inferred.

## P05-G02 — Use explicit parameters and defaults

**Why:** Learn to make acquisition choices visible in parameter lists using biological measurement records.

A useful scientific script must make acquisition choices visible in parameter lists. Distinguish a returned value from a printed diagnostic; a program should be reusable with changed inputs.

A function's parameters make assumptions explicit. The same code must give sensible outputs for missing, empty, changed and boundary data.

Do not mistake synthetic calibration values for verified microscope metadata. A correct calculation alone is not evidence of biological validity.

**Predict:** What is the output with and without the explicit channel?

**Runnable teaching example (not the solution):**

```python
def describe(field_id, channel='GFP'):
    return f'{field_id} | {channel}'
print(describe('F07'))
print(describe('F07', channel='DAPI'))
```

**Prediction explanation:** F07 | GFP and F07 | DAPI. The explicit keyword overrides the documented default.

**Walkthrough:**

1. Identify all changing inputs and their physical units.
2. Predict the worked output before executing Python.
3. Change one input and investigate the output or error.

**Investigate:**

- Try a new sample ID, missing observation or zero count.
- Check one boundary without hardcoding a previously printed result.
- Explain why passing code checks is not proof of correct biological calibration.

### Apply

Define describe_field(field_id, channel='GFP') returning 'ID | channel'; call it with supplied field_id and channel to create label.

```python
# P05-G02 | APPLY | Use explicit parameters and defaults
# TASK: Define describe_field(field_id, channel='GFP') returning 'ID | channel';
#   call it with supplied field_id and channel to create label.
# INPUTS: field_id, channel
```

**Practice:** 3 changed-input public cases; no private mastery grading.

### Prove independently

Define passes_focus(score, minimum=0.8): False for None or values outside 0..1; otherwise score>=minimum. Set accepted from focus_score, threshold.

```python
# P05-G02 | PROVE | Use explicit parameters and defaults
# TASK: Define passes_focus(score, minimum=0.8): False for None or values outside
#   0..1; otherwise score>=minimum. Set accepted from focus_score, threshold.
# INPUTS: focus_score, threshold
```

**Practice:** 3 changed-input public cases; no private mastery grading.

**Debugging exercise:** A function silently reuses an earlier sample's output. Identify a parameter or state bug.

**Misconception:** A function that executes once is already a validated scientific measurement method.

**Scientific limit:** All example field IDs, pixel widths and calibrations are synthetic; no raw-image measurement or biological effect is inferred.

## P05-G03 — Separate local state from source data

**Why:** Learn to avoid stale global values and unexpected mutation using biological measurement records.

A useful scientific script must avoid stale global values and unexpected mutation. Distinguish a returned value from a printed diagnostic; a program should be reusable with changed inputs.

A function's parameters make assumptions explicit. The same code must give sensible outputs for missing, empty, changed and boundary data.

Do not mistake synthetic calibration values for verified microscope metadata. A correct calculation alone is not evidence of biological validity.

**Predict:** Does a second call add results from the first?

**Runnable teaching example (not the solution):**

```python
def keep(values, minimum):
    chosen = []
    for value in values:
        if value is not None and value >= minimum:
            chosen.append(value)
    return chosen
print(keep([0.9, None, 0.3], 0.8))
```

**Prediction explanation:** No. A fresh chosen list is initialized on each call, so the function does not leak state.

**Walkthrough:**

1. Identify all changing inputs and their physical units.
2. Predict the worked output before executing Python.
3. Change one input and investigate the output or error.

**Investigate:**

- Try a new sample ID, missing observation or zero count.
- Check one boundary without hardcoding a previously printed result.
- Explain why passing code checks is not proof of correct biological calibration.

### Apply

Define keep_scores(scores, minimum): return new list of non-None scores in 0..1 at/above minimum, leaving scores unchanged. Set selected.

```python
# P05-G03 | APPLY | Separate local state from source data
# TASK: Define keep_scores(scores, minimum): return new list of non-None scores in
#   0..1 at/above minimum, leaving scores unchanged. Set selected.
# INPUTS: scores, minimum
```

**Practice:** 3 changed-input public cases; no private mastery grading.

### Prove independently

Define scaled_counts(counts, factor) returning a new list of every count multiplied by factor; set scaled without mutating counts.

```python
# P05-G03 | PROVE | Separate local state from source data
# TASK: Define scaled_counts(counts, factor) returning a new list of every count
#   multiplied by factor; set scaled without mutating counts.
# INPUTS: counts, factor
```

**Practice:** 3 changed-input public cases; no private mastery grading.

**Debugging exercise:** A function silently reuses an earlier sample's output. Identify a parameter or state bug.

**Misconception:** A function that executes once is already a validated scientific measurement method.

**Scientific limit:** All example field IDs, pixel widths and calibrations are synthetic; no raw-image measurement or biological effect is inferred.

## P05-G04 — Document types and scientific meaning

**Why:** Learn to state input types, return values and missing-data policy using biological measurement records.

A useful scientific script must state input types, return values and missing-data policy. Distinguish a returned value from a printed diagnostic; a program should be reusable with changed inputs.

A function's parameters make assumptions explicit. The same code must give sensible outputs for missing, empty, changed and boundary data.

Do not mistake synthetic calibration values for verified microscope metadata. A correct calculation alone is not evidence of biological validity.

**Predict:** Do type hints enforce physical calibration?

**Runnable teaching example (not the solution):**

```python
def specimen_label(sample_id: str, fields: int) -> str:
    """Return a specimen identifier and field count."""
    return f'{sample_id}: {fields} fields'
print(specimen_label('WT', 3))
print(specimen_label.__annotations__)
```

**Prediction explanation:** No. Annotations document expected Python types; calibration validity must be checked independently.

**Walkthrough:**

1. Identify all changing inputs and their physical units.
2. Predict the worked output before executing Python.
3. Change one input and investigate the output or error.

**Investigate:**

- Try a new sample ID, missing observation or zero count.
- Check one boundary without hardcoding a previously printed result.
- Explain why passing code checks is not proof of correct biological calibration.

### Apply

Define specimen_label(sample_id: str, fields: int) -> str with docstring containing 'fields'. Return 'ID: N fields'; set summary.

```python
# P05-G04 | APPLY | Document types and scientific meaning
# TASK: Define specimen_label(sample_id: str, fields: int) -> str with docstring
#   containing 'fields'. Return 'ID: N fields'; set summary.
# INPUTS: sample_id, fields
```

**Practice:** 3 changed-input public cases; no private mastery grading.

### Prove independently

Define mean_or_none(values: list) -> float | None with docstring containing 'mean'; return arithmetic mean or None for empty. Set result.

```python
# P05-G04 | PROVE | Document types and scientific meaning
# TASK: Define mean_or_none(values: list) -> float | None with docstring
#   containing 'mean'; return arithmetic mean or None for empty. Set result.
# INPUTS: values
```

**Practice:** 3 changed-input public cases; no private mastery grading.

**Debugging exercise:** A function silently reuses an earlier sample's output. Identify a parameter or state bug.

**Misconception:** A function that executes once is already a validated scientific measurement method.

**Scientific limit:** All example field IDs, pixel widths and calibrations are synthetic; no raw-image measurement or biological effect is inferred.

## P05-G05 — Raise and handle invalid inputs

**Why:** Learn to reject invalid calibrations without fabricating zero using biological measurement records.

A useful scientific script must reject invalid calibrations without fabricating zero. Distinguish a returned value from a printed diagnostic; a program should be reusable with changed inputs.

A function's parameters make assumptions explicit. The same code must give sensible outputs for missing, empty, changed and boundary data.

Do not mistake synthetic calibration values for verified microscope metadata. A correct calculation alone is not evidence of biological validity.

**Predict:** Why does this print ValueError rather than a plausible width?

**Runnable teaching example (not the solution):**

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

**Prediction explanation:** A nonpositive calibration does not support a physical-width measurement; the error is explicit.

**Walkthrough:**

1. Identify all changing inputs and their physical units.
2. Predict the worked output before executing Python.
3. Change one input and investigate the output or error.

**Investigate:**

- Try a new sample ID, missing observation or zero count.
- Check one boundary without hardcoding a previously printed result.
- Explain why passing code checks is not proof of correct biological calibration.

### Apply

Define convert_width(pixels,scale) raising ValueError if scale<=0; otherwise divide. Define safe_width with try/except ValueError returning {'ok':True,'value':width} or {'ok':False,'value':None}. Set result.

```python
# P05-G05 | APPLY | Raise and handle invalid inputs
# TASK: Define convert_width(pixels,scale) raising ValueError if scale<=0;
#   otherwise divide. Define safe_width with try/except ValueError returning
#   {'ok':True,'value':width} or {'ok':False,'value':None}. Set result.
# INPUTS: pixels, scale
```

**Practice:** 3 changed-input public cases; no private mastery grading.

### Prove independently

Define read_quality(score) raising ValueError for None or outside 0..1; define quality_report(score) catching ValueError and returning 'VALID' or 'INVALID'. Set status.

```python
# P05-G05 | PROVE | Raise and handle invalid inputs
# TASK: Define read_quality(score) raising ValueError for None or outside 0..1;
#   define quality_report(score) catching ValueError and returning 'VALID' or
#   'INVALID'. Set status.
# INPUTS: focus_score
```

**Practice:** 3 changed-input public cases; no private mastery grading.

**Debugging exercise:** A function silently reuses an earlier sample's output. Identify a parameter or state bug.

**Misconception:** A function that executes once is already a validated scientific measurement method.

**Scientific limit:** All example field IDs, pixel widths and calibrations are synthetic; no raw-image measurement or biological effect is inferred.

## P05-G06 — Import standard-library analysis tools

**Why:** Learn to use explicit imports instead of copied constants using biological measurement records.

A useful scientific script must use explicit imports instead of copied constants. Distinguish a returned value from a printed diagnostic; a program should be reusable with changed inputs.

A function's parameters make assumptions explicit. The same code must give sensible outputs for missing, empty, changed and boundary data.

Do not mistake synthetic calibration values for verified microscope metadata. A correct calculation alone is not evidence of biological validity.

**Predict:** Where do pi and arithmetic mean originate?

**Runnable teaching example (not the solution):**

```python
import math
import statistics
print(round(math.pi, 3))
print(statistics.mean([2,4,6]))
```

**Prediction explanation:** math supplies pi and statistics supplies mean; imports make their source explicit.

**Walkthrough:**

1. Identify all changing inputs and their physical units.
2. Predict the worked output before executing Python.
3. Change one input and investigate the output or error.

**Investigate:**

- Try a new sample ID, missing observation or zero count.
- Check one boundary without hardcoding a previously printed result.
- Explain why passing code checks is not proof of correct biological calibration.

### Apply

Import math; define circle_area_um2(radius_um) using math.pi * radius_um**2. Return None for radius<0; set area_um2.

```python
# P05-G06 | APPLY | Import standard-library analysis tools
# TASK: Import math; define circle_area_um2(radius_um) using math.pi *
#   radius_um**2. Return None for radius<0; set area_um2.
# INPUTS: radius_um
```

**Practice:** 3 changed-input public cases; no private mastery grading.

### Prove independently

Import statistics; define mean_focus(scores) ignoring None, returning None if no valid entries. Set mean_score.

```python
# P05-G06 | PROVE | Import standard-library analysis tools
# TASK: Import statistics; define mean_focus(scores) ignoring None, returning None
#   if no valid entries. Set mean_score.
# INPUTS: scores
```

**Practice:** 3 changed-input public cases; no private mastery grading.

**Debugging exercise:** A function silently reuses an earlier sample's output. Identify a parameter or state bug.

**Misconception:** A function that executes once is already a validated scientific measurement method.

**Scientific limit:** All example field IDs, pixel widths and calibrations are synthetic; no raw-image measurement or biological effect is inferred.

## P05-CAPSTONE — Build a tested, reusable field-measurement module

**Why:** Learn to combine documented unit conversion with traceable field-level QC using biological measurement records.

A useful scientific script must combine documented unit conversion with traceable field-level QC. Distinguish a returned value from a printed diagnostic; a program should be reusable with changed inputs.

A function's parameters make assumptions explicit. The same code must give sensible outputs for missing, empty, changed and boundary data.

Do not mistake synthetic calibration values for verified microscope metadata. A correct calculation alone is not evidence of biological validity.

**Predict:** Why must an unknown width return None rather than zero?

**Runnable teaching example (not the solution):**

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

**Practice:** 4 changed-input public cases; no private mastery grading.

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

**Practice:** 4 changed-input public cases; no private mastery grading.

**Debugging exercise:** A function silently reuses an earlier sample's output. Identify a parameter or state bug.

**Misconception:** A function that executes once is already a validated scientific measurement method.

**Scientific limit:** All example field IDs, pixel widths and calibrations are synthetic; no raw-image measurement or biological effect is inferred.

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

**Practice:** 0 changed-input public cases; no private mastery grading.

### Prove independently

Define summarize_measurements(values,scale) returning {'n':N,'mean_um':M}, with a mean of non-None values divided by positive scale. Empty or invalid scale returns {'n':0,'mean_um':None}. Set summary and print 'n=N | mean=M'.

```python
# P05-REVIEW | PROVE | Reconstruct an unfamiliar measurement function
# TASK: Define summarize_measurements(values,scale) returning {'n':N,'mean_um':M},
#   with a mean of non-None values divided by positive scale. Empty or invalid
#   scale returns {'n':0,'mean_um':None}. Set summary and print 'n=N | mean=M'.
# INPUTS: values, scale
```

**Practice:** 4 changed-input public cases; no private mastery grading.

**Debugging exercise:** A function silently reuses an earlier sample's output. Identify a parameter or state bug.

**Misconception:** A function that executes once is already a validated scientific measurement method.

**Scientific limit:** All example field IDs, pixel widths and calibrations are synthetic; no raw-image measurement or biological effect is inferred.

**Scientific reflection:**

- Which function can be reused on a different specimen?
- What scientific assumptions are not verified by the code?
- How does your code avoid global state and invalid calibration?

## Export and independent use

Export documented reusable field-measurement functions and their transparent QC classifications.

Export as `field_measurement_functions.py` after completing the Prove capstone. A successful public check does not establish retained mastery or calibrated biological validity.
