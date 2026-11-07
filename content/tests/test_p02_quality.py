"""P02 complete authored content: exact competencies, no solution leak and real Python cases."""
import unittest, json, copy, io, contextlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def load(p):return json.loads((ROOT/p).read_text(encoding='utf-8'))
class P02Quality(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.lesson=load("content/p02/lesson.json")
  cls.author=load("content/author/p02_reference.json")
  cls.spine=load("curriculum/witz_spine.json")
  cls.v3=load("curriculum/v3_manifest.json")
  cls.text=(ROOT/"content/chapters/P02_COMPLETE.md").read_text(encoding='utf-8')
 def test_exact_coverage_and_depth(self):
  l=self.lesson
  self.assertEqual(l["chapter_id"],"P02")
  self.assertEqual([g["id"] for g in l["goals"]],["P02-G01","P02-G02","P02-G03","P02-G04"])
  ids=[x for g in l["goals"] for x in g["competencies"]]
  self.assertEqual(len(ids),len(set(ids)))
  self.assertEqual(set(ids),set(next(x["competency_numbers"] for x in self.spine["missions"] if x["id"]=="P02")))
  self.assertTrue(set(ids)<=set(x["number"] for x in self.v3["competencies"]))
  self.assertEqual(l["capstone"]["competencies"],[])
  self.assertEqual(l["review"]["competencies"],[])
  self.assertGreater(len(self.text.split()),3500)
  for goal in [*l["goals"],l["capstone"],l["review"]]:
   with self.subTest(goal=goal["id"]):
    self.assertIn(goal["id"],self.text)
    self.assertGreaterEqual(len(goal["explain"]),3)
    self.assertTrue(goal["why"])
    self.assertTrue(goal["scientific_boundary"])
    self.assertTrue(goal["investigate"])
    self.assertTrue(goal["debug_task"])
    self.assertTrue(goal["prediction_answer"])
    for phase in ("learn","apply","prove"):
     self.assertTrue(goal["phases"][phase]["starter_code"])
    for phase in ("apply","prove"):
     if goal["id"]=="P02-REVIEW" and phase=="apply":continue
     self.assertGreaterEqual(len(goal["phases"][phase]["public_checks"]),3)
  self.assertEqual(l["review"]["worked_example"]["code"],"")
  self.assertGreaterEqual(len(l["capstone"]["phases"]["apply"]["public_checks"]),10)
  self.assertGreaterEqual(len(l["capstone"]["phases"]["prove"]["public_checks"]),10)
 def test_reference_programs_all_cases(self):
  refs={x["id"]:x for x in self.author["goals"]}
  refs["P02-CAPSTONE"]=self.author["capstone"]
  refs["P02-REVIEW"]=self.author["review"]
  for goal in [*self.lesson["goals"],self.lesson["capstone"],self.lesson["review"]]:
   ref=refs[goal["id"]]
   for phase in (("prove",) if goal["id"]=="P02-REVIEW" else ("apply","prove")):
    self.assertEqual(ref[phase+"_checks"],goal["phases"][phase]["public_checks"])
    code=compile(ref[phase+"_solution"],goal["id"]+"/"+phase,"exec")
    for case in ref[phase+"_checks"]:
     with self.subTest(goal=goal["id"],phase=phase,inputs=case["inputs"]):
      ns=copy.deepcopy(case["inputs"])
      with contextlib.redirect_stdout(io.StringIO()) as out:exec(code,ns)
      for assertion in case["assertions"]:
       self.assertTrue(eval(assertion,ns),assertion)
      if goal["id"]=="P02-CAPSTONE" or goal["id"]=="P02-REVIEW":
       self.assertTrue(out.getvalue().strip())
if __name__=="__main__":unittest.main()
