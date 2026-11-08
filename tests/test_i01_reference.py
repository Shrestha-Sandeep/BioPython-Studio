"""Transparent I01 CPython answer fixtures for automated QA; not supplied to learners."""
import copy
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
lesson=json.loads((ROOT/"content/i01/lesson.json").read_text(encoding="utf8"))
answers=json.loads((ROOT/"tests/reference_i01.json").read_text(encoding="utf8"))
source=ROOT/"assets/witz/fluorescence-single.png"
assert source.is_file()
checked=0
for goal in [*lesson["goals"],lesson["capstone"],lesson["review"]]:
    for phase in ("apply","prove"):
        cases=goal["phases"][phase].get("public_checks",[])
        if not cases:continue
        solution=answers[goal["id"]][phase]
        compile(solution,"<I01 reference>","exec")
        for case in cases:
            inputs=copy.deepcopy(case["inputs"])
            if "image_path" in inputs:inputs["image_path"]=str(source)
            env={"__name__":"__main__"}
            env.update(copy.deepcopy(inputs))
            exec(compile(solution,"<I01 author QA>","exec"),env)
            for expression in case["assertions"]:
                assert eval(compile(expression,"<I01 public check>","eval"),env),(goal["id"],phase,expression)
            for k,v in inputs.items():
                assert env[k]==v,(goal["id"],phase,"input mutated",k)
            checked+=1
assert checked==57,checked
print("I01 reference: PASS, 57 changed-input CPython NumPy/Pillow source-image cases")
