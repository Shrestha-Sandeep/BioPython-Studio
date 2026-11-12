"""A00/A05/A06/A07: all 128 real Python changed-input practice cases.

These are synthetic contract tests, NOT human-independent learning or real
biological evidence. The separate research CLIs and A07 scientific human
review gates must still be used.
"""
from __future__ import annotations

import ast
import contextlib
import io
import json
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
COUNTS = {"A00": 5, "A05": 6, "A06": 6, "A07": 7}
CHAPTERS = tuple(COUNTS)


def chapter(cid):
    lesson=json.loads((ROOT/"content"/cid.lower()/"lesson.json").read_text(encoding="utf-8"))
    references=json.loads((ROOT/"tests"/f"reference_{cid.lower()}_advanced.json").read_text(encoding="utf-8"))
    return lesson,references


def all_goals(lesson):
    return [*lesson["goals"],lesson["capstone"],lesson["review"]]


def test_complete_chapter_schema_competencies_and_unsolved_apply_prove():
    names=[]
    checks=0
    for cid,count in COUNTS.items():
        data,refs=chapter(cid)
        assert data["schema_version"]=="bps.chapter.v1"
        assert data["chapter_id"]==cid
        assert data["status"].startswith("OPTIONAL_ADVANCED")
        assert len(data["goals"])==count
        items=all_goals(data)
        assert len(items)==count+2
        assert data["competencies"]==[item["id"] for item in items]
        assert set(refs)==set(data["competencies"])
        assert data["capstone"]["id"]==cid+"-CAPSTONE"
        assert data["review"]["id"]==cid+"-REVIEW"
        assert (ROOT/"content/chapters"/f"{cid}_COMPLETE.md").is_file()
        assert (ROOT/"projects/advanced"/cid.lower()/"README.md").is_file()
        for item in items:
            names.append(item["id"])
            assert len(item["explain"])>=3
            assert item["why"] and item["scientific_boundary"]
            assert item["worked_example"]["predict"]
            assert item["misconception"]
            assert item["hints"]["prove"]==[]
            if item["id"].endswith(("-CAPSTONE","-REVIEW")):
                assert not item["worked_example"]["code"],item["id"]
            for phase in ("learn","apply","prove"):
                task=item["phases"][phase]
                source=task["starter_code"]
                assert source.startswith(f"# {item['id']} | {phase.upper()} |"),item["id"]
                assert "# TASK:" in source
                for line in source.splitlines():
                    if line.startswith("#"):assert len(line)<=96,(item["id"],phase,len(line))
                ast.parse(source)
                if phase!="learn":
                    assert ast.parse(source).body==[],(item["id"],phase,"answer leaked in learner starter")
                    cases=task["public_checks"]
                    assert len(cases)==2
                    assert cases[0]["inputs"]!=cases[1]["inputs"]
                    assert task["preview_inputs"]==cases[0]["inputs"]
                    for case in cases:
                        assert set(case["inputs"])=={"data"}
                        assert len(case["assertions"])>=2
                        for expr in case["assertions"]:compile(expr,"<learner check>","eval")
                    checks+=len(cases)
    assert len(names)==32
    assert len(set(names))==32
    assert checks==128
    old=json.loads((ROOT/"curriculum/v3_manifest.json").read_text(encoding="utf-8"))
    assert old
    old_ids=[]
    for cid in ("P01","P02","P03","P04","P05","P06",
                *(f"I{i:02d}" for i in range(1,14)),
                *(f"N{i:02d}" for i in range(1,5)),
                *(f"L{i:02d}" for i in range(1,4))):
        d=json.loads((ROOT/"content"/cid.lower()/"lesson.json").read_text(encoding="utf-8"))
        old_ids.extend(d["competencies"])
    assert len(old_ids)==156 and set(old_ids)=={f"{i:03d}" for i in range(1,157)}
    assert not set(names)&set(old_ids)


@pytest.mark.parametrize("cid",CHAPTERS)
def test_actual_independent_python_reference_against_all_changed_inputs(cid):
    data,refs=chapter(cid)
    attempted=0
    for goal in all_goals(data):
        for phase in ("apply","prove"):
            code=refs[goal["id"]][phase]
            ast.parse(code)
            for case in goal["phases"][phase]["public_checks"]:
                namespace={"data":case["inputs"]["data"]}
                with contextlib.redirect_stdout(io.StringIO()):
                    exec(compile(code,"<reference>","exec"),namespace)
                assert "result" in namespace,(goal["id"],phase)
                for expr in case["assertions"]:
                    assert eval(compile(expr,"<assertion>","eval"),namespace),(
                        goal["id"],phase,expr,namespace["result"]
                    )
                attempted+=1
    assert attempted==4*(COUNTS[cid]+2)


def test_optional_navigation_and_progress_namespaces_with_legacy_preserved():
    src=(ROOT/"src/course-adapter.js").read_text(encoding="utf-8")
    assert 'const A_IDS=["A00","A01","A02","A03","A05","A06","A07"]' in src
    assert 'A00:5,A01:4,A02:5,A03:5,A05:6,A06:6,A07:7' in src
    assert 'advancedLab?"A00":"P01"' in src
    assert '"biopython.advanced-selected.v1":"biopython.course-selected.v1"' in src
    assert 'if(!chapters[activeId])activeId="P01"' in src
    assert 'if(advancedLab && !A_IDS.includes(activeId))activeId="A00"' in src
    assert "Advanced research lab" in src
    assert "biopython."+"" in src


def test_local_research_modules_present_and_no_autoscientific_certification():
    for name in ("a00/bridge.py","a05/analysis.py","a06/batch.py",
                 "a07/evidence_check.py"):
        assert (ROOT/"projects/advanced"/name).is_file()
    e=(ROOT/"projects/advanced/a07/evidence_check.py").read_text(encoding="utf-8")
    assert '"scientifically_validated": False' in e
    assert '"human_review_required": True' in e
    assert (ROOT/"docs/BBBC038_REAL_BENCHMARK_2026-11-08.md").is_file()
    assert (ROOT/"docs/A02B_REAL_MODALITY_TEST_2026-11-08.md").is_file()
