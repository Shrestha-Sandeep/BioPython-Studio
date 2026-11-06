# BioPython Studio — independent course content (pilot v1)

This directory contains **original, UI-independent instructional material** for the frozen 156-competency BioPython Studio v3 syllabus. It builds on the 26 Witz-led missions in `curriculum/witz_spine.json`. It does not create a second syllabus, change competency IDs, alter navigation, or claim that 156 lessons are written.

## Pilot coverage

| Mission | Chapter | Authored activities | Competencies covered |
| --- | --- | ---: | --- |
| P01 | [A scientific Python program](chapters/P01.md) | 4 | 001–007 |
| P02 | [Sample labels and quality decisions](chapters/P02.md) | 3 | 008–011 |
| P03 | [Microscope-field loops and collections](chapters/P03.md) | 5 | 012–018 |

The 12 activities and their reference checks are in `activities/foundations.json`. This is a **content/assessment pilot**, not a wired or browser-tested production course. Run `python -m unittest discover -s content/tests -v` to check the reference programs, competency coverage and contract. Run against CPython 3.10+; no external packages required.

## Content contract

- `content/manifest.json` — ordered chapter and activity references and import-contract version.
- `content/chapters/*.md` — readable, original explanation; accessible independently of the UI.
- `content/activities/foundations.json` — structured activities with stable IDs, competency IDs, prediction, explanation, code, tasks, hints, changed-input checks, delayed transfer prompts, scientific cautions and source references.
- `content/tests/test_foundations.py` — executable reference-solution and content integrity checks.
- `content/SOURCE_AUDIT.md` — per-source mapping, reuse boundaries and identified corrections.

**Import guidance:** A future UI adapter should read the manifest, Markdown, and activity JSON without rewriting them or introducing new progress identifiers. Never import reference solutions and hidden checks into publicly exposed graded client state as secrets: client-side code cannot protect hidden assessments. The current checks are primarily **authoring regression tests**. They are not proof of student mastery.

## Teaching contract

Use a small worked example → prediction → learner run → investigate → modify → blank-editor reconstruction → debug/transfer. Do not force every phase into a separate page. Use **real Python execution**, allow feedback on tracebacks and wrong assumptions, and award *independent* evidence only from unfamiliar inputs without revealing solutions beforehand. Repeat delayed transfer on changed input after an actual elapsed interval.

Keep biological descriptions honest: a field is not an independent biological replicate; image-display pixels are not calibrated fluorescence; QC exclusions must be documented. Avoid gamification, rankings, streaks, and motivational copy. Code and tasks get priority in the frozen IDE.

## Scope and review

These chapters cover basic Python with **biological records** rather than analyzing real pixel arrays prematurely. The first genuine attributed microscopy image belongs to the later image chapters beginning I01, although the already selected UI can show context images. Witz is the course spine; Python Data Science Handbook and Python for Biologists are gap-filling references. Source exercises are mapped, not falsely marked imported or completed.

This branch is intentionally stacked on `feature/witz-first-learning-spine`, not merged into the frozen UI branch.
