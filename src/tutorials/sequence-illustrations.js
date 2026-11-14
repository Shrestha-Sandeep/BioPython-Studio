// Original scientific SVG illustrations for N01; all sequences are synthetic.
"use strict";
(()=>{
const NS="http://www.w3.org/2000/svg";
const C={bg:"#101c28",panel:"#213744",line:"#567082",ink:"#f5fbff",muted:"#c3d6df",ok:"#7de4c5",blue:"#9ed9f6",warn:"#f6d18d",error:"#ffaaa6"};
const D={
0:{kind:"route",nodes:["Synthetic DNA","Validate","GC / called","Strand","Translate"]},
1:{kind:"bases",seq:"ACGNT?",bad:[5],caption:"A C G N T permitted; ? flagged at zero-based index 5"},
2:{kind:"bases",seq:"NNAT",amb:[0,1],caption:"N is permitted but not a callable A/C/G/T base"},
3:{kind:"bases",seq:"ANXT",bad:[1,2],caption:"Under ACGT-only policy, N and X are flagged"},
4:{kind:"fraction",seq:"GCNNAA",num:"2 GC",den:"4 called",fraction:"0.50",caption:"The two Ns are excluded from the GC denominator"},
5:{kind:"fraction",seq:"NNN",num:"0 GC",den:"0 called",fraction:"None",caption:"A fraction with denominator zero is not 0%"},
6:{kind:"fraction",seq:"GGNNNA",num:"?",den:"? called",fraction:"?",caption:"Predict numerator and denominator before Reveal"},
7:{kind:"fraction",seq:"GGNNNA",num:"2 GC",den:"3 called",fraction:"0.667",caption:"Two G + one A; three Ns are unknown"},
8:{kind:"strand",rows:[["5′ original","ATGCN"],["complement","TACGN"],["5′ opposite","NGCAT"]],caption:"Complement bases, then reverse orientation"},
9:{kind:"strand",rows:[["5′ original","CCATG"],["complement","GGTAC"],["5′ opposite","CATGG"]],caption:"Complement ≠ reverse complement"},
10:{kind:"strand",rows:[["reference","AACCGG"],["slice [1:4]","ACC"],["minus strand","GGT"]],caption:"Apply half-open coordinates before orienting"},
11:{kind:"codons",bases:["ATG","GCT","TAA"],aas:["M","A","*"],caption:"Three complete codons under the default genetic code"},
12:{kind:"codons",bases:["ATG","NNN","TAA"],aas:["M","X","*"],caption:"X is unknown amino acid; * is an inferred stop"},
13:{kind:"decision",items:[["Input length","8 bases"],["Length mod 3","2 bases"],["Decision","Refuse translation"]],caption:"Never silently discard trailing nucleotides"},
14:{kind:"route",nodes:["Raw DNA","ACGTN QC","GC called","Bio.Seq RC","CDS → protein"]},
15:{kind:"decision",items:[["Validate","X and N policy"],["Compute","GC and strand"],["Translate","Complete frame?"]],caption:"Independent transfer: new inputs, no shown solution"}
};
function add(p,tag,attr={}){let n=document.createElementNS(NS,tag);Object.entries(attr).forEach(([k,v])=>n.setAttribute(k,String(v)));p.append(n);return n;}
function t(p,x,y,s,fill=C.ink,size=15,weight=620){let q=add(p,"text",{x,y,fill,"font-size":size,"font-weight":weight,"text-anchor":"middle","font-family":"system-ui, sans-serif"});q.textContent=s;return q;}
function rect(p,x,y,w,h,fill=C.panel,stroke=C.line){return add(p,"rect",{x,y,width:w,height:h,rx:8,fill,stroke,"stroke-width":1.5});}
function group(p,i){return add(p,"g",{"data-bps-part":i});}
function route(svg,d){d.nodes.forEach((name,i)=>{const g=group(svg,i),x=13+i*102;rect(g,x,59,95,65,i===0?C.panel:"#18483f",i===0?C.line:C.ok);t(g,x+47,85,name, name.length>12?C.ink:C.blue,name.length>12?11:13);if(i<4)t(svg,x+98,97,"›",C.ok,24);});t(svg,260,34,"SOURCE → CHECK → REPORT",C.muted,14);t(svg,260,159,"Every result states its input assumptions",C.muted,13);}
function bases(svg,d){const chars=[...d.seq],size=54,gap=11,w=chars.length*size+(chars.length-1)*gap,x0=(520-w)/2;t(svg,260,34,"POSITION INDEX: "+chars.map((_,i)=>i).join("        "),C.muted,12);chars.forEach((b,i)=>{const g=group(svg,i),x=x0+i*(size+gap),bad=d.bad?.includes(i),unknown=d.amb?.includes(i)||b==="N";rect(g,x,55,size,62,bad?"#5d3235":unknown?"#59482c":"#214f49",bad?C.error:unknown?C.warn:C.ok);t(g,x+size/2,94,b,bad?C.error:unknown?C.warn:C.ink,27);});t(svg,260,153,d.caption,C.muted,12);}
function fraction(svg,d){const chars=[...d.seq],cw=48,gap=8,w=chars.length*cw+(chars.length-1)*gap,x0=(520-w)/2;chars.forEach((b,i)=>{const g=group(svg,i),x=x0+i*(cw+gap),uncertain=b==="N";rect(g,x,27,cw,42,uncertain?"#59482c":"#214f49",uncertain?C.warn:C.ok);t(g,x+cw/2,54,b,uncertain?C.warn:C.ink,21);});const cells=[[d.num,C.blue],[d.den,C.ok],[d.fraction,C.warn]];cells.forEach(([value,color],i)=>{const g=group(svg,i+chars.length),x=30+i*165;rect(g,x,83,145,47);t(g,x+72,113,value,color,value.length>8?15:21);});t(svg,260,159,d.caption,C.muted,12);}
function strand(svg,d){d.rows.forEach(([lab,seq],i)=>{const g=group(svg,i),y=24+i*47;rect(g,22,y,476,40,i===2?"#1c5145":C.panel,i===2?C.ok:C.line);t(g,111,y+25,lab,C.muted,14);t(g,330,y+26,seq,i===2?C.ok:C.ink,23);});t(svg,260,178,d.caption,C.muted,13);}
function codons(svg,d){t(svg,260,26,"CODONS → PROTEIN SYMBOLS",C.muted,14);d.bases.forEach((base,i)=>{const g=group(svg,i),x=40+i*157;rect(g,x,41,125,47);t(g,x+62,71,base,base==="NNN"?C.warn:C.blue,24);t(g,x+62,109,"↓",C.muted,17);rect(g,x+26,117,74,40,i===2?"#60452a":C.panel);t(g,x+62,144,d.aas[i],d.aas[i]==="X"?C.warn:d.aas[i]==="*"?C.error:C.ok,23);});t(svg,260,180,d.caption,C.muted,12);}
function decision(svg,d){d.items.forEach(([left,right],i)=>{const g=group(svg,i),y=20+i*48;rect(g,25,y,470,42,i===2?"#244b42":C.panel,i===2?C.ok:C.line);t(g,135,y+27,left,C.muted,15);t(g,355,y+27,right,i===2?C.ok:C.ink,17);});t(svg,260,180,d.caption,C.muted,12);}
const painters={route,bases,fraction,strand,codons,decision};
function render(container,ch,index){container.replaceChildren();if(ch!=="N01"||!D[index])return false;const d=D[index];const svg=add(container,"svg",{viewBox:"0 0 520 190",role:"img","aria-label":"Illustrative synthetic DNA teaching diagram: "+(d.caption||d.nodes?.join(" to ")||d.kind),class:"bps-example-illustration",focusable:"false"});rect(svg,0,0,520,190,C.bg,C.bg);painters[d.kind](svg,d);return true;}
function progress(container,value){const svg=container.querySelector("svg");if(!svg)return;const nodes=[...svg.querySelectorAll("[data-bps-part]")];if(!nodes.length)return;for(const [i,n] of nodes.entries()){n.classList.toggle("bps-is-future",value!=null&&i>Math.min(nodes.length-1,Math.floor(Math.max(0,Math.min(1,Number(value)||0))*nodes.length)));n.classList.toggle("bps-is-current",value!=null&&i===Math.min(nodes.length-1,Math.floor(Math.max(0,Math.min(1,Number(value)||0))*nodes.length)));}svg.classList.toggle("bps-is-speaking",value!=null);}
window.BioPythonSequenceIllustrations=Object.freeze({render,progress,has:(ch,i)=>ch==="N01"&&Boolean(D[i])});
})();
