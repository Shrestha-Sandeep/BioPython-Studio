"""A07 independent research-capstone evidence checker (NOT a grading model).

Inspects seven scientific-workflow evidence checkpoints. An executable code
test cannot verify accuracy of expert labels, true independent experiments,
appropriate biology or human mastery. The tool only checks whether reported
evidence is internally coherent, and explicitly refuses a "scientifically
validated" pass even when all technical files are present.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import sys
from collections import defaultdict
from pathlib import Path


class EvidenceError(ValueError):
    pass


def _load_json(path: Path) -> dict:
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        raise EvidenceError(f"Missing or invalid JSON: {path.name}") from exc
    if not isinstance(obj, dict):
        raise EvidenceError(f"{path.name} must be a JSON object")
    return obj


def _csv_rows(path: Path) -> list[dict]:
    try:
        with path.open(newline="", encoding="utf-8-sig") as stream:
            rows = list(csv.DictReader(stream))
    except OSError as exc:
        raise EvidenceError(f"Missing CSV {path.name}") from exc
    if not rows:
        raise EvidenceError(f"{path.name} has no records")
    return rows


def validate_evidence(folder: Path) -> dict:
    root = Path(folder).resolve()
    if not root.is_dir():
        raise EvidenceError("Capstone evidence must be an existing directory")
    plan = _load_json(root / "project_plan.json")
    required_plan = (
        "biological_question", "target_definition", "inclusion_rules",
        "exclusion_rules", "primary_endpoint", "biological_unit",
        "prespecified_acceptance", "known_confounders",
    )
    missing = [name for name in required_plan if not plan.get(name)]
    if missing:
        raise EvidenceError(f"Plan must predeclare: {missing}")
    if plan["biological_unit"] in ("cell", "pixel", "candidate", "object", "field"):
        raise EvidenceError("Biological unit cannot automatically be a pixel/cell/field")
    if plan.get("reviewed_holdout_before_freeze") is not False:
        raise EvidenceError("Must explicitly declare holdout was NOT inspected before method freeze")

    audits = _load_json(root / "source_audit.json")
    audit_rows = audits.get("images", [])
    if not isinstance(audit_rows, list) or len(audit_rows) < 2:
        raise EvidenceError("Source audit requires >=2 individual images")
    audited: dict[str, str] = {}
    for item in audit_rows:
        if not isinstance(item, dict):
            raise EvidenceError("Malformed source audit row")
        identity = item.get("image_id")
        checksum = item.get("source_sha256")
        axes = item.get("axes")
        if (not identity or identity in audited or not isinstance(checksum, str)
                or not re.fullmatch(r"[0-9a-f]{64}", checksum)):
            raise EvidenceError("Each audited image needs a unique ID and SHA-256")
        if not isinstance(axes, str) or "X" not in axes or "Y" not in axes:
            raise EvidenceError(f"Audit {identity} lacks declared YX axes")
        if not item.get("native_dtype"):
            raise EvidenceError(f"Audit {identity} lacks native dtype")
        if item.get("scale_independently_verified") not in (True, False):
            raise EvidenceError("Calibration verification status must be explicit")
        audited[identity] = checksum
    split = _csv_rows(root / "split_manifest.csv")
    groups: dict[str, str] = {}
    identities: set[str] = set()
    split_rows: dict[str, dict] = {}
    for row in split:
        identity = row.get("image_id", "")
        group = row.get("biological_group_id", "")
        partition = row.get("split")
        sha = row.get("source_sha256")
        if (identity not in audited or identity in identities or not group
                or partition not in ("development", "holdout")):
            raise EvidenceError("Unrecognized/duplicate image or invalid group/split")
        if sha != audited[identity]:
            raise EvidenceError(f"Source checksum disagreement: {identity}")
        if group in groups and groups[group] != partition:
            raise EvidenceError(f"Biological group {group!r} leaks into both splits")
        groups[group] = partition
        identities.add(identity)
        split_rows[identity] = row
    if identities != set(audited):
        raise EvidenceError("Every source-audited image must appear once in the split manifest")
    if set(groups.values()) != {"development", "holdout"}:
        raise EvidenceError("Both development and holdout groups required")

    metrics = _load_json(root / "evaluation.json")
    rows = metrics.get("holdout_images", [])
    if not isinstance(rows, list) or not rows:
        raise EvidenceError("No independently annotated held-out image metrics supplied")
    evaluated: set[str] = set()
    for row in rows:
        identity = row.get("image_id")
        if identity in evaluated or identity not in split_rows:
            raise EvidenceError("Metric image ID duplicated or not in source manifest")
        evaluated.add(identity)
        if split_rows[identity]["split"] != "holdout":
            raise EvidenceError("Development images cannot be reported as held-out")
        try:
            tp, fp, fn = (int(row[k]) for k in ("tp", "fp", "fn"))
        except (ValueError, TypeError, KeyError) as exc:
            raise EvidenceError("Object TP/FP/FN must be provided as integers") from exc
        if min(tp, fp, fn) < 0:
            raise EvidenceError("TP/FP/FN cannot be negative")
        expected = 2*tp/(2*tp+fp+fn) if 2*tp+fp+fn else 1.0
        observed = row.get("object_f1")
        if not isinstance(observed, (int, float)) or abs(observed - expected) > 1e-6:
            raise EvidenceError(f"Inconsistent F1 for image {identity}")
        if not row.get("annotation_source") or not row.get("annotation_rule"):
            raise EvidenceError("Every annotated result needs annotation provenance and object definition")
    if set(identity for identity, r in split_rows.items() if r["split"] == "holdout") != evaluated:
        raise EvidenceError("Evaluation must account for every held-out image")

    reproduce = _load_json(root / "reproduction.json")
    for key in ("source_commit", "local_environment", "run_command", "result_manifest_sha256"):
        if not reproduce.get(key):
            raise EvidenceError(f"Reproduction log lacks {key}")
    if reproduce.get("fresh_checkout_executed") is not True:
        raise EvidenceError("Fresh checkout reproducibility has NOT been self-reported")
    if reproduce.get("source_hashes_checked") is not True:
        raise EvidenceError("Source hashes must be checked before reporting reproducibility")

    failures = _csv_rows(root / "failure_cases.csv")
    allowed = {"merge", "split", "miss", "spurious", "annotation_ambiguous",
               "saturation", "background", "other", "none_observed"}
    for r in failures:
        if r.get("error_type") not in allowed or len((r.get("note") or "").strip()) < 12:
            raise EvidenceError("Failure gallery needs a recognized error type and clear note")
        if r.get("image_id") and r["image_id"] not in evaluated:
            raise EvidenceError("Failure case must name a held-out image")
    methods = (root / "methods_and_limitations.md").read_text(encoding="utf-8")
    if len(methods.split()) < 180:
        raise EvidenceError("Methods/limitations memo needs at least 180 words")
    for word in ("limitation", "annotation", "biological", "uncertainty", "decision"):
        if word not in methods.lower():
            raise EvidenceError(f"Memo must discuss {word}")

    return {
        "schema_version": "bps.advanced.a07-evidence.v1",
        "technical_structure_checked": True,
        "checkpoints_structurally_present": 7,
        "audited_images": len(audited),
        "heldout_images": len(evaluated),
        "declared_biological_groups": len(groups),
        "reported_failure_cases": len(failures),
        "scientifically_validated": False,
        "independent_learner_mastery_certified": False,
        "human_review_required": True,
        "warnings": [
            "Self-reported holdout secrecy and fresh checkout cannot be verified by this script.",
            "Group IDs may not reflect genuinely independent biological experiments.",
            "Original annotations can be unreliable; object accuracy and scientific significance need human review.",
            "A failed segmentation can be scientifically sound if error causes and next steps are explained.",
            "No numerical pass/9.5 score or publication-level conclusion is assigned by code.",
        ],
    }


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--evidence", type=Path, required=True)
    p.add_argument("--report", type=Path, help="Optional JSON output; must be outside evidence directory")
    args = p.parse_args(argv)
    try:
        outcome = validate_evidence(args.evidence)
        rendered = json.dumps(outcome, indent=2, ensure_ascii=False) + "\n"
        if args.report:
            if args.report.resolve().is_relative_to(args.evidence.resolve()):
                raise EvidenceError("Write evidence review outside the submitted evidence directory")
            args.report.parent.mkdir(parents=True, exist_ok=True)
            args.report.write_text(rendered, encoding="utf-8")
        print(rendered)
        return 0
    except (EvidenceError, OSError, ValueError) as exc:
        print(f"A07 evidence incomplete/invalid: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
