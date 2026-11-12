# A00 — Move from the browser to independent scientific Python

This is a short optional bridge for people who have finished P05/P06. It is **not** a complete in-app chapter yet. Work locally on your own computer. A browser/Pyodide PASS cannot certify these tasks.

## Practical checkpoint

From a fresh folder, create a virtual environment, install numpy, tifffile and pytest, execute the native image audit, run its tests, and commit the scripts/documentation without committing experimental data or secrets.

Commands for macOS/Linux shell:

```sh
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -U pip
python -m pip install -r projects/advanced/requirements.txt
python -m pytest -q tests/test_advanced_image_audit.py
python projects/advanced/a01/image_audit.py --help
```

Windows PowerShell:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -U pip
python -m pip install -r projects/advanced/requirements.txt
python -m pytest -q tests/test_advanced_image_audit.py
python projects/advanced/a01/image_audit.py --help
```

Commands assume you are in the root of a checked-out BioPython-Studio repository. If virtual-environment activation is restricted, invoke `.venv/Scripts/python.exe` (Windows) or `.venv/bin/python` directly. Run all commands rather than copying a screenshot of the final output from someone else.

## Independent transfer

1. Identify the *exact* interpreter and package versions with `sys.executable`, `sys.version` and `python -m pip list`; describe a potential Jupyter interpreter mismatch.
2. Use `pathlib` to read a new source TIFF in an unrelated folder; never rename or overwrite the original.
3. Read a failed test; adjust only what is needed to make it pass, without deleting the failure check.
4. Run `git status` and save a commit containing scripts/docs only. Record commit SHA and environment info in a personal execution log.
5. Recreate a fresh environment in a different folder and independently rerun the audit/tests.

## Gate

A00 is complete for a learner only when there is **actual desktop evidence**: interpreter identity, successful tests on a clean checkout, a source-preserving sample audit and a Git commit hash. The browser cannot supply that proof.
