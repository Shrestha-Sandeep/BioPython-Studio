# P06 — Save and reproduce a real script

**Learning status:** browser learner-pilot chapter. Not independent-mastery certification.

Learn real text-file IO, JSON, testing and script composition in Python, then complete actual local .venv and Git handoff. Do not confuse a printed shell command with local execution.

**Source and provenance:** https://github.com/guiwitz/PyImageCourse_beginner/blob/master/07-Pipeline.ipynb. Additional explanations follow Python for Biologists, the Python Data Science Handbook and Python standard-library documentation. Scientific data in lessons are fictional; image references must retain attribution in `assets/witz/CREDITS.md`.

**Science boundary:** Local shell/Git operations require separate manual evidence; synthetic data are not quantitative microscopy.

## P06-G01 — Read and write UTF-8 text files

**Why:** Learn read and write utf-8 text files through traceable biological programming exercises.

**Concept:** Read and write UTF-8 text files. Use Python's explicit input and output contracts instead of copying a first-example result.

**Data:** Distinguish None from recorded zero and preserve the original specimen ID, physical units and calibration provenance.

**Execution boundary:** Pyodide executes genuine Python and uses its own temporary file system. It cannot run local shell commands, create a local virtual environment or commit to the user's Git repository.

**Transfer:** Test changed inputs, export a working .py file, then verify local Python execution and Git evidence separately. Browser checks are not certification of scientific validity.

**Predict:** Predict the output and distinguish executed Python from printed local shell instructions.

**Runnable teaching example (not the solution):**

```python
from pathlib import Path
import tempfile
with tempfile.TemporaryDirectory() as folder:
    p = Path(folder) / 'ids.txt'
    p.write_text('F1\nF2\n', encoding='utf-8')
    print(p.read_text(encoding='utf-8').splitlines())
```

**Prediction explanation:** Python executes inside the browser; printing text does not run a local terminal.

**Walkthrough:**

1. Identify inputs and the expected returned output before coding.
2. Predict and run the example; change a case and explain the difference.
3. Record which operations still require local-machine verification.

**Investigate:**

- Try a missing or empty observation.
- Check one changed input instead of copying a fixed output.
- Explain why local environment and biological calibration remain unverified.

### Apply

Use tempfile.TemporaryDirectory and pathlib.Path to write newline-delimited field_ids as UTF-8, read them as recovered_ids and set total_ids. Do not include a trailing empty record.

```python
# P06-G01 | APPLY | Read and write UTF-8 text files
# TASK: Use tempfile.TemporaryDirectory and pathlib.Path to write newline-delimited
#   field_ids as UTF-8, read them as recovered_ids and set total_ids. Do not
#   include a trailing empty record.
# INPUTS: field_ids
```

**Practice:** 3 changed-input public cases; no private mastery grading.

### Prove independently

Write observations [ID,channel] to a temporary UTF-8 file, one 'ID,channel' per line; read and parse into recovered_rows, row_count. Inputs contain no commas.

```python
# P06-G01 | PROVE | Read and write UTF-8 text files
# TASK: Write observations [ID,channel] to a temporary UTF-8 file, one 'ID,channel'
#   per line; read and parse into recovered_rows, row_count. Inputs contain no
#   commas.
# INPUTS: observations
```

**Practice:** 3 changed-input public cases; no private mastery grading.

**Debugging exercise:** A printed git command is presented as proof of a local commit. Explain what evidence is actually required.

**Misconception:** Printing shell instructions creates local Python environments or Git commits.

**Scientific limit:** Examples are synthetic. No local Git or virtual environment is executed, and raw-image calibration is not established.

## P06-G02 — Plan a local virtual environment

**Why:** Learn plan a local virtual environment through traceable biological programming exercises.

**Concept:** Plan a local virtual environment. Use Python's explicit input and output contracts instead of copying a first-example result.

**Data:** Distinguish None from recorded zero and preserve the original specimen ID, physical units and calibration provenance.

**Execution boundary:** Pyodide executes genuine Python and uses its own temporary file system. It cannot run local shell commands, create a local virtual environment or commit to the user's Git repository.

**Transfer:** Test changed inputs, export a working .py file, then verify local Python execution and Git evidence separately. Browser checks are not certification of scientific validity.

**Predict:** Predict the output and distinguish executed Python from printed local shell instructions.

**Runnable teaching example (not the solution):**

```python
python_cmd='python3'
commands=[f'{python_cmd} -m venv .venv','source .venv/bin/activate','python -m pip install -r requirements.txt']
print('\n'.join(commands))
```

**Prediction explanation:** Python executes inside the browser; printing text does not run a local terminal.

**Walkthrough:**

1. Identify inputs and the expected returned output before coding.
2. Predict and run the example; change a case and explain the difference.
3. Record which operations still require local-machine verification.

**Investigate:**

- Try a missing or empty observation.
- Check one changed input instead of copying a fixed output.
- Explain why local environment and biological calibration remain unverified.

### Apply

Build commands containing '<python_cmd> -m venv .venv', 'source .venv/bin/activate', 'python -m pip install -r requirements.txt', in order. Set executed_locally=False.

```python
# P06-G02 | APPLY | Plan a local virtual environment
# TASK: Build commands containing '<python_cmd> -m venv .venv', 'source
#   .venv/bin/activate', 'python -m pip install -r requirements.txt', in order. Set
#   executed_locally=False.
# INPUTS: python_cmd
```

**Practice:** 3 changed-input public cases; no private mastery grading.

### Prove independently

For target_os 'windows' or 'posix', return activate_command '.venv\Scripts\Activate.ps1' for PowerShell or 'source .venv/bin/activate' for POSIX. Set verification='NOT_RUN_LOCALLY'.

```python
# P06-G02 | PROVE | Plan a local virtual environment
# TASK: For target_os 'windows' or 'posix', return activate_command
#   '.venv\Scripts\Activate.ps1' for PowerShell or 'source .venv/bin/activate' for
#   POSIX. Set verification='NOT_RUN_LOCALLY'.
# INPUTS: target_os
```

**Practice:** 3 changed-input public cases; no private mastery grading.

**Debugging exercise:** A printed git command is presented as proof of a local commit. Explain what evidence is actually required.

**Misconception:** Printing shell instructions creates local Python environments or Git commits.

**Scientific limit:** Examples are synthetic. No local Git or virtual environment is executed, and raw-image calibration is not established.

## P06-G03 — Serialize specimen metadata with JSON

**Why:** Learn serialize specimen metadata with json through traceable biological programming exercises.

**Concept:** Serialize specimen metadata with JSON. Use Python's explicit input and output contracts instead of copying a first-example result.

**Data:** Distinguish None from recorded zero and preserve the original specimen ID, physical units and calibration provenance.

**Execution boundary:** Pyodide executes genuine Python and uses its own temporary file system. It cannot run local shell commands, create a local virtual environment or commit to the user's Git repository.

**Transfer:** Test changed inputs, export a working .py file, then verify local Python execution and Git evidence separately. Browser checks are not certification of scientific validity.

**Predict:** Predict the output and distinguish executed Python from printed local shell instructions.

**Runnable teaching example (not the solution):**

```python
import json
record={'id':'F1','focus':None,'valid':False}
print(json.dumps(record,sort_keys=True))
print(json.loads(json.dumps(record))==record)
```

**Prediction explanation:** Python executes inside the browser; printing text does not run a local terminal.

**Walkthrough:**

1. Identify inputs and the expected returned output before coding.
2. Predict and run the example; change a case and explain the difference.
3. Record which operations still require local-machine verification.

**Investigate:**

- Try a missing or empty observation.
- Check one changed input instead of copying a fixed output.
- Explain why local environment and biological calibration remain unverified.

### Apply

Import json; create record={'id':sample_id,'fields':field_count,'channel':channel}, then json_text=json.dumps(record,sort_keys=True) and restored=json.loads(json_text).

```python
# P06-G03 | APPLY | Serialize specimen metadata with JSON
# TASK: Import json; create
#   record={'id':sample_id,'fields':field_count,'channel':channel}, then
#   json_text=json.dumps(record,sort_keys=True) and restored=json.loads(json_text).
# INPUTS: sample_id, field_count, channel
```

**Practice:** 3 changed-input public cases; no private mastery grading.

### Prove independently

Import json; encode specimen={'sample':sample,'focus':focus,'passed':passed} with sort_keys=True into payload and recover roundtrip; preserve None and booleans.

```python
# P06-G03 | PROVE | Serialize specimen metadata with JSON
# TASK: Import json; encode
#   specimen={'sample':sample,'focus':focus,'passed':passed} with sort_keys=True
#   into payload and recover roundtrip; preserve None and booleans.
# INPUTS: sample, focus, passed
```

**Practice:** 3 changed-input public cases; no private mastery grading.

**Debugging exercise:** A printed git command is presented as proof of a local commit. Explain what evidence is actually required.

**Misconception:** Printing shell instructions creates local Python environments or Git commits.

**Scientific limit:** Examples are synthetic. No local Git or virtual environment is executed, and raw-image calibration is not established.

## P06-G04 — Write assertions that expose broken code

**Why:** Learn write assertions that expose broken code through traceable biological programming exercises.

**Concept:** Write assertions that expose broken code. Use Python's explicit input and output contracts instead of copying a first-example result.

**Data:** Distinguish None from recorded zero and preserve the original specimen ID, physical units and calibration provenance.

**Execution boundary:** Pyodide executes genuine Python and uses its own temporary file system. It cannot run local shell commands, create a local virtual environment or commit to the user's Git repository.

**Transfer:** Test changed inputs, export a working .py file, then verify local Python execution and Git evidence separately. Browser checks are not certification of scientific validity.

**Predict:** Predict the output and distinguish executed Python from printed local shell instructions.

**Runnable teaching example (not the solution):**

```python
def width(pixels,scale):
    return pixels/scale
assert width(20,4)==5
assert width(0,4)==0
print('tests passed')
```

**Prediction explanation:** Python executes inside the browser; printing text does not run a local terminal.

**Walkthrough:**

1. Identify inputs and the expected returned output before coding.
2. Predict and run the example; change a case and explain the difference.
3. Record which operations still require local-machine verification.

**Investigate:**

- Try a missing or empty observation.
- Check one changed input instead of copying a fixed output.
- Explain why local environment and biological calibration remain unverified.

### Apply

Define width_um(pixels,scale); define test_width(fn) using assert fn(20,4)==5 and fn(0,4)==0. Catch AssertionError to return False, else True. Set passed=test_width(width_um).

```python
# P06-G04 | APPLY | Write assertions that expose broken code
# TASK: Define width_um(pixels,scale); define test_width(fn) using assert
#   fn(20,4)==5 and fn(0,4)==0. Catch AssertionError to return False, else True.
#   Set passed=test_width(width_um).
# INPUTS: pixels, scale
```

**Practice:** 3 changed-input public cases; no private mastery grading.

### Prove independently

Define mean_or_none(values). Define test_mean(fn) with assert fn([2,4])==3 and fn([]) is None, catching AssertionError to return False. Set good_test=test_mean(mean_or_none), broken_detected=(test_mean(lambda x:0) is False).

```python
# P06-G04 | PROVE | Write assertions that expose broken code
# TASK: Define mean_or_none(values). Define test_mean(fn) with assert fn([2,4])==3
#   and fn([]) is None, catching AssertionError to return False. Set
#   good_test=test_mean(mean_or_none), broken_detected=(test_mean(lambda x:0) is
#   False).
# INPUTS: values
```

**Practice:** 3 changed-input public cases; no private mastery grading.

**Debugging exercise:** A printed git command is presented as proof of a local commit. Explain what evidence is actually required.

**Misconception:** Printing shell instructions creates local Python environments or Git commits.

**Scientific limit:** Examples are synthetic. No local Git or virtual environment is executed, and raw-image calibration is not established.

## P06-G05 — Compose a standalone analysis workflow

**Why:** Learn compose a standalone analysis workflow through traceable biological programming exercises.

**Concept:** Compose a standalone analysis workflow. Use Python's explicit input and output contracts instead of copying a first-example result.

**Data:** Distinguish None from recorded zero and preserve the original specimen ID, physical units and calibration provenance.

**Execution boundary:** Pyodide executes genuine Python and uses its own temporary file system. It cannot run local shell commands, create a local virtual environment or commit to the user's Git repository.

**Transfer:** Test changed inputs, export a working .py file, then verify local Python execution and Git evidence separately. Browser checks are not certification of scientific validity.

**Predict:** Predict the output and distinguish executed Python from printed local shell instructions.

**Runnable teaching example (not the solution):**

```python
def convert(pixels,scale):
    return pixels/scale
def batch(values,scale):
    return [convert(v,scale) for v in values]
print(batch([8,12],4))
```

**Prediction explanation:** Python executes inside the browser; printing text does not run a local terminal.

**Walkthrough:**

1. Identify inputs and the expected returned output before coding.
2. Predict and run the example; change a case and explain the difference.
3. Record which operations still require local-machine verification.

**Investigate:**

- Try a missing or empty observation.
- Check one changed input instead of copying a fixed output.
- Explain why local environment and biological calibration remain unverified.

### Apply

Define convert_field(pixels,scale) returning width or None for missing pixels or nonpositive scale; define process_fields(rows,scale) returning [ID,width] pairs; set processed.

```python
# P06-G05 | APPLY | Compose a standalone analysis workflow
# TASK: Define convert_field(pixels,scale) returning width or None for missing
#   pixels or nonpositive scale; define process_fields(rows,scale) returning
#   [ID,width] pairs; set processed.
# INPUTS: rows, px_per_um
```

**Practice:** 3 changed-input public cases; no private mastery grading.

### Prove independently

Define summarize_batch(rows,scale) for [pixels,tag], returning {'observed':N,'missing':M,'mean_um':mean or None}. If scale<=0, treat all as missing. Set summary.

```python
# P06-G05 | PROVE | Compose a standalone analysis workflow
# TASK: Define summarize_batch(rows,scale) for [pixels,tag], returning
#   {'observed':N,'missing':M,'mean_um':mean or None}. If scale<=0, treat all as
#   missing. Set summary.
# INPUTS: rows, scale
```

**Practice:** 4 changed-input public cases; no private mastery grading.

**Debugging exercise:** A printed git command is presented as proof of a local commit. Explain what evidence is actually required.

**Misconception:** Printing shell instructions creates local Python environments or Git commits.

**Scientific limit:** Examples are synthetic. No local Git or virtual environment is executed, and raw-image calibration is not established.

## P06-G06 — Plan and verify a real Git change

**Why:** Learn plan and verify a real git change through traceable biological programming exercises.

**Concept:** Plan and verify a real Git change. Use Python's explicit input and output contracts instead of copying a first-example result.

**Data:** Distinguish None from recorded zero and preserve the original specimen ID, physical units and calibration provenance.

**Execution boundary:** Pyodide executes genuine Python and uses its own temporary file system. It cannot run local shell commands, create a local virtual environment or commit to the user's Git repository.

**Transfer:** Test changed inputs, export a working .py file, then verify local Python execution and Git evidence separately. Browser checks are not certification of scientific validity.

**Predict:** Predict the output and distinguish executed Python from printed local shell instructions.

**Runnable teaching example (not the solution):**

```python
script='field_report.py'
commands=['git status',f'git add {script}','git commit -m "Add field report"']
print('\n'.join(commands))
```

**Prediction explanation:** Python executes inside the browser; printing text does not run a local terminal.

**Walkthrough:**

1. Identify inputs and the expected returned output before coding.
2. Predict and run the example; change a case and explain the difference.
3. Record which operations still require local-machine verification.

**Investigate:**

- Try a missing or empty observation.
- Check one changed input instead of copying a fixed output.
- Explain why local environment and biological calibration remain unverified.

### Apply

Build commands=['git status','git add <script_name>','git commit -m "<message>"'] from supplied inputs. Set git_executed=False; this is a plan only.

```python
# P06-G06 | APPLY | Plan and verify a real Git change
# TASK: Build commands=['git status','git add <script_name>','git commit -m
#   "<message>"'] from supplied inputs. Set git_executed=False; this is a plan
#   only.
# INPUTS: script_name, message
```

**Practice:** 3 changed-input public cases; no private mastery grading.

### Prove independently

Set next_steps to git diff -- changed_file, git add changed_file, git commit -m commit_message and git status. Set evidence='NOT_VERIFIED_LOCALLY'.

```python
# P06-G06 | PROVE | Plan and verify a real Git change
# TASK: Set next_steps to git diff -- changed_file, git add changed_file, git
#   commit -m commit_message and git status. Set evidence='NOT_VERIFIED_LOCALLY'.
# INPUTS: changed_file, commit_message
```

**Practice:** 3 changed-input public cases; no private mastery grading.

**Debugging exercise:** A printed git command is presented as proof of a local commit. Explain what evidence is actually required.

**Misconception:** Printing shell instructions creates local Python environments or Git commits.

**Scientific limit:** Examples are synthetic. No local Git or virtual environment is executed, and raw-image calibration is not established.

## P06-CAPSTONE — Export a reproducible specimen audit

**Why:** Learn export a reproducible specimen audit through traceable biological programming exercises.

**Concept:** Export a reproducible specimen audit. Use Python's explicit input and output contracts instead of copying a first-example result.

**Data:** Distinguish None from recorded zero and preserve the original specimen ID, physical units and calibration provenance.

**Execution boundary:** Pyodide executes genuine Python and uses its own temporary file system. It cannot run local shell commands, create a local virtual environment or commit to the user's Git repository.

**Transfer:** Test changed inputs, export a working .py file, then verify local Python execution and Git evidence separately. Browser checks are not certification of scientific validity.

**Predict:** Predict the output and distinguish executed Python from printed local shell instructions.

**Runnable teaching example (not the solution):**

```python
import json
record={'id':'F1','pixels':16,'scale':4}
print(json.dumps(record,sort_keys=True))
print(record['pixels']/record['scale'])
```

**Prediction explanation:** Python executes inside the browser; printing text does not run a local terminal.

**Walkthrough:**

1. Identify inputs and the expected returned output before coding.
2. Predict and run the example; change a case and explain the difference.
3. Record which operations still require local-machine verification.

**Investigate:**

- Try a missing or empty observation.
- Check one changed input instead of copying a fixed output.
- Explain why local environment and biological calibration remain unverified.

### Apply

Import json. Define build_audit(records,scale) for [id,pixels] returning {'measurements':[[id,width]],'missing':[ids]}. Missing pixels or invalid scale are missing. Set audit and json_report=json.dumps(audit,sort_keys=True), print it.

```python
# P06-CAPSTONE | APPLY | Export a reproducible specimen audit
# TASK: Import json. Define build_audit(records,scale) for [id,pixels] returning
#   {'measurements':[[id,width]],'missing':[ids]}. Missing pixels or invalid scale
#   are missing. Set audit and json_report=json.dumps(audit,sort_keys=True), print
#   it.
# INPUTS: records, scale
```

**Practice:** 4 changed-input public cases; no private mastery grading.

### Prove independently

Import json. Define summarize_input(observations,calibration) for [pixels,id] returning {'n':N,'mean_um':mean or None,'excluded':[IDs]}. Invalid calibration excludes all. Set result and json_text=json.dumps(result,sort_keys=True), print it.

```python
# P06-CAPSTONE | PROVE | Export a reproducible specimen audit
# TASK: Import json. Define summarize_input(observations,calibration) for
#   [pixels,id] returning {'n':N,'mean_um':mean or None,'excluded':[IDs]}. Invalid
#   calibration excludes all. Set result and
#   json_text=json.dumps(result,sort_keys=True), print it.
# INPUTS: observations, calibration
```

**Practice:** 4 changed-input public cases; no private mastery grading.

**Debugging exercise:** A printed git command is presented as proof of a local commit. Explain what evidence is actually required.

**Misconception:** Printing shell instructions creates local Python environments or Git commits.

**Scientific limit:** Examples are synthetic. No local Git or virtual environment is executed, and raw-image calibration is not established.

**Capstone build passes:**

1. Build a JSON-ready report function preserving None and zero.
2. Reject invalid calibration before converting numeric widths.
3. Export a standalone script and test it on a changed specimen.
4. Run the script and tests in a local virtual environment.
5. Inspect actual Git diff and commit evidence; browser commands cannot do this.

**Scientific reflection:**

- What executed in the browser, and what still needs local verification?
- How would you verify Python version, tests and a real Git commit?
- Which biological assumptions remain unvalidated?

## P06-REVIEW — Reconstruct reproducible analysis after a delay

**Why:** Learn reconstruct reproducible analysis after a delay through traceable biological programming exercises.

**Concept:** Reconstruct reproducible analysis after a delay. Use Python's explicit input and output contracts instead of copying a first-example result.

**Data:** Distinguish None from recorded zero and preserve the original specimen ID, physical units and calibration provenance.

**Execution boundary:** Pyodide executes genuine Python and uses its own temporary file system. It cannot run local shell commands, create a local virtual environment or commit to the user's Git repository.

**Transfer:** Test changed inputs, export a working .py file, then verify local Python execution and Git evidence separately. Browser checks are not certification of scientific validity.

**Predict:** Predict the output and distinguish executed Python from printed local shell instructions.

**Prediction explanation:** Independent reconstruction: no solved program is given.

**Walkthrough:**

1. Identify inputs and the expected returned output before coding.
2. Predict and run the example; change a case and explain the difference.
3. Record which operations still require local-machine verification.

**Investigate:**

- Try a missing or empty observation.
- Check one changed input instead of copying a fixed output.
- Explain why local environment and biological calibration remain unverified.

### Apply

Write pseudocode comments for local Python, tests, .venv setup and Git evidence requirements.

```python
# P06-REVIEW | APPLY | Reconstruct reproducible analysis after a delay
# TASK: Write pseudocode comments for local Python, tests, .venv setup and Git
#   evidence requirements.
```

**Practice:** 0 changed-input public cases; no private mastery grading.

### Prove independently

Define reproducible_summary(measures,scale) for [id,pixels] returning {'count':N,'total_um':T,'invalid':[IDs]}. Missing pixels or invalid scale are invalid. Set report and print a summary.

```python
# P06-REVIEW | PROVE | Reconstruct reproducible analysis after a delay
# TASK: Define reproducible_summary(measures,scale) for [id,pixels] returning
#   {'count':N,'total_um':T,'invalid':[IDs]}. Missing pixels or invalid scale are
#   invalid. Set report and print a summary.
# INPUTS: measures, scale
```

**Practice:** 4 changed-input public cases; no private mastery grading.

**Debugging exercise:** A printed git command is presented as proof of a local commit. Explain what evidence is actually required.

**Misconception:** Printing shell instructions creates local Python environments or Git commits.

**Scientific limit:** Examples are synthetic. No local Git or virtual environment is executed, and raw-image calibration is not established.

**Scientific reflection:**

- What executed in the browser, and what still needs local verification?
- How would you verify Python version, tests and a real Git commit?
- Which biological assumptions remain unvalidated?

## Export and independent use

Export runnable JSON audit script and complete docs/P06_LOCAL_HANDOFF.md in a local Python environment.

Export as `reproducible_specimen_audit.py` after completing the Prove capstone. A successful public check does not establish retained mastery or calibrated biological validity.

**Mandatory offline verification:** [P06 Local Python and Git Handoff](../../docs/P06_LOCAL_HANDOFF.md). The browser cannot run a local virtual environment, a native Jupyter kernel or Git. Record actual terminal evidence before calling those competencies independently demonstrated.
