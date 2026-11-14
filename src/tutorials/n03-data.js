// N03 — synthetic read QC, trailing trim, overlapping motifs and explicit aligner.
"use strict";
(()=>{window.BioPythonSequenceTutorials=Object.freeze([...(window.BioPythonSequenceTutorials||[]),{
  "id": "n03-chapter",
  "chapter": "N03",
  "title": "Inspect read quality, trim and compare",
  "short": "Cycle-wise Q, trailing trim, motifs and alignment",
  "minutes": "15–20 min",
  "goals": [
    "N03-G01",
    "N03-G02",
    "N03-G03",
    "N03-G04",
    "N03-CAPSTONE"
  ],
  "steps": [
    {
      "title": "Follow synthetic read quality through an auditable analysis",
      "say": "A read-quality pipeline should preserve each source read, distinguish missing later cycles from low quality, trim only under a declared rule, count overlapping DNA motifs and report how any alignment was scored. We will demonstrate this workflow on synthetic data, not an authentic sequencing experiment.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Inspect",
          "per-cycle Phred and n"
        ],
        [
          "Transform",
          "terminal trimming + motifs"
        ],
        [
          "Compare",
          "explicit alignment score"
        ]
      ],
      "output": "",
      "note": "A small synthetic Python example is not FastQC, Cutadapt, a production mapping workflow or evidence of a biological sequence origin.",
      "goal": "N03-G01"
    },
    {
      "title": "Compute per-cycle quality using only observed positions",
      "say": "Two synthetic reads can have different lengths. At each cycle, include only records that actually contain that position; otherwise a shorter read's missing third base would be incorrectly interpreted as Phred zero.",
      "code": "reads=[[30,20,10],[40,20]]\nmeans=[sum(r[i] for r in reads if i<len(r))/sum(i<len(r) for r in reads) for i in range(3)]\nprint(means)",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Cycle 0",
          "(30+40)/2 = 35"
        ],
        [
          "Cycle 1",
          "(20+20)/2 = 20"
        ],
        [
          "Cycle 2",
          "10/1 = 10"
        ]
      ],
      "output": "[35.0, 20.0, 10.0]",
      "note": "Per-cycle means and their contributing read counts both matter; large sequencing datasets require richer distributions and full QC, not only a mean.",
      "goal": "N03-G01"
    },
    {
      "title": "Record cycle-specific sample counts alongside the means",
      "say": "The first and second positions have two observations, but the third has just one because the shorter read ends. Reporting n by cycle prevents a sparse end-cycle mean from being misread as equally supported.",
      "code": "reads=[[30,20,10],[40,20]]\nn=[sum(i<len(r) for r in reads) for i in range(3)]\nprint(n)",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Cycle 0",
          "n=2"
        ],
        [
          "Cycle 1",
          "n=2"
        ],
        [
          "Cycle 2",
          "n=1"
        ]
      ],
      "output": "[2, 2, 1]",
      "note": "A falling n can reflect variable read length; it is not necessarily the same as declining quality or a cause of low-quality bases.",
      "goal": "N03-G01"
    },
    {
      "title": "Zero-padding absent positions introduces false poor quality",
      "say": "Imagine only one Q10 observation remains at a later cycle. Padding a nonexistent second observation with Q0 produces a false mean of Q5. Count observed values instead of manufacturing zero measurements.",
      "code": "q=[10]\nprint(sum(q)/2,sum(q)/len(q))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Incorrect",
          "(10+0)/2 = 5"
        ],
        [
          "Correct",
          "10/1 = 10"
        ],
        [
          "Missing",
          "not a measured Q0"
        ]
      ],
      "output": "5.0 10.0",
      "note": "Missing observations are not zero-valued calls. Document the number of available reads and any selection bias introduced by previous trimming.",
      "goal": "N03-G01"
    },
    {
      "title": "Trim only the consecutive low-quality tail",
      "say": "This canonical introductory policy walks backward from the three-prime end while the final base quality is below twenty. The final two low-Q positions disappear, leaving the first three bases intact.",
      "code": "seq='ACGTT';q=[35,35,35,7,4];n=len(q)\nwhile n and q[n-1]<20:n-=1\nprint(seq[:n],n)",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Input",
          "ACGTT"
        ],
        [
          "3′ low-Q tail",
          "T T"
        ],
        [
          "Retained",
          "ACG"
        ]
      ],
      "output": "ACG 3",
      "note": "This is deliberately a simple terminal-run cutoff, not Cutadapt's more sophisticated quality-trimming algorithm; report the exact rule and threshold.",
      "goal": "N03-G02"
    },
    {
      "title": "An internal low-Q base is not automatically removed",
      "say": "The terminal-only rule stops walking as soon as it reaches a high-quality base. An internal Q6 value is therefore retained when a Q35 follows it, preserving original coordinate continuity within the retained prefix.",
      "code": "seq='ACGT';q=[35,6,35,3];n=len(q)\nwhile n and q[n-1]<20:n-=1\nprint(seq[:n],q[:n])",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Original Q",
          "35, 6, 35, 3"
        ],
        [
          "Trim tail",
          "remove Q3"
        ],
        [
          "Still inside",
          "Q6 retained"
        ]
      ],
      "output": "ACG [35, 6, 35]",
      "note": "Trimming every subthreshold position individually would shift base coordinates and break the sequence/quality alignment; do not describe this simpler rule as adapter removal.",
      "goal": "N03-G02"
    },
    {
      "title": "A read can be trimmed to zero length",
      "say": "If every synthetic quality is below the threshold, the same loop can remove the entire read. A downstream minimum-length rule then decides whether to discard it, while source ID and exclusion reason remain documented.",
      "code": "seq='ACG';q=[5,4,3];n=len(q)\nwhile n and q[n-1]<20:n-=1\nprint(repr(seq[:n]),n)",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Input",
          "ACG"
        ],
        [
          "All Q",
          "below 20"
        ],
        [
          "Retained bases",
          "0"
        ]
      ],
      "output": "'' 0",
      "note": "Do not quietly omit zero-length reads before counting exclusions; a declared minimum length is a preprocessing decision that changes sample composition.",
      "goal": "N03-G02"
    },
    {
      "title": "A sliding k-mer window overlaps by one position",
      "say": "For k equal to two, AAAA contains three overlapping AA windows starting at offsets zero, one and two. Nonoverlapping pairs would incorrectly report only two motifs for the canonical sliding-window definition.",
      "code": "from collections import Counter\ns='AAAA';k=2\nprint(dict(Counter(s[i:i+k] for i in range(len(s)-k+1))))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Window 0",
          "AA"
        ],
        [
          "Window 1",
          "AA"
        ],
        [
          "Window 2",
          "AA"
        ]
      ],
      "output": "{'AA': 3}",
      "note": "A k-mer count describes string windows, not an independently measured gene frequency or contamination diagnosis; reference context and QC are required.",
      "goal": "N03-G03"
    },
    {
      "title": "Exclude every k-mer window containing an unknown N",
      "say": "A motif under the ACGT-only policy must consist exclusively of called DNA letters. AANAAC has two windows that cross N, so count the other windows rather than filling unknown nucleotides with guesses.",
      "code": "s='AANAAC';k=2\nwindows=[s[i:i+k] for i in range(len(s)-k+1)]\nprint(windows)",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Full windows",
          "AA, AN, NA, AA, AC"
        ],
        [
          "Reject",
          "AN, NA"
        ],
        [
          "Keep",
          "ACGT-only windows"
        ]
      ],
      "output": "['AA', 'AN', 'NA', 'AA', 'AC']",
      "note": "No biological read is implied by this synthetic sequence. Excluding N-containing windows must be consistent across samples before comparing motif summaries.",
      "goal": "N03-G03"
    },
    {
      "title": "Predict motif counts before the answer is shown",
      "say": "Use the same synthetic AANAAC sequence and a two-base sliding window. Before revealing the Python output, predict the exact number of AA and AC motifs after rejecting windows containing N; include overlapping starts.",
      "code": "from collections import Counter\ns='AANAAC';k=2\ncounts=Counter(s[i:i+k] for i in range(len(s)-k+1) if set(s[i:i+k])<=set('ACGT'))\nprint(dict(sorted(counts.items())))",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "All windows",
          "5"
        ],
        [
          "Exclude N",
          "2"
        ],
        [
          "Counts",
          "Withheld"
        ]
      ],
      "output": "",
      "note": "First count all overlapping positions, then reject windows containing N. Do not reveal the dictionary until after committing to a prediction.",
      "goal": "N03-G03",
      "checkpoint": true
    },
    {
      "title": "Reveal: AA occurs twice and AC occurs once",
      "say": "The windows are AA, AN, NA, AA and AC. Only AA, AA and AC pass the ACGT-only rule, so the sorted dictionary has two AA motifs and one AC motif.",
      "code": "from collections import Counter\ns='AANAAC';k=2\ncounts=Counter(s[i:i+k] for i in range(len(s)-k+1) if set(s[i:i+k])<=set('ACGT'))\nprint(dict(sorted(counts.items())))",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "AA count",
          "2"
        ],
        [
          "AC count",
          "1"
        ],
        [
          "Invalid",
          "AN and NA"
        ]
      ],
      "output": "{'AA': 2, 'AC': 1}",
      "note": "A tempting error is to count only disjoint pairs. In genuine short-read work, k-mer frequency also depends on library composition and read-level QC.",
      "goal": "N03-G03"
    },
    {
      "title": "Terminal trimming changes which motifs remain observable",
      "say": "The original five-base synthetic read has four two-base windows. After the Q-based tail trim, only two valid windows remain, even though their upstream coordinates and source ID are still traceable.",
      "code": "seq='ACGTT';q=[35,35,35,7,4];k=2;n=len(q)\nwhile n and q[n-1]<20:n-=1\nprint([seq[i:i+k] for i in range(len(seq)-k+1)])\nprint([seq[i:i+k] for i in range(n-k+1)])",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Before trim",
          "AC CG GT TT"
        ],
        [
          "After trim",
          "AC CG"
        ],
        [
          "Source",
          "same read"
        ]
      ],
      "output": "['AC', 'CG', 'GT', 'TT']\n['AC', 'CG']",
      "note": "If you compare motif counts between experiments, use a consistent preprocessing policy and report the retained-base totals and read IDs.",
      "goal": "N03-G03"
    },
    {
      "title": "Declare global alignment and all score penalties",
      "say": "Biopython PairwiseAligner can compare two strings under many models. Define global alignment explicitly, give matches two points, mismatches minus one, opening a gap minus two and extending it minus a half before scoring.",
      "code": "from Bio.Align import PairwiseAligner\na=PairwiseAligner();a.mode='global'\na.match_score=2;a.mismatch_score=-1\na.open_gap_score=-2;a.extend_gap_score=-0.5\nprint(a.score('ACG','ACG'))",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Mode",
          "global"
        ],
        [
          "Three matches",
          "3 × 2"
        ],
        [
          "Score",
          "6.0"
        ]
      ],
      "output": "6.0",
      "note": "A score from three bases cannot be interpreted as an authentic genome mapping. Algorithm mode and scoring parameters must accompany any comparison.",
      "goal": "N03-G04"
    },
    {
      "title": "One mismatch makes the same-length score smaller",
      "say": "With the declared global scoring scheme, ACG versus ATG contains two matches and one mismatch. The score drops from six to three, demonstrating that the result depends on the chosen mismatch penalty.",
      "code": "from Bio.Align import PairwiseAligner\na=PairwiseAligner();a.mode='global'\na.match_score=2;a.mismatch_score=-1\na.open_gap_score=-2;a.extend_gap_score=-0.5\nprint(a.score('ACG','ATG'))",
      "focus": [
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Matches",
          "2 × 2 = +4"
        ],
        [
          "Mismatch",
          "−1"
        ],
        [
          "Score",
          "3.0"
        ]
      ],
      "output": "3.0",
      "note": "This is a tiny synthetic alignment with an explicit global scoring model, not evidence for species identification or sequence homology.",
      "goal": "N03-G04"
    },
    {
      "title": "A gap is penalized separately from a mismatch",
      "say": "When ACGT is aligned against AGT, a single gap permits three matches under this scoring scheme. One gap-open penalty of minus two gives a total of four, but different penalties could change the favored alignment.",
      "code": "from Bio.Align import PairwiseAligner\na=PairwiseAligner();a.mode='global'\na.match_score=2;a.mismatch_score=-1\na.open_gap_score=-2;a.extend_gap_score=-0.5\nprint(a.score('ACGT','AGT'))",
      "focus": [
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Matches",
          "3 × 2 = 6"
        ],
        [
          "Gap open",
          "−2"
        ],
        [
          "Score",
          "4.0"
        ]
      ],
      "output": "4.0",
      "note": "Alignment scores depend on string lengths, scoring policy and alternatives; compare sequences under the same declared scheme and not by unnormalized scores alone.",
      "goal": "N03-G04"
    },
    {
      "title": "Document the configuration instead of relying on defaults",
      "say": "A reproducible sequence comparison includes the alignment mode and all score settings, not only the numerical score. Explicit parameters protect a tiny example against defaults that can change between Biopython releases.",
      "code": "from Bio.Align import PairwiseAligner\na=PairwiseAligner();a.mode='global';a.match_score=2;a.mismatch_score=-1\na.open_gap_score=-2;a.extend_gap_score=-0.5\nprint(a.mode,a.match_score,a.mismatch_score,a.open_gap_score,a.extend_gap_score)",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Mode",
          "global"
        ],
        [
          "match/mismatch",
          "2 / −1"
        ],
        [
          "gap open/extend",
          "−2 / −0.5"
        ]
      ],
      "output": "global 2.0 -1.0 -2.0 -0.5",
      "note": "This model teaches transparent scoring, not mapping specificity, expected-value significance, biological homology or a production validated alignment pipeline.",
      "goal": "N03-G04"
    },
    {
      "title": "Capstone: preserve read IDs while trimming and counting",
      "say": "Combine the synthetic read quality table and two-base motif counts in actual Python. Keep only reads at least three bases long after a strict terminal Q-below-twenty trim and skip motif windows containing N, while retaining source read IDs.",
      "code": "from collections import Counter\nreads=[('r1','ACGTT',[35,35,35,7,4]),('r2','ACGN',[30,30,30,30])]\ntrimmed=[]\nfor rid,seq,q in reads:\n n=len(q)\n while n and q[n-1]<20:n-=1\n if n>=3:trimmed.append((rid,seq[:n]))\nkmers=Counter(s[i:i+2] for _,s in trimmed for i in range(len(s)-1) if set(s[i:i+2])<=set('ACGT'))\nprint(trimmed)\nprint(dict(sorted(kmers.items())))",
      "focus": [
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10
      ],
      "visual": [
        [
          "r1 retained",
          "ACG"
        ],
        [
          "r2 retained",
          "ACGN"
        ],
        [
          "Motifs",
          "AC ×2; CG ×2"
        ]
      ],
      "output": "[('r1', 'ACG'), ('r2', 'ACGN')]\n{'AC': 2, 'CG': 2}",
      "note": "No authentic reads, reference genome or uncertainty estimates enter this toy capstone. Record trim thresholds, rejected IDs and k-mer policy for actual science.",
      "goal": "N03-CAPSTONE"
    },
    {
      "title": "Independent transfer: can the analysis survive changed reads?",
      "say": "Return to the editor and write a new analysis using unequal read lengths, internal and trailing low-quality bases, an all-low read, Ns, a different k and a changed alignment mismatch penalty. Report per-cycle n, trimmed IDs and exclusions, overlapping motifs and explicitly configured scores without copying the displayed solution.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Cycles",
          "Exclude missing calls"
        ],
        [
          "Reads",
          "Preserve IDs and trim policy"
        ],
        [
          "Scores",
          "Declare every assumption"
        ]
      ],
      "output": "",
      "note": "Unassisted transfer uses new inputs and must not reuse hidden Apply/Prove answers. A passing automated script is not independent biological validation or demonstrated learner mastery.",
      "goal": "N03-CAPSTONE"
    }
  ]
}]);})();
