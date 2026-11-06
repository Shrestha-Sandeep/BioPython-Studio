# BioPython Studio — Clean rebuild

This is the **new, independent Witz-first rebuild** of BioPython Studio. It is deliberately a minimal frontend scaffold, not the older deployed 25-lesson app or Codex's development branch.

**Teaching direction:** Python → Microscopy → NGS → ML. Guillaume Witz's *Image Processing for Beginners* is the primary source; other materials support missing programming, scientific validation and specialized topics. One source-led scientific mini-goal per mission. Learn → Apply → Prove is always visible. Everything is unlocked. No gamification, duplicate competence lessons or clutter.

## Local preview

Serve the folder rather than double-clicking the HTML file, because the interface uses native JavaScript modules:

    python -m http.server 8000

Open http://localhost:8000. This build requires **no npm installation** for its frontend.

## Current boundary

- **Implemented:** responsive accessible frontend; one linear course; 18 representative mission previews (not a claim of finished content); clear Learn/Apply/Prove stages; editable drafts saved locally; existing Human Protein Atlas publisher image shown where available; original source links.
- **Not implemented:** Pyodide/real Python execution, grading, full Witz exercise extraction, packaged microscopy images, mastery/retention, notebook export, NGS/ML teaching content depth. The Run Python button is intentionally disabled and states why. Nothing is marked complete.
- **Important:** progress in the previous app lives under other storage formats. A careful, opt-in migration tool is planned; this preview only saves drafts in its own key.

The full architecture, source rules, QA gates and feature roadmap are in [docs/PRODUCT_BLUEPRINT.md](docs/PRODUCT_BLUEPRINT.md) and [docs/SOURCE_LEDGER.md](docs/SOURCE_LEDGER.md).

**Isolation:** Production \`main\` and all existing draft PRs are untouched. This new branch resets the file tree by design. Do not merge it over the legacy app until release gates and progress migration pass.