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

const D02={
0:{kind:"route",nodes:["Train labels","Dummy baseline","Real model","Held-out test"]},
1:{kind:"baseline",items:[["Training y","0,0,0,1"],["Most frequent","0"],["Test predictions","0,0"]],caption:"DummyClassifier ignores feature magnitudes"},
2:{kind:"baseline",items:[["Training class 0","9 subjects"],["Training class 1","1 subject"],["Training majority","90%"]],caption:"Accuracy alone can hide zero minority recall"},
3:{kind:"baseline",items:[["Training majority","75%"],["Held-out labels","0,1"],["Dummy held-out","50%"]],caption:"Training class balance is not test performance"},
4:{kind:"baseline",items:[["Training majority","0"],["Test truth","0,1"],["Predictions","?"]],caption:"Predict held-out dummy accuracy before reveal"},
5:{kind:"baseline",items:[["Dummy predicts","0,0"],["Test truth","0,1"],["Accuracy","1/2 = 0.5"]],caption:"Only one of two held-out labels is correct"},
6:{kind:"line",xvals:[0,1,2,3],yvals:[1,3,5,7],label:"y = 2 × x + 1",caption:"Slope 2; test x=3 predicts y=7"},
7:{kind:"line",xvals:[0,1,2,10],yvals:[1,3,5,21],label:"x=10 beyond train 0–2",caption:"Numerical extrapolation does not validate a physical model"},
8:{kind:"line",xvals:[0,1,2,1.5],yvals:[1,3,5,4.2],label:"Observed 4.2; predicted 4.0",caption:"Residual of a new synthetic observation is 0.2"},
9:{kind:"route",nodes:["Train only","StandardScaler","Logistic fit","Predict test"]},
10:{kind:"probability",p:0.7,caption:"Rounded positive-class score ≈ 0.7, not verified calibration"},
11:{kind:"baseline",items:[["C = 0.1","strong penalty"],["C = 100","weak penalty"],["Weight size","small C smaller"]],caption:"C inversely controls regularization strength"},
12:{kind:"probability",p:0.7,caption:"Two model class scores sum to 1; calibration untested"},
13:{kind:"tree",left:"x < 1.5",yes:"predict 0",no:"predict 1",caption:"A depth-1 tree learns one boundary from training"},
14:{kind:"baseline",items:[["Held-out samples","2"],["Shallow tree","2/2 = 1.0"],["Dummy","1/2 = 0.5"]],caption:"One perfect synthetic test cannot establish generalization"},
15:{kind:"tree",left:"max_depth",yes:"1 or 2",no:"never tune on test",caption:"Choose model complexity using training validation only"},
16:{kind:"baseline",items:[["Dummy held-out","0.5"],["Logistic held-out","1.0"],["Independent n","2 synthetic"]],caption:"Same train/test inputs; neither score is externally valid"},
17:{kind:"route",nodes:["New data","Dummy baseline","Compare models","Audit groups"]}
};
function add(p,tag,a={}){const e=document.createElementNS(NS,tag);Object.entries(a).forEach(([k,v])=>e.setAttribute(k,String(v)));p.append(e);return e;}
function rect(p,x,y,w,h,fill=C.panel,stroke=C.line){return add(p,"rect",{x,y,width:w,height:h,rx:8,fill,stroke,"stroke-width":1.3});}
function text(p,x,y,s,size=15,fill=C.ink){const e=add(p,"text",{x,y,fill,"font-size":size,"font-weight":630,"text-anchor":"middle","font-family":"system-ui,sans-serif"});e.textContent=s;return e;}
function g(p,i){return add(p,"g",{"data-bps-part":i});}
function route(svg,d){text(svg,260,29,"GROUPING → LEAK-SAFE LEARNING",14,C.blue);d.nodes.forEach((v,i)=>{const p=g(svg,i),x=14+i*127;rect(p,x,58,112,72,i===3?"#214f42":C.panel,i===3?C.ok:C.line);text(p,x+56,98,v,v.length>12?11:13,i===3?C.ok:C.ink);if(i<3)text(svg,x+120,98,"›",23,C.ok);});text(svg,260,177,"Source IDs and held-out animals remain traceable",12,C.muted);}
function subjects(svg,d){text(svg,260,22,"ONE ANIMAL MAY CONTRIBUTE MULTIPLE FIELDS",13,C.blue);const a=d.animals,w=(480-(a.length-1)*10)/a.length;a.forEach(([id,fields,label],i)=>{const p=g(svg,i),x=20+i*(w+10),bad=label.includes("+");rect(p,x,42,w,112,bad?"#60353b":"#213f47",bad?C.bad:C.line);text(p,x+w/2,68,"ANIMAL "+id,15,bad?C.bad:C.blue);text(p,x+w/2,100,fields,fields.length>12?11:15,C.ink);text(p,x+w/2,132,"label "+label,13,bad?C.bad:C.ok);});text(svg,260,180,d.caption,12,C.muted);}
function overlap(svg,d){text(svg,260,23,"SOURCE GROUPS MUST BE DISJOINT",14,C.blue);const sets=[["TRAIN",d.train,22],["HELD-OUT",d.test,284]];sets.forEach(([lab,items,x],k)=>{text(svg,x+106,43,lab,12,C.muted);items.forEach((v,i)=>{const p=g(svg,k*4+i),y=53+i*49,short=v.split("-")[0],shared=d.train.some(t=>t.split("-")[0]===short)&&d.test.some(t=>t.split("-")[0]===short);rect(p,x,y,218,43,shared?"#5c3439":"#244a41",shared?C.bad:C.ok);text(p,x+109,y+27,v,19,shared?C.bad:C.ok);});});text(svg,260,181,d.caption,11,C.muted);}
function impute(svg,d){text(svg,260,22,"FIT ONLY ON TRAINING ANIMALS",14,C.blue);text(svg,144,43,"TRAIN VALUES",12,C.muted);text(svg,403,43,"TEST (RESERVED)",12,C.muted);d.train.forEach((v,i)=>{const p=g(svg,i),x=30+i*74,missing=v==="NaN";rect(p,x,58,67,57,missing?"#5c482c":"#24463e",missing?C.warn:C.ok);text(p,x+33,93,v,20,missing?C.warn:C.ink);});d.test.forEach((v,i)=>{const p=g(svg,i+4),x=360+i*83;rect(p,x,58,93,57,"#56412e",C.warn);text(p,x+45,93,v,23,C.warn);});text(svg,260,146,"TRAIN MEDIAN: "+d.median,18,d.median==="?"?C.warn:C.ok);text(svg,260,181,d.caption,12,C.muted);}

function baseline(svg,d){text(svg,260,25,"TRANSPARENT TRAINING-ONLY BASELINE",13,C.blue);d.items.forEach(([title,value],i)=>{const p=g(svg,i),y=37+i*44;rect(p,20,y,480,39,i===2?"#214a42":C.panel,i===2?C.ok:C.line);text(p,135,y+25,title,14,C.muted);text(p,374,y+25,value,value.length>16?13:17,i===2?C.ok:C.ink);});text(svg,260,181,d.caption,12,C.muted);}
function line(svg,d){text(svg,260,22,"LINEAR RESPONSE — SYNTHETIC",13,C.blue);rect(svg,30,38,460,119,C.panel);add(svg,"line",{x1:71,y1:136,x2:460,y2:136,stroke:C.muted,"stroke-width":1.5});add(svg,"line",{x1:71,y1:136,x2:71,y2:50,stroke:C.muted,"stroke-width":1.5});const xmax=Math.max(...d.xvals),ymax=Math.max(...d.yvals),px=x=>71+370*x/xmax,py=y=>132-75*y/ymax;const orig=d.xvals.slice(0,3).map((x,i)=>[px(x),py(d.yvals[i])]);add(svg,"polyline",{points:orig.map(x=>x.join(",")).join(" "),fill:"none",stroke:C.blue,"stroke-width":3});orig.forEach(([x,y],i)=>{const p=g(svg,i);add(p,"circle",{cx:x,cy:y,r:5,fill:C.ok});});const k=d.xvals.length-1,ex=px(d.xvals[k]),ey=py(d.yvals[k]);const p=g(svg,k);add(p,"circle",{cx:ex,cy:ey,r:6,fill:C.warn});text(svg,260,162,d.label,14,C.warn);text(svg,260,184,d.caption,11,C.muted);}
function probability(svg,d){text(svg,260,24,"BINARY MODEL OUTPUT (NOT CALIBRATION)",13,C.blue);rect(svg,43,57,434,61,"#313e55");rect(svg,43,57,434*(1-d.p),61,"#46516d");rect(svg,43+434*(1-d.p),57,434*d.p,61,"#205847");text(svg,130,94,"CLASS 0",15,C.ink);text(svg,370,94,"CLASS 1",15,C.ink);text(svg,260,151,"p(class 1) ≈ "+d.p.toFixed(1),19,C.ok);text(svg,260,180,d.caption,12,C.muted);}
function tree(svg,d){text(svg,260,22,"TRAINED DECISION RULE",13,C.blue);const root=g(svg,0);rect(root,181,37,158,48);text(root,260,67,d.left,18,C.blue);add(svg,"line",{x1:226,y1:85,x2:136,y2:119,stroke:C.muted,"stroke-width":2});add(svg,"line",{x1:294,y1:85,x2:384,y2:119,stroke:C.muted,"stroke-width":2});const l=g(svg,1),r=g(svg,2);rect(l,42,117,187,50,"#255041",C.ok);rect(r,292,117,187,50,"#4d422e",C.warn);text(l,136,146,d.yes,17,C.ok);text(r,384,146,d.no,17,C.warn);text(svg,260,183,d.caption,11,C.muted);}
const painters={route,subjects,overlap,impute,baseline,line,probability,tree};
function render(container,ch,index){container.replaceChildren();const d=ch==="L01"?D[index]:ch==="L02"?D02[index]:null;if(!d)return false;const svg=add(container,"svg",{viewBox:"0 0 520 190",role:"img","aria-label":"Original synthetic-animal machine-learning diagram: "+(d.caption||d.kind),class:"bps-example-illustration",focusable:"false"});rect(svg,0,0,520,190,C.bg,C.bg);painters[d.kind](svg,d);return true;}
function progress(container,value){const svg=container.querySelector("svg");if(!svg)return;const nodes=[...svg.querySelectorAll("[data-bps-part]")];for(const [i,n] of nodes.entries()){const active=value!=null;const current=Math.min(nodes.length-1,Math.floor(Math.max(0,Math.min(1,Number(value)||0))*nodes.length));n.classList.toggle("bps-is-future",active&&i>current);n.classList.toggle("bps-is-current",active&&i===current);}svg.classList.toggle("bps-is-speaking",value!=null);}
window.BioPythonMLIllustrations=Object.freeze({has:(ch,i)=>Boolean(ch==="L01"?D[i]:ch==="L02"?D02[i]:false),render,progress});
})();
