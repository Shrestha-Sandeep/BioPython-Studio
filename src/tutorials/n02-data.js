// N02 — research-led synthetic SeqRecord, FASTA, coordinates and FASTQ tutorial.
"use strict";
(()=>{window.BioPythonSequenceTutorials=Object.freeze([...(window.BioPythonSequenceTutorials||[]),{
  "id": "n02-chapter",
  "chapter": "N02",
  "title": "Read sequence files without losing identity",
  "short": "SeqRecords, FASTA, coordinates and FASTQ qualities",
  "minutes": "15–20 min",
  "goals": [
    "N02-G01",
    "N02-G02",
    "N02-G03",
    "N02-G04",
    "N02-CAPSTONE"
  ],
  "steps": [
    {
      "title": "The destination: audit a synthetic sequencing intake",
      "say": "A useful sequencing pipeline preserves which record was read, what bases it carried, which interval was requested and what quality values were supplied. We will use miniature in-memory FASTA and FASTQ strings, not authentic sequencing files, to build an identity-safe report.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Input 1",
          "FASTA IDs + bases"
        ],
        [
          "Input 2",
          "FASTQ IDs + per-base Q"
        ],
        [
          "Output",
          "Traceable QC report"
        ]
      ],
      "output": "",
      "note": "These invented records and quality symbols are teaching inputs; identical IDs alone do not establish that two files came from the same sequencing experiment.",
      "goal": "N02-G01"
    },
    {
      "title": "A SeqRecord joins a sequence to its identity",
      "say": "A Bio.Seq object stores nucleotide data, while a Bio.SeqRecord also carries an identifier and descriptive metadata. Create the record explicitly from a Seq so that downstream transformations can retain its source identity rather than just producing anonymous strings.",
      "code": "from Bio.Seq import Seq\nfrom Bio.SeqRecord import SeqRecord\nr=SeqRecord(Seq('ATGN'),id='read01',description='synthetic')\nprint(r.id,len(r.seq),str(r.seq))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "ID",
          "read01"
        ],
        [
          "Seq",
          "ATGN"
        ],
        [
          "Description",
          "synthetic"
        ]
      ],
      "output": "read01 4 ATGN",
      "note": "The identifier and description are input annotations, not independent proof of a real organism, genomic location or protein-coding sequence.",
      "goal": "N02-G01"
    },
    {
      "title": "Derived sequences still need an original record ID",
      "say": "A reverse-complement operation can create a different sequence representation. Here the source SeqRecord is left unchanged, and the output prints both the original ID and the newly derived opposite-strand string for explicit traceability.",
      "code": "from Bio.Seq import Seq\nfrom Bio.SeqRecord import SeqRecord\nr=SeqRecord(Seq('ATGN'),id='r01',description='synthetic')\nprint(r.id,str(r.seq.reverse_complement()),str(r.seq))",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Source ID",
          "r01"
        ],
        [
          "Original",
          "ATGN"
        ],
        [
          "Derived RC",
          "NCAT"
        ]
      ],
      "output": "r01 NCAT ATGN",
      "note": "Preserve the original sequence and record whether a reverse-complement transformation was applied; do not reinterpret the transformed string as a second independently observed read.",
      "goal": "N02-G01"
    },
    {
      "title": "A description field is metadata, not a biological result",
      "say": "Biopython stores a record description separately from its identifier. You can serialize or inspect both, but a description such as synthetic only is still a label supplied by the author rather than evidence from the sequencer.",
      "code": "from Bio.Seq import Seq\nfrom Bio.SeqRecord import SeqRecord\nr=SeqRecord(Seq('AC'),id='sampleA',description='synthetic only')\nprint(r.id,r.description)",
      "focus": [
        3,
        4
      ],
      "visual": [
        [
          "ID",
          "sampleA"
        ],
        [
          "Description",
          "synthetic only"
        ],
        [
          "Evidence",
          "not independently verified"
        ]
      ],
      "output": "sampleA synthetic only",
      "note": "Treat record headers as metadata requiring provenance and QC before merging with measurements, even when the parsed syntax is valid.",
      "goal": "N02-G01"
    },
    {
      "title": "A FASTA header separates one record from the next",
      "say": "Biopython SeqIO.parse reads a file-like object and recognizes FASTA headers as record boundaries. Do not concatenate the two sequences into a single long string, because their separate identifiers and lengths would be destroyed.",
      "code": "from Bio import SeqIO\nfrom io import StringIO\nraw='>a\\nACG\\n>b\\nTT\\n'\nprint([(r.id,len(r.seq)) for r in SeqIO.parse(StringIO(raw),'fasta')])",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Record a",
          "ACG (3 bases)"
        ],
        [
          "Record b",
          "TT (2 bases)"
        ],
        [
          "Parser",
          "one SeqRecord per header"
        ]
      ],
      "output": "[('a', 3), ('b', 2)]",
      "note": "FASTA contains sequence text and identifiers but not per-base Phred qualities, and these synthetic characters have no verified instrument origin.",
      "goal": "N02-G02"
    },
    {
      "title": "Line wrapping does not create a new sequence",
      "say": "The FASTA parser combines consecutive sequence lines until the next greater-than header. A header description can contain words beyond the primary identifier; keep it separate from the sequence and verify the original record name.",
      "code": "from Bio import SeqIO\nfrom io import StringIO\nraw='>sample7 note\\nAC\\nGT\\n>sample8\\nNN\\n'\nprint([(r.id,str(r.seq),r.description) for r in SeqIO.parse(StringIO(raw),'fasta')])",
      "focus": [
        3,
        4
      ],
      "visual": [
        [
          "First ID",
          "sample7"
        ],
        [
          "First sequence",
          "ACGT"
        ],
        [
          "Description",
          "sample7 note"
        ]
      ],
      "output": "[('sample7', 'ACGT', 'sample7 note'), ('sample8', 'NN', 'sample8')]",
      "note": "Source line wrapping is not the same as record structure; preserve raw file text separately when exact textual provenance matters.",
      "goal": "N02-G02"
    },
    {
      "title": "Duplicate FASTA IDs can silently corrupt downstream joins",
      "say": "Two separate records may share the same parsed identifier even when their sequence strings differ. That makes an ID-based join ambiguous, so report the duplication as a QC concern rather than overwriting a dictionary entry.",
      "code": "from Bio import SeqIO\nfrom io import StringIO\nraw='>r1\\nAC\\n>r1\\nGT\\n>r2\\nTT\\n'\nids=[r.id for r in SeqIO.parse(StringIO(raw),'fasta')]\nprint(ids,len(ids)==len(set(ids)))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "ID 1",
          "r1"
        ],
        [
          "ID 2",
          "r1 (duplicate)"
        ],
        [
          "Uniqueness",
          "False"
        ]
      ],
      "output": "['r1', 'r1', 'r2'] False",
      "note": "Do not silently keep only the first or last duplicate; you need an explicit policy and full source-row trace for trustworthy metadata merges.",
      "goal": "N02-G02"
    },
    {
      "title": "Round-trip records, not original FASTA text formatting",
      "say": "SeqIO can read parsed records and write them to new FASTA text. IDs and base strings may remain semantically equal, while source line wrapping changes; that difference matters if your claim is exact byte preservation.",
      "code": "from Bio import SeqIO\nfrom io import StringIO\nraw='>a\\nAC\\nGT\\n>b\\nTT\\n'\nsrc=list(SeqIO.parse(StringIO(raw),'fasta'))\nout=StringIO()\nSeqIO.write(src,out,'fasta')\nagain=list(SeqIO.parse(StringIO(out.getvalue()),'fasta'))\nprint([(r.id,str(r.seq)) for r in src]==[(r.id,str(r.seq)) for r in again],out.getvalue()==raw)",
      "focus": [
        4,
        5,
        6,
        7,
        8
      ],
      "visual": [
        [
          "Record equivalence",
          "True"
        ],
        [
          "Exact raw text",
          "False"
        ],
        [
          "Change",
          "FASTA line wrapping"
        ]
      ],
      "output": "True False",
      "note": "A successful semantic round-trip does not imply lossless reconstruction of source whitespace, line breaks, sequence formatting or ancillary metadata.",
      "goal": "N02-G02"
    },
    {
      "title": "Python reference intervals use half-open coordinates",
      "say": "In a string indexed from zero, slicing positions one through four includes indices one, two and three, not index four. Explicit coordinates are essential when comparing Python results with one-based inclusive annotation formats.",
      "code": "s='AACCGG'\nprint(s[1:4],len(s[1:4]))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Source",
          "A A C C G G"
        ],
        [
          "Selected [1:4)",
          "A C C"
        ],
        [
          "Length",
          "3 bases"
        ]
      ],
      "output": "ACC 3",
      "note": "Record whether source coordinates are zero-based half-open or one-based inclusive, and never infer that format from a numeric interval alone.",
      "goal": "N02-G03"
    },
    {
      "title": "First extract the interval, then interpret its strand",
      "say": "Use the parsed reference sequence and a declared half-open interval to select ACC. If the requested interval is on the minus strand, reverse-complement that slice to report the opposite orientation as GGT.",
      "code": "from Bio import SeqIO\nfrom io import StringIO\nr=SeqIO.read(StringIO('>chr1\\nAACCGG\\n'),'fasta')\nroi=r.seq[1:4]\nprint(str(roi),str(roi.reverse_complement()))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Interval",
          "ACC"
        ],
        [
          "Minus orientation",
          "GGT"
        ],
        [
          "Source ID",
          "chr1"
        ]
      ],
      "output": "ACC GGT",
      "note": "A strand symbol describes an interpretation of an interval, not a change to the reference source; preserve original reference and annotation IDs.",
      "goal": "N02-G03"
    },
    {
      "title": "Reject out-of-bounds requests rather than clipping them",
      "say": "Python string slicing can quietly truncate an out-of-range end coordinate. For scientific interval extraction that would produce an apparently valid but incomplete sequence, so check all bounds before slicing.",
      "code": "s='AACCGG'\nstart=3;end=8\nprint(0<=start<end<=len(s))",
      "focus": [
        2,
        3
      ],
      "visual": [
        [
          "Reference length",
          "6"
        ],
        [
          "Requested end",
          "8"
        ],
        [
          "Valid interval",
          "False"
        ]
      ],
      "output": "False",
      "note": "A robust interval validator also checks types, nonnegative starts and start less than end; do not silently clip a requested genomic region.",
      "goal": "N02-G03"
    },
    {
      "title": "Predict the minus-strand sequence before revealing it",
      "say": "Take the invented reference AACCGG and use positions two, three and four: the half-open interval [2:5]. Before running the next step, identify the extracted string and mentally reverse-complement it for a minus-strand request.",
      "code": "from Bio.Seq import Seq\ns=Seq('AACCGG')\nprint(str(s[2:5].reverse_complement()))",
      "focus": [
        2,
        3
      ],
      "visual": [
        [
          "Reference",
          "A A C C G G"
        ],
        [
          "Slice [2:5)",
          "? ? ?"
        ],
        [
          "Minus output",
          "Withheld"
        ]
      ],
      "output": "",
      "note": "First decide which positions are in the slice. The answer is intentionally withheld here, and this is not a solution to any Apply or Prove case.",
      "goal": "N02-G03",
      "checkpoint": true
    },
    {
      "title": "Reveal: CCG on the reference becomes CGG on minus",
      "say": "The half-open slice [2:5] reads CCG from the reference. Complement gives GGC, and reversing that sequence produces CGG, which is the requested minus-strand representation of precisely that interval.",
      "code": "from Bio.Seq import Seq\ns=Seq('AACCGG')\nprint(str(s[2:5].reverse_complement()))",
      "focus": [
        2,
        3
      ],
      "visual": [
        [
          "Selected",
          "C C G"
        ],
        [
          "Complement",
          "G G C"
        ],
        [
          "Minus orientation",
          "C G G"
        ]
      ],
      "output": "CGG",
      "note": "Changing coordinates or strand should change the reported interval sequence. Confirm the length and source identity before interpreting real annotations.",
      "goal": "N02-G03"
    },
    {
      "title": "FASTQ attaches a quality character to each base",
      "say": "A standard FASTQ record has a header, sequence, separator and equal-length ASCII quality string. Biopython's SeqIO decodes the character symbols into Phred scores, keeping them aligned with that record's bases.",
      "code": "from Bio import SeqIO\nfrom io import StringIO\nr=SeqIO.read(StringIO('@a\\nAC\\n+\\nII\\n'),'fastq')\nprint(r.id,str(r.seq),r.letter_annotations['phred_quality'])",
      "focus": [
        3,
        4
      ],
      "visual": [
        [
          "Record ID",
          "a"
        ],
        [
          "Bases",
          "AC"
        ],
        [
          "Phred Q",
          "[40, 40]"
        ]
      ],
      "output": "a AC [40, 40]",
      "note": "These Phred symbols are synthetic Sanger-format examples; a quality score is a modeled confidence measure, not an independently observed probability of error.",
      "goal": "N02-G04"
    },
    {
      "title": "Phred Q30 and Q40 are not fluorescence intensities",
      "say": "Under Sanger FASTQ encoding, I is Q40, exclamation mark is Q0 and digit five is Q20. Biopython converts the characters into numeric per-base quality values, which can then be counted against an explicit threshold.",
      "code": "from Bio import SeqIO\nfrom io import StringIO\nr=SeqIO.read(StringIO('@a\\nACG\\n+\\nI!5\\n'),'fastq')\nq=r.letter_annotations['phred_quality']\nprint(q,min(q),sum(x<20 for x in q))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "ASCII",
          "I ! 5"
        ],
        [
          "Phred",
          "40, 0, 20"
        ],
        [
          "Below Q20",
          "1 base"
        ]
      ],
      "output": "[40, 0, 20] 0 1",
      "note": "Phred values reflect the specified decoding scheme and model, not a guarantee that a high-Q base is biologically correct.",
      "goal": "N02-G04"
    },
    {
      "title": "Keep read IDs beside each minimum quality",
      "say": "A list of isolated minimum Q values loses which record should be reviewed. Parse the synthetic FASTQ and retain each read ID, its length and its minimum quality in the same report row.",
      "code": "from Bio import SeqIO\nfrom io import StringIO\nraw='@r1\\nAC\\n+\\nI!\\n@r2\\nGG\\n+\\nII\\n'\npairs=[(r.id,len(r),min(r.letter_annotations['phred_quality'])) for r in SeqIO.parse(StringIO(raw),'fastq')]\nprint(pairs)",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "r1",
          "2 bases · min Q0"
        ],
        [
          "r2",
          "2 bases · min Q40"
        ],
        [
          "Policy",
          "review Q < 20"
        ]
      ],
      "output": "[('r1', 2, 0), ('r2', 2, 40)]",
      "note": "A low-Q flag is a thresholded property of the encoded input, not a conclusion about contamination, mapping status or sequencing-run quality.",
      "goal": "N02-G04"
    },
    {
      "title": "Capstone: build a reproducible identity and quality audit",
      "say": "Finally parse both synthetic files using Bio.SeqIO rather than a homemade string splitter. Preserve the ID order and report any FASTQ read whose minimum decoded Phred value falls strictly below twenty. The report describes only the invented inputs.",
      "code": "from Bio import SeqIO\nfrom io import StringIO\nfasta='>r1\\nAC\\n>r2\\nGG\\n'\nfastq='@r1\\nAC\\n+\\nI!\\n@r2\\nGG\\n+\\nII\\n'\nf=list(SeqIO.parse(StringIO(fasta),'fasta'))\nq=list(SeqIO.parse(StringIO(fastq),'fastq'))\nreport={'fasta_ids':[r.id for r in f],'fastq_ids':[r.id for r in q],'low_quality_reads':[r.id for r in q if min(r.letter_annotations['phred_quality'])<20]}\nprint(report)",
      "focus": [
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "visual": [
        [
          "FASTA IDs",
          "r1, r2"
        ],
        [
          "FASTQ IDs",
          "r1, r2"
        ],
        [
          "Below minimum Q20",
          "r1 only"
        ]
      ],
      "output": "{'fasta_ids': ['r1', 'r2'], 'fastq_ids': ['r1', 'r2'], 'low_quality_reads': ['r1']}",
      "note": "Matching IDs here are intentional synthetic fixtures, not proof of genuine paired input files. Audit duplicated IDs and source provenance before real joins.",
      "goal": "N02-CAPSTONE"
    },
    {
      "title": "Independent transfer: distinguish invalid inputs from low quality",
      "say": "Back in the Python editor, write an audit for unfamiliar in-memory FASTA and FASTQ strings. Include duplicate FASTA IDs, one multi-line sequence, one FASTQ read below a changed Q threshold, a mismatched quality-length record and an out-of-bounds minus-strand interval. Decide what to report and what to reject without borrowing a completed solution.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Preserve",
          "Every ID and source record"
        ],
        [
          "Validate",
          "Bounds and FASTQ structure"
        ],
        [
          "Report",
          "Quality and explicit errors"
        ]
      ],
      "output": "",
      "note": "Independent task: use genuinely new inputs, do not silently drop malformed or duplicate reads, and distinguish syntax failures from quality-based filtering.",
      "goal": "N02-CAPSTONE"
    }
  ]
}]);})();
