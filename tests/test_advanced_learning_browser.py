"""Full optional A01-A03 Pyodide learner flow; 80 changed-input checks.

Browser checks are public and do not certify human skill or real-world nuclear
segmentation. They prove actual Python execution, integration, draft isolation,
source image import and responsive shell in the optional route.
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path

import numpy as np
import tifffile
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
PORT=8995
BASE=f"http://127.0.0.1:{PORT}/"
IDS=("A01","A02","A03")


def set_code(page, code):
    page.evaluate("code => document.querySelector('.CodeMirror').CodeMirror.setValue(code)",code)


def check(page, chapter, goal, phase, code, count):
    page.locator("#tab-"+phase).click()
    set_code(page,code)
    page.locator("#p01-check").click()
    try:
        page.wait_for_function("""([id,gid,phase,count]) => {
            const state=JSON.parse(localStorage.getItem('biopython.'+id.toLowerCase()+'.v1')||'{}');
            const item=state.progress?.[gid+':'+phase];
            return ['practice_passed','guided','review_practice_passed','delayed_practice_passed'].includes(item?.status)
                && (document.querySelector('#output-placeholder')?.innerText||'').includes('Passed '+count+' changed-input checks');
        }""",arg=[chapter,goal["id"],phase,count],timeout=180000)
    except Exception:
        print("FAIL",chapter,goal["id"],phase,flush=True)
        print(page.locator("#output-placeholder").inner_text()[:1400],flush=True)
        raise


def main():
    py_checks=0
    images=0
    with tempfile.TemporaryDirectory() as temporary:
        fixture=Path(temporary)/"original_16bit.ome.tif"
        native=np.zeros((2,3,7,9),dtype=np.uint16)
        native[1,2,3,4]=50000
        tifffile.imwrite(fixture,native,ome=True,metadata={"axes":"ZCYX"})
        expected=fixture.read_bytes()

        server=subprocess.Popen([sys.executable,"-m","http.server",str(PORT),"--bind","127.0.0.1"],
                                cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        try:
            time.sleep(1.5)
            with sync_playwright() as pw:
                browser=pw.chromium.launch(headless=True,args=["--no-sandbox"])
                page=browser.new_page(viewport={"width":1440,"height":900},accept_downloads=True)
                errors=[]
                page.on("pageerror",lambda exc:errors.append(str(exc)))
                page.goto(BASE,wait_until="domcontentloaded")
                page.locator("#bps-chapter-select").wait_for(timeout=30000)
                page.locator('[data-stage="Microscopy"]').click()
                assert page.locator("#bps-chapter-select option").count()==13
                page.locator("#bps-chapter-select").select_option("I13")
                assert page.locator("#bps-advanced-entry").get_attribute("href")=="./?lab=advanced"
                assert page.locator("#bps-advanced-entry").get_attribute("hidden") is None
                # Store existing 26-chapter selection, then verify advanced
                # navigation never clobbers the standard selection key.
                original=page.evaluate("localStorage.getItem('biopython.course-selected.v1')")
                assert original=="I13"

                page.goto(BASE+"?lab=advanced",wait_until="domcontentloaded")
                page.locator("#bps-chapter-select").wait_for(timeout=30000)
                assert page.locator("#bps-chapter-select").input_value()=="A00"
                assert page.locator("#bps-chapter-select option").count()==20
                assert page.locator("#bps-standard-return").get_attribute("href")=="./"
                assert page.locator("#bps-advanced-docs").get_attribute("href").endswith("/a00/README.md")
                assert page.evaluate("localStorage.getItem('biopython.course-selected.v1')")==original

                for cid in IDS:
                    page.locator("#bps-chapter-select").select_option(cid)
                    lesson=json.loads((ROOT/"content"/cid.lower()/"lesson.json").read_text(encoding="utf-8"))
                    references=json.loads((ROOT/"tests"/f"reference_{cid.lower()}_advanced.json").read_text(encoding="utf-8"))
                    assert page.locator("#bps-chapter-select").input_value() == cid,cid
                    assert page.locator("#bps-advanced-docs").get_attribute("href").endswith("/"+cid.lower()+"/README.md")
                    for idx,goal in enumerate([*lesson["goals"],lesson["capstone"],lesson["review"]]):
                        page.locator("#p01-goal-select").select_option(str(idx))
                        for phase in ("apply","prove"):
                            cases=goal["phases"][phase]["public_checks"]
                            check(page,cid,goal,phase,references[goal["id"]][phase],len(cases))
                            py_checks+=len(cases)
                        if goal["id"].endswith("-CAPSTONE"):
                            page.locator("#tab-prove").click()
                            set_code(page,references[goal["id"]]["prove"])
                            with page.expect_download(timeout=15000) as event:
                                page.locator("#p01-export").click()
                            dl=event.value
                            assert dl.suggested_filename==lesson["final_project"]["name"]
                            script=Path(dl.path()).read_text(encoding="utf-8")
                            assert "original learner code" in script
                            assert "Synthetic practice inputs" in script
                            result=subprocess.run([sys.executable,str(dl.path())],cwd=ROOT,
                                                  capture_output=True,text=True,timeout=60)
                            assert result.returncode==0,(cid,result.stderr[:1500])
                            assert result.stdout.strip(),cid
                    page.reload(wait_until="domcontentloaded")
                    page.locator("#bps-chapter-select").wait_for(timeout=30000)
                    assert page.locator("#bps-chapter-select").input_value()==cid
                    print("PASS optional advanced",cid,flush=True)

                assert py_checks==80,py_checks

                # Actual browser -> worker byte-preserving TIFF transport in
                # advanced A01 mode. Not a substitute for independent raw data.
                page.locator("#bps-chapter-select").select_option("A01")
                page.locator("#image-upload").set_input_files(str(fixture))
                page.locator("#analysis-dataset-status").wait_for(state="visible",timeout=15000)
                assert "original_16bit.ome.tif" in page.locator("#analysis-dataset-status").inner_text()
                page.locator("#p01-goal-select").select_option("0")
                page.locator("#tab-learn").click()
                set_code(page,
                   "import tifffile\n"
                   "x=tifffile.imread(uploaded_image_paths[0])\n"
                   "print('ADVANCED TIFF PROOF',x.dtype,x.shape,int(x[1,2,3,4]))")
                page.locator("#run-button").click()
                page.wait_for_function(
                    "() => (document.querySelector('#output-placeholder')?.innerText||'').includes('ADVANCED TIFF PROOF uint16 (2, 3, 7, 9) 50000')",
                    timeout=180000,
                )
                images+=1
                assert fixture.read_bytes()==expected
                page.locator("#clear-analysis-files").click()
                assert "original_16bit.ome.tif" not in (
                    page.locator("#analysis-dataset-status").inner_text()
                    if page.locator("#analysis-dataset-status").is_visible() else ""
                )
                print("PASS actual advanced browser TIFF import and clear",flush=True)

                art=ROOT/"artifacts"/"advanced-learning"
                art.mkdir(parents=True,exist_ok=True)
                page.screenshot(path=str(art/"advanced-1440.png"),full_page=True)
                for width,height in ((390,844),(768,920)):
                    mobile=browser.new_page(viewport={"width":width,"height":height})
                    mobile.goto(BASE+"?lab=advanced",wait_until="domcontentloaded")
                    mobile.locator("#bps-chapter-select").wait_for(state="attached",timeout=30000)
                    assert mobile.locator("#bps-chapter-select").input_value()=="A00"
                    assert mobile.evaluate("document.documentElement.scrollWidth<=innerWidth+1"),width
                    mobile.screenshot(path=str(art/f"advanced-{width}.png"),full_page=True)
                    mobile.close()
                assert not errors,errors
                page.goto(BASE,wait_until="domcontentloaded")
                page.locator("#bps-chapter-select").wait_for(timeout=30000)
                page.locator('[data-stage="Microscopy"]').click()
                assert page.locator("#bps-chapter-select option").count()==13
                assert page.locator("#bps-chapter-select").input_value()=="I13"
                assert page.evaluate("localStorage.getItem('biopython.course-selected.v1')")==original
                browser.close()
                print("PASS",py_checks,"real Pyodide changed-input cases;",
                      images,"original TIFF transfers; responsive viewports and preservation of legacy progress",flush=True)
        finally:
            server.terminate()
            try:server.wait(timeout=5)
            except subprocess.TimeoutExpired:server.kill()


if __name__=="__main__":
    main()
