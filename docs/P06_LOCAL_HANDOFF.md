# P06 — Local Python, reproducibility and Git handoff

**Scope:** This document teaches tasks that cannot be verified by Pyodide. The browser can run Python and export a script. It does **not** create a virtual environment on your computer, run local Git, or prove that a native Jupyter kernel can read files.

## 1. Export a real script

Complete P06 Capstone → Prove in BioPython Studio, then use **Export**. Save the generated `reproducible_specimen_audit.py` in a new local directory. The exported input assignments are synthetic teaching data; replace them only after you have a documented real data source and calibration.

## 2. Confirm local Python

In a terminal opened inside the folder, run one of:

**macOS / Linux**

```sh
python3 --version
python3 -m venv .venv
source .venv/bin/activate
python --version
python -m pip --version
python reproducible_specimen_audit.py
```

**Windows PowerShell**

```powershell
py -3 --version
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python --version
python -m pip --version
python .\reproducible_specimen_audit.py
```

If activation is restricted by a security policy, follow your institution's IT guidance; do not lower system security merely to complete an exercise. The environment interpreter can be invoked directly without activation.

`venv` is provided by the Python standard library. This particular exported audit uses only standard-library imports. You do not need to install third-party packages. If your later pipeline needs NumPy, pin and record its version.

## 3. Real testing in the local environment

Create `test_reproducible_specimen_audit.py` or a separate scratch script that calls the exported function with at least three independent cases: a valid numeric measurement, a missing record (`None`), and invalid/zero calibration. Inspect the intended output and make one deliberately broken implementation fail an assertion.

Examples of the test **conditions** (write the test yourself):
- Positive calibration yields a physical width equal to pixels divided by pixels-per-micrometre.
- Missing width does not become zero.
- An excluded record remains identifiable.
- The original source list is unchanged.

Run a fresh Python process, not only an existing interactive session. Save the command, Python version, exit code and a short pass/fail summary. A screenshot of the BioPython Studio browser does not substitute for this step.

## 4. Verify Git on the actual computer

In a folder where version control is appropriate:

```sh
git init
git status
git diff -- reproducible_specimen_audit.py
git add reproducible_specimen_audit.py
git commit -m "Add reproducible specimen audit"
git log -1 --oneline
git status
```

If Git requires author configuration, follow its own instructions. If the file is newly untracked, `git diff -- file` will not show it until staged; use `git diff --cached -- file` after staging. Do not commit real patient/sample identifiers or confidential research data into a public repository.

**Evidence to record:** the commit hash from `git log -1`, the changed file shown in the commit, and the status afterward. A generated command sequence inside the browser is not evidence that Git actually ran.

## 5. Independent transfer checklist

- [ ] Exported file runs successfully in a fresh local Python process
- [ ] Python version and local path recorded
- [ ] Actual `.venv` folder created and its interpreter used
- [ ] New input case, empty case, missing-value case and invalid calibration tested
- [ ] Standalone test fails when implementation is deliberately broken
- [ ] Git commit exists and its hash can be inspected
- [ ] Source IDs and calibration provenance are documented
- [ ] Limitations described: synthetic metadata, fields vs independent biological replicates

The browser may store a note that you attempted P06. Only independently checked local evidence should count as locally completed skills 032 and 036. Neither successful software execution nor a Git commit validates a scientific measurement.

## 6. Further reproducibility

When a real dataset becomes available, store the dataset provenance, expected axes, channel identity, calibration and analysis parameters. Do not report the toy 0–1 score or image-RGB brightness as calibrated fluorescence. Later microscopy chapters handle image decoding, segmentation validation and replicate-aware statistics.
