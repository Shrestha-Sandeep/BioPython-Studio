import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { EXERCISE_ASSIGNMENTS, WITZ_FIGURES, SUPPLEMENTS, resolveExercises } from "../src/witz-lessons.js";
import { MISSIONS } from "../src/course.js";

const ROOT=new URL("../",import.meta.url);
const data=JSON.parse(fs.readFileSync(new URL("../curriculum/witz_exercise_inventory.json",import.meta.url),"utf8"));

test("Witz material audited from original notebooks with precise cells",()=>{
 assert.equal(data.chapters.length,12);
 assert.equal(data.notebooks.length,7);
 assert.equal(data.notebooks.reduce((sum,n)=>sum+n.numbered_prompts.length,0),54);
 assert.equal(data.assets && Object.keys(data.assets).length,6);
 assert.ok(data.license.includes("BSD"));
 for(const n of data.notebooks){
   assert.ok(n.url.startsWith("https://github.com/guiwitz/PyImageCourse_beginner/blob/master/"));
   assert.ok(n.numbered_prompts.every(p=>Number.isInteger(p.cell)&&p.original.length>12));
 }
});
test("mapped Witz exercises are unique and meaningful",()=>{
 const missionIds=new Set(MISSIONS.map(m=>m.id));
 const seen=new Set();let total=0;
 for(const id of Object.keys(EXERCISE_ASSIGNMENTS)){
   assert.ok(missionIds.has(id), "Unknown mission "+id);
   const steps=resolveExercises(data,id);
   assert.ok(steps.length>=3 && steps.length<=7,id);
   total+=steps.length;
   for(const step of steps){
     assert.ok(!seen.has(step.id),"Duplicate source exercise "+step.id);
     seen.add(step.id);
     assert.ok(step.prompt.length>=10);
     assert.ok(step.sourceUrl.endsWith(".ipynb"));
   }
 }
 assert.equal(total,47);
 assert.equal(resolveExercises(data,"ml-01").length,0);
 assert.ok(resolveExercises(data,"im-03").some(x=>x.modernized));
});
test("Witz images are real bundled PNG notebook outputs with provenance",()=>{
 for(const [id,fig] of Object.entries(WITZ_FIGURES)){
  assert.ok(missionIds().has(id));
  const p=new URL("../"+fig.path,import.meta.url);
  const buf=fs.readFileSync(p);
  assert.ok(buf.length>3000);
  assert.equal(buf.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
  assert.ok(fig.notebook.endsWith(".ipynb") && Number.isInteger(fig.cell));
 }
});
function missionIds(){return new Set(MISSIONS.map(m=>m.id));}
test("supporting references are optional enhancements, not parallel courses",()=>{
 for(const [id,s] of Object.entries(SUPPLEMENTS)){
  assert.ok(missionIds().has(id));
  assert.ok(s.url.startsWith("https://"));
  if(["im-01","im-02","im-03","im-04","im-06"].includes(id))assert.ok(s.enhancement?.length>25);
 }
});
