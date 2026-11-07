"""Six-chapter browser QA: all P04-P06 changed-input cases execute in real Pyodide."""
import json
import subprocess
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"tests"))
from test_p04_p06_reference import SOLUTIONS
PORT=8985
URL=f"http://127.0.0.1:{PORT}/"
TOTAL=0

def set_code(page,code):
    page.evaluate("source => document.querySelector('.CodeMirror').CodeMirror.setValue(source)",code)

def check(page,cid,gid,phase,solution,count):
    page.locator("#tab-"+phase).click()
    set_code(page,solution)
    page.locator("#p01-check").click()
    try:
        page.wait_for_function("""([cid,gid,phase,count])=>{
            const k=JSON.parse(localStorage.getItem('biopython.'+cid.toLowerCase()+'.v1')||'{}');
            const status=k.progress?.[gid+':'+phase]?.status;
            return ['practice_passed','guided','review_practice_passed','delayed_practice_passed'].includes(status)
                && (document.querySelector('#output-placeholder')?.innerText||'').includes('Passed '+count+' changed-input checks');
        }""",arg=[cid,gid,phase,count],timeout=45000)
    except Exception:
        print("FAILED",cid,gid,phase,"expected",count,flush=True)
        print("OUTPUT:",page.locator("#output-placeholder").inner_text(),flush=True)
        print("RUNTIME:",page.locator(".runtime-state").inner_text(),flush=True)
        raise
    assert "Why it worked:" in page.locator("#output-placeholder").inner_text()
    print("PASS",gid,phase,count,flush=True)

def main():
    global TOTAL
    server=subprocess.Popen([sys.executable,"-m","http.server",str(PORT),"--bind","127.0.0.1"],
                            cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    try:
        time.sleep(1.5)
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,args=["--no-sandbox"])
            page=browser.new_page(viewport={"width":1440,"height":900},accept_downloads=True)
            errors=[]
            page.on("pageerror",lambda exc:errors.append(str(exc)))
            page.goto(URL,wait_until="domcontentloaded")
            page.locator("#bps-chapter-select").wait_for(timeout=20000)
            assert page.locator("#bps-chapter-select option").count()==6
            assert page.locator("#bps-chapter-select").input_value()=="P01"
            # The prior chapters remain accessible without changing progress keys.
            for cid in ("P01","P02","P03","P04","P05","P06"):
                page.locator("#bps-chapter-select").select_option(cid)
                assert page.locator("#bps-chapter-select").input_value()==cid
                assert page.locator("#lesson-summary").inner_text().startswith(cid)
                assert page.locator("#bps-chapter-link").get_attribute("href")==f"./content/chapters/{cid}_COMPLETE.md"
            for cid in ("P04","P05","P06"):
                page.locator("#bps-chapter-select").select_option(cid)
                goals=json.loads((ROOT/"content"/cid.lower()/"lesson.json").read_text(encoding="utf8"))
                for idx,goal in enumerate([*goals["goals"],goals["capstone"],goals["review"]]):
                    page.locator("#p01-goal-select").select_option(str(idx))
                    if idx==0:
                        assert page.evaluate("document.querySelector('.CodeMirror').CodeMirror.getValue()").startswith("# "+cid+"-G01 | LEARN |")
                    for phase in ("apply","prove"):
                        cases=goal["phases"][phase].get("public_checks",[])
                        if not cases:
                            assert idx==7 and phase=="apply"
                            continue
                        if idx==0 and phase=="apply":
                            page.locator("#tab-apply").click()
                            before=page.evaluate("""()=>(JSON.parse(localStorage.getItem('biopython.'+
                                document.querySelector('#bps-chapter-select').value.toLowerCase()+'.v1')||'{}').progress||{})""")
                            page.locator("#p01-check").click()
                            assert "Write your Python solution below the task comments" in page.locator("#output-placeholder").inner_text()
                            after=page.evaluate("""()=>(JSON.parse(localStorage.getItem('biopython.'+
                                document.querySelector('#bps-chapter-select').value.toLowerCase()+'.v1')||'{}').progress||{})""")
                            assert before==after, "comment-only input recorded a false attempt"
                        check(page,cid,goal["id"],phase,SOLUTIONS[goal["id"]][phase],len(cases))
                        TOTAL+=len(cases)
                    if idx==6:
                        reflection="Synthetic inputs, missingness, calibration, source provenance and independent biological replicates must remain distinct."
                        page.locator("#tab-prove").click()
                        if page.locator("#lesson-toggle").get_attribute("aria-expanded") == "false":
                            page.locator("#lesson-toggle").click()
                        page.locator("#p01-reflection").fill(reflection)
                        assert reflection in page.evaluate("JSON.parse(localStorage.getItem('biopython.'+'"+cid.lower()+"'+'.v1')).reflections['"+cid+"-CAPSTONE']")
                        with page.expect_download() as event:
                            page.locator("#p01-export").click()
                        download=event.value
                        expected=goals["final_project"]["name"]
                        assert download.suggested_filename==expected,(download.suggested_filename,expected)
                        exported=Path(download.path()).read_text(encoding="utf8")
                        assert "Synthetic microscopy" in exported
                        script=subprocess.run([sys.executable,str(download.path())],capture_output=True,text=True,timeout=20)
                        assert script.returncode==0,script.stderr
                        assert script.stdout.strip(),(cid,"No standalone output")
                page.reload(wait_until="domcontentloaded")
                page.locator("#bps-chapter-select").wait_for(timeout=20000)
                assert page.locator("#bps-chapter-select").input_value()==cid
                assert page.locator("#p01-goal-select").input_value()=="7"
            assert TOTAL==155, TOTAL
            assert not errors,errors
            # The frozen interface remains usable on a narrow viewport and tablet.
            shots=ROOT/"artifacts"/"p04-p06"
            shots.mkdir(parents=True,exist_ok=True)
            for width,height in ((390,844),(768,920),(1440,900)):
                mobile=browser.new_page(viewport={"width":width,"height":height})
                mobile.goto(URL,wait_until="domcontentloaded")
                mobile.locator("#bps-chapter-select").wait_for(state="attached",timeout=20000)
                if width<=720:mobile.locator("#nav-toggle").click()
                mobile.locator("#bps-chapter-select").select_option("P06")
                mobile.locator("#p01-goal-select").select_option("6")
                if width<=720:mobile.locator("#nav-toggle").click()
                mobile.locator("#tab-prove").click()
                assert mobile.locator("#lesson-toggle").get_attribute("aria-expanded") == "false"
                assert mobile.evaluate("document.querySelector(\'.CodeMirror\').CodeMirror.getOption(\'lineWrapping\')") == (width <= 900)
                assert mobile.evaluate("document.documentElement.scrollWidth<=innerWidth+1"),width
                rect=mobile.locator("#code-wrapper").bounding_box()
                assert rect and rect["y"]<height,(width,rect)
                mobile.screenshot(path=str(shots/f"p06-{width}.png"),full_page=True)
                mobile.close()
            browser.close()
            print("PASS: all 155 new changed-input cases executed in real Pyodide across P04-P06, existing 6-chapter navigation, .py exports and responsive layouts",flush=True)
    finally:
        server.terminate()
        try: server.wait(timeout=5)
        except subprocess.TimeoutExpired: server.kill()

if __name__=="__main__":
    main()
