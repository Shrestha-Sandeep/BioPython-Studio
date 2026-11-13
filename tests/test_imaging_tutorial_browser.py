"""Guided microscopy I01/I02 examples: browser state isolation and preview provenance."""
from playwright.sync_api import sync_playwright
from test_p01_tutorial_browser import serve, change_selection

CHAPTERS = {
    "I01": ("What a microscopy image actually contains", 16, 6),
    "I02": ("Crop a microscopy image without losing its meaning", 17, 8),
}

def check():
    process, url = serve()
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True)
            for width, height in [(390, 844), (1280, 850)]:
                page = browser.new_page(viewport={"width": width, "height": height})
                errors = []
                page.on("pageerror", lambda e: errors.append(str(e)))
                page.goto(url, wait_until="domcontentloaded", timeout=60000)
                page.locator("#p01-goal-select").wait_for(state="attached", timeout=30000)
                page.evaluate("""() => document.querySelector('[data-stage="Microscopy"]').click()""")
                for chapter, (title, n, checkpoint) in CHAPTERS.items():
                    change_selection(page, "bps-chapter-select", chapter)
                    page.wait_for_function(
                        """ch => document.getElementById('bps-chapter-select').value === ch
                          && document.getElementById('bps-example-trigger').hidden === false""",
                        arg=chapter, timeout=20000)
                    code_before = page.evaluate("() => document.querySelector('.CodeMirror').CodeMirror.getValue()")
                    storage_key = "biopython." + chapter.lower() + ".v1"
                    saved_before = page.evaluate("(key) => localStorage.getItem(key)", storage_key)
                    page.locator("#bps-example-trigger").click()
                    assert page.locator("#bps-example-dialog").is_visible()
                    assert page.locator("#bps-example-title").inner_text() == title
                    assert page.locator("#bps-example-progress").get_attribute("max") == str(n)
                    assert page.locator("#bps-example-image-preview").is_visible()
                    page.wait_for_function("() => document.getElementById('bps-example-image').naturalWidth > 0", timeout=10000)
                    assert "Human Protein Atlas" in page.locator("#bps-example-image-preview").inner_text()
                    page.locator("#bps-example-next").click()
                    assert page.locator("#bps-example-illustration-box").is_visible()
                    assert page.locator("#bps-example-illustration-box svg").get_attribute("role") == "img"
                    for _ in range(checkpoint - 2):
                        page.locator("#bps-example-next").click()
                    assert page.locator("#bps-example-position").inner_text().startswith(str(checkpoint) + " /")
                    assert page.locator("#bps-example-output").inner_text().strip() in ("", "—")
                    page.locator("#bps-example-next").click()
                    assert page.locator("#bps-example-output").inner_text().strip() == "9"
                    page.keyboard.press("Escape")
                    assert not page.locator("#bps-example-dialog").is_visible()
                    assert page.evaluate("() => document.querySelector('.CodeMirror').CodeMirror.getValue()") == code_before
                    assert page.evaluate("(key) => localStorage.getItem(key)", storage_key) == saved_before
                    page.locator("#tab-apply").click()
                    assert page.locator("#bps-example-trigger").is_hidden()
                    page.locator("#tab-prove").click()
                    assert page.locator("#bps-example-trigger").is_hidden()
                    page.locator("#tab-learn").click()
                    assert page.locator("#bps-example-trigger").is_visible()
                assert not errors, str((width, errors))
                page.close()
            browser.close()
    finally:
        process.terminate()
        process.wait(timeout=10)

if __name__ == "__main__":
    check()
    print("I01/I02 tutorial browser checks passed on mobile and desktop.")
