/* Six foundation chapters: authentic science, preserved goal mapping, real Python. */
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import vm from "node:vm";

const root=new URL("../",import.meta.url);
const dataPaths=["p01","p02","p03","p04","p05","p06"].map(x=>"src/tutorials/"+x+"-data.js");
const ctx={window:{}};
for(const path of dataPaths){
  const source=readFileSync(new URL(path,root),"utf8");
  assert.doesNotThrow(()=>new Function(source),path);
  vm.runInNewContext(source,ctx,{filename:path});
}
const tutorials=JSON.parse(JSON.stringify(ctx.window.BioPythonFoundationTutorials));
const html=readFileSync(new URL("index.html",root),"utf8");
const viewer=readFileSync(new URL("src/tutorials/p01-viewer.js",root),"utf8");
const chapterGoals={P01:7,P02:4,P03:7,P04:6,P05:6,P06:6};
const sourceImages=new Set([
  "labeled-nuclei","fluorescence-single","fluorescence-examples","otsu-nuclei-mask"
]);

test("exactly six fully mapped science-first foundation tutorials",()=>{
  assert.equal(tutorials.length,6);
  assert.deepEqual(tutorials.map(t=>t.chapter),Object.keys(chapterGoals));
  const allGoals=[];
  for(const t of tutorials){
    const n=chapterGoals[t.chapter];
    assert.equal(t.goals.length,n+1,t.chapter);
    const expected=Array.from({length:n},(_,i)=>t.chapter+"-G"+String(i+1).padStart(2,"0"));
    expected.push(t.chapter+"-CAPSTONE");
    assert.deepEqual(t.goals,expected,t.chapter);
    allGoals.push(...t.goals);
    assert.ok(t.steps.length>=12 && t.steps.length<=23,t.chapter+" scene count");
    assert.equal(t.steps.filter(s=>s.checkpoint).length,1,t.chapter+" must pause for prediction");
    assert.ok(t.steps[0].preview?.image,t.chapter+" missing real scientific destination");
    assert.match(t.steps.at(-1).note,/independent/i,t.chapter+" needs transfer");
    assert.deepEqual([...new Set(t.steps.map(s=>s.goal))].sort(),t.goals.slice().sort(),
      t.chapter+" a goal was named but not taught");
  }
  assert.equal(new Set(allGoals).size,allGoals.length,"No reused/ambiguous goal IDs");
  assert.equal(tutorials.reduce((n,t)=>n+t.steps.length,0),91);
  assert.ok(!allGoals.some(g=>g.includes("REVIEW")),"Delayed review must be independent");
});

test("all scenes have meaningful, synchronized narration and valid existing figures",()=>{
  for(const t of tutorials){
    for(const [i,s] of t.steps.entries()){
      const where=t.chapter+":"+i+":"+s.title;
      assert.ok(s.title&&s.say&&s.note,where);
      assert.ok(s.say.trim().split(/\s+/).length>=16,where+" narration too thin");
      assert.ok(Array.isArray(s.focus)&&Array.isArray(s.visual),where);
      const lines=s.code?s.code.split("\n"):[];
      for(const line of s.focus)assert.ok(line>0&&line<=lines.length,where+" code line "+line);
      for(const item of s.visual)assert.equal(item.length,2,where+" visual pair");
      if(s.checkpoint)assert.equal(s.output,"",where+" must not show the answer before Reveal");
      if(s.preview){
        assert.ok(sourceImages.has(s.preview.image),where+" unknown/unsourced image");
        const bytes=readFileSync(new URL("assets/witz/"+s.preview.image+".png",root)).byteLength;
        assert.ok(bytes>1000,where+" missing image");
        assert.ok(s.preview.label,where+" missing explanatory label");
      }
      const tokens=JSON.stringify(s).match(/\{[A-Z_]+\}/g)||[];
      for(const token of tokens)assert.ok(["{CELLS}","{PIXEL_SIZE}","{LENGTH}"].includes(token),where+" "+token);
    }
  }
});

test("all scripts are integrated into the same optional P01–P06 viewer",()=>{
  let last=-1;
  for(const path of dataPaths){
    const index=html.indexOf(path);
    assert.ok(index>last,path+" not loaded in canonical order");
    last=index;
  }
  assert.ok(html.indexOf("src/tutorials/p01-viewer.js")>last);
  assert.match(viewer,/BioPythonFoundationTutorials/);
  assert.match(viewer,/chapterTutorials/);
  assert.match(viewer,/d\.phase==="learn"/);
  assert.match(viewer,/awaitingPrediction/);
  assert.match(viewer,/CREDITS.md/);
  assert.doesNotMatch(viewer,/MediaRecorder|bps-example-record|Save MP4/);
  assert.doesNotMatch(viewer,/biopython\.p01\.v1/);
});

const substitute=(code,t)=>{
  const p=t.parameter?.value??25;
  return String(code).replaceAll("{CELLS}",String(p))
    .replaceAll("{PIXEL_SIZE}","0.2").replaceAll("{LENGTH}","8.0");
};
const python=spawnSync("python3",["--version"],{encoding:"utf8"});
test("every explanatory output matches fresh actual Python, including failures",{
  skip:python.error?"python3 not available":false
},()=>{
  let runCount=0;
  for(const t of tutorials){
    for(const [i,s] of t.steps.entries()){
      if(!s.code||!s.output)continue;
      const source=substitute(s.code,t),expected=substitute(s.output,t);
      const run=spawnSync("python3",["-c",source],{encoding:"utf8",timeout:5000});
      assert.equal(run.error,undefined,t.chapter+":"+i+" timed out");
      const where=t.chapter+":"+i+":"+s.title;
      if(expected.startsWith("NameError:")||expected==="AssertionError"){
        assert.notEqual(run.status,0,where+" expected failure");
        assert.ok(run.stderr.includes(expected),where+" wrong exception: "+run.stderr);
      }else if(expected.includes("Help on built-in function len")){
        assert.equal(run.status,0,where+" help command");
        assert.ok(run.stdout.includes("Help on built-in function len"),where);
      }else{
        assert.equal(run.status,0,where+" "+run.stderr);
        assert.equal(run.stdout.trimEnd(),expected,where+" stdout");
      }
      runCount++;
    }
  }
  assert.ok(runCount>=65,"Most tutorial scenes must show executable results");
});

test("changed records exercise field QC, strict labels and invalid calibration",{
  skip:python.error?"python3 not available":false
},()=>{
  const final=(chapter)=>tutorials.find(t=>t.chapter===chapter).steps
    .find(s=>s.goal===chapter+"-CAPSTONE"&&s.code&&s.output);
  const run=(chapter,change)=>{
    const s=final(chapter),code=change(substitute(s.code,tutorials.find(t=>t.chapter===chapter)));
    const r=spawnSync("python3",["-c",code],{encoding:"utf8",timeout:5000});
    assert.equal(r.status,0,chapter+":"+r.stderr);
    return r.stdout;
  };
  const p02=run("P02",s=>s.replace("sample_id = 'N2_P03_heat'","sample_id = 'N2_P03_heat_extra'"));
  assert.match(p02,/REJECT \(wrong field count\)/);
  const p02Boundary=run("P02",s=>s.replace("focus_score = 0.80","focus_score = 0.79"));
  assert.match(p02Boundary,/REJECT \(low focus\)/);
  const p03=run("P03",s=>s.replace("('F03', 0.65)","('F03', 0.85)"));
  assert.match(p03,/accepted: \['F01', 'F03'\]/);
  const p04=run("P04",s=>s.replace("('S01', 'GFP', 0.88)","('S04', 'GFP', 0.88)"));
  assert.match(p04,/Registered: \['S01', 'S02', 'S04', 'S03'\]/);
  const p05=run("P05",s=>s.replace("audit = evaluate_fields(records)","audit = evaluate_fields(records, minimum_um=9)"));
  assert.match(p05,/kept=0; low=2; invalid=2/);
  const p06=run("P06",s=>s.replace("audit = build_audit(records, 5)","audit = build_audit(records, 0)"));
  assert.match(p06,/"measurements": \[\]/);
  assert.match(p06,/"missing": \["S01", "S02", "S03"\]/);
});
