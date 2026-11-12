"""UI-first-2 regression: real course adapter, guided steps and mobile panels.
No mocked lesson engine, no Pyodide downloads, no fake completion claims.
"""
from pathlib import Path
import socket
import subprocess
import sys
import time
import urllib.request
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SAMPLE = ROOT / "assets" / "witz" / "fluorescence-single.png"
SHOTS = ROOT / "artifacts" / "ui-first-2"

def serve():
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        port = sock.getsockname()[1]
    proc = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1", "--directory", str(ROOT)],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    url = f"http://127.0.0.1:{port}/"
    for _ in range(100):
        try:
            urllib.request.urlopen(url, timeout=.5).close()
            return proc, url
        except Exception:
            time.sleep(.1)
    proc.terminate()
    raise AssertionError("Server did not start")

def code(page):
    return page.evaluate("() => document.querySelector('.CodeMirror')?.CodeMirror.getValue() || document.getElementById('code-editor').value")

def set_code(page, source):
    page.evaluate("source => document.querySelector('.CodeMirror').CodeMirror.setValue(source)", source)

def change_stage(page, stage, mobile):
    if mobile:
        page.locator("#nav-toggle").click()
    page.locator(f'[data-stage="{stage}"]').click()

def check_browser():
    proc, url = serve()
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            SHOTS.mkdir(parents=True, exist_ok=True)
            for width, height in [(360,780), (390,844), (768,1000), (1280,850), (1440,900)]:
                mobile = width <= 720
                page = browser.new_page(viewport={"width":width, "height":height})
                errors = []
                page.on("pageerror", lambda exc: errors.append(str(exc)))
                page.goto(url, wait_until="domcontentloaded", timeout=60000)
                page.locator("#p01-goal-select").wait_for(state="attached", timeout=30000)
                page.wait_for_function("document.getElementById('run-button').disabled === false")
                assert page.locator("body").get_attribute("data-ui-view") == "learn"
                assert page.locator("#phase-panel").is_visible(), f"Guided task not visible at {width}px"
                assert page.locator("#guided-nav").is_visible()
                assert page.locator("#guided-position").inner_text() == "Task 1 / 9"
                assert page.locator("#page-title").inner_text().strip() != "Python workspace"
                assert page.locator("header").inner_text().find("Studio") == -1
                assert page.locator("header").inner_text().find("IDE") == -1
                assert page.locator(".CodeMirror").count() == 1
                assert page.locator("#view-learn").get_attribute("aria-pressed") == "true"
                assert page.locator("#view-explore").get_attribute("aria-pressed") == "false"
                assert page.locator("#p01-check").is_hidden()
                assert not page.locator("#image-panel").is_visible()
                assert page.locator("#mobile-pane-image").is_hidden()

                # Back/Next move through existing Learn, Apply and Prove phases without granting mastery.
                page.locator("#guided-next").click()
                assert page.locator("#tab-apply").get_attribute("aria-selected") == "true"
                page.locator("#guided-next").click()
                assert page.locator("#tab-prove").get_attribute("aria-selected") == "true"
                page.locator("#guided-next").click()
                assert page.locator("#p01-goal-select").input_value() == "1"
                assert page.locator("#tab-learn").get_attribute("aria-selected") == "true"
                assert page.locator("#guided-position").inner_text() == "Task 2 / 9"
                page.locator("#guided-back").click()
                assert page.locator("#p01-goal-select").input_value() == "0"
                assert page.locator("#tab-prove").get_attribute("aria-selected") == "true"
                state = page.evaluate("() => JSON.parse(localStorage.getItem('biopython.p01.v1'))")
                assert state["goal"] == 0 and state["phase"] == "prove"
                assert not any(k.endswith(":prove") for k in state.get("progress",{})), "Navigation must not grant mastery"

                # Switching views must never replace the code or detach the real Python runner.
                set_code(page, "print('preserved UI2')")
                page.locator("#view-explore").click()
                assert page.locator("body").get_attribute("data-ui-view") == "explore"
                assert page.locator("#lesson").is_hidden()
                assert page.locator("#clear-code").is_visible()
                assert page.locator("#reference-toggle").is_visible()
                assert code(page) == "print('preserved UI2')"
                page.locator("#view-learn").click()
                assert page.locator("#phase-panel").is_visible()
                assert page.locator("#clear-code").is_hidden()
                assert code(page) == "print('preserved UI2')"
                if mobile:
                    assert page.locator("#mobile-workspace-tabs").is_visible()
                    assert page.locator(".workspace-grid .editor").is_visible()
                    assert page.locator("#output-panel").is_hidden()
                    page.locator("#mobile-pane-result").click()
                    assert page.locator("#output-panel").is_visible()
                    assert page.locator(".workspace-grid .editor").is_hidden()
                    page.locator("#mobile-pane-code").click()
                    assert page.locator(".workspace-grid .editor").is_visible()
                else:
                    assert page.locator("#mobile-workspace-tabs").is_hidden()

                if width in (390,1440):
                    page.screenshot(path=str(SHOTS / f"learn-{width}.png"), full_page=True)

                # Real microscopy chapter must retain image preview and comparison tools.
                change_stage(page, "Microscopy", mobile)
                page.wait_for_function("document.querySelector('#bps-chapter-select')?.value.startsWith('I')")
                assert page.locator("#image-panel").get_attribute("hidden") is None  # stage enables real viewer
                if mobile:
                    assert page.locator("#mobile-pane-image").is_visible()
                    assert page.locator("#image-panel").is_hidden()
                    page.locator("#mobile-pane-image").click()
                assert page.locator("#image-panel").is_visible()
                page.locator("#image-upload").set_input_files(str(SAMPLE))
                page.wait_for_function("document.getElementById('image-preview').naturalWidth > 0")
                assert "px" in page.locator("#image-meta").inner_text()
                page.locator("#compare-toggle").click()
                page.locator("#comparison-upload").set_input_files(str(SAMPLE))
                page.wait_for_function("document.getElementById('comparison-preview').naturalWidth > 0")
                page.locator("#comparison-mode").select_option("overlay")
                assert "comparison-overlay" in page.locator("#image-canvas").get_attribute("class")
                page.locator("#comparison-mode").select_option("side")
                assert "comparison-side" in page.locator("#image-canvas").get_attribute("class")

                page.locator("#view-explore").click()
                assert page.locator("#lesson").is_hidden()
                assert page.locator("#compare-toggle").is_visible()
                if mobile:
                    assert page.locator("#mobile-pane-image").is_visible()
                else:
                    assert page.locator("#focus-toggle").is_visible()
                    page.locator("#focus-toggle").click()
                    assert page.locator("body").evaluate("(el) => el.classList.contains('focus-mode')")
                    page.locator("#focus-toggle").click()
                if width in (390,1440):
                    page.screenshot(path=str(SHOTS / f"explore-{width}.png"), full_page=True)

                # Mode selection persists; no changes to legacy course-progress keys.
                page.reload(wait_until="domcontentloaded", timeout=60000)
                page.locator("#p01-goal-select").wait_for(state="attached", timeout=30000)
                assert page.locator("body").get_attribute("data-ui-view") == "explore"
                assert page.locator("#view-explore").get_attribute("aria-pressed") == "true"
                page.locator("#view-learn").click()
                assert page.locator("#phase-panel").is_visible()
                assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), f"Horizontal overflow at {width}px"
                assert not errors, f"JS errors at {width}px: {errors}"
                page.close()
            browser.close()
        print("UI-first-2 PASS: guided navigation, Learn/Explore, course state, image comparison and five viewports")
    finally:
        proc.terminate()
        proc.wait(timeout=5)

if __name__ == "__main__":
    check_browser()
