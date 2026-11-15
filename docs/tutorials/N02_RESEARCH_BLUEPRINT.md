# N02 — research-first FASTA/FASTQ record-identity and quality tutorial blueprint

**Date:** 2026-11-14  
**Branch:** `feature/sequence-tutorial-cycle-n02` stacked above N01 PR #50.  
**Canonical:** `content/chapters/N02_COMPLETE.md` (N02-G01–G04 + CAPSTONE).  
**Method:** `docs/tutorials/RESEARCH_LED_TUTORIAL_LOOP_V1.md`.  
**Input provenance:** All DNA and FASTQ strings in the narrated tutorial are deliberately **synthetic in-memory teaching records**. They are not genuine sequencing reads, sequencer quality observations or a verified reference assembly.

## Research before implementation

- Biopython 1.86 `SeqIO` chapter: https://biopython.org/docs/1.86/Tutorial/chapter_seqio.html — `SeqIO.parse(handle, format)` yields `SeqRecord` objects lazily; `SeqIO.read` requires exactly one record. Use `StringIO` and a declared format, never guess formats. Source ID, description, sequence and FASTQ letter-annotations stay associated.
- Biopython `SeqIO` round-trip discussion: https://biopython.org/docs/latest/Tutorial/chapter_seqio.html — equivalent ID/sequence records do not imply identical original FASTA text/line wrapping. Test semantic equality and preserve original text separately.
- Biopython `SeqRecord` documentation: https://biopython.org/wiki/SeqRecord and https://biopython.org/docs/latest/Tutorial/chapter_seq_objects.html — a SeqRecord keeps sequence and metadata together, but annotations are claims from the input, not proof of a genomic identity.
- Biopython FASTQ API: https://biopython.org/docs/1.87/api/Bio.SeqIO.QualityIO.html — standard Sanger FASTQ uses ASCII offset 33 and `record.letter_annotations["phred_quality"]` gives integers. Score Q relates to model-based error probability; it is **not a guaranteed actual base-call correctness**.
- Programming worked examples + fading: https://eric.ed.gov/?id=EJ1394780 and https://link.springer.com/article/10.1186/s40594-020-00222-7 — use one well-labeled example, a withheld coordinate/strand prediction, then an independent changed-input task.

## One useful end-to-end workflow

An invented intake desk receives two small files: a multi-record FASTA supplying sequence IDs and a FASTQ supplying sequence IDs, per-base qualities and original sequence strings. Python must parse safely, retain IDs, detect duplicates, interpret a reference interval explicitly and report which **synthetic** reads fail a Q threshold. Never join by position instead of ID or imply that matching IDs guarantee data provenance.

## Storyboard

| Scene | Goal | Main teaching distinction | Visual |
|---:|---|---|---|
| 1 | G01 | File-based intake destination; synthetic source | FASTA → SeqRecord and FASTQ → quality-aware report |
| 2 | G01 | `Seq` vs `SeqRecord` and metadata | labeled object (ID + Seq + description) |
| 3 | G01 | Keep ID when deriving reverse complement | original → derived source identity |
| 4 | G01 | Description is annotation, not biological proof | ID/description separated |
| 5 | G02 | Parse two FASTA records via `SeqIO.parse` | raw FASTA lines → distinct records |
| 6 | G02 | Line-wrapped FASTA and ID from header | wrapped lines → one ID record |
| 7 | G02 | Duplicate IDs are a QC failure | records, duplicate ID highlighted |
| 8 | G02 | Semantic roundtrip ≠ byte-for-byte roundtrip | records → FASTA normalized wrapping |
| 9 | G03 | [start:end] zero-based, half-open | indexed nucleotide strip |
| 10 | G03 | Slice then orient reverse strand | slice → reverse-complement |
| 11 | G03 | Bounds checked, no silent truncation | valid/invalid interval |
| 12 | G03 | **Prediction withheld** for `AACCGG[2:5]` on minus strand | unknown output before reveal |
| 13 | G03 | Reveal `CCG` → `CGG` with executable code | coordinate and polarity |
| 14 | G04 | FASTQ record has base sequence + ASCII qualities | four-line FASTQ anatomy |
| 15 | G04 | Sanger Q decoding `I!5` → [40,0,20] | quality bar map |
| 16 | G04 | Preserve ID when calculating minimum Q | per-read quality table |
| 17 | CAPSTONE | Parse both formats and produce auditable ID/Q report | source-safe report |
| 18 | CAPSTONE | Independent transfer on new malformed/duplicate/out-of-range inputs | unsolved QC checklist |

Every scene maps to the exact shipped N02 canonical chapter goal or capstone. One checkpoint only, with no output until Reveal. No new exercise runner or changes to the existing frozen UI; sequence tutorial library extends the same optional Learn-only viewer.

## Scientific failure modes to teach explicitly

1. **FASTA > lines define distinct records.** Concatenating a whole file into a single sequence destroys IDs.
2. **Record ID matters:** duplicate IDs are not allowed as unique keys in downstream metadata joins.
3. **FASTA write/read comparison is semantic:** IDs and sequences may roundtrip while original whitespace and line wraps change.
4. **Intervals:** Python [start:end) is not an implicit one-based inclusive GFF/GTF convention; out-of-bounds slices that Python silently clips must be rejected for scientific intervals.
5. **FASTQ:** quality strings must match base counts; the parser will throw on malformed inputs; do not catch errors and silently delete reads.
6. **Phred:** Q40 is a modeled low error probability, not a promise of empirical accuracy, and Q cannot be used as fluorescence intensity or independent biological evidence.
7. **FASTA/FASTQ linkage:** matching record IDs is a checkable input convention but does not prove that two invented files came from the same sequencing run.

## QA gates

- Exactly ordered G01–G04 + CAPSTONE, 18 science-first scenes, one withheld prediction, independent changed-input transfer; no Prove solution or `data.`/`sample.` source leakage.
- 100% of displayed outputs execute in fresh installed Biopython 1.86 CPython. Changed-input tests: duplicate IDs, variable line wrapping, FASTA semantic vs byte-preserving roundtrip, invalid interval/negative strand, FASTQ low/zero/high quality, mismatched quality length raising an exception.
- Original animated-boundary-aware/static SVG diagrams use no third-party imagery, no unsupported external asset or remote network.
- Mobile 390px + desktop 1280px dialog/navigation, voice speed selection, diagram fallback, checkpoint and editor/localStorage/Apply/Prove isolation.
- Complete integration tests for N01 and I01–I13 must remain green. Log any failure and revision, rerun relevant test suites and do **not merge to production** pending review.

**Next after N02 genuinely green:** N03, with a new blueprint before writing the lesson module.
