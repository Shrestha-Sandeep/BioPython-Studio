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

const D03={
0:{kind:"route",nodes:["Animal IDs","Group CV","Class metrics","Probability QC"]},
1:{kind:"folds",groups:["A","B","C","D","E","F"],fold:[3,2,1,3,2,1],caption:"12 fields from six independent animals"},
2:{kind:"folds",groups:["A","B","C","D","E","F"],fold:[3,2,1,3,2,1],caption:"Three folds; all fields of each animal stay together"},
3:{kind:"folds",groups:["A","B","C","D","E","F"],fold:[3,2,1,3,2,1],caption:"Each animal is validation exactly once"},
4:{kind:"overlap",train:["A-1","B-1"],test:["A-2","B-2"],caption:"Two shared animals despite distinct fields"},
5:{kind:"metrics",items:[["Accuracy","3 / 4","0.75"],["Positive recall","0 / 1","0.00"],["Balanced accuracy","(1 + 0)/2","0.50"]],caption:"Always-negative prediction misses every positive"},
6:{kind:"confusion",values:[["TN","1"],["FP","1"],["FN","1"],["TP","1"]],caption:"Count errors by class, not only overall accuracy"},
7:{kind:"metrics",items:[["Precision","1 / (1+1)","0.50"],["Recall","1 / (1+1)","0.50"],["Positive class","label 1","explicit"]],caption:"Predicted positives ≠ actual positives"},
8:{kind:"metrics",items:[["Positive subjects","0","absent"],["Recall","0 / 0","0 by policy"],["Precision","0 / 0","0 by policy"]],caption:"zero_division=0 is a reporting choice"},
9:{kind:"brier",truth:["0","1"],prob:["0.2","0.8"],error:["0.04","0.04"],score:"0.040",caption:"Average squared positive-class probability error"},
10:{kind:"brier",truth:["0","1"],prob:["0.2","0.8"],error:["threshold 0","threshold 1"],score:"hard classes 0,1",caption:"Thresholding loses probability confidence"},
11:{kind:"brier",truth:["0","1"],prob:["0.1","0.6"],error:["?","?"],score:"?",caption:"Predict mean squared error before Reveal"},
12:{kind:"brier",truth:["0","1"],prob:["0.1","0.6"],error:["0.01","0.16"],score:"0.085",caption:"(0.01 + 0.16) / 2 = 0.085"},
13:{kind:"metrics",items:[["Mean probability","0.50","matches rate"],["True positive rate","0.50","matches mean"],["Brier error","0.41","high"]],caption:"Matching means alone does not prove calibration"},
14:{kind:"bins",caption:"Two cases per bin cannot establish calibration"},
15:{kind:"folds",groups:["A","B","C","D","E","F"],fold:[3,2,1,3,2,1],caption:"Group disjointness checked for every fold"},
16:{kind:"metrics",items:[["Logistic folds","0.75,1,0.75","synthetic"],["Dummy folds","0.50 each","synthetic"],["Biological n","6 animals","very small"]],caption:"The model is fitted anew on training groups only"},
17:{kind:"metrics",items:[["Biological animals","6","n=6"],["Microscopy fields","12","dependent"],["CV folds","3","not replicates"]],caption:"Do not report fields as biological n"},
18:{kind:"metrics",items:[["Group leakage","0","checked"],["Validation fields","12","once each"],["Logistic vs dummy","3 folds","source-safe"]],caption:"An auditable synthetic result, not real validation"},
19:{kind:"route",nodes:["New subjects","Grouped folds","Class metrics","Brier + audit"]}
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

function folds(svg,d){text(svg,260,23,"GROUPED VALIDATION: BIOLOGICAL SUBJECTS",13,C.blue);d.groups.forEach((id,i)=>{const p=g(svg,i),x=19+i*84,fold=d.fold[i];rect(p,x,45,77,102,fold===1?"#214c42":fold===2?"#32465d":"#5a432f",fold===1?C.ok:fold===2?C.blue:C.warn);text(p,x+38,72,"ANIMAL "+id,11,C.ink);text(p,x+38,108,"Fold "+fold,15,fold===1?C.ok:fold===2?C.blue:C.warn);text(p,x+38,134,"2 fields",11,C.muted);});text(svg,260,181,d.caption,12,C.muted);}
function metrics(svg,d){text(svg,260,23,"CLASS-AWARE EVALUATION",13,C.blue);d.items.forEach(([name,value,out],i)=>{const p=g(svg,i),y=36+i*43;rect(p,15,y,490,39,i===2?"#244e43":C.panel,i===2?C.ok:C.line);text(p,100,y+26,name,name.length>15?11:13,C.muted);text(p,271,y+26,value,value.length>13?12:16,C.ink);text(p,435,y+26,out,out.length>11?11:15,i===2?C.ok:C.blue);});text(svg,260,180,d.caption,11,C.muted);}
function confusion(svg,d){text(svg,260,22,"CONFUSION: TRUE CLASS × PREDICTED CLASS",13,C.blue);const cols=[["TN","true 0 → pred 0"],["FP","true 0 → pred 1"],["FN","true 1 → pred 0"],["TP","true 1 → pred 1"]];cols.forEach(([tag,desc],i)=>{const p=g(svg,i),x=82+(i%2)*193,y=36+Math.floor(i/2)*64;rect(p,x,y,177,57,tag==="FP"||tag==="FN"?"#5d3538":"#224b41",tag==="FP"||tag==="FN"?C.bad:C.ok);text(p,x+87,y+24,tag+" = "+d.values[i][1],18,tag==="FP"||tag==="FN"?C.bad:C.ok);text(p,x+87,y+45,desc,11,C.muted);});text(svg,260,184,d.caption,11,C.muted);}
function brier(svg,d){text(svg,260,23,"BINARY PROBABILITY ERRORS",14,C.blue);for(let i=0;i<2;i++){const p=g(svg,i),x=25+i*246;rect(p,x,39,226,108,C.panel);text(p,x+113,64,"True label "+d.truth[i],16,C.ink);text(p,x+113,91,"p(positive) "+d.prob[i],17,C.blue);text(p,x+113,123,"Squared error "+d.error[i],d.error[i].length>15?12:16,d.error[i]==="?"?C.warn:C.ok);}text(svg,260,165,"BRIER LOSS: "+d.score,18,d.score==="?"?C.warn:C.ok);text(svg,260,184,d.caption,11,C.muted);}
function bins(svg,d){text(svg,260,24,"ILLUSTRATIVE RELIABILITY BINS (n=2 EACH)",12,C.blue);const z=[["Low-score bin","0.20 predicted","0.50 observed"],["High-score bin","0.80 predicted","0.50 observed"]];z.forEach(([name,pred,actual],i)=>{const p=g(svg,i),x=28+i*246;rect(p,x,42,218,112,i===0?"#2a4660":"#244e42");text(p,x+109,67,name,14,C.ink);text(p,x+109,102,pred,17,C.blue);text(p,x+109,133,actual,17,C.warn);});text(svg,260,182,d.caption,12,C.muted);}
const painters={route,subjects,overlap,impute,baseline,line,probability,tree,folds,metrics,confusion,brier,bins};
function render(container,ch,index){container.replaceChildren();const d=ch==="L01"?D[index]:ch==="L02"?D02[index]:ch==="L03"?D03[index]:null;if(!d)return false;const svg=add(container,"svg",{viewBox:"0 0 520 190",role:"img","aria-label":"Original synthetic-animal machine-learning diagram: "+(d.caption||d.kind),class:"bps-example-illustration",focusable:"false"});rect(svg,0,0,520,190,C.bg,C.bg);painters[d.kind](svg,d);return true;}
function progress(container,value){const svg=container.querySelector("svg");if(!svg)return;const nodes=[...svg.querySelectorAll("[data-bps-part]")];for(const [i,n] of nodes.entries()){const active=value!=null;const current=Math.min(nodes.length-1,Math.floor(Math.max(0,Math.min(1,Number(value)||0))*nodes.length));n.classList.toggle("bps-is-future",active&&i>current);n.classList.toggle("bps-is-current",active&&i===current);}svg.classList.toggle("bps-is-speaking",value!=null);}
window.BioPythonMLIllustrations=Object.freeze({has:(ch,i)=>Boolean(ch==="L01"?D[i]:ch==="L02"?D02[i]:ch==="L03"?D03[i]:false),render,progress});
})();
