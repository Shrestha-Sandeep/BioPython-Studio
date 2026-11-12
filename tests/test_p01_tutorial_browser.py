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

def change_selection(page, element_id, value):
    # The selector is intentionally inside a closed mobile drawer.
    # Dispatch its native change event without overriding the frozen navigation UI.
    page.locator(f"#{element_id}").evaluate(
        "(element, value) => { element.value=value; element.dispatchEvent(new Event('change',{bubbles:true})); }",
        value
    )

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
                assert page.locator("#bps-example-title").inner_text() == "From a microscope field to a trustworthy report"
                assert page.locator("#bps-example-progress").get_attribute("max") == "19"
                assert "destination" in page.locator("#bps-example-step-title").inner_text().lower()
                preview = page.locator("#bps-example-image-preview")
                assert preview.is_visible(), "The future-capability image must be visible in scene one"
                page.wait_for_function(
                    "() => document.getElementById('bps-example-image').naturalWidth > 0",
                    timeout=10000
                )
                assert "Human Protein Atlas" in preview.inner_text()
                assert page.locator("#bps-example-caption").inner_text()
                assert page.locator("#bps-example-voice").count() == 1
                assert page.locator("#bps-example-rate").count() == 1
                for _ in range(6):
                    page.locator("#bps-example-next").click()
                assert "Reveal:" in page.locator("#bps-example-step-title").inner_text()
                assert page.locator("#bps-example-parameter-box").is_visible()
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

                change_selection(page,"p01-goal-select","4")
                assert trigger.is_visible()
                trigger.click()
                assert page.locator("#bps-example-title").inner_text() == "From a microscope field to a trustworthy report"
                page.locator("#bps-example-close").click()
                change_selection(page,"p01-goal-select","7")
                assert "Chapter example" in trigger.inner_text()
                trigger.click()
                assert page.locator("#bps-example-title").inner_text() == "From a microscope field to a trustworthy report"
                page.locator("#bps-example-close").click()
                change_selection(page,"p01-goal-select","8")
                assert trigger.is_hidden(), "Delayed review must not reveal a worked example"
                change_selection(page,"p01-goal-select","0")
                page.locator("#tab-apply").click()
                assert trigger.is_hidden(), "Apply must remain independent"
                page.locator("#tab-prove").click()
                assert trigger.is_hidden(), "Prove must remain independent"
                change_selection(page,"bps-chapter-select","P02")
                page.wait_for_function(
                    "() => document.getElementById('bps-example-trigger').hidden === false",
                    timeout=20000
                )
                assert trigger.is_visible(), "The foundation viewer must now support P02"
                assert not errors, f"Browser errors at {width}px: {errors}"
                page.close()
            # Mock only the browser's speech API to verify that a prediction
            # interrupts autoplay until the learner explicitly presses Reveal.
            checkpoint_page = browser.new_page(viewport={"width": 1280, "height": 850})
            checkpoint_page.add_init_script("""
              (() => {
                let active = null;
                class Narration {
                  constructor(text) { this.text=text; this.rate=1; this.voice=null; }
                }
                const synth = {
                  getVoices(){ return [{name:"David Test",voiceURI:"david-test",lang:"en-US"}]; },
                  addEventListener(){},
                  cancel(){ active=null; },
                  pause(){},
                  resume(){},
                  speak(utterance){
                    active=utterance;
                    setTimeout(()=>{
                      if(active!==utterance)return;
                      utterance.onstart?.();
                      setTimeout(()=>{
                        if(active!==utterance)return;
                        active=null;utterance.onend?.();
                      },12);
                    },12);
                  }
                };
                Object.defineProperty(window,"SpeechSynthesisUtterance",
                  {value:Narration,configurable:true});
                Object.defineProperty(window,"speechSynthesis",
                  {value:synth,configurable:true});
              })();
            """)
            checkpoint_page.goto(url, wait_until="domcontentloaded")
            checkpoint_page.locator("#bps-example-trigger").click()
            checkpoint_page.locator("#bps-example-play").click()
            checkpoint_page.wait_for_function(
                "() => document.getElementById('bps-example-play').textContent.includes('Reveal')",
                timeout=20000
            )
            assert checkpoint_page.locator("#bps-example-position").inner_text() == "6 / 19"
            checkpoint_page.wait_for_timeout(600)
            assert checkpoint_page.locator("#bps-example-position").inner_text() == "6 / 19", \
                "A prediction break must not autoplay to reveal the answer"
            checkpoint_page.locator("#bps-example-play").click()
            checkpoint_page.wait_for_function(
                "() => Number(document.getElementById('bps-example-progress').value) >= 7",
                timeout=5000
            )
            checkpoint_page.close()
            browser.close()
    finally:
        process.terminate()
        process.wait(timeout=10)

if __name__ == "__main__":
    check()
    print("P01 tutorial viewer: mobile/desktop integration checks passed.")
