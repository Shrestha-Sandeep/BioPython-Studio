# BioPython Studio — UI-first IDE

**Development branch:** \`feature/ui-first-ide-workspace\`

This is an isolated **interface-only** design for a single learner, based on the Witz-first clean rebuild. It does not modify the deployed production app or the current curriculum and source inventory.

## Preview locally

\`\`\`sh
python -m http.server 8000
\`\`\`

Open http://localhost:8000. The app is static and uses no backend. The enhanced Python editor loads pinned CodeMirror 5.65.21 files from jsDelivr; when the editor scripts are unavailable, a functional native text editor is used instead.

## Interface in this branch

- **Code editor:** CodeMirror Python highlighting, indentation, line numbers, matching brackets and cursor position, plus separate draft persistence per workspace. Basic fallback is still editable.
- **IDE layout:** one visible Python → Microscopy → NGS → ML path, collapsed-by-default Learn / Apply / Prove placeholder, dark/light themes, keyboard-accessible reference panel and focus mode.
- **Resizable workspace:** draggable editor/image divider on desktop and an editor/console-height control; accessible keyboard separators. Responsive vertical stacking on tablets and phones.
- **Image viewer:** open local browser-supported PNG/JPEG/WebP/GIF images; zoom, pan, drag/drop, browser RGB channel display and pixel-coordinate/value preview. Nothing is sent to a server. Only image previews are loaded; Z/T and multi-channel TIFF controls intentionally remain disabled.
- **Results:** separate Output, Measurements and Histogram panes, all honest empty states.
- **QA:** Node contracts and browser checks across 360, 390, 768, 1280 and 1440 pixel widths; CI runs on branch changes.

## Explicit non-features

No lesson content, exercise solutions, dataset processing, true Python/Pyodide execution, tests, grading, scientific segmentation, raw pixel calibration, TIFF/OME-TIFF decoding, image overlays, Z-stacks or time-series navigation are implemented here. **Run is disabled**. RGB values from a browser-loaded composite must not be interpreted as calibrated fluorescence intensities.

The existing Witz course files and other research remain in the repository, not loaded into the visible interface. Existing learner-progress storage is untouched. This prototype stores only drafts, theme and layout preferences in \`biopython.ui-first.v1\`. Image files are temporary session data and are not persisted.

Do not merge into \`main\` until the interface is accepted and execution/progress compatibility is designed and tested.
