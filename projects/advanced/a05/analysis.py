"""A05: scientifically conservative animal-/specimen-level image statistics.

Input is a deidentified, tidy CSV; no individual cell/field is treated as an
independent biological replicate. Bootstrap resamples animals (unpaired) or
complete pairs, never cells. A returned interval is a method-specific
uncertainty estimate, not proof of causality, normality or external validity.

Run: python -m projects.advanced.a05.analysis --help
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import os
import platform
import sys
from collections import defaultdict
from dataclasses import asdict, dataclass
from importlib import metadata
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np


class DesignError(ValueError):
    """Invalid inference unit, pairing, missing data or output convention."""


@dataclass(frozen=True)
class AnalysisPlan:
    control: str
    treatment: str
    design: str = "unpaired"  # or "paired"
    bootstrap_draws: int = 2000
    seed: int = 4721
    confidence: float = 0.95

    def validate(self):
        if not all(isinstance(x, str) and x.strip() for x in (self.control, self.treatment)):
            raise DesignError("Both control and treatment labels are required")
        if self.control == self.treatment:
            raise DesignError("Control and treatment must differ")
        if self.design not in ("paired", "unpaired"):
            raise DesignError("Design must be paired or unpaired")
        if not isinstance(self.seed, int):
            raise DesignError("Bootstrap seed must be an integer")
        if not 100 <= self.bootstrap_draws <= 100_000:
            raise DesignError("Use 100..100000 bootstrap replicates")
        if not 0.5 <= self.confidence < 1:
            raise DesignError("Confidence level must lie in [0.5, 1)")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def load_biological_units(path: Path, plan: AnalysisPlan) -> tuple[list[dict], dict]:
    """Collapse technical fields per animal, preserving all exclusions.

    Required fields: animal_id, condition, field_id, signal. Optional
    exclusion_reason, pair_id. Missing/nonfinite signals are NOT silently
    dropped; explicitly excluded rows may contain missing signals.
    """
    plan.validate()
    with Path(path).open("r", newline="", encoding="utf-8-sig") as stream:
        reader = csv.DictReader(stream)
        required = {"animal_id", "condition", "field_id", "signal"}
        if not required.issubset(reader.fieldnames or []):
            raise DesignError(f"Missing required CSV columns: {sorted(required-set(reader.fieldnames or []))}")
        raw = list(reader)
    if not raw:
        raise DesignError("CSV has no observations")
    seen: set[tuple[str, str, str]] = set()
    values: dict[tuple[str, str], list[float]] = defaultdict(list)
    pairs: dict[tuple[str, str], str] = {}
    known_group: dict[str, set[str]] = defaultdict(set)
    exclusions: list[dict] = []
    for line, row in enumerate(raw, start=2):
        animal = (row.get("animal_id") or "").strip()
        group = (row.get("condition") or "").strip()
        field = (row.get("field_id") or "").strip()
        if not animal or not field or group not in (plan.control, plan.treatment):
            raise DesignError(f"Line {line}: invalid animal, field or condition")
        key = (animal, group, field)
        if key in seen:
            raise DesignError(f"Line {line}: duplicate field/animal/condition {key}")
        seen.add(key)
        excluded = (row.get("exclusion_reason") or "").strip()
        pair = (row.get("pair_id") or "").strip()
        if plan.design == "paired" and not pair:
            raise DesignError(f"Line {line}: pair_id is required for matched designs")
        if plan.design == "unpaired" and pair:
            raise DesignError(f"Line {line}: pair_id present in declared unpaired design")
        known_group[animal].add(group)
        if plan.design == "unpaired" and len(known_group[animal]) > 1:
            raise DesignError(f"Animal {animal!r} appears in both unpaired groups")
        if excluded:
            exclusions.append({"line": line, "animal_id": animal, "condition": group,
                               "field_id": field, "reason": excluded})
            continue
        try:
            v = float(row["signal"])
        except (ValueError, TypeError) as exc:
            raise DesignError(f"Line {line}: missing or nonnumeric signal without exclusion") from exc
        if not math.isfinite(v):
            raise DesignError(f"Line {line}: nonfinite signal without exclusion")
        gkey = (animal, group)
        if gkey in pairs and pairs[gkey] != pair:
            raise DesignError(f"Animal {animal!r} has inconsistent pair_id")
        pairs[gkey] = pair
        values[gkey].append(v)
    units = [{"animal_id": a, "condition": c, "pair_id": pairs[(a,c)],
              "fields_included": len(v), "animal_mean": float(np.mean(v)),
              "animal_sd_technical": float(np.std(v, ddof=1)) if len(v) > 1 else None}
             for (a,c),v in sorted(values.items())]
    if not units:
        raise DesignError("No nonexcluded biological measurements")
    units_by_group = {
        group: [row for row in units if row["condition"] == group]
        for group in (plan.control, plan.treatment)
    }
    if plan.design == "unpaired":
        for group, obs in units_by_group.items():
            if len(obs) < 3:
                raise DesignError(f"Need at least 3 independent biological units in {group!r}")
    else:
        by_pair: dict[str, set[str]] = defaultdict(set)
        pair_animal: dict[tuple[str, str], set[str]] = defaultdict(set)
        for u in units:
            by_pair[u["pair_id"]].add(u["condition"])
            pair_animal[(u["pair_id"], u["condition"])].add(u["animal_id"])
        if len(by_pair) < 3:
            raise DesignError("Paired inference needs at least 3 complete independent pairs")
        if any(conditions != {plan.control, plan.treatment} for conditions in by_pair.values()):
            raise DesignError("Every pair must have a control and treatment biological unit")
        if any(len(ids) != 1 for ids in pair_animal.values()):
            raise DesignError("Every pair-condition must correspond to exactly one animal")
        if len({u["animal_id"] for u in units}) < 3:
            raise DesignError("At least 3 independent paired experimental units are required")
        # Detect reuse of same animal within different pair IDs.
        id_to_pair: dict[str, set[str]] = defaultdict(set)
        for u in units:
            id_to_pair[u["animal_id"]].add(u["pair_id"])
        if any(len(pids) != 1 for pids in id_to_pair.values()):
            raise DesignError("An animal appears in multiple independent pairs")
    return units, {
        "measurements_input": len(raw),
        "measurements_included": sum(len(v) for v in values.values()),
        "measurements_excluded": len(exclusions),
        "exclusions": exclusions,
        "independent_group_counts": {g: len(u) for g,u in units_by_group.items()},
        "inference_unit": "animal/pair, not field/cell",
        "note": "Exclusion reasons must be prespecified; the program cannot determine if they were chosen post hoc.",
    }


def estimate_effect(units: list[dict], plan: AnalysisPlan) -> dict:
    """Mean treatment minus control with cluster-aware percentile interval."""
    plan.validate()
    control = np.array([row["animal_mean"] for row in units
                        if row["condition"] == plan.control], dtype=float)
    treatment = np.array([row["animal_mean"] for row in units
                          if row["condition"] == plan.treatment], dtype=float)
    rng = np.random.default_rng(plan.seed)
    if plan.design == "paired":
        by_pair = defaultdict(dict)
        for row in units:
            by_pair[row["pair_id"]][row["condition"]] = float(row["animal_mean"])
        diffs = np.array([
            vals[plan.treatment] - vals[plan.control]
            for _, vals in sorted(by_pair.items())
        ], dtype=float)
        observed = float(np.mean(diffs))
        idx = rng.integers(0, len(diffs), size=(plan.bootstrap_draws, len(diffs)))
        simulated = np.mean(diffs[idx], axis=1)
        n = len(diffs)
    else:
        observed = float(np.mean(treatment) - np.mean(control))
        c_idx = rng.integers(0, len(control), size=(plan.bootstrap_draws, len(control)))
        t_idx = rng.integers(0, len(treatment), size=(plan.bootstrap_draws, len(treatment)))
        simulated = np.mean(treatment[t_idx], axis=1) - np.mean(control[c_idx], axis=1)
        n = len(treatment) + len(control)
    a = (1.0 - plan.confidence) / 2
    interval = np.quantile(simulated, [a, 1-a])
    return {
        "plan": asdict(plan),
        "effect": "mean_treatment_minus_control",
        "difference_of_biological_unit_means": observed,
        "percentile_bootstrap_ci": [float(interval[0]), float(interval[1])],
        "bootstrap_method": "resample_whole_pairs" if plan.design == "paired"
                            else "resample_biological_animals_per_group",
        "independent_unit_count": n,
        "control_animal_mean": float(np.mean(control)),
        "treatment_animal_mean": float(np.mean(treatment)),
        "warnings": [
            "Confidence intervals depend on representative independent biological units and a prespecified experimental design.",
            "Bootstrap percentile intervals can be unstable for small sample sizes; no significance or causality claim.",
            "Many fields per animal do not increase independent sample N.",
            "A matched design is not an unmatched test; mixed-effects models require additional justified design evidence.",
        ],
    }


def plot_independent_units(units: list[dict], plan: AnalysisPlan, path: Path) -> None:
    fig, ax = plt.subplots(figsize=(6.8, 4.3))
    groups = (plan.control, plan.treatment)
    for x, group in enumerate(groups):
        vals = [u["animal_mean"] for u in units if u["condition"] == group]
        ax.scatter([x] * len(vals), vals, s=34, label=f"{group} (n={len(vals)})")
        ax.hlines(np.mean(vals), x-0.2, x+0.2, linewidth=2)
    if plan.design == "paired":
        pairs = defaultdict(dict)
        for u in units:
            pairs[u["pair_id"]][u["condition"]] = u["animal_mean"]
        for pair in pairs.values():
            ax.plot([0, 1], [pair[plan.control], pair[plan.treatment]], alpha=.3)
    ax.set_xticks(range(len(groups)), groups)
    ax.set_ylabel("Mean signal per animal (input units; verify calibration)")
    ax.set_title(f"Independent biological units · {plan.design} design")
    ax.grid(axis="y", alpha=.2)
    fig.tight_layout()
    fig.savefig(path, dpi=160)
    plt.close(fig)


def run(input_csv: Path, output_dir: Path, plan: AnalysisPlan) -> dict:
    input_csv, output_dir = Path(input_csv).resolve(), Path(output_dir).resolve()
    if output_dir.exists() or output_dir == input_csv or input_csv.is_relative_to(output_dir):
        raise DesignError("Choose a NEW output directory outside the input; no silent overwrite")
    units, qc = load_biological_units(input_csv, plan)
    estimate = estimate_effect(units, plan)
    report = {
        "schema_version": "bps.advanced.animal-statistics.v1",
        "source_csv_name": input_csv.name,
        "source_sha256": sha256_file(input_csv),
        "units": "input signal units per animal; no physical calibration inferred",
        "qc": qc, "estimate": estimate,
        "environment": {pkg: metadata.version(pkg) for pkg in ("numpy", "matplotlib")},
        "python_version": platform.python_version(),
        "scientific_validation": "UNVERIFIED_OUTSIDE_STUDY_DESIGN",
    }
    output_dir.mkdir(parents=True, exist_ok=False)
    try:
        with (output_dir / "animal_summary.csv").open("w", newline="", encoding="utf-8") as fh:
            writer = csv.DictWriter(fh, fieldnames=[
                "animal_id", "condition", "pair_id", "fields_included",
                "animal_mean", "animal_sd_technical",
            ])
            writer.writeheader()
            writer.writerows(units)
        plot_independent_units(units, plan, output_dir / "animal_units.png")
        (output_dir / "analysis.json").write_text(
            json.dumps(report, indent=2, ensure_ascii=False, allow_nan=False) + "\n", encoding="utf-8"
        )
    except Exception:
        # Prevent a partially populated output from being mistaken for a complete run.
        (output_dir / "INCOMPLETE.txt").write_text(
            "An export failed. Do not treat this directory as a valid analysis.\n", encoding="utf-8"
        )
        raise
    return report


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--control", required=True)
    parser.add_argument("--treatment", required=True)
    parser.add_argument("--design", choices=("paired", "unpaired"), default="unpaired")
    parser.add_argument("--seed", type=int, default=4721)
    parser.add_argument("--draws", type=int, default=2000)
    args = parser.parse_args(argv)
    try:
        plan = AnalysisPlan(control=args.control, treatment=args.treatment,
                            design=args.design, bootstrap_draws=args.draws, seed=args.seed)
        report = run(args.input, args.out, plan)
        print(json.dumps(report["estimate"], indent=2))
        return 0
    except (DesignError, OSError, ValueError) as exc:
        print(f"A05 analysis refused: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
