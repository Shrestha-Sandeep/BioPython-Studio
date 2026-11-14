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

const D02={
0:{kind:"route",nodes:["FASTA text","Record ID","Sequence","FASTQ Q","Audit"]},
1:{kind:"record",items:[["ID","read01"],["Seq","ATGN"],["Description","synthetic"]],caption:"A SeqRecord keeps identity and sequence together"},
2:{kind:"record",items:[["Source ID","r01"],["Original","ATGN"],["Derived RC","NCAT"]],caption:"Transformation is not a second independently observed read"},
3:{kind:"record",items:[["ID","sampleA"],["Description","synthetic only"],["Validation","not established"]],caption:"Header words are annotations, not scientific proof"},
4:{kind:"fasta",lines:[">a","ACG",">b","TT"],ids:[["a","ACG"],["b","TT"]],caption:"Two headers → two separate SeqRecords"},
5:{kind:"fasta",lines:[">sample7 note","AC","GT",">sample8","NN"],ids:[["sample7","ACGT"],["sample8","NN"]],caption:"Wrapped lines join until the next > header"},
6:{kind:"fasta",lines:[">r1","AC",">r1","GT"],ids:[["r1","AC"],["r1","GT"]],caption:"Repeated record ID makes an ambiguous join"},
7:{kind:"fasta",lines:[">a","AC","GT",">b","TT"],ids:[["a","ACGT"],["b","TT"]],caption:"Record content survives even if line wrapping changes"},
8:{kind:"interval",seq:"AACCGG",start:1,end:4,out:"ACC",caption:"Zero-based [1:4) selects indices 1,2,3"},
9:{kind:"strand",rows:[["FASTA chr1","AACCGG"],["slice [1:4)","ACC"],["minus strand","GGT"]],caption:"Choose reference coordinates before reverse complement"},
10:{kind:"decision",items:[["Reference","6 bases"],["Request","[3:8)"],["Bounds","Reject"]],caption:"Do not silently clip coordinates beyond the source"},
11:{kind:"interval",seq:"AACCGG",start:2,end:5,out:"?",caption:"Predict the minus strand of slice [2:5)"},
12:{kind:"interval",seq:"AACCGG",start:2,end:5,out:"CGG",caption:"Reference CCG → minus complement CGG"},
13:{kind:"quality",bases:["A","C"],ascii:["I","I"],scores:["40","40"],caption:"Four FASTQ lines → qualities aligned with each base"},
14:{kind:"quality",bases:["A","C","G"],ascii:["I","!","5"],scores:["40","0","20"],caption:"One Q score per base; strictly below Q20: one"},
15:{kind:"quality",bases:["A","C"],ascii:["I","!"],scores:["40","0"],caption:"Keep r1 ID attached to its Q0 minimum"},
16:{kind:"record",items:[["FASTA IDs","r1, r2"],["FASTQ IDs","r1, r2"],["Low Q read","r1"]],caption:"The report preserves sequence identity and QC origin"},
17:{kind:"decision",items:[["Identity","Duplicate IDs?"],["Format","Valid FASTQ?"],["Interval","Bounds valid?"]],caption:"Independent audit: no worked answer"}
};

const D03={
0:{kind:"route",nodes:["Read Q","Cycle mean","3′ trim","k-mers","Score"]},
1:{kind:"cycles",data:[["0","30,40","35.0","2"],["1","20,20","20.0","2"],["2","10","10.0","1"]],caption:"Only reads with a present cycle contribute"},
2:{kind:"cycles",data:[["0","30,40","n=2","2"],["1","20,20","n=2","2"],["2","10","n=1","1"]],caption:"Later cycle has n=1, not n=2"},
3:{kind:"decision",items:[["Observed Q","10"],["Wrong / pad 0","5.0"],["Correct / n1","10.0"]],caption:"Missing position ≠ Q0"},
4:{kind:"trim",seq:"ACGTT",q:[35,35,35,7,4],kept:3,caption:"Terminal low-Q tail removed; keep ACG"},
5:{kind:"trim",seq:"ACGT",q:[35,6,35,3],kept:3,caption:"Internal Q6 retained, terminal Q3 removed"},
6:{kind:"trim",seq:"ACG",q:[5,4,3],kept:0,caption:"Zero bases remain; retain exclusion metadata"},
7:{kind:"kmers",seq:"AAAA",windows:["AA","AA","AA"],status:["✓","✓","✓"],result:"AA × 3",caption:"Sliding k=2 windows overlap"},
8:{kind:"kmers",seq:"AANAAC",windows:["AA","AN","NA","AA","AC"],status:["✓","×","×","✓","✓"],result:"3 valid",caption:"Windows containing N are excluded"},
9:{kind:"kmers",seq:"AANAAC",windows:["AA","AN","NA","AA","AC"],status:["✓","×","×","✓","✓"],result:"?",caption:"Predict AA and AC counts"},
10:{kind:"kmers",seq:"AANAAC",windows:["AA","AN","NA","AA","AC"],status:["✓","×","×","✓","✓"],result:"AA ×2; AC ×1",caption:"Three valid overlapping windows"},
11:{kind:"trim",seq:"ACGTT",q:[35,35,35,7,4],kept:3,caption:"Before: 4 windows; after: AC and CG"},
12:{kind:"align",left:"ACG",right:"ACG",score:"6.0",caption:"3 matches × +2; global alignment"},
13:{kind:"align",left:"ACG",right:"ATG",score:"3.0",caption:"Two matches and one −1 mismatch"},
14:{kind:"align",left:"ACGT",right:"A-GT",score:"4.0",caption:"3 × +2; one gap-open −2"},
15:{kind:"record",items:[["Mode","global"],["Match / mismatch","+2 / −1"],["Gap open / extend","−2 / −0.5"]],caption:"Record mode and scoring policy"},
16:{kind:"record",items:[["r1 retained","ACG"],["r2 retained","ACGN"],["Motifs","AC ×2; CG ×2"]],caption:"Keep each source ID and output policy"},
17:{kind:"decision",items:[["Quality","Missing ≠ zero"],["Trimming","Declared tail policy"],["Motifs / align","New inputs"]],caption:"Independent transfer without shown solution"}
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

function record(svg,d){d.items.forEach(([a,b],i)=>{const g=group(svg,i),y=20+i*48;rect(g,22,y,476,42,i===2?"#224b42":C.panel,i===2?C.ok:C.line);t(g,126,y+27,a,C.muted,15);t(g,360,y+27,b,i===2?C.ok:C.ink,b.length>14?14:19);});t(svg,260,180,d.caption,C.muted,12);}
function fasta(svg,d){t(svg,122,20,"RAW FASTA",C.blue,13);t(svg,382,20,"PARSED RECORDS",C.blue,13);const g0=group(svg,0);rect(g0,18,30,212,130);d.lines.forEach((line,i)=>t(g0,120,47+i*21,line,line.startsWith(">")?C.warn:C.ink,line.length>14?12:16));d.ids.forEach(([id,seq],i)=>{const g=group(svg,i+1),y=43+i*65;rect(g,281,y,224,50,id==="r1"&&i===1?"#5a3733":C.panel,id==="r1"&&i===1?C.error:C.line);t(g,347,y+20,"ID "+id,C.blue,15);t(g,394,y+41,seq,C.ok,19);});t(svg,260,180,d.caption,C.muted,12);}
function interval(svg,d){const seq=[...d.seq],x0=45,cw=66,gap=7;t(svg,260,20,"REFERENCE INDEX: 0  1  2  3  4  5",C.muted,13);seq.forEach((b,i)=>{let g=group(svg,i),x=x0+i*(cw+gap),selected=i>=d.start&&i<d.end;rect(g,x,44,cw,63,selected?"#245747":C.panel,selected?C.ok:C.line);t(g,x+cw/2,83,b,selected?C.ok:C.ink,26);});t(svg,260,135,"SELECTED ["+d.start+":"+d.end+")   →   "+d.out,d.out==="?"?C.warn:C.blue,17);t(svg,260,178,d.caption,C.muted,12);}
function quality(svg,d){t(svg,100,24,"BASE",C.blue,13);t(svg,100,78,"FASTQ ASCII",C.muted,12);t(svg,100,131,"PHRED Q",C.ok,12);d.bases.forEach((base,i)=>{const x=172+i*107;const arr=[base,d.ascii[i],d.scores[i]];arr.forEach((value,row)=>{const g=group(svg,i*3+row),y=32+row*53;rect(g,x,y,92,44,row===2&&Number(value)<20?"#60402d":row===2?"#205245":C.panel,row===2&&Number(value)<20?C.error:row===2?C.ok:C.line);t(g,x+46,y+29,value,row===2&&Number(value)<20?C.error:row===2?C.ok:C.ink,23);});});t(svg,260,186,d.caption,C.muted,12);}

function cycles(svg,d){t(svg,260,21,"PER-CYCLE SUMMARY (SYNTHETIC)",C.blue,13);d.data.forEach(([cycle,qs,mean,n],i)=>{const g=group(svg,i),x=23+i*169;rect(g,x,35,153,113,i===2?"#294b43":C.panel);t(g,x+76,58,"CYCLE "+cycle,C.muted,13);t(g,x+76,85,qs,C.ink,18);t(g,x+76,111,mean,C.ok,20);t(g,x+76,136,"observed n = "+n,C.muted,12);});t(svg,260,181,d.caption,C.muted,12);}
function trim(svg,d){t(svg,260,22,"BASES AND QUALITY IN INPUT ORDER",C.blue,13);const chars=[...d.seq],cw=65,gap=9,left=(520-(chars.length*cw+(chars.length-1)*gap))/2;chars.forEach((b,i)=>{const g=group(svg,i),x=left+i*(cw+gap),removed=i>=d.kept,low=d.q[i]<20;rect(g,x,42,cw,83,removed?"#583237":low?"#59472f":"#244b42",removed?C.error:low?C.warn:C.ok);t(g,x+cw/2,74,b,C.ink,23);t(g,x+cw/2,108,"Q"+d.q[i],low?C.warn:C.ok,16);});t(svg,260,147,"RETAINED PREFIX: "+(d.seq.slice(0,d.kept)||"∅"),C.ok,18);t(svg,260,181,d.caption,C.muted,12);}
function kmers(svg,d){t(svg,260,21,"OVERLAPPING WINDOWS  ·  "+d.seq,C.blue,14);const count=d.windows.length,cw=count>4?79:102,gap=8,left=(520-(count*cw+(count-1)*gap))/2;d.windows.forEach((w,i)=>{const g=group(svg,i),x=left+i*(cw+gap),invalid=d.status[i]==="×";rect(g,x,49,cw,64,invalid?"#573537":"#204b42",invalid?C.error:C.ok);t(g,x+cw/2,75,w,invalid?C.error:C.ink,21);t(g,x+cw/2,101,d.status[i],invalid?C.error:C.ok,15);});t(svg,260,142,"COUNTED: "+d.result,d.result==="?"?C.warn:C.ok,19);t(svg,260,178,d.caption,C.muted,12);}
function align(svg,d){t(svg,260,23,"EXPLICIT GLOBAL ALIGNMENT",C.blue,14);const left=[...d.left],right=[...d.right],n=Math.max(left.length,right.length),cw=63,gap=10,x0=(520-(cw*n+(n-1)*gap))/2;for(let i=0;i<n;i++){const g=group(svg,i),x=x0+i*(cw+gap),a=left[i]||"",b=right[i]||"",match=a===b;rect(g,x,42,cw,42,match?"#244b42":"#59432d",match?C.ok:C.warn);t(g,x+cw/2,69,a,match?C.ok:C.ink,23);rect(g,x,91,cw,42,match?"#244b42":"#59432d",match?C.ok:C.warn);t(g,x+cw/2,118,b,match?C.ok:C.ink,23);}t(svg,260,155,"SCORE "+d.score,C.ok,19);t(svg,260,181,d.caption,C.muted,12);}
const painters={route,bases,fraction,strand,codons,decision,record,fasta,interval,quality,cycles,trim,kmers,align};
function render(container,ch,index){container.replaceChildren();const d=ch==="N01"?D[index]:ch==="N02"?D02[index]:ch==="N03"?D03[index]:null;if(!d)return false;const svg=add(container,"svg",{viewBox:"0 0 520 190",role:"img","aria-label":"Illustrative synthetic DNA teaching diagram: "+(d.caption||d.nodes?.join(" to ")||d.kind),class:"bps-example-illustration",focusable:"false"});rect(svg,0,0,520,190,C.bg,C.bg);painters[d.kind](svg,d);return true;}
function progress(container,value){const svg=container.querySelector("svg");if(!svg)return;const nodes=[...svg.querySelectorAll("[data-bps-part]")];if(!nodes.length)return;for(const [i,n] of nodes.entries()){n.classList.toggle("bps-is-future",value!=null&&i>Math.min(nodes.length-1,Math.floor(Math.max(0,Math.min(1,Number(value)||0))*nodes.length)));n.classList.toggle("bps-is-current",value!=null&&i===Math.min(nodes.length-1,Math.floor(Math.max(0,Math.min(1,Number(value)||0))*nodes.length)));}svg.classList.toggle("bps-is-speaking",value!=null);}
window.BioPythonSequenceIllustrations=Object.freeze({render,progress,has:(ch,i)=>Boolean(ch==="N01"?D[i]:ch==="N02"?D02[i]:ch==="N03"?D03[i]:false)});
})();
