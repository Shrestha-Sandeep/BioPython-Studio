// A00: original editable-free scientific SVG diagrams, synthetic specimen data only.
"use strict";
(()=>{
  const NS="http://www.w3.org/2000/svg";
  const C={bg:"#101c28",panel:"#1d3442",stroke:"#506f80",ink:"#f4f9ff",muted:"#c3d3dd",blue:"#91d0f8",green:"#72dfb4",amber:"#f2d18b",red:"#f8aca5"};
  const DATA=[
    {kind:"route",headline:"FROM RAW FILE TO AUDITABLE BIOLOGY",nodes:["Original CSV","Animal means","Tests + SHA","Reproduce"],caption:"A workflow, not a single calculation"},
    {kind:"split",headline:"TWO EXECUTION CONTEXTS",left:["BROWSER PYODIDE","Browser runtime","Not a desktop install"],right:["DESKTOP PYTHON","Your local interpreter","Must be verified"],caption:"A browser pass cannot certify a desktop project"},
    {kind:"cards",headline:"RECORD THE RUNTIME",cards:[["EXECUTABLE","Exact Python path"],["PREFIX","Runtime environment"],["PACKAGE VERSIONS","Pinned local dependencies"]],caption:"Interpreter identity belongs in the research record"},
    {kind:"route",headline:"REPRODUCIBLE PROJECT ENVIRONMENT",nodes:["venv","pip install","pytest","record identity"],caption:"Commands must be executed locally; tutorial does not run them"},
    {kind:"cards",headline:"FIRST-PASS PATH REJECTION",cards:[["SAFE","fields.csv","good"],["TRAVERSAL","../secret.csv","bad"],["ABSOLUTE","/tmp/raw.csv","bad"]],caption:"POSIX example; resolve local paths before access"},
    {kind:"split",headline:"RESOLVE FIRST, THEN CHECK ROOT",left:["ROOT","/work/raw",""],right:["RESOLVED TARGET","/work/other.csv","OUTSIDE ROOT"],caption:"A sibling path is not contained by the original folder"},
    {kind:"animals",headline:"FIELDS ARE NOT INDEPENDENT ANIMALS",left:["ANIMAL A","3 fields","4, 6, 8"],right:["ANIMAL B","1 field","10"],caption:"4 image rows • 2 animal IDs"},
    {kind:"route",headline:"GROUPING PRESERVES BIOLOGICAL UNITS",nodes:["Field records","Group by ID","Subject mean","n by animal"],caption:"A reusable pure function is easier to validate"},
    {kind:"animals",headline:"PREDICT BEFORE THE CODE REVEALS",left:["ANIMAL A","4, 6, 8","mean = ?"],right:["ANIMAL B","10","mean = ?"],caption:"Biological n = ? • output withheld"},
    {kind:"animals",headline:"REVEAL: GROUPED MEASUREMENT",left:["ANIMAL A","mean = 6.0","3 fields"],right:["ANIMAL B","mean = 10.0","1 field"],caption:"Biological n = 2, not 4"},
    {kind:"cards",headline:"MISSING IS NOT A ZERO SCORE",cards:[["F1 · 0.80","PASS","good"],["F2 · 0.79","LOW","bad"],["F3 · None","MISSING","warn"]],caption:"Boundary equality is included by >= 0.8"},
    {kind:"cards",headline:"TEST CHANGED AND FAILURE CASES",cards:[["EQUALITY","PASS","good"],["BELOW MIN","FAIL","bad"],["MISSING","REJECT","warn"]],caption:"Assertions catch off-by-one and missing-value mistakes"},
    {kind:"split",headline:"CONTENT HASH NOT A FILE LABEL",left:["FILENAME","fields.csv","Not unique"],right:["SOURCE SHA-256","cb0ebabb0aa3","12-char prefix"],caption:"The exact bytes—not the path name—define the digest"},
    {kind:"split",headline:"CANONICAL CONFIGURATION",left:["CONFIG A","z:1, channel:0",""],right:["CONFIG B","channel:0, z:1","SAME DIGEST"],caption:"Sort JSON keys before hashing identical settings"},
    {kind:"route",headline:"A SMALL AUDITABLE REPORT",nodes:["CSV (3 fields)","2 animals","means + digest","Git + tests"],caption:"Synthetic calculation first; real desktop evidence later"},
    {kind:"route",headline:"INDEPENDENT RESEARCH TRANSFER",nodes:["New dataset","Path safety","Biological n","Local replay"],caption:"No completed answer is provided for this task"}
  ];
  const make=(parent,name,attrs={})=>{const e=document.createElementNS(NS,name);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));parent.appendChild(e);return e;};
  const txt=(p,x,y,v,size=13,color=C.ink,weight=550)=>{const t=make(p,"text",{x,y,"text-anchor":"middle","font-family":"system-ui, sans-serif","font-size":size,"font-weight":weight,fill:color});t.textContent=String(v);return t;};
  const rect=(p,x,y,w,h,fill=C.panel,stroke=C.stroke)=>make(p,"rect",{x,y,width:w,height:h,rx:10,fill,stroke,"stroke-width":1.4});
  function lines(p,x,y,value,max=20,size=14,color=C.ink){
    const tokens=String(value).split(" ");const out=[];let part="";
    for(const word of tokens){if(part.length+word.length+1>max&&part){out.push(part);part=word;}else part=(part?part+" ":"")+word;}if(part)out.push(part);
    out.slice(0,3).forEach((str,i)=>txt(p,x,y+i*19,str,size,color));
  }
  function route(svg,d){const nodes=d.nodes,n=nodes.length,w=(494-(n-1)*13)/n;nodes.forEach((str,i)=>{const g=make(svg,"g",{"data-bps-part":i}),x=13+i*(w+13),last=i===n-1;rect(g,x,54,w,79,last?"#254f43":C.panel,last?C.green:C.stroke);lines(g,x+w/2,87,str,13,13,last?C.green:C.ink);if(i<n-1)txt(svg,x+w+6,96,"→",17,C.blue);});}
  function cards(svg,d){d.cards.forEach((card,i)=>{const g=make(svg,"g",{"data-bps-part":i}),x=13+i*169,tone=card[2]==="good"?C.green:card[2]==="bad"?C.red:card[2]==="warn"?C.amber:C.blue;rect(g,x,43,156,108,card[2]==="bad"?"#4b3037":card[2]==="good"?"#22483f":C.panel);txt(g,x+78,69,card[0],11,C.muted);lines(g,x+78,104,card[1],17,15,tone);});}
  function split(svg,d){const halves=[[d.left,14],[d.right,267]];halves.forEach(([v,x],i)=>{const g=make(svg,"g",{"data-bps-part":i});rect(g,x,43,239,108,i?"#22423f":"#243c51",i?C.green:C.blue);txt(g,x+119,70,v[0],13,i?C.green:C.blue);lines(g,x+119,105,v[1],25,15,C.ink);if(v[2])lines(g,x+119,130,v[2],27,12,i?C.amber:C.muted);});}
  function animals(svg,d){const halves=[[d.left,14,310],[d.right,337,168]];halves.forEach(([v,x,w],i)=>{const g=make(svg,"g",{"data-bps-part":i});rect(g,x,43,w,107,i?"#253f59":"#214940",i?C.blue:C.green);txt(g,x+w/2,66,v[0],13,i?C.blue:C.green);lines(g,x+w/2,98,v[1],i?15:28,i?15:17,C.ink);lines(g,x+w/2,127,v[2],i?15:28,15,C.amber);});}
  const painters={route,cards,split,animals};
  function render(container,ch,index){
    container.replaceChildren();if(ch!=="A00"||!DATA[index])return false;
    const d=DATA[index],svg=make(container,"svg",{viewBox:"0 0 520 190",class:"bps-example-illustration",role:"img",focusable:"false","aria-label":"Original A00 reproducible microscopy workflow diagram: "+d.headline+". "+d.caption});
    rect(svg,0,0,520,190,C.bg,C.bg);txt(svg,260,23,d.headline,13,C.blue,700);painters[d.kind](svg,d);
    txt(svg,260,177,d.caption,11,C.muted,450);return true;
  }
  function progress(container,value){
    const svg=container.querySelector("svg");if(!svg)return;
    const nodes=[...svg.querySelectorAll("[data-bps-part]")],current=Math.min(nodes.length-1,Math.floor(Math.max(0,Math.min(1,Number(value)||0))*nodes.length));
    nodes.forEach((e,i)=>{e.classList.toggle("bps-is-future",value!==null&&i>current);e.classList.toggle("bps-is-current",value!==null&&i===current);});
    svg.classList.toggle("bps-is-speaking",value!==null);
  }
  window.BioPythonAdvancedIllustrations=Object.freeze({has:(ch,i)=>ch==="A00"&&Boolean(DATA[i]),render,progress});
})();