/* One course path. Prerequisites guide teaching order; they never lock access. */
(function(root){
 'use strict';
 const stages=['Python','Microscopy','NGS','ML'];
 function stage(c){
  if(c.module==='M11'||c.number==='155')return 'NGS';
  if(c.module==='M12'||c.number==='156')return 'ML';
  if(['M07','M08','M09'].includes(c.module)||['153','154'].includes(c.number))return 'Microscopy';
  return 'Python';
 }
 function build(manifest,catalog){
  const byId=new Map(manifest.competencies.map(c=>[c.id,c]));
  const modern=new Set(catalog.activities.map(a=>a.id));
  const aliases=new Map();
  for(const a of manifest.legacy_migration){
   if(!aliases.has(a.target_competency_id)||a.action!=='MERGE')aliases.set(a.target_competency_id,a.legacy_id);
  }
  const preferred=manifest.recommended_complete_route||[...manifest.recommended_default_route,...manifest.optional_sequence_route,...manifest.optional_ml_route];
  const order=new Map(preferred.map((n,i)=>[n,i]));
  const done=new Set(),result=[];
  for(const label of stages){
   const pending=manifest.competencies.filter(c=>stage(c)===label).sort((a,b)=>order.get(a.number)-order.get(b.number));
   while(pending.length){
    const i=pending.findIndex(c=>c.prerequisites.every(id=>done.has(id)));
    if(i<0)throw new Error('Course stage order conflicts with a prerequisite.');
    const c=pending.splice(i,1)[0],legacy=aliases.get(c.id),kind=modern.has(c.id)?'activity':legacy?'legacy':'planned';
    result.push({...c,stage:label,kind,legacyId:legacy,legacyIds:manifest.legacy_migration.filter(a=>a.target_competency_id===c.id).map(a=>a.legacy_id),href:kind==='activity'?'./index.html?activity='+encodeURIComponent(c.id):kind==='legacy'?'./legacy.html?lesson='+encodeURIComponent(legacy):null});done.add(c.id);
   }
  }
  return result;
 }
 function available(path){return path.filter(c=>c.kind!=='planned');}
 function adjacent(path,id,offset){const items=available(path),i=items.findIndex(c=>c.id===id);return i<0?null:items[i+offset]||null;}
 function render(nav,path,current,onNavigate){
  nav.replaceChildren();
  for(const label of stages){
   const group=document.createElement('div');group.className='group-title';group.textContent=label;nav.append(group);
   for(const c of available(path).filter(c=>c.stage===label)){
    const button=document.createElement('button');button.className='step'+(c.id===current?' active':'');button.textContent=c.title;button.dataset.competency=c.id;button.dataset.kind=c.kind;button.onclick=()=>onNavigate(c);nav.append(button);
   }
  }
 }
 const api={stages,stage,build,available,adjacent,render};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CoursePath=api;
})(globalThis);
