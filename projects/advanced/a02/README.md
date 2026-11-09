# A02 — Segment candidate objects from native microscopy pixels

**Status:** working native-Python implementation, pending external independent-image validation. This is an optional research project, not an added beginner chapter.

## Outcomes

Implement an **explicit baseline** with Gaussian smoothing, Otsu/global/adaptive/local or manually selected threshold, morphology, optional watershed separation, border rejection, pixel-space region measurements and transparent provenance. Recognize oversegmentation, merges, bias from noise/background, channel inversions and the fact that a plausible mask does not prove biological object identity.

### Prerequisites

P05/P06 and microscopy I01–I06, I09 and I13. Use A01 first to inspect actual image shape/axes/dtype. The script never guesses a non-singleton T/C/Z plane.

### Run with real original TIFF data

From repository root:

```sh
python -m pip install -r projects/advanced/requirements.txt
python -m projects.advanced.a02.run_tiff \
  --input /path/to/native.ome.tif \
  --config projects/advanced/a02/segmentation-config.json \
  --channel 0 --z 0 --time 0 \
  --out outputs/advanced/a02-first
```

For 2D grayscale image without C, Z or T, omit all three selectors. For an image with multiple non-singleton axes, explicitly select the correct plane. The analysis is a **2D slice**, not a volumetric analysis; physical pixel scale is never inferred.

Outputs:

- `candidate_labels.tif`: native integer candidate instance labels, **not independent annotations**.
- `candidate_regions.csv`: area in **pixels**, centroid and bounding box.
- `analysis.json`: image SHA-256, metadata (including unverified scale declaration), input statistics, segmentation parameters and candidate diagnostics.

The input image is never intentionally overwritten. A02 does not export precision, recall or biological effects without A03 reference annotations.

### Parameter sensitivity — compare three algorithms on identical source bytes

```sh
python -m projects.advanced.a02.sensitivity \
  --input /path/to/native.ome.tif \
  --channel 0 --z 0 --time 0 \
  --variant otsu=projects/advanced/a02/segmentation-config.json \
  --variant local=projects/advanced/a02/local-variant.json \
  --variant watershed=projects/advanced/a02/watershed-variant.json \
  --out outputs/advanced/a02-sensitivity
```

The output contains a CSV/JSON report of candidate counts, foreground-mask IoU relative to the first configuration, changed-pixel fraction and three native label TIFFs. These quantify **parameter sensitivity only**, not accuracy against annotation. Correct-looking counts can arise from merged or incorrectly segmented objects.

### Exercise

1. Predict the effect of increasing `min_area` and `closing_radius` on a cluttered sample.
2. Run a fixed, documented parameter set and inspect label maps against source intensity.
3. Compare at least three fixed parameter variants; explain false positives, merges, losses, and border effects.
4. Reproduce from a different folder; compare source SHA-256 and output table.
5. Transfer to a different TIFF of the same kind without modifying source files or assuming pixel calibration.

### Assessment

Pass only with original-source preservation, documented parameters, readable masks and QC evidence, a reproducible execution, and an honest explanation of failure cases. Do not infer independent accuracy from a pretty overlay.

The `segment` function can also run on explicitly selected 2D NumPy arrays from other readers; that does not validate unknown vendor metadata.

**Next:** A03 annotation-based one-to-one matching with a locked holdout.


## Supplemental biological image features — puncta and core/rim

The new [`puncta.py`](puncta.py) provides normalized negative-Laplacian-of-Gaussian local maxima with explicit sigma/response threshold, source-intensity and ROI handling, and object-specific **core/rim** intensity features in pixel space. Synthetic tests verify that known bright spots are located without converting original uint16 data.

```python
import tifffile
from projects.advanced.a02.puncta import candidate_puncta
image = tifffile.imread("/path/to/single_YX_plane.tif")
report = candidate_puncta(image, sigma=1.5, response_threshold=250)
print(report["candidate_count"], report["warnings"])
```

This is intentionally **not an exopher or protein aggregate detector**. Puncta, debris, organelles, vesicles and aggregates require a biological object definition and independent annotations. Mean core/rim intensities depend on source units, segmentation masks, optical blur, detector saturation, and bleed-through; apparent two-channel proximity is not proof of molecular interaction. Compare mask sensitivity, single-label controls, bleed-through controls and negative biological controls before making any colocalization inference.
