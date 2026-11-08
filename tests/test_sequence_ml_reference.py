"""All author-side changed-input cases on genuine CPython Biopython and sklearn."""
import copy
import json
import os
import sys
from pathlib import Path

os.environ["MPLBACKEND"]="Agg"
ROOT=Path(__file__).resolve().parents[1]
EXPECTED=("N01","N02","N03","N04","L01","L02","L03")
total=0
for cid in EXPECTED:
    lesson=json.loads((ROOT/"content"/cid.lower()/"lesson.json").read_text(encoding="utf-8"))
    reference=json.loads((ROOT/"tests"/f"reference_{cid.lower()}.json").read_text(encoding="utf-8"))
    for goal in [*lesson["goals"],lesson["capstone"],lesson["review"]]:
        for phase in ("apply","prove"):
            task=goal["phases"][phase]
            cases=task.get("public_checks",[])
            if not cases:continue
            program=compile(reference[goal["id"]][phase],"<author-side reference>","exec")
            for number,item in enumerate(cases):
                inputs=copy.deepcopy(item["inputs"])
                env={"__name__":"__main__",**copy.deepcopy(inputs)}
                try:
                    exec(program,env)
                    for expr in item["assertions"]:
                        assert bool(eval(compile(expr,"<changed-input public check>","eval"),env)),expr
                    assert all(env[k]==v for k,v in inputs.items()),"Source input mutated"
                    assert "result" in env,(cid,goal["id"],phase)
                except BaseException:
                    print(f"FAIL {cid} {goal['id']} {phase} fixture {number}",flush=True)
                    raise
                total+=1
    print("PASS",cid,flush=True)
assert total==237,total
print("PASS all",total,"real CPython Biopython/sklearn changed-input checks",flush=True)
