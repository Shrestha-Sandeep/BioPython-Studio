import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root));
const html=read('index.html').toString('utf8');
const manifest=JSON.parse(read('manifest.webmanifest').toString('utf8'));
test('Stable, genuine PWA identity and standalone launch on same production domain',()=>{
 assert.equal(manifest.id,'/');
 assert.equal(manifest.start_url,'/');
 assert.equal(manifest.scope,'/');
 assert.equal(manifest.display,'standalone');
 assert.match(manifest.name,/BioPython/);
 assert.ok(manifest.short_name.length>0&&manifest.short_name.length<24);
 assert.match(manifest.theme_color,/^#[0-9a-f]{6}$/i);
 assert.match(manifest.background_color,/^#[0-9a-f]{6}$/i);
 assert.ok(manifest.prefer_related_applications!==true);
 assert.match(html,/<link rel="manifest" href="\/manifest\.webmanifest">/);
 assert.match(html,/<meta name="viewport"/);
});
test('Two genuine PNG app icons, not SVGs disguised as PNGs or external URL redirects',()=>{
 const sizes=[192,512];
 for(const size of sizes){
  const item=manifest.icons.find(i=>i.sizes===size+'x'+size);
  assert.ok(item,'Missing icon '+size);
  assert.equal(item.type,'image/png');
  assert.equal(item.src,'/icons/bps-'+size+'.png');
  assert.ok(/^any(?: maskable)?$/.test(item.purpose));
  const bytes=read('icons/bps-'+size+'.png');
  assert.deepEqual([...bytes.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  assert.equal(bytes.toString('ascii',12,16),'IHDR');
  assert.equal(bytes.readUInt32BE(16),size);
  assert.equal(bytes.readUInt32BE(20),size);
  assert.ok(bytes.length>100);
 }
});
test('Mobile app support leaves course routes, learning content and current state intact',()=>{
 const scripts=['src/course-adapter.js','src/ui-first-2.js','src/tutorials/p01-viewer.js','src/tutorials/a07-data.js'];
 for(const script of scripts)assert.ok(html.includes('src="'+ './'+script+'"'));
 assert.equal((html.match(/rel="manifest"/g)||[]).length,1);
 assert.equal((html.match(/apple-touch-icon/g)||[]).length,1);
 assert.equal((html.match(/<title>Learn Python<\/title>/g)||[]).length,1);
 assert.ok(!html.includes('serviceWorker.register'), 'Do not enable unsafe offline Python-runtime cache');
});
