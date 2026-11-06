# BioPython Studio — UI-first IDE branch

This branch is an **interface-only prototype**, based on the clean Witz-first rebuild. It is **not** the legacy production app and does not replace the existing curriculum work.

**Branch:** \`feature/ui-first-ide-workspace\`

## Preview locally

\`\`\`bash
python -m http.server 8000
\`\`\`

Open http://localhost:8000. No installation or backend is required to preview the interface.

## Included

- Dark-first, light-optional, uncluttered responsive IDE layout.
- One learning path: Python → Microscopy → NGS → ML.
- Learn / Apply / Prove panels with neutral placeholders only.
- Editable Python text area, line numbers, tab indentation and locally persisted drafts.
- Two workspace modes: Code and Image analysis.
- In image mode, an adjacent viewer for **manually opened** local PNG/JPEG/WebP/GIF files, with zoom/pan and pixel dimensions. The image is not uploaded to a server or saved after reload.
- Output and Measurements placeholders, collapsible contextual reference, mobile course drawer and keyboard-accessible tabs.
- Automated UI contract tests and browser smoke checks.

## Intentionally not included

There are **no lesson bodies, course exercises, dataset imports, assessments, Python runtime or image-processing algorithms** in this branch's visible UI. The Run button is disabled by design; any data shown in the image viewer is only a user-chosen static preview, not an analysis result.

Existing \`src/course.js\`, Witz source inventory and assets remain in the repository for later content integration but are not loaded into the shell. Existing learner progress keys from previous versions are not read, reset or overwritten. This preview uses its own key \`biopython.ui-first.v1\` for editor drafts and theme.

Do not merge this branch into \`main\` until design review and the subsequent learning/runtime integrations are ready.
