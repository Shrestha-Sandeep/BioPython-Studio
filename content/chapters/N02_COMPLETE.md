# N02 — Read real FASTA and FASTQ records

Use Biopython sequence objects and standard in-memory file formats. Learn to preserve identifiers and per-base quality metadata.

**Scientific boundary:** FASTA/FASTQ records are synthetic and short. No external sequencing run, base caller or verified reference assembly is implied.

**Prerequisites:** Python Foundations P01–P06. All examples are self-contained and run in genuine Pyodide Python.

## Goals

### N02-G01 — Construct Seq and SeqRecord with identifiers (127)

Seq stores nucleotide operations; SeqRecord connects the sequence to an ID and optional description.

The object description is metadata, not a measurement or a claim that the sequence is from a named gene.

**Worked example (predict before running):**

```python
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord
r=SeqRecord(Seq('ATGN'),id='read01',description='synthetic')
print(r.id,len(r.seq))
```

**Apply:** Create a Bio.SeqRecord.SeqRecord from data.seq and data.id; return result={'id','length','reverse_complement'} using real Biopython methods.

**Prove (no solution shown):** Return result={'id','sequence','length'} from a Biopython SeqRecord for sample.seq/sample.id; sequence must be uppercase and original source unmodified.

**Research question:** Which identifiers must stay connected when data enter a larger analysis?

### N02-G02 — Parse and write FASTA without losing IDs (128)

SeqIO.parse(handle,'fasta') preserves record boundaries; SeqIO.write can serialize records back to FASTA.

Joining all FASTA lines without respecting '>' headers merges distinct sources and invalidates coordinate positions.

**Worked example (predict before running):**

```python
from Bio import SeqIO
from io import StringIO
print([(r.id,len(r)) for r in SeqIO.parse(StringIO('>a\nACG\n>b\nTT\n'),'fasta')])
```

**Apply:** Parse data.fasta using Bio.SeqIO and io.StringIO. Return result as list of (record ID, sequence length) in file order.

**Prove (no solution shown):** Parse sample.fasta with Bio.SeqIO; serialize back to FASTA in memory and return result={'count':int,'ids':[...],'roundtrip':bool} comparing IDs and sequences.

**Research question:** Why are duplicate FASTA identifiers risky in sequence-to-metadata joins?

### N02-G03 — Extract genomic intervals with strand awareness (129)

Python slices are zero-based half-open [start:end]; reverse-complement only when the requested strand is '-'.

An end coordinate is excluded in Python and must not be treated as a one-based inclusive reference coordinate.

**Worked example (predict before running):**

```python
from Bio.Seq import Seq
s=Seq('AACCGG');print(str(s[1:4]),str(s[1:4].reverse_complement()))
```

**Apply:** Take first FASTA record in data.fasta; return result={'id','interval'} from data.start:data.end, reverse-complement only for strand '-', or None for invalid bounds.

**Prove (no solution shown):** From sample.fasta first record return result={'zero_based_start','length','sequence'} using sample.start:end and sample.strand; reject out-of-bounds as sequence=None.

**Research question:** How will an interval annotation differ if the source uses 1-based inclusive coordinates?

### N02-G04 — Read FASTQ and Phred quality arrays (130)

Biopython SeqIO.parse('fastq') decodes ASCII quality encoding into numeric phred_quality values.

Quality scores are not base-call truth probabilities and must not be confused with fluorescence intensities.

**Worked example (predict before running):**

```python
from Bio import SeqIO
from io import StringIO
r=next(SeqIO.parse(StringIO('@a\nAC\n+\nII\n'),'fastq'));print(r.id,r.letter_annotations['phred_quality'])
```

**Apply:** Parse data.fastq with SeqIO; return result list of (read_id, read_length, integer minimum Phred Q) preserving original record order.

**Prove (no solution shown):** Parse sample.fastq; return result={'reads':number,'total_bases':sum of read lengths,'low_quality_bases':number of per-base Phred Q below sample.min_q}.

**Research question:** Why must read identity and quality remain paired after filtering?

## Integrated capstone — Create a FASTA/FASTQ source audit

Create a reproducible file-format and read-quality report using actual Bio.SeqIO rather than simulated parsing.

**Apply:** Parse data.fasta and data.fastq; report result={'fasta_ids':list,'fastq_ids':list,'low_quality_reads':read IDs with minimum Phred < data.min_q}.

**Prove:** Parse sample.fastq and return result={'unique_ids':bool,'read_count':int,'mean_qualities':{id:rounded mean Q}}. Keep raw strings unchanged.

## Delayed review

Using sample.fastq, return result as list of (record ID, sequence length, number of bases below sample.min_q), with genuine Biopython SeqIO.

No worked solution or Prove hint is included. A passing public check is not retained mastery.

## Further reading

- https://biopython.org/docs/latest/Tutorial/chapter_seqio.html
- https://biopython.org/docs/latest/Tutorial/
