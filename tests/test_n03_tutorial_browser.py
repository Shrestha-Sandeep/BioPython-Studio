"""N03 synthetic read-quality tutorial: mobile/desktop and independence checks."""
from playwright.sync_api import sync_playwright
from test_p01_tutorial_browser import serve, change_selection

def check():
    process,url=serve()
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True)
            for width,height in ((390,844),(1280,850)):
                page=browser.new_page(viewport={"width":width,"height":height})
                errors=[]
                page.on("pageerror",lambda e:errors.append(str(e)))
                page.goto(url,wait_until="domcontentloaded",timeout=60000)
                page.locator("#bps-chapter-select").wait_for(state="attached",timeout=30000)
                page.evaluate("""() => document.querySelector('[data-stage="NGS"]').click()""")
                change_selection(page,"bps-chapter-select","N03")
                page.wait_for_function("""() => document.getElementById('bps-example-trigger').hidden===false
                && document.getElementById('bps-chapter-select').value==='N03'""",timeout=25000)
                original=page.evaluate("() => document.querySelector('.CodeMirror').CodeMirror.getValue()")
                stored=page.evaluate("() => localStorage.getItem('biopython.n03.v1')")
                page.locator("#bps-example-trigger").click()
                assert page.locator("#bps-example-title").inner_text()=="Inspect read quality, trim and compare"
                assert page.locator("#bps-example-progress").get_attribute("max")=="18"
                assert page.locator("#bps-example-illustration-box").is_visible()
                assert page.locator("#bps-example-illustration-box svg").get_attribute("role")=="img"
                assert page.locator("#bps-example-voice").count()==1
                assert page.locator("#bps-example-rate").count()==1
                page.locator("#bps-example-next").click()
                assert "PER-CYCLE SUMMARY" in page.locator("#bps-example-illustration-box").inner_text()
                for _ in range(3):page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-position").inner_text().startswith("5 /")
                assert "RETAINED PREFIX" in page.locator("#bps-example-illustration-box").inner_text()
                for _ in range(5):page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-position").inner_text().startswith("10 /")
                assert page.locator("#bps-example-output").inner_text().strip() in ("","—")
                assert "Withheld" in page.locator("#bps-example-visual").inner_text()
                page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-output").inner_text().strip()=="{'AA': 2, 'AC': 1}"
                for _ in range(2):page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-position").inner_text().startswith("13 /")
                assert "EXPLICIT GLOBAL ALIGNMENT" in page.locator("#bps-example-illustration-box").inner_text()
                for _ in range(5):page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-position").inner_text().startswith("18 /")
                assert "independent" in page.locator("#bps-example-step-title").inner_text().lower()
                assert page.locator("#bps-example-output").inner_text().strip() in ("","—")
                assert page.evaluate("() => document.documentElement.scrollWidth<=window.innerWidth+1"),width
                page.keyboard.press("Escape")
                assert not page.locator("#bps-example-dialog").is_visible()
                assert page.evaluate("() => document.querySelector('.CodeMirror').CodeMirror.getValue()")==original
                assert page.evaluate("() => localStorage.getItem('biopython.n03.v1')")==stored
                page.locator("#tab-apply").click()
                assert page.locator("#bps-example-trigger").is_hidden()
                page.locator("#tab-prove").click()
                assert page.locator("#bps-example-trigger").is_hidden()
                page.locator("#tab-learn").click()
                assert page.locator("#bps-example-trigger").is_visible()
                change_selection(page,"p01-goal-select","5")
                assert page.locator("#bps-example-trigger").is_hidden(),"N03 independent review"
                assert not errors,(width,errors)
                page.close()
            browser.close()
    finally:
        process.terminate()
        process.wait(timeout=10)

if __name__=="__main__":
    check()
    print("N03 quality, trim, kmer and aligner tutorial responsive checks passed.")
