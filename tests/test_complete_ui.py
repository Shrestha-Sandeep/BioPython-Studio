"""Focused, responsive all-61 learning experience with deterministic image fixtures.
This test does not replace real Pyodide runtime validation.
"""
import functools
import http.server
import random
import threading
import re
import io
from pathlib import Path
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'legacy.html').read_text()
css=(ROOT/'styles.css').read_text()
js=(ROOT/'app.js').read_text()
rng=random.Random(425)
import numpy as np
arr=np.random.default_rng(425).integers(0,45,(512,512,3),dtype=np.uint8)
im=Image.fromarray(arr,'RGB')
d=ImageDraw.Draw(im)
for j in range(55):
    x,y=rng.randint(25,490),rng.randint(25,490)
    rad=rng.randint(7,20)
    d.ellipse((x-rad,y-rad,x+rad,y+rad),fill=(rng.randint(10,90),rng.randint(10,180),rng.randint(80,254)))
io_obj=io.BytesIO();im.save(io_obj,format='JPEG',quality=86)
jpeg=io_obj.getvalue()
assert len(jpeg)>50000

with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None,args=['--no-sandbox'])
    for width in [1440,1024,390]:
        context=browser.new_context(viewport={'width':width,'height':900})
        page=context.new_page()
        errors=[];requests=[]
        page.on('pageerror',lambda e: errors.append(str(e)))
        def intercept(route):
            requests.append(route.request.url)
            route.fulfill(status=200,body=jpeg,headers={'Content-Type':'image/jpeg','Access-Control-Allow-Origin':'*'})
        page.route('https://images.proteinatlas.org/**',intercept)
        page.set_content(html)
        page.add_style_tag(content=css)
        page.add_script_tag(content=js)
        assert page.locator('#mission-title').inner_text()=='Sample identity'
        assert page.locator('#image-panel').is_hidden()
        assert page.locator('#curriculum-toggle').evaluate('(e)=>e.open') is False
        assert page.locator('#editor').is_visible()
        assert not requests,'Images must not load until relevant'
        checks=page.evaluate('''() => ({
            lessonCount:lessons.length,
            ids:[...new Set(lessons.map(x=>x.id))].length,
            guides:lessons.every(x=>TASK_GUIDES[x.id] && TASK_GUIDES[x.id].steps.length===3),
            cases:lessons.every(x=>Array.isArray(data[x.id]) && (!data[x.id].length || data[x.id].length===3)),
            sourceCount:STUDIO_EXTENSION.lessons.length,
            dataArray:Object.keys(data).length
        })''')
        assert checks['lessonCount']==61 and checks['ids']==61 and checks['guides'] and checks['cases'] and checks['sourceCount']==36,checks
        page.locator('#curriculum-toggle summary').click()
        assert page.locator('#curriculum button.step').count()==61
        page.locator('#curriculum-toggle summary').click()
        page.evaluate("() => {switchLesson(25);}")
        assert page.locator('#mission-title').inner_text()=='Understand pixel bit depth'
        page.locator('#image-credit').wait_for(state='visible',timeout=16000)
        assert len(requests)==3
        assert 'HPA' in page.locator('#image-credit').inner_text()
        assert page.locator('#input-metadata').is_visible()
        page.evaluate('switchLesson(60)')
        assert page.locator('#mission-title').inner_text()=='Complete your independent research workflow'
        page.locator('#learn-more summary').click()
        assert page.locator('#source-links a').count()>=5
        assert 'BioPython_Research_Companion.ipynb' in page.locator('#source-links').inner_html()
        assert not errors,(width,errors)
        if not page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'):
            bad=page.evaluate('''() => ({width:innerWidth,scroll:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll('*')].map(el=>({tag:el.tagName,id:el.id,cls:el.className?.toString().slice(0,50),right:Math.round(el.getBoundingClientRect().right),left:Math.round(el.getBoundingClientRect().left),width:Math.round(el.getBoundingClientRect().width)})).filter(e=>e.right>innerWidth+1).sort((a,b)=>b.right-a.right).slice(0,12)})''')
            print('OVERFLOW',bad,flush=True)
            assert False,width
        print('PASS UI width',width,'61 lessons, original position, conditional HPA microscopy, source notebook')
        context.close()

    # E2E UI feedback on a runnable first lesson using a fake worker; no simulated Python is claimed.
    context=browser.new_context(viewport={'width':1024,'height':820})
    page=context.new_page()
    fake_worker='''(() => {
      class FakeWorker {
        onmessage=null; onerror=null;
        constructor(path) { this.path=path; }
        terminate() {}
        postMessage(payload) {
          Promise.resolve().then(() => this.onmessage?.({data:{
            type:'result', requestId:payload.requestId, ok:payload.source.includes('print(sample_id)'),
            cases:[{input_index:0,output:'control_A01'}],
            message:'Checked on changing specimen IDs'
          }}));
        }
      }
      window.Worker=FakeWorker;
    })();'''
    page.set_content(html)
    page.evaluate(fake_worker)
    page.add_style_tag(content=css)
    page.add_script_tag(content=js)
    page.locator('#editor').fill('print(sample_id)')
    page.locator('#run').click()
    page.locator('.feedback.success').wait_for(state='visible')
    assert page.locator('#next').is_visible()
    assert page.locator('#output-area').is_visible()
    page.locator('#next').click()
    assert page.locator('#mission-title').inner_text()=='Treatment effect'
    assert page.locator('#mission-title').inner_text()=='Treatment effect'
    context.close()

    # Corrupt HPA files must not be reported as a successful image load.
    context=browser.new_context(viewport={'width':1024,'height':840})
    page=context.new_page()
    truncated=jpeg[:1506]
    page.route('https://images.proteinatlas.org/**', lambda route:route.fulfill(status=200,body=truncated,headers={'Content-Type':'image/jpeg','Access-Control-Allow-Origin':'*'}))
    page.set_content(html)
    page.add_style_tag(content=css)
    page.add_script_tag(content=js)
    page.evaluate("() => {switchLesson(26);}")
    page.locator('#retry-images').wait_for(state='visible',timeout=10000)
    assert 'incomplete or invalid' in page.locator('#image-caption').inner_text()
    page.unroute('https://images.proteinatlas.org/**')
    page.route('https://images.proteinatlas.org/**',lambda route:route.fulfill(status=200,body=jpeg,headers={'Content-Type':'image/jpeg','Access-Control-Allow-Origin':'*'}))
    page.locator('#retry-images').click()
    page.locator('#image-credit').wait_for(state='visible',timeout=15000)
    context.close()
    print('PASS image corruption detection and recovery')

    browser.close()
print('PASS guided flow, saved progress, success feedback and reload')