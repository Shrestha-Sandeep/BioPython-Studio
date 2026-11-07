"""P02 browser end-to-end: real Pyodide, 4 skills, 2 full capstone paths, chapter switching."""
import subprocess
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
PORT=8977
BASE="http://127.0.0.1:%d/"%PORT
CAP_APPLY="""parts = sample_id.split('_')
if len(parts) != 3:
    decision, reason = 'REJECT', 'expected three fields'
else:
    strain, plate, condition = parts
    if not (strain.isascii() and strain.isalnum()):
        decision, reason = 'REJECT', 'invalid strain'
    elif not (len(plate) == 3 and plate.startswith('P') and plate.removeprefix('P').isascii() and plate.removeprefix('P').isdigit()):
        decision, reason = 'REJECT', 'invalid plate'
    elif condition not in ('control', 'heat', 'recovery'):
        decision, reason = 'REJECT', 'unknown condition'
    elif not 0 <= focus_score <= 1:
        decision, reason = 'REJECT', 'focus outside range'
    elif focus_score < minimum_focus:
        decision, reason = 'REJECT', 'focus below minimum'
    else:
        decision, reason = 'ACCEPT', 'accepted'
report = f'{sample_id} | {decision} | {reason}'
print(report)
"""
CAP_PROVE="""parts = record_id.split('|')
if len(parts) != 3:
    verdict, explanation = 'REJECT', 'expected three fields'
else:
    specimen, location, treatment = parts
    if not (specimen.isascii() and specimen.isalnum()):
        verdict, explanation = 'REJECT', 'invalid specimen'
    elif not (len(location) == 3 and location.startswith('F') and location.removeprefix('F').isascii() and location.removeprefix('F').isdigit()):
        verdict, explanation = 'REJECT', 'invalid acquisition'
    elif treatment not in ('control', 'heat', 'recovery'):
        verdict, explanation = 'REJECT', 'unknown treatment'
    elif not 0 <= quality_score <= 1:
        verdict, explanation = 'REJECT', 'quality outside range'
    elif quality_score < threshold:
        verdict, explanation = 'REJECT', 'quality below minimum'
    else:
        verdict, explanation = 'ACCEPT', 'accepted'
result_line = f'{record_id} -> {verdict} ({explanation})'
print(result_line)
"""
REVIEW="""parts = acquisition_id.split('~')
if len(parts) != 3:
    decision, reason = 'REJECT', 'invalid shape'
else:
    strain, site, condition = parts
    if not (strain.isascii() and strain.isalnum()):
        decision, reason = 'REJECT', 'invalid strain'
    elif not (len(site) == 3 and site.startswith('S') and site.removeprefix('S').isascii() and site.removeprefix('S').isdigit()):
        decision, reason = 'REJECT', 'invalid site'
    elif condition not in ('control', 'heat', 'recovery'):
        decision, reason = 'REJECT', 'unknown condition'
    elif not 0 <= focus_metric <= 1:
        decision, reason = 'REJECT', 'metric outside range'
    elif focus_metric < focus_minimum:
        decision, reason = 'REJECT', 'metric below minimum'
    else:
        decision, reason = 'ACCEPT', 'accepted'
audit = f'{acquisition_id} | {decision} | {reason}'
print(audit)
"""
def set_code(page,code):
    page.evaluate("""value => document.querySelector('.CodeMirror').CodeMirror.setValue(value)""",code)
def wait_pass(page,n):
    page.wait_for_function("""n => document.querySelector('#output-body').innerText.includes('Passed '+n+' changed-input checks')""",arg=n,timeout=60000)

def main():
    server=subprocess.Popen([sys.executable,"-m","http.server",str(PORT),"--bind","127.0.0.1"],cwd=ROOT,
                            stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    try:
        time.sleep(1.5)
        with sync_playwright() as p:
            browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
            page=browser.new_page(viewport={"width":1440,"height":900},accept_downloads=True)
            errors=[]
            page.on("pageerror",lambda x:errors.append(str(x)))
            page.goto(BASE,wait_until="domcontentloaded")
            page.locator("#bps-chapter-select").wait_for(timeout=20000)
            assert page.locator("#bps-chapter-select").input_value()=="P01"
            assert page.locator("#p01-goal-select option").count()==9
            p01_snap=page.evaluate("JSON.parse(localStorage.getItem('biopython.p01.v1'))")
            assert p01_snap["goal"]==0
            set_code(page,"# P01 draft should survive P02 work\nspecimen = 'N2_P03'\nprint(specimen)")
            page.locator("#bps-chapter-select").select_option("P02")
            assert page.locator("#p01-goal-select option").count()==6
            assert page.locator("#lesson-summary").inner_text().startswith("P02")
            assert "Make labels from data rather than retyping them" in page.locator("#phase-panel").inner_text()
            assert page.locator("#bps-chapter-link").get_attribute("href")=="./content/chapters/P02_COMPLETE.md"
            page.get_by_text("See a genuine microscopy example").click()
            page.wait_for_function("document.querySelector('.p01-real-figure img').naturalWidth>0",timeout=20000)
            assert "cell 3" in page.locator(".p01-real-figure figcaption").inner_text()
            page.locator("#run-button").click()
            page.wait_for_function("document.querySelector('#output-body').innerText.includes('N2_P03_heat')",timeout=100000)
            assert "Python 3" in page.locator(".runtime-state").inner_text()
            # G02 parsing: valid and malformed strings produce different Boolean flags
            page.locator("#p01-goal-select").select_option("1")
            page.locator("#tab-apply").click()
            page.locator("#p01-check").click()
            assert "Write your Python solution below the task comments" in page.locator("#output-placeholder").inner_text()
            assert "P02-G02:apply" not in page.evaluate("JSON.parse(localStorage.getItem('biopython.p02.v1')).progress")
            set_code(page,"tokens = raw_id.split('_')\ntoken_count = len(tokens)\nstructure_ok = token_count == 3 and tokens[0] != '' and tokens[1] != '' and tokens[2] != ''")
            page.locator("#p01-check").click()
            wait_pass(page,4)
            set_code(page,"tokens = 'N2_P03_heat'.split('_')\ntoken_count = len(tokens)\nstructure_ok = True")
            page.locator("#p01-check").click()
            page.wait_for_function("document.querySelector('#output-body').innerText.includes('Practice condition failed')",timeout=30000)
            # G03 inclusive/exclusive threshold and range
            page.locator("#p01-goal-select").select_option("2")
            page.locator("#tab-apply").click()
            set_code(page,"in_range = 0 <= focus_score <= 1\npasses_threshold = in_range and focus_score >= minimum_focus\non_boundary = focus_score == minimum_focus")
            page.locator("#p01-check").click()
            wait_pass(page,4)
            # G04 explanatory rule, including structural rejection before numerical
            page.locator("#p01-goal-select").select_option("3")
            page.locator("#tab-apply").click()
            set_code(page,"parts = sample_id.split('_')\nif len(parts) != 3:\n    decision, reason = 'REJECT', 'wrong number of fields'\nelif parts[0] == '' or parts[1] == '' or parts[2] == '':\n    decision, reason = 'REJECT', 'empty field'\nelif focus_score < minimum_focus:\n    decision, reason = 'REJECT', 'focus below minimum'\nelse:\n    decision, reason = 'ACCEPT', 'shape and focus pass'")
            page.locator("#p01-check").click()
            wait_pass(page,4)
            # Both capstone activities execute ALL changed input cases in real Pyodide.
            page.locator("#p01-goal-select").select_option("4")
            page.locator("#tab-apply").click()
            page.get_by_text("Build in short passes").click()
            assert "PASS 6" in page.locator("#p01-detail-root").inner_text()
            set_code(page,CAP_APPLY)
            page.locator("#p01-check").click()
            wait_pass(page,11)
            saved=page.evaluate("JSON.parse(localStorage.getItem('biopython.p02.v1'))")
            assert saved["capstoneFirstPassAt"]>0
            page.locator("#tab-prove").click()
            set_code(page,CAP_PROVE)
            page.locator("#p01-check").click()
            wait_pass(page,10)
            explanation="The sample ID is preserved and validated before focus. An inclusive 0.8 cutoff admits 0.8. Thresholds must be set before comparing groups. Imaging fields are not independent biological replicates."
            page.locator("#p01-reflection").fill(explanation)
            with page.expect_download() as d:
                page.locator("#p01-export").click()
            download=d.value
            assert download.suggested_filename=="sample_label_validator.py"
            local=Path(download.path())
            code=local.read_text(encoding="utf8")
            assert "record_id = " in code and "N2|F03|heat" in code
            run=subprocess.run([sys.executable,str(local)],capture_output=True,text=True,timeout=10)
            assert run.returncode==0,run.stderr
            assert "N2|F03|heat -> ACCEPT (accepted)" in run.stdout
            # The P01 local storage remains unchanged across P02 activities.
            page.locator("#bps-chapter-select").select_option("P01")
            assert page.locator("#p01-goal-select option").count()==9
            assert "P01 draft should survive P02 work" in page.evaluate("document.querySelector('.CodeMirror').CodeMirror.getValue()")
            page.locator("#bps-chapter-select").select_option("P02")
            assert page.locator("#p01-goal-select").input_value()=="4"
            assert page.locator("#tab-prove").get_attribute("aria-selected")=="true"
            assert explanation in page.locator("#p01-reflection").input_value()
            page.reload(wait_until="domcontentloaded")
            page.locator("#bps-chapter-select").wait_for(timeout=20000)
            assert page.locator("#bps-chapter-select").input_value()=="P02"
            assert explanation in page.locator("#p01-reflection").input_value()
            # Simulated later-visit clock change on startup; evidence is delayed practice only.
            page.add_init_script("""{
              const q=JSON.parse(localStorage.getItem('biopython.p02.v1')||'null');
              if(q){q.capstoneFirstPassAt=Date.now()-25*3600*1000;
                localStorage.setItem('biopython.p02.v1',JSON.stringify(q));}
            }""")
            page.reload(wait_until="domcontentloaded")
            page.locator("#bps-chapter-select").wait_for(timeout=20000)
            page.locator("#p01-goal-select").select_option("5")
            page.locator("#tab-prove").click()
            assert "delayed practice" in page.locator("#p01-detail-root").inner_text().lower()
            set_code(page,REVIEW)
            page.locator("#p01-check").click()
            wait_pass(page,4)
            progress=page.evaluate("JSON.parse(localStorage.getItem('biopython.p02.v1')).progress")
            assert progress["P02-REVIEW:prove"]["status"]=="delayed_practice_passed"
            assert all(row.get("status")!="retained" for row in progress.values())
            assert not errors,errors
            shots=ROOT/"artifacts"/"p02";shots.mkdir(parents=True,exist_ok=True)
            for width,height in [(390,844),(768,920),(1440,900)]:
                mobile=browser.new_page(viewport={"width":width,"height":height})
                errs=[];mobile.on("pageerror",lambda e:errs.append(str(e)))
                mobile.goto(BASE,wait_until="domcontentloaded")
                mobile.locator("#bps-chapter-select").wait_for(state="attached",timeout=20000)
                if width<=720:mobile.locator("#nav-toggle").click()
                mobile.locator("#bps-chapter-select").select_option("P02")
                mobile.locator("#p01-goal-select").select_option("4")
                if width<=720:mobile.locator("#nav-toggle").click()
                mobile.locator("#tab-prove").click()
                assert mobile.evaluate("document.documentElement.scrollWidth <= innerWidth+1"),("overflow",width)
                editor=mobile.locator("#code-wrapper").bounding_box()
                assert editor and editor["y"]<height,("editor below screen",width,editor)
                assert not errs,errs
                if width in (390,1440):
                    mobile.screenshot(path=str(shots/f"p02-{width}.png"),full_page=True)
                mobile.close()
            browser.close()
        print("PASS: P01 retained; P02 real Python (G01..04, capstone 11+10, review), .py export, mobile/desktop")
    finally:
        server.terminate()
        try:server.wait(timeout=5)
        except subprocess.TimeoutExpired:server.kill()

if __name__=="__main__":main()
