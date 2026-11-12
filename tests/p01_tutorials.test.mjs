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

test("four examples cover P01 goals and capstone exactly once",()=>{
  assert.equal(tutorials.length,4);
  const goals=tutorials.flatMap(t=>t.goals);
  assert.equal(new Set(goals).size,goals.length);
  assert.deepEqual(goals.slice().sort(),[
    "P01-G01","P01-G02","P01-G03","P01-G04","P01-G05",
    "P01-G06","P01-G07","P01-CAPSTONE"
  ].sort());
  assert.ok(tutorials.reduce((n,t)=>n+t.steps.length,0)>=24);
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
  assert.ok(previewCount>=7,"The core scientific outcome must be shown, not merely asserted");
  assert.match(viewerSource,/P01Tutorials|BioPythonP01Tutorials/);
  assert.match(viewerSource,/CREDITS.md/);
  assert.doesNotMatch(viewerSource,/bps-example-record|MediaRecorder|Save MP4/);
});

test("changing scientific inputs changes expected outputs, not code structure",()=>{
  const cases=[
    {id:"p01-values",changes:[{cells:25},{cells:31}]},
    {id:"p01-calculations",changes:[{pixelSize:0.2},{pixelSize:0.3},{pixelSize:0.6}]},
    {id:"p01-report",changes:[{cells:25},{cells:31}]}
  ];
  for(const {id,changes} of cases){
    const tutorial=tutorials.find(t=>t.id===id);
    const last=tutorial.steps.findLast(s=>s.output&&s.code);
    for(const values of changes){
      const cells=values.cells??25,pixelSize=values.pixelSize??0.2;
      const replace=(v)=>String(v).replaceAll("{CELLS}",String(cells))
        .replaceAll("{PIXEL_SIZE}",pixelSize.toFixed(1))
        .replaceAll("{LENGTH}",(40*pixelSize).toFixed(1));
      const result=spawnSync("python3",["-c",replace(last.code)],{encoding:"utf8",timeout:3000});
      assert.equal(result.status,0,id+":"+JSON.stringify(values)+":"+result.stderr);
      assert.equal(result.stdout.trimEnd(),replace(last.output),id+":"+JSON.stringify(values));
    }
  }
});

test("viewer syntax and optional integration do not change core course state",()=>{
  assert.doesNotThrow(()=>new Function(viewerSource));
  assert.match(viewerSource,/bps:lesson-change/);
  assert.match(viewerSource,/speechSynthesis/);
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
