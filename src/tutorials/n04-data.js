// N04 — source-aware synthetic alignment categories, reference depth, Pandas count matrix and CPM.
"use strict";
(()=>{window.BioPythonSequenceTutorials=Object.freeze([...(window.BioPythonSequenceTutorials||[]),{
  "id": "n04-chapter",
  "chapter": "N04",
  "title": "Audit mapping, coverage and counts",
  "short": "Read categories, reference depth, count matrices and CPM",
  "minutes": "16–22 min",
  "goals": [
    "N04-G01",
    "N04-G02",
    "N04-G03",
    "N04-G04",
    "N04-G05",
    "N04-CAPSTONE"
  ],
  "steps": [
    {
      "title": "The destination: a defensible miniature sequencing audit",
      "say": "Imagine a researcher receiving toy read mapping labels, reference intervals and sample-by-gene count records. The Python goal is to summarize them without multiplying multi-mapped reads, shifting intervals, losing duplicate ledger entries or overinterpreting counts. Every number here is synthetic training data.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Read QC",
          "one source ID / category"
        ],
        [
          "Reference",
          "half-open covered bases"
        ],
        [
          "Features",
          "sum before CPM"
        ]
      ],
      "output": "",
      "note": "No BAM, genome assembly, featureCounts output, instrument metadata, sequencing library or biological replicates are supplied; this is strictly an in-memory training audit.",
      "goal": "N04-G01"
    },
    {
      "title": "Define read statuses before counting anything",
      "say": "This miniature table assigns one mutually exclusive label to each source read: uniquely mapped, multimapped or unmapped. Real SAM and BAM contain primary, secondary and supplementary alignment records, so this toy per-read list must never be mistaken for raw SAM flag statistics.",
      "code": "from collections import Counter\nstatus=['mapped','mapped','multi','unmapped']\nprint(dict(Counter(status)))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "mapped",
          "2 source reads"
        ],
        [
          "multi",
          "1 source read"
        ],
        [
          "unmapped",
          "1 source read"
        ]
      ],
      "output": "{'mapped': 2, 'multi': 1, 'unmapped': 1}",
      "note": "A multimapping source read may have several alignment records, but it remains one read in this simplified mutually exclusive status table.",
      "goal": "N04-G01"
    },
    {
      "title": "Count mapped-at-least-once without duplicating multimappers",
      "say": "In a simplified exclusive-status list, every mapped or multimapped entry contributes one source read to the numerator. Two uniquely mapped plus one multi among four total give three quarters, not more than one because of multiple hits.",
      "code": "status=['mapped','mapped','multi','unmapped']\nprint(sum(s!='unmapped' for s in status)/len(status))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Mapped unique",
          "2"
        ],
        [
          "Multimapping",
          "1 (count once)"
        ],
        [
          "Mapped at least once",
          "3/4 = 0.75"
        ]
      ],
      "output": "0.75",
      "note": "The denominator is source reads, not the number of alignments. State the simplified category policy explicitly before translating to real mapping flags.",
      "goal": "N04-G01"
    },
    {
      "title": "At-least-once mapped differs from uniquely mapped",
      "say": "Uniquely mapped excludes the multi category, while mapped at least once includes it. Both fractions are legitimate descriptions of this toy table, but they answer different questions and cannot be interchanged.",
      "code": "status=['mapped','mapped','multi','unmapped']\nn=len(status)\nprint(sum(x=='mapped' for x in status)/n,sum(x!='unmapped' for x in status)/n)",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Uniquely mapped",
          "2/4 = 0.50"
        ],
        [
          "Mapped at least once",
          "3/4 = 0.75"
        ],
        [
          "Difference",
          "multimapping"
        ]
      ],
      "output": "0.5 0.75",
      "note": "Actual alignment-file summaries require explicit handling of secondary and supplementary records and of paired reads; this list is not samtools flagstat.",
      "goal": "N04-G01"
    },
    {
      "title": "Coverage uses zero-based half-open intervals",
      "say": "A mapped toy interval starting at one and ending at four contributes to positions one, two and three, because Python excludes the end. Drawing the positions before calculating prevents an off-by-one extra covered base.",
      "code": "depth=[0]*6\nfor i in range(1,4):depth[i]+=1\nprint(depth)",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Reference",
          "6 positions (0–5)"
        ],
        [
          "Interval",
          "[1:4)"
        ],
        [
          "Depth",
          "0,1,1,1,0,0"
        ]
      ],
      "output": "[0, 1, 1, 1, 0, 0]",
      "note": "Reference coordinates are half-open by declared convention; annotation formats with one-based inclusive positions must be transformed before using this code.",
      "goal": "N04-G02"
    },
    {
      "title": "Overlapping intervals increase depth at shared bases",
      "say": "When two mapped intervals overlap, their shared position has depth two. The number of covered positions and sum of coverage depths are therefore distinct statistics even in this six-base invented reference.",
      "code": "depth=[0]*6\nfor start,end in [(1,4),(3,6)]:\n for i in range(start,end):depth[i]+=1\nprint(depth)",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "First interval",
          "[1:4)"
        ],
        [
          "Second interval",
          "[3:6)"
        ],
        [
          "Overlap",
          "index 3, depth 2"
        ]
      ],
      "output": "[0, 1, 1, 2, 1, 1]",
      "note": "Read depth is not a count of independent molecules or a biological replicate measurement; redundant, duplicate or multi mapping policies affect its meaning.",
      "goal": "N04-G02"
    },
    {
      "title": "Clip out-of-range mapped intervals and ignore excluded categories",
      "say": "Here a mapped interval starts below zero and another ends beyond the six-base reference. Clip each to valid positions, but deliberately exclude the toy multi and unmapped categories under this uniquely mapped coverage policy.",
      "code": "length=6;depth=[0]*length\nrecords=[('mapped',-2,2),('mapped',5,9),('multi',0,6),('unmapped',0,6)]\nfor status,start,end in records:\n if status=='mapped':\n  for i in range(max(0,start),min(length,end)):depth[i]+=1\nprint(depth)",
      "focus": [
        2,
        3,
        4,
        5,
        6
      ],
      "visual": [
        [
          "Mapped clip",
          "[0:2), [5:6)"
        ],
        [
          "Excluded",
          "multi and unmapped"
        ],
        [
          "Depth",
          "1,1,0,0,0,1"
        ]
      ],
      "output": "[1, 1, 0, 0, 0, 1]",
      "note": "Clipping should be logged as an input-QC event; do not silently treat an invalid reference interval as a fully observed alignment.",
      "goal": "N04-G02"
    },
    {
      "title": "Distinguish breadth of coverage from mean depth",
      "say": "On a six-position reference, a depth array can cover four positions but contain five total aligned bases because one position has depth two. Report covered positions and average depth separately, along with the interval policy.",
      "code": "depth=[0,1,1,2,1,0]\nprint(sum(x>0 for x in depth),round(sum(depth)/len(depth),3))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Covered positions",
          "4"
        ],
        [
          "Total depth",
          "5"
        ],
        [
          "Mean depth",
          "5/6 = 0.833"
        ]
      ],
      "output": "4 0.833",
      "note": "A mean depth alone hides uncovered gaps; all toy coverages must specify reference length, coordinate system and read inclusion policy.",
      "goal": "N04-G02"
    },
    {
      "title": "Do not discard duplicate sample-by-gene count rows",
      "say": "The synthetic source ledger contains two A–X entries with counts two and three. Adding them yields five; selecting the first entry or overwriting a dictionary key would silently lose recorded values.",
      "code": "import pandas as pd\nrows=pd.DataFrame({'sample':['A','A','A'],'gene':['X','X','Y'],'count':[2,3,1]})\nprint(rows.groupby('gene')['count'].sum().to_dict())",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Source rows",
          "A–X:2, A–X:3"
        ],
        [
          "Aggregation",
          "X:5"
        ],
        [
          "Other feature",
          "Y:1"
        ]
      ],
      "output": "{'X': 5, 'Y': 1}",
      "note": "Summing repeated rows is a declared policy for this teaching ledger, not proof that repeated rows in a real file are independent observations or safe to double-count.",
      "goal": "N04-G03"
    },
    {
      "title": "Explicit pivot aggregation prevents silent averaging",
      "say": "Pandas pivot_table defaults to a mean, which is inappropriate for the repeated count rows under the chosen toy aggregation rule. Ask for sum and zero fill explicitly, then retain both sample and gene identifiers in the resulting matrix.",
      "code": "import pandas as pd\nx=pd.DataFrame({'sample':['A','A','A','B'],'gene':['X','X','Y','Y'],'count':[2,3,4,2]})\nm=x.pivot_table(index='sample',columns='gene',values='count',aggfunc='sum',fill_value=0)\nprint(m.to_dict(orient='index'))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "A",
          "X=5, Y=4"
        ],
        [
          "B",
          "X=0, Y=2"
        ],
        [
          "Aggregation",
          "sum, fill_value=0"
        ]
      ],
      "output": "{'A': {'X': 5, 'Y': 4}, 'B': {'X': 0, 'Y': 2}}",
      "note": "A zero-filled missing sample-feature cell is an explicit modeling choice; if metadata or expected features are absent, do not equate missing records with verified biological zeros.",
      "goal": "N04-G03"
    },
    {
      "title": "A filled zero is not always an observed zero",
      "say": "The toy pivot can fill a missing A–Y row with zero, but the original ledger never observed that combination. Preserve a separate presence flag so a downstream analyst can distinguish an explicit zero-count row from an imputed empty cell.",
      "code": "import pandas as pd\nx=pd.DataFrame({'s':['A','B'],'g':['X','Y'],'n':[5,2]})\nm=x.pivot_table(index='s',columns='g',values='n',aggfunc='sum',fill_value=0)\nprint(('A','Y') in set(zip(x.s,x.g)),int(m.loc['A','Y']))",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Source row A–Y",
          "absent"
        ],
        [
          "Pivot A–Y",
          "0 by policy"
        ],
        [
          "Audit flag",
          "False (not observed)"
        ]
      ],
      "output": "False 0",
      "note": "In an incomplete sequencing count matrix, missingness may indicate missing assay features, merge failure or absence under a defined counting policy; document which.",
      "goal": "N04-G03"
    },
    {
      "title": "Use assigned library counts for the declared CPM denominator",
      "say": "Counts per million here divides each aggregated feature count by the sum of assigned feature counts for that sample. For ten and thirty counts the shares are one quarter and three quarters, scaled by one million.",
      "code": "counts={'G1':10,'G2':30}\ntotal=sum(counts.values())\nprint(counts['G1']/total*1e6,counts['G2']/total*1e6)",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Sample assigned total",
          "40"
        ],
        [
          "G1",
          "10 / 40"
        ],
        [
          "Scale",
          "× 1,000,000"
        ]
      ],
      "output": "250000.0 750000.0",
      "note": "An assigned-feature-count total is not necessarily total sequenced reads or uniquely mapped reads. CPM is not gene-length adjustment or a differential-expression test.",
      "goal": "N04-G04"
    },
    {
      "title": "Predict the CPM share before the output is revealed",
      "say": "For a miniature sample containing ten G1 counts and thirty G2 counts, predict each gene's counts per million using the assigned total, not the number of raw input reads or the length of either gene.",
      "code": "counts={'G1':10,'G2':30}\nlib=sum(counts.values())\nprint({k:int(1_000_000*v/lib) for k,v in counts.items()})",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Assigned library total",
          "?"
        ],
        [
          "G1 CPM",
          "Withheld"
        ],
        [
          "G2 CPM",
          "Withheld"
        ]
      ],
      "output": "",
      "note": "Decide what counts as the denominator before revealing the scaled fractions. This is a worked checkpoint, not a solution to hidden Prove tasks.",
      "goal": "N04-G04",
      "checkpoint": true
    },
    {
      "title": "Reveal: 250,000 and 750,000 CPM share one sample",
      "say": "The two feature counts sum to forty assigned counts. Ten contributes one quarter of that total, so its CPM is 250,000, while thirty contributes 750,000; the shares sum to one million by construction.",
      "code": "counts={'G1':10,'G2':30}\nlib=sum(counts.values())\nprint({k:int(1_000_000*v/lib) for k,v in counts.items()})",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Assigned count",
          "40"
        ],
        [
          "G1",
          "250,000 CPM"
        ],
        [
          "G2",
          "750,000 CPM"
        ]
      ],
      "output": "{'G1': 250000, 'G2': 750000}",
      "note": "This internal compositional normalization does not correct RNA composition, transcript length, sample design or condition effects, and it cannot establish a real differential expression result.",
      "goal": "N04-G04"
    },
    {
      "title": "A zero-total sample has undefined CPM, not zero CPM",
      "say": "A sample with no assigned counts has no meaningful CPM denominator. Explicitly return None for each feature instead of dividing by zero or claiming that every gene's normalized abundance was measured as zero.",
      "code": "counts={'G1':0,'G2':0}\nlib=sum(counts.values())\nprint({g:(1e6*v/lib if lib else None) for g,v in counts.items()})",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Assigned total",
          "0"
        ],
        [
          "G1 CPM",
          "None"
        ],
        [
          "G2 CPM",
          "None"
        ]
      ],
      "output": "{'G1': None, 'G2': None}",
      "note": "Zero library size can indicate a failed source or a deliberately empty toy table; neither case establishes biological absence of all features.",
      "goal": "N04-G04"
    },
    {
      "title": "A constant gene count can show a changed CPM",
      "say": "Even if G1 retains ten assigned counts in both imaginary samples, increasing G2 from thirty to ninety lowers the G1 CPM from 250,000 to 100,000. A compositional shift is not evidence that G1 changed in absolute molecular abundance.",
      "code": "a=int(1e6*10/(10+30))\nb=int(1e6*10/(10+90))\nprint(a,b)",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "G1 raw count",
          "10 in both"
        ],
        [
          "CPM first",
          "250,000"
        ],
        [
          "CPM second",
          "100,000"
        ]
      ],
      "output": "250000 100000",
      "note": "Assigned counts are not absolute molecule counts. Between-sample comparisons need appropriate normalization, replicates, bias assessment and statistical analysis.",
      "goal": "N04-G04"
    },
    {
      "title": "Combine mapping and sample totals without mixing denominators",
      "say": "The fraction mapped at least once is based on source read statuses, while feature library totals sum assigned count rows. Python should compute these separately, preserving the source grouping and the denominator each result uses.",
      "code": "status=['mapped','multi','unmapped','mapped']\nrows=[('A',2),('A',3),('B',0)]\nlibs={s:sum(n for sid,n in rows if sid==s) for s in sorted({sid for sid,_ in rows})}\nprint({'mapped_any':sum(v!='unmapped' for v in status)/len(status),'libraries':libs})",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Mapped any",
          "0.75 source reads"
        ],
        [
          "Library A",
          "5 assigned counts"
        ],
        [
          "Library B",
          "0 assigned counts"
        ]
      ],
      "output": "{'mapped_any': 0.75, 'libraries': {'A': 5, 'B': 0}}",
      "note": "Mapping fractions and feature-count totals are different kinds of quantities and should not be equated without an explicit read-assignment policy.",
      "goal": "N04-G05"
    },
    {
      "title": "A report also needs policy, provenance and limits",
      "say": "A numerical output has little scientific meaning without source IDs and the rules that produced it. Here the manifest explicitly says synthetic, uses uniquely mapped depth, and records the half-open coordinate convention rather than silently implying reference calibration.",
      "code": "manifest={'source':'synthetic','reference':'toy-contig','coverage':'unique-only','coordinates':'zero-based half-open'}\nprint(manifest)",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Data status",
          "synthetic"
        ],
        [
          "Coverage",
          "unique-only"
        ],
        [
          "Coordinates",
          "zero-based half-open"
        ]
      ],
      "output": "{'source': 'synthetic', 'reference': 'toy-contig', 'coverage': 'unique-only', 'coordinates': 'zero-based half-open'}",
      "note": "A real project requires genome/annotation versions, read and alignment identities, quantifier settings, sample metadata, biological design and exclusion traces.",
      "goal": "N04-G05"
    },
    {
      "title": "Capstone: a source-aware toy map, coverage and count report",
      "say": "Run the whole introductory audit on synthetic data. Record mapped-at-least-once fraction from one status per source read, cover a six-base toy contig with uniquely mapped half-open intervals, then sum repeated sample-by-gene count rows with Pandas.",
      "code": "import pandas as pd\nstatuses=['mapped','multi','unmapped','mapped']\nintervals=[('mapped',1,4),('mapped',3,6),('multi',0,6)]\ndepth=[0]*6\nfor status,start,end in intervals:\n if status=='mapped':\n  for pos in range(max(0,start),min(len(depth),end)):depth[pos]+=1\nrows=pd.DataFrame({'sample':['A','A','A','B'],'gene':['X','X','Y','X'],'count':[2,3,5,0]})\nlibs=rows.groupby('sample')['count'].sum().to_dict()\nreport={'mapping_rate':sum(s!='unmapped' for s in statuses)/len(statuses),'covered_bp':sum(v>0 for v in depth),'sample_totals':libs}\nprint(report)",
      "focus": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11
      ],
      "visual": [
        [
          "Mapping rate",
          "0.75 per source read"
        ],
        [
          "Covered bases",
          "5 on toy contig"
        ],
        [
          "Libraries",
          "A=10, B=0"
        ]
      ],
      "output": "{'mapping_rate': 0.75, 'covered_bp': 5, 'sample_totals': {'A': 10, 'B': 0}}",
      "note": "The interval and count tables are independent synthetic teaching fixtures; this capstone is not a real aligned RNA-seq workflow, nor evidence for an expression effect.",
      "goal": "N04-CAPSTONE"
    },
    {
      "title": "Independent transfer: audit a changed sequence-analysis project",
      "say": "Return to the real Python editor and audit a fresh source table with all-unmapped statuses, overlapping and clipped unique intervals, a repeated gene count, an absent sample-gene cell, and a zero-total library. Recompute mapping fractions, covered bases, aggregated count matrix and CPM or None, explaining each denominator and limit.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Read QC",
          "Count source reads once"
        ],
        [
          "Reference",
          "Clip and count covered positions"
        ],
        [
          "Features",
          "Sum, zero safeguard, caveat"
        ]
      ],
      "output": "",
      "note": "Solve with new inputs, preserve their metadata and do not copy this completed report. A valid script alone cannot establish biological replicates, genome mapping quality or differential expression.",
      "goal": "N04-CAPSTONE"
    }
  ]
}]);})();
