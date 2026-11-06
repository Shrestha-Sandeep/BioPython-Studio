const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const S=require('../learning-state.js'),M=require('../milestones.js');
const catalog=JSON.parse(fs.readFileSync('curriculum/v3_pilot.json'));
const manifest=JSON.parse(fs.readFileSync('curriculum/v3_manifest.json'));
const start=100000,now=start+3*M.DELAY;
function fixture(){
 const state=S.fresh();
 for(const a of catalog.activities.slice(0,15)){
  const r=S.record(state,a.id);S.assess(r,'write',{ok:true,source:a.stages.write.reference},start);S.assess(r,'debug',{ok:true},start+1);
 }
 return state;
}
function complete(state){
 for(const c of M.summary(state,catalog,now).checkpoints){
  const r=state.skills[c.id];r.activeReview=0;r.reviewCursor=1;
  S.assess(r,'transfer',{ok:true,source:r.drafts.write||'print("test code")'},start+M.DELAY+2);
  const code=M.sourceForReview(r,now);
  r.pilotReflection={text:'Explains inputs, reasoning and an edge case',code,at:start+M.DELAY+3,review:{text:'Explains inputs, reasoning and an edge case',code,at:start+M.DELAY+4,input:true,reasoning:true,boundary:true,note:'Human fixture'}};
 }
 return state;
}
test('fresh and 61-legacy-only progress cannot pass the milestone',()=>{
 const state=S.fresh();state.legacySnapshots=[JSON.stringify({completed:Object.fromEntries(manifest.legacy_migration.map(x=>[x.legacy_id,'independent']))})];
 const s=M.summary(state,catalog,now);assert.equal(s.ready,false);assert.equal(s.counts.practiced,0);assert.equal(M.next(state,catalog,manifest,now).id,catalog.activities[0].id);
});
test('the first 15 plus independent work still await explanations and elapsed transfer',()=>{
 const state=fixture(),s=M.summary(state,catalog,now);assert.equal(s.counts.practiced,15);assert.equal(s.counts.independent,3);assert.equal(s.counts.retained,0);assert.equal(s.ready,false);
 assert.equal(M.next(state,catalog,manifest,start+20).kind,'reflection');
 assert.equal(M.next(state,catalog,manifest,start+M.DELAY+2).kind,'transfer');
});
test('three actual delayed successes and recorded reviews produce readiness for human sign-off',()=>{
 const state=complete(fixture()),s=M.summary(state,catalog,now);assert.equal(s.ready,true);assert.equal(s.counts.retained,3);assert.equal(s.counts.reviewed,3);
 assert.equal(M.next(state,catalog,manifest,now).kind,'report');
 const report=M.report(state,catalog,manifest,now);assert.match(report.releaseDecision,/Pending human/);assert.match(report.scope,/do not certify/);assert.match(report.technicalVerification,/separately/);
 assert.equal(report.checkpointEvidence.length,3);
});
test('early or repeated checks, failed transfer and timestamp badges cannot manufacture retention',()=>{
 const state=complete(fixture()),c=M.summary(state,catalog,now).checkpoints[0],r=state.skills[c.id];
 r.retainedAt=start+10;r.attempts.push({stage:'transfer',ok:true,assisted:false,reviewIndex:1,at:start+10});assert.equal(M.proof(r,now).retained,null);
 r.retainedAt=start+M.DELAY+2;r.attempts.push({stage:'transfer',ok:false,assisted:false,reviewIndex:0,at:start+M.DELAY+1});assert.equal(M.proof(r,now).retained,null);
 r.attempts=[];assert.equal(M.proof(r,now).independent,null);
});
test('outside help before and after a successful check remains assistance; fresh prompts can recover evidence',()=>{
 const r=S.record(S.fresh(),'a');S.noteHelp(r,'write',start);S.assess(r,'write',{ok:true,source:'print(1)'},start+1);S.assess(r,'debug',{ok:true},start+2);
 assert.equal(r.independentAt,undefined);assert.equal(r.attempts[0].assisted,true);
 r.activeReview=0;S.assess(r,'transfer',{ok:true,source:'print(2)'},start+M.DELAY+3);assert.ok(r.independentAt);
 S.noteHelp(r,'transfer',start+M.DELAY+4);assert.equal(r.independentAt,null);assert.equal(r.attempts.at(-1).assisted,true);
 r.activeReview=1;S.assess(r,'transfer',{ok:true,source:'print(3)'},start+2*M.DELAY+4);assert.ok(r.independentAt);assert.equal(r.retainedAt,null);
});
test('explanations need all rubric criteria and must match the reviewed text and saved code',()=>{
 const state=complete(fixture()),c=M.summary(state,catalog,now).checkpoints[0],r=state.skills[c.id];
 r.pilotReflection.review.boundary=false;assert.equal(M.summary(state,catalog,now).ready,false);
 r.pilotReflection.review.boundary=true;r.pilotReflection.text+=' changed';assert.equal(M.summary(state,catalog,now).checkpoints[0].reviewed,false);
 r.pilotReflection.text=r.pilotReflection.review.text;r.pilotReflection.code='new code';assert.equal(M.summary(state,catalog,now).ready,false);
});
test('feedback resolution is linked to the exact report and reopening blocks readiness',()=>{
 const state=complete(fixture()),r=state.skills[catalog.activities[0].id];r.feedback={clarity:'technical-issue',note:'Image failed',at:start};
 assert.equal(M.summary(state,catalog,now).counts.openIssues,1);
 r.pilotIssueNotes=[{feedbackKey:M.feedbackKey(r.feedback),status:'resolved',note:'Retry tested successfully',at:start+1}];assert.equal(M.summary(state,catalog,now).ready,true);
 r.feedback={...r.feedback,note:'Image failed again',at:start+2};assert.equal(M.summary(state,catalog,now).counts.openIssues,1);
});
test('exhausted prompts produce an honest blocker, never an automatic new retained badge',()=>{
 const state=fixture();for(const c of M.summary(state,catalog,now).checkpoints){const r=state.skills[c.id];r.reviewCursor=3;const code=M.sourceForReview(r,now);r.pilotReflection={text:'Explanation',code,at:start,review:{text:'Explanation',code,input:true,reasoning:true,boundary:true,at:start+1}};}
 assert.equal(M.next(state,catalog,manifest,now).kind,'blocked');assert.equal(M.summary(state,catalog,now).ready,false);
});
test('old drafts and new evaluation records survive progress import and conflicts',()=>{
 const incoming=complete(fixture()),key=catalog.activities[3].id;incoming.skills[key].pilotIssueNotes=[{feedbackKey:'x',note:'keep this review',status:'resolved',at:start}];
 const merged=S.merge(S.fresh(),JSON.parse(JSON.stringify(incoming)));assert.deepEqual(merged.skills,incoming.skills);
 const local=S.fresh();S.record(local,key).drafts.write='local code';const conflict=S.merge(local,incoming);assert.equal(conflict.skills[key].drafts.write,'local code');assert.deepEqual(conflict.importArchive.find(x=>x.id===key).record.pilotIssueNotes,incoming.skills[key].pilotIssueNotes);
});
