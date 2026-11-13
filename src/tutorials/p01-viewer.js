/* Optional P01 narrated tutorial viewer. The lesson editor, Python worker and saved
   learner progress stay untouched. Narration uses the browser's installed voices. */
"use strict";
(() => {
  const tutorials=window.BioPythonFoundationTutorials||window.BioPythonP01Tutorials;
  if(!Array.isArray(tutorials)||!tutorials.length)return;
  const $=id=>document.getElementById(id);
  const library=new Map(tutorials.map(t=>[t.id,t]));
  const goalToTutorial=new Map(tutorials.flatMap(t=>t.goals.map(id=>[id,t.id])));
  const chapterTutorials=new Map(tutorials.map(t=>[t.chapter,t]));
  const state={tutorial:null,step:0,playing:false,paused:false,awaitingPrediction:false,token:0,voices:[],preferredVoice:"",param:null};
  const hasSpeech=typeof window.speechSynthesis!=="undefined"&&typeof window.SpeechSynthesisUtterance!=="undefined";
  const entry=document.createElement("button");
  entry.type="button";entry.id="bps-example-trigger";entry.className="subtle-button bps-example-trigger";entry.hidden=true;
  entry.setAttribute("aria-haspopup","dialog");
  entry.textContent="▶ Chapter example";
  const anchor=$("phase-description");
  if(!anchor)return;
  anchor.insertAdjacentElement("afterend",entry);
  const dialog=document.createElement("dialog");
  dialog.id="bps-example-dialog";
  dialog.className="bps-example-dialog";
  dialog.setAttribute("aria-labelledby","bps-example-title");
  // The markup is static. All user-facing instructional data is assigned using textContent.
  dialog.innerHTML=`
    <div class="bps-example-shell">
      <div class="bps-example-header">
        <div class="bps-example-heading">
          <span class="bps-example-kicker">PYTHON · VISUAL EXAMPLE</span>
          <h2 id="bps-example-title"></h2>
          <p id="bps-example-subtitle"></p>
        </div>
        <button type="button" id="bps-example-close" class="bps-example-close" aria-label="Close tutorial">×</button>
      </div>
      <div class="bps-example-controls">
        <button type="button" id="bps-example-play" class="bps-example-play">▶ Play</button>
        <button type="button" id="bps-example-prev" aria-label="Previous explanation step">← Back</button>
        <button type="button" id="bps-example-next">Next →</button>
        <span id="bps-example-position" aria-live="polite"></span>
        <label class="bps-example-voice-label">Voice <select id="bps-example-voice" aria-label="Narrator voice"></select></label>
        <label class="bps-example-speed-label">Speed <select id="bps-example-rate" aria-label="Narration speed"><option value="0.85">0.85×</option><option value="0.95" selected>0.95×</option><option value="1">1×</option><option value="1.1">1.1×</option></select></label>
      </div>
      <progress id="bps-example-progress" value="1" max="5" aria-label="Tutorial progress"></progress>
      <div class="bps-example-stage">
        <div class="bps-example-explain">
          <h3 id="bps-example-step-title"></h3>
          <p id="bps-example-caption" aria-live="polite"></p>
        </div>
        <div id="bps-example-grid" class="bps-example-grid">
          <section class="bps-example-card bps-example-code" aria-label="Highlighted example code">
            <div class="bps-example-card-heading">PYTHON CODE <span>Illustrative trace</span></div>
            <pre id="bps-example-code" aria-label="Code highlighted at this step"></pre>
          </section>
          <div class="bps-example-right">
            <section class="bps-example-card" aria-label="Values in the example">
              <div class="bps-example-card-heading">WHAT CHANGES</div>
              <div id="bps-example-workflow-box" class="bps-example-workflow-box" hidden></div>
              <div id="bps-example-illustration-box" class="bps-example-illustration-box" hidden></div>
              <figure id="bps-example-image-preview" class="bps-example-image-preview" hidden>
              <figcaption id="bps-example-image-label"></figcaption>
              <img id="bps-example-image" alt="" loading="lazy" />
              <small>Published course figure: Witz / Human Protein Atlas. Illustrative, not raw calibrated data. <a href="./assets/witz/CREDITS.md" target="_blank" rel="noopener noreferrer">Credits</a></small>
            </figure>
            <div id="bps-example-visual" class="bps-example-visual"></div>
            </section>
            <section class="bps-example-card" aria-label="Illustrative Python output">
              <div class="bps-example-card-heading">OUTPUT <span>Illustrative preview</span></div>
              <pre id="bps-example-output"></pre>
            </section>
          </div>
        </div>
        <div id="bps-example-parameter-box" class="bps-example-parameter" hidden>
          <label id="bps-example-parameter-label" for="bps-example-parameter"></label>
          <input type="range" id="bps-example-parameter" />
          <output id="bps-example-parameter-value" for="bps-example-parameter"></output>
        </div>
        <p class="bps-example-tip" id="bps-example-tip"></p>
      </div>
      <footer class="bps-example-footer">
        <span id="bps-example-status" role="status">Press Play to hear the explanation, or use Next.</span>
        <span>Use the lesson's Run button for real Python execution.</span>
      </footer>
    </div>`;
  document.body.append(dialog);
  const play=$("bps-example-play"),previous=$("bps-example-prev"),next=$("bps-example-next");
  const voiceSelect=$("bps-example-voice"),rateSelect=$("bps-example-rate"),paramInput=$("bps-example-parameter");
  function currentStep(){return state.tutorial?.steps[state.step]||null;}
  function values(){
    const param=state.tutorial?.parameter;
    const v=state.param===null?param?.value:state.param;
    const replacements={CELLS:String(v??25),PIXEL_SIZE:Number(v??0.2).toFixed(1),LENGTH:(40*Number(v??0.2)).toFixed(1)};
    return replacements;
  }
  function interpolate(source){
    if(source===null||source===undefined)return "";
    const m=values();
    return String(source).replace(/\{(CELLS|PIXEL_SIZE|LENGTH)\}/g,(_,name)=>m[name]);
  }
  function setStatus(message){$("bps-example-status").textContent=message;}
  function visualProgress(value){
    window.BioPythonTutorialIllustrations?.progress?.($("bps-example-illustration-box"),value);
  }
  function renderCode(step){
    const code=$("bps-example-code");
    code.replaceChildren();
    const lines=interpolate(step.code).split("\n");
    if(lines.length===1&&!lines[0]){code.textContent="The program will appear here.";code.classList.add("bps-code-empty");return;}
    code.classList.remove("bps-code-empty");
    lines.forEach((line,i)=>{
      const span=document.createElement("span");
      span.className="bps-example-code-line"+(step.focus.includes(i+1)?" is-active":"");
      span.textContent=String(i+1).padStart(2," ")+"   "+line;
      code.append(span);
    });
  }
  const previewImages=Object.freeze({
    "labeled-nuclei":{src:"./assets/witz/labeled-nuclei.png",alt:"Published labeled fluorescence nuclei output from the Witz image-processing tutorial."},
    "fluorescence-single":{src:"./assets/witz/fluorescence-single.png",alt:"Published Witz teaching figure of fluorescence microscopy from Human Protein Atlas imagery."},
    "fluorescence-examples":{src:"./assets/witz/fluorescence-examples.png",alt:"Published set of Witz fluorescence microscopy example images from Human Protein Atlas imagery."},
    "otsu-nuclei-mask":{src:"./assets/witz/otsu-nuclei-mask.png",alt:"Published Witz example showing an image-thresholding mask, not made by the beginner program."}
  });
  function renderVisual(step){
    const figure=$("bps-example-image-preview"),img=$("bps-example-image"),image=previewImages[step.preview?.image];
    const workflowBox=$("bps-example-workflow-box");
    const workflow=Boolean(step.preview&&!step.code&&window.BioPythonMicroscopyWorkflow?.render(
      workflowBox,state.tutorial?.chapter,values().CELLS
    ));
    if(!workflow)workflowBox.replaceChildren();
    workflowBox.hidden=!workflow;
    figure.hidden=!image||workflow;
    if(image&&!workflow){
      if(img.getAttribute("src")!==image.src)img.src=image.src;
      img.alt=image.alt;
      $("bps-example-image-label").textContent=step.preview.label;
    }else{img.removeAttribute("src");img.alt="";}
    // Show a single original diagram when no credited microscopy preview is present.
    // The illustration is tied to this exact chapter step and updates with inputs.
    const illustrationBox=$("bps-example-illustration-box");
    const hasTeachingImage=!image&&Boolean(window.BioPythonTutorialIllustrations?.render(
      illustrationBox,state.tutorial?.chapter,state.step,{cells:values().CELLS}
    ));
    if(!hasTeachingImage)illustrationBox.replaceChildren();
    illustrationBox.hidden=!hasTeachingImage;
    const target=$("bps-example-visual");
    target.replaceChildren();
    for(const [label,value] of step.visual){
      const card=document.createElement("div");card.className="bps-example-value";
      const name=document.createElement("small");name.textContent=label;
      const val=document.createElement("strong");val.textContent=interpolate(value);
      card.append(name,val);target.append(card);
    }
  }
  function render(){
    const tutorial=state.tutorial,step=currentStep();if(!tutorial||!step)return;
    $("bps-example-title").textContent=tutorial.title;
    $("bps-example-subtitle").textContent="Guided chapter example · "+tutorial.minutes+" · "+(tutorial.chapter||"Python");
    $("bps-example-position").textContent=(state.step+1)+" / "+tutorial.steps.length;
    $("bps-example-progress").max=tutorial.steps.length;
    $("bps-example-progress").value=state.step+1;
    $("bps-example-step-title").textContent=step.title;
    $("bps-example-caption").textContent=interpolate(step.say);
    $("bps-example-output").textContent=interpolate(step.output)||"—";
    $("bps-example-tip").textContent=step.note;
    $("bps-example-grid").classList.toggle("is-preview-first",Boolean(step.preview&&!step.code));
    previous.disabled=state.step===0;next.disabled=state.step===tutorial.steps.length-1;
    const param=tutorial.parameter;
    $("bps-example-parameter-box").hidden=!param||!step.interactive;
    if(param){
      paramInput.min=String(param.min);paramInput.max=String(param.max);paramInput.step=String(param.step);
      paramInput.value=String(state.param);
      $("bps-example-parameter-label").textContent=param.label;
      $("bps-example-parameter-value").textContent=paramInput.value;
    }
    renderCode(step);renderVisual(step);
    play.textContent=state.awaitingPrediction?"▶ Reveal":state.paused?"▶ Resume":state.playing?"Ⅱ Pause":state.step===tutorial.steps.length-1?"↻ Replay":"▶ Play";
  }
  function stopSpeech(){
    state.token++;
    state.playing=false;state.paused=false;state.awaitingPrediction=false;
    if(hasSpeech)window.speechSynthesis.cancel();
    visualProgress(null);
  }
  function findVoice(){
    const id=voiceSelect.value;
    return state.voices.find(v=>v.voiceURI===id)||null;
  }
  function speak(){
    if(!state.tutorial)return;
    if(!hasSpeech){state.playing=false;render();setStatus("Narration unavailable here. Use Next to follow the captions.");return;}
    const step=currentStep(),token=++state.token;
    const utterance=new SpeechSynthesisUtterance(interpolate(step.say));
    utterance.lang="en-US";utterance.rate=Number(rateSelect.value)||0.95;
    utterance.pitch=1.0;
    const chosen=findVoice();if(chosen)utterance.voice=chosen;
    utterance.onstart=()=>{if(token===state.token)setStatus("Narrating step "+(state.step+1)+"…");};
    // Reveal diagrams against reported TTS word positions. Some voices do not
    // provide boundaries; those retain the full diagram instead of fake timing.
    utterance.onboundary=(event)=>{
      if(token!==state.token||!state.playing||state.paused)return;
      if(Number.isFinite(event.charIndex)&&event.charIndex>=0){
        visualProgress(event.charIndex/Math.max(1,utterance.text.length));
      }
    };
    utterance.onerror=event=>{if(token!==state.token)return;state.playing=false;state.paused=false;render();setStatus("Voice playback could not start ("+(event.error||"device voice") + "). You can use Next.");};
    utterance.onend=()=>{
      if(token!==state.token||!state.playing)return;
      visualProgress(null);
      if(step.checkpoint){
        state.playing=false;state.paused=false;state.awaitingPrediction=true;render();
        setStatus("Prediction break: think about the answer, then press Reveal.");
        return;
      }
      if(state.step<state.tutorial.steps.length-1){
        state.step++;render();setTimeout(()=>{
          if(token!==state.token||!state.playing)return;
          speak();
        },320);
      }else{state.playing=false;state.paused=false;render();setStatus("Tutorial complete. Practice the concept in the Python editor.");}
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
  function jump(distance,keepPlaying=false){
    if(!state.tutorial)return;
    const target=Math.max(0,Math.min(state.step+distance,state.tutorial.steps.length-1));
    stopSpeech();state.step=target;
    if(keepPlaying){state.playing=true;state.paused=false;}
    render();
    if(keepPlaying)speak();
    else setStatus("Step "+(state.step+1)+" of "+state.tutorial.steps.length+". Press Play for narration.");
  }
  function openTutorial(id){
    const tutorial=library.get(id);if(!tutorial)return;
    stopSpeech();state.tutorial=tutorial;state.step=0;state.awaitingPrediction=false;
    state.param=tutorial.parameter?.value??null;
    render();setStatus("Press Play to hear the explanation, or use Next.");
    if(typeof dialog.showModal==="function")dialog.showModal();
    else dialog.setAttribute("open","");
    $("bps-example-close").focus();
  }
  function closeTutorial(){
    stopSpeech();state.tutorial=null;
    if(dialog.open)dialog.close();
    else dialog.removeAttribute("open");
    entry.focus();
  }
  function loadVoices(){
    if(!hasSpeech){voiceSelect.replaceChildren(new Option("Voice unavailable",""));voiceSelect.disabled=true;return;}
    const chosen=voiceSelect.value||state.preferredVoice;
    state.voices=window.speechSynthesis.getVoices().filter(v=>/^en([-_]|$)/i.test(v.lang));
    voiceSelect.replaceChildren();
    const fallback=new Option("System default","");voiceSelect.add(fallback);
    state.voices.forEach(v=>voiceSelect.add(new Option(v.name+" · "+v.lang,v.voiceURI)));
    const maleLike=v=>/\b(david|daniel|george|james|ryan|mark|matthew|thomas|paul|robert|fred|alex|male)\b/i.test(v.name);
    const preferred=state.voices.find(v=>v.voiceURI===chosen)||state.voices.find(maleLike)||state.voices[0];
    voiceSelect.value=preferred?.voiceURI||"";
    state.preferredVoice=voiceSelect.value;
  }
  function sync(event){
    const d=event?.detail||{};
    const chapter=chapterTutorials.get(d.chapterId);
    const goalId=chapter&&Number.isInteger(d.goalIndex)?chapter.goals[d.goalIndex]:null;
    const id=d.phase==="learn"&&goalId?goalToTutorial.get(goalId):null;
    entry.hidden=!id;
    entry.dataset.tutorial=id||"";
    if(id)entry.textContent="▶ Chapter example";
    if(dialog.open&&(!id||id!==state.tutorial?.id))closeTutorial();
  }
  entry.addEventListener("click",()=>openTutorial(entry.dataset.tutorial));
  $("bps-example-close").addEventListener("click",closeTutorial);
  dialog.addEventListener("close",()=>{stopSpeech();state.tutorial=null;});
  dialog.addEventListener("click",event=>{if(event.target===dialog)closeTutorial();});
  play.addEventListener("click",()=>{
    if(!state.tutorial)return;
    if(state.awaitingPrediction){
      state.awaitingPrediction=false;
      state.step=Math.min(state.step+1,state.tutorial.steps.length-1);
      state.playing=true;state.paused=false;render();speak();return;
    }
    if(state.paused){state.paused=false;window.speechSynthesis.resume();render();setStatus("Narration resumed.");return;}
    if(state.playing){state.paused=true;window.speechSynthesis.pause();render();setStatus("Narration paused.");return;}
    if(state.step===state.tutorial.steps.length-1)state.step=0;
    state.playing=true;state.paused=false;render();speak();
  });
  previous.addEventListener("click",()=>jump(-1,state.playing&&!state.paused));
  next.addEventListener("click",()=>jump(1,state.playing&&!state.paused));
  paramInput.addEventListener("input",()=>{state.param=Number(paramInput.value);render();});
  voiceSelect.addEventListener("change",()=>{
    state.preferredVoice=voiceSelect.value;
    if(state.playing){stopSpeech();state.playing=true;render();speak();}
  });
  rateSelect.addEventListener("change",()=>{
    if(state.playing){stopSpeech();state.playing=true;render();speak();}
  });
  if(hasSpeech){loadVoices();window.speechSynthesis.addEventListener?.("voiceschanged",loadVoices);}
  else loadVoices();
  document.addEventListener("bps:lesson-change",sync);
  window.BioPythonExamples=Object.freeze({open:openTutorial,list:()=>tutorials.map(t=>({id:t.id,goals:[...t.goals]}))});
})();