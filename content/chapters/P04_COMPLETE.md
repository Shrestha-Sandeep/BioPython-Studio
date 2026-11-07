# P04 — Organize experimental metadata

**Learning status:** browser learner-pilot chapter. Not independent-mastery certification.

Create trustworthy Python metadata records for microscopy: dictionaries, nested data, deduplication, concise filters, record iteration and paired arrays. Preserve source order and missingness; do not treat fields as independent replicates.

**Source and provenance:** https://github.com/guiwitz/PyImageCourse_beginner/blob/master/Appendix_Structures.ipynb. Additional explanations follow Python for Biologists, the Python Data Science Handbook and Python standard-library documentation. Scientific data in lessons are fictional; image references must retain attribution in `assets/witz/CREDITS.md`.

**Science boundary:** Synthetic metadata are not source-verified biological observations.

## P04-G01 — Map specimen IDs to metadata

**Why:** A sample ID must resolve to the right experimental metadata rather than being inferred from file names.

A dictionary maps a stable specimen key to explicit metadata. Each entry can hold a channel, a field count, and other values without relying on list position.

Use `record[key]` only when the key must exist. Use `.get(key)` when absence has a defined meaning; missing metadata is not a measured zero.

A dictionary lookup is a computational operation, not proof that the metadata reflects the actual sample. Preserve source IDs and log provenance.

**Predict:** What is printed, and what does the outer key identify?

**Runnable teaching example (not the solution):**

```python
records = {'WT_R1': {'channel': 'GFP', 'fields': 4}}
print(records['WT_R1']['channel'])
print(records['WT_R1']['fields'])
```

**Prediction explanation:** GFP and 4. WT_R1 is the stable specimen key, not the fourth image field.

**Walkthrough:**

1. Identify the source record and the meaning of each variable.
2. Predict the result on the current input before running the example.
3. Change a sample ID, missing value or boundary case and explain the result.

**Investigate:**

- Try one empty or incomplete record without inventing a measurement.
- Check that output responds to a changed specimen identity.
- Explain why the result does not establish biological replication.

### Apply

Create metadata keyed by specimen_id. Store channel and fields; set field_count by looking up the new record.

```python
# P04-G01 | APPLY | Map specimen IDs to metadata
# TASK: Build metadata and field_count from the supplied specimen fields.
# INPUTS: specimen_id, channel, fields
```

**Practice:** 3 changed-input public cases; no private mastery grading.

### Prove independently

Build sample_record keyed by sample and recover replicate_id. Preserve the exact original sample key.

```python
# P04-G01 | PROVE | Map specimen IDs to metadata
# TASK: Create sample_record with stain and replicate; extract replicate_id.
# INPUTS: sample, stain, replicate
```

**Practice:** 3 changed-input public cases; no private mastery grading.

**Debugging exercise:** Using a hardcoded specimen key silently returns the wrong channel for another acquisition.

**Misconception:** A syntactically valid record automatically represents verified scientific data.

**Scientific limit:** IDs, field counts and QC metadata are synthetic training records. Valid syntax is not verified specimen identity; field counts are not biological replicates.

## P04-G02 — Read nested metadata without inventing values

**Why:** Biological records often have nested and partially missing measurement fields.

Nested dictionaries reflect structured observations: a specimen can have an `analysis` record containing a `focus` field. Each missing level needs an explicit policy.

A missing key is not the same as a numeric zero. Use `.get` with a default empty mapping and distinguish `None` from numeric values.

Do not mutate source metadata just to make a lookup work. A downstream data-quality report should retain missingness.

**Predict:** Why does the second lookup return None instead of zero?

**Runnable teaching example (not the solution):**

```python
sample = {'analysis': {'focus': 0.81}}
print(sample.get('analysis', {}).get('focus'))
print({'analysis': {}}.get('analysis', {}).get('focus'))
```

**Prediction explanation:** The nested focus key is absent. None means not recorded; zero would be a recorded numerical score.

**Walkthrough:**

1. Identify the source record and the meaning of each variable.
2. Predict the result on the current input before running the example.
3. Change a sample ID, missing value or boundary case and explain the result.

**Investigate:**

- Try one empty or incomplete record without inventing a measurement.
- Check that output responds to a changed specimen identity.
- Explain why the result does not establish biological replication.

### Apply

Get mean_focus from records[sample_id]['analysis']['focus'] when available; otherwise None. Set has_focus to True only when a value exists.

```python
# P04-G02 | APPLY | Read nested metadata without inventing values
# TASK: Safely read mean_focus and has_focus from nested metadata.
# INPUTS: records, sample_id
```

**Practice:** 4 changed-input public cases; no private mastery grading.

### Prove independently

Read temperature from batch_data[batch_id]['environment'] when present; preserve missingness as None and set recorded.

```python
# P04-G02 | PROVE | Read nested metadata without inventing values
# TASK: Retrieve temperature and recorded without KeyError.
# INPUTS: batch_data, batch_id
```

**Practice:** 4 changed-input public cases; no private mastery grading.

**Debugging exercise:** A missing nested record raises KeyError; a default numeric zero would corrupt data provenance.

**Misconception:** A syntactically valid record automatically represents verified scientific data.

**Scientific limit:** IDs, field counts and QC metadata are synthetic training records. Valid syntax is not verified specimen identity; field counts are not biological replicates.

## P04-G03 — Audit duplicates with a set

**Why:** Repeated specimen IDs can inflate reported acquisition totals and corrupt joins.

A set provides fast membership tests. Use it to track previously observed sample IDs while preserving acquisition order in separate lists.

A repeated ID should be flagged once under the lesson policy, not silently removed from the source sequence. Distinct duplication events can be audited separately if needed.

Sets have no guaranteed acquisition order. Produce ordered outputs using the original list iteration, not by converting an output set to a list.

**Predict:** Which ID is reported twice in the source, and when is it detected?

**Runnable teaching example (not the solution):**

```python
ids = ['F02','F09','F02','F11']
seen = set()
for field_id in ids:
    if field_id in seen:
        print('repeat', field_id)
    seen.add(field_id)
```

**Prediction explanation:** F02 is detected on its second occurrence, after F02 was added to the seen set.

**Walkthrough:**

1. Identify the source record and the meaning of each variable.
2. Predict the result on the current input before running the example.
3. Change a sample ID, missing value or boundary case and explain the result.

**Investigate:**

- Try one empty or incomplete record without inventing a measurement.
- Check that output responds to a changed specimen identity.
- Explain why the result does not establish biological replication.

### Apply

From ids create unique_ids in first-seen order, duplicate_ids with each repeated ID listed once, and unique_count.

```python
# P04-G03 | APPLY | Audit duplicates with a set
# TASK: Preserve first-seen order; record duplicated IDs once.
# INPUTS: ids
```

**Practice:** 4 changed-input public cases; no private mastery grading.

### Prove independently

Build kept as first-seen distinct sample_ids that are not in excluded_ids. Build excluded_seen for unique source IDs present in excluded_ids, preserving source order.

```python
# P04-G03 | PROVE | Audit duplicates with a set
# TASK: Build kept and excluded_seen using set membership.
# INPUTS: sample_ids, excluded_ids
```

**Practice:** 4 changed-input public cases; no private mastery grading.

**Debugging exercise:** Converting the source list to a set hides record ordering and removes the evidence that duplication occurred.

**Misconception:** A syntactically valid record automatically represents verified scientific data.

**Scientific limit:** IDs, field counts and QC metadata are synthetic training records. Valid syntax is not verified specimen identity; field counts are not biological replicates.

## P04-G04 — Express selection as a comprehension

**Why:** Readable compact filters can preserve candidate IDs without throwing away missing-data context.

A list comprehension creates a new list while iterating over existing values. Use it when the decision is simple and explicitly documented.

Do not compare `None` to numeric thresholds. For scores, test whether a score exists and falls within the permitted range before applying a threshold.

Complex validation priority is easier to audit with ordinary loops; avoid forcing a many-branch workflow into a single expression.

**Predict:** Why is F2 not evaluated against the threshold?

**Runnable teaching example (not the solution):**

```python
pairs = [('F1', 0.9), ('F2', None), ('F3', 0.4)]
passed = [field_id for field_id, score in pairs if score is not None and score >= 0.8]
print(passed)
```

**Prediction explanation:** The `and` short-circuits after `score is not None` is False, so None is never numerically compared.

**Walkthrough:**

1. Identify the source record and the meaning of each variable.
2. Predict the result on the current input before running the example.
3. Change a sample ID, missing value or boundary case and explain the result.

**Investigate:**

- Try one empty or incomplete record without inventing a measurement.
- Check that output responds to a changed specimen identity.
- Explain why the result does not establish biological replication.

### Apply

Produce passing_ids from [ID, score] pairs when the score is not None, between 0 and 1 inclusive, and >= minimum. Preserve source order.

```python
# P04-G04 | APPLY | Express selection as a comprehension
# TASK: Build passing_ids with a comprehension; skip None and invalid scores.
# INPUTS: field_pairs, minimum
```

**Practice:** 4 changed-input public cases; no private mastery grading.

### Prove independently

Select names from [name, count] pairs when count is recorded, nonnegative and >= min_count; preserve order.

```python
# P04-G04 | PROVE | Express selection as a comprehension
# TASK: Build selected_names using a single readable comprehension.
# INPUTS: observations, min_count
```

**Practice:** 4 changed-input public cases; no private mastery grading.

**Debugging exercise:** A comprehension with `score >= minimum` before the missing-value guard raises TypeError.

**Misconception:** A syntactically valid record automatically represents verified scientific data.

**Scientific limit:** IDs, field counts and QC metadata are synthetic training records. Valid syntax is not verified specimen identity; field counts are not biological replicates.

## P04-G05 — Summarize dictionary records

**Why:** An experiment report must summarize samples using their attached metadata, not a separate accidental order.

Iterating with `.items()` yields specimen IDs together with their corresponding metadata. This avoids indexing parallel lists with unrelated positions.

Scientific selection needs explicit conditions. Excluding a specimen because a channel is missing is a data-quality decision, not evidence that the specimen was biologically negative.

Accumulate totals from the actual numeric field counts only after confirming the field was recorded and valid.

**Predict:** Which record has zero fields, and does that automatically make it accepted?

**Runnable teaching example (not the solution):**

```python
records = {'A': {'fields': 3, 'valid': True}, 'B': {'fields': 0, 'valid': False}}
for sid, meta in records.items():
    print(sid, meta['fields'], meta['valid'])
```

**Prediction explanation:** B has zero fields but is flagged invalid. A numeric zero and the QC flag have distinct meanings.

**Walkthrough:**

1. Identify the source record and the meaning of each variable.
2. Predict the result on the current input before running the example.
3. Change a sample ID, missing value or boundary case and explain the result.

**Investigate:**

- Try one empty or incomplete record without inventing a measurement.
- Check that output responds to a changed specimen identity.
- Explain why the result does not establish biological replication.

### Apply

Create accepted IDs where valid is True and fields is an integer >0, plus field_total across accepted specimens.

```python
# P04-G05 | APPLY | Summarize dictionary records
# TASK: Accumulate accepted IDs and field_total from metadata.
# INPUTS: records
```

**Practice:** 4 changed-input public cases; no private mastery grading.

### Prove independently

Collect selected_ids for entries with marker equal to target_marker and qc is True; set selected_count. Do not reorder or relabel source keys.

```python
# P04-G05 | PROVE | Summarize dictionary records
# TASK: Select records by marker and QC, and count them.
# INPUTS: channels, target_marker
```

**Practice:** 4 changed-input public cases; no private mastery grading.

**Debugging exercise:** Summing all field counts, including rejected samples, changes the denominator and makes the QC report misleading.

**Misconception:** A syntactically valid record automatically represents verified scientific data.

**Scientific limit:** IDs, field counts and QC metadata are synthetic training records. Valid syntax is not verified specimen identity; field counts are not biological replicates.

## P04-G06 — Pair matching observations with zip

**Why:** Field IDs and measurements must remain paired without silently discarding unmatched entries.

`zip(ids, scores)` pairs items by position. This is appropriate only when the lists are known to describe the same acquisition order.

Ordinary zip silently truncates to the shorter list. Verify equal lengths first and reject a mismatch before constructing a report.

A paired record preserves identity; a mean computed after silently losing a field is not a trustworthy measurement summary.

**Predict:** Which score is associated with F2, and how can unmatched arrays be detected?

**Runnable teaching example (not the solution):**

```python
ids = ['F1','F2']
scores = [0.9, None]
print(list(zip(ids, scores)))
print(len(ids) == len(scores))
```

**Prediction explanation:** F2 has None, an explicitly missing observation. Compare input lengths before combining the lists.

**Walkthrough:**

1. Identify the source record and the meaning of each variable.
2. Predict the result on the current input before running the example.
3. Change a sample ID, missing value or boundary case and explain the result.

**Investigate:**

- Try one empty or incomplete record without inventing a measurement.
- Check that output responds to a changed specimen identity.
- Explain why the result does not establish biological replication.

### Apply

If ids and scores lengths differ, set length_ok=False and paired=[] and missing_ids=[]; else pair with zip and collect IDs with None values.

```python
# P04-G06 | APPLY | Pair matching observations with zip
# TASK: Pair equal-length lists; reject length mismatches without truncation.
# INPUTS: ids, scores
```

**Practice:** 4 changed-input public cases; no private mastery grading.

### Prove independently

For equal-length field_names and counts, build summary mapping names to counts and count_total; for mismatch set aligned=False, summary={} and count_total=0. Names are unique.

```python
# P04-G06 | PROVE | Pair matching observations with zip
# TASK: Reject misaligned series, otherwise build summary and count_total.
# INPUTS: field_names, counts
```

**Practice:** 4 changed-input public cases; no private mastery grading.

**Debugging exercise:** zip truncation can silently drop a field, so a correct-looking result may hide an unpaired measurement.

**Misconception:** A syntactically valid record automatically represents verified scientific data.

**Scientific limit:** IDs, field counts and QC metadata are synthetic training records. Valid syntax is not verified specimen identity; field counts are not biological replicates.

## P04-CAPSTONE — Build an auditable microscopy metadata registry

**Why:** Sample records must remain traceable even when acquisition IDs repeat or metadata are incomplete.

An acquisition registry maps stable IDs to their first recorded metadata and explicitly audits repeated IDs. Rejecting silently duplicated keys would hide a real audit problem.

Missing channels or field counts are incomplete metadata, not zero-intensity measurements. Preserve both the original ordered records and the first record for each ID.

This is a metadata integrity report, not imaging-quality validation; a valid record does not establish correct biological identity or instrument calibration.

**Predict:** Why must the second A remain visible as duplicate rather than silently replace the first record?

**Runnable teaching example (not the solution):**

```python
records = [{'id':'A','channel':'GFP','fields':3}, {'id':'A','channel':'DAPI','fields':2}, {'id':'B','channel':'','fields':None}]
seen = set()
for rec in records:
    sid = rec['id']
    print(sid, 'duplicate' if sid in seen else 'first')
    seen.add(sid)
```

**Prediction explanation:** The two A entries conflict. Overwriting one would destroy evidence of an acquisition or recording discrepancy.

**Walkthrough:**

1. Identify the source record and the meaning of each variable.
2. Predict the result on the current input before running the example.
3. Change a sample ID, missing value or boundary case and explain the result.

**Investigate:**

- Try one empty or incomplete record without inventing a measurement.
- Check that output responds to a changed specimen identity.
- Explain why the result does not establish biological replication.

### Apply

From ordered records (id/channel/fields) create by_id preserving each ID's first record; duplicate_ids once per repeated ID; incomplete_ids for first-seen IDs missing a channel or fields (None); report exactly 'stored=N; duplicates=D; incomplete=I'. Print report. Never mutate records.

```python
# P04-CAPSTONE | APPLY | Build an auditable microscopy metadata registry
# TASK: Audit first-seen metadata, duplicates, and missing fields; print
#   report.
# INPUTS: records
```

**Practice:** 4 changed-input public cases; no private mastery grading.

### Prove independently

Given samples as [id,metadata] pairs and required_marker, create selected mapping of first-seen complete IDs whose marker matches, duplicate_keys once each, missing_keys for first-seen IDs with None/empty marker or batch or count. Report 'selected=N | duplicates=D | missing=M'. Preserve samples.

```python
# P04-CAPSTONE | PROVE | Build an auditable microscopy metadata registry
# TASK: Audit unfamiliar [ID,metadata] pairs and retain selected complete
#   records.
# INPUTS: samples, required_marker
```

**Practice:** 4 changed-input public cases; no private mastery grading.

**Debugging exercise:** Diagnose a missing ID or duplicated record without hardcoding a fixed result.

**Misconception:** A syntactically valid record automatically represents verified scientific data.

**Scientific limit:** IDs, field counts and QC metadata are synthetic training records. Valid syntax is not verified specimen identity; field counts are not biological replicates.

**Capstone build passes:**

1. Inspect raw IDs and their first recorded metadata before constructing a registry.
2. Detect repeated keys explicitly; do not overwrite or erase source records.
3. Classify missing fields separately from numerical zero and valid metadata.
4. Construct an auditable summary; test empty, repeated and incomplete inputs.
5. Complete Prove on unfamiliar pair-shaped records and explain rejected rows.

**Scientific reflection:**

- Which record is the independent biological unit, if any?
- How are missing and duplicate metadata handled?
- Which code change would be required for an unfamiliar input?
- What evidence would validate the original source metadata?

## P04-REVIEW — Reconstruct a metadata join after a delay

**Why:** Independent transfer requires discovering missing and repeated IDs without reusing the registry code.

New data may provide a list of [sample_key,channel] pairs rather than dictionaries. You must reconstruct the stable-record policy from first principles.

Accept only first occurrences of allowed channels. Repeated keys and missing channels are different failures; preserve acquisition order.

This delayed task records a transparent practice result, not automatic biological truth or long-term mastery.

**Predict:** Predict which records will appear and why.

**Prediction explanation:** Record identities and missing data must be considered before accepting a measurement.

**Walkthrough:**

1. Identify the source record and the meaning of each variable.
2. Predict the result on the current input before running the example.
3. Change a sample ID, missing value or boundary case and explain the result.

**Investigate:**

- Try one empty or incomplete record without inventing a measurement.
- Check that output responds to a changed specimen identity.
- Explain why the result does not establish biological replication.

### Apply

Write pseudocode comments: how will you identify duplicated sample keys, missing channel names, and allowed channels without altering input?

```python
# P04-REVIEW | APPLY | Reconstruct a metadata join after a delay
# TASK: Write a plan for classifying new metadata records.
```

**Practice:** 0 changed-input public cases; no private mastery grading.

### Prove independently

From acquisitions [sample_key,channel] and allowed_channels, build kept as first-seen allowed keys, repeated as unique duplicates, unknown as first-seen IDs with blank or disallowed channels. Print line exactly 'kept=N; repeated=R; unknown=U'.

```python
# P04-REVIEW | PROVE | Reconstruct a metadata join after a delay
# TASK: Rebuild a metadata audit on unfamiliar [ID,channel] observations.
# INPUTS: acquisitions, allowed_channels
```

**Practice:** 4 changed-input public cases; no private mastery grading.

**Debugging exercise:** Diagnose a missing ID or duplicated record without hardcoding a fixed result.

**Misconception:** A syntactically valid record automatically represents verified scientific data.

**Scientific limit:** IDs, field counts and QC metadata are synthetic training records. Valid syntax is not verified specimen identity; field counts are not biological replicates.

**Scientific reflection:**

- Which record is the independent biological unit, if any?
- How are missing and duplicate metadata handled?
- Which code change would be required for an unfamiliar input?
- What evidence would validate the original source metadata?

## Export and independent use

Build an auditable registry that preserves source records, identifies duplicates and missing metadata, and exports a self-contained Python report.

Export as `microscopy_metadata_registry.py` after completing the Prove capstone. A successful public check does not establish retained mastery or calibrated biological validity.
