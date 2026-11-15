# P01 narrated examples — isolated pilot

**Base:** `ui-first-2`, 12 November 2026. **Branch:** `feature/p01-narrated-examples`.
This is a draft integration, not a change to the published application or the frozen UI branch.

## Scope

An optional `▶ Example` button is inserted below the existing Learn description. A native modal dialog opens with browser speech, captions, code-line highlighting, changed values, output previews and a slider where appropriate. P01-CAPSTONE displays `▶ Complete example`. The dialog does not alter the existing Python editor or the `biopython.p01.v1` saved learner state.

| Example | Canonical P01 goal(s) | Frames |
|---|---|---:|
| Variables and output | P01-G01, P01-G02 | 6 |
| Measurements and Python types | P01-G03, P01-G04 | 6 |
| Errors, help and clean runs | P01-G05, P01-G06, P01-G07 | 7 |
| Complete specimen report | P01-CAPSTONE | 7 |
| **Total** | **7 goals + capstone** | **26** |

P01-REVIEW deliberately has no worked tutorial to preserve independent delayed transfer. Apply and Prove do not show the optional control. Lessons P02–P06, microscopy, sequencing and ML are unaffected.

## Implementation files

- `src/tutorials/p01-data.js` — original, domain-appropriate narration scripts and Python source snapshots
- `src/tutorials/p01-viewer.js` — optional event-driven Learn integration and native browser speech
- `src/tutorials/p01-viewer.css` — responsive overlay styling, keyboard-focus handling
- `index.html` — references for the three files
- `tests/p01_tutorials.test.mjs` — source contract and independent CPython output checks

## Important limits

The narrated visual trace is an explanatory animation. Real Python still runs via the existing Pyodide worker when the learner presses **Run** in the main workspace. The explanatory trace must never be interpreted as proof that a learner's edited code ran.

Browser `speechSynthesis` uses system-installed voices. It selects an English male-*sounding name* when one is available; voice name is only a heuristic and does not guarantee gender or natural quality. There is **no voice subscription or external TTS integration**. Voice playback may vary between operating systems and browsers; captions and manual Next/Back navigation always remain available.

Microscopy values, specimen IDs and calibration values shown here are synthetic **training values**. Numerical measurements in a real experiment require verified calibration and provenance.

## QA

Run from the repository root:

```bash
npm test
```

`tests/p01_tutorials.test.mjs` validates tutorial mapping, narration and highlight contracts, optional UI wiring, and (when `python3` is available) the displayed example outputs against fresh CPython runs.

**Manual browser QA required before merge:** Open P01-G01 and P01-G06; verify button visibility; play and pause narrator; change voice/speed; run slider before and during narration; verify no modifications to the editor draft or saved progress; switch to Apply and Prove and confirm button disappears; confirm no tutorial is displayed in P01-REVIEW; test keyboard Escape/close, mobile portrait and desktop landscape; verify no unrelated chapters receive the button; run existing Pyodide code and public checks. Test on a device with no English system voices for graceful fallback.

This draft is not yet a human-validated learning intervention, and should not be merged/promoted before these tests.
