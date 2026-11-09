# A07 — Independent unfamiliar-data microscopy capstone

**Requirement:** complete the seven scientific checkpoints on a genuinely unfamiliar and appropriately annotated dataset. This browser chapter is a primer, **not** the real capstone itself.

## Seven evidence checkpoints

1. **Prespecify the biological question and endpoint:** Segmentation cannot be assessed until the intended biological object and primary measurement are defined.

   Task: Inspect data.plan for target_definition, biological_unit, primary_endpoint and exclusion_rules. Return result={'missing':sorted missing keys,'ready_to_annotate':bool}.

2. **Audit unknown original image metadata:** A native-looking TIFF may contain misinterpreted Z/C/T axes or an unverified physical pixel scale.

   Task: For data.axes,data.shape,data.dtype,data.scale_verified, return result={'yx':[Y,X],'nonspatial_axes':list,'calibration_known':bool}.

3. **Check annotation type before selecting metrics:** A manual count reference cannot justify pixel-mask IoU or one-to-one instance matching.

   Task: Given data.annotation_type and data.has_object_ids, return result={'pixel_iou_allowed':bool,'object_matching_allowed':bool,'count_error_allowed':True}.

4. **Freeze a group-disjoint development/test split:** Training on one field and testing on another from the same animal may overstate generalization.

   Task: Given data.images with biological_group and split labels, return result={'leaking_groups':sorted list,'development_n':int,'holdout_n':int}.

5. **Evaluate real object errors against annotations:** A mask can look plausible while many annotated objects are missing, merged or spuriously split.

   Task: From data.images TP/FP/FN counts, compute pooled micro object F1 and mean absolute count error. Return result={'micro_f1':float,'mean_abs_count_error':float,'n_images':int}.

6. **Audit clean-environment reproduction evidence:** A screenshot of a notebook running once is not an independently reproducible analysis.

   Task: Compare data.expected and data.observed source/config/output SHA strings and data.clean_checkout. Return result={'hash_match':bool,'fresh_reproduction_declared':bool,'ready_for_review':bool}.

7. **Choose GO, MORE ANNOTATION or NO-GO:** Scientific judgment sometimes means stopping a technically working pipeline rather than optimizing another filter.

   Task: From data.annotation_sufficient,group_disjoint,reproducible,object_f1,threshold return result={'recommendation':str,'scientifically_certified':False}; priority NO_GO if leakage or irreproducible, MORE_ANNOTATION if reference insufficient, IMPROVE_METHOD if F1 too low, else REVIEW.

## Independent final project

Use [A07 original-data evidence checker](../../projects/advanced/a07/evidence_check.py). Submit project_plan.json, source_audit.json, split_manifest.csv, evaluation.json, reproduction.json, failure_cases.csv and methods_and_limitations.md. The CLI checks structure and numerical coherence but always outputs scientifically_validated=false and human_review_required=true.

The final research decision must name the intended biological object, describe annotation disagreement, preserve source hashes, avoid group leakage, report original measurement units and uncertainty, and explain where segmentation fails.

**No solved biological research protocol is supplied.** A negative GO/NO-GO decision can satisfy scientific judgment when evidence and limitations are correctly interpreted. A human scientist must assess originality, biological validity, study design and independence.
