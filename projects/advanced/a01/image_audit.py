#!/usr/bin/env python3
"""Conservative source-image audit for BioPython Studio A01.

This utility audits TIFF/OME-TIFF *metadata and native pixels*. It never calls
an object a cell, and never assumes that recorded OME pixel size is calibrated.
Use Fiji/Bio-Formats for vendor formats not decoded by tifffile.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import sys
from pathlib import Path
from xml.etree import ElementTree

import numpy as np
import tifffile

DEFAULT_MAX_BYTES = 256 * 1024 * 1024


class AuditError(ValueError):
    """Input is missing, unsupported or scientifically ambiguous."""


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def declared_pixel_size(ome_xml: str | None) -> dict | None:
    """Report OME XML declarations, without treating them as verified scale."""
    if not ome_xml:
        return None
    try:
        root = ElementTree.fromstring(ome_xml)
        pixels = root.find(".//{*}Pixels")
        if pixels is None:
            return None
        x, y = pixels.get("PhysicalSizeX"), pixels.get("PhysicalSizeY")
        if x is None or y is None:
            return None
        xval, yval = float(x), float(y)
        if not all(math.isfinite(v) and v > 0 for v in (xval, yval)):
            return None
        xunit = pixels.get("PhysicalSizeXUnit", "µm")
        yunit = pixels.get("PhysicalSizeYUnit", "µm")
        return {
            "x": xval, "y": yval,
            "x_unit": xunit, "y_unit": yunit,
            "status": "DECLARED_IN_OME_XML_NOT_INDEPENDENTLY_VERIFIED",
        }
    except (ElementTree.ParseError, ValueError, TypeError, OverflowError):
        return None


def _index_choice(axis: str, length: int, value: int | None) -> int:
    if value is None:
        if length != 1:
            raise AuditError(
                f"{axis} has {length} planes; select --"
                + {"C": "channel", "T": "time", "Z": "z"}[axis]
            )
        return 0
    if not isinstance(value, int) or not 0 <= value < length:
        raise AuditError(f"Requested {axis}={value} is outside 0..{length - 1}")
    return value


def select_yx_plane(data: np.ndarray, axes: str, *, channel: int | None = None,
                    time: int | None = None, z: int | None = None) -> tuple[np.ndarray, dict]:
    """Select an explicit native YX plane; fail instead of guessing dimensions."""
    if len(axes) != data.ndim:
        raise AuditError(f"Axes {axes!r} do not match shape {data.shape}")
    names = axes.upper().replace("S", "C")
    if len(names) != len(set(names)) or set(names) - set("TCZYX"):
        raise AuditError(f"Unsupported or ambiguous axes: {axes!r}")
    if names.count("Y") != 1 or names.count("X") != 1:
        raise AuditError(f"Expected spatial Y and X in {axes!r}")
    if "C" not in names and channel not in (None, 0):
        raise AuditError("Image has no channel axis; do not invent a channel")
    if "T" not in names and time not in (None, 0):
        raise AuditError("Image has no time axis")
    if "Z" not in names and z not in (None, 0):
        raise AuditError("Image has no Z axis")
    selectors: list[int | slice] = []
    chosen = {}
    for name, length in zip(names, data.shape):
        if name in "YX":
            selectors.append(slice(None))
        else:
            chosen[name] = _index_choice(
                name, int(length),
                {"C": channel, "T": time, "Z": z}[name],
            )
            selectors.append(chosen[name])
    plane = np.asarray(data[tuple(selectors)])
    retained = "".join(name for name, selector in zip(names, selectors)
                       if isinstance(selector, slice))
    if retained not in ("YX", "XY") or plane.ndim != 2:
        raise AuditError("Selection did not yield a 2D spatial plane")
    if retained == "XY":
        plane = plane.T
    if plane.size == 0:
        raise AuditError("Selected plane is empty")
    return plane, {
        "channel": chosen.get("C"),
        "time": chosen.get("T"),
        "z": chosen.get("Z"),
        "yx_shape": list(plane.shape),
    }


def audit_image(path: Path, *, channel: int | None = None,
                time: int | None = None, z: int | None = None,
                max_uncompressed_bytes: int = DEFAULT_MAX_BYTES) -> dict:
    """Audit one native source file with transparent memory and metadata limits."""
    path = Path(path)
    if path.suffix.lower() not in (".tif", ".tiff"):
        raise AuditError("Supported inputs are .tif and .tiff; other/vendor formats need a separate reader")
    if not path.is_file():
        raise AuditError(f"Input file not found: {path}")
    if max_uncompressed_bytes <= 0:
        raise AuditError("Uncompressed-memory limit must be positive")
    with tifffile.TiffFile(path) as handle:
        if not handle.series:
            raise AuditError("TIFF contains no image series")
        series = handle.series[0]
        shape = tuple(int(v) for v in series.shape)
        native_dtype = np.dtype(series.dtype)
        required = math.prod(shape) * native_dtype.itemsize
        if required > max_uncompressed_bytes:
            raise AuditError(
                f"Series requires at least {required} uncompressed bytes, "
                f"exceeding limit {max_uncompressed_bytes}; use a local tiled/streaming workflow"
            )
        if native_dtype.kind not in "uif":
            raise AuditError(f"Unsupported nonnumeric image dtype: {native_dtype}")
        axes = str(series.axes)
        # Check axes and requested selections *before* decoding the full array.
        placeholder = np.empty((0,) * len(shape), dtype=native_dtype)
        # Avoid allocating any large array here: stride-trick shape proxy.
        del placeholder
        normalized = axes.upper().replace("S", "C")
        if (len(axes) != len(shape) or len(normalized) != len(set(normalized))
                or set(normalized) - set("TCZYX") or "X" not in normalized or "Y" not in normalized):
            raise AuditError(f"Unsupported or ambiguous TIFF axes: {axes!r}")
        for a, choice in (("C", channel), ("T", time), ("Z", z)):
            if a in normalized:
                _index_choice(a, shape[normalized.index(a)], choice)
            elif choice not in (None, 0):
                raise AuditError(f"Requested {a} but source has no {a} axis")
        ome = handle.ome_metadata
        pixel_size = declared_pixel_size(ome)
        try:
            source = series.asarray()
        except Exception as exc:
            raise AuditError(f"TIFF decoder could not read the source series: {exc}") from exc
        plane, selection = select_yx_plane(
            source, axes, channel=channel, time=time, z=z
        )
    finite = np.isfinite(plane)
    finite_count = int(finite.sum())
    if finite_count == 0:
        raise AuditError("Selected image has no finite numeric pixels")
    values = plane[finite]
    image_min, image_max = float(np.min(values)), float(np.max(values))
    if not math.isfinite(image_min) or not math.isfinite(image_max):
        raise AuditError("Image statistics overflowed; convert to a supported numeric representation")
    at_dtype_max = None
    if np.issubdtype(native_dtype, np.integer):
        at_dtype_max = int(np.count_nonzero(values == np.iinfo(native_dtype).max))
    return {
        "schema_version": "bps.advanced.image-audit.v1",
        "source_name": path.name,
        "source_sha256": sha256_file(path),
        "series_index": 0,
        "original_axes": axes,
        "native_shape": list(shape),
        "native_dtype": str(native_dtype),
        "uncompressed_series_bytes": required,
        "selection": selection,
        "pixel_statistics": {
            "finite_count": finite_count,
            "nonfinite_count": int(plane.size - finite_count),
            "min": image_min, "max": image_max,
            "mean": float(np.mean(values, dtype=np.float64)),
            "at_integer_dtype_max_count": at_dtype_max,
        },
        "ome_xml_present": ome is not None,
        "pixel_size_declaration": pixel_size,
        "scale_independently_verified": False,
        "scientific_warnings": [
            "Declared pixel size does not prove physical calibration.",
            "Pixel values and apparent saturation do not establish a quantitative biological result.",
            "TIFF container and bit depth alone do not establish camera-native raw provenance.",
            "No segmentation or object identity is verified by this audit.",
        ],
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--channel", type=int)
    parser.add_argument("--time", type=int)
    parser.add_argument("--z", type=int)
    parser.add_argument("--max-mib", type=int, default=256)
    parser.add_argument("--output", type=Path, help="Optional JSON output path; never the source path")
    args = parser.parse_args(argv)
    try:
        if args.output and args.input.resolve() == args.output.resolve():
            raise AuditError("Refusing to overwrite the source image")
        result = audit_image(
            args.input, channel=args.channel, time=args.time, z=args.z,
            max_uncompressed_bytes=args.max_mib * 1024 * 1024,
        )
        encoded = json.dumps(result, indent=2, ensure_ascii=False, allow_nan=False)
        if args.output:
            args.output.parent.mkdir(parents=True, exist_ok=True)
            args.output.write_text(encoded + "\n", encoding="utf-8")
        else:
            print(encoded)
        return 0
    except (AuditError, tifffile.TiffFileError, OSError) as exc:
        print(f"Image audit failed: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
