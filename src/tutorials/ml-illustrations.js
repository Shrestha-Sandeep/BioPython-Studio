// Original, local synthetic-animal ML diagrams. No real microscopy measurements.
"use strict";
(()=>{
const NS="http://www.w3.org/2000/svg";
const C={bg:"#101c28",panel:"#213744",line:"#547182",ink:"#f5fbff",muted:"#c3d6df",ok:"#7de4c5",blue:"#9ed9f6",warn:"#f6d18d",bad:"#ffaaa6"};
const D={
0:{kind:"route",nodes:["Animal fields","Group by ID","Hold out","Fit on train"]},
1:{kind:"subjects",animals:[["A","2 fields","0"],["B","2 fields","1"]],caption:"4 microscope fields, 2 independent animals"},
2:{kind:"subjects",animals:[["A","2 fields","0"],["B","1 field","1"],["C","1 field","1"]],caption:"Classes count animals, not image fields"},
3:{kind:"subjects",animals:[["A","two labels","0 + 1"],["B","1 field","1"]],caption:"Conflicting animal label is an input-QC error"},
4:{kind:"overlap",train:["A","B"],test:["B","C"],caption:"Animal B appears in train and test"},
5:{kind:"overlap",train:["A-1","B-1"],test:["A-2","C-1"],caption:"Different fields A-1 and A-2 share one animal"},
6:{kind:"overlap",train:["A","B"],test:["C","D"],caption:"Hold out whole animals: train ∩ test = ∅"},
7:{kind:"overlap",train:["A","B"],test:["C","D"],caption:"GroupShuffleSplit: 4 fields train and 4 test"},
8:{kind:"overlap",train:["A-1","B-1"],test:["A-2","B-2"],caption:"A fixed random seed cannot fix shared groups"},
9:{kind:"subjects",animals:[["A","3 fields","group"],["B","1 field","group"],["C","1 field","group"],["D","1 field","group"]],caption:"Half of 4 groups held out, not half of image rows"},
10:{kind:"impute",train:["1","3","NaN"],test:["100"],median:"2.0",caption:"Training observed values define the median"},
11:{kind:"impute",train:["1","3","NaN"],test:["100"],median:"?",caption:"Predict the median without using test 100"},
12:{kind:"impute",train:["1","3","NaN"],test:["100"],median:"2.0",caption:"Train-only median is 2, not 3"},
13:{kind:"impute",train:["1","3","NaN"],test:["100"],median:"2.0 train / 3.0 leaked",caption:"Including test in fit changes the median"},
14:{kind:"route",nodes:["Train only","Impute median","Scale train","Transform test"]},
15:{kind:"overlap",train:["A","B"],test:["C","D"],caption:"Group overlap 0; train-only imputer median 2.5"},
16:{kind:"route",nodes:["Audit animals","Disjoint split","Fit training","Verify transfer"]}
};
function add(p,tag,a={}){const e=document.createElementNS(NS,tag);Object.entries(a).forEach(([k,v])=>e.setAttribute(k,String(v)));p.append(e);return e;}
function rect(p,x,y,w,h,fill=C.panel,stroke=C.line){return add(p,"rect",{x,y,width:w,height:h,rx:8,fill,stroke,"stroke-width":1.3});}
function text(p,x,y,s,size=15,fill=C.ink){const e=add(p,"text",{x,y,fill,"font-size":size,"font-weight":630,"text-anchor":"middle","font-family":"system-ui,sans-serif"});e.textContent=s;return e;}
function g(p,i){return add(p,"g",{"data-bps-part":i});}
function route(svg,d){text(svg,260,29,"GROUPING → LEAK-SAFE LEARNING",14,C.blue);d.nodes.forEach((v,i)=>{const p=g(svg,i),x=14+i*127;rect(p,x,58,112,72,i===3?"#214f42":C.panel,i===3?C.ok:C.line);text(p,x+56,98,v,v.length>12?11:13,i===3?C.ok:C.ink);if(i<3)text(svg,x+120,98,"›",23,C.ok);});text(svg,260,177,"Source IDs and held-out animals remain traceable",12,C.muted);}
function subjects(svg,d){text(svg,260,22,"ONE ANIMAL MAY CONTRIBUTE MULTIPLE FIELDS",13,C.blue);const a=d.animals,w=(480-(a.length-1)*10)/a.length;a.forEach(([id,fields,label],i)=>{const p=g(svg,i),x=20+i*(w+10),bad=label.includes("+");rect(p,x,42,w,112,bad?"#60353b":"#213f47",bad?C.bad:C.line);text(p,x+w/2,68,"ANIMAL "+id,15,bad?C.bad:C.blue);text(p,x+w/2,100,fields,fields.length>12?11:15,C.ink);text(p,x+w/2,132,"label "+label,13,bad?C.bad:C.ok);});text(svg,260,180,d.caption,12,C.muted);}
function overlap(svg,d){text(svg,260,23,"SOURCE GROUPS MUST BE DISJOINT",14,C.blue);const sets=[["TRAIN",d.train,22],["HELD-OUT",d.test,284]];sets.forEach(([lab,items,x],k)=>{text(svg,x+106,43,lab,12,C.muted);items.forEach((v,i)=>{const p=g(svg,k*4+i),y=53+i*49,short=v.split("-")[0],shared=d.train.some(t=>t.split("-")[0]===short)&&d.test.some(t=>t.split("-")[0]===short);rect(p,x,y,218,43,shared?"#5c3439":"#244a41",shared?C.bad:C.ok);text(p,x+109,y+27,v,19,shared?C.bad:C.ok);});});text(svg,260,181,d.caption,11,C.muted);}
function impute(svg,d){text(svg,260,22,"FIT ONLY ON TRAINING ANIMALS",14,C.blue);text(svg,144,43,"TRAIN VALUES",12,C.muted);text(svg,403,43,"TEST (RESERVED)",12,C.muted);d.train.forEach((v,i)=>{const p=g(svg,i),x=30+i*74,missing=v==="NaN";rect(p,x,58,67,57,missing?"#5c482c":"#24463e",missing?C.warn:C.ok);text(p,x+33,93,v,20,missing?C.warn:C.ink);});d.test.forEach((v,i)=>{const p=g(svg,i+4),x=360+i*83;rect(p,x,58,93,57,"#56412e",C.warn);text(p,x+45,93,v,23,C.warn);});text(svg,260,146,"TRAIN MEDIAN: "+d.median,18,d.median==="?"?C.warn:C.ok);text(svg,260,181,d.caption,12,C.muted);}
const painters={route,subjects,overlap,impute};
function render(container,ch,index){container.replaceChildren();const d=ch==="L01"?D[index]:null;if(!d)return false;const svg=add(container,"svg",{viewBox:"0 0 520 190",role:"img","aria-label":"Original synthetic-animal machine-learning diagram: "+(d.caption||d.kind),class:"bps-example-illustration",focusable:"false"});rect(svg,0,0,520,190,C.bg,C.bg);painters[d.kind](svg,d);return true;}
function progress(container,value){const svg=container.querySelector("svg");if(!svg)return;const nodes=[...svg.querySelectorAll("[data-bps-part]")];for(const [i,n] of nodes.entries()){const active=value!=null;const current=Math.min(nodes.length-1,Math.floor(Math.max(0,Math.min(1,Number(value)||0))*nodes.length));n.classList.toggle("bps-is-future",active&&i>current);n.classList.toggle("bps-is-current",active&&i===current);}svg.classList.toggle("bps-is-speaking",value!=null);}
window.BioPythonMLIllustrations=Object.freeze({has:(ch,i)=>ch==="L01"&&Boolean(D[i]),render,progress});
})();
