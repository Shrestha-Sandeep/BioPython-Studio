"""A01-A03 targeted scientific gap tests, synthetic-only and source-safe."""
from __future__ import annotations

import numpy as np
import pytest

from projects.advanced.a01.quality import inspect_quality
from projects.advanced.a02.puncta import candidate_puncta, core_rim_intensity
from projects.advanced.a03.annotator_agreement import annotator_agreement


def test_a01_native_saturation_illumination_and_unverified_psf_policy():
    native=np.full((20,30),400,dtype=np.uint16)
    native[3,4]=65535
    native[5:10,8:15]=900
    first=native.copy()
    report=inspect_quality(native,pixel_size_um=.1,psf_fwhm_um=.3,
                           scale_verified=False)
    assert report["input_dtype"]=="uint16"
    assert report["integer_dtype_max"]==65535
    assert report["at_dtype_max"]==1
    assert report["optical_scale_verified"] is False
    assert report["pixels_per_verified_psf_fwhm"] is None
    verified=inspect_quality(native,pixel_size_um=.1,psf_fwhm_um=.3,
                             scale_verified=True)
    assert verified["optical_scale_verified"]
    assert abs(verified["pixels_per_verified_psf_fwhm"]-3)<1e-10
    assert np.array_equal(native,first)
    with pytest.raises(ValueError,match="nonempty"):
        inspect_quality(np.zeros((0,0),dtype=np.uint16))
    with pytest.raises(ValueError,match="finite"):
        inspect_quality(np.full((3,3),np.nan))


def test_a02_log_candidate_spots_on_original_uint16_without_identity_claim():
    yy,xx=np.indices((64,64))
    signal=(4000*np.exp(-((yy-20)**2+(xx-20)**2)/(2*2.**2))
            +6000*np.exp(-((yy-44)**2+(xx-43)**2)/(2*2.**2)))
    image=signal.astype(np.uint16)
    before=image.copy()
    result=candidate_puncta(image,sigma=1.5,response_threshold=250,
                            min_distance=6)
    assert result["source_dtype"]=="uint16"
    assert result["candidate_count"]==2,result
    assert {(p["y"],p["x"]) for p in result["candidate_points"]}=={(20,20),(44,43)}
    assert "not a verified" in result["warnings"][0]
    assert np.array_equal(image,before)
    roi=np.zeros_like(image,dtype=bool);roi[:33,:33]=True
    limited=candidate_puncta(image,sigma=1.5,response_threshold=250,
                             min_distance=6,valid_roi=roi)
    assert limited["candidate_count"]==1
    with pytest.raises(ValueError,match="same-shape"):
        candidate_puncta(image,valid_roi=np.ones((2,2),dtype=bool))


def test_a02_core_rim_does_not_infer_physical_area():
    labels=np.zeros((11,11),dtype=np.uint32)
    labels[2:9,2:9]=1
    image=np.zeros_like(labels,dtype=np.uint16)
    image[labels==1]=1000
    image[4:7,4:7]=2000
    out=core_rim_intensity(image,labels)
    assert len(out)==1
    assert out[0]["area_px"]==49
    assert out[0]["rim_px"]>0
    assert out[0]["core_px"]>0
    assert out[0]["mean_core"]>out[0]["mean_rim"]
    assert out[0]["physical_area_verified"] is False


def test_a03_human_annotation_disagreement_not_biological_ground_truth():
    first=np.zeros((15,20),dtype=np.int32)
    first[2:7,2:7]=1
    first[2:7,12:17]=2
    second=first.copy()
    same=annotator_agreement(first,second)
    assert same["object_f1"]==1.
    assert same["annotation_disagreement_present"] is False
    second[second==2]=1
    disagree=annotator_agreement(first,second)
    assert disagree["foreground_pixel_iou"]==1.
    assert disagree["object_f1"]<1.
    assert disagree["annotation_disagreement_present"] is True
    assert disagree["review_required"] is True
    with pytest.raises(ValueError,match="identical"):
        annotator_agreement(first,second[:5])
