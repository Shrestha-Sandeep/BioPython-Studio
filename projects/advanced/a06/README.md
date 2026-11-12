# A06 — Deterministic and source-safe batch microscopy software

**Status:** Working native-Python batch implementation; real biological validity remains dependent on annotation-based A03 and correctly grouped A05 metadata.

## Input contract

Supply a folder containing original TIFF/OME-TIFF images plus a separate `manifest.csv`:

```csv
image_id,source_path,animal_id,condition,channel,z,time,exclude_reason
field001,wormA/field001.ome.tif,wormA,control,0,0,0,
field002,wormA/field002.ome.tif,wormA,control,0,0,0,
field003,wormB/field003.ome.tif,wormB,treated,0,0,0,
```

These rows demonstrate the schema only. The actual TIFF files and biological identities must be real and independently verified. Do not guess T/Z/C channel indexing or fabricate animal labels.

Save a separate configuration JSON:

```json
{
  "segmentation": {
    "method": "otsu",
    "gaussian_sigma": 1.0,
    "min_area": 20,
    "closing_radius": 1,
    "foreground": "bright",
    "separate_touching": false
  }
}
```

Run from repository root:

```sh
python -m projects.advanced.a06.batch \
  --data-root /path/to/original_tiffs \
  --manifest /path/to/manifest.csv \
  --config /path/to/config.json \
  --out outputs/a06-run-001
```

The output directory **must not already exist** and must be outside the source directory. Results include:

- Native integer instance-label TIFFs for every included field.
- `batch_report.json`: original TIFF/checksum/axis/dtype, exact config hashes, all image IDs and source paths, candidate counts, area in pixels, exclusion reasons, environment versions and per-image QC warnings.
- `a05_measurements.csv`: fields mapped to their real parent animal, including excluded rows. This can be analyzed by the [A05 animal-level tool](../a05/README.md) *when there are enough independent animals*.

The script fails closed on missing inputs, duplicated image IDs, inconsistent biological grouping, unsupported axes, exceeded in-memory limit, unsafe source paths or an existing output directory. A failed run leaves `INCOMPLETE.txt`; never treat partial exports as valid.

### Critical limitations

- A06 is **2D per explicitly selected plane**; it is not full Z-stack or cell tracking.
- Exclusions are user-declared and checked for provenance; the program cannot decide their scientific validity.
- Candidate counts and areas have **no independent biological ground truth**. Do not use them as exopher counts without annotation and controls.
- Identical source hashes/config/outputs aid reproduction but do not prove the method measures the intended organism or process.

### Acceptance test

Run at least two source TIFFs with deliberate changed axis/config values. Verify source SHA-256 before/after, local CLI unit tests, honest mask QC and reproducible outputs from a fresh virtual environment. A colleague should be able to identify every image and numerical operation from the saved report.
