# UI-first-2 — Learning-first presentation

**Branch:** `ui-first-2`  
**Base:** `advancement/x01-fiji-napari-first-bridge`  
**Status:** Isolated preview; **not** the frozen UI v2 snapshot, and not merged to production.

## Default: Learn
- Remove app branding, IDE jargon, duplicate headings and empty feature descriptions.
- Show the *actual* task title with the current Learn / Apply / Prove phase.
- A single real Python editor and **Run** remain the primary interaction.
- **Check** appears only when the underlying activity supports a public practice check.
- Back / Next navigate existing task phases and the next goal. Navigation **never** marks an activity as mastered.
- Lessons remain freely selectable. No artificial progress gating.
- Advanced code/file controls are hidden, not deleted.
- Local saved chapter/goal/draft/progress keys remain unchanged.

## Optional: Explore
- Uses the **same** real editor, Python runner, image viewer, image inputs, comparison controls and results.
- Shows advanced file, focus, result and diagnostic controls when needed.
- Does not switch apps, create fake data or separate progress.
- Navigation drawer can still select subjects and chapters.

## Mobile
- Code / Image / Result tabs display one workspace at a time.
- Image tab appears only in an imaging subject.
- The Result tab is selected after Run; changing learning phase returns to Code.
- Tablet/desktop retains side-by-side editor and image comparison when width allows.

## Accuracy / provenance
- Data-source attribution and technique limits remain documented in lesson files and code comments.
- TIFF images are staged as original files for Python; browser canvas RGB preview is not calibrated microscopy analysis.
- Scientific analysis and learner mastery are not fabricated by this UI layer.

## Verification
- `.github/workflows/ui-first-2.yml`: syntax, JS contracts, course/storage contracts, and Playwright screenshots at five viewport widths.
- `tests/ui_first_2_browser.py`: genuine lesson import and navigation, preserved code, Learn / Explore, image comparison, mobile tabs, and persistence.
- Keep the branch separate from `main` and `frozen/ui-v2-2026-11-06` until explicitly accepted and merged.

## Files modified
- `index.html`
- `src/ui-first-2.css` and `src/ui-first-2.js`
- Minimal existing shell/adapter changes in `src/ui-first.js` and `src/course-adapter.js`
- New UI-specific tests and workflow
