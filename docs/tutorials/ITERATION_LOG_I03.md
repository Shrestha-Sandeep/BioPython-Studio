# I03 tutorial iteration log

Date: 2026-11-13
Branch: feature/imaging-tutorial-cycle-i03
Base: feature/imaging-tutorial-cycle-i01-i02
Design: docs/tutorials/I03_RESEARCH_BLUEPRINT.md

**Decision: GO for user review, not yet an independent learner assessment.**

Research and canonical mapping:
- Audited I03_COMPLETE.md: I03-G01 through I03-G10 and I03-CAPSTONE.
- Reviewed NumPy documentation on broadcasting, dtype promotion and overflow; used Witz/HPA notebook PNG only for source context.
- Wrote and committed the I03 blueprint before tutorial code.

Implementation:
- 17 scripted science-first scenes, 13 new semantically labelled diagrams and one prediction checkpoint.
- Real Python practice: vectorization, broadcasting errors, Boolean masks excluding NaNs, source-preserving copies, axis-specific means, explicit finite denominators, percentiles, seeded simulations, uint8 overflow, and ROI summaries.
- Example arrays remain synthetic. A pixel count is never called a biological replicate; PNG display values are never called calibrated raw fluorescence.
- Independent changed-input challenge returns to the existing editor without solved code.

Quality assurance:
- JavaScript and Python code/output parity, deliberate error catches and changed-input tests added to the imaging CI.
- Diagram-count, accessible SVG descriptions and checkpoint non-disclosure tests added.
- Browser test includes I03 selection, prediction, reveal, credited image loading, editor/localStorage preservation, Learn/Apply/Prove separation and both 390px/1280px layouts.
- GitHub Actions 43407383966: all focused jobs **success** at commit 47dd5fa192e1d30a49e2067a4af9423a13c70d01.
- No scientific or technical blocking defect remains in automated QA.

Unresolved user validation:
- A first-person independent learner test has not been performed. Do not assign a claimed pedagogical score of 9.5/10 from CI alone.
- Browser speech word-boundary support varies; static diagrams remain accessible.

Next canonical chapter: I04 — figures and display interpretation. Production stays unchanged.
