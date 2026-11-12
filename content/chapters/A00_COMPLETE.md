# A00 — Local scientific Python bridge

**Status:** Working browser primer plus independently required local execution.

**Deliverable:** Python interpreter/environment log, saved source SHA-256, a clear script with functions, independent pytest checks, and a new Git commit from a clean checkout.

**Local method:** see [A00 setup and practical evidence](../../projects/advanced/a00/START_HERE.md) and [executable bridge CLI](../../projects/advanced/a00/bridge.py).

## Goals

### 1. Know which Python actually runs

A Jupyter kernel can silently use a different Python environment from the terminal.

Compare data.editor_python and data.kernel_python and list missing packages. Return result={'same_interpreter':bool,'missing_packages':sorted list}.

**Scientific caveat:** Record sys.executable and package versions in the real local checkpoint.

### 2. Reject unsafe scientific-data paths

Data loaders must not follow accidental or malicious paths outside a source directory.

Separate data.paths into safe relative filenames and rejected traversal/absolute paths. Return result={'safe':list,'rejected':list}, preserving input order.

**Scientific caveat:** In the local project, resolve source paths and ensure they stay inside the declared root.

### 3. Extract biological units with reusable functions

A small pure function for animal-level aggregation is easier to test than a notebook full of hidden state.

From data.rows with animal_id and numeric value, compute per-animal means. Return result={'animal_means':dict,'field_count':int}.

**Scientific caveat:** Fields remain technical measurements; aggregation does not invent biological replication.

### 4. Test edge cases rather than a single happy path

Small parameterized tests expose wrong comparisons and missing-case assumptions before large batch runs.

For data.samples (id,signal) identify values >= data.minimum. Return result={'passed':sorted IDs,'failed':sorted IDs}.

**Scientific caveat:** Real pytest checks live in a separate local test file and run without browser state.

### 5. Fingerprint source and configuration

Reproducibility requires an exact source and parameter fingerprint, not a filename.

Compute SHA256 of bytes(data.raw_bytes) and canonical sorted JSON for data.config. Return result={'source_sha256':str,'config_sha256':str}.

**Scientific caveat:** Record installed package versions and the Git commit separately on the desktop.

### 6. Independent local-analysis readiness audit

A scientifically usable local project must preserve identity and biological grouping while analyzing changing files.

Given data.rows of animal_id,field_id,signal and a source digest, compute result={'animal_means':dict,'fields':int,'biological_n':int,'source_sha256':str}. Never count fields as animals.

**Scientific caveat:** This browser task is a primer: the local gate still requires a clean venv, Git and pytest.

### 7. Delayed source and interpreter transfer

Delayed practice checks memory, not a copied solved notebook.

Return later: from data.paths and data.input_bytes report result={'rejected':list,'sha256':str,'requires_local_replay':True}.

**Scientific caveat:** The app cannot observe a real local git commit or clean desktop environment.

## Independent exit gate

The browser output is not a local environment. Run the local bridge CLI on a previously unseen CSV and its pytest suite, record Python executable and package versions, source hashes and a Git commit SHA. Repeat from a fresh checkout. Human review of evidence is required.
