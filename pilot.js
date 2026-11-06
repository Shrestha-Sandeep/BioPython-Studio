'use strict';
const S = LearningState;
const el = id => document.getElementById(id);
const phases = ['predict','run','investigate','modify','write','debug'];
const labels = {predict:'Predict',run:'Run',investigate:'Investigate',modify:'Modify',write:'Write',debug:'Debug / transfer',transfer:'Delayed transfer'};
let manifest, catalog, state, aliases, activity, skill, worker, requestId=0, busy=false, storageBlocked=false;
const source = 'https://images.proteinatlas.org/8346/22_C1_1_blue_red_green.jpg';
let imageLoaded=false, imagePending=false, imageURL=null;
function feedback(message, success=false) {
  el('pilot-feedback').textContent=message;
  el('pilot-feedback').className='feedback '+(success?'success':'error');
  el('pilot-feedback').hidden=false;
}
function save() {
  if (storageBlocked) return;
  try { localStorage.setItem(S.KEY,JSON.stringify(state)); }
  catch (_) { el('storage-warning').hidden=false; el('storage-warning').textContent='Progress could not be saved on this device. Export a progress file before leaving.'; }
}
function draftKey() { return skill.stage; }
function setBusy(value) {
  busy=value;
  for (const id of ['pilot-run','restore-starter','pilot-hint','phase-back','phase-next','next-activity','start-review','save-prediction','check-explanation']) el(id).disabled=value;
  el('pilot-editor').readOnly=value || skill.stage==='run';
  if(!value){el('pilot-hint').disabled=(skill.hints[skill.stage]||0)>=3;el('pilot-run').disabled=skill.stage==='transfer'&&!!skill.passed.transfer;}
  renderNavigation();
}
async function loadImage() {
  if (imagePending || imageLoaded) return;
  imagePending=true; el('image-retry').hidden=true; el('image-status').textContent='Loading original publisher image…';
  const abort=new AbortController(); const timeout=setTimeout(()=>abort.abort(),30000);
  try {
    const response=await fetch(source,{mode:'cors',signal:abort.signal});
    if (!response.ok) throw new Error('Publisher returned HTTP '+response.status);
    const blob=await response.blob();
    if (!blob.type.startsWith('image/') || blob.size<50000) throw new Error('Image is incomplete or invalid.');
    const bitmap=await createImageBitmap(blob);
    if (bitmap.width<256 || bitmap.height<256) {bitmap.close();throw new Error('Unexpected image dimensions.');}
    const canvas=document.createElement('canvas'); canvas.width=64;canvas.height=64;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(bitmap,0,0,64,64);
    const pixels=ctx.getImageData(0,0,64,64).data;const blue=new Set();
    for(let i=2;i<pixels.length;i+=4)blue.add(pixels[i]);
    if(blue.size<3) {bitmap.close();throw new Error('Decoded image has no readable blue-channel variation.');}
    if(imageURL)URL.revokeObjectURL(imageURL);imageURL=URL.createObjectURL(blob);
    el('hpa-image').src=imageURL;el('hpa-image').hidden=false;
    el('image-status').textContent=`HPA-8346 · ${bitmap.width} × ${bitmap.height} · ${blob.size.toLocaleString()} bytes`;
    bitmap.close();imageLoaded=true;
  } catch(error) {
    el('image-status').textContent='Original image unavailable: '+(error.name==='AbortError'?'Request timed out.':error.message);
    el('image-retry').hidden=false;
  } finally {clearTimeout(timeout);imagePending=false;}
}
function renderNavigation() {
  const nav=el('activity-list');nav.replaceChildren();
  catalog.activities.forEach((a,index)=>{
    const c=manifest.competencies.find(x=>x.id===a.id);
    const button=document.createElement('button');button.className='step'+(a.id===activity.id?' active':'');
    button.textContent=`${index+1}. ${a.title} · ${S.evidence(state.skills[a.id])}`;
    button.disabled=busy || !S.ready(state,c);
    button.title=button.disabled?'Complete the actual prerequisite activities first.':a.title;
    button.onclick=()=>select(a.id);nav.append(button);
  });
  el('pilot-progress').textContent=`${catalog.activities.filter(a=>state.skills[a.id]?.guidedAt).length} of 15 activities practiced`;
  const route=el('pathway').value==='sequence'?manifest.optional_sequence_route:el('pathway').value==='ml'?manifest.optional_ml_route:manifest.recommended_default_route;
  const out=el('path-readiness');out.replaceChildren();
  for (const num of route) {
    const c=manifest.competencies.find(x=>x.number===num),item=document.createElement('div');item.className='path-item';
    const implemented=catalog.activities.some(a=>a.id===c.id);
    const missing=c.prerequisites.filter(id=>!state.skills[id]?.guidedAt).map(id=>manifest.competencies.find(x=>x.id===id).number);
    item.textContent=`${num} · ${c.title} — ${implemented?S.evidence(state.skills[c.id]):'planned'}; ${missing.length?'prerequisites: '+missing.join(', '):'prerequisites met'}`;
    out.append(item);
  }
}
function select(id) {
  if(busy)return;
  activity=catalog.activities.find(a=>a.id===id);
  if(!activity || !S.ready(state,manifest.competencies.find(c=>c.id===id))) return;
  state.current=id;skill=S.record(state,id);save();render();el('path-menu').open=false;
}
function render() {
  const stage=skill.stage, index=catalog.activities.indexOf(activity);
  el('activity-position').textContent=`Activity ${index+1} of 15 · Microscopy-first foundations`;
  el('activity-title').textContent=activity.title;el('activity-context').textContent=activity.context;
  el('evidence').textContent=S.evidence(skill);el('evidence').className='pill '+(skill.independentAt?'verified':'guided');
  const track=el('phase-track');track.replaceChildren();
  for(const phase of phases){const li=document.createElement('li');li.textContent=labels[phase];if(phase===stage)li.setAttribute('aria-current','step');if(skill.passed[phase])li.className='phase-done';track.append(li);}
  el('phase-title').textContent=labels[stage];
  const coding=['run','modify','write','debug','transfer'].includes(stage);
  el('prediction-panel').hidden=stage!=='predict';el('investigate-panel').hidden=stage!=='investigate';el('coding-panel').hidden=!coding;
  el('phase-task').textContent=stage==='predict'?activity.predict:stage==='run'?'Run the worked example. Compare the actual output or traceback with your saved prediction.':stage==='investigate'?'Explain the behavior before changing the code.':(stage==='transfer'?activity.transfers[skill.activeReview??0]:activity.stages[stage]).task;
  el('prediction-code').textContent=activity.example.source;el('prediction').value=skill.prediction||'';
  el('investigate-question').textContent=activity.investigate.question;
  const options=el('investigate-options');options.replaceChildren();
  // Rotate options deterministically so the correct choice is not always first.
  const offset=index%activity.investigate.options.length;
  activity.investigate.options.forEach((_,i)=>{const original=(i+offset)%activity.investigate.options.length;const label=document.createElement('label'),input=document.createElement('input');input.type='radio';input.name='explanation';input.value=original;input.checked=skill.explanation===original;label.append(input,document.createTextNode(activity.investigate.options[original]));options.append(label);});
  if(coding) {
    const spec=stage==='run'?{starter:activity.example.source,cases:[activity.example.case],input_types:activity.example.input_types||{}}:stage==='transfer'?activity.transfers[skill.activeReview??0]:activity.stages[stage];
    el('pilot-editor').value=skill.drafts[stage] ?? spec.starter;el('pilot-editor').readOnly=stage==='run';
    el('provided-data').textContent=Object.entries(spec.cases[0]).map(([key,value])=>`${key}${spec.input_types?.[key]?" ("+spec.input_types[key]+")":""} = ${JSON.stringify(value)}`).join('\n');
    el('pilot-run').textContent=stage==='run'?'Run worked example ▶':'Run & check Python ▶';
    el('restore-starter').hidden=stage==='run';
  }
  const used=skill.hints[stage]||0;
  el('pilot-hint').hidden=['run','transfer'].includes(stage);
  el('pilot-hint').textContent=used>=3?'All hints opened':`Hint ${used+1} of 3`;
  el('pilot-hint').disabled=used>=3;
  el('pilot-hint-text').hidden=!used;el('pilot-hint-text').textContent=used?activity.hints[Math.min(used,3)-1]:'';
  el('pilot-feedback').hidden=true;el('pilot-output-area').hidden=true;el('pilot-traceback').hidden=true;
  el('phase-back').hidden=stage==='predict'||stage==='transfer';
  el('phase-next').hidden=!skill.passed[stage] || stage==='transfer' || (stage==='debug'&&skill.guidedAt);
  el('activity-complete').hidden=!skill.guidedAt;
  const due=S.due(skill),freshReview=(skill.reviewCursor||0)<activity.transfers.length;
  el('completion-message').textContent=skill.retainedAt?'You demonstrated delayed transfer without assistance.':`Practice recorded as ${S.evidence(skill)}. ${!freshReview?'All current transfer prompts have been attempted. More unseen checks are planned.':due?'A delayed, blank-editor transfer check is ready.':'Your delayed transfer check opens '+new Date(skill.reviewAt||Date.now()+S.DELAY).toLocaleString()+'.'}`;
  const next=catalog.activities[index+1];el('next-activity').hidden=!next;el('next-activity').disabled=!next||!S.ready(state,manifest.competencies.find(c=>c.id===next.id));
  el('start-review').hidden=!due || !freshReview || (stage==='transfer'&&!skill.passed.transfer);
  el('pilot-run').disabled=stage==='transfer'&&!!skill.passed.transfer;
  el('context-image').hidden=!['001','071'].includes(activity.number);el('image-source').href=source;
  if(!el('context-image').hidden)loadImage();
  el('learning-note').textContent=activity.investigate.explanation;
  const history=aliases[activity.id]||[];
  el('legacy-history').textContent=history.length?`Preserved historical records: ${[...new Set(history.map(x=>x.legacyId))].join(', ')}. They do not award v3 mastery. Access the original drafts through the existing lessons.`:'';
  renderNavigation();save();
}
async function runPython() {
  if(busy)return;
  const stage=skill.stage;
  if(activity.number==='071'&&!imageLoaded){feedback('Load the original microscopy image first. Use Retry image if the publisher request failed.');return;}
  const sourceCode=el('pilot-editor').value;
  if(stage==='transfer'&&skill.passed.transfer){feedback('This transfer prompt is complete. A fresh prompt will open when the next review is due.');return;}
  if(stage==='transfer'&&!S.due(skill)){feedback('This transfer check is not due yet.');return;}
  skill.drafts[stage]=sourceCode;save();setBusy(true);
  el('pilot-output-area').hidden=false;el('pilot-output').textContent='Executing real Python…';el('pilot-traceback').hidden=true;el('pilot-runtime').textContent='Starting Python…';el('pilot-feedback').hidden=true;
  const seq=++requestId;let timer;
  try {
    worker ||= new Worker('./worker.js?v=v3-pilot-1');
    const result=await new Promise((resolve,reject)=>{
      timer=setTimeout(()=>{worker.terminate();worker=null;reject(new Error('Python exceeded the time limit. Retry after checking for an infinite loop.'));},120000);
      worker.onmessage=event=>{const msg=event.data;if(msg.type==='status'){el('pilot-runtime').textContent=msg.message;return;}if(msg.requestId!==seq)return;clearTimeout(timer);if(msg.type==='error')reject(new Error(msg.message));else resolve(msg);};
      worker.onerror=()=>{worker.terminate();worker=null;reject(new Error('The Python Worker could not load. Check the connection and retry.'));};
      worker.postMessage({type:'pilot',requestId:seq,activity:activity.id,stage,source:sourceCode,reviewIndex:skill.activeReview});
    });
    const report=result.cases?.[0];
    el('pilot-output').textContent=report?.output?.trim()||'(No printed output)';
    if(report?.error){el('pilot-traceback').textContent=report.error;el('pilot-traceback').hidden=false;}
    // The traceback demonstration is intentional; it is exploration, never mastery.
    const passed=result.ok || (stage==='run'&&activity.number==='002'&&report?.error?.includes('NameError'));
    S.assess(skill,stage,{ok:passed});save();
    feedback(stage==='run'?`Compare with your prediction: “${skill.prediction}”. ${report?.error?'The worked example intentionally raises NameError. Read the line number.':result.message}`:result.ok?`${result.message} ${stage==='write'?((skill.hints.write||0)?'Guided evidence: you opened a hint.':'Independent evidence: blank editor, changed inputs, no hints.'):'This is guided practice.'}`:result.message,passed);
    el('phase-next').hidden=!passed || stage==='transfer' || (stage==='debug'&&skill.guidedAt);
    el('evidence').textContent=S.evidence(skill);
    if(stage==='debug'||stage==='transfer') {
      const output=el('pilot-output').textContent,trace=el('pilot-traceback').textContent,hasTrace=!el('pilot-traceback').hidden,message=el('pilot-feedback').textContent;
      render();el('pilot-output-area').hidden=false;el('pilot-output').textContent=output;el('pilot-traceback').textContent=trace;el('pilot-traceback').hidden=!hasTrace;feedback(message,passed);
    }
  } catch(error){feedback(error.message+' No result was simulated.');el('pilot-output').textContent='Execution unavailable.';}
  finally {clearTimeout(timer);setBusy(false);el('pilot-runtime').textContent='Python runs on this device';}
}
el('save-prediction').onclick=()=>{const text=el('prediction').value.trim();if(!text){feedback('Write a prediction before running the example.');return;}skill.prediction=text;skill.passed.predict=true;skill.stage='run';save();render();};
el('prediction').oninput=()=>{skill.prediction=el('prediction').value;save();};
el('check-explanation').onclick=()=>{const checked=document.querySelector('input[name=explanation]:checked');if(!checked){feedback('Choose an explanation first.');return;}skill.explanation=Number(checked.value);skill.passed.investigate=skill.explanation===activity.investigate.answer;save();feedback(activity.investigate.explanation,skill.passed.investigate);el('phase-next').hidden=!skill.passed.investigate;};
el('phase-next').onclick=()=>{if(busy||!skill.passed[skill.stage])return;const index=phases.indexOf(skill.stage);if(index<phases.length-1){skill.stage=phases[index+1];save();render();}};
el('phase-back').onclick=()=>{if(busy)return;if(skill.stage==='write'&&!skill.passed.write)skill.hints.write=Math.max(1,skill.hints.write||0);const index=phases.indexOf(skill.stage);if(index>0){skill.stage=phases[index-1];save();render();}};
el('pilot-run').onclick=runPython;
el('pilot-editor').oninput=()=>{skill.drafts[draftKey()]=el('pilot-editor').value;skill.passed[skill.stage]=false;el('phase-next').hidden=true;save();};
el('pilot-editor').onkeydown=event=>{if(event.key==='Tab'&&!el('pilot-editor').readOnly){event.preventDefault();const field=event.currentTarget;field.setRangeText('    ',field.selectionStart,field.selectionEnd,'end');field.dispatchEvent(new Event('input'));}};
el('restore-starter').onclick=()=>{if(busy)return;el('pilot-editor').value=activity.stages[skill.stage].starter;el('pilot-editor').dispatchEvent(new Event('input'));};
el('pilot-hint').onclick=()=>{if(busy)return;skill.hints[skill.stage]=Math.min(3,(skill.hints[skill.stage]||0)+1);save();el('pilot-hint-text').textContent=activity.hints[skill.hints[skill.stage]-1];el('pilot-hint-text').hidden=false;el('pilot-hint').textContent=skill.hints[skill.stage]>=3?'All hints opened':`Hint ${skill.hints[skill.stage]+1} of 3`;el('pilot-hint').disabled=skill.hints[skill.stage]>=3;};
el('next-activity').onclick=()=>{const next=catalog.activities[catalog.activities.indexOf(activity)+1];if(next)select(next.id);};
el('start-review').onclick=()=>{if(busy||!S.due(skill))return;if((skill.reviewCursor||0)>=activity.transfers.length)return;skill.activeReview=skill.reviewCursor||0;skill.reviewCursor=skill.activeReview+1;skill.stage='transfer';skill.drafts.transfer='';skill.passed.transfer=false;save();render();};
el('pathway').onchange=renderNavigation;
el('image-retry').onclick=loadImage;
el('export-progress').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='biopython-studio-progress.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
el('import-progress').onchange=async event=>{try{const file=event.target.files[0];if(!file)return;if(file.size>10000000)throw new Error('Progress file is larger than 10 MB.');const incoming=S.validate(JSON.parse(await file.text()));state=S.merge(state,incoming);aliases=S.migrateAliases(state,manifest);save();skill=S.record(state,activity.id);render();el('backup-status').textContent='Progress imported. Existing drafts were kept; conflicting imported records are preserved in the export archive.';}catch(error){el('backup-status').textContent=error.message;}finally{event.target.value='';}};
document.addEventListener('keydown',event=>{if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)&&!el('coding-panel').hidden){event.preventDefault();runPython();}});
async function boot() {
  try {
    const responses=await Promise.all([fetch('./curriculum/v3_manifest.json'),fetch('./curriculum/v3_pilot.json')]);
    if(responses.some(r=>!r.ok))throw new Error('The curriculum could not load. Reload this page.');
    [manifest,catalog]=await Promise.all(responses.map(r=>r.json()));
    try {state=S.load(localStorage);}catch(error){storageBlocked=true;state=S.fresh();el('storage-warning').hidden=false;el('storage-warning').textContent='Saved progress could not be read. The original stored data is untouched. '+error.message;}
    aliases=S.migrateAliases(state,manifest);
    el('legacy-summary').textContent=state.legacySnapshots.length?'Your previous lesson history and code drafts have been archived without awarding new mastery.':'Existing 61-lesson progress uses its original storage and remains available.';
    const requested=catalog.activities.find(a=>a.id===state.current),fallback=catalog.activities.find(a=>!state.skills[a.id]?.guidedAt&&S.ready(state,manifest.competencies.find(c=>c.id===a.id)));
    select((requested&&S.ready(state,manifest.competencies.find(c=>c.id===requested.id))?requested:fallback||catalog.activities[0]).id);
  }catch(error){el('activity-title').textContent='Learning path unavailable';feedback(error.message);}
}
boot();
