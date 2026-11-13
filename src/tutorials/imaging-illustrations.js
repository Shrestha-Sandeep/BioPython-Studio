// Original scientific array illustrations for I01/I02; no external image values assumed.
"use strict";
(() => {
const NS="http://www.w3.org/2000/svg";
const C={bg:"#101c28",surface:"#1b3040",line:"#476275",text:"#eff7f8",muted:"#bdced6",green:"#72e0bb",blue:"#9bcff3",amber:"#f8d18b",red:"#ffaaa6"};
const descriptors={
I01:{
1:{type:"comparison",headline:"Python list × 2",parts:["Repeated elements","NumPy array × 2","Each value doubles"]},
2:{type:"comparison",headline:"dtype = uint16",parts:["10, 20, 30","Shape: (3,)","12, 22, 32"]},
3:{type:"grid",rows:2,cols:3,base:1,selected:[],caption:"Image: 2 rows × 3 columns (Y, X)"},
4:{type:"grid",rows:2,cols:3,base:1,selected:[3],caption:"[row 1, col 0] selects the fourth value"},
5:{type:"grid",rows:3,cols:4,selected:[9],hide:true,caption:"Predict [2,1] — the selected value is hidden"},
6:{type:"grid",rows:3,cols:4,selected:[9],caption:"Reveal: the value at [2,1] is 9"},
7:{type:"comparison",headline:"Published Witz/HPA PNG",parts:["Source: credited","Format: rendered figure","Raw calibration: absent"]},
9:{type:"rgb",caption:"One row × two columns × three display components"},
10:{type:"rgb",caption:"RGB components are not verified fluorophore channels"},
11:{type:"grid",rows:3,cols:4,selected:[9],caption:"Array [row=2,col=1] ⇔ display (x=1,y=2)"},
12:{type:"comparison",headline:"8-bit colour value",parts:["Allowed: 0 ... 255","Observed: 255","Raw saturation: unknown"]},
13:{type:"comparison",headline:"Honest report",parts:["Source: synthetic RGB","Shape: (1,2,3)","Calibrated raw: False"]}
},
I02:{
1:{type:"grid",rows:4,cols:5,selected:[7,8,9,12,13,14],caption:"The crop uses rows [1:3) and columns [2:5)"},
2:{type:"grid",rows:4,cols:5,selected:[7],caption:"Source [1,2] becomes crop [0,0]"},
3:{type:"comparison",headline:"Slicing shares storage",parts:["Source: 1, 2, 3, 4","View changes first to 99","Saved copy stays at 1"]},
4:{type:"comparison",headline:"Copy protects the source",parts:["Original first: 1","Copied ROI first: 99","No change to source"]},
6:{type:"comparison",headline:"Validate bounds first",parts:["Image rows: 0 ... 3","Requested end: 99","ROI rejected"]},
7:{type:"grid",rows:3,cols:3,selected:[4],hide:true,caption:"Predict: will source [1,1] change?"},
8:{type:"grid",rows:3,cols:3,selected:[4],overrides:{4:"99"},caption:"After view mutation, source [1,1] is 99"},
9:{type:"comparison",headline:"Example scale only",parts:["50 px","0.2 µm / pixel","10.0 µm"]},
10:{type:"comparison",headline:"Area requires squared scale",parts:["50 selected pixels","(0.2 µm/px)²","2.0 µm²"]},
11:{type:"comparison",headline:"Declared axis order",parts:["T=2, C=3, Z=1","Y=4, X=5","Shape alone is not metadata"]},
12:{type:"comparison",headline:"TCZYX plane selection",parts:["Select T1, C2, Z0","Remaining Y and X","Plane shape (4,5)"]},
13:{type:"comparison",headline:"Synthetic TIFF container",parts:["2 × 2 uint16","Tag: synthetic TIFF","OME not validated"]},
14:{type:"comparison",headline:"Traceable ROI report",parts:["Source (5,7)","Crop (3,4), origin (1,2)","Independent memory"]}
},
I03:{
1:{type:"comparison",headline:"Elementwise NumPy transform",parts:["Input: 1,4,9","Apply square root","Result: 1,2,3"]},
2:{type:"comparison",headline:"Broadcast along declared final axis",parts:["Rows × 2 columns","Background (1,2)","Corrected each column"]},
3:{type:"comparison",headline:"Broadcast requires compatible shapes",parts:["Data: 2×3","Background: 2","ValueError"]},
4:{type:"comparison",headline:"Boolean mask and NaN",parts:["0.9 → True","NaN → False","0.5 → False"]},
5:{type:"comparison",headline:"Preserve original data",parts:["Source: 1,9,3","Copy, threshold","Result: 0,9,0"]},
6:{type:"comparison",headline:"Which axis is averaged?",parts:["axis=0 → 5,7,9","axis=1 → 4,10","Pixels ≠ replicates"]},
7:{type:"comparison",headline:"Document the denominator",parts:["Supplied: 3","Finite: 2","Mean: 3.0"]},
8:{type:"comparison",headline:"Predict NaN propagation",parts:["2.0, NaN, 4.0","np.mean(values)","Result: ?"]},
9:{type:"comparison",headline:"Reveal missing-value treatment",parts:["np.mean → nan","np.nanmean → 3.0","Missing policy is explicit"]},
11:{type:"comparison",headline:"Reproducible simulation",parts:["Generator seed: 17","Five simulated values","3,4,0,0,2"]},
12:{type:"comparison",headline:"Avoid uint8 overflow",parts:["uint8 250 + 10","Wraps to 4","Wide integer: 260"]},
13:{type:"grid",rows:2,cols:2,base:1,selected:[2,3],caption:"Mask selects values 3 and 4 — not two specimens"},
14:{type:"comparison",headline:"Synthetic ROI report",parts:["Shape: 2×3","Valid: 5, missing: 1","Mean: 6.0 a.u."]}
},
I04:{
1:{type:"comparison",headline:"Figure → axes → labelled data",parts:["Figure contains axes","X: Field number","Y: synthetic a.u."]},
2:{type:"comparison",headline:"Use truthful axis titles",parts:["X: Field","Y: illustrative a.u.","No raw fluorescence claim"]},
3:{type:"plot",caption:"Connected lines imply ordered change; scatter keeps points separate"},
4:{type:"comparison",headline:"Independent categories",parts:["Control","Treated","Recovery — no line"]},
5:{type:"hist",counts:[0,2,1,1],edges:["0–1","1–2","2–3","3–4"],caption:"4 values distributed across 4 specified bins"},
6:{type:"comparison",headline:"Last bin includes rightmost edge",parts:["[0,2): 2 values","[2,4]: 3 values","Count total: 5"]},
7:{type:"comparison",headline:"A figure can have two panels",parts:["Left: ordered values","Right: distribution","Total axes: 2"]},
8:{type:"contrast",caption:"One numeric array; two display mappings, no inferred detector values"},
9:{type:"comparison",headline:"Predict: did the source change?",parts:["Stored array","Display vmin / vmax","Equal afterward: ?"]},
10:{type:"contrast",caption:"Reveal: source array equality is True after changing display limits"},
12:{type:"hist",counts:[1,3,0],edges:["0–50","50–100","100–150"],caption:"Histogram of four synthetic green RGB display components"},
13:{type:"comparison",headline:"Auditable two-panel example",parts:["Source: synthetic RGB","2 axes, 4 pixels","Array unchanged: True"]}
},
I05:{
1:{type:"comparison",headline:"Declare the background estimator",parts:["Values: 2,3,8,15","25th percentile","Background: 2.75"]},
3:{type:"comparison",headline:"Gaussian smooths a bright impulse",parts:["Center: 9.0","Sigma: 0.5 px","Center after: 5.57"]},
4:{type:"comparison",headline:"Median can remove an isolated spot",parts:["Center before: 9","Median neighborhood","Center after: 0"]},
6:{type:"mask",threshold:4,caption:"Threshold >4 selects four candidate pixels, not four cells"},
7:{type:"mask",threshold:8,caption:"Strict >8 excludes the pixel equal to 8"},
8:{type:"comparison",headline:"Predict a stricter threshold",parts:["Source: 0,2,6,8,10,12","Apply strict >10","How many survive?"]},
9:{type:"mask",threshold:10,caption:"Reveal: strict >10 retains only the pixel 12"},
10:{type:"comparison",headline:"Otsu gives a candidate threshold",parts:["Source: 0,0,2,2,10,10","Otsu cutoff: 2","Candidate pixels: 2"]},
12:{type:"comparison",headline:"Check sensitivity, not one mask",parts:[">4 selects 4",">8 selects 2",">10 selects 1"]},
13:{type:"comparison",headline:"Compare two candidate masks",parts:["Intersection: 2 px","Union: 4 px","IoU: 0.5"]},
14:{type:"comparison",headline:"Document a candidate pixel report",parts:["Background: 3.0","Low/high: 3 / 1","Source preserved"]}
}
,I06:{"1":{"type":"comparison","headline":"One mask, opposing operations","parts":["8 source pixels","Closing: 9 pixels","Opening: 0 pixels"]},"2":{"type":"comparison","headline":"Small features can be eliminated","parts":["10 initial pixels","5 after opening","Isolated pixel lost"]},"3":{"type":"pair","headline":"Four-neighbor labels","left":[[1,0,0],[0,1,0],[0,0,1]],"right":[[1,0,0],[0,2,0],[0,0,3]],"caption":"Three diagonal pixels → three labels"},"4":{"type":"pair","headline":"Eight-neighbor labels","left":[[1,0,0],[0,1,0],[0,0,1]],"right":[[1,0,0],[0,1,0],[0,0,1]],"caption":"Three diagonal pixels → one label"},"5":{"type":"comparison","headline":"Prediction: diagonal connectivity","parts":["Four pixels, diagonal","connectivity = 1","Count = ?"]},"6":{"type":"comparison","headline":"Reveal: same pixels, two rules","parts":["4-neighbor: 4 labels","8-neighbor: 1 label","Input never changed"]},"7":{"type":"comparison","headline":"Area screening","parts":["Candidates: [1,4] px","Keep area ≥ 2 px","Retained: [4] px"]},"8":{"type":"comparison","headline":"Explicit inclusive area range","parts":["Min: 2 pixels","Max: 4 pixels","Exclude one singleton"]},"9":{"type":"pair","headline":"Clear border","left":[[0,1,1,0,0],[0,0,0,0,0],[0,0,1,1,0],[0,0,1,1,0],[0,0,0,0,0]],"right":[[0,0,0,0,0],[0,0,0,0,0],[0,0,1,1,0],[0,0,1,1,0],[0,0,0,0,0]],"caption":"Top-edge component excluded; central square retained"},"10":{"type":"comparison","headline":"One square, two borders","parts":["Full image: 4 px","Cropped image: 0 px","Crop makes a new edge"]},"11":{"type":"pair","headline":"Watershed candidates","left":[[0,1,1,1,0],[0,1,1,1,0],[0,1,1,1,0]],"right":[[0,1,1,2,0],[0,1,1,2,0],[0,1,1,2,0]],"caption":"Illustrative split: two explicit markers, not annotated nuclei"},"12":{"type":"comparison","headline":"Seed sensitivity","parts":["Same 9-pixel mask","One marker supplied","One output label"]},"13":{"type":"comparison","headline":"Projection loses z separation","parts":["Z0: one voxel","Z1: empty, Z2: one","XY maximum: one pixel"]},"14":{"type":"comparison","headline":"Adjacent z voxels connect","parts":["Z0: same XY","Z1: same XY","3D 6-neighbor: one"]},"15":{"type":"comparison","headline":"One function, changed image","parts":["Threshold: >4","Area cutoff: ≥2 px","Source unchanged"]},"16":{"type":"comparison","headline":"Complete rejection audit","parts":["3 initial components","1 small + 1 border","1 kept; verified=False"]}},
I07:{"1":{"type":"rows","headline":"One specimen, two fields","cols":["ID","FIELD","AREA"],"left":[["S01","F01","4"],["S01","F02","7"]],"right":[["S01","F01","4"],["S01","F02","7"]],"caption":"Two field rows do not mean two animals"},"2":{"type":"rows","headline":"Preserve zero-padded IDs","cols":["SPECIMEN","SCORE"],"left":[["0003","5"],["0012","7"]],"right":[["0003","5"],["0012","7"]],"caption":"Text IDs survive CSV when dtype is string"},"4":{"type":"rows","headline":"Filter and retain identity","cols":["FIELD","SCORE"],"left":[["F01","0.8"],["F02","0.3"],["F03","0.9"]],"right":[["F01","0.8"],["F03","0.9"]],"caption":"Keep ≥0.7 without dropping source rows"},"5":{"type":"comparison","headline":"Index labels differ from row positions","parts":["Retained labels: 0,2","iloc[1]: F03","loc[1]: absent"]},"6":{"type":"comparison","headline":"Predict the retained IDs","parts":["Scores: .2,.8,.9,.6","Cutoff: ≥0.8","Which field IDs?"]},"7":{"type":"comparison","headline":"Reveal: retain both ID and score","parts":["F02: 0.8","F03: 0.9","Original: 4 fields"]},"8":{"type":"comparison","headline":"Schema check fails transparently","parts":["Required: specimen_id","Present: field_id,score","Missing: specimen_id"]},"10":{"type":"rows","headline":"Trim whitespace, preserve case","cols":["ID"],"left":[[" N2 "],["mutA "],["muta"]],"right":[["N2"],["mutA"],["muta"]],"caption":"Both spellings of mutA and muta remain distinct"},"11":{"type":"comparison","headline":"Normalization collision","parts":["Raw: ' A' and 'A '","Both normalize to A","Review, do not merge"]},"12":{"type":"rows","headline":"One ID, contradictory conditions","cols":["ID","COND"],"left":[["S01","ctrl"],["S01","heat"],["S02","ctrl"]],"right":[["S01","REVIEW"],["S02","ctrl"]],"caption":"Repeated S01 + conflict; preserve the source"},"14":{"type":"rows","headline":"Missing is not zero","cols":["FIELD","SCORE"],"left":[["F1","0"],["F2","NA"],["F3","2"]],"right":[["F1","ZERO"],["F2","MISSING"],["F3","OBS."]],"caption":"Three different measurement statuses"},"15":{"type":"comparison","headline":"Dropping NA hides missingness","parts":["Before A:2, B:1","After A:1, B:1","One A field vanished"]},"16":{"type":"comparison","headline":"Reproducible QC audit","parts":["Four source rows","S01 conflict + duplicate","F1,F3 missing; no deletion"]}}
,
I08:{"1":{"type":"rows","headline":"Validated join keeps fields","cols":["SPEC","FIELD","AREA"],"left":[["S1","F1","2"],["S1","F2","4"],["S2","F3","6"]],"right":[["S1","F1","ctrl"],["S1","F2","ctrl"],["S2","F3","heat"]],"caption":"3 source fields stay 3 after many-to-one join"},"2":{"type":"comparison","headline":"Metadata key must be unique","parts":["S1 source: 2 fields","S1 metadata: 2 rows","MergeError prevents 4 rows"]},"3":{"type":"rows","headline":"Keep unmatched left rows","cols":["SPEC","FIELD"],"left":[["S1","F1"],["S3","F2"]],"right":[["S1","both"],["S3","left_only"]],"caption":"S3 stays visible rather than being silently dropped"},"4":{"type":"comparison","headline":"Aggregate within specimen","parts":["S1: 2,4 px","S1 mean: 3.0 px","Two specimen IDs"]},"5":{"type":"comparison","headline":"Fields are not replicates","parts":["Five field rows","Two specimen IDs","True n needs design"]},"6":{"type":"rows","headline":"Wide rows become long","cols":["FIELD","GREEN","RED"],"left":[["F1","3","6"],["F2","4","7"]],"right":[["F1","green","3"],["F2","green","4"],["F1","red","6"]],"caption":"Illustrates 3 of 4 long rows; field pairing retained"},"7":{"type":"comparison","headline":"Predict the melt shape","parts":["3 original fields","2 channels each","New row count = ?"]},"8":{"type":"comparison","headline":"Reveal the melt shape","parts":["Six long rows","Three unique fields","No new biological units"]},"9":{"type":"comparison","headline":"Timestamp parsing","parts":["UTC string: valid","'unknown' → NaT","No invented date"]},"10":{"type":"comparison","headline":"Category order is metadata","parts":["baseline","treated","recovery (not time)"]},"11":{"type":"rows","headline":"CSV roundtrip with text IDs","cols":["ID","AREA"],"left":[["0003","4"],["0004","8"]],"right":[["0003","4"],["0004","8"]],"caption":"Explicit string dtype preserves zero-padded IDs"},"13":{"type":"comparison","headline":"Scatter describes points","parts":["One artist","Three synthetic points","No significance claim"]},"14":{"type":"comparison","headline":"Field-level plotting trap","parts":["4 field points","2 specimen summaries","Report actual unit"]},"15":{"type":"comparison","headline":"Label figure scales","parts":["Y: candidate area","Unit: pixel²","Range: 0 to 8"]},"16":{"type":"comparison","headline":"Two genuine export formats","parts":["SVG vector bytes","PNG at 100 DPI","Valid bytes ≠ valid science"]},"17":{"type":"comparison","headline":"Auditable report","parts":["4 fields kept","S3 unmatched, F2 missing","3 specimen summaries"]}}
};
function add(parent,tag,attrs={}){const el=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));parent.append(el);return el;}
function rect(parent,x,y,w,h,fill=C.surface,stroke=C.line){return add(parent,"rect",{x,y,width:w,height:h,rx:8,fill,stroke,"stroke-width":1.5});}
function label(parent,x,y,s,sz=15,color=C.text,weight=600,anchor="middle"){const t=add(parent,"text",{x,y,"font-size":sz,fill:color,"text-anchor":anchor,"font-weight":weight,"font-family":"system-ui,sans-serif"});t.textContent=s;return t;}
function group(parent,index){return add(parent,"g",{"data-bps-part":index});}
function comparison(svg,d){
 label(svg,260,29,d.headline,17,C.blue,740);
 const gap=10,w=154;
 d.parts.forEach((x,i)=>{
  const g=group(svg,i),left=19+i*(w+gap);
  rect(g,left,55,w,65,i===d.parts.length-1?"#1e493d":C.surface,i===d.parts.length-1?C.green:C.line);
  const p=x.length>23?11:x.length>17?12:14;
  label(g,left+w/2,92,x,p,i===2?C.green:C.text);
 });
}
function grid(svg,d){
 const rows=d.rows,cols=d.cols,gap=6,cw=Math.min(103,(466-gap*(cols-1))/cols);
 const ch=Math.min(30,(100-gap*(rows-1))/rows);
 const totalw=cw*cols+gap*(cols-1),left=(520-totalw)/2,top=26;
 for(let r=0;r<rows;r++){
  for(let c=0;c<cols;c++){
   const i=r*cols+c,g=group(svg,i),chosen=d.selected.includes(i),x=left+c*(cw+gap),y=top+r*(ch+gap);
   rect(g,x,y,cw,ch,chosen?"#1a4b40":C.surface,chosen?C.green:C.line);
   label(g,x+cw/2,y+ch/2+5,chosen&&d.hide?"?":String(d.overrides?.[i]??(i+(d.base||0))),14,chosen?C.green:C.text,720);
  }
 }
 label(svg,260,145,d.caption,13,C.muted,480);
 label(svg,30,18,"row ↓",10,C.muted,550,"start");label(svg,490,18,"col →",10,C.muted,550,"end");
}
function rgb(svg,d){
 const samples=[[12,20,30],[90,110,130]];
 for(let i=0;i<2;i++){
   const g=group(svg,i),x=35+i*244;
   label(g,x+104,36,"pixel "+String(i),13,C.muted);
   samples[i].forEach((v,j)=>{const xx=x+j*70;rect(g,xx,53,64,59,j===0?"#482d34":j===1?"#24463b":"#243952",C.line);label(g,xx+32,88,String(v),19,C.text,720);});
 }
 label(svg,260,145,d.caption,13,C.muted,480);
}
function plot(svg,d){
  const xsets=[[60,107,154],[304,351,398]];
  const ys=[96,49,72];
  for(let k=0;k<2;k++){
    const g=group(svg,k),x=k===0?42:286;
    rect(g,x,31,191,101,"#142530",C.line);
    label(g,x+96,46,k===0?"LINE — ORDERED":"SCATTER — INDIVIDUAL",10,C.blue,740);
    add(g,"line",{x1:x+22,y1:109,x2:x+169,y2:109,stroke:C.muted,"stroke-width":1});
    add(g,"line",{x1:x+22,y1:59,x2:x+22,y2:109,stroke:C.muted,"stroke-width":1});
    const pts=xsets[k].map((px,i)=>[px,ys[i]]);
    if(k===0)add(g,"polyline",{points:pts.map(p=>p.join(",")).join(" "),fill:"none",stroke:C.green,"stroke-width":2.5});
    for(const [px,py] of pts)add(g,"circle",{cx:px,cy:py,r:4.6,fill:k===0?C.green:C.blue});
  }
  label(svg,260,151,d.caption,12,C.muted,500);
}
function hist(svg,d){
  const n=d.counts.length,width=380/n,left=72,top=42,height=83,maximum=Math.max(1,...d.counts);
  label(svg,260,26,"COUNT EACH INPUT ONCE",13,C.blue,700);
  const baseline=top+height;
  add(svg,"line",{x1:61,y1:baseline,x2:464,y2:baseline,stroke:C.muted,"stroke-width":1.2});
  d.counts.forEach((count,i)=>{
    const g=group(svg,i),x=left+i*width+8,h=count/maximum*57;
    rect(g,x,baseline-h,width-16,Math.max(1,h),count?C.green:"#203740",C.line);
    label(g,x+(width-16)/2,baseline-h-7,String(count),14,C.text,740);
    label(g,x+(width-16)/2,baseline+15,d.edges[i],11,C.muted,520);
  });
  label(svg,260,158,d.caption,12,C.muted,450);
}
function contrast(svg,d){
 const values=[0,100,150,255];
 const grids=[
   {x:42,min:0,max:255,title:"DISPLAY 0–255"},
   {x:288,min:50,max:200,title:"DISPLAY 50–200"}
 ];
 grids.forEach((cfg,k)=>{
   const g=group(svg,k);
   label(g,cfg.x+85,29,cfg.title,12,C.blue,720);
   values.forEach((v,i)=>{
     const intensity=Math.max(0,Math.min(255,Math.round((v-cfg.min)/(cfg.max-cfg.min)*255)));
     const gray="#"+intensity.toString(16).padStart(2,"0").repeat(3);
     const x=cfg.x+(i%2)*88,y=37+Math.floor(i/2)*47;
     rect(g,x,y,78,41,gray,"#627686");
     label(g,x+39,y+25,String(v),13,intensity>135?"#101c28":"#ffffff",750);
   });
 });
 label(svg,260,151,d.caption,12,C.muted,450);
}
function mask(svg,d){
  const values=[0,2,6,8,10,12];
  const labels=["SOURCE PIXELS","CANDIDATE MASK"];
  [0,1].forEach(k=>{
    const g=group(svg,k),left=k===0?23:280;
    label(g,left+105,27,labels[k],12,C.blue,730);
    values.forEach((v,i)=>{
      const chosen=v>d.threshold;
      const x=left+(i%3)*70,y=38+Math.floor(i/3)*48;
      rect(g,x,y,64,40,k===0?C.surface:chosen?"#1c5146":"#263743",k===1&&chosen?C.green:C.line);
      label(g,x+32,y+25,k===0?String(v):chosen?"1":"0",17,k===1&&chosen?C.green:C.text,740);
    });
  });
  label(svg,260,153,d.caption,12,C.muted,470);
}
function pair(svg,d){
 label(svg,260,23,d.headline,15,C.blue,740);
 const boards=[{x:48,data:d.left,caption:"SOURCE MASK"},{x:305,data:d.right,caption:"LABELS / RESULT"}];
 boards.forEach((board,j)=>{
  const g=group(svg,j),rows=board.data.length,cols=board.data[0].length,side=Math.min(27,110/Math.max(rows,cols));
  label(g,board.x+cols*side/2,37,board.caption,10,C.muted,680);
  board.data.forEach((row,r)=>row.forEach((value,c)=>{
   const x=board.x+c*side,y=44+r*side;
   const palette=["#213240","#276a61","#426da6","#a77639","#7d578d"];
   add(g,"rect",{x,y,width:side-2,height:side-2,rx:3,fill:palette[Math.min(4,value)],stroke:C.line,"stroke-width":0.8});
   label(g,x+(side-2)/2,y+side/2+3,String(value),11,C.text,720);
  }));
 });
 label(svg,260,157,d.caption,11,C.muted,470);
}
function rows(svg,d){
 label(svg,260,21,d.headline,15,C.blue,720);
 const tables=[{x:22,name:"SOURCE RECORDS",data:d.left},{x:285,name:"AFTER / AUDIT",data:d.right}];
 tables.forEach((table,i)=>{
  const g=group(svg,i),cols=d.cols.length,cw=220/cols;
  label(g,table.x+110,36,table.name,10,C.muted,720);
  for(let c=0;c<cols;c++){
   rect(g,table.x+c*cw,43,cw-2,21,"#263f51",C.line);
   label(g,table.x+c*cw+(cw-2)/2,57,d.cols[c],9,C.text,680);
  }
  table.data.slice(0,3).forEach((row,r)=>row.forEach((value,c)=>{
   const x=table.x+c*cw,y=66+r*21;
   rect(g,x,y,cw-2,20,i===1?"#20483f":C.surface,C.line);
   label(g,x+(cw-2)/2,y+14,String(value),10,i===1?C.green:C.text,650);
  }));
 });
 label(svg,260,157,d.caption,11,C.muted,470);
}
const painters={comparison,grid,rgb,plot,hist,contrast,mask,pair,rows};
function render(container,chapter,index){
 container.replaceChildren();
 const d=descriptors[chapter]?.[index];if(!d)return false;
 const svg=add(container,"svg",{viewBox:"0 0 520 165",role:"img",class:"bps-example-illustration","aria-label":"Scientific teaching diagram: "+(d.caption||d.headline)+". Values are illustrative.",focusable:"false"});
 rect(svg,0,0,520,165,C.bg,C.bg);painters[d.type](svg,d);return true;
}
function progress(container,value){
 const svg=container.querySelector("svg");if(!svg)return;
 const nodes=[...svg.querySelectorAll("[data-bps-part]")];if(!nodes.length)return;
 if(value===null||value===undefined){
  svg.classList.remove("bps-is-speaking");
  nodes.forEach(n=>n.classList.remove("bps-is-future","bps-is-current"));return;
 }
 const p=Math.max(0,Math.min(1,Number(value)||0));
 const current=Math.min(nodes.length-1,Math.floor(p*nodes.length));
 svg.classList.add("bps-is-speaking");
 nodes.forEach((n,i)=>{n.classList.toggle("bps-is-future",i>current);n.classList.toggle("bps-is-current",i===current);});
}
window.BioPythonImagingIllustrations=Object.freeze({render,progress,has:(ch,i)=>Boolean(descriptors[ch]?.[i])});
})();