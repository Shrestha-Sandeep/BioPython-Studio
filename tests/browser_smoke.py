"""Browser checks for the UI-only Python and microscopy IDE."""
from pathlib import Path
import socket
import subprocess
import sys
import time
import urllib.request
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

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

def main():
    server, url = serve()
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            for width, height in [(360, 780), (390, 844), (768, 1000), (1280, 850), (1440, 900)]:
                page = browser.new_page(viewport={"width": width, "height": height})
                errors = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.goto(url, wait_until="domcontentloaded")
                assert page.get_by_role("heading", name="Python workspace").is_visible()
                assert page.get_by_role("button", name="Run").is_disabled()
                assert page.get_by_text("No lessons loaded yet.").count() == 1
                assert not page.locator("#image-panel").is_visible()
                editor = page.locator("#code-editor")
                editor.fill("sample = 5\nprint(sample)")
                assert page.locator("#line-numbers").inner_text() == "1\n2"
                page.get_by_role("tab", name="Apply").click()
                assert page.get_by_role("heading", name="Your practice task will appear here").is_visible()
                page.get_by_role("button", name="Image analysis").click()
                assert page.locator("#image-panel").is_visible()
                page.locator("#image-upload").set_input_files(str(ROOT / "assets" / "witz" / "fluorescence-single.png"))
                page.wait_for_function("document.getElementById('image-preview').naturalWidth > 0")
                assert "px" in page.locator("#image-meta").inner_text()
                page.get_by_role("button", name="Zoom in").click()
                assert page.locator("#image-zoom").inner_text() == "125%"
                page.get_by_role("button", name="Fit").click()
                assert page.locator("#image-zoom").inner_text() == "100%"
                page.get_by_role("button", name="Reference").click()
                assert page.locator("#reference").is_visible()
                page.get_by_role("button", name="Close reference").click()
                assert not page.locator("#reference").is_visible()
                page.get_by_role("button", name="Switch to light theme").click()
                assert page.locator("body").get_attribute("data-theme") == "light"
                page.reload(wait_until="domcontentloaded")
                assert page.locator("body").get_attribute("data-theme") == "light"
                assert page.locator("#code-editor").input_value() == "sample = 5\nprint(sample)"
                assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), f"Horizontal overflow at {width}px"
                assert not errors, f"JavaScript errors at {width}px: {errors}"
                page.close()
            browser.close()
        print("UI-first browser QA PASS: responsive layouts, editable code, image preview, viewer zoom, reference, theme and draft storage.")
    finally:
        server.terminate()
        server.wait(timeout=5)

if __name__ == "__main__":
    main()
