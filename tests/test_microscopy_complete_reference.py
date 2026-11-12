"""Run all 339 new reference cases with real CPython and scientific libraries."""
import copy,json,os,sys
from pathlib import Path
os.environ['MPLBACKEND']='Agg'
ROOT=Path(__file__).resolve().parents[1]
IMAGE=ROOT/'assets/witz/fluorescence-single.png'
assert IMAGE.is_file()
TOTAL=0
for cid in ('I05','I06','I09','I10','I11','I12','I13'):
    chapter=json.loads((ROOT/'content'/cid.lower()/'lesson.json').read_text(encoding='utf8'))
    ref=json.loads((ROOT/'tests'/f'reference_{cid.lower()}.json').read_text(encoding='utf8'))
    for goal in [*chapter['goals'],chapter['capstone'],chapter['review']]:
        for phase in ('apply','prove'):
            tests=goal['phases'][phase].get('public_checks',[])
            if not tests:continue
            code=ref[goal['id']][phase]
            program=compile(code,'<author-side scientific reference>','exec')
            for index,test in enumerate(tests):
                inputs=copy.deepcopy(test['inputs'])
                if 'image_path' in inputs:inputs['image_path']=str(IMAGE)
                env={'__name__':'__main__',**copy.deepcopy(inputs)}
                try:
                    exec(program,env)
                    for expr in test['assertions']:
                        assert bool(eval(compile(expr,'<public practice condition>','eval'),env)),expr
                    for k,v in inputs.items():
                        assert env[k]==v,(k,'source input modified')
                except BaseException:
                    print('FAIL',cid,goal['id'],phase,index,flush=True)
                    raise
                TOTAL+=1
                if 'matplotlib.pyplot' in sys.modules:
                    import matplotlib.pyplot as plt
                    plt.close('all')
print(f'PASS {TOTAL} original-input-preserving CPython cases',flush=True)
assert TOTAL==339,TOTAL
