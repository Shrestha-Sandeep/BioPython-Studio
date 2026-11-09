"""All 52 advanced activities mapped to traceable scientific source families."""
from __future__ import annotations

import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]


def test_52_individual_goal_references_and_no_copying():
    mapping=json.loads((ROOT/"curriculum/advanced_reference_map_v1.json").read_text(encoding="utf-8"))
    assert mapping["schema_version"]=="bps.advanced.references.v1"
    assert mapping["goal_count"]==52
    assert len(mapping["entries"])==52
    chapters=("A00","A01","A02","A03","A05","A06","A07")
    ids=[]
    for cid in chapters:
        lesson=json.loads((ROOT/"content"/cid.lower()/"lesson.json").read_text(encoding="utf-8"))
        ids.extend(goal["id"] for goal in [*lesson["goals"],lesson["capstone"],lesson["review"]])
    assert {x["goal_id"] for x in mapping["entries"]}==set(ids)
    assert len(set(ids))==52
    for row in mapping["entries"]:
        assert row["chapter_id"] in chapters
        assert row["resource_url"].startswith("https://")
        assert row["resource_name"] and row["resource_section_scope"]
        assert row["source_version_policy"] and row["unsupported_claim"]
        assert row["new_biological_or_research_problem"]
        assert "No external protected" in row["media_or_code_reproduction"]
        assert "not yet established" in row["evidence_at_authoring"]


def test_advanced_reference_map_does_not_override_foundation():
    source=(ROOT/"src/course-adapter.js").read_text(encoding="utf-8")
    assert 'const A_IDS=["A00","A01","A02","A03","A05","A06","A07"]' in source
    assert 'const IDS=[...P_IDS,...I_IDS,...N_IDS,...L_IDS,...(advancedLab?A_IDS:[])];' in source
    assert 'advancedLab?"biopython.advanced-selected.v1":"biopython.course-selected.v1"' in source
