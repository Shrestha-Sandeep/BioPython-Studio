import { STAGES, MISSIONS, primarySource } from "./course.js";
import { WITZ_FIGURES, SUPPLEMENTS, REFERENCE_TIFFS, resolveExercises } from "./witz-lessons.js";
const $ = id => document.getElementById(id);
const DRAFT_KEY = "biopython.witz-rebuild.frontend-drafts.v1";
let drafts = {};
try { drafts = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}"); if (!drafts || typeof drafts!=="object" || Array.isArray(drafts)) drafts={}; } catch { drafts={}; }
const params = new URLSearchParams(location.search);
let selectedId = MISSIONS.some(m=>m.id===params.get("mission")) ? params.get("mission") : MISSIONS[0].id;
let activeTab = "learn";
let index = Math.max(0,MISSIONS.findIndex(m=>m.id===selectedId));
let saveOK = true;
let sourceInventory = null;
let sourceLoadingError = "";
function stepItems(m){ return sourceInventory ? resolveExercises(sourceInventory,m.id) : []; }
function stepPosition(m){const n=Number(drafts[m.id+":step"]||0);return Math.min(Math.max(0,n),Math.max(0,stepItems(m).length-1));}
function setStep(index){
 if(activeTab!=="learn")return;
 const m=mission(),steps=stepItems(m);
 if(index>=steps.length){chooseTab("apply");return;}
 if(index<0||!steps.length)return;
 drafts[m.id+":step"]=index;saveDraft();draw();
}
const text = (node, value) => { node.textContent = value; };
function saveDraft(){ try { localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts)); } catch { saveOK = false; } }
function mission(){ return MISSIONS[index]; }
function editorSeed(m, tab) {
  if (tab==="learn") return m.id==="py-01" ? "# Begin with Witz's first exercise.\n" : m.starter;
  if (tab==="apply") {
    const previous=drafts[m.id+":learn"];
    return (typeof previous==="string" && previous.trim() ? previous.trimEnd()+"\n\n" : "") + "# Apply your Python to this new scientific task.\n# " + m.apply + "\n";
  }
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
 const fig=WITZ_FIGURES[m.id]||null;
 const figure=$("image-figure"),image=$("context-image"),fallback=$("image-fallback");
 figure.hidden=!fig;fallback.hidden=true;
 if(!fig){image.removeAttribute("src");return;}
 image.alt=fig.alt;
 const sourceLink=$("figure-source");
 sourceLink.href="https://github.com/guiwitz/PyImageCourse_beginner/blob/master/"+fig.notebook;
 text($("image-caption"),"Figure from Guillaume Witz, "+fig.notebook+", output cell "+fig.cell+". Based on Human Protein Atlas imagery (CC BY-SA 3.0). This rendered PNG is not a raw analysis TIFF.");
 const raw=$("raw-tiff-link");
 raw.hidden=!REFERENCE_TIFFS[m.id];if(!raw.hidden)raw.href=REFERENCE_TIFFS[m.id];
 image.onerror=()=>{if(mission().id!==m.id)return;figure.hidden=true;fallback.hidden=false;};
 image.src="./"+fig.path;
}
function draw(){
 const m=mission();
 drawStages();drawMissions();
 text($("lesson-position"),m.stage+" · Mission "+String(index+1).padStart(2,"0")+" of "+MISSIONS.length);
 text($("mission-title"),m.title);
 text($("mission-summary"),m.summary);
 text($("mission-outcome"),m.outcome);
 const title={learn:"Learn the idea",apply:"Build your program",prove:"Show what you can do"}[activeTab];
 const steps=stepItems(m),n=stepPosition(m),exercise=activeTab==="learn"?steps[n]:null;
 text($("step-title"),exercise?"Witz exercise "+(n+1)+" of "+steps.length:title);
 text($("step-text"),exercise?exercise.prompt:({learn:m.concept,apply:m.apply,prove:m.prove}[activeTab]));
 const nav=$("learn-step-controls");nav.hidden=!(activeTab==="learn"&&steps.length);
 if(!nav.hidden){
  text($("learn-step-position"),"A connected exercise from Witz's course; keep building your code.");
  $("learn-step-prev").disabled=n===0;
  $("learn-step-next").textContent=n===steps.length-1?"Continue to Apply":"Next exercise";
 }
 text($("science-context"),m.why+(SUPPLEMENTS[m.id]?.enhancement?" "+SUPPLEMENTS[m.id].enhancement:""));
 const source=$("source-link");
 source.href=exercise?exercise.sourceUrl:primarySource(m);
 text(source,exercise?"Witz · "+exercise.sourcePath+" · source cell "+exercise.sourceCell:m.source.startsWith("https://")?"Supporting scientific reference":"Witz · "+m.source);
 const extra=SUPPLEMENTS[m.id];
 $("supplement-wrapper").hidden=!extra;
 if(extra){$("support-source").href=extra.url;text($("support-source"),extra.title);}

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
$("learn-step-prev").onclick=()=>setStep(stepPosition(mission())-1);
$("learn-step-next").onclick=()=>setStep(stepPosition(mission())+1);
$("prev-mission").onclick=()=>select(index-1);
$("next-mission").onclick=()=>select(index+1);
draw();
fetch("./curriculum/witz_exercise_inventory.json")
 .then(r=>{if(!r.ok)throw new Error("Source exercise inventory HTTP "+r.status);return r.json();})
 .then(data=>{sourceInventory=data;draw();})
 .catch(error=>{
   sourceLoadingError=String(error);
   text($("runtime-message"),"Witz source exercise list unavailable; basic lesson preview remains accessible.");
 });