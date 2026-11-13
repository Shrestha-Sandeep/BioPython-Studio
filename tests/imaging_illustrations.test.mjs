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
 for(const [chapter,expected] of [['I01',12],['I02',13]]){
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
 assert.equal(count,25);
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
