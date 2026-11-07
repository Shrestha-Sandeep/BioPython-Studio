"""P03 end-to-end browser QA: all 85 transparent reference cases in real Pyodide.

Original frozen-shell and P01/P02 end-to-end tests run separately in the CI
workflow. P03 answer scripts below are public QA fixtures, never hidden grading.
"""
import subprocess
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PORT = 8978
URL = f"http://127.0.0.1:{PORT}/"

SOLUTIONS = {
    "P03-G01": {
        "apply": "first_id = field_ids[0] if field_ids else None\nlast_id = field_ids[-1] if field_ids else None\nfirst_two = field_ids[:2]",
        "prove": "last_two = roi_ids[-2:]\ninterior = roi_ids[1:-1]\nempty = len(roi_ids) == 0",
        "cases": [4, 4]
    },
    "P03-G02": {
        "apply": "audit_ids = source_ids.copy()\naudit_ids.append(new_id)",
        "prove": "reviewed_candidates = raw_candidates.copy()\nremoval_done = False\nif excluded_id in reviewed_candidates:\n    reviewed_candidates.remove(excluded_id)\n    removal_done = True",
        "cases": [3, 4]
    },
    "P03-G03": {
        "apply": "field_id, score = observed_pair\nfrozen_pair = (field_id, score)\npair_type = type(frozen_pair).__name__",
        "prove": "begin_px, end_px = endpoints\nimmutable_interval = (begin_px, end_px)\nspan_px = end_px - begin_px",
        "cases": [3, 3]
    },
    "P03-G04": {
        "apply": "accepted_count = 0\nrejected_count = 0\nmissing_count = 0\nfor score in scores:\n    if score is None:\n        missing_count += 1\n    elif score >= minimum:\n        accepted_count += 1\n    else:\n        rejected_count += 1",
        "prove": "kept_values = []\nlow_count = 0\nunknown_count = 0\nfor score in measurements:\n    if score is None:\n        unknown_count += 1\n    elif score >= limit:\n        kept_values.append(score)\n    else:\n        low_count += 1",
        "cases": [5, 4]
    },
    "P03-G05": {
        "apply": "numbered_labels = []\nfor number, field_id in enumerate(field_ids, start=1):\n    numbered_labels.append(f'Field {number}: {field_id}')\nzero_indexes = list(range(len(field_ids)))",
        "prove": "missing_ordinals = []\npassing_ordinals = []\nfor ordinal, score in enumerate(frame_scores, start=1):\n    if score is None:\n        missing_ordinals.append(ordinal)\n    elif score >= threshold:\n        passing_ordinals.append(ordinal)",
        "cases": [4, 4]
    },
    "P03-G06": {
        "apply": "i = 0\nvisited = []\nwhile i < len(record_ids) and i < max_checks:\n    visited.append(record_ids[i])\n    i += 1\nnext_index = i",
        "prove": "i = 0\ninspected = []\nwhile i < len(measurements) and i < max_steps:\n    inspected.append(measurements[i])\n    i += 1\nattempted = i",
        "cases": [5, 4]
    },
    "P03-G07": {
        "apply": "accepted_values = []\nlow_values = []\nmissing_count = 0\ninvalid_count = 0\nstopped = False\nfor score in readings:\n    if score == 'STOP':\n        stopped = True\n        break\n    if score is None:\n        missing_count += 1\n        continue\n    if not 0 <= score <= 1:\n        invalid_count += 1\n        continue\n    if score >= minimum:\n        accepted_values.append(score)\n    else:\n        low_values.append(score)",
        "prove": "passed_ids = []\nlow_ids = []\nmissing_ids = []\ninvalid_ids = []\nstopped = False\nfor field_id, score in field_records:\n    if field_id == 'END':\n        stopped = True\n        break\n    if score is None:\n        missing_ids.append(field_id)\n        continue\n    if not 0 <= score <= 1:\n        invalid_ids.append(field_id)\n        continue\n    if score >= limit:\n        passed_ids.append(field_id)\n    else:\n        low_ids.append(field_id)",
        "cases": [5, 4]
    }
}
CAP_APPLY = """accepted_ids = []
rejected_ids = []
missing_ids = []
invalid_ids = []
seen_ids = []
stopped_early = False
for field_id, score in records[:max_rows]:
    if field_id == 'STOP':
        stopped_early = True
        break
    if field_id in seen_ids:
        invalid_ids.append(field_id)
        continue
    seen_ids.append(field_id)
    if score is None:
        missing_ids.append(field_id)
    elif not 0 <= score <= 1:
        invalid_ids.append(field_id)
    elif score >= minimum_focus:
        accepted_ids.append(field_id)
    else:
        rejected_ids.append(field_id)
summary = f'accepted={len(accepted_ids)}; rejected={len(rejected_ids)}; missing={len(missing_ids)}; invalid={len(invalid_ids)}'
print(summary)"""
CAP_PROVE = """kept_tags = []
low_tags = []
absent_tags = []
bad_tags = []
seen = []
stopped = False
for score, field_tag in observations[:max_rows]:
    if field_tag == 'END':
        stopped = True
        break
    if field_tag in seen:
        bad_tags.append(field_tag)
        continue
    seen.append(field_tag)
    if score is None:
        absent_tags.append(field_tag)
    elif not 0 <= score <= 1:
        bad_tags.append(field_tag)
    elif score >= cutoff:
        kept_tags.append(field_tag)
    else:
        low_tags.append(field_tag)
report_line = f'kept={len(kept_tags)} | low={len(low_tags)} | absent={len(absent_tags)} | bad={len(bad_tags)}'
print(report_line)"""
REVIEW = """passed = []
below = []
unmeasured = []
corrupt = []
seen = []
ended = False
for tag, score in field_data[:max_visits]:
    if tag == 'DONE':
        ended = True
        break
    if tag in seen:
        corrupt.append(tag)
        continue
    seen.append(tag)
    if score is None:
        unmeasured.append(tag)
    elif not 0 <= score <= 1:
        corrupt.append(tag)
    elif score >= minimum:
        passed.append(tag)
    else:
        below.append(tag)
line = f'passed={len(passed)}; below={len(below)}; unmeasured={len(unmeasured)}; corrupt={len(corrupt)}'
print(line)"""

def set_code(page, code):
    page.evaluate("text => document.querySelector('.CodeMirror').CodeMirror.setValue(text)", code)

def run_checks(page, goal_id, phase, script, count):
    page.locator("#tab-" + phase).click()
    set_code(page, script)
    page.locator("#p01-check").click()
    page.wait_for_function(
        """([id, phase, count]) => {
          const data = JSON.parse(localStorage.getItem('biopython.p03.v1') || '{}');
          const progress = data.progress && data.progress[id + ':' + phase];
          const output = document.querySelector('#output-body')?.innerText || '';
          return progress && ['practice_passed','guided','review_practice_passed','delayed_practice_passed'].includes(progress.status)
            && output.includes('Passed ' + count + ' changed-input checks');
        }""",
        arg=[goal_id, phase, count], timeout=90000
    )

def main():
    server = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"],
        cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    try:
        time.sleep(1.5)
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True, args=["--no-sandbox"])
            page = browser.new_page(viewport={"width": 1440, "height": 900}, accept_downloads=True)
            errors = []
            page.on("pageerror", lambda exc: errors.append(str(exc)))
            page.goto(URL, wait_until="domcontentloaded")
            page.locator("#bps-chapter-select").wait_for(timeout=20000)
            assert page.locator("#bps-chapter-select").locator("option").count() == 3
            assert page.locator("#bps-chapter-select").input_value() == "P01"

            # Preserve historical work from both earlier chapter keys.
            set_code(page, "# P01 draft retained across P03\nprint('sample01')")
            page.locator("#bps-chapter-select").select_option("P02")
            set_code(page, "# P02 draft retained across P03\nprint('sample02')")
            page.locator("#bps-chapter-select").select_option("P03")
            assert page.locator("#p01-goal-select").locator("option").count() == 9
            assert page.locator("#lesson-summary").inner_text().startswith("P03")
            assert page.locator("#bps-chapter-link").get_attribute("href") == "./content/chapters/P03_COMPLETE.md"
            assert "A Python list preserves" in page.locator("#phase-panel").inner_text()
            page.get_by_text("See a genuine microscopy example").click()
            page.wait_for_function("document.querySelector('.p01-real-figure img').naturalWidth > 0")
            assert "not raw intensity" in page.locator(".p01-real-figure figcaption").inner_text()

            # First real Python run confirms actual stdout and versioned kernel.
            page.locator("#run-button").click()
            page.wait_for_function("document.querySelector('#output-placeholder').innerText.includes('F09')", timeout=100000)
            assert "Python 3" in page.locator(".runtime-state").inner_text()

            cases_checked = 0
            for index, (goal_id, sample) in enumerate(SOLUTIONS.items()):
                page.locator("#p01-goal-select").select_option(str(index))
                run_checks(page, goal_id, "apply", sample["apply"], sample["cases"][0])
                run_checks(page, goal_id, "prove", sample["prove"], sample["cases"][1])
                cases_checked += sum(sample["cases"])

            # A copied literal that succeeds for the first sample must fail after an input change.
            page.locator("#p01-goal-select").select_option("0")
            page.locator("#tab-apply").click()
            set_code(page, "first_id='F09'\nlast_id='F11'\nfirst_two=['F09','F02']")
            page.locator("#p01-check").click()
            page.wait_for_function("document.querySelector('#output-placeholder').innerText.includes('Practice condition failed')", timeout=30000)

            page.locator("#p01-goal-select").select_option("7")
            run_checks(page, "P03-CAPSTONE", "apply", CAP_APPLY, 12)
            state = page.evaluate("JSON.parse(localStorage.getItem('biopython.p03.v1'))")
            assert state["capstoneFirstPassAt"] > 0
            run_checks(page, "P03-CAPSTONE", "prove", CAP_PROVE, 11)
            cases_checked += 23
            explanation = ("None is not the observed numeric zero. A repeated ID must be invalid, "
                           "not a new biological replicate. STOP and max_rows leave later fields unvisited. "
                           "Scores and thresholds are synthetic and the raw records must remain unchanged.")
            page.locator("#p01-reflection").fill(explanation)
            assert explanation in page.evaluate(
                "JSON.parse(localStorage.getItem('biopython.p03.v1')).reflections['P03-CAPSTONE']")
            with page.expect_download() as d:
                page.locator("#p01-export").click()
            item = d.value
            assert item.suggested_filename == "field_qc_report.py"
            exported = Path(item.path()).read_text(encoding="utf8")
            assert "observations = " in exported
            assert "for score, field_tag in observations[:max_rows]" in exported
            run = subprocess.run([sys.executable, str(item.path())],
                                 capture_output=True, text=True, timeout=10)
            assert run.returncode == 0, run.stderr
            assert "kept=1 | low=1 | absent=1 | bad=0" in run.stdout

            # Switching chapters and browser reload must not overwrite older drafts or reflection.
            page.locator("#bps-chapter-select").select_option("P01")
            assert "P01 draft retained" in page.evaluate(
                "document.querySelector('.CodeMirror').CodeMirror.getValue()")
            page.locator("#bps-chapter-select").select_option("P02")
            assert "P02 draft retained" in page.evaluate(
                "document.querySelector('.CodeMirror').CodeMirror.getValue()")
            page.locator("#bps-chapter-select").select_option("P03")
            assert explanation in page.locator("#p01-reflection").input_value()
            page.reload(wait_until="domcontentloaded")
            page.locator("#bps-chapter-select").wait_for(timeout=20000)
            assert page.locator("#bps-chapter-select").input_value() == "P03"
            assert page.locator("#p01-goal-select").input_value() == "7"
            assert page.locator("#tab-prove").get_attribute("aria-selected") == "true"
            assert explanation in page.locator("#p01-reflection").input_value()

            # Return test time is simulated before page startup, so beforeunload cannot override it.
            page.add_init_script("""{
              const state=JSON.parse(localStorage.getItem('biopython.p03.v1') || 'null');
              if(state){
                state.capstoneFirstPassAt=Date.now()-25*3600*1000;
                localStorage.setItem('biopython.p03.v1',JSON.stringify(state));
              }
            }""")
            page.reload(wait_until="domcontentloaded")
            page.locator("#bps-chapter-select").wait_for(timeout=20000)
            page.locator("#p01-goal-select").select_option("8")
            page.locator("#tab-prove").click()
            assert "delayed practice" in page.locator("#p01-detail-root").inner_text().lower()
            set_code(page, REVIEW)
            page.locator("#p01-check").click()
            page.wait_for_function(
                """() => {
                  const d=JSON.parse(localStorage.getItem('biopython.p03.v1')||'null');
                  return d?.progress?.['P03-REVIEW:prove']?.status === 'delayed_practice_passed'
                    && document.querySelector('#output-body').innerText.includes('Passed 6 changed-input checks');
                }""", timeout=30000
            )
            cases_checked += 6
            assert cases_checked == 85, cases_checked
            progress = page.evaluate("JSON.parse(localStorage.getItem('biopython.p03.v1')).progress")
            assert all(x.get("status") != "retained" for x in progress.values())
            assert not errors, errors

            # Check responsive layouts and ensure the full reading pane does not bury the editor.
            screenshot_dir = ROOT / "artifacts" / "p03"
            screenshot_dir.mkdir(parents=True, exist_ok=True)
            for width,height in [(390,844),(768,920),(1440,900)]:
                mobile = browser.new_page(viewport={"width": width, "height": height})
                mobile_errors = []
                mobile.on("pageerror", lambda error: mobile_errors.append(str(error)))
                mobile.goto(URL, wait_until="domcontentloaded")
                mobile.locator("#bps-chapter-select").wait_for(state="attached", timeout=20000)
                if width <= 720:
                    mobile.locator("#nav-toggle").click()
                mobile.locator("#bps-chapter-select").select_option("P03")
                mobile.locator("#p01-goal-select").select_option("7")
                if width <= 720:
                    mobile.locator("#nav-toggle").click()
                mobile.locator("#tab-prove").click()
                assert mobile.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), ("overflow", width)
                rect = mobile.locator("#code-wrapper").bounding_box()
                assert rect and rect["y"] < height, ("editor below initial viewport", width, rect)
                assert not mobile_errors, (width, mobile_errors)
                if width in (390,1440):
                    mobile.screenshot(path=str(screenshot_dir / f"p03-{width}.png"), full_page=True)
                mobile.close()
            browser.close()
        print("PASS: 85 real Pyodide practice cases, all 3 chapters, script export CPython, delayed review and responsive layout")
    finally:
        server.terminate()
        try: server.wait(timeout=5)
        except subprocess.TimeoutExpired: server.kill()

if __name__ == "__main__":
    main()
