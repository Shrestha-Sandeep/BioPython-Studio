# A07 — Independent unknown-data microscopy research capstone

**Status:** Research rubric + structural evidence validator implemented. **The actual independent research task is not passed or auto-graded by software.**

## Your task — biological question before algorithm

Take an unfamiliar, permissibly accessed microscopy dataset with authentic image source files, independent reference annotations and meaningful experimental grouping. Define a target object and primary endpoint **before** seeing the results.

A good first project is original nuclei annotation on a previously unseen public collection. A `C. elegans` exopher/aggregate problem is a later option only once real annotation rules and reviewer-independent ground truth exist. Do **not** equate bright puncta, polyQ aggregates and exophers without biological criteria.

### Seven mandatory checkpoints

1. **Question** — define intended object, inclusion/exclusion rules, biological unit, controls, confounders, primary endpoint and acceptance threshold.
2. **Source audit** — record exact original image hashes, native axes/dtypes, acquisition metadata and pixel calibration status.
3. **Baseline and annotation** — use a simple source-safe algorithm and appropriate expert annotations; quantify annotation disagreements or ambiguities.
4. **Independent holdout** — freeze parameters and separate animals/acquisition groups, not merely random adjacent images.
5. **Quantification and errors** — report object matching, pixel overlap, count errors, negative-control/sensitivity results and an annotated error gallery.
6. **Reproduction** — rerun from a fresh local checkout using exact source/config versions, unchanged data and output checksums.
7. **Methods memo and verdict** — write a 1–2-page report with biological units, figures, uncertainty, scientific caveats and GO / NEED MORE ANNOTATION / DIFFERENT METHOD / NO-GO.

## Evidence packet for structural checking

Create a directory containing exactly these named evidence types:

```text
evidence/
  project_plan.json
  source_audit.json
  split_manifest.csv
  evaluation.json
  reproduction.json
  failure_cases.csv
  methods_and_limitations.md
```

Validation contracts:

- `project_plan.json` must declare `biological_question`, `target_definition`, `inclusion_rules`, `exclusion_rules`, `primary_endpoint`, `biological_unit`, `prespecified_acceptance`, `known_confounders`, and `reviewed_holdout_before_freeze: false`.
- `source_audit.json`: `{"images":[{"image_id":"...","source_sha256":"...","axes":"YX","native_dtype":"uint16","scale_independently_verified":false}]}`. Include all source images with exact SHA values.
- `split_manifest.csv`: `image_id,biological_group_id,split,source_sha256`; split is `development` or `holdout`, with no biological group in both.
- `evaluation.json`: `{"holdout_images":[{"image_id":"...","tp":3,"fp":2,"fn":1,"object_f1":0.6666666666666666,"annotation_source":"...","annotation_rule":"..."}]}`. Every held-out image must be represented and use correctly computed F1.
- `reproduction.json`: actual `source_commit`, `local_environment`, `run_command`, `result_manifest_sha256`, and recorded booleans `fresh_checkout_executed`, `source_hashes_checked`.
- `failure_cases.csv`: `image_id,error_type,note`. Error type is one of merge/split/miss/spurious/annotation_ambiguous/saturation/background/other/none_observed; note explains QC judgment. Do not invent a failure if none was observed.
- `methods_and_limitations.md`: detailed methods and scientific interpretation, including *limitation*, *annotation*, *biological*, *uncertainty*, *decision* and descriptions of genuine dataset assumptions.

Run:

```sh
python -m projects.advanced.a07.evidence_check --evidence /path/to/evidence
```

This tool verifies structural and numerical consistency only. **Even when every check passes, it deliberately returns `scientifically_validated:false`, `independent_learner_mastery_certified:false` and `human_review_required:true`.** Self-reported data-split integrity, actual human independence and biological validity must be assessed by a scientist.

### Acceptance

The learner must first complete the synthetic browser primer independently, then create the external real evidence packet with actual images/annotation provenance and a fresh checkout. A scientifically justified failed segmentation can be acceptable; inventing a perfect score cannot.
