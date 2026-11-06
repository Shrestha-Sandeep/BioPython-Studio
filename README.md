# BioPython Studio — Clean rebuild

This is the **new, independent Witz-first rebuild** of BioPython Studio. It is deliberately a minimal frontend scaffold, not the older deployed 25-lesson app or Codex's development branch.

**Teaching direction:** Python → Microscopy → NGS → ML. Guillaume Witz's *Image Processing for Beginners* is the primary source; other materials support missing programming, scientific validation and specialized topics. One source-led scientific mini-goal per mission. Learn → Apply → Prove is always visible. Everything is unlocked. No gamification, duplicate competence lessons or clutter.

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

- **Implemented:** responsive accessible frontend; one linear course; 18 representative mission previews (not a claim of finished content); clear Learn/Apply/Prove stages; editable drafts saved locally; six authentic bundled Witz/HPA-derived notebook figure images; original source links.
- **Not implemented:** Pyodide/real Python execution, grading, full Witz exercise extraction, packaged microscopy images, mastery/retention, notebook export, NGS/ML teaching content depth. The Run Python button is intentionally disabled and states why. Nothing is marked complete.
- **Important:** progress in the previous app lives under other storage formats. A careful, opt-in migration tool is planned; this preview only saves drafts in its own key.

The full architecture, source rules, QA gates and feature roadmap are in [docs/PRODUCT_BLUEPRINT.md](docs/PRODUCT_BLUEPRINT.md) and [docs/SOURCE_LEDGER.md](docs/SOURCE_LEDGER.md).

**Isolation:** Production \`main\` and all existing draft PRs are untouched. This new branch resets the file tree by design. Do not merge it over the legacy app until release gates and progress migration pass.