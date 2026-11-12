/* P01 example contract: snippets must agree with a fresh CPython process. */
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import vm from "node:vm";

const root=new URL("../",import.meta.url);
const dataSource=readFileSync(new URL("src/tutorials/p01-data.js",root),"utf8");
const viewerSource=readFileSync(new URL("src/tutorials/p01-viewer.js",root),"utf8");
const indexSource=readFileSync(new URL("index.html",root),"utf8");
const context={window:{}};
vm.runInNewContext(dataSource,context);
const tutorials=JSON.parse(JSON.stringify(context.window.BioPythonP01Tutorials));
const substitute=(value,parameter=25)=>String(value||"")
  .replace(/\{CELLS\}/g,String(parameter))
  .replace(/\{PIXEL_SIZE\}/g,"0.2")
  .replace(/\{LENGTH\}/g,"8.0");

test("one chapter-level tutorial covers seven P01 goals and capstone",()=>{
  assert.equal(tutorials.length,1);
  const t=tutorials[0];
  assert.equal(t.chapter,"P01");
  assert.equal(t.steps.length,19);
  assert.deepEqual(t.goals.slice().sort(),[
    "P01-G01","P01-G02","P01-G03","P01-G04","P01-G05",
    "P01-G06","P01-G07","P01-CAPSTONE"
  ].sort());
  assert.deepEqual([...new Set(t.steps.map(s=>s.goal))].sort(),t.goals.slice().sort(),
    "each existing competency needs a meaningful scene, not merely a goal label");
  assert.equal(t.steps.filter(s=>s.checkpoint).length,1);
  assert.ok(t.steps.filter(s=>s.interactive).length>=1);
  assert.ok(!t.goals.includes("P01-REVIEW"),"Delayed review stays independent");
});

test("each narration step has aligned highlights, captions and valid visual data",()=>{
  for(const t of tutorials){
    assert.ok(t.steps.length>=5,t.id);
    for(const [index,step] of t.steps.entries()){
      assert.ok(step.title && step.say && step.note,t.id+":"+index);
      assert.ok(Array.isArray(step.focus)&&Array.isArray(step.visual));
      const lines=step.code?step.code.split("\n"):[];
      for(const line of step.focus)assert.ok(line>0&&line<=lines.length,t.id+":"+index+":"+line);
      for(const pair of step.visual)assert.equal(pair.length,2,t.id+":"+index);
      const tokens=JSON.stringify(step).match(/\{[A-Z_]+\}/g)||[];
      for(const token of tokens)assert.ok(["{CELLS}","{PIXEL_SIZE}","{LENGTH}"].includes(token),token);
    }
  }
});

test("science-first lessons show the destination without attributing it to introductory code",()=>{
  const imageFiles=new Map([
    ["labeled-nuclei","labeled-nuclei.png"],
    ["fluorescence-single","fluorescence-single.png"],
    ["fluorescence-examples","fluorescence-examples.png"],
    ["otsu-nuclei-mask","otsu-nuclei-mask.png"]
  ]);
  let previewCount=0;
  for(const t of tutorials){
    assert.ok(t.steps[0].preview?.image,t.id+" requires a concrete future-capability preview");
    assert.match(t.steps[0].note,/not|future|today|real|result/i,t.id);
    assert.match(t.steps.at(-1).note,/independent/i,t.id+" requires transfer");
    for(const [i,step] of t.steps.entries()){
      if(!step.preview)continue;
      previewCount++;
      const name=imageFiles.get(step.preview.image);
      assert.ok(name,t.id+":"+i+" unapproved course figure");
      assert.ok(readFileSync(new URL("assets/witz/"+name,root)).byteLength>1000,name);
      assert.ok(step.preview.label,t.id+":"+i);
    }
  }
  assert.ok(previewCount>=3,"Show scientific outcomes at the beginning and at the end");
  assert.match(viewerSource,/P01Tutorials|BioPythonP01Tutorials/);
  assert.match(viewerSource,/CREDITS.md/);
  assert.doesNotMatch(viewerSource,/bps-example-record|MediaRecorder|Save MP4/);
});

test("changed microscopy input produces real Python output, while length is invariant",()=>{
  const t=tutorials[0];
  const answer=t.steps.find(s=>s.title.startsWith("Reveal:"));
  const final=t.steps.find(s=>s.title==="Put it all together");
  const unexpected=new Set();
  for(const cells of [5,25,31,50]){
    const replace=v=>String(v).replaceAll("{CELLS}",String(cells))
      .replaceAll("{PIXEL_SIZE}","0.2").replaceAll("{LENGTH}","8.0");
    for(const step of [answer,final]){
      const result=spawnSync("python3",["-c",replace(step.code)],{encoding:"utf8",timeout:3000});
      assert.equal(result.status,0,result.stderr);
      assert.equal(result.stdout.trimEnd(),replace(step.output));
      unexpected.add(result.stdout);
    }
    assert.match(replace(final.output),/Length: 8.0 µm/);
  }
  assert.equal(unexpected.size,8,"The reports and printed counts must vary across inputs");
  const wrong=t.steps.find(s=>s.title==="Not all mistakes cause errors");
  const res=spawnSync("python3",["-c",wrong.code],{encoding:"utf8",timeout:3000});
  assert.equal(res.status,0,"A silent calibration error still executes successfully");
  assert.equal(res.stdout.trimEnd(),"16.0");
});

test("viewer syntax and optional integration do not change core course state",()=>{
  assert.doesNotThrow(()=>new Function(viewerSource));
  assert.match(viewerSource,/bps:lesson-change/);
  assert.match(viewerSource,/speechSynthesis/);
  assert.match(viewerSource,/awaitingPrediction/);
  assert.match(viewerSource,/▶ Chapter example/);
  assert.match(viewerSource,/state\.tutorial\.steps/);
  assert.doesNotMatch(viewerSource,/biopython\.p01\.v1/);
  for(const path of ["src/tutorials/p01-data.js","src/tutorials/p01-viewer.js","src/tutorials/p01-viewer.css"])assert.ok(indexSource.includes(path),path);
});

const interpreter=spawnSync("python3",["--version"],{encoding:"utf8"});
test("all displayed final runnable code agrees with fresh Python stdout",{
  skip:interpreter.error?"python3 is not available in this environment":false
},()=>{
  for(const tutorial of tutorials){
    for(const [index,step] of tutorial.steps.entries()){
      if(!step.code||!step.output)continue;
      const code=substitute(step.code,tutorial.parameter?.value??25);
      const expected=substitute(step.output,tutorial.parameter?.value??25);
      const run=spawnSync("python3",["-c",code],{encoding:"utf8",timeout:3000});
      assert.equal(run.error,undefined,tutorial.id+":"+index);
      if(expected.startsWith("NameError:")){
        assert.notEqual(run.status,0,tutorial.id+":"+index);
        assert.ok(run.stderr.includes(expected),tutorial.id+":"+index+" error mismatch");
      }else if(expected.includes("…")){
        assert.equal(run.status,0,tutorial.id+":"+index);
        assert.ok(run.stdout.includes("Help on built-in function len"),tutorial.id+":"+index);
      }else{
        assert.equal(run.status,0,tutorial.id+":"+index+" "+run.stderr);
        assert.equal(run.stdout.trimEnd(),expected,tutorial.id+":"+index+" output mismatch");
      }
    }
  }
});
