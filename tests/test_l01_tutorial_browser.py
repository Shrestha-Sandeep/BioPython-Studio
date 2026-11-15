"""L01 synthetic-animal group-split tutorial: real mobile/desktop browser QA."""
from playwright.sync_api import sync_playwright
from test_p01_tutorial_browser import serve, change_selection

def check():
    server,url=serve()
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True)
            for width,height in ((390,844),(1280,850)):
                page=browser.new_page(viewport={"width":width,"height":height})
                errors=[]
                page.on("pageerror",lambda e:errors.append(str(e)))
                page.goto(url,wait_until="domcontentloaded",timeout=60000)
                page.locator("#bps-chapter-select").wait_for(state="attached",timeout=30000)
                page.evaluate("""() => document.querySelector('[data-stage="ML"]').click()""")
                change_selection(page,"bps-chapter-select","L01")
                page.wait_for_function("""() => document.getElementById('bps-example-trigger').hidden===false
                     && document.getElementById('bps-chapter-select').value==='L01'""",timeout=30000)
                original=page.evaluate("() => document.querySelector('.CodeMirror').CodeMirror.getValue()")
                storage=page.evaluate("() => localStorage.getItem('biopython.l01.v1')")
                page.locator("#bps-example-trigger").click()
                assert page.locator("#bps-example-title").inner_text()=="Prevent leakage in biological machine learning"
                assert page.locator("#bps-example-progress").get_attribute("max")=="17"
                assert page.locator("#bps-example-illustration-box").is_visible()
                assert page.locator("#bps-example-illustration-box svg").get_attribute("role")=="img"
                assert page.locator("#bps-example-image-preview").is_hidden()
                assert page.locator("#bps-example-voice").count()==1
                assert page.locator("#bps-example-rate").count()==1
                page.locator("#bps-example-next").click()
                assert "ONE ANIMAL" in page.locator("#bps-example-illustration-box").inner_text()
                for _ in range(3):page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-position").inner_text().startswith("5 /")
                assert "SOURCE GROUPS" in page.locator("#bps-example-illustration-box").inner_text()
                for _ in range(7):page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-position").inner_text().startswith("12 /")
                assert page.locator("#bps-example-output").inner_text().strip() in ("","—")
                assert "Withheld" in page.locator("#bps-example-visual").inner_text()
                page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-output").inner_text().strip()=="2.0"
                assert "TRAIN MEDIAN" in page.locator("#bps-example-illustration-box").inner_text()
                for _ in range(4):page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-position").inner_text().startswith("17 /")
                assert "independent" in page.locator("#bps-example-step-title").inner_text().lower()
                assert page.locator("#bps-example-output").inner_text().strip() in ("","—")
                assert page.evaluate("() => document.documentElement.scrollWidth<=innerWidth+1"),width
                page.keyboard.press("Escape")
                assert not page.locator("#bps-example-dialog").is_visible()
                assert page.evaluate("() => document.querySelector('.CodeMirror').CodeMirror.getValue()")==original
                assert page.evaluate("() => localStorage.getItem('biopython.l01.v1')")==storage
                page.locator("#tab-apply").click()
                assert page.locator("#bps-example-trigger").is_hidden()
                page.locator("#tab-prove").click()
                assert page.locator("#bps-example-trigger").is_hidden()
                page.locator("#tab-learn").click()
                assert page.locator("#bps-example-trigger").is_visible()
                change_selection(page,"p01-goal-select","5")
                assert page.locator("#bps-example-trigger").is_hidden(),"Delayed review independent"
                assert not errors,(width,errors)
                page.close()
            browser.close()
    finally:
        server.terminate()
        server.wait(timeout=10)

if __name__=="__main__":
    check()
    print("L01 subject grouping and imputation lesson responsive browser checks passed.")
