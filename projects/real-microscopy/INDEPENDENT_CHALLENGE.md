# Independent microscopy transfer challenge

**No worked solution.** Start a new Python script without copying the existing batch pipeline.

## Biological question

Can an automated per-nucleus **core versus nuclear-rim signal score** distinguish microscopy images categorized as nuclear-membrane from those categorized as non-membrane localization?

Use two unfamiliar Witz/HPA TIFF files, not the old displayed PNG:

- [27985_284_E10_2.tif](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/images/27985_284_E10_2.tif)
- [67703_1283_D7_3.tif](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/images/67703_1283_D7_3.tif)

Do not inspect the labels in Witz's categories.csv until after you have fixed your rules and predictions.

## Required deliverables

1. Preserve the original TIFFs. Log each SHA-256 checksum, native dtype, shape, axis order, source status and selected channel indices.
2. Write a parameterized segmentation and core/rim measurement function that runs unchanged on both images. Do not hardcode filenames or labels.
3. Produce an annotated overlay per source image. Manually review at least five candidate objects, including false detections and incomplete cores.
4. Choose an image-level score, aggregation rule and decision cutoff **before** reading the reference category labels. Report both predictions and underlying values.
5. Repeat with three distinct plausible threshold/filter/morphology parameter combinations. Quantify whether counts, scores and predictions change.
6. Export measurements.csv, manifest.json and a QC overlay per input, and reproduce exactly in a fresh directory without rewriting the originals.
7. In 200–400 words, explain three confounders and a concrete control for each (e.g., JPEG dynamic-range loss, bad nucleus segmentation, lack of independent replicates).

Once your analysis and class predictions are frozen, compare them to [Witz's labels](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/images/categories.csv). **Two images cannot support a meaningful estimate of model accuracy**, even if both predictions happen to agree.

### Independent competence gate

A third TIFF chosen by another person must work without editing your main analysis function. If it fails, document why and how you corrected it.

Do not claim raw calibrated fluorescence, validated nuclei segmentation or independent biological replication from these images. A future research-grade extension should use original instrument data, verified scale, manual annotations and specimen/batch identifiers.
