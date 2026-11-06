"""Contract tests for frozen v3 curriculum; no scientific packages required."""
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / "curriculum" / "v3_manifest.json").read_text(encoding="utf-8"))

def test_counts_and_identifiers():
    assert DATA["status"] == "FROZEN_DESIGN_NOT_IMPLEMENTED"
    skills = DATA["competencies"]
    assert len(skills) == 156
    assert len({x["id"] for x in skills}) == 156
    assert [int(x["number"]) for x in skills] == list(range(1, 157))
    assert len({x["source_key"] for x in skills}) == 156
    module_counts = Counter(x["module"] for x in skills)
    assert module_counts == {x["id"]: x["count"] for x in DATA["modules"]}

def test_prerequisite_dag_has_no_missing_nodes_or_cycles():
    skills = {x["id"]: x for x in DATA["competencies"]}
    visiting, visited = set(), set()
    def visit(key):
        assert key in skills, f"Missing competency: {key}"
        assert key not in visiting, f"Cycle at: {key}"
        if key in visited:
            return
        visiting.add(key)
        for dep in skills[key]["prerequisites"]:
            visit(dep)
        visiting.remove(key)
        visited.add(key)
    for key in skills:
        visit(key)
    assert len(visited) == 156

def test_legacy_aliases_cover_all_old_lessons_exactly_once():
    aliases = DATA["legacy_migration"]
    assert len(aliases) == 61
    keys = [x["legacy_id"] for x in aliases]
    assert len(set(keys)) == 61
    old = (ROOT / "CURRICULUM.md").read_text(encoding="utf-8")
    original_ids = re.findall(
        r"^\|\s*\d+\s*\|\s*\x60([a-z][a-z0-9_]+)\x60\s*\|",
        old, re.M)
    assert len(original_ids) == 61, f"Expected 61 source IDs, found {len(original_ids)}"
    assert set(original_ids) == set(keys)
    valid = {x["id"] for x in DATA["competencies"]}
    assert all(x["target_competency_id"] in valid for x in aliases)
    assert Counter(x["action"] for x in aliases) == {
        "KEEP": 28, "UPGRADE": 27, "MOVE": 3, "MERGE": 3}
    assert all(x["preserve_drafts"] and x["preserve_completion_history"]
               and x["requires_new_mastery_proof"] for x in aliases)

def test_nonredundancy_and_path_character():
    assert len(DATA["removed_v2"]) == 8
    assert len(DATA["added_v3"]) == 4
    assert "Python" in DATA["path_policy"] and "NGS" in DATA["path_policy"]
    module_types = {x["track"] for x in DATA["modules"]}
    assert {"foundation", "microscopy", "sequence", "ml", "projects"}.issubset(module_types)

def test_archived_routes_remain_compatible():
    skills = {x["number"]: x for x in DATA["competencies"]}
    route = DATA["recommended_default_route"]
    pilot = DATA["recommended_first_15"]
    assert len(route) == 127
    assert len(pilot) == 15
    assert route[:15] == pilot
    assert len(set(route)) == len(route)
    completed = set()
    for number in route:
        assert number in skills
        assert set(skills[number]["prerequisite_numbers"]) <= completed, number
        completed.add(number)
    assert len(DATA["optional_sequence_route"]) == 17
    assert len(DATA["optional_ml_route"]) == 12
    assert set(DATA["optional_sequence_route"]).isdisjoint(completed)
    assert set(DATA["optional_ml_route"]).isdisjoint(completed)
    assert completed | set(DATA["optional_sequence_route"]) | set(DATA["optional_ml_route"]) == set(skills)

def test_complete_course_is_one_prerequisite_safe_path_with_all_four_stages():
    skills={c['number']:c for c in DATA['competencies']}
    route=DATA['recommended_complete_route']
    assert len(route)==156 and len(set(route))==156
    def stage(c):
        if c['module']=='M11' or c['number']=='155': return 2
        if c['module']=='M12' or c['number']=='156': return 3
        if c['module'] in ['M07','M08','M09'] or c['number'] in ['153','154']: return 1
        return 0
    seen=set();previous=0
    for number in route:
        c=skills[number]
        assert set(c['prerequisite_numbers'])<=seen
        assert stage(c)>=previous
        previous=stage(c);seen.add(number)
