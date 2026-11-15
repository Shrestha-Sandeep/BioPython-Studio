import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const src=fs.readFileSync(new URL('../src/tutorials/microscopy-storyboard.js',import.meta.url),'utf8');
function node(tag,txt=''){
  return {tag,children:[],attributes:{},textContent:txt,className:'',
    setAttribute(key,value){this.attributes[key]=String(value);},
    replaceChildren(){this.children=[];},
    append(...items){this.children.push(...items);}};
}
const document={
  createElement(tag){return node(tag);},
  createTextNode(text){return node('#text',text)}
};
const window={};
vm.runInNewContext(src,{document,window});
const workflow=window.BioPythonMicroscopyWorkflow;
const descendants=n=>[n,...(n.children||[]).flatMap(descendants)];
const words=n=>[n.textContent,...(n.children||[]).map(words)].join(' ');

test('each chapter previews an honest microscopy-to-report workflow',()=>{
  for(const chapter of ['P01','P02','P03','P04','P05','P06']){
    const container=node('div');
    assert.equal(workflow.render(container,chapter,31),true);
    assert.equal(container.children.length,1);
    const all=descendants(container);
    const images=all.filter(x=>x.tag==='img');
    assert.equal(images.length,2);
    assert.ok(images.every(x=>x.alt?.includes('Published Witz')));
    for(const img of images){
      assert.ok(fs.existsSync(new URL('../'+img.src.slice(2),import.meta.url)));
      assert.ok(fs.statSync(new URL('../'+img.src.slice(2),import.meta.url)).size>5000);
    }
    const content=words(container);
    assert.match(content,/31 cells/);
    assert.match(content,/8.0 µm/);
    assert.match(content,/not extracted from these images/);
    assert.match(content,new RegExp(chapter));
    assert.equal(all.filter(x=>x.tag==='a').length,1);
  }
});
test('changing input refreshes hypothetical numbers, without altering scientific pictures',()=>{
  const c=node('div');
  workflow.render(c,'P01',25);
  assert.match(words(c),/25 cells/);
  workflow.render(c,'P01',39);
  assert.match(words(c),/39 cells/);
  assert.doesNotMatch(words(c),/25 cells/);
});
test('invalid chapters do not leave a misleading preview',()=>{
  const c=node('div');
  workflow.render(c,'P01');
  assert.equal(workflow.render(c,'unknown'),false);
  assert.equal(c.children.length,0);
});
