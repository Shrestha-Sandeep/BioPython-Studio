# N02 tutorial iteration and QA log

**Date:** 2026-11-14  
**Blueprint first:** `docs/tutorials/N02_RESEARCH_BLUEPRINT.md`.  
**Draft PR:** #51 stacked above N01 #50; production branch unchanged.

## One complete cycle

Research: Compared Biopython's `SeqRecord`/`SeqIO` behavior, FASTA roundtrip semantics, Sanger FASTQ Phred decoding and an evidence-backed worked-example fading pattern. Explicitly did not treat synthetic reads as verified measurements or matching FASTA/FASTQ IDs as proof of a true pair.

Build: 18 scenes mapped to G01–G04 + capstone; one withheld coordinate/strand prediction; 18 original SVG descriptors; optional existing Learn-only viewer and no Apply/Prove answer leakage. Added 15 independently reproducible `SeqIO` examples and separate boundary/format tests.

QA: Real CPython with Biopython 1.86, syntax, ordered goals, exact printed outputs, duplicate FASTA identifiers, interval bounds, negative strand, FASTQ ASCII-to-Phred, a deliberately mismatched FASTQ sequence/quality length that must raise, and a multi-record `SeqIO.read()` that must raise. Mobile and desktop Playwright checks exercised FASTA/quality diagrams, prediction/reveal, reader closure, preserved editor/storage state and tutorial visibility only in Learn. **GitHub Actions `Sequence narrated tutorial research-loop QA` run 43583215840: SUCCESS.**

Scientific limitations: Tutorial strings are synthetic in-memory fixtures, not raw sequencing run evidence; Q values are decoding outputs, not empirically proven error probabilities. Full browser Pyodide learner mastery and real-person educational effectiveness are not established by automated tests.

**Verdict:** GO for draft learner review. Do not promote N01/N02 or earlier unmerged imaging tutorials into production without integrated release review.

**Next:** N03 per-cycle quality, 3-prime trimming, overlapping k-mer counts and explicit pairwise aligner scoring, beginning with its own research blueprint.
