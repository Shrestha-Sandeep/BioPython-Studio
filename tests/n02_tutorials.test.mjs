import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';

const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const src=read('src/tutorials/n02-data.js'),svg=read('src/tutorials/sequence-illustrations.js');
const html=read('index.html'),reader=read('src/tutorials/p01-viewer.js');
const ctx={window:{}};
for(const file of ['n01-data.js','n02-data.js']) {
 const code=read('src/tutorials/'+file);
 assert.doesNotThrow(()=>new Function(code));
 vm.runInNewContext(code,ctx);
}
const chapters=JSON.parse(JSON.stringify(ctx.window.BioPythonSequenceTutorials));
const t=chapters.find(x=>x.chapter==='N02');
const hasBio=spawnSync('python3',['-c','from Bio import SeqIO; from Bio.SeqRecord import SeqRecord'],{encoding:'utf8'}).status===0;

test('N02 exact goal and 18-scene canonical contract',()=>{
 assert.deepEqual(chapters.slice(0,2).map(x=>x.chapter),['N01','N02']);
 assert.ok(t); assert.deepEqual(t.goals,['N02-G01','N02-G02','N02-G03','N02-G04','N02-CAPSTONE']);
 assert.equal(t.steps.length,18);
 assert.deepEqual([...new Set(t.steps.map(s=>s.goal))].sort(),t.goals.slice().sort());
 assert.deepEqual(t.steps.flatMap((s,i)=>s.checkpoint?[i]:[]),[11]);
 assert.equal(t.steps[11].output,'');
 assert.equal(t.steps[12].output,'CGG');
 assert.match(t.steps.at(-1).title,/Independent transfer/i);
 assert.equal(t.steps.at(-1).code,'');
 assert.equal(t.steps.at(-1).output,'');
 assert.ok(!t.steps.some(s=>s.code.includes('sample.')||s.code.includes('data.')));
 for(const [i,s] of t.steps.entries()){
   assert.ok(s.say.trim().split(/\s+/).length>=18,s.title);
   assert.ok(s.note.length>=40,s.title);
   assert.ok(Array.isArray(s.visual)&&s.visual.every(x=>x.length===2),s.title);
   const n=s.code?s.code.split('\n').length:0;
   for(const line of s.focus)assert.ok(line>=1&&line<=n,s.title+':'+line);
   if(s.output)assert.ok(s.code,'Output without code in '+i);
 }
});
test('N02 registration and locally generated figure integrity',()=>{
 assert.match(html,/src\/tutorials\/n02-data.js/);
 assert.ok(html.indexOf('src/tutorials/n01-data.js')<html.indexOf('src/tutorials/n02-data.js'));
 assert.ok(html.indexOf('src/tutorials/n02-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 assert.match(reader,/BioPythonSequenceIllustrations/);
 assert.match(reader,/d.phase==="learn"/);
 assert.match(svg,/const D02=/);
 assert.match(svg,/function quality\(/);
 assert.match(svg,/function fasta\(/);
 assert.match(svg,/function interval\(/);
 assert.match(svg,/role:"img"/);
});
test('N02 all shown outputs match fresh Biopython real Python',{skip:!hasBio?'Install Biopython to run':false},()=>{
 let count=0;
 for(const [i,s] of t.steps.entries()){
   if(!s.code||!s.output)continue;
   const r=spawnSync('python3',['-W','error','-c',s.code],{encoding:'utf8',timeout:12000});
   assert.equal(r.status,0,'Scene '+(i+1)+' '+s.title+': '+r.stderr);
   assert.equal(r.stdout.trimEnd(),s.output,'Mismatched printed output in N02 '+(i+1));
   count++;
 }
 assert.ok(count>=14,'Too few independently verified examples: '+count);
});
test('N02 changed-input integrity, duplicates and bad FASTQ detection',{skip:!hasBio?'Install Biopython to run':false},()=>{
 const cases=[
 ["from Bio import SeqIO;from io import StringIO;s='>x\\nAC\\nGT\\n>y\\nN\\n';print([(r.id,str(r.seq)) for r in SeqIO.parse(StringIO(s),'fasta')])","[('x', 'ACGT'), ('y', 'N')]"],
 ["from Bio import SeqIO;from io import StringIO;s='>x\\nAC\\n>x\\nGG\\n';a=[r.id for r in SeqIO.parse(StringIO(s),'fasta')];print(len(a)==len(set(a)))","False"],
 ["from Bio.Seq import Seq;s=Seq('AACCGG');start=2;end=5;print(str(s[start:end].reverse_complement()))",'CGG'],
 ["s='AACCGG';start=4;end=9;print(0<=start<end<=len(s))",'False'],
 ["from Bio import SeqIO;from io import StringIO;r=SeqIO.read(StringIO('@x\\nAC\\n+\\n!!\\n'),'fastq');print(r.letter_annotations['phred_quality'])",'[0, 0]']
 ];
 for(const [source,expected] of cases){const r=spawnSync('python3',['-W','error','-c',source],{encoding:'utf8',timeout:12000});assert.equal(r.status,0,r.stderr);assert.equal(r.stdout.trim(),expected,source);}
 const malformed="from Bio import SeqIO;from io import StringIO;list(SeqIO.parse(StringIO('@x\\nACG\\n+\\nII\\n'),'fastq'))";
 const bad=spawnSync('python3',['-W','error','-c',malformed],{encoding:'utf8',timeout:12000});
 assert.notEqual(bad.status,0,'Mismatched quality length must not silently pass');
 assert.match(bad.stderr,/quality|sequence|end|length/i);
 const many="from Bio import SeqIO;from io import StringIO;SeqIO.read(StringIO('>a\\nAC\\n>b\\nTT\\n'),'fasta')";
 const r=spawnSync('python3',['-W','error','-c',many],{encoding:'utf8',timeout:12000});
 assert.notEqual(r.status,0,'SeqIO.read must refuse multiple FASTA records');
});
