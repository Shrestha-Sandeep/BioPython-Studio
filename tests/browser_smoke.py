"""Responsive browser QA for the UI-only adaptive Python and microscopy workspace."""
from pathlib import Path
import contextlib
import http.server
import socket
import subprocess
import sys
import time
import urllib.request
import struct
import zlib
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

def free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]

def serve():
    port = free_port()
    process = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1",
         "--directory", str(ROOT)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    for _ in range(60):
        try:
            urllib.request.urlopen(f"http://127.0.0.1:{port}/", timeout=.5).close()
            return process, f"http://127.0.0.1:{port}/"
        except Exception:
            time.sleep(.1)
    process.terminate()
    raise AssertionError("Preview server failed")

def image_bytes():
    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff)
    header = b"\x89PNG\r\n\x1a\n"
    return header + chunk(b"IHDR", struct.pack(">IIBBBBB", 1, 1, 8, 2, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(b"\x00\x12\x34\x56")) + chunk(b"IEND", b"")

def main():
    server, url = serve()
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            for width, height in [(360, 780), (390, 844), (768, 1000), (1024, 850), (1280, 850), (1440, 900)]:
                page = browser.new_page(viewport={"width": width, "height": height})
                errors = []
                page.on("pageerror", lambda err: errors.append(str(err)))
                page.goto(url, wait_until="load")
                assert page.get_by_role("heading", name="Python workspace").is_visible()
                assert page.locator("#run-button").is_disabled()
                assert page.locator("#image-panel").is_hidden()
                assert page.locator("#phase-panel").is_visible()
                assert page.locator("#code-editor").input_value() == ""
                assert page.locator("#lesson-list-placeholder").inner_text() == "No lessons loaded yet."

                if width <= 720:
                    page.locator("#menu-toggle").click()
                    assert page.locator("#course-sidebar").is_visible()
                page.locator('[data-stage="Microscopy"]').click()
                assert page.get_by_role("heading", name="Image analysis workspace").is_visible()
                assert page.locator("#image-panel").is_visible()
                assert page.locator("#result-measurements").is_visible()
                page.locator("#code-editor").fill("threshold = 4\nprint(threshold)")
                page.locator('#phase-apply').click()
                assert page.locator('#phase-apply').get_attribute("aria-selected") == "true"
                assert "practice task" in page.locator("#phase-title").inner_text()
                page.locator('#result-measurements').click()
                assert "Image measurements" in page.locator("#result-placeholder").inner_text()
                page.locator("#image-upload").set_input_files({
                    "name": "microscope.png",
                    "mimeType": "image/png",
                    "buffer": image_bytes()
                })
                page.wait_for_function("document.querySelector('#preview-image').naturalWidth === 1")
                assert page.locator("#image-info").inner_text().startswith("microscope.png")
                page.locator("#zoom-in").click()
                assert page.locator("#zoom-value").inner_text() == "125%"
                page.locator("#zoom-fit").click()
                assert page.locator("#zoom-value").inner_text() == "100%"

                page.locator("#reference-toggle").click()
                assert page.locator("#reference-panel").is_visible()
                page.locator("#reference-close").click()
                assert page.locator("#reference-panel").is_hidden()
                page.locator("#theme-toggle").click()
                assert page.locator("body").get_attribute("data-theme") == "light"
                page.reload(wait_until="load")
                assert page.locator("body").get_attribute("data-theme") == "light"
                assert page.get_by_role("heading", name="Image analysis workspace").is_visible()
                assert page.locator("#code-editor").input_value() == "threshold = 4\nprint(threshold)"
                assert page.locator("#phase-apply").get_attribute("aria-selected") == "true"
                assert page.locator("#image-empty").is_visible()  # Image files are never silently persisted.

                if width <= 720:
                    page.locator("#menu-toggle").click()
                page.locator('[data-stage="Python"]').click()
                assert page.locator("#image-panel").is_hidden()
                assert page.locator("#result-measurements").is_hidden()
                assert page.locator("#code-editor").input_value() == ""
                assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), (
                    f"Horizontal overflow at {width}px"
                )
                typography = page.evaluate("""() => {
                    const s = x => parseFloat(getComputedStyle(document.querySelector(x)).fontSize);
                    return {title:s("h1"), editor:s("#code-editor"), lesson:s(".lesson-placeholder p"), nav:s(".stage-link")};
                }""")
                assert typography["title"] >= 28
                assert typography["editor"] >= 13
                assert typography["lesson"] >= 13
                assert typography["nav"] >= 14
                assert not errors, f"JS errors at {width}px: {errors}"
                page.close()
            browser.close()
        print("UI shell QA PASS: 6 responsive sizes, stage navigation, local drafts, image preview, zoom, tabs, theme, reference and no simulated execution.")
    finally:
        server.terminate()
        server.wait(timeout=5)

if __name__ == "__main__":
    main()
