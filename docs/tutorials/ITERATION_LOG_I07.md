# I07 iteration log — scientific table identity and missingness

**Date:** 2026-11-13
**Blueprint:** `docs/tutorials/I07_RESEARCH_BLUEPRINT.md` committed before implementation.
**Branch:** `feature/imaging-tutorial-cycle-i07`; draft PR #43.
**Status:** GO for code review only; learner mastery and biological correctness not established by CI.

## Tutorial and research result

18 narrated scenes map exactly I07-G01...G07 and I07-CAPSTONE. A continuous story turns synthetic microscope-field measurements into a source-preserving Pandas quality-control report. Leading-zero identifiers, typed CSV, `.loc`/ `.iloc`, schema validation, deliberate whitespace normalization, duplicate/conflicting metadata and missing versus zero are shown with 13 original diagrams. The cumulative imaging library now includes 90 original diagrams (I01–I07).

## QA and correction

1. First workflow run **43518620931** failed at JavaScript parse because the new I07 diagram object was inserted after the existing I06 map with an extra comma. No numerical tests ran.
2. Corrected the syntax in commit **d4f685ea94aff9f16e29401929db79fb4dc9234d**.
3. Follow-up GitHub Actions run **43518755166** succeeded. Gates: JavaScript syntax, all displayed Pandas stdout against fresh real CPython/pandas 3.1.0, changed-input leading zero/case/missingness/composite key cases, accessible diagrams and withheld prediction, mobile 390px and desktop 1280px browser flows, unchanged editor/localStorage, absent Learn tutorials in Apply/Prove, attributed published image loading.
4. Verified that `pd.read_csv(..., dtype={"specimen_id":"string"})` preserves IDs; did not use category inference which can erase leading zeros under pandas 3.1.
5. Did not claim table row=biological replicate or synthetic data=published HPA image output.

## Open scientific and pedagogical limitations

The code demonstrates data hygiene, not physical specimen identity, independence of replicate units, actual image-region extraction accuracy or transfer learning after a delay. User voice/device review is still necessary.

**Verdict:** GO to I08 research; no production merge.
