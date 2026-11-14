import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';

const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const ctx={window:{}};
for(const ch of ['n01','n02','n03','n04']){
 const s=read('src/tutorials/'+ch+'-data.js');
 assert.doesNotThrow(()=>new Function(s));
 vm.runInNewContext(s,ctx);
}
const chapters=JSON.parse(JSON.stringify(ctx.window.BioPythonSequenceTutorials));
const t=chapters.find(x=>x.chapter==='N04');
const svg=read('src/tutorials/sequence-illustrations.js');
const html=read('index.html');
const viewer=read('src/tutorials/p01-viewer.js');
const pandas=spawnSync('python3',['-c','import pandas'],{encoding:'utf8'});
const hasPandas=pandas.status===0;

test('N04 complete canonical goals and withheld CPM prediction',()=>{
 assert.deepEqual(chapters.map(x=>x.chapter),['N01','N02','N03','N04']);
 assert.ok(t);
 assert.deepEqual(t.goals,['N04-G01','N04-G02','N04-G03','N04-G04','N04-G05','N04-CAPSTONE']);
 assert.equal(t.steps.length,20);
 assert.deepEqual([...new Set(t.steps.map(s=>s.goal))].sort(),t.goals.slice().sort());
 assert.deepEqual(t.steps.flatMap((s,i)=>s.checkpoint?[i]:[]),[12]);
 assert.equal(t.steps[12].output,'');
 assert.equal(t.steps[13].output,"{'G1': 250000, 'G2': 750000}");
 assert.equal(t.steps.at(-1).code,'');
 assert.equal(t.steps.at(-1).output,'');
 assert.match(t.steps.at(-1).title,/Independent transfer/i);
 assert.ok(!t.steps.some(s=>s.code.includes('data.')||s.code.includes('sample.')),'No hidden Apply/Prove examples');
 for(const [i,s] of t.steps.entries()){
  assert.ok(s.say.trim().split(/\s+/).length>=18,'Narration '+i+' '+s.title);
  assert.ok(s.note.length>=40,'Scientific caution '+i+' '+s.title);
  assert.ok(s.visual.every(pair=>pair.length===2),'Visual '+s.title);
  const n=s.code?s.code.split('\n').length:0;
  for(const line of s.focus)assert.ok(line>=1&&line<=n,s.title+': line '+line);
  if(s.output)assert.ok(s.code,s.title);
 }
});
test('N04 local SVG, unchanged Learn-only reader, script order',()=>{
 assert.ok(html.indexOf('src/tutorials/n03-data.js')<html.indexOf('src/tutorials/n04-data.js'));
 assert.ok(html.indexOf('src/tutorials/n04-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 assert.match(viewer,/BioPythonSequenceTutorials/);
 assert.match(viewer,/d.phase==="learn"/);
 assert.match(svg,/const D04=/);
 for(const p of ['mapping','depth','matrix','cpm'])assert.match(svg,new RegExp('function '+p+'\\('));
 assert.match(svg,/ch==="N04"/);
 assert.match(svg,/role:"img"/);
});
test('N04 exact fresh CPython/Pandas output parity',{skip:!hasPandas?'Install Pandas':false},()=>{
 let passed=0;
 for(const [i,s] of t.steps.entries()){
  if(!s.code||!s.output)continue;
  const r=spawnSync('python3',['-W','error','-c',s.code],{encoding:'utf8',timeout:14000});
  assert.equal(r.status,0,'N04 '+(i+1)+' '+s.title+': '+r.stderr);
  assert.equal(r.stdout.trimEnd(),s.output,'N04 '+(i+1)+' '+s.title);
  passed++;
 }
 assert.ok(passed>=15,'Too few executed code+output examples: '+passed);
});
test('N04 changed-input multimap, half-open, clipping, depth and zero denominator',{skip:!hasPandas?'Install Pandas':false},()=>{
 const checks=[
 ["x=['unmapped','unmapped'];print(sum(v!='unmapped' for v in x)/len(x))","0.0"],
 ["x=['mapped','multi','multi','unmapped'];print(sum(v!='unmapped' for v in x),sum(v=='mapped' for v in x))","3 1"],
 ["d=[0]*5\nfor a,b in [(0,3),(2,5)]:\n for i in range(max(0,a),min(5,b)):d[i]+=1\nprint(d,sum(v>0 for v in d))","[1, 1, 2, 1, 1] 5"],
 ["d=[0]*5\nfor a,b in [(-3,2),(4,15)]:\n for i in range(max(0,a),min(5,b)):d[i]+=1\nprint(d)","[1, 1, 0, 0, 1]"],
 ["import pandas as pd;x=pd.DataFrame({'s':['A','A','B'],'g':['X','X','Y'],'n':[2,3,0]});p=x.pivot_table(index='s',columns='g',values='n',aggfunc='sum',fill_value=0);print(p.to_dict(orient='index'))","{'A': {'X': 5, 'Y': 0}, 'B': {'X': 0, 'Y': 0}}"],
 ["counts={'X':0,'Y':0};tot=sum(counts.values());print({k:(1e6*v/tot if tot else None) for k,v in counts.items()})","{'X': None, 'Y': None}"],
 ["counts={'X':10,'Y':90};print(int(1e6*counts['X']/sum(counts.values())))","100000"],
 ["m={'A':1};print(m.get('B',None))","None"],
 ["statuses=[];print(sum(s!='unmapped' for s in statuses)/len(statuses) if statuses else None)","None"]
 ];
 for(const [source,expected] of checks){
  const r=spawnSync('python3',['-W','error','-c',source],{encoding:'utf8',timeout:12000});
  assert.equal(r.status,0,source+': '+r.stderr);
  assert.equal(r.stdout.trim(),expected,source);
 }
});
