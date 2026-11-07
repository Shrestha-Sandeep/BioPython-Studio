# P02 — Create trustworthy sample labels

**Status:** complete authoring candidate; independent learner trial pending. **Version:** 1.0.0  
**Curriculum authority:** 26-chapter Witz-first spine; competencies 008–011; Blueprint v2.1.  
**Real Python:** Pyodide in browser or CPython with built-ins only.  
**Source use:** original explanations and new cases informed by Guillaume Witz's [Python essentials](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/01-Python_essentials.ipynb), [basic exercises](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/e01-Python_basics.ipynb), [official Python tutorial](https://docs.python.org/3/tutorial/), and *Python for Biologists*. No protected textbook prose or tasks are reproduced.

## Research problem: which image belongs to which experimental group?

Imagine a folder containing fluorescence images labeled `N2_P03_control` and `N2_P03_heat`. The names differ by a few characters but describe different experimental conditions. Replacing a condition or specimen ID by hand can create a scientifically consequential labeling error. A script should create correct labels from metadata and explain why imported labels and quality measurements fail validation.

The scientific examples use **synthetic strain/plate/condition records and synthetic focus scores**. The UI may show a credited figure from Witz and the Human Protein Atlas as visual context, but that image is not a calibrated raw TIFF. Do not infer genuine biological identity, quality thresholds or biological replicate counts from the figure.

## Before you begin: one compact example

```python
strain = 'N2'
plate = 'P03'
condition = 'heat'
sample_id = f'{strain}_{plate}_{condition}'
print(sample_id)
```

The output is `N2_P03_heat`. The separate fields allow the same program to report another record without replacing the entire label by hand. P02 adds structural parsing, numerical comparisons and transparent quality rules. If you already know f-strings from P01, go directly to P02-G01 Prove after skimming the short explanation.

### Read, apply and prove

For every mini-goal: predict the worked code; execute genuine Python; investigate a changed input; build a new result in Apply; and reconstruct the underlying idea on unfamiliar variable names in Prove. Short hints are available during Apply. No check may claim independent or retained mastery merely because public Python assertions passed. The next mini-goal can be started without a compulsory clock, streak or reward.

## Competency map

| Activity | Frozen competency | Concrete outcome |
|---|---|---|
| P02-G01 | 008 | Build informative sample labels |
| P02-G02 | 009 | Parse an identifier without guessing |
| P02-G03 | 010 | Compare quantitative QC values safely |
| P02-G04 | 011 | Explain QC decisions with conditions |
| P02-CAPSTONE | transfer, no new ID | Validate a sample ID and report a reason under a predeclared QC rule |
| P02-REVIEW | delayed retrieval, no new ID | Reconstruct validation on a new schema after a later interval |

---
## 1. Build informative sample labels (P02-G01)

**Why it matters:** A sample label must continue to identify the right strain, plate and condition when the acquisition record changes.

### Concept: Learn

**Make labels from data rather than retyping them.** A specimen label is an identifier, not a measurement. Use Python f-strings to combine meaningful variables in a stable order. The two image records `N2_P03_control` and `N2_P03_heat` describe different conditions; a wrong suffix can invalidate a biological grouping.

**Normalize only what your naming policy permits.** `strip()` removes accidental leading/trailing whitespace; `upper()` and `lower()` standardize case. Here plate codes use uppercase `P`, and conditions use lowercase text. Strain names remain case-sensitive, so preserve their internal spelling rather than silently converting them.

**Choose an explicit grammar.** In this chapter a simple identifier has exactly three underscore-separated parts: `strain_P##_condition`. Allowed conditions will be `control`, `heat` or `recovery`. A later validator rejects unclear labels rather than guessing; do not silently rewrite the original raw identifier at that stage.

**An f-string is evaluated when the assignment runs.** Changing `condition` later does not update an older computed label until the formatting expression is rerun. This is the same stale-derived-value issue introduced in P01.

**Scientific caution:** names should point to recorded acquisition metadata, not be used to infer treatment or replicate identity from image appearance. Imaging fields are not independent biological replicates.

### Predict and run

```python
strain = 'N2'
plate = 'p03 '
condition = ' Heat '
label = f'{strain}_{plate.strip().upper()}_{condition.strip().lower()}'
print(label)
```

**Prediction:** What exact label will print, and which characters are preserved?

**After trying:** `N2_P03_heat`. The plate and condition are normalized under the stated convention, but the strain string is preserved.

**Walkthrough**

1. Check the values of strain, plate and condition before interpolation.
2. `plate.strip().upper()` removes the trailing space and makes P uppercase.
3. `condition.strip().lower()` turns ' Heat ' into 'heat'; the f-string joins the three pieces with underscores.

**Investigate and modify**

1. Change `condition` to `Control` and predict the suffix.
2. Change the strain from `N2` to `mutA`; verify its case remains unchanged.
3. Remove `strip()` and see why two labels that look similar may not be exact string matches.

**Debugging challenge:** A colleague writes `label = 'strain_plate_condition'`. Explain why it never changes when the experiment changes; repair the f-string.

### Apply: solve with changing supplied inputs

Using strain, plate_code and condition, assign label to `strain_P##_condition`. Strip whitespace on all fields, uppercase the plate code and lowercase the condition. Preserve the strain's interior case.

```python
# Available: strain, plate_code, condition
# Assign label from the supplied inputs.
```

The checker runs your original Python program on **3 changed-input cases**, including at least one problematic or boundary record. A fixed text answer will fail. Use the optional progressive hints only when necessary.

### Prove: independent transfer

Use unfamiliar variables specimen, acquisition and treatment to create normalized_id in the distinct format `specimen/acquisition/treatment`. Strip exterior whitespace, uppercase acquisition, lowercase treatment, preserve specimen case.

```python
# Available: specimen, acquisition, treatment
# Assign normalized_id.
```

Avoid copying the earlier answer. You may deliberately revisit documentation or the Learn phase, but record the help used rather than labelling the attempt independent.

### Misconception and scientific boundary

**Misconception:** Words inside an ordinary quoted string are magically replaced by variable values.

**Recovery:** A colleague writes `label = 'strain_plate_condition'`. Explain why it never changes when the experiment changes; repair the f-string.

**Scientific limitation:** These are synthetic specimen records. Plate codes and treatment labels are not retrieved from a microscope image.

---

## 2. Parse an identifier without guessing (P02-G02)

**Why it matters:** An unexpected extra underscore or missing plate must not be silently reassigned to another experimental group.

### Concept: Learn

**Parsing splits a record into parts.** `sample_id.split('_')` produces a Python list of text components. `len(parts)` counts how many parts were found. You do not need to know loops or general list algorithms to inspect this output.

**Structure is different from validity.** `N2_P03_heat` has three nonempty components; `N2_P03_heat_day2` has four; `N2__heat` has three but an empty plate. Checking only the number of separators is not enough. The full semantic checks appear in G04.

**Use `==` to compare values and `and` to combine Boolean conditions.** A condition such as `len(parts) == 3` produces True or False. Python evaluates the right side of `and` only when the left side is true, so you can check length before referencing individual pieces.

**Do not quietly repair raw source labels.** Stripping or rearranging a malformed ID at import time could overwrite provenance. Store the original label and return a clear failure classification; decide on normalization only at the controlled label-generation step.

**Delimiter choice matters.** The underscore is a reserved separator in this exercise. A strain name containing `_` must either use an explicit escaping policy or be rejected under this grammar. P02 chooses strict rejection, not guessing which segment belongs to the strain.

### Predict and run

```python
sample_id = 'N2_P03_heat'
parts = sample_id.split('_')
print(parts)
print(len(parts))
```

**Prediction:** What list and number will be printed?

**After trying:** `['N2', 'P03', 'heat']` followed by `3`. `.split('_')` returns three strings.

**Walkthrough**

1. A separator divides one string into a list of smaller strings.
2. `len(parts)` reports the count, not whether the components make scientific sense.
3. Try missing and repeated separators. Three sections do not guarantee that every section contains text.

**Investigate and modify**

1. Replace `sample_id` with `N2__heat`. Why is the number of parts still three?
2. Try `N2_P03_heat_extra`, and inspect the fourth component.
3. Try `N2P03heat`; the entire string remains one component.

**Debugging challenge:** A lab script assumes anything with two underscores is valid. Show an empty-component counterexample that passes this naive test.

### Apply: solve with changing supplied inputs

Given raw_id, create tokens = raw_id.split('_'), token_count = len(tokens), and structure_ok indicating exactly three nonempty segments. This checks only shape, not the allowed plate and condition values.

```python
# Available: raw_id
# Produce tokens, token_count, structure_ok.
```

The checker runs your original Python program on **4 changed-input cases**, including at least one problematic or boundary record. A fixed text answer will fail. Use the optional progressive hints only when necessary.

### Prove: independent transfer

Given filename using `|` as delimiter, set components = filename.split('|') and valid_shape to True only for exactly three nonempty components. Do not assume that the parts are valid biological data.

```python
# Available: filename
# Produce components and valid_shape.
```

Avoid copying the earlier answer. You may deliberately revisit documentation or the Learn phase, but record the help used rather than labelling the attempt independent.

### Misconception and scientific boundary

**Misconception:** Three components automatically means a correct scientific identifier.

**Recovery:** A lab script assumes anything with two underscores is valid. Show an empty-component counterexample that passes this naive test.

**Scientific limitation:** The format of a filename does not certify whether an underlying experiment was recorded or labeled correctly.

---

## 3. Compare quantitative QC values safely (P02-G03)

**Why it matters:** An inclusive predeclared focus threshold must behave predictably at the boundary and with implausible values.

### Concept: Learn

**Comparisons return Boolean values.** `>=` means greater than or equal to; `>` excludes the boundary. `==` checks equality and is not the assignment operator `=`. A measurement exactly at the required minimum passes only when the declared policy is inclusive.

**Combine independent conditions.** `and` requires both criteria; `or` accepts either. A score of 1.2 should not be accepted simply because it exceeds a minimum if the documented score scale is 0–1. Python supports the readable chained comparison `0 <= score <= 1`.

**Numerical text is not automatically numerical measurement.** The string `'0.8'` must be deliberately converted with `float` before comparing with 0.8. Invalid text raises ValueError; automatic catch-and-replace would fabricate a QC result. P05 teaches controlled exception handling.

**Thresholds must be set before inspecting experimental groups.** A training score of 0.8 and a training minimum of 0.8 are invented values. They are not recommendations for microscope autofocus, imaging quality or biological sample exclusion.

**Boundary and edge tests are essential.** Test below, at and above the minimum; outside the supported range; and cases where maximum thresholds differ. A program can execute correctly while embedding a biased or scientifically unsuitable QC cutoff.

### Predict and run

```python
focus_score = 0.80
minimum_focus = 0.80
print(focus_score >= minimum_focus)
print(focus_score > minimum_focus)
print(0 <= focus_score <= 1)
```

**Prediction:** Do all three comparisons return True?

**After trying:** `True`, `False`, `True`: equality passes an inclusive `>=` rule, but not `>`, and 0.8 lies in the stipulated 0–1 example scale.

**Walkthrough**

1. `focus_score >= minimum_focus` includes equality.
2. `focus_score > minimum_focus` excludes equality.
3. The chained 0–1 check ensures the score lies in the example's allowed measurement interval.

**Investigate and modify**

1. Set focus_score just below 0.8 and compare `>` versus `>=`.
2. Set focus_score to 1.2 and show why exceeding the minimum does not establish validity.
3. Try comparing a quoted string `'0.8'` with a float and read the actual exception.

**Debugging challenge:** A report labels 0.8 as a failed measurement when its documented rule says `focus_score >= 0.8`. Identify the off-by-one boundary mistake.

### Apply: solve with changing supplied inputs

Given focus_score and minimum_focus (both numeric), create in_range for 0 ≤ score ≤ 1, passes_threshold for an in-range score at or above the minimum, and on_boundary for exact equality with the minimum.

```python
# Available: focus_score, minimum_focus
# Assign in_range, passes_threshold, on_boundary.
```

The checker runs your original Python program on **4 changed-input cases**, including at least one problematic or boundary record. A fixed text answer will fail. Use the optional progressive hints only when necessary.

### Prove: independent transfer

From measured_ratio, minimum_ratio and maximum_ratio, create within_limits True only for inclusive limits. Create at_any_edge True only when the measurement equals either bound. These limits are declared before seeing any condition labels.

```python
# Available: measured_ratio, minimum_ratio, maximum_ratio
# Assign within_limits and at_any_edge.
```

Avoid copying the earlier answer. You may deliberately revisit documentation or the Learn phase, but record the help used rather than labelling the attempt independent.

### Misconception and scientific boundary

**Misconception:** Passing a numerical threshold automatically means the biological image is good quality.

**Recovery:** A report labels 0.8 as a failed measurement when its documented rule says `focus_score >= 0.8`. Identify the off-by-one boundary mistake.

**Scientific limitation:** All scores are fictional. No numerical cutoff is validated for a particular acquisition protocol or biological model.

---

## 4. Explain QC decisions with conditions (P02-G04)

**Why it matters:** A trustworthy validator rejects invalid labels or low-quality records with a reproducible reason, not just a yes/no verdict.

### Concept: Learn

**Use a documented decision order.** Python's `if`, `elif`, `else` evaluates conditions from top to bottom; the first matching branch determines what happens. Validate label structure *before* indexing its parts, then check known fields, then the numerical rule.

**Do not collapse all failures to False.** A missing label component is a data-integrity problem; a correctly labeled observation below a focus threshold is a different exclusion reason. In P02 the decision is `ACCEPT` or `REJECT` with a specific plain-language `reason`.

**Check exact boundaries and condition names.** An equality at the declared minimum passes an inclusive criterion. Labels are case-sensitive on import; `control` is valid, `Control` is not. The formatter in G01 can normalize new labels, but importing historical records must preserve raw input for audit.

**Explain a branch without guessing.** The condition `len(parts) != 3` must come first; only then is it safe to read `parts[0]`, `parts[1]` and `parts[2]`. You can use `not` to reverse a condition and `or` to combine several rejection reasons.

**Reject scientifically invalid assumptions.** Changing cutoffs to make one experimental group look better is not quality control. Apply one predeclared rule consistently and document acquisition-level quality metrics separately from biological interpretation.

### Predict and run

```python
sample_id = 'N2_P03_control'
focus_score = 0.80
minimum_focus = 0.80
parts = sample_id.split('_')
if len(parts) != 3:
    decision = 'REJECT'
    reason = 'wrong number of fields'
elif focus_score < minimum_focus:
    decision = 'REJECT'
    reason = 'focus below minimum'
else:
    decision = 'ACCEPT'
    reason = 'label shape and focus acceptable'
print(decision, reason)
```

**Prediction:** Does a score exactly equal to the minimum pass, and what happens with a fourth underscore-separated field?

**After trying:** At equality it accepts because the rejection test uses `<`. Four fields cause `REJECT` with `wrong number of fields` even if focus is high.

**Walkthrough**

1. Inspect `parts = sample_id.split('_')` before accessing any segment.
2. The first branch rejects structurally malformed input, so the score is not interpreted for a bad label.
3. The second branch compares focus against the predeclared minimum; equality flows to the accepting `else` branch.

**Investigate and modify**

1. Change the sample to `N2_P03_control_extra` and identify the first matching branch.
2. Change focus_score to 0.79 and verify the reason is specifically focus-related.
3. Change focus_score back to the exact boundary 0.80; it should accept. Then try `N2__heat` and note that the simple demonstration does not yet check empty fields—the capstone will.

**Debugging challenge:** A lab script replaces all rejected records with reason `bad image`. Explain why this prevents distinguishing a mislabeled record from an out-of-focus record.

### Apply: solve with changing supplied inputs

Given sample_id, focus_score and minimum_focus, set decision and reason in this priority: incorrect number of fields → `REJECT`/`wrong number of fields`; any empty field → `REJECT`/`empty field`; focus below minimum → `REJECT`/`focus below minimum`; otherwise `ACCEPT`/`shape and focus pass`. The threshold includes equality.

```python
# Available: sample_id, focus_score, minimum_focus
# Create decision and reason with if/elif/else.
```

The checker runs your original Python program on **4 changed-input cases**, including at least one problematic or boundary record. A fixed text answer will fail. Use the optional progressive hints only when necessary.

### Prove: independent transfer

Now record_id uses `|` (e.g. `N2|F07|control`) and the metric is signal_ratio. In this order: bad or empty record segments → `REJECT`/`invalid identifier`; ratio below minimum_ratio → `REJECT`/`signal below minimum`; otherwise `ACCEPT`/`structure and signal pass`. Store outcome and reason.

```python
# Available: record_id, signal_ratio, minimum_ratio
# Create outcome, reason; retain the raw record_id.
```

Avoid copying the earlier answer. You may deliberately revisit documentation or the Learn phase, but record the help used rather than labelling the attempt independent.

### Misconception and scientific boundary

**Misconception:** An accepted focus score certifies sample condition or biological validity.

**Recovery:** A lab script replaces all rejected records with reason `bad image`. Explain why this prevents distinguishing a mislabeled record from an out-of-focus record.

**Scientific limitation:** Example QC thresholds are synthetic, not real instrument cutoffs. A valid label does not imply that underlying biology or image intensities are valid.

---

## 5. Integrated capstone (P02-CAPSTONE) — `sample_label_validator.py`

**Scientific goal:** Prevent sample misassignment and make quality exclusion decisions traceable.

**Research task:** Two visually similar filenames may encode different experimental conditions. Build one repeatable intake checker that accepts only syntactically valid sample IDs and predeclared focus scores and writes a transparent reason for rejection.

**Fixed identifier grammar:** `strain_P##_condition`, with exactly two underscores. The strain contains **one or more ASCII alphanumeric characters** (A–Z, a–z, 0–9) and no spaces; the plate is an uppercase P followed by exactly two ASCII digits; accepted conditions are exactly `control`, `heat`, `recovery`. Do not normalize or rewrite raw identifiers while validating: preserve the original `sample_id`.

**Declared focus rule:** score is a numeric value from 0 through 1 inclusive; the minimum_focus is supplied before evaluation. Scores equal to the minimum are accepted. Invalid shape, invalid strain, invalid plate, unknown condition, invalid score range and low score have distinct reason strings, in that order.

**Case priority matters.** Check three components before extracting them. If a field contains an underscore, the structure is invalid under this grammar. If the sample ID is malformed, label integrity takes precedence over focus; do not call it an imaging-quality failure.

**Deliverable:** `decision` (`ACCEPT` or `REJECT`), a specific `reason`, and a human-readable `report` containing the unmodified raw ID, decision and reason. Print the report; export the runnable script. Provide a written reflection on false positives, off-by-one boundaries and why imaging fields differ from biological replicates.

**Independent transfer:** Apply the same principles to an unfamiliar record grammar with pipe separators and `F##` acquisition codes. Reconstruct validation and explicit reasons without looking at the worked example.

**Limitations:** A clean label and focus score do not establish genuine specimen identity, raw image quality, biological validity or instrument calibration. In research you must verify metadata provenance and preregister relevant exclusion rules.

### Prepare before running code

1. Write down the declared ID grammar and the priority order before programming.
2. Parse and test structure before indexing tokens.
3. Choose the first matching rejection reason; do not fabricate a missing value.
4. Verify below, equal to and above the threshold and try malformed labels with high focus.

**Prediction:** Why is a score of 0.80 at the 0.80 minimum acceptable, and why should a malformed ID be checked first?

```python
sample_id = 'N2_P03_heat'
focus_score = 0.80
minimum_focus = 0.80
parts = sample_id.split('_')
print(parts)
print(focus_score >= minimum_focus)
print('Build the full ordered decision in Apply.')
```

### Apply: implement the strict grammar and reason priority

Given sample_id, focus_score and minimum_focus, produce decision, reason, report. Check in order: structure, ASCII alphanumeric strain, uppercase P plus two ASCII digits, condition in control/heat/recovery, focus range 0..1, focus below minimum, otherwise accept. Reasons must be exactly: `expected three fields`, `invalid strain`, `invalid plate`, `unknown condition`, `focus outside range`, `focus below minimum`, or `accepted`. Report = 'sample_id | decision | reason'; print it.

```python
# Available: sample_id, focus_score, minimum_focus
# Raw ID grammar: strain_P##_condition. Preserve sample_id.
# Assign decision, reason, report; print(report).
```

The Apply checker includes **11 different records**, covering equality at the threshold, extra delimiters, missing strain, malformed two-digit plate, Unicode-lookalike digits, an unknown condition and out-of-range or low scores.

**Important authoring note:** Python string method `.isdigit()` includes non-ASCII numeral characters. Because the capstone grammar explicitly requires ASCII digits, verify `.isascii()` as well. A label such as `N2_P３3_heat` is invalid under this policy. Explain why programmatic input requirements must be explicit.

### Prove: unfamiliar acquisition notation

Given record_id in strict `specimen|F##|treatment` form, quality_score and threshold: validate exactly three nonempty components; ASCII alphanumeric specimen; uppercase F followed by two ASCII digits; treatment exactly `control`, `heat` or `recovery`; score 0..1; inclusive threshold. In priority order set verdict and explanation using the same reason labels except `expected three fields`, `invalid specimen`, `invalid acquisition`, `unknown treatment`, `quality outside range`, `quality below minimum`, or `accepted`. Print result_line = 'record_id -> verdict (explanation)'. Keep raw record_id unchanged.

```python
# Available: record_id, quality_score, threshold
# Grammar: specimen|F##|treatment. Do not copy the earlier delimiter or plate code.
# Assign verdict, explanation, result_line; print(result_line).
```

The independent transfer changes both the delimiter and the required code prefix. It deliberately tests untrusted strings and boundary values rather than changing only constants.

### Required scientific reflection

1. Why does a label with an extra underscore fail instead of being guessed or silently repaired?
2. Which exact comparison ensures a score equal to minimum_focus is accepted?
3. Why should the QC cutoff be chosen before comparing experimental groups?
4. Which apparent image-quality decisions are not biologically independent replicates?

Written explanations are saved locally but not automatically judged as biological reasoning. Export your executable `.py` file and test it on more than one input before considering the chapter finished.

### Failure cases you should understand

**Scientific error with correct Python:** a focus score above the minimum does not establish correct treatment assignment or validated fluorescence quality. **Input-integrity error:** `N2_P03_heat_extra` must not silently be interpreted as an ordinary three-field ID. **Boundary error:** using `>` when the stated rule is inclusive wrongly rejects a measurement equal to the minimum. **Provenance error:** normalizing a historical invalid raw identifier without retaining the original conceals data problems.

## 6. Later return (P02-REVIEW)

**Retrieval without recognition:** Rebuild a validator on an unfamiliar naming policy rather than rereading the capstone. Attempt after at least 24 hours for delayed practice, but an earlier practice attempt is allowed.

**New convention:** labels are in the form `strain~S##~condition`, with exactly three nonempty segments and ASCII alphanumeric strain, `S` plus two ASCII digits, and condition equal to control, heat or recovery.

**Same scientific discipline:** report exact rejection reasons and apply a predeclared inclusive quality threshold to numeric 0–1 scores. A passing code test does not certify that a real biological record is valid.

**Unfamiliar task:** Given acquisition_id of the form `strain~S##~condition`, focus_metric, focus_minimum: set decision and reason in order: `invalid shape`, `invalid strain`, `invalid site`, `unknown condition`, `metric outside range`, `metric below minimum`, `accepted`. Use ACCEPT/REJECT. Print audit = 'acquisition_id | decision | reason'.

The return task supplies no worked solution and uses `~` and `S##` instead of `_` and `P##`. A return at least 24 hours after the first capstone success can be labelled delayed practice, but passing browser-visible checks does **not** certify long-term retention.

## 7. Transition to P03

The next chapter introduces loops, lists and indexing in greater depth. P02 uses simple `split` lists, short string methods and first-match conditionals but does not attempt full sequence-processing algorithms. Keep your `sample_label_validator.py` as a reusable foundation for later automated handling of many files.

## Sources and use boundaries

Guillaume Witz, *Image Processing for Beginners* ([source repository](https://github.com/guiwitz/PyImageCourse_beginner)); [Python official tutorial](https://docs.python.org/3/tutorial/); [Martin Jones, Python for Biologists](https://pythonforbiologists.com/); [Human Protein Atlas Cell Atlas](https://www.proteinatlas.org/humanproteome/cell). Credit and rights for previously bundled Witz-rendered figures are in `assets/witz/CREDITS.md`. No image pixels or raw TIFF metadata are analyzed in P02.

**Release gate:** All P02 reference programs must pass real CPython tests on varied inputs, with exact 4/4 competency coverage, and the UI must preserve P01 progress, execute in Pyodide and pass desktop/mobile browser QA. Independent learner testing remains a separate educational quality gate.
