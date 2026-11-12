# P01 optional MP4 export — experimental add-on

**Branch:** `feature/p01-example-mp4-export`, built on `feature/p01-narrated-examples`.

## User workflow

1. Open P01 Learn → **Example** or **Complete example** in desktop Chrome or Edge over HTTPS.
2. Choose the narrator under **Voice**, then choose **0.85× / 0.95× / 1× / 1.1×** under **Speed**.
3. Click **↓ MP4**.
4. The browser will ask what to share. Prefer **This Tab** and explicitly enable **Share tab audio**. Depending on Windows/browser capabilities, **Entire Screen + Share system audio** might be necessary because operating-system speech voices can play outside the tab's audio stream. Selecting the screen captures anything visible on that screen, so close private windows and avoid switching apps.
5. Leave the tutorial visible while it records. Narration and synchronized lesson steps start again from the beginning automatically.
6. If MP4 encoding and captured audio both succeed, the recording is saved as `BioPython_<lesson>_<voice>_<speed>x.mp4`. Open the downloaded file and **listen** to verify actual voice audio and synchronization.

## Technical boundary

The browser's `speechSynthesis` API does **not** return raw voice audio. This implementation requests permission to record screen/tab video **and** audio with `getDisplayMedia({video, audio})`. It checks `MediaRecorder.isTypeSupported('video/mp4')` before enabling the button, and measures audio activity via an `AnalyserNode`. If the stream lacks an audio track, if voice playback fails or if the recorded audio stream remains silent, **it does not download a silent recording**.

This is **best-effort, not guaranteed**. A non-zero audio waveform may come from unrelated system/tab sounds rather than the voice, and the waveform test cannot prove that the selected speech voice was encoded correctly. The user must play back the MP4 to verify. A browser/OS combination may never route device speech into the chosen capture source. The clean solution for guaranteed server-side renders is a dedicated audio synthesis engine with an explicit voice-file output, but this pilot deliberately **does not introduce any subscription or service**.

The app does not send recordings to a server. MediaRecorder creates a local Blob and triggers a local download. All browser capture permissions remain under the user's control. Stop Sharing or Escape cancels the current recording.

MP4-only is intentional. When the browser does not support compatible direct MP4 recording, the feature is disabled rather than mislabeled WebM as .mp4. iOS/mobile capture is not supported by this experiment.

## Testing

- `npm test`: P01 data, aligned Python output and recording feature contracts.
- `python tests/test_p01_tutorial_browser.py`: existing normal mobile/desktop viewer checks.
- `python tests/test_p01_mp4_browser.py`: **mocked** screen audio, MediaRecorder and narrator; tests the selected voice/rate, download naming, and silent audio refusal.
- Manual device test **required**: Edge/Chrome on Windows, current tab with tab audio, and screen/system audio if needed. Check actual MP4 playback in an independent player; verify any chosen device voice appears in the audio, that 0.85× sounds slower than 1.1×, and that capture stops when cancelled.

No changes to core Python execution, saved drafts, study phases or production deployment.
