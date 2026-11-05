"""Real browser smoke of expanded 25-lesson curriculum, source links and image arrays.
Uses verified deterministic test JPEGs: HPA external availability checked separately.
"""
import io,re,random
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent.parent
html=(root/'index.html').read_text()
html=re.sub(r'<link rel="stylesheet" href="[^"]*">','',html)
html=re.sub(r'<script src="[^"]*"></script>','',html)
css=(root/'styles.css').read_text()
js=(root/'app.js').read_text()
rng=random.Random(2026)
im=Image.new('RGB',(512,512))
im.putdata([(rng.randrange(0,180),rng.randrange(0,190),rng.randrange(1,255)) for _ in range(512*512)])
stream=io.BytesIO();im.save(stream,format='JPEG',quality=88);good=stream.getvalue()
assert len(good)>50000

with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None,args=['--no-sandbox'])
 for width in (1440,1024,390):
  context=browser.new_context(viewport={'width':width,'height':850})
  page=context.new_page(); errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('https://images.proteinatlas.org/**',lambda route:route.fulfill(status=200,body=good,headers={'Content-Type':'image/jpeg','Access-Control-Allow-Origin':'*'}))
  page.set_content(html);page.add_style_tag(content=css);page.add_script_tag(content=js)
  page.evaluate("() => {for(const l of lessons.slice(0,4)) saved.completed[l.id]='independent';switchLesson(4)}")
  page.wait_for_function('imageReady === true',timeout=12000)
  test=page.evaluate('''() => {
   for (const lesson of lessons) saved.completed[lesson.id]='independent';
   const result=[];
   lessons.forEach((lesson,i)=>{
     switchLesson(i);
     const guide=TASK_GUIDES[lesson.id];
     result.push({id:lesson.id,steps:guide.steps.length,sourceCount:document.querySelectorAll('#source-links a').length,
       image:data[lesson.id][0]?.image?.length||0,headline:document.querySelector('#mission-title').textContent,
       complete:document.querySelectorAll('.step.done').length,
       given:guide.given.length,expected:guide.expected.length,
       newSource:!!lesson.extraSources,caseCount:data[lesson.id].length});
   });
   return result;
  }''')
  assert len(test)==25,test
  assert len(set(x['id'] for x in test))==25
  assert all(x['steps']==3 and x['given']>20 and x['expected']>20 and x['caseCount']==3 for x in test)
  assert sum(x['newSource'] for x in test)==14
  assert all(x['sourceCount']>=3 for x in test[11:])
  assert all(x['image']>0 for x in test if x['id'] in ('roi_crop','roi_mean','bright_fraction','background_subtract','intensity_hist','candidate_regions','field_report'))
  assert test[-1]['complete']==25
  assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+1'),width
  assert not errors,errors
  page.evaluate("switchLesson(11)")
  assert page.locator('#mission-title').inner_text()=='Decode a sample ID'
  assert 'sample_id' in page.locator('#input-metadata').inner_text()
  assert page.locator('#source-links').locator('a').filter(has_text='Python for Biologists').count()==1
  page.evaluate("switchLesson(24)")
  assert page.evaluate('imageReady === true')
  assert 'threshold' in page.locator('#input-metadata').inner_text()
  assert 'HPA' in page.locator('#sample-label').inner_text()
  print('PASS',width,'all 25 steps, real-image inputs, sources, no overflow')
  context.close()
 browser.close()