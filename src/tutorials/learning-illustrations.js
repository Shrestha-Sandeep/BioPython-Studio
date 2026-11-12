/* Original SVG learning diagrams for P01-P06; illustrative values only. */
"use strict";
(() => {
  const NS="http://www.w3.org/2000/svg";
  const C={bg:"#101c28",panel:"#1b2f3b",line:"#4b6574",text:"#f0f7f8",muted:"#bfd0d7",green:"#69dfb0",blue:"#8bcaf0",amber:"#ffd48b",red:"#ff9b9b"};
  const diagrams={
    P01:{
      2:{kind:"store",name:"specimen",value:'"S01"',type:"text (str)",caption:"A name points to a stored string"},
      3:{kind:"store",name:"cells",value:"{CELLS}",type:"whole number (int)",caption:"The count is supplied manually"},
      7:{kind:"ruler",caption:"Convert a pixel distance using a verified scale"},
      9:{kind:"ruler",caption:"40 px × 0.2 µm/px = 8.0 µm"},
      11:{kind:"bars",title:"The same 40-pixel measurement",bars:[["Correct example scale",8,C.green],["Incorrect example scale",16,C.red]],unit:"µm",caption:"Wrong calibration doubles the calculated length"},
      12:{kind:"error",left:"cells",right:"cell",result:"NameError",caption:"One missing letter changes the variable name"},
      16:{kind:"report",rows:[["Specimen","S01"],["Manual count","{CELLS} cells"],["Calculated length","8.0 µm"]],caption:"Supplied inputs become a consistent report"}
    },
    P02:{
      1:{kind:"flow",nodes:["strain: N2","plate: P03","condition: heat","N2_P03_heat"],caption:"Join recorded fields in a declared order"},
      3:{kind:"tokens",parts:["N2","P03","heat"],caption:"split('_') preserves three separately testable fields"},
      5:{kind:"tokens",parts:["N2","(empty)","heat"],bad:1,caption:"Three parts can still contain a missing value"},
      6:{kind:"threshold",caption:"At the boundary: ≥ accepts; > rejects equality"},
      8:{kind:"threshold",caption:"Equality passes an inclusive rule, not a strict one"},
      9:{kind:"flow",nodes:["ID shape?","Focus ≥ 0.80?","Decision","ACCEPT"],caption:"First matching condition controls the decision"},
      11:{kind:"audit",rows:[["N2_P03_heat","ACCEPT","valid format"],["N2_P03_heat_extra","REJECT","4 fields"],["N2__heat","REJECT","empty plate"]],caption:"Preserve raw IDs and the reason for every decision"}
    },
    P03:{
      1:{kind:"sequence",items:["F01","F02","F03","F04"],active:[],caption:"List order follows acquisition order; IDs are still distinct"},
      2:{kind:"sequence",items:["F01","F02","F03","F04"],active:[0],caption:"Python index 0 selects F01, the first element"},
      4:{kind:"flow",nodes:["(F01, 0.92)","field_id = F01","focus = 0.92"],caption:"Unpacking preserves the identifier–measurement pair"},
      5:{kind:"sequence",items:["F01","F02","F03","F04"],active:[0,1,2,3],caption:"One loop applies the same operation to each record"},
      6:{kind:"sequence",items:["F01 · 0.92","F02 · None","F03 · 0.65","F04 · 0.84"],active:[1],warning:[1],caption:"A missing score remains None, not zero"},
      9:{kind:"sequence",items:["F01","F02","STOP","F04"],active:[0,1],warning:[2,3],caption:"break ends the loop; F04 must be marked unvisited"},
      11:{kind:"audit",rows:[["F01","ACCEPT","0.92"],["F02","MISSING","None"],["F03","LOW","0.65"],["F04","ACCEPT","0.84"]],caption:"continue skips a record only after documenting it"},
      12:{kind:"audit",rows:[["F01","ACCEPT","0.92"],["F02","MISSING","None"],["F03","LOW","0.65"],["F05","UNVISITED","after STOP"]],caption:"A complete audit also identifies fields never processed"}
    },
    P04:{
      1:{kind:"metadata",sample:"S01",channel:"GFP",focus:"0.92",caption:"A dictionary key connects a specimen to its metadata"},
      2:{kind:"metadata",sample:"S01",channel:"GFP",focus:"0.92",caption:"Lookup by S01 retrieves its corresponding record"},
      4:{kind:"sequence",items:["S01","S02","S01","S03"],active:[0,2],warning:[2],caption:"A repeated ID needs a duplicate flag, not an overwrite"},
      5:{kind:"flow",nodes:["4 acquisitions","set: 3 IDs","duplicate: S01"],caption:"A set detects membership but does not preserve repeats"},
      6:{kind:"audit",rows:[["S01","ACCEPT","0.92"],["S02","MISSING","None"]],caption:"Filter the accepted data without rewriting missing values"},
      10:{kind:"flow",nodes:["IDs: S01, S02","Scores: .92, None","strict zip","2 matched pairs"],caption:"Pair only verified aligned sequences"},
      11:{kind:"bars",title:"Mismatched sequence lengths",bars:[["Specimen IDs",3,C.blue],["Focus scores",2,C.amber]],unit:"items",caption:"Ordinary zip silently drops the unpaired S03"},
      12:{kind:"audit",rows:[["S01","ACCEPT","0.92"],["S02","MISSING","None"],["S01","DUPLICATE","0.88"],["S03","LOW","0.76"]],caption:"Keep first-seen metadata and log all excluded records"}
    },
    P05:{
      1:{kind:"flow",nodes:["40 px","÷ 5 px/µm","to_um(40, 5)","8.0 µm"],caption:"A function converts using the specified calibration units"},
      2:{kind:"flow",nodes:["40 px + 5 px/µm","return 8.0","compare ≥ 6","True"],caption:"return lets another calculation reuse the value"},
      3:{kind:"bars",title:"Same function, different widths",bars:[["F01: 40 px",8,C.green],["F02: 20 px",4,C.blue]],unit:"µm",caption:"Change inputs; reuse the same calculation"},
      5:{kind:"flow",nodes:["Call A: [2, −1]","local kept: [2]","Call B: [3]","local kept: [3]"],caption:"Each call starts with a fresh local list"},
      7:{kind:"flow",nodes:["Shared kept: []","Call A → [2]","Call B → [2, 3]"],caption:"Global mutable state contaminates the next result"},
      9:{kind:"flow",nodes:["scale = 0","Check scale ≤ 0","ValueError"],caption:"Reject an invalid scale; never invent a zero length"},
      10:{kind:"flow",nodes:["radius = 3 µm","area = π × r²","28.27 µm²"],caption:"The geometric circle model is illustrative only"},
      11:{kind:"audit",rows:[["F01","KEPT","8.0 µm"],["F02","LOW","4.0 µm"],["F03","INVALID","missing"],["F04","INVALID","scale"]],caption:"Reusable calculations return auditable categories"}
    },
    P06:{
      1:{kind:"flow",nodes:["F01, F02","write fields.txt","read fields.txt","F01, F02"],caption:"Write and read back real text inside a temporary directory"},
      4:{kind:"flow",nodes:["Python dict","json.dumps","JSON text","json.loads"],caption:"Serialization preserves structured information"},
      5:{kind:"flow",nodes:["Original dict","JSON text","Decoded dict","Equal: True"],caption:"Round-trip testing checks that the fields survive"},
      6:{kind:"test",expected:"8.0 µm",actual:"8.0 µm",pass:true,caption:"A correct conversion meets the expected test result"},
      8:{kind:"test",expected:"8.0 µm",actual:"200 µm",pass:false,caption:"A test catches multiplication in place of division"},
      9:{kind:"audit",rows:[["S01","MEASURED","8.0 µm"],["S02","MISSING","None"],["S03","MEASURED","5.0 µm"]],caption:"Save measured and missing cases together"},
      10:{kind:"flow",nodes:["Source file","git add","git commit","Version recorded"],caption:"These Git steps are a plan, not executed by this lesson"},
      11:{kind:"flow",nodes:["Input records","Validated audit","Save JSON","Read + assert"],caption:"Report equality is verified within the temporary folder"}
    }
  };
  const interpolate=(s,context)=>String(s).replace(/\{CELLS\}/g,String(context?.cells??25));
  function el(tag,attrs={}){
    const node=document.createElementNS(NS,tag);
    for(const [k,v] of Object.entries(attrs))node.setAttribute(k,String(v));
    return node;
  }
  function add(parent,tag,attrs={}){const n=el(tag,attrs);parent.append(n);return n;}
  function line(svg,x1,y1,x2,y2,color=C.line,width=2){return add(svg,"line",{x1,y1,x2,y2,stroke:color,"stroke-width":width,"stroke-linecap":"round"});}
  function rect(svg,x,y,w,h,fill=C.panel,stroke=C.line,r=12){return add(svg,"rect",{x,y,width:w,height:h,rx:r,fill,stroke,"stroke-width":1.5});}
  function txt(svg,x,y,value,size=15,color=C.text,weight=550,anchor="middle"){
    const node=add(svg,"text",{x,y,"font-size":size,"font-family":"system-ui, -apple-system, sans-serif",fill:color,"font-weight":weight,"text-anchor":anchor});
    node.textContent=value;return node;
  }
  function arrow(svg,x1,y,x2){line(svg,x1,y,x2-8,y,C.blue,2.5);add(svg,"path",{d:`M ${x2-11} ${y-5} L ${x2-3} ${y} L ${x2-11} ${y+5}`,stroke:C.blue,"stroke-width":2.4,fill:"none","stroke-linejoin":"round"});}
  function footer(svg,caption){txt(svg,260,151,caption,13,C.muted,450);}
  function flow(svg,d){
    const nodes=d.nodes, count=nodes.length, gap=20, width=(488-(count-1)*gap)/count, x0=16;
    nodes.forEach((node,i)=>{
      const x=x0+i*(width+gap),isFinal=i===count-1;
      rect(svg,x,37,width,72,isFinal?"#1a423b":C.panel,isFinal?C.green:C.line);
      const content=String(node);let lines=[content];
      if(content.length>18&&content.includes(" ")){
        const pivot=content.lastIndexOf(" ",Math.ceil(content.length/2)+4);
        if(pivot>4)lines=[content.slice(0,pivot),content.slice(pivot+1)];
      }
      if(lines.length===1)txt(svg,x+width/2,79,content,content.length>18?11:content.length>13?12:14,isFinal?C.green:C.text,isFinal?700:570);
      else lines.forEach((part,j)=>txt(svg,x+width/2,68+j*19,part,part.length>17?11:13,isFinal?C.green:C.text,isFinal?700:570));
      if(i<count-1)arrow(svg,x+width+2,73,x+width+gap);
    });
    footer(svg,d.caption);
  }
  function store(svg,d,context){
    rect(svg,25,38,190,78);rect(svg,304,38,190,78,"#1a423b",C.green);
    txt(svg,120,58,"VARIABLE",11,C.muted,700);txt(svg,120,91,d.name,23,C.blue,750);
    arrow(svg,226,77,289);
    txt(svg,399,58,d.type,11,C.muted,650);txt(svg,399,91,interpolate(d.value,context),23,C.green,750);
    footer(svg,d.caption);
  }
  function ruler(svg,d){
    txt(svg,24,30,"PIXEL DISTANCE",12,C.muted,700,"start");
    const x0=24,y=43,px=10.75;
    for(let i=0;i<40;i++)rect(svg,x0+i*px,y,px-1,30,i%5===0?"#377c7d":"#23505c","#365b68",1);
    line(svg,24,85,454,85,C.blue,2);line(svg,24,80,24,91,C.blue);line(svg,454,80,454,91,C.blue);
    txt(svg,239,104,"40 pixels",14,C.text,650);
    txt(svg,260,129,"40 px  ×  0.2 µm/px  =  8.0 µm",18,C.green,750);
    footer(svg,d.caption);
  }
  function bars(svg,d){
    txt(svg,260,28,d.title,14,C.muted,650);
    const m=Math.max(...d.bars.map(x=>x[1]));
    d.bars.forEach(([label,value,color],i)=>{
      const y=46+i*45;txt(svg,21,y+11,label,12,C.text,500,"start");
      rect(svg,225,y-5,218,24,"#263642","#263642",5);rect(svg,225,y-5,Math.max(8,218*value/m),24,color,color,5);
      txt(svg,497,y+12,`${value} ${d.unit}`,13,color,700,"end");
    });footer(svg,d.caption);
  }
  function tokens(svg,d){
    const gap=18,w=141; d.parts.forEach((part,i)=>{
      const x=31+i*(w+gap);const bad=i===d.bad;
      rect(svg,x,49,w,64,bad?"#503038":C.panel,bad?C.red:C.line);
      txt(svg,x+w/2,75,`PART ${i+1}`,11,C.muted,650);
      txt(svg,x+w/2,99,part,20,bad?C.red:C.green,700);
    });footer(svg,d.caption);
  }
  function threshold(svg,d){
    const start=65,end=455,y=80,marker=start+(end-start)*.8;
    txt(svg,260,29,"FOCUS SCORE: 0.80  ·  MINIMUM: 0.80",15,C.text,650);
    line(svg,start,y,end,y,C.muted,5);
    line(svg,marker,y,end,y,C.green,6);
    for(let i=0;i<=5;i++){const x=start+(end-start)*i/5;line(svg,x,y-7,x,y+8,C.muted,1.4);txt(svg,x,108,(i/5).toFixed(1),11,C.muted,450);}
    add(svg,"circle",{cx:marker,cy:y,r:10,fill:C.green,stroke:C.bg,"stroke-width":3});
    txt(svg,marker,60,"SCORE = LIMIT",12,C.green,700);
    txt(svg,160,129,"≥  True",16,C.green,700);txt(svg,366,129,">  False",16,C.amber,700);
    footer(svg,d.caption);
  }
  function sequence(svg,d){
    const n=d.items.length,gap=12,w=(482-gap*(n-1))/n,x0=19;
    d.items.forEach((item,i)=>{
      const x=x0+i*(w+gap),warn=d.warning?.includes(i),active=d.active?.includes(i);
      const fill=warn?"#4e3435":active?"#1b433e":C.panel;
      const stroke=warn?C.red:active?C.green:C.line;
      rect(svg,x,52,w,64,fill,stroke);
      txt(svg,x+w/2,45,`[${i}]`,12,C.muted,600);
      txt(svg,x+w/2,90,item,item.length>10?11:16,warn?C.red:active?C.green:C.text,720);
    });footer(svg,d.caption);
  }
  function metadata(svg,d){
    rect(svg,18,34,112,89,"#1a423b",C.green);txt(svg,74,66,"KEY",11,C.muted,650);txt(svg,74,96,d.sample,26,C.green,750);
    arrow(svg,140,78,167);
    rect(svg,179,34,325,89);txt(svg,341,60,"ATTACHED METADATA",12,C.muted,650);
    txt(svg,218,96,`channel: ${d.channel}`,17,C.blue,650,"start");
    txt(svg,365,96,`focus: ${d.focus}`,17,C.green,650,"start");
    footer(svg,d.caption);
  }
  function audit(svg,d){
    const x=[17,194,326],y0=23,row=26;
    txt(svg,x[0]+5,y0,"IDENTIFIER",10,C.muted,700,"start");txt(svg,x[1]+5,y0,"CATEGORY",10,C.muted,700,"start");txt(svg,x[2]+5,y0,"DETAIL",10,C.muted,700,"start");
    d.rows.forEach(([id,status,detail],i)=>{
      const y=32+i*row,color=/REJECT|INVALID|DUPLICATE|UNVISITED/.test(status)?C.red:/MISSING|LOW/.test(status)?C.amber:C.green;
      rect(svg,15,y,490,row-2,i%2===0?"#1b2f3b":"#172733","#284755",5);
      txt(svg,x[0]+6,y+19,id,id.length>20?11:13,C.text,600,"start");
      txt(svg,x[1]+6,y+19,status,12,color,700,"start");
      txt(svg,x[2]+6,y+19,detail,12,C.muted,550,"start");
    }); footer(svg,d.caption);
  }
  function error(svg,d){
    rect(svg,22,41,220,75);rect(svg,279,41,220,75,"#4e3435",C.red);
    txt(svg,132,62,"DEFINED",11,C.muted,700);txt(svg,132,92,d.left,23,C.green,750);
    txt(svg,389,62,"REFERENCED",11,C.muted,700);txt(svg,389,92,d.right,23,C.red,750);
    txt(svg,260,32,d.result,15,C.red,700);footer(svg,d.caption);
  }
  function report(svg,d,context){
    rect(svg,75,25,370,113,"#172d36",C.line);txt(svg,260,46,"SPECIMEN REPORT",13,C.blue,800);
    d.rows.forEach(([k,v],i)=>{
      const y=67+i*26;txt(svg,95,y,k,13,C.muted,550,"start");txt(svg,427,y,interpolate(v,context),14,C.green,700,"end");
      if(i<d.rows.length-1)line(svg,94,y+8,427,y+8,"#38505c",1);
    });footer(svg,d.caption);
  }
  function test(svg,d){
    const color=d.pass?C.green:C.red;
    rect(svg,21,39,218,78);rect(svg,280,39,218,78,d.pass?"#1a423b":"#4e3435",color);
    txt(svg,130,61,"EXPECTED",12,C.muted,650);txt(svg,130,92,d.expected,22,C.text,750);
    txt(svg,390,61,"ACTUAL",12,C.muted,650);txt(svg,390,92,d.actual,22,color,750);
    txt(svg,260,30,d.pass?"✓ TEST PASSES":"× ASSERTION ERROR",13,color,800);footer(svg,d.caption);
  }
  const painters={flow,store,ruler,bars,tokens,threshold,sequence,metadata,audit,error,report,test};
  function render(container,chapter,index,context={}){
    container.replaceChildren();
    const d=diagrams[chapter]?.[index];
    if(!d)return false;
    const svg=el("svg",{viewBox:"0 0 520 165",role:"img","aria-label":interpolate(d.caption,context),class:"bps-example-illustration",focusable:"false"});
    add(svg,"rect",{x:0,y:0,width:520,height:165,rx:9,fill:C.bg});
    painters[d.kind](svg,d,context);
    container.append(svg);return true;
  }
  window.BioPythonTutorialIllustrations=Object.freeze({render,has:(chapter,index)=>Boolean(diagrams[chapter]?.[index])});
})();
