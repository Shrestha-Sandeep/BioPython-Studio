"""Every P01–P03 activity starts with a concise, non-spoiler editor task.

Run with: python -m unittest discover -s tests -p test_editor_briefs.py
"""
import ast
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class EditorBriefContract(unittest.TestCase):
    def test_every_phase_has_short_task_comments_and_executable_starter(self):
        checked = 0
        for chapter_id, goal_count in (("p01", 9), ("p02", 6), ("p03", 9)):
            data = json.loads((ROOT / "content" / chapter_id / "lesson.json").read_text(encoding="utf-8"))
            goals = [*data["goals"], data["capstone"], data["review"]]
            self.assertEqual(len(goals), goal_count)
            for goal in goals:
                for phase in ("learn", "apply", "prove"):
                    with self.subTest(goal=goal["id"], phase=phase):
                        code = goal["phases"][phase]["starter_code"]
                        lines = code.splitlines()
                        self.assertTrue(lines[0].startswith(f"# {goal['id']} | {phase.upper()} |"))
                        self.assertIn("# TASK:", code)
                        self.assertTrue(all(len(line) <= 85 for line in lines if line.startswith("#")))
                        self.assertIn("\n\n", code)
                        ast.parse(code)
                        if phase == "learn" and not goal["id"].endswith("-REVIEW"):
                            self.assertTrue(any(not line.lstrip().startswith("#") and line.strip() for line in lines),
                                            "Learn still includes its original executable example")
                        checked += 1
        self.assertEqual(checked, 72)

if __name__ == "__main__":
    unittest.main()
