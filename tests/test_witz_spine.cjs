'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const CoursePath=require('../course-path.js');
const root=path.join(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'curriculum','v3_manifest.json'),'utf8'));
const spine=JSON.parse(fs.readFileSync(path.join(root,'curriculum','witz_spine.json'),'utf8'));

test('Witz-first route is a single unlocked 156-skill course',()=>{
  const sample=manifest.competencies.slice(0,2).map(c=>({id:c.id}));
  const result=CoursePath.build(manifest,{activities:sample},spine);
  assert.equal(result.length,156);
  assert.deepEqual(result.map(x=>x.number),spine.ordered_competency_numbers);
  assert.equal(result.filter(x=>x.stage==='Python').length,36);
  assert.equal(result.filter(x=>x.stage==='Microscopy').length,91);
  assert.equal(result.filter(x=>x.stage==='NGS').length,17);
  assert.equal(result.filter(x=>x.stage==='ML').length,12);
  assert.ok(result.every(x=>x.mission && x.mission.title));
  assert.ok(result.some(x=>x.kind==='activity'));
  assert.ok(result.some(x=>x.kind==='legacy'));
  assert.ok(result.some(x=>x.kind==='planned'));
  assert.ok(result.every(x=>!('locked' in x)));
});

test('Historical curriculum construction remains compatible',()=>{
 const route=CoursePath.build(manifest,{activities:[]});
 assert.equal(route.length,156);
 assert.equal(route[0].mission,null);
 assert.equal(route.filter(c=>c.stage==='Python').length,88);
});
