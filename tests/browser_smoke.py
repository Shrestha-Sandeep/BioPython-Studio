"""Browser regression checks for the IDE-first UI (no Python execution)."""
from pathlib import Path
import socket
import base64
import subprocess
import sys
import time
import urllib.request
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SAMPLE = ROOT / "assets" / "witz" / "fluorescence-single.png"
SHOTS = ROOT / "artifacts" / "ui-preview"

def serve():
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        port = sock.getsockname()[1]
    proc = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1", "--directory", str(ROOT)],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    url = f"http://127.0.0.1:{port}/"
    for _ in range(60):
        try:
            urllib.request.urlopen(url, timeout=.5).close()
            return proc, url
        except Exception:
            time.sleep(.1)
    proc.terminate()
    raise AssertionError("Preview server did not start")

def code_value(page):
    return page.evaluate("""() => {
      const cm = document.querySelector('.CodeMirror')?.CodeMirror;
      return cm ? cm.getValue() : document.getElementById('code-editor').value;
    }""")

def set_code(page, value):
    page.evaluate("""value => {
      const cm = document.querySelector('.CodeMirror')?.CodeMirror;
      if (cm) cm.setValue(value);
      else {
        const editor = document.getElementById('code-editor');
        editor.value = value;
        editor.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }""", value)

def main():
    server, url = serve()
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            SHOTS.mkdir(parents=True, exist_ok=True)
            for width, height in [(360,780), (390,844), (768,1000), (1280,850), (1440,900)]:
                page = browser.new_page(viewport={"width": width, "height": height})
                errors = []
                outgoing = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.on("request", lambda request: outgoing.append(request.url) if not (request.url.startswith(url) or request.url.startswith("blob:")) else None)
                page.goto(url, wait_until="domcontentloaded", timeout=60000)
                page.get_by_role("heading", name="Python workspace").wait_for()
                assert page.get_by_role("button", name="Run").is_disabled()
                assert page.get_by_text("No lessons loaded yet.").count() == 1
                assert not page.locator("#phase-panel").is_visible()
                assert not page.locator("#image-panel").is_visible()
                # Vendored CodeMirror must load without CDN or outside network.
                assert page.locator(".CodeMirror").count() == 1
                assert page.locator("#editor-engine").inner_text() == "Python · CodeMirror editor"
                assert not outgoing, f"Unexpected external browser requests: {outgoing}"
                set_code(page, "sample = 5\nprint(sample)")
                assert code_value(page) == "sample = 5\nprint(sample)"
                assert page.locator("#cursor").inner_text().startswith("Ln ")
                if page.locator(".CodeMirror").count():
                    assert page.locator("#editor-engine").inner_text() == "Python · CodeMirror editor"
                    page.locator(".CodeMirror").click()
                    page.keyboard.type("\n# note")
                    assert "# note" in code_value(page)
                    set_code(page, "sample = 5\nprint(sample)")
                else:
                    assert "Basic editor" in page.locator("#editor-engine").inner_text()

                page.get_by_role("tab", name="Apply").click()
                page.get_by_role("button", name="Expand lesson").click()
                assert page.get_by_role("heading", name="Your practice task will appear here").is_visible()
                page.get_by_role("button", name="Collapse lesson").click()
                assert not page.locator("#phase-panel").is_visible()

                page.get_by_role("button", name="Image analysis").click()
                assert page.locator("#image-panel").is_visible()
                assert not page.locator("#horizontal-resizer").is_visible() if width <= 1050 else page.locator("#horizontal-resizer").is_visible()
                assert page.locator("#z-plane").is_disabled()
                assert page.locator("#time-point").is_disabled()
                page.locator("#image-upload").set_input_files(str(SAMPLE))
                page.wait_for_function("document.getElementById('image-preview').naturalWidth > 0")
                assert "px" in page.locator("#image-meta").inner_text()
                page.get_by_role("button", name="Zoom in").click()
                assert page.locator("#image-zoom").inner_text() == "125%"
                page.get_by_role("button", name="Fit").click()
                assert page.locator("#image-zoom").inner_text() == "100%"
                assert page.locator("#preview-channel").is_enabled()
                page.locator("#preview-channel").select_option("green")
                page.wait_for_function("document.getElementById('image-preview').complete")
                assert "data:image/png" in page.locator("#image-preview").get_attribute("src")
                page.locator("#image-canvas").hover(position={"x": 150, "y": 150})
                assert page.locator("#pixel-readout").inner_text().startswith(("x ", "x —"))
                # Compare two user-chosen images. No synthetic segmentation or Python execution.
                page.get_by_role("button", name="Compare", exact=True).click()
                assert page.locator("#comparison-tools").is_visible()
                page.locator("#comparison-upload").set_input_files(str(SAMPLE))
                page.wait_for_function("document.getElementById('comparison-preview').naturalWidth > 0")
                assert page.locator("#comparison-mode").is_enabled()
                page.locator("#comparison-mode").select_option("overlay")
                assert "comparison-overlay" in page.locator("#image-canvas").get_attribute("class")
                page.locator("#comparison-opacity").evaluate("el => { el.value = 65; el.dispatchEvent(new Event('input', { bubbles: true })); }")
                assert page.locator("#comparison-opacity-value").inner_text() == "65%"
                assert "0.65" in page.locator("#comparison-image-frame").get_attribute("style")
                page.locator("#comparison-mode").select_option("wipe")
                assert "comparison-wipe" in page.locator("#image-canvas").get_attribute("class")
                page.locator("#comparison-mode").select_option("side")
                assert "comparison-side" in page.locator("#image-canvas").get_attribute("class")
                if width in (390, 1440):
                    page.screenshot(path=str(SHOTS / f"microscopy-{width}.png"), full_page=True)
                page.get_by_role("button", name="Compare", exact=True).click()
                assert not page.locator("#comparison-tools").is_visible()
                assert not page.locator("#comparison-image-frame").is_visible()
                # Mismatched pixel dimensions must not be visually registered by overlay.
                if width == 1440:
                    page.get_by_role("button", name="Compare", exact=True).click()
                    tiny = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9qYfrt4AAAAASUVORK5CYII=")
                    page.locator("#comparison-upload").set_input_files({"name": "tiny.png", "mimeType": "image/png", "buffer": tiny})
                    page.wait_for_function("document.getElementById('comparison-preview').naturalWidth === 1")
                    assert page.locator("#comparison-mode option[value=overlay]").is_disabled()
                    assert page.locator("#comparison-mode option[value=wipe]").is_disabled()
                    assert page.locator("#comparison-notice").is_visible()
                    page.get_by_role("button", name="Compare", exact=True).click()
                page.get_by_role("tab", name="Histogram").click()
                assert "Histograms will appear" in page.locator("#output-placeholder").inner_text()
                page.get_by_role("button", name="Reference").click()
                assert page.locator("#reference").is_visible()
                page.get_by_role("button", name="Close reference").click()
                assert not page.locator("#reference").is_visible()

                if width > 1050:
                    separator = page.locator("#horizontal-resizer")
                    separator.focus()
                    before = int(separator.get_attribute("aria-valuenow"))
                    page.keyboard.press("ArrowRight")
                    assert int(separator.get_attribute("aria-valuenow")) == before + 5
                separator = page.locator("#vertical-resizer")
                separator.focus()
                console_before = int(separator.get_attribute("aria-valuenow"))
                page.keyboard.press("ArrowDown")
                assert int(separator.get_attribute("aria-valuenow")) == console_before + 20

                page.get_by_role("button", name="Focus", exact=True).click()
                assert not page.locator("#lesson").is_visible()
                assert page.locator("#code-wrapper").is_visible()
                page.get_by_role("button", name="Exit focus").click()
                assert page.locator("#lesson").is_visible()

                page.get_by_role("button", name="Code", exact=True).click()
                assert code_value(page) == "sample = 5\nprint(sample)"
                page.get_by_role("button", name="Switch to light theme").click()
                assert page.locator("body").get_attribute("data-theme") == "light"
                page.reload(wait_until="domcontentloaded", timeout=60000)
                assert page.locator("body").get_attribute("data-theme") == "light"
                assert code_value(page) == "sample = 5\nprint(sample)"
                if width <= 720:
                    page.get_by_role("button", name="Open navigation").click()
                    page.locator('[data-stage="Microscopy"]').click()
                    assert page.get_by_role("heading", name="Image analysis workspace").is_visible()
                assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), f"Horizontal overflow at {width}px"
                assert not outgoing, f"Unexpected external browser requests: {outgoing}"
                assert not errors, f"JavaScript errors at {width}px: {errors}"
                page.close()
            browser.close()
        print("IDE-first browser QA PASS: five sizes, offline CodeMirror, image comparison/dimension checks, splitters, focus, theme, drafts.")
    finally:
        server.terminate()
        server.wait(timeout=5)

if __name__ == "__main__":
    main()
