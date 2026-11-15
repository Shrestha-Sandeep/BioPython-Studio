# Science-first narrated tutorial standard — Python foundations P01–P06

**Branch:** feature/foundation-six-chapter-tutorials
**Base:** draft one-chapter P01 PR #35
**Status:** All six Python foundation chapter tutorials implemented and awaiting user review. This does not mean mastery or production release.

## The rule

**Scientific destination → today's small Python building block → a visibly changing consequence → what becomes possible later → independent transfer.**

This is not a generic motivational speech. Give the learner a plausible reason to write the code before walking through syntax. The future preview must show an authentic type of output when possible, while clearly distinguishing what today's code actually computes from what a later pipeline might compute.

### Minimum standard, every narrated tutorial

1. **Specific destination:** a concrete biological/scientific workflow or decision. Prefer one authentic figure over vague aspirational descriptions.
2. **Accurate credit:** original Witz/HPA examples are explicitly sourced using bundled assets/witz/CREDITS.md. The bundled figures are published notebook outputs, *not raw microscopy intensity data*. Never infer calibrations or reported counts from those displayed figures.
3. **No capability inflation:** introductory variables and print() do not segment cells; a mask does not prove biologically correct identification.
4. **One conceptual step at a time:** narrate a concrete Python operation, highlight the matching line and show the effect, while maintaining an accurate scientific explanation.
5. **Meaningful modification:** an input slider or editable parameter alters real calculated example values where relevant; unrelated output is invariant. Avoid fake progress or effects that do not represent the code.
6. **Independent transfer:** end with a new but achievable task in the existing editor. Do not supply the whole solution.
7. **Execution and validation:** check each complete displayed runnable code block and output against fresh Python, including changed-input cases. Explanatory previews must not impersonate live execution.
8. **Progression:** retain the Witz-led concept sequence and Learn → Apply → Prove. Do not give worked preview examples to delayed reviews or Prove.
9. **User experience:** keep the minimal existing example dialog and installed browser voice selection/speed. Do not add download, screen recording, streaks, or another permanent panel.
10. **Accessibility:** captions independent of speech; manual Previous/Next; reduced-motion support; readable microscopy alt text; citations.

## Updated P01 implementation — one coherent example

Instead of four separate narrated clips with 31 scenes, P01 now has **one narrated 19-scene chapter tutorial**, approximately 5–8 minutes including a deliberate prediction pause. It remains available in Learn across all seven P01 goals and the capstone. It is deliberately absent from the delayed review, Apply and Prove.

**Recurring project:** a specimen-level microscopy measurement report.

| Sequence | What the learner sees or understands | Learning goals |
|---|---|---|
| 1. Destination | Genuine published labeled nuclei; future field-level analysis and reports (not produced by current code) | G01 |
| 2. Gather data | Specimen label and manually collected measurements, explicitly hypothetical calibration | G01, G02 |
| 3. Execute | Variables, strings, integers, printing and a prediction about changing inputs | G01, G02 |
| 4. Calculate | Pixels × micrometres per pixel; float/int/Boolean and scientific units | G03, G04 |
| 5. Validate | Silent calibration error, visible NameError, documentation and clean-state reproducibility | G05, G06, G07 |
| 6. Report | One complete, runnable Python report and connection to future quantitative image analysis | CAPSTONE |
| 7. Transfer | Independent field variable, new pixel length, re-run and explain dependencies | CAPSTONE |

**Learning mechanics:** the single existing Play button becomes Reveal at the prediction break. A user-selected browser TTS voice and narration rate remain supported. The count slider appears only where changes have a useful visible effect. Witz/HPA figures are credited and remain explicitly separate from actual numeric input data.

**Scope:** the one-chapter approach has now been extended to all foundation chapters at the user's request. These remain optional narrated demonstrations, not substitutes for independent coding.

## Implemented foundation tutorials

One connected microscopy analysis pipeline follows the canonical chapter order:

| Chapter | Existing goals | Scientific destination demonstrated | How the concepts contribute |
|---|---|---|---|
| **P02: sample labels** | Build/parse identifiers, numerical QC, conditions | Prevent incorrect treatment-group assignments; issue auditable field accept/reject reports | String manipulation, parsing, comparisons and conditional logic |
| **P03: recorded microscope fields** | Index/slice, copying, tuples, loops, enumerate, bounded while, skip/stop | Inspect dozens of fields without copy-paste; log omitted fields and reasons | Collections and iteration |
| **P04: metadata** | Dictionary/nested data, sets, comprehensions, summaries, zip | Connect sample, channel, acquisition settings and replicate metadata; detect duplicates | Structured records and reliable joins |
| **P05: reusable analysis** | Functions, parameters, scope, typing/docstrings, errors, imports | Reuse identical calibrated measurements across specimens; reject invalid calibration | Composable, testable functions |
| **P06: reproducibility** | Files, environments, JSON, assertions, standalone script, Git | Produce a documented and repeatable field-analysis artifact | Read, validate, save, test, and track analysis |

Each chapter now has one carefully structured narrated tutorial showing one evolving workflow. The original short written help and independent exercises for each individual learning goal remain. Do not turn every minor concept into a separate video. Introduce richer previews only where grounded in the core concept and the relevant licensing.

## Tutorial inventory

| Chapter | Scenes | Prediction pause | Independent coding challenge |
|---|---:|---|---|
| P01 | 19 | Changing a cell count | Extend a specimen report |
| P02 | 14 | Inclusive versus exclusive QC threshold | Diagnose malformed labels and boundary scores |
| P03 | 15 | Field processing after STOP | Audit new invalid, missing and unvisited fields |
| P04 | 15 | Whether missing focus passes a filter | Duplicate and missing-metadata audit |
| P05 | 14 | State leaking through shared mutable lists | Test calibration and new field widths |
| P06 | 14 | Assertion detecting incorrect unit conversion | Save/test JSON with changed observations |
| **Total** | **91** | **6 learner prediction moments** | **6 chapter-level transfer challenges** |

Each scene has browser TTS narration, readable captions, code focus, value/output explanation, and published microscopy previews where appropriate. These are explanatory views; the real code interpreter remains in the existing learning editor.

## QA gates

- Preserve all 36 foundation learning goals (P01 7, P02 4, P03 7, P04 6, P05 6, P06 6), six capstones, and six independent delayed reviews.
- Verify genuine microscopy images are available locally and show source/limitations.
- Verify output and tracebacks using a fresh interpreter across all six tutorials, including changed labels, thresholds, calibration, and missing data.
- Pass mobile and desktop browser tests; ensure images are visible in introductory scenes, lesson state is untouched, and no MP4 functionality exists.
- Browser voice quality/pace must still be assessed on the learner's device; CI cannot validate installed voices.
- Have the learner test whether the end-of-lesson transfer question is independently doable. Failing to answer that is more informative than the beauty of an animation.

**Do not merge or promote to production until the user has reviewed the full P01–P06 experience and confirmed that the larger-picture approach improves their actual learning.**
