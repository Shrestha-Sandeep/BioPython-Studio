"""Integrated real-browser Pyodide QA for I02/I03/I04/I07/I08 scientific foundation.

I01 has a dedicated full browser suite and P01-P06 retain their own suite.
Solutions live in transparent author-side fixtures, never inside learner content.
"""
import json
import subprocess
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
PORT=8992
URL=f"http://127.0.0.1:{PORT}/"
IDS=('I02','I03','I04','I07','I08')
TOTAL=0

def set_code(page,script):
    page.evaluate("code => document.querySelector('.CodeMirror').CodeMirror.setValue(code)",script)

def run_case(page,cid,goal,phase,script,cases):
    page.locator("#tab-"+phase).click()
    set_code(page,script)
    page.locator("#p01-check").click()
    try:
        page.wait_for_function("""([cid,gid,phase,count]) => {
            const state=JSON.parse(localStorage.getItem('biopython.'+cid.toLowerCase()+'.v1')||'{}');
            const progress=state.progress?.[gid+':'+phase];
            return ['practice_passed','guided','review_practice_passed','delayed_practice_passed'].includes(progress?.status)
              && (document.querySelector('#output-placeholder')?.innerText||'').includes('Passed '+count+' changed-input checks');
        }""",arg=[cid,goal['id'],phase,len(cases)],timeout=180000)
    except Exception:
        print("BROWSER FAILED",cid,goal['id'],phase,"cases",len(cases),flush=True)
        print("CONSOLE",page.locator("#output-placeholder").inner_text(),flush=True)
        print("RUNTIME",page.locator(".runtime-state").inner_text(),flush=True)
        raise
    print("PASS",goal['id'],phase,len(cases),flush=True)

def main():
    global TOTAL
    server=subprocess.Popen([sys.executable,"-m","http.server",str(PORT),"--bind","127.0.0.1"],
                            cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        time.sleep(1.25)
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,args=["--no-sandbox"])
            page=browser.new_page(viewport={"width":1440,"height":900},accept_downloads=True)
            errors=[]
            page.on("pageerror",lambda exc:errors.append(str(exc)))
            page.goto(URL,wait_until="domcontentloaded")
            page.locator("#bps-chapter-select").wait_for(timeout=25000)
            assert page.locator("#bps-chapter-select option").count()==6
            page.locator('[data-stage="Microscopy"]').click()
            assert page.locator("#bps-chapter-select option").count()==13
            assert page.locator("#bps-chapter-select").input_value()=="I01"
            assert page.locator("#image-panel").is_visible()
            page.wait_for_function("document.querySelector(\'#image-meta\')?.textContent.includes(\'Witz-HPA-rendered-RGB-example.png\')",timeout=20000)
            assert page.locator("#image-empty").is_hidden()

            for cid in IDS:
                page.locator("#bps-chapter-select").select_option(cid)
                assert page.locator("#bps-chapter-select").input_value() == cid
                assert page.locator("#bps-chapter-link").get_attribute("href")==f"./content/chapters/{cid}_COMPLETE.md"
                lesson=json.loads((ROOT/"content"/cid.lower()/"lesson.json").read_text(encoding="utf8"))
                refs=json.loads((ROOT/"tests"/f"reference_{cid.lower()}.json").read_text(encoding="utf8"))
                for n,goal in enumerate([*lesson["goals"],lesson["capstone"],lesson["review"]]):
                    page.locator("#p01-goal-select").select_option(str(n))
                    if n==0:
                        assert page.evaluate("document.querySelector('.CodeMirror').CodeMirror.getValue()").startswith(f"# {cid}-G01 | LEARN |")
                    for phase in ("apply","prove"):
                        cases=goal["phases"][phase].get("public_checks",[])
                        if not cases:
                            assert phase=="apply" and goal["id"].endswith("REVIEW")
                            continue
                        if phase=="apply" and n==0:
                            page.locator("#tab-apply").click()
                            before=page.evaluate("(cid)=>JSON.stringify(JSON.parse(localStorage.getItem('biopython.'+cid.toLowerCase()+'.v1')||'{}').progress||{})",cid)
                            page.locator("#p01-check").click()
                            assert "Write your Python solution below" in page.locator("#output-placeholder").inner_text()
                            after=page.evaluate("(cid)=>JSON.stringify(JSON.parse(localStorage.getItem('biopython.'+cid.toLowerCase()+'.v1')||'{}').progress||{})",cid)
                            assert before==after
                        run_case(page,cid,goal,phase,refs[goal["id"]][phase],cases)
                        TOTAL+=len(cases)
                    if n==len(lesson['goals']):
                        page.locator("#tab-prove").click()
                        set_code(page,refs[goal["id"]]["prove"])
                        with page.expect_download() as event:
                            page.locator("#p01-export").click()
                        dl=event.value
                        assert dl.suggested_filename==lesson["final_project"]["name"],(cid,dl.suggested_filename)
                        saved=Path(dl.path()).read_text(encoding="utf8")
                        assert "BioPython Studio" in saved
                        program=subprocess.run([sys.executable,str(dl.path())],cwd=ROOT,capture_output=True,text=True,timeout=60)
                        assert program.returncode==0,(cid,program.stderr)
                        assert program.stdout.strip(),(cid,"No standalone output")

                # Browser-local progress and code survive a reload.
                page.reload(wait_until="domcontentloaded")
                page.locator("#bps-chapter-select").wait_for(timeout=25000)
                assert page.locator("#bps-chapter-select").input_value()==cid
                assert page.locator("#p01-goal-select").input_value()==str(len(lesson['goals'])+1)

            assert TOTAL==270,TOTAL
            assert not errors,errors
            # Matplotlib returns image pixels generated from actual code rather than stock artwork.
            page.locator("#bps-chapter-select").select_option("I04")
            page.locator("#p01-goal-select").select_option("0")
            set_code(page,"import matplotlib.pyplot as plt\nfig,ax=plt.subplots()\nax.scatter([1,2,3],[3,1,4])\nax.set(xlabel='Field',ylabel='Score')\nprint('genuine scientific figure')")
            page.locator("#run-button").click()
            page.wait_for_function("""() => (document.querySelector('#output-placeholder')?.innerText||'').includes('genuine scientific figure')
               && !!document.querySelector('#output-placeholder .p01-result-figure img')""",timeout=180000)
            assert page.locator("#output-placeholder .p01-result-figure img").count()==1
            images=ROOT/"artifacts"/"scientific-foundation"
            images.mkdir(parents=True,exist_ok=True)
            page.screenshot(path=str(images/"scientific-1440.png"),full_page=True)
            for width,height in ((390,844),(768,920)):
                mobile=browser.new_page(viewport={"width":width,"height":height})
                mobile.goto(URL,wait_until="domcontentloaded")
                mobile.locator("#bps-chapter-select").wait_for(state="attached",timeout=25000)
                if width<=720:mobile.locator("#nav-toggle").click()
                mobile.locator('[data-stage="Microscopy"]').click()
                assert mobile.locator("#nav-toggle").get_attribute("aria-expanded")=="false"
                assert mobile.locator("#bps-chapter-select").input_value()=="I01"
                mobile.wait_for_function("document.querySelector(\'#image-meta\')?.textContent.includes(\'Witz-HPA-rendered-RGB-example.png\')",timeout=20000)
                assert mobile.evaluate("document.documentElement.scrollWidth<=innerWidth+1"),width
                mobile.screenshot(path=str(images/f"scientific-{width}.png"),full_page=True)
                mobile.close()
            browser.close()
            print(f"PASS {TOTAL} real Pyodide scientific scenarios, 5 new missions, standalone CPython exports, plots, saved drafts and mobile layouts",flush=True)
    finally:
        server.terminate()
        try:server.wait(timeout=5)
        except subprocess.TimeoutExpired:server.kill()

if __name__=="__main__":
    main()
