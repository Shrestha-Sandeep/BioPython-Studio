import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const ctx={window:{}};
for(const ch of ['a00','a01','a02','a03','a05']){const src=read('src/tutorials/'+ch+'-data.js');assert.doesNotThrow(()=>new Function(src));vm.runInNewContext(src,ctx);}
const list=JSON.parse(JSON.stringify(ctx.window.BioPythonAdvancedTutorials));
const t=list.find(x=>x.chapter==='A05'),svg=read('src/tutorials/advanced-illustrations.js'),html=read('index.html');
const hasNp=spawnSync('python3',['-c','import numpy'],{encoding:'utf8'}).status===0;
function py(code){const r=spawnSync('python3',['-W','error','-c',code],{encoding:'utf8',timeout:16000});assert.equal(r.status,0,code+'\n'+r.stderr);return r.stdout.trimEnd();}
test('A05 source-mapped goals, 18 stages, hidden prediction and unsolved transfer',()=>{
 assert.deepEqual(list.map(x=>x.chapter),['A00','A01','A02','A03','A05']);
 assert.deepEqual(t.goals,['A05-G01','A05-G02','A05-G03','A05-G04','A05-G05','A05-G06','A05-CAPSTONE']);
 assert.equal(t.steps.length,18);
 assert.deepEqual([...new Set(t.steps.map(s=>s.goal))],t.goals);
 assert.deepEqual(t.steps.flatMap((s,i)=>s.checkpoint?[i]:[]),[9]);
 assert.equal(t.steps[9].output,'');
 assert.equal(t.steps[9].visual.at(-1)[1],'Withheld');
 assert.equal(t.steps[10].output,'[1, 4, 2] 2.33');
 assert.equal(t.steps.at(-1).code,'');
 assert.equal(t.steps.at(-1).output,'');
 assert.match(t.steps.at(-1).title,/Independent transfer/i);
 assert.ok(!t.goals.includes('A05-REVIEW'));
 for(const s of t.steps){
  assert.ok(s.say.trim().split(/\s+/).length>=16,s.title);
  assert.ok(s.note.length>=58,s.title);
  assert.ok(s.visual.every(v=>v.length===2),s.title);
  const n=s.code?s.code.split('\n').length:0;
  for(const i of s.focus)assert.ok(i>=1&&i<=n,s.title+':'+i);
  if(s.output)assert.ok(s.code,s.title);
 }
});
test('A05 original subject/pair/interval diagrams and script ordering',()=>{
 assert.ok(html.indexOf('src/tutorials/a03-data.js')<html.indexOf('src/tutorials/a05-data.js'));
 assert.ok(html.indexOf('src/tutorials/a05-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 const section=svg.slice(svg.indexOf('const DATA05='),svg.indexOf('const DATA06='));
 assert.equal((section.match(/kind:"(?:route|cards|hierarchy|pair|interval|split)"/g)||[]).length,18);
 for(const painter of ['hierarchy','pair','interval'])assert.match(svg,new RegExp('function '+painter+'\\('));
 assert.match(svg,/ch==="A05"/);
});
test('A05 all numeric outputs match actual fresh Python', {skip:!hasNp?'NumPy needed':false},()=>{
 let n=0;
 for(const [i,s] of t.steps.entries())if(s.code&&s.output){assert.equal(py(s.code),s.output,'A05 '+(i+1)+': '+s.title);n++;}
 assert.ok(n>=14,'Too few executable numeric teaching steps');
});
test('A05 changed inputs: metadata, pseudoreplication, exclusions, pairing, cluster bootstrap', {skip:!hasNp?'NumPy needed':false},()=>{
 const cases=[
 ["rows=[('F1','A'),('F1','B')];seen=set();bad=[]\nfor f,a in rows:\n if f in seen:bad.append(f)\n seen.add(f)\nprint(bad)","['F1']"],
 ["rows=[('A',0)]*5+[('B',10)];means=[0,10];print(sum(v for _,v in rows)/len(rows),sum(means)/2,len(set(a for a,_ in rows)))","1.6666666666666667 5.0 2"],
 ["rows=[('A',5,''),('A',99,'bad'),('B',8,'')];kept=[v for a,v,r in rows if not r];print(kept,len(rows)-len(kept))","[5, 8] 1"],
 ["c={'A':2,'B':5};t={'A':8,'B':7};print([t[k]-c[k] for k in sorted(c)],sum(t[k]-c[k] for k in c)/len(c))","[6, 2] 4.0"],
 ["c={'A':1,'B':2};t={'A':3,'B':4,'C':5};print(sorted(t.keys()-c.keys()))","['C']"],
 ["import numpy as np;rng=np.random.default_rng(17);c=np.array([2.,3.,4.]);t=np.array([5.,7.,9.]);b=np.array([rng.choice(t,3).mean()-rng.choice(c,3).mean() for _ in range(1000)]);print(np.quantile(b,[.025,.975]).round(2).tolist())","[2.0, 6.0]"],
 ["rows=[('A',3),('A',4),('B',5)];print(len(rows),len(set(a for a,_ in rows)))","3 2"],
 ["control=[4.,6.];treat=[10.,11.];print(sum(treat)/2-sum(control)/2)","5.5"]
 ];
 for(const [src,expected] of cases)assert.equal(py(src),expected,src);
});
