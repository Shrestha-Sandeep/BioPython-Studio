const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const S=require('../learning-state.js');
const manifest=JSON.parse(fs.readFileSync('curriculum/v3_manifest.json','utf8'));
const catalog=JSON.parse(fs.readFileSync('curriculum/v3_pilot.json','utf8')).activities;
test('25/61 legacy fixtures preserve every byte and alias without mastery',()=>{
 for(const count of [25,61]){
  const ids=manifest.legacy_migration.slice(0,count).map(x=>x.legacy_id);
  const legacy={step:count-1,completed:Object.fromEntries(ids.map(id=>[id,'independent'])),drafts:Object.fromEntries(ids.map(id=>[id,`# saved ${id}\nprint('β')`])),hintUsed:Object.fromEntries(ids.map(id=>[id,true])),unknown:{future:'preserve'}};
  const raw=JSON.stringify(legacy),memory={[S.LEGACY_KEY]:raw};
  const storage={getItem:k=>memory[k]||null};
  const state=S.load(storage),aliases=S.migrateAliases(state,manifest);
  assert.equal(state.legacySnapshots[0],raw);assert.equal(memory[S.LEGACY_KEY],raw);
  assert.equal(Object.values(aliases).flat().length,count);
  assert.deepEqual(state.skills,{});
  const imported=S.merge(S.fresh(),JSON.parse(JSON.stringify(state)));
  assert.deepEqual(imported,state);
 }
});
test('guided, independent, needs review and delayed retained evidence are distinct',()=>{
 const state=S.fresh(),skill=S.record(state,'a'),now=100000;
 S.assess(skill,'modify',{ok:true},now);assert.equal(S.evidence(skill),'explored');
 skill.hints.write=1;S.assess(skill,'write',{ok:true},now);assert.equal(S.evidence(skill),'explored');
 S.assess(skill,'debug',{ok:true},now);assert.equal(S.evidence(skill),'guided');
 assert.equal(S.due(skill,now+S.DELAY-1),false);
 S.assess(skill,'transfer',{ok:true},now+S.DELAY-1);assert.equal(S.evidence(skill),'guided');
 S.assess(skill,'transfer',{ok:false},now+S.DELAY);assert.equal(S.evidence(skill),'needs review');
 S.assess(skill,'transfer',{ok:true},now+S.DELAY);assert.equal(S.evidence(skill),'independent');
 skill.activeReview=1;S.assess(skill,'transfer',{ok:true},now+S.DELAY*2);assert.equal(S.evidence(skill),'retained');
});
test('blank write without hints awards independent evidence, not retained',()=>{
 const skill=S.record(S.fresh(),'a');S.assess(skill,'write',{ok:true},1000);assert.equal(S.evidence(skill),'independent');
});
test('actual local prerequisites unlock optional sequence without microscopy',()=>{
 const state=S.fresh(),sequence=manifest.competencies.find(x=>x.number==='123');
 assert.equal(S.ready(state,sequence),false);
 for(const id of sequence.prerequisites)S.record(state,id).guidedAt=100;
 assert.equal(S.ready(state,sequence),true);
 assert.equal(Object.keys(state.skills).some(id=>id.startsWith('bps3.m07')),false);
 const ml=manifest.competencies.find(x=>x.number==='139');assert.equal(S.ready(state,ml),false);
 for(const id of ml.prerequisites)S.record(state,id).guidedAt=100;
 assert.equal(S.ready(state,ml),true);
});
test('import preserves local drafts and archives conflicting records',()=>{
 const local=S.fresh(),incoming=S.fresh();S.record(local,'a').drafts.write='local';S.record(incoming,'a').drafts.write='imported';
 const merged=S.merge(local,incoming);assert.equal(merged.skills.a.drafts.write,'local');assert.equal(merged.importArchive[0].record.drafts.write,'imported');
 assert.throws(()=>S.validate({schema:2}));assert.throws(()=>S.validate({schema:3,skills:{a:{}},legacySnapshots:[]}));
});
test('a corrected failed transfer is independent practice; retention needs a fresh prompt',()=>{
 const skill=S.record(S.fresh(),'a');skill.independentAt=100;skill.reviewAt=200;skill.activeReview=0;
 S.assess(skill,'transfer',{ok:false},300);S.assess(skill,'transfer',{ok:true},301);
 assert.equal(S.evidence(skill),'independent');skill.activeReview=1;
 S.assess(skill,'transfer',{ok:true},301+S.DELAY);assert.equal(S.evidence(skill),'retained');
});
test('nested import archives survive another export/import',()=>{
 const incoming=S.fresh();incoming.importArchive=[{id:'a',record:{drafts:{write:'old imported draft'}}}];
 const result=S.merge(S.fresh(),incoming);assert.deepEqual(result.importArchive,incoming.importArchive);
});

test('a completed transfer cannot award retention again after another day',()=>{
 const skill=S.record(S.fresh(),'a');skill.guidedAt=100;skill.reviewAt=200;skill.activeReview=0;
 S.assess(skill,'transfer',{ok:true},300);assert.equal(S.evidence(skill),'independent');
 S.assess(skill,'transfer',{ok:true},300+S.DELAY);assert.equal(S.evidence(skill),'independent');
 skill.activeReview=1;S.assess(skill,'transfer',{ok:true},300+S.DELAY);assert.equal(S.evidence(skill),'retained');
});
test('repeating an old write check cannot clear a failed transfer review',()=>{
 const skill=S.record(S.fresh(),'a');skill.independentAt=10;skill.reviewAt=20;skill.activeReview=0;
 S.assess(skill,'transfer',{ok:false},30);S.assess(skill,'write',{ok:true},31);
 assert.equal(S.evidence(skill),'needs review');
});
test('import replaces an untouched landing record and restores the saved position',()=>{
 const local=S.fresh(),incoming=S.fresh();S.record(local,'a');
 S.record(incoming,'a').drafts.write='saved draft';incoming.current='a';
 const merged=S.merge(local,incoming);assert.equal(merged.skills.a.drafts.write,'saved draft');assert.equal(merged.current,'a');assert.equal(merged.importArchive,undefined);
 local.skills.a.prediction='my own prediction';
 const conflicted=S.merge(local,incoming);assert.equal(conflicted.skills.a.prediction,'my own prediction');assert.equal(conflicted.importArchive[0].record.drafts.write,'saved draft');
});
