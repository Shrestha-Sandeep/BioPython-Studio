# Real microscopy data — start here

**Goal:** move from isolated I01–I13 coding exercises to a traceable multi-image analysis of genuine microscopy-derived TIFF files. Work in the browser, then reproduce locally.

## A. Get actual image bytes into Python

1. Open BioPython Studio **Microscopy**, choose **I13**, and click **Open images** for 1–8 PNG/JPEG/TIFF/OME-TIFF files (32 MB per file, 96 MB total). Alternatively click **Witz TIFF pair** to fetch two public HPA-derived images.
2. The browser sends selected bytes locally into the Pyodide filesystem without converting TIFF values through an RGB preview. Paths are provided as the Python variable uploaded_image_paths. They are not persistent across reloads. Clear files and run again to clear the worker copies.
3. Paste this audit into the I13 code editor:

~~~python
from tifffile import TiffFile
print("Files:", len(uploaded_image_paths))
for path in uploaded_image_paths:
    with TiffFile(path) as tif:
        series = tif.series[0]
        print(path, "shape", series.shape, "axes", series.axes, "dtype", series.dtype)
        print("OME metadata:", bool(tif.ome_metadata))
        values = series.asarray()
        print("Native source values:", values.min(), values.max())
~~~

4. Identify channel, Z and T axes before selecting any 2D plane. Never infer a calibrated pixel size from a filename. Some TIFF codecs and vendor metadata still require desktop Bio-Formats.

### What the Witz TIFF pair actually is

The TIFF files come from [Witz's Python Image Processing course](https://github.com/guiwitz/PyImageCourse_beginner/tree/master/images) and contain **microscopy-derived RGB values from Human Protein Atlas images**. Witz states that they were downloaded as JPEG images and saved as TIFFs. Saving them in TIFF does not restore raw camera bit depth or calibration.

- [46658_784_B12_1.tif](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/images/46658_784_B12_1.tif): nuclear-membrane-labeled image.
- [24138_196_F7_2.tif](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/images/24138_196_F7_2.tif): non-membrane-labeled image.
- [Ground-truth category labels](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/images/categories.csv).

Witz's course code is BSD-3-Clause. Witz lists the HPA images as CC BY-SA 3.0. Retain attribution and source requirements; BioPython Studio does not redistribute the source TIFFs, but downloads them from the original repository when the sample button is clicked.

## B. Run the reproducible local pipeline

Download the two source TIFFs into an images folder and run from the repository root:

~~~bash
python -m venv .venv
# Activate your virtual environment for your shell.
python -m pip install -r projects/real-microscopy/requirements.txt
python projects/real-microscopy/witz_pipeline.py --input images/46658_784_B12_1.tif images/24138_196_F7_2.tif --out outputs/witz_pair --nucleus-channel 2 --signal-channel 1
~~~

The channel indices follow Witz's published HPA convention: blue nucleus-associated channel 2 and green protein channel 1. Inspect the axes and actual identities in **your** images instead of reusing these defaults blindly.

The script reads original TIFF bytes, explicitly selects Y/X and any channel/time/z axes, then runs median filtering, Otsu threshold, binary morphology, component labeling, core and rim intensity quantification, and diagnostic overlays.

Outputs in your chosen directory:

- **regions.csv**: candidate regions and pixel-level measurements; not a validated count of cells.
- **manifest.json**: SHA-256 integrity hashes, original dtype/axes/shape, chosen channels, parameters and candidate counts.
- **candidate overlays**: visual QC of segmentation, never substitutes for original TIFFs.

Physical area is absent unless you explicitly provide a separately verified pixel size; the manifest still labels a supplied size as unverified. The script does not infer independent biological replicates from image fields or nuclei.

## C. Inspect sensitivity

Try three choices of minimum object size and closing radius. Compare retained regions and the resulting edge/core ratios. Record false positives, touching regions, missing cores and border effects. Passing a coding test does not validate segmentation.

## D. Transfer independently

Use [INDEPENDENT_CHALLENGE.md](INDEPENDENT_CHALLENGE.md) after you can run and explain this baseline. Do **not** read [ASSESSMENT_RUBRIC.md](ASSESSMENT_RUBRIC.md) until after submitting your first attempt.

The goal is to transfer the technique to unfamiliar source files, preserve provenance, expose failures and justify biological interpretation.
