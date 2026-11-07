"""Pure Python P01 import checks; no third-party packages."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(path):return json.loads((ROOT/path).read_text(encoding="utf8"))
lesson=read("content/p01/lesson.json")
manifest=read("curriculum/v3_manifest.json")
spine=read("curriculum/witz_spine.json")
assert lesson["schema_version"]=="bps.chapter.v1"
assert lesson["chapter_id"]=="P01"
assert len(lesson["goals"])==7
competencies=[number for goal in lesson["goals"] for number in goal["competencies"]]
assert len(set(competencies))==7, competencies
assert set(competencies)==set(next(x["competency_numbers"] for x in spine["missions"] if x["id"]=="P01"))
assert set(competencies)<=set(x["number"] for x in manifest["competencies"])
assert "P01-G01" in [x["id"] for x in lesson["goals"]]
assert lesson["capstone"]["id"] == "P01-CAPSTONE"
assert lesson["review"]["id"] == "P01-REVIEW"
assert lesson["capstone"]["competencies"] == []
assert lesson["review"]["competencies"] == []
assert len(lesson["capstone"]["phases"]["apply"]["public_checks"]) >= 3
assert len(lesson["capstone"]["phases"]["prove"]["public_checks"]) >= 3
assert len(lesson["review"]["phases"]["prove"]["public_checks"]) >= 3
assert len(lesson["capstone"]["reflection_prompts"]) == 4
assert len(lesson["review"]["reflection_prompts"]) >= 3
assert not lesson["review"]["worked_example"]["code"], "Return task must not contain a solved program"
assert all(len(x["explain"]) >= 3 for x in [*lesson["goals"],lesson["capstone"],lesson["review"]])
assert (ROOT/"content/chapters/P01_COMPLETE.md").exists()
assert not (ROOT/"content/author/p01_reference.json").exists(), "Do not deploy author solutions!"
for item in lesson["goals"]:
    assert item["phases"]["learn"]["starter_code"]
    for phase in ("apply","prove"):
        assert len(item["phases"][phase]["public_checks"])>=2
        for c in item["phases"][phase]["public_checks"]:
            assert isinstance(c["inputs"],dict)
            assert len(c["assertions"])>0
print("P01 import contract: PASS, seven competencies, complete capstone, delayed practice and no author reference answers")
