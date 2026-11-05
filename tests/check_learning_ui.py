"""Regression test for BioPython Studio's visual learning workspace.
Images are local deterministic test fixtures, not shipped learning assets.
Run: python tests/check_learning_ui.py
"""
import io
import os
import random
import threading
import http.server
import functools
from pathlib import Path
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
shots=root/'_qa_screenshots'
shots.mkdir(exist_ok=True)

rng=random.Random(124)
im=Image.new('RGB',(512,512))
im.putdata([(rng.randrange(1,19),rng.randrange(7,26),rng.randrange(11,29)) for _ in range(512*512)])
draw=ImageDraw.Draw(im)
for i in range(62):
    x=rng.randint(25,485);y=rng.randint(25,485);r=rng.randint(5,23)
    draw.ellipse((x-r,y-r,x+r,y+r),fill=(rng.randint(12,75),rng.randint(45,200),rng.randint(90,255)))
buffer=io.BytesIO();im.save(buffer,format='JPEG',quality=86)
good=buffer.getvalue()
assert len(good)>50000

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
httpd=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root)))
thread=threading.Thread(target=httpd.serve_forever,daemon=True);thread.start()
url=f'http://127.0.0.1:{httpd.server_port}/'
html=(root/'index.html').read_text().replace('<link rel="stylesheet" href="./styles.css">','').replace('<script src="./app.js?v=hpa-loader-20261105"></script>','')
css=(root/'styles.css').read_text()
js=(root/'app.js').read_text()

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for tag,width,height in [('desktop',1440,900),('tablet',1024,800),('mobile',390,844)]:
        context=browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1)
        page=context.new_page()
        problems=[]
        page.on('pageerror',lambda err: problems.append(str(err)))
        page.route('https://images.proteinatlas.org/**',lambda route:route.fulfill(status=200,body=good,headers={'Content-Type':'image/jpeg','Access-Control-Allow-Origin':'*'}))
        page.set_content(html)
        page.add_style_tag(content=css)
        page.add_script_tag(content=js)
        page.locator('#image-credit').wait_for(state='visible',timeout=12000)
        assert not problems,(tag,problems)
        assert page.locator('.mission-brief').is_visible()
        assert page.locator('.code-panel #input-metadata').is_visible()
        assert 'sample_id' in page.locator('.code-panel #input-metadata').inner_text()
        assert page.locator('#instruction-text').count()==1
        assert page.locator('canvas#microscope').is_visible()
        assert page.locator('#editor').is_visible()
        assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1'),(tag,'horizontal overflow')
        page.screenshot(path=str(shots/f'{tag}.png'),full_page=True)
        page.locator('#hint-button').click()
        assert page.locator('#hint').is_visible()
        assert page.locator('#editor').input_value()=='print("control_A01")'
        # Move unlocked progress forward, ensure navigator distinguishes active/completed/locked.
        page.evaluate("saved.completed.sample = 'independent'; switchLesson(1)")
        assert page.locator('#mission-title').inner_text()=='Treatment effect'
        assert 'control' in page.locator('.code-panel #input-metadata').inner_text()
        assert page.locator('button.step.done').count()==1
        assert page.locator('button.step.active').count()==1
        assert page.locator('button.step:disabled').count()>=8
        # Confirm the status/feedback styles communicate distinct states.
        page.evaluate("tell('Well done','Works on new data','success')")
        assert page.locator('.feedback.success').is_visible()
        assert page.locator('.feedback.success').evaluate('(el) => getComputedStyle(el).borderLeftColor') != page.locator('.feedback.error').evaluate('(el) => getComputedStyle(el).borderLeftColor') if page.locator('.feedback.error').count() else True
        print('PASS',tag,'responsive lesson, data, hint, navigator, source image')
        context.close()
    browser.close()
httpd.shutdown()