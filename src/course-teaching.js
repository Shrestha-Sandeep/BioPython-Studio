/* P01–P03 teaching in frozen UI; original prose, no unsafe innerHTML. */
"use strict";
(() => {
  const el=(tag,cls="",textValue=null)=>{
    const e=document.createElement(tag);
    if(cls)e.className=cls;
    if(textValue!==null)e.textContent=String(textValue);
    return e;
  };
  const tick=String.fromCharCode(96);
  function rich(target,line){
    String(line).split(/(\*\*[^*]+\*\*)/g).forEach(piece=>{
      if(piece.startsWith("**")&&piece.endsWith("**")){
        target.append(el("strong","",piece.slice(2,-2)));
      }else{
        piece.split(tick).forEach((part,i)=>{
          target.append(i%2?el("code","",part):document.createTextNode(part));
        });
      }
    });
  }
  function paragraph(value){const p=el("p","p01-text");rich(p,value);return p;}
  function details(title,blocks){const d=el("details","p01-details");d.append(el("summary","",title));blocks.forEach(x=>d.append(x));return d;}
  function ordered(items){
    const list=el("ol","p01-instructions");
    (items||[]).forEach(item=>{const li=el("li");rich(li,item);list.append(li);});
    return list;
  }
  function pythonRepr(value){
    if(value===null)return "None";
    if(value===true)return "True";
    if(value===false)return "False";
    if(typeof value==="string")return JSON.stringify(value);
    if(Array.isArray(value))return "["+value.map(pythonRepr).join(", ")+"]";
    if(value&&typeof value==="object")return "{"+Object.entries(value).map(([name,item])=>pythonRepr(name)+": "+pythonRepr(item)).join(", ")+"}";
    return String(value);
  }
  function intro(root,goal,phase){
    const section=el("div","p01-reading");
    if(phase==="learn"){
      section.append(el("h3","","The idea"));
      (goal.explain||[]).forEach(item=>section.append(paragraph(item)));
      section.append(paragraph(goal.id.endsWith("-REVIEW")?
        "There is no solved example in this return task. Try to recall the approach before opening earlier work.":
        "The worked program is in the editor below. Read it, make your prediction, then run and change it."));
      const answer=el("p","p01-answer",goal.prediction_answer||"");answer.hidden=true;
      const btn=el("button","subtle-button p01-answer-toggle","Check prediction");
      btn.type="button";btn.setAttribute("aria-expanded","false");
      btn.addEventListener("click",()=>{
        const show=answer.hidden;answer.hidden=!show;btn.setAttribute("aria-expanded",String(show));
        btn.textContent=show?"Hide explanation":"Check prediction";
      });
      section.append(btn,answer);
      section.append(details("Walkthrough",[ordered(goal.walkthrough)]));
      section.append(details("Try changing something",[ordered(goal.investigate)]));
      section.append(details("Debug and explain",[paragraph(goal.debug_task),paragraph("Common confusion: "+goal.misconception)]));
    }else if(phase==="apply"){
      section.append(el("h3","","Available example inputs"));
      const values=goal.phases.apply.preview_inputs||{};
      section.append(el("pre","p01-inputs",Object.keys(values).length?
        Object.entries(values).map(([k,v])=>k+" = "+pythonRepr(v)).join("\n"):
        "No variables are injected during this planning activity."));
      section.append(paragraph("Construct a solution for changing inputs. Check runs genuine Python against multiple cases, not a fixed output."));
      if(Array.isArray(goal.build_steps)&&goal.build_steps.length)section.append(details("Build in short passes",[ordered(goal.build_steps)]));
      if(goal.id!=="P01-REVIEW")section.append(details("Review the concept",(goal.explain||[]).map(paragraph)));
    }else{
      section.append(el("h3","","Independent input"));
      const values=goal.phases.prove.preview_inputs||{};
      section.append(el("pre","p01-inputs",Object.entries(values).map(([k,v])=>k+" = "+pythonRepr(v)).join("\n")));
      section.append(paragraph("Work from unfamiliar input names. Public checks support practice but do not independently certify mastery."));
      if(goal.id.endsWith("-REVIEW"))section.append(paragraph("For a genuine return exercise, avoid opening old solutions; record any help that you needed."));
    }
    root.append(section);
  }
  function fluorescence(root,goal){
    const figure=el("figure","p01-real-figure");
    const img=el("img");
    img.src=(goal.id.startsWith("P02")||goal.id.startsWith("P03"))?"./assets/witz/fluorescence-examples.png":"./assets/witz/fluorescence-single.png";
    img.loading="lazy";
    img.alt="Published fluorescence microscopy teaching figure of cellular structures; visual context only, not calibrated raw data.";
    const caption=el("figcaption","p01-quiet","Guillaume Witz, Image Processing for Beginners, Demo.ipynb, output cell "+
 ((goal.id.startsWith("P02")||goal.id.startsWith("P03"))?"3":"12")+
 ". Based on Human Protein Atlas fluorescence imagery (CC BY-SA 3.0 per source credits). This rendered PNG is not raw intensity data and the course sample IDs are synthetic.");
    const source=el("a","","Source and licensing");source.href="./assets/witz/CREDITS.md";
    source.target="_blank";source.rel="noopener noreferrer";
    figure.append(img,caption,source);
    root.append(details("See a genuine microscopy example",[figure]));
  }
  function reflection(root,goal,options){
    if(!Array.isArray(goal.reflection_prompts)||options.phase!=="prove")return;
    const wrap=el("section","p01-reflection");
    wrap.append(el("h3","","Scientific reasoning"));
    wrap.append(ordered(goal.reflection_prompts));
    const label=el("label","p01-reflection-label","Your explanation (saved locally; not automatically graded)");
    label.htmlFor="p01-reflection";
    const area=el("textarea");area.id="p01-reflection";area.rows=5;
    area.placeholder="Explain units, assumptions, a failure mode and any help you used.";
    area.value=options.reflection||"";
    area.addEventListener("input",()=>options.onReflection?.(area.value));
    wrap.append(label,area,paragraph("The app saves your reasoning for review. Neither word count nor passing a code check proves the scientific interpretation is correct."));
    root.append(wrap);
  }
  function returnStatus(root,options){
    if(!options.goal.id.endsWith("-REVIEW"))return;
    const first=options.firstCapstonePass;
    const hours=first?(Date.now()-first)/3600000:null;
    const msg=hours===null?
      "The first successful capstone check has not been recorded. You may practice now, but the return interval cannot be measured.":
      hours<24?
      "The first capstone check was approximately "+Math.max(0,Math.floor(hours))+" hour(s) ago. A return after at least 24 hours is recommended; an earlier attempt is immediate practice.":
      "The first capstone check was "+Math.floor(hours/24)+" day(s) ago. A new successful attempt can be labelled delayed practice, not automatically certified mastery.";
    root.append(paragraph(msg));
  }
  function renderInto(root,options){
    root.replaceChildren();
    const g=options.goal;if(!g)return;
    intro(root,g,options.phase);
    if(options.phase==="learn"&&["P01-G01","P01-CAPSTONE","P02-G01","P02-CAPSTONE","P03-G01","P03-CAPSTONE"].includes(g.id))fluorescence(root,g);
    if(options.phase==="learn"&&g.id.startsWith("I01"))fluorescence(root,g);
    if(g.id.startsWith("P06")){
      const link=el("a","","Local Python and Git verification guide");
      link.href="./docs/P06_LOCAL_HANDOFF.md";link.target="_blank";link.rel="noopener noreferrer";
      root.append(details("Verify P06 on your own computer",[
        paragraph("Python and tests run here. A local virtual environment and Git commit require actual terminal execution and recorded evidence."),
        link
      ]));
    }
    if(options.phase==="prove"){returnStatus(root,options);reflection(root,g,options);}
  }
  window.BioPythonStudioTeaching=Object.freeze({renderInto});
})();