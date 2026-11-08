"""Frozen scientific-Python mission contracts I01-I04, I07-I08 (not I05/I06 or I12)."""
import ast
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
load=lambda path:json.loads((ROOT/path).read_text(encoding='utf8'))
spine=load('curriculum/witz_spine.json')
manifest=load('curriculum/v3_manifest.json')
expected_counts={'I01':8,'I02':6,'I03':10,'I04':6,'I07':7,'I08':8}
all_assigned=[]
checks=0
for cid,n_goals in expected_counts.items():
    ch=load(f'content/{cid.lower()}/lesson.json')
    source=next(m for m in spine['missions'] if m['id']==cid)
    assert ch['schema_version']=='bps.chapter.v1' and ch['chapter_id']==cid and ch['version']=='1.0.0'
    assert len(ch['goals'])==n_goals,(cid,'goal count')
    assert [s for g in ch['goals'] for s in g['competencies']]==source['competency_numbers'],cid
    assert ch['competencies']==source['competency_numbers']
    all_assigned.extend(ch['competencies'])
    assert ch['capstone']['id']==cid+'-CAPSTONE'
    assert ch['review']['id']==cid+'-REVIEW'
    assert ch['capstone']['competencies']==ch['review']['competencies']==[]
    assert not ch['review']['worked_example']['code']
    assert (ROOT/'content/chapters'/f'{cid}_COMPLETE.md').is_file()
    assert (ROOT/'tests'/f'reference_{cid.lower()}.json').is_file()
    assert ch['final_project']['name'].endswith('.py')
    for goal in [*ch['goals'],ch['capstone'],ch['review']]:
        assert goal['why'] and goal['scientific_boundary'] and len(goal['explain'])>=3
        assert goal['prediction_answer'] and goal['worked_example']['predict']
        assert len(goal['hints']['prove'])==0
        for phase in ('learn','apply','prove'):
            p=goal['phases'][phase]
            code=p['starter_code']
            assert code.startswith(f"# {goal['id']} | {phase.upper()} |"),(goal['id'],phase)
            assert '# TASK:' in code and '\n\n' in code
            for line in code.splitlines():
                if line.startswith('#'):
                    assert len(line)<=85,(goal['id'],phase,len(line),line)
            ast.parse(code)
            if phase=='learn':
                if not goal['id'].endswith('-REVIEW'):
                    assert goal['worked_example']['code'] in code
                    if 'image_path' in code:
                        assert p['preview_inputs'].get('image_path')=='/home/pyodide/witz_published_figure.png'
                continue
            assert all(not line.strip() or line.lstrip().startswith('#') for line in code.splitlines()),(goal['id'],phase,'solution leak')
            feedback=p['practice_feedback']
            assert all(len(feedback[k])>25 for k in ('why','probe','check'))
            cases=p.get('public_checks',[])
            if goal['id'].endswith('-REVIEW') and phase=='apply':
                assert cases==[]
            else:
                assert 3<=len(cases)<=12,(goal['id'],phase,len(cases))
                assert all(isinstance(c['inputs'],dict) and c['assertions'] for c in cases)
            checks+=len(cases)
assert len(all_assigned)==45,len(all_assigned)
assert len(set(all_assigned))==45,'duplicate competencies'
assert set(all_assigned)<={g['number'] for g in manifest['competencies']}
assert '068' not in all_assigned,'replicate-aware uncertainty belongs to I12'
assert checks==327,checks
print(f'PASS 6 scientific Python missions, 45 canonical distinct skills, {checks} public cases, 54 activity screens, no leaked solutions or scientific overclaim')
