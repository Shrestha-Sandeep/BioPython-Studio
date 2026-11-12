# A01 — Native image audit and calibration

**Status:** Optional advanced-learning pilot; browser exercises have computational checks but no demonstrated human learner mastery.

## Objective

Learn to distinguish TIFF bytes, axes, dtype, numeric pixels and declared versus verified calibration.

## Learning sequence

### 1. Select channel and Z by named axes (A01-G01)

A wrong axis silently changes which biological plane is measured.

**Task:** Build a synthetic array from data.shape and data.axes. Select data.channel and data.z, return result={'shape':[Y,X],'first':int,'last':int}.

**Independent transfer:** Independently solve changed input without consulting the worked example: Build a synthetic array from data.shape and data.axes. Select data.channel and data.z, return result={'shape':[Y,X],'first':int,'last':int}.

**Scientific boundary:** Browser examples use synthetic values. Native acquisition, calibrated scale and cell identity are not verified.

### 2. Protect 16-bit source values (A01-G02)

Intensities must not be altered by hidden 8-bit conversions or wrapped subtraction.

**Task:** Subtract data.background from data.pixels without unsigned wraparound; result={'values':nonnegative float nested list,'native_dtype':'uint16'}.

**Independent transfer:** Independently solve changed input without consulting the worked example: Subtract data.background from data.pixels without unsigned wraparound; result={'values':nonnegative float nested list,'native_dtype':'uint16'}.

**Scientific boundary:** Browser examples use synthetic values. Native acquisition, calibrated scale and cell identity are not verified.

### 3. Treat scale as an unverified declaration (A01-G03)

OME physical-size metadata may be declared but not independently calibrated.

**Task:** Use data.area_px and data scale fields. Return result={'area_um2':float or None,'status':'verified' or 'unverified'}; never use unverified pixel size.

**Independent transfer:** Independently solve changed input without consulting the worked example: Use data.area_px and data scale fields. Return result={'area_um2':float or None,'status':'verified' or 'unverified'}; never use unverified pixel size.

**Scientific boundary:** Browser examples use synthetic values. Native acquisition, calibrated scale and cell identity are not verified.

### 4. Fingerprint original source bytes (A01-G04)

A filename or image preview cannot identify exact original source bytes.

**Task:** Compute SHA-256 of data.bytes (small synthetic byte list), returning result={'sha256':digest,'byte_count':int}.

**Independent transfer:** Independently solve changed input without consulting the worked example: Compute SHA-256 of data.bytes (small synthetic byte list), returning result={'sha256':digest,'byte_count':int}.

**Scientific boundary:** Browser examples use synthetic values. Native acquisition, calibrated scale and cell identity are not verified.

### 5. Source-aware plane audit (A01-CAPSTONE)

Integrate axis selection, native range and non-biological candidate labeling.

**Task:** From data.axes/shape/pixels select the requested Z/C plane; count pixels > data.threshold and return result={'plane_shape':[Y,X],'candidate_pixels':int,'calibration_status':string}.

**Independent transfer:** Independently solve changed input without consulting the worked example: From data.axes/shape/pixels select the requested Z/C plane; count pixels > data.threshold and return result={'plane_shape':[Y,X],'candidate_pixels':int,'calibration_status':string}.

**Scientific boundary:** Browser examples use synthetic values. Native acquisition, calibrated scale and cell identity are not verified.

### 6. Return later: independent native source audit (A01-REVIEW)

A delayed review is only a credible retention check when performed on a later day unaided.

**Task:** From data.axes/shape/pixels select Z/C and return result={'shape':[Y,X],'sum':int,'requires_calibration':boolean} without solved steps.

**Independent transfer:** Independently solve changed input without consulting the worked example: From data.axes/shape/pixels select Z/C and return result={'shape':[Y,X],'sum':int,'requires_calibration':boolean} without solved steps.

**Scientific boundary:** Browser examples use synthetic values. Native acquisition, calibrated scale and cell identity are not verified.

## Independent real-data project

Use the executable [project guide](../../projects/advanced/a01/README.md) and the original-source data, not the synthetic practice arrays.

```sh
python projects/advanced/a01/image_audit.py --input /path/to/source.ome.tif --channel 0 --out outputs/a01/audit.json
```

### Evidence required to pass

Original TIFF SHA-256 remains unchanged; no unverified physical µm² or cell counts are reported.

### Limits and interpretation

Even correctly decoded 16-bit OME-TIFF does not establish native camera acquisition or verified pixel scale.

Your output requires independent validation against genuine annotations, proper biological-group definitions and a reproducible environment. The app's automatic checks are **public practice checks**, not a secure assessment or 9.5/10 teaching-quality certification.

## Progress and delayed review

Learn: predict and modify; Apply: solve changing inputs with hints; Prove: solve independent cases with hints hidden; capstone: export runnable code; review: return on a later day and record the actual elapsed interval and assistance used. Complete real-data work locally.

## Navigation

Open the optional path at `/?lab=advanced`. The ordinary 26-chapter course opens at `/` and retains its original browser progress. This chapter's advanced draft and progress have a separate storage key.
