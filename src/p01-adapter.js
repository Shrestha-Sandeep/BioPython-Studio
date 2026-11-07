/* P01 content bridge: one goal, one task, no changes to frozen layout. */
"use strict";
(() => {
const el=id=>document.getElementById(id);
const KEY="biopython.p01.v1";
const state={goal:0,phase:"learn",drafts:{},hints:{},progress:{}};
let chapter=null,worker=null,pending=null,busy=false,seq=0;
try {
 const old=JSON.parse(localStorage.getItem(KEY)||"null");
 if(old&&typeof old==="object"){
  if(old.drafts&&typeof old.drafts==="object")state.drafts=old.drafts;
  if(old.hints&&typeof old.hints==="object")state.hints=old.hints;
  if(old.progress&&typeof old.progress==="object")state.progress=old.progress;
  if(Number.isInteger(old.goal))state.goal=old.goal;
  if(["learn","apply","prove"].includes(old.phase))state.phase=old.phase;
 }
}catch{}
const pythonSelected=()=>document.querySelector('[data-stage="Python"]')?.getAttribute("aria-current")==="page";
const codeSelected=()=>document.querySelector('[data-mode="python"]')?.getAttribute("aria-pressed")==="true";
const bridge=()=>window.BioPythonStudioBridge;
const goal=()=>chapter?.goals[state.goal];
const task=()=>goal()?.phases[state.phase];
const key=()=>String(goal()?.id)+":"+state.phase;
const active=()=>!!chapter&&pythonSelected()&&codeSelected();
function save(){
 try{localStorage.setItem(KEY,JSON.stringify({schema_version:1,content_version:chapter?.version,goal:state.goal,phase:state.phase,drafts:state.drafts,hints:state.hints,progress:state.progress}));el("save-status").textContent="Saved locally";}
 catch{el("save-status").textContent="Saving blocked";}
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
let lastOutput = "", lastOutputFailed = false;
function restoreOutput(){
 const placeholder=el("output-placeholder");
 if(!placeholder)return;
 placeholder.textContent=lastOutput;
 placeholder.classList.add("p01-console-result");
 if(lastOutputFailed)placeholder.setAttribute("data-error","true");
 else placeholder.removeAttribute("data-error");
}
function output(message,failed=false){
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
 el("lesson-summary").textContent="P01 · "+g.title+" · "+(state.goal+1)+"/"+chapter.goals.length;
 el("phase-title").textContent=t.title;
 el("phase-description").textContent=t.description;
 el("phase-caption").textContent=state.phase.toUpperCase();
 el("p01-predict").textContent=state.phase==="learn"?g.worked_example.predict:"";
 el("p01-predict").hidden=state.phase!=="learn";
 el("p01-context").textContent=g.why+" Scientific boundary: "+g.scientific_boundary;
 el("p01-goal-select").value=String(state.goal);
 el("p01-check").hidden=state.phase==="learn";
 el("p01-check").disabled=busy;
 el("run-button").disabled=busy;
 el("run-button").title="Run actual Python (requires internet for first Pyodide load)";
 showHints();
 const value=Object.prototype.hasOwnProperty.call(state.drafts,key())?state.drafts[key()]:t.starter_code;
 bridge()?.writeCode?.(value);
 el("crumb").textContent="Python foundations · P01";
 el("page-title").textContent="Python workspace";
 el("page-subtitle").textContent=g.why;
 save();
}
function chooseGoal(n){
 if(!chapter||n<0||n>=chapter.goals.length)return;
 remember();state.goal=n;state.phase="learn";bridge()?.selectPhase?.("learn");render();
}
function choosePhase(name){
 if(!chapter||!["learn","apply","prove"].includes(name))return;
 remember();state.phase=name;render();
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
  },60000);
  pending={id,resolve,timer};
  try{instance().postMessage(Object.assign({id,type},fields));}
  catch(e){clearTimeout(timer);pending=null;busy=false;resolve({ok:false,error:String(e)});}
 });
}
async function run(){
 if(!active()||busy)return;
 const k=key(),code=bridge()?.readCode()??"";
 if(!code.trim()){output("Write Python first.",true);return;}
 const result=await send("run",{code,inputs:task().preview_inputs||{}});
 if(!result.ok){output(result.error,true);status("Python unavailable");return;}
 const r=result.result;
 output([r.stdout,r.stderr,r.traceback].filter(Boolean).join("\n"),!!r.traceback);
 if(key()===k)progress(r.traceback?"needs_review":"explored");
 status("Python 3 · real execution"+(r.traceback?" · traceback":""));
}
async function check(){
 if(!active()||state.phase==="learn"||busy)return;
 const cases=task().public_checks||[],k=key(),code=bridge()?.readCode()??"";
 if(!code.trim()){output("Write your own solution first.",true);return;}
 const result=await send("check",{code,cases});
 if(!result.ok){output(result.error,true);status("Python unavailable");return;}
 const r=result.results||[];
 const bad=r.findIndex(x=>x.traceback||x.checks.some(y=>!y.passed));
 if(bad>=0){
  const item=r[bad],f=item.checks.find(x=>!x.passed);
  output("Input: "+JSON.stringify(cases[bad].inputs)+"\n"+(item.traceback||f?.error||"Practice condition failed: "+f?.expression),true);
  if(key()===k)progress("needs_review");
 }else{
  output("Passed "+r.length+" changed-input checks with real Python.\nPublic practice checks are not evidence of delayed mastery."+(r[0]?.stdout?"\n"+r[0].stdout:""));
  if(key()===k)progress(state.hints[k]?"guided":"practice_passed");
 }
 status("Python 3 · practice checks");
}
function mount(){
 const nav=document.querySelector(".sidebar-section");nav.querySelector(".quiet-text")?.remove();
 const label=document.createElement("label");label.htmlFor="p01-goal-select";label.textContent="P01 · Mini-goal";label.className="p01-label";
 const select=document.createElement("select");select.id="p01-goal-select";select.setAttribute("aria-label","P01 mini-goal");
 chapter.goals.forEach((g,i)=>{const o=document.createElement("option");o.value=String(i);o.textContent=(i+1)+". "+g.title;select.append(o);});
 select.addEventListener("change",()=>chooseGoal(Number(select.value)));nav.append(label,select);
 const pane=el("phase-panel"),prediction=document.createElement("p");prediction.id="p01-predict";prediction.className="p01-context";
 const hint=document.createElement("button");hint.type="button";hint.id="p01-hint";hint.className="subtle-button";hint.textContent="Hint";
 const hintText=document.createElement("p");hintText.id="p01-hint-text";hintText.className="p01-context";
 hint.addEventListener("click",()=>{const options=goal()?.hints[state.phase]||[];const count=state.hints[key()]||0;if(count<options.length){state.hints[key()]=count+1;showHints();save();}});
 const details=document.createElement("details");const summary=document.createElement("summary");summary.textContent="Scientific context";
 const caution=document.createElement("p");caution.id="p01-context";details.append(summary,caution);
 const link=document.createElement("a");link.href="./content/chapters/P01_COMPLETE.md";link.target="_blank";link.rel="noopener";link.textContent="Full P01 chapter (Markdown)";
 pane.append(prediction,hint,hintText,details,link);
 const checker=document.createElement("button");checker.type="button";checker.id="p01-check";checker.className="subtle-button";checker.textContent="Check";
 el("run-button").before(checker);checker.addEventListener("click",check);el("run-button").addEventListener("click",run);
 el("result-output").addEventListener("click",()=>{if(lastOutput)restoreOutput();});
 el("clear-code").addEventListener("click",()=>{if(active()){state.drafts[key()]=bridge()?.readCode()??"";save();}});
 document.querySelectorAll("[data-phase]").forEach(b=>{
  b.addEventListener("click",()=>choosePhase(b.dataset.phase));
  b.addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight"].includes(e.key))queueMicrotask(()=>choosePhase(document.querySelector('[data-phase][aria-selected="true"]')?.dataset.phase||"learn"));});
 });
 document.querySelectorAll("[data-stage]").forEach(b=>b.addEventListener("click",()=>{
  if(active()){render();bridge()?.expandLesson?.(true);}
 }));
 document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>{
  if(active())render();
 }));
 document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();run();}});
 window.addEventListener("beforeunload",remember);
}
async function start(){
 try{
  const r=await fetch("./content/p01/lesson.json");
  if(!r.ok)throw new Error("HTTP "+r.status);
  chapter=await r.json();
  if(chapter.schema_version!=="bps.chapter.v1"||chapter.chapter_id!=="P01"||chapter.goals?.length!==7)throw new Error("Invalid P01 contract.");
  state.goal=Math.max(0,Math.min(state.goal,chapter.goals.length-1));
  mount();bridge()?.selectPhase?.(state.phase);bridge()?.expandLesson?.(true);
  render();status("Python ready to load on first Run");
 }catch(e){el("lesson-summary").textContent="P01 failed to load";el("phase-description").textContent=String(e);status("Content unavailable; old UI drafts preserved");}
}
start();
})();