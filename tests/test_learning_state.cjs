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
 S.beginReview(skill,3,now+S.DELAY-1);S.assess(skill,'transfer',{ok:true},now+S.DELAY-1);assert.equal(S.evidence(skill),'guided');
 S.beginReview(skill,3,now+S.DELAY);S.assess(skill,'transfer',{ok:false},now+S.DELAY);assert.equal(S.evidence(skill),'needs review');
 S.assess(skill,'transfer',{ok:true},now+S.DELAY);assert.equal(S.evidence(skill),'independent');
 S.beginReview(skill,3,now+S.DELAY*2);S.assess(skill,'transfer',{ok:true},now+S.DELAY*2);assert.equal(S.evidence(skill),'retained');
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
 const skill=S.record(S.fresh(),'a');S.assess(skill,'write',{ok:true},100);S.assess(skill,'debug',{ok:true},200);
 S.beginReview(skill,3,200+S.DELAY);S.assess(skill,'transfer',{ok:false},200+S.DELAY);S.assess(skill,'transfer',{ok:true},201+S.DELAY);
 assert.equal(S.evidence(skill),'independent');S.beginReview(skill,3,201+2*S.DELAY);
 S.assess(skill,'transfer',{ok:true},201+2*S.DELAY);assert.equal(S.evidence(skill),'retained');
});
test('nested import archives survive another export/import',()=>{
 const incoming=S.fresh();incoming.importArchive=[{id:'a',record:{drafts:{write:'old imported draft'}}}];
 const result=S.merge(S.fresh(),incoming);assert.deepEqual(result.importArchive,incoming.importArchive);
});

test('a completed transfer cannot award retention again after another day',()=>{
 const skill=S.record(S.fresh(),'a');S.assess(skill,'debug',{ok:true},100);
 S.beginReview(skill,3,100+S.DELAY);S.assess(skill,'transfer',{ok:true},100+S.DELAY);assert.equal(S.evidence(skill),'independent');
 S.assess(skill,'transfer',{ok:true},100+2*S.DELAY);assert.equal(S.evidence(skill),'independent');
 S.beginReview(skill,3,100+2*S.DELAY);S.assess(skill,'transfer',{ok:true},100+2*S.DELAY);assert.equal(S.evidence(skill),'retained');
});
test('repeating an old write check cannot clear a failed transfer review',()=>{
 const skill=S.record(S.fresh(),'a');S.assess(skill,'write',{ok:true},10);S.assess(skill,'debug',{ok:true},20);S.beginReview(skill,3,20+S.DELAY);
 S.assess(skill,'transfer',{ok:false},20+S.DELAY);S.assess(skill,'write',{ok:true},21+S.DELAY);
 assert.equal(S.evidence(skill),'needs review');
});
test('import replaces an untouched landing record and restores the saved position',()=>{
 const local=S.fresh(),incoming=S.fresh();S.record(local,'a');
 S.record(incoming,'a').drafts.write='saved draft';incoming.current='a';
 const merged=S.merge(local,incoming);assert.equal(merged.skills.a.drafts.write,'saved draft');assert.equal(merged.current,'a');assert.equal(merged.importArchive,undefined);
 local.skills.a.prediction='my own prediction';
 const conflicted=S.merge(local,incoming);assert.equal(conflicted.skills.a.prediction,'my own prediction');assert.equal(conflicted.importArchive[0].record.drafts.write,'saved draft');
});
test('learner feedback survives export/import and makes a record substantive',()=>{
 const local=S.fresh(),incoming=S.fresh(),skill=S.record(local,'a');
 skill.feedback={clarity:'needs-example',note:'Explain the boundary',at:100};S.record(incoming,'a').drafts.write='imported';
 const merged=S.merge(local,incoming);assert.deepEqual(merged.skills.a.feedback,skill.feedback);
 assert.equal(merged.importArchive[0].record.drafts.write,'imported');
 const restored=S.merge(S.fresh(),JSON.parse(JSON.stringify(local)));assert.deepEqual(restored.skills.a.feedback,skill.feedback);
});
test('a later independent attempt moves eligibility, and opening an early prompt remains practice',()=>{
 const skill=S.record(S.fresh(),'a'),t=100000;
 S.assess(skill,'debug',{ok:true},t);S.assess(skill,'write',{ok:true,source:'independent code'},t+S.DELAY/2);
 assert.equal(S.reviewDueAt(skill),t+1.5*S.DELAY);
 assert.equal(S.due(skill,t+S.DELAY),false);
 S.beginReview(skill,3,t+S.DELAY);S.assess(skill,'transfer',{ok:true,source:'early code'},t+S.DELAY);
 assert.equal(S.evidence(skill),'independent');assert.equal(skill.retainedAt,undefined);
 assert.equal(skill.attempts.at(-1).stage,'transfer_practice');
 S.beginReview(skill,3,t+1.5*S.DELAY);assert.equal(skill.activeReview,1);
 S.assess(skill,'transfer',{ok:true,source:'fresh code'},t+1.5*S.DELAY);assert.equal(S.evidence(skill),'retained');
});
test('the exact 24-hour boundary qualifies and old early retention timestamps are preserved without a badge',()=>{
 const skill=S.record(S.fresh(),'a'),t=100000;
 S.assess(skill,'debug',{ok:true},t);S.assess(skill,'write',{ok:true},t+S.DELAY/2);
 skill.retainedAt=t+S.DELAY;const before=JSON.stringify(skill);
 assert.equal(S.evidence(skill),'independent');assert.equal(JSON.stringify(skill),before);
 assert.equal(S.due(skill,t+1.5*S.DELAY-1),false);assert.equal(S.due(skill,t+1.5*S.DELAY),true);
});
test('reopening an unfinished delayed check preserves the same prompt and code, including after import',()=>{
 const state=S.fresh(),skill=S.record(state,'a'),t=100000;
 S.assess(skill,'debug',{ok:true},t);S.beginReview(skill,3,t+S.DELAY);
 skill.drafts.transfer='unfinished code';skill.stage='debug';
 const restored=S.merge(S.fresh(),JSON.parse(JSON.stringify(state))).skills.a;
 S.beginReview(restored,3,t+S.DELAY+1);
 assert.equal(restored.stage,'transfer');assert.equal(restored.activeReview,0);assert.equal(restored.reviewCursor,1);
 assert.equal(restored.drafts.transfer,'unfinished code');assert.equal(restored.transferDraftHistory,undefined);
});
test('an unfinished final prompt can still resume when no unseen prompts remain',()=>{
 const skill=S.record(S.fresh(),'a'),t=100000;
 S.assess(skill,'debug',{ok:true},t);skill.reviewCursor=2;S.beginReview(skill,3,t+S.DELAY);skill.drafts.transfer='last prompt code';
 assert.equal(S.reviewAction(skill,3,t+S.DELAY).kind,'resume');
 S.beginReview(skill,3,t+S.DELAY+1);assert.equal(skill.activeReview,2);assert.equal(skill.drafts.transfer,'last prompt code');assert.equal(skill.reviewPractice,false);
});
test('early practice resumes without consuming more prompts, and later eligibility uses an unseen prompt',()=>{
 const skill=S.record(S.fresh(),'a'),t=100000;
 S.assess(skill,'debug',{ok:true},t);S.beginReview(skill,3,t+1);skill.drafts.transfer='practice code';
 S.beginReview(skill,3,t+2);assert.equal(skill.reviewCursor,1);assert.equal(skill.drafts.transfer,'practice code');
 S.beginReview(skill,3,t+S.DELAY);assert.equal(skill.activeReview,1);assert.equal(skill.reviewPractice,false);
 assert.equal(skill.transferDraftHistory[0].source,'practice code');
});
test('a prompt already exposed before new independent work stays practice after the new interval',()=>{
 const skill=S.record(S.fresh(),'a'),t=100000;
 S.assess(skill,'debug',{ok:true},t);S.beginReview(skill,3,t+S.DELAY);skill.drafts.transfer='already seen prompt';
 S.assess(skill,'write',{ok:true},t+1.5*S.DELAY);assert.equal(skill.reviewPractice,true);
 assert.equal(skill.drafts.transfer,'already seen prompt');
 S.beginReview(skill,3,t+2.5*S.DELAY);assert.equal(skill.activeReview,1);assert.equal(skill.reviewPractice,false);
 assert.equal(skill.transferDraftHistory[0].source,'already seen prompt');
});
