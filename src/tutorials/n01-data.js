// N01 — original narrated example for synthetic DNA validation, GC, strand and translation.
"use strict";
(()=>{window.BioPythonSequenceTutorials=Object.freeze([...(window.BioPythonSequenceTutorials||[]),{
  "id": "n01-chapter",
  "chapter": "N01",
  "title": "Audit DNA before trusting the sequence",
  "short": "Bases, missing calls, GC, strand and protein",
  "minutes": "12–18 min",
  "goals": [
    "N01-G01",
    "N01-G02",
    "N01-G03",
    "N01-G04",
    "N01-CAPSTONE"
  ],
  "steps": [
    {
      "title": "What Python can establish about a DNA input",
      "say": "A sequence-processing script can transform a DNA string, but it cannot by itself certify a real gene, reading frame, or biological expression. We will audit synthetic sequence text, compute a declared GC fraction, reverse orientation and translate a separately chosen coding frame.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Source",
          "Synthetic DNA only"
        ],
        [
          "Question",
          "What is actually callable?"
        ],
        [
          "Destination",
          "Reproducible intake report"
        ]
      ],
      "output": "",
      "note": "All biological identities and measurements in this chapter are illustrative, and sample strings have no authentic sequencing provenance.",
      "goal": "N01-G01"
    },
    {
      "title": "Preserve the original and locate invalid characters",
      "say": "Uppercasing a copy makes the alphabet check consistent without changing the original input. Enumerate each position to locate a forbidden question-mark character instead of silently deleting it or replacing it with a nucleotide.",
      "code": "raw='aCgNt?'\ns=raw.upper()\nbad=[i for i,b in enumerate(s) if b not in 'ACGTN']\nprint(s,bad)",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Original",
          "aCgNt?"
        ],
        [
          "Normalized",
          "ACGNT?"
        ],
        [
          "Invalid index",
          "5 (zero based)"
        ]
      ],
      "output": "ACGNT? [5]",
      "note": "A strict ACGTN check flags question marks; do not interpret a cleaned or repaired string as if it were original sequence evidence.",
      "goal": "N01-G01"
    },
    {
      "title": "An allowed N is not a called nucleotide",
      "say": "An N denotes an unresolved base under this declared policy. The string may pass validation while having fewer positions suitable for sequence-specific calculations, and those ambiguous positions must remain visible in the intake report.",
      "code": "s='NNAT'\nprint('valid',all(b in 'ACGTN' for b in s),'N',s.count('N'),'callable',sum(b in 'ACGT' for b in s))",
      "focus": [
        2
      ],
      "visual": [
        [
          "Valid",
          "True under ACGTN"
        ],
        [
          "Unknown",
          "2 × N"
        ],
        [
          "Callable",
          "2 × A/T"
        ]
      ],
      "output": "valid True N 2 callable 2",
      "note": "Do not treat N as A, T, G or C when calculating observed nucleotide composition; an accepted alphabet is not verified data quality.",
      "goal": "N01-G01"
    },
    {
      "title": "Validation policy is explicit, not guessed",
      "say": "Under a stricter ACGT-only policy even N must be flagged. X also remains invalid: neither should be silently treated as a known DNA base merely because some other molecular alphabet permits X.",
      "code": "s='ANXT'\nallow_n=False\nalphabet='ACGTN' if allow_n else 'ACGT'\nprint([i for i,b in enumerate(s) if b not in alphabet])",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Input",
          "ANXT"
        ],
        [
          "Policy",
          "ACGT only"
        ],
        [
          "Flagged",
          "indices 1 and 2"
        ]
      ],
      "output": "[1, 2]",
      "note": "Record the allowed alphabet and zero-based character positions; do not mistake protein alphabet conventions for DNA-base validation.",
      "goal": "N01-G01"
    },
    {
      "title": "Use callable bases as the GC denominator",
      "say": "For GC among observed nucleotide calls, first select A, C, G, and T positions. In this synthetic record two of four called bases are G or C; treating the two N bases as called would change the scientific question.",
      "code": "s='GCNNAA'\ncalled=[b for b in s if b in 'ACGT']\nprint(f'GC_called={sum(b in \"GC\" for b in called)/len(called):.2f}',f'N_frac={s.count(\"N\")/len(s):.2f}')",
      "focus": [
        2,
        3
      ],
      "visual": [
        [
          "GC / called",
          "2 / 4 = 0.50"
        ],
        [
          "N / all",
          "2 / 6 = 0.33"
        ],
        [
          "Excluded",
          "N from GC denominator"
        ]
      ],
      "output": "GC_called=0.50 N_frac=0.33",
      "note": "Both fractions describe a synthetic string and require their own denominators; do not compare them without explicitly labeling what was counted.",
      "goal": "N01-G02"
    },
    {
      "title": "If every base is N, GC is undefined",
      "say": "Dividing by a zero callable-base count should not be caught by guessing the composition. Report None, which says that the sample contains no callable A, C, G or T positions for the chosen calculation.",
      "code": "s='NNN'\ncalled=[b for b in s if b in 'ACGT']\ngc=(sum(b in 'GC' for b in called)/len(called)) if called else None\nprint(gc)",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Callable",
          "0"
        ],
        [
          "GC fraction",
          "None"
        ],
        [
          "Not equal to",
          "GC = 0%"
        ]
      ],
      "output": "None",
      "note": "None means a fraction is not calculable from the available bases; it does not imply measured absence of G and C.",
      "goal": "N01-G02"
    },
    {
      "title": "Predict before revealing the calculated GC fraction",
      "say": "Pause at this unfamiliar short sequence: GGNNNA. If we exclude all three N positions, which bases enter the denominator, how many are G or C, and what three-decimal GC fraction should the next Python program print?",
      "code": "s='GGNNNA'\ncalled=[b for b in s if b in 'ACGT']\nprint(round(sum(b in 'GC' for b in called)/len(called),3))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Sequence",
          "G G N N N A"
        ],
        [
          "Question",
          "GC / callable = ?"
        ],
        [
          "Prediction",
          "Withheld until Reveal"
        ]
      ],
      "output": "",
      "note": "Decide whether the denominator is three or six before seeing the answer; this is a worked example, not a Prove-task solution.",
      "goal": "N01-G02",
      "checkpoint": true
    },
    {
      "title": "Reveal: two GC bases among three callable bases",
      "say": "The two G positions and one A position are the only callable bases. Three N positions remain unknown, so the correct fraction is two divided by three, rounded to 0.667, not two divided by six.",
      "code": "s='GGNNNA'\ncalled=[b for b in s if b in 'ACGT']\nprint(round(sum(b in 'GC' for b in called)/len(called),3))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "GC bases",
          "2 (G,G)"
        ],
        [
          "Callable",
          "3 (G,G,A)"
        ],
        [
          "GC / called",
          "0.667"
        ]
      ],
      "output": "0.667",
      "note": "If you predicted 0.333, inspect which uncertain N positions you included as measured bases and why that denominator is misleading.",
      "goal": "N01-G02"
    },
    {
      "title": "A reverse complement changes bases and direction",
      "say": "To read the opposite strand in its five-prime to three-prime direction, complement every nucleotide and reverse the order. Biopython's Seq object performs both steps and leaves an ambiguous N as N rather than inventing a base.",
      "code": "from Bio.Seq import Seq\ns='ATGCN'\nprint(str(Seq(s).reverse_complement()))",
      "focus": [
        1,
        3
      ],
      "visual": [
        [
          "Original 5′→3′",
          "ATGCN"
        ],
        [
          "Complement",
          "TACGN"
        ],
        [
          "Reverse complement",
          "NGCAT"
        ]
      ],
      "output": "NGCAT",
      "note": "Reverse complement is a sequence operation and does not independently establish which reference strand contains a biological transcript.",
      "goal": "N01-G03"
    },
    {
      "title": "Complement-only and reverse-complement are different",
      "say": "This example deliberately prints both transformations of the same synthetic string. Complementing yields GGTAC in the original left-to-right order, but reading the opposite strand five-prime to three-prime requires CATGG.",
      "code": "from Bio.Seq import Seq\ns=Seq('CCATG')\nprint(str(s.complement()),str(s.reverse_complement()))",
      "focus": [
        2,
        3
      ],
      "visual": [
        [
          "Original",
          "CCATG"
        ],
        [
          "Complement",
          "GGTAC"
        ],
        [
          "Reverse complement",
          "CATGG"
        ]
      ],
      "output": "GGTAC CATGG",
      "note": "Keep the input orientation and interval convention in metadata; a complement alone is not the sequence representation normally reported for a minus strand.",
      "goal": "N01-G03"
    },
    {
      "title": "Crop first, then orient a reference interval",
      "say": "Reference intervals often use zero-based, half-open coordinates in Python. Here [1:4] selects ACC from an invented reference; only after selecting that interval do we reverse-complement when the requested strand is minus.",
      "code": "from Bio.Seq import Seq\nreference='AACCGG'\nslice_=Seq(reference[1:4])\nprint(str(slice_),str(slice_.reverse_complement()))",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Reference",
          "AACCGG"
        ],
        [
          "Slice [1:4]",
          "ACC"
        ],
        [
          "Minus orientation",
          "GGT"
        ]
      ],
      "output": "ACC GGT",
      "note": "Reference file formats may use other coordinate systems; validate the source's convention before mixing Python slices with genomic annotations.",
      "goal": "N01-G03"
    },
    {
      "title": "Biopython translates in triplets using a genetic code",
      "say": "Biopython's default translation reads three nucleotides at a time. ATG specifies methionine, GCT specifies alanine and TAA is a stop, so the simple synthetic coding frame prints MA followed by an asterisk.",
      "code": "from Bio.Seq import Seq\nprint(str(Seq('ATGGCTTAA').translate()))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Codons",
          "ATG | GCT | TAA"
        ],
        [
          "Translation",
          "M | A | *"
        ],
        [
          "Interpretation",
          "* is stop"
        ]
      ],
      "output": "MA*",
      "note": "Default translation does not prove this is a genuine coding sequence or expressed product; its genetic code and frame are assumptions.",
      "goal": "N01-G04"
    },
    {
      "title": "An unknown codon is not a stop codon",
      "say": "This second synthetic frame contains NNN in the middle. Biopython's default translation represents its uncertain amino acid as X; the final fully specified TAA still yields the stop symbol, so X and asterisk have different meanings.",
      "code": "from Bio.Seq import Seq\nprint(str(Seq('ATGNNNTAA').translate()))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Codons",
          "ATG | NNN | TAA"
        ],
        [
          "Protein",
          "M | X | *"
        ],
        [
          "X means",
          "Ambiguous amino acid"
        ]
      ],
      "output": "MX*",
      "note": "X is uncertainty, not evidence for any particular amino acid; a stop is inferred only under the chosen translation table.",
      "goal": "N01-G04"
    },
    {
      "title": "Never silently truncate an incomplete coding frame",
      "say": "If the input length is not a multiple of three, the final bases cannot form a complete codon. The N01 intake policy explicitly refuses translation rather than quietly dropping or padding the leftover nucleotides.",
      "code": "s='ATGGCTTA'\nprint('frame_ok',len(s)%3==0)\nprint('refuse incomplete frame' if len(s)%3 else 'ready')",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Length",
          "8"
        ],
        [
          "Remainder",
          "2"
        ],
        [
          "Decision",
          "Refuse to translate"
        ]
      ],
      "output": "frame_ok False\nrefuse incomplete frame",
      "note": "A multiple-of-three length alone is not a guarantee of a valid CDS, correct start codon, valid terminal stop or biological expression.",
      "goal": "N01-G04"
    },
    {
      "title": "Combine checks into a source-preserving intake report",
      "say": "Bring the steps together using a separate synthetic DNA and coding frame. This independent Python program keeps unknown bases visible, computes GC only from called positions, makes a reverse complement with Bio.Seq and reports protein translation without claiming authentic expression.",
      "code": "from Bio.Seq import Seq\ndna='atgcnn'\ncds='ATGGCTTAA'\nseq=dna.upper()\ncalled=[b for b in seq if b in 'ACGT']\ngc=round(sum(b in 'GC' for b in called)/len(called),3) if called else None\nreport={'id':'synthetic-1','gc_called':gc,'unknown':seq.count('N'),'reverse_complement':str(Seq(seq).reverse_complement()),'protein':str(Seq(cds).translate())}\nprint(report)",
      "focus": [
        2,
        3,
        5,
        6,
        7
      ],
      "visual": [
        [
          "QC",
          "4 callable; 2 N"
        ],
        [
          "Strand",
          "NNGCAT"
        ],
        [
          "Protein",
          "MA* from declared CDS"
        ]
      ],
      "output": "{'id': 'synthetic-1', 'gc_called': 0.5, 'unknown': 2, 'reverse_complement': 'NNGCAT', 'protein': 'MA*'}",
      "note": "An accurate software report is not a validated gene annotation: preserve the original raw input, declared sequence policy and reading-frame assumptions.",
      "goal": "N01-CAPSTONE"
    },
    {
      "title": "Independent transfer: audit unfamiliar DNA and CDS inputs",
      "say": "Return to the Python editor and write an intake function for a different dataset with lowercase bases, an invalid X, one record containing only N, a negative strand and an incomplete coding frame. Without copying this worked example, return explicit validation indices, callable GC or None, reverse complement and a justified translation refusal.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Check",
          "Unexpected bases and N policy"
        ],
        [
          "Compute",
          "Called GC and strand"
        ],
        [
          "Decide",
          "Translate or refuse"
        ]
      ],
      "output": "",
      "note": "Independent task: use new sample inputs, keep original strings unchanged, do not reveal Apply/Prove answers, and demonstrate correct handling of all-N sequences.",
      "goal": "N01-CAPSTONE"
    }
  ]
}]);})();
