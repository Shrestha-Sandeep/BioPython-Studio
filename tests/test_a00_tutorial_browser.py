"""A00 research-first narrated tutorial, true browser checks at phone and desktop sizes."""
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
                page.on("pageerror",lambda e:errors.append(str(e)))
                page.goto(url+"?lab=advanced",wait_until="domcontentloaded",timeout=60000)
                page.locator("#bps-chapter-select").wait_for(state="attached",timeout=30000)
                page.evaluate("""() => document.querySelector('[data-stage="Microscopy"]').click()""")
                change_selection(page,"bps-chapter-select","A00")
                page.wait_for_function("""() => document.querySelector('#bps-chapter-select')?.value==='A00'
                  && document.querySelector('#bps-example-trigger')?.hidden===false""",timeout=30000)
                original=page.evaluate("() => document.querySelector('.CodeMirror').CodeMirror.getValue()")
                original_state=page.evaluate("() => localStorage.getItem('biopython.a00.v1')")
                trigger=page.locator("#bps-example-trigger")
                trigger.click()
                assert page.locator("#bps-example-title").inner_text()=="Make a reproducible biology project"
                assert page.locator("#bps-example-progress").get_attribute("max")=="16"
                illustration=page.locator("#bps-example-illustration-box")
                assert illustration.is_visible()
                assert illustration.locator("svg").get_attribute("role")=="img"
                assert illustration.locator("svg").get_attribute("aria-label").startswith("Original A00")
                assert page.locator("#bps-example-voice").count()==1
                assert page.locator("#bps-example-rate").count()==1
                for _ in range(8):page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-position").inner_text().startswith("9 /")
                assert page.locator("#bps-example-output").inner_text().strip() in ("","—")
                assert "Withheld" in page.locator("#bps-example-visual").inner_text()
                assert "?" in illustration.inner_text()
                page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-output").inner_text().strip()=="{'A': 6.0, 'B': 10.0} 2"
                for _ in range(6):page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-position").inner_text().startswith("16 /")
                assert page.locator("#bps-example-output").inner_text().strip() in ("","—")
                assert "Independent" in page.locator("#bps-example-step-title").inner_text()
                assert page.evaluate("() => document.documentElement.scrollWidth <= innerWidth+1"),width
                page.keyboard.press("Escape")
                assert not page.locator("#bps-example-dialog").is_visible()
                assert page.evaluate("() => document.querySelector('.CodeMirror').CodeMirror.getValue()")==original
                assert page.evaluate("() => localStorage.getItem('biopython.a00.v1')")==original_state
                page.locator("#tab-apply").click()
                assert trigger.is_hidden()
                page.locator("#tab-prove").click()
                assert trigger.is_hidden()
                page.locator("#tab-learn").click()
                assert trigger.is_visible()
                change_selection(page,"p01-goal-select","5")
                assert trigger.is_visible(),"Capstone worked example may be viewed in Learn only"
                change_selection(page,"p01-goal-select","6")
                assert trigger.is_hidden(),"Delayed review cannot expose a worked tutorial"
                assert not errors,(width,errors)
                page.close()
            default=browser.new_page(viewport={"width":1280,"height":850})
            default.goto(url,wait_until="domcontentloaded")
            default.locator("#bps-chapter-select").wait_for(state="attached")
            opts=default.locator("#bps-chapter-select").locator("option").all_text_contents()
            assert not any("A00" in item for item in opts),opts
            default.close()
            browser.close()
    finally:
        server.terminate()
        server.wait(timeout=10)

if __name__=="__main__":
    check()
    print("A00 optional advanced tutorial research loop responsive QA passed.")
