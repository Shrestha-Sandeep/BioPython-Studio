# P01 — Your first scientific Python program

**Version 1.2 · Developed chapter manuscript and interactive course source**  
**Status:** implemented learning content and machine-checkable capstone. Still requires a genuine learner trial before educational quality can be considered validated.  
**Audience:** scientist familiar with biological specimens and image acquisition; beginner/intermediate beginner in Python.  
**Prerequisites:** no Python or package installation assumed.  
**Canonical scope:** competencies 001, 002, 003, 004, 005, 006, 007.  
**Primary references:** [Guillaume Witz, Python essentials](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/01-Python_essentials.ipynb), [Witz beginner exercises](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/e01-Python_basics.ipynb), [Python official tutorial](https://docs.python.org/3/tutorial/). This is original teaching text, not copied book prose.

## The question motivating this chapter

How can you report a specimen's identity, acquisition context and measurements with a program that continues to work on the *next* specimen?

Imagine examining fluorescence microscopy images of *C. elegans* or cultured cells. Every image has a specimen identifier; you may also have the number of recorded imaging fields, the fluorescent channel and pixel calibration. Copying results by hand is fragile because an accidental edit to a sample name or a measurement can contaminate downstream tables. Python allows you to represent a changing input record and calculate an interpretable result.

This first chapter is deliberately modest: **build one readable, reproducible report for different records.** You will not yet segment cells, measure nuclear fluorescence, read TIFF metadata or analyze biological replicate effects. You will learn the programming habits that make those later tasks defensible.

### Biological authenticity and honest boundaries

The [Human Protein Atlas Cell Atlas](https://www.proteinatlas.org/humanproteome/cell) provides genuine fluorescence microscopy examples to keep the scientific context visible. The IDE includes a previously bundled, credited PNG rendered from Witz's [Demo.ipynb](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/Demo.ipynb) (output cell 12); see [asset provenance and licensing](../../assets/witz/CREDITS.md). This figure is **not** the raw TIFF and cannot be used as calibrated numeric data. The sample IDs and numerical measurements **used in the exercises are fictional training data**. A displayed RGB fluorescence composite is not automatically a raw calibrated image. Even correct pixel arithmetic is not a scientific conclusion without reliable source metadata, appropriate segmentation controls and valid experimental design.

### How to use the interactive chapter

1. **Learn:** Read the concept, make a prediction before pressing Run, inspect the real Python output, change one assumption, and debug a deliberately misleading version. The worked example is editable.
2. **Apply:** Start from incomplete code and solve a similar task. Use optional progressive hints if stuck. The app runs your code on *changed inputs* rather than checking whether its text matches an example answer.
3. **Prove:** Start with a fresh task and unfamiliar variable names. Do not reuse an answer verbatim; demonstrate the underlying idea. A successful publicly visible practice check is useful evidence but cannot guarantee independent mastery.
4. **Chapter project:** Combine the skills in `specimen_report.py` and provide scientific reasoning about units, assumptions and error recovery.
5. **Return later:** After at least a day, recreate part of the workflow from memory on unfamiliar inputs. Time since the previous attempt is recorded locally; a browser cannot objectively certify retained learning merely from passing its publicly visible tests.

**Time and pace:** mini-goals are natural stopping points, not compulsory fixed-duration sessions. If a task becomes too easy, proceed to Prove; if it becomes difficult, inspect one example and return to a new task rather than memorizing a reference answer.

## P01 learning map

| Mini-goal | Canonical competency | Evidence you should produce |
|---|---|---|
| P01-G01 | 001 | Run a scientific Python script |
| P01-G02 | 005 | Name experimental data with variables |
| P01-G03 | 006 | Calculate quantities and units |
| P01-G04 | 007 | Inspect integers, floats and Booleans |
| P01-G05 | 002 | Read tracebacks and repair mistakes |
| P01-G06 | 003 | Read help and function documentation |
| P01-G07 | 004 | Understand notebook state and clean runs |

These seven mini-goals are not seven new syllabus competencies. They collectively cover P01's frozen seven competencies exactly once. The chapter capstone introduces no new competency ID.

---

## 1. Run a scientific Python script (P01-G01)

**Scientific purpose:** Python replaces handwritten transcription when the same program can describe another sample.

### Learn: the central idea

**A program consists of statements.** Python executes a script from top to bottom. A statement can assign a value (`specimen = 'N2_P03'`), perform a calculation, or print information. The order matters: a name must be assigned before you use it. Pressing Run executes your current editor code; typing it alone does not.

**Assignment is not an output instruction.** In `fields = 6`, the name `fields` refers to the integer 6. That line does not print anything. `print(specimen, fields)` produces one line in stdout, separating the values with a space. The output console is not a separate dataset: it is text emitted by the executed script.

**Why this is scientific programming:** specimen identity and field counts change between acquisitions. A program that prints `N2_P03 6` as a literal would appear correct once but fail for a second specimen. Store the inputs in names; then use those names when constructing the report.

**Scripts versus notebooks:** a notebook environment can display the value of its final expression automatically. For an ordinary script, rely on an explicit `print` if you want a visible report. P06 will teach real notebook files; P01 uses fresh script execution.

### Worked example: predict, then run

```python
sample_id = 'N2_P03'
fields = 6
print(sample_id, fields)
```

**Before running:** How many lines are printed, and why?

**Check your reasoning only after attempting the prediction:** Exactly one line: `N2_P03 6`. Two assignments create values; `print` emits the line.

**Step-by-step walkthrough**

1. Line 1 assigns a string sample identifier; line 2 assigns a numeric field count.
2. Line 3 reads both values and sends one combined line to stdout.
3. Try removing line 3. The script succeeds, but there is no output. Put it back before continuing.

**Investigation / modify**

1. Predict precisely how many lines will appear in the console.
2. Change `fields` to `9`, run again, and locate the changed part of stdout.
3. Replace the printed variables with a fixed quoted label. Explain why that apparently works only for one record.

**Deliberate debugging challenge:** Delete the definition of `sample_id` and run. Which exception occurs? Restore the definition. Do not replace the missing variable with a fixed output.

### Apply: construct a program from different inputs

Given specimen and fields, assign report in the format 'ID: N fields' and print it.

**Initially supplied variables:** `specimen`, `fields`.

```python
# Available inputs: specimen, fields
```

A correct Apply solution must respond to the practice-check cases, not merely the first displayed values. The app provides 2 changed-input cases and two optional progressive hints. Predict the expected result for the first case before checking.

### Prove: independent transfer

Using unrelated variable names (sample, observed), assign outcome to 'ID | N observations' without pasting a previous output.

**New input names:** `sample`, `observed`.

```python
# Available inputs: sample, observed
```

Reconstruct the solution independently. If you need to revisit the worked example, do so, but mark the attempt as assisted. Passing the public tests is one useful piece of evidence, not an independent learning certificate.

### Common misconception and recovery

**Misconception:** No output means the assignment did not execute.

**How to recover:** Delete the definition of `sample_id` and run. Which exception occurs? Restore the definition. Do not replace the missing variable with a fixed output. Use a minimal version of the calculation; explain what changes between correct and incorrect versions before retrying the full task.

**Scientific boundary:** Numbers are invented training records, not biological replicate observations.

### Quick self-explanation

In a sentence or two, explain **why** the result changed when an input changed and **what this Python result does not tell you** about a real biological experiment.

---


## 2. Name experimental data with variables (P01-G02)

**Scientific purpose:** Meaningful names prevent copied scripts from silently referring to the wrong sample.

### Learn: the central idea

**Good scientific names identify what a value represents.** Prefer `specimen_id`, `field_count` and `channel_name` to `a`, `b` and `c`. Python identifiers may contain underscores and digits (not as the first character); they are case-sensitive. `sample_id` and `Sample_id` are different names.

**A specimen identifier is text.** The label `N2_P03` contains a number, but it is not something you should divide or average. In Python, text is written inside single or double quotes. The count of microscope fields is an integer; the two values serve different scientific purposes.

**An f-string joins values into an interpretable report.** Write `f'{specimen_id}: {field_count} fields'`. Python substitutes values for the expressions in braces. The resulting label updates when either input changes. The original variables remain unchanged.

**Assignment does not continuously recalculate derived values.** If you compute `description` and later change `field_count`, the old `description` stays as it was until you run the formatting statement again. This is a simple version of stale notebook state explored in G07.

### Worked example: predict, then run

```python
specimen_id = 'N2_P03'
field_count = 4
print(f'{specimen_id}: {field_count} recorded fields')
```

**Before running:** If field_count is changed to 9, which expression must be rerun?

**Check your reasoning only after attempting the prediction:** The report uses whatever values the variables hold at the moment the f-string is evaluated. A changed count must be followed by rerunning the report assignment.

**Step-by-step walkthrough**

1. The quoted specimen ID is stored as text; field_count is a number.
2. The f-string reads their current values to build a new string.
3. Rerun the assignment creating the description after changing one input.

**Investigation / modify**

1. Change the field count without changing the quoted report text, then rerun.
2. Change the condition to another specimen and check that only its identifier changes.
3. Intentionally refer to `specimen_ID` instead of `specimen_id`; inspect the case-sensitive NameError.

**Deliberate debugging challenge:** A colleague wrote `description = 'specimen_id: field_count fields'`. Why does this print literal words? Replace the string with an f-string.

### Apply: construct a program from different inputs

Construct description from specimen_id, field_count and channel_name: 'ID: N fields, channel X'.

**Initially supplied variables:** `specimen_id`, `field_count`, `channel_name`.

```python
# Available: specimen_id, field_count, channel_name
```

A correct Apply solution must respond to the practice-check cases, not merely the first displayed values. The app provides 2 changed-input cases and two optional progressive hints. Predict the expected result for the first case before checking.

### Prove: independent transfer

Build summary from condition, replicate and count using the format 'condition | replicate R | fields=N'. Use the changing count, not a fixed worded report.

**New input names:** `condition`, `replicate`, `count`.

```python
# Available: condition, replicate, count
```

Reconstruct the solution independently. If you need to revisit the worked example, do so, but mark the attempt as assisted. Passing the public tests is one useful piece of evidence, not an independent learning certificate.

### Common misconception and recovery

**Misconception:** A specimen identifier with digits is a numerical measurement.

**How to recover:** A colleague wrote `description = 'specimen_id: field_count fields'`. Why does this print literal words? Replace the string with an f-string. Use a minimal version of the calculation; explain what changes between correct and incorrect versions before retrying the full task.

**Scientific boundary:** Fields, images and biological replicates are distinct experimental units.

### Quick self-explanation

In a sentence or two, explain **why** the result changed when an input changed and **what this Python result does not tell you** about a real biological experiment.

---


## 3. Calculate quantities and units (P01-G03)

**Scientific purpose:** Science requires dimensional meaning as well as arithmetic correctness.

### Learn: the central idea

**Python arithmetic is straightforward; dimensional reasoning is not.** Use `+`, `-`, `*`, `/` and parentheses as you would in a scientific calculation. But write the units next to every input before choosing an operation.

**Suppose a microscope scale is given as pixels per micrometre.** A measured width of 48 pixels and a calibration of 4 pixels/µm implies 48 ÷ 4 = 12 µm. Multiplying would be dimensionally wrong. The variable name `pixels_per_um` makes the denominator's meaning visible.

**Physical scale is an assumption to verify, not an inference from a JPEG.** In this chapter the scale values are invented examples. In a real image-analysis workflow, you must obtain and validate calibration from acquisition metadata or a trustworthy scale bar.

**Boundary cases matter.** A width of 0 pixels converts to 0 µm with positive calibration. A calibration of 0 is invalid and division raises `ZeroDivisionError`. Do not quietly substitute 1 for missing calibration. Conditional validation will be introduced in P02.

**Never round early.** Floating-point arithmetic may represent values approximately. Keep numerical precision for analysis; format the presentation separately if needed, while respecting the uncertainty of the original measurement.

### Worked example: predict, then run

```python
width_pixels = 48
pixels_per_um = 4.0
width_um = width_pixels / pixels_per_um
print(width_um)
```

**Before running:** What happens to width_um if pixels_per_um is doubled?

**Check your reasoning only after attempting the prediction:** If pixels_per_um doubles from 4 to 8, the same 48 pixels represent 6 µm instead of 12 µm.

**Step-by-step walkthrough**

1. `width_pixels` is a measured size in pixels; `pixels_per_um` is a scale in pixels/µm.
2. Dividing the two gives a value with units µm.
3. Double the scale and observe that the physical width halves; this is the key dimensional check.

**Investigation / modify**

1. Before running, calculate 48 / 4 on paper, including units.
2. Change the calibration to 8 pixels/µm. Predict and verify the new width.
3. Temporarily use calibration = 0. Read the traceback and describe why inventing a physical size would be scientifically wrong.

**Deliberate debugging challenge:** A script multiplies width_pixels * pixels_per_um and calls it width_um. Python runs it. Is the result scientifically correct? Repair the formula.

### Apply: construct a program from different inputs

Compute segment_um from segment_pixels / scale_px_per_um.

**Initially supplied variables:** `segment_pixels`, `scale_px_per_um`.

```python
# Available: segment_pixels, scale_px_per_um (> 0)
```

A correct Apply solution must respond to the practice-check cases, not merely the first displayed values. The app provides 3 changed-input cases and two optional progressive hints. Predict the expected result for the first case before checking.

### Prove: independent transfer

Calculate displacement_um and speed_um_per_min from displacement_pixels, calibration_px_per_um and interval_minutes.

**New input names:** `displacement_pixels`, `calibration_px_per_um`, `interval_minutes`.

```python
# Available: displacement_pixels, calibration_px_per_um, interval_minutes (> 0)
```

Reconstruct the solution independently. If you need to revisit the worked example, do so, but mark the attempt as assisted. Passing the public tests is one useful piece of evidence, not an independent learning certificate.

### Common misconception and recovery

**Misconception:** A numerical result with no units is already scientifically meaningful.

**How to recover:** A script multiplies width_pixels * pixels_per_um and calls it width_um. Python runs it. Is the result scientifically correct? Repair the formula. Use a minimal version of the calculation; explain what changes between correct and incorrect versions before retrying the full task.

**Scientific boundary:** The calibration and time interval here are synthetic assumptions, not microscope metadata.

### Quick self-explanation

In a sentence or two, explain **why** the result changed when an input changed and **what this Python result does not tell you** about a real biological experiment.

---


## 4. Inspect integers, floats and Booleans (P01-G04)

**Scientific purpose:** Correct type interpretation prevents subtle errors in scientific code.

### Learn: the central idea

**Python distinguishes types.** `int` represents whole-number counts, `float` represents numerical values including fractions, and `bool` represents truth values `True` or `False`. A specimen name such as `'WT_07'` is text (`str`) even though it contains digits.

**Inspect rather than guess.** `type(field_count).__name__` produces the type name `'int'`; `type(width_um).__name__` gives `'float'`. These names help diagnose why an operation or comparison fails.

**Printed appearance can be misleading.** `print('7')` and `print(7)` both display 7, but the first is text and the second a number. `float('12.5')` makes an explicit numeric conversion; `float('unreadable')` raises ValueError.

**Division and logical interpretation:** the `/` operator produces floating-point output in ordinary numerical examples. Although Python's `bool` has a numerical relationship to integers, a QC pass/fail flag must be analyzed as a decision, not averaged as if it were biological fluorescence.

### Worked example: predict, then run

```python
field_count = 6
width_um = 12.5
qc_pass = True
print(type(field_count).__name__)
print(type(width_um).__name__)
print(type(qc_pass).__name__)
```

**Before running:** Which three Python type names are printed, in order?

**Check your reasoning only after attempting the prediction:** `int`, `float`, `bool` appear on separate lines, in the same order as the three print calls.

**Step-by-step walkthrough**

1. Print the types of three separately named variables, one per statement.
2. Try quotation marks around field_count and watch its type change from int to str.
3. A boolean `True` is not the same scientific quantity as a measured value of 1.

**Investigation / modify**

1. Predict int, float and bool for the three original variables.
2. Put quotation marks around field_count; rerun the type inspection.
3. Try `float('12.5')` and `float('unreadable')` and distinguish a successful conversion from ValueError.

**Deliberate debugging challenge:** A measurement is stored as `'12.5'` and the program attempts `measurement_text / 2`. Diagnose the error and convert explicitly before dividing.

### Apply: construct a program from different inputs

Convert measurement_text to float measurement_um; put its Python type name in type_name.

**Initially supplied variables:** `measurement_text`.

```python
# Available: measurement_text
```

A correct Apply solution must respond to the practice-check cases, not merely the first displayed values. The app provides 2 changed-input cases and two optional progressive hints. Predict the expected result for the first case before checking.

### Prove: independent transfer

From count_value, fraction_value and qc_flag, store their type names in type_labels in the same order.

**New input names:** `count_value`, `fraction_value`, `qc_flag`.

```python
# Available: count_value, fraction_value, qc_flag
```

Reconstruct the solution independently. If you need to revisit the worked example, do so, but mark the attempt as assisted. Passing the public tests is one useful piece of evidence, not an independent learning certificate.

### Common misconception and recovery

**Misconception:** What print displays is sufficient to identify a value's type.

**How to recover:** A measurement is stored as `'12.5'` and the program attempts `measurement_text / 2`. Diagnose the error and convert explicitly before dividing. Use a minimal version of the calculation; explain what changes between correct and incorrect versions before retrying the full task.

**Scientific boundary:** A Boolean QC flag is not a quantitative measurement.

### Quick self-explanation

In a sentence or two, explain **why** the result changed when an input changed and **what this Python result does not tell you** about a real biological experiment.

---


## 5. Read tracebacks and repair mistakes (P01-G05)

**Scientific purpose:** Tracebacks are diagnostic evidence; masking them threatens reproducibility.

### Learn: the central idea

**A traceback is not a verdict on your ability; it is a program diagnostic.** When an exception interrupts execution, the traceback shows the affected line and ends with an exception class and message. Read the final line first, then inspect the highlighted source line.

**NameError means a name is unavailable.** In the worked example the code defines `sample_id` but refers to `sampel_id`. Python sees different names. Carefully compare the characters; changing the code to print a fixed string does not repair the underlying bug.

**Other failures reveal different causes.** `ZeroDivisionError` points to division by zero; `ValueError` often occurs when input text cannot be parsed as a number. The correct response is to understand the relevant inputs and operation.

**Scientific significance:** a program that silently swallows errors might produce believable but invalid results. Later chapters will teach controlled exception handling; here preserve the full traceback and make a minimal fix.

**A debugging protocol:** reproduce the failure; locate the first relevant line; identify variable names and types; change one cause; rerun with the original *and* a new input.

### Worked example: predict, then run

```python
sample_id = 'N2_P03'
print(sampel_id)  # deliberately wrong spelling
```

**Before running:** Which variable name does NameError identify?

**Check your reasoning only after attempting the prediction:** Python raises `NameError` because `sampel_id` was never assigned. The defined variable is `sample_id`.

**Step-by-step walkthrough**

1. Read the final traceback line for `NameError` and the misspelled variable.
2. Find the definition and the later use; compare `sample_id` with `sampel_id`.
3. Correct the spelling, rerun, then change the specimen ID and rerun to verify the fix generalizes.

**Investigation / modify**

1. Run the faulty example before editing it and copy the exception name.
2. Fix the one-character spelling mistake rather than replacing the output.
3. Create a different NameError using a different undefined variable, then recover it.

**Deliberate debugging challenge:** Change `sample_id` to `sampel_id` in only one location and trace the failure. Why does a quoted fixed output conceal the error?

### Apply: construct a program from different inputs

Repair the example so result describes plate_id and field_count; the broken name was plateid.

**Initially supplied variables:** `plate_id`, `field_count`.

```python
# Available: plate_id, field_count
# Broken: result = f'{plateid}: {field_count} fields'
```

A correct Apply solution must respond to the practice-check cases, not merely the first displayed values. The app provides 2 changed-input cases and two optional progressive hints. Predict the expected result for the first case before checking.

### Prove: independent transfer

The broken program uses pixel rather than pixels; compute distance_um from pixels / pixels_per_um.

**New input names:** `pixels`, `pixels_per_um`.

```python
# Available: pixels, pixels_per_um
# Broken: distance_um = pixel / pixels_per_um
```

Reconstruct the solution independently. If you need to revisit the worked example, do so, but mark the attempt as assisted. Passing the public tests is one useful piece of evidence, not an independent learning certificate.

### Common misconception and recovery

**Misconception:** An exception can be ignored if the final-looking number is plausible.

**How to recover:** Change `sample_id` to `sampel_id` in only one location and trace the failure. Why does a quoted fixed output conceal the error? Use a minimal version of the calculation; explain what changes between correct and incorrect versions before retrying the full task.

**Scientific boundary:** Do not replace invalid calibration with an invented measurement.

### Quick self-explanation

In a sentence or two, explain **why** the result changed when an input changed and **what this Python result does not tell you** about a real biological experiment.

---


## 6. Read help and function documentation (P01-G06)

**Scientific purpose:** Documentation skills transfer across NumPy, Pandas, scikit-image and rapidly changing libraries.

### Learn: the central idea

**Documentation is a research skill.** You cannot and need not memorize every Python or scientific-library function. Instead, find what a function expects, what it returns and any important caveats. Built-in `help(function)` displays information in the running interpreter.

**Docstrings are a short route to reference information.** Many functions expose `function.__doc__`. You can inspect it using print or store it in a variable. `len` reports the number of items in a sequence, such as characters in a sample ID; `abs` returns an absolute magnitude.

**Be careful what a number means.** The length of a sample identifier is not a biological size or microscope measurement. It is a count of characters. Similarly, rounding with `round(...)` changes how a number is represented, not the accuracy of its origin.

**When libraries change, trust the installed environment's documentation.** Prefer current documentation for the Python version in your browser or local notebook. P06 will teach using package versions and reproducible environments.

### Worked example: predict, then run

```python
print(len('N2_P03'))
print(len.__doc__)
```

**Before running:** What does len('N2_P03') count, and what does its documentation describe?

**Check your reasoning only after attempting the prediction:** `len('N2_P03')` returns 6 characters. The function measures the length of a Python sequence, not a physical dimension.

**Step-by-step walkthrough**

1. Run `print(len('N2_P03'))`: it reports six characters.
2. Print `len.__doc__` and identify the purpose of the function. You need not parse the documentation with unfamiliar string methods.
3. Read `help(round)` if you want to learn about an optional argument; note how output formatting differs from improving measurement accuracy.

**Investigation / modify**

1. Use len to count an ID you choose, then change that ID.
2. Inspect len.__doc__ and find the statement describing its input.
3. Use abs(-5.0), then change the sign and explain why the output is nonnegative.

**Deliberate debugging challenge:** A learner claims `len('WT_07')` is a cell length in micrometres. Explain what it actually measures and where a genuine physical calibration must come from.

### Apply: construct a program from different inputs

Set documentation_line to the actual len.__doc__ string, and sample_length to len(sample_id). Do not paste documentation text.

**Initially supplied variables:** `sample_id`.

```python
# Available: sample_id
```

A correct Apply solution must respond to the practice-check cases, not merely the first displayed values. The app provides 2 changed-input cases and two optional progressive hints. Predict the expected result for the first case before checking.

### Prove: independent transfer

Store abs.__doc__ in doc_head and compute absolute_change from signed_change. Show how documentation helps you choose the correct built-in.

**New input names:** `signed_change`.

```python
# Available: signed_change
```

Reconstruct the solution independently. If you need to revisit the worked example, do so, but mark the attempt as assisted. Passing the public tests is one useful piece of evidence, not an independent learning certificate.

### Common misconception and recovery

**Misconception:** Reading an example's output is the same as knowing its documented behavior.

**How to recover:** A learner claims `len('WT_07')` is a cell length in micrometres. Explain what it actually measures and where a genuine physical calibration must come from. Use a minimal version of the calculation; explain what changes between correct and incorrect versions before retrying the full task.

**Scientific boundary:** Formatting is not scientific calibration or measurement uncertainty.

### Quick self-explanation

In a sentence or two, explain **why** the result changed when an input changed and **what this Python result does not tell you** about a real biological experiment.

---


## 7. Understand notebook state and clean runs (P01-G07)

**Scientific purpose:** Out-of-order notebooks can produce plausible but stale numbers even without an exception.

### Learn: the central idea

**Notebook execution state can become stale.** When a Jupyter notebook executes a cell, variables persist in a kernel's namespace. Editing a previously executed cell does not execute it again or automatically update later results.

**In the example**, `field_count` is 4 when Python calculates `doubled = field_count * 2`. That saves 8 in `doubled`. Later assigning `field_count = 9` does not alter the stored 8. To obtain 18, rerun the `doubled` calculation *after* updating field_count.

**A script makes the order explicit.** A clean script run starts at the first line and executes downward. The studio P01 worker also evaluates changed-input checks in a fresh execution namespace, to avoid accepting old values as current results.

**Reproducibility rule for notebooks:** restart the kernel and run all cells in intended order before sharing a result. A plausible result can be stale without any traceback. You will practice this with a real local Jupyter notebook later in P06.

**Explain the discrepancy, don't merely fix the print.** If a figure continues to show an old value, find the cell that last computed it and the inputs that were active at the time.

### Worked example: predict, then run

```python
field_count = 4
doubled = field_count * 2
field_count = 9
print(doubled)  # still 8
```

**Before running:** Why does doubled remain 8 after field_count becomes 9?

**Check your reasoning only after attempting the prediction:** The output is 8, not 18. The variable `doubled` held the earlier result and was never recalculated after field_count changed.

**Step-by-step walkthrough**

1. At line 1, field_count is 4. At line 2, doubled becomes 8.
2. Line 3 sets field_count to 9 but does not recalculate doubled.
3. Move the doubled assignment after line 3; the script now prints 18.

**Investigation / modify**

1. Predict whether the original script prints 8 or 18.
2. Move the calculation line to the end, rerun and explain the changed number.
3. Write a two-sentence notebook reproducibility note: what persists in memory and what requires rerunning.

**Deliberate debugging challenge:** A researcher changes a calibration in an earlier notebook cell but sees the same downstream result. Identify the stale variable and specify a clean-run procedure.

### Apply: construct a program from different inputs

Compute current_total freshly from current_count and multiplier without trusting an earlier result.

**Initially supplied variables:** `current_count`, `multiplier`.

```python
# Available: current_count, multiplier
```

A correct Apply solution must respond to the practice-check cases, not merely the first displayed values. The app provides 3 changed-input cases and two optional progressive hints. Predict the expected result for the first case before checking.

### Prove: independent transfer

On a clean run, compute adjusted_value = (baseline + adjustment) / scale.

**New input names:** `baseline`, `adjustment`, `scale`.

```python
# Available: baseline, adjustment, scale (> 0)
```

Reconstruct the solution independently. If you need to revisit the worked example, do so, but mark the attempt as assisted. Passing the public tests is one useful piece of evidence, not an independent learning certificate.

### Common misconception and recovery

**Misconception:** Changing code in a previous cell automatically updates stored values.

**How to recover:** A researcher changes a calibration in an earlier notebook cell but sees the same downstream result. Identify the stale variable and specify a clean-run procedure. Use a minimal version of the calculation; explain what changes between correct and incorrect versions before retrying the full task.

**Scientific boundary:** A visually plausible but stale analysis result is not reproducible.

### Quick self-explanation

In a sentence or two, explain **why** the result changed when an input changed and **what this Python result does not tell you** about a real biological experiment.

---

## 8. Integrated P01 capstone (P01-CAPSTONE) — `specimen_report.py`

**Research-style task:** Build a reproducible specimen record using all P01 skills rather than solving isolated syntax problems.

**Scientific question:** Can one short Python program describe changing microscope records without altering its calculation? A record has an ID, the number of imaged fields, the channel name, a length in pixels and a *supplied* calibration in pixels/µm.

**Required outputs:** Compute `width_um`, create the text `summary`, and store the Python type name of the converted width in `type_name`. Print the summary so it can be inspected. Each value must depend on the inputs supplied by the test case, not on a copied first-example answer.

**Design decision:** Work with a positive, verified calibration. The current P01 checker tests positive calibrations; invalid scales are discussed conceptually, not silently substituted. You will learn input validation and conditional rejection in P02.

**Evidence:** The Apply phase can be assisted. Prove uses unfamiliar field names and data. After a changed-input check, write a short scientific explanation of the units, when the result would be invalid and why fields are not biological replicates.

**Transfer:** Export the program as `specimen_report.py`, then revisit on a different day and rewrite the main calculation on new inputs without looking up your old solution. Browser-visible test cases cannot, alone, verify retained understanding.

### Plan before editing

Answer these questions on paper or in the provided reflection box:

- Which inputs describe the specimen's identity and acquisition, and which are numeric quantities?
- Why is the physical width calculated by division rather than multiplication?
- What output would signal that your script still contains hardcoded specimen values?
- Why would zero or unknown calibration invalidate physical-width reporting?
- Why does a field count not automatically indicate independent biological replication?

### Learn — understand a complete example

```python
specimen_id = 'N2_P03'
field_count = 5
channel_name = 'GFP'
width_pixels = 48
pixels_per_um = 4.0
width_um = width_pixels / pixels_per_um
summary = f'{specimen_id} | {field_count} fields | {width_um} um | channel {channel_name}'
print(summary)
```

**Prediction:** Why does width_um equal 12.0, and which parts of summary should change for another specimen?

**After you predict:** 48 pixels divided by 4 pixels/µm gives 12 µm. An accurate reusable program updates specimen ID, field count, channel and width when those inputs change.

**Investigation**

1. Change a specimen ID and channel name, rerun and confirm both update.
2. Double pixels_per_um, rerun and verify that width_um halves.
3. Explain why a synthetic calibration does not authorize quantitative claims about an actual HPA RGB image.

### Apply — build the reusable specimen report

Given specimen_id, field_count, channel_name, width_pixels and pixels_per_um, compute width_um and type_name, then construct summary exactly as 'ID | N fields | W um | channel X'. Print the summary. Inputs change between cases.

```python
# Available: specimen_id, field_count, channel_name, width_pixels, pixels_per_um (> 0)
# Create width_um, type_name, summary; print(summary).
```

Start with the first example but run *all* 3 changed-input cases. The program must compute the result from the current inputs. Record any traceback and the correction you made. Optional hints exist, but using them makes the attempt guided rather than independent.

### Prove — write a new program without copying the example

Write from a blank editor. With new input names sample_code, observed_fields, channel, roi_length_px and calibration_px_per_um, calculate length_um and numeric_type. Make result_line exactly 'ID: W um (N fields; X)' using the current input values. Print result_line.

```python
# Available: sample_code, observed_fields, channel, roi_length_px, calibration_px_per_um
# Create length_um, numeric_type, result_line; print(result_line).
```

The different field names are deliberate: you should transfer the computation and reporting idea rather than retain the exact syntax of the example. Three independent data cases are provided in the client-visible checker. The capstone is stronger when you can explain why every output is plausible, not just that the expression passed.

### Scientific interpretation: required written reflection

1. Why do you divide pixel length by pixels-per-micrometre rather than multiply?
2. What would make the numerical result scientifically untrustworthy despite correct Python execution?
3. Why is the number of microscope fields not necessarily the number of independent biological replicates?
4. What error or stale-value risk did you investigate, and how would you reproduce your result from a clean run?

This written interpretation is saved locally with your chapter work; it is **not automatically scored** by a word-count algorithm or an LLM pretending to judge experimental validity.

### Deliverables and acceptance

- A working `specimen_report.py` that prints the correct report for several records.
- Numerical values with explicit and defensible units.
- Correct Python type reporting without confusion between strings, numbers and Boolean flags.
- Evidence that you can diagnose at least one real traceback and one stale-value risk.
- A written explanation of the limits of the training data and its synthetic calibration.
- An independent transfer version using changed variable names.
- Exported source code reproducible in a clean Python environment.

A program that passes a test but cannot be explained is not complete learning. Likewise, a scientifically sensible explanation does not replace the need to run correct Python.

## Example scientific failure audit

Consider a script that computes `width_um = width_pixels * pixels_per_um`. It may run with no errors and print a plausible number. However, its units would be pixel²/µm, not µm. This is a **scientific failure with correct Python syntax**.

Consider a different script that prints a fixed expected report for `N2_P03`. It may appear correct for the first record but will fail for `ced1_P07`. This is a **programming generalization failure**.

Finally, imagine a notebook that once calculated width using 4 pixels/µm, then changes the scale to 8 without rerunning the derived value. Its printed width remains stale. This is a **reproducibility failure without any exception**.

In a real pipeline you must identify all three kinds of failure.


## Independent later-session task (P01-REVIEW)

This task is intentionally separated from the main capstone. After completing P01, return on a later day and reconstruct the report without copying the previous solution. **At least 24 hours is recommended**, but the exercise can be attempted sooner and will be labelled immediate practice rather than delayed retrieval.

**New input names:** `record_id`, `field_total`, `stain`, `span_px` and `px_per_um`. Produce `physical_span_um`, its Python type name in `report_type` and a string `report_line` using the requested pattern. The app uses three changed-input cases. A solved example is deliberately omitted.

**Independent reflection:** How does doubling `px_per_um` change the physical span? What data provenance would make the numeric conversion scientifically trustworthy? How could an old Jupyter value persist when input calibration is edited? Record whether you consulted prior code or received help. The UI records when the first capstone check passed so the return interval can be described accurately.

**Outcome label:** An interval of at least 24 hours plus successful checks supports a *delayed practice* label. It never automatically grants retained mastery, because the code, assertions and test cases are inspectable by the learner. A meaningful independent assessment requires human scrutiny or fresh tasks not provided with reference answers.


## Delayed retrieval and transition to P02

On a later day, without viewing your previous code, write a fresh report for an unseen specimen and explain why the scale is valid. Your prior attempt remains saved and the interval is recorded; a browser-visible test cannot guarantee independent mastery.

When you resume, the application may show how long it has been since the earlier capstone practice, but elapsed time does not prove retention. Attempt the unfamiliar transfer task with no hints, then compare outputs to a clean execution. Keep the original draft available for comparison instead of silently replacing it.

Next, P02 will turn labels and measurements into **validated** sample IDs and conditional quality rules. Do not pre-empt P02 by assuming P01 already taught every way to parse, validate or filter metadata.

## Sources, rights and reproducibility notes

- [Witz — Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner), especially [Python essentials](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/01-Python_essentials.ipynb) and [e01-Python basics](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/e01-Python_basics.ipynb). The named exercise cells inform the concept sequence; this chapter's explanatory text and activities are originally authored.
- [Official Python tutorial](https://docs.python.org/3/tutorial/): source for language semantics, expressions, errors, strings and built-ins.
- [Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/): supporting perspective on Jupyter execution state and scientific workflows. Do not reproduce its prose.
- [Human Protein Atlas Cell Atlas](https://www.proteinatlas.org/humanproteome/cell): genuine fluorescence context; the credited Witz-rendered PNG already bundled in the UI is shown for scientific orientation only. Raw-image use, additional reuse and calibration require independent auditing.

All records and pixel calibration figures in P01 are synthetic. The core exercises run with standard Python built-ins; they do not require NumPy, image libraries or external datasets.

## Acceptance and transparency

The lesson manifest is `content/p01/lesson.json`. Author reference solutions are in `content/author/p01_reference.json` and are intentionally excluded from the deployed UI. The practice checks are public and can be inspected; they are not secret or secure grading. A browser worker is not a hardened sandbox. Content-level regression checks and real-browser Pyodide testing are required, followed by an actual learner trial. The chapter may be **technically feature-complete** before it is **educationally validated**.
