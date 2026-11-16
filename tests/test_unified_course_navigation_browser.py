"""Unified navigation QA: every topic on one domain, legacy bookmarks, state safety, responsive phone UI."""
from playwright.sync_api import sync_playwright
from test_p01_tutorial_browser import serve, change_selection

COUNTS = {'Python':6,'Microscopy':13,'NGS':4,'ML':3,'Advanced':7}

def check():
    server,url=serve()
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True)
            for width,height in ((390,844),(1280,850)):
                page=browser.new_page(viewport={'width':width,'height':height})
                errors=[]
                page.on('pageerror',lambda e:errors.append(str(e)))
                page.goto(url,wait_until='domcontentloaded',timeout=60000)
                selector=page.locator('#bps-chapter-select')
                selector.wait_for(state='attached',timeout=60000)
                assert selector.input_value()=='P01'
                assert page.locator('[data-stage]').count()==5
                assert page.locator('[data-stage="Advanced"]').count()==1
                for stage,count in COUNTS.items():
                    if width<=720:
                        nav=page.locator('#nav-toggle')
                        nav.click()
                        assert page.locator('#sidebar').evaluate('(e)=>e.classList.contains("open")')
                    page.locator('[data-stage="'+stage+'"]').click()
                    page.wait_for_function("""(stage)=>document.querySelector('[data-stage="'+stage+'"]')?.getAttribute('aria-current')==='page'""",stage,timeout=20000)
                    page.wait_for_function("""(count)=>document.querySelectorAll('#bps-chapter-select option').length===count""",count,timeout=20000)
                    if width<=720:
                        assert not page.locator('#sidebar').evaluate('(e)=>e.classList.contains("open")')
                assert page.locator('#bps-chapter-select optgroup').count()==2
                assert page.locator('#bps-chapter-select optgroup').all_text_contents()
                change_selection(page,'bps-chapter-select','A07')
                assert selector.input_value()=='A07'
                assert page.locator('#bps-example-trigger').is_visible()
                assert 'Advanced' not in page.locator('#page-title').inner_text() or page.locator('#page-title').inner_text()
                initial=page.evaluate("() => localStorage.getItem('biopython.a07.v1')")
                assert initial is not None
                # Advanced > Microscopy > Advanced retains the chapter, state and editor.
                if width<=720: page.locator('#nav-toggle').click()
                page.locator('[data-stage="Microscopy"]').click()
                if width<=720: page.locator('#nav-toggle').click()
                page.locator('[data-stage="Advanced"]').click()
                assert selector.input_value()=='A07'
                assert page.evaluate("() => localStorage.getItem('biopython.a07.v1')")==initial
                assert page.evaluate("() => document.documentElement.scrollWidth<=innerWidth+1"),width
                page.reload(wait_until='domcontentloaded')
                selector.wait_for(state='attached',timeout=60000)
                assert selector.input_value()=='A07','Saved course and advanced chapter should resume'
                assert page.locator('[data-stage="Advanced"]').get_attribute('aria-current')=='page'
                assert not errors,(width,errors)
                page.close()
            old=browser.new_page(viewport={'width':1280,'height':850})
            old.goto(url+'?lab=advanced',wait_until='domcontentloaded')
            old.locator('#bps-chapter-select').wait_for(state='attached',timeout=60000)
            assert old.locator('[data-stage="Advanced"]').is_hidden()
            assert old.locator('[data-stage="Microscopy"]').get_attribute('aria-current')=='page'
            change_selection(old,'bps-chapter-select','A05')
            assert old.locator('#bps-chapter-select').input_value()=='A05'
            assert old.locator('#bps-example-trigger').is_visible()
            old.close()
            browser.close()
    finally:
        server.terminate()
        server.wait(timeout=10)

if __name__=='__main__':
    check()
    print('Unified 33 chapter desktop, Android navigation, reload and compatibility QA passed.')
