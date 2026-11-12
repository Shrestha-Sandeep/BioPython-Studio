"""Real Pyodide QA for all 339 newly added microscopy cases, exports and viewport."""
import json,subprocess,sys,time
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
PORT=8993
URL=f'http://127.0.0.1:{PORT}/'
IDS=('I05','I06','I09','I10','I11','I12','I13')
def set_code(page,source):
    page.evaluate("code => document.querySelector('.CodeMirror').CodeMirror.setValue(code)",source)
def verify(page,cid,goal,phase,code,cases):
    page.locator('#tab-'+phase).click()
    set_code(page,code)
    page.locator('#p01-check').click()
    try:
        page.wait_for_function("""([cid,gid,phase,count]) => {
            const state=JSON.parse(localStorage.getItem('biopython.'+cid.toLowerCase()+'.v1')||'{}');
            const progress=state.progress?.[gid+':'+phase];
            return ['practice_passed','guided','review_practice_passed','delayed_practice_passed'].includes(progress?.status)
                && (document.querySelector('#output-placeholder')?.innerText||'').includes('Passed '+count+' changed-input checks');
        }""",arg=[cid,goal['id'],phase,len(cases)],timeout=180000)
    except Exception:
        print('FAIL',cid,goal['id'],phase,flush=True)
        print('CONSOLE',page.locator('#output-placeholder').inner_text()[:1400],flush=True)
        print('RUNTIME',page.locator('.runtime-state').inner_text()[:400],flush=True)
        raise
def main():
    checks=0
    server=subprocess.Popen([sys.executable,'-m','http.server',str(PORT),'--bind','127.0.0.1'],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        time.sleep(1.5)
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
            page=browser.new_page(viewport={'width':1440,'height':900},accept_downloads=True)
            errors=[]
            page.on('pageerror',lambda exc:errors.append(str(exc)))
            page.goto(URL,wait_until='domcontentloaded')
            page.locator('#bps-chapter-select').wait_for(timeout=25000)
            page.locator('[data-stage="Microscopy"]').click()
            assert page.locator('#bps-chapter-select option').count()==13
            for cid in IDS:
                page.locator('#bps-chapter-select').select_option(cid)
                ch=json.loads((ROOT/'content'/cid.lower()/'lesson.json').read_text(encoding='utf8'))
                refs=json.loads((ROOT/'tests'/f'reference_{cid.lower()}.json').read_text(encoding='utf8'))
                assert page.locator('#bps-chapter-select').input_value() == cid
                for n,g in enumerate([*ch['goals'],ch['capstone'],ch['review']]):
                    page.locator('#p01-goal-select').select_option(str(n))
                    for phase in ('apply','prove'):
                        cases=g['phases'][phase].get('public_checks',[])
                        if not cases:
                            assert phase=='apply' and g['id'].endswith('-REVIEW')
                            continue
                        verify(page,cid,g,phase,refs[g['id']][phase],cases)
                        checks+=len(cases)
                    if g['id'].endswith('-CAPSTONE'):
                        page.locator('#tab-prove').click()
                        set_code(page,refs[g['id']]['prove'])
                        with page.expect_download(timeout=15000) as event:page.locator('#p01-export').click()
                        dl=event.value
                        assert dl.suggested_filename==ch['final_project']['name']
                        code=Path(dl.path()).read_text(encoding='utf8')
                        assert 'original learner code' in code
                        proc=subprocess.run([sys.executable,str(dl.path())],cwd=ROOT,capture_output=True,text=True,timeout=60)
                        assert proc.returncode==0,(cid,proc.stderr[:1200])
                        assert proc.stdout.strip(),cid
                page.reload(wait_until='domcontentloaded')
                page.locator('#bps-chapter-select').wait_for(timeout=25000)
                assert page.locator('#bps-chapter-select').input_value()==cid
                print('PASS',cid,flush=True)
            assert checks==339,checks
            assert not errors,errors
            page.locator('#bps-chapter-select').select_option('I13')
            page.locator('#p01-goal-select').select_option('5')
            page.locator('#tab-apply').click()
            set_code(page,json.loads((ROOT/'tests/reference_i13.json').read_text(encoding='utf8'))['I13-CAPSTONE']['apply'])
            page.locator('#run-button').click()
            page.wait_for_function("() => !!document.querySelector('#output-placeholder .p01-result-figure img')",timeout=180000)
            art=ROOT/'artifacts'/'microscopy-full'
            art.mkdir(parents=True,exist_ok=True)
            page.screenshot(path=str(art/'microscopy-1440.png'),full_page=True)
            for width,height in ((390,844),(768,920)):
                mobile=browser.new_page(viewport={'width':width,'height':height})
                mobile.goto(URL,wait_until='domcontentloaded')
                mobile.locator('#bps-chapter-select').wait_for(state='attached',timeout=25000)
                if width<720:mobile.locator('#nav-toggle').click()
                mobile.locator('[data-stage="Microscopy"]').click()
                assert mobile.locator('#bps-chapter-select option').count()==13
                assert mobile.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),width
                mobile.screenshot(path=str(art/f'microscopy-{width}.png'),full_page=True)
                mobile.close()
            browser.close()
            print('PASS',checks,'new genuine Pyodide changed-input cases, exports, saved progress and screen sizes',flush=True)
    finally:
        server.terminate()
        try:server.wait(timeout=5)
        except subprocess.TimeoutExpired:server.kill()
if __name__=='__main__':main()
