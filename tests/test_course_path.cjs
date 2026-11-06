const test=require('node:test'),assert=require('node:assert/strict'),C=require('../course-path.js'),S=require('../learning-state.js');
const manifest=require('../curriculum/v3_manifest.json'),catalog=require('../curriculum/v3_pilot.json');
test('one duplicate-free course follows Python → Microscopy → NGS → ML and preserves actual prerequisites',()=>{
 const path=C.build(manifest,catalog),done=new Set();let phase=0;
 assert.equal(path.length,156);assert.deepEqual(path.map(c=>c.number),manifest.recommended_complete_route);assert.equal(new Set(path.map(c=>c.id)).size,156);
 for(const c of path){assert.ok(C.stages.indexOf(c.stage)>=phase);phase=C.stages.indexOf(c.stage);assert.ok(c.prerequisites.every(id=>done.has(id)),c.id);done.add(c.id);}
 assert.equal(C.available(path).length,78);
 assert.equal(new Set(path.flatMap(c=>c.legacyIds)).size,61);
 for(const a of catalog.activities)assert.equal(path.find(c=>c.id===a.id).kind,'activity');
});
test('old aliases remain addressable without duplicate course entries',()=>{
 const path=C.build(manifest,catalog);
 for(const alias of manifest.legacy_migration)assert.ok(path.find(c=>c.id===alias.target_competency_id).legacyIds.includes(alias.legacy_id));
 const a=C.available(path)[0];assert.equal(C.adjacent(path,a.id,1).id,C.available(path)[1].id);
});
test('the source audit covers exactly the 47 available Python entries and resolves historical IDs',()=>{
 const entries=C.available(C.build(manifest,catalog)).filter(c=>c.stage==='Python');
 assert.equal(entries.length,47);
 assert.deepEqual(manifest.python_source_audit.entries.map(e=>e.number).sort(),entries.map(c=>c.number).sort());
 assert.equal(new Set(manifest.python_source_audit.entries.map(e=>e.number)).size,47);
 for(const entry of entries){
  const source=C.sourceFor(manifest,entry.id);
  assert.ok(['adapted','reference','authored'].includes(source.status));
  assert.match(source.source.source_blob,/^[a-f0-9]{40}$/);
  assert.ok(source.source.url.startsWith('https://github.com/'));
  assert.ok(source.note.length>40);
  for(const alias of entry.legacyIds)assert.deepEqual(C.sourceFor(manifest,alias),source);
 }
 assert.equal(C.sourceFor(manifest,'037').status,'adapted');
 assert.equal(C.sourceFor(manifest,'bio_replicate_n').status,'authored');
 assert.equal(C.sourceFor(manifest,'071'),null);
});
test('early transfer practice stays open, consumes the exposed prompt, and preserves drafts without awarding evidence',()=>{
 const r=S.record(S.fresh(),'a');r.independentAt=100;r.guidedAt=101;r.reviewAt=101+S.DELAY;
 r.drafts.transfer='saved unrun code';S.beginReview(r,3,200);assert.equal(r.reviewPractice,true);assert.equal(r.activeReview,0);
 assert.equal(r.transferDraftHistory[0].source,'saved unrun code');
 S.assess(r,'transfer',{ok:true,source:'practice code'},200);assert.equal(r.retainedAt,undefined);assert.equal(r.attempts.at(-1).stage,'transfer_practice');
 S.beginReview(r,3,102+S.DELAY);assert.equal(r.activeReview,1);assert.equal(r.reviewPractice,false);
 S.assess(r,'transfer',{ok:true,source:'fresh code'},102+S.DELAY);assert.equal(r.retainedAt,102+S.DELAY);
});
test('exhausted prompts can be practiced forever without manufacturing additional retention',()=>{
 const r=S.record(S.fresh(),'a');r.guidedAt=100;r.reviewAt=200;r.reviewCursor=3;
 S.beginReview(r,3,300);assert.equal(r.reviewPractice,true);
 for(let i=0;i<5;i++)S.assess(r,'transfer',{ok:true,source:'practice'},300+i);
 assert.equal(r.independentAt,undefined);assert.equal(r.retainedAt,undefined);
 assert.equal(r.attempts.length,5);
});
