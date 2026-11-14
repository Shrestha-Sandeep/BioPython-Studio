"""A02 researcher-safe candidate segmentation tutorial in real desktop/mobile Chromium."""
from playwright.sync_api import sync_playwright
from test_p01_tutorial_browser import serve,change_selection

def check():
    server,url=serve()
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True)
            for width,height in ((390,844),(1280,850)):
                page=browser.new_page(viewport={"width":width,"height":height})
                errors=[]
                page.on("pageerror",lambda err:errors.append(str(err)))
                page.goto(url+"?lab=advanced",wait_until="domcontentloaded",timeout=60000)
                page.locator("#bps-chapter-select").wait_for(state="attached",timeout=30000)
                page.evaluate("""() => document.querySelector('[data-stage="Microscopy"]').click()""")
                change_selection(page,"bps-chapter-select","A02")
                page.wait_for_function("""() => document.querySelector('#bps-chapter-select')?.value==='A02' &&
                 document.querySelector('#bps-example-trigger')?.hidden===false""",timeout=30000)
                code=page.evaluate("() => document.querySelector('.CodeMirror').CodeMirror.getValue()")
                store=page.evaluate("() => localStorage.getItem('biopython.a02.v1')")
                trigger=page.locator("#bps-example-trigger")
                trigger.click()
                assert page.locator("#bps-example-title").inner_text()=="Segment candidate objects responsibly"
                assert page.locator("#bps-example-progress").get_attribute("max")=="17"
                svg=page.locator("#bps-example-illustration-box svg")
                assert svg.is_visible()
                assert svg.get_attribute("role")=="img"
                assert "A02" in svg.get_attribute("aria-label")
                assert page.locator("#bps-example-voice").count()==1
                assert page.locator("#bps-example-rate").count()==1
                for _ in range(6):page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-position").inner_text().startswith("7 /")
                assert "CONNECTIVITY" in page.locator("#bps-example-illustration-box").inner_text()
                for _ in range(2):page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-position").inner_text().startswith("9 /")
                assert page.locator("#bps-example-output").inner_text().strip() in ("","—")
                assert "Withheld" in page.locator("#bps-example-visual").inner_text()
                assert "withheld" in page.locator("#bps-example-illustration-box").inner_text().lower()
                page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-output").inner_text().strip()=="[2, 3] 2"
                for _ in range(7):page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-position").inner_text().startswith("17 /")
                assert "Independent" in page.locator("#bps-example-step-title").inner_text()
                assert page.locator("#bps-example-output").inner_text().strip() in ("","—")
                assert page.evaluate("() => document.documentElement.scrollWidth<=innerWidth+1"),width
                page.keyboard.press("Escape")
                assert not page.locator("#bps-example-dialog").is_visible()
                assert page.evaluate("() => document.querySelector('.CodeMirror').CodeMirror.getValue()")==code
                assert page.evaluate("() => localStorage.getItem('biopython.a02.v1')")==store
                page.locator("#tab-apply").click()
                assert trigger.is_hidden()
                page.locator("#tab-prove").click()
                assert trigger.is_hidden()
                page.locator("#tab-learn").click()
                change_selection(page,"p01-goal-select","5")
                assert trigger.is_visible()
                change_selection(page,"p01-goal-select","6")
                assert trigger.is_hidden(),"Delayed review must remain independent"
                assert not errors,(width,errors)
                page.close()
            default=browser.new_page(viewport={"width":1280,"height":850})
            default.goto(url,wait_until="domcontentloaded")
            default.locator("#bps-chapter-select").wait_for(state="attached")
            assert all("A02" not in x for x in default.locator("#bps-chapter-select option").all_text_contents())
            default.close()
            browser.close()
    finally:
        server.terminate()
        server.wait(timeout=10)

if __name__=="__main__":
    check()
    print("A02 segmentation failure-sensitivity phone/desktop tutorial QA passed.")
