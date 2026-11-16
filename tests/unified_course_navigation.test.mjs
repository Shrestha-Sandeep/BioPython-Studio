import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const adapter=read('src/course-adapter.js');
const html=read('index.html');
const ui=read('src/ui-first.js'),mobile=read('src/ui-first-2.js');
const ids={
 Python: ['P01','P02','P03','P04','P05','P06'],
 Microscopy: Array.from({length:13},(_,i)=>'I'+String(i+1).padStart(2,'0')),
 NGS: ['N01','N02','N03','N04'],
 ML: ['L01','L02','L03'],
 Advanced: ['A00','A01','A02','A03','A05','A06','A07']
};
test('33 concrete learning chapters form five mutually exclusive course categories',()=>{
 assert.equal(Object.values(ids).flat().length,33);
 assert.equal(new Set(Object.values(ids).flat()).size,33);
 for(const id of Object.values(ids).flat()){
  const chapter=JSON.parse(read('content/'+id.toLowerCase()+'/lesson.json'));
  assert.equal(chapter.chapter_id,id);
  assert.equal(chapter.schema_version,'bps.chapter.v1');
  assert.ok(chapter.goals.length>0&&chapter.capstone&&chapter.review,id);
  assert.match(adapter,new RegExp('\\b'+id+'\\b'));
 }
 assert.ok(!ids.Advanced.includes('A04'),'Do not fabricate a mandatory A04');
});
test('all five topics visible on ordinary home, with no URL opt-in',()=>{
 for(const stage of Object.keys(ids))assert.match(html,new RegExp('data-stage="'+stage+'"'));
 assert.match(adapter,/const IDS=\[\.\.\.P_IDS,\.\.\.I_IDS,\.\.\.N_IDS,\.\.\.L_IDS,\.\.\.A_IDS\]/);
 assert.match(adapter,/Advanced:A_IDS/);
 assert.match(ui,/Advanced: \{ title: "Research workflow workspace"/);
 assert.match(mobile,/Advanced:"Research"/);
 assert.match(adapter,/let activeId=advancedLab\?"A00":"P01"/);
});
test('advanced is independent of microscopy and maintains local draft identity',()=>{
 assert.match(adapter,/A_IDS\.includes\(id\)\?\(advancedLab\?"Microscopy":"Advanced"\)/);
 assert.match(adapter,/else if\(A_IDS\.includes\(id\)\)\{if\(advancedLab\)lastI=id;else lastA=id;\}/);
 assert.match(adapter,/Advanced:lastA/);
 assert.match(adapter,/biopython\.\+id\.toLowerCase\(\)\+"\.v1"/);
 assert.match(adapter,/biopython\.advanced-selected\.v1/);
 assert.match(adapter,/biopython\.course-selected\.v1/);
 assert.match(adapter,/optgroup/);
 assert.match(adapter,/A_IDS\.slice\(0,4\)/);
 assert.match(adapter,/A_IDS\.slice\(4\)/);
 assert.match(adapter,/if\(advancedLab\)document\.querySelector/);
});
