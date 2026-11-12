# X01 — Fiji/ImageJ and napari interoperability (first scientific vertical slice)

**Status:** Implemented **local CPython exchange tool and native regression tests**. This is *not yet* the full interactive X01 learning chapter or a certified, manually witnessed Fiji/napari desktop round trip. The rest of X01 must remain a separate development milestone.

## Scope and critical boundaries

The input is two existing TIFF files: (1) one explicitly selected **2-D YX original intensity plane**, and (2) a same-shape 2-D **unsigned integer instance-label TIFF**, with 0 as background and positive object IDs. The tool **never** thresholds an unknown microscopy image automatically; segmentation/annotation comes from the user. For 3-D Z/C/T use A04's future explicit axis selector before this bridge.

Output under a **new** directory:

- `napari_fiji_labels.tif`: exact original integer instance IDs converted to uint16 and independently read back.
- `Fiji_RoiSet.zip`: standard ImageJ ROI Manager ZIP of *bounding rectangles*, **not exact masks of irregular objects**. The TIFF is the authoritative segmentation. No fabricated mask fidelity.
- `exchange_audit.json`: source hashes, dtypes, axes, pixel-coordinate convention, object IDs/bounding boxes, export hashes and deliberate `scientific_validation: false`.

The source image/label TIFFs remain unchanged. An existing output directory is **refused**. The output directory is not a backup of the original raw image.

## Run

```bash
python -m venv .venv
# activate the venv in the normal way for your OS
python -m pip install -r projects/advanced/x01/requirements.txt
python projects/advanced/x01/roi_roundtrip.py original_YX.tif candidate_labels_YX.tif x01_output
python -m pytest -q tests/test_x01_fiji_napari_roundtrip.py
```

In **napari**, open the original TIFF as an image layer, and `napari_fiji_labels.tif` as a labels layer, using either napari's File menu and correct layer type or equivalent Python commands:

```python
import napari
import tifffile
viewer = napari.view_image(tifffile.imread("original_YX.tif"), name="original")
viewer.add_labels(tifffile.imread("x01_output/napari_fiji_labels.tif"), name="candidate objects")
napari.run()
```

napari must be installed **separately** in a compatible local desktop environment; the exchange script does not install or remotely control it.

In **Fiji**, open the same 2-D original intensity TIFF. Open **Analyze → Tools → ROI Manager**, then **More → Open** and select `Fiji_RoiSet.zip`. The rectangles are for positioning and manual inspection. The label TIFF preserves *exact* object pixels; Fiji's handling of uint16 label IDs and display colors still requires a manually witnessed check.

## Required human pass/fail checks

- Verify that at least three distinct reference pixel positions and border positions match between source TIFF, napari labels and Fiji overlays.
- If irregular candidates are present, verify that the ROI rectangle is visibly **not** mistaken for the exact object mask.
- Confirm image XY orientation, channel/Z/T selection, physical scale units, ROI count, label count and representative object identity.
- Record software versions and screenshot evidence. This tool does not assert calibration when acquisition metadata are unavailable.

**Source API references:** [ImageJ ROI Manager](https://imagej.net/ij/docs/menus/analyze), [roifile](https://pypi.org/project/roifile/), [napari](https://napari.org/). All lesson code and test fixtures are original; no source images are redistributed.
