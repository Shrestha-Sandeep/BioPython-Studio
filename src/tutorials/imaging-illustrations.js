// Original scientific array illustrations for I01/I02; no external image values assumed.
"use strict";
(() => {
const NS="http://www.w3.org/2000/svg";
const C={bg:"#101c28",surface:"#1b3040",line:"#476275",text:"#eff7f8",muted:"#bdced6",green:"#72e0bb",blue:"#9bcff3",amber:"#f8d18b",red:"#ffaaa6"};
const descriptors={
I01:{
1:{type:"comparison",headline:"Python list × 2",parts:["Repeated elements","NumPy array × 2","Each value doubles"]},
2:{type:"comparison",headline:"dtype = uint16",parts:["10, 20, 30","Shape: (3,)","12, 22, 32"]},
3:{type:"grid",rows:2,cols:3,selected:[],caption:"Image: 2 rows × 3 columns (Y, X)"},
4:{type:"grid",rows:2,cols:3,selected:[3],caption:"[row 1, col 0] selects the fourth value"},
5:{type:"grid",rows:3,cols:4,selected:[9],hide:true,caption:"Predict [2,1] — the selected value is hidden"},
6:{type:"grid",rows:3,cols:4,selected:[9],caption:"Reveal: the value at [2,1] is 9"},
7:{type:"comparison",headline:"Published Witz/HPA PNG",parts:["Source: credited","Format: rendered figure","Raw calibration: absent"]},
9:{type:"rgb",caption:"One row × two columns × three display components"},
10:{type:"rgb",caption:"RGB components are not verified fluorophore channels"},
11:{type:"grid",rows:3,cols:4,selected:[9],caption:"Array [row=2,col=1] ⇔ display (x=1,y=2)"},
12:{type:"comparison",headline:"8-bit colour value",parts:["Allowed: 0 ... 255","Observed: 255","Raw saturation: unknown"]},
13:{type:"comparison",headline:"Honest report",parts:["Source: synthetic RGB","Shape: (1,2,3)","Calibrated raw: False"]}
},
I02:{}
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
 const rows=d.rows,cols=d.cols,cw=cols===4?83:103,ch=30,gap=6;
 const totalw=cw*cols+gap*(cols-1),left=(520-totalw)/2,top=28;
 for(let r=0;r<rows;r++){
  for(let c=0;c<cols;c++){
   const i=r*cols+c,g=group(svg,i),chosen=d.selected.includes(i),x=left+c*(cw+gap),y=top+r*(ch+gap);
   rect(g,x,y,cw,ch,chosen?"#1a4b40":C.surface,chosen?C.green:C.line);
   label(g,x+cw/2,y+20,chosen&&d.hide?"?":String(i),14,chosen?C.green:C.text,720);
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
 const svg=add(container,"svg",{viewBox:"0 0 520 165",role:"img",class:"bps-example-illustration","aria-label":d.caption||d.headline,focusable:"false"});
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