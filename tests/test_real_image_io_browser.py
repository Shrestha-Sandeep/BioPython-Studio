"""Real browser Pyodide: actual selected uint16 OME-TIFF to worker, clear, export and viewports."""
import subprocess
import sys
import tempfile
import time
from pathlib import Path

import numpy as np
import tifffile
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
PORT=8994
URL=f"http://127.0.0.1:{PORT}/"


def code(page,text):
    page.evaluate("script => document.querySelector('.CodeMirror').CodeMirror.setValue(script)",text)


def run(page, text, expected):
    code(page,text)
    page.locator("#run-button").click()
    page.wait_for_function("""needle => {
        const el=document.querySelector('#output-placeholder');
        return el && el.innerText.includes(needle);
    }""",arg=expected,timeout=180000)


def main():
    tmp=tempfile.TemporaryDirectory()
    root=Path(tmp.name)
    image=root/"native_16bit.ome.tif"
    data=np.zeros((2,32,24),dtype=np.uint16)
    data[0,:,:]=97
    data[0,5:12,4:9]=48100
    data[1,:,:]=9
    data[1,5:12,4:9]=1100
    tifffile.imwrite(image,data,ome=True,photometric="minisblack",metadata={"axes":"CYX"})
    second=root/"native_16bit_second.tif"
    tifffile.imwrite(second,np.full((32,24),1000,dtype=np.uint16))
    server=subprocess.Popen([sys.executable,"-m","http.server",str(PORT),"--bind","127.0.0.1"],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        time.sleep(1.5)
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,args=["--no-sandbox"])
            page=browser.new_page(viewport={"width":1440,"height":900},accept_downloads=True)
            errors=[]
            page.on("pageerror",lambda e:errors.append(str(e)))
            page.goto(URL,wait_until="domcontentloaded")
            page.locator("#bps-chapter-select").wait_for(timeout=30000)
            page.locator('[data-stage="Microscopy"]').click()
            page.locator("#bps-chapter-select").select_option("I13")
            page.locator("#p01-goal-select").select_option("4")
            page.locator("#tab-apply").click()
            assert page.locator("#bps-real-data-project").is_visible()
            page.locator("#image-upload").set_input_files([str(image),str(second)])
            assert "2 image file(s)" in page.locator("#analysis-dataset-status").inner_text()
            assert page.locator("#analysis-dataset-status").is_visible()
            script="""from tifffile import TiffFile
import numpy as np
assert len(uploaded_image_paths)==2
with TiffFile(uploaded_image_paths[0]) as f:
    a=f.asarray()
    assert a.shape==(2,32,24),a.shape
    assert a.dtype==np.dtype('uint16')
    assert int(a[0,6,5])==48100
    assert f.series[0].axes=='CYX'
with TiffFile(uploaded_image_paths[1]) as f:
    b=f.asarray()
    assert b.shape==(32,24)
    assert int(b[0,0])==1000
print('REAL_TIFF_IMPORT_OK',len(uploaded_image_paths),int(a.max()))
"""
            run(page,script,"REAL_TIFF_IMPORT_OK")
            page.locator("#p01-goal-select").select_option("5")
            page.locator("#tab-prove").click()
            code(page,"print('LOCAL_EXPORT_OK', len(uploaded_image_paths))")
            with page.expect_download(timeout=12000) as download_event:
                page.locator("#p01-export").click()
            saved=Path(download_event.value.path()).read_text(encoding="utf8")
            assert "native_16bit.ome.tif" in saved
            assert "uploaded_image_paths = " in saved
            page.locator("#clear-analysis-files").click()
            assert page.locator("#analysis-dataset-status").is_hidden()
            run(page,"print('UPLOAD_CLEARED_OK',len(uploaded_image_paths))","UPLOAD_CLEARED_OK 0")
            assert not errors,errors
            artifact=ROOT/"artifacts"/"real-microscopy"
            artifact.mkdir(parents=True,exist_ok=True)
            page.screenshot(path=str(artifact/"desktop.png"),full_page=True)
            for w,h in [(390,844),(768,1024)]:
                p=browser.new_page(viewport={"width":w,"height":h})
                p.goto(URL,wait_until="domcontentloaded")
                p.locator("#bps-chapter-select",state="attached").wait_for(timeout=25000)
                p.locator('[data-stage="Microscopy"]').click(force=True)
                p.wait_for_timeout(400)
                assert p.evaluate("document.documentElement.scrollWidth<=innerWidth+1"),w
                p.screenshot(path=str(artifact/f"viewport-{w}.png"),full_page=True)
                p.close()
            browser.close()
            print("PASS actual TIFF/OME-TIFF uint16 source bytes, axes, two-image import, local export, clear and responsive layouts")
    finally:
        server.terminate()
        try:server.wait(timeout=5)
        except subprocess.TimeoutExpired:server.kill()
        tmp.cleanup()


if __name__=="__main__":
    main()
