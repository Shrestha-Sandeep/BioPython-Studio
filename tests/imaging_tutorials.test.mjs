import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const ctx={window:{}};
for(const chapter of ['I01','I02']){
 const source=readFileSync(new URL('src/tutorials/'+chapter.toLowerCase()+'-data.js',root),'utf8');
 assert.doesNotThrow(()=>new Function(source),chapter+' syntax');
 vm.runInNewContext(source,ctx);
}
const tutorials=JSON.parse(JSON.stringify(ctx.window.BioPythonImagingTutorials));
const html=readFileSync(new URL('index.html',root),'utf8');
const viewer=readFileSync(new URL('src/tutorials/p01-viewer.js',root),'utf8');
const py=spawnSync('python3',['-c','import numpy; from PIL import Image'],{encoding:'utf8'});
test('I01 maps canonical goals',()=>{
 const t=tutorials.find(t=>t.chapter==='I01');
 assert.ok(t);
 const expected=Array.from({length:8},(_,i)=>'I01-G'+String(i+1).padStart(2,'0')).concat('I01-CAPSTONE');
 assert.deepEqual(t.goals,expected);
 assert.equal(t.steps.length,16);
 assert.equal(t.steps.filter(x=>x.checkpoint).length,1);
 assert.equal(t.steps.find(x=>x.checkpoint).output,'');
 assert.deepEqual([...new Set(t.steps.map(x=>x.goal))].sort(),expected.slice().sort());
 assert.match(t.steps.at(-1).note,/Independent/i);
 assert.ok(t.steps[0].preview);
 assert.match(html,/src\/tutorials\/i01-data.js/);
 assert.ok(html.indexOf('src/tutorials/i01-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 assert.match(viewer,/BioPythonImagingTutorials/);
});
test('I02 matches its six ROI goals and independent capstone',()=>{
 const t=tutorials.find(t=>t.chapter==='I02');
 assert.ok(t,'I02 not registered');
 const expected=Array.from({length:6},(_,i)=>'I02-G'+String(i+1).padStart(2,'0')).concat('I02-CAPSTONE');
 assert.deepEqual(t.goals,expected);
 assert.equal(t.steps.length,17);
 assert.equal(t.steps.filter(x=>x.checkpoint).length,1);
 assert.equal(t.steps.find(x=>x.checkpoint).output,'');
 assert.deepEqual([...new Set(t.steps.map(x=>x.goal))].sort(),expected.slice().sort());
 assert.match(t.steps.at(-1).note,/Independent/i);
 assert.ok(html.indexOf('src/tutorials/i01-data.js')<html.indexOf('src/tutorials/i02-data.js'));
 assert.ok(html.indexOf('src/tutorials/i02-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 for(const scene of t.steps){
   assert.ok(scene.say.split(/\s+/).length>=18,scene.title);
   assert.ok(scene.note.length>=30,scene.title);
   const len=scene.code?scene.code.split('\n').length:0;
   for(const line of scene.focus)assert.ok(line>0&&line<=len,scene.title+':'+line);
 }
 assert.ok(t.steps.some(x=>x.code.includes("tiffinfo")&&x.note.includes("OME")));
});
test('I02 fresh Python outputs are exact',{skip:py.status!==0?'Install NumPy/Pillow':false},()=>{
 const t=tutorials.find(x=>x.chapter==='I02');
 let executed=0;
 for(const [i,step] of t.steps.entries()){
  if(!step.code||!step.output)continue;
  const run=spawnSync('python3',['-c',step.code],{encoding:'utf8',timeout:7000});
  assert.equal(run.status,0,'I02 '+i+' '+step.title+': '+run.stderr);
  assert.equal(run.stdout.trimEnd(),step.output,'I02 '+i+': '+step.title);
  executed++;
 }
 assert.ok(executed>=12,'I02 executable examples '+executed);
});
test('I02 crops use changed bounds without mutating original source',{skip:py.status!==0?'Install NumPy':false},()=>{
 const source="import numpy as np\nsrc=np.arange(30).reshape(5,6)\nroi=src[2:5,1:4].copy()\nroi[0,0]=99\nprint(src[2,1],roi.shape,np.shares_memory(src,roi))";
 const r=spawnSync('python3',['-c',source],{encoding:'utf8',timeout:7000});
 assert.equal(r.status,0,r.stderr);
 assert.equal(r.stdout.trim(),'13 (3, 3) False');
});

test('I01 keeps the published-figure and synthetic-array boundary',()=>{
 const t=tutorials.find(t=>t.chapter==='I01');
 for(const step of t.steps){
   assert.ok(step.say?.split(/\s+/).length>=18,step.title);
   assert.ok(step.note?.length>28,step.title);
   assert.ok(Array.isArray(step.visual)&&Array.isArray(step.focus));
   const lines=step.code?step.code.split('\n'):[];
   for(const n of step.focus)assert.ok(n>0&&n<=lines.length,step.title+':'+n);
   if(step.output)assert.ok(step.code,step.title);
   if(step.preview)assert.equal(step.preview.image,'fluorescence-single');
 }
 assert.ok(t.steps.some(step=>step.code.includes('image_path')&&!step.output));
 assert.ok(t.steps.some(step=>step.say.includes('RGB')));
 assert.ok(t.steps.some(step=>step.say.includes('calibrat')));
});

test('I01 runnable outputs equal fresh real Python',{skip:py.status!==0?'Install NumPy and Pillow':false},()=>{
 const t=tutorials.find(t=>t.chapter==='I01');
 let tested=0;
 for(const [i,s] of t.steps.entries()){
  if(!s.code||!s.output)continue;
  const out=spawnSync('python3',['-c',s.code],{encoding:'utf8',timeout:7000});
  assert.equal(out.status,0,'I01 step '+i+': '+out.stderr);
  assert.equal(out.stdout.trimEnd(),s.output,'I01 step '+i+': '+s.title);
  tested++;
 }
 assert.ok(tested>=11,tested+' runnable examples');
});
test('indexing and dtype changed-input cases are verified',{skip:py.status!==0?'Install NumPy':false},()=>{
 for(const [code,output] of [
  ["import numpy as np\nx=np.arange(12).reshape(3,4)\nprint(int(x[1,2]))","6"],
  ["import numpy as np\nx=np.arange(12).reshape(3,4)\nprint(int(x[2,1]))","9"],
  ["import numpy as np\nx=np.array([[1,2],[3,4]],dtype=np.uint16)\nprint(x.dtype,x.shape)","uint16 (2, 2)"],
  ["import numpy as np\nx=np.zeros((3,2,3),dtype=np.uint8)\nprint(x.shape)","(3, 2, 3)"]
 ]){
  const res=spawnSync('python3',['-c',code],{encoding:'utf8',timeout:7000});
  assert.equal(res.status,0,res.stderr);
  assert.equal(res.stdout.trim(),output);
 }
});
