"""A01-A03 opt-in learner QA; 80 real CPython changed-input practice scenarios.

Reference solutions are author-side test fixtures, never provided in learner
starter code. Passing these checks cannot establish scientific validity or
human independent mastery; real BBBC038/039 benchmarks have separate gates.
"""
from __future__ import annotations

import ast
import contextlib
import io
import json
import re
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
COUNTS = {"A01": 4, "A02": 5, "A03": 5}
IDS = list(COUNTS)


def load(chapter):
    lesson = json.loads((ROOT / "content" / chapter.lower() / "lesson.json").read_text(encoding="utf-8"))
    refs = json.loads((ROOT / "tests" / f"reference_{chapter.lower()}_advanced.json").read_text(encoding="utf-8"))
    return lesson, refs


def all_goals(data):
    return [*data["goals"], data["capstone"], data["review"]]


def test_complete_opt_in_schema_and_unchanged_156_competencies():
    legacy_manifest = json.loads((ROOT / "curriculum" / "v3_manifest.json").read_text(encoding="utf-8"))
    assert legacy_manifest
    original_ids = ["P01","P02","P03","P04","P05","P06"] + [
        f"I{x:02d}" for x in range(1, 14)
    ] + [f"N{x:02d}" for x in range(1, 5)] + [f"L{x:02d}" for x in range(1, 4)]
    assert len(original_ids) == 26
    original_competencies = []
    for ch in original_ids:
        data = json.loads((ROOT / "content" / ch.lower() / "lesson.json").read_text(encoding="utf-8"))
        original_competencies.extend(data["competencies"])
    assert len(original_competencies) == 156
    assert len(set(original_competencies)) == 156
    assert set(original_competencies) == {f"{i:03d}" for i in range(1, 157)}

    advanced_ids = []
    total_goals = 0
    for ch, n in COUNTS.items():
        data, refs = load(ch)
        assert data["schema_version"] == "bps.chapter.v1"
        assert data["chapter_id"] == ch
        assert len(data["goals"]) == n
        assert data["status"].startswith("OPTIONAL_ADVANCED")
        assert data["final_project"]["name"].endswith(".py")
        items = all_goals(data)
        assert set(refs) == {x["id"] for x in items}
        assert len(data["competencies"]) == len(items)
        assert set(data["competencies"]) == {x["id"] for x in items}
        for g in items:
            assert g["id"].startswith(ch + "-")
            advanced_ids.append(g["id"])
            assert len(g["explain"]) >= 2
            assert g["why"] and g["scientific_boundary"] and g["misconception"]
            assert "independent" in (g["phases"]["prove"]["title"] + g["phases"]["prove"]["description"]).lower() or g["id"].endswith("REVIEW")
        total_goals += len(items)
        assert (ROOT / "content" / "chapters" / (ch + "_COMPLETE.md")).exists()
    assert total_goals == 20
    assert len(set(advanced_ids)) == 20
    assert not set(advanced_ids) & set(original_competencies)


def test_editor_briefs_no_solutions_and_public_changed_inputs():
    checks = 0
    for ch in IDS:
        data, refs = load(ch)
        for goal in all_goals(data):
            for phase in ("learn", "apply", "prove"):
                source = goal["phases"][phase]["starter_code"]
                first = source.splitlines()[0]
                assert first.startswith(f"# {goal['id']} | {phase.upper()} |")
                assert "# TASK:" in source
                assert len(source) > 70
                assert all(len(line) <= 220 for line in source.splitlines() if line.startswith("#"))
                ast.parse(source)
                if phase in ("apply", "prove"):
                    assert ast.parse(source).body == [], "Apply/Prove starters should contain instructions but no solved code"
                    assert not goal["hints"]["prove"]
                    cases = goal["phases"][phase]["public_checks"]
                    assert len(cases) == 2, (goal["id"], phase)
                    assert cases[0]["inputs"] != cases[1]["inputs"]
                    assert all(isinstance(test["assertions"], list) and len(test["assertions"]) >= 2
                               for test in cases)
                    assert goal["phases"][phase]["preview_inputs"] == cases[0]["inputs"]
                    checks += len(cases)
                else:
                    assert source.split("\n\n", 1)[-1].strip()
            assert refs[goal["id"]]["apply"] and refs[goal["id"]]["prove"]
    assert checks == 80


@pytest.mark.parametrize("chapter", IDS)
def test_all_real_python_reference_solutions_against_changed_cases(chapter):
    data, refs = load(chapter)
    count = 0
    for goal in all_goals(data):
        for phase in ("apply", "prove"):
            solution = refs[goal["id"]][phase]
            ast.parse(solution)
            for case in goal["phases"][phase]["public_checks"]:
                # Every check runs with its own globals, as Pyodide does.
                env = {"data": case["inputs"]["data"]}
                with contextlib.redirect_stdout(io.StringIO()):
                    exec(compile(solution, f"<{goal['id']}:{phase}>", "exec"), env)
                assert "result" in env, goal["id"]
                for expression in case["assertions"]:
                    assert eval(compile(expression, "<advanced check>", "eval"), env), (
                        goal["id"], phase, case["inputs"], expression, env["result"]
                    )
                count += 1
    expected = (COUNTS[chapter] + 2) * 4
    assert count == expected


def test_optional_url_route_and_course_state_are_separate():
    adapter = (ROOT / "src" / "course-adapter.js").read_text(encoding="utf-8")
    assert 'new URLSearchParams(window.location.search).get("lab")==="advanced"' in adapter
    assert 'const IDS=[...P_IDS,...I_IDS,...N_IDS,...L_IDS,...(advancedLab?A_IDS:[])];' in adapter
    assert 'advancedLab?"biopython.advanced-selected.v1":"biopython.course-selected.v1"' in adapter
    assert 'advancedLab?"A01":"P01"' in adapter
    assert 'advancedLab?[...I_IDS,...A_IDS]:I_IDS' in adapter
    assert 'A01:4,A02:5,A03:5' in adapter
    assert 'href="./?lab=advanced"' in adapter
    assert 'href="./"' in adapter
    assert 'isImaging=id=>I_IDS.includes(id)||A_IDS.includes(id)' in adapter
    assert 'source' in adapter.lower()
    assert "biopython.p01.v1" in (ROOT / "README.md").read_text(encoding="utf-8")


def test_advanced_science_integrity_sources_are_not_synthetic_results():
    page = (ROOT / "docs" / "A02B_REAL_MODALITY_TEST_2026-11-08.md").read_text(encoding="utf-8")
    assert "0.8413" in page and "0.7730" in page
    for ch in IDS:
        lesson, _ = load(ch)
        assert "synthetic" in str(lesson["scientific_context"]).lower()
        assert "NOT_LEARNER_VALIDATED" in lesson["status"]
        for g in all_goals(lesson):
            assert g["phases"]["prove"]["starter_code"].count("\n") >= 4
    # The full external-data validation and results must be kept separate from
    # browser changed-input practice scenarios.
    assert (ROOT / "projects/advanced/a03/run_external_bbbc039.py").is_file()
    assert (ROOT / "docs/BBBC038_REAL_BENCHMARK_2026-11-08.md").is_file()
