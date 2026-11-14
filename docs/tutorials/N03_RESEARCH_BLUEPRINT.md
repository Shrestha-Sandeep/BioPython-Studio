# N03 — research-led read-quality, trimming, k-mer and alignment tutorial blueprint

**Date:** 2026-11-14  
**Branch:** `feature/sequence-tutorial-cycle-n03`, stacked on N02 PR #51.  
**Canonical:** `content/chapters/N03_COMPLETE.md` — G01–G04 and CAPSTONE.  
**Method:** `docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md`.  
**Provenance:** Every read and its Phred values are **synthetic training data**. This tutorial is not FastQC, Cutadapt or a validated sequence aligner.

## Source research and boundaries

1. Biopython `PairwiseAligner` and affine gap scores: https://biopython.org/docs/1.86/Tutorial/chapter_align.html and https://biopython.org/docs/latest/Tutorial/chapter_pairwise.html . Explicitly set **global** mode, match +2, mismatch -1, gap-open -2 and gap-extend -0.5. Do not rely on version-dependent defaults. A high score on a tiny sequence is not a reference mapping or a claim of molecular identity.
2. FastQC per-base quality distributions: https://rtsf.natsci.msu.edu/genomics/technical-documents/fastqc-tutorial-and-faq.aspx . Real QC plots can show boxplots and per-cycle sample size; our synthetic, small-scale cycle means are only an introduction, not a full quality assessment.
3. Cutadapt algorithm and guide: https://cutadapt.readthedocs.io/en/stable/algorithms.html and https://cutadapt.readthedocs.io/en/stable/guide.html . The canonical N03 **terminal run** of Q below a threshold is a deliberately *simpler* policy than Cutadapt's quality-trimming algorithm; label it accordingly and do not claim equivalence.
4. Computational teaching evidence: https://eric.ed.gov/?id=EJ1394780 and https://link.springer.com/article/10.1186/s40594-020-00222-7 . Use one full example, a withheld overlap-count prediction, then an independent transfer. No educational score is proved by CI.

## Motivating scientific arc

From a tiny synthetic read collection, compute per-cycle quality **only from reads with that cycle**, make an auditable 3-prime trailing-Q trim **without deleting internal low-Q bases**, count **all overlapping** callable k-mers, and compare short strings using a declared pairwise alignment score. Return a report carrying source read IDs, trimming policy and limitations.

## Planned scenes, goal mappings and original diagrams

| # | Goal | Concept | Diagram |
|---:|---|---|---|
| 1 | G01 | Destination: traceable synthetic read-QC chain | quality → trim → motifs → alignment |
| 2 | G01 | Per-cycle mean and changing read n | variable-length Q tracks |
| 3 | G01 | Missing later cycle ≠ Q0 | cycle-n chart |
| 4 | G01 | Why zero padding falsely reduces the mean | side-by-side calculation |
| 5 | G02 | Walk backward over low-quality tail | trailing Q strip |
| 6 | G02 | Internal low-Q retained | terminal versus internal |
| 7 | G02 | Entire read can trim to empty | discard/keep decision |
| 8 | G03 | Overlapping AA windows in AAAA | offset windows |
| 9 | G03 | Windows containing N excluded | valid/invalid windows |
| 10 | G03 | **Withheld** overlapping motifs in AANAAC | unknown counts |
| 11 | G03 | Reveal 2 × AA + 1 × AC | windows and counted motifs |
| 12 | G03 | Trimming changes motif counts, and ID remains | before/after motifs |
| 13 | G04 | Explicit global PairwiseAligner scoring | matching positions |
| 14 | G04 | Mismatch subtracts from score | match vs mismatch |
| 15 | G04 | One-base gap incurs open penalty | aligned pairs |
| 16 | G04 | Code/version/settings belong in report | scoring policy |
| 17 | CAPSTONE | Real Python source-ID preserving trim + overlap motifs | record QC summary |
| 18 | CAPSTONE | Independent transfer with new reads, n and penalties | unsolved decisions |

**Prediction checkpoint:** `AANAAC`, k=2. Five possible windows, but `AN` and `NA` contain N; remaining are `AA`, `AA`, `AC`. Withhold any output at scene 10, reveal `{'AA': 2, 'AC': 1}` at scene 11.

## Critical scientific constraints

- Read quality lists for variable lengths: `cycle_n` must count only observed positions; missing cycle positions cannot be padded with 0.
- Simple 3-prime trimming keeps internal low-Q bases. It can yield empty reads, and final retention uses explicitly recorded minimum length.
- K-mer windows are overlapping and cannot contain N (under ACGT-only motif policy); motifs crossing an N are excluded rather than repaired.
- Pairwise alignment uses explicitly declared global mode and score penalties; score comparability depends on length and scheme. Do not claim a 3-base match is an authentic reference mapping.
- Use fresh CPython + real Biopython for each shown output. Synthetic sequences are not real observations.

## QA and iteration

- 18 scenes, exact canonical goal IDs, one withheld checkpoint, unsolved final transfer, original local sequence SVG diagrams; no altered frozen UI or Apply/Prove solution leakage.
- Compare 100% of displayed snippets with clean CPython/Biopython **1.86** execution, including warnings-as-errors; changed-input tests for late missing cycles, internal low quality, all-low read, motif overlap and N, mismatch versus gap and explicit alignment mode.
- Responsive 390/1280px Playwright with actual rendering of cycle/trim/kmer/alignment diagrams, prediction/reveal, editor/localStorage and Learn-only visibility.
- Preserve and rerun N01/N02 test suites and prior microscopy/foundation integration suites; log corrections. Stop if any science, code, mobile or provenance gate fails.
- No merge/deployment to `main` pending review. Next only after clean QA: N04.
