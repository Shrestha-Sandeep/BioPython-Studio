"""N02 narrated FASTA/FASTQ tutorial: genuine responsive browser and state QA."""
from playwright.sync_api import sync_playwright
from test_p01_tutorial_browser import serve, change_selection

def check():
    process,url=serve()
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True)
            for width,height in [(390,844),(1280,850)]:
                page=browser.new_page(viewport={"width":width,"height":height})
                errors=[]
                page.on("pageerror",lambda e: errors.append(str(e)))
                page.goto(url,wait_until="domcontentloaded",timeout=60000)
                page.locator("#bps-chapter-select").wait_for(state="attached",timeout=30000)
                page.evaluate("""() => document.querySelector('[data-stage="NGS"]').click()""")
                change_selection(page,"bps-chapter-select","N02")
                page.wait_for_function("""() => document.getElementById('bps-example-trigger').hidden===false
                   && document.getElementById('bps-chapter-select').value==='N02'""",timeout=20000)
                code_before=page.evaluate("() => document.querySelector('.CodeMirror').CodeMirror.getValue()")
                saved_before=page.evaluate("() => localStorage.getItem('biopython.n02.v1')")
                page.locator("#bps-example-trigger").click()
                assert page.locator("#bps-example-title").inner_text()=="Read sequence files without losing identity"
                assert page.locator("#bps-example-progress").get_attribute("max")=="18"
                assert page.locator("#bps-example-illustration-box").is_visible()
                assert page.locator("#bps-example-illustration-box svg").get_attribute("role")=="img"
                assert page.locator("#bps-example-image-preview").is_hidden()
                assert page.locator("#bps-example-voice").count()==1
                assert page.locator("#bps-example-rate").count()==1
                # By step 5 the explanatory image represents actual FASTA record boundaries.
                for _ in range(4):page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-position").inner_text().startswith("5 /")
                assert "RAW FASTA" in page.locator("#bps-example-illustration-box").inner_text()
                for _ in range(7):page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-position").inner_text().startswith("12 /")
                assert page.locator("#bps-example-output").inner_text().strip() in ("","—")
                assert "Withheld" in page.locator("#bps-example-visual").inner_text()
                page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-output").inner_text().strip()=="CGG"
                for _ in range(2):page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-position").inner_text().startswith("15 /")
                assert "PHRED Q" in page.locator("#bps-example-illustration-box").inner_text()
                for _ in range(3):page.locator("#bps-example-next").click()
                assert page.locator("#bps-example-position").inner_text().startswith("18 /")
                assert "independent" in page.locator("#bps-example-step-title").inner_text().lower()
                assert page.locator("#bps-example-output").inner_text().strip() in ("","—")
                assert page.evaluate("() => document.documentElement.scrollWidth <= window.innerWidth+1"),width
                page.keyboard.press("Escape")
                assert not page.locator("#bps-example-dialog").is_visible()
                assert page.evaluate("() => document.querySelector('.CodeMirror').CodeMirror.getValue()")==code_before
                assert page.evaluate("() => localStorage.getItem('biopython.n02.v1')")==saved_before
                page.locator("#tab-apply").click()
                assert page.locator("#bps-example-trigger").is_hidden()
                page.locator("#tab-prove").click()
                assert page.locator("#bps-example-trigger").is_hidden()
                page.locator("#tab-learn").click()
                assert page.locator("#bps-example-trigger").is_visible()
                change_selection(page,"p01-goal-select","5")
                assert page.locator("#bps-example-trigger").is_hidden(),"Delayed review independence"
                assert not errors,(width,errors)
                page.close()
            browser.close()
    finally:
        process.terminate()
        process.wait(timeout=10)

if __name__=="__main__":
    check()
    print("N02 synthetic FASTA/FASTQ tutorial: mobile and desktop QA passed.")
