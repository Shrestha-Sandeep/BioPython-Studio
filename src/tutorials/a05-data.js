// A05 research-led bioimage statistics tutorials: invented animal records and real Python.
"use strict";
(()=>{window.BioPythonAdvancedTutorials=Object.freeze([...(window.BioPythonAdvancedTutorials||[]),{
  "id": "a05-chapter",
  "chapter": "A05",
  "title": "Analyze biological replicates correctly",
  "short": "Metadata, pseudoreplication, pairs and animal-level bootstrap",
  "minutes": "18–24 min",
  "goals": [
    "A05-G01",
    "A05-G02",
    "A05-G03",
    "A05-G04",
    "A05-G05",
    "A05-G06",
    "A05-CAPSTONE"
  ],
  "steps": [
    {
      "goal": "A05-G01",
      "title": "Destination: from images to an honest biological effect",
      "say": "A quantitative microscopy study might contain thousands of objects but only a few independently treated specimens. Your final capability is to join verified metadata, exclude documented failures, aggregate by biological unit, respect pairing, estimate an effect and report uncertainty without falsely inflating independent sample size.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Source",
          "Microscope fields"
        ],
        [
          "Statistical unit",
          "Independent animal"
        ],
        [
          "Report",
          "Effect, n and limitations"
        ]
      ],
      "output": "",
      "note": "All data in these examples are invented. The independence of animals, acquisition batches, exclusions and real scientific conclusions cannot be verified from an exercise."
    },
    {
      "goal": "A05-G01",
      "title": "Join field IDs to specimen metadata without silently dropping rows",
      "say": "Each microscope field needs a reliable link to its parent animal. A field without metadata must be listed, not silently assigned to the nearest specimen or excluded without an audit.",
      "code": "fields=['F1','F2','F3']\nmetadata={'F1':'worm-A','F2':'worm-B'}\nmissing=sorted(x for x in fields if x not in metadata)\nprint(len(fields)-len(missing),missing)",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Fields",
          "F1, F2, F3"
        ],
        [
          "Matched",
          "2"
        ],
        [
          "Missing metadata",
          "F3"
        ]
      ],
      "output": "2 ['F3']",
      "note": "A successful join proves only software ID consistency, not that the animal IDs are biologically distinct or independently treated."
    },
    {
      "goal": "A05-G01",
      "title": "A repeated metadata key must be flagged before it overwrites a specimen",
      "say": "If an import contains duplicate field IDs, converting rows straight to a dictionary will silently keep only one assignment. Detect duplicates before construction, especially when the duplicated field refers to different animals.",
      "code": "rows=[('F1','A'),('F2','B'),('F1','C')]\nseen=set();duplicate=set()\nfor field,animal in rows:\n    if field in seen: duplicate.add(field)\n    seen.add(field)\nprint(sorted(duplicate))",
      "focus": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "visual": [
        [
          "Conflicting field",
          "F1"
        ],
        [
          "Action",
          "Flag for review"
        ],
        [
          "Never",
          "Overwrite silently"
        ]
      ],
      "output": "['F1']",
      "note": "A duplicate can indicate measurement repetition or corrupted metadata; inspect primary source records rather than arbitrarily selecting the first value."
    },
    {
      "goal": "A05-G02",
      "title": "A heavily imaged animal can distort the pooled field average",
      "say": "Animal A contributes three measurements of zero while animal B contributes one measurement of ten. A naive average of all four fields is two point five, but the mean of two animal-level means is five.",
      "code": "data=[('A',0),('A',0),('A',0),('B',10)]\nmeans={a:sum(v for k,v in data if k==a)/sum(k==a for k,_ in data) for a in {a for a,_ in data}}\nprint(sum(v for _,v in data)/len(data),sum(means.values())/len(means))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Field pooled mean",
          "2.5"
        ],
        [
          "Animal-weighted mean",
          "5.0"
        ],
        [
          "Independent n",
          "2"
        ]
      ],
      "output": "2.5 5.0",
      "note": "Neither mean is automatically the right scientific estimand; this course's target is the average independently sampled animal response."
    },
    {
      "goal": "A05-G02",
      "title": "Count biological units separately from field observations",
      "say": "Three fields from one worm and one from another remain just two worm IDs. This distinction must propagate into confidence intervals, summaries, plot legends and any inferential statistics.",
      "code": "animals=['A','A','A','B']\nprint({'field_n':len(animals),'animal_n':len(set(animals))})",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Technical observations",
          "4 fields"
        ],
        [
          "Biological samples",
          "2 worms"
        ],
        [
          "Cluster unit",
          "Animal ID"
        ]
      ],
      "output": "{'field_n': 4, 'animal_n': 2}",
      "note": "If worms share a plate, litter or treatment bath, animal IDs may still not represent all relevant independence. Preserve the actual experimental hierarchy."
    },
    {
      "goal": "A05-G03",
      "title": "Exclusions must be visible in the scientific record",
      "say": "A blurred field may be excluded according to a prespecified QC criterion, but it should remain traceable with the reason. Keep complete records and derive retained rows without rewriting source measurements.",
      "code": "rows=[('A',4,''),('A',99,'out_of_focus'),('B',8,'')]\nretained=[(a,v) for a,v,reason in rows if not reason]\nreasons=[reason for _,_,reason in rows if reason]\nprint(retained,reasons)",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Original records",
          "3"
        ],
        [
          "Retained",
          "2"
        ],
        [
          "Excluded reason",
          "out_of_focus"
        ]
      ],
      "output": "[('A', 4), ('B', 8)] ['out_of_focus']",
      "note": "An exclusion reason does not prove its legitimacy; if it was chosen after inspecting a treatment effect, selection bias can remain."
    },
    {
      "goal": "A05-G03",
      "title": "Recompute animal means from only retained measurements",
      "say": "The second field from animal A is excluded, leaving one measured value for A. The report preserves all records, but the current analysis mean must be based only on eligible fields.",
      "code": "rows=[('A',4,''),('A',99,'focus'),('B',8,'')]\nanimals=sorted({a for a,_,_ in rows})\nmeans={a:sum(v for x,v,r in rows if x==a and not r)/sum(x==a and not r for x,_,r in rows) for a in animals}\nprint(means)",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Animal A",
          "4.0 after exclusion"
        ],
        [
          "Animal B",
          "8.0"
        ],
        [
          "Audit",
          "One omitted field"
        ]
      ],
      "output": "{'A': 4.0, 'B': 8.0}",
      "note": "A correct exclusion calculation must also check for animals with no retained data and avoid zero-denominator artifacts."
    },
    {
      "goal": "A05-G04",
      "title": "Paired experiments use within-specimen differences",
      "say": "Three independent animals have matched control and treatment measurements. Pairing removes each animal's baseline from its treatment result and gives three independent differences for analysis.",
      "code": "pairs={'A':(4,6),'B':(5,9),'C':(7,8)}\ndiffs=[t-c for c,t in pairs.values()]\nprint(diffs,round(sum(diffs)/len(diffs),2))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Independent pairs",
          "3"
        ],
        [
          "Differences",
          "2, 4, 1"
        ],
        [
          "Paired mean effect",
          "2.33"
        ]
      ],
      "output": "[2, 4, 1] 2.33",
      "note": "Matching is justified by experimental design, not by choosing nearest values or retrospectively assigning pair IDs to improve a test."
    },
    {
      "goal": "A05-G04",
      "title": "Reject a before/after dataset with incomplete pair IDs",
      "say": "If treatment value C has no matched control value, silently keeping it as a separate fourth unit changes the experimental design. Audit paired IDs and only resample complete independent pairs.",
      "code": "control={'A':4,'B':5};treated={'A':6,'B':9,'C':8}\ncomplete=sorted(control.keys()&treated.keys())\nmissing=sorted(treated.keys()-control.keys())\nprint(complete,missing)",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Paired IDs",
          "A, B"
        ],
        [
          "Unpaired treatment",
          "C"
        ],
        [
          "Action",
          "Flag incomplete pair"
        ]
      ],
      "output": "['A', 'B'] ['C']",
      "note": "A paired analysis must make a declared complete-pair policy; losing subjects can create selection bias and severely reduce usable n."
    },
    {
      "goal": "A05-G04",
      "title": "Predict a matched mean difference on new subjects",
      "say": "For paired animals A, B and C, subtract each control from its own treatment value. Predict the three differences and their mean before seeing the code's numerical answer.",
      "code": "pairs=[(3,4),(5,9),(6,8)]\nd=[t-c for c,t in pairs]\nprint(d,round(sum(d)/len(d),2))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Controls",
          "3, 5, 6"
        ],
        [
          "Treatments",
          "4, 9, 8"
        ],
        [
          "Mean difference",
          "Withheld"
        ]
      ],
      "output": "",
      "note": "The output is intentionally withheld so you can calculate the within-animal differences yourself before advancing.",
      "checkpoint": true
    },
    {
      "goal": "A05-G04",
      "title": "Reveal: the paired mean uses three independent differences",
      "say": "The treatment-minus-control differences are one, four and two. Their mean is approximately two point three three and the independent sample size is three complete pairs, not six images.",
      "code": "pairs=[(3,4),(5,9),(6,8)]\nd=[t-c for c,t in pairs]\nprint(d,round(sum(d)/len(d),2))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Per-pair differences",
          "1, 4, 2"
        ],
        [
          "Paired mean",
          "2.33"
        ],
        [
          "Independent n",
          "3 pairs"
        ]
      ],
      "output": "[1, 4, 2] 2.33",
      "note": "Paired differences still require independent experimental pairs; repeated observations, batch effects and temporal correlation must be addressed separately."
    },
    {
      "goal": "A05-G05",
      "title": "Bootstrap resampling must draw whole biological units",
      "say": "For an unpaired study, resample control animals within the control group and treated animals within treatment, each with replacement. Repeated microscope fields never enter as independent bootstrap resampling units.",
      "code": "import numpy as np\ncontrol=np.array([2.,3.,4.]);treatment=np.array([5.,7.,9.])\nrng=np.random.default_rng(17)\nc=rng.choice(control,size=len(control),replace=True)\nt=rng.choice(treatment,size=len(treatment),replace=True)\nprint(len(c),len(t),set(c).issubset(set(control)))",
      "focus": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "visual": [
        [
          "Sampling unit",
          "Independent animal"
        ],
        [
          "Groups",
          "Resampled separately"
        ],
        [
          "Not sampled",
          "Field or cell rows"
        ]
      ],
      "output": "3 3 True",
      "note": "The two groups are invented and small; unit-aware resampling is conceptually correct but does not make n=3 enough for trustworthy biological uncertainty."
    },
    {
      "goal": "A05-G05",
      "title": "A fixed seed produces a reproducible percentile-bootstrap illustration",
      "say": "A seeded generator repeats the same algorithmic resampling from three synthetic control and three treated animal means. Record the mean difference and percentile interval, but do not interpret this toy interval as real evidence.",
      "code": "import numpy as np\nc=np.array([2.,3.,4.]);t=np.array([5.,7.,9.]);rng=np.random.default_rng(17)\nboot=np.array([rng.choice(t,3,replace=True).mean()-rng.choice(c,3,replace=True).mean() for _ in range(1000)])\nprint(round(float(t.mean()-c.mean()),2),np.quantile(boot,[.025,.975]).round(2).tolist())",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Synthetic effect",
          "4.0 units"
        ],
        [
          "Percentile CI",
          "2.0 to 6.0"
        ],
        [
          "Biological n",
          "3 + 3, too small to trust"
        ]
      ],
      "output": "4.0 [2.0, 6.0]",
      "note": "The percentile CI can be unstable with small independent n; a fixed random seed ensures software replay, not valid coverage for an actual population."
    },
    {
      "goal": "A05-G05",
      "title": "A bootstrap interval cannot rescue an invalid experimental design",
      "say": "Additional fields from the same animal provide information about that animal's measured value, not unlimited independent information. Even with a numerical bootstrap interval, a tiny or confounded experiment needs biological repeats.",
      "code": "fields=['A']*10+['B']*10\nprint(len(fields),len(set(fields)),len(fields)>len(set(fields)))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Image fields",
          "20"
        ],
        [
          "Independent animals",
          "2"
        ],
        [
          "Interpretation",
          "Insufficient for inference"
        ]
      ],
      "output": "20 2 True",
      "note": "The software can demonstrate resampling mechanics, but it cannot validate randomization, sample independence, statistical assumptions or a biological effect."
    },
    {
      "goal": "A05-G06",
      "title": "Make figure data with one point per independent animal",
      "say": "Scientific figures should display actual independent units wherever possible, with declared experimental condition and calibrated measurement labels. The example returns points rather than drawing misleading cell-level significance bars.",
      "code": "units=[('control','A',3.0),('control','B',4.0),('treated','C',7.0)]\npoints=sorted(units)\nprint(points,len({animal for _,animal,_ in units}))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Points",
          "One per animal"
        ],
        [
          "Y label",
          "Illustrative signal (a.u.)"
        ],
        [
          "Independent n",
          "3 animals"
        ]
      ],
      "output": "[('control', 'A', 3.0), ('control', 'B', 4.0), ('treated', 'C', 7.0)] 3",
      "note": "Arbitrary units are not calibrated photon counts, concentration or absolute molecule numbers. A figure must state exclusion policy and n by group."
    },
    {
      "goal": "A05-G06",
      "title": "Show nested fields without presenting them as biological replicates",
      "say": "An informative superplot can show the distribution of technical observations within each animal while emphasizing larger animal-level points. Count the two independent animals, not four field marks.",
      "code": "data=[('A',1),('A',3),('A',5),('B',7)]\nids=sorted({a for a,_ in data})\nmeans=[(a,sum(v for x,v in data if x==a)/sum(x==a for x,_ in data)) for a in ids]\nprint(means,len(data),len(ids))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Small points",
          "4 image fields"
        ],
        [
          "Large points",
          "2 animal means"
        ],
        [
          "Independent n",
          "2 worms"
        ]
      ],
      "output": "[('A', 3.0), ('B', 7.0)] 4 2",
      "note": "A superplot communicates the hierarchy; it does not turn two biological samples into enough replicates for strong population-level conclusions."
    },
    {
      "goal": "A05-CAPSTONE",
      "title": "Capstone: design-correct per-animal effect and exclusion audit",
      "say": "This compact synthetic end-to-end analysis retains the animal/field hierarchy, excludes documented failed fields, aggregates at animal level, and reports a treatment-minus-control effect without a p-value or causal claim.",
      "code": "from collections import defaultdict\nrows=[('control','A',4,''),('control','A',6,''),('control','B',7,''),('treated','C',10,''),('treated','C',99,'blur'),('treated','D',11,'')]\ngroups=defaultdict(list);excluded=0\nfor condition,animal,signal,reason in rows:\n    if reason:excluded+=1\n    else:groups[(condition,animal)].append(signal)\nmeans={key:sum(vals)/len(vals) for key,vals in groups.items()}\nc=[v for (cond,_),v in means.items() if cond=='control'];t=[v for (cond,_),v in means.items() if cond=='treated']\nprint({'control_n':len(c),'treated_n':len(t),'effect':(sum(t)/len(t)-sum(c)/len(c)),'excluded_fields':excluded,'pseudoreplication_avoided':True})",
      "focus": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ],
      "visual": [
        [
          "Biological units",
          "2 control + 2 treated"
        ],
        [
          "Field exclusion",
          "1 blurred field"
        ],
        [
          "Result",
          "Effect only; no inference"
        ]
      ],
      "output": "{'control_n': 2, 'treated_n': 2, 'effect': 5.0, 'excluded_fields': 1, 'pseudoreplication_avoided': True}",
      "note": "This capstone deliberately has too few animals to pass A05's real-data bootstrap gate; do not compute or report a credible CI or causal effect from it."
    },
    {
      "goal": "A05-CAPSTONE",
      "title": "Independent transfer: design and analyze a genuinely new experiment",
      "say": "Return to the editor and analyze new field rows with several animals per group, missing metadata, prespecified exclusion reasons and possible paired samples. Select the correct experimental unit, compare pooled versus animal means and document a fresh local replay.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "New measurements",
          "Different animal-field structure"
        ],
        [
          "Analysis design",
          "Pairing and clusters declared"
        ],
        [
          "Exit gate",
          "Real independent local audit"
        ]
      ],
      "output": "",
      "note": "The A05-REVIEW and Prove exercises remain unsolved. Completion requires an actual independent study plan, validated units and a fresh-checkout run, not merely watching this tutorial."
    }
  ]
}]);})();
