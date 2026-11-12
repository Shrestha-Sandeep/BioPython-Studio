"""P03 learner-package contract: stable curriculum mapping, full content, no author-only keys."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(path):return json.loads((ROOT/path).read_text(encoding='utf-8'))
mission=read('content/p03/lesson.json')
spine=read('curriculum/witz_spine.json')
manifest=read('curriculum/v3_manifest.json')
assert mission['chapter_id']=='P03' and mission['schema_version']=='bps.chapter.v1'
assert len(mission['goals'])==7
assert [g['id'] for g in mission['goals']]==[f'P03-G{i:02d}' for i in range(1,8)]
assigned=[s for g in mission['goals'] for s in g['competencies']]
expected=set(next(m['competency_numbers'] for m in spine['missions'] if m['id']=='P03'))
assert set(assigned)==expected and len(assigned)==len(expected)==7
assert expected<={c['number'] for c in manifest['competencies']}
assert set(mission['competencies'])==expected
assert mission['capstone']['id']=='P03-CAPSTONE' and mission['capstone']['competencies']==[]
assert mission['review']['id']=='P03-REVIEW' and mission['review']['competencies']==[]
assert not mission['review']['worked_example']['code']
assert len(mission['capstone']['phases']['apply']['public_checks'])==12
assert len(mission['capstone']['phases']['prove']['public_checks'])==11
assert len(mission['review']['phases']['prove']['public_checks'])==6
assert len(mission['capstone']['reflection_prompts'])==5
assert not (ROOT/'content/author/p03_reference.json').exists()
assert not (ROOT/'content/author/p02_reference.json').exists()
assert not (ROOT/'content/author/p01_reference.json').exists()
assert (ROOT/'content/chapters/P03_COMPLETE.md').exists()
for g in [*mission['goals'], mission['capstone'], mission['review']]:
 assert g['why'] and g['scientific_boundary'] and len(g['explain'])>=3
 assert g['prediction_answer'] and g['walkthrough'] and g['debug_task']
 for phase in ('learn','apply','prove'):
  assert g['phases'][phase]['starter_code']
 for phase in ('apply','prove'):
  if g['id']=='P03-REVIEW' and phase=='apply':continue
  checks=g['phases'][phase]['public_checks']
  assert len(checks)>=3
  assert all(isinstance(c['inputs'],dict) and c['assertions'] for c in checks)
assert read('content/p01/lesson.json')['chapter_id']=='P01'
assert read('content/p02/lesson.json')['chapter_id']=='P02'
assert "biological replicate" in (ROOT/'content/chapters/P03_COMPLETE.md').read_text(encoding='utf8')
print('P03 import: PASS, seven canonical skills, complete capstone + delayed review; no author references in learner package')
