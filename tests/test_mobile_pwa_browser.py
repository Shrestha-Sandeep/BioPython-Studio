"""Android PWA installation metadata and mobile UI smoke checks in Chromium."""
from playwright.sync_api import sync_playwright
from test_p01_tutorial_browser import serve

def check():
    server,url=serve()
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True)
            for width,height in ((390,844),(1280,850)):
                page=browser.new_page(viewport={"width":width,"height":height})
                errors=[]
                page.on("pageerror",lambda e:errors.append(str(e)))
                page.goto(url,wait_until="domcontentloaded",timeout=60000)
                assert page.locator('link[rel="manifest"]').get_attribute("href")=="/manifest.webmanifest"
                meta=page.evaluate("""async () => {
                    const resp=await fetch('/manifest.webmanifest');
                    const m=await resp.json();
                    const icons=[];
                    for(const entry of m.icons){
                        const image=new Image();image.src=entry.src;
                        await image.decode();
                        icons.push({src:entry.src,width:image.naturalWidth,height:image.naturalHeight});
                    }
                    return {status:resp.status,type:resp.headers.get('content-type'),manifest:m,icons};
                }""")
                assert meta["status"]==200
                assert meta["manifest"]["display"]=="standalone"
                assert meta["manifest"]["id"]=="/"
                assert [(x["width"],x["height"]) for x in meta["icons"]]==[(192,192),(512,512)]
                assert page.evaluate("() => document.documentElement.scrollWidth<=innerWidth+1"),width
                page.locator("#bps-chapter-select").wait_for(state="attached",timeout=30000)
                assert not errors,(width,errors)
                page.close()
            browser.close()
    finally:
        server.terminate();server.wait(timeout=10)

if __name__=="__main__":
    check()
    print("PWA Android and desktop real browser manifest/icon tests passed.")
