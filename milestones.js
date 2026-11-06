/* Pilot evaluation policy: reuse existing competencies; never award mastery here. */
(function(root){
  'use strict';
  const DELAY=24*60*60*1000;
  const goal='Independently write, debug and explain a reproducible microscopy analysis using real, appropriately documented data.';
  const probes=[
    {number:'008',label:'Build a specimen label',prompt:'Explain where the specimen ID and channel come from, how the label is built, and what would go wrong if you copied a fixed ID.'},
    {number:'025',label:'Write a reusable QC function',prompt:'Explain the function inputs, the loop and returned result, and how your rule handles equality and an empty list. What does a passing field count tell you about biological replication?'},
    {number:'038',label:'Inspect array shape and axes',prompt:'Explain the difference between shape and ndim, how rows and columns appear in the output, and why shape alone cannot establish axis meaning or calibration.'}
  ];
  const milestones=[
    'Validate the beginner learning experience',
    'Complete an independent biological Python project',
    'Build and validate a real-image microscopy workflow',
    'Reproduce the analysis from a clean environment'
  ];
  const validTime=(t,now)=>Number.isFinite(t)&&t>0&&t<=now;
  function proof(skill,now=Date.now()){
    const attempts=skill?.attempts||[];
    const helped=a=>skill?.externalHelp?.[a.stage==='transfer'?'transfer:'+a.reviewIndex:a.stage]===true;
    const independent=attempts.find(a=>a.ok===true&&a.assisted===false&&!helped(a)&&a.at===skill.independentAt&&validTime(a.at,now)&&
      (a.stage==='write'||(a.stage==='transfer'&&Number.isInteger(a.reviewIndex)&&a.reviewIndex>=0&&a.at-skill.guidedAt>=DELAY)));
    const retained=independent&&attempts.find(a=>a.stage==='transfer'&&a.ok===true&&a.assisted===false&&!helped(a)&&a.at===skill.retainedAt&&validTime(a.at,now)&&a.at-independent.at>=DELAY&&a.at-skill.guidedAt>=DELAY&&Number.isInteger(a.reviewIndex)&&a.reviewIndex>=0&&
      !attempts.some(b=>b.stage==='transfer'&&b.reviewIndex===a.reviewIndex&&(b.ok===false||(b.ok===true&&b.at<a.at))));
    return {independent:skill?.needsReview?null:independent||null,retained:skill?.needsReview?null:retained||null};
  }
  function sourceForReview(skill,now=Date.now()){const p=proof(skill,now);return p.retained?.source??p.independent?.source??skill?.drafts?.write??'';}
  function reviewed(reflection,now,code){
    const r=reflection?.review;
    return !!(reflection?.text?.trim()&&typeof code==='string'&&code.length&&reflection.code===code&&r?.code===code&&r.text===reflection.text&&validTime(r.at,now)&&r.at>=reflection.at&&['input','reasoning','boundary'].every(k=>r[k]===true));
  }
  function feedbackKey(feedback){return JSON.stringify(feedback);}
  function issue(skill){
    if(!skill?.feedback||!['needs-example','technical-issue'].includes(skill.feedback.clarity))return null;
    const notes=(skill.pilotIssueNotes||[]).filter(n=>n.feedbackKey===feedbackKey(skill.feedback));
    const last=notes.at(-1);
    return {feedback:skill.feedback,resolved:last?.status==='resolved'&&!!last.note?.trim(),notes};
  }
  function summary(state,catalog,now=Date.now()){
    const pilot=catalog.activities.slice(0,catalog.pilot_count||15);
    const checkpoints=probes.map(p=>{
      const a=pilot.find(a=>a.number===p.number),s=state.skills[a.id],e=proof(s,now);
      return {...p,id:a.id,independent:!!e.independent,retained:!!e.retained,explanation:!!s?.pilotReflection?.text?.trim(),reviewed:reviewed(s?.pilotReflection,now,sourceForReview(s,now))};
    });
    const practiced=pilot.filter(a=>validTime(state.skills[a.id]?.guidedAt,now)).length;
    const issues=pilot.map(a=>({id:a.id,number:a.number,title:a.title,...issue(state.skills[a.id])})).filter(a=>a.feedback);
    const counts={practiced,independent:checkpoints.filter(c=>c.independent).length,retained:checkpoints.filter(c=>c.retained).length,explanations:checkpoints.filter(c=>c.explanation).length,reviewed:checkpoints.filter(c=>c.reviewed).length,openIssues:issues.filter(i=>!i.resolved).length};
    const ready=practiced===pilot.length&&checkpoints.every(c=>c.independent&&c.retained&&c.reviewed)&&!counts.openIssues;
    return {policy:'pilot-evaluation-v1',pilotCount:pilot.length,checkpoints,issues,counts,ready};
  }
  function next(state,catalog,manifest,now=Date.now()){
    const s=summary(state,catalog,now),pilot=catalog.activities.slice(0,s.pilotCount);
    const practice=pilot.find(a=>!state.skills[a.id]?.guidedAt&&manifest.competencies.find(c=>c.id===a.id).prerequisites.every(id=>!!state.skills[id]?.guidedAt));
    if(practice)return {kind:'practice',id:practice.id,label:'Continue pilot: '+practice.title};
    for(const c of s.checkpoints.filter(c=>!c.retained)){
      const r=state.skills[c.id],a=pilot.find(a=>a.id===c.id);
      if(r?.stage==='transfer'&&!r.passed.transfer&&r.reviewAt<=now)return {kind:'transfer',id:c.id,label:'Continue delayed check: '+c.label};
      if(r?.reviewAt<=now&&(r.reviewCursor||0)<a.transfers.length)return {kind:'transfer',id:c.id,label:'Try delayed check: '+c.label};
    }
    const reflect=s.checkpoints.find(c=>!c.explanation);
    if(reflect)return {kind:'reflection',id:reflect.id,label:'Explain your code: '+reflect.label};
    const open=s.issues.find(i=>!i.resolved);
    if(open)return {kind:'issue',id:open.id,label:'Review reported difficulty: '+open.title};
    const review=s.checkpoints.find(c=>!c.reviewed);
    if(review)return {kind:'review',id:review.id,label:'Review explanation: '+review.label};
    if(s.ready)return {kind:'report',label:'Export pilot evidence for sign-off'};
    const pending=s.checkpoints.filter(c=>!c.retained).map(c=>({c,r:state.skills[c.id],a:pilot.find(a=>a.id===c.id)}));
    const wait=pending.filter(x=>x.r?.reviewAt>now&&(x.r.reviewCursor||0)<x.a.transfers.length).sort((a,b)=>a.r.reviewAt-b.r.reviewAt)[0];
    if(wait)return {kind:'wait',id:wait.c.id,at:wait.r.reviewAt,label:'View the next scheduled review'};
    return {kind:'blocked',label:'Review missing evidence or exhausted prompts'};
  }
  function report(state,catalog,manifest,now=Date.now()){
    const s=summary(state,catalog,now);
    return {reportVersion:1,generatedAt:new Date(now).toISOString(),goal,milestones,currentMilestone:1,scope:'One learner; local, self-reported study evidence. Three representative checks do not certify all 15 competencies or course effectiveness.',technicalVerification:'Tracked separately in TEST_REPORT.md; not inferred from learner progress.',timeBasis:'Device clock; elapsed-time evidence is not independently verified.',releaseDecision:'Pending human sign-off. This report does not merge, deploy, or advance the curriculum.',...s,nextAction:next(state,catalog,manifest,now),checkpointEvidence:s.checkpoints.map(c=>{const r=state.skills[c.id];return {number:c.number,id:c.id,label:c.label,proof:proof(r,now),reflection:r?.pilotReflection||null,reflectionHistory:r?.pilotReflectionHistory||[],drafts:r?.drafts||{},attempts:r?.attempts||[],externalHelp:r?.externalHelp||{}};})};
  }
  function createUI({context,navigate,canOpen,beginReview,save,download}){
    const $=id=>document.getElementById(id);
    function focusGoal(){ $('goal-details').open=true;$('goal-panel').scrollIntoView({behavior:'smooth',block:'start'}); }
    function open(id,view){
      if(context().busy||!canOpen(id))return;
      navigate(id);
      if(view==='transfer'){if(context().skill.stage!=='transfer'||context().skill.passed.transfer)beginReview();return;}
      if(view==='reflection'||view==='review'){
        $('pilot-reflection').open=true;if(view==='review')$('reflection-review').open=true;
        $('pilot-reflection').scrollIntoView({behavior:'smooth',block:'start'});
      }
    }
    function renderGoal(){
      const {state,catalog,manifest,busy}=context();if(!catalog||!state)return;
      const s=summary(state,catalog),n=next(state,catalog,manifest);
      $('goal-status').textContent=s.ready?'Pilot evidence ready for human sign-off':'Milestone 1 · Collecting learner evidence';
      $('goal-counts').textContent=`Practice ${s.counts.practiced}/${s.pilotCount} · Independent ${s.counts.independent}/3 · Delayed ${s.counts.retained}/3 · Explanations reviewed ${s.counts.reviewed}/3 · Open difficulties ${s.counts.openIssues}`;
      $('goal-next').textContent=n.label;$('goal-next').disabled=busy;
      $('goal-wait').textContent=n.kind==='wait'?'Next eligible review: '+new Date(n.at).toLocaleString()+'. Return then for a fresh check.':n.kind==='blocked'?'Fresh prompts or evidence need human review. Record any difficulty and export the report.':'';
      const rows=$('checkpoint-list');rows.replaceChildren();
      for(const c of s.checkpoints){
        const row=document.createElement('div');row.className='checkpoint-row';
        const name=document.createElement('strong');name.textContent=c.label;
        const status=document.createElement('p');status.textContent=`Independent: ${c.independent?'recorded':'pending'} · Delayed: ${c.retained?'recorded':'pending'} · Explanation: ${c.reviewed?'review recorded':c.explanation?'awaiting review':'not written'}`;
        const button=document.createElement('button');button.className='small-button';button.textContent='Open evidence';button.disabled=busy||!canOpen(c.id);button.onclick=()=>open(c.id,'reflection');row.append(name,status,button);rows.append(row);
      }
      const issues=$('pilot-issues');issues.replaceChildren();
      if(!s.issues.length)issues.textContent='No difficulties have been reported. Absence of feedback is not evidence that the experience was clear.';
      for(const i of s.issues){
        const row=document.createElement('div');row.className='checkpoint-row';
        const title=document.createElement('strong');title.textContent=i.title+' · '+(i.resolved?'resolution recorded':'open');
        const note=document.createElement('p');note.textContent=i.feedback.note||i.feedback.clarity;
        const input=document.createElement('textarea');input.rows=2;input.maxLength=2000;input.setAttribute('aria-label','Resolution notes for '+i.title);
        // Keep unsaved triage notes through timer/status updates and downloads.
        input.value=triageDrafts[i.id]??i.notes.at(-1)?.note??'';input.oninput=()=>{triageDrafts[i.id]=input.value;};
        const button=document.createElement('button');button.className='small-button';button.textContent=i.resolved?'Reopen difficulty':'Record resolution';button.disabled=busy;
        button.onclick=()=>{
          if(!input.value.trim()){input.setCustomValidity('Describe what changed or why this is still open.');input.reportValidity();return;}
          const r=context().state.skills[i.id];(r.pilotIssueNotes||=[]).push({feedbackKey:feedbackKey(r.feedback),status:i.resolved?'open':'resolved',note:input.value.trim(),at:Date.now()});save();renderGoal();
        };
        row.append(title,note,input,button);issues.append(row);
      }
    }
    const triageDrafts={};
    function renderActivity(){
      const {activity,skill,busy}=context(),p=probes.find(p=>p.number===activity.number);
      $('pilot-reflection').hidden=!p;if(!p)return;
      $('reflection-prompt').textContent=p.prompt;
      $('reflection-text').value=skill.pilotReflection?.text||'';
      $('reflection-code').textContent=sourceForReview(skill)||'(Complete the blank-editor check first.)';
      $('reflection-review-note').value=skill.pilotReflection?.review?.note||'';
      for(const key of ['input','reasoning','boundary'])$('rubric-'+key).checked=skill.pilotReflection?.review?.[key]===true;
      $('save-reflection-review').disabled=busy;
      $('reflection-status').textContent=reviewed(skill.pilotReflection,Date.now(),sourceForReview(skill))?'Human explanation review recorded.':'Explanation text is saved automatically; human review is pending.';
    }
    $('reflection-text').oninput=()=>{
      const r=context().skill;if(r.pilotReflection?.review)(r.pilotReflectionHistory||=[]).push(structuredClone(r.pilotReflection));r.pilotReflection={text:$('reflection-text').value,code:sourceForReview(r),at:Date.now(),review:null};save();$('reflection-status').textContent='Explanation saved. Review is pending.';renderGoal();
      for(const k of ['input','reasoning','boundary'])$('rubric-'+k).checked=false;
    };
    $('save-reflection-review').onclick=()=>{
      if(context().busy)return;
      const r=context().skill,text=r.pilotReflection?.text;
      if(!text?.trim()||!sourceForReview(r)){ $('reflection-status').textContent='Record an explanation of saved code before reviewing it.';return; }
      if(!['input','reasoning','boundary'].every(k=>$('rubric-'+k).checked)){ $('reflection-status').textContent='Review all three criteria, or revise the explanation before accepting it.';return; }
      r.pilotReflection.review={text,code:sourceForReview(r),at:Date.now(),input:true,reasoning:true,boundary:true,note:$('reflection-review-note').value.trim()};save();renderActivity();renderGoal();
    };
    $('goal-next').onclick=()=>{
      const c=context();if(c.busy)return;const n=next(c.state,c.catalog,c.manifest);
      if(n.kind==='report')download();else if(['practice','transfer','reflection','review'].includes(n.kind))open(n.id,n.kind);else focusGoal();
    };
    $('export-pilot-report').onclick=download;
    return {renderGoal,renderActivity,focusGoal};
  }
  const api={DELAY,goal,probes,milestones,proof,sourceForReview,reviewed,feedbackKey,issue,summary,next,report,createUI};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PilotMilestones=api;
})(globalThis);
