"""Transparent CPython reference QA for all scientific Python missions, including actual Witz PNG."""
import copy
import json
import os
import sys
from pathlib import Path

os.environ['MPLBACKEND']='Agg'
ROOT=Path(__file__).resolve().parents[1]
IMAGE=ROOT/'assets/witz/fluorescence-single.png'
assert IMAGE.is_file()
TOTAL=0
for cid in ('I01','I02','I03','I04','I07','I08'):
    lesson=json.loads((ROOT/'content'/cid.lower()/'lesson.json').read_text(encoding='utf8'))
    references=json.loads((ROOT/'tests'/f'reference_{cid.lower()}.json').read_text(encoding='utf8'))
    for goal in [*lesson['goals'],lesson['capstone'],lesson['review']]:
        for phase in ('apply','prove'):
            cases=goal['phases'][phase].get('public_checks',[])
            if not cases:continue
            script=references[goal['id']][phase]
            assert script and isinstance(script,str),(cid,goal['id'],phase,'missing QA reference')
            compile(script,'<transparent scientific reference>','exec')
            for index,case in enumerate(cases):
                inputs=copy.deepcopy(case['inputs'])
                if 'image_path' in inputs:inputs['image_path']=str(IMAGE)
                env={'__name__':'__main__'}
                env.update(copy.deepcopy(inputs))
                exec(compile(script,'<transparent scientific reference>','exec'),env)
                for expr in case['assertions']:
                    try:
                        assert bool(eval(compile(expr,'<practice condition>','eval'),env))
                    except BaseException:
                        print('CHECK FAILED:',cid,goal['id'],phase,index,expr,flush=True)
                        raise
                for k,v in inputs.items():
                    assert env[k]==v,(cid,goal['id'],phase,index,'original input mutated',k)
                TOTAL+=1
                if 'matplotlib.pyplot' in sys.modules:
                    import matplotlib.pyplot as plt
                    plt.close('all')
print(f'PASS {TOTAL} scientific CPython NumPy/Pillow/Pandas/Matplotlib changed-input cases; original inputs preserved')
assert TOTAL==327,TOTAL
