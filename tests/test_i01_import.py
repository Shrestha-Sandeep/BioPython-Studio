"""I01 frozen mission, scientific provenance and lesson-level contract."""
import ast
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
get=lambda p:json.loads((ROOT/p).read_text(encoding="utf8"))
chapter=get("content/i01/lesson.json")
spine=get("curriculum/witz_spine.json")
manifest=get("curriculum/v3_manifest.json")
assert chapter["schema_version"]=="bps.chapter.v1"
assert chapter["chapter_id"]=="I01"
expected=next(m["competency_numbers"] for m in spine["missions"] if m["id"]=="I01")
assert len(expected)==8
assert chapter["competencies"]==expected
assert [n for g in chapter["goals"] for n in g["competencies"]]==expected
assert set(expected)<={x["number"] for x in manifest["competencies"]}
assert chapter["capstone"]["competencies"]==[]
assert chapter["review"]["competencies"]==[]
assert len(chapter["goals"])==8
assert chapter["review"]["worked_example"]["code"]==""
assert chapter["scientific_context"]["use"]=="RENDERED_NOTEBOOK_FIGURE_PIXEL_INSPECTION_ONLY"
assert "not raw" in chapter["scientific_context"]["caution"]
assert (ROOT/"assets/witz/fluorescence-single.png").is_file()
assert (ROOT/"assets/witz/CREDITS.md").exists()
assert (ROOT/"content/chapters/I01_COMPLETE.md").exists()
assert (ROOT/"tests/reference_i01.json").exists()
checks=0
for g in [*chapter["goals"],chapter["capstone"],chapter["review"]]:
    assert g["id"].startswith("I01-") and len(g["explain"])>=3
    assert g["why"] and g["scientific_boundary"] and g["prediction_answer"]
    assert g["hints"]["prove"]==[]
    for phase in ("learn","apply","prove"):
        obj=g["phases"][phase];code=obj["starter_code"]
        assert code.startswith(f"# {g['id']} | {phase.upper()} |")
        assert "# TASK:" in code and "\n\n" in code
        assert all(len(line)<=85 for line in code.splitlines() if line.startswith("#"))
        ast.parse(code)
        if phase=="learn" and "image_path" in code:
            assert obj["preview_inputs"]["image_path"].endswith("witz_published_figure.png")
        if phase in ("apply","prove"):
            assert all(not line.strip() or line.lstrip().startswith("#") for line in code.splitlines())
            cases=obj.get("public_checks",[])
            if g["id"]=="I01-REVIEW" and phase=="apply":
                assert cases==[]
            else:
                assert len(cases)>=3
                assert all(isinstance(case["inputs"],dict) and case["assertions"] for case in cases)
            checks+=len(cases)
assert checks==57,checks
print("I01 content: PASS, 8 frozen skills, 30 phases, 57 checks, real credited PNG, no raw-data misrepresentation")
