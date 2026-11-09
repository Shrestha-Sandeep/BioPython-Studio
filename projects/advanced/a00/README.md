# A00 — Bridge from browser to real scientific Python

**Status:** Native CLI implementation and Pyodide learning primer exist. **No user's local computer has been verified**, and a browser PASS is not proof of this checkpoint.

## Actual local outcome (required)

From a **clean checkout**, verify the installed Python interpreter, `pip` packages, file paths and source checksums. Write and run unit tests on independent CSV fixtures, record Git commit and reproduce a report.

From the repository root:

```sh
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -r projects/advanced/requirements.txt
python -m pytest -q tests/test_advanced_a00_a05_a06_a07.py
python -m projects.advanced.a00.bridge --help
python -m pip freeze > local-package-freeze.txt
git rev-parse HEAD
```

For Windows PowerShell:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r projects/advanced/requirements.txt
.\.venv\Scripts\python.exe -m pytest -q tests/test_advanced_a00_a05_a06_a07.py
.\.venv\Scripts\python.exe -m projects.advanced.a00.bridge --help
git rev-parse HEAD
```

Create an **untracked** input `samples.csv` with columns `sample_id,animal_id,value`, e.g., distinct fields from more than one animal. Run:

```sh
python -m projects.advanced.a00.bridge --input samples.csv --out outputs/a00/new-audit.json
```

Avoid committing raw private images, credentials, clinical data, or personal notes. The new output path must not overwrite the input. Record `sys.executable` and `python -m pip freeze` from the **same interpreter** used for analysis.

## Gate — observable evidence

Present a true local command log, Git commit SHA, original-source SHA-256, package freeze and a clean-replay output hash. Re-run from a **second folder or fresh virtual environment**, not an already-mutated kernel. An unconfirmed claim of local execution does not count as E4 learning evidence.

## Learning goals

A00-G01 interpreter/kernel mismatch; G02 path traversal; G03 pure functions and biological IDs; G04 input/edge-case testing; G05 source/config hashing; capstone; delayed review.

[Optional learning route](../../../../?lab=advanced) · [Native source audit](../a01/README.md)
