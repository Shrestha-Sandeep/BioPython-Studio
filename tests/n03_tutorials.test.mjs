import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';

const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const ctx={window:{}};
for(const chapter of ['n01','n02','n03']){
 let s=read('src/tutorials/'+chapter+'-data.js');
 assert.doesNotThrow(()=>new Function(s));
 vm.runInNewContext(s,ctx);
}
const seq=JSON.parse(JSON.stringify(ctx.window.BioPythonSequenceTutorials));
const t=seq.find(x=>x.chapter==='N03'),svg=read('src/tutorials/sequence-illustrations.js');
const html=read('index.html'),viewer=read('src/tutorials/p01-viewer.js');
const hasBio=spawnSync('python3',['-c','from Bio.Align import PairwiseAligner'],{encoding:'utf8'}).status===0;

test('N03 exact canonical 18-scene G01-G04 and capstone',()=>{
 assert.deepEqual(seq.map(x=>x.chapter),['N01','N02','N03']);
 assert.ok(t);
 assert.deepEqual(t.goals,['N03-G01','N03-G02','N03-G03','N03-G04','N03-CAPSTONE']);
 assert.equal(t.steps.length,18);
 assert.deepEqual([...new Set(t.steps.map(x=>x.goal))].sort(),t.goals.slice().sort());
 assert.deepEqual(t.steps.flatMap((s,i)=>s.checkpoint?[i]:[]),[9]);
 assert.equal(t.steps[9].output,'');
 assert.equal(t.steps[10].output,"{'AA': 2, 'AC': 1}");
 assert.match(t.steps.at(-1).title,/Independent transfer/i);
 assert.equal(t.steps.at(-1).code,'');
 assert.equal(t.steps.at(-1).output,'');
 assert.ok(!t.steps.some(s=>s.code.includes('sample.')||s.code.includes('data.')));
 for(const s of t.steps){
  assert.ok(s.say.trim().split(/\s+/).length>=18,'Narration: '+s.title);
  assert.ok(s.note.length>=40,'Source boundary: '+s.title);
  assert.ok(s.visual.every(pair=>pair.length===2),s.title);
  const n=s.code?s.code.split('\n').length:0;
  for(const line of s.focus)assert.ok(line>=1&&line<=n,s.title+' line '+line);
  if(s.output)assert.ok(s.code,s.title);
 }
});
test('N03 source-safe locally drawn diagrams registered before existing reader',()=>{
 assert.ok(html.indexOf('src/tutorials/n02-data.js')<html.indexOf('src/tutorials/n03-data.js'));
 assert.ok(html.indexOf('src/tutorials/n03-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 assert.match(viewer,/BioPythonSequenceTutorials/);
 assert.match(svg,/const D03=/);
 for(const painter of ['cycles','trim','kmers','align'])assert.match(svg,new RegExp('function '+painter+'\\('));
 assert.match(svg,/role:"img"/);
 assert.match(svg,/ch==="N03"/);
});
test('N03 printed outputs execute exactly in fresh Biopython CPython',{skip:!hasBio?'Install Biopython':false},()=>{
 let n=0;
 for(const [i,s] of t.steps.entries()){
  if(!s.code||!s.output)continue;
  const r=spawnSync('python3',['-W','error','-c',s.code],{encoding:'utf8',timeout:12000});
  assert.equal(r.status,0,'N03 '+(i+1)+' '+s.title+': '+r.stderr);
  assert.equal(r.stdout.trimEnd(),s.output,'N03 scene '+(i+1)+' '+s.title);
  n++;
 }
 assert.ok(n>=14,'Expected at least 14 executable outputs, got '+n);
});
test('N03 changed-input missing Q, tail-trim, overlapping motifs, aligner penalties',{skip:!hasBio?'Install Biopython':false},()=>{
 const cases=[
 ["r=[[30,10,5],[40,20]];print([sum(i<len(q) for q in r) for i in range(4)])",'[2, 2, 1, 0]'],
 ["s='ACGT';q=[35,5,35,2];n=len(q)\nwhile n and q[n-1]<20:n-=1\nprint(s[:n],q[:n])",'ACG [35, 5, 35]'],
 ["s='AC';q=[1,2];n=len(q)\nwhile n and q[n-1]<20:n-=1\nprint(n)",'0'],
 ["from collections import Counter;s='AAAA';k=2;print(dict(Counter(s[i:i+k] for i in range(len(s)-k+1))))","{'AA': 3}"],
 ["from collections import Counter;s='AANAAC';k=2;print(dict(sorted(Counter(s[i:i+k] for i in range(len(s)-k+1) if set(s[i:i+k])<=set('ACGT')).items())))","{'AA': 2, 'AC': 1}"],
 ["from Bio.Align import PairwiseAligner;a=PairwiseAligner();a.mode='global';a.match_score=2;a.mismatch_score=-1;a.open_gap_score=-2;a.extend_gap_score=-0.5;print(a.score('ACG','ATG'))",'3.0'],
 ["from Bio.Align import PairwiseAligner;a=PairwiseAligner();a.mode='global';a.match_score=2;a.mismatch_score=-1;a.open_gap_score=-2;a.extend_gap_score=-0.5;print(a.score('ACGT','AGT'))",'4.0'],
 ];
 for(const [source,expected] of cases){
  const r=spawnSync('python3',['-W','error','-c',source],{encoding:'utf8',timeout:12000});
  assert.equal(r.status,0,source+': '+r.stderr);
  assert.equal(r.stdout.trim(),expected,source);
 }
});
