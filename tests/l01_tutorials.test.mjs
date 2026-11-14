import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';

const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const ctx={window:{}};
const source=read('src/tutorials/l01-data.js');
const images=read('src/tutorials/ml-illustrations.js');
const html=read('index.html'),viewer=read('src/tutorials/p01-viewer.js');
assert.doesNotThrow(()=>new Function(source));
assert.doesNotThrow(()=>new Function(images));
vm.runInNewContext(source,ctx);
const t=JSON.parse(JSON.stringify(ctx.window.BioPythonMLTutorials[0]));
const hasSK=spawnSync('python3',['-c','from sklearn.model_selection import GroupShuffleSplit; from sklearn.impute import SimpleImputer'],{encoding:'utf8'}).status===0;

test('L01 exact canonical subject, leakage, grouped split and training-only goals',()=>{
 assert.equal(t.chapter,'L01');
 assert.deepEqual(t.goals,['L01-G01','L01-G02','L01-G03','L01-G04','L01-CAPSTONE']);
 assert.equal(t.steps.length,17);
 assert.deepEqual([...new Set(t.steps.map(s=>s.goal))].sort(),t.goals.slice().sort());
 assert.deepEqual(t.steps.flatMap((s,i)=>s.checkpoint?[i]:[]),[11]);
 assert.equal(t.steps[11].output,'');
 assert.equal(t.steps[12].output,'2.0');
 assert.match(t.steps.at(-1).title,/Independent transfer/i);
 assert.equal(t.steps.at(-1).code,'');
 assert.equal(t.steps.at(-1).output,'');
 assert.ok(!t.steps.some(s=>s.code.includes('sample.')||s.code.includes('data.')),'Must never leak Prove task sources');
 for(const s of t.steps){
  assert.ok(s.say.trim().split(/\s+/).length>=18,'Narration '+s.title);
  assert.ok(s.note.length>=40,'Source boundary '+s.title);
  assert.ok(s.visual.every(item=>item.length===2),'Visual '+s.title);
  const count=s.code?s.code.split('\n').length:0;
  for(const line of s.focus)assert.ok(line>=1&&line<=count,s.title+' line '+line);
  if(s.output)assert.ok(s.code,s.title);
 }
});
test('L01 isolated original SVG and existing Learn-only dialog, no new screen',()=>{
 assert.ok(html.indexOf('src/tutorials/ml-illustrations.js')<html.indexOf('src/tutorials/l01-data.js'));
 assert.ok(html.indexOf('src/tutorials/l01-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 assert.match(viewer,/BioPythonMLTutorials/);
 assert.match(viewer,/BioPythonMLIllustrations/);
 assert.match(viewer,/d.phase==="learn"/);
 assert.match(images,/ch==="L01"/);
 assert.match(images,/role:"img"/);
 assert.match(images,/kind:"impute"/);
 assert.match(images,/kind:"overlap"/);
});
test('L01 all printed examples execute in fresh scikit-learn Python',{skip:!hasSK?'Install scikit-learn':false},()=>{
 let n=0;
 for(const [i,s] of t.steps.entries()){
  if(!s.code||!s.output)continue;
  const r=spawnSync('python3',['-W','error','-c',s.code],{encoding:'utf8',timeout:12000});
  assert.equal(r.status,0,'L01 '+(i+1)+' '+s.title+': '+r.stderr);
  assert.equal(r.stdout.trimEnd(),s.output,'L01 '+(i+1)+' '+s.title);
  n++;
 }
 assert.ok(n>=13,'Expected at least 13 independently reproducible outputs');
});
test('L01 changed inputs: subject labels, group overlap and training-only preprocessing',{skip:!hasSK?'Install scikit-learn':false},()=>{
 const checks=[
 ["rows=[('A',0),('A',1),('B',1)];print(sorted(a for a in set(x for x,y in rows) if len({y for x,y in rows if x==a})>1))","['A']"],
 ["g=['A','A','B','B'];print(sorted(set(g[i] for i in [0,2])&set(g[i] for i in [1,3])))","['A', 'B']"],
 ["from sklearn.model_selection import GroupShuffleSplit;g=['A','A','A','B','C','D'];tr,te=next(GroupShuffleSplit(n_splits=1,test_size=.5,random_state=0).split(range(len(g)),groups=g));print(len(set(g[i] for i in tr)&set(g[i] for i in te)),len(set(g[i] for i in te)))","0 2"],
 ["import numpy as np;from sklearn.impute import SimpleImputer;tr=np.array([[1.],[3.],[np.nan]]);test=np.array([[100.]]);m=SimpleImputer(strategy='median').fit(tr);print(float(m.statistics_[0]),m.transform(test).tolist())","2.0 [[100.0]]"],
 ["import numpy as np;print(float(np.nanmedian([1,3,np.nan])),float(np.nanmedian([1,3,np.nan,100])))","2.0 3.0"],
 ["from sklearn.pipeline import Pipeline;from sklearn.impute import SimpleImputer;from sklearn.preprocessing import StandardScaler;import numpy as np;x=np.array([[1.],[3.],[np.nan]]);p=Pipeline([('impute',SimpleImputer(strategy='median')),('scale',StandardScaler())]).fit(x);print(round(float(p.transform(x).mean()),7))","0.0"],
 ];
 for(const [source,expected] of checks){
  const r=spawnSync('python3',['-W','error','-c',source],{encoding:'utf8',timeout:12000});
  assert.equal(r.status,0,source+': '+r.stderr);
  assert.equal(r.stdout.trim(),expected,source);
 }
});
