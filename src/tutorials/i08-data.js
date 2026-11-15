// I08 — traceable synthetic microscopy field-to-specimen reporting, join validation and plot exports.
"use strict";
(() => {
window.BioPythonImagingTutorials=Object.freeze([...(window.BioPythonImagingTutorials||[]),{
  "id": "i08-chapter",
  "chapter": "I08",
  "title": "Merge measurements and make a report",
  "short": "Validated joins, sampling units, and descriptive figures",
  "minutes": "10–15 min",
  "goals": [
    "I08-G01",
    "I08-G02",
    "I08-G03",
    "I08-G04",
    "I08-G05",
    "I08-G06",
    "I08-G07",
    "I08-G08",
    "I08-CAPSTONE"
  ],
  "steps": [
    {
      "title": "The destination: a traceable report, not an invented experiment",
      "say": "We have fictional measurements from candidate regions in several microscopy fields. Our next task is to join specimen metadata, preserve field identities, summarize observations appropriately and create an honest descriptive figure. The published Witz and Human Protein Atlas image is teaching context, not the source of these numerical measurements.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Source",
          "Synthetic field measurements"
        ],
        [
          "Join",
          "Specimen metadata with validation"
        ],
        [
          "Report",
          "Descriptive, not inferential"
        ]
      ],
      "output": "",
      "note": "The displayed published figure has not been segmented or quantified by these Pandas examples.",
      "goal": "I08-G01",
      "preview": {
        "image": "fluorescence-single",
        "label": "Published microscopy teaching image; the measurement records below are invented"
      }
    },
    {
      "title": "A many-to-one join preserves every field",
      "say": "One specimen can have multiple microscope fields, while each specimen has one metadata row in this example. The many-to-one merge contract ensures three field records remain three after joining treatment metadata.",
      "code": "import pandas as pd\nfields = pd.DataFrame({'specimen_id':['S1','S1','S2'],\n                       'field_id':['F1','F2','F3'],'area_px':[2,4,6]})\nmeta = pd.DataFrame({'specimen_id':['S1','S2'],\n                     'condition':['ctrl','heat']})\njoined = fields.merge(meta,on='specimen_id',how='left',validate='many_to_one')\nprint(joined.shape)\nprint(joined['condition'].tolist())",
      "focus": [
        6,
        7,
        8
      ],
      "visual": [
        [
          "Source",
          "3 field rows"
        ],
        [
          "Metadata",
          "2 specimen keys"
        ],
        [
          "Joined",
          "3 rows"
        ]
      ],
      "output": "(3, 4)\n['ctrl', 'ctrl', 'heat']",
      "note": "The join rule is about key uniqueness; it does not certify that the two specimens are independent biological replicates.",
      "goal": "I08-G01"
    },
    {
      "title": "Duplicate metadata must stop the merge",
      "say": "If metadata repeats the same specimen identifier with conflicting treatment assignments, an unchecked join would multiply field records. With validation set to many-to-one, Pandas raises a MergeError rather than silently creating a misleading dataset.",
      "code": "import pandas as pd\nfrom pandas.errors import MergeError\nfields = pd.DataFrame({'specimen_id':['S1','S1'],'field_id':['F1','F2']})\nmeta = pd.DataFrame({'specimen_id':['S1','S1'],\n                     'condition':['ctrl','heat']})\ntry:\n    fields.merge(meta,on='specimen_id',validate='many_to_one')\nexcept MergeError as exc:\n    print(type(exc).__name__)\nprint('Source fields:',len(fields))",
      "focus": [
        8,
        9,
        10
      ],
      "visual": [
        [
          "Field records",
          "2 source rows"
        ],
        [
          "Metadata",
          "S1 appears twice"
        ],
        [
          "Outcome",
          "MergeError"
        ]
      ],
      "output": "MergeError\nSource fields: 2",
      "note": "Do not fix a failed cardinality check by dropping arbitrary metadata rows or allowing many-to-many joins.",
      "goal": "I08-G01"
    },
    {
      "title": "A left join exposes unmatched specimen IDs",
      "say": "A specimen ID absent from metadata should remain in the field table and become an explicit unmatched case. Join indicators distinguish the matched and left-only rows, preventing data loss from an accidental inner join.",
      "code": "import pandas as pd\nfields = pd.DataFrame({'specimen_id':['S1','S3'],'field_id':['F1','F2']})\nmeta = pd.DataFrame({'specimen_id':['S1'],'condition':['ctrl']})\njoined = fields.merge(meta,how='left',on='specimen_id',\n                      validate='many_to_one',indicator=True)\nprint(joined['_merge'].astype(str).tolist())\nprint(joined.loc[joined['_merge']=='left_only','specimen_id'].tolist())",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "S1",
          "matched"
        ],
        [
          "S3",
          "unmatched"
        ],
        [
          "Policy",
          "keep both"
        ]
      ],
      "output": "['both', 'left_only']\n['S3']",
      "note": "Missing specimen metadata must be recorded; silently filtering unmatched rows can distort group composition.",
      "goal": "I08-G01"
    },
    {
      "title": "Summarize fields within specimen before group comparisons",
      "say": "Each specimen can contribute multiple microscopy fields. Grouping by specimen ID yields one descriptive mean per specimen rather than treating all fields as separate independent biological observations. Here S1 averages two supplied values and S2 has one.",
      "code": "import pandas as pd\ndf = pd.DataFrame({'specimen_id':['S1','S1','S2'],\n                   'field_id':['F1','F2','F3'],\n                   'area_px':[2.,4.,6.]})\nmeans = df.groupby('specimen_id',sort=True)['area_px'].mean().to_dict()\nprint(means)\nprint(df['specimen_id'].nunique())",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "S1 fields",
          "2 and 4 px"
        ],
        [
          "S1 mean",
          "3.0 px"
        ],
        [
          "Specimens",
          "2 IDs"
        ]
      ],
      "output": "{'S1': 3.0, 'S2': 6.0}\n2",
      "note": "An observation labeled specimen still requires an experimentally justified independence definition; within-specimen aggregation alone does not prove it.",
      "goal": "I08-G02"
    },
    {
      "title": "Five fields are not five biological replicates",
      "say": "Suppose three fields came from specimen S1 and two from specimen S2. The DataFrame has five measurement rows but only two distinct specimen identifiers. A plotted n of five would be pseudoreplication if the true unit were the specimen.",
      "code": "import pandas as pd\ndf = pd.DataFrame({'specimen_id':['S1']*3+['S2']*2,\n                   'area_px':[1,2,3,4,5]})\nprint('Fields:',len(df))\nprint('Specimen IDs:',df['specimen_id'].nunique())",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Rows",
          "5 fields"
        ],
        [
          "IDs",
          "2 specimens"
        ],
        [
          "Limit",
          "n ≠ 5 independent"
        ]
      ],
      "output": "Fields: 5\nSpecimen IDs: 2",
      "note": "Specimen IDs may themselves be nested within animals or biological preparations; study design determines the true replicate count.",
      "goal": "I08-G02"
    },
    {
      "title": "Melt wide channels into tidy long observations",
      "say": "An original wide table can have two channel columns for each field. Melting creates two rows per field, retaining the field ID and channel label for each observation. The table shape changes, but the source fields do not magically multiply.",
      "code": "import pandas as pd\nwide = pd.DataFrame({'field_id':['F1','F2'],\n                     'green':[3,4],'red':[6,7]})\nlong = wide.melt(id_vars=['field_id'],var_name='channel',\n                 value_name='intensity_au')\nprint(long.shape)\nprint(long['field_id'].tolist())",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "Wide",
          "2 fields × 2 channels"
        ],
        [
          "Long",
          "4 observation rows"
        ],
        [
          "Identity",
          "field_id retained"
        ]
      ],
      "output": "(4, 3)\n['F1', 'F2', 'F1', 'F2']",
      "note": "Two channel values measured in the same field remain correlated within that field.",
      "goal": "I08-G03"
    },
    {
      "title": "Predict the melted row count before seeing it",
      "say": "Three supplied field identifiers each have two channel measurements. Predict how many rows Pandas melt creates when both channels are converted to a long table. The result stays hidden until you advance.",
      "code": "import pandas as pd\nwide = pd.DataFrame({'field_id':['F1','F2','F3'],\n                     'green':[1,2,3],'red':[4,5,6]})\nlong = wide.melt(id_vars='field_id',var_name='channel',value_name='value')\nprint(len(long))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Fields",
          "3"
        ],
        [
          "Channels",
          "2"
        ],
        [
          "Predict",
          "Long rows = ?"
        ]
      ],
      "output": "",
      "note": "Answer withheld: count field-channel observations, not independent specimens.",
      "goal": "I08-G03",
      "checkpoint": true
    },
    {
      "title": "Reveal: six long rows still describe three fields",
      "say": "Three fields each carry two channel values, producing six rows after melting. The field identifiers must be retained to preserve pairing across channels. The transformation changes table layout, not the biological sampling design.",
      "code": "import pandas as pd\nwide = pd.DataFrame({'field_id':['F1','F2','F3'],\n                     'green':[1,2,3],'red':[4,5,6]})\nlong = wide.melt(id_vars='field_id',var_name='channel',value_name='value')\nprint(len(long))\nprint(long['field_id'].nunique())",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Long rows",
          "6"
        ],
        [
          "Unique fields",
          "3"
        ],
        [
          "Pairing",
          "preserved"
        ]
      ],
      "output": "6\n3",
      "note": "Never use the doubled row count as the independent sample size for a treatment comparison.",
      "goal": "I08-G03"
    },
    {
      "title": "Parse timestamps with an explicit error policy",
      "say": "Acquisition timestamps identify when recorded data were generated, not automatically biological treatment times. Pandas parses one ISO timestamp here and marks an invalid string as missing instead of inventing a date.",
      "code": "import pandas as pd\nraw = pd.Series(['2026-11-13T08:30:00Z','unknown'])\ntime = pd.to_datetime(raw,errors='coerce',utc=True)\nprint(time.isna().tolist())\nprint(time.iloc[0].date())",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "ISO string",
          "valid UTC"
        ],
        [
          "unknown",
          "NaT"
        ],
        [
          "Rule",
          "no invented date"
        ]
      ],
      "output": "[False, True]\n2026-11-13",
      "note": "Timezones, stage timing and instrument clocks must be documented before comparisons across acquisitions.",
      "goal": "I08-G04"
    },
    {
      "title": "Ordered experimental categories are not timestamps",
      "say": "Conditions can have a declared conceptual order, such as baseline, treatment and recovery. Pandas ordered categories preserve that order for plotting. Ordering does not prove that any sample actually followed a measured time sequence.",
      "code": "import pandas as pd\nstage = pd.Categorical(['treated','baseline'],\n     categories=['baseline','treated','recovery'],ordered=True)\nprint(stage.categories.tolist())\nprint(stage.ordered)",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Category order",
          "baseline → treated"
        ],
        [
          "Extra level",
          "recovery"
        ],
        [
          "Ordered",
          "True"
        ]
      ],
      "output": "['baseline', 'treated', 'recovery']\nTrue",
      "note": "Do not infer causal transitions, paired timepoints or actual measurement chronology from category labels alone.",
      "goal": "I08-G04"
    },
    {
      "title": "Export and reload without erasing specimen identifiers",
      "say": "A simple in-memory CSV roundtrip lets us verify preserved field data and leading-zero specimen IDs. We explicitly read the identifier as string upon reloading instead of relying on numeric inference.",
      "code": "import io\nimport pandas as pd\ndf = pd.DataFrame({'specimen_id':['0003','0004'],'area_px':[4,8]})\nout = io.StringIO()\ndf.to_csv(out,index=False)\nout.seek(0)\nreloaded = pd.read_csv(out,dtype={'specimen_id':'string'})\nprint(reloaded['specimen_id'].tolist())\nprint(int(reloaded['area_px'].sum()))",
      "focus": [
        7,
        8,
        9
      ],
      "visual": [
        [
          "Export",
          "CSV text"
        ],
        [
          "Reload",
          "text IDs"
        ],
        [
          "Sum",
          "12 px"
        ]
      ],
      "output": "['0003', '0004']\n12",
      "note": "CSV does not preserve units or provenance automatically; include metadata in the report and a separate manifest.",
      "goal": "I08-G05"
    },
    {
      "title": "Attach source status and measurement units to the report",
      "say": "A reproducible report records which columns are IDs, the measured quantity and its units, the origin of the numbers and the number of supplied records. This synthetic example explicitly labels its source rather than implying a calibrated microscopy acquisition.",
      "code": "report = {'quantity':'candidate area',\n          'unit':'pixels squared',\n          'source':'synthetic teaching data',\n          'rows':3}\nprint(report['source'])\nprint(report['unit'],report['rows'])",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Quantity",
          "candidate area"
        ],
        [
          "Units",
          "pixels squared"
        ],
        [
          "Source",
          "synthetic"
        ]
      ],
      "output": "synthetic teaching data\npixels squared 3",
      "note": "Physical square-micrometer calibration requires real metadata; a typed text record alone cannot establish provenance.",
      "goal": "I08-G05"
    },
    {
      "title": "Plot actual descriptive points rather than a fabricated p value",
      "say": "A scatter plot can display individual specimen summaries without implying significance. Here Matplotlib makes one scatter artist containing three synthetic points. The number of points does not establish any biological replicate structure by itself.",
      "code": "import matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt\nfig,ax = plt.subplots()\nax.scatter([0,0,1],[2,4,3])\nax.set(xlabel='Condition index',ylabel='Specimen value (synthetic)')\nprint(len(ax.collections),len(ax.collections[0].get_offsets()))\nplt.close(fig)",
      "focus": [
        6,
        7,
        8
      ],
      "visual": [
        [
          "Figure",
          "one scatter layer"
        ],
        [
          "Observations",
          "3 points"
        ],
        [
          "Statistics",
          "none implied"
        ]
      ],
      "output": "1 3",
      "note": "No p value, confidence interval or treatment effect is justified by these invented illustrative points.",
      "goal": "I08-G06"
    },
    {
      "title": "Plotting all fields could hide the true unit",
      "say": "Three fields from specimen S1 and one field from S2 create four plot points but only two specimen identifiers. The correct descriptive plot depends on whether fields, specimens, animals or preparations are the experimental units.",
      "code": "import pandas as pd\ndf = pd.DataFrame({'specimen_id':['S1','S1','S1','S2'],\n                   'condition':['A','A','A','B'],\n                   'value':[1,2,3,4]})\nprint('Field points:',len(df))\nprint('Specimen summaries:',len(df.groupby('specimen_id')))",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Raw points",
          "4"
        ],
        [
          "Specimen IDs",
          "2"
        ],
        [
          "Problem",
          "pseudoreplication"
        ]
      ],
      "output": "Field points: 4\nSpecimen summaries: 2",
      "note": "Averaging within a specimen is not enough if specimens are still nested within one animal or dish.",
      "goal": "I08-G06"
    },
    {
      "title": "Label what the values actually measure",
      "say": "Honest figure axes should state the synthetic observation unit and avoid implying micrometers when only pixel counts were supplied. Explicit limits help a reader see the baseline, but the chosen display range should not hide relevant points.",
      "code": "import matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt\nfig,ax = plt.subplots()\nax.scatter([0,1],[2,6])\nax.set(xlabel='Condition (coded)',ylabel='Candidate area (pixels squared)')\nax.set_ylim(0,8)\nprint(ax.get_ylabel())\nprint(tuple(float(v) for v in ax.get_ylim()))\nplt.close(fig)",
      "focus": [
        8,
        9,
        10
      ],
      "visual": [
        [
          "Y axis",
          "candidate area"
        ],
        [
          "Unit",
          "pixels squared"
        ],
        [
          "Range",
          "0–8"
        ]
      ],
      "output": "Candidate area (pixels squared)\n(0.0, 8.0)",
      "note": "Changing axis limits affects visual impression, not recorded values; justify nonzero truncation if used.",
      "goal": "I08-G07"
    },
    {
      "title": "Export genuine SVG and PNG representations",
      "say": "A report should be reproducibly exportable as both vector and raster graphics. Matplotlib can write real SVG and PNG bytes in memory without browser recording or MP4 download. The output signatures confirm formats, not scientific quality.",
      "code": "import io\nimport matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt\nfig,ax = plt.subplots()\nax.plot([0,1],[1,2])\nsvg, png = io.BytesIO(), io.BytesIO()\nfig.savefig(svg,format='svg')\nfig.savefig(png,format='png',dpi=100)\nprint(svg.getvalue().startswith(b'<?xml'))\nprint(png.getvalue().startswith(b'\\x89PNG'))\nplt.close(fig)",
      "focus": [
        10,
        11,
        12
      ],
      "visual": [
        [
          "SVG",
          "vector content"
        ],
        [
          "PNG",
          "raster, 100 DPI"
        ],
        [
          "Check",
          "real file signatures"
        ]
      ],
      "output": "True\nTrue",
      "note": "The presence of valid image bytes does not establish valid measurements, accessibility or a publication-ready figure.",
      "goal": "I08-G08"
    },
    {
      "title": "Capstone: trace unmatched fields and produce specimen summaries",
      "say": "Combine an explicit many-to-one left join with a source-preserving field table and a per-specimen descriptive summary. One metadata ID is absent, one score is missing, and all four field rows remain. Create a Matplotlib scatter only from summary values and report what remains unverified.",
      "code": "import pandas as pd\nimport matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt\nfields = pd.DataFrame({'specimen_id':['S1','S1','S2','S3'],\n  'field_id':['F1','F2','F3','F4'],'value':[2,None,5,4]})\nmeta = pd.DataFrame({'specimen_id':['S1','S2'],\n  'condition':['ctrl','treated']})\noriginal = fields.copy(deep=True)\njoined = fields.merge(meta,on='specimen_id',how='left',\n                      validate='many_to_one',indicator=True)\nunmatched = joined.loc[joined['_merge']=='left_only','specimen_id'].tolist()\nmissing = joined.loc[joined['value'].isna(),'field_id'].tolist()\nmeans = joined.groupby('specimen_id')['value'].mean().to_dict()\nfig,ax = plt.subplots()\nax.scatter(range(len(means)),list(means.values()))\nprint('Rows:',len(joined),'Unmatched:',unmatched,'Missing fields:',missing)\nprint('Means:',means)\nprint('Source preserved:',fields.equals(original),'Verified:',False)\nplt.close(fig)",
      "focus": [
        18,
        19,
        20
      ],
      "visual": [
        [
          "Fields",
          "4 retained"
        ],
        [
          "Audit",
          "S3 unmatched, F2 missing"
        ],
        [
          "Result",
          "3 descriptive means"
        ]
      ],
      "output": "Rows: 4 Unmatched: ['S3'] Missing fields: ['F2']\nMeans: {'S1': 2.0, 'S2': 5.0, 'S3': 4.0}\nSource preserved: True Verified: False",
      "note": "This is a synthetic source-preserving report, not measured fluorescence, an independently verified experiment or a formal comparison.",
      "goal": "I08-CAPSTONE"
    },
    {
      "title": "Independent transfer: build a new reliable report",
      "say": "Return to your real editor and write a new pipeline joining fresh specimen metadata to acquisition fields. Include duplicate metadata, one unmatched specimen, a missing score and a legitimate zero. Fail safely on invalid join cardinality and show individual specimen summaries rather than claiming field-level biological replication.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Join",
          "Validate keys and unmatched IDs"
        ],
        [
          "Report",
          "Preserve missing and source rows"
        ],
        [
          "Plot",
          "Describe units, do not infer"
        ]
      ],
      "output": "",
      "note": "Independent transfer must use genuinely new input and independently written Python; do not copy this completed example.",
      "goal": "I08-CAPSTONE"
    }
  ]
}]);
})();
