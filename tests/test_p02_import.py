"""P02 learner import contract: stable IDs, complete activities and no answer-key JSON."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
def load(path):return json.loads((ROOT/path).read_text(encoding='utf-8'))
p01=load('content/p01/lesson.json')
p02=load('content/p02/lesson.json')
spine=load('curriculum/witz_spine.json')
manifest=load('curriculum/v3_manifest.json')
assert p01['chapter_id']=='P01' and len(p01['goals'])==7
assert p02['schema_version']=='bps.chapter.v1' and p02['chapter_id']=='P02'
assert p02['version']=='1.0.0'
assert [g['id'] for g in p02['goals']]==['P02-G01','P02-G02','P02-G03','P02-G04']
numbers=[x for g in p02['goals'] for x in g['competencies']]
assert len(set(numbers))==4 and set(numbers)==set(p02['competencies'])
assert set(numbers)==set(next(m['competency_numbers'] for m in spine['missions'] if m['id']=='P02'))
assert set(numbers)<=set(c['number'] for c in manifest['competencies'])
assert p02['capstone']['id']=='P02-CAPSTONE' and p02['capstone']['competencies']==[]
assert p02['review']['id']=='P02-REVIEW' and p02['review']['competencies']==[]
assert p02['review']['worked_example']['code']==''
assert not (ROOT/'content/author/p02_reference.json').exists(),"Author answer file must not be imported into learner build"
assert not (ROOT/'content/author/p01_reference.json').exists(),"P01 author file must remain separate"
assert (ROOT/'content/chapters/P02_COMPLETE.md').exists()
for g in [*p02['goals'],p02['capstone'],p02['review']]:
 assert len(g['explain'])>=3 and g['scientific_boundary'] and g['debug_task']
 assert g['phases']['learn']['starter_code']
 for phase in ['apply','prove']:
  if g['id']=='P02-REVIEW' and phase=='apply':continue
  checks=g['phases'][phase]['public_checks']
  assert len(checks)>=3, (g['id'],phase)
  for case in checks:
   assert isinstance(case['inputs'],dict) and case['assertions']
assert len(p02['capstone']['phases']['apply']['public_checks'])>=10
assert len(p02['capstone']['phases']['prove']['public_checks'])>=10
assert len(p02['capstone']['reflection_prompts'])>=4
print('P02 import PASS: 4/4 frozen competencies, full capstone, delayed practice, no author reference files')
