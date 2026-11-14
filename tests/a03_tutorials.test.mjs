import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const ctx={window:{}};
for(const prefix of ['a00','a01','a02','a03']){
 const src=read('src/tutorials/'+prefix+'-data.js');
 assert.doesNotThrow(()=>new Function(src));vm.runInNewContext(src,ctx);
}
const chapters=JSON.parse(JSON.stringify(ctx.window.BioPythonAdvancedTutorials));
const t=chapters.find(c=>c.chapter==='A03'),svg=read('src/tutorials/advanced-illustrations.js'),html=read('index.html');
const hasScience=spawnSync('python3',['-c','import numpy,scipy'],{encoding:'utf8'}).status===0;
function py(src){
 const r=spawnSync('python3',['-W','error','-c',src],{encoding:'utf8',timeout:18000});
 assert.equal(r.status,0,src+'\n'+r.stderr);return r.stdout.trimEnd();
}
test('A03 goals, scientific capstone, withheld matching and independent delayed transfer',()=>{
 assert.deepEqual(chapters.map(c=>c.chapter),['A00','A01','A02','A03']);
 assert.deepEqual(t.goals,['A03-G01','A03-G02','A03-G03','A03-G04','A03-G05','A03-CAPSTONE']);
 assert.equal(t.steps.length,17);
 assert.deepEqual([...new Set(t.steps.map(s=>s.goal))],t.goals);
 assert.deepEqual(t.steps.flatMap((s,i)=>s.checkpoint?[i]:[]),[8]);
 assert.equal(t.steps[8].output,'');
 assert.equal(t.steps[8].visual.at(-1)[1],'Withheld');
 assert.equal(t.steps[9].output,'2 0 0');
 assert.equal(t.steps.at(-1).code,'');
 assert.equal(t.steps.at(-1).output,'');
 assert.match(t.steps.at(-1).title,/Independent transfer/i);
 assert.ok(!t.goals.includes('A03-REVIEW'));
 for(const s of t.steps){
  assert.ok(s.say.trim().split(/\s+/).length>=17,s.title);
  assert.ok(s.note.length>=58,s.title);
  assert.ok(s.visual.every(v=>v.length===2),s.title);
  const n=s.code?s.code.split('\n').length:0;
  for(const v of s.focus)assert.ok(v>=1&&v<=n,s.title+':'+v);
  if(s.output)assert.ok(s.code,s.title);
 }
});
test('A03 original SVG matrix and instance diagrams use same frozen optional viewer',()=>{
 assert.ok(html.indexOf('src/tutorials/a02-data.js')<html.indexOf('src/tutorials/a03-data.js'));
 assert.ok(html.indexOf('src/tutorials/a03-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 assert.match(svg,/const DATA03=/);
 for(const kind of ['instances','matrix']) assert.match(svg,new RegExp('function '+kind+'\\('));
 assert.match(svg,/ch==="A03"/);assert.match(svg,/role:"img"/);
 const body=svg.slice(svg.indexOf('const DATA03='),svg.indexOf('const DATA05='));
 assert.equal((body.match(/kind:"(?:route|split|cards|animals|axis|pixels|mask|instances|matrix)"/g)||[]).length,17);
});
test('A03 all displayed Python outputs are real CPython/SciPy results',{skip:!hasScience?'Install SciPy':false},()=>{
 let n=0;
 for(const [i,s] of t.steps.entries())if(s.code&&s.output){
  assert.equal(py(s.code),s.output,'Scene '+(i+1)+': '+s.title);n++;
 }
 assert.ok(n>=14,'Too few executed examples: '+n);
});
test('A03 changed inputs: max-cardinality matching, merge, missing class, source groups and counts-only',{skip:!hasScience?'Install SciPy':false},()=>{
 const cases=[
 ["import numpy as np;from scipy.optimize import linear_sum_assignment;m=np.array([[.9,.8],[.81,.1]]);r,c=linear_sum_assignment(np.where(m>=.5,-1-m/1000,0));print(sorted(zip(r.tolist(),c.tolist())))","[(0, 1), (1, 0)]"],
 ["import numpy as np;from scipy.optimize import linear_sum_assignment;m=np.array([[.7,.1],[.8,.7]]);r,c=linear_sum_assignment(np.where(m>=.5,-1-m/1000,0));print(int((m[r,c]>=.5).sum()))","2"],
 ["import numpy as np;from scipy.optimize import linear_sum_assignment;m=np.array([[.1,.2],[.2,.4]]);r,c=linear_sum_assignment(np.where(m>=.5,-1-m/1000,0));print(int((m[r,c]>=.5).sum()))","0"],
 ["truth=[1,0,2];pred=[1,0,1];print(sum(a>0 and b>0 for a,b in zip(truth,pred))/sum(a>0 or b>0 for a,b in zip(truth,pred)),len(set(truth)-{0}),len(set(pred)-{0}))","1.0 2 1"],
 ["tp=fp=fn=0;f1=2*tp/(2*tp+fp+fn) if 2*tp+fp+fn else 0.0;print(f1)","0.0"],
 ["r=[('A','train'),('B','train'),('B','holdout')];a={g for g,s in r if s=='train'};b={g for g,s in r if s=='holdout'};print(sorted(a&b))","['B']"],
 ["kind='counts';print(kind=='pixel_masks',abs(17-13))","False 4"],
 ["import numpy as np;t=np.array([[1,1,0,2,2]]);p=np.array([[1,1,1,1,1]]);print(round(float(np.logical_and(t>0,p>0).sum()/np.logical_or(t>0,p>0).sum()),2))","0.8"]
 ];
 for(const [s,expect] of cases)assert.equal(py(s),expect,s);
});
