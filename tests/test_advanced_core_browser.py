"""Real browser/Pyodide execution of A00/A05/A06/A07, all 128 changed inputs.

The standard course and A01-A03 are tested separately. This is not a human
independent-science exam or prospective data validation.
"""
from __future__ import annotations

import json
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

from test_advanced_learning_browser import set_code, check

ROOT=Path(__file__).resolve().parents[1]
PORT=8997
BASE=f"http://127.0.0.1:{PORT}/"
CHAPTERS=("A00","A05","A06","A07")


def main():
    server=subprocess.Popen(
        [sys.executable,"-m","http.server",str(PORT),"--bind","127.0.0.1"],
        cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,
    )
    count=0
    try:
        time.sleep(1.2)
        with sync_playwright() as p:
            browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
            page=browser.new_page(viewport={"width":1440,"height":900},accept_downloads=True)
            errors=[]
            page.on("pageerror",lambda err:errors.append(str(err)))
            page.goto(BASE,wait_until="domcontentloaded")
            page.locator("#bps-chapter-select").wait_for(timeout=30000)
            # Workspace follows the course, with no redundant mode switch.
            assert page.locator(".mode-switch, [data-mode]").count()==0
            assert page.locator("#image-panel").is_hidden(), "Foundations should show code only"
            assert page.locator("#run-button").is_enabled()
            page.locator('[data-stage="Microscopy"]').click()
            assert page.locator("#image-panel").is_visible(), "Microscopy should show the image viewer"
            assert "with-image" in (page.locator("#workspace-grid").get_attribute("class") or "")
            assert page.locator("#run-button").is_enabled()
            page.locator('[data-stage="NGS"]').click()
            assert page.locator("#image-panel").is_hidden(), "Sequence analysis should be code-first"
            assert page.locator("#run-button").is_enabled()
            page.locator('[data-stage="ML"]').click()
            assert page.locator("#image-panel").is_hidden(), "Non-image ML lessons should be code-first"
            assert page.locator("#run-button").is_enabled()
            page.locator('[data-stage="Python"]').click()
            assert page.locator("#image-panel").is_hidden()
            assert page.locator("#run-button").is_enabled()
            page.locator('[data-stage="Microscopy"]').click()
            assert page.locator("#bps-chapter-select option").count()==13
            page.locator("#bps-chapter-select").select_option("I13")
            legacy=page.evaluate("localStorage.getItem('biopython.course-selected.v1')")
            assert legacy=="I13"
            page.goto(BASE+"?lab=advanced",wait_until="domcontentloaded")
            page.locator("#bps-chapter-select").wait_for(timeout=30000)
            assert page.locator("#bps-chapter-select").input_value()=="A00"
            assert page.locator(".mode-switch, [data-mode]").count()==0
            assert page.locator("#image-panel").is_visible(), "Advanced microscopy should retain image viewer"
            assert page.locator("#run-button").is_enabled()
            assert page.locator("#phase-panel").is_visible(), "Advanced task opens directly in Learn"
            assert page.locator("#lesson-toggle").get_attribute("aria-expanded")=="true"
            assert page.locator("#bps-chapter-select option").count()==20
            assert page.locator("#bps-advanced-docs").get_attribute("href").endswith("/a00/README.md")
            assert page.evaluate("localStorage.getItem('biopython.course-selected.v1')")==legacy

            for cid in CHAPTERS:
                page.locator("#bps-chapter-select").select_option(cid)
                lesson=json.loads((ROOT/"content"/cid.lower()/"lesson.json").read_text(encoding="utf-8"))
                refs=json.loads((ROOT/"tests"/f"reference_{cid.lower()}_advanced.json").read_text(encoding="utf-8"))
                assert page.locator("#bps-chapter-select").input_value() == cid
                assert page.locator("#bps-advanced-docs").get_attribute("href").endswith("/"+cid.lower()+"/README.md")
                items=[*lesson["goals"],lesson["capstone"],lesson["review"]]
                for index,g in enumerate(items):
                    page.locator("#p01-goal-select").select_option(str(index))
                    for phase in ("apply","prove"):
                        examples=g["phases"][phase]["public_checks"]
                        check(page,cid,g,phase,refs[g["id"]][phase],len(examples))
                        count+=len(examples)
                    if g["id"].endswith("-CAPSTONE"):
                        page.locator("#tab-prove").click()
                        set_code(page,refs[g["id"]]["prove"])
                        with page.expect_download(timeout=20000) as event:
                            page.locator("#p01-export").click()
                        download=event.value
                        assert download.suggested_filename==lesson["final_project"]["name"]
                        source=Path(download.path()).read_text(encoding="utf-8")
                        assert "original learner code" in source
                        assert "Synthetic practice inputs" in source
                        result=subprocess.run([sys.executable,str(download.path())],
                                              cwd=ROOT,capture_output=True,text=True,timeout=60)
                        assert result.returncode==0,(cid,result.stderr[:1100])
                        assert result.stdout.strip(),cid
                page.reload(wait_until="domcontentloaded")
                page.locator("#bps-chapter-select").wait_for(timeout=30000)
                assert page.locator("#bps-chapter-select").input_value()==cid
                assert page.evaluate("localStorage.getItem('biopython.course-selected.v1')")==legacy
                print(f"PASS {cid} {len(items)} advanced activities with changed-input Pyodide",flush=True)
            assert count==128,count
            assert not errors,errors

            images=ROOT/"artifacts"/"advanced-core"
            images.mkdir(parents=True,exist_ok=True)
            page.screenshot(path=str(images/"advanced-core-desktop-1440.png"),full_page=True)
            for width,height in ((390,844),(768,920)):
                phone=browser.new_page(viewport={"width":width,"height":height})
                phone.goto(BASE+"?lab=advanced",wait_until="domcontentloaded")
                phone.locator("#bps-chapter-select").wait_for(state="attached",timeout=30000)
                assert phone.locator("#bps-chapter-select").input_value()=="A00"
                assert phone.locator("#phase-panel").is_visible(), "Advanced mobile task should open"
                assert phone.evaluate("document.documentElement.scrollWidth<=innerWidth+1"),width
                phone.screenshot(path=str(images/f"advanced-core-{width}.png"),full_page=True)
                phone.close()

            page.goto(BASE,wait_until="domcontentloaded")
            page.locator("#bps-chapter-select").wait_for(timeout=30000)
            page.locator('[data-stage="Microscopy"]').click()
            assert page.locator("#bps-chapter-select option").count()==13
            assert page.locator("#bps-chapter-select").input_value()=="I13"
            assert page.evaluate("localStorage.getItem('biopython.course-selected.v1')")==legacy
            browser.close()
            print("PASS 128 changed-input real Pyodide cases, four capstone exports, mobile/tablet/desktop, legacy saved progress",flush=True)
    finally:
        server.terminate()
        try:server.wait(timeout=5)
        except subprocess.TimeoutExpired:server.kill()


if __name__=="__main__":
    main()
