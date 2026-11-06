import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { MISSIONS, STAGES, primarySource } from "../src/course.js";

test("one clear complete four-stage mission preview with unlocked navigation", () => {
 assert.deepEqual(STAGES, ["Python", "Microscopy", "NGS", "ML"]);
 assert.equal(MISSIONS.length, 18);
 assert.equal(new Set(MISSIONS.map(m=>m.id)).size, MISSIONS.length);
 let prior = 0;
 const grouped = {};
 for(const m of MISSIONS){
   const ix = STAGES.indexOf(m.stage);
   assert.ok(ix>=prior && ix>=0,"Out-of-order stage "+m.id);
   prior=ix; grouped[m.stage]=(grouped[m.stage]||0)+1;
   for(const field of ["title","outcome","concept","apply","prove","why","source","starter"]) assert.ok(m[field],"Missing "+field+" in "+m.id);
   assert.ok(primarySource(m).startsWith("https://"));
 }
 assert.deepEqual(grouped,{Python:4,Microscopy:8,NGS:3,ML:3});
});
test("preview is honest and includes accessible core interaction",()=>{
 const html=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");
 for(const item of ["role=\"tablist\"","data-tab=\"learn\"","data-tab=\"apply\"","data-tab=\"prove\"","id=\"code-editor\"","id=\"stage-nav\"","id=\"mission-list\"","id=\"run-button\""]){
  assert.ok(html.includes(item),"Missing "+item);
 }
 assert.ok(html.includes("type=\"button\" disabled"),"Preview must not pretend to execute Python.");
 const js=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");
 assert.ok(js.includes("localStorage.setItem"));
 assert.ok(!js.includes("eval("));
});
test("source map and design record exist",()=>{
 const docs=["docs/PRODUCT_BLUEPRINT.md","docs/SOURCE_LEDGER.md","README.md"];
 for(const name of docs)assert.ok(fs.statSync(new URL("../"+name,import.meta.url)).size>1000);
});