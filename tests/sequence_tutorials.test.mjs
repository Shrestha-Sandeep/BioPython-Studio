import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const ctx={window:{}};
const moduleSource=read('src/tutorials/n01-data.js');
const illustrations=read('src/tutorials/sequence-illustrations.js');
const viewer=read('src/tutorials/p01-viewer.js');
const html=read('index.html');
assert.doesNotThrow(()=>new Function(moduleSource));
assert.doesNotThrow(()=>new Function(illustrations));
vm.runInNewContext(moduleSource,ctx);
const t=JSON.parse(JSON.stringify(ctx.window.BioPythonSequenceTutorials[0]));
const haveBio=spawnSync('python3',['-c','from Bio.Seq import Seq'],{encoding:'utf8'}).status===0;

test('N01 exact canonical goals, independent capstone and scene coverage',()=>{
 const goals=['N01-G01','N01-G02','N01-G03','N01-G04','N01-CAPSTONE'];
 assert.equal(t.chapter,'N01');
 assert.deepEqual(t.goals,goals);
 assert.equal(t.steps.length,16);
 assert.deepEqual([...new Set(t.steps.map(s=>s.goal))].sort(),goals.slice().sort());
 assert.equal(t.steps.filter(s=>s.checkpoint).length,1);
 const checkpoint=t.steps.findIndex(s=>s.checkpoint);
 assert.equal(checkpoint,6);
 assert.equal(t.steps[checkpoint].output,'');
 assert.equal(t.steps[checkpoint+1].output,'0.667');
 assert.match(t.steps.at(-1).title,/Independent transfer/i);
 assert.equal(t.steps.at(-1).code,'');
 assert.equal(t.steps.at(-1).output,'');
 assert.ok(!t.steps.some(s=>s.code.includes('sample.')||s.code.includes('data.')),'Never leak Apply or Prove inputs');
 for(const s of t.steps){
   assert.ok(s.say.trim().split(/\s+/).length>=18,'Narration too thin: '+s.title);
   assert.ok(s.note.length>=40,'Scientifically thin caveat: '+s.title);
   assert.ok(Array.isArray(s.visual)&&s.visual.every(v=>v.length===2),'Scene visual: '+s.title);
   let lines=s.code?s.code.split('\n').length:0;
   for(const n of s.focus)assert.ok(n>=1&&n<=lines,'Bad code highlight: '+s.title+' '+n);
   if(s.output)assert.ok(s.code,'No executable code: '+s.title);
 }
});
test('N01 source-safe SVG and existing Learn-only reader',()=>{
 assert.match(moduleSource,/synthetic DNA/i);
 assert.match(illustrations,/role:"img"/);
 assert.match(illustrations,/viewBox:"0 0 520 190"/);
 assert.match(illustrations,/codons/);
 assert.match(html,/src\/tutorials\/sequence-illustrations.js/);
 assert.ok(html.indexOf('src/tutorials/sequence-illustrations.js')<html.indexOf('src/tutorials/n01-data.js'));
 assert.ok(html.indexOf('src/tutorials/n01-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 assert.match(viewer,/BioPythonSequenceTutorials/);
 assert.match(viewer,/BioPythonSequenceIllustrations/);
 assert.match(viewer,/d.phase==="learn"/);
 assert.ok(!html.includes('n02-data.js'));
});
test('N01 exact real Python and Biopython output parity',{skip:!haveBio?'Install Biopython to run':false},()=>{
 let n=0;
 for(const [i,scene] of t.steps.entries()){
   if(!scene.code||!scene.output)continue;
   const r=spawnSync('python3',['-W','error','-c',scene.code],{encoding:'utf8',timeout:12000});
   assert.equal(r.status,0,'N01 step '+(i+1)+' '+scene.title+' '+r.stderr);
   assert.equal(r.stdout.trimEnd(),scene.output,'N01 code/output discrepancy in step '+(i+1));
   n++;
 }
 assert.ok(n>=12,'Expected at least twelve independently executable scene examples');
});
test('N01 boundary, lowercase, unknown, strand and frame changed-input guards',{skip:!haveBio?'Install Biopython to run':false},()=>{
 const cases=[
 ["s='nnn'; c=[b for b in s.upper() if b in 'ACGT']; print(None if not c else 1)","None"],
 ["s='GCnnx'; t=s.upper(); print([i for i,b in enumerate(t) if b not in 'ACGTN'])","[4]"],
 ["s='GCNNAA'; c=[b for b in s if b in 'ACGT']; print(sum(b in 'GC' for b in c)/len(c))","0.5"],
 ["from Bio.Seq import Seq; s=Seq('aTgCn'); print(str(s.reverse_complement().reverse_complement()).upper())","ATGCN"],
 ["from Bio.Seq import Seq; print(str(Seq('ATGTAGGCTTAA').translate()))","M*A*"],
 ["from Bio.Seq import Seq; print(str(Seq('ATGNNNTAA').translate()))","MX*"],
 ["s='ATGGC'; print(len(s)%3==0)","False"],
 ["s='ANXT'; print([i for i,b in enumerate(s) if b not in 'ACGT'])","[1, 2]"],
 ];
 for(const [source,expected] of cases){
   let r=spawnSync('python3',['-W','error','-c',source],{encoding:'utf8',timeout:10000});
   assert.equal(r.status,0,r.stderr);
   assert.equal(r.stdout.trim(),expected,source);
 }
});
