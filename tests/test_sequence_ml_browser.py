"""Genuine browser Pyodide checks for N01-N04 and L01-L03, export and progress."""
import json
import subprocess
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
PORT=8995
URL=f"http://127.0.0.1:{PORT}/"
IDS=("N01","N02","N03","N04","L01","L02","L03")

def write_code(page,code):
    page.evaluate("code => document.querySelector('.CodeMirror').CodeMirror.setValue(code)",code)

def verify(page,cid,goal,phase,code,num):
    page.locator("#tab-"+phase).click()
    write_code(page,code)
    page.locator("#p01-check").click()
    try:
        page.wait_for_function("""([cid,gid,phase,n])=>{
            const raw=localStorage.getItem('biopython.'+cid.toLowerCase()+'.v1')||'{}';
            const state=JSON.parse(raw),progress=state.progress?.[gid+':'+phase];
            return ['practice_passed','guided','review_practice_passed','delayed_practice_passed'].includes(progress?.status)
             && (document.querySelector('#output-placeholder')?.innerText||'').includes('Passed '+n+' changed-input checks');
        }""",arg=[cid,goal["id"],phase,num],timeout=180000)
    except Exception:
        print("FAIL",cid,goal["id"],phase,flush=True)
        print("CONSOLE",page.locator("#output-placeholder").inner_text()[:2500],flush=True)
        print("STATUS",page.locator(".runtime-state").inner_text()[:1000],flush=True)
        raise

def main():
    server=subprocess.Popen([sys.executable,"-m","http.server",str(PORT),"--bind","127.0.0.1"],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        time.sleep(1.3)
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,args=["--no-sandbox"])
            page=browser.new_page(viewport={"width":1440,"height":900},accept_downloads=True)
            errors=[]
            page.on("pageerror",lambda e:errors.append(str(e)))
            page.goto(URL,wait_until="domcontentloaded")
            page.locator("#bps-chapter-select").wait_for(timeout=30000)
            count=0
            for stage,ids in (("NGS",IDS[:4]),("ML",IDS[4:])):
                page.locator(f'[data-stage="{stage}"]').click()
                assert page.locator("#bps-chapter-select option").count()==len(ids)
                for cid in ids:
                    page.locator("#bps-chapter-select").select_option(cid)
                    lesson=json.loads((ROOT/"content"/cid.lower()/"lesson.json").read_text(encoding="utf-8"))
                    reference=json.loads((ROOT/"tests"/f"reference_{cid.lower()}.json").read_text(encoding="utf-8"))
                    assert page.locator("#bps-chapter-select").input_value() == cid
                    for index,goal in enumerate([*lesson["goals"],lesson["capstone"],lesson["review"]]):
                        page.locator("#p01-goal-select").select_option(str(index))
                        for phase in ("apply","prove"):
                            cases=goal["phases"][phase].get("public_checks",[])
                            if not cases:
                                assert phase=="apply" and goal["id"].endswith("-REVIEW")
                                continue
                            verify(page,cid,goal,phase,reference[goal["id"]][phase],len(cases))
                            count+=len(cases)
                        if goal["id"].endswith("-CAPSTONE"):
                            page.locator("#tab-prove").click()
                            write_code(page,reference[goal["id"]]["prove"])
                            with page.expect_download(timeout=15000) as event:
                                page.locator("#p01-export").click()
                            downloaded=Path(event.value.path()).read_text(encoding="utf-8")
                            assert "# BioPython Studio "+cid in downloaded,cid
                            assert "original learner code" in downloaded,cid
                            assert "Synthetic" in downloaded or "synthetic" in downloaded,cid
                            temp=ROOT/"artifacts"/"sequence-ml"
                            temp.mkdir(parents=True,exist_ok=True)
                            p=temp/(cid.lower()+"_export.py")
                            p.write_text(downloaded,encoding="utf-8")
                            run=subprocess.run([sys.executable,str(p)],cwd=ROOT,capture_output=True,text=True,timeout=80)
                            assert run.returncode==0,(cid,run.stderr[:1800])
                            assert run.stdout.strip(),cid
                    page.reload(wait_until="domcontentloaded")
                    page.locator("#bps-chapter-select").wait_for(timeout=30000)
                    assert page.locator("#bps-chapter-select").input_value()==cid
                    assert page.locator(f'[data-stage="{stage}"]').get_attribute("aria-current")=="page"
                    print("PASS",cid,flush=True)
            assert count==237,count
            assert not errors,errors
            for w,h in ((390,844),(768,1024),(1440,900)):
                p=browser.new_page(viewport={"width":w,"height":h})
                p.goto(URL,wait_until="domcontentloaded")
                p.locator("#bps-chapter-select").wait_for(state="attached",timeout=30000)
                if w<720:p.locator("#nav-toggle").click()
                p.locator('[data-stage="ML"]').click()
                assert p.evaluate("document.documentElement.scrollWidth <= innerWidth+1"),w
                p.screenshot(path=str(ROOT/"artifacts"/"sequence-ml"/f"viewport-{w}.png"),full_page=True)
                p.close()
            browser.close()
            print("PASS",count,"real Pyodide scenarios; all 7 capstone exports, preserved stages, responsive layouts")
    finally:
        server.terminate()
        try:server.wait(timeout=5)
        except subprocess.TimeoutExpired:server.kill()

if __name__=="__main__":
    main()
