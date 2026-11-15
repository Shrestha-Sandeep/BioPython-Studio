// A03 matching synthetic reference instances to candidate predictions; independent real annotation required.
"use strict";
(()=>{window.BioPythonAdvancedTutorials=Object.freeze([...(window.BioPythonAdvancedTutorials||[]),{
  "id": "a03-chapter",
  "chapter": "A03",
  "title": "Validate candidate objects against references",
  "short": "Pixel versus object IoU, one-to-one errors and independent groups",
  "minutes": "18–24 min",
  "goals": [
    "A03-G01",
    "A03-G02",
    "A03-G03",
    "A03-G04",
    "A03-G05",
    "A03-CAPSTONE"
  ],
  "steps": [
    {
      "goal": "A03-G01",
      "title": "The destination: evaluate objects against independently defined references",
      "say": "Segmentation validity requires more than a plausible mask. Given independently labeled source annotations, we can compare pixel overlap, matched object identities and false splits or merges, then decide whether evaluation groups are genuinely independent. The examples here use invented instance labels; actual biological validation needs credible references.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Inputs",
          "Reference + candidate labels"
        ],
        [
          "Evaluation",
          "Object matches and errors"
        ],
        [
          "Output",
          "Auditable TP, FP, FN"
        ]
      ],
      "output": "",
      "note": "Reference labels are invented for teaching. A mask predicted on one image or an unreviewed annotation cannot establish biological validity."
    },
    {
      "goal": "A03-G01",
      "title": "A perfect foreground mask can still merge two separate objects",
      "say": "The truth map names two distinct objects with labels one and two. The predicted map assigns both foreground pixels the same identifier. Their binary foreground pixels are identical, so pixel overlap alone misses the merge.",
      "code": "import numpy as np\ntruth=np.array([[1,0,2]])\npred=np.array([[1,0,1]])\npixel_iou=np.logical_and(truth>0,pred>0).sum()/np.logical_or(truth>0,pred>0).sum()\nprint(float(pixel_iou),len(set(truth.ravel())-{0}),len(set(pred.ravel())-{0}))",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Foreground pixel IoU",
          "1.0"
        ],
        [
          "Reference objects",
          "2"
        ],
        [
          "Predicted objects",
          "1"
        ]
      ],
      "output": "1.0 2 1",
      "note": "This difference between instance identity and binary foreground is the central reason to validate object-level detection."
    },
    {
      "goal": "A03-G01",
      "title": "Foreground IoU is an area ratio, not object accuracy",
      "say": "When one broad predicted region swallows a background gap, the foreground overlap can still be high. Here four of five union pixels intersect, so the pixel IoU is zero point eight, although the prediction has merged two original instances.",
      "code": "import numpy as np\ntruth=np.array([[1,1,0,2,2]])\npred=np.array([[1,1,1,1,1]])\ni=(np.logical_and(truth>0,pred>0)).sum()\nu=(np.logical_or(truth>0,pred>0)).sum()\nprint(int(i),int(u),round(float(i/u),2))",
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
          "Shared pixels",
          "4"
        ],
        [
          "Union pixels",
          "5"
        ],
        [
          "Foreground IoU",
          "0.80"
        ]
      ],
      "output": "4 5 0.8",
      "note": "A reference foreground mask and source pixels cannot on their own diagnose overmerged instance objects unless instance IDs are preserved."
    },
    {
      "goal": "A03-G01",
      "title": "Object identifiers are categories, not intensity values",
      "say": "One image may use labels one and two as arbitrary object IDs. They indicate two separate reference instances, not different brightness or biological cell types. Zero consistently means background.",
      "code": "import numpy as np\nlabels=np.array([[0,1,1,0,2,2]])\nprint(sorted(int(v) for v in np.unique(labels) if v>0))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Background",
          "0"
        ],
        [
          "Object ID",
          "1"
        ],
        [
          "Object ID",
          "2"
        ]
      ],
      "output": "[1, 2]",
      "note": "Never compare instance IDs as ordinal biological measurements. Equality of labels across unrelated images is not identity of the same cell."
    },
    {
      "goal": "A03-G02",
      "title": "Each reference–prediction pair has its own IoU",
      "say": "A two-by-two IoU matrix lists the overlap score between each reference object and each predicted region. These are invented scores used to expose why an apparently sensible greedy matching rule may fail.",
      "code": "import numpy as np\niou=np.array([[.90,.80],[.81,.10]])\nprint(iou.round(2).tolist())",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Reference rows",
          "2 objects"
        ],
        [
          "Prediction columns",
          "2 objects"
        ],
        [
          "Candidate IoUs",
          "0.90,0.80,0.81,0.10"
        ]
      ],
      "output": "[[0.9, 0.8], [0.81, 0.1]]",
      "note": "Each pair's IoU must actually be computed from instance masks in a real benchmark; the teaching matrix is not sampled from real cells."
    },
    {
      "goal": "A03-G02",
      "title": "One predicted object cannot count as two detected objects",
      "say": "Suppose two annotated objects both overlap the same single prediction. A one-to-one object evaluation can accept only one true positive, leaving the other reference unmatched as a false negative.",
      "code": "import numpy as np\nfrom scipy.optimize import linear_sum_assignment\nm=np.array([[.8],[.7]])\nr,c=linear_sum_assignment(np.where(m>=.5,-1-m/1000,0))\ntp=int((m[r,c]>=.5).sum())\nprint(tp,m.shape[1]-tp,m.shape[0]-tp)",
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
          "Reference objects",
          "2"
        ],
        [
          "Predictions",
          "1"
        ],
        [
          "TP / FP / FN",
          "1 / 0 / 1"
        ]
      ],
      "output": "1 0 1",
      "note": "One-to-one matching prevents duplicate credit. The positive label definition and IoU threshold must be fixed before evaluation."
    },
    {
      "goal": "A03-G02",
      "title": "Greedy highest overlap can lose a true positive",
      "say": "The first prediction has a slightly higher match to the first truth object, but taking that pairing forces the other match to fall below the cutoff. Crossing the pair assignments instead gives two qualifying object matches.",
      "code": "import numpy as np\nm=np.array([[.9,.8],[.81,.1]])\ncutoff=.5\ndiagonal=int(m[0,0]>=cutoff)+int(m[1,1]>=cutoff)\ncross=int(m[0,1]>=cutoff)+int(m[1,0]>=cutoff)\nprint(diagonal,cross)",
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
          "Greedy .90 first",
          "1 qualified"
        ],
        [
          "Cross .80 + .81",
          "2 qualified"
        ],
        [
          "Rule",
          "Maximize match count first"
        ]
      ],
      "output": "1 2",
      "note": "Greedy matching and maximum raw total IoU are not guaranteed to optimize threshold-qualified object recall; state the matching policy precisely."
    },
    {
      "goal": "A03-G02",
      "title": "Assignment can maximize qualified matches before IoU tie-breaks",
      "say": "Give each qualifying reference–prediction pairing a negative unit cost, then a very small score preference. SciPy's linear assignment finds two cross pairs instead of selecting one very high score and losing the other true positive.",
      "code": "import numpy as np\nfrom scipy.optimize import linear_sum_assignment\nm=np.array([[.9,.8],[.81,.1]]);valid=m>=.5\nrows,cols=linear_sum_assignment(np.where(valid,-1-m/1000,0))\npairs=sorted((int(r),int(c)) for r,c in zip(rows,cols) if valid[r,c])\nprint(pairs)",
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
          "Accepted pairs",
          "(ref0,pred1), (ref1,pred0)"
        ],
        [
          "Qualified matches",
          "2"
        ],
        [
          "Invalid low IoU",
          "Excluded"
        ]
      ],
      "output": "[(0, 1), (1, 0)]",
      "note": "The small tie-break is safe for this tiny example; production evaluation should state threshold, optimization rule and possible edge-case ties explicitly."
    },
    {
      "goal": "A03-G02",
      "title": "Predict one-to-one TP, FP and FN on a new matrix",
      "say": "Two new reference objects and two predictions have IoU scores zero point six, zero point one, zero point seven and zero point eight. At a fixed cutoff of zero point five, predict the best one-to-one matching and all three error counts.",
      "code": "import numpy as np\nfrom scipy.optimize import linear_sum_assignment\nm=np.array([[.6,.1],[.7,.8]])\nr,c=linear_sum_assignment(np.where(m>=.5,-1-m/1000,0))\ntp=int((m[r,c]>=.5).sum())\nprint(tp,m.shape[1]-tp,m.shape[0]-tp)",
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
          "IoU matrix",
          "[[.6,.1],[.7,.8]]"
        ],
        [
          "Minimum IoU",
          "0.50"
        ],
        [
          "TP / FP / FN",
          "Withheld"
        ]
      ],
      "output": "",
      "note": "The answer remains hidden until the next explanation. Predict the matching, not just which individual IoU values exceed the cutoff.",
      "checkpoint": true
    },
    {
      "goal": "A03-G02",
      "title": "Reveal: two qualifying matches, no false unmatched objects",
      "say": "Matching reference zero to prediction zero yields zero point six, and reference one to prediction one yields zero point eight. Both exceed the required cutoff, so there are two true positives, zero false positives and zero false negatives.",
      "code": "import numpy as np\nfrom scipy.optimize import linear_sum_assignment\nm=np.array([[.6,.1],[.7,.8]])\nr,c=linear_sum_assignment(np.where(m>=.5,-1-m/1000,0))\ntp=int((m[r,c]>=.5).sum())\nprint(tp,m.shape[1]-tp,m.shape[0]-tp)",
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
          "Assigned matches",
          "Ref0→Pred0; Ref1→Pred1"
        ],
        [
          "True positives",
          "2"
        ],
        [
          "FP / FN",
          "0 / 0"
        ]
      ],
      "output": "2 0 0",
      "note": "Perfect matching on a tiny invented two-by-two matrix is not evidence of generalization, annotation agreement or real microscopy performance."
    },
    {
      "goal": "A03-G03",
      "title": "A shared animal contaminates the final holdout",
      "say": "If one animal contributes fields to both the calibration split and the final held-out split, the evaluation is not independent at the animal level. The overlap is an experimental design error, even if image filenames differ.",
      "code": "records=[('A','cal'),('B','cal'),('A','holdout')]\ntrain={a for a,s in records if s=='cal'}\ntest={a for a,s in records if s=='holdout'}\nprint(sorted(train&test))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Calibration animals",
          "A and B"
        ],
        [
          "Holdout animal",
          "A again"
        ],
        [
          "Leaked group",
          "A"
        ]
      ],
      "output": "['A']",
      "note": "Other dependencies such as litter, culture batch, plate and acquisition date may require grouping more coarsely than animal ID."
    },
    {
      "goal": "A03-G03",
      "title": "A group-disjoint split reserves genuinely different animals",
      "say": "Separate the animals used for calibration from those used for final evaluation and check there is no shared source group. This is necessary for an honest claim of unseen-animal evaluation, though it does not remove batch confounding.",
      "code": "train={'A','B'};test={'C','D'}\nprint(len(train&test),len(train|test))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Calibration",
          "A, B"
        ],
        [
          "Holdout",
          "C, D"
        ],
        [
          "Group overlap",
          "None"
        ]
      ],
      "output": "0 4",
      "note": "A disjoint source split is necessary, not sufficient, for trustworthy performance inference; independent batches and representative sample collection still matter."
    },
    {
      "goal": "A03-G04",
      "title": "Precision, recall and F1 describe different error patterns",
      "say": "With two true positives, one false positive and three false negatives, positive-class precision is two thirds while recall is two fifths. F1 combines both into one half; none of the values tells you how many independent animals were studied.",
      "code": "tp,fp,fn=2,1,3\nprecision=tp/(tp+fp) if tp+fp else 0.0\nrecall=tp/(tp+fn) if tp+fn else 0.0\nf1=2*tp/(2*tp+fp+fn) if 2*tp+fp+fn else 0.0\nprint(round(precision,3),round(recall,3),round(f1,3))",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Precision",
          "2/3 = 0.667"
        ],
        [
          "Recall",
          "2/5 = 0.400"
        ],
        [
          "Object F1",
          "0.500"
        ]
      ],
      "output": "0.667 0.4 0.5",
      "note": "Any zero-denominator convention must be explicit; when a class is absent, consider reporting that the metric is undefined, not just a numeric zero."
    },
    {
      "goal": "A03-G04",
      "title": "Thousands of measured objects are not thousands of animals",
      "say": "Four image observations can come from just two biological animals. A correct research summary must report independent n at the appropriate experimental unit separately from image fields, cells, masks and matched objects.",
      "code": "animals=['A','A','A','B']\nprint(len(animals),len(set(animals)))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Image observations",
          "4"
        ],
        [
          "Independent animal IDs",
          "2"
        ],
        [
          "Scientific sample size",
          "n = 2 animals"
        ]
      ],
      "output": "4 2",
      "note": "Use the real experimental hierarchy, including nested fields and repeated images; an animal ID alone may not capture batch or sibling dependencies."
    },
    {
      "goal": "A03-G05",
      "title": "Counts-only annotation cannot support pixel overlap metrics",
      "say": "Knowing the expected count and predicted count allows a count-error comparison, but it does not tell you where each object is or how boundaries align. Pixel or object IoU requires an actual spatial reference mask.",
      "code": "annotation_type='counts'\ntruth_count,pred_count=12,10\npixel_iou_allowed=(annotation_type=='pixel_masks')\nprint(pixel_iou_allowed,abs(truth_count-pred_count))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Reference type",
          "Counts only"
        ],
        [
          "Absolute count error",
          "2"
        ],
        [
          "Pixel IoU allowed?",
          "No"
        ]
      ],
      "output": "False 2",
      "note": "Published datasets differ in the kind and quality of reference labels. An annotation of object counts is not a substitute for instance segmentation masks."
    },
    {
      "goal": "A03-CAPSTONE",
      "title": "Capstone: report a merged false prediction accurately",
      "say": "A single candidate region covers both annotated reference objects plus a one-pixel gap. Foreground overlap is high at zero point eight, yet each reference instance overlaps only two fifths of that prediction. At an IoU cutoff of one half, both object matches fail.",
      "code": "import numpy as np\nfrom scipy.optimize import linear_sum_assignment\ntruth=np.array([[1,1,0,2,2]]);pred=np.array([[1,1,1,1,1]])\nts=[v for v in np.unique(truth) if v];ps=[v for v in np.unique(pred) if v]\nscores=np.array([[np.logical_and(truth==t,pred==p).sum()/np.logical_or(truth==t,pred==p).sum() for p in ps] for t in ts])\nrows,cols=linear_sum_assignment(np.where(scores>=.5,-1-scores/1000,0))\ntp=int((scores[rows,cols]>=.5).sum());fp=len(ps)-tp;fn=len(ts)-tp\nbinary_iou=np.logical_and(truth>0,pred>0).sum()/np.logical_or(truth>0,pred>0).sum()\nf1=2*tp/(2*tp+fp+fn) if 2*tp+fp+fn else 0.0\nprint({'tp':tp,'fp':fp,'fn':fn,'f1':f1,'foreground_pixel_iou':round(float(binary_iou),2),'biological_validated':False})",
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
        10
      ],
      "visual": [
        [
          "Foreground pixel IoU",
          "0.80"
        ],
        [
          "Object matching",
          "0 true positives"
        ],
        [
          "Scientific claim",
          "Not biologically validated"
        ]
      ],
      "output": "{'tp': 0, 'fp': 1, 'fn': 2, 'f1': 0.0, 'foreground_pixel_iou': 0.8, 'biological_validated': False}",
      "note": "A real benchmark requires verified independent annotation masks, locked groups and documented failure examples; this fixture is entirely synthetic."
    },
    {
      "goal": "A03-CAPSTONE",
      "title": "Independent transfer: find false splits and merges on unseen references",
      "say": "Return to the editor with a new pair of instance masks and a held-out biological-group table. Construct the object-IoU matrix, find a maximum-cardinality one-to-one matching, report TP, FP, FN, F1 and pixel IoU, and defend what the annotation type can establish.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "New references",
          "Different instance geometry"
        ],
        [
          "Evaluation",
          "One-to-one and locked groups"
        ],
        [
          "Evidence",
          "Failure cases and limits"
        ]
      ],
      "output": "",
      "note": "Do not copy capstone answers to independent Apply/Prove or delayed A03-REVIEW. Validation on held-out real annotations is a separate project outcome."
    }
  ]
}]);})();
