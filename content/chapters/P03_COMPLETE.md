# P03 — Filter recorded microscope fields

**BioPython Studio · Detailed chapter manuscript v1.0**  
**Status:** Complete teaching candidate; automated scientific-code validation and learner trial are separate release gates.  
**Frozen scope:** P03 competencies 012–018 from the 26-chapter, 156-competency curriculum (seven exact assignments).  
**Runtime:** actual Python (Pyodide in the app or ordinary CPython).  
**Primary teaching sources:** Guillaume Witz, `Image Processing for Beginners` (Witz 08 / e08); official Python documentation. This text and these exercises were newly authored.

## The scientific question

A microscope acquisition might contain fields F09, F02 and F11, in that order. The next file may have no usable focus score; another may fail a predeclared quality threshold, and an exported list may contain the same field twice. A careless program that drops fields, loses IDs or silently changes the source list can produce a plausible-looking but scientifically misleading report.

**The goal of P03 is an auditable field filter.** For every *visited* record, you should be able to explain which field ID was accepted, which was rejected under a fixed rule, which was missing, and which was structurally or numerically invalid. A record not visited because of a stop condition must never be counted as accepted.

This chapter uses synthetic record names and synthetic 0–1 focus-like values. The familiar Witz/Human Protein Atlas fluorescence figure is provided only to connect the task to biology; it is not the raw calibrated source of these numbers. **Field-level counts are not numbers of independent biological replicates.** Fields may be repeated observations of the same specimen, animal or well. You cannot infer a biological effect from the counts here.

### Why these Python skills are worth learning

P01 taught you to construct and explain a single specimen report, and to keep numerical units explicit. P02 taught strict labels and conditional QC rules. P03 adds collections and iteration, allowing you to apply a consistent rule to every recorded field while maintaining a record of exclusions. You will practise a source-preserving pattern that later generalizes to tables, image masks, tracking data and sequencing metadata.

The real risk is not learning how to type `for` or `while`. It is learning how to *reason* about a loop: which rows are read, which values are skipped, which observations can be counted, and why the output would change under different input data. Every activity therefore includes predictions, a real executable example, a changed-input Apply task and an unfamiliar Prove task.

### How to study P03 in the app

- **Learn:** read one short concept, predict what the code prints, execute it, and inspect the resulting state or traceback. Read the optional walkthrough only when useful.
- **Apply:** complete a small missing piece with optional progressive hints. The app runs your Python on multiple *changed inputs*, rather than matching text typed into the editor.
- **Prove:** solve a different task with unfamiliar names or representation. No hints are provided during this phase, but previous help and practice are not automatically confused with retained mastery.
- **Capstone:** create a reproducible field-level QC script, classify invalid and missing records, export a standalone .py file and describe what your analysis cannot support.
- **Return later:** reconstruct a related analysis from memory after a period away. The browser can label delayed practice but cannot verify independence, biological validity or long-term skill retention.

Each mini-goal is a stopping point. You do not need a streak, a video lecture or a timer. Prefer one independent working script over repeatedly reading correct-looking model answers.

## The seven mini-goals

| Learning step | Frozen competency | Outcome |
|---|---|---|
| P03-G01 | 016 | Index and slice field lists |
| P03-G02 | 017 | Copy and change lists safely |
| P03-G03 | 018 | Unpack immutable tuple records |
| P03-G04 | 012 | Iterate and summarize microscope-field lists |
| P03-G05 | 013 | Number fields with range and enumerate |
| P03-G06 | 014 | Bound a while loop to finite input |
| P03-G07 | 015 | Skip and stop with explicit audit reasons |
| P03-CAPSTONE | no new ID | accepted / rejected / missing / invalid ID audit |
| P03-REVIEW | no new ID | independent delayed reconstruction |

**Important prerequisite ordering:** P03 teaches indexing and safe list handling before full iteration because the frozen manifest requires list competence 016 before skill 012. The order here is instructional, not a reassignment of canonical IDs.

---
## 1. Index and slice field lists (P03-G01)

**Scientific reason to learn it:** File order and field identity are different. Safe indexing must account for empty acquisitions.

### Learn: the underlying idea

**A Python list preserves an explicit order.** Use brackets to store fields such as `['F09','F02','F11']`. The first item is index 0, regardless of the digits in its identifier. An identifier F09 does not mean the ninth position or the ninth biological replicate.

**Indexing and slicing behave differently.** `[0]` selects the first item; `[-1]` selects the last. A slice `[1:3]` returns items 1 and 2 because the right endpoint is excluded. `[:2]` returns up to two items, and `[-2:]` returns the last two, even when a list is short.

**Missing data must stay explicit.** Indexing an empty list raises IndexError. If no fields were recorded, do not pretend the first field exists: test `if field_ids` and return None where the task specifies it. Slicing an empty list safely returns another empty list.

**Scientific interpretation:** acquisition order, displayed file number and biological replicate are different concepts. A slice is a computational selection, not a documented quality-exclusion rule. Keep IDs alongside measurements so later audits can trace what was selected.

**Diagnostic habit:** deliberately trigger an IndexError with an out-of-range integer and read the traceback. The correct fix is an explicit size policy, not copying the prior record's ID.

### Predict, then run real Python

```python
field_ids = ['F09', 'F02', 'F11']
print(field_ids[0])
print(field_ids[-1])
print(field_ids[1:3])
```

**Prediction before Run:** What are the first ID, last ID and returned two-item slice?

**Reasoned answer (read after trying):** F09, F11 and ['F02', 'F11']. The list positions start at zero.

### Trace the program step by step

1. Track list positions 0, 1 and 2 without changing their text labels.
2. Explain why index -1 selects the last item.
3. Write the positions included by [1:3] before running.

These steps are not another exercise to memorize. They explain how each statement changes the state of the program. If you make a wrong prediction, identify the first statement that disagrees with your reasoning, not merely the final printed output.

### Investigate one changed assumption

1. Try a reordered list with the same IDs.
2. Compare [:2], [-2:] and [2:2].
3. Try indexing an empty list and inspect IndexError.

**Debugging exercise:** A researcher calls field_ids[1] the first acquired field. Diagnose the off-by-one mistake.

Do not hide genuine Python exceptions; use a traceback to identify the failing operation. If the program runs but the scientific interpretation is wrong, explain the dimensional, provenance or sampling assumption that failed.

### Apply: produce a result for changing inputs

From field_ids, assign first_id and last_id (None if empty), plus a new first_two list. Never crash for an empty list.

```python
# Inputs: field_ids
```

The app supplies the first input record and then runs **4 changed-input practice cases**. These cases include empty, short, reordered, missing or boundary inputs when relevant. Predictions should be based on the rule, not a copied first output.

**Assistance policy:** this activity permits progressive hints. The app records their use so that a guided success is not silently treated as an unassisted assessment.

### Prove: reconstruct the skill without copying

Given roi_ids, create last_two (final up to two IDs), interior (all except first and last) and empty (Boolean).

```python
# Inputs: roi_ids
```

The unfamiliar inputs are deliberate. The goal is to transfer the Python operation and the scientific reasoning, not to recall the precise variable names in Learn.

### Failure and scientific-meaning check

**Common misconception:** The digits in the filename are Python indexes and imply biological replication.

**Recovery:** A researcher calls field_ids[1] the first acquired field. Diagnose the off-by-one mistake.

**Scientific limitation:** IDs and ordering are synthetic; no real microscope-field provenance is inferred.

Before continuing, answer in your own words: which records are unvisited or missing? Does your program preserve the source? What would be scientifically wrong about interpreting the output as a count of biological replicates?

---

## 2. Copy and change lists safely (P03-G02)

**Scientific reason to learn it:** A quality-control output must not rewrite raw recorded field identifiers.

### Learn: the underlying idea

**Lists are mutable objects.** If you write `reviewed = recorded`, both names point to the same list. Calling reviewed.append or reviewed.remove then changes what recorded displays. A raw acquisition record must not be silently mutated by its downstream analysis.

**A copy creates a separate output list.** Write `reviewed = recorded.copy()` or `recorded[:]` for a shallow copy. With a list of simple ID strings, this is enough. `reviewed.append('F11')` then changes only reviewed.

**Equality and identity differ.** Two lists can contain equal items (`==`) without being the same object (`is`). The practice checks ensure that the derived output is a separate list, even on an empty source.

**Removal requires a clear policy.** `remove(value)` deletes the first matching item; it raises ValueError if absent. Use `if value in reviewed` before removing uncertain entries. Removing only the first occurrence is deliberately different from silently deleting every duplicate.

**Never edit a collection while iterating through it.** That can skip subsequent elements. Build a new output and preserve the source for audit. The later capstone will build separate lists of accepted, low, missing and invalid fields.

### Predict, then run real Python

```python
recorded = ['F09', 'F02']
reviewed = recorded.copy()
reviewed.append('F11')
print(recorded)
print(reviewed)
print(reviewed is recorded)
```

**Prediction before Run:** Does the recorded source gain F11? Are the lists the same object?

**Reasoned answer (read after trying):** Recorded stays ['F09','F02']; reviewed adds F11; the final identity comparison prints False.

### Trace the program step by step

1. Predict whether direct assignment makes a copy.
2. Run the two lists side by side after append.
3. Check the difference between equality of content and identity.

These steps are not another exercise to memorize. They explain how each statement changes the state of the program. If you make a wrong prediction, identify the first statement that disagrees with your reasoning, not merely the final printed output.

### Investigate one changed assumption

1. Replace .copy() with direct assignment; observe the source mutation, then restore it.
2. Try removing an absent ID and inspect ValueError.
3. Add the same ID twice; reason about duplicates.

**Debugging exercise:** An audit routine edits the input list to hide a rejected field. Explain why a derived copy is required.

Do not hide genuine Python exceptions; use a traceback to identify the failing operation. If the program runs but the scientific interpretation is wrong, explain the dimensional, provenance or sampling assumption that failed.

### Apply: produce a result for changing inputs

Create audit_ids as an independent copy of source_ids, append new_id and leave source_ids unchanged.

```python
# Inputs: source_ids, new_id
```

The app supplies the first input record and then runs **3 changed-input practice cases**. These cases include empty, short, reordered, missing or boundary inputs when relevant. Predictions should be based on the rule, not a copied first output.

**Assistance policy:** this activity permits progressive hints. The app records their use so that a guided success is not silently treated as an unassisted assessment.

### Prove: reconstruct the skill without copying

Given raw_candidates and excluded_id, make reviewed_candidates as a copy; remove only the first matching ID when present, and set removal_done accordingly. Preserve the source.

```python
# Inputs: raw_candidates, excluded_id
```

The unfamiliar inputs are deliberate. The goal is to transfer the Python operation and the scientific reasoning, not to recall the precise variable names in Learn.

### Failure and scientific-meaning check

**Common misconception:** Assigning a new variable always creates a separate list.

**Recovery:** An audit routine edits the input list to hide a rejected field. Explain why a derived copy is required.

**Scientific limitation:** Preserving synthetic raw IDs is a provenance principle, not evidence that acquisition was performed correctly.

Before continuing, answer in your own words: which records are unvisited or missing? Does your program preserve the source? What would be scientifically wrong about interpreting the output as a count of biological replicates?

---

## 3. Unpack immutable tuple records (P03-G03)

**Scientific reason to learn it:** A paired field ID and score should stay linked when passed between steps.

### Learn: the underlying idea

**A tuple is an ordered, fixed-size record.** For example, `('F09', 0.83)` holds a field ID and a synthetic focus score. A tuple cannot have a top-level item replaced using indexing. Immutability discourages accidental edits, although it cannot verify scientific authenticity.

**Unpacking assigns meaningful names.** `field_id, score = record` gives two separate names to the tuple's two values. Unpacking also works for a two-element list; browser JSON transmits arrays as lists, so the exercise explicitly creates a real tuple for the immutable result.

**Record shape matters.** Unpacking a one-element or three-element record into two names raises ValueError. The correct response is to detect malformed input shape rather than pair an ID with a score from an earlier field.

**Immutable is not validated.** A tuple cannot prove that its two entries belong to the same experimental observation. A tuple can also contain mutable nested elements, though this chapter uses only text and numeric values.

**Keep units and types clear.** An ID is text, a quality score is a measurement-like numeric example, and None denotes missing. Their positions and meanings must never be silently exchanged.

### Predict, then run real Python

```python
record = ('F09', 0.83)
field_id, score = record
print(field_id)
print(score)
print(type(record).__name__)
```

**Prediction before Run:** Which values and type name appear?

**Reasoned answer (read after trying):** F09, 0.83 and tuple.

### Trace the program step by step

1. Read the two elements in order.
2. Unpack into field_id and score.
3. Confirm that the type is tuple rather than list.

These steps are not another exercise to memorize. They explain how each statement changes the state of the program. If you make a wrong prediction, identify the first statement that disagrees with your reasoning, not merely the final printed output.

### Investigate one changed assumption

1. Try reassigning record[0] and inspect TypeError.
2. Try unpacking a one-element tuple into two names and inspect ValueError.
3. Swap the names in the unpacking statement and notice the scientific interpretation error.

**Debugging exercise:** An ID and focus score are unpacked in reverse order and the script compares a string to a numeric cutoff. Diagnose the swapped fields.

Do not hide genuine Python exceptions; use a traceback to identify the failing operation. If the program runs but the scientific interpretation is wrong, explain the dimensional, provenance or sampling assumption that failed.

### Apply: produce a result for changing inputs

Unpack observed_pair into field_id and score, create frozen_pair as a tuple and report pair_type.

```python
# Inputs: observed_pair
```

The app supplies the first input record and then runs **3 changed-input practice cases**. These cases include empty, short, reordered, missing or boundary inputs when relevant. Predictions should be based on the rule, not a copied first output.

**Assistance policy:** this activity permits progressive hints. The app records their use so that a guided success is not silently treated as an unassisted assessment.

### Prove: reconstruct the skill without copying

From endpoints (two pixel coordinates), unpack begin_px and end_px, construct immutable_interval as a tuple, and compute span_px=end_px-begin_px.

```python
# Inputs: endpoints
```

The unfamiliar inputs are deliberate. The goal is to transfer the Python operation and the scientific reasoning, not to recall the precise variable names in Learn.

### Failure and scientific-meaning check

**Common misconception:** A tuple automatically certifies that its contents represent a genuine recorded field.

**Recovery:** An ID and focus score are unpacked in reverse order and the script compares a string to a numeric cutoff. Diagnose the swapped fields.

**Scientific limitation:** All values are synthetic; a container type cannot establish field identity or calibration.

Before continuing, answer in your own words: which records are unvisited or missing? Does your program preserve the source? What would be scientifically wrong about interpreting the output as a count of biological replicates?

---

## 4. Iterate and summarize microscope-field lists (P03-G04)

**Scientific reason to learn it:** Every acquired field must be accounted for, including missing measurements.

### Learn: the underlying idea

**A for loop visits every item in order.** `for score in scores:` executes its indented block once per entry. Indentation is part of Python syntax; code incorrectly positioned outside the loop may count only one field or produce an error.

**Initialize counters before a loop.** Set accepted_count, rejected_count and missing_count to zero. Increment the relevant counter within its branch. Starting a counter inside the loop resets it on every iteration and destroys the total.

**None means missing, not zero.** A measurement-like score of 0.0 is an observed numeric value. None represents no usable measurement; comparing None with a float raises TypeError. Check `if score is None` before numerical comparisons.

**Count exclusions explicitly.** Under this goal's restricted input contract (values between 0 and 1 or None), accepted + rejected + missing must equal len(scores). You should be able to explain the count after each loop iteration, not merely after running the whole program.

**Do not confuse fields with replicates.** Acquired imaging fields may come from the same specimen, animal or well. A count of accepted fields is not a sample size for inferential statistics, and missing scores should not be replaced by invented measurements.

**A changed-input test is a scientific control.** Try all missing, no records, a score equal to threshold and a score of zero with minimum zero. A fixed output that happens to work for [0.9,None,0.2] is not a reusable analysis.

### Predict, then run real Python

```python
scores = [0.9, None, 0.2]
minimum = 0.8
accepted = 0
rejected = 0
missing = 0
for score in scores:
    if score is None:
        missing += 1
    elif score >= minimum:
        accepted += 1
    else:
        rejected += 1
print(accepted, rejected, missing)
```

**Prediction before Run:** What three counts appear? Why not count None as zero?

**Reasoned answer (read after trying):** 1 accepted, 1 rejected, 1 missing. None means unknown, while 0 is a numeric score.

### Trace the program step by step

1. Initialize all counters before entering the loop.
2. Trace each reading in order and record the updated counters.
3. Verify the three totals sum to the length of the input.

These steps are not another exercise to memorize. They explain how each statement changes the state of the program. If you make a wrong prediction, identify the first statement that disagrees with your reasoning, not merely the final printed output.

### Investigate one changed assumption

1. Try every score as None.
2. Set minimum=0 with an observed score of zero.
3. Move counter initialization inside the loop and diagnose the wrong total; restore it.

**Debugging exercise:** A script removes None and reports the shorter list length as the number of acquired fields. Explain which data disappeared.

Do not hide genuine Python exceptions; use a traceback to identify the failing operation. If the program runs but the scientific interpretation is wrong, explain the dimensional, provenance or sampling assumption that failed.

### Apply: produce a result for changing inputs

Given scores (0..1 or None) and minimum, compute accepted_count, rejected_count and missing_count using a for loop.

```python
# Inputs: scores, minimum
```

The app supplies the first input record and then runs **5 changed-input practice cases**. These cases include empty, short, reordered, missing or boundary inputs when relevant. Predictions should be based on the rule, not a copied first output.

**Assistance policy:** this activity permits progressive hints. The app records their use so that a guided success is not silently treated as an unassisted assessment.

### Prove: reconstruct the skill without copying

With measurements and limit, create kept_values (all values >= limit in original order), low_count and unknown_count for None.

```python
# Inputs: measurements, limit
```

The unfamiliar inputs are deliberate. The goal is to transfer the Python operation and the scientific reasoning, not to recall the precise variable names in Learn.

### Failure and scientific-meaning check

**Common misconception:** None and zero are equivalent and can be silently dropped from a QC report.

**Recovery:** A script removes None and reports the shorter list length as the number of acquired fields. Explain which data disappeared.

**Scientific limitation:** Focus-like values are fabricated, and imaging field counts are not biological replicate counts.

Before continuing, answer in your own words: which records are unvisited or missing? Does your program preserve the source? What would be scientifically wrong about interpreting the output as a count of biological replicates?

---

## 5. Number fields with range and enumerate (P03-G05)

**Scientific reason to learn it:** Displayed sequence numbers must not be confused with field IDs or Python indexes.

### Learn: the underlying idea

**range produces numeric positions.** `list(range(3))` returns [0,1,2]. For a list of N entries, `range(len(items))` gives legal nonnegative indexes but does not provide each item automatically.

**enumerate gives an index and a value together.** `for number, field_id in enumerate(field_ids, start=1):` uses human-friendly ordinal numbers starting at one. The ID text stays unchanged even when its ordinal changes.

**Index, ordinal and identity are distinct.** The first item in ['F09','F02'] is at Python index 0, displays as Field 1, but has the source ID F09. Sorting or renumbering identifiers would change the meaning of the acquisition audit.

**Use enumerate only when position is needed.** If all you need is the score, `for score in scores` is simpler. If you need to report which acquisition position was missing, enumerate keeps the location and value paired.

**A missing reading should not shift later ordinals.** If frame 2 has None, preserve that position as missing instead of dropping it and relabeling frame 3 as frame 2. That is important for tracing back to source images.

### Predict, then run real Python

```python
field_ids = ['F09','F02','F11']
for number, field_id in enumerate(field_ids, start=1):
    print(f'Field {number}: {field_id}')
print(list(range(len(field_ids))))
```

**Prediction before Run:** Which displayed number accompanies F09? What range list appears?

**Reasoned answer (read after trying):** Field 1: F09 is first; range yields [0,1,2].

### Trace the program step by step

1. Compare the zero-based Python indexes and one-based display labels.
2. Follow enumerate through all three field IDs.
3. Check an empty list without producing invented numbers.

These steps are not another exercise to memorize. They explain how each statement changes the state of the program. If you make a wrong prediction, identify the first statement that disagrees with your reasoning, not merely the final printed output.

### Investigate one changed assumption

1. Use default enumerate starting at zero.
2. Reorder IDs without changing their text.
3. Compare `range(len(...))` with `enumerate(..., start=1)`.

**Debugging exercise:** An analyst calls the ninth acquired field the first observation because it is named F09. Correct the confusion.

Do not hide genuine Python exceptions; use a traceback to identify the failing operation. If the program runs but the scientific interpretation is wrong, explain the dimensional, provenance or sampling assumption that failed.

### Apply: produce a result for changing inputs

Given field_ids, create numbered_labels like 'Field 1: F09' using enumerate(start=1) and zero_indexes containing the corresponding Python indexes.

```python
# Inputs: field_ids
```

The app supplies the first input record and then runs **4 changed-input practice cases**. These cases include empty, short, reordered, missing or boundary inputs when relevant. Predictions should be based on the rule, not a copied first output.

**Assistance policy:** this activity permits progressive hints. The app records their use so that a guided success is not silently treated as an unassisted assessment.

### Prove: reconstruct the skill without copying

Given frame_scores (0..1 or None) and threshold, build missing_ordinals for None and passing_ordinals for numeric scores >= threshold, both using one-based positions.

```python
# Inputs: frame_scores, threshold
```

The unfamiliar inputs are deliberate. The goal is to transfer the Python operation and the scientific reasoning, not to recall the precise variable names in Learn.

### Failure and scientific-meaning check

**Common misconception:** The field name's numerical suffix always matches its array position.

**Recovery:** An analyst calls the ninth acquired field the first observation because it is named F09. Correct the confusion.

**Scientific limitation:** Acquisition display ordinals do not encode biological replication or calibrated coordinates.

Before continuing, answer in your own words: which records are unvisited or missing? Does your program preserve the source? What would be scientifically wrong about interpreting the output as a count of biological replicates?

---

## 6. Bound a while loop to finite input (P03-G06)

**Scientific reason to learn it:** An automated scan must stop at the data boundary and its declared inspection limit.

### Learn: the underlying idea

**while repeats while a Boolean expression stays true.** Unlike for, a while loop does not automatically advance through a collection. You need to initialize an index and increment it on every iteration.

**Use two bounds.** `i < len(record_ids) and i < max_checks` stops when either the source list ends or the inspection budget is reached. Do not index into a list before checking that the current position exists.

**Do not create infinite loops.** Forgetting i += 1 can repeat the same observation forever. The app's worker timeout is only a protective limit, not a substitute for a logically bounded program. Do not run a known-infinite loop merely to see the timeout.

**Scan count and biological sample count differ.** max_checks limits the number of input rows visited. A short scan cannot prove that unvisited acquisition fields passed QC, nor can it establish the number of biological replicates.

**Boundary controls:** an empty list or max_checks=0 should visit nothing. A budget larger than the list should stop at its end. Negative budgets are excluded by this training task's input contract and would need separate validation in production.

### Predict, then run real Python

```python
record_ids = ['F09','F02','F11']
max_checks = 2
i = 0
visited = []
while i < len(record_ids) and i < max_checks:
    visited.append(record_ids[i])
    i += 1
print(visited)
print(i)
```

**Prediction before Run:** How many IDs are visited? Why does F11 remain unvisited?

**Reasoned answer (read after trying):** Two IDs, ['F09','F02']; the declared budget ends the loop at i=2.

### Trace the program step by step

1. Initialize i and visited before entering the loop.
2. Check both the source-length and budget condition before indexing.
3. Increment i on every iteration, then explain which condition ended the loop.

These steps are not another exercise to memorize. They explain how each statement changes the state of the program. If you make a wrong prediction, identify the first statement that disagrees with your reasoning, not merely the final printed output.

### Investigate one changed assumption

1. Set max_checks to zero.
2. Increase the budget above the source length.
3. Remove the index increment on paper and explain the infinite-loop risk; restore it before execution.

**Debugging exercise:** A program checks only max_checks and indexes beyond the source length. Repair the missing boundary.

Do not hide genuine Python exceptions; use a traceback to identify the failing operation. If the program runs but the scientific interpretation is wrong, explain the dimensional, provenance or sampling assumption that failed.

### Apply: produce a result for changing inputs

Given record_ids and nonnegative max_checks, create visited in source order with a bounded while loop and next_index equal to the number visited.

```python
# Inputs: record_ids, max_checks
```

The app supplies the first input record and then runs **5 changed-input practice cases**. These cases include empty, short, reordered, missing or boundary inputs when relevant. Predictions should be based on the rule, not a copied first output.

**Assistance policy:** this activity permits progressive hints. The app records their use so that a guided success is not silently treated as an unassisted assessment.

### Prove: reconstruct the skill without copying

Given measurements and max_steps, use a bounded while loop to build inspected (including None values) and attempted count. Do not skip missing records.

```python
# Inputs: measurements, max_steps
```

The unfamiliar inputs are deliberate. The goal is to transfer the Python operation and the scientific reasoning, not to recall the precise variable names in Learn.

### Failure and scientific-meaning check

**Common misconception:** A while loop automatically detects the end of a list or increments its index.

**Recovery:** A program checks only max_checks and indexes beyond the source length. Repair the missing boundary.

**Scientific limitation:** Partial inspection cannot justify conclusions about unvisited fields.

Before continuing, answer in your own words: which records are unvisited or missing? Does your program preserve the source? What would be scientifically wrong about interpreting the output as a count of biological replicates?

---

## 7. Skip and stop with explicit audit reasons (P03-G07)

**Scientific reason to learn it:** A skipped missing score and a session-stop marker must not vanish into an apparently clean field count.

### Learn: the underlying idea

**continue skips only the current iteration.** Use it when you have already classified an observation, such as recording its ID as missing. The loop then moves to the next record. If you continue without recording the missing field, the report silently loses a known acquisition.

**break ends the entire loop.** An explicit STOP sentinel means later rows are outside the visited session. Break before classifying the sentinel; do not call later rows accepted or rejected. A sentinel is not a missing numerical value.

**None and zero remain distinct.** `None` indicates missing data, whereas 0.0 can be a valid observed focus score on this illustrative 0..1 scale. Classify None before numerical comparison to avoid TypeError.

**Scores outside a declared range are invalid, not merely low.** A score 1.4 should not be accepted as excellent focus when the declared scale ends at 1.0. Preserve an invalid category and explain the predeclared range policy.

**For labeled records**, unpack `[field_id, score]` pairs so a missing value remains attached to the correct field. Keep separate accepted/low/missing/invalid ID lists. Changing where STOP occurs should change the number of inspected records.

**Scientific caution:** selective stopping after observing favorable outcomes can bias a dataset. This chapter's sentinel is a synthetic session boundary, not a justification for post-hoc exclusion.

### Predict, then run real Python

```python
readings = [0.9, None, 0.2, 'STOP', 1.0]
accepted = []
missing_count = 0
for score in readings:
    if score == 'STOP':
        break
    if score is None:
        missing_count += 1
        continue
    if score >= 0.8:
        accepted.append(score)
print(accepted, missing_count)
```

**Prediction before Run:** Does the final 1.0 count as accepted?

**Reasoned answer (read after trying):** No. STOP halts before the final value; the result is [0.9] and one missing score.

### Trace the program step by step

1. Distinguish None from an explicit STOP marker.
2. Count a missing reading before continue.
3. Break on STOP and explain why later data were not examined.

These steps are not another exercise to memorize. They explain how each statement changes the state of the program. If you make a wrong prediction, identify the first statement that disagrees with your reasoning, not merely the final printed output.

### Investigate one changed assumption

1. Move STOP to the beginning.
2. Replace None by zero and classify the numeric observation.
3. Remove the missing counter increment on paper and explain the hidden exclusion.

**Debugging exercise:** A loop continues on None without recording the field as missing, then reports a smaller acquisition size. Diagnose the lost data.

Do not hide genuine Python exceptions; use a traceback to identify the failing operation. If the program runs but the scientific interpretation is wrong, explain the dimensional, provenance or sampling assumption that failed.

### Apply: produce a result for changing inputs

Given readings containing scores, None and optional 'STOP', create accepted_values, low_values, missing_count, invalid_count and stopped. Stop on sentinel, count None, treat out-of-range scores as invalid.

```python
# Inputs: readings, minimum
```

The app supplies the first input record and then runs **5 changed-input practice cases**. These cases include empty, short, reordered, missing or boundary inputs when relevant. Predictions should be based on the rule, not a copied first output.

**Assistance policy:** this activity permits progressive hints. The app records their use so that a guided success is not silently treated as an unassisted assessment.

### Prove: reconstruct the skill without copying

Given field_records pairs [id,score] and limit, create passed_ids, low_ids, missing_ids, invalid_ids and stopped; stop at ID 'END', classify None as missing and outside-0..1 values as invalid.

```python
# Inputs: field_records, limit
```

The unfamiliar inputs are deliberate. The goal is to transfer the Python operation and the scientific reasoning, not to recall the precise variable names in Learn.

### Failure and scientific-meaning check

**Common misconception:** continue stops the entire loop and break skips just the current item.

**Recovery:** A loop continues on None without recording the field as missing, then reports a smaller acquisition size. Diagnose the lost data.

**Scientific limitation:** Stopped or skipped records must not be interpreted as biological outcomes.

Before continuing, answer in your own words: which records are unvisited or missing? Does your program preserve the source? What would be scientifically wrong about interpreting the output as a count of biological replicates?

---
## 8. Full P03 research deliverable (P03-CAPSTONE)

**Deliverable:** `field_qc_report.py` — a source-preserving field-QC script with exact output categories and a traceable stopping rule.

**Research problem:** Filter an acquired series of microscope-field records without hiding duplicates, missing scores, invalid numbers or a truncated session.

**Research problem:** A set of microscope fields has an acquisition ID and a focus-like score. Some records have no score; others fail a predeclared criterion, use an invalid value or repeat an existing ID. A useful report must retain which records were accepted, rejected, missing or invalid, and must not claim that unvisited fields were analyzed.

**Input contract:** records is an ordered list of two-element `[field_id, score]` records. IDs are strings. Scores are numeric (occasionally outside the illustrative interval 0–1) or `None` when missing. A record with field ID `STOP` terminates the scan without being classified. `max_rows` is the maximum number of rows visited, a nonnegative integer. `minimum_focus` is a declared numeric threshold in 0–1.

**Output contract:** assign `accepted_ids`, `rejected_ids`, `missing_ids` and `invalid_ids` as new lists. A numeric score within 0–1 and at or above minimum_focus is accepted; a within-range score below minimum is rejected; None is missing; a score outside 0–1 is invalid. A duplicate field ID is invalid on its second or later occurrence, regardless of its score, because counting it again could inflate the apparent number of inspected fields.

**Required priority:** inspect at most `records[:max_rows]`; stop on ID STOP before classifying it. For all other IDs, check whether the ID appeared earlier; if so append to invalid_ids and continue. Otherwise add it to a separate seen_ids list, then check for None, out-of-range values and the threshold, in that order. Never mutate records or rearrange the acquisition order.

**Use the exact report:** set `stopped_early` to True if STOP was encountered, otherwise False. Construct `summary` as `accepted=A; rejected=R; missing=M; invalid=I`, where letters are replaced by category lengths; print summary. When scanning is cut short by STOP or max_rows, the summary represents only visited non-STOP records.

**Why this matters scientifically:** None is not an observed zero; zero is an observed numeric value. A score of 1.2 is invalid under this toy scale, not exceptionally good. Treating two images of the same field as independent samples can mislead an analysis; actual biological replication requires independent experimental units. Predefine exclusion rules rather than selecting a threshold after looking at treatment differences.

**No invented raw-image measurements:** P03 does not read calibrated TIFF pixels or infer actual focus quality from the pictured example. The score, range and specimen IDs are synthetic, and successful code execution does not establish the biological significance of any record.

**Independent transfer:** Prove reverses input pair order to `[score, field_tag]`, changes names and uses END rather than STOP. You must rebuild the reasoning instead of reusing the Apply expression blindly. The altered record format deliberately tests whether you still keep each quality value attached to the correct field.

**Technical deliverable:** export `field_qc_report.py` with its supplied example inputs and original code, and explain which rows were unvisited. Both public test cases and a short saved reflection are evidence for review, not a hidden independent-mastery certificate.

### Simplified example: what is missing?

Before looking at a complete classifier, predict the outputs of this deliberately incomplete script.

```python
records = [['F09', 0.9], ['F02', None], ['F11', 0.2]]
minimum_focus = 0.8
accepted_ids = []
missing_ids = []
for field_id, score in records:
    if score is None:
        missing_ids.append(field_id)
    elif score >= minimum_focus:
        accepted_ids.append(field_id)
print(accepted_ids)
print(missing_ids)
```

**Question:** Which record is accepted and which is missing? What necessary category does this deliberately incomplete example omit?

**After predicting:** F09 is accepted and F02 is missing. The worked fragment neglects low-scoring F11; the full audit must list rejected IDs as well.

### Plan the full decision order

1. Write down the input pair order and label each field as ID, number, or missing.
2. Initialize accepted, rejected, missing, invalid and seen ID lists before iterating.
3. Scan a bounded input prefix and stop at STOP before counting it.
4. Classify duplicate IDs before checking numerical scores; for other IDs, record missingness and invalid range before threshold decisions.
5. Build the exact summary from output lists; verify it on empty, duplicate and cutoff-boundary inputs.

A robust audit treats the marker STOP as a source-session boundary, not as missing data. The second appearance of a field ID is invalid under the declared sample-identity rule. The first occurrence is classified according to its score. Preserve source order and do not deduplicate by silently modifying the source.

### Apply: implement the complete classifier

Given records ([field_id,score] pairs), minimum_focus and max_rows, construct accepted_ids, rejected_ids, missing_ids, invalid_ids, stopped_early and summary. Scan up to max_rows, STOP ends the scan, duplicate field IDs are invalid, None is missing, out-of-range scores are invalid, 0..1 scores at/above threshold accepted. Print summary exactly `accepted=A; rejected=R; missing=M; invalid=I`; do not mutate records.

```python
# Inputs: records, minimum_focus (0..1), max_rows (>=0)
# Create accepted_ids, rejected_ids, missing_ids, invalid_ids, stopped_early, summary.
# Preserve source records and print(summary).
```

The full author-validated fixture set contains **12 Apply cases** covering the first example, equality at the cutoff, a valid numerical zero, None, out-of-range scores, duplicate IDs, early stop, empty records, explicit budget zero, shortened prefix and nonmonotonic field names. You should understand why each is classified as it is.

**Common silent failure:** after dropping None values from a list of acquired fields, the denominator of a later average or frequency can change without a traceback. This is not valid missing-data treatment. Another failure is to count repeated field images as separate experimental replicates. The coding exercise makes those problems inspectable but does not solve biological experimental-design questions.

### Prove: reverse the record structure

Given observations as [score,field_tag] pairs, cutoff and max_rows, scan a bounded prefix and stop on field_tag 'END'. Repeated tags or out-of-range scores are bad; None scores absent; numeric scores below cutoff low, otherwise kept. Create kept_tags, low_tags, absent_tags, bad_tags, stopped and report_line exactly `kept=K | low=L | absent=A | bad=B`, print it, preserve observations. Do not reverse field identity and score.

```python
# Inputs: observations ([score,field_tag] pairs), cutoff, max_rows
# Create kept_tags, low_tags, absent_tags, bad_tags, stopped and report_line.
# Print report_line.
```

This exercise changes data representation, not just the values. A pair now contains [score,field_tag] rather than [field_id,score], and the stop marker is END. The **11 transfer cases** test whether you attach the right score to the right ID, preserve missingness and respect the scan bounds.

### Five scientific reflections required before treating the capstone as reviewed

1. How does your code distinguish an observed zero from a missing value?
2. Why does a duplicated field ID belong in the invalid list instead of increasing the accepted count?
3. What can you conclude about unvisited fields after STOP or a max_rows limit?
4. Why are these focus scores and thresholds illustrative rather than established biological QC criteria?
5. Which specific source-record and count checks would you perform before trusting the report?

Your explanation is saved locally for your review; it is **not automatically graded** by a shallow word-count rule or an artificial guarantee that your scientific interpretation is correct.

### Audit the results independently

Review these examples of misleading but superficially plausible programs:

1. A filter uses `if score` to decide whether a reading exists; it classifies zero as missing, even though zero may be a measured value.
2. A script uses `continue` immediately on None without adding the corresponding field ID to missing_ids; the missingness audit becomes incomplete.
3. A pair of images with the same field ID is counted twice because the script assumes the source list has unique IDs.
4. An early STOP marker or max_rows limit truncates the scan, but a summary says every acquisition passed QC.
5. A score of 1.4 on a training-only range 0–1 is considered unusually high quality rather than invalid data.
6. The script mutates records directly while filtering, destroying the original list that would have allowed independent review.
7. The code returns a count of accepted fields and someone presents it as the number of independent biological replicates.

A correct program under the exercise contract must avoid each of these errors. In real research, recording the experimental unit of analysis and actual acquisition parameters is as important as the Python program.

## 9. Later-session independent retrieval (P03-REVIEW)

**Purpose:** Remember a procedure independently rather than recognising its source code. After at least 24 hours, or sooner as practice, attempt a new filter without opening the previous chapter answer.

**New convention:** field_data contains [tag,score] pairs; the stop marker is DONE, and max_visits limits the scanned prefix. Preserve field IDs and distinguish duplicate, missing, out-of-range and below-threshold records under an inclusive minimum.

**Limits of evidence:** A browser-visible test can confirm correct execution for changed records and record the interval since the earlier capstone, but it cannot certify retained understanding or biological validity. Explain what remains unknown about unvisited fields.

**Independent exercise:** Given field_data as [tag,score] pairs, minimum and max_visits, inspect at most max_visits, stop on DONE. Classify unique IDs into passed, below, unmeasured or corrupt (duplicates/out-of-range scores). Set ended only for DONE, print line exactly `passed=P; below=B; unmeasured=U; corrupt=C`. Preserve source order and inputs.

```python
# Inputs: field_data, minimum, max_visits
# Create passed, below, unmeasured, corrupt, ended and line. Print line.
```

The return task deliberately has no reference solution in the learner package. Its new DONE convention and changed variable names test reconstruction rather than rote repetition. A successful return after at least 24 hours can be labelled *delayed practice*; it does not automatically establish independent or retained mastery.

## 10. Scope boundaries and transition to P04

P03 deliberately uses only Python built-ins: lists, tuple records, slices, conditionals and loops. It does not require NumPy arrays, raw TIFF/OME metadata, automated segmentation, calibrated focus metrics or scientific hypothesis tests. The actual biological meanings of acquired fields, specimens, wells and replicates must be supplied by real experiment metadata.

In P04, these same identifiers will be associated with richer metadata structures and more reusable processing routines. Keep your source-preserving field-QC script, its changed-input checks, and a short note of the unresolved scientific assumptions.

## Attribution, provenance and reproducibility

- Guillaume Witz: [Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner), especially Witz 08 and exercise e08. This original course chapter uses the progression of concepts but does not reproduce source prose.
- [Python official tutorial](https://docs.python.org/3/tutorial/), including list operations, range, enumerate, for/while loops, break, continue and tuple unpacking.
- [Python for Biologists](https://pythonforbiologists.com/) for additional biological-programming perspective.
- [Human Protein Atlas Cell Atlas](https://www.proteinatlas.org/humanproteome/cell), as an authentic visual context through credited bundled Witz images. See `assets/witz/CREDITS.md` for existing image provenance. No raw pixel data is analyzed here.

All field IDs, records, scores, exclusions and threshold values are illustrative. A focus score and a field count in this training exercise must not be presented as a microscope-quality standard, a real experiment or biological-replicate inference.

## Acceptance conditions and evaluation limitations

- Frozen P03 competencies **012–018** appear exactly once in seven mini-goals; the capstone and review introduce no additional competency ID.
- Each goal contains original explanations, an executable worked example, a prediction, failure investigation, Apply checks on changed inputs and an independent Prove task.
- Author reference code and fixtures live outside the deployed learner package and are executed with ordinary CPython in automated tests.
- The application must preserve P01 and P02 drafts and progress, run real Pyodide, report actual stdout/errors, and pass browser checks at phone and desktop sizes.
- The capstone must export a runnable `field_qc_report.py` program and save a scientific reflection, while a later activity records practice after time away.
- All numerical data are synthetic; no calibrated microscopy measurement or 9.5+/10 validated learning effectiveness is claimed before a genuine user trial.
