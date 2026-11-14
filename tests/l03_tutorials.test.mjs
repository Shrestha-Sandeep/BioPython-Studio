import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';

const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const ctx={window:{}};
for(const ch of ['l01','l02','l03']){
 let s=read('src/tutorials/'+ch+'-data.js');
 assert.doesNotThrow(()=>new Function(s));
 vm.runInNewContext(s,ctx);
}
const chapters=JSON.parse(JSON.stringify(ctx.window.BioPythonMLTutorials));
const t=chapters.find(x=>x.chapter==='L03'),svg=read('src/tutorials/ml-illustrations.js'),html=read('index.html');
const hasSK=spawnSync('python3',['-c','from sklearn.metrics import balanced_accuracy_score,brier_score_loss'],{encoding:'utf8'}).status===0;

test('L03 canonical twenty scenes, source scientific warnings, independent transfer',()=>{
 assert.deepEqual(chapters.map(x=>x.chapter),['L01','L02','L03']);
 assert.ok(t);
 assert.deepEqual(t.goals,['L03-G01','L03-G02','L03-G03','L03-G04','L03-CAPSTONE']);
 assert.equal(t.steps.length,20);
 assert.deepEqual([...new Set(t.steps.map(s=>s.goal))].sort(),t.goals.slice().sort());
 assert.deepEqual(t.steps.flatMap((s,i)=>s.checkpoint?[i]:[]),[11]);
 assert.equal(t.steps[11].output,'');
 assert.equal(t.steps[12].output,'0.085');
 assert.match(t.steps.at(-1).title,/Independent transfer/i);
 assert.equal(t.steps.at(-1).code,'');
 assert.equal(t.steps.at(-1).output,'');
 assert.ok(!t.steps.some(s=>s.code.includes('sample.')||s.code.includes('data.')));
 for(const [i,s] of t.steps.entries()){
  assert.ok(s.say.trim().split(/\s+/).length>=18,'Narration '+i);
  assert.ok(s.note.length>=40,'Source limitations '+i);
  assert.ok(s.visual.every(x=>x.length===2),'Visual '+s.title);
  const n=s.code?s.code.split('\n').length:0;
  for(const line of s.focus)assert.ok(line>=1&&line<=n,s.title+' focus '+line);
  if(s.output)assert.ok(s.code,'No code in output scene '+s.title);
 }
});
test('L03 figures and script are loaded in existing frozen Learn-only viewer',()=>{
 assert.ok(html.indexOf('src/tutorials/l02-data.js')<html.indexOf('src/tutorials/l03-data.js'));
 assert.ok(html.indexOf('src/tutorials/l03-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 assert.match(svg,/const D03=/);
 for(const name of ['folds','metrics','confusion','brier','bins'])assert.match(svg,new RegExp('function '+name+'\\('));
 assert.match(svg,/ch==="L03"/);
 assert.match(svg,/role:"img"/);
});
test('L03 100% shown Python numbers reproduce under fresh scikit-learn',{skip:!hasSK?'Install scikit-learn':false},()=>{
 let n=0;
 for(const [i,s] of t.steps.entries()){
  if(!s.code||!s.output)continue;
  const r=spawnSync('python3',['-W','error','-c',s.code],{encoding:'utf8',timeout:20000});
  assert.equal(r.status,0,'L03 '+(i+1)+' '+s.title+': '+r.stderr);
  assert.equal(r.stdout.trimEnd(),s.output,'L03 '+(i+1)+' '+s.title);
  n++;
 }
 assert.ok(n>=16,'Too few real scientific examples: '+n);
});
test('L03 adversarial group split, class imbalance, no positive and Brier cases',{skip:!hasSK?'Install scikit-learn':false},()=>{
 const cases=[
 ["from sklearn.model_selection import GroupKFold;g=list('AABBCCDDEEFF');fs=list(GroupKFold(3).split(range(12),groups=g));print(len(fs),sum(bool(set(g[i] for i in tr)&set(g[i] for i in te)) for tr,te in fs))","3 0"],
 ["from collections import Counter;from sklearn.model_selection import GroupKFold;g=list('AABBCCDDEEFF');h=[a for _,te in GroupKFold(3).split(range(12),groups=g) for a in set(g[i] for i in te)];print(sorted(Counter(h).items()))","[('A', 1), ('B', 1), ('C', 1), ('D', 1), ('E', 1), ('F', 1)]"],
 ["from sklearn.metrics import accuracy_score,recall_score,balanced_accuracy_score;y=[0,0,0,1];p=[0]*4;print(accuracy_score(y,p),recall_score(y,p,zero_division=0),balanced_accuracy_score(y,p))","0.75 0.0 0.5"],
 ["from sklearn.metrics import precision_score,recall_score;print(precision_score([0,0],[0,0],zero_division=0),recall_score([0,0],[0,0],zero_division=0))","0.0 0.0"],
 ["from sklearn.metrics import brier_score_loss;print(round(float(brier_score_loss([0,1],[.1,.6],pos_label=1)),3))","0.085"],
 ["from sklearn.metrics import brier_score_loss;print(round(float(brier_score_loss([0,1],[.2,.8],pos_label=1)),2))","0.04"]
 ];
 for(const [source,expected] of cases){const r=spawnSync('python3',['-W','error','-c',source],{encoding:'utf8',timeout:20000});assert.equal(r.status,0,r.stderr);assert.equal(r.stdout.trim(),expected,source);}
 const bad=spawnSync('python3',['-c',"from sklearn.metrics import brier_score_loss;brier_score_loss([0,1,0],[.1,.9])"],{encoding:'utf8',timeout:20000});
 assert.notEqual(bad.status,0,'A length mismatch must not be silently accepted');
 assert.match(bad.stderr,/inconsistent|length|shape/i);
 const few=spawnSync('python3',['-c',"from sklearn.model_selection import GroupKFold;list(GroupKFold(3).split(range(4),groups=['A','A','B','B']))"],{encoding:'utf8',timeout:20000});
 assert.notEqual(few.status,0,'Fewer unique subjects than folds must be rejected');
});
