# A07 — Independent unfamiliar-data scientific capstone: research-first narrated tutorial blueprint

Date: 2026-11-14; parent `feature/advanced-tutorial-cycle-a06` (A06 draft PR #62, 43643367414 cumulative CPython + Chromium green).
Branch `feature/advanced-tutorial-cycle-a07`. Canonical `content/chapters/A07_COMPLETE.md`, existing A07-G01–G07, CAPSTONE, independent delayed REVIEW.
Local evidence gate: `projects/advanced/a07/README.md` and `evidence_check.py`.

## First principles and the legitimate destination

*Can someone else actually reproduce your analysis on an unfamiliar original image dataset, agree what constitutes the biological target, and interpret the failures?* A07 is not about getting a pretty segmentation or even high object F1 on invented labels. It is about **deciding when insufficient evidence means NO-GO, obtain more annotations, or improve the method**. The user should see the *final capability* from the start: an evidence packet that survives source audit, object reference, independent grouped holdout, uncertainty, clean replay and limitations review.

### Scientific research and improvements over familiar tutorials

1. **2026 Reproducibility of a bioimage analysis workflow** https://onlinelibrary.wiley.com/doi/full/10.1111/jmi.70125 — publication of some data/code did not guarantee complete replication because workflow configurations and original components were insufficient. **Teaching adaptation**: every output must point to original bytes, exact parameters and a replayable command.
2. **Janelia AI in Microscopy: Collecting Training Data** https://bioimagingai.janelia.org/5-training-data.html — separate specimens, experiments and batches in test splits; augmentations are not new biological replicates. **Teaching**: hold out whole biological/acquisition groups, not adjacent image crops.
3. **When seeing is not believing: application-appropriate validation** https://www.nature.com/articles/s41592-023-01881-4 — high-looking segmentation can be scientifically inappropriate without relevant reference object definitions and metrics. **Teaching**: target, annotation type, confusion and failure gallery before model claims.
4. **Practical statistics for bioimage analysis** (2026) https://pmc.ncbi.nlm.nih.gov/articles/PMC13286366/ — study design, independent repeats, controls and effect sizes matter. **Teaching**: distinguish image count, biological n and source batch.
5. **REMBI BioImage Archive lab guide** https://www.ebi.ac.uk/bioimage-archive/rembi-help-lab/ — raw data, corresponding annotations, formats, experiment metadata and scripts should remain identifiable.
6. Existing original `projects/advanced/a07/evidence_check.py` intentionally returns `scientifically_validated:false` and `independent_learner_mastery_certified:false` regardless of schema passage. The tutorial **must preserve this epistemic boundary**; teaching examples cannot fabricate the seven actual research deliverables.

## Original 18-scene storyboard

| Scene | Canonical goal | Original figure / lesson |
|--:|--|--|
| 1 | G01 | End destination: unfamiliar native images → evidence packet → human decision |
| 2 | G01 | Prespecify target definition, experimental unit, primary endpoint and exclusions |
| 3 | G01 | Missing research-plan fields must block annotation readiness |
| 4 | G02 | Preserve original axes/dtype and named YX shape |
| 5 | G02 | Declared scale vs independently verified physical measurement |
| 6 | G03 | Count reference versus pixel-mask versus instance reference capabilities |
| 7 | G03 | Counts-only annotations refuse pixel IoU/object matching |
| 8 | G04 | Same animal in development and holdout is leakage |
| 9 | G04 | Freeze animal-disjoint development and holdout; count independent groups |
| 10 | G04 | **Withheld prediction**: evaluate overlap for changed group assignments |
| 11 | G04 | Reveal leakage and group-level numbers; refuse validity if overlap |
| 12 | G05 | Compute object micro-F1 from pooled TP/FP/FN, not mean of F1s |
| 13 | G05 | Compute image-level absolute count errors and failure categories |
| 14 | G06 | Original source/config/output fingerprint comparison |
| 15 | G06 | Fresh clean-checkout evidence is separate from matching JSON strings |
| 16 | G07 | Decision priority: NO_GO for leakage/unreproducible; MORE_ANNOTATION for inadequate reference |
| 17 | G07 | Low object F1 → IMPROVE_METHOD, otherwise REVIEW, never automatic scientific certification |
| 18 | CAPSTONE | Unsolved independent 7-file evidence packet on genuinely unfamiliar data |

The final scene gives an **unsolved transfer instruction**, not solved scientific parameters, annotations or a fabricated research dataset. A07-REVIEW and independent Prove must never be shown as worked code.

## Code/data contracts

- Every printed Python output must be actually reproducible in fresh CPython. Use invented image IDs, groups and toy annotation metrics explicitly labelled **synthetic only**.
- Plan fields: `target_definition`, `biological_unit`, `primary_endpoint`, `exclusion_rules`; missing values trigger `ready_to_annotate=False`. A06 source ID alone doesn't establish a biologically meaningful target.
- Source metadata: axes named TCZYX; **do not** infer image YX from arbitrary shape order or verify scale merely from a TIFF extension.
- Annotation type `counts` supports only count error, not IoU; instance matching needs true object IDs and quality-reviewed reference.
- Group overlap on actual biological_group_id or experiment/batch groups triggers failure. Count held-out **groups**, not images.
- Object micro-F1: sum TP/FP/FN before `2TP/(2TP+FP+FN)`; zero-denominator policy declared. Per-image count absolute errors aggregated separately.
- Evidence hashes identify source/config/output bytes, not biological claims. A fresh checkout must actually be run; a Python Boolean placeholder is not evidence.
- Decision rules priority in existing canonical chapter: `NO_GO` for leakage or irreproducibility; `MORE_ANNOTATION` if inadequate reference; `IMPROVE_METHOD` for below-threshold F1; else `REVIEW`. `scientifically_certified=False` always.
- Actual local evidence checker expects `project_plan.json`, `source_audit.json`, `split_manifest.csv`, `evaluation.json`, `reproduction.json`, `failure_cases.csv`, `methods_and_limitations.md`; validates structure only, requires human expert review. Any academically honest NO-GO can be a valuable outcome.

## Software design + QA gate

- Add `src/tutorials/a07-data.js`, append 18 original accessible SVG diagrams DATA07 (plan completeness, axis, annotation reference permissions, group holdout, error ratios, hashes and honest decision tree) to existing advanced illustration module. Register before existing viewer. No new permanent panel or changed shell/localStorage/Prove.
- Node tests for exactly canonical 7 goals+capstone, 18 scenes, withheld checkpoint, unsolved last step, all exact CPython numeric outputs and changed-input cases (missing plan, wrong axes, counts-only, group overlap, uneven TP/FP/FN micro-F1, corrupted hash, decision precedence).
- Genuine Playwright Chromium at mobile 390x844 and desktop 1280x850 with original SVG and voice/rate, prediction reveal, no horizontal overflow and no editor/progress mutation. Independent delayed review and standard route remain hidden.
- Dedicated cumulative A00–A07 Actions job with pinned scientific dependencies, all numerics and all chapter browser regressions; inspect logs, fix, rerun on failure. Do not call the scientific project complete from green software CI alone.
- Draft PR stacked on A06. No merge/deploy without learner review. After A07, the current mandatory advanced tutorial arc is technically complete; **stop building extra chapters without a curriculum decision and real learner evaluation**.

Verdict: GO for A07 narrated primer on evidence-literate research, **NOT** for automatic biological/research certification.
