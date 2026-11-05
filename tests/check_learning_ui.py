"""Focus UI regression: Pyodide is mocked; run real evaluator checks separately."""
import io
import random
import re
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent.parent
html=(root/'index.html').read_text()
html=re.sub(r'<link rel="stylesheet" href="[^"]*">','',html)
html=re.sub(r'<script src="[^"]*"></script>','',html)
css=(root/'styles.css').read_text()
js=(root/'app.js').read_text()
rng=random.Random(40)
im=Image.new('RGB',(512,512))
im.putdata([(rng.randrange(30,140),rng.randrange(30,160),rng.randrange(40,255)) for _ in range(512*512)])
out=io.BytesIO();im.save(out,format='JPEG',quality=85)
good=out.getvalue()
assert len(good)>50000
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
    for width in (1440,1024,390):
        page=browser.new_page(viewport={'width':width,'height':850})
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        requests=[]
        def deliver(route):
            requests.append(route.request.url)
            route.fulfill(status=200,body=good,headers={'Content-Type':'image/jpeg','Access-Control-Allow-Origin':'*'})
        page.route('https://images.proteinatlas.org/**',deliver)
        page.set_content(html)
        page.add_style_tag(content=css)
        page.add_script_tag(content=js)
        assert page.locator('#image-panel').is_hidden()
        assert page.locator('#curriculum-toggle').evaluate('(e)=>e.open') is False
        assert page.locator('#task-details').evaluate('(e)=>e.open') is False
        assert page.locator('#learn-more').evaluate('(e)=>e.open') is False
        assert page.locator('#feedback').is_hidden()
        assert page.locator('#output-area').is_hidden()
        assert page.locator('#navigation').is_hidden()
        assert page.locator('#editor').is_visible()
        assert 'sample_id' in page.locator('#input-metadata').inner_text()
        assert not requests,'Image should not load during beginner lessons'
        page.locator('#task-details summary').click()
        assert 'treated_B08' in page.locator('#task-expected').inner_text()
        page.locator('#task-details summary').click()
        page.locator('#curriculum-toggle summary').click()
        assert page.locator('#curriculum .step').count()==11
        page.evaluate("() => {for(const item of lessons) saved.completed[item.id]='independent';switchLesson(4);}")
        assert page.locator('#image-panel').is_visible()
        page.locator('#image-credit').wait_for(state='visible',timeout=15000)
        assert 'NumPy array 64 × 64' in page.locator('#input-metadata').inner_text()
        assert len(requests)==3
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
        assert not errors,errors
        page.close()
    browser.close()
print('PASS: focused learning layout, no eager images, navigation, real-image stage, three screen widths')
