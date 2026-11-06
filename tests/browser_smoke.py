"""Browser-level checks for the intentionally engine-free frontend preview."""
from pathlib import Path
import contextlib
import http.server
import socket
import subprocess
import sys
import time
import urllib.request

from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]

def free_port():
    with socket.socket(socket.AF_INET,socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1",0))
        return sock.getsockname()[1]

def serve():
    port=free_port()
    proc=subprocess.Popen([sys.executable,"-m","http.server",str(port),"--bind","127.0.0.1","--directory",str(ROOT)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    for _ in range(60):
        try:
            urllib.request.urlopen(f"http://127.0.0.1:{port}/",timeout=.5).close()
            return proc,f"http://127.0.0.1:{port}/"
        except Exception:
            time.sleep(.1)
    proc.terminate()
    raise AssertionError("HTTP preview server failed")

def main():
    server,url=serve()
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(headless=True)
            for width,height in [(360,780),(390,844),(768,1000),(1280,850),(1440,900)]:
                page=browser.new_page(viewport={"width":width,"height":height})
                # Original Witz figures are bundled. No publisher network required.
                page.route("https://images.proteinatlas.org/**", lambda route: route.abort())
                exceptions=[]
                page.on("pageerror",lambda e: exceptions.append(str(e)))
                page.goto(url,wait_until="domcontentloaded")
                page.wait_for_function("document.querySelectorAll('#stage-nav button').length === 4")
                assert page.get_by_role("heading",name="Run your first scientific script").is_visible()
                page.get_by_role("heading",name="Witz exercise 1 of 6").wait_for()
                assert page.locator("#source-link").get_attribute("href").endswith("e01-Python_basics.ipynb")
                page.locator("#code-editor").fill("var1 = 5\nprint(var1)")
                page.get_by_role("button",name="Next exercise").click()
                assert page.get_by_role("heading",name="Witz exercise 2 of 6").is_visible()
                assert page.locator("#code-editor").input_value()=="var1 = 5\nprint(var1)"
                assert page.get_by_role("tab",name="Learn").get_attribute("aria-selected")=="true"
                typography = page.evaluate("""() => {
                    const size = selector => parseFloat(getComputedStyle(document.querySelector(selector)).fontSize);
                    return {
                        title: size("#mission-title"),
                        body: size(".deck"),
                        lesson_text: size(".step-description"),
                        navigation: size(".mission-link"),
                        stage: size(".stage-button"),
                        code: size("#code-editor"),
                        helper: size(".code-status"),
                        source: size(".source-row")
                    };
                }""")
                minimum = {"title": 30, "body": 16, "lesson_text": 16, "navigation": 13,
                           "stage": 13, "code": 15, "helper": 12, "source": 13}
                for key, expected in minimum.items():
                    assert typography[key] >= expected, (
                        f"Unreadable {key} font at viewport {width}: "
                        f"{typography[key]:.1f}px; expected >= {expected}px"
                    )

                assert page.get_by_role("button",name="Run Python").is_disabled()
                page.get_by_role("button",name="Microscopy",exact=True).click()
                assert page.get_by_role("heading",name="Open a real fluorescence image").is_visible()
                page.locator("#context-image").wait_for(state="visible",timeout=15000)
                page.wait_for_function("document.getElementById('context-image').complete && document.getElementById('context-image').naturalWidth > 100")
                assert "/assets/witz/fluorescence-single.png" in page.locator("#context-image").get_attribute("src")
                assert page.locator("#figure-source").get_attribute("href").endswith("Demo.ipynb")
                assert page.locator("#raw-tiff-link").is_visible()
                page.get_by_role("heading",name="Witz exercise 1 of 5").wait_for()
                page.get_by_role("tab",name="Apply").click()
                assert page.get_by_role("heading",name="Build your program").is_visible()
                page.locator("#code-editor").fill("print('saved scientific draft')")
                page.reload(wait_until="domcontentloaded")
                page.wait_for_function("document.querySelectorAll('#stage-nav button').length === 4")
                page.get_by_role("tab",name="Apply").click()
                assert page.locator("#code-editor").input_value()=="print('saved scientific draft')"
                page.get_by_role("tab",name="Prove").click()
                assert page.get_by_role("heading",name="Show what you can do").is_visible()
                page.get_by_role("button",name="NGS",exact=True).click()
                assert page.get_by_role("heading",name="Build a DNA sequence checker").is_visible()
                page.get_by_role("button",name="ML",exact=True).click()
                assert page.get_by_role("heading",name="Define a valid biological prediction").is_visible()
                assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"),f"Overflow at {width}"
                assert not exceptions,f"JS exceptions at {width}: {exceptions}"
                page.close()
            browser.close()
        print("Frontend browser QA PASS: navigation, tab state, saved drafts, error fallback and 5 viewport sizes with typography thresholds.")
    finally:
        server.terminate()
        server.wait(timeout=5)

if __name__=="__main__":
    main()
