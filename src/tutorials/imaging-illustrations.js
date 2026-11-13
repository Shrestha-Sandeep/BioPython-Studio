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
}
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
const painters={comparison,grid,rgb};
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