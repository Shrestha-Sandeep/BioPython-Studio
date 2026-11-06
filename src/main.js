import { STAGES, MISSIONS, primarySource } from "./course.js";
const $ = id => document.getElementById(id);
const DRAFT_KEY = "biopython.witz-rebuild.frontend-drafts.v1";
let drafts = {};
try { drafts = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}"); if (!drafts || typeof drafts!=="object" || Array.isArray(drafts)) drafts={}; } catch { drafts={}; }
const params = new URLSearchParams(location.search);
let selectedId = MISSIONS.some(m=>m.id===params.get("mission")) ? params.get("mission") : MISSIONS[0].id;
let activeTab = "learn";
let index = Math.max(0,MISSIONS.findIndex(m=>m.id===selectedId));
let saveOK = true;
const text = (node, value) => { node.textContent = value; };
function saveDraft(){ try { localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts)); } catch { saveOK = false; } }
function mission(){ return MISSIONS[index]; }
function editorSeed(m, tab) {
  if (tab==="learn") return m.starter;
  if (tab==="apply") return "# Build the mission result.\n# " + m.apply + "\n\n";
  return "# Independent challenge: new data, fewer hints.\n# " + m.prove + "\n\n";
}
function drawStages(){
  $("stage-nav").replaceChildren();
  for (const stage of STAGES) {
    const button=document.createElement("button");
    button.type="button"; button.className="stage-button";
    button.textContent=stage;
    if (stage===mission().stage) button.setAttribute("aria-current","step");
    button.onclick=()=>select(MISSIONS.findIndex(m=>m.stage===stage));
    $("stage-nav").append(button);
  }
}
function drawMissions(){
  const nav=$("mission-list"); nav.replaceChildren();
  for (const stage of STAGES) {
    const label=document.createElement("p");
    label.className="group-label";label.textContent=stage;nav.append(label);
    for(const [i,m] of MISSIONS.entries()) {
      if(m.stage!==stage)continue;
      const button=document.createElement("button");
      button.type="button";button.className="mission-link";
      if(i===index)button.setAttribute("aria-current","true");
      const num=document.createElement("span");num.className="mission-number";num.textContent=String(i+1).padStart(2,"0");
      const name=document.createElement("span");name.className="mission-name";name.textContent=m.title;
      button.append(num,name);button.onclick=()=>select(i);nav.append(button);
    }
  }
  text($("mission-count"), MISSIONS.length+" preview missions");
}
function showImage(m){
  const figure=$("image-figure"), image=$("context-image"), fallback=$("image-fallback");
  const currentSrc=m.image || null;
  figure.hidden=!currentSrc; fallback.hidden=true;
  image.onerror=()=>{if(mission().id!==m.id)return;figure.hidden=true;fallback.hidden=false;};
  if(currentSrc){image.src=currentSrc;}
  else image.removeAttribute("src");
}
function draw(){
 const m=mission();
 drawStages();drawMissions();
 text($("lesson-position"),m.stage+" · Mission "+String(index+1).padStart(2,"0")+" of "+MISSIONS.length);
 text($("mission-title"),m.title);
 text($("mission-summary"),m.summary);
 text($("mission-outcome"),m.outcome);
 const title={learn:"Learn the idea",apply:"Build your program",prove:"Show what you can do"}[activeTab];
 text($("step-title"),title);
 text($("step-text"),{learn:m.concept,apply:m.apply,prove:m.prove}[activeTab]);
 text($("science-context"),m.why);
 const source=$("source-link");source.href=primarySource(m);
 text(source,m.source.startsWith("https://")?"Supporting scientific reference":(m.source.startsWith("e")?"Witz exercise notebook":"Witz course notebook")+" · View original");
 const panel=$("stage-panel"); panel.setAttribute("aria-labelledby","tab-"+activeTab);
 for(const button of document.querySelectorAll('[role="tab"]')){
   const active=button.dataset.tab===activeTab;button.setAttribute("aria-selected",String(active));button.tabIndex=active?0:-1;
 }
 const key=m.id+":"+activeTab; $("code-editor").value=Object.hasOwn(drafts,key)?drafts[key]:editorSeed(m,activeTab);
 text($("runtime-message"),saveOK?"Real Python execution arrives in the next development step.":"Local draft saving is blocked by this browser.");
 showImage(m);
 $("prev-mission").disabled=index===0;$("next-mission").disabled=index===MISSIONS.length-1;
 if(location.protocol==="http:"||location.protocol==="https:"){
  const url=new URL(location.href);url.searchParams.set("mission",m.id);history.replaceState(null,"",url);
 }
}
function select(i){if(i<0||i>=MISSIONS.length)return;index=i;activeTab="learn";draw();}
function chooseTab(tab){if(!["learn","apply","prove"].includes(tab))return;activeTab=tab;draw();}
for(const button of document.querySelectorAll('[role="tab"]')){
 button.onclick=()=>chooseTab(button.dataset.tab);
 button.onkeydown=e=>{if(!["ArrowLeft","ArrowRight"].includes(e.key))return;e.preventDefault();const tabs=["learn","apply","prove"];const next=tabs[(tabs.indexOf(activeTab)+(e.key==="ArrowRight"?1:2))%3];chooseTab(next);$("tab-"+next).focus();};
}
$("code-editor").addEventListener("input",()=>{drafts[mission().id+":"+activeTab]=$("code-editor").value;saveDraft();});
$("code-editor").addEventListener("keydown",e=>{if(e.key!=="Tab")return;e.preventDefault();e.currentTarget.setRangeText("    ",e.currentTarget.selectionStart,e.currentTarget.selectionEnd,"end");e.currentTarget.dispatchEvent(new Event("input"));});
$("prev-mission").onclick=()=>select(index-1);
$("next-mission").onclick=()=>select(index+1);
draw();