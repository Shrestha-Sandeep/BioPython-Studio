#!/usr/bin/env python3
"""Real TIFF analysis baseline for BioPython Studio; annotations remain required.

Install: python -m pip install numpy scipy scikit-image tifffile matplotlib
Example: python witz_pipeline.py --input img1.tif img2.tif --out results
Supported dimensions: YXC/YXS/CYX and explicit T/Z selections of such arrays.
Witz TIFF sources were converted from HPA JPEG images, NOT raw microscopy.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import sys
from importlib.metadata import version
from pathlib import Path

import numpy as np
import tifffile
from scipy import ndimage as ndi
from skimage import filters, measure, morphology, segmentation

FIELDS = [
    "source", "label", "area_px", "area_um2", "centroid_y", "centroid_x",
    "nuclear_signal_mean", "core_signal_mean", "edge_signal_mean",
    "edge_core_ratio", "raw_calibrated", "segmentation_validated",
]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def extract_plane(data: np.ndarray, axes: str, channel: int, time: int | None, z: int | None) -> np.ndarray:
    """Choose YX plane by named axes; reject ambiguous T/Z or sample dimensions."""
    if len(axes) != data.ndim:
        raise ValueError(f"Axes {axes!r} do not describe shape {data.shape}")
    axes = axes.replace("S", "C")
    if len(set(axes)) != len(axes):
        raise ValueError(f"Duplicate/ambiguous axes: {axes}")
    if "Y" not in axes or "X" not in axes:
        raise ValueError(f"Missing spatial Y/X axes: {axes}")
    selection = []
    for letter, length in zip(axes, data.shape):
        if letter in "YX":
            selection.append(slice(None))
        elif letter == "C":
            if channel < 0 or channel >= length:
                raise ValueError(f"Requested channel {channel} outside C={length}")
            selection.append(channel)
        elif letter in "TZ":
            choice = time if letter == "T" else z
            if choice is None and length != 1:
                raise ValueError(f"{letter} has {length} planes; specify --{letter.lower()} explicitly")
            choice = 0 if choice is None else choice
            if not 0 <= choice < length:
                raise ValueError(f"{letter} plane {choice} is out of bounds")
            selection.append(choice)
        elif length == 1:
            selection.append(0)
        else:
            raise ValueError(f"Unrecognized non-singleton dimension {letter}={length}")
    plane = np.asarray(data[tuple(selection)])
    kept = "".join(letter for letter, idx in zip(axes, selection) if isinstance(idx, slice))
    if plane.ndim != 2 or kept not in ("YX", "XY"):
        raise ValueError(f"Expected an explicit 2D YX plane; got {kept} {plane.shape}")
    return plane if kept == "YX" else plane.T


def read_tiff(path: Path, channel_nucleus: int, channel_signal: int,
              time: int | None = None, z: int | None = None):
    """Read original TIFF values and return source metadata and two YX planes."""
    with tifffile.TiffFile(path) as tif:
        if not tif.series:
            raise ValueError("TIFF has no image series")
        series = tif.series[0]
        axes, shape, dtype = series.axes, tuple(int(x) for x in series.shape), str(series.dtype)
        ome_xml_present = tif.ome_metadata is not None
        if "C" not in axes and "S" not in axes:
            raise ValueError("Two channels are required; do not guess signal channel from grayscale")
        source = series.asarray()
        if source.dtype.kind not in "ui":
            raise ValueError(f"Expected unsigned/integer microscopy image, got {source.dtype}")
        nucleus = extract_plane(source, axes, channel_nucleus, time, z)
        signal = extract_plane(source, axes, channel_signal, time, z)
    if nucleus.shape != signal.shape:
        raise ValueError("Nucleus and signal planes must match")
    meta = {
        "file": path.name, "sha256": sha256(path), "axes": axes,
        "shape": shape, "dtype": dtype, "ome_xml_present": ome_xml_present,
        "series_used": 0, "channel_nucleus": channel_nucleus,
        "channel_signal": channel_signal, "time": time, "z": z,
        "nucleus_min": int(nucleus.min()), "nucleus_max": int(nucleus.max()),
        "signal_min": int(signal.min()), "signal_max": int(signal.max()),
        "source_raw_calibration_verified": False,
    }
    return nucleus, signal, meta


def segment_candidates(nucleus: np.ndarray, *, threshold: float | None,
                       min_area: int, median_radius: int, closing_radius: int,
                       exclude_border: bool) -> tuple[np.ndarray, float, dict]:
    """Candidate mask only; this is not independently validated segmentation."""
    if nucleus.ndim != 2 or nucleus.size == 0:
        raise ValueError("A nonempty 2D channel is required")
    smoothed = (filters.median(nucleus, footprint=morphology.disk(median_radius))
                if median_radius else nucleus)
    cutoff = float(filters.threshold_otsu(smoothed) if threshold is None else threshold)
    mask = smoothed > cutoff
    if closing_radius:
        mask = morphology.binary_closing(mask, footprint=morphology.disk(closing_radius))
    mask = ndi.binary_fill_holes(mask)
    mask = morphology.remove_small_objects(mask, min_size=min_area)
    before = int(measure.label(mask, connectivity=1).max())
    if exclude_border:
        mask = segmentation.clear_border(mask)
    labels = measure.label(mask, connectivity=1)
    return labels, cutoff, {
        "candidate_count": int(labels.max()),
        "candidate_pixels": int(mask.sum()),
        "removed_border_components": before - int(labels.max()) if exclude_border else 0,
    }


def region_rows(labels: np.ndarray, signal: np.ndarray, source: str,
                edge_width: int, pixel_um: float | None) -> list[dict]:
    """Compute candidate region and inner-edge band intensities, no biological claim."""
    rows = []
    for region in measure.regionprops(labels):
        mask = labels == region.label
        core = morphology.binary_erosion(mask, footprint=morphology.disk(edge_width)) & mask
        edge = mask & ~core
        core_mean = float(np.mean(signal[core])) if core.any() else None
        edge_mean = float(np.mean(signal[edge])) if edge.any() else None
        ratio = (edge_mean / core_mean
                 if edge_mean is not None and core_mean is not None and core_mean > 0 else None)
        rows.append({
            "source": source, "label": int(region.label),
            "area_px": int(region.area),
            "area_um2": float(region.area * pixel_um ** 2) if pixel_um is not None else None,
            "centroid_y": float(region.centroid[0]), "centroid_x": float(region.centroid[1]),
            "nuclear_signal_mean": float(signal[mask].mean()),
            "core_signal_mean": core_mean, "edge_signal_mean": edge_mean,
            "edge_core_ratio": ratio,
            "raw_calibrated": False, "segmentation_validated": False,
        })
    return rows


def save_overlay(path: Path, nucleus: np.ndarray, labels: np.ndarray) -> None:
    """Produce a clearly labeled diagnostic PNG; never overwrite the source."""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    lo, hi = np.percentile(nucleus, [1, 99])
    if hi <= lo: hi = lo + 1
    fig, ax = plt.subplots(figsize=(5, 5))
    ax.imshow(nucleus, cmap="gray", vmin=lo, vmax=hi)
    ax.imshow(np.ma.masked_where(labels == 0, labels > 0), cmap="autumn", alpha=0.33)
    ax.set_title("Candidate mask — NOT verified cells")
    ax.set_axis_off()
    fig.tight_layout()
    fig.savefig(path, dpi=120)
    plt.close(fig)


def analyze(inputs: list[Path], output: Path, *, nucleus_channel: int, signal_channel: int,
            t: int | None = None, z: int | None = None, threshold: float | None = None,
            min_area: int = 30, median_radius: int = 2, closing_radius: int = 2,
            edge_width: int = 2, pixel_um: float | None = None,
            exclude_border: bool = False) -> dict:
    if not inputs or len({p.resolve() for p in inputs}) != len(inputs):
        raise ValueError("Provide at least one unique TIFF source")
    if min_area < 1 or min(median_radius, closing_radius) < 0 or edge_width < 1:
        raise ValueError("Invalid morphological parameter")
    if pixel_um is not None and pixel_um <= 0:
        raise ValueError("Pixel size must be positive and independently verified")
    if nucleus_channel == signal_channel:
        raise ValueError("Nucleus and signal channel must be different")
    output.mkdir(parents=True, exist_ok=True)
    rows: list[dict] = []
    manifest = {
        "workflow": "BioPython Studio Witz-aligned real-TIFF learner baseline",
        "limits": "No independent annotation, no biological replicate inference, no calibrated raw data claim.",
        "parameters": {
            "nucleus_channel": nucleus_channel, "signal_channel": signal_channel,
            "t": t, "z": z, "threshold": threshold, "min_area": min_area,
            "median_radius": median_radius, "closing_radius": closing_radius,
            "edge_width": edge_width, "pixel_um_user_supplied_unverified": pixel_um,
            "exclude_border": exclude_border,
        },
        "images": [],
        "runtime": {
            "python": sys.version.split()[0],
            **{lib: version(lib) for lib in ("numpy","scipy","scikit-image","tifffile","matplotlib")},
        },
    }
    for path in inputs:
        if path.suffix.lower() not in (".tif", ".tiff"):
            raise ValueError(f"Only original TIFF/OME-TIFF supported: {path}")
        nucleus, signal, meta = read_tiff(path, nucleus_channel, signal_channel, t, z)
        labels, used_threshold, qc = segment_candidates(
            nucleus, threshold=threshold, min_area=min_area,
            median_radius=median_radius, closing_radius=closing_radius,
            exclude_border=exclude_border,
        )
        table = region_rows(labels, signal, path.name, edge_width, pixel_um)
        rows.extend(table)
        stem = "".join(c if c.isalnum() or c in "-_" else "_" for c in path.stem)[:70]
        overlay_file = stem + "_" + meta["sha256"][:8] + "_candidates.png"
        save_overlay(output / overlay_file, nucleus, labels)
        manifest["images"].append({
            **meta, **qc, "threshold_used": used_threshold,
            "overlay": overlay_file, "candidate_region_rows": len(table),
        })
    with (output / "regions.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", nargs="+", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--nucleus-channel", type=int, default=2,
                        help="Witz RGB convention: index 2 is nucleus-associated blue")
    parser.add_argument("--signal-channel", type=int, default=1,
                        help="Witz RGB convention: index 1 is the green protein signal")
    parser.add_argument("--t", type=int, default=None)
    parser.add_argument("--z", type=int, default=None)
    parser.add_argument("--threshold", type=float, default=None)
    parser.add_argument("--min-area", type=int, default=30)
    parser.add_argument("--median-radius", type=int, default=2)
    parser.add_argument("--closing-radius", type=int, default=2)
    parser.add_argument("--edge-width", type=int, default=2)
    parser.add_argument("--pixel-um", type=float, default=None,
                        help="Use only when separately verified against acquisition metadata")
    parser.add_argument("--exclude-border", action="store_true")
    args = parser.parse_args()
    summary = analyze(args.input, args.out, nucleus_channel=args.nucleus_channel,
                      signal_channel=args.signal_channel, t=args.t, z=args.z,
                      threshold=args.threshold, min_area=args.min_area,
                      median_radius=args.median_radius, closing_radius=args.closing_radius,
                      edge_width=args.edge_width, pixel_um=args.pixel_um,
                      exclude_border=args.exclude_border)
    print(f"Candidate objects: {sum(x['candidate_count'] for x in summary['images'])}")
    print("Saved regions.csv, manifest.json and diagnostic overlays; not validated biological counts.")


if __name__ == "__main__":
    main()
