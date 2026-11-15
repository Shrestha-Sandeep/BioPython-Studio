# A00 — Research-first narrated tutorial blueprint: from browser exercise to reproducible local biology

**Date:** 2026-11-14  
**Parent:** `feature/ml-tutorial-cycle-l03` (draft PR #56).  
**Branch:** `feature/advanced-tutorial-cycle-a00`; **production guard:** do not merge or deploy without learner review.  
**Canonical:** `content/chapters/A00_COMPLETE.md`, five goals A00-G01–G05, A00-CAPSTONE and independent A00-REVIEW.  
**Local exit gate:** `projects/advanced/a00/START_HERE.md` and `bridge.py`.  
**Method:** `docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md`.  
**Target:** 16 learner-controlled scenes; original SVG diagrams; correct executable Python; held-back prediction; independent unsolved transfer.

## 1. Research and why this chapter exists

The normal 26 chapters stop at L03. This chapter begins the **already existing optional advanced laboratory** (`/?lab=advanced`); it does not create P07 or an extra compulsory learning stage.

- [The Carpentries: Software Carpentry](https://swcarpentry.github.io/) sequences shell, Git and a programming language as transferable scientific practice. **Adaptation:** present a single microscope-measurement workflow, not an unrelated command reference.
- [The Carpentries: Building Better Research Software](https://carpentries-incubator.github.io/better-research-software/) places environment management, tests, version control and documentation into reproducible research. **Adaptation:** motivate each technical technique with a failure it prevents.
- [Python Packaging User Guide: install via pip and venv](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/) explains venv isolation and platform-specific commands. **Adaptation:** distinguish a local project interpreter from a browser Pyodide interpreter; `python -m pip` targets the invoked Python.
- [Python Packaging: virtual-environment specification](https://packaging.python.org/en/latest/specifications/virtual-environments/) defines virtual-environment isolation and explains `sys.prefix != sys.base_prefix`. **Adaptation:** use interpreter identity as an auditable datum, never claim that a successful browser check proves a local venv.
- [Scientific Git version control](https://swcarpentry.github.io/git-novice/) emphasizes meaningful committed source history rather than `final_final_v3` copies. **Adaptation:** show `git status` / `git rev-parse HEAD` as explicit future desktop actions, not executed output.
- Existing A00 bridge and competence assessments are the authority for file-path validation, independent biological units, SHA-256, changed inputs, and project-exit evidence. Do not present the video as completion of them.

**Novelty constraint:** The purpose is not another installation walkthrough. The learner must see *what code can do*: a small source table becomes an animal-level report, while a content fingerprint and tests prevent a quietly changed dataset from masquerading as the same experiment.

## 2. Failure-first motivating case

A colleague sends a `microscopy_fields.csv` with 4 rows representing **2 animals**, one of which was imaged three times. An analysis reports `n=4`, mutates the CSV, or combines a newer configuration with an older dataset; the resulting reported precision is misleading. The repaired workflow:

`source bytes → path safety → interpreter identity → reusable aggregation (biological n) → tests → source/config hashes → Git/replay evidence`.

All microscopy values and specimen IDs are **synthetic**. A four-row fixture can demonstrate sound programming, not validate exopher counts or any biological conclusion. A digest proves byte identity, not data correctness or authenticity. Local Git does not establish scientific validity.

## 3. Teaching sequence and diagram plan

| # | Goal | Narrated concept and required response | Original scientific SVG |
|---:|---|---|---|
| 1 | G01 | Final capability: traceable animal-level report with source and software identity | Route from CSV → subject means → hash/test → report |
| 2 | G01 | Browser Pyodide vs local Python/Jupyter kernel; no false desktop PASS | Two distinct interpreters |
| 3 | G01 | `sys.executable`, `sys.prefix`, `sys.base_prefix` and installed package versions | Interpreter identity card |
| 4 | G01 | Create venv; `python -m pip`, cross-platform entry; commands are **instructions**, not actions | Host → isolated environment diagram |
| 5 | G02 | `../` and absolute path can escape a raw-data folder | Reject traversal and absolute paths |
| 6 | G02 | Resolve/validate a descendant path before opening, and reject symlink escape | Safe root vs outside |
| 7 | G03 | Four image fields but two animals; biological n=2 | Animal A three fields, B one |
| 8 | G03 | Pure function aggregates per animal rather than conflating fields | Group → mean values |
| 9 | G03 | **Predict:** means of A=(4,6,8), B=(10), n=?; hide output and final values | Hidden result visual |
| 10 | G03 | **Reveal:** A=6, B=10, n=2 | Biological unit report |
| 11 | G04 | `assert` checks boundary equality and missing values, not just happy path | Test table: >= cutoff |
| 12 | G04 | Changed-input and error tests catch unsafe assumptions | Fail then repair flow |
| 13 | G05 | Hash the original bytes; data filename alone is ambiguous | Distinct contents, distinct hash |
| 14 | G05 | Hash canonical config JSON with sorted keys; distinguish metadata/config from source | Same config different insertion order |
| 15 | CAPSTONE | Local handoff: run real bridge, tests, immutable original TIFF/CSV, document interpreter, Git SHA | Reproduction evidence bundle |
| 16 | CAPSTONE | **Unsolved transfer:** new source, uneven biological field counts, unsafe paths, new config | Checklist without solved outputs |

The canonical A00-REVIEW remains a **delayed independent task**. It is not completed by watching the tutorial and must not have its solved reference values exposed. The same applies to Apply/Prove hidden tests.

## 4. Working examples and expected output contract

Use **real runnable Python**, not made-up terminal replies.

- G02: `from pathlib import PurePath` alone is not a symlink-security solution. Show clear portable lexical checks for demonstrations, and explain why a **real local** implementation must call `Path.resolve()` and `is_relative_to(root.resolve())`; paths must not be opened before containment validation. Explain that path prefix-string comparisons are unsafe.
- G03: `[('A',4),('A',6),('A',8),('B',10)]` → `{'A': 6.0, 'B': 10.0}`, `fields=4`, `biological_n=2`. Values are sample measurements only.
- G04: `>= 0.8` includes exactly `0.8`; `None` must be flagged as missing without `TypeError`.
- G05: use `hashlib.sha256(raw).hexdigest()`; output show prefix of 12 characters on *bytes*, explicitly label output as prefix, never fabricate a full 64-character hash. For config canonicalization use `json.dumps(config, sort_keys=True, separators=(',',':')).encode('utf-8')`.
- Python code outputs in scenes must be verified by actual CPython; locally variable outputs (executables, paths, Git SHA) must be illustrative instructions with no fixed claimed result.
- **Checkpoint**: scene 9 output empty/withheld; scene 10 reveals after learner chooses Next/Reveal. Never leak target elsewhere in scene 9 note/visual/speech.
- One-sentence narration per concept segment or short pair of sentences; no scripts that cannot be read in a calm spoken voice. Browser TTS remains selectable by the learner; no MP4 export.
- Original SVG diagram every scene, accessible `role=img` with data-specific `aria-label`, fixed viewBox, mobile safe. Meaningful contrasts between source fields, group means, identity hashes, tests; no decorative stock images.

## 5. Architecture and invariants

- Add `src/tutorials/a00-data.js`, `src/tutorials/advanced-illustrations.js`.
- Load both **before** `p01-viewer.js` in `index.html`.
- Extend `src/tutorials/p01-viewer.js` tutorial catalog and illustration dispatcher with optional A00; do **not** add a new permanent panel, alter CodeMirror, course-adapter progress, saved drafts, Apply/Prove or keyboard shortcuts.
- Only make chapter example available for A00 **Learn** goals and capstone when `/?lab=advanced`; keep the standard route's visible navigation unchanged. Tutorial cannot mark local gate complete.
- Do not embed third-party text/images as copies. Local SVGs are original transformations of concepts. Numeric images and data are made-up training fixtures.

## 6. Falsifiability and QA gates

1. Node syntax for new and altered JS; scene-schema assertions, unique IDs, goal coverage, 16 steps, one prediction checkpoint, no premature answer, independent transfer empty.
2. Real CPython output of each nonempty, non-comment example; float rounding and JSON canonicalization exactly matched. At least six changed-input tests: field count vs biological n, new animal group, cutoff equality, missing signal, unsafe sibling path, same config reordered, changed bytes different hash.
3. Playwright Chromium at 390×844 and 1280×850 with real app and `/?lab=advanced`: A00 entry accessible only on Learn; 16/16 scenes; SVG presence; checkpoint hidden before reveal; narration controls; mobile no horizontal overflow; Escape closes; editor value and A00 localStorage unchanged after tutorial; Apply/Prove hidden; A00-REVIEW no tutorial button.
4. Standard `/` route keeps original 26 chapters, no A00 visible entry; no accidental prerequisite-progress changes.
5. GitHub Actions dedicated advanced narrated tutorial workflow validates browser, Python, and shared frontend/advanced course smoke. If failed: record issue, fix, rerun; cannot declare green from author assertions.
6. **Exit gate remains human and local:** a genuinely new CSV/TIFF, real environment and package list, real unit tests, clean checkout and Git commit SHA. Do not claim these from generated tutorial or CI.

## 7. Review decision

**GO for drafting** if tutorial follows genuine A00 skills, tells a compelling end-to-end story, and passes its automated gates. **HOLD deployment** until the learner tries it and the independent local bridge test is completed. Continue to A01 only after checking this chapter's code and browser QA; do not build a fake local shell inside Pyodide.
