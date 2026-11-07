"""P01 authored content checks. Reference fixtures are trusted author data only."""
import unittest, json, copy, io, contextlib
from pathlib import Path
R=Path(__file__).resolve().parents[2]
def load(p):return json.loads((R/p).read_text(encoding='utf8'))
class P01AuthorChecks(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.lesson=load("content/p01/lesson.json");cls.author=load("content/author/p01_reference.json")
  cls.spine=load("curriculum/witz_spine.json")
 def test_coverage_and_structure(self):
  l=self.lesson
  self.assertEqual(len(l["goals"]),7)
  self.assertEqual(set(l["competencies"]),set(next(m["competency_numbers"] for m in self.spine["missions"] if m["id"]=="P01")))
  self.assertEqual(len(set(c for g in l["goals"] for c in g["competencies"])),7)
  for g in l["goals"]:
   self.assertTrue(g["worked_example"]["code"])
   self.assertGreaterEqual(len(g["explain"]),3)
   self.assertTrue(g["scientific_boundary"])
   for phase in ("apply","prove"):
    self.assertGreaterEqual(len(g["phases"][phase]["public_checks"]),2)
 def test_real_reference_python(self):
  solutions={a["id"]:a for a in self.author["goals"]}
  for g in self.lesson["goals"]:
   for phase in ("apply","prove"):
    ref=solutions[g["id"]]
    program=compile(ref[phase+"_solution"],g["id"]+"/"+phase,"exec")
    for case in ref[phase+"_checks"]:
     with self.subTest(goal=g["id"],phase=phase,inputs=case["inputs"]):
      ns=copy.deepcopy(case["inputs"])
      with contextlib.redirect_stdout(io.StringIO()):
       exec(program,ns)
      for expression in case["assertions"]:
       self.assertTrue(eval(expression,ns),expression)
if __name__=="__main__":unittest.main()
