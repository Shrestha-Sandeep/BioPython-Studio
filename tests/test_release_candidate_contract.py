"""Release-candidate inventory and storage contract for the entire BioPython Studio app.

No human learner/scientific validity is inferred from these structural checks.
This gate is deliberately dependency-free and safe to run before full browser QA.
"""
from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CORE = (
    *(f"P{i:02d}" for i in range(1, 7)),
    *(f"I{i:02d}" for i in range(1, 14)),
    *(f"N{i:02d}" for i in range(1, 5)),
    *(f"L{i:02d}" for i in range(1, 4)),
)
ADVANCED = ("A00", "A01", "A02", "A03", "A05", "A06", "A07")
ADVANCED_COUNTS = dict(zip(ADVANCED, (5, 4, 5, 5, 6, 6, 7)))


def lesson(chapter_id: str) -> dict:
    path = ROOT / "content" / chapter_id.lower() / "lesson.json"
    return json.loads(path.read_text(encoding="utf-8"))


class ConsolidatedReleaseContract(unittest.TestCase):
    def test_exact_core_and_advanced_navigation(self):
        source = (ROOT / "src/course-adapter.js").read_text(encoding="utf-8")
        self.assertEqual(len(CORE), 26)
        self.assertEqual(len(ADVANCED), 7)
        for symbol, ids in (
            ("P_IDS", CORE[:6]),
            ("I_IDS", CORE[6:19]),
            ("N_IDS", CORE[19:23]),
            ("L_IDS", CORE[23:]),
            ("A_IDS", ADVANCED),
        ):
            match = re.search(r"const\s+" + symbol + r"=\[([^\]]+)\]", source)
            self.assertIsNotNone(match, symbol)
            self.assertEqual(tuple(re.findall(r'"([A-Z]\d{2})"', match.group(1))), tuple(ids))
        self.assertIn('get("lab")==="advanced"', source)
        self.assertIn('advancedLab?"A00":"P01"', source)
        self.assertIn("...(advancedLab?A_IDS:[])", source)
        self.assertIn('"biopython.advanced-selected.v1"', source)
        self.assertIn('"biopython.course-selected.v1"', source)
        self.assertIn('"biopython."+id.toLowerCase()+".v1"', source)

    def test_every_chapter_is_loadable_and_activities_match_ui(self):
        source = (ROOT / "src/course-adapter.js").read_text(encoding="utf-8")
        match = re.search(r"const GOAL_COUNTS=\{([^}]+)\};", source)
        self.assertIsNotNone(match)
        counts = {id_: int(n) for id_, n in re.findall(r"([PINAL]\d{2}):(\d+)", match.group(1))}
        self.assertEqual(set(counts), set(CORE + ADVANCED))
        activity_ids = set()
        for chapter_id in CORE + ADVANCED:
            with self.subTest(chapter=chapter_id):
                obj = lesson(chapter_id)
                self.assertEqual(obj["schema_version"], "bps.chapter.v1")
                self.assertEqual(obj["chapter_id"], chapter_id)
                self.assertEqual(len(obj["goals"]), counts[chapter_id])
                self.assertTrue((ROOT / "content/chapters" / (chapter_id + "_COMPLETE.md")).is_file())
                items = [*obj["goals"], obj["capstone"], obj["review"]]
                self.assertEqual(len(items), counts[chapter_id] + 2)
                for item in items:
                    self.assertNotIn(item["id"], activity_ids)
                    activity_ids.add(item["id"])
                    self.assertTrue(item["id"].startswith(chapter_id + "-"))
                    for phase in ("learn", "apply", "prove"):
                        self.assertIn(phase, item["phases"])
                        self.assertIsInstance(item["phases"][phase]["starter_code"], str)
        self.assertEqual(sum(counts[k] + 2 for k in ADVANCED), 52)
        self.assertEqual(sum(counts[k] for k in ADVANCED), 38)
        self.assertEqual(len(activity_ids), sum(counts.values()) + 2 * len(counts))

    def test_foundation_156_competencies_and_advanced_reference_map(self):
        original = [c for cid in CORE for c in lesson(cid)["competencies"]]
        self.assertEqual(len(original), 156)
        self.assertEqual(set(original), {f"{i:03d}" for i in range(1, 157)})
        reference = json.loads(
            (ROOT / "curriculum/advanced_reference_map_v1.json").read_text(encoding="utf-8")
        )
        self.assertEqual(tuple(reference["chapters"]), ADVANCED)
        self.assertEqual(reference["goal_count"], 52)
        expected = {
            item["id"]
            for cid in ADVANCED
            for item in [*lesson(cid)["goals"], lesson(cid)["capstone"], lesson(cid)["review"]]
        }
        actual = [r["goal_id"] for r in reference["entries"]]
        self.assertEqual(len(actual), 52)
        self.assertEqual(set(actual), expected)
        self.assertEqual(len(set(actual)), 52)

    def test_entrypoint_runtime_and_documented_scope(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        for asset in (
            "src/ui-first.js", "src/course-adapter.js", "src/course-teaching.js",
            "src/p01-pilot.css", "vendor/codemirror5/codemirror.js",
        ):
            self.assertIn(asset, html)
            self.assertTrue((ROOT / asset).is_file())
        readme = (ROOT / "README.md").read_text(encoding="utf-8")
        self.assertIn("/?lab=advanced", readme)
        self.assertIn("A04", readme)
        self.assertIn("X01", readme)
        self.assertIn("learner", readme.lower())


if __name__ == "__main__":
    unittest.main()
