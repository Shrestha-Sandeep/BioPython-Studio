"""A01 scientific image-quality indicators — not a calibrated image-quality score.

Quantifies native dtype, saturated extreme values, border/interior contrast and
illumination variation. PSF/Nyquist assertions require VERIFIED metadata and a
documented optical model; this module never guesses those from a figure TIFF.
"""
from __future__ import annotations

import numpy as np


def inspect_quality(image: np.ndarray, *, pixel_size_um: float | None = None,
                    psf_fwhm_um: float | None = None,
                    scale_verified: bool = False) -> dict:
    arr = np.asarray(image)
    if arr.ndim != 2 or not arr.size or arr.dtype.kind not in "uif":
        raise ValueError("A01 quality check expects native 2D numeric YX image")
    finite=np.isfinite(arr)
    if not np.any(finite):
        raise ValueError("Image has no finite values")
    values=np.asarray(arr,dtype=np.float64)
    safe=values[finite]
    if np.issubdtype(arr.dtype,np.integer):
        saturated=int(np.count_nonzero(arr[finite]==np.iinfo(arr.dtype).max))
        native_peak=int(np.iinfo(arr.dtype).max)
    else:
        saturated=None
        native_peak=None
    top=np.asarray(values[0,:]);bottom=np.asarray(values[-1,:])
    sides=np.concatenate([values[1:-1,0],values[1:-1,-1]])
    border=np.concatenate([top,bottom,sides]);border=border[np.isfinite(border)]
    # Spatial blocks are diagnostics of nonuniformity, not a causal diagnosis.
    blocks=[]
    for rows in np.array_split(np.arange(arr.shape[0]),min(4,arr.shape[0])):
        for cols in np.array_split(np.arange(arr.shape[1]),min(4,arr.shape[1])):
            tile=values[np.ix_(rows,cols)]
            tile=tile[np.isfinite(tile)]
            if tile.size:
                blocks.append(float(np.median(tile)))
    if not blocks:raise ValueError("No nonempty spatial tiles")
    verified_optics=bool(scale_verified and pixel_size_um is not None
                         and psf_fwhm_um is not None
                         and np.isfinite(pixel_size_um) and np.isfinite(psf_fwhm_um)
                         and pixel_size_um>0 and psf_fwhm_um>0)
    pixel_per_fwhm=float(psf_fwhm_um/pixel_size_um) if verified_optics else None
    return {
        "input_dtype":str(arr.dtype), "input_shape":list(arr.shape),
        "finite_pixels":int(finite.sum()),"nonfinite_pixels":int((~finite).sum()),
        "integer_dtype_max":native_peak,"at_dtype_max":saturated,
        "fraction_at_dtype_max":saturated/len(safe) if saturated is not None else None,
        "border_median":float(np.median(border)) if border.size else None,
        "spatial_tile_median_min":float(min(blocks)),
        "spatial_tile_median_max":float(max(blocks)),
        "pixels_per_verified_psf_fwhm":pixel_per_fwhm,
        "optical_scale_verified":verified_optics,
        "warnings":[
            "Digital maximum is a saturation indicator, not proof of detector clipping.",
            "Tile median variation can reflect illumination or real sample heterogeneity.",
            "FWHM sampling is meaningful only with verified pixel calibration and optical PSF metadata.",
            "Witz/HPA JPEG-derived TIFF and rendered figures are not authenticated raw quantitative intensity data.",
        ],
    }
