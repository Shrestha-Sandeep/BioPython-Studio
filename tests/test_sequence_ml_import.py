"""7 optional NGS and ML chapters: competency, editor, progression and source controls."""
import ast
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
def load(path):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))

spine=load("curriculum/witz_spine.json")
manifest=load("curriculum/v3_manifest.json")
expected={"N01":4,"N02":4,"N03":4,"N04":5,"L01":4,"L02":4,"L03":4}
claimed=[]
cases_count=0

for cid,n in expected.items():
    chapter=load(f"content/{cid.lower()}/lesson.json")
    planned=next(m for m in spine["missions"] if m["id"]==cid)
    assert chapter["schema_version"]=="bps.chapter.v1",cid
    assert chapter["chapter_id"]==cid and chapter["version"]=="1.0.0",cid
    assert len(chapter["goals"])==n,cid
    assert chapter["competencies"]==planned["competency_numbers"],cid
    assert [x for goal in chapter["goals"] for x in goal["competencies"]]==planned["competency_numbers"],cid
    claimed+=chapter["competencies"]
    assert (ROOT / "content/chapters" / f"{cid}_COMPLETE.md").is_file(),cid
    refs=load(f"tests/reference_{cid.lower()}.json")
    assert chapter["capstone"]["id"]==cid+"-CAPSTONE",cid
    assert chapter["review"]["id"]==cid+"-REVIEW",cid
    assert not chapter["review"]["worked_example"]["code"],cid
    assert chapter["capstone"]["competencies"]==chapter["review"]["competencies"]==[],cid
    assert chapter["final_project"]["name"].endswith(".py"),cid
    for goal in [*chapter["goals"],chapter["capstone"],chapter["review"]]:
        assert len(goal["explain"])>=3 and goal["why"] and goal["scientific_boundary"],goal["id"]
        assert goal["hints"]["prove"]==[],goal["id"]
        assert refs[goal["id"]]["prove"].strip()
        for phase in ("learn","apply","prove"):
            task=goal["phases"][phase]
            source=task["starter_code"]
            assert source.startswith(f"# {goal['id']} | {phase.upper()} |"),(cid,goal["id"],phase)
            assert "# TASK:" in source and "\n\n" in source,(cid,goal["id"],phase)
            for line in source.splitlines():
                if line.startswith("#"): assert len(line)<=85,(goal["id"],phase,len(line))
            ast.parse(source)
            if phase=="learn":
                if not goal["id"].endswith("-REVIEW"):
                    assert goal["worked_example"]["code"] in source,goal["id"]
                    compile(goal["worked_example"]["code"],"<published worked example>","exec")
                continue
            assert all(not line.strip() or line.lstrip().startswith("#") for line in source.splitlines()),(goal["id"],phase,"answer leaked")
            cases=task.get("public_checks",[])
            if goal["id"].endswith("-REVIEW") and phase=="apply":
                assert not cases,goal["id"]
            else:
                assert len(cases)==3,(goal["id"],phase,len(cases))
                assert all(len(c["inputs"])==1 and c["assertions"] for c in cases)
                assert all(next(iter(c["inputs"]))==("data" if phase=="apply" else "sample") for c in cases)
            assert bool(refs[goal["id"]][phase])==bool(cases),(goal["id"],phase)
            cases_count+=len(cases)

assert len(claimed)==29 and len(set(claimed))==29,claimed
assert set(claimed)==set(manifest["optional_sequence_route"]+manifest["optional_ml_route"])
assert cases_count==237,cases_count

# No new stage can overwrite saved P01/I13 progress.
adapter=(ROOT/"src/course-adapter.js").read_text(encoding="utf-8")
for needle in ("const N_IDS=","const L_IDS=","stageOf=id","lastN=","lastL=","biopython."+"" ):
    assert needle in adapter,needle
assert "if(!chapters[activeId])activeId=\"P01\"" in adapter

# Source attribution remains explicit.
for cid in expected:
    scientific=load(f"content/{cid.lower()}/lesson.json")["scientific_context"]
    assert "SYNTHETIC" in scientific["use"]
print("PASS 7 chapters, 29 canonical skills, 237 changed-input scenarios; blank independent tasks")
