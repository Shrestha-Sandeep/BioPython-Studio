"""Image loading regression test with local JPEG fixtures; no HPA service needed.
Run with Playwright/Chromium and Pillow installed: python tests/check_browser_images.py
"""
import io
import random
import re
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parent.parent
html=(root/'index.html').read_text(encoding='utf-8')
html=re.sub(r'<link rel="stylesheet" href="\./styles\.css[^\"]*">','',html)
html=re.sub(r'<script src="\./app\.js[^\"]*"></script>','',html)
css=(root/'styles.css').read_text(encoding='utf-8')
js=(root/'app.js').read_text(encoding='utf-8')
rng=random.Random(812)
im=Image.new('RGB',(512,512))
im.putdata([(rng.randrange(256),rng.randrange(256),rng.randrange(256)) for _ in range(512*512)])
buffer=io.BytesIO()
im.save(buffer,format='JPEG',quality=87)
good=buffer.getvalue()
assert len(good)>50000
bad=good[:1506]

def boot(page):
    page.set_content(html)
    page.add_style_tag(content=css)
    page.add_script_tag(content=js)

def brightness(page):
    return page.eval_on_selector('#microscope',"""canvas => {
        const data=canvas.getContext('2d').getImageData(0,0,512,512).data;
        let sum=0;
        for(let i=0;i<data.length;i+=128) sum+=data[i]+data[i+1]+data[i+2];
        return sum;
    }""")

with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
    for width in (1440,390):
        page=browser.new_page(viewport={'width':width,'height':900})
        page.route('https://images.proteinatlas.org/**',
            lambda route: route.fulfill(status=200,body=good,headers={'Content-Type':'image/jpeg','Access-Control-Allow-Origin':'*'}))
        boot(page)
        assert page.locator('#image-panel').is_hidden()
        page.evaluate("() => {['sample','change','replicates','function'].forEach(x=>saved.completed[x]='independent');switchLesson(4)}")
        page.locator('#image-credit').wait_for(state='visible')
        assert brightness(page)>20000
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
        page.evaluate("() => {['sample','change','replicates','function'].forEach(x=>saved.completed[x]='independent');switchLesson(4);}")
        assert 'NumPy array 64 × 64' in page.locator('#input-metadata').inner_text()
        page.close()
    page=browser.new_page()
    page.route('https://images.proteinatlas.org/**',
        lambda route: route.fulfill(status=200,body=bad,headers={'Content-Type':'image/jpeg','Access-Control-Allow-Origin':'*'}))
    boot(page)
    page.evaluate("() => {['sample','change','replicates','function'].forEach(x=>saved.completed[x]='independent');switchLesson(4)}")
    page.locator('#retry-images').wait_for(state='visible')
    assert 'incomplete or invalid' in page.locator('#image-caption').inner_text()
    page.unroute('https://images.proteinatlas.org/**')
    page.route('https://images.proteinatlas.org/**',
        lambda route: route.fulfill(status=200,body=good,headers={'Content-Type':'image/jpeg','Access-Control-Allow-Origin':'*'}))
    page.locator('#retry-images').click()
    page.locator('#image-credit').wait_for(state='visible')
    assert brightness(page)>20000
    browser.close()
print('PASS: valid images, mobile layout, NumPy input and corrupt-image retry.')
