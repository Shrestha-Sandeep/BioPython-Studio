# N03 — Inspect read quality, trim and align

Implement transparent read QC, trailing-quality trimming, overlap-aware k-mer counting and a tiny alignment diagnostic.

**Scientific boundary:** Small synthetic read sets are teaching data. This is not FastQC, Cutadapt, a production aligner or a validated sequencing pipeline.

**Prerequisites:** Python Foundations P01–P06. All examples are self-contained and run in genuine Pyodide Python.

## Goals

### N03-G01 — Summarize per-cycle base quality (131)

Calculate mean Phred Q separately at each cycle, treating absent positions in short reads as missing, not zero.

Padding shorter reads with Q=0 biases cycle means and falsely suggests low quality.

**Worked example (predict before running):**

```python
reads=[[30,20,10],[40,20]]
print([sum(r[i] for r in reads if i<len(r))/sum(i<len(r) for r in reads) for i in range(3)])
```

**Apply:** Using data.reads with q arrays, return result={'cycle_mean':[float], 'cycle_n':[int]} computed from positions present at each cycle.

**Prove (no solution shown):** From sample.reads return result as the 0-based cycle index with the lowest mean quality; when tied select the earliest cycle.

**Research question:** Why does a late-cycle mean have a different n when read lengths vary?

### N03-G02 — Trim trailing low-quality bases (132)

Walk backward from the last base until a Q >= threshold; retain internal low-quality bases until explicitly cleaned by another policy.

Removing all low-Q positions independently changes sequence coordinates and breaks read/quality correspondence.

**Worked example (predict before running):**

```python
seq='ACGTT';q=[35,35,35,7,4];n=len(q)
while n and q[n-1]<20:n-=1
print(seq[:n])
```

**Apply:** Trim only trailing q values below data.threshold; keep reads of length >= data.min_len. Return result list of (read id, trimmed sequence) preserving source order.

**Prove (no solution shown):** Return result={'retained':number,'discarded_ids':list,'retained_bases':sum} after trailing trimming of sample.reads and sample.min_len.

**Research question:** Why is a trimming rule a preprocessing choice that must be fixed before comparing conditions?

### N03-G03 — Count overlapping k-mers and exclude Ns (133)

Slide a window by one position and count all overlapping A/C/G/T-only k-mers; never cross N calls.

Using nonoverlapping windows or replacing N with A changes motif counts.

**Worked example (predict before running):**

```python
from collections import Counter
s='AAAA';print(Counter(s[i:i+2] for i in range(len(s)-1)))
```

**Apply:** For each read in data.reads count overlapping length data.k DNA-only motifs, excluding any k-mer containing N. Return result as a Counter/dict mapping motif->count.

**Prove (no solution shown):** Using sample.reads, count length sample.k valid A/C/G/T-only windows and return result={'valid_windows':int,'distinct_motifs':int}.

**Research question:** Can a high k-mer count imply contamination without controls or reference context?

### N03-G04 — Compare short sequences with pairwise alignment (134)

Biopython PairwiseAligner scores reference/query pairs under explicit match, mismatch and gap penalties.

Using default scoring without documenting gap penalties makes alignment outputs hard to compare.

**Worked example (predict before running):**

```python
from Bio.Align import PairwiseAligner
a=PairwiseAligner();a.match_score=2;a.mismatch_score=-1;a.open_gap_score=-2;a.extend_gap_score=-0.5
print(a.score('ACG','ACG'))
```

**Apply:** Use Bio.Align.PairwiseAligner with match=2, mismatch=-1, open_gap=-2, extend_gap=-0.5. Return result as numeric alignment score for data.reference/query.

**Prove (no solution shown):** Return result={'score':pairwise alignment score,'perfect_reference':score == 2*len(sample.reference)} with the same declared penalties.

**Research question:** What biological meaning is missing from a high score on two short synthetic strings?

## Integrated capstone — Create a per-read QC and k-mer summary

Combine quality-based trimming and motif counting without losing read identifiers.

**Apply:** Trim reads by data.threshold/min_len and return result={'ids':retained ids,'kmer_counts':dict of valid data.k motifs in trimmed reads}.

**Prove:** Return result={'input_bases','retained_bases','retained_count'} after sample trailing-trim rule; keep the input records unchanged.

## Delayed review

Given sample.reads and threshold, return result as list of (id, trimmed length) for all reads including those trimmed to zero.

No worked solution or Prove hint is included. A passing public check is not retained mastery.

## Further reading

- https://biopython.org/docs/latest/Tutorial/chapter_pairwise.html
- https://biopython.org/docs/latest/Tutorial/
