'use strict';
const S = LearningState;
const el = id => document.getElementById(id);
const phases = ['predict','run','investigate','modify','write','debug'];
const labels = {predict:'Predict',run:'Run',investigate:'Investigate',modify:'Modify',write:'Write',debug:'Debug',transfer:'Delayed transfer'};
let manifest, catalog, coursePath, state, aliases, activity, skill, worker, goalUI, requestId=0, busy=false, storageBlocked=false;
const notebookDefaults={setup:'specimen = "CTRL-A01"\nfield_count = 3',analysis:'print(specimen)\nprint(field_count)'};
const source = 'https://images.proteinatlas.org/8346/22_C1_1_blue_red_green.jpg';
let imageLoaded=false, imagePending=false, imageURL=null;
function pythonValue(value,kind) {
  if(kind==='tuple')return '('+value.map(v=>pythonValue(v)).join(', ')+(value.length===1?',':'')+')';
  if(value===null)return 'None';
  if(value===true)return 'True';
  if(value===false)return 'False';
  if(Array.isArray(value))return '['+value.map(v=>pythonValue(v)).join(', ')+']';
  if(typeof value==='object')return '{'+Object.entries(value).map(([k,v])=>JSON.stringify(k)+': '+pythonValue(v)).join(', ')+'}';
  return JSON.stringify(value);
}
function dueActivities() {
  return catalog.activities.filter(a=>{const action=S.reviewAction(state.skills[a.id],a.transfers.length);return action.due&&!action.practice;})
    .sort((a,b)=>S.reviewDueAt(state.skills[a.id])-S.reviewDueAt(state.skills[b.id]));
}
function updateReviewControls(){
  if(!activity||!skill)return;
  const action=S.reviewAction(skill,activity.transfers.length),fresh=(skill.reviewCursor||0)<activity.transfers.length;
  el('completion-message').textContent=S.retained(skill)?'You demonstrated delayed transfer without assistance.':`Practice recorded as ${S.evidence(skill)}. ${action.kind==='resume'?'Your unfinished transfer check is saved.':!fresh?'All current transfer prompts have been attempted. More unseen checks are planned.':action.due?'A delayed, blank-editor transfer check is ready.':action.at?'Your delayed transfer check opens '+new Date(action.at).toLocaleString()+'.':'Transfer practice is open. Complete guided practice to schedule a delayed check.'}`;
  el('start-review').hidden=false;
  el('start-review').textContent=action.kind==='resume'?(action.practice?'Continue transfer practice':'Continue delayed check'):action.kind==='fresh'?'Start fresh delayed check':'Transfer practice';
}
function updateReviewReminder() {
  if(!catalog||!state)return;
  updateReviewControls();
  const due=dueActivities();el('review-reminder').hidden=!due.length;
  el('review-summary').textContent=due.length?`${due.length} delayed review${due.length===1?' is':'s are'} ready. Next: ${due[0].title}.`:'';
  el('open-review').disabled=busy;goalUI?.renderGoal();
}
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
function helpKey(){return skill.stage==='transfer'?(skill.reviewPractice?'transfer_practice:':'transfer:')+skill.activeReview:skill.stage;}
function draftKey() { return skill.stage; }
function setBusy(value) {
  busy=value;
  for(const button of document.querySelectorAll('#phase-track button,[data-stage]'))button.disabled=value;
  for (const id of ['pilot-run','restore-starter','pilot-hint','phase-back','phase-next','next-activity','start-review','save-prediction','check-explanation','run-setup','run-analysis','restart-kernel','download-notebook','save-reflection-review','previous-activity']) el(id).disabled=value;
  el('pilot-editor').readOnly=value || skill.stage==='run';
  el('outside-help').disabled=value||skill.externalHelp?.[helpKey()]===true;
  el('notebook-setup').readOnly=value;el('notebook-analysis').readOnly=value;
  if(!value){el('pilot-hint').disabled=(skill.hints[skill.stage]||0)>=3;el('pilot-run').disabled=false;}
  renderNavigation();updateReviewReminder();
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
    el('image-status').textContent='HPA-8346 · Human Protein Atlas';
    bitmap.close();imageLoaded=true;
  } catch(error) {
    el('image-status').textContent='Original image unavailable: '+(error.name==='AbortError'?'Request timed out.':error.message);
    el('image-retry').hidden=false;
  } finally {clearTimeout(timeout);imagePending=false;}
}
function navigateCourse(entry){
  if(busy||!entry)return;
  if(entry.kind==='activity')select(entry.id);else location.href=entry.href;
}
function renderNavigation(){
  CoursePath.render(el('activity-list'),coursePath,activity.id,navigateCourse);
  for(const button of el('activity-list').querySelectorAll('button'))button.disabled=busy;
  el('pilot-progress').textContent=CoursePath.stage(manifest.competencies.find(c=>c.id===activity.id));
}
function selectPhase(phase){
  if(busy||!phases.includes(phase))return;
  if(skill.stage==='write'&&!skill.passed.write&&phase!=='write')skill.hints.write=Math.max(1,skill.hints.write||0);
  skill.stage=phase;save();render();
}
function select(id) {
  if(busy)return;
  const target=catalog.activities.find(a=>a.id===id);if(!target)return;activity=target;
  state.current=id;if(['http:','https:'].includes(location.protocol)){const url=new URL(location.href);url.searchParams.set('activity',id);history.replaceState(null,'',url);}
  skill=S.record(state,id);save();render();el('path-menu').open=false;
}
function render() {
  const stage=skill.stage, index=catalog.activities.indexOf(activity);
  el('activity-position').textContent=`${CoursePath.stage(manifest.competencies.find(c=>c.id===activity.id))} · Exercise ${CoursePath.available(coursePath).findIndex(c=>c.id===activity.id)+1} of ${CoursePath.available(coursePath).length}`;
  el('activity-title').textContent=activity.title;el('activity-context').textContent=activity.context;
  el('evidence').textContent=S.evidence(skill);el('evidence').className='pill '+(skill.independentAt?'verified':'guided');
  const track=el('phase-track');track.replaceChildren();
  for(const phase of phases){const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.textContent=labels[phase];button.onclick=()=>selectPhase(phase);button.disabled=busy;li.append(button);if(phase===stage)li.setAttribute('aria-current','step');if(skill.passed[phase])li.className='phase-done';track.append(li);}
  el('phase-title').textContent=labels[stage];
  const coding=['run','modify','write','debug','transfer'].includes(stage);
  el('prediction-panel').hidden=stage!=='predict';el('investigate-panel').hidden=stage!=='investigate';el('coding-panel').hidden=!coding;
  el('phase-task').textContent=stage==='predict'?activity.predict:stage==='run'?'Run the worked example. Compare the actual output or traceback with your saved prediction.':stage==='investigate'?'Explain the behavior before changing the code.':(stage==='transfer'?activity.transfers[skill.activeReview??0]:activity.stages[stage]).task;
  if(stage==='transfer'&&skill.reviewPractice)el('phase-task').textContent='Practice anytime. This exposed prompt will not later count as an unseen delayed check. '+el('phase-task').textContent;
  el('prediction-code').textContent=activity.example.source;el('prediction').value=skill.prediction||'';
  el('investigate-question').textContent=activity.investigate.question;
  const options=el('investigate-options');options.replaceChildren();
  // Rotate options deterministically so the correct choice is not always first.
  const offset=index%activity.investigate.options.length;
  activity.investigate.options.forEach((_,i)=>{const original=(i+offset)%activity.investigate.options.length;const label=document.createElement('label'),input=document.createElement('input');input.type='radio';input.name='explanation';input.value=original;input.checked=skill.explanation===original;label.append(input,document.createTextNode(activity.investigate.options[original]));options.append(label);});
  if(coding) {
    const spec=stage==='run'?{starter:activity.example.source,cases:[activity.example.case],input_types:activity.example.input_types||{}}:stage==='transfer'?activity.transfers[skill.activeReview??0]:activity.stages[stage];
    el('pilot-editor').value=stage==='run'?activity.example.source:(skill.drafts[stage] ?? spec.starter);el('pilot-editor').readOnly=stage==='run';
    el('provided-data').textContent=Object.entries(spec.cases[0]).map(([key,value])=>`${key}${spec.input_types?.[key]?" ("+spec.input_types[key]+")":""} = ${pythonValue(value,spec.input_types?.[key])}`).join('\n');
    el('pilot-run').textContent=stage==='run'?'Run worked example ▶':'Run & check Python ▶';
    el('restore-starter').hidden=stage==='run';
  }
  const used=skill.hints[stage]||0;
  el('pilot-hint').hidden=['run','transfer'].includes(stage);
  el('pilot-hint').textContent=used>=3?'All hints opened':`Hint ${used+1} of 3`;
  el('pilot-hint').disabled=used>=3;
  el('outside-help-row').hidden=!['write','transfer'].includes(stage);el('outside-help-note').hidden=el('outside-help-row').hidden;
  el('outside-help').checked=skill.externalHelp?.[helpKey()]===true;el('outside-help').disabled=el('outside-help').checked;
  el('pilot-hint-text').hidden=!used;el('pilot-hint-text').textContent=used?activity.hints.slice(0,used).map((text,i)=>(i+1)+'. '+text).join('\n\n'):'';
  el('pilot-feedback').hidden=true;el('pilot-output-area').hidden=true;el('pilot-traceback').hidden=true;
  el('phase-back').hidden=stage==='predict'||stage==='transfer';
  el('phase-next').hidden=stage==='predict'||stage==='transfer'||stage==='debug';
  el('activity-complete').hidden=false;
  updateReviewControls();
  const next=CoursePath.adjacent(coursePath,activity.id,1),previous=CoursePath.adjacent(coursePath,activity.id,-1);
  el('next-activity').textContent='Next exercise →';el('next-activity').hidden=!next;el('next-activity').disabled=busy;
  el('previous-activity').hidden=!previous;el('previous-activity').disabled=busy;
  el('pilot-run').disabled=false;
  el('context-image').hidden=!['001','071'].includes(activity.number);el('image-source').href=source;
  if(!el('context-image').hidden)loadImage();
  el('notebook-lab').hidden=activity.number!=='004';
  for(const cell of ['setup','analysis'])el('notebook-'+cell).value=skill.drafts['notebook.'+cell]??notebookDefaults[cell];
  el('feedback-clarity').value=skill.feedback?.clarity||'';el('feedback-note').value=skill.feedback?.note||'';el('activity-feedback-status').textContent='';
  el('learning-note').textContent=activity.investigate.explanation;
  CoursePath.renderSource(el('exercise-source'),manifest,activity.id);
  const history=aliases[activity.id]||[];
  el('legacy-history').textContent=history.length?`Preserved historical records: ${[...new Set(history.map(x=>x.legacyId))].join(', ')}. They do not award v3 mastery. Access the original drafts through the existing lessons.`:'';
  goalUI?.renderActivity();renderNavigation();updateReviewReminder();save();
}
async function runPython() {
  if(busy)return;
  const stage=skill.stage;
  if(activity.number==='071'&&!imageLoaded){feedback('Load the original microscopy image first. Use Retry image if the publisher request failed.');return;}
  const sourceCode=el('pilot-editor').value;
  skill.drafts[stage]=sourceCode;save();setBusy(true);
  el('pilot-output-area').hidden=false;el('pilot-output').textContent='Executing real Python…';el('pilot-traceback').hidden=true;el('pilot-runtime').textContent='Starting Python…';el('pilot-feedback').hidden=true;
  const seq=++requestId;let timer;
  try {
    worker ||= new Worker('./worker.js?v=v3-delayed-review-1');
    const result=await new Promise((resolve,reject)=>{
      timer=setTimeout(()=>{worker.terminate();worker=null;reject(new Error('Python exceeded the time limit. Retry after checking for an infinite loop.'));},120000);
      worker.onmessage=event=>{const msg=event.data;if(msg.type==='status'){el('pilot-runtime').textContent=msg.message;return;}if(msg.requestId!==seq)return;clearTimeout(timer);if(msg.type==='error')reject(new Error(msg.message));else resolve(msg);};
      worker.onerror=()=>{worker.terminate();worker=null;reject(new Error('The Python Worker could not load. Check the connection and retry.'));};
      worker.postMessage({type:'pilot',requestId:seq,activity:activity.id,stage,source:sourceCode,reviewIndex:skill.activeReview});
    });
    const report=result.ok?result.cases?.[0]:result.cases?.at(-1);
    const inputIndex=report?.input_index??0;
    const testSpec=stage==='run'?{cases:[activity.example.case]}:stage==='transfer'?activity.transfers[skill.activeReview]:activity.stages[stage];
    el('output-case').textContent=report?`Input ${inputIndex+1}: ${Object.entries(testSpec.cases[inputIndex]||{}).map(([k,v])=>k+' = '+pythonValue(v)).join('; ')}`:'';
    el('pilot-output').textContent=report?.output?.trim()||'(No printed output)';
    if(report?.error){el('pilot-traceback').textContent=report.error;el('pilot-traceback').hidden=false;}
    // The traceback demonstration is intentional; it is exploration, never mastery.
    const passed=result.ok || (stage==='run'&&activity.number==='002'&&report?.error?.includes('NameError'));
    S.assess(skill,stage,{ok:passed,source:sourceCode});save();
    feedback(stage==='run'?`Compare with your prediction: “${skill.prediction}”. ${report?.error?'The worked example intentionally raises NameError. Read the line number.':result.message}`:result.ok?`${result.message} ${stage==='write'?(S.assisted(skill,stage)?'Guided evidence: assistance was recorded.':'Independent evidence: blank editor, changed inputs, no assistance recorded.'):stage==='transfer'?(skill.reviewPractice?'Practice recorded. No independent or retained evidence was awarded.':'Delayed check recorded as '+S.evidence(skill)+'.'):'This is guided practice.'}`:result.message,passed);
    el('phase-next').hidden=stage==='predict'||stage==='transfer'||stage==='debug';
    el('evidence').textContent=S.evidence(skill);
    if(stage==='debug'||stage==='transfer') {
      const output=el('pilot-output').textContent,caseLabel=el('output-case').textContent,trace=el('pilot-traceback').textContent,hasTrace=!el('pilot-traceback').hidden,message=el('pilot-feedback').textContent;
      render();el('pilot-output-area').hidden=false;el('output-case').textContent=caseLabel;el('pilot-output').textContent=output;el('pilot-traceback').textContent=trace;el('pilot-traceback').hidden=!hasTrace;feedback(message,passed);
    }
  } catch(error){feedback(error.message+' No result was simulated.');el('pilot-output').textContent='Execution unavailable.';}
  finally {clearTimeout(timer);setBusy(false);el('pilot-runtime').textContent='Python runs on this device';}
}
async function notebookRun(cell,reset=false) {
  if(busy)return;
  const code=reset?'':el('notebook-'+cell).value;
  if(!reset){skill.drafts['notebook.'+cell]=code;save();}
  if(reset&&worker){worker.terminate();worker=null;}
  setBusy(true);const seq=++requestId;let timer;
  el('notebook-output').textContent=reset?'Restarting kernel…':'Running cell…';
  try {
    worker ||= new Worker('./worker.js?v=v3-delayed-review-1');
    const result=await new Promise((resolve,reject)=>{
      timer=setTimeout(()=>{worker.terminate();worker=null;reject(new Error('Notebook cell exceeded the time limit; the lab kernel was stopped.'));},120000);
      worker.onmessage=event=>{const msg=event.data;if(msg.type==='status'){el('notebook-output').textContent=msg.message;return;}if(msg.requestId!==seq)return;if(msg.type==='error')reject(new Error(msg.message));else resolve(msg);};
      worker.onerror=()=>{worker.terminate();worker=null;reject(new Error('The notebook kernel could not load. Retry after checking the connection.'));};
      worker.postMessage({type:'notebook',requestId:seq,source:code,reset});
    });
    const report=result.cases?.[0];
    el('notebook-output').textContent=reset?result.message:report?.error?report.error+'\n'+result.message:report?.output?.trim()||'(Cell ran without printed output)';
  }catch(error){el('notebook-output').textContent=error.message+' No output was simulated.';}
  finally{clearTimeout(timer);setBusy(false);}
}
for(const cell of ['setup','analysis']) {
  el('run-'+cell).onclick=()=>notebookRun(cell);
  el('notebook-'+cell).oninput=()=>{skill.drafts['notebook.'+cell]=el('notebook-'+cell).value;save();};
}
el('restart-kernel').onclick=()=>notebookRun(null,true);
el('download-notebook').onclick=()=>{
  const notebook={nbformat:4,nbformat_minor:5,metadata:{kernelspec:{display_name:'Python 3',language:'python',name:'python3'},language_info:{name:'python'}},cells:[{id:'workflow-notes',cell_type:'markdown',metadata:{},source:['# BioPython Studio: notebook workflow\n','Run setup before analysis. Restart the kernel and Run All to check reproducibility. These are authored teaching values.\n']},...['setup','analysis'].map(cell=>({id:cell,cell_type:'code',metadata:{},execution_count:null,outputs:[],source:el('notebook-'+cell).value.split(/(?<=\n)/)}))]};
  const url=URL.createObjectURL(new Blob([JSON.stringify(notebook,null,2)],{type:'application/x-ipynb+json'})),link=document.createElement('a');link.href=url;link.download='BioPython_Notebook_Workflow.ipynb';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
el('save-prediction').onclick=()=>{const text=el('prediction').value.trim();if(!text){feedback('Write a prediction before running the example.');return;}skill.prediction=text;skill.passed.predict=true;skill.stage='run';save();render();};
el('prediction').oninput=()=>{skill.prediction=el('prediction').value;save();};
el('check-explanation').onclick=()=>{const checked=document.querySelector('input[name=explanation]:checked');if(!checked){feedback('Choose an explanation first.');return;}skill.explanation=Number(checked.value);skill.passed.investigate=skill.explanation===activity.investigate.answer;save();feedback(activity.investigate.explanation,skill.passed.investigate);el('phase-next').hidden=false;};
el('phase-next').onclick=()=>{if(busy)return;const index=phases.indexOf(skill.stage);if(index<phases.length-1){skill.stage=phases[index+1];save();render();}};
el('phase-back').onclick=()=>{if(busy)return;if(skill.stage==='write'&&!skill.passed.write)skill.hints.write=Math.max(1,skill.hints.write||0);const index=phases.indexOf(skill.stage);if(index>0){skill.stage=phases[index-1];save();render();}};
el('pilot-run').onclick=runPython;
el('pilot-editor').oninput=()=>{skill.drafts[draftKey()]=el('pilot-editor').value;skill.passed[skill.stage]=false;save();};
el('pilot-editor').onkeydown=event=>{if(event.key==='Tab'&&!el('pilot-editor').readOnly){event.preventDefault();const field=event.currentTarget;field.setRangeText('    ',field.selectionStart,field.selectionEnd,'end');field.dispatchEvent(new Event('input'));}};
el('restore-starter').onclick=()=>{if(busy)return;el('pilot-editor').value=activity.stages[skill.stage].starter;el('pilot-editor').dispatchEvent(new Event('input'));};
el('pilot-hint').onclick=()=>{if(busy)return;skill.hints[skill.stage]=Math.min(3,(skill.hints[skill.stage]||0)+1);save();el('pilot-hint-text').textContent=activity.hints.slice(0,skill.hints[skill.stage]).map((text,i)=>(i+1)+'. '+text).join('\n\n');el('pilot-hint-text').hidden=false;el('pilot-hint').textContent=skill.hints[skill.stage]>=3?'All hints opened':`Hint ${skill.hints[skill.stage]+1} of 3`;el('pilot-hint').disabled=skill.hints[skill.stage]>=3;};
el('next-activity').onclick=()=>navigateCourse(CoursePath.adjacent(coursePath,activity.id,1));
el('previous-activity').onclick=()=>navigateCourse(CoursePath.adjacent(coursePath,activity.id,-1));
function startReview(){if(busy)return;S.beginReview(skill,activity.transfers.length);save();render();}
el('start-review').onclick=startReview;
el('outside-help').onchange=()=>{if(busy)return;S.noteHelp(skill,skill.stage);save();render();feedback('Assistance recorded for this check. Your code and practice history are preserved; use a fresh delayed prompt for independent evidence.');};
el('save-activity-feedback').onclick=()=>{
  if(!el('feedback-clarity').value){el('activity-feedback-status').textContent='Choose a response before saving.';return;}
  skill.feedback={clarity:el('feedback-clarity').value,note:el('feedback-note').value.trim(),at:Date.now()};save();goalUI?.renderGoal();el('activity-feedback-status').textContent='Feedback saved with your progress.';
};
for(const button of document.querySelectorAll('[data-stage]'))button.onclick=()=>navigateCourse(CoursePath.available(coursePath).find(c=>c.stage===button.dataset.stage));
el('open-review').onclick=()=>{const next=dueActivities()[0];if(next&&!busy){select(next.id);startReview();}};
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateReviewReminder();});
setInterval(updateReviewReminder,60000);
el('image-retry').onclick=loadImage;
el('export-progress').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='biopython-studio-progress.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
el('import-progress').onchange=async event=>{try{if(busy)throw new Error('Finish the current Python run before importing progress.');const file=event.target.files[0];if(!file)return;if(file.size>10000000)throw new Error('Progress file is larger than 10 MB.');const incoming=S.validate(JSON.parse(await file.text()));state=S.merge(state,incoming);aliases=S.migrateAliases(state,manifest);save();select(state.current||activity.id);el('backup-status').textContent='Progress imported. Existing drafts were kept; conflicting imported records are preserved in the export archive.';}catch(error){el('backup-status').textContent=error.message;}finally{event.target.value='';}};
document.addEventListener('keydown',event=>{if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)){if(['notebook-setup','notebook-analysis'].includes(event.target.id)){event.preventDefault();notebookRun(event.target.id.replace('notebook-',''));}else if(!el('coding-panel').hidden){event.preventDefault();runPython();}}});
async function boot() {
  try {
    const responses=await Promise.all([fetch('./curriculum/v3_manifest.json'),fetch('./curriculum/v3_pilot.json')]);
    if(responses.some(r=>!r.ok))throw new Error('The curriculum could not load. Reload this page.');
    [manifest,catalog]=await Promise.all(responses.map(r=>r.json()));
    coursePath=CoursePath.build(manifest,catalog);
    try {state=S.load(localStorage);}catch(error){storageBlocked=true;state=S.fresh();el('storage-warning').hidden=false;el('storage-warning').textContent='Saved progress could not be read. The original stored data is untouched. '+error.message;}
    goalUI=PilotMilestones.createUI({context:()=>({state,catalog,manifest,activity,skill,busy}),navigate:select,canOpen:id=>catalog.activities.some(a=>a.id===id),beginReview:startReview,save,download:()=>{
      const data=PilotMilestones.report(state,catalog,manifest),url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='biopython-pilot-evidence.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }});
    aliases=S.migrateAliases(state,manifest);
    el('legacy-summary').textContent=state.legacySnapshots.length?'Your previous lesson history and code drafts have been archived without awarding new mastery.':'Existing 61-lesson progress uses its original storage and remains available.';
    const query=new URLSearchParams(location.search).get('activity');
    if(catalog.activities.some(a=>a.id===query))state.current=query;
    const requested=catalog.activities.find(a=>a.id===state.current),fallback=catalog.activities.find(a=>!state.skills[a.id]?.guidedAt&&S.ready(state,manifest.competencies.find(c=>c.id===a.id)));
    select((requested?requested:fallback||catalog.activities[0]).id);
  }catch(error){el('activity-title').textContent='Learning path unavailable';feedback(error.message);}
}
boot();
