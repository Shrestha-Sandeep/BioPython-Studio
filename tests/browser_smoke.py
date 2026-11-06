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
            for width,height in [(360,780),(390,844),(768,1000),(1280,850)]:
                page=browser.new_page(viewport={"width":width,"height":height})
                # Test image failure gracefully, without relying on publisher connectivity.
                page.route("https://images.proteinatlas.org/**", lambda route: route.abort())
                exceptions=[]
                page.on("pageerror",lambda e: exceptions.append(str(e)))
                page.goto(url,wait_until="domcontentloaded")
                page.wait_for_function("document.querySelectorAll('#stage-nav button').length === 4")
                assert page.get_by_role("heading",name="Run your first scientific script").is_visible()
                assert page.get_by_role("tab",name="Learn").get_attribute("aria-selected")=="true"
                assert page.get_by_role("button",name="Run Python").is_disabled()
                page.get_by_role("button",name="Microscopy",exact=True).click()
                assert page.get_by_role("heading",name="Open a real fluorescence image").is_visible()
                assert page.locator("#image-fallback").is_visible()
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
        print("Frontend browser QA PASS: navigation, tab state, saved drafts, error fallback and 4 viewport sizes.")
    finally:
        server.terminate()
        server.wait(timeout=5)

if __name__=="__main__":
    main()
