# A05 — Biological statistics without pseudoreplication

**Independent deliverable:** animal-/pair-level CSV, source checksum, prespecified analysis plan, effect estimate with cluster-aware bootstrap interval, an animal-level figure and limitations memo.

Original browser cases use synthetic records. Use the actual [A05 local analysis CLI](../../projects/advanced/a05/analysis.py) for real work; inspect exclusion reasons and input units.

## Learning sequence

### 1. Join measurements to trustworthy sample metadata

Invalid joins can quietly assign cells to the wrong animal or experimental condition.

**Coding task:** From data.measurements and data.metadata, match field_id values; report result={'matched':int,'missing':sorted IDs,'duplicate_metadata':sorted IDs}.

**Scientific boundary:** A complete join is necessary, but does not prove biological independence.

### 2. Expose pseudoreplication and unequal field weighting

An animal with ten images must not automatically outweigh an animal with one image.

**Coding task:** Aggregate data.rows containing animal_id and signal. Return result={'animal_n':int,'field_n':int,'animal_mean':float,'field_pooled_mean':float}.

**Scientific boundary:** Pooled field averages and averages of animal means can differ substantially.

### 3. Audit exclusions without deleting provenance

Dropping bad images without recording exclusions can produce selection bias.

**Coding task:** Using data.rows with animal_id,signal and exclude_reason, compute result={'animal_means':dict,'excluded_fields':int,'included_fields':int}.

**Scientific boundary:** Aggregate only retained fields, while preserving each animal as the independent unit.

### 4. Respect matched experimental design

Ignoring before/after pairing discards important information about biological variation.

**Coding task:** Given data.pairs with control and treatment values, return result={'paired_mean_difference':float,'pairs':int,'differences':list}.

**Scientific boundary:** Bootstrap or infer over independent pairs, not all observed cells.

### 5. Bootstrap independent biological units

Sampling individual fields would understate uncertainty when fields share the same animal.

**Coding task:** Use data.control and data.treatment animal means with data.seed and data.draws to compute result={'effect':float,'ci_low':float,'ci_high':float} from independent-group bootstrap resampling.

**Scientific boundary:** A bootstrap interval with few animals is unstable and does not imply causality.

### 6. Report units and excluded observations in figures

Figures should display independent units and honest labels, not imply every cell is one replicate.

**Coding task:** Prepare figure-ready animal-level values from data.units; result={'points':sorted list of [condition,animal_id,mean_signal], 'n_animals':int,'ylabel':data.ylabel}.

**Scientific boundary:** The local CLI produces a PNG showing independent animal points and means.

### 7. Design-correct endpoint and biological N

A result can be computationally reproducible yet invalid if field/cell measurements are used as biological replicates.

**Coding task:** Given data.rows with condition,animal_id,signal and exclude_reason, compute per-animal means; return result={'control_n':int,'treatment_n':int,'effect':float,'pseudoreplication_avoided':True}.

**Scientific boundary:** A correct browser result cannot certify uncertainty or real experiments.

### 8. Delayed biological replication audit

Returning unaided reveals whether the distinction between animal and field has been retained.

**Coding task:** Given data.rows with animal,field,signal, compute result={'biological_n':int,'technical_n':int,'animal_mean_overall':float} without prior code.

**Scientific boundary:** No significance test is justified by one example table alone.

## Gate

Use at least three genuinely independent animals or experimental pairs per group before attempting the provided bootstrap pipeline; do not report a causal or research-ready conclusion from this teaching program. Compare pooled fields against animal means, preserve excluded data reasons, record package versions, then repeat the analysis from a clean checkout.
