# P01 — Run your first scientific program (complete chapter candidate)

> **Status:** Original, fully specified content candidate. Not yet learner-tested or certified for 95/100 pedagogical effectiveness. Based on the [v2.1 master blueprint](../../docs/BIOPYTHON_MASTER_COURSE_BLUEPRINT_V2_1.md). Import with `content/p01/lesson.json`; author solutions are stored separately.

## The real scientific problem

Every microscopy analysis begins with an observation and its identity: a specimen, image acquisition, condition, observation number or calibration. A script is useful when it describes a *different* record without modifying its logic. This first chapter develops a complete but deliberately small `specimen_report.py` through seven meaningful mini-goals.

### A genuine biological context, without invented quantitative measurements

See the [Human Protein Atlas Cell Atlas](https://www.proteinatlas.org/humanproteome/cell) for authentic immunofluorescence examples. This chapter uses **synthetic** record identifiers and length/scale values. Do not infer raw channel intensities, verified calibration or object counts from a display image. Working directly with real pixel arrays begins in I01.

### Prior knowledge

No Python packages or terminal commands are required. Familiarity with specimens, images and measurement units is sufficient.

### How to study

For each mini-goal, **Predict → Run → Investigate → Modify → Write → Debug/Transfer**. The interactive view exposes one task at a time in the frozen IDE. `Learn` provides a worked example; `Apply` uses a different context with optional hints; `Prove` requires a fresh, independent solution. A practice check runs *real Python* on changed inputs but does not itself certify retained mastery. Record the bug and the reason, not just the repaired code.

## Learning map and outcomes

| Mini-goal | Competency | Practical outcome |
|---|---|---|
| P01-G01 | 001 | Run a scientific Python script |
| P01-G02 | 005 | Name experimental data with variables |
| P01-G03 | 006 | Calculate quantities and units |
| P01-G04 | 007 | Inspect integers, floats and Booleans |
| P01-G05 | 002 | Read tracebacks and repair mistakes |
| P01-G06 | 003 | Read help and function documentation |
| P01-G07 | 004 | Understand notebook state and clean runs |

## Worked and independent lesson sequence

## P01-G01 — Run a scientific Python script

**Scientific purpose:** Python replaces handwritten transcription when the same program can describe another sample.

**Mini-goal / competency:** 001. **Outcome:** Run a scientific Python script.

Python executes statements in order. Typing a command does nothing until Run executes it.

Assignment such as sample_id = 'N2' stores a value but produces no printed output. print(sample_id) explicitly emits stdout.

A notebook may show the last expression automatically, while a script needs print. Predict output before running, then deliberately remove print to confirm.


### Worked example (predict before running)

```python
sample_id = 'N2_P03'
fields = 6
print(sample_id, fields)
```

**Prediction question:** How many lines are printed, and why?

**Investigate:** Run the program, examine actual stdout or the traceback, change one input, and state whether your prediction was correct. Do not hide a failure by entering a fixed answer.

### Apply — build with different data

Given specimen and fields, assign report in the format 'ID: N fields' and print it.

The exercises supply the following initial inputs: `specimen, fields`. Create the result variable described in the task. Run it against changed data using the practice checks in the lesson package.

### Prove — independent construction

Using unrelated variable names (sample, observed), assign outcome to 'ID | N observations' without pasting a previous output.

Use the blank editor and new input names. Avoid reading the reference solution. Correct Python syntax alone is insufficient: explain the data and check the result on a new case.

**Typical misconception:** No output means the assignment did not execute.

**Recovery:** Work through a minimal two-line program or smaller number, then return to the original task.

**Scientific boundary:** Numbers are invented training records, not biological replicate observations.


---

## P01-G02 — Name experimental data with variables

**Scientific purpose:** Meaningful names prevent copied scripts from silently referring to the wrong sample.

**Mini-goal / competency:** 005. **Outcome:** Name experimental data with variables.

Use descriptive snake_case names such as specimen_id rather than x. Text identifiers stay strings, while counts remain numerical values.

Names refer to values in the present execution namespace. After changing a name's value, statements that previously used the old value will not be recomputed automatically.

A reusable report should derive text from its inputs; changing the specimen ID must change the output without editing the string literal of the report.


### Worked example (predict before running)

```python
specimen_id = 'N2_P03'
field_count = 4
print(f'{specimen_id}: {field_count} recorded fields')
```

**Prediction question:** If field_count is changed to 9, which expression must be rerun?

**Investigate:** Run the program, examine actual stdout or the traceback, change one input, and state whether your prediction was correct. Do not hide a failure by entering a fixed answer.

### Apply — build with different data

Construct description from specimen_id, field_count and channel_name: 'ID: N fields, channel X'.

The exercises supply the following initial inputs: `specimen_id, field_count, channel_name`. Create the result variable described in the task. Run it against changed data using the practice checks in the lesson package.

### Prove — independent construction

Build summary from condition and replicate and count using 'condition | replicate R | N images'.

Use the blank editor and new input names. Avoid reading the reference solution. Correct Python syntax alone is insufficient: explain the data and check the result on a new case.

**Typical misconception:** A specimen identifier with digits is a numerical measurement.

**Recovery:** Work through a minimal two-line program or smaller number, then return to the original task.

**Scientific boundary:** Fields, images and biological replicates are distinct experimental units.


---

## P01-G03 — Calculate quantities and units

**Scientific purpose:** Science requires dimensional meaning as well as arithmetic correctness.

**Mini-goal / competency:** 006. **Outcome:** Calculate quantities and units.

A pixel width can be converted to micrometres only with a verified pixel calibration. A width of 48 pixels at 4 pixels per micrometre represents 12 micrometres.

The unit relationship is pixels divided by pixels per micrometre. Multiplication would produce the wrong physical quantity, even though Python could run the expression successfully.

A larger pixels-per-micrometre value gives a smaller physical width for a fixed pixel count. Zero calibration causes ZeroDivisionError and must not be invented or silently replaced.


### Worked example (predict before running)

```python
width_pixels = 48
pixels_per_um = 4.0
width_um = width_pixels / pixels_per_um
print(width_um)
```

**Prediction question:** What happens to width_um if pixels_per_um is doubled?

**Investigate:** Run the program, examine actual stdout or the traceback, change one input, and state whether your prediction was correct. Do not hide a failure by entering a fixed answer.

### Apply — build with different data

Compute segment_um from segment_pixels / scale_px_per_um.

The exercises supply the following initial inputs: `segment_pixels, scale_px_per_um`. Create the result variable described in the task. Run it against changed data using the practice checks in the lesson package.

### Prove — independent construction

Calculate displacement_um and speed_um_per_min from displacement_pixels, calibration_px_per_um and interval_minutes.

Use the blank editor and new input names. Avoid reading the reference solution. Correct Python syntax alone is insufficient: explain the data and check the result on a new case.

**Typical misconception:** A numerical result with no units is already scientifically meaningful.

**Recovery:** Work through a minimal two-line program or smaller number, then return to the original task.

**Scientific boundary:** The calibration and time interval here are synthetic assumptions, not microscope metadata.


---

## P01-G04 — Inspect integers, floats and Booleans

**Scientific purpose:** Correct type interpretation prevents subtle errors in scientific code.

**Mini-goal / competency:** 007. **Outcome:** Inspect integers, floats and Booleans.

Python has integers (int), floating-point numbers (float), truth values (bool), and strings (str). The string '12.5' is not yet a number.

Use type(value).__name__ to inspect a value. Division with / returns a float even for integer inputs. A numeric string must be deliberately converted using float(...).

Python treats bool as a subclass of int, but that technical detail never makes a pass/fail flag a valid continuous biological measurement.


### Worked example (predict before running)

```python
field_count = 6
width_um = 12.5
qc_pass = True
for value in (field_count, width_um, qc_pass):
    print(type(value).__name__)
```

**Prediction question:** Which three type names are printed?

**Investigate:** Run the program, examine actual stdout or the traceback, change one input, and state whether your prediction was correct. Do not hide a failure by entering a fixed answer.

### Apply — build with different data

Convert measurement_text to float measurement_um; put its Python type name in type_name.

The exercises supply the following initial inputs: `measurement_text`. Create the result variable described in the task. Run it against changed data using the practice checks in the lesson package.

### Prove — independent construction

From count_value, fraction_value and qc_flag, store their type names in type_labels in the same order.

Use the blank editor and new input names. Avoid reading the reference solution. Correct Python syntax alone is insufficient: explain the data and check the result on a new case.

**Typical misconception:** What print displays is sufficient to identify a value's type.

**Recovery:** Work through a minimal two-line program or smaller number, then return to the original task.

**Scientific boundary:** A Boolean QC flag is not a quantitative measurement.


---

## P01-G05 — Read tracebacks and repair mistakes

**Scientific purpose:** Tracebacks are diagnostic evidence; masking them threatens reproducibility.

**Mini-goal / competency:** 002. **Outcome:** Read tracebacks and repair mistakes.

A traceback points to the statement that failed and ends with an exception class and explanation. Read the last line first, then inspect variable names on the failing line.

A NameError normally means the referenced name is undefined, often because of a typo or an execution-order problem. Correct the cause rather than hardcoding the result.

ZeroDivisionError and ValueError are different: the first indicates an invalid denominator, the second can indicate failed numeric parsing. Both deserve investigation.


### Worked example (predict before running)

```python
sample_id = 'N2_P03'
print(sampel_id)  # deliberately wrong spelling
```

**Prediction question:** Which variable name does NameError identify?

**Investigate:** Run the program, examine actual stdout or the traceback, change one input, and state whether your prediction was correct. Do not hide a failure by entering a fixed answer.

### Apply — build with different data

Repair the example so result describes plate_id and field_count; the broken name was plateid.

The exercises supply the following initial inputs: `plate_id, field_count`. Create the result variable described in the task. Run it against changed data using the practice checks in the lesson package.

### Prove — independent construction

The broken program uses pixel rather than pixels; compute distance_um from pixels / pixels_per_um.

Use the blank editor and new input names. Avoid reading the reference solution. Correct Python syntax alone is insufficient: explain the data and check the result on a new case.

**Typical misconception:** An exception can be ignored if the final-looking number is plausible.

**Recovery:** Work through a minimal two-line program or smaller number, then return to the original task.

**Scientific boundary:** Do not replace invalid calibration with an invented measurement.


---

## P01-G06 — Read help and function documentation

**Scientific purpose:** Documentation skills transfer across NumPy, Pandas, scikit-image and rapidly changing libraries.

**Mini-goal / competency:** 003. **Outcome:** Read help and function documentation.

Built-ins such as len, abs and round have documented behavior. Many expose a __doc__ attribute that you can inspect; help(...) also opens documentation.

When approaching a function, identify its expected input, return value and failure behavior. The purpose is to understand an interface, not to memorize long documentation paragraphs.

Rounding changes displayed precision; it cannot improve the accuracy of an uncalibrated measurement. The same distinction will matter in microscopy statistics.


### Worked example (predict before running)

```python
print((round.__doc__ or '').splitlines()[0])
print(round(12.345, 2))
```

**Prediction question:** Does displaying two decimals make a measurement more accurate?

**Investigate:** Run the program, examine actual stdout or the traceback, change one input, and state whether your prediction was correct. Do not hide a failure by entering a fixed answer.

### Apply — build with different data

Store documentation_line as the first nonempty line from len.__doc__, and sample_length as len(sample_id).

The exercises supply the following initial inputs: `sample_id`. Create the result variable described in the task. Run it against changed data using the practice checks in the lesson package.

### Prove — independent construction

Inspect abs.__doc__ into doc_head and calculate absolute_change from signed_change.

Use the blank editor and new input names. Avoid reading the reference solution. Correct Python syntax alone is insufficient: explain the data and check the result on a new case.

**Typical misconception:** Reading an example's output is the same as knowing its documented behavior.

**Recovery:** Work through a minimal two-line program or smaller number, then return to the original task.

**Scientific boundary:** Formatting is not scientific calibration or measurement uncertainty.


---

## P01-G07 — Understand notebook state and clean runs

**Scientific purpose:** Out-of-order notebooks can produce plausible but stale numbers even without an exception.

**Mini-goal / competency:** 004. **Outcome:** Understand notebook state and clean runs.

Notebook cells share interpreter state. Editing the text of an earlier cell does not rerun calculations stored in downstream variables.

In a clean script, statements execute top to bottom. To verify a notebook, restart its kernel and run all cells in the documented order.

This studio exercise simulates stale state using normal statements. It does not pretend that the browser editor already provides full Jupyter semantics; a real notebook handoff appears in P06.


### Worked example (predict before running)

```python
field_count = 4
doubled = field_count * 2
field_count = 9
print(doubled)  # still 8
```

**Prediction question:** Why does doubled remain 8 after field_count becomes 9?

**Investigate:** Run the program, examine actual stdout or the traceback, change one input, and state whether your prediction was correct. Do not hide a failure by entering a fixed answer.

### Apply — build with different data

Compute current_total freshly from current_count and multiplier without trusting an earlier result.

The exercises supply the following initial inputs: `current_count, multiplier`. Create the result variable described in the task. Run it against changed data using the practice checks in the lesson package.

### Prove — independent construction

On a clean run, compute adjusted_value = (baseline + adjustment) / scale.

Use the blank editor and new input names. Avoid reading the reference solution. Correct Python syntax alone is insufficient: explain the data and check the result on a new case.

**Typical misconception:** Changing code in a previous cell automatically updates stored values.

**Recovery:** Work through a minimal two-line program or smaller number, then return to the original task.

**Scientific boundary:** A visually plausible but stale analysis result is not reproducible.



## Capstone — save a reusable specimen report

**Scientific job:** Two imaginary samples have different counts and pixels-per-micrometre metadata. Write a short script that prints their labels and calculated physical width. Keep values and units explicit, inspect one type, and be able to explain the traceback from a deliberately misspelled variable. Recreate both summaries after a clean run.

A defensible final artifact should include:

1. A readable specimen identifier, with no hardcoded report output.
2. Original numeric measurement and explicit calibration as inputs.
3. A derived physical measurement whose direction under a calibration change is correct.
4. At least one use of `type(...)` or documented function lookup.
5. A recorded diagnosis of a real traceback and a reason for the fix.
6. A one-paragraph explanation of why notebook state can be stale.
7. An independent transfer attempt on unfamiliar inputs, with assistance noted.

**Technical checks:** avoid zero denominators, explain that the pixel calibration is synthetic, and confirm that output changes when the specimen and measurements change. A good report does not pretend that a microscope image was analyzed in this chapter.

## Retention and resumption

At the end of the chapter, preserve the final code plus the next action: start P02 by constructing a stable sample ID. On a later session, recreate a specimen report on new input *without consulting the previous answer*. Distinguish successful guided practice from independent solution and from delayed retained mastery.

## Authorship and third-party provenance

All teaching explanations and exercises in this document are original. Concepts are informed by Guillaume Witz [Python essentials](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/01-Python_essentials.ipynb) and [e01 exercises](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/e01-Python_basics.ipynb), the [official Python tutorial](https://docs.python.org/3/tutorial/), and the [Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/). No third-party text or microscopy image file is copied.

## Authoring/acceptance conditions

Every goal must have valid CPython example output, meaningful Python errors, at least two changed-input cases for Apply and Prove, documented help policy, a recoverable misconception, science limitation and a blank-editor transfer. Independent learner evaluation, actual delayed retrieval, accessibility and deployed Pyodide tests remain separate integration gates.
