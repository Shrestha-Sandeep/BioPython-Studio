import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const ctx={window:{}};
for(const chapter of ['I01','I02','I03','I04','I05','I06']){
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

test('I03 maps 10 canonical numerical microscopy goals',()=>{
 const t=tutorials.find(x=>x.chapter==='I03');
 assert.ok(t);
 const expected=Array.from({length:10},(_,i)=>'I03-G'+String(i+1).padStart(2,'0')).concat('I03-CAPSTONE');
 assert.deepEqual(t.goals,expected);
 assert.equal(t.steps.length,17);
 assert.equal(t.steps.filter(x=>x.checkpoint).length,1);
 assert.equal(t.steps.find(x=>x.checkpoint).output,'');
 assert.deepEqual([...new Set(t.steps.map(x=>x.goal))].sort(),expected.slice().sort());
 assert.match(t.steps.at(-1).note,/Independent/i);
 assert.ok(html.indexOf('src/tutorials/i02-data.js')<html.indexOf('src/tutorials/i03-data.js'));
 assert.ok(html.indexOf('src/tutorials/i03-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 for(const scene of t.steps){
  assert.ok(scene.say?.split(/\s+/).length>=18,scene.title);
  assert.ok(scene.note?.length>=30,scene.title);
  const n=scene.code?scene.code.split('\n').length:0;
  for(const line of scene.focus)assert.ok(line>0&&line<=n,scene.title+':'+line);
 }
 assert.match(t.steps[0].note,/synthetic/i);
 assert.match(t.steps.find(x=>x.checkpoint).say,/predict/i);
});
test('I03 outputs are identical to fresh NumPy',{skip:py.status!==0?'NumPy not installed':false},()=>{
 const t=tutorials.find(x=>x.chapter==='I03');
 let tested=0;
 for(const [i,step] of t.steps.entries()){
  if(!step.code||!step.output)continue;
  const r=spawnSync('python3',['-c',step.code],{encoding:'utf8',timeout:8000});
  assert.equal(r.status,0,'I03 '+i+': '+r.stderr);
  assert.equal(r.stdout.trimEnd(),step.output,'I03 '+i+' '+step.title);
  tested++;
 }
 assert.ok(tested>=13,tested+' runnable I03 examples');
});
test('I03 changed-input masks and uint8 widened arithmetic',{skip:py.status!==0?'NumPy not installed':false},()=>{
 const samples=[
  ["import numpy as np\nx=np.array([np.nan,.2,.9]);print((np.isfinite(x)&(x>=.8)).tolist())","[False, False, True]"],
  ["import numpy as np\nx=np.array([251],dtype=np.uint8);print((x+np.uint8(10)).tolist());print((x.astype(np.int64)+10).tolist())","[5]\n[261]"],
  ["import numpy as np\nx=np.array([[2,np.nan,8],[4,6,10]]);v=x[np.isfinite(x)];print(len(v),float(v.mean()))","5 6.0"]
 ];
 for(const [code,expected] of samples){
  const run=spawnSync('python3',['-c',code],{encoding:'utf8',timeout:7000});
  assert.equal(run.status,0,run.stderr);
  assert.equal(run.stdout.trimEnd(),expected);
 }
});

const plottingPython=spawnSync('python3',['-c','import numpy, matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt'],{encoding:'utf8'});
test('I04 maps its six actual plotting and display goals',()=>{
 const t=tutorials.find(x=>x.chapter==='I04');
 assert.ok(t,'I04 not loaded');
 const expected=Array.from({length:6},(_,i)=>'I04-G'+String(i+1).padStart(2,'0')).concat('I04-CAPSTONE');
 assert.deepEqual(t.goals,expected);
 assert.equal(t.steps.length,16);
 assert.equal(t.steps.filter(s=>s.checkpoint).length,1);
 assert.equal(t.steps.find(s=>s.checkpoint).output,'');
 assert.deepEqual([...new Set(t.steps.map(s=>s.goal))].sort(),expected.slice().sort());
 assert.match(t.steps.at(-1).note,/Independent/i);
 assert.ok(t.steps[0].preview?.image);
 assert.ok(html.indexOf('src/tutorials/i03-data.js')<html.indexOf('src/tutorials/i04-data.js'));
 assert.ok(html.indexOf('src/tutorials/i04-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 for(const step of t.steps){
  assert.ok(step.say.split(/\s+/).length>=18,step.title);
  assert.ok(step.note.length>=30,step.title);
  const lines=step.code?step.code.split('\n'):[];
  for(const line of step.focus)assert.ok(line>0&&line<=lines.length,step.title+':'+line);
  if(step.output)assert.ok(step.code,step.title);
  if(step.preview)assert.equal(step.preview.image,'fluorescence-single');
 }
 assert.ok(t.steps.some(s=>s.code.includes('image_path')&&!s.output));
 assert.ok(t.steps.some(s=>s.say.includes('PNG')));
 assert.ok(t.steps.some(s=>s.note.includes('synthetic')));
});
test('I04 full example stdout matches real Matplotlib+NumPy in new interpreter',{
 skip:plottingPython.status!==0?'Matplotlib not installed':false
},()=>{
 const t=tutorials.find(x=>x.chapter==='I04');
 let count=0;
 for(const [i,scene] of t.steps.entries()){
  if(!scene.code||!scene.output)continue;
  const cp=spawnSync('python3',['-c',scene.code],{
    encoding:'utf8',timeout:20000,env:{...process.env,MPLBACKEND:'Agg'}
  });
  assert.equal(cp.status,0,'I04 step '+i+' '+scene.title+': '+cp.stderr);
  assert.equal(cp.stdout.trimEnd(),scene.output,'I04 '+i+' '+scene.title);
  count++;
 }
 assert.ok(count>=11,'I04 only '+count+' executable examples');
});
test('I04 changed-input visualization preserves numbers and explicit count',{
 skip:plottingPython.status!==0?'Matplotlib not installed':false
},()=>{
 const checks=[
  ["import numpy as np\nimport matplotlib.pyplot as plt\nx=np.array([[50,100],[200,255]])\ny=x.copy();fig,ax=plt.subplots();ax.imshow(x,cmap='gray',vmin=60,vmax=150)\nprint(np.array_equal(x,y),ax.images[0].get_clim())","True (60.0, 150.0)"],
  ["import numpy as np\nvalues=np.array([0,1,2,3,4,5]);counts,edges=np.histogram(values,bins=[0,3,6]);print(counts.tolist(),int(counts.sum()))","[3, 3] 6"],
  ["import matplotlib.pyplot as plt\nfig,axes=plt.subplots(1,2);print(len(fig.axes),axes[0].get_xlabel())","2 "]
 ];
 for(const [code,expected] of checks){
  const run=spawnSync('python3',['-c',code],{
    encoding:'utf8',timeout:20000,env:{...process.env,MPLBACKEND:'Agg'}
  });
  assert.equal(run.status,0,run.stderr);
  assert.equal(run.stdout.trimEnd(),expected.trimEnd());
 }
});

const segmentationPython=spawnSync('python3',['-c','import numpy; from skimage.filters import gaussian, median, threshold_otsu'],{encoding:'utf8'});
test('I05 maps all shipped thresholding goals and preserves prediction privacy',()=>{
 const t=tutorials.find(x=>x.chapter==='I05');
 assert.ok(t);
 const ids=Array.from({length:6},(_,i)=>'I05-G'+String(i+1).padStart(2,'0')).concat('I05-CAPSTONE');
 assert.deepEqual(t.goals,ids);
 assert.equal(t.steps.length,16);
 assert.equal(t.steps.filter(s=>s.checkpoint).length,1);
 assert.equal(t.steps.find(s=>s.checkpoint).output,'');
 assert.deepEqual([...new Set(t.steps.map(s=>s.goal))].sort(),ids.slice().sort());
 assert.match(t.steps.at(-1).note,/Independent/i);
 assert.ok(html.indexOf('src/tutorials/i04-data.js')<html.indexOf('src/tutorials/i05-data.js'));
 assert.ok(html.indexOf('src/tutorials/i05-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 assert.equal(t.steps[0].preview.image,'otsu-nuclei-mask');
 for(const step of t.steps){
  assert.ok(step.say.trim().split(/\s+/).length>=18,step.title);
  assert.ok(step.note.length>=30,step.title);
  const n=step.code?step.code.split('\n').length:0;
  for(const line of step.focus)assert.ok(line>=1&&line<=n,step.title+':'+line);
  if(step.output)assert.ok(step.code,step.title);
 }
 assert.ok(t.steps.some(s=>s.say.includes('Otsu')));
 assert.ok(t.steps.some(s=>s.say.includes('candidate')));
});
test('I05 all displayed numerical masks and filtering outputs equal fresh Python',{
 skip:segmentationPython.status!==0?'scikit-image not installed':false
},()=>{
 const t=tutorials.find(x=>x.chapter==='I05');
 let count=0;
 for(const [index,s] of t.steps.entries()){
  if(!s.code||!s.output)continue;
  const cp=spawnSync('python3',['-c',s.code],{encoding:'utf8',timeout:16000});
  assert.equal(cp.status,0,'I05 step '+index+' '+s.title+': '+cp.stderr);
  assert.equal(cp.stdout.trimEnd(),s.output,'I05 step '+index+': '+s.title);
  count++;
 }
 assert.ok(count>=12,'only '+count+' executable scenes');
});
test('I05 unseen thresholds and empty-union IoU have deterministic behavior',{
 skip:segmentationPython.status!==0?'scikit-image not installed':false
},()=>{
 const cases=[
  ["import numpy as np\nx=np.array([[0,5,10],[15,20,25]])\nprint([int((x>t).sum()) for t in (5,10,20)])","[4, 3, 1]"],
  ["import numpy as np\nx=np.array([0,0,0]);a=x>10;b=x>20;u=np.logical_or(a,b).sum();print(float(np.logical_and(a,b).sum()/u) if u else 1.0)","1.0"],
  ["from skimage.filters import threshold_otsu\nimport numpy as np\nx=np.array([0,0,2,2,10,10]);print(int(threshold_otsu(x)),int((x>2).sum()))","2 2"]
 ];
 for(const [code,expected] of cases){
  const run=spawnSync('python3',['-c',code],{encoding:'utf8',timeout:12000});
  assert.equal(run.status,0,run.stderr);
  assert.equal(run.stdout.trimEnd(),expected);
 }
});

const morphologyPython=spawnSync('python3',['-c','import numpy; import skimage; from scipy import ndimage'],{encoding:'utf8'});
test('I06 goal mapping and source-safe chapter narrative',()=>{
 const t=tutorials.find(x=>x.chapter==='I06');
 assert.ok(t,'I06 not registered');
 const expected=Array.from({length:7},(_,i)=>'I06-G'+String(i+1).padStart(2,'0')).concat('I06-CAPSTONE');
 assert.deepEqual(t.goals,expected);
 assert.equal(t.steps.length,18);
 assert.equal(t.steps.filter(s=>s.checkpoint).length,1);
 assert.equal(t.steps.find(s=>s.checkpoint).output,'');
 assert.deepEqual([...new Set(t.steps.map(s=>s.goal))].sort(),expected.slice().sort());
 assert.match(t.steps.at(-1).note,/Independent/);
 assert.equal(t.steps[0].preview.image,'otsu-nuclei-mask');
 assert.ok(html.indexOf('src/tutorials/i05-data.js')<html.indexOf('src/tutorials/i06-data.js'));
 assert.ok(html.indexOf('src/tutorials/i06-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 for(const s of t.steps){
  assert.ok(s.say.trim().split(/\\s+/).length>=18,s.title);
  assert.ok(s.note.length>=30,s.title);
  const lines=s.code?s.code.split('\\n'):[];
  for(const n of s.focus)assert.ok(n>=1&&n<=lines.length,s.title+':'+n);
  if(s.output)assert.ok(s.code,s.title);
 }
 assert.match(t.steps[0].note,/rendered teaching context/);
 assert.ok(t.steps.some(s=>s.say.includes('three-dimensional')));
 assert.ok(t.steps.some(s=>s.code.includes('watershed')));
});
test('I06 exact executed numerical output parity under pinned scientific Python',{
 skip:morphologyPython.status!==0?'scikit-image or scipy missing':false
},()=>{
 const t=tutorials.find(x=>x.chapter==='I06');
 let count=0;
 for(const [i,s] of t.steps.entries()){
  if(!s.code||!s.output)continue;
  const run=spawnSync('python3',['-c',s.code],{encoding:'utf8',timeout:16000});
  assert.equal(run.status,0,'I06 '+i+' '+s.title+': '+run.stderr);
  assert.equal(run.stdout.trimEnd(),s.output,'I06 '+i+' '+s.title);
  count++;
 }
 assert.ok(count>=14,'Only '+count+' executable examples');
});
test('I06 changed-input morphology, connectivity, projection and empty-mask cases',{
 skip:morphologyPython.status!==0?'scikit-image or scipy missing':false
},()=>{
 const cases=[
  ["import numpy as np\\nfrom skimage.measure import label\\nx=np.eye(5,dtype=bool)\\nprint(label(x,connectivity=1).max(),label(x,connectivity=2).max())","5 1"],
  ["import numpy as np\\nfrom skimage.segmentation import clear_border\\nx=np.ones((2,2),bool)\\nprint(int(clear_border(x).sum()))","0"],
  ["import numpy as np\\nfrom skimage.measure import label,regionprops\\nx=np.zeros((3,3),bool)\\nprint(len(regionprops(label(x,connectivity=1))))","0"],
  ["import numpy as np\\nfrom skimage.measure import label\\nx=np.zeros((3,4,4),bool);x[0,1,1]=1;x[2,1,1]=1\\nprint(label(x,connectivity=1).max(),label(x.max(axis=0),connectivity=1).max())","2 1"]
 ];
 for(const [code,expected] of cases){
  const r=spawnSync('python3',['-c',code],{encoding:'utf8',timeout:15000});
  assert.equal(r.status,0,r.stderr);assert.equal(r.stdout.trimEnd(),expected);
 }
});
