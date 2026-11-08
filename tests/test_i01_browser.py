"""End-to-end I01: genuine NumPy/Pillow image decoding in Pyodide, exports and saved-state regression."""
import json
import subprocess
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
PORT=8991
URL=f"http://127.0.0.1:{PORT}/"
LESSON=json.loads((ROOT/"content/i01/lesson.json").read_text(encoding="utf8"))
SOL=json.loads((ROOT/"tests/reference_i01.json").read_text(encoding="utf8"))

def set_code(page,code):
    page.evaluate("code => document.querySelector('.CodeMirror').CodeMirror.setValue(code)",code)

def check(page,goal,phase):
    cases=goal["phases"][phase].get("public_checks",[])
    if not cases:return 0
    page.locator("#tab-"+phase).click()
    set_code(page,SOL[goal["id"]][phase])
    page.locator("#p01-check").click()
    try:
        page.wait_for_function("""([id,phase,count]) => {
            const progress=JSON.parse(localStorage.getItem('biopython.i01.v1')||'{}').progress||{};
            return ['practice_passed','guided','review_practice_passed','delayed_practice_passed'].includes(progress[id+':'+phase]?.status)
                && (document.querySelector('#output-placeholder')?.innerText||'').includes('Passed '+count+' changed-input checks');
        }""",arg=[goal["id"],phase,len(cases)],timeout=120000)
    except Exception:
        print("I01 FAILED",goal["id"],phase,len(cases),flush=True)
        print("OUTPUT",page.locator("#output-placeholder").inner_text(),flush=True)
        print("RUNTIME",page.locator(".runtime-state").inner_text(),flush=True)
        raise
    print("PASS",goal["id"],phase,len(cases),flush=True)
    return len(cases)

def main():
    total=0
    server=subprocess.Popen([sys.executable,"-m","http.server",str(PORT),"--bind","127.0.0.1"],
                            cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        time.sleep(1)
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,args=["--no-sandbox"])
            page=browser.new_page(viewport={"width":1440,"height":900},accept_downloads=True)
            errors=[]
            page.on("pageerror",lambda exc:errors.append(str(exc)))
            page.goto(URL,wait_until="domcontentloaded")
            page.locator("#bps-chapter-select").wait_for(timeout=20000)
            assert page.locator("#bps-chapter-select option").count()==6
            # Save a P01 draft and verify stage switching never replaces it.
            set_code(page,"# P01-G01 | LEARN | Run a scientific Python script\n# kept old P01 draft\nprint('P01 saved')")
            page.locator('[data-stage="Microscopy"]').click()
            assert page.locator("#bps-chapter-select").input_value()=="I01"
            assert page.locator("#bps-chapter-select option").count()==1
            assert page.locator("#lesson-summary").inner_text().startswith("I01")
            assert not page.locator("#image-panel").is_hidden()
            # G05 really opens the credited image file, not a fabricated array.
            page.locator("#p01-goal-select").select_option("4")
            assert "# TASK:" in page.evaluate("document.querySelector('.CodeMirror').CodeMirror.getValue()")
            page.locator("#run-button").click()
            page.wait_for_function("""() => {
                const output=document.querySelector('#output-placeholder')?.innerText||'';
                return output.includes('uint8') && output.includes('[') && output.includes('(');
            }""",timeout=150000)
            assert "FileNotFoundError" not in page.locator("#output-placeholder").inner_text()
            # All changed-input reference solutions in actual browser Python.
            for idx,g in enumerate([*LESSON["goals"],LESSON["capstone"],LESSON["review"]]):
                page.locator("#p01-goal-select").select_option(str(idx))
                for phase in ("apply","prove"):
                    if idx==0 and phase=="apply":
                        page.locator("#tab-apply").click()
                        before=page.evaluate("JSON.stringify(JSON.parse(localStorage.getItem('biopython.i01.v1')).progress||{})")
                        page.locator("#p01-check").click()
                        assert "Write your Python solution" in page.locator("#output-placeholder").inner_text()
                        after=page.evaluate("JSON.stringify(JSON.parse(localStorage.getItem('biopython.i01.v1')).progress||{})")
                        assert before==after
                    total+=check(page,g,phase)
                if idx==8:
                    # Export the capstone without injecting a Pyodide-only absolute path.
                    page.locator("#tab-prove").click()
                    with page.expect_download() as download_event:
                        page.locator("#p01-export").click()
                    download=download_event.value
                    assert download.suggested_filename=="inspect_witz_image.py"
                    exported=Path(download.path()).read_text(encoding="utf8")
                    assert 'image_path = "./assets/witz/fluorescence-single.png"' in exported
                    cp=subprocess.run([sys.executable,str(download.path())],cwd=ROOT,capture_output=True,text=True,timeout=30)
                    assert cp.returncode==0,cp.stderr
                    assert "raw_calibrated" in cp.stdout
            assert total==57,total
            # Matplotlib renders an actual PNG into the result panel using the same Worker.
            page.locator("#p01-goal-select").select_option("0")
            set_code(page,"import matplotlib.pyplot as plt\nfig,ax=plt.subplots()\nax.plot([1,2,3],[3,4,2])\nax.set(xlabel='Time',ylabel='Signal')\nprint('plot generated')")
            page.locator("#run-button").click()
            page.wait_for_function("""() => document.querySelector('#output-placeholder')?.innerText.includes('plot generated')
                   && !!document.querySelector('#output-placeholder .p01-result-figure img')""",timeout=150000)
            assert page.locator("#output-placeholder .p01-result-figure img").count()>=1
            # Browser reload and back to P01 preserve both chapters.
            page.reload(wait_until="domcontentloaded")
            page.locator("#bps-chapter-select").wait_for(timeout=25000)
            assert page.locator("#bps-chapter-select").input_value()=="I01"
            page.locator('[data-stage="Python"]').click()
            assert page.locator("#bps-chapter-select").input_value()=="P01"
            assert "kept old P01 draft" in page.evaluate("document.querySelector('.CodeMirror').CodeMirror.getValue()")
            assert not errors,errors
            # Narrow viewport still exposes the microscope mission when navigation opens.
            mobile=browser.new_page(viewport={"width":390,"height":844})
            mobile.goto(URL,wait_until="domcontentloaded")
            mobile.locator("#bps-chapter-select").wait_for(state="attached",timeout=25000)
            mobile.locator("#nav-toggle").click()
            mobile.locator('[data-stage="Microscopy"]').click()
            mobile.locator("#nav-toggle").click()
            assert mobile.locator("#bps-chapter-select").input_value()=="I01"
            assert mobile.evaluate("document.documentElement.scrollWidth<=innerWidth+1")
            browser.close()
            print("I01 browser: PASS, 57 real Pyodide cases, real PNG pixels, Matplotlib plot output, CPython export, P01 preservation and mobile")
    finally:
        server.terminate()
        try:server.wait(timeout=5)
        except subprocess.TimeoutExpired:server.kill()
if __name__=="__main__":
    main()
