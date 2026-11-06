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
    access=browser.new_context();free=access.new_page();free.goto(URL);free.wait_for_function('!!activity')
    assert free.locator('#goal-panel').is_hidden()
    free.locator('#path-menu summary').click()
    assert free.locator('#activity-list button').count()==78
    assert free.locator('#activity-list button:disabled').count()==0
    assert free.locator('#activity-list .group-title').all_text_contents()==['Python','Microscopy','NGS','ML']
    free.locator('#activity-list button').last.click()
    free.wait_for_url('**/legacy.html?lesson=*')
    free.wait_for_function('!!unifiedPath')
    assert free.locator('#curriculum button:disabled').count()==0
    assert free.evaluate('Object.keys(saved.completed).length')==0
    a=next(a for a in CAT if a['number']=='024')
    free.goto(URL+'/?activity='+a['id']);free.wait_for_function('activity?.number==="024"')
    free.locator('#phase-track button').filter(has_text='Debug').click()
    assert free.locator('#phase-title').inner_text()=='Debug'
    free.locator('#start-review').click();assert free.evaluate('skill.reviewPractice') is True
    free.locator('#pilot-editor').fill(a['transfers'][0]['reference']);run(free)
    assert free.evaluate('!!skill.retainedAt || !!skill.independentAt') is False
    assert free.evaluate('skill.attempts.at(-1).stage')=='transfer_practice'
    free.locator('#phase-track').get_by_role('button',name='Write',exact=True).click()
    assert free.locator('#pilot-editor').input_value()==''
    next_entry=free.evaluate('CoursePath.adjacent(coursePath,activity.id,1)')
    free.locator('#next-activity').click()
    if next_entry['kind']=='legacy':free.wait_for_url('**/legacy.html?lesson=*')
    else:free.wait_for_function('(id)=>activity.id===id',arg=next_entry['id'])
    # Specific explanations come from the real Worker, and extra metadata is valid.
    a=next(a for a in CAT if a['number']=='019')
    free.goto(URL+'/?activity='+a['id']);free.wait_for_function('activity?.number==="019"')
    free.locator('#phase-track').get_by_role('button',name='Write',exact=True).click()
    free.locator('#pilot-editor').fill('record = {"sample_id": sample_id}\nprint(sample_id)\nprint(condition)')
    run(free,success=False)
    assert 'Extra metadata is allowed' in free.locator('#pilot-feedback').inner_text()
    assert free.evaluate('!!skill.independentAt') is False
    free.locator('#pilot-editor').fill('record = dict(sample_id=sample_id, condition=condition, channel="blue")\nprint(record["sample_id"])\nprint(record["condition"])')
    run(free)
    assert free.evaluate('!!skill.independentAt') is True
    assert 'Adapted from' in free.locator('#exercise-source').text_content()
    free.evaluate('() => {skill.drafts.run="print(123)";selectPhase("run");}')
    assert free.locator('#pilot-editor').input_value()==a['example']['source']
    assert free.evaluate('skill.drafts.run')=='print(123)', 'Preserve the historical record while showing the example that will execute'
    run(free)
    free.goto(URL+'/legacy.html?lesson=table');free.wait_for_function('!!courseManifest')
    free.locator('#learn-more summary').click()
    assert 'Structures appendix' in free.locator('#source-links').inner_text()
    assert 'Reference:' in free.locator('#source-links').inner_text()
    a=next(a for a in CAT if a['number']=='038')
    free.goto(URL+'/?activity='+a['id']);free.wait_for_function('activity?.number==="038"')
    free.locator('#phase-track').get_by_role('button',name='Write',exact=True).click()
    free.locator('#pilot-editor').fill('import numpy as np\nimage=np.zeros((1,1))\ndimensions=np.array(grid).shape\naxes=2\nprint(dimensions)\nprint(axes)')
    run(free,success=False)
    assert 'supplied grid' in free.locator('#pilot-feedback').inner_text()
    assert free.evaluate('!!skill.independentAt') is False
    assert free.locator('#exercise-source a').get_attribute('href').endswith('/e02-Numpy_basics.ipynb')
    access.close()
    print('PASS fresh unlocked 78-entry course, all stages, early real-Python transfer practice and no fabricated mastery',flush=True)
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
        if a['number']=='004':
            page.locator('#notebook-lab summary').click()
            def cell(button):
                page.locator(button).click();page.wait_for_function('!busy',timeout=150000)
                return page.locator('#notebook-output').inner_text()
            assert 'NameError' in cell('#run-analysis')
            cell('#run-setup');assert cell('#run-analysis').endswith('3')
            page.locator('#notebook-setup').fill('specimen = "CTRL-A01"\nfield_count = 7')
            assert cell('#run-analysis').endswith('3'), 'Editing text must not execute a cell'
            cell('#run-setup');page.locator('#notebook-analysis').focus();page.keyboard.press('Control+Enter');page.wait_for_function('!busy',timeout=150000)
            assert page.locator('#notebook-output').inner_text().endswith('7')
            assert 'restarted' in cell('#restart-kernel')
            assert 'NameError' in cell('#run-analysis')
            cell('#run-setup');assert cell('#run-analysis').endswith('7')
            with page.expect_download() as downloaded:page.locator('#download-notebook').click()
            notebook=json.loads(Path(downloaded.value.path()).read_text())
            import nbformat
            nbformat.validate(nbformat.from_dict(notebook))
            namespace={}
            for c in notebook['cells']:
                if c['cell_type']=='code':
                    assert c['execution_count'] is None and c['outputs']==[]
                    exec(''.join(c['source']),namespace)
            assert namespace['field_count']==7
            print('PASS genuine two-cell state, stale output, restart, notebook export and clean execution',flush=True)
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
        assert page.locator('#start-review').is_visible()
        print('PASS live activity',a['number'],a['title'],flush=True)
        if i==14:
            saved=page.evaluate('JSON.parse(localStorage.getItem(S.KEY))')
            page.reload();page.wait_for_function('!!activity')
            assert page.evaluate('JSON.parse(localStorage.getItem(S.KEY))')==saved
        if i<len(CAT)-1:
            page.locator('#path-menu summary').click()
            page.locator('#activity-list button[data-competency="'+CAT[i+1]['id']+'"]').click()
    assert not errors,errors
    page.evaluate("() => { select(catalog.activities[0].id);skill.stage='modify';render(); }")
    page.locator('#pilot-editor').fill('if field_name != "Field B07":\n    print(field_name)\n    print("Recorded")\nelse:\n    print(missing_second_input)')
    run(page,success=False)
    assert 'NameError' in page.locator('#pilot-traceback').inner_text()
    assert 'Input 2:' in page.locator('#output-case').inner_text()
    assert 'Field B07' in page.locator('#output-case').inner_text()
    page.locator('#study-tools > summary').click()
    page.locator('#activity-feedback summary').click()
    page.locator('#feedback-clarity').select_option('needs-example')
    page.locator('#feedback-note').fill('Automated fixture: explain the variable naming step.')
    evidence=page.locator('#evidence').inner_text()
    page.locator('#save-activity-feedback').click()
    assert page.locator('#evidence').inner_text()==evidence
    assert page.evaluate('skill.feedback.clarity')=='needs-example'
    # All activity drafts, hint use and position persist across a reload.
    before=page.evaluate('JSON.parse(localStorage.getItem(S.KEY))')
    page.reload();page.wait_for_function('!!activity')
    after=page.evaluate('JSON.parse(localStorage.getItem(S.KEY))')
    assert before==after
    assert page.locator('#feedback-note').input_value()=='Automated fixture: explain the variable naming step.'
    # Advancing the test clock exercises the real delayed-transfer UI, not a 24h sleep.
    page.evaluate('''() => { const a=catalog.activities[1];state.skills[a.id].reviewAt=Date.now()-1;select(a.id); }''')
    assert page.locator('#review-reminder').is_visible()
    page.locator('#start-review').click()
    assert page.locator('#pilot-editor').input_value()==''
    assert page.locator('#pilot-hint').is_hidden()
    page.locator('#pilot-editor').fill(CAT[1]['stages']['transfer']['reference'])
    run(page)
    assert page.locator('#evidence').inner_text()=='retained'
    assert page.locator('#pilot-run').is_enabled()
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
    old.locator('#study-tools > summary').click()
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
    # Goal workflow uses real Python checks and an explicitly advanced test clock.
    from datetime import datetime,timezone,timedelta
    goal_context=browser.new_context(accept_downloads=True)
    goal_page=goal_context.new_page()
    full_state=page.evaluate('JSON.parse(localStorage.getItem(S.KEY))')
    goal_page.add_init_script('if(!localStorage.getItem("biopython_studio_v3"))localStorage.setItem("biopython_studio_v3",'+json.dumps(json.dumps(full_state))+')')
    goal_page.goto(URL);goal_page.wait_for_function('!!activity')
    goal_page.evaluate("() => { select(catalog.activities.find(a=>a.number==='008').id);skill.stage='write';render(); }")
    goal_page.locator('#study-tools > summary').click()
    goal_page.locator('#outside-help').check()
    assert goal_page.locator('#outside-help').is_disabled()
    assert goal_page.evaluate('PilotMilestones.summary(state,catalog).counts.independent')==2
    clock_start=datetime.now(timezone.utc)
    goal_page.clock.set_fixed_time(clock_start+timedelta(days=1,seconds=10))
    for number in ['008','025','038']:
        goal_page.locator('#goal-next').click()
        assert goal_page.evaluate('activity.number')==number
        assert goal_page.locator('#pilot-editor').input_value()==''
        a=next(a for a in CAT if a['number']==number)
        goal_page.locator('#pilot-editor').fill(a['transfers'][0]['reference']);run(goal_page)
    assert goal_page.evaluate('PilotMilestones.summary(state,catalog).counts.retained')==2
    for number in ['008','025','038']:
        goal_page.locator('#goal-next').click()
        assert goal_page.evaluate('activity.number')==number
        goal_page.locator('#reflection-text').fill('Automated fixture: inputs change; the operations transform them; a boundary or scientific limitation must be checked.')
        if not goal_page.locator('#reflection-review').evaluate('(e)=>e.open'):goal_page.locator('#reflection-review summary').click()
        for criterion in ['input','reasoning','boundary']:goal_page.locator('#rubric-'+criterion).check()
        goal_page.locator('#save-reflection-review').click()
    goal_page.locator('#goal-next').click()
    goal_page.locator('#pilot-issues textarea').fill('Automated fixture: the reported difficulty has been reproduced and the correction verified.')
    goal_page.locator('#pilot-issues button').click()
    assert goal_page.evaluate('PilotMilestones.summary(state,catalog).counts.openIssues')==0
    assert 'scheduled review' in goal_page.locator('#goal-next').inner_text()
    goal_page.clock.set_fixed_time(clock_start+timedelta(days=2,seconds=20))
    goal_page.evaluate('goalUI.renderGoal()')
    goal_page.locator('#goal-next').click()
    goal_page.locator('#pilot-editor').fill(next(a for a in CAT if a['number']=='008')['transfers'][1]['reference']);run(goal_page)
    assert 'ready for human sign-off' in goal_page.locator('#goal-status').inner_text()
    with goal_page.expect_download() as report_file:goal_page.locator('#goal-next').click()
    report=json.loads(Path(report_file.value.path()).read_text())
    assert report['ready'] and report['counts']['retained']==3 and report['counts']['reviewed']==3
    assert 'Pending human sign-off' in report['releaseDecision']
    assert 'Device clock' in report['timeBasis']
    for width in [1440,1024,390]:
        goal_page.set_viewport_size({'width':width,'height':950})
        assert goal_page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),width
    # Text edits invalidate a human review; complete progress backup retains that revision.
    goal_page.locator('#reflection-text').fill('Automated fixture: revised explanation requiring a new review.')
    assert not goal_page.evaluate('PilotMilestones.summary(state,catalog).ready')
    backup=goal_page.evaluate('JSON.parse(localStorage.getItem(S.KEY))')
    restore_context=browser.new_context();restore=restore_context.new_page();restore.goto(URL);restore.wait_for_function('!!activity')
    restore.locator('#import-progress').set_input_files(dict(name='progress.json',mimeType='application/json',buffer=json.dumps(backup).encode()))
    restore.wait_for_function('Object.keys(state.skills).length===28')
    assert restore.evaluate('state.skills[activity.id].pilotReflection.text')=='Automated fixture: revised explanation requiring a new review.'
    assert not restore.evaluate('PilotMilestones.summary(state,catalog).ready')
    goal_context.close();restore_context.close()
    print('PASS goal recommendation, assistance, explanations, issue triage, timed real transfer, evidence export and progress restoration',flush=True)
    browser.close()
finally: server.shutdown()
