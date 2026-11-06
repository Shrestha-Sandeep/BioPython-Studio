# BioPython Studio — UI design freeze (v2)

**Status:** FROZEN — approved interface baseline  
**Approved:** 2026-11-06  
**Source branch:** `feature/ui-first-ide-workspace`  
**Frozen source commit:** `34736ad6f565f22beee3b3fd259b315a197ed376`  
**Preservation branch:** `frozen/ui-v2-2026-11-06`  
**Design PR:** [#9](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/9) (draft; not merged)  
**Passed CI:** [run 42295368959](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/42295368959)

## Decision

Freeze the **visual architecture and interaction model** of the UI-first prototype. The purpose is to stop discretionary redesign and prioritize **real Python execution, Witz-led learning, and scientifically valid image analysis**. This does **not** certify the full teaching application, its content, or Python runtime, which remain unimplemented.

The preservation branch points at the exact reviewed-and-tested code commit, independently from subsequent development or documentation commits. Do not move or repurpose that branch.

## Locked interface decisions

- A single application with contextual **Code** and **Image analysis** workspaces, rather than separate apps or websites.
- Dark-first, light-optional, high-contrast, readable, restrained aesthetic; no streaks, gamification, dashboards, motivational copy, or decorative cards.
- Persistent scientific learning path **Python → Microscopy → NGS → ML** in a minimal navigation rail; lessons are not yet populated.
- Compact, collapsible **Learn / Apply / Prove** lesson area; one active learning task at a time.
- Main emphasis on the editable **CodeMirror Python IDE**, with locally bundled MIT-licensed assets and a native editor fallback; preserving drafts.
- Output console with contextual **Output / Measurements / Histogram** panes; collapsible reference area; optional Focus mode.
- Resizable desktop editor/image and console areas, with keyboard-accessible adjustments; vertically stacked mobile adaptation.
- Image viewer with local browser-supported still images, zoom, pan, RGB channel preview and coordinate/readout; optional **Original / Comparison** side-by-side, overlay, and wipe modes. Overlay/wipe only for equal-sized inputs; no automatic registration.
- Progressive disclosure: unavailable Z/T functions hidden; comparison controls shown only when meaningful.

## Boundaries and continuation

**Not a frozen feature-complete application.** In this version the Python Run button is disabled; no Pyodide execution, lessons, grading, calibrated image analysis, TIFF/OME-TIFF arrays, biological measurements, segmentation, registration, or scientific outputs are implemented.

Future development should plug curriculum, Pyodide, image arrays and test feedback into these pre-established surfaces **without redesigning the shell by default**. Allowed UI changes are narrowly scoped to demonstrated bugs, accessibility failures, viewport problems, scientific correctness, and usability issues discovered with real learning content. Document deviations explicitly, with evidence, before implementing them. Do not let new content/features create uncontrolled clutter.

**Release gate:** Keep PR #9 as a draft, leave `main` untouched, and reconcile with the advancing `rebuild/witz-first-v1` branch before any merge. Preserve existing learner progress and the frozen source baseline.

**Next phase:** Implement a real Pyodide execution engine plus a short initial Witz-aligned lesson flow with a genuine microscopy example; validate this against the locked workspace.
