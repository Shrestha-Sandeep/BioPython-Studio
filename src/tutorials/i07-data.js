// I07 — pandas measurements-table provenance and source-preserving QC from synthetic records.
"use strict";
(() => {
window.BioPythonImagingTutorials=Object.freeze([...(window.BioPythonImagingTutorials||[]),{
  "id": "i07-chapter",
  "chapter": "I07",
  "title": "Clean a scientific measurements table",
  "short": "Pandas, identity, missingness and reproducible QC",
  "minutes": "9–13 min",
  "goals": [
    "I07-G01",
    "I07-G02",
    "I07-G03",
    "I07-G04",
    "I07-G05",
    "I07-G06",
    "I07-G07",
    "I07-CAPSTONE"
  ],
  "steps": [
    {
      "title": "The destination: from candidates to an honest measurements table",
      "say": "Imagine converting image candidate regions into rows with specimen IDs, field IDs, object labels and measurements. The pictured Witz and Human Protein Atlas example is published context. Our Pandas rows are invented for learning, not extracted pixel measurements or evidence of independent biological replicates.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Source",
          "Published figure ≠ raw measurements"
        ],
        [
          "Input",
          "Fictional measurement rows"
        ],
        [
          "Output",
          "Traceable QC report"
        ]
      ],
      "output": "",
      "note": "All demonstration rows are fictional, not calibrated measurements extracted from the displayed PNG.",
      "goal": "I07-G01",
      "preview": {
        "image": "fluorescence-single",
        "label": "Published teaching microscopy image; the tabular measurements below are synthetic"
      }
    },
    {
      "title": "Make the specimen-to-field hierarchy visible",
      "say": "A Pandas DataFrame can hold named columns of different types. One specimen here has two imaging fields; the two rows are field records, not two independent animals or biological replicates. Inspect the shape and field IDs before doing calculations.",
      "code": "import pandas as pd\ndf = pd.DataFrame({'specimen_id':['S01','S01'],\n                   'field_id':['F01','F02'],\n                   'candidate_area_px':[4,7]})\nprint(df.shape)\nprint(df['field_id'].tolist())",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "One specimen",
          "S01"
        ],
        [
          "Two fields",
          "F01 and F02"
        ],
        [
          "Rows",
          "2 observations"
        ]
      ],
      "output": "(2, 3)\n['F01', 'F02']",
      "note": "An image field or candidate label does not automatically constitute an independent biological replicate.",
      "goal": "I07-G01"
    },
    {
      "title": "Read CSV without destroying leading zeros",
      "say": "A specimen identifier such as zero-zero-zero-three is text, even if it looks numeric. We declare a string dtype when reading CSV, so the leading zeros survive. Numeric measurement columns can still be processed separately.",
      "code": "import pandas as pd\nfrom io import StringIO\ntext = 'specimen_id,score\\n0003,5\\n0012,7\\n'\ndf = pd.read_csv(StringIO(text), dtype={'specimen_id':'string'})\nprint(df['specimen_id'].tolist())\nprint(int(df['score'].sum()))",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "ID dtype",
          "explicit string"
        ],
        [
          "IDs",
          "0003, 0012"
        ],
        [
          "Scores",
          "5 and 7"
        ]
      ],
      "output": "['0003', '0012']\n12",
      "note": "Parser inference and categorical conversion can erase leading zeros; identifiers require declared text semantics.",
      "goal": "I07-G02"
    },
    {
      "title": "A malformed measurement is missing, not an invented zero",
      "say": "We deliberately coerce numeric score strings and mark invalid text as missing. One legitimate measured zero remains zero, while the invalid word does not become a fabricated measurement. Keep a count of conversion failures for the audit.",
      "code": "import pandas as pd\nraw = pd.Series(['4','bad','0'])\nscore = pd.to_numeric(raw, errors='coerce')\nprint(score.isna().tolist())\nprint(int((score==0).sum()))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Raw",
          "4, bad, 0"
        ],
        [
          "Invalid",
          "1 missing"
        ],
        [
          "Zero",
          "1 valid zero"
        ]
      ],
      "output": "[False, True, False]\n1",
      "note": "Numeric coercion is an explicit exclusion and missingness policy; preserve raw text and investigate conversion failures.",
      "goal": "I07-G02"
    },
    {
      "title": "Filter score values while keeping their field IDs",
      "say": "Selecting only scores would sever measurements from acquisition records. We use .loc and request the field ID and score together, then copy the selected rows so later operations cannot silently change the original table.",
      "code": "import pandas as pd\ndf = pd.DataFrame({'field_id':['F01','F02','F03'],\n                   'score':[0.8,0.3,0.9]})\nselected = df.loc[df['score'] >= 0.7, ['field_id','score']].copy()\nprint(selected['field_id'].tolist())\nprint(len(df), len(selected))",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Input fields",
          "F01, F02, F03"
        ],
        [
          "Keep ≥0.7",
          "F01, F03"
        ],
        [
          "Original",
          "3 rows unchanged"
        ]
      ],
      "output": "['F01', 'F03']\n3 2",
      "note": "The threshold is illustrative; filtering observation rows does not validate the underlying biological labels.",
      "goal": "I07-G03"
    },
    {
      "title": "Row labels are not the same as row positions",
      "say": "A filtered DataFrame often keeps original row-index labels. Here the retained labels are zero and two. The second retained row is position one, but label one is absent. Confusing .loc with .iloc can select the wrong record or raise a KeyError.",
      "code": "import pandas as pd\ndf = pd.DataFrame({'field_id':['F01','F02','F03'],\n                   'score':[0.8,0.3,0.9]})\nselected = df.loc[df['score'] >= 0.7]\nprint(selected.index.tolist())\nprint(selected.iloc[1]['field_id'])\nprint(1 in selected.index)",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "Retained labels",
          "0 and 2"
        ],
        [
          "iloc[1]",
          "F03"
        ],
        [
          "loc[1]",
          "not present"
        ]
      ],
      "output": "[0, 2]\nF03\nFalse",
      "note": "Index labels are storage coordinates, not specimen IDs or biological replicate numbers.",
      "goal": "I07-G03"
    },
    {
      "title": "Predict which field IDs survive a new cutoff",
      "say": "Four synthetic fields have scores zero point two, zero point eight, zero point nine and zero point six. Predict the retained field IDs when the cutoff includes scores equal to zero point eight. The answer is intentionally withheld until the next scene.",
      "code": "import pandas as pd\ndf = pd.DataFrame({'field_id':['F01','F02','F03','F04'],\n                   'score':[0.2,0.8,0.9,0.6]})\nprint(df.loc[df['score'] >= 0.8, 'field_id'].tolist())",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Four fields",
          "F01...F04"
        ],
        [
          "Cutoff",
          "≥ 0.8"
        ],
        [
          "Prediction",
          "Which IDs survive?"
        ]
      ],
      "output": "",
      "note": "Keep the answer hidden while predicting; this checkpoint checks tracing, not memorized output.",
      "goal": "I07-G03",
      "checkpoint": true
    },
    {
      "title": "Reveal: two field IDs remain attached to their scores",
      "say": "The inclusive cutoff keeps F02 at zero point eight and F03 at zero point nine. The other fields remain recorded in the original table, even though they are not in the selected view. This enables an explicit and reversible filtering audit.",
      "code": "import pandas as pd\ndf = pd.DataFrame({'field_id':['F01','F02','F03','F04'],\n                   'score':[0.2,0.8,0.9,0.6]})\nprint(df.loc[df['score'] >= 0.8, 'field_id'].tolist())",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Pass",
          "F02, F03"
        ],
        [
          "Fail",
          "F01, F04"
        ],
        [
          "Original rows",
          "Still four"
        ]
      ],
      "output": "['F02', 'F03']",
      "note": "Keep excluded record IDs visible in a report rather than turning a filtered view into the entire source dataset.",
      "goal": "I07-G03"
    },
    {
      "title": "Reject a missing schema column explicitly",
      "say": "A DataFrame can be valid Python yet unsuitable for a scientific audit. This example lacks the specimen_id column required by the declared input schema. We report missing columns instead of assuming that a field ID alone proves specimen identity.",
      "code": "import pandas as pd\ndf = pd.DataFrame({'field_id':['F01'],'score':[0.9]})\nrequired = ['specimen_id','field_id','score']\nmissing = [name for name in required if name not in df.columns]\nprint(missing)\nprint(not missing)",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Required",
          "specimen, field, score"
        ],
        [
          "Missing",
          "specimen_id"
        ],
        [
          "Schema valid",
          "False"
        ]
      ],
      "output": "['specimen_id']\nFalse",
      "note": "Valid column names do not guarantee that the entered IDs refer to real biological samples.",
      "goal": "I07-G04"
    },
    {
      "title": "Schema validity does not make all values numeric",
      "say": "A score column may exist while containing an invalid text value. Numeric coercion identifies one invalid entry here. A column-name check alone cannot reveal that failure; inspect both the schema and parsing results.",
      "code": "import pandas as pd\ndf = pd.DataFrame({'field_id':['F01','F02'],'score':['1.5','unclear']})\nnumeric = pd.to_numeric(df['score'], errors='coerce')\nprint('Schema:', all(c in df for c in ['field_id','score']))\nprint('Invalid:', int(numeric.isna().sum()))\nprint('Raw preserved:', df['score'].tolist())",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Headers",
          "valid"
        ],
        [
          "Bad numeric text",
          "1 row"
        ],
        [
          "Source",
          "preserved"
        ]
      ],
      "output": "Schema: True\nInvalid: 1\nRaw preserved: ['1.5', 'unclear']",
      "note": "Do not silently set invalid scores to zero; record missingness and the original entry.",
      "goal": "I07-G04"
    },
    {
      "title": "Trim only allowed external whitespace",
      "say": "A specimen name with accidental leading or trailing spaces can be normalized, but changing case without an explicit policy could merge distinct strains. We store raw identifiers and add a separate cleaned column while preserving capitalization.",
      "code": "import pandas as pd\ndf = pd.DataFrame({'raw_id':[' N2 ','mutA ','muta']})\ndf['clean_id'] = df['raw_id'].str.strip()\nprint(df['clean_id'].tolist())\nprint(int((df['raw_id']!=df['clean_id']).sum()))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Raw",
          " N2 , mutA , muta"
        ],
        [
          "Trimmed",
          "N2, mutA, muta"
        ],
        [
          "Case",
          "unchanged"
        ]
      ],
      "output": "['N2', 'mutA', 'muta']\n2",
      "note": "Trimming is a documented transformation, not a guarantee that the physical sample was correctly labeled.",
      "goal": "I07-G05"
    },
    {
      "title": "Two raw IDs may collide after legitimate trimming",
      "say": "Identifiers A-with-leading-space and A-with-trailing-space are distinct source strings but normalize to the same clean ID. A collision means an audit is required; it does not authorize deleting one record or assuming they describe the same acquisition.",
      "code": "import pandas as pd\ndf = pd.DataFrame({'raw_id':[' A','A ']})\ndf['clean_id'] = df['raw_id'].str.strip()\nprint(df['clean_id'].tolist())\nprint(bool(df['clean_id'].duplicated(keep=False).all()))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Source IDs",
          "two text variants"
        ],
        [
          "Normalized IDs",
          "A and A"
        ],
        [
          "Decision",
          "review collision"
        ]
      ],
      "output": "['A', 'A']\nTrue",
      "note": "Never automatically merge rows whose source identifiers collide under a normalization rule.",
      "goal": "I07-G05"
    },
    {
      "title": "A duplicate key and conflicting metadata are different problems",
      "say": "Two rows share identifier S01 but disagree on condition. A duplicate may be a planned repeat; contradictory treatment metadata are a stronger warning. Flag both, preserve every row and investigate how acquisition records were assigned.",
      "code": "import pandas as pd\ndf = pd.DataFrame({'id':['S01','S01','S02'],\n                   'condition':['ctrl','heat','ctrl']})\nduplicate_ids = df.loc[df['id'].duplicated(keep=False), 'id'].drop_duplicates().tolist()\nconflicts = df.groupby('id')['condition'].nunique()\nprint(duplicate_ids)\nprint(conflicts[conflicts>1].index.tolist())",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "Repeated key",
          "S01"
        ],
        [
          "Conditions",
          "ctrl versus heat"
        ],
        [
          "Action",
          "flag, do not drop"
        ]
      ],
      "output": "['S01']\n['S01']",
      "note": "Conflicting acquisition metadata cannot be safely resolved from the table alone.",
      "goal": "I07-G06"
    },
    {
      "title": "A field ID alone might not be a globally unique key",
      "say": "Different specimens can both have a field named F01. Marking that field ID as a duplicate would be misleading unless the intended identifier is global. A composite specimen-plus-field key correctly distinguishes these two acquisition rows.",
      "code": "import pandas as pd\ndf = pd.DataFrame({'specimen_id':['S01','S02'],\n                   'field_id':['F01','F01']})\nprint(bool(df['field_id'].duplicated().any()))\nprint(bool(df.duplicated(['specimen_id','field_id']).any()))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Field ID only",
          "looks duplicated"
        ],
        [
          "Composite key",
          "two unique fields"
        ],
        [
          "Unit",
          "specimen + field"
        ]
      ],
      "output": "True\nFalse",
      "note": "Use the actual experimental data hierarchy to define identifiers; even a correct composite key does not prove biological independence.",
      "goal": "I07-G06"
    },
    {
      "title": "Missing is not zero: classify observations separately",
      "say": "A recorded zero might mean no detected signal under a defined measurement. Missing means an observation was not provided or could not be parsed. Preserve both and label each row explicitly so later summaries disclose the denominator.",
      "code": "import pandas as pd\ndf = pd.DataFrame({'field_id':['F1','F2','F3'],\n                   'score':[0,None,2]})\nstatus = ['MISSING' if pd.isna(x) else 'ZERO' if x==0 else 'OBSERVED'\n          for x in df['score']]\nprint(status)\nprint(int(df['score'].isna().sum()))",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "F1",
          "ZERO"
        ],
        [
          "F2",
          "MISSING"
        ],
        [
          "F3",
          "OBSERVED"
        ]
      ],
      "output": "['ZERO', 'MISSING', 'OBSERVED']\n1",
      "note": "Missingness can depend on acquisition conditions; blanket deletion may bias a later biological comparison.",
      "goal": "I07-G07"
    },
    {
      "title": "Dropping rows conceals the missing-data pattern",
      "say": "A quick dropna removes an unobserved score but also erases a traceable field record. Here the original table has two rows in condition A and one in condition B; the filtered view hides one missing A measurement. Report denominators before deciding how to analyze.",
      "code": "import pandas as pd\ndf = pd.DataFrame({'condition':['A','A','B'],\n                   'field_id':['F1','F2','F3'],\n                   'score':[0,None,5]})\nprint(df.groupby('condition').size().to_dict())\nprint(df.dropna(subset=['score']).groupby('condition').size().to_dict())",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Original",
          "A:2, B:1"
        ],
        [
          "After dropping",
          "A:1, B:1"
        ],
        [
          "Cost",
          "lost missingness"
        ]
      ],
      "output": "{'A': 2, 'B': 1}\n{'A': 1, 'B': 1}",
      "note": "Missing observations may not be random; neither dropping them nor imputing zero is automatically justified.",
      "goal": "I07-G07"
    },
    {
      "title": "Capstone: preserve the complete acquisition QC audit",
      "say": "Combine the earlier techniques on four invented rows. Trim raw IDs into a separate column, coerce scores explicitly, find duplicate normalized IDs, identify conflicting conditions, list missing-score field IDs, and verify the source rows were not changed. This is data QC, not a treatment comparison.",
      "code": "import pandas as pd\nrows = [\n {'raw_id':' S01 ','field_id':'F1','condition':'ctrl','score':'2.5'},\n {'raw_id':'S01','field_id':'F1','condition':'heat','score':'invalid'},\n {'raw_id':'S02','field_id':'F2','condition':'ctrl','score':'0'},\n {'raw_id':'S03','field_id':'F3','condition':'ctrl','score':None}]\noriginal = [dict(row) for row in rows]\ndf = pd.DataFrame(rows)\ndf['clean_id'] = df['raw_id'].str.strip()\ndf['numeric_score'] = pd.to_numeric(df['score'], errors='coerce')\nduplicates = df.loc[df['clean_id'].duplicated(keep=False),'clean_id'].drop_duplicates().tolist()\nconditions = df.groupby('clean_id')['condition'].nunique()\nconflicts = conditions[conditions > 1].index.tolist()\nmissing_fields = df.loc[df['numeric_score'].isna(),'field_id'].tolist()\nprint({'rows':len(df),'duplicates':duplicates,'conflicts':conflicts,'missing_fields':missing_fields})\nprint('Source preserved:', rows == original, 'Verified:', False)",
      "focus": [
        14,
        15,
        16
      ],
      "visual": [
        [
          "Records",
          "4 kept"
        ],
        [
          "Audit",
          "Duplicate, conflict, missing"
        ],
        [
          "Biology",
          "verified=False"
        ]
      ],
      "output": "{'rows': 4, 'duplicates': ['S01'], 'conflicts': ['S01'], 'missing_fields': ['F1', 'F3']}\nSource preserved: True Verified: False",
      "note": "These are synthetic field records, not exported Witz/HPA microscopy measurements or biological replicates.",
      "goal": "I07-CAPSTONE"
    },
    {
      "title": "Independent transfer: audit a new measurements file",
      "say": "Return to your Python editor and write a new table auditor using unseen field IDs and numeric values. Include leading-zero identifiers, two rows with conflicting conditions, a missing score and a genuine zero. Keep all source rows, report duplicate and missing IDs and explain what would establish biological replicate identity.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Build",
          "New acquisition records"
        ],
        [
          "Prove",
          "QC without dropping rows"
        ],
        [
          "Explain",
          "Biological unit versus field"
        ]
      ],
      "output": "",
      "note": "Independent transfer requires fresh inputs and your own executable solution, not copying the completed tutorial.",
      "goal": "I07-CAPSTONE"
    }
  ]
}]);
})();
