import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const ctx={window:{}};
const source=read('src/tutorials/a00-data.js');
assert.doesNotThrow(()=>new Function(source));
vm.runInNewContext(source,ctx);
const chapters=JSON.parse(JSON.stringify(ctx.window.BioPythonAdvancedTutorials));
const t=chapters.find(x=>x.chapter==='A00');
const html=read('index.html'),viewer=read('src/tutorials/p01-viewer.js'),pictures=read('src/tutorials/advanced-illustrations.js');
function run(code){
  const r=spawnSync('python3',['-W','error','-c',code],{encoding:'utf8',timeout:20000});
  assert.equal(r.status,0,r.stderr||code);
  return r.stdout.trimEnd();
}
test('A00 canon, sixteen meaningful scenes, withheld prediction and unassisted transfer',()=>{
  assert.ok(t);
  assert.equal(t.steps.length,16);
  assert.deepEqual(t.goals,['A00-G01','A00-G02','A00-G03','A00-G04','A00-G05','A00-CAPSTONE']);
  assert.deepEqual([...new Set(t.steps.map(s=>s.goal))],t.goals);
  assert.deepEqual(t.steps.flatMap((s,i)=>s.checkpoint?[i]:[]),[8]);
  assert.equal(t.steps[8].output,'');
  assert.equal(t.steps[8].visual.at(-1)[1],'Withheld');
  assert.equal(t.steps[9].output,"{'A': 6.0, 'B': 10.0} 2");
  assert.equal(t.steps.at(-1).code,'');
  assert.equal(t.steps.at(-1).output,'');
  assert.match(t.steps.at(-1).title,/Independent transfer/i);
  assert.ok(!t.goals.includes('A00-REVIEW'),'Delayed independent review is never a solved viewer scene');
  for(const s of t.steps){
    assert.ok(s.say.trim().split(/\s+/).length>=16,s.title);
    assert.ok(s.note.length>=50,s.title);
    assert.ok(s.visual.every(x=>x.length===2),s.title);
    const count=s.code?s.code.split('\n').length:0;
    for(const line of s.focus)assert.ok(line>=1&&line<=count,s.title+': '+line);
    if(s.output)assert.ok(s.code,s.title);
  }
});
test('A00 integrates original SVG viewer, preserving frozen course and storage contract',()=>{
  for(const name of ['advanced-illustrations.js','a00-data.js','p01-viewer.js'])
    assert.ok(html.includes('src/tutorials/'+name));
  assert.ok(html.indexOf('src/tutorials/advanced-illustrations.js')<html.indexOf('src/tutorials/a00-data.js'));
  assert.ok(html.indexOf('src/tutorials/a00-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
  assert.match(viewer,/window\.BioPythonAdvancedTutorials/);
  assert.match(viewer,/window\.BioPythonAdvancedIllustrations/);
  assert.match(pictures,/role:"img"/);
  assert.match(pictures,/data-bps-part/);
  assert.equal((pictures.match(/kind:"(?:route|split|cards|animals)"/g)||[]).length,16);
  assert.match(read('src/course-adapter.js'),/advancedLab.*get\("lab"\)==="advanced"/);
});
test('A00 every printed example matches fresh native CPython',()=>{
  let tested=0;
  for(const [i,s] of t.steps.entries()){
    if(!s.code||!s.output)continue;
    assert.equal(run(s.code),s.output,'A00 scene '+(i+1)+': '+s.title);
    tested++;
  }
  assert.ok(tested>=11,'Expected at least eleven independently executed scenes');
});
test('A00 independent input perturbations and scientific guardrails',()=>{
  const cases=[
    ["rows=[('A',3),('A',9),('B',9),('C',2)];print(len(rows),len({a for a,_ in rows}))","4 3"],
    ["from pathlib import Path;root=Path('/work/raw').resolve();print((root/'other.csv').resolve().is_relative_to(root),(root/'../other.csv').resolve().is_relative_to(root))","True False"],
    ["from pathlib import PurePosixPath;p=PurePosixPath('/tmp/raw.csv');print(p.is_absolute());print('..' in PurePosixPath('../escape.csv').parts)","True\nTrue"],
    ["def ok(x):return x is not None and x>=.8;print(ok(.8),ok(.799),ok(None))","True False False"],
    ["import hashlib;print(hashlib.sha256(b'abc').digest()!=hashlib.sha256(b'abd').digest())","True"],
    ["import json,hashlib;f=lambda d:hashlib.sha256(json.dumps(d,sort_keys=True,separators=(',',':')).encode()).hexdigest();print(f({'b':2,'a':1})==f({'a':1,'b':2}));print(f({'a':1})!=f({'a':2}))","True\nTrue"],
    ["from collections import defaultdict;rows=[('A',4),('A',6),('B',9),('C',3)];d=defaultdict(list);[(d[a].append(x)) for a,x in rows];print({a:sum(v)/len(v) for a,v in d.items()},len(d))","{'A': 5.0, 'B': 9.0, 'C': 3.0} 3"]
  ];
  for(const [src,expected] of cases)assert.equal(run(src),expected,src);
});
