# N01 — research-first narrated DNA-sequence tutorial blueprint

**Date:** 2026-11-14  
**Branch:** `feature/sequence-tutorial-cycle-n01`, stacked above I13 PR #49.  
**Canonical contract:** `content/chapters/N01_COMPLETE.md`; N01-G01–G04 + N01-CAPSTONE.  
**Method:** `docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md`.  
**Source status:** All sequence strings in the tutorial are **synthetic training records**, not annotated genes, authentic sequencing reads or evidence of expression.

## Research and what it changes

1. **Biopython Seq operations** — https://biopython.org/docs/latest/Tutorial/chapter_seq_objects.html; https://biopython.org/wiki/Seq. Built-in `reverse_complement` and `translate` are preferable to quietly inventing molecular rules. Teach explicit reading frame and default genetic code; distinguish stop (`*`) from ambiguous amino acid (`X`).
2. **Biopython coding-sequence caveat** — https://biopython.org/docs/latest/Tutorial/chapter_cookbook.html. `translate(cds=True)` checks CDS constraints and is *not the same* as ordinary `translate()`, which emits all in-frame codons and may include internal stops; N01's canonical task is simple frame translation, not gene certification.
3. **Programming-pedagogy studies** — https://eric.ed.gov/?id=EJ1394780 and https://link.springer.com/article/10.1186/s40594-020-00222-7. Worked examples with subgoal labels, metacognitive pauses and progressively withdrawn scaffolding can help novice programmers. Implication: predict GC denominator once, then move from supplied code to unsolved changed-input Apply/Prove work. These studies do not establish that this particular tutorial improves this learner's performance.
4. **Existing BioPython Studio** — N01 has working Learn/Apply/Prove Python and canonical tests already. Tutorial must be optional, integrated with the same Learn-only viewer, never supply a Prove answer or modify learner progress.
5. **Scientific QC distinction** — `N` is an allowed unknown *when the declared policy permits it*; `X` is invalid under the N01 ACGTN policy. A valid string is not a verified molecular measurement. GC denominator is **called A/C/G/T positions**, not total positions including `N`.

## One motivating workflow

**Question:** Before trusting an incoming synthetic DNA string, what can Python legitimately report? Make an intake sheet that preserves its input, rejects forbidden characters, tracks missing bases, calculates scientifically explicit GC, aligns strand orientation, and translates a separately declared coding frame. The last scene gives a *different* string to work through in the actual editor, without giving its solution.

## Storyboard, exact goal coverage and visuals

| Scene | Goal | New idea | Diagram (original, only when useful) |
|---:|---|---|---|
| 1 | G01 | Destination and synthetic provenance | intake → QC → GC → strand → frame → report |
| 2 | G01 | Uppercase and invalid base indices | ACGTN vs ? base strip |
| 3 | G01 | Allowed N is unknown, not callable | N versus ACGT identity strip |
| 4 | G01 | Policy change: N disallowed, X still invalid | validation decision |
| 5 | G02 | GC / called bases, N excluded | numerator / callable denominator |
| 6 | G02 | No callable base → None, never zero | empty denominator |
| 7 | G02 | **Prediction checkpoint** for GGNNNA (withheld) | hide result |
| 8 | G02 | Reveal the correct 2/3 GC fraction | distinct numerator/denominator |
| 9 | G03 | Complement then reverse; preserve N | input/paired/output strands |
| 10 | G03 | Complement alone is not reverse complement | orientation |
| 11 | G03 | Half-open interval, then minus-strand operation | reference → slice → RC |
| 12 | G04 | Biopython translates in-frame codons | codons → amino acids / stop |
| 13 | G04 | Unknown codon gives X rather than stop | X vs * semantics |
| 14 | G04 | Incomplete codon: explicit refusal | remainder / 3 check |
| 15 | CAPSTONE | Self-contained intake audit using genuine Bio.Seq | source-preserving report |
| 16 | CAPSTONE | Independent transfer with changed sequence and frame | decision checklist, **no solved code** |

The single prediction break requires the learner to choose `GC/(ACGT)` for `GGNNNA` before revealing the `0.667` rounded result. Avoid revealing a Prove task's hidden data or answer.

## Data and visual design

- Add `src/tutorials/n01-data.js` with the existing data schema (`chapter`, exact `goals`, step `say`, `code`, 1-based `focus`, `visual`, `output`, `note`, `checkpoint`), not a new lesson runner.
- Add `src/tutorials/sequence-illustrations.js` as **original, locally rendered SVG**: transparent scientific status, short base strips, GC fraction, reverse-strand orientation, triplet codons, and QC report. Show meaningful progression, not decorative images or tiny text.
- Extend the optional tutorial viewer to include sequence chapters and their illustrations; leave voice choice and speed, keyboard behavior, editor state and persisted progress unchanged.
- All printed outputs must be independently executed in **fresh CPython with Biopython**. No network, external FASTA, hidden filesystem, fabricated biological measurements or simulated Python output falsely labeled executed.
- Diagram and narration must remain comprehensible without TTS and at 390px mobile and 1280px desktop.

## QA / failure loop

1. Validate exact ordered N01-G01–G04 + CAPSTONE, scene count 16, goal coverage, one withheld prediction, independent final transfer.
2. Run each code+shown output in fresh installed CPython/Biopython; assert exact stdout and no warnings/tracebacks. Test changed base case, all-N, N-disabled, invalid base, no-callable denominator, lower-case reverse complement, reverse twice, internal stop versus X, partial frame.
3. Test original SVG descriptors and rendered accessibility labels; no upstream image claims or third-party visual reuse.
4. Verify script order and tutorial scope: Learn only; Apply/Prove hidden; no code-editor or stored-state mutation.
5. Run browser checks on desktop/mobile with Playwright where available; confirm next/back, checkpoint/reveal, voice fallback, no clipped diagrams.
6. Document all failures and revisions in `docs/tutorials/ITERATION_LOG_N01.md`, and rerun all relevant CI gates before declaring ready.
7. **No production merge** without review. If blocked by CI or Vercel build-rate limits, record that instead of claiming success.

**Next after an actually green N01:** N02 (SeqRecord / FASTA / FASTQ identity and Phred-quality audit); start N02 with its own research blueprint first.
