/* State is versioned separately from all historical lesson records. */
(function (root) {
  'use strict';
  const KEY = 'biopython_studio_v3';
  const LEGACY_KEY = 'biopython_studio_personal_v1';
  const DELAY = 24 * 60 * 60 * 1000;
  const object = v => v && typeof v === 'object' && !Array.isArray(v);
  function fresh() { return {schema:3, current:null, skills:{}, legacySnapshots:[]}; }
  function validate(state) {
    if (!object(state) || state.schema !== 3 || !object(state.skills) || !Array.isArray(state.legacySnapshots)) throw new Error('This is not a BioPython Studio v3 progress file.');
    for (const [id,skill] of Object.entries(state.skills)) {
      if (['__proto__','constructor','prototype'].includes(id)) throw new Error('Invalid activity ID.');
      if (!object(skill) || !['predict','run','investigate','modify','write','debug','transfer'].includes(skill.stage) || !object(skill.drafts) || !object(skill.passed) || !object(skill.hints) || !Array.isArray(skill.attempts)) throw new Error('A saved activity record is invalid.');
      if (Object.values(skill.drafts).some(v=>typeof v!=='string') || Object.values(skill.hints).some(v=>!Number.isInteger(v)||v<0||v>3)) throw new Error('Invalid draft or assistance record.');
    }
    if (!state.legacySnapshots.every(x => typeof x === 'string')) throw new Error('Invalid legacy archive.');
    if (state.importArchive && !Array.isArray(state.importArchive)) throw new Error('Invalid import archive.');
    return state;
  }
  function load(storage) {
    const text = storage.getItem(KEY);
    const state = text ? validate(JSON.parse(text)) : fresh();
    const legacy = storage.getItem(LEGACY_KEY);
    if (legacy && !state.legacySnapshots.includes(legacy)) state.legacySnapshots.push(legacy);
    return state;
  }
  function record(state,id) {
    return state.skills[id] ||= {stage:'predict', drafts:{}, passed:{}, hints:{}, attempts:[], prediction:'', explanation:null};
  }
  function evidence(skill) {
    if (!skill) return 'unseen';
    if (skill.needsReview) return 'needs review';
    if (skill.retainedAt) return 'retained';
    if (skill.independentAt) return 'independent';
    if (skill.guidedAt) return 'guided';
    return 'explored';
  }
  function ready(state, competency) {
    return competency.prerequisites.every(id => !!state.skills[id]?.guidedAt);
  }
  function due(skill,now=Date.now()) { return !!skill?.reviewAt && now >= skill.reviewAt; }
  function assess(skill,stage,result,now=Date.now()) {
    if(stage==='transfer' && (!due(skill,now) || skill.attempts.some(a=>a.stage==='transfer'&&a.reviewIndex===skill.activeReview&&a.ok))) return;
    const assisted = (skill.hints[stage] || 0) > 0;
    const priorFailure=stage==='transfer' && skill.attempts.some(a=>a.stage==='transfer'&&a.reviewIndex===skill.activeReview&&!a.ok);
    skill.attempts.push({stage,ok:!!result.ok,assisted,at:now,...(stage==='transfer'?{reviewIndex:skill.activeReview}: {})});
    skill.passed[stage] = !!result.ok;
    if (stage === 'transfer' && !result.ok) {skill.needsReview = true;skill.retainedAt = null;}
    if (!result.ok) return;
    if (stage === 'write' && !assisted) { skill.independentAt ||= now; }
    if (stage === 'debug') { skill.guidedAt ||= now; skill.reviewAt ||= now + DELAY; }
    if (stage === 'transfer' && due(skill,now)) {
      if (!assisted) {
        if (skill.independentAt && !priorFailure) skill.retainedAt = now;
        else skill.independentAt ||= now;
        skill.needsReview = false;
      }
      skill.reviewAt = now + DELAY;
    }
  }
  function migrateAliases(state, manifest) {
    const aliases = {};
    for (const raw of state.legacySnapshots) {
      let old; try { old = JSON.parse(raw); } catch (_) { continue; }
      for (const row of manifest.legacy_migration) {
        const id = row.legacy_id;
        if (old?.completed?.[id] || typeof old?.drafts?.[id] === 'string' || old?.hintUsed?.[id]) {
          (aliases[row.target_competency_id] ||= []).push({legacyId:id,completion:old.completed?.[id] ?? null,draft:old.drafts?.[id] ?? null,hintUsed:old.hintUsed?.[id] ?? false});
        }
      }
    }
    // Historical completions are history only, never new mastery or unlocks.
    return aliases;
  }
  function untouched(skill) {
    return skill && skill.stage==='predict' && !skill.prediction && !skill.guidedAt && !skill.independentAt && !skill.retainedAt && !skill.needsReview && !Object.keys(skill.drafts).length && !Object.keys(skill.passed).length && !Object.keys(skill.hints).length && !skill.attempts.length;
  }
  function merge(local, incoming) {
    validate(incoming);
    const merged = structuredClone(local);
    if(Object.values(local.skills).every(untouched)) merged.current=incoming.current;
    merged.importArchive = [...(local.importArchive||[]),...(incoming.importArchive||[])];
    merged.legacySnapshots = [...new Set([...local.legacySnapshots,...incoming.legacySnapshots])];
    for (const [id, skill] of Object.entries(incoming.skills)) {
      if (!merged.skills[id] || untouched(merged.skills[id])) merged.skills[id] = structuredClone(skill);
      else if (JSON.stringify(merged.skills[id]) !== JSON.stringify(skill)) {
        // Keep both versions; importing must never overwrite a local draft.
        (merged.importArchive ||= []).push({id,record:structuredClone(skill)});
      }
    }
    if(!merged.importArchive.length)delete merged.importArchive;
    return merged;
  }
  const api = {KEY,LEGACY_KEY,DELAY,fresh,validate,load,record,evidence,ready,due,assess,migrateAliases,merge,untouched};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LearningState = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
