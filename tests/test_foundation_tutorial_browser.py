"""P02–P06 chapter-level tutorials: real browser wiring, source images and isolation."""
from playwright.sync_api import sync_playwright
from test_p01_tutorial_browser import serve, change_selection

CHAPTERS = {
    "P02": (4, "Preventing specimen mix-ups before analysis"),
    "P03": (7, "Audit a whole microscopy acquisition, field by field"),
    "P04": (6, "Build a microscopy metadata registry you can trust"),
    "P05": (6, "Turn one measurement into a reusable analysis tool"),
    "P06": (6, "Save, test and reproduce a specimen analysis")
}

def check():
    process, url = serve()
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True)
            for width,height in [(390,844),(1280,850)]:
                page=browser.new_page(viewport={"width":width,"height":height})
                errors=[]
                page.on("pageerror",lambda e:errors.append(str(e)))
                page.goto(url,wait_until="domcontentloaded",timeout=60000)
                page.locator("#p01-goal-select").wait_for(state="attached",timeout=30000)
                for chapter,(goal_count,title) in CHAPTERS.items():
                    change_selection(page,"bps-chapter-select",chapter)
                    page.wait_for_function(
                        """(chapter) => document.getElementById('bps-chapter-select').value === chapter
                        && document.getElementById('bps-example-trigger').hidden === false
                        && document.getElementById('p01-goal-select').options.length >= 6
                        && document.getElementById('crumb').textContent.includes(chapter)""",
                        arg=chapter,timeout=25000)
                    trigger=page.locator("#bps-example-trigger")
                    assert trigger.is_visible(),chapter
                    assert "Chapter example" in trigger.inner_text(),chapter
                    before_code=page.evaluate("() => document.querySelector('.CodeMirror').CodeMirror.getValue()")
                    storage_key=f"biopython.{chapter.lower()}.v1"
                    before_storage=page.evaluate("(key) => localStorage.getItem(key)",storage_key)
                    trigger.click()
                    dialog=page.locator("#bps-example-dialog")
                    assert dialog.is_visible(),chapter
                    assert page.locator("#bps-example-title").inner_text()==title,chapter
                    assert page.locator("#bps-example-progress").get_attribute("max") in ("14","15"),chapter
                    assert page.locator("#bps-example-image-preview").is_visible(),chapter
                    page.wait_for_function(
                        "() => document.getElementById('bps-example-image').naturalWidth > 0",
                        timeout=10000)
                    assert "Human Protein Atlas" in page.locator("#bps-example-image-preview").inner_text(),chapter
                    assert page.locator("#bps-example-voice").count()==1
                    assert page.locator("#bps-example-rate").count()==1
                    assert not page.locator("#bps-example-parameter-box").is_visible(),chapter
                    page.locator("#bps-example-next").click()
                    assert page.locator("#bps-example-position").inner_text().startswith("2 /"),chapter
                    page.locator("#bps-example-close").click()
                    assert not dialog.is_visible(),chapter
                    assert page.evaluate("() => document.querySelector('.CodeMirror').CodeMirror.getValue()")==before_code,chapter
                    assert page.evaluate("(key) => localStorage.getItem(key)",storage_key)==before_storage,chapter

                    change_selection(page,"p01-goal-select",str(goal_count-1))
                    assert trigger.is_visible(),chapter+" last goal"
                    trigger.click()
                    assert page.locator("#bps-example-title").inner_text()==title,chapter+" last goal"
                    page.locator("#bps-example-close").click()
                    change_selection(page,"p01-goal-select",str(goal_count))
                    assert trigger.is_visible(),chapter+" capstone"
                    trigger.click()
                    assert page.locator("#bps-example-title").inner_text()==title,chapter+" capstone"
                    page.locator("#bps-example-close").click()

                    change_selection(page,"p01-goal-select",str(goal_count+1))
                    assert trigger.is_hidden(),chapter+" review must remain independent"
                    change_selection(page,"p01-goal-select","0")
                    page.locator("#tab-apply").click()
                    assert trigger.is_hidden(),chapter+" Apply"
                    page.locator("#tab-prove").click()
                    assert trigger.is_hidden(),chapter+" Prove"
                    page.locator("#tab-learn").click()
                    assert trigger.is_visible(),chapter+" Learn reset"
                assert not errors, f"Browser JS errors at {width}px: {errors}"
                page.close()
            browser.close()
    finally:
        process.terminate()
        process.wait(timeout=10)

if __name__=="__main__":
    check()
    print("P02–P06 foundation tutorials: five chapters, two viewport sizes and independent reviews passed.")
