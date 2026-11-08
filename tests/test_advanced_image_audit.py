"""G1 native-source auditing tests, including real TIFF encode/decode round-trips.

All images generated here are synthetic test fixtures, not experimental data.
"""
from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import pytest
import tifffile

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "projects" / "advanced" / "a01" / "image_audit.py"
SPEC = importlib.util.spec_from_file_location("advanced_image_audit", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
audit = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(audit)


def test_native_16bit_ome_axes_plane_values_and_declared_not_verified_scale(tmp_path):
    source = tmp_path / "native.ome.tif"
    volume = np.zeros((2, 3, 2, 5, 7), dtype=np.uint16)  # T C Z Y X
    volume[1, 2, 1, 3, 4] = 41000
    volume[1, 2, 1, 0, 0] = 65000
    tifffile.imwrite(
        source, volume, ome=True, photometric="minisblack",
        metadata={"axes": "TCZYX", "PhysicalSizeX": 0.25,
                  "PhysicalSizeY": 0.30, "PhysicalSizeXUnit": "µm",
                  "PhysicalSizeYUnit": "µm"},
    )
    result = audit.audit_image(source, channel=2, time=1, z=1)
    assert result["native_shape"] == [2, 3, 2, 5, 7]
    assert result["original_axes"] == "TCZYX"
    assert result["native_dtype"] == "uint16"
    assert result["selection"] == {
        "channel": 2, "time": 1, "z": 1, "yx_shape": [5, 7]
    }
    assert result["pixel_statistics"]["max"] == 65000.0
    assert result["pixel_statistics"]["min"] == 0.0
    assert result["pixel_statistics"]["mean"] == float(volume[1, 2, 1].mean())
    assert result["source_sha256"] == audit.sha256_file(source)
    assert result["ome_xml_present"] is True
    assert result["pixel_size_declaration"]["x"] == 0.25
    assert result["scale_independently_verified"] is False


def test_unselected_multiplane_image_refuses_guessing(tmp_path):
    source = tmp_path / "stack.ome.tiff"
    image = np.zeros((2, 3, 2, 4, 5), dtype=np.uint16)
    tifffile.imwrite(source, image, ome=True, metadata={"axes": "TCZYX"})
    with pytest.raises(audit.AuditError, match="C has 3 planes"):
        audit.audit_image(source, time=1, z=1)
    with pytest.raises(audit.AuditError, match="T has 2 planes"):
        audit.audit_image(source, channel=1, z=1)
    with pytest.raises(audit.AuditError, match="Z has 2 planes"):
        audit.audit_image(source, channel=1, time=1)
    with pytest.raises(audit.AuditError, match="outside"):
        audit.audit_image(source, channel=99, time=1, z=1)


def test_rgb_sample_axis_is_explicit_and_jpeg_origin_is_not_inferred(tmp_path):
    source = tmp_path / "converted_to_tiff.tif"
    rgb = np.zeros((5, 6, 3), dtype=np.uint8)
    rgb[0, 1, 1] = 255
    tifffile.imwrite(source, rgb, photometric="rgb")
    with pytest.raises(audit.AuditError, match="C has 3 planes"):
        audit.audit_image(source)
    result = audit.audit_image(source, channel=1)
    assert result["selection"]["yx_shape"] == [5, 6]
    assert result["pixel_statistics"]["at_integer_dtype_max_count"] == 1
    assert result["pixel_size_declaration"] is None
    assert result["scale_independently_verified"] is False
    assert any("TIFF container" in msg for msg in result["scientific_warnings"])


def test_float_nonfinite_values_are_counted_not_misreported(tmp_path):
    source = tmp_path / "float.tif"
    image = np.array([[1.0, 2.0], [np.nan, 3.0]], dtype=np.float32)
    tifffile.imwrite(source, image)
    result = audit.audit_image(source)
    assert result["native_dtype"] == "float32"
    assert result["pixel_statistics"]["nonfinite_count"] == 1
    assert result["pixel_statistics"]["mean"] == 2.0
    assert result["pixel_statistics"]["at_integer_dtype_max_count"] is None


def test_invalid_dimensions_and_empty_or_nonnumeric_policies():
    with pytest.raises(audit.AuditError, match="Unsupported"):
        audit.select_yx_plane(np.zeros((2, 5, 6)), "QYX")
    with pytest.raises(audit.AuditError, match="no Z axis"):
        audit.select_yx_plane(np.zeros((5, 6)), "YX", z=1)
    with pytest.raises(audit.AuditError, match="Unsupported"):
        audit.select_yx_plane(np.zeros((2, 3, 5, 6)), "SCYX", channel=0)
    plane, selection = audit.select_yx_plane(np.arange(6).reshape(2, 3), "XY")
    assert plane.shape == (3, 2)
    assert plane[1, 0] == 1
    assert selection["yx_shape"] == [3, 2]
    with pytest.raises(audit.AuditError, match="empty"):
        audit.select_yx_plane(np.zeros((0, 0)), "YX")


def test_memory_limit_checked_before_decoding_and_missing_inputs(tmp_path):
    source = tmp_path / "large.tif"
    tifffile.imwrite(source, np.zeros((32, 48), dtype=np.uint16))
    with pytest.raises(audit.AuditError, match="exceeding limit"):
        audit.audit_image(source, max_uncompressed_bytes=8)
    with pytest.raises(audit.AuditError, match="not found"):
        audit.audit_image(tmp_path / "absent.tif")
    with pytest.raises(audit.AuditError, match="Supported inputs"):
        audit.audit_image(tmp_path / "image.jpg")


def test_cli_json_export_and_source_overwrite_protection(tmp_path):
    source = tmp_path / "source.tif"
    tifffile.imwrite(source, np.arange(30, dtype=np.uint16).reshape(5, 6))
    before = source.read_bytes()
    output = tmp_path / "audit" / "source.json"
    run = subprocess.run(
        [sys.executable, str(SCRIPT), "--input", str(source),
         "--output", str(output)],
        capture_output=True, text=True,
    )
    assert run.returncode == 0, run.stderr
    payload = json.loads(output.read_text(encoding="utf-8"))
    assert payload["pixel_statistics"]["max"] == 29.0
    assert source.read_bytes() == before
    unsafe = subprocess.run(
        [sys.executable, str(SCRIPT), "--input", str(source),
         "--output", str(source)],
        capture_output=True, text=True,
    )
    assert unsafe.returncode == 2
    assert "Refusing to overwrite" in unsafe.stderr
    assert source.read_bytes() == before
