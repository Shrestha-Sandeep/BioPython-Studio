"""P01 content contract: canonical coverage, authored explanations, real CPython tests."""
import unittest
import json
import copy
import io
import contextlib
from pathlib import Path

R = Path(__file__).resolve().parents[2]
def load(p):
    return json.loads((R / p).read_text(encoding='utf-8'))

class P01AuthorChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.lesson = load("content/p01/lesson.json")
        cls.author = load("content/author/p01_reference.json")
        cls.spine = load("curriculum/witz_spine.json")
        cls.canonical = load("curriculum/v3_manifest.json")
        cls.manuscript = (R / "content/chapters/P01_COMPLETE.md").read_text(encoding="utf-8")

    def test_exact_frozen_coverage_and_in_app_explanations(self):
        chapter = self.lesson
        self.assertEqual(chapter["chapter_id"], "P01")
        self.assertEqual(len(chapter["goals"]), 7)
        goal_ids = [g["id"] for g in chapter["goals"]]
        self.assertEqual(len(goal_ids), len(set(goal_ids)))
        numbers = [n for g in chapter["goals"] for n in g["competencies"]]
        self.assertEqual(len(numbers), len(set(numbers)))
        self.assertEqual(set(numbers), set(next(
            m["competency_numbers"] for m in self.spine["missions"] if m["id"] == "P01"
        )))
        self.assertTrue(set(numbers) <= {c["number"] for c in self.canonical["competencies"]})
        self.assertEqual(chapter["capstone"]["competencies"], [])
        self.assertEqual(chapter["review"]["competencies"], [])
        self.assertEqual(chapter["capstone"]["id"], "P01-CAPSTONE")
        for goal in [*chapter["goals"], chapter["capstone"], chapter["review"]]:
            with self.subTest(goal=goal["id"]):
                self.assertGreaterEqual(len(goal["explain"]), 3)
                self.assertGreaterEqual(sum(len(x) for x in goal["explain"]), 700)
                self.assertTrue(goal["prediction_answer"])
                self.assertTrue(goal["walkthrough"])
                self.assertTrue(goal["investigate"])
                self.assertTrue(goal["debug_task"])
                self.assertTrue(goal["scientific_boundary"])
                self.assertTrue(goal["misconception"])
                self.assertTrue(goal["feedback"])
                if goal["id"] != "P01-REVIEW":
                    self.assertTrue(goal["worked_example"]["code"])
                else:
                    self.assertEqual(goal["worked_example"]["code"], "", "Retrieval should not reveal a worked solution")
                for phase in ("learn", "apply", "prove"):
                    self.assertTrue(goal["phases"][phase]["starter_code"])
                for phase in ("apply", "prove"):
                    if goal["id"] == "P01-REVIEW" and phase == "apply":
                        continue
                    self.assertGreaterEqual(len(goal["phases"][phase]["public_checks"]), 2)
                self.assertIn(goal["id"], self.manuscript)
        self.assertGreater(len(self.manuscript.split()), 5000)
        self.assertEqual(len(chapter["capstone"]["reflection_prompts"]), 4)
        # Prevent accidental introduction of loops before they are taught in P03.
        self.assertNotIn("for value in", self.lesson["goals"][3]["worked_example"]["code"])

    def test_real_reference_programs_all_changed_cases(self):
        reference = {x["id"]: x for x in self.author["goals"]}
        reference["P01-CAPSTONE"] = self.author["capstone"]
        reference["P01-REVIEW"] = self.author["review"]
        for goal in [*self.lesson["goals"], self.lesson["capstone"], self.lesson["review"]]:
            item = reference[goal["id"]]
            for phase in (("prove",) if goal["id"] == "P01-REVIEW" else ("apply", "prove")):
                program = compile(item[phase + "_solution"], goal["id"] + "/" + phase, "exec")
                self.assertEqual(
                    item[phase + "_checks"], goal["phases"][phase]["public_checks"],
                    "Source fixtures diverged between author and learner package"
                )
                for case in item[phase + "_checks"]:
                    with self.subTest(goal=goal["id"], phase=phase, inputs=case["inputs"]):
                        namespace = copy.deepcopy(case["inputs"])
                        with contextlib.redirect_stdout(io.StringIO()) as output:
                            exec(program, namespace)
                        for expression in case["assertions"]:
                            self.assertTrue(eval(expression, namespace), expression)
                        if goal["id"] in ("P01-CAPSTONE", "P01-REVIEW"):
                            self.assertTrue(output.getvalue().strip(), "Capstone must print a report")

if __name__ == "__main__":
    unittest.main()
