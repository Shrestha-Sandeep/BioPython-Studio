# N01 tutorial iteration and QA log

**Date:** 2026-11-14  
**Research blueprint:** `docs/tutorials/N01_RESEARCH_BLUEPRINT.md` (committed before the module).  
**Draft PR:** #50; stacked above I13 #49; production `main` unchanged.  
**Initial challenge:** Preserve exact ACGTN policy and strand/translation semantics in a visually compelling example, without exposing Apply/Prove tasks or making biological claims about synthetic strings.

## Cycle 1 — build, run, review

- Added 16-scene N01 chapter with exact G01–G04 + CAPSTONE coverage and a single withheld GC denominator prediction.
- Added 16 original SVG-scene descriptors for synthetic bases, GC numerator/denominator, reverse-complement, codons and an intake-report chain. Reuses the existing voice-enabled dialog.
- Executed the shown code snippets against fresh CPython/Biopython **1.86**; independently tested lower-case inputs, all N, forbidden characters, complementary and reverse-complementary strand, ambiguous codon and incomplete frames.
- **Issue found in QA implementation before full run:** test source strings had over-escaped regex and newline delimiters. Corrected the test syntax, then reran CI. The tutorial content/output itself did not require correction.
- **GitHub Actions workflow `Sequence narrated tutorial research-loop QA`, run 43582631235: SUCCESS.** The workflow executed the exact-output Node tests, 7-chapter preexisting sequence-content import contract and Playwright responsive/browser isolation checks at 390 and 1280 px.
- Existing I13 attribution issue fixed in its own stacked base commit `8dd4a74b`; I13 imaging QA run 43582139883 passed.

## What this green gate does and does not establish

**GO for draft learner review.** Technical consistency and automated mobile/browser behavior are verified. It does **not** establish true learner comprehension or prove the short DNA strings are genes/reads. The browser does not claim the preview's printout is an execution result. The new chapter is **not merged into production**.

## Next cycle

Proceed to N02 (SeqRecord, FASTA, interval orientation, FASTQ qualities) with a new research blueprint committed before implementation. Maintain source identifiers and quality relationships; do not invent a real sequencing-run provenance.
