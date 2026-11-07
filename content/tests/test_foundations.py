"""Content contract and CPython author checks (not a sandbox for untrusted user code)."""
import contextlib
import copy
import io
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[2]
CONTENT = ROOT / "content"

def load_json(name):
    return json.loads((CONTENT / name).read_text(encoding="utf-8"))

class FoundationContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest = load_json("manifest.json")
        cls.activities = load_json("activities/foundations.json")["activities"]
        cls.v3 = json.loads((ROOT / "curriculum/v3_manifest.json").read_text(encoding="utf-8"))
        cls.spine = json.loads((ROOT / "curriculum/witz_spine.json").read_text(encoding="utf-8"))

    def test_unique_stable_ids_and_coverage(self):
        lessons = self.activities
        self.assertEqual(len(lessons), self.manifest["count_activities"])
        ids = [lesson["id"] for lesson in lessons]
        self.assertEqual(len(ids), len(set(ids)))
        all_skills = {skill["number"] for skill in self.v3["competencies"]}
        all_source_ids = set(self.spine["sources"])
        missions = {m["id"]: m for m in self.spine["missions"]}
        by_mission = {}
        for lesson in lessons:
            self.assertIn(lesson["mission"], missions)
            self.assertEqual(lesson["stage"], "Python")
            self.assertTrue(set(lesson["competencies"]) <= all_skills)
            self.assertTrue(set(lesson["source_refs"]) <= all_source_ids | {"python-doc", "pdsh"})
            self.assertEqual(len(lesson["hints"]), 2)
            self.assertTrue(lesson["transfer_prompt"].strip())
            self.assertTrue(lesson["science_caution"].strip())
            self.assertTrue(lesson["predict"].strip())
            self.assertTrue(lesson["task"].strip())
            self.assertTrue(lesson["starter_code"].strip())
            self.assertGreaterEqual(len(lesson["fixtures"]), 2)
            by_mission.setdefault(lesson["mission"], []).extend(lesson["competencies"])
        for ch in self.manifest["chapters"]:
            expected = set(ch["competencies"])
            actual = by_mission[ch["mission"]]
            self.assertEqual(set(actual), expected)
            self.assertEqual(len(actual), len(set(actual)))
            self.assertEqual(set(missions[ch["mission"]]["competency_numbers"]), expected)
            chapter = ROOT / ch["path"]
            self.assertTrue(chapter.is_file())
            content = chapter.read_text(encoding="utf-8")
            self.assertIn("```python", content)
            self.assertNotIn("\\`", content)

    def test_reference_programs_on_changed_inputs(self):
        for activity in self.activities:
            code = compile(activity["reference_solution"], activity["id"], "exec")
            for i, fixture in enumerate(activity["fixtures"]):
                with self.subTest(activity=activity["id"], fixture=i):
                    namespace = copy.deepcopy(fixture["inputs"])
                    with contextlib.redirect_stdout(io.StringIO()):
                        exec(code, namespace)  # Trusted, authored source only
                    for expression in fixture["assertions"]:
                        self.assertTrue(
                            eval(expression, namespace),  # Trusted, authored assertion only
                            f"{activity['id']} fixture {i}: {expression}"
                        )

if __name__ == "__main__":
    unittest.main()
