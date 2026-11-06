# BioPython Studio — UI-first rebuild

**Current default interface: a content-free learning workspace.** Python, Microscopy, NGS and ML use one consistent shell; the Microscopy stage opens an adaptive image-analysis view. There are no loaded lessons, demonstrations, simulated results or working Python execution in this UI-first build. Editing code, switching learning phases, saving draft text locally, theme switching, opening the reference drawer and previewing a local PNG/JPEG/WebP image are available. Real scientific TIFF/OME-TIFF loading and quantitative analysis are **not** implemented yet.

The earlier Witz-led mission outlines, source inventory and genuine notebook figures remain in the repository **for later content integration** but are not shown in the default interface. This is the independent rebuild branch, not the production `main` app or Codex's stacked v3 development branches.

**Teaching direction (future content):** Python → Microscopy → NGS → ML. Guillaume Witz's *Image Processing for Beginners* is the main source; supporting materials fill genuine gaps. Learn → Apply → Prove is the shared interface structure, not an assessment system yet. Everything is unlocked, with no gamification or clutter.

## Local preview

Serve the folder rather than double-clicking the HTML file, because the interface uses native JavaScript modules:

    python -m http.server 8000

Open http://localhost:8000. This build requires **no npm installation** for its frontend.

## Witz source integration

- The rebuild now audits **all 54 numbered exercises** from Witz's seven exercise notebooks. **47 are reachable** inside eight source-driven preview missions, one exercise at a time, with cumulative editable code.
- **Twelve** original Witz worked-code excerpts are now available as a collapsed reference inside the relevant Learn screens, each linked to a precise source cell.
- **Six** Witz notebook figure PNGs are bundled and load from the project itself, with exact source-cell attribution. The original microscopy TIFFs remain linked upstream and are **not bundled yet**.
- Supporting references strengthen specific missing concepts (NumPy, biological files, segmentation validity and reproducibility) rather than duplicating the Witz teaching path.
- The figures are visualization examples, **not calibrated numeric image files**. The real Python engine, image-array processing and grading remain subsequent work.
- Exercise inventory: [`curriculum/witz_exercise_inventory.json`](curriculum/witz_exercise_inventory.json). License and images: [`assets/witz/CREDITS.md`](assets/witz/CREDITS.md).

## Current boundary

- **Implemented in the visible UI:** responsive dark/light learning shell; four navigable stages; Learn/Apply/Prove phase tabs; separate local Python drafts per stage; keyboard-accessible editor and line numbers; collapsible reference panel; Microscopy image preview with zoom, pan and drag/drop; empty output/measurement panels. These are interface behaviors, not teaching content or image analysis.
- **Preserved, but not loaded in the current UI:** 18 preliminary mission outlines, Witz source/exercise indexes, and six attributed notebook figures.
- **Not implemented:** loaded lessons/exercises, Pyodide/real Python execution, scientific TIFF/OME-TIFF processing, segmentation, measurements, grading, mastery/retention, notebook export or NGS/ML teaching depth. The Run button is intentionally disabled and nothing is marked complete.
- **Important:** progress in the previous app lives under other storage formats. A careful, opt-in migration tool is planned; this preview only saves drafts in its own key.

The full architecture, source rules, QA gates and feature roadmap are in [docs/PRODUCT_BLUEPRINT.md](docs/PRODUCT_BLUEPRINT.md) and [docs/SOURCE_LEDGER.md](docs/SOURCE_LEDGER.md).

**Isolation:** Production \`main\` and all existing draft PRs are untouched. This new branch resets the file tree by design. Do not merge it over the legacy app until release gates and progress migration pass.