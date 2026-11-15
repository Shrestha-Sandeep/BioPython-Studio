import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';

const root=new URL('../',import.meta.url),read=x=>readFileSync(new URL(x,root),'utf8');
const ctx={window:{}};
for(const file of ['a00','a01','a02']){
 const src=read('src/tutorials/'+file+'-data.js');
 assert.doesNotThrow(()=>new Function(src));
 vm.runInNewContext(src,ctx);
}
const chapters=JSON.parse(JSON.stringify(ctx.window.BioPythonAdvancedTutorials));
const t=chapters.find(x=>x.chapter==='A02'),fig=read('src/tutorials/advanced-illustrations.js'),html=read('index.html');
const hasScience=spawnSync('python3',['-c','import numpy,scipy,skimage'],{encoding:'utf8'}).status===0;
function py(code){
 const p=spawnSync('python3',['-W','error','-c',code],{encoding:'utf8',timeout:18000});
 assert.equal(p.status,0,'CPython code failed: '+code+'\n'+p.stderr);
 return p.stdout.trimEnd();
}
test('A02 canonical goals, 17 scientific scenes, hidden prediction and independent review',()=>{
 assert.deepEqual(chapters.map(c=>c.chapter),['A00','A01','A02']);
 assert.ok(t);
 assert.deepEqual(t.goals,['A02-G01','A02-G02','A02-G03','A02-G04','A02-G05','A02-CAPSTONE']);
 assert.equal(t.steps.length,17);
 assert.deepEqual([...new Set(t.steps.map(s=>s.goal))],t.goals);
 assert.deepEqual(t.steps.flatMap((s,i)=>s.checkpoint?[i]:[]),[8]);
 assert.equal(t.steps[8].output,'');
 assert.equal(t.steps[8].visual.at(-1)[1],'Withheld');
 assert.equal(t.steps[9].output,'[2, 3] 2');
 assert.equal(t.steps.at(-1).code,'');
 assert.equal(t.steps.at(-1).output,'');
 assert.match(t.steps.at(-1).title,/Independent transfer/i);
 assert.ok(!t.goals.includes('A02-REVIEW'));
 for(const [i,s] of t.steps.entries()){
   assert.ok(s.say.split(/\s+/).length>=16,s.title);
   assert.ok(s.note.length>=55,s.title);
   assert.ok(s.visual.every(v=>v.length===2),s.title);
   const n=s.code?s.code.split('\n').length:0;
   for(const v of s.focus)assert.ok(v>=1&&v<=n,s.title+':'+v);
   if(s.output)assert.ok(s.code,s.title);
 }
});
test('A02 original diagrams use accessible mask visuals and existing frozen viewer',()=>{
 assert.ok(html.indexOf('src/tutorials/a01-data.js')<html.indexOf('src/tutorials/a02-data.js'));
 assert.ok(html.indexOf('src/tutorials/a02-data.js')<html.indexOf('src/tutorials/p01-viewer.js'));
 assert.match(fig,/const DATA02=/);
 assert.match(fig,/function mask\(/);
 assert.match(fig,/ch==="A02"/);
 assert.match(fig,/role:"img"/);
 const block=fig.slice(fig.indexOf('const DATA02='),fig.indexOf('const DATA03='));
 assert.equal((block.match(/kind:"(?:route|split|cards|animals|axis|pixels|mask)"/g)||[]).length,17);
});
test('A02 all printed NumPy/SciPy/scikit-image outputs match native CPython',{skip:!hasScience?'Install science dependencies':false},()=>{
 let n=0;
 for(const [i,s] of t.steps.entries()){
   if(!s.code||!s.output)continue;
   assert.equal(py(s.code),s.output,'A02 scene '+(i+1)+' '+s.title);
   n++;
 }
 assert.ok(n>=13,'Not enough independent examples: '+n);
});
test('A02 changed inputs prevent silent scientific over-interpretation',{skip:!hasScience?'Install science dependencies':false},()=>{
 const cases=[
 ["import numpy as np;a=np.array([[1,2],[3,4]],dtype=np.uint16);v=np.maximum(0,a.astype(float)-2);print(v.tolist(),int((v>0).sum()))","[[0.0, 0.0], [1.0, 2.0]] 2"],
 ["import numpy as np;a=np.array([[1,2],[3,4]]);print(int((a>2).sum()),int((a<2).sum()))","2 1"],
 ["import numpy as np;from skimage.measure import label;m=np.eye(3,dtype=bool);print(label(m,connectivity=1).max(),label(m,connectivity=2).max())","3 1"],
 ["import numpy as np;from skimage.measure import label;m=np.array([[1,1,0],[0,0,0],[0,0,1]],bool);a=np.bincount(label(m,connectivity=1).ravel())[1:];print(sorted(int(x) for x in a if x>=2))","[2]"],
 ["import numpy as np;from scipy.ndimage import distance_transform_edt;from skimage.segmentation import watershed;m=np.zeros((3,7),bool);m[1,1:6]=True;d=distance_transform_edt(m);s=np.zeros_like(m,int);s[1,2]=1;t=s.copy();t[1,4]=2;print(int(watershed(-d,s,mask=m).max()),int(watershed(-d,t,mask=m).max()))","1 2"],
 ["import numpy as np;m=np.zeros((3,5),bool);seeds=[(1,2),(7,2)];print(all(0<=y<m.shape[0] and 0<=x<m.shape[1] and m[y,x] for y,x in seeds))","False"],
 ["import numpy as np;a=np.zeros((2,2),bool);b=a.copy();union=np.logical_or(a,b).sum();iou=1.0 if union==0 else np.logical_and(a,b).sum()/union;print(iou, bool(a.any()))","1.0 False"],
 ["import numpy as np;a=np.array([[1,1],[0,0]],bool);b=np.array([[1,0],[0,1]],bool);print(round(float(np.logical_and(a,b).sum()/np.logical_or(a,b).sum()),3),round(float(np.logical_xor(a,b).mean()),3))","0.333 0.5"]
 ];
 for(const [code,expect] of cases)assert.equal(py(code),expect,code);
});
