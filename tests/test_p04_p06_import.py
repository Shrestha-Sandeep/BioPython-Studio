"""P04-P06 learner content contract: canonical mapping, non-spoiler starters and honest local boundaries."""
import ast
import json
from pathlib import Path

root=Path(__file__).resolve().parents[1]
spine=json.loads((root/"curriculum/witz_spine.json").read_text(encoding="utf8"))
manifest=json.loads((root/"curriculum/v3_manifest.json").read_text(encoding="utf8"))
catalog={str(item["number"]) for item in manifest["competencies"]}
total_phases=0
total_cases=0
for cid in ("P04","P05","P06"):
    chapter=json.loads((root/"content"/cid.lower()/"lesson.json").read_text(encoding="utf8"))
    mission=next(m for m in spine["missions"] if m["id"]==cid)
    assert chapter["chapter_id"]==cid and chapter["schema_version"]=="bps.chapter.v1"
    assert chapter["version"]=="1.0.0"
    assert len(chapter["goals"])==6
    expected=set(mission["competency_numbers"])
    assert set(chapter["competencies"])==expected and expected<=catalog
    skills=[number for goal in chapter["goals"] for number in goal["competencies"]]
    assert len(skills)==6 and set(skills)==expected and len(set(skills))==6
    assert chapter["capstone"]["competencies"]==[] and chapter["review"]["competencies"]==[]
    assert chapter["capstone"]["id"]==cid+"-CAPSTONE"
    assert chapter["review"]["id"]==cid+"-REVIEW"
    assert not chapter["review"]["worked_example"]["code"]
    assert len(chapter["capstone"]["build_steps"])>=4
    assert (root/"content/chapters"/f"{cid}_COMPLETE.md").exists()
    assert chapter["final_project"]["name"].endswith(".py")
    for goal in [*chapter["goals"], chapter["capstone"], chapter["review"]]:
        assert len(goal["explain"])>=3 and goal["why"] and goal["scientific_boundary"]
        assert goal["worked_example"]["predict"] and goal["prediction_answer"]
        for phase in ("learn","apply","prove"):
            obj=goal["phases"][phase]
            code=obj["starter_code"]
            assert code.startswith(f"# {goal['id']} | {phase.upper()} |")
            assert "# TASK:" in code
            assert "\n\n" in code
            assert all(len(line)<=90 for line in code.splitlines() if line.startswith("#"))
            ast.parse(code)
            total_phases+=1
            if phase=="learn" and not goal["id"].endswith("REVIEW"):
                assert goal["worked_example"]["code"] in code
            if phase in ("apply","prove"):
                assert all(not line.strip() or line.lstrip().startswith("#") for line in code.splitlines())
                feedback=obj["practice_feedback"]
                assert all(len(feedback[name])>30 for name in ("why","check","probe"))
                cases=obj.get("public_checks",[])
                if goal["id"].endswith("REVIEW") and phase=="apply":
                    assert not cases
                else:
                    assert len(cases)>=3 and len(cases)<=12
                total_cases+=len(cases)
    if cid=="P06":
        assert "local" in chapter["intro"].lower()
        assert "MANUAL" in chapter["capstone"]["assessment"]["local"]
        assert "NOT" in chapter["final_project"]["status"] or "PENDING" in chapter["final_project"]["status"]
        assert (root/"docs/P06_LOCAL_HANDOFF.md").exists()
        assert "virtual environment" in (root/"docs/P06_LOCAL_HANDOFF.md").read_text(encoding="utf8")
print("PASS P04-P06: 18 canonical skills, 72 phase starters and",total_cases,"public input cases")
assert total_phases==72
assert total_cases==155, total_cases
