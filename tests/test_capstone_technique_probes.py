"""Real-CPython capstone teaching probes for P01-P03.

Confirms early examples teach the needed technique without solving Apply/Prove.
Does not assert mastery of independent scientific interpretation.
"""
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path
import json
import unittest

ROOT = Path(__file__).resolve().parents[1]

def chapter(chapter_id):
    return json.loads((ROOT / "content" / chapter_id / "lesson.json").read_text(encoding="utf-8"))

def stdout_for(source):
    buffer = StringIO()
    with redirect_stdout(buffer):
        exec(compile(source, "<learn technique probe>", "exec"), {"__name__": "__main__"})
    return buffer.getvalue()

class CapstoneTechniqueProbes(unittest.TestCase):
    def test_p01_calibration_updates_with_input(self):
        code = chapter("p01")["capstone"]["phases"]["learn"]["starter_code"]
        self.assertIn("12.0 um", stdout_for(code))
        rescaled = code.replace("pixels_per_um = 4.0", "pixels_per_um = 8.0", 1)
        self.assertIn("6.0 um", stdout_for(rescaled))
        self.assertNotEqual(stdout_for(code), stdout_for(rescaled))

    def test_p02_shape_ascii_and_inclusive_boundary(self):
        capstone = chapter("p02")["capstone"]
        code = capstone["phases"]["learn"]["starter_code"]
        self.assertIn(capstone["worked_example"]["code"], code)
        expected = ["shape_ok: True", "plate_ok: True",
                    "focus_in_range: True", "focus_at_or_above_minimum: True"]
        output = stdout_for(code)
        for fragment in expected:
            self.assertIn(fragment, output)
        # A malformed one-part name must be rejected without IndexError.
        single_part = code.replace("sample_id = 'N2_P03_heat'", "sample_id = 'N2'", 1)
        result = stdout_for(single_part)
        self.assertIn("shape_ok: False", result)
        self.assertNotIn("plate_ok:", result)
        # Unicode fullwidth digit is numeric but explicitly not ASCII.
        unicode_plate = code.replace("sample_id = 'N2_P03_heat'", "sample_id = 'N2_P３3_heat'", 1)
        self.assertIn("plate_ok: False", stdout_for(unicode_plate))
        # Failed numerical boundary is not conflated with malformed identity.
        low_score = code.replace("focus_score = 0.80", "focus_score = 0.79", 1)
        self.assertIn("focus_at_or_above_minimum: False", stdout_for(low_score))

    def test_p03_missing_low_and_duplicate_are_distinct(self):
        capstone = chapter("p03")["capstone"]
        code = capstone["phases"]["learn"]["starter_code"]
        self.assertIn(capstone["worked_example"]["code"], code)
        output = stdout_for(code)
        self.assertIn("accepted: ['F09']", output)
        self.assertIn("missing: ['F02']", output)
        self.assertIn("F09 duplicate", output)
        self.assertIn("F11 new", output)
        self.assertNotIn("rejected:", output)  # deliberate partial example
        # A reordered example still flags whichever ID repeats.
        repeated = code.replace("['F09', 'F02', 'F11', 'F09']",
                                "['F02', 'F09', 'F11', 'F02']", 1)
        self.assertIn("F02 duplicate", stdout_for(repeated))

    def test_independent_phases_do_not_ship_solutions(self):
        for cid in ("p01", "p02", "p03"):
            goal = chapter(cid)["capstone"]
            for phase in ("apply", "prove"):
                code = goal["phases"][phase]["starter_code"]
                self.assertTrue(all(not line.strip() or line.lstrip().startswith("#")
                                    for line in code.splitlines()), (cid, phase))

if __name__ == "__main__":
    unittest.main()
