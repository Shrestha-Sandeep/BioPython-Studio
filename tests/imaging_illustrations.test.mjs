import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../src/tutorials/imaging-illustrations.js',import.meta.url),'utf8');
function element(tag){
 return {tag,attributes:{},children:[],textContent:'',
  setAttribute(k,v){this.attributes[k]=String(v);},
  append(node){this.children.push(node);},
  replaceChildren(){this.children=[];}};
}
const window={};const document={createElementNS(_ns,tag){return element(tag);}};
vm.runInNewContext(source,{document,window});
const diagrams=window.BioPythonImagingIllustrations;
const flatten=n=>[n,...n.children.flatMap(flatten)];
const labels=n=>flatten(n).map(node=>node.textContent).join(' ');

test('I01/I02 diagrams are original and accessible',()=>{
 let count=0;
 for(const [chapter,expected] of [['I01',12],['I02',13],['I03',13],['I04',12],['I05',11],['I06',16],['I07',13],['I08',16]]){
  let found=0;
  for(let step=0;step<20;step++){
   if(!diagrams.has(chapter,step))continue;
   const box=element('div');
   assert.equal(diagrams.render(box,chapter,step),true);
   assert.equal(box.children.length,1);
   assert.equal(box.children[0].tag,'svg');
   assert.equal(box.children[0].attributes.role,'img');
   assert.ok(box.children[0].attributes['aria-label'].length>15);
   assert.ok(flatten(box).length>7,chapter+':'+step);
   found++;
  }
  assert.equal(found,expected,chapter);
  count+=found;
 }
 assert.equal(count,106);
});
test('prediction diagram does not reveal hidden cell answer',()=>{
 const box=element('div');
 diagrams.render(box,'I01',5);
 assert.match(labels(box),/\?/);
 assert.doesNotMatch(labels(box),/\b9\b/);
 diagrams.render(box,'I01',6);
 assert.match(labels(box),/\b9\b/);
 diagrams.render(box,'I02',7);
 assert.match(labels(box),/\?/);
 diagrams.render(box,'I02',8);
 assert.match(labels(box),/\b99\b/);
});
test('I02 ROI selected cells align with the actual half-open slice',()=>{
 const box=element('div');
 diagrams.render(box,'I02',1);
 const selected=flatten(box).filter(n=>n.attributes.stroke==='#72e0bb'&&n.tag==='rect');
 assert.equal(selected.length,6);
 for(const value of ['7','8','9','12','13','14'])assert.match(labels(box),new RegExp('\\b'+value+'\\b'));
});
test('nonexistent scene clears stale diagram',()=>{
 const box=element('div');
 diagrams.render(box,'I02',1);
 assert.equal(diagrams.render(box,'I02',99),false);
 assert.equal(box.children.length,0);
});

test('I03 prediction hides the missing-value outcome before revealing it',()=>{
 const box=element('div');
 diagrams.render(box,'I03',8);
 assert.match(labels(box),/Result: \?/);
 assert.doesNotMatch(labels(box),/np\.nanmean/);
 diagrams.render(box,'I03',9);
 assert.match(labels(box),/nanmean/);
 assert.match(labels(box),/3\.0/);
});

test('I04 histogram explains the exact half-open bin counts',()=>{
 const box=element('div');
 diagrams.render(box,'I04',5);
 const t=labels(box);
 assert.match(t,/COUNT EACH INPUT ONCE/);
 for(const v of ['0–1','1–2','2–3','3–4'])assert.ok(t.includes(v));
 const groups=flatten(box).filter(n=>n.attributes['data-bps-part']!==undefined);
 assert.equal(groups.length,4);
 for(const n of ['0','2','1'])assert.match(t,new RegExp('\\b'+n+'\\b'));
});
test('I04 contrast comparison uses exactly the numerical source values',()=>{
 const box=element('div');
 diagrams.render(box,'I04',8);
 const groups=flatten(box).filter(n=>n.attributes['data-bps-part']!==undefined);
 assert.equal(groups.length,2);
 for(const v of ['0','100','150','255'])assert.match(labels(box),new RegExp('\\b'+v+'\\b'));
 assert.match(labels(box),/DISPLAY 50–200/);
});
test('I04 checkpoint does not expose the source-array equality answer',()=>{
 const box=element('div');
 diagrams.render(box,'I04',9);
 assert.match(labels(box),/Equal afterward: \?/);
 assert.doesNotMatch(labels(box),/True/);
 diagrams.render(box,'I04',10);
 assert.match(labels(box),/True/);
});

test('I05 mask diagrams show only source pixels above the strict cutoff',()=>{
 const box=element('div');
 for(const [index,expected] of [[6,4],[7,2],[9,1]]){
  diagrams.render(box,'I05',index);
  const groups=flatten(box).filter(n=>n.attributes['data-bps-part']!==undefined);
  assert.equal(groups.length,2);
  const mask=groups[1];
  const ones=flatten(mask).filter(n=>n.tag==='text'&&n.textContent==='1');
  assert.equal(ones.length,expected,'I05 diagram '+index);
 }
});
test('I05 candidate threshold prediction has no numerical answer before reveal',()=>{
 const box=element('div');
 diagrams.render(box,'I05',8);
 assert.match(labels(box),/How many survive\?/);
 assert.doesNotMatch(labels(box),/Candidate pixels: 1/);
 diagrams.render(box,'I05',9);
 assert.match(labels(box),/only the pixel 12/);
});

test('I06 paired masks show actual region structure and hide the prediction',()=>{
 const box=element('div');
 diagrams.render(box,'I06',3);
 let txt=labels(box);
 assert.match(txt,/Three diagonal pixels/);
 const groups=flatten(box).filter(n=>n.attributes['data-bps-part']!==undefined);
 assert.equal(groups.length,2);
 assert.match(txt,/1/);assert.match(txt,/2/);assert.match(txt,/3/);
 diagrams.render(box,'I06',5);
 txt=labels(box);assert.match(txt,/Count = \\?/);
 assert.doesNotMatch(txt,/4-neighbor: 4/);
 diagrams.render(box,'I06',6);
 assert.match(labels(box),/4-neighbor: 4 labels/);
 diagrams.render(box,'I06',9);
 assert.match(labels(box),/Top-edge component excluded/);
});

test('I07 diagrams retain source ID and do not leak checkpoint answers',()=>{
 const box=element('div');
 diagrams.render(box,'I07',1);
 assert.match(labels(box),/SOURCE RECORDS/);
 assert.match(labels(box),/S01/);
 assert.match(labels(box),/F01/);
 diagrams.render(box,'I07',6);
 assert.match(labels(box),/Which field IDs/);
 assert.doesNotMatch(labels(box),/F02: 0.8/);
 diagrams.render(box,'I07',7);
 assert.match(labels(box),/F02: 0.8/);
 diagrams.render(box,'I07',14);
 assert.match(labels(box),/MISSING/);
 assert.match(labels(box),/ZERO/);
});

test('I08 join visuals disclose unmatched rows, retain specimen hierarchy and hide prediction answer',()=>{
 const box=element('div');
 diagrams.render(box,'I08',1);
 assert.match(labels(box),/3 source fields stay 3/);
 assert.match(labels(box),/S1/);
 diagrams.render(box,'I08',3);
 assert.match(labels(box),/left_only/);
 diagrams.render(box,'I08',7);
 assert.match(labels(box),/New row count = \?/);
 assert.doesNotMatch(labels(box),/Six long rows/);
 diagrams.render(box,'I08',8);
 assert.match(labels(box),/Six long rows/);
 diagrams.render(box,'I08',17);
 assert.match(labels(box),/S3 unmatched/);
});
