import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../src/tutorials/learning-illustrations.js', import.meta.url), 'utf8');
function makeElement(tag){
  return {tag,attributes:{},children:[],textContent:'',setAttribute(name,value){this.attributes[name]=String(value);},append(...nodes){this.children.push(...nodes);},replaceChildren(){this.children=[];}};
}
const window = {};
const document = {createElementNS(_ns,tag){return makeElement(tag);}};
vm.runInNewContext(source,{window,document});
const visuals=window.BioPythonTutorialIllustrations;

test('six foundation chapters offer accessible original explanations',()=>{
  let total=0;
  for(const chapter of ['P01','P02','P03','P04','P05','P06']){
    let count=0;
    for(let step=0;step<20;step++){
      if(!visuals.has(chapter,step))continue;
      const container=makeElement('div');
      assert.equal(visuals.render(container,chapter,step,{cells:31}),true);
      assert.equal(container.children.length,1);
      const svg=container.children[0];
      assert.equal(svg.tag,'svg');
      assert.equal(svg.attributes.role,'img');
      assert.ok(svg.attributes['aria-label']?.length>15);
      assert.equal(svg.attributes.viewBox,'0 0 520 165');
      assert.ok(svg.children.length>5);
      count++;
    }
    assert.ok(count>=6,`${chapter} has only ${count} diagrams`);
    total+=count;
  }
  assert.equal(total,40);
});

test('dynamic manual count is reflected in the diagram',()=>{
  const c=makeElement('div');
  visuals.render(c,'P01',3,{cells:31});
  const textNodes=(node)=>[node.textContent,...node.children.flatMap(textNodes)].join('|');
  assert.match(textNodes(c),/31/);
  visuals.render(c,'P01',3,{cells:9});
  assert.match(textNodes(c),/9/);
  assert.doesNotMatch(textNodes(c),/31/);
});

test('missing steps leave no stale illustration behind',()=>{
  const c=makeElement('div');
  visuals.render(c,'P02',6);
  assert.equal(visuals.render(c,'P02',0),false);
  assert.equal(c.children.length,0);
});

test('TTS progress reveals successive concepts and fully resets after pause/stop',()=>{
  const c=makeElement('div');
  visuals.render(c,'P05',1);
  const svg=c.children[0];
  const parts=svg.children.filter(node=>node.attributes['data-bps-part']!==undefined);
  assert.equal(parts.length,4);
  const makeClasses=()=>{
    const names=new Set();
    return {add:k=>names.add(k),remove:(...ks)=>ks.forEach(k=>names.delete(k)),
      toggle:(k,on)=>on?names.add(k):names.delete(k),contains:k=>names.has(k)};
  };
  svg.classList=makeClasses();
  parts.forEach(part=>{part.classList=makeClasses();});
  svg.querySelectorAll=()=>parts;
  c.querySelector=()=>svg;
  visuals.progress(c,0);
  assert.equal(parts[0].classList.contains('bps-is-current'),true);
  assert.equal(parts[3].classList.contains('bps-is-future'),true);
  visuals.progress(c,0.8);
  assert.equal(parts[3].classList.contains('bps-is-current'),true);
  assert.equal(parts[0].classList.contains('bps-is-future'),false);
  visuals.progress(c,null);
  assert.equal(svg.classList.contains('bps-is-speaking'),false);
  assert.ok(parts.every(part=>!part.classList.contains('bps-is-future')));
});
