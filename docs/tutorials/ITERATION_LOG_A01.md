# A01 research → tutorial → QA → revision log

**Date:** 2026-11-14  
**Draft:** PR #58 stacked on A00 PR #57.  
**Blueprint committed before implementation:** `docs/tutorials/A01_RESEARCH_BLUEPRINT.md`.

## Completed technical teaching artifact

- 17 A01 narrated scenes mapped to G01–G04 + CAPSTONE; scene 9 prediction withheld until scene 10; unsolved independent transfer and separate A01-REVIEW.
- 17 original accessible SVG explanations of named TCZYX axes, native 16-bit pixel arrays, uncalibrated scale, bit-depth overflow, synthetic TIFF byte round-trip and source-content fingerprints.
- Native scientific examples verified with real NumPy 2.3.5 and tifffile 2026.11.12, including actual bytes written to and read back from an in-memory TIFF; altered-input tests vary channels, planes, signed arithmetic, scale and bytes.
- Existing Learn-only tutorial viewer and frozen course progress contracts preserved. No assumption that TIFF metadata equals independently calibrated physical size or that numeric candidate pixels represent exophers/cells.

## QA cycle and correction

Initial A01 GitHub Actions run 43632460806 failed in the cumulative **A00 diagram-count regression test**: the test had incorrectly counted both A00 and newly appended A01 illustrations (27 vs A00's 16). A01's own numerical tests were successful. Updated the A00 regression to scope its original `DATA` array in commit `e535579`; did **not** conceal or remove the new A01 diagrams.

[Corrected A01 full numeric + Chromium phone/desktop CI run 43632505785](https://github.com/Shrestha-Sandeep/BioPython-Studio/actions/runs/43632505785): **SUCCESS**. A00/P01 viewer regression, editor and localStorage isolation, hidden Apply/Prove/REVIEW and standard-route protection included.

## Verdict

**GO for draft learner review and next canonical A02 research blueprint.** **HOLD production merge and real biological validation** until original microscope source/metadata and human task performance have been evaluated.

A genuine microscope TIFF may require instrument-specific readers, acquisition notes, verified optical/pixel scale and independent annotation. The tutorial proves only coding and data-integrity mechanics on invented scientific fixtures.
