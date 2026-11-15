# N03 tutorial iteration and QA log

**Date:** 2026-11-14  
**Research first:** `docs/tutorials/N03_RESEARCH_BLUEPRINT.md` committed before code.
**Draft:** PR #52 stacked over N02 PR #51; no merge to production.

## Cycle

- Compared canonical N03 curriculum with Biopython 1.86 PairwiseAligner, FastQC per-base quality summaries and Cutadapt algorithms. Avoids falsely claiming the introductory terminal-run trimming policy reproduces Cutadapt.
- Added 18 source-aware narrated scenes mapped exactly to G01–G04 and CAPSTONE; 18 original local SVG diagrams, one withheld N-excluded overlapping k-mer prediction, independent new-input transfer.
- Built real Python examples for observed per-cycle n and Q means, preserving internal low-Q while trimming only a terminal low-Q run, overlapping motifs and explicit global alignment match/mismatch/open/extend penalties.
- Automated changed-input checks cover absent quality cycles, all-low reads, motif overlap, ambiguity, and alignment scoring. Browser QA at 390 and 1280 px covers the diagrams, prediction/reveal, speed/voice selectors and isolation of editor, local storage, Apply/Prove and delayed review.
- **GitHub Actions `Sequence narrated tutorial research-loop QA` run 43583739566: SUCCESS** on PR #52 head `e1fe8518`; this run includes cumulative N01/N02 tests.
- Any pass establishes technical consistency under the checked environment, not learning outcomes, biological reference mapping or equivalence with a production read-QC package.

**Verdict:** GO for learner review; production unchanged and draft PR not merged. **Next:** N04 research blueprint → tutorial → changed-input tests → browser QA → review and correction.
