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

test("MP4 experiment keeps selected voice and speed and refuses silent capture",()=>{
  assert.match(viewerSource,/navigator\.mediaDevices\.getDisplayMedia/);
  assert.match(viewerSource,/MediaRecorder\.isTypeSupported/);
  assert.match(viewerSource,/video\/mp4/);
  assert.match(viewerSource,/const chosen=findVoice\(\)/);
  assert.match(viewerSource,/session\.speed=rateSelect\.value|speed:rateSelect\.value/);
  assert.match(viewerSource,/if\(!session\.detected\)/);
  assert.match(viewerSource,/Voice playback could not start|The narrator stopped unexpectedly/);
  assert.match(viewerSource,/bps-example-record/);
  assert.doesNotMatch(viewerSource,/https:\/\/.*tts/);
});
