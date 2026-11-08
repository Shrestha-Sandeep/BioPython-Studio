"""Contract checks for seven new I05–I06 and I09–I13 microscopy missions."""
import ast,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
load=lambda p:json.loads((ROOT/p).read_text(encoding='utf8'))
spine=load('curriculum/witz_spine.json');manifest=load('curriculum/v3_manifest.json')
expected={'I05':6,'I06':7,'I09':6,'I10':6,'I11':7,'I12':9,'I13':5}
claimed=[];cases_count=0
for cid,n in expected.items():
    ch=load(f'content/{cid.lower()}/lesson.json')
    authored=next(m for m in spine['missions'] if m['id']==cid)
    assert ch['schema_version']=='bps.chapter.v1' and ch['chapter_id']==cid and ch['version']=='1.0.0'
    assert len(ch['goals'])==n,(cid,len(ch['goals']))
    assert ch['competencies']==authored['competency_numbers'],cid
    assert [s for g in ch['goals'] for s in g['competencies']]==authored['competency_numbers']
    claimed+=ch['competencies']
    assert (ROOT/'content/chapters'/f'{cid}_COMPLETE.md').is_file()
    refs=load(f'tests/reference_{cid.lower()}.json')
    assert ch['capstone']['id']==cid+'-CAPSTONE'
    assert ch['review']['id']==cid+'-REVIEW'
    assert not ch['review']['worked_example']['code']
    assert ch['capstone']['competencies']==ch['review']['competencies']==[]
    assert ch['final_project']['name'].endswith('.py')
    for g in [*ch['goals'],ch['capstone'],ch['review']]:
        assert g['why'] and g['scientific_boundary'] and len(g['explain'])>=3
        for phase in ('learn','apply','prove'):
            task=g['phases'][phase]
            code=task['starter_code']
            assert code.startswith(f"# {g['id']} | {phase.upper()} |"),(g['id'],phase)
            assert '# TASK:' in code and '\n\n' in code
            for line in code.splitlines():
                if line.startswith('#'):assert len(line)<=85,(g['id'],phase,len(line),line)
            ast.parse(code)
            if phase=='learn':
                if not g['id'].endswith('-REVIEW'):
                    assert g['worked_example']['code'] in code
                    compile(g['worked_example']['code'],'<worked example>','exec')
                continue
            assert all(not line.strip() or line.lstrip().startswith('#') for line in code.splitlines()),(g['id'],phase,'solution leak')
            assert g['hints']['prove']==[],g['id']
            public=task.get('public_checks',[])
            if g['id'].endswith('-REVIEW') and phase=='apply':assert not public
            else:
                assert len(public)==3,(g['id'],phase,len(public))
                assert all(isinstance(c['inputs'],dict) and c['assertions'] for c in public)
            assert bool(refs[g['id']][phase])==bool(public),(g['id'],phase)
            cases_count+=len(public)
assert len(claimed)==46 and len(set(claimed))==46
assert set(claimed)<={x['number'] for x in manifest['competencies']}
assert cases_count==339,cases_count
print('PASS 7 new chapters; 46 canonical skills; 339 public scenarios; independent blank Prove tasks')
