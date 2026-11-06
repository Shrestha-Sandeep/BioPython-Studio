"""Witz-first teaching spine: 156 unique skills, 26 purposeful missions and preserved progress."""
from collections import Counter
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = json.loads((ROOT / "curriculum/v3_manifest.json").read_text(encoding="utf-8"))
SPINE = json.loads((ROOT / "curriculum/witz_spine.json").read_text(encoding="utf-8"))

def test_every_legacy_stable_competency_is_mapped_exactly_once():
    skills = {c["number"]: c for c in MANIFEST["competencies"]}
    missions = SPINE["missions"]
    assert len(missions) == 26
    seen = [number for m in missions for number in m["competency_numbers"]]
    assert len(seen) == 156
    assert len(set(seen)) == len(seen)
    assert set(seen) == set(skills)
    assert set(SPINE["ordered_competency_numbers"]) == set(skills)
    assert len(SPINE["ordered_competency_numbers"]) == 156
    assert len({m["id"] for m in missions}) == 26
    assert len(MANIFEST["legacy_migration"]) == 61

def test_one_accessible_python_microscopy_ngs_ml_path_has_no_cycles():
    assert SPINE["stages"] == ["Python", "Microscopy", "NGS", "ML"]
    owner = {number: m for m in SPINE["missions"] for number in m["competency_numbers"]}
    skills = {c["number"]: c for c in MANIFEST["competencies"]}
    done = set()
    prior = 0
    for number in SPINE["ordered_competency_numbers"]:
        c = skills[number]
        assert all(p in done for p in c["prerequisite_numbers"]), number
        stage = SPINE["stages"].index(owner[number]["stage"])
        assert stage >= prior, f"Returned to an earlier stage at {number}"
        prior = stage
        done.add(number)
    assert len(done) == 156
    assert Counter(m["stage"] for m in SPINE["missions"]) == {"Python":6,"Microscopy":13,"NGS":4,"ML":3}
    assert Counter(owner[n]["stage"] for n in done) == {"Python":36,"Microscopy":91,"NGS":17,"ML":12}
    assert "unlocked" in SPINE["path_policy"]

def test_source_attribution_and_honest_scope():
    ids = set(SPINE["sources"])
    assert "WITZ" in SPINE["status"].upper() or "SOURCE_FIRST" in SPINE["status"]
    assert "not" in SPINE["implementation_scope"].lower()
    witz_exercise_refs = set()
    for m in SPINE["missions"]:
        assert m["title"] and m["goal"] and m["deliverable"] and m["independent_transfer"]
        for source in m["references"]:
            assert source["source"] in ids
            assert source["mode"] in ("existing_source_exercise_candidate", "source_course_reference")
            if source["mode"] == "existing_source_exercise_candidate":
                witz_exercise_refs.add(source["source"])
    assert {"we01","we02","we03","we04","we05","we06","we08"} <= witz_exercise_refs
    for source in SPINE["sources"].values():
        assert source["url"].startswith("https://github.com/guiwitz/PyImageCourse_beginner/blob/master/")
        assert source["license"] == "BSD-3-Clause"
