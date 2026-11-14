import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';

const root=new URL('../',import.meta.url),read=x=>readFileSync(new URL(x,root),'utf8');
const ctx={window:{}};
for(const file of ['a00-data.js','a01-data.js']){
 const source=read('src/tutorials/'+file);
 assert.doesNotThrow(()=>new Function(source));
 vm.runInNewContext(source,ctx);
}
const chapters=JSON.parse(JSON.stringify(ctx.window.BioPythonAdvancedTutorials));
const t=chapters.find(x=>x.chapter==='A01'),images=read('src/tutorials/advanced-illustrations.js'),html=read('index.html');
function py(code){
 const r=spawnSync('python3',['-W','error','-c',code],{encoding:'utf8',timeout:22000});
 assert.equal(r.status,0,code+'\n'+r.stderr);
 return r.stdout.trimEnd();
}
const hasTiff=spawnSync('python3',['-c','import numpy,tifffile'],{encoding:'utf8'}).status===0;
test('A01 exact chapter goals and 17 scenes, one withheld prediction and no leaked delayed task',()=>{
 assert.deepEqual(chapters.map(x=>x.chapter),['A00','A01']);
 assert.ok(t); assert.equal(t.steps.length,17);
 assert.deepEqual(t.goals,['A01-G01','A01-G02','A01-G03','A01-G04','A01-CAPSTONE']);
 assert.deepEqual([...new Set(t.steps.map(x=>x.goal))],t.goals);
 assert.deepEqual(t.steps.flatMap((s,i)=>s.checkpoint?[i]:[]),[8]);
 assert.equal(t.steps[8].output,'');
 assert.equal(t.steps[8].visual.at(-1)[1],'Withheld');
 assert.equal(t.steps[9].output,'2');
 assert.equal(t.steps.at(-1).code,'');
 assert.equal(t.steps.at(-1).output,'');
 assert.match(t.steps.at(-1).title,/Independent transfer/i);
 assert.ok(!t.goals.includes('A01-REVIEW'));
 for(const s of t.steps){
  assert.ok(s.say.split(/\s+/).length>=17,s.title);
  assert.ok(s.note.length>=60,s.title);
  assert.ok(s.visual.every(v=>v.length===2),s.title);
  const count=s.code?s.code.split('\n').length:0;
  for(const k of s.focus) assert.ok(k>=1&&k<=count,s.title+': '+k);
  if(s.output)assert.ok(s.code,s.title);
 }
});
test('A01 original SVG diagrams and advanced-only existing viewer script order',()=>{
 assert.ok(html.indexOf('src/tutorials/a00-data.js')<html.indexOf('src/tutorials/a01-data.js'));
 assert.ok(html.indexOf('src/tutorials/a01-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 assert.match(images,/const DATA01=/);
 assert.match(images,/function axis\(/);
 assert.match(images,/function pixels\(/);
 assert.match(images,/ch==="A01"/);
 assert.match(images,/role:"img"/);
 const block=images.slice(images.indexOf('const DATA01='),images.indexOf('const DATA02='));
 assert.equal((block.match(/kind:"(?:route|split|cards|animals|axis|pixels)"/g)||[]).length,17);
});
test('A01 all printed NumPy and real tifffile values agree with fresh native Python',{skip:!hasTiff?'Install NumPy and tifffile':false},()=>{
 let n=0;
 for(const [i,s] of t.steps.entries()){
  if(!s.code||!s.output)continue;
  assert.equal(py(s.code),s.output,'A01 scene '+(i+1)+' '+s.title);
  n++;
 }
 assert.ok(n>=13,'Too few independent source checks: '+n);
});
test('A01 adversarial axes, native dtype, safe subtraction, scale and source hashes',{skip:!hasTiff?'Install NumPy and tifffile':false},()=>{
 const cases=[
 ["import numpy as np;a=np.arange(72,dtype=np.uint16).reshape(2,3,2,2,3);print(int(a[1,2,0,0,0]),int(a[1,0,1,0,0]))","60 42"],
 ["import numpy as np;a=np.arange(72,dtype=np.uint16).reshape(2,3,2,2,3);print(a[1,2,0].shape);print(a[1,2,1].shape)","(2, 3)\n(2, 3)"],
 ["shape=(2,3,2,2,3);ch=5;print(0<=ch<shape[1])","False"],
 ["import numpy as np;a=np.array([40000,65535],dtype=np.uint16);print(a.astype(np.uint8).tolist());print(a.astype(np.int64).tolist())","[64, 255]\n[40000, 65535]"],
 ["import numpy as np;a=np.array([100,1000],dtype=np.uint16);print((a-np.uint16(200)).tolist());print(np.maximum(0,a.astype(float)-200).tolist())","[65436, 800]\n[0.0, 800.0]"],
 ["verified=False;area=25;scale=.2;print(area*scale**2 if verified else None);verified=True;print(round(area*scale**2,2))","None\n1.0"],
 ["import hashlib;print(hashlib.sha256(b'abc').hexdigest()!=hashlib.sha256(b'abd').hexdigest())","True"],
 ["import io,numpy as np,tifffile;raw=io.BytesIO();tifffile.imwrite(raw,np.array([[40000]],dtype=np.uint16),photometric='minisblack');r=tifffile.imread(io.BytesIO(raw.getvalue()));print(r.dtype.name,int(r[0,0]))","uint16 40000"]
 ];
 for(const [src,expect] of cases)assert.equal(py(src),expect,src);
});
