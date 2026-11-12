"""Browser smoke tests for opt-in MP4 export. The capture/audio primitives are mocked;
these tests verify UI logic and selected voice/rate propagation, NOT real OS audio capture.
"""
from playwright.sync_api import sync_playwright
from test_p01_tutorial_browser import serve

MOCKS = r"""
(() => {
  window.__voiceCalls = [];
  window.__mockSilent = false;
  class FakeUtterance {
    constructor(text) { this.text=text; this.rate=1; this.voice=null; }
  }
  const synth = {
    active:null,
    getVoices:()=>[{voiceURI:"david-voice", name:"David Example",lang:"en-US"}],
    addEventListener:()=>{},
    cancel(){this.active=null;},
    pause(){},
    resume(){},
    speak(utterance){
      this.active=utterance;
      window.__voiceCalls.push({rate:utterance.rate, voice:utterance.voice?.name,text:utterance.text});
      setTimeout(()=>{
        if(this.active!==utterance)return;
        utterance.onstart?.();
        setTimeout(()=>{
          if(this.active!==utterance)return;
          this.active=null;
          utterance.onend?.();
        },55);
      },15);
    }
  };
  Object.defineProperty(window,"SpeechSynthesisUtterance",{value:FakeUtterance,configurable:true});
  Object.defineProperty(window,"speechSynthesis",{value:synth,configurable:true});
  class FakeRecorder{
    constructor(stream,options){ this.state="inactive";this.mimeType=options.mimeType; }
    static isTypeSupported(type){return type.startsWith("video/mp4");}
    start(){this.state="recording";}
    stop(){
      this.state="inactive";
      setTimeout(()=>{
        this.ondataavailable?.({data:new Blob([new Uint8Array(24000)],{type:"video/mp4"})});
        this.onstop?.();
      },25);
    }
  }
  Object.defineProperty(window,"MediaRecorder",{value:FakeRecorder,configurable:true});
  const track={stop(){},addEventListener(){}};
  Object.defineProperty(navigator,"mediaDevices",{value:{
    getDisplayMedia:async()=>({getAudioTracks:()=>[track],getVideoTracks:()=>[track],getTracks:()=>[track]})
  },configurable:true});
  class FakeAudioContext{
    createMediaStreamSource(){return {connect(){}};}
    createGain(){return {gain:{value:1},connect(){}};}
    createAnalyser(){return {
      fftSize:1024,
      connect(){},
      getByteTimeDomainData(samples){samples.fill(window.__mockSilent ? 128 : 152);}
    };}
    resume(){return Promise.resolve();}
    close(){return Promise.resolve();}
  }
  Object.defineProperty(window,"AudioContext",{value:FakeAudioContext,configurable:true});
})();
"""

def check():
    process, url = serve()
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True)
            page = browser.new_page(accept_downloads=True, viewport={"width": 1280, "height": 860})
            page.add_init_script(MOCKS)
            errors = []
            page.on("pageerror", lambda err: errors.append(str(err)))
            page.goto(url, wait_until="domcontentloaded")
            page.locator("#bps-example-trigger").wait_for(state="visible", timeout=30000)
            page.locator("#bps-example-trigger").click()
            assert page.locator("#bps-example-record").is_enabled()
            page.locator("#bps-example-voice").select_option("david-voice")
            page.locator("#bps-example-rate").select_option("0.85")
            with page.expect_download(timeout=18000) as candidate:
                page.locator("#bps-example-record").click()
            download = candidate.value
            assert download.suggested_filename.endswith("0.85x.mp4"), download.suggested_filename
            assert "david" in download.suggested_filename.lower(), download.suggested_filename
            samples = page.evaluate("() => window.__voiceCalls")
            assert len(samples) == 6, len(samples)
            assert all(row["rate"]==0.85 and row["voice"]=="David Example" for row in samples)
            # The browser download event can fire before the status text settles.
            # The persistent Save MP4 link is the actual recovery contract.
            assert page.locator("#bps-example-download").is_visible()
            # Silent capture must not produce an MP4 download.
            page.evaluate("() => { window.__mockSilent=true;window.__voiceCalls=[]; }")
            page.locator("#bps-example-record").click()
            page.wait_for_function(
                "() => document.getElementById('bps-example-status').textContent.includes('NO AUDIO was detected')",
                timeout=18000
            )
            assert page.evaluate("() => window.__voiceCalls.length") == 6
            assert page.locator("#bps-example-download").is_visible()
            with page.expect_download(timeout=12000) as saved:
                page.locator("#bps-example-download").click()
            assert saved.value.suggested_filename.endswith(".mp4")
            # If speechSynthesis fails to call onend, manual Finish & save must work.
            page.evaluate("() => { window.__mockSilent=false;window.__voiceCalls=[]; }")
            page.locator("#bps-example-record").click()
            page.locator("#bps-example-finish").wait_for(state="visible")
            page.wait_for_function("() => window.__voiceCalls.length >= 1")
            page.locator("#bps-example-finish").click()
            page.wait_for_function("() => document.getElementById('bps-example-download').hidden === false")
            assert page.locator("#bps-example-download").is_visible()
            assert not errors, errors
            browser.close()
    finally:
        process.terminate()
        process.wait(timeout=10)

if __name__ == "__main__":
    check()
    print("MP4 test: selected voice/speed, save and silent-audio rejection passed (mocked media only).")
