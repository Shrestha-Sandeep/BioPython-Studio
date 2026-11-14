import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const ctx={window:{}};for(const ch of ['a00','a01','a02','a03','a05','a06']){const code=read('src/tutorials/'+ch+'-data.js');assert.doesNotThrow(()=>new Function(code));vm.runInNewContext(code,ctx);}
const chapters=JSON.parse(JSON.stringify(ctx.window.BioPythonAdvancedTutorials)),t=chapters.find(x=>x.chapter==='A06'),art=read('src/tutorials/advanced-illustrations.js'),html=read('index.html');
const hasNp=spawnSync('python3',['-c','import numpy'],{encoding:'utf8'}).status===0;
function run(code){const r=spawnSync('python3',['-W','error','-c',code],{encoding:'utf8',timeout:16000});assert.equal(r.status,0,code+'\n'+r.stderr);return r.stdout.trimEnd();}
test('A06 canonical goals, 18 scenes, true hidden checkpoint and independent review',()=>{
 assert.deepEqual(chapters.map(c=>c.chapter),['A00','A01','A02','A03','A05','A06']);
 assert.deepEqual(t.goals,['A06-G01','A06-G02','A06-G03','A06-G04','A06-G05','A06-G06','A06-CAPSTONE']);
 assert.equal(t.steps.length,18);assert.deepEqual([...new Set(t.steps.map(s=>s.goal))],t.goals);
 assert.deepEqual(t.steps.flatMap((s,i)=>s.checkpoint?[i]:[]),[8]);
 assert.equal(t.steps[8].output,'');assert.equal(t.steps[8].visual.at(-1)[1],'Withheld');
 assert.equal(t.steps[9].output,"{'duplicates': ['F2'], 'missing_sources': ['F3'], 'can_start': False}");
 assert.match(t.steps.at(-1).title,/Independent transfer/i);
 assert.equal(t.steps.at(-1).code,'');assert.equal(t.steps.at(-1).output,'');
 assert.ok(!t.goals.includes('A06-REVIEW'));
 for(const s of t.steps){
  assert.ok(s.say.trim().split(/\s+/).length>=17,s.title);
  assert.ok(s.note.length>=55,s.title);
  assert.ok(s.visual.every(v=>v.length===2),s.title);
  const n=s.code?s.code.split('\n').length:0;
  for(const v of s.focus)assert.ok(v>=1&&v<=n,s.title+':'+v);
  if(s.output)assert.ok(s.code,s.title);
 }
});
test('A06 original figures and route integrate without changing frozen viewer',()=>{
 assert.ok(html.indexOf('src/tutorials/a05-data.js')<html.indexOf('src/tutorials/a06-data.js'));
 assert.ok(html.indexOf('src/tutorials/a06-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 const block=art.slice(art.indexOf('const DATA06='),art.indexOf('const make='));
 assert.equal((block.match(/kind:"(?:route|cards|split|hierarchy|mask|axis|pixels)"/g)||[]).length,18);
 assert.match(art,/ch==="A06"/);assert.match(art,/role:"img"/);
});
test('A06 all exact stdout from fresh real CPython', {skip:!hasNp?'numpy required':false},()=>{
 let n=0;for(const [i,s] of t.steps.entries())if(s.code&&s.output){assert.equal(run(s.code),s.output,'A06 scene '+(i+1));n++;}
 assert.ok(n>=14);
});
test('A06 adversarial preflight, environment mismatch, original byte hashes and animal grouping',{skip:!hasNp?'numpy required':false},()=>{
 const cases=[
 ["import numpy as np;p=np.array([1,6],dtype=np.uint16);v=np.maximum(0,p.astype(float)-3);print(int((v>2).sum()),p.tolist())","1 [1, 6]"],
 ["axes='TCZYX';shape=[2,3,2,4,5];sel={'T':0};print(sorted(a for a,n in zip(axes,shape) if a in 'TCZ' and n>1 and a not in sel))","['C', 'Z']"],
 ["ids=['x','x','y'];print(sorted({x for x in ids if ids.count(x)>1}))","['x']"],
 ["records=[('f1',True),('f2',False)];print([x for x,good in records if not good])","['f2']"],
 ["import hashlib;print(hashlib.sha256(b'a').digest()!=hashlib.sha256(b'b').digest())","True"],
 ["import json;c=lambda d:json.dumps(d,sort_keys=True,separators=(',',':'));print(c({'b':2,'a':1})==c({'a':1,'b':2}))","True"],
 ["p=[5,5,6];print(sum(x>5 for x in p),sum(x>=5 for x in p))","1 3"],
 ["one={'source':'a','config':'b','output':'c'};two={'source':'a','config':'x','output':'c'};print(sorted(k for k in one if one[k]!=two[k]))","['config']"],
 ["fields=[('F1','A',1),('F2','A',3),('F3','B',4)];print(len(fields),len(set(a for _,a,_ in fields)))","3 2"]
 ];
 for(const [source,expected] of cases)assert.equal(run(source),expected,source);
});
