/* Reusable P01–P06 bridge; preserves frozen shell and per-chapter progress. */
"use strict";
(() => {
const el=id=>document.getElementById(id);
const P_IDS=["P01","P02","P03","P04","P05","P06"];
const I_IDS=["I01","I02","I03","I04","I07","I08"];
const IDS=[...P_IDS,...I_IDS];
const GOAL_COUNTS={P01:7,P02:4,P03:7,P04:6,P05:6,P06:6,I01:8,I02:6,I03:10,I04:6,I07:7,I08:8};
const KEYS=Object.fromEntries(IDS.map(id=>[id,"biopython."+id.toLowerCase()+".v1"]));
const SELECT_KEY="biopython.course-selected.v1";
const chapters={},states={};
const fresh=()=>({goal:0,phase:"learn",drafts:{},briefIntroduced:{},hints:{},progress:{},reflections:{},capstoneFirstPassAt:null});
function loadState(id){
 const next=fresh();
 try{
  const old=JSON.parse(localStorage.getItem(KEYS[id])||"null");
  if(old&&typeof old==="object"){
   if(old.drafts&&typeof old.drafts==="object")next.drafts=old.drafts;
    if(old.briefIntroduced&&typeof old.briefIntroduced==="object")next.briefIntroduced=old.briefIntroduced;
   if(old.hints&&typeof old.hints==="object")next.hints=old.hints;
   if(old.progress&&typeof old.progress==="object")next.progress=old.progress;
   if(old.reflections&&typeof old.reflections==="object")next.reflections=old.reflections;
   if(Number.isFinite(old.capstoneFirstPassAt)&&old.capstoneFirstPassAt>0)next.capstoneFirstPassAt=old.capstoneFirstPassAt;
   if(Number.isInteger(old.goal))next.goal=old.goal;
   if(["learn","apply","prove"].includes(old.phase))next.phase=old.phase;
  }
 }catch{}
 return next;
}
let activeId="P01",chapter=null,state=fresh(),worker=null,pending=null,busy=false,seq=0;
try{const selected=localStorage.getItem(SELECT_KEY);if(KEYS[selected])activeId=selected;}catch{}
const pythonSelected=()=>document.querySelector('[data-stage="Python"]')?.getAttribute("aria-current")==="page";
const microscopySelected=()=>document.querySelector('[data-stage="Microscopy"]')?.getAttribute("aria-current")==="page";
const isImaging=id=>I_IDS.includes(id);
const stageIds=()=>microscopySelected()?I_IDS:P_IDS;
let lastP="P01",lastI="I01";
const codeSelected=()=>document.querySelector('[data-mode="python"]')?.getAttribute("aria-pressed")==="true";
const bridge=()=>window.BioPythonStudioBridge;
const goals=()=>chapter?[...chapter.goals,chapter.capstone,chapter.review].filter(Boolean):[];
const goal=()=>goals()[state.goal];
const task=()=>goal()?.phases[state.phase];
const key=()=>String(goal()?.id)+":"+state.phase;
const active=()=>!!chapter&&(isImaging(activeId)?microscopySelected():pythonSelected()&&codeSelected());
const newerChapter=()=>["P04","P05","P06"].includes(activeId)||isImaging(activeId);
function preferEditorWhenCoding(){if(newerChapter())bridge()?.expandLesson?.(state.phase==="learn");}
// Task comments are not an attempt. Keep actual Python separate from the prompt.
const hasExecutableCode=code=>String(code||"").split(/\r?\n/).some(line=>{
 const value=line.trim();
 return value.length>0&&!value.startsWith("#");
});
function save(){
 try{
  localStorage.setItem(KEYS[activeId],JSON.stringify({schema_version:1,content_version:chapter?.version,goal:state.goal,phase:state.phase,drafts:state.drafts,briefIntroduced:state.briefIntroduced,hints:state.hints,progress:state.progress,reflections:state.reflections,capstoneFirstPassAt:state.capstoneFirstPassAt}));
  localStorage.setItem(SELECT_KEY,activeId);
  el("save-status").textContent="Saved locally";
 }catch{el("save-status").textContent="Saving blocked";}
}
window.BioPythonP01={
 ownsEditor:()=>active(),
 onEditorChange:code=>{if(active()){state.drafts[key()]=code;save();}}
};
function remember(){if(active())state.drafts[key()]=bridge()?.readCode()??"";save();}
function status(message){
 const target=document.querySelector(".runtime-state");if(!target)return;
 const dot=document.createElement("span");dot.className="status-dot";dot.setAttribute("aria-hidden","true");
 target.replaceChildren(dot,document.createTextNode(" "+message));
}
let lastOutput = "", lastOutputFailed = false, lastFigures=[];
function restoreOutput(){
 const placeholder=el("output-placeholder");
 if(!placeholder)return;
 placeholder.textContent=lastOutput;
  for(const data of lastFigures){
    if(typeof data!=="string"||!data.startsWith("data:image/png;base64,"))continue;
    const frame=document.createElement("figure");frame.className="p01-result-figure";
    const img=document.createElement("img");img.src=data;
    img.alt="Scientific figure rendered with real Matplotlib";frame.append(img);placeholder.append(frame);
  }
 placeholder.classList.add("p01-console-result");
 if(lastOutputFailed)placeholder.setAttribute("data-error","true");
 else placeholder.removeAttribute("data-error");
}
function output(message,failed=false,figures=[]){
 lastFigures=Array.isArray(figures)?figures.slice(0,2):[];
 lastOutput=message||"(No printed output.)";lastOutputFailed=failed;
 el("result-output").click(); // Keep the output-placeholder element required by the frozen UI.
 restoreOutput();
}
function progress(value){
 const k=key(),previous=state.progress[k]||{attempts:0,hints_used:false};
 state.progress[k]={attempts:previous.attempts+1,hints_used:previous.hints_used||!!state.hints[k],status:value,last_attempt:new Date().toISOString(),note:"Public practice checks are not independent/retained mastery evidence."};save();
}
function showHints(){
 const hints=goal()?.hints[state.phase]||[],shown=state.hints[key()]||0;
 el("p01-hint").hidden=!hints.length;
 el("p01-hint").disabled=shown>=hints.length;
 el("p01-hint").textContent=shown?"Next hint":"Hint";
 el("p01-hint-text").hidden=!shown;
 el("p01-hint-text").textContent=shown?hints[shown-1]:"";
}
function render(){
 if(!active())return;
 const g=goal(),t=task();
 el("lesson-summary").textContent=activeId+" · "+g.title+" · "+(state.goal+1)+"/"+goals().length;
 el("phase-title").textContent=t.title;
 el("phase-description").textContent=t.description;
 el("phase-caption").textContent=state.phase.toUpperCase();
 el("p01-predict").textContent=state.phase==="learn"?g.worked_example.predict:"";
 el("p01-predict").hidden=state.phase!=="learn";
 el("p01-context").textContent=g.why+" Scientific boundary: "+g.scientific_boundary;
 el("bps-chapter-link").href="./content/chapters/"+activeId+"_COMPLETE.md";
 el("bps-chapter-link").textContent="Full "+activeId+" chapter (Markdown)";
 el("p01-goal-select").value=String(state.goal);
 el("bps-chapter-select").value=activeId;
 el("p01-goal-label").textContent=activeId+" · Mini-goal";
 el("p01-check").hidden=state.phase==="learn"||!(t.public_checks?.length);
 el("p01-check").disabled=busy;
 el("run-button").disabled=busy;
 el("run-button").title="Run actual Python (requires internet for first Pyodide load)";
 showHints();
 const extra=el("p01-detail-root");
 window.BioPythonStudioTeaching?.renderInto(extra,{
   goal:g,phase:state.phase,
   reflection:state.reflections[g.id]||"",
   firstCapstonePass:state.capstoneFirstPassAt,
   onReflection:value=>{state.reflections[g.id]=value;save();}
 });
 el("p01-export").hidden=!(g.id.endsWith("-CAPSTONE")||g.id.endsWith("-REVIEW"))||state.phase==="learn";
 const evidence=state.progress[g.id+":prove"];
 el("p01-evidence").textContent=evidence?
   (evidence.status==="delayed_practice_passed"?"Delayed practice completed (not certified)":
   evidence.status==="practice_passed"?"Prove practice checks passed":"Last attempt: "+evidence.status):
   "One goal at a time · no automatic mastery";
 const hasDraft=Object.prototype.hasOwnProperty.call(state.drafts,key());
  let value=hasDraft?state.drafts[key()]:t.starter_code;
  if(hasDraft&&!state.briefIntroduced[key()]){
    // One-time, non-destructive migration for code saved before editor briefs.
    state.briefIntroduced[key()]=true;
    const marker="# "+g.id+" | "+state.phase.toUpperCase()+" |";
    if(typeof value==="string"&&!value.startsWith(marker)){
      const brief=t.starter_code.split("\n\n")[0];
      value=brief+"\n\n"+value;
      state.drafts[key()]=value;
    }
  }
  bridge()?.writeCode?.(value);
 el("crumb").textContent=(isImaging(activeId)?"Microscopy":"Python foundations")+" · "+activeId;
 el("page-title").textContent=isImaging(activeId)?"Image analysis workspace":"Python workspace";
 el("page-subtitle").textContent=g.why;
 save();
}
function chooseGoal(n){
 if(!chapter||n<0||n>=goals().length)return;
 remember();state.goal=n;state.phase="learn";bridge()?.selectPhase?.("learn");preferEditorWhenCoding();render();
}
function choosePhase(name){
 if(!chapter||!["learn","apply","prove"].includes(name))return;
 remember();state.phase=name;preferEditorWhenCoding();render();
}
function instance(){
 if(worker)return worker;
 worker=new Worker("./src/p01-worker.mjs",{type:"module"});
 worker.onmessage=e=>{
  if(!pending||e.data?.id!==pending.id)return;
  const p=pending;pending=null;clearTimeout(p.timer);busy=false;
  el("run-button").disabled=false;el("p01-check").disabled=false;p.resolve(e.data);
 };
 worker.onerror=e=>{
  const p=pending;pending=null;
  if(p){clearTimeout(p.timer);p.resolve({ok:false,error:"Could not load real Python: "+(e.message||"worker/network error")});}
  worker?.terminate();worker=null;busy=false;
  el("run-button").disabled=false;el("p01-check").disabled=false;
 };
 return worker;
}
function send(type,fields){
 if(busy)return Promise.resolve({ok:false,error:"Python is already running."});
 busy=true;el("run-button").disabled=true;el("p01-check").disabled=true;status("Loading/running real Python");
 return new Promise(resolve=>{
  const id=++seq;
  const timer=setTimeout(()=>{
   if(pending?.id!==id)return;
   pending=null;worker?.terminate();worker=null;busy=false;
   el("run-button").disabled=false;el("p01-check").disabled=false;
   resolve({ok:false,error:"Python did not finish. Check code or connectivity; your draft is preserved."});
  },isImaging(activeId)?180000:60000);
  pending={id,resolve,timer};
  try{instance().postMessage(Object.assign({id,type},fields));}
  catch(e){clearTimeout(timer);pending=null;busy=false;resolve({ok:false,error:String(e)});}
 });
}
async function run(){
 if(!active()||busy)return;
 const k=key(),code=bridge()?.readCode()??"";
 if(!hasExecutableCode(code)){
  output("Write Python below the task comments, then press Run.");
  status("Awaiting learner code");return;
 }
 const result=await send("run",{code,inputs:task().preview_inputs||{}});
 if(!active()||key()!==k)return;
 if(!result.ok){output(result.error,true);status("Python unavailable");return;}
 const r=result.result;
 output([r.stdout,r.stderr,r.traceback].filter(Boolean).join("\n"),!!r.traceback,r.figures||[]);
 if(key()===k)progress(r.traceback?"needs_review":"explored");
 status("Python 3 · real execution"+(r.traceback?" · traceback":""));
}
async function check(){
 if(!active()||state.phase==="learn"||busy)return;
 const cases=task().public_checks||[],k=key(),code=bridge()?.readCode()??"";
 if(!cases.length){output("This activity has no automatic coding check. Continue to Prove.",false);return;}
 if(!hasExecutableCode(code)){
  output("Write your Python solution below the task comments before checking.");
  status("Awaiting learner code");return;
 }
 const result=await send("check",{code,cases});
 if(!active()||key()!==k)return;
 if(!result.ok){output(result.error,true);status("Python unavailable");return;}
 const r=result.results||[];
 const bad=r.findIndex(x=>x.traceback||x.checks.some(y=>!y.passed));
 if(bad>=0){
  const item=r[bad],f=item.checks.find(x=>!x.passed);
  const diagnostic=(item.traceback||f?.error||"");
  const errorType=diagnostic.match(/\b(NameError|ZeroDivisionError|ValueError|TypeError|SyntaxError|IndentationError)\b/)?.[0];
  const advice=goal()?.feedback?.[errorType] || (bad>0?goal()?.feedback?.hardcoded:null)
    || task()?.practice_feedback?.check || (errorType?"Inspect the failing line and variables in the traceback.":"Check that your result uses the supplied inputs and expected units.");
  const reason=item.traceback||f?.error||"Practice condition failed: "+f?.expression;
  const inputLines=Object.entries(cases[bad].inputs||{}).map(([name,value])=>name+" = "+pyLiteral(value)).join("\n");
  output("Test input (Python):\n"+inputLines+"\n"+reason+"\n\nDiagnostic: "+advice,true);
  if(key()===k)progress("needs_review");
 }else{
  let classification=state.hints[k]?"guided":"practice_passed";
  const g=goal();
  if(g?.id.endsWith("-CAPSTONE")&&!state.capstoneFirstPassAt)state.capstoneFirstPassAt=Date.now();
  if(g?.id.endsWith("-REVIEW")){
    const delayed=state.capstoneFirstPassAt && Date.now()-state.capstoneFirstPassAt >= 24*3600*1000;
    classification=delayed?"delayed_practice_passed":"review_practice_passed";
  }
  const feedback=task()?.practice_feedback;
  const explanation=feedback?"\n\nWhy it worked: "+feedback.why+"\nThink next: "+feedback.probe:"";
  output("Passed "+r.length+" changed-input checks with real Python."+
    (r[0]?.stdout?"\n"+r[0].stdout:"")+explanation+
    "\n\nPublic practice checks are not independent or retained mastery."+
    (g?.id.endsWith("-REVIEW")?"\nResult: "+(classification==="delayed_practice_passed"?"delayed practice recorded":"early review practice recorded")+".":""));
  if(key()===k)progress(classification);
  el("p01-evidence").textContent="Last attempt: "+classification.replaceAll("_"," ");
 }
 status("Python 3 · practice checks");
}
function syncActivity(){
 const visible=active();
 document.body.classList.toggle("p01-active",visible);
 const navigation=el("p01-navigation");
 if(navigation)navigation.hidden=!visible;
 el("run-button").disabled=!visible||busy;
 const checkButton=el("p01-check");
 if(checkButton)checkButton.disabled=!visible||busy;
 if(!visible)el("run-button").title="Python execution is available in the Python Code workspace.";
}
function pyLiteral(value){
 if(value===null)return "None";
 if(value===true)return "True";
 if(value===false)return "False";
 if(typeof value==="string")return JSON.stringify(value);
 if(typeof value==="number"){
  if(!Number.isFinite(value))throw new Error("Cannot export a non-finite numeric training input.");
  return String(value);
 }
 if(Array.isArray(value))return "["+value.map(pyLiteral).join(", ")+"]";
 if(typeof value==="object"){
  return "{"+Object.entries(value).map(([key,item])=>JSON.stringify(key)+": "+pyLiteral(item)).join(", ")+"}";
 }
 throw new Error("Unsupported standalone input type");
}
function exportPython(){
 if(!active()||!(goal()?.id.endsWith("-CAPSTONE")||goal()?.id.endsWith("-REVIEW")))return;
 const vars={...(task().preview_inputs||{})};
 if(isImaging(activeId)&&vars.image_path==="/home/pyodide/witz_published_figure.png")vars.image_path="./assets/witz/fluorescence-single.png";
 const preamble=Object.entries(vars).map(([name,value])=>name+" = "+pyLiteral(value)).join("\n");
 const code=bridge()?.readCode()||"";
 if(!hasExecutableCode(code)){output("Write your Python program before exporting.");return;}
 const source=["# BioPython Studio "+activeId+" · original learner code",
 (isImaging(activeId)?"# Witz/HPA published RGB notebook figure, not calibrated raw intensity. Keep source image beside this exported script.":"# Synthetic microscopy records and example calibration, not real image measurements."),
 "# The assignments below reproduce one supplied practice input.",preamble,"",code,""].join("\n");
 const blob=new Blob([source],{type:"text/x-python;charset=utf-8"});
 const url=URL.createObjectURL(blob);
 const link=document.createElement("a");
 link.href=url;link.download=chapter?.final_project?.name||"scientific_program.py";
 document.body.append(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function refreshChapterOptions(){
 const selector=el("bps-chapter-select");if(!selector)return;
 selector.replaceChildren();
 for(const id of stageIds()){
  if(!chapters[id])continue;
  const option=document.createElement("option");option.value=id;
  option.textContent=id+" · "+chapters[id].title;selector.append(option);
 }
 selector.value=activeId;
}
function refreshGoalOptions(selector=el("p01-goal-select")){
 if(!selector)return;
 selector.replaceChildren();
 goals().forEach((g,i)=>{
  const o=document.createElement("option");
  o.value=String(i);o.textContent=(i+1)+". "+g.title;
  selector.append(o);
 });
}
function switchChapter(next){
 if(!chapters[next]||next===activeId||busy)return;
 remember();
 activeId=next;chapter=chapters[next];state=states[next];
 if(isImaging(next))lastI=next;else lastP=next;
 state.goal=Math.max(0,Math.min(state.goal,goals().length-1));
 refreshGoalOptions();refreshChapterOptions();
 bridge()?.selectPhase?.(state.phase);
 bridge()?.expandLesson?.(!newerChapter()||state.phase==="learn");
 if(isImaging(activeId))bridge()?.ensureExampleImage?.();
 render();save();
}
function mount(){
 const nav=document.querySelector(".sidebar-section");nav.querySelector(".quiet-text")?.remove();
 const chapterLabel=document.createElement("label");chapterLabel.htmlFor="bps-chapter-select";chapterLabel.textContent="Chapter";chapterLabel.className="p01-label";
 const chapterSelect=document.createElement("select");chapterSelect.id="bps-chapter-select";chapterSelect.setAttribute("aria-label","Choose Python chapter");
 for(const id of stageIds()){
   const o=document.createElement("option");o.value=id;o.textContent=id+" · "+chapters[id].title;
   chapterSelect.append(o);
 }
 chapterSelect.addEventListener("change",()=>switchChapter(chapterSelect.value));
 const label=document.createElement("label");label.id="p01-goal-label";label.htmlFor="p01-goal-select";label.textContent=activeId+" · Mini-goal";label.className="p01-label";
 const select=document.createElement("select");select.id="p01-goal-select";select.setAttribute("aria-label","P01 mini-goal");
 refreshGoalOptions(select);
 select.addEventListener("change",()=>chooseGoal(Number(select.value)));
 const evidence=document.createElement("p");evidence.id="p01-evidence";evidence.className="p01-quiet";
 const navigation=document.createElement("div");navigation.id="p01-navigation";navigation.append(chapterLabel,chapterSelect,label,select,evidence);
 nav.append(navigation);
 const pane=el("phase-panel"),prediction=document.createElement("p");prediction.id="p01-predict";prediction.className="p01-context";
 const hint=document.createElement("button");hint.type="button";hint.id="p01-hint";hint.className="subtle-button";hint.textContent="Hint";
 const hintText=document.createElement("p");hintText.id="p01-hint-text";hintText.className="p01-context";
 hint.addEventListener("click",()=>{const options=goal()?.hints[state.phase]||[];const count=state.hints[key()]||0;if(count<options.length){state.hints[key()]=count+1;showHints();save();}});
 const details=document.createElement("details");const summary=document.createElement("summary");summary.textContent="Scientific context";
 const caution=document.createElement("p");caution.id="p01-context";details.append(summary,caution);
 const link=document.createElement("a");link.id="bps-chapter-link";link.href="./content/chapters/"+activeId+"_COMPLETE.md";link.target="_blank";link.rel="noopener";link.textContent="Full "+activeId+" chapter (Markdown)";
 const teaching=document.createElement("div");teaching.id="p01-detail-root";
 pane.append(prediction,teaching,hint,hintText,details,link);
 const checker=document.createElement("button");checker.type="button";checker.id="p01-check";checker.className="subtle-button";checker.textContent="Check";
 const exportButton=document.createElement("button");
 exportButton.id="p01-export";exportButton.className="subtle-button";exportButton.type="button";
 exportButton.textContent="Export";exportButton.title="Download standalone Python script (.py)";exportButton.setAttribute("aria-label","Export runnable Python script");exportButton.hidden=true;
 exportButton.addEventListener("click",exportPython);
 el("run-button").before(checker,exportButton);checker.addEventListener("click",check);el("run-button").addEventListener("click",run);
 el("result-output").addEventListener("click",()=>{if(lastOutput)restoreOutput();});
 el("clear-code").addEventListener("click",()=>{if(active()){state.drafts[key()]=bridge()?.readCode()??"";save();}});
 document.querySelectorAll("[data-phase]").forEach(b=>{
  b.addEventListener("click",()=>choosePhase(b.dataset.phase));
  b.addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight"].includes(e.key))queueMicrotask(()=>choosePhase(document.querySelector('[data-phase][aria-selected="true"]')?.dataset.phase||"learn"));});
 });
 document.querySelectorAll("[data-stage]").forEach(b=>b.addEventListener("click",()=>{
  if(b.dataset.stage==="Microscopy"&&!isImaging(activeId))switchChapter(lastI);
   if(b.dataset.stage==="Python"&&isImaging(activeId))switchChapter(lastP);
   syncActivity();if(active()){render();if(newerChapter())preferEditorWhenCoding();else bridge()?.expandLesson?.(true);}
 }));
 document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>{
  syncActivity();if(active())render();
 }));
 document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();run();}});
 window.addEventListener("beforeunload",remember);
}
async function start(){
 try{
  for(const id of IDS){
   const r=await fetch("./content/"+id.toLowerCase()+"/lesson.json");
   if(!r.ok)throw Error(id+" content HTTP "+r.status);
   const data=await r.json();
   if(data.schema_version!=="bps.chapter.v1"||data.chapter_id!==id||data.goals?.length!==GOAL_COUNTS[id]||!data.capstone||!data.review)
     throw Error(id+" chapter import contract failed");
   chapters[id]=data;states[id]=loadState(id);
  }
  if(!chapters[activeId])activeId="P01";
  chapter=chapters[activeId];state=states[activeId];
  if(isImaging(activeId))lastI=activeId;else lastP=activeId;
  state.goal=Math.max(0,Math.min(state.goal,goals().length-1));
  if(isImaging(activeId))bridge()?.selectStage?.("Microscopy");
  mount();bridge()?.selectPhase?.(state.phase);bridge()?.expandLesson?.(!newerChapter()||state.phase==="learn");
  if(isImaging(activeId))bridge()?.ensureExampleImage?.();
  render();syncActivity();
  el("output-placeholder").textContent="Run your code to see real Python output or traceback.";
  status("Python ready to load on first Run");
 }catch(e){
  el("lesson-summary").textContent="Chapter loading failed";
  el("phase-description").textContent=String(e);
  status("Content unavailable; existing drafts preserved");
 }
}
start();
})();