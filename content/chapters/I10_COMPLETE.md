# I10 — Validate tracking and segmentation

**Status:** Technical learner pilot, not independently validated mastery.

Source: https://github.com/guiwitz/PyImageCourse_beginner/blob/master/09-Tracking.ipynb

Credited rendered image: [Witz/HPA provenance](../../assets/witz/CREDITS.md). Exercises are synthetic and do not establish real biological segmentation accuracy.

## I10-G01 — Calculate frame-to-frame displacement

Motion is not inferred from frame labels without coordinates and elapsed time.

- Euclidean position differences become speed only after unit and time conversion.
- Two unmatched detections cannot be assumed to be the same moving object.
- The input labels, tracking correspondences and intensity values are synthetic teaching examples; a real study requires independent annotation and acquisition controls.

**Predict:** Predict the printed value and identify the biological assumption that is not tested.

```python
import numpy as np
print(float(np.linalg.norm(np.array([3,4])-np.array([0,0]))))
```

**Apply:** Calculate speed in synthetic µm per time unit for index-paired data.before and data.after points; return list result.

**Prove:** Return sample displacements in pixels (no time conversion) for paired coordinates.

**Debug:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Limitations:** Synthetic labels, intensities and positions do not establish calibrated biological signal or validated objects.

## I10-G02 — Flag ambiguous nearest-neighbor tracking

A unique nearest match requires separation from the second-best candidate.

- Compare the two candidate distances rather than always choosing the smallest.
- Occlusion, mergers and out-of-plane motion cannot be resolved from one pair of frames.
- The input labels, tracking correspondences and intensity values are synthetic teaching examples; a real study requires independent annotation and acquisition controls.

**Predict:** Predict the printed value and identify the biological assumption that is not tested.

```python
import numpy as np
print(np.sort(np.array([1.2,1.0]))[:2])
```

**Apply:** For the first data.before point, return nearest data.after index and ambiguous=True if first two distances differ by <=0.5 pixels.

**Prove:** Under sample.radius, return sorted candidate indices reachable from the first previous point.

**Debug:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Limitations:** Synthetic labels, intensities and positions do not establish calibrated biological signal or validated objects.

## I10-G03 — Make a manual annotation data contract

Ground-truth annotations must be tied to source images and coordinate definitions.

- Store annotator and image identity alongside mask dimensions and axis order.
- Inter-annotator disagreement should be documented before scoring a model.
- The input labels, tracking correspondences and intensity values are synthetic teaching examples; a real study requires independent annotation and acquisition controls.

**Predict:** Predict the printed value and identify the biological assumption that is not tested.

```python
print({'axis_order':'yx','version':1})
```

**Apply:** Build result with image_id, annotator, shape and 'yx' coordinate order from data; use the truth-mask dimensions.

**Prove:** Validate all sample.annotations y,x positions are integer coordinate pairs in bounds; set result={'valid':bool,'count':int}.

**Debug:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Limitations:** Synthetic labels, intensities and positions do not establish calibrated biological signal or validated objects.

## I10-G04 — Evaluate candidate masks against an annotation

Pixel accuracy is not enough when nearly all pixels are background.

- Intersection-over-union and precision explicitly handle missing positives and empty masks.
- A single pixel-level score does not establish object-level segmentation quality.
- The input labels, tracking correspondences and intensity values are synthetic teaching examples; a real study requires independent annotation and acquisition controls.

**Predict:** Predict the printed value and identify the biological assumption that is not tested.

```python
import numpy as np
a=np.array([1,1,0],bool);b=np.array([1,0,1],bool);print((a&b).sum(),(a|b).sum())
```

**Apply:** Compute IoU and precision between data.pred and data.truth, with empty-union IoU=1 and no-positive precision=1 if truth also empty.

**Prove:** Compute Dice score and recall for sample masks, with both-empty Dice=1; no ground-truth positives gives recall=1 only when prediction also empty.

**Debug:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Limitations:** Synthetic labels, intensities and positions do not establish calibrated biological signal or validated objects.

## I10-G05 — Score one-to-one candidate object matches

Prevent a single annotated object from matching multiple detections.

- The Hungarian assignment finds a one-to-one pairing minimizing total distance.
- An explicit radius rejects distant correspondences; unmatched objects are false positives or negatives.
- The input labels, tracking correspondences and intensity values are synthetic teaching examples; a real study requires independent annotation and acquisition controls.

**Predict:** Predict the printed value and identify the biological assumption that is not tested.

```python
import numpy as np
from scipy.optimize import linear_sum_assignment
print(linear_sum_assignment(np.array([[1,3],[4,1]])))
```

**Apply:** Match data.after detections to data.before references with Hungarian assignment and radius; return {'tp','fp','fn'}.

**Prove:** Score sample detections with one-to-one matching; return precision and recall, defaulting to 1 if both empty.

**Debug:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Limitations:** Synthetic labels, intensities and positions do not establish calibrated biological signal or validated objects.

## I10-G06 — Stress-test a threshold pipeline against truth

Metrics must be checked across plausible preprocessing and threshold shifts.

- Compare IoU at deliberately perturbed thresholds rather than selecting one flattering value.
- A synthetic mask is an exercise annotation, not independently verified microscope truth.
- The input labels, tracking correspondences and intensity values are synthetic teaching examples; a real study requires independent annotation and acquisition controls.

**Predict:** Predict the printed value and identify the biological assumption that is not tested.

```python
import numpy as np
print([(np.array([0,5,10])>t).sum() for t in (3,7)])
```

**Apply:** Return IoU values at data.threshold−10, threshold and threshold+10 versus data.truth in result.

**Prove:** Simulate a single bright corner artifact without modifying sample.image; return IoU before and after relative to sample.truth.

**Debug:** Locate an error in source dimensions, identity matching, thresholding or denominator selection.

**Limitations:** Synthetic labels, intensities and positions do not establish calibrated biological signal or validated objects.

## I10-CAPSTONE — Audit a synthetic segmentation-and-tracking report

Synthesize this chapter into a source-safe numerical analysis and report its unresolved biological limits.

- Use explicit parameters and preserve the original synthetic source arrays.
- Quantitative summaries must distinguish computational candidates from manually validated measurements.
- Do not call image fields independent biological replicates or rendered RGB calibrated signal.

**Predict:** Predict the printed numerical result and one limitation before execution.

```python
import numpy as np
print(np.asarray([[1,0],[0,1]]).shape)
```

**Apply:** Compute pixel-mask IoU and mean matched-pair synthetic speed (µm per time unit); return result with provenance='synthetic'.

**Prove:** On new sample positions, compute one-to-one correspondence TP/FP/FN and record a radius-based ambiguity warning.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Limitations:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## I10-REVIEW — Re-evaluate an unseen pixel-mask comparison

Reconstruct the method after a delay on a fresh input.

- Reproduce the key numerical decision from memory.
- Check edge behavior and compare to a second input.
- Do not equate remembered code with biological validation.

**Predict:** Predict the printed numerical result and one limitation before execution.

**Apply:** Recall the relevant algorithm and predict a new failure mode before Prove.

**Prove:** Compute IoU and Dice on the new synthetic sample.pred and sample.truth masks; use empty-mask conventions.

**Debug:** Diagnose one shape, threshold, indexing or data-provenance failure and explain how a changed input exposes it.

**Limitations:** Examples are synthetic unless a credited Witz/HPA rendered PNG is explicitly decoded; no raw calibration or manually validated segmentation is implied.

## Release gates

- All 3 changed-input cases per public phase must pass CPython and Pyodide.
- The independent Prove starter is intentionally blank.
- Learner and real data/annotation validation remain required.
