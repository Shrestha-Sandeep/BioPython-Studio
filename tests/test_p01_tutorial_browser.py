"""P01 narrated example regression on real page and frozen course adapter."""
from pathlib import Path
import socket
import subprocess
import sys
import time
import urllib.request
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SHOTS = ROOT / "artifacts" / "p01-tutorials"

def serve():
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        port = sock.getsockname()[1]
    process = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1",
         "--directory", str(ROOT)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    url = f"http://127.0.0.1:{port}/"
    for _ in range(100):
        try:
            urllib.request.urlopen(url, timeout=.5).close()
            return process, url
        except Exception:
            time.sleep(.1)
    process.terminate()
    raise RuntimeError("Could not start local server")

def check():
    process, url = serve()
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            SHOTS.mkdir(parents=True, exist_ok=True)
            for width, height in [(390, 844), (1280, 850)]:
                page = browser.new_page(viewport={"width": width, "height": height})
                errors = []
                page.on("pageerror", lambda err: errors.append(str(err)))
                page.goto(url, wait_until="domcontentloaded", timeout=60000)
                page.locator("#p01-goal-select").wait_for(state="attached", timeout=30000)
                trigger = page.locator("#bps-example-trigger")
                assert trigger.is_visible(), "P01 Learn must expose an optional Example control"
                before_code = page.evaluate("() => document.querySelector('.CodeMirror').CodeMirror.getValue()")
                before_state = page.evaluate("() => localStorage.getItem('biopython.p01.v1')")
                trigger.click()
                dialog = page.locator("#bps-example-dialog")
                assert dialog.is_visible()
                assert page.locator("#bps-example-title").inner_text() == "Variables and output"
                assert page.locator("#bps-example-progress").get_attribute("max") == "6"
                assert page.locator("#bps-example-caption").inner_text()
                assert page.locator("#bps-example-voice").count() == 1
                assert page.locator("#bps-example-rate").count() == 1
                for _ in range(4):
                    page.locator("#bps-example-next").click()
                page.locator("#bps-example-parameter").evaluate(
                    "(element) => { element.value='31'; element.dispatchEvent(new Event('input',{bubbles:true})); }"
                )
                assert page.locator("#bps-example-output").inner_text().strip() == "S01\n31"
                assert page.locator("#bps-example-code .is-active").count() >= 1
                if width == 390:
                    page.screenshot(path=str(SHOTS / "p01-example-mobile.png"), full_page=True)
                else:
                    page.screenshot(path=str(SHOTS / "p01-example-desktop.png"), full_page=True)
                page.keyboard.press("Escape")
                assert not dialog.is_visible()
                assert page.evaluate("() => document.querySelector('.CodeMirror').CodeMirror.getValue()") == before_code
                assert page.evaluate("() => localStorage.getItem('biopython.p01.v1')") == before_state

                page.locator("#p01-goal-select").select_option("4")
                assert trigger.is_visible()
                trigger.click()
                assert page.locator("#bps-example-title").inner_text() == "Errors, help, and clean runs"
                page.locator("#bps-example-close").click()
                page.locator("#p01-goal-select").select_option("7")
                assert "Complete example" in trigger.inner_text()
                trigger.click()
                assert page.locator("#bps-example-title").inner_text() == "Complete example: specimen report"
                page.locator("#bps-example-close").click()
                page.locator("#p01-goal-select").select_option("8")
                assert trigger.is_hidden(), "Delayed review must not reveal a worked example"
                page.locator("#p01-goal-select").select_option("0")
                page.locator("#tab-apply").click()
                assert trigger.is_hidden(), "Apply must remain independent"
                page.locator("#tab-prove").click()
                assert trigger.is_hidden(), "Prove must remain independent"
                page.locator("#bps-chapter-select").select_option("P02")
                assert trigger.is_hidden(), "The pilot must remain scoped to P01"
                assert not errors, f"Browser errors at {width}px: {errors}"
                page.close()
            browser.close()
    finally:
        process.terminate()
        process.wait(timeout=10)

if __name__ == "__main__":
    check()
    print("P01 tutorial viewer: mobile/desktop integration checks passed.")
