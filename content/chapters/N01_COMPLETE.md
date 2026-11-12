# N01 — Validate and transform DNA sequences

Begin sequence analysis by making ambiguity and reading-frame policies explicit before calculating molecular summaries.

**Scientific boundary:** Short DNA strings are synthetic. A valid string is not a verified molecule, and translation does not establish biological expression.

**Prerequisites:** Python Foundations P01–P06. All examples are self-contained and run in genuine Pyodide Python.

## Goals

### N01-G01 — Validate bases and ambiguous N (123)

Declare the alphabet before measuring. Treat N as unknown; do not replace it with A or delete the original sequence.

A string containing N may satisfy a permissive sequence policy but still have zero callable A/C/G/T bases.

**Worked example (predict before running):**

```python
seq='ACGNT'
allowed=set('ACGTN')
print(all(base in allowed for base in seq),seq.count('N'))
```

**Apply:** Read data.seq and data.allow_n. Return result={'valid':bool,'bad_indices':[0-based indices]}; permit ACGT and optionally N, case-insensitively, without modifying data.

**Prove (no solution shown):** For sample.seq, report result={'ambiguous':count of N,'invalid':count of characters outside ACGTN,'callable':count of A/C/G/T}, regardless of sample.allow_n.

**Research question:** Should invalid reads be rejected or retained with an explicit QC flag?

### N01-G02 — Calculate GC fraction with a declared denominator (124)

Calculate GC/(A+C+G+T) among called bases; report None if none are called. A separate all-position fraction answers a different question.

Dividing by full read length silently treats unknown N bases as biologically known AT-like positions.

**Worked example (predict before running):**

```python
s='GCNNAA';called=[b for b in s if b in 'ACGT'];print(sum(b in 'GC' for b in called)/len(called))
```

**Apply:** Calculate result as the GC fraction among callable A/C/G/T bases in data.seq; return None when there are none.

**Prove (no solution shown):** Return result={'gc_called':GC/(ACGT) or None,'n_fraction':N/total or None} from sample.seq; exclude invalid characters from callable denominator.

**Research question:** Which denominator is scientifically defensible for a heavily ambiguous sample?

### N01-G03 — Reverse-complement a DNA strand (125)

Complement A↔T and C↔G, preserve N, then reverse the order. Complement-only is not reverse-complement.

Reversing without complementing silently changes the biological sequence interpretation.

**Worked example (predict before running):**

```python
seq='ATGCN';table=str.maketrans('ACGTN','TGCAN');print(seq.translate(table)[::-1])
```

**Apply:** From data.seq, return uppercase DNA reverse-complement string result supporting A,C,G,T,N.

**Prove (no solution shown):** Use sample.strand: return the original uppercase sequence when '+', otherwise the reverse-complement, in result.

**Research question:** Why must strand orientation be recorded alongside a genomic interval?

### N01-G04 — Translate a coding sequence explicitly (126)

Biopython Seq.translate() uses a genetic code. State the reading frame and expose incomplete codons rather than silently truncating.

A stop codon and an ambiguous codon are not equivalent: '*' denotes stop; 'X' may represent unknown amino acid.

**Worked example (predict before running):**

```python
from Bio.Seq import Seq
print(str(Seq('ATGGCTTAA').translate()))
```

**Apply:** Translate data.cds with Bio.Seq.Seq; return result={'protein':str or None,'frame_ok':bool}. Refuse non-multiple-of-3 length by returning None.

**Prove (no solution shown):** From sample.cds translate the full coding frame to uppercase, return result={'start':first codon equals ATG,'stop':protein ends with '*','protein':string} using Biopython.

**Research question:** Why is a translated string not evidence that the coding sequence is expressed?

## Integrated capstone — Build a source-preserving DNA intake report

Combine ambiguity, strand and protein checks without pretending that synthetic sequences are real genes.

**Apply:** Return result with keys id, gc_called, reverse_complement, protein, unknown for data.seq/data.cds using Biopython and a callable-base denominator.

**Prove:** For sample.cds, return result with frame_ok, translated protein or None, and exact count of '*' stops; handle absent complete frames.

## Delayed review

From sample.seq return result={'rc':reverse-complement,'called_gc':GC fraction or None,'n':N count}; do not mutate the input.

No worked solution or Prove hint is included. A passing public check is not retained mastery.

## Further reading

- https://biopython.org/docs/latest/Tutorial/chapter_seq_objects.html
- https://biopython.org/docs/latest/Tutorial/
