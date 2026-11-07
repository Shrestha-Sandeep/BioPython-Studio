"""P03 complete authoring contract, canonical coverage, 85 real CPython reference fixtures."""
import unittest
import json
import copy
import contextlib
import io
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

def load(path):
    return json.loads((ROOT / path).read_text(encoding="utf8"))

class P03Quality(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.lesson = load("content/p03/lesson.json")
        cls.author = load("content/author/p03_reference.json")
        cls.spine = load("curriculum/witz_spine.json")
        cls.manifest = load("curriculum/v3_manifest.json")
        cls.manuscript = (ROOT / "content/chapters/P03_COMPLETE.md").read_text(encoding="utf8")

    def test_frozen_competencies_and_scope(self):
        chapter = self.lesson
        self.assertEqual(chapter["chapter_id"], "P03")
        self.assertEqual(chapter["schema_version"], "bps.chapter.v1")
        self.assertEqual(len(chapter["goals"]), 7)
        self.assertEqual([g["id"] for g in chapter["goals"]],
                         ["P03-G01", "P03-G02", "P03-G03", "P03-G04",
                          "P03-G05", "P03-G06", "P03-G07"])
        expected = set(next(m["competency_numbers"] for m in self.spine["missions"]
                            if m["id"] == "P03"))
        assigned = [n for g in chapter["goals"] for n in g["competencies"]]
        self.assertEqual(len(assigned), len(set(assigned)))
        self.assertEqual(set(assigned), expected)
        self.assertTrue(expected <= {c["number"] for c in self.manifest["competencies"]})
        self.assertEqual(set(assigned), {"012", "013", "014", "015", "016", "017", "018"})
        self.assertEqual(chapter["capstone"]["competencies"], [])
        self.assertEqual(chapter["review"]["competencies"], [])

    def test_teaching_depth_and_biological_boundaries(self):
        ch = self.lesson
        self.assertGreater(len(self.manuscript.split()), 6500)
        self.assertEqual(ch["review"]["worked_example"]["code"], "")
        self.assertEqual(len(ch["capstone"]["reflection_prompts"]), 5)
        for g in [*ch["goals"], ch["capstone"], ch["review"]]:
            with self.subTest(goal=g["id"]):
                self.assertIn(g["id"], self.manuscript)
                self.assertGreaterEqual(len(g["explain"]), 3)
                self.assertTrue(g["why"])
                self.assertTrue(g["scientific_boundary"])
                self.assertTrue(g["prediction_answer"])
                self.assertTrue(g["walkthrough"] and g["investigate"])
                self.assertTrue(g["debug_task"] and g["misconception"] and g["feedback"])
                for phase in ("learn", "apply", "prove"):
                    self.assertTrue(g["phases"][phase]["starter_code"])
                for phase in ("apply", "prove"):
                    if g["id"] == "P03-REVIEW" and phase == "apply":
                        continue
                    self.assertGreaterEqual(len(g["phases"][phase]["public_checks"]), 3)
        self.assertGreaterEqual(len(ch["capstone"]["phases"]["apply"]["public_checks"]), 10)
        self.assertGreaterEqual(len(ch["capstone"]["phases"]["prove"]["public_checks"]), 10)
        self.assertIn("not independent biological replicates", self.manuscript)

    def test_reference_python_and_changed_inputs(self):
        reference = {g["id"]: g for g in self.author["goals"]}
        reference["P03-CAPSTONE"] = self.author["capstone"]
        reference["P03-REVIEW"] = self.author["review"]
        total = 0
        for g in [*self.lesson["goals"], self.lesson["capstone"], self.lesson["review"]]:
            for phase in (("prove",) if g["id"] == "P03-REVIEW" else ("apply", "prove")):
                author = reference[g["id"]]
                checks = author[phase + "_checks"]
                self.assertEqual(checks, g["phases"][phase]["public_checks"])
                program = compile(author[phase + "_solution"], g["id"] + "/" + phase, "exec")
                for case in checks:
                    total += 1
                    with self.subTest(goal=g["id"], phase=phase, inputs=case["inputs"]):
                        env = copy.deepcopy(case["inputs"])
                        with contextlib.redirect_stdout(io.StringIO()) as stdout:
                            exec(program, env)
                        for assertion in case["assertions"]:
                            self.assertTrue(eval(assertion, env),
                                            f"{g['id']} {phase}: {assertion}")
                        if g["id"] in ("P03-CAPSTONE", "P03-REVIEW"):
                            self.assertTrue(stdout.getvalue().strip(),
                                            "Complete field audit must print a report")
        self.assertEqual(total, 85)

    def test_capstone_failure_cases_present(self):
        cases = self.lesson["capstone"]["phases"]["apply"]["public_checks"]
        records = [x["inputs"]["records"] for x in cases]
        self.assertTrue(any(len(x) == 0 for x in records))
        self.assertTrue(any(x["inputs"]["max_rows"] == 0 for x in cases))
        self.assertTrue(any(any(p[1] is None for p in row) for row in records))
        self.assertTrue(any(any(p[0] == "STOP" for p in row) for row in records))
        self.assertTrue(any(len({p[0] for p in row}) < len(row)
                            for row in records if not any(p[0] == "STOP" for p in row)))
        self.assertTrue(any(any(isinstance(p[1], (int, float)) and
                                 (p[1] < 0 or p[1] > 1) for p in row)
                            for row in records))

if __name__ == "__main__":
    unittest.main()
