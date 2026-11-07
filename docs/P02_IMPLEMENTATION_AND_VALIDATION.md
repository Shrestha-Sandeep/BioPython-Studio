# P02 — Implementation, scientific validity and acceptance record

**Chapter:** P02 — Create trustworthy sample labels  
**Status:** authored and implemented; real-browser and CPython verification required at this commit; independent learner trial remains the final pedagogical acceptance gate.  
**Learner integration:** `integration/p02-ui-first` (base: `integration/p01-ui-first-pilot`)  
**Authoring:** `content/p02-complete-v1` (base: `content/p01-complete-v1`)

## Chapter outcome

A learner can construct labels from changing specimen metadata, parse structured identifiers, reason about inclusive numerical thresholds, and write explicit if/elif/else acceptance or rejection rules. They can independently transfer the method to a new naming convention and explain why a flawed label is not a biological quality observation.

## Frozen curriculum mapping

- `P02-G01` — competency 008, informative strings
- `P02-G02` — competency 009, parsed identifiers and malformed structure
- `P02-G03` — competency 010, comparisons and declared thresholds
- `P02-G04` — competency 011, conditional QC explanations

Capstone and later review are **not new competency IDs**. The 26-chapter route and P01 mapping remain unchanged.

## Authentic science versus synthetic training data

- Witz / Human Protein Atlas fluorescent-cell images are contextual, correctly credited in `assets/witz/CREDITS.md`.
- All sample IDs, site/plate codes, QC scores, exclusions and threshold numbers are invented training fixtures.
- Example thresholds, the 0–1 range and the ID format are **declared pedagogical policies**, not validated microscope-acquisition QA criteria.
- An imaging field is not an independent biological replicate. A seemingly valid ID does not prove that an image was acquired under the claimed treatment.

## Deliverable

`sample_label_validator.py` from the chapter's Apply or independent Prove capstone. It should read input fields, validate the raw identifier without silently repairing it, reject malformed structure and components before comparing a score, apply an inclusive predeclared threshold, produce an exact reason for rejection, and print a traceable report. The source can be exported and run as CPython.

Known critical edge cases: extra underscore / new delimiter, empty fields, malformed plate prefix, non-ASCII digit lookalikes, unknown condition, score exactly at minimum, below minimum and outside range. All are included in reference fixtures. A later transfer uses a new delimiter and code letter.

## App integration

The chapter selector loads P01 and P02 using the same pinned Pyodide worker. P01 retains its historical local progress key `biopython.p01.v1`; P02 uses `biopython.p02.v1`. The chapter preference uses `biopython.course-selected.v1`.

P01 and P02 still use the frozen Learn / Apply / Prove tabs, a single editor and a console. An in-panel textbook explanation, worked prediction, optional hints, authentic context image, scientific reflection, export and delayed review are shown only when relevant.

## Quality gates

1. `python -m unittest discover -s content/tests -v` on the content branch must pass all author-side Python reference solutions on changed-input fixtures.
2. `python tests/test_p02_import.py` on the integration branch must verify exact 4/4 canonical competencies, complete capstone/review schema and **no author reference JSON in the learner import**.
3. `node --check src/course-adapter.js`, `node --check src/course-teaching.js` and original frozen-shell tests must pass.
4. `python tests/browser_smoke.py` must preserve original shell behaviors. `python tests/test_p01_browser.py` must preserve P01's working script, tracebacks, draft persistence and export.
5. `python tests/test_p02_browser.py` must prove real Pyodide execution, changed-input detection, **all 11 Apply and 10 Prove capstone cases**, separate P01/P02 progress, standalone exported-script execution in CPython, delayed return record, 390px and desktop QA, and no browser errors.
6. GitHub Actions `P02 two-chapter integration` must be green for the final integration commit; Vercel preview READY for that same commit.

Passing these establishes **technical implementation quality**. Human learner performance, motivation and scientific interpretation are not automatically graded, and no 9.5+/10 educational-effectiveness claim is made.

## Release gate and next step

Keep content PR #13 and integration PR #14 as drafts until user completion reveals no material teaching problems. Do not merge with production `main` and do not modify the frozen UI-first branch merely to surface P02. Progress to P03 only after assessing P02's actual learning experience.
