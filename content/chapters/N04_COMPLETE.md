# N04 — Summarize coverage and count features

Connect mapping-category summaries, base coverage and feature-count tables while respecting zero library sizes and the limits of CPM.

**Scientific boundary:** Mapping entries, read alignments, count tables and sample metadata are synthetic. Coverage and CPM do not establish differential expression or a verified mapped genome.

**Prerequisites:** Python Foundations P01–P06. All examples are self-contained and run in genuine Pyodide Python.

## Goals

### N04-G01 — Interpret mapped, unmapped and multimapped reads (135)

Preserve mapped, multi and unmapped categories; calculate the proportion that is mapped at least once, keeping multi distinct.

Counting a multimapping read as two independent reads artificially inflates the numerator.

**Worked example (predict before running):**

```python
status=['mapped','multi','unmapped','mapped'];print(sum(x!='unmapped' for x in status)/len(status))
```

**Apply:** Return result={'mapped':int,'multi':int,'unmapped':int,'at_least_once_fraction':float} from data.mappings; count each read once.

**Prove (no solution shown):** Return result={'total':number,'unique_mapped_fraction':fraction with status exactly 'mapped','multi_fraction':fraction with status 'multi'} from sample.mappings.

**Research question:** Why is fraction mapped not the same as fraction uniquely mapped?

### N04-G02 — Compute zero-based half-open read coverage (136)

For uniquely mapped read intervals [start:end), clip to [0,reference_length) and add one to each covered position.

Treating the end coordinate as inclusive adds a spurious final base and wrong totals.

**Worked example (predict before running):**

```python
depth=[0]*6
for i in range(1,4):depth[i]+=1
print(depth)
```

**Apply:** Return result list of per-position depth for data.length using only status='mapped' mappings, clipping end to contig length and excluding multi/unmapped.

**Prove (no solution shown):** Return result={'covered_positions':positive-depth positions,'mean_depth':total depth/sample.length} for uniquely mapped sample.mappings.

**Research question:** What does average depth fail to reveal about local uncovered genomic regions?

### N04-G03 — Build a feature count matrix with safe aggregation (137)

Use pandas to sum explicitly repeated sample×gene records, then pivot to a complete zero-filled matrix.

Silently taking the first duplicate record loses counts; treating absent combinations as missing instead of zero requires a stated policy.

**Worked example (predict before running):**

```python
import pandas as pd
x=pd.DataFrame({'s':['A','A'],'g':['X','X'],'n':[2,3]});print(x.groupby(['s','g']).n.sum().iloc[0])
```

**Apply:** Build a pandas pivot_table from data.counts with samples as row index, genes as columns and sum aggregation; return result as nested sample→gene→integer count, including zeros for missing combinations.

**Prove (no solution shown):** Sum repeated sample/gene counts from sample.counts; return result={'samples':sorted IDs,'genes':sorted IDs,'total':sum of all counts} without dropping duplicates.

**Research question:** When might an absent gene count mean unobserved rather than true zero?

### N04-G04 — Calculate counts per million with zero safeguards (138)

CPM = 1,000,000 × feature_count / total counts for a sample, after aggregating duplicate features.

A zero total library size is undefined CPM, not 0 or infinity; CPM is not a differential-expression test.

**Worked example (predict before running):**

```python
counts={'A':10,'B':30};print({k:1e6*v/sum(counts.values()) for k,v in counts.items()})
```

**Apply:** From data.counts return result nested sample→gene→CPM, aggregating duplicates first and using None for all features in a zero-total sample.

**Prove (no solution shown):** For sample.counts return result sample→sum of CPM across genes (None if total count 0), with duplicate features aggregated.

**Research question:** Why can a high CPM arise from compositional changes rather than a true increase in expression?

### N04-G05 — Audit a miniature sequence-analysis project (155)

Combine explicit mapping rates and count-table totals into a source-aware report without pretending a tiny example is RNA-seq.

A count matrix and coverage depth alone cannot establish a biological expression difference.

**Worked example (predict before running):**

```python
records=[{'sample':'S1','count':2},{'sample':'S1','count':3}]
print(sum(r['count'] for r in records))
```

**Apply:** Return result={'mapped_fraction':read fraction mapped at least once,'sample_libraries':sample→total count,'feature':data.feature} using data.mappings and data.counts.

**Prove (no solution shown):** Report result={'unique_mapped':integer,'covered_reference_bases':unique mapped positions covered on sample.length,'count_rows':input count-table rows}; no biological significance claim.

**Research question:** What metadata must accompany a real count table before interpreting treated-versus-control differences?

## Integrated capstone — Export a source-aware miniature NGS QC report

Package coverage, mapping summaries and library counts into one auditable result.

**Apply:** From data return result={'mapping_rate':mapped/multi fraction,'sample_totals':sample→sum count,'covered_bp':unique mapped coverage} with 0-based half-open coordinates.

**Prove:** For sample return result={'unique_map_fraction':exact mapped fraction,'zero_lib_samples':[sorted sample IDs with zero library sum], 'total_assigned_counts':sum counts}; do not modify inputs.

## Delayed review

From sample return result={'mapped_bp':unique positions with status='mapped','libs':dict(sample→total assigned count)} preserving records.

No worked solution or Prove hint is included. A passing public check is not retained mastery.

## Further reading

- https://biopython.org/docs/latest/Tutorial/
- https://biopython.org/docs/latest/Tutorial/
