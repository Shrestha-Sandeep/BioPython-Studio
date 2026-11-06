# BioPython Studio — new product and development blueprint

**Date:** 2026-11-06. **Status:** definitive direction for a clean rebuild; frontend skeleton only. **Source of truth:** this branch, not the accumulated standalone HTML prototypes or the chained Codex draft PRs.

## The one-sentence product

Teach a molecular biologist with no Python background to independently **write, debug, explain, and reproduce a genuine microscopy image-analysis workflow** using Python, then extend the same skills to NGS and introductory ML.

### Non-negotiable product decisions

- One **visible** path, always in this order: **Python → Microscopy → NGS → ML**. All lessons and stages are unlocked. Stage labels are navigation, not prerequisite gates.
- **Guillaume Witz's Image Processing for Beginners** defines the main pedagogical progression and central multi-image nuclear/nuclear-edge localization goal. It is the **primary**, not merely linked, reference for the Python-to-microscopy portion.
- *Python Data Science Handbook* (code and concepts), *Python for Biologists*, Carpentries image processing, Bankhead's *Introduction to Bioimage Analysis*, *Bio-image Analysis Notebooks*, Biopython and scikit-learn fill **specific gaps**, rather than repeating Witz's lessons.
- Present **one useful scientific mini-goal** across several connected learning steps; every step produces a visible result. The final mission reuses code accumulated from earlier steps.
- **Learn → Apply → Prove** is the persistent three-part model. Learn includes Predict/Run/Investigate/Modify/Write/Debug. Apply builds a reusable artifact. Prove uses independently solvable, unfamiliar inputs and a scientific justification. A later unexposed retrieval check can provide stronger mastery evidence.
- Progress reflects actual evidence, never mere page visits or green ticks. Hints are available but assisted work does not award independent mastery.
- **No duplicated teaching**: explain each concept once, then refer back and apply it. Repeated retrieval is explicitly marked as practice, not a new competency.
- **No clutter**: one course, one mission, one goal, one editor and relevant output. Hide advanced documentation, hints, sources and administrative controls behind unobtrusive disclosure.
- Large, readable typography, good contrast, mobile-friendly, keyboard and screen-reader usable. Don't fill the interface with metrics, decorative cards, badges or gamification.
- **Real Python** runs in a dedicated Pyodide Web Worker (not simulated, not an answer regex). Separate cold-start/timeout handling, explicit stdout/stderr/tracebacks, package version pinning and changing-input hidden tests.
- **Real microscopy data** with local packaged files where rights allow, consistent axes and provenance, plus display overlays. Separate RGB composite teaching pixels from quantitative TIFF/OME-TIFF data. Candidate regions are not validated cells.
- Real local Jupyter/Python/venv/Git transfer through exportable scripts/notebooks and reproducibility exercises.
- No external backend required for ordinary learning; opt-in backup/export and tested storage migrations for older learner progress. Avoid destructive resets.

## What the previous work taught us

Reviewed existing production \`main\`, frozen 61-lesson branch, v3 curriculum and 156-competency DAG, Witz-first mapping, Codex's pilot/core/audit/retention PRs, and standalone HTML prototypes. These are **design/reference/test assets, not the implementation base**.

Keep their best verified ideas: real Pyodide execution; progress preservation; authentic HPA provenance; scientific limitations; accessibility; short step feedback; original exercise source mapping; notebook handoff; delayed retention; transparent grading. Avoid their known failure modes: duplicated lesson sets and UIs, fake/generated images, remote image breakage, huge unreviewed content imports, hardcoded output checks, confusing navigation and claims of mastery based only on test counts.

Use the prior 156 competencies as a **coverage checklist**, not a target number of screens. The new lesson count will come from actual Witz chapter/exercise alignment, minimum needed supporting material and learner evidence. There is no obligation to implement 156 separate pages or re-create 32/26 old mission counts.

## Curriculum source extraction

1. Freeze a **source inventory** of Witz's 9 principal notebooks, 7 exercise notebooks, appendices and demo: record URL, pinned Git commit/blob SHA, notebook cell index, skill, biological mini-goal, expected output, needed packages and authentic dataset.
2. For every candidate exercise, record an action: **reuse with license/attribution; adapt for a mini-mission; reference only; skip as redundant or unsuitable**. Do not paste entire textbooks into the UI.
3. Add a concept-ownership column so every Python/NumPy/image-processing competency is introduced once. All later references are applications, reviews or transfer.
4. Keep task wording and code compatible with maintained Python/scikit-image/Pandas APIs; fix outdated data URLs and changed function signatures with tests. Show the original source and a short modification note.
5. For each reused prompt build **genuine Python I/O**, meaningful output or overlay, informative test feedback, two or three progressive hints and an independent unseen-input challenge.
6. Supporting sources should enter only where Witz leaves a meaningful gap: Python file/error/CLI/venv/Git skills; scientific measurement validity and metadata; biological replicates; NGS/ML specialty.

## Course sequence

| Stage | Purpose | Real deliverable |
|---|---|---|
| Python — essentials | Minimum needed variables, types, strings, decisions, loops, functions, files and debugging | A small specimen metadata + measurement QC script |
| Microscopy — Witz-led | Image loading, arrays, channels, histograms, ROI, thresholds, filtering, labels, regions and multi-image analysis | Reusable microscopy pipeline comparing nuclear interior and edge signals, with overlays and output tables |
| NGS | Reuse Python for validated DNA strings, FASTA/FASTQ, read QC and transparent counts | Small sequence-quality and report workflow |
| ML | Learn leakage-safe experimental design and transparent baseline modelling | Group-aware classifier/report on specimen-derived features |

**Scientific image-workflow guardrails:** No JPEG-to-absolute-fluorescence claims; no conflation of microscope fields with biological replicates; no cell counts without annotation/error assessment; preserve sample metadata; use physical units only if calibration exists; distinguish training and independent specimens.

## Technical design

- **One static web app**, minimal HTML/CSS/JavaScript modules initially; no framework or server needed at runtime beyond static hosting. GitHub is source truth; deploy previews only from this branch, never overwrite production until accepted.
- \`src/course.js\` currently contains **preview mission outlines**, not completed assessed lessons. Production content will be structured JSON/JS schema with source provenance, preview assets, step objectives, worked examples, changed-input tests, an apply project and unseen proof.
- **Pyodide Web Worker** added next. Separate UI state from execution. Fresh namespace for graded runs; persistent state only in explicit notebook labs. Timeout terminates/restarts worker; graceful package-download failures and offline status. Browser sandbox is not a hardened security boundary.
- **Local storage** is for learner drafts/progress; add schema versions, backup import/export, and a migration path for existing records. Do not automatically overwrite older app keys or award new mastery.
- **Images** packaged with rights/attribution and integrity hashes; browser preview has publisher fallback. For quantitative work, use actual metadata-rich TIFF/OME-TIFF where available and scientifically defensible.
- Keep tests modular: unit/content-schema tests, CPython reference tests, Pyodide real-engine browser tests, download/CORS/no-network fallback tests, progress migration fixtures, usability/accessibility checks.

## Development increments (every increment requires demonstrable acceptance)

**0 — Baseline and safeguard.** Archive branch/PR inventory with exact SHAs; keep main/old PRs unchanged; create a fresh branch whose new root tree contains no legacy app files. *Done with this scaffold.*

**1 — Fast frontend and interaction.** Four-stage path, mission list, one science goal, Learn/Apply/Prove tabs, readable code editor, concise source attribution, mobile and keyboard navigation. No fake execution. **Exit:** navigable on phone/desktop, all missions accessible, drafts persist, accessibility checks pass.

**2 — Real Python kernel.** Pyodide Worker, stdout/tracebacks, package loading, variable input tests, execution timeout/reset, useful failure messaging. **Exit:** cold browser runs actual Python and NumPy with real input changes; incorrect code fails authentic tests; UI remains responsive.

**3 — Primary Witz source ingestion.** Audit exact exercise cells for all lesson/exercise notebooks; select 1–2 connected scientific mini-missions for implementation. **Exit:** each included prompt has a source trace, license, authentic outcome, progressive feedback and no duplicated skill.

**4 — Beginner route to first image.** Implement essentials, lists/loops/functions, then load a bundled/attributed fluorescence image. **Exit:** learners can complete an unfamiliar QC script and inspect real image shape/channel without copying expected output.

**5 — Complete Witz microscopy pathway.** Arrays → histograms → thresholding → filtering → regions/measurements → pipeline. **Exit:** a multi-image pipeline actually works with provenance and validated overlays; failures and calibration limits are taught.

**6 — Reproducibility and independent proficiency.** Add tested notebook/script export, real file workflow, quality controls, sample-level statistics and an unseen research task. **Exit:** independently reproduce an image analysis from a clean local Python/Jupyter setup.

**7 — NGS pathway.** Biopython and sequence/FASTQ exercises from supporting sources, no re-teaching variables/loops. **Exit:** run a simple real-sequence QC program.

**8 — ML pathway.** Specimen-group-aware splits, baseline models, error analysis and meaningful unseen evaluation. **Exit:** explain and demonstrate why a leaked model is invalid and evaluate a defensible baseline.

**9 — Release quality.** Human usability audit and accessibility, CI green, real Pyodide/browser image tests, image license/source manifest, progress migration and old-branch archival policy. **Exit:** production deployment and branch promotion only after these pass.

## Completion rules

- A sprint is not complete because a page renders. It must show **actual learner behavior** and automated evidence, with independently evaluated scientific outputs.
- A task is not mastered because three expected stdout strings matched; test outputs and decisions, including boundary cases, parameter changes and explanations.
- No production merge, progress migration or removal of old work before verification. Keep one canonical design document and one source ledger, not a proliferation of one-off plans.

## Current implementation status

Only **Step 0 and the initial Step 1 frontend scaffold** are present. The design-preview Run button is intentionally disabled. The 18 listed mission cards are placeholders for selecting a clear visual system, **not a claim that all Witz exercises have been extracted, shipped or assessed**.