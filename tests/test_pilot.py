"""Real Python pilot assessment, assistance-aware state and frozen ordering."""
import json
import re
from pathlib import Path
import pytest
ROOT=Path(__file__).resolve().parents[1]
raw=(ROOT/'worker.js').read_text()
ns={}
exec(re.search(r'const HARNESS = String\.raw`([\s\S]*?)`;\n\nlet runtimePromise',raw).group(1),ns)
evaluate=ns['pilot_evaluate']
CAT=json.loads((ROOT/'curriculum/v3_pilot.json').read_text())['activities']
MANIFEST=json.loads((ROOT/'curriculum/v3_manifest.json').read_text())

@pytest.mark.parametrize('activity',CAT,ids=lambda a:a['number'])
def test_every_pilot_stage_executes_reference_and_rejects_wrong_code(activity):
    for stage,spec in activity['stages'].items():
        result=evaluate(spec['reference'],spec)
        assert result['ok'],(activity['number'],stage,result)
        assert len(result['cases'])==3
        assert not evaluate('print("unchanging answer")',spec)['ok']
    assert not evaluate(activity['stages']['debug']['starter'],activity['stages']['debug'])['ok']

@pytest.mark.parametrize('activity',CAT,ids=lambda a:a['number'])
def test_worked_example_is_real_execution_including_intentional_traceback(activity):
    result=evaluate(activity['example']['source'],dict(cases=[activity['example']['case']],checks=[],input_types=activity['example'].get('input_types',{})),True)
    if activity['number']=='002':
        assert not result['ok']
        assert 'NameError' in result['cases'][0]['error']
        assert 'line 2' in result['cases'][0]['error']
    else: assert result['ok'],result

def test_pilot_order_and_unseen_delayed_inputs():
    assert [a['number'] for a in CAT[:15]]==MANIFEST['recommended_first_15']
    assert [a['number'] for a in CAT]==MANIFEST['recommended_default_route'][:28]
    done=set()
    for a in CAT:
        c=next(c for c in MANIFEST['competencies'] if c['id']==a['id'])
        assert set(c['prerequisites'])<=done
        done.add(a['id'])
        assert a['stages']['write']['starter']==''
        assert a['stages']['transfer']['starter']==''
        assert a['stages']['transfer']['cases']!=a['stages']['write']['cases']
        assert len(a['hints'])==3

def test_bad_code_has_actionable_traceback_and_execution_limit():
    spec=CAT[0]['stages']['modify']
    result=evaluate('print(fieldname)',spec)
    assert not result['ok'] and 'line 1' in result['cases'][0]['error']
    assert 'spelling' in result['message']
    result=evaluate('while True:\n    pass',spec)
    assert not result['ok'] and 'Too many code steps' in result['cases'][0]['error']
    result=evaluate('if True\n    print(1)',spec)
    assert not result['ok'] and 'line 1' in result['message']

def test_mutating_learner_inputs_cannot_mutate_oracle():
    a=next(a for a in CAT if a['number']=='012');spec=a['stages']['modify']
    code='signals.clear()\nkept = 0\nfor signal in signals:\n    kept += 1\nprint(kept)'
    before=json.dumps(spec)
    assert not evaluate(code,spec)['ok']
    assert json.dumps(spec)==before


def test_float_input_type_survives_javascript_json_integer_serialization():
    import copy
    a=next(a for a in CAT if a['number']=='007');spec=copy.deepcopy(a['stages']['write'])
    for case in spec['cases']:case['distance_um']=int(case['distance_um'])
    assert evaluate(spec['reference'],spec)['ok']

@pytest.mark.parametrize('activity',CAT,ids=lambda a:a['number'])
def test_each_delayed_prompt_is_novel_and_executes(activity):
    seen=[activity['stages']['write']['cases']]
    for spec in activity['transfers']:
        assert spec['cases'] not in seen
        assert evaluate(spec['reference'],spec)['ok']
        seen.append(spec['cases'])

def test_notebook_kernel_retains_state_until_restart_and_isolates_assessment():
    ns['NOTEBOOK_NAMESPACE']={}
    run=lambda code,reset=False:json.loads(ns['notebook_json'](code,reset))
    assert 'NameError' in run('print(field_count)')['cases'][0]['error']
    assert run('field_count = 3')['ok']
    assert run('print(field_count)')['cases'][0]['output'].strip()=='3'
    assert run('field_count = 7')['ok']
    assert run('print(field_count)')['cases'][0]['output'].strip()=='7'
    # A normal assessment has no access to notebook kernel variables.
    result=evaluate('print(field_count)',dict(cases=[{}],checks=[]),True)
    assert not result['ok'] and 'NameError' in result['cases'][0]['error']
    assert run('',True)['ok']
    assert 'NameError' in run('print(field_count)')['cases'][0]['error']

def test_notebook_saved_function_traceback_from_earlier_cell_does_not_crash_feedback():
    ns['NOTEBOOK_NAMESPACE']={}
    run=lambda code:json.loads(ns['notebook_json'](code))
    assert run('\n\n\n\ndef fail():\n    return missing_value')['ok']
    result=run('fail()')
    assert not result['ok']
    assert 'NameError' in result['cases'][0]['error']
    assert 'earlier cell' in result['cases'][0]['error']
