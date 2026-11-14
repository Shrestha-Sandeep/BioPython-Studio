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

  const DATA01=[
    {kind:"route",headline:"FROM ORIGINAL TIFF TO AUDITABLE PLANE",nodes:["TIFF bytes","T / C / Z","Native YX","Hash + report"],caption:"Scientific identity depends on source and correct axis selection"},
    {kind:"axis",headline:"FIVE NAMED DIMENSIONS",axes:[["T",2],["C",3],["Z",2],["Y",2],["X",3]],caption:"Shape (2,3,2,2,3) is not meaningful without TCZYX"},
    {kind:"pixels",headline:"EXPLICIT PLANE T1 C2 Z0",values:[60,61,62,63,64,65],selected:[0,5],caption:"The YX plane is 2 rows × 3 columns"},
    {kind:"axis",headline:"SELECT BY AXIS NAME, NOT BY GUESS",axes:[["T",1],["C",2],["Z",0],["Y","all"],["X","all"]],caption:"After selection, Y and X remain spatial axes"},
    {kind:"cards",headline:"CHANNEL INDICES MUST BE VALID",cards:[["CHANNEL 0","Valid","good"],["CHANNEL 2","Valid","good"],["CHANNEL 3","Reject","bad"]],caption:"The stack has only C0, C1, C2"},
    {kind:"split",headline:"A BIT-DEPTH CONVERSION CAN LOSE DATA",left:["UINT16 PIXEL","40000","original"],right:["CAST UINT8","64","different value"],caption:"Display convenience must not change scientific measurements"},
    {kind:"split",headline:"UNSIGNED BACKGROUND SUBTRACTION",left:["MATHEMATICAL","100 − 200 = −100",""],right:["UINT16 RESULT","65436","WRAPPED"],caption:"Type overflow creates a false bright value"},
    {kind:"split",headline:"CAST BEFORE SUBTRACTING",left:["ORIGINAL UINT16","100, 1000","unchanged"],right:["CORRECTED FLOAT","0.0, 800.0","document floor"],caption:"Safe arithmetic preserves original source values"},
    {kind:"pixels",headline:"PREDICT A STRICT THRESHOLD",values:[120,1100,50000],selected:[],caption:"How many values are >1000? Count withheld"},
    {kind:"pixels",headline:"REVEAL THE THRESHOLD HITS",values:[120,1100,50000],selected:[1,2],caption:"Exactly 2 native pixels pass >1000"},
    {kind:"split",headline:"PIXEL VALUES VERSUS DISPLAY LUT",left:["NATIVE PIXEL","50000","source intact"],right:["DISPLAY VALUE","1.0","clipped preview"],caption:"Brightness rendering is not native intensity"},
    {kind:"cards",headline:"OME SIZE IS A DECLARATION",cards:[["OME SCALE","0.2 µm/px","warn"],["VERIFICATION","Not provided","bad"],["AREA OUTPUT","Unknown","warn"]],caption:"Do not report µm² without independent scale validation"},
    {kind:"split",headline:"SQUARED PIXEL SCALE FOR AREA",left:["AREA","25 pixels²",""],right:["VERIFIED AREA","1.0 µm²","0.2 µm/px"],caption:"Correct geometry does not verify the object mask"},
    {kind:"pixels",headline:"REAL TIFF ENCODE AND DECODE",values:[100,40000,500,65535],selected:[1,3],caption:"Synthetic 2 × 2 uint16 TIFF, actual decoded bytes"},
    {kind:"split",headline:"SOURCE BYTES REMAIN THE SAME",left:["SHA BEFORE READ","64 hex chars",""],right:["SHA AFTER READ","Equal hash","same bytes"],caption:"Fingerprint the original TIFF, not an exported preview"},
    {kind:"route",headline:"A SMALL SOURCE-AWARE AUDIT",nodes:["Native uint16","YX (2×2)","2 candidate px","scale unknown"],caption:"A candidate pixel is not a biological object"},
    {kind:"route",headline:"INDEPENDENT NATIVE IMAGE TRANSFER",nodes:["New TIFF","New T/C/Z","Source hash","Human review"],caption:"No solved answers for new data or delayed review"}
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

  function axis(svg,d){const n=d.axes.length;d.axes.forEach(([name,length],i)=>{const g=make(svg,"g",{"data-bps-part":i}),x=20+i*100,active=name==="Y"||name==="X";rect(g,x,42,91,110,active?"#215348":C.panel,active?C.green:C.stroke);txt(g,x+45,70,name,19,active?C.green:C.blue,700);lines(g,x+45,110,String(length),8,21,C.ink);});}
  function pixels(svg,d){const vals=d.values,n=vals.length,cols=n===4?2:3,rows=Math.ceil(n/cols),w=100,h=rows===1?98:48,x0=260-cols*w/2,y0=rows===1?46:43;vals.forEach((value,i)=>{const g=make(svg,"g",{"data-bps-part":i}),x=x0+(i%cols)*w,y=y0+Math.floor(i/cols)*h,yes=d.selected.includes(i);rect(g,x+3,y+2,w-6,h-4,yes?"#225145":C.panel,yes?C.green:C.stroke);txt(g,x+w/2,y+h/2+6,String(value),16,yes?C.green:C.ink,700);});}
  const painters={route,cards,split,animals,axis,pixels};
  function render(container,ch,index){
    container.replaceChildren();const catalogue=ch==="A00"?DATA:ch==="A01"?DATA01:null;if(!catalogue||!catalogue[index])return false;
    const d=catalogue[index],svg=make(container,"svg",{viewBox:"0 0 520 190",class:"bps-example-illustration",role:"img",focusable:"false","aria-label":"Original "+ch+" scientific microscopy source audit diagram: "+d.headline+". "+d.caption});
    rect(svg,0,0,520,190,C.bg,C.bg);txt(svg,260,23,d.headline,13,C.blue,700);painters[d.kind](svg,d);
    txt(svg,260,177,d.caption,11,C.muted,450);return true;
  }
  function progress(container,value){
    const svg=container.querySelector("svg");if(!svg)return;
    const nodes=[...svg.querySelectorAll("[data-bps-part]")],current=Math.min(nodes.length-1,Math.floor(Math.max(0,Math.min(1,Number(value)||0))*nodes.length));
    nodes.forEach((e,i)=>{e.classList.toggle("bps-is-future",value!==null&&i>current);e.classList.toggle("bps-is-current",value!==null&&i===current);});
    svg.classList.toggle("bps-is-speaking",value!==null);
  }
  window.BioPythonAdvancedIllustrations=Object.freeze({has:(ch,i)=>Boolean(ch==="A00"?DATA[i]:ch==="A01"?DATA01[i]:false),render,progress});
})();