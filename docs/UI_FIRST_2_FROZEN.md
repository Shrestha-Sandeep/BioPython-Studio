# BioPython Studio — UI-first-2 design freeze

**Approved:** 2026-11-12  
**Status:** FROZEN: approved default user interface  
**Reviewed source SHA:** `cff4b2c621b50d24ff31a0b061ff5e1ffd96ca86`  
**Immutable-by-convention snapshot:** `frozen/ui-first-2-2026-11-12`  
**Development branch:** `ui-first-2`  
**Review PR:** [#30](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/30)  
**CI:** 15/15 successful workflow runs for the approved source SHA.

## Design contract

1. **Learn is the default.** Present the real task title, current Learn / Apply / Prove phase, concise active instructions, editable code, Run, optional Check and Back / Next. Do not add branding, IDE marketing labels, duplicate headings, or unnecessary filler.
2. **Explore is optional.** It reveals the existing scientific workspace, resizable panels, image viewer/comparison, diagnostics, reference, export, focus and advanced controls without changing the course or learner progress.
3. **Mobile is contextual.** Code / Image / Result views display only one workspace at a time. The image tab appears only for image chapters, Run reveals Result, and advancing to another learning task returns to Code.
4. **Scientific functionality is retained.** Existing Pyodide worker, original image/OME-TIFF handling, course material, hints, practice feedback, public checks, capstone exports, source attribution and scientific caveats remain intact.
5. **Progress is preserved.** Existing localStorage keys for chapter, goal, phase, drafts and practice progress are unchanged. Back / Next does not mark a task mastered.
6. **No aesthetic drift.** Only change the shell for demonstrated defects, new functional requirements, accessibility, usability, and scientific correctness. New content should not create additional persistent UI clutter.

## Preservation

Do **not** rebase, delete, or advance the `frozen/ui-first-2-2026-11-12` snapshot. Keep `frozen/ui-v2-2026-11-06` as the older rollback/design reference. The frozen snapshot is a source-code reference, not a claim that every lesson has been validated by human learners.

The production home is intended to remain `https://biopython-two.vercel.app`; release it from the approved implementation, not by making a mockup or a separate app.

## Verified scope

The approved head passed all 15 GitHub Actions checks, covering the new UI across five viewport sizes and the original course, Python execution, scientific imaging, sequence-analysis and advanced exercises. The original source file bodies and publication attributions are not removed to achieve the visual simplification.
