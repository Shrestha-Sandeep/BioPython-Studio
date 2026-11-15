import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const ctx={window:{}};
for(const ch of ['a00','a01','a02','a03','a05','a06','a07']){const s=read('src/tutorials/'+ch+'-data.js');assert.doesNotThrow(()=>new Function(s));vm.runInNewContext(s,ctx);}
const chapters=JSON.parse(JSON.stringify(ctx.window.BioPythonAdvancedTutorials));
const t=chapters.find(x=>x.chapter==='A07'),art=read('src/tutorials/advanced-illustrations.js'),html=read('index.html');
function py(code){const r=spawnSync('python3',['-W','error','-c',code],{encoding:'utf8',timeout:16000});assert.equal(r.status,0,code+'\n'+r.stderr);return r.stdout.trimEnd();}
test('A07 canonical independent seven-gate science primer has 18 scenes and no leaked review',()=>{
 assert.deepEqual(chapters.map(c=>c.chapter),['A00','A01','A02','A03','A05','A06','A07']);
 assert.deepEqual(t.goals,['A07-G01','A07-G02','A07-G03','A07-G04','A07-G05','A07-G06','A07-G07','A07-CAPSTONE']);
 assert.equal(t.steps.length,18);
 assert.deepEqual([...new Set(t.steps.map(s=>s.goal))],t.goals);
 assert.deepEqual(t.steps.flatMap((s,i)=>s.checkpoint?[i]:[]),[9]);
 assert.equal(t.steps[9].output,'');assert.equal(t.steps[9].visual.at(-1)[1],'Withheld');
 assert.equal(t.steps[10].output,"['B'] 2 2");
 assert.equal(t.steps.at(-1).code,'');assert.equal(t.steps.at(-1).output,'');
 assert.match(t.steps.at(-1).title,/Independent transfer/i);
 assert.ok(!t.goals.includes('A07-REVIEW'));
 for(const s of t.steps){
  assert.ok(s.say.trim().split(/\s+/).length>=17,s.title);
  assert.ok(s.note.length>=62,s.title);
  assert.ok(s.visual.every(v=>v.length===2),s.title);
  const n=s.code?s.code.split('\n').length:0;
  for(const k of s.focus)assert.ok(k>=1&&k<=n,s.title+':'+k);
  if(s.output)assert.ok(s.code,s.title);
 }
});
test('A07 original decision diagrams, visible source and unchanged frozen viewer',()=>{
 assert.ok(html.indexOf('src/tutorials/a06-data.js')<html.indexOf('src/tutorials/a07-data.js'));
 assert.ok(html.indexOf('src/tutorials/a07-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 const src=art.slice(art.indexOf('const DATA07='),art.indexOf('const make='));
 assert.equal((src.match(/kind:"(?:route|cards|split|axis|decision)"/g)||[]).length,18);
 assert.match(art,/function decision\(/);assert.match(art,/ch==="A07"/);assert.match(art,/role:"img"/);
});
test('A07 all displayed scientific outputs equal real native CPython',()=>{
 let n=0;for(const [i,s] of t.steps.entries())if(s.code&&s.output){assert.equal(py(s.code),s.output,'A07 scene '+(i+1));n++;}
 assert.ok(n>=14);
});
test('A07 changed-input scientific gating refuses invalid reference, leaked groups and absent replay',()=>{
 const cases=[
 ["required=['target_definition','biological_unit','exclusion_rules'];plan={'target_definition':'nucleus'};print(sorted(k for k in required if not plan.get(k)))","['biological_unit', 'exclusion_rules']"],
 ["axes='TCZYX';shape=[2,3,2,4,5];print([shape[axes.index('Y')],shape[axes.index('X')]])","[4, 5]"],
 ["kind='counts';ids=False;print(kind=='pixel_masks',kind=='pixel_masks' and ids)","False False"],
 ["r=[('A','development'),('A','holdout')];print(sorted({g for g,s in r if s=='development'}&{g for g,s in r if s=='holdout'}))","['A']"],
 ["tp=[4,1];fp=[1,1];fn=[0,2];T,F,N=sum(tp),sum(fp),sum(fn);print(round(2*T/(2*T+F+N),3))","0.714"],
 ["truth=[2,5,1];pred=[2,2,4];print(round(sum(abs(a-b) for a,b in zip(truth,pred))/len(truth),2))","2.0"],
 ["exp={'source':'a','config':'b','result':'c'};got={'source':'x','config':'b','result':'c'};print(sorted(k for k in exp if exp[k]!=got[k]))","['source']"],
 ["hash_match=True;fresh=False;print(hash_match and fresh)","False"],
 ["leak=True;annotations=True;reproducible=True;f1=1.;decision='NO_GO' if (leak or not reproducible) else ('MORE_ANNOTATION' if not annotations else ('IMPROVE_METHOD' if f1<.8 else 'REVIEW'));print(decision)","NO_GO"],
 ["leak=False;annotations=False;reproducible=True;f1=.95;decision='NO_GO' if (leak or not reproducible) else ('MORE_ANNOTATION' if not annotations else ('IMPROVE_METHOD' if f1<.8 else 'REVIEW'));print(decision)","MORE_ANNOTATION"]
 ];
 for(const [source,expected] of cases)assert.equal(py(source),expected,source);
});
