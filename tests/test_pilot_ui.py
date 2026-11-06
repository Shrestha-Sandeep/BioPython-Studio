"""Live browser pilot verification: no mocked Worker, Python runtime or HPA images.
Run separately from offline unit tests; requires CDN and publisher access.
"""
import base64
import functools
import hashlib
import http.server
import json
import os
from pathlib import Path
import subprocess
import threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
CAT=json.loads((ROOT/'curriculum/v3_pilot.json').read_text())['activities']
class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
URL=f'http://127.0.0.1:{server.server_port}'
args=['--no-sandbox']
# Trust only the managed environment's installed proxy CA keys, if present.
# This leaves TLS validation enabled for all other certificates.
pins=[]
for cert in Path('/usr/local/share/ca-certificates').glob('*.crt'):
    pub=subprocess.check_output(['openssl','x509','-in',str(cert),'-pubkey','-noout'])
    der=subprocess.check_output(['openssl','pkey','-pubin','-outform','DER'],input=pub)
    pins.append(base64.b64encode(hashlib.sha256(der).digest()).decode())
if pins: args.append('--ignore-certificate-errors-spki-list='+','.join(pins))
proxy={'server':os.environ['HTTPS_PROXY'],'bypass':'127.0.0.1,localhost'} if os.environ.get('HTTPS_PROXY') else None

def run(page,success=True):
    page.locator('#pilot-run').click()
    page.wait_for_function("!busy",timeout=150000)
    if success:
        assert 'success' in page.locator('#pilot-feedback').get_attribute('class'),page.locator('#pilot-feedback').inner_text()

try:
 with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None,headless=True,args=args,proxy=proxy)
    page=browser.new_page(viewport={'width':1440,'height':1000})
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(URL)
    page.locator('#save-prediction').wait_for()
    for i,a in enumerate(CAT):
        page.wait_for_function('(title)=>document.querySelector("#activity-title").textContent===title',arg=a['title'])
        assert page.locator('#phase-title').inner_text()=='Predict'
        page.locator('#prediction').fill('I expect the recorded metadata and the documented result.')
        page.locator('#save-prediction').click()
        if i==1:page.wait_for_function('imageLoaded',timeout=45000)
        run(page)
        page.locator('#phase-next').click()
        page.locator('input[name=explanation][value="0"]').check()
        page.locator('#check-explanation').click()
        page.locator('#phase-next').click()
        page.locator('#pilot-editor').fill(a['stages']['modify']['reference'])
        run(page);page.locator('#phase-next').click()
        assert page.locator('#pilot-editor').input_value()==''
        if i==0:page.locator('#pilot-hint').click()
        page.locator('#pilot-editor').fill(a['stages']['write']['reference'])
        run(page);page.locator('#phase-next').click()
        page.locator('#pilot-editor').fill(a['stages']['debug']['reference'])
        run(page)
        assert page.locator('#evidence').inner_text()==('guided' if i==0 else 'independent')
        assert page.locator('#start-review').is_hidden()
        print('PASS live activity',a['number'],a['title'],flush=True)
        if i<len(CAT)-1:page.locator('#next-activity').click()
    assert not errors,errors
    page.evaluate("() => { select(catalog.activities[0].id);skill.stage='modify';render(); }")
    page.locator('#pilot-editor').fill('if field_name != "Field B07":\n    print(field_name)\n    print("Recorded")\nelse:\n    print(missing_second_input)')
    run(page,success=False)
    assert 'NameError' in page.locator('#pilot-traceback').inner_text()
    assert 'Input 2:' in page.locator('#output-case').inner_text()
    assert 'Field B07' in page.locator('#output-case').inner_text()
    # All activity drafts, hint use and position persist across a reload.
    before=page.evaluate('JSON.parse(localStorage.getItem(S.KEY))')
    page.reload();page.wait_for_function('!!activity')
    after=page.evaluate('JSON.parse(localStorage.getItem(S.KEY))')
    assert before==after
    # Advancing the test clock exercises the real delayed-transfer UI, not a 24h sleep.
    page.evaluate('''() => { const a=catalog.activities[1];state.skills[a.id].reviewAt=Date.now()-1;select(a.id); }''')
    assert page.locator('#review-reminder').is_visible()
    page.locator('#start-review').click()
    assert page.locator('#pilot-editor').input_value()==''
    assert page.locator('#pilot-hint').is_hidden()
    page.locator('#pilot-editor').fill(CAT[1]['stages']['transfer']['reference'])
    run(page)
    assert page.locator('#evidence').inner_text()=='retained'
    assert page.locator('#pilot-run').is_disabled()
    page.evaluate('() => {skill.reviewAt=Date.now()-1;render();}')
    page.locator('#start-review').click()
    assert page.locator('#pilot-editor').input_value()==''
    assert page.evaluate('skill.activeReview')==1
    page.locator('#pilot-editor').fill(CAT[1]['transfers'][1]['reference'])
    run(page)
    for width in [1440,1024,390]:
        page.set_viewport_size({'width':width,'height':950})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'),width
    # Failed publisher requests stay honest, expose retry and preserve the draft.
    page.route('https://images.proteinatlas.org/**',lambda route:route.abort())
    page.reload();page.wait_for_function('!!activity')
    page.locator('#image-retry').wait_for(state='visible',timeout=45000)
    assert 'unavailable' in page.locator('#image-status').inner_text()
    draft=page.locator('#pilot-editor').input_value()
    page.unroute('https://images.proteinatlas.org/**')
    page.locator('#image-retry').click();page.wait_for_function('imageLoaded',timeout=45000)
    assert page.locator('#pilot-editor').input_value()==draft
    print('PASS real HPA retry, persistence, delayed transfer, responsive widths, no page errors',flush=True)
    # Real export/import and legacy-page handoff for all historical IDs.
    migration=browser.new_context(accept_downloads=True)
    old=migration.new_page()
    manifest=json.loads((ROOT/'curriculum/v3_manifest.json').read_text())
    ids=[x['legacy_id'] for x in manifest['legacy_migration']]
    legacy=dict(step=60,completed={x:'independent' for x in ids},drafts={x:'# saved '+x+'\\nprint("preserved")' for x in ids},hintUsed={x:True for x in ids})
    raw=json.dumps(legacy)
    old.add_init_script('localStorage.setItem("biopython_studio_personal_v1",'+json.dumps(raw)+')')
    old.goto(URL);old.wait_for_function('!!activity')
    assert old.evaluate('Object.keys(state.skills).length')==1
    assert old.locator('#evidence').inner_text()=='explored'
    assert old.evaluate('localStorage.getItem(S.LEGACY_KEY)')==raw
    old.locator('.sidebar details.lesson-bottom summary').click()
    with old.expect_download() as download:old.locator('#export-progress').click()
    exported=json.loads(Path(download.value.path()).read_text())
    assert exported['legacySnapshots']==[raw]
    fresh=browser.new_context();imported=fresh.new_page();imported.goto(URL);imported.wait_for_function('!!activity')
    imported.locator('#import-progress').set_input_files(dict(name='progress.json',mimeType='application/json',buffer=json.dumps(exported).encode()))
    imported.wait_for_function('state.legacySnapshots.length===1')
    # Importing into an untouched first-activity page restores its actual progress.
    assert imported.evaluate('state.skills[catalog.activities[0].id].drafts')=={}
    restored=page.evaluate('JSON.parse(localStorage.getItem(S.KEY))')
    imported.locator('#import-progress').set_input_files(dict(name='v3-progress.json',mimeType='application/json',buffer=json.dumps(restored).encode()))
    imported.wait_for_function('Object.keys(state.skills).length>1')
    assert imported.evaluate('state.skills[catalog.activities[0].id].drafts.modify')==restored['skills'][CAT[0]['id']]['drafts']['modify']
    imported.goto(URL+'/legacy.html')
    assert imported.locator('#editor').input_value()==legacy['drafts']['final_research_pipeline']
    assert imported.evaluate('lessons.length')==61
    migration.close();fresh.close()
    print('PASS legacy 61-ID export/import and original draft handoff',flush=True)
    browser.close()
finally: server.shutdown()
