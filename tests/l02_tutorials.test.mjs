import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';

const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const ctx={window:{}};
for(const file of ['l01-data.js','l02-data.js']){
 const source=read('src/tutorials/'+file);
 assert.doesNotThrow(()=>new Function(source));
 vm.runInNewContext(source,ctx);
}
const chapters=JSON.parse(JSON.stringify(ctx.window.BioPythonMLTutorials));
const t=chapters.find(s=>s.chapter==='L02'),html=read('index.html'),svg=read('src/tutorials/ml-illustrations.js');
const hasSK=spawnSync('python3',['-c','from sklearn.linear_model import LogisticRegression'],{encoding:'utf8'}).status===0;

test('L02 exact canonical goals, 18 scenes and independent transfer',()=>{
 assert.deepEqual(chapters.map(x=>x.chapter),['L01','L02']);
 assert.ok(t); assert.deepEqual(t.goals,['L02-G01','L02-G02','L02-G03','L02-G04','L02-CAPSTONE']);
 assert.equal(t.steps.length,18);
 assert.deepEqual([...new Set(t.steps.map(s=>s.goal))].sort(),t.goals.slice().sort());
 assert.deepEqual(t.steps.flatMap((s,i)=>s.checkpoint?[i]:[]),[4]);
 assert.equal(t.steps[4].output,'');
 assert.equal(t.steps[5].output,'[0, 0] 0.5');
 assert.equal(t.steps.at(-1).code,'');
 assert.equal(t.steps.at(-1).output,'');
 assert.match(t.steps.at(-1).title,/Independent transfer/i);
 assert.ok(!t.steps.some(s=>s.code.includes('sample.')||s.code.includes('data.')));
 for(const s of t.steps){
  assert.ok(s.say.trim().split(/\s+/).length>=18,s.title);
  assert.ok(s.note.length>=40,s.title);
  assert.ok(s.visual.every(v=>v.length===2),s.title);
  const n=s.code?s.code.split('\n').length:0;
  for(const line of s.focus)assert.ok(line>=1&&line<=n,s.title+':'+line);
  if(s.output)assert.ok(s.code,s.title);
 }
});
test('L02 original diagrams and script order preserve frozen viewer',()=>{
 assert.ok(html.indexOf('src/tutorials/l01-data.js')<html.indexOf('src/tutorials/l02-data.js'));
 assert.ok(html.indexOf('src/tutorials/l02-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 assert.match(svg,/const D02=/);
 for(const type of ['baseline','line','probability','tree']) assert.match(svg,new RegExp('function '+type+'\\('));
 assert.match(svg,/ch==="L02"/);
 assert.match(svg,/role:"img"/);
});
test('L02 all printed outputs agree with fresh scikit-learn CPython',{skip:!hasSK?'Install scikit-learn':false},()=>{
 let n=0;
 for(const [i,s] of t.steps.entries()){
  if(!s.code||!s.output)continue;
  const r=spawnSync('python3',['-W','error','-c',s.code],{encoding:'utf8',timeout:16000});
  assert.equal(r.status,0,'L02 '+(i+1)+' '+s.title+': '+r.stderr);
  assert.equal(r.stdout.trimEnd(),s.output,'L02 scene '+(i+1)+' '+s.title);
  n++;
 }
 assert.ok(n>=14,'Too few independent numeric examples: '+n);
});
test('L02 changed inputs keep dummy trivial, penalties explicit and test independent',{skip:!hasSK?'Install scikit-learn':false},()=>{
 const cases=[
 ["from sklearn.dummy import DummyClassifier;m=DummyClassifier(strategy='most_frequent').fit([[0],[1],[2]],[1,1,0]);print(m.predict([[-100],[999]]).tolist())","[1, 1]"],
 ["from sklearn.linear_model import LinearRegression;m=LinearRegression().fit([[0],[1],[2]],[1,3,5]);print(round(float(m.predict([[10]])[0]),1))","21.0"],
 ["from sklearn.linear_model import LogisticRegression;X=[[0],[1],[2],[3]];y=[0,0,1,1];a=LogisticRegression(C=.1,max_iter=300,random_state=0).fit(X,y);b=LogisticRegression(C=100,max_iter=300,random_state=0).fit(X,y);print(abs(a.coef_[0,0])<abs(b.coef_[0,0]))","True"],
 ["from sklearn.tree import DecisionTreeClassifier;X=[[0],[1],[2],[3]];y=[0,0,1,1];m=DecisionTreeClassifier(max_depth=2,random_state=0).fit(X,y);print(m.get_depth(),m.predict([[.5],[2.5]]).tolist())","1 [0, 1]"],
 ["from sklearn.dummy import DummyClassifier;m=DummyClassifier(strategy='most_frequent').fit([[0],[1],[2],[3]],[0,0,1,1]);print(m.predict([[.5],[2.5]]).tolist())","[0, 0]"],
 ];
 for(const [source,expected] of cases){
  const r=spawnSync('python3',['-W','error','-c',source],{encoding:'utf8',timeout:16000});
  assert.equal(r.status,0,source+': '+r.stderr);
  assert.equal(r.stdout.trim(),expected,source);
 }
});
