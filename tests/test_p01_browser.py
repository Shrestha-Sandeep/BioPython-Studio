"""P01 integration smoke with genuine Pyodide execution (no mocked Worker)."""
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PORT = 8976
URL = "http://127.0.0.1:%d/" % PORT
def main():
    server = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"],
                              cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    try:
        time.sleep(1.5)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
            page = browser.new_page(viewport={"width": 1280, "height": 820})
            errors = []
            page.on("pageerror", lambda err: errors.append(str(err)))
            page.add_init_script("""localStorage.setItem('biopython.ui-first.v1',
              JSON.stringify({drafts:{'Python:python':'# ORIGINAL_UNTOUCHED_DRAFT'},
              theme:'dark',layout:{editorShare:54,consoleHeight:160,lessonOpen:false}}));""")
            page.goto(URL, wait_until="domcontentloaded")
            page.locator("#p01-goal-select").wait_for(timeout=20000)
            assert page.locator("#run-button").is_enabled(), "Python Run button must be enabled by P01 adapter"
            assert page.locator("#lesson-summary").inner_text().startswith("P01")
            page.locator("#run-button").click()
            page.wait_for_function("document.querySelector('#output-body').innerText.includes('N2_P03 6')",
                                   timeout=100000)
            assert "Python 3" in page.locator(".runtime-state").inner_text(), "Real kernel evidence missing"

            # Real tracebacks: a misspelled variable must not appear to succeed.
            page.evaluate("""() => document.querySelector('.CodeMirror').CodeMirror.setValue('print(undefined_name)')""")
            page.locator("#run-button").click()
            page.wait_for_function("document.querySelector('#output-body').innerText.includes('NameError')",
                                   timeout=30000)

            # Check must execute changed Python inputs, not compare fixed output strings.
            page.locator("#tab-apply").click()
            page.evaluate("""() => document.querySelector('.CodeMirror').CodeMirror.setValue(
              'report = f"{specimen}: {fields} fields"\\nprint(report)')""")
            page.locator("#p01-check").click()
            page.wait_for_function("document.querySelector('#output-body').innerText.includes('Passed 2 changed-input checks')",
                                   timeout=30000)
            original = "# ORIGINAL_UNTOUCHED_DRAFT"
            assert page.evaluate("""() => JSON.parse(localStorage.getItem('biopython.ui-first.v1')).drafts['Python:python']""") == original, "Frozen stage draft overwritten"

            # Hardcoded first output must fail on unfamiliar second test input.
            page.evaluate("""() => document.querySelector('.CodeMirror').CodeMirror.setValue(
              'report = "N2_P03: 6 fields"')""")
            page.locator("#p01-check").click()
            page.wait_for_function("document.querySelector('#output-body').innerText.includes('Practice condition failed')",
                                   timeout=30000)

            # Per-goal and phase drafts survive activity navigation and refresh.
            page.evaluate("""() => document.querySelector('.CodeMirror').CodeMirror.setValue(
              'report = f"{specimen}: {fields} fields"\\n# saved P01-G01 apply')""")
            page.locator("#p01-goal-select").select_option("1")
            page.locator("#p01-goal-select").select_option("0")
            page.locator("#tab-apply").click()
            assert "saved P01-G01 apply" in page.evaluate(
                "() => document.querySelector('.CodeMirror').CodeMirror.getValue()")
            page.reload(wait_until="domcontentloaded")
            page.locator("#p01-goal-select").wait_for(timeout=20000)
            assert "saved P01-G01 apply" in page.evaluate(
                "() => document.querySelector('.CodeMirror').CodeMirror.getValue()"), "Reload lost draft"
            assert page.locator("#tab-apply").get_attribute("aria-selected") == "true", "Reload lost phase"
            assert not errors, "Browser exceptions: %r" % errors
            browser.close()
        print("PASS: real Pyodide stdout/traceback, changed-input check, draft preservation, reload")
    finally:
        server.terminate()
        try:server.wait(timeout=5)
        except subprocess.TimeoutExpired:server.kill()

if __name__ == "__main__":
    main()
