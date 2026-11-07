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
            # Comments are a prompt, not a learner attempt.
            page.locator("#p01-check").click()
            assert "Write your Python solution below the task comments" in page.locator("#output-placeholder").inner_text()
            page.locator("#run-button").click()
            assert "Write Python below the task comments" in page.locator("#output-placeholder").inner_text()
            state = page.evaluate("JSON.parse(localStorage.getItem('biopython.p01.v1'))")
            assert "P01-G01:apply" not in state.get("progress", {})
            page.evaluate("""() => document.querySelector('.CodeMirror').CodeMirror.setValue(
              'report = f"{specimen}: {fields} fields"\\nprint(report)')""")
            page.locator("#p01-check").click()
            page.wait_for_function("document.querySelector('#output-body').innerText.includes('Passed 2 changed-input checks')",
                                   timeout=30000)
            assert "Why it worked:" in page.locator("#output-placeholder").inner_text()
            assert "Think next:" in page.locator("#output-placeholder").inner_text()
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

            # New chapter: the full concept, prediction feedback and authentic source figure
            page.locator("#p01-goal-select").select_option("0")
            page.locator("#tab-learn").click()
            assert "A program consists of statements" in page.locator("#p01-detail-root").inner_text()
            page.locator(".p01-answer-toggle").click()
            assert "Exactly one line" in page.locator(".p01-answer").inner_text()
            page.get_by_text("See a genuine microscopy example").click()
            page.wait_for_function("document.querySelector('.p01-real-figure img').naturalWidth > 0")
            assert "Witz" in page.locator(".p01-real-figure figcaption").inner_text()

            # Full capstone must execute as genuine Python, not a static expected output.
            page.locator("#p01-goal-select").select_option("7")
            page.locator("#tab-apply").click()
            assert page.locator("#lesson-summary").inner_text().startswith("P01")
            assert "Available example inputs" in page.locator("#p01-detail-root").inner_text()
            page.evaluate("""code => document.querySelector('.CodeMirror').CodeMirror.setValue(code)""",
                "width_um = width_pixels / pixels_per_um\n"
                "type_name = type(width_um).__name__\n"
                "summary = f'{specimen_id} | {field_count} fields | {width_um} um | channel {channel_name}'\n"
                "print(summary)")
            page.locator("#p01-check").click()
            page.wait_for_function("document.querySelector('#output-body').innerText.includes('Passed 3 changed-input checks')",
                                   timeout=30000)
            capstone_state = page.evaluate("JSON.parse(localStorage.getItem('biopython.p01.v1'))")
            assert capstone_state["capstoneFirstPassAt"] > 0, "Capstone completion timestamp not recorded"

            page.locator("#tab-prove").click()
            page.evaluate("""code => document.querySelector('.CodeMirror').CodeMirror.setValue(code)""",
                "length_um = roi_length_px / calibration_px_per_um\n"
                "numeric_type = type(length_um).__name__\n"
                "result_line = f'{sample_code}: {length_um} um ({observed_fields} fields; {channel})'\n"
                "print(result_line)")
            page.locator("#p01-check").click()
            page.wait_for_function("document.querySelector('#output-body').innerText.includes('Passed 3 changed-input checks')",
                                   timeout=30000)
            reflection = "The conversion divides by pixels per micrometre to return um. A missing calibration makes physical interpretation invalid. Imaging fields are not independent biological replicates. I repaired a NameError by checking the variable spelling."
            page.locator("#p01-reflection").fill(reflection)
            assert reflection in page.evaluate("JSON.parse(localStorage.getItem('biopython.p01.v1')).reflections['P01-CAPSTONE']")

            # Export must include input assignments, so this script runs outside the browser.
            with page.expect_download() as download_event:
                page.locator("#p01-export").click()
            download=download_event.value
            assert download.suggested_filename == "specimen_report.py"
            exported=Path(download.path()).read_text(encoding="utf8")
            assert "sample_code = " in exported
            assert "length_um = roi_length_px / calibration_px_per_um" in exported
            assert "Synthetic microscopy records" in exported
            exported_run = subprocess.run([sys.executable, str(download.path())],
                                          capture_output=True, text=True, timeout=10)
            assert exported_run.returncode == 0, exported_run.stderr
            assert "mutX_R04: 17.5 um" in exported_run.stdout, exported_run.stdout

            # Resume the capstone with the same phase, code and reflection.
            page.reload(wait_until="domcontentloaded")
            page.locator("#p01-goal-select").wait_for(timeout=20000)
            assert page.locator("#p01-goal-select").input_value()=="7"
            assert "length_um = roi_length_px" in page.evaluate(
                "() => document.querySelector('.CodeMirror').CodeMirror.getValue()")
            assert reflection in page.locator("#p01-reflection").input_value()

            # Review is a distinct task; simulate elapsed time to verify classification
            # without pretending that this automated check proves retained learning.
            # Init scripts modify the stored fixture *after* beforeunload saves and
            # *before* adapter initialization, correctly simulating a later visit.
            page.add_init_script("""{
              const x=JSON.parse(localStorage.getItem('biopython.p01.v1')||'null');
              if(x){x.capstoneFirstPassAt=Date.now()-25*3600*1000;
                localStorage.setItem('biopython.p01.v1',JSON.stringify(x));}
            }""")
            page.reload(wait_until="domcontentloaded")
            page.locator("#p01-goal-select").wait_for(timeout=20000)
            page.locator("#p01-goal-select").select_option("8")
            page.locator("#tab-prove").click()
            assert page.locator("#tab-prove").get_attribute("aria-selected") == "true"
            assert "delayed practice" in page.locator("#p01-detail-root").inner_text().lower()
            page.evaluate("""code => document.querySelector('.CodeMirror').CodeMirror.setValue(code)""",
                "physical_span_um = span_px / px_per_um\n"
                "report_type = type(physical_span_um).__name__\n"
                "report_line = f'{record_id} / {field_total} fields / {physical_span_um} um / {stain}'\n"
                "print(report_line)")
            page.locator("#p01-check").click()
            page.wait_for_function("document.querySelector('#output-body').innerText.includes('Passed 3 changed-input checks')",
                                   timeout=30000)
            state_after = page.evaluate("JSON.parse(localStorage.getItem('biopython.p01.v1'))")
            assert state_after["progress"]["P01-REVIEW:prove"]["status"] == "delayed_practice_passed"
            assert not any(v.get("status") == "retained" for v in state_after["progress"].values())

            assert not errors, "Browser exceptions: %r" % errors

            # Verify new textbook content and scientific reflection fit mobile layouts.
            shots=ROOT / "artifacts" / "p01"
            shots.mkdir(parents=True,exist_ok=True)
            for width,height in [(360,780),(390,844),(768,920),(1440,900)]:
                mobile=browser.new_page(viewport={"width":width,"height":height})
                page_errors=[]
                mobile.on("pageerror",lambda e: page_errors.append(str(e)))
                mobile.goto(URL,wait_until="domcontentloaded")
                mobile.locator("#p01-goal-select").wait_for(state="attached",timeout=20000)
                assert mobile.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), ("Horizontal P01 overflow",width)
                if width <= 720:
                    mobile.locator("#nav-toggle").click()
                    assert mobile.locator("#p01-goal-select").is_visible()
                mobile.locator("#p01-goal-select").select_option("7")
                if width <= 720:
                    mobile.locator("#nav-toggle").click()
                mobile.locator("#tab-prove").click()
                mobile.locator("#p01-reflection").fill("Units, calibration and biological independence require interpretation.")
                assert mobile.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), ("Capstone overflow",width)
                editor_box=mobile.locator("#code-wrapper").bounding_box()
                assert editor_box and editor_box["y"] < height, ("Code editor pushed below first screen",width,editor_box)
                assert mobile.locator("#p01-export").count()==1
                assert not page_errors, ("Responsive P01 JavaScript errors",width,page_errors)
                if width in (390,1440):
                    mobile.screenshot(path=str(shots / ("p01-"+str(width)+".png")),full_page=True)
                mobile.close()
            browser.close()
        print("PASS: real Pyodide stdout/traceback, changed-input check, draft preservation, reload")
    finally:
        server.terminate()
        try:server.wait(timeout=5)
        except subprocess.TimeoutExpired:server.kill()

if __name__ == "__main__":
    main()
