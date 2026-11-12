# Science-first narrated tutorial standard — P01 pilot

**Branch:** feature/p01-science-first-narrated-tutorials
**Base:** draft P01 narration PR #32 (feature/p01-narrated-examples)
**Status:** P01 content and evidence-led demonstration implemented in branch; P02–P06 below are an implementation plan, not implemented narrated tutorials.

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

## Implemented P01 examples

| Narrated example | P01 goals | Opening real-world capability | Concept and small transferable deliverable | Scenes |
|---|---|---|---|---:|
| Variables and output | G01, G02 | Segmented nuclei → a field-level count report | Assign specimen identifier and manual count; print and vary them | 8 |
| Measurements and Python types | G03, G04 | Calibrated length/size measurement | Integers, floats, comparison/Boolean; pixel-to-µm arithmetic with explicitly hypothetical calibration | 7 |
| Errors, help, clean runs | G05, G06, G07 | Avoid visible and silent failures in batch analysis | Debug NameError, use help, re-run from a clean session, challenge wrong calibration | 8 |
| Complete specimen report | CAPSTONE | Traceable records across many fields | One small reproducible script: specimen ID, manual count, calculated length, formatted text output | 8 |

**Total: 31 narration scenes**, four tutorials. P01-REVIEW stays independent and has no walkthrough.

Figures: labeled nuclei, fluorescence images, and Otsu mask reproduced in Witz notebooks and credited to Witz/HPA. These previews are not paired before/after claims or direct computations from the beginner snippets.

## Extension roadmap (not implemented)

Follow the existing actual chapter goals, not a new syllabus:

| Chapter | Existing goals | Scientific destination to preview | How the new concepts contribute |
|---|---|---|---|
| **P02: sample labels** | Build/parse identifiers, numerical QC, conditions | Prevent incorrect treatment-group assignments; issue auditable field accept/reject reports | String manipulation, parsing, comparisons and conditional logic |
| **P03: recorded microscope fields** | Index/slice, copying, tuples, loops, enumerate, bounded while, skip/stop | Inspect dozens of fields without copy-paste; log omitted fields and reasons | Collections and iteration |
| **P04: metadata** | Dictionary/nested data, sets, comprehensions, summaries, zip | Connect sample, channel, acquisition settings and replicate metadata; detect duplicates | Structured records and reliable joins |
| **P05: reusable analysis** | Functions, parameters, scope, typing/docstrings, errors, imports | Reuse identical calibrated measurements across specimens; reject invalid calibration | Composable, testable functions |
| **P06: reproducibility** | Files, environments, JSON, assertions, standalone script, Git | Produce a documented and repeatable field-analysis artifact | Read, validate, save, test, and track analysis |

For each chapter: start with one high-quality mini-workflow that appears across its tutorials, then make the chapter capstone the integrated version. Avoid six separate, unrelated examples. Introduce richer previews only where grounded in the core concept and the relevant licensing.

## QA gates

- Preserve all 7 P01 learning goals, capstone and independent delayed review mapping.
- Verify genuine microscopy images are available locally and show source/limitations.
- Verify output and tracebacks using a fresh interpreter, plus varied calibration and manual counts.
- Pass mobile and desktop browser tests; ensure images are visible in introductory scenes, lesson state is untouched, and no MP4 functionality exists.
- Browser voice quality/pace must still be assessed on the learner's device; CI cannot validate installed voices.
- Have the learner test whether the end-of-lesson transfer question is independently doable. Failing to answer that is more informative than the beauty of an animation.

**Do not merge or promote to production until the user has reviewed P01 and found the learning content genuinely useful.**
