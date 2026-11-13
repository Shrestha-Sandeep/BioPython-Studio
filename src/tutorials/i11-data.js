// I11 — synthetic bioimage replicate hierarchy, pairing, QC attrition and batch limitations.
"use strict";
(() => {
window.BioPythonImagingTutorials=Object.freeze([...(window.BioPythonImagingTutorials||[]),{
  "id": "i11-chapter",
  "chapter": "I11",
  "title": "Respect biological replicates and batches",
  "short": "Experimental units, paired effects, exclusions and confounding",
  "minutes": "10–14 min",
  "goals": [
    "I11-G01",
    "I11-G02",
    "I11-G03",
    "I11-G04",
    "I11-G05",
    "I11-G06",
    "I11-G07",
    "I11-CAPSTONE"
  ],
  "steps": [
    {
      "title": "The destination: identify what was really replicated",
      "say": "Microscopy images can contain hundreds of cells or candidate regions without representing hundreds of independent experiments. In this chapter, all measurements are invented, and we explicitly assume that certain preparation IDs represent independently treated experimental units. We will keep fields, paired treatments, QC exclusions and acquisition batches distinct.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Fields",
          "observational units"
        ],
        [
          "Independent units",
          "determined by design"
        ],
        [
          "Report",
          "QC and batch assumptions"
        ]
      ],
      "output": "",
      "note": "Image numbers, field IDs and synthetic biological-unit labels cannot establish independence without actual experimental design.",
      "goal": "I11-G01",
      "preview": {
        "image": "fluorescence-single",
        "label": "Published Witz/HPA teaching figure; synthetic field records are unrelated"
      }
    },
    {
      "title": "Six field records may represent only two experimental units",
      "say": "Suppose three microscope fields came from an independently prepared sample B1 and three from B2. There are six observations but only two distinct preparation identifiers. This difference must be visible before anyone uses n in a statistical report.",
      "code": "import pandas as pd\ndf=pd.DataFrame({'biological_id':['B1']*3+['B2']*3,\n                 'field_id':['F1','F2','F3','F4','F5','F6']})\nprint(len(df),df['biological_id'].nunique())",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Measured fields",
          "6"
        ],
        [
          "Assumed units",
          "B1, B2"
        ],
        [
          "Independent n",
          "not 6"
        ]
      ],
      "output": "6 2",
      "note": "Independence of B1 and B2 is an assumption about preparation and treatment assignment, not something proven by IDs.",
      "goal": "I11-G01"
    },
    {
      "title": "Store each nested observation's source explicitly",
      "say": "Group fields by their supposed biological preparation and report how many image fields belong to each. Here three fields came from B1 and two from B2. A future mixed model or aggregate needs this nesting metadata rather than unlabeled measurement values.",
      "code": "import pandas as pd\ndf=pd.DataFrame({'biological_id':['B1','B1','B1','B2','B2'],\n                 'field_id':['F1','F2','F3','F4','F5']})\nprint(df.groupby('biological_id').size().to_dict())\nprint(len(df['field_id'].unique()))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "B1",
          "3 image fields"
        ],
        [
          "B2",
          "2 image fields"
        ],
        [
          "Total fields",
          "5"
        ]
      ],
      "output": "{'B1': 3, 'B2': 2}\n5",
      "note": "Fields share their source preparation; the appropriate independent unit must be declared from the real design.",
      "goal": "I11-G01"
    },
    {
      "title": "Pair treatments using unique biological-unit IDs",
      "say": "In a legitimate paired design, each experimental source can have a matched control and treatment record. Pivoting on the unique unit ID yields paired differences of one and two for our synthetic examples; row order is not how we identify pairs.",
      "code": "import pandas as pd\ndf=pd.DataFrame({'unit':['B1','B1','B2','B2'],\n                 'condition':['ctrl','treated']*2,\n                 'score':[2,3,4,6]})\npairs=df.pivot(index='unit',columns='condition',values='score')\ndifferences=pairs['treated']-pairs['ctrl']\nprint([int(x) for x in differences.tolist()])",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "B1",
          "treated–ctrl = 1"
        ],
        [
          "B2",
          "treated–ctrl = 2"
        ],
        [
          "Pair key",
          "unit ID"
        ]
      ],
      "output": "[1, 2]",
      "note": "A repeated observation is truly paired only when it comes from the same biological unit under a valid matching design.",
      "goal": "I11-G02"
    },
    {
      "title": "Incomplete pairs and duplicate keys cannot be silently paired",
      "say": "Our next table has one complete pair, one control-only unit and one treatment-only unit. We identify incomplete entries before calculating a matched mean. In real data, duplicate unit-condition records also require a separate audit rather than arbitrary selection.",
      "code": "import pandas as pd\ndf=pd.DataFrame({'unit':['B1','B1','B2','B3'],\n                 'condition':['ctrl','treated','ctrl','treated'],\n                 'score':[2,4,5,6]})\nwide=df.pivot(index='unit',columns='condition',values='score')\ncomplete=wide.dropna(subset=['ctrl','treated'])\nprint(complete.index.tolist())\nprint(wide.index[wide.isna().any(axis=1)].tolist())",
      "focus": [
        6,
        7,
        8
      ],
      "visual": [
        [
          "Complete",
          "B1"
        ],
        [
          "Incomplete",
          "B2 and B3"
        ],
        [
          "Action",
          "retain and flag"
        ]
      ],
      "output": "['B1']\n['B2', 'B3']",
      "note": "Do not automatically delete all incomplete units from source records; show attrition and why pairing failed.",
      "goal": "I11-G02"
    },
    {
      "title": "Exclusion counts belong in the treatment report",
      "say": "One of two control fields failed acquisition QC, while both treated fields passed. A table that keeps only passing rows would hide this asymmetric exclusion. Count rejected fields by condition before using filtered observations.",
      "code": "import pandas as pd\ndf=pd.DataFrame({'condition':['ctrl','ctrl','treated','treated'],\n                 'qc':['pass','fail','pass','pass']})\ndf['excluded']=df['qc']!='pass'\nprint(df.groupby('condition')['excluded'].sum().astype(int).to_dict())",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Control",
          "1 exclusion"
        ],
        [
          "Treatment",
          "0 exclusions"
        ],
        [
          "Source",
          "all four retained"
        ]
      ],
      "output": "{'ctrl': 1, 'treated': 0}",
      "note": "Exclusion reasons may depend on condition; predeclared QC criteria and transparent denominators are essential.",
      "goal": "I11-G03"
    },
    {
      "title": "Selection bias changes a descriptive group difference",
      "say": "The synthetic control measurements are one and nine, while treated measurements are five and five. Before exclusion the two group means agree. If the high control field is discarded, the apparent treated-minus-control difference jumps to four. That change is a warning, not a biological effect.",
      "code": "import numpy as np\ncontrol=np.array([1.,9.])\ntreated=np.array([5.,5.])\ndifference_before=float(treated.mean()-control.mean())\ndifference_after=float(treated.mean()-control[:1].mean())\nprint(difference_before,difference_after)",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Before exclusion",
          "difference 0"
        ],
        [
          "After excluding 9",
          "difference 4"
        ],
        [
          "Lesson",
          "selection matters"
        ]
      ],
      "output": "0.0 4.0",
      "note": "The example does not show why a real observation was excluded; selection decisions require defensible, condition-blinded rules.",
      "goal": "I11-G03"
    },
    {
      "title": "Declare the estimand before computing an effect",
      "say": "For matched independent biological units, one possible descriptive estimand is the mean of within-unit treatment-minus-control differences. Our two fictional matched differences are one and two, averaging one point five. This is not equivalent to treating every image field as independent.",
      "code": "import numpy as np\nwithin_unit_differences=np.array([1.,2.])\nprint(float(within_unit_differences.mean()))\nprint(len(within_unit_differences))",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Unit B1",
          "difference 1"
        ],
        [
          "Unit B2",
          "difference 2"
        ],
        [
          "Estimand",
          "mean paired change"
        ]
      ],
      "output": "1.5\n2",
      "note": "The chosen estimand and direction of subtraction must be stated before seeing biological outcomes.",
      "goal": "I11-G04"
    },
    {
      "title": "Predict the mean matched-unit treatment effect",
      "say": "Two synthetic matched units have control values two and six, and treated values five and eight. Subtract control from treated within each unit and then average those two changes. The computed answer is intentionally withheld until the next scene.",
      "code": "import numpy as np\nctrl=np.array([2.,6.]);treated=np.array([5.,8.])\nprint(float((treated-ctrl).mean()))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Controls",
          "2 and 6"
        ],
        [
          "Treatments",
          "5 and 8"
        ],
        [
          "Predict",
          "mean paired difference = ?"
        ]
      ],
      "output": "",
      "note": "Withheld prediction: first match each control to its own treatment, then average the two changes.",
      "goal": "I11-G04",
      "checkpoint": true
    },
    {
      "title": "Reveal: the paired mean difference is two point five",
      "say": "The first unit changes by three and the second by two, making the matched-unit average two point five. This arithmetic remains a descriptive statistic until the independence, assignment and potential batch confounders are established.",
      "code": "import numpy as np\nctrl=np.array([2.,6.]);treated=np.array([5.,8.])\nchanges=treated-ctrl\nprint(changes.tolist())\nprint(float(changes.mean()))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "B1",
          "change +3"
        ],
        [
          "B2",
          "change +2"
        ],
        [
          "Average",
          "2.5"
        ]
      ],
      "output": "[3.0, 2.0]\n2.5",
      "note": "Two synthetic paired units are not a replicated result, nor evidence of a statistically reliable effect.",
      "goal": "I11-G04"
    },
    {
      "title": "Aggregate field observations within each biological unit",
      "say": "Two fields per assumed independent biological unit yield different per-unit means, three for B1 and seven for B2. Those means can be used as the next descriptive inputs when that matches the study's sampling and treatment design.",
      "code": "import pandas as pd\ndf=pd.DataFrame({'biological_id':['B1','B1','B2','B2'],\n                 'field_id':['F1','F2','F3','F4'],\n                 'score':[2.,4.,6.,8.]})\nprint(df.groupby('biological_id')['score'].mean().to_dict())",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "B1 fields",
          "2,4 → mean 3"
        ],
        [
          "B2 fields",
          "6,8 → mean 7"
        ],
        [
          "Units",
          "B1 and B2"
        ]
      ],
      "output": "{'B1': 3.0, 'B2': 7.0}",
      "note": "Different biological designs may call for hierarchically modeled observations rather than simple means; this is a clear introductory summary.",
      "goal": "I11-G05"
    },
    {
      "title": "Unequal field counts bias the pooled field mean",
      "say": "Four fields from B1 each have value ten, whereas one field from B2 has zero. Pooling all five fields weights B1 four times as heavily, yielding eight. Averaging the two biological-unit means equally gives five, which answers a different, explicitly specified question.",
      "code": "import pandas as pd\ndf=pd.DataFrame({'bio':['B1']*4+['B2'],\n                 'value':[10.,10.,10.,10.,0.]})\npooled=float(df['value'].mean())\nper_unit=float(df.groupby('bio')['value'].mean().mean())\nprint(pooled,per_unit)",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Pooled fields",
          "mean 8"
        ],
        [
          "Equal unit weight",
          "mean 5"
        ],
        [
          "Reason",
          "4 vs 1 fields"
        ]
      ],
      "output": "8.0 5.0",
      "note": "Equal-unit weighting is appropriate only for the predeclared estimand and when units qualify as independent.",
      "goal": "I11-G05"
    },
    {
      "title": "Perfect confounding makes treatment and batch inseparable",
      "say": "All controls were imaged in batch A and all treated specimens in batch B. If fluorescence differs, the data alone cannot distinguish treatment from instrument session, exposure or staining batch. The two-by-two coverage table shows the missing comparisons.",
      "code": "import pandas as pd\ndf=pd.DataFrame({'batch':['A','A','B','B'],\n                 'condition':['ctrl','ctrl','treated','treated']})\ntab=pd.crosstab(df['batch'],df['condition'])\nprint(tab.reindex(columns=['ctrl','treated'],fill_value=0).to_numpy().tolist())",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Batch A",
          "control only"
        ],
        [
          "Batch B",
          "treated only"
        ],
        [
          "Diagnosis",
          "fully confounded"
        ]
      ],
      "output": "[[2, 0], [0, 2]]",
      "note": "No numerical batch correction can identify a causal treatment effect without a design that separates treatment from batch.",
      "goal": "I11-G06"
    },
    {
      "title": "Balanced acquisition coverage reduces avoidable confounding",
      "say": "Now both conditions are represented in each acquisition batch. The coverage table is balanced, creating at least some basis for separating batch effects from condition in a suitable analysis. It does not by itself guarantee randomization or biological independence.",
      "code": "import pandas as pd\ndf=pd.DataFrame({'batch':['A','A','B','B'],\n                 'condition':['ctrl','treated','ctrl','treated']})\ntab=pd.crosstab(df['batch'],df['condition'])\nprint(tab.reindex(columns=['ctrl','treated'],fill_value=0).to_numpy().tolist())",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Batch A",
          "ctrl + treated"
        ],
        [
          "Batch B",
          "ctrl + treated"
        ],
        [
          "Coverage",
          "both conditions"
        ]
      ],
      "output": "[[1, 1], [1, 1]]",
      "note": "Balanced observations are not automatically balanced independent experimental units; treatment assignment matters.",
      "goal": "I11-G06"
    },
    {
      "title": "Within-batch centering is a declared transformation",
      "say": "Subtract each acquisition batch's mean from individual values while preserving the raw column. The synthetic batches have means two and seven, so their centered values become minus one and plus one. A zero-centered batch does not prove a biological artifact was removed.",
      "code": "import pandas as pd\ndf=pd.DataFrame({'batch':['A','A','B','B'],\n                 'raw':[1.,3.,6.,8.]})\noriginal=df['raw'].copy()\ndf['centered']=df['raw']-df.groupby('batch')['raw'].transform('mean')\nprint(df['centered'].tolist())\nprint(bool(df['raw'].equals(original)))",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "Batch A",
          "-1, +1"
        ],
        [
          "Batch B",
          "-1, +1"
        ],
        [
          "Raw",
          "preserved"
        ]
      ],
      "output": "[-1.0, 1.0, -1.0, 1.0]\nTrue",
      "note": "Centering may discard real between-batch treatment effects and must be planned, justified and tested.",
      "goal": "I11-G07"
    },
    {
      "title": "Centering cannot rescue treatment completely confounded with batch",
      "say": "If all control fields are in one batch and all treatment fields in another, the raw group mean difference is five. Centering each batch forces both group means to zero and the difference disappears. Neither the original five nor the centered zero identifies a true treatment effect.",
      "code": "import pandas as pd\ndf=pd.DataFrame({'batch':['A','A','B','B'],\n                 'condition':['ctrl','ctrl','treated','treated'],\n                 'raw':[1.,2.,6.,7.]})\ndf['centered']=df['raw']-df.groupby('batch')['raw'].transform('mean')\nraw_diff=float(df.loc[df.condition=='treated','raw'].mean()-df.loc[df.condition=='ctrl','raw'].mean())\nnew_diff=float(df.loc[df.condition=='treated','centered'].mean()-df.loc[df.condition=='ctrl','centered'].mean())\nprint(raw_diff,new_diff)",
      "focus": [
        6,
        7,
        8
      ],
      "visual": [
        [
          "Raw difference",
          "5"
        ],
        [
          "After centering",
          "0"
        ],
        [
          "Treatment effect",
          "not identifiable"
        ]
      ],
      "output": "5.0 0.0",
      "note": "Perfect confounding is a design failure that cannot be fixed by transforming the same data.",
      "goal": "I11-G07"
    },
    {
      "title": "Capstone: preserve fields, attrition and complete pairs",
      "say": "Build a synthetic QC report from six image-field records. Retain original rows, mark the one missing observation, average accepted values within unit and treatment, and calculate matched change only for a unit with both valid conditions. Record the incomplete IDs instead of deleting them.",
      "code": "import pandas as pd\nrows=[('B1','ctrl','F1',2.),('B1','ctrl','F2',4.),\n      ('B1','treated','F3',5.),('B2','ctrl','F4',3.),\n      ('B2','treated','F5',None),('B3','treated','F6',7.)]\ndf=pd.DataFrame(rows,columns=['bio','condition','field','score'])\noriginal=df.copy(deep=True)\nmeans=df.groupby(['bio','condition'])['score'].mean().unstack()\ncomplete=means.dropna(subset=['ctrl','treated'])\ndiffs=(complete['treated']-complete['ctrl']).tolist()\nmissing=df.loc[df['score'].isna(),'field'].tolist()\nprint('Rows:',len(df),'Missing:',missing,'Complete pairs:',complete.index.tolist())\nprint('Paired differences:',diffs)\nprint('Preserved:',bool(df.equals(original)),'Validated:',False)",
      "focus": [
        11,
        12,
        13
      ],
      "visual": [
        [
          "Rows",
          "6 retained"
        ],
        [
          "Missing",
          "F5"
        ],
        [
          "Complete pair",
          "B1, diff 2"
        ]
      ],
      "output": "Rows: 6 Missing: ['F5'] Complete pairs: ['B1']\nPaired differences: [2.0]\nPreserved: True Validated: False",
      "note": "Synthetic IDs do not establish genuinely independent replicates, and missingness can bias the one complete pair's descriptive result.",
      "goal": "I11-CAPSTONE"
    },
    {
      "title": "Independent transfer: can you identify the experimental unit?",
      "say": "Return to the editor and create an unfamiliar field dataset with at least three biological preparation IDs, unequal field counts, incomplete paired conditions and a batch correlated with treatment. Preserve source records, report per-unit values and exclusions, and explain which effect can or cannot be identified.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Build",
          "Nested field/unit/pair metadata"
        ],
        [
          "Prove",
          "QC and paired effect"
        ],
        [
          "Assess",
          "batch confounding"
        ]
      ],
      "output": "",
      "note": "Independent transfer must be solved with new input, fresh code and explicit biological-unit assumptions rather than a copied recipe.",
      "goal": "I11-CAPSTONE"
    }
  ]
}]);
})();
