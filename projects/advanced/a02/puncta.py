"""A02 supplementary: conservative blob and fluorescence core/rim metrics.

Bright LoG responses are *candidates*, not identities. A punctum can be a
noise artifact, cell debris, organelle or aggregate. No exopher/colocalization
claim is made without independent annotations and appropriate controls.
"""
from __future__ import annotations

import numpy as np
from scipy import ndimage as ndi
from skimage.feature import peak_local_max


def candidate_puncta(image: np.ndarray, *, sigma: float = 1.4,
                     response_threshold: float = 80.,
                     min_distance: int = 3,
                     valid_roi: np.ndarray | None = None) -> dict:
    source=np.asarray(image)
    if source.ndim!=2 or source.size==0 or source.dtype.kind not in "uif":
        raise ValueError("Expected nonempty numeric 2D source")
    if sigma<=0 or not np.isfinite(sigma) or not np.isfinite(response_threshold) or min_distance<1:
        raise ValueError("Sigma, response threshold and minimum distance must be valid")
    valid=np.isfinite(source)
    if valid_roi is not None:
        roi=np.asarray(valid_roi)
        if roi.shape!=source.shape or roi.dtype.kind not in "biu":
            raise ValueError("Valid ROI must be a same-shape binary mask")
        valid &= roi.astype(bool)
    if not valid.any():
        raise ValueError("No finite pixels in permitted ROI")
    arr=source.astype(np.float64)
    arr[~np.isfinite(arr)]=float(np.median(arr[valid]))
    # Apply a normalized Laplacian-of-Gaussian scale-space filter; preserve
    # native numeric range and never use display-rescaled PNG intensities.
    response=-ndi.gaussian_laplace(arr,sigma=sigma)*sigma**2
    response[~valid]=-np.inf
    coords=peak_local_max(response,min_distance=min_distance,
                          threshold_abs=float(response_threshold),
                          exclude_border=False)
    points=sorted(
        [{"y":int(y),"x":int(x),"log_response":float(response[y,x]),
          "source_intensity":float(source[y,x])} for y,x in coords],
        key=lambda p:(p["y"],p["x"])
    )
    return {
        "method":"normalized_negative_LoG_local_maxima",
        "source_dtype":str(source.dtype),
        "parameters":{"sigma_px":sigma,"response_threshold":response_threshold,
                      "min_distance_px":min_distance},
        "candidate_count":len(points),
        "candidate_points":points,
        "warnings":[
            "A LoG maximum is a spot candidate, not a verified protein aggregate or exopher.",
            "Parameters and foreground ROI are task- and image-condition-specific.",
            "A second channel in proximity or colocalization is not proof of molecular interaction.",
        ],
    }


def core_rim_intensity(image: np.ndarray, label_map: np.ndarray,
                       *, erosion_iterations: int = 1) -> list[dict]:
    image=np.asarray(image)
    labels=np.asarray(label_map)
    if image.ndim!=2 or labels.shape!=image.shape or image.dtype.kind not in "uif":
        raise ValueError("Expected same-size 2D numeric image and integer labels")
    if labels.dtype.kind not in "iu" or np.any(labels<0):
        raise ValueError("Labels must be nonnegative instance integers")
    if not 1<=erosion_iterations<=20:
        raise ValueError("Erosion iterations must be 1..20")
    if not np.isfinite(image).all():
        raise ValueError("Nonfinite intensity needs a prespecified exclusion policy")
    out=[]
    for label_id in np.unique(labels):
        if label_id==0:continue
        mask=labels==label_id
        core=ndi.binary_erosion(mask,iterations=erosion_iterations)
        rim=mask & ~core
        out.append({
            "label":int(label_id),"area_px":int(mask.sum()),
            "core_px":int(core.sum()),"rim_px":int(rim.sum()),
            "mean_core":float(np.mean(image[core])) if core.any() else None,
            "mean_rim":float(np.mean(image[rim])) if rim.any() else None,
            "units":"source pixel intensity, no calibrated molecular units",
            "physical_area_verified":False,
        })
    return out
