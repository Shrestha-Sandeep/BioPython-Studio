"""A00: local scientific Python bridge (interpreter, files, functions, tests).

This is intentionally a standalone reproducibility check, NOT evidence of the
learner running on their computer. Fresh local execution requires recording
the real interpreter, installed package versions, original data hash and Git
commit using the commands in A00/README.md.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import platform
import sys
from importlib import metadata
from pathlib import Path


class BridgeError(ValueError):
    pass


def inspect_sample_table(path: Path) -> dict:
    """Read a small three-column input; fail clearly on missing/duplicate IDs."""
    path = Path(path)
    if path.suffix.lower() != ".csv":
        raise BridgeError("Input must be a CSV, not an unknown file extension")
    with path.open(newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        required = {"sample_id", "animal_id", "value"}
        if not required.issubset(reader.fieldnames or []):
            raise BridgeError(f"Expected sample_id, animal_id and value; got {reader.fieldnames}")
        rows = list(reader)
    if not rows:
        raise BridgeError("CSV is empty")
    seen: set[str] = set()
    values = []
    for line, row in enumerate(rows, 2):
        identity, animal = (row["sample_id"] or "").strip(), (row["animal_id"] or "").strip()
        if not identity or not animal or identity in seen:
            raise BridgeError(f"Line {line} has a duplicate/missing sample/animal ID")
        seen.add(identity)
        try:
            val = float(row["value"])
        except (TypeError, ValueError) as exc:
            raise BridgeError(f"Line {line} has invalid numeric value") from exc
        if not __import__("math").isfinite(val):
            raise BridgeError(f"Line {line} has nonfinite numeric value")
        values.append(val)
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    return {
        "source_sha256": digest, "rows": len(rows),
        "biological_animals": len({r["animal_id"] for r in rows}),
        "sample_mean": sum(values) / len(values),
        "warning": "A per-row mean is not an independent animal-level estimate.",
    }


def environment() -> dict:
    packages = {}
    for name in ("numpy", "scipy", "pandas", "tifffile", "pytest", "scikit-image"):
        try:
            packages[name] = metadata.version(name)
        except metadata.PackageNotFoundError:
            packages[name] = None
    return {
        "interpreter": sys.executable,
        "python_version": sys.version.split()[0],
        "platform": platform.platform(),
        "cwd": str(Path.cwd().resolve()),
        "packages": packages,
        "warning": "Notebook kernel may differ from this interpreter; inspect sys.executable in that kernel.",
    }


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--input", type=Path, required=True)
    p.add_argument("--out", type=Path, required=True, help="New JSON file, never source CSV")
    args = p.parse_args(argv)
    try:
        if args.out.resolve() == args.input.resolve() or args.out.exists():
            raise BridgeError("Refusing to overwrite existing input/output")
        result = {"environment": environment(), "sample_table": inspect_sample_table(args.input)}
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(json.dumps(result, indent=2, allow_nan=False) + "\n", encoding="utf-8")
        print(f"Scanned {result['sample_table']['rows']} rows with {result['sample_table']['biological_animals']} animals")
        return 0
    except (BridgeError, OSError, ValueError) as exc:
        print(f"A00 refused: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
