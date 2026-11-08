# A01 — Native image audit (first executable advancement slice)

**Technical purpose:** teach the difference between readable image bytes, declared metadata and scientifically verified calibration. This does *not* segment or classify biological objects.

The script inspects the first TIFF/OME-TIFF series, records native dtype/shape/axes, requires explicit selections for any non-singleton T, C/S or Z axis, computes native pixel statistics and streams a SHA-256 over the source file. It reports OME XML physical pixel size only as **declared and independently unverified**.

### Local commands

From repository root:

```sh
python -m pip install -r projects/advanced/requirements.txt
python projects/advanced/a01/image_audit.py --input /path/to/your_image.ome.tif --channel 0 --time 0 --z 0 --output outputs/audit.json
python -m pytest -q tests/test_advanced_image_audit.py
```

Omit `--channel`, `--time` or `--z` when that axis is absent or length 1. The tool will refuse to guess when an axis has multiple positions. A grayscale 2D TIFF usually needs no selectors.

**Input boundary:** 256 MiB uncompressed series by default; may be lowered using `--max-mib`. This path reads a whole series to memory after checking the estimated size and is *not* a streaming/multiscale format solution. Input must be .tif/.tiff and decodable by tifffile. For vendor formats, large OME-Zarr volumes or Java Bio-Formats metadata, use a separate local workflow (Fiji/napari/Bio-Formats). Nonfinite pixels are counted; all-nonfinite image planes are rejected.

### Success evidence

- Image source SHA-256 unchanged before/after.
- 8-bit, 16-bit and floating-image dtypes distinguished correctly.
- Original shape, axes and explicit YX plane selection recorded.
- A 16-bit synthetic OME-TIFF round-trip passes without normalizing pixels.
- Missing selection for a multi-C/Z/T image fails informatively.
- Missing spatial calibration remains unknown; OME scale remains `DECLARED...NOT_INDEPENDENTLY_VERIFIED`.
- No claims of cell counts, exopher identities, physical intensity calibration or biological effects.

### Next project

After actual learner testing and data-source review, A02/A03 will add independently annotated images, object definitions and matched-error metrics. The Witz HPA JPEG-derived TIFFs are appropriate demonstrations of file handling, **not** substitutes for native microscope sources or independent segmentation reference masks.
