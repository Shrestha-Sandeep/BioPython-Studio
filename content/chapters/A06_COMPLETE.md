# A06 — Reproducible multi-image scientific analysis

**Scientific deliverable:** native TIFF batch pipeline with explicit axes, source/config SHA-256, per-field candidate masks, an A05-ready animal/field CSV and a versioned report.

Use [A06 real TIFF CLI](../../projects/advanced/a06/batch.py) in a fresh local Python environment. Browser cases test software contracts with synthetic arrays; the local batch must preserve original image bytes and use original metadata.

## Independent learning sequence

### 1. Separate pure processing from file I/O

A pure transformation can be tested without a microscope, filesystem, GUI or hidden notebook state.

**Coding task:** From data.pixels,data.background,data.threshold, compute source-preserving corrected pixel count and max. Return result={'candidate_pixels':int,'max_corrected':float}.

**Scientific boundary:** The exported count remains a candidate pixel count, not biologically validated cells.

### 2. Validate axes and channel selection before batch runs

Blindly squeezing a multidimensional image can silently analyze the wrong time, channel or plane.

**Coding task:** Given data.axes, data.shape and data.selection mapping, report result={'selected_shape':list,'missing_non_singleton':sorted axis letters} without guessing unselected C/Z/T.

**Scientific boundary:** Reject ambiguous dimensions rather than choosing channel zero without a reason.

### 3. Preflight a batch manifest

An experiment with missing images or duplicate IDs should fail before partial biological results are exported.

**Coding task:** Check data.records with image_id,source_path and exists flag. Return result={'duplicates':sorted IDs,'missing_sources':sorted IDs,'can_start':boolean}.

**Scientific boundary:** Preflight validation prevents a partially processed experiment being reported as complete.

### 4. Record source, config and environment fingerprints

Reproducibility needs a complete parameter identity and environment, not a screenshot of plausible masks.

**Coding task:** Hash data.source_bytes and sorted compact JSON of data.config; record data.environment. Return result={'source_sha256':str,'config_sha256':str,'environment':str}.

**Scientific boundary:** Environment strings document versions; they do not guarantee equivalent behavior.

### 5. Run invariant regression tests across changed inputs

A smoke test should fail when array processing changes unexpectedly after a refactor.

**Coding task:** For data.cases of mask,expected_pixel_count, verify expected foreground pixels. Return result={'passed':sorted IDs,'failed':sorted IDs}.

**Scientific boundary:** A known output fixture proves software behavior but not biological accuracy.

### 6. Compare clean-run outputs without hidden notebook state

Two successful executions may differ because input files, parameters or package state changed.

**Coding task:** Compare data.first and data.second manifests (matching source_hash/config_hash/output_hash). Return result={'equivalent':bool,'differing_fields':sorted list}.

**Scientific boundary:** Replaying on a clean checkout is an external requirement, not a browser badge.

### 7. Deterministic multi-image candidate report

A useful scientific batch export must retain every field, its parent animal and an honest candidate-only label.

**Coding task:** Given data.fields with field_id,animal_id,pixels, threshold, count > threshold per field and group by animal. Return result={'field_counts':dict,'animal_means':dict,'source_fields':int,'biological_n':int,'candidate_only':True}.

**Scientific boundary:** No biological target identity can be inferred without annotation review.

### 8. Delayed reproducibility and provenance audit

A successful rerun without identical source and configuration is not exact reproducibility.

**Coding task:** From data.first and data.second (source_hash,parameter_hash,result_hash,environment), return result={'exact_result_match':bool,'source_match':bool,'environment_changed':bool}.

**Scientific boundary:** A clean checkout and fresh execution are still required outside the browser.

## Exit gate

Process at least two original TIFF files in an independent source directory; verify byte-level source integrity, consistent axes/channel selection, an A05-compatible CSV, meaningful failure messages, and an identical clean-checkout run. If the required data or code environment are unavailable, record the blocker instead of claiming reproducibility.
