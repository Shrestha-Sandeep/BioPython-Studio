// A07 7-gate unfamiliar-data research capstone primer; no fabricated scientific validation.
"use strict";
(()=>{window.BioPythonAdvancedTutorials=Object.freeze([...(window.BioPythonAdvancedTutorials||[]),{
  "id": "a07-chapter",
  "chapter": "A07",
  "title": "Defend an independent bioimage research result",
  "short": "Real-source evidence, annotations, holdout, errors and GO/NO-GO",
  "minutes": "18–24 min",
  "goals": [
    "A07-G01",
    "A07-G02",
    "A07-G03",
    "A07-G04",
    "A07-G05",
    "A07-G06",
    "A07-G07",
    "A07-CAPSTONE"
  ],
  "steps": [
    {
      "goal": "A07-G01",
      "title": "The final destination: defend a real microscope research result",
      "say": "A research-ready image-analysis workflow must answer a biological question, audit original images and annotations, reserve truly independent subjects for evaluation, quantify failures, reproduce the output from scratch and explain uncertainty. The final decision may legitimately be no-go instead of another algorithm optimization.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Biological question",
          "Prespecified target"
        ],
        [
          "Evidence packet",
          "Seven verified components"
        ],
        [
          "Decision",
          "Human-reviewed GO or NO-GO"
        ]
      ],
      "output": "",
      "note": "Every example here uses invented data. Passing the browser tutorial can never certify an unfamiliar real dataset or a human scientific conclusion."
    },
    {
      "goal": "A07-G01",
      "title": "Define the target and statistical unit before analyzing pixels",
      "say": "A complete plan names its target object, biological unit, primary endpoint and exclusions before image analysis begins. Python can check these required declarations but cannot determine whether the chosen biological definition is scientifically meaningful.",
      "code": "required=['target_definition','biological_unit','primary_endpoint','exclusion_rules']\nplan={'target_definition':'annotated nucleus','biological_unit':'animal','primary_endpoint':'object_F1','exclusion_rules':'focus'}\nmissing=sorted(k for k in required if not plan.get(k))\nprint(missing,len(missing)==0)",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Target",
          "Annotated nucleus"
        ],
        [
          "Primary endpoint",
          "Object F1"
        ],
        [
          "Missing items",
          "None"
        ]
      ],
      "output": "[] True",
      "note": "This toy plan checks presence only. Real A07 requires a biological question, controls, confounders, data/annotation rules and acceptance threshold recorded before holdout review."
    },
    {
      "goal": "A07-G01",
      "title": "An incomplete project plan must block annotation readiness",
      "say": "If a critical inclusion or exclusion rule is not specified, interpreting a later failure gallery can become subjective. Flag missing fields rather than silently filling them from observations already seen.",
      "code": "required=['target_definition','biological_unit','primary_endpoint','exclusion_rules']\nplan={'target_definition':'nucleus','biological_unit':'worm','primary_endpoint':'object_F1'}\nmissing=sorted(k for k in required if not plan.get(k))\nprint(missing,len(missing)==0)",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Target",
          "Defined"
        ],
        [
          "Exclusions",
          "Missing"
        ],
        [
          "Ready?",
          "False"
        ]
      ],
      "output": "['exclusion_rules'] False",
      "note": "A complete metadata schema is only the beginning of scientific planning, not a proof that the experiment or target labels are valid."
    },
    {
      "goal": "A07-G02",
      "title": "Audit original image axes, dtype and exact spatial shape",
      "say": "A native-looking TIFF could hold multiple times, channels and Z planes. Record the declared TCZYX axes and spatial YX shape instead of relying on a rendered preview or guessing which plane was quantified.",
      "code": "axes='TCZYX';shape=(2,3,2,4,5);dtype='uint16'\nyx=[shape[axes.index('Y')],shape[axes.index('X')]]\nother=[a for a in axes if a not in 'YX']\nprint(yx,other,dtype)",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Spatial plane",
          "4 × 5"
        ],
        [
          "Other axes",
          "T, C, Z"
        ],
        [
          "Pixel type",
          "uint16"
        ]
      ],
      "output": "[4, 5] ['T', 'C', 'Z'] uint16",
      "note": "A dataset axis declaration must be checked against actual source metadata and explicit C/Z/T selectors. This toy array is not a genuine acquisition."
    },
    {
      "goal": "A07-G02",
      "title": "Unverified scale stays unknown, even if the TIFF declares it",
      "say": "A physical pixel size written in metadata can be wrong or only assumed. The example refuses to report micrometres squared until the scale is independently verified for the real acquisition.",
      "code": "area_pixels=25;declared_scale=0.2;verified=False\narea_um2=area_pixels*declared_scale**2 if verified else None\nprint(area_um2)",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Declared scale",
          "0.2 µm/px"
        ],
        [
          "Verified",
          "No"
        ],
        [
          "Allowed physical area",
          "Unknown"
        ]
      ],
      "output": "None",
      "note": "Do not infer a physical area or molecular concentration from an unverified metadata tag or image pixel range."
    },
    {
      "goal": "A07-G03",
      "title": "Check what an annotation actually permits you to measure",
      "say": "An expert-reviewed instance mask can support object matching and pixel-level comparisons if the annotation rules are appropriate. A count-only reference provides no spatial boundary information.",
      "code": "annotation_type='pixel_masks';has_object_ids=True\npixel_iou=annotation_type=='pixel_masks'\nobject_matching=pixel_iou and has_object_ids\nprint(pixel_iou,object_matching)",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Reference",
          "Pixel instance masks"
        ],
        [
          "Pixel IoU",
          "Allowed"
        ],
        [
          "Object matching",
          "Allowed"
        ]
      ],
      "output": "True True",
      "note": "Even a valid annotation type does not prove high annotation quality, object definition agreement or representativeness of real microscopy."
    },
    {
      "goal": "A07-G03",
      "title": "Counts-only references cannot support object-matching claims",
      "say": "A dataset listing only a count per image may support count absolute error, but not pixel IoU or one-to-one true-positive matches. Decline to compute metrics that the provided annotation cannot support.",
      "code": "type_='counts';has_object_ids=False\nprint(type_=='pixel_masks',(type_=='pixel_masks' and has_object_ids),True)",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Counts available",
          "Yes"
        ],
        [
          "Pixel IoU",
          "Not allowed"
        ],
        [
          "Object matching",
          "Not allowed"
        ]
      ],
      "output": "False False True",
      "note": "An evaluator should reject unsupported metrics rather than manufacture instance masks from object counts."
    },
    {
      "goal": "A07-G04",
      "title": "Shared animals invalidate an independently held-out test",
      "say": "If image fields from the same biological subject appear in both development and final evaluation, the held-out result may be optimistic. Always compare biological group identifiers before computing any object accuracy.",
      "code": "records=[('A','development'),('B','development'),('A','holdout'),('C','holdout')]\ndev={g for g,s in records if s=='development'}\ntest={g for g,s in records if s=='holdout'}\nprint(sorted(dev&test))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Development",
          "A, B"
        ],
        [
          "Holdout",
          "A, C"
        ],
        [
          "Leaked group",
          "A"
        ]
      ],
      "output": "['A']",
      "note": "For applications meant to generalize across acquisition batches, entire batches may need to be held out rather than only animals."
    },
    {
      "goal": "A07-G04",
      "title": "Count held-out biological groups, not image filenames",
      "say": "A disjoint test set reserves all fields of different animals for final evaluation. It remains necessary to document how the randomization, batches and experimental conditions were distributed.",
      "code": "dev={'A','B'};test={'C','D'}\nprint(len(dev&test),len(dev),len(test))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Shared subjects",
          "0"
        ],
        [
          "Development n",
          "2 groups"
        ],
        [
          "Holdout n",
          "2 groups"
        ]
      ],
      "output": "0 2 2",
      "note": "An independent group split is necessary, not sufficient, for unbiased scientific performance; source/label selection and confounders still matter."
    },
    {
      "goal": "A07-G04",
      "title": "Predict leakage in a changed holdout assignment",
      "say": "A new synthetic manifest has two development animals and two held-out animals. Inspect the repeated group IDs and predict the leakage list and two independent group counts before revealing the exact result.",
      "code": "rows=[('A','development'),('B','development'),('B','holdout'),('C','holdout')]\ndev={g for g,s in rows if s=='development'}\ntest={g for g,s in rows if s=='holdout'}\nprint(sorted(dev&test),len(dev),len(test))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Development",
          "Animals A and B"
        ],
        [
          "Holdout",
          "Animals B and C"
        ],
        [
          "Leakage and n",
          "Withheld"
        ]
      ],
      "output": "",
      "note": "The numerical answer is withheld until the next step. An overlapping animal invalidates a genuinely unseen-animal performance claim.",
      "checkpoint": true
    },
    {
      "goal": "A07-G04",
      "title": "Reveal: animal B leaks between development and holdout",
      "say": "Animal B occurs in both partitions, so the overlap is nonempty even though there are two distinct group IDs on each side. This split must be rejected before interpreting model accuracy.",
      "code": "rows=[('A','development'),('B','development'),('B','holdout'),('C','holdout')]\ndev={g for g,s in rows if s=='development'}\ntest={g for g,s in rows if s=='holdout'}\nprint(sorted(dev&test),len(dev),len(test))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Leaked group",
          "B"
        ],
        [
          "Development n",
          "2"
        ],
        [
          "Holdout n",
          "2"
        ]
      ],
      "output": "['B'] 2 2",
      "note": "Repeated images, crops and augmented versions from the same specimen are not independent holdout examples."
    },
    {
      "goal": "A07-G05",
      "title": "Object micro-F1 must pool TP, FP and FN before dividing",
      "say": "Summing all true positives, false positives and false negatives across held-out images gives the pooled micro score. Averaging each image's individual F1 can give a different number and weighting.",
      "code": "tp=[2,1];fp=[1,2];fn=[1,0]\nT,F,N=sum(tp),sum(fp),sum(fn)\nf1=2*T/(2*T+F+N) if (2*T+F+N) else 0.0\nprint((T,F,N),round(f1,3))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Pooled TP",
          "3"
        ],
        [
          "Pooled FP/FN",
          "3 / 1"
        ],
        [
          "Micro object F1",
          "0.60"
        ]
      ],
      "output": "(3, 3, 1) 0.6",
      "note": "Even correct matching F1 depends on annotation quality, IoU cutoff, target definition, image sampling and representative failure cases."
    },
    {
      "goal": "A07-G05",
      "title": "Preserve per-image absolute count errors and failure categories",
      "say": "A global score can hide false splits, missed objects or overmerges. For each image compare predicted versus reference counts and describe representative failure cases from the actual source and annotations.",
      "code": "truth=[4,1,3];pred=[5,2,1]\nerrors=[abs(a-b) for a,b in zip(truth,pred)]\nprint(errors,round(sum(errors)/len(errors),2))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Image count errors",
          "1, 1, 2"
        ],
        [
          "Mean absolute error",
          "1.33"
        ],
        [
          "Review",
          "Merges / misses / false splits"
        ]
      ],
      "output": "[1, 1, 2] 1.33",
      "note": "Count error cannot substitute for spatial object matching; two wrong masks can have the same total count yet different error types."
    },
    {
      "goal": "A07-G06",
      "title": "Compare original source, configuration and output fingerprints",
      "say": "Exact computational replay includes the original source identity, parameter configuration, and output fingerprints. A changed output hash should trigger investigation even if a screenshot of the final mask looks identical.",
      "code": "expected={'source':'aaa','config':'bbb','output':'ccc'}\nobserved={'source':'aaa','config':'bbb','output':'changed'}\ndifference=sorted(k for k in expected if expected[k]!=observed[k])\nprint(difference,len(difference)==0)",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Source/config",
          "Matching"
        ],
        [
          "Output",
          "Changed hash"
        ],
        [
          "Exact match",
          "False"
        ]
      ],
      "output": "['output'] False",
      "note": "Hash comparison verifies byte identity only. It does not establish source quality, honest metadata or the scientific interpretation of labels."
    },
    {
      "goal": "A07-G06",
      "title": "Matching hashes do not prove you ran a fresh checkout",
      "say": "A report may contain matching source/config/output strings copied from an earlier run. Reproducibility requires an actual recorded clean-checkout execution, environment and command, checked independently.",
      "code": "hashes_match=True;fresh_checkout_executed=False\nready_for_review=hashes_match and fresh_checkout_executed\nprint(hashes_match,ready_for_review)",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Hash strings",
          "Match"
        ],
        [
          "Fresh execution",
          "Not performed"
        ],
        [
          "Ready?",
          "False"
        ]
      ],
      "output": "True False",
      "note": "A learner-entered Boolean claiming a fresh checkout is not verifiable evidence unless its execution record exists and is reviewed."
    },
    {
      "goal": "A07-G07",
      "title": "Stop when leakage or irreproducibility makes a result invalid",
      "say": "The decision gate should reject a contaminated holdout before discussing how high its object F1 looks. With leakage present, the correct recommendation is no-go even if annotations are insufficient and the numeric F1 is high.",
      "code": "leakage=True;reproducible=True;annotation_sufficient=False;object_f1=.99;minimum=.8\nif leakage or not reproducible:decision='NO_GO'\nelif not annotation_sufficient:decision='MORE_ANNOTATION'\nelif object_f1<minimum:decision='IMPROVE_METHOD'\nelse:decision='REVIEW'\nprint(decision,False)",
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
          "Group overlap",
          "Yes"
        ],
        [
          "Naive F1",
          "0.99"
        ],
        [
          "Decision",
          "NO_GO"
        ]
      ],
      "output": "NO_GO False",
      "note": "A high numerical score under invalid evaluation cannot rescue a method. Final scientific certification always requires human review."
    },
    {
      "goal": "A07-G07",
      "title": "Choose more annotation, improve the method or request expert review",
      "say": "When the experiment is reproducible and groups are disjoint, inadequate reference labels demand more annotation; adequate labels with low object F1 demand method improvement. A plausible score can proceed to review, not automatic validation.",
      "code": "def verdict(annotations,f1,minimum=.8):\n    if not annotations:return 'MORE_ANNOTATION'\n    if f1<minimum:return 'IMPROVE_METHOD'\n    return 'REVIEW'\nprint([verdict(False,.9),verdict(True,.4),verdict(True,.9)],False)",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "No proper labels",
          "MORE_ANNOTATION"
        ],
        [
          "Low object F1",
          "IMPROVE_METHOD"
        ],
        [
          "Meets software threshold",
          "REVIEW"
        ]
      ],
      "output": "['MORE_ANNOTATION', 'IMPROVE_METHOD', 'REVIEW'] False",
      "note": "A negative verdict can be a scientifically responsible result. The chosen numeric threshold must be justified for the biological application."
    },
    {
      "goal": "A07-CAPSTONE",
      "title": "Independent transfer: prepare a seven-file unfamiliar-data evidence packet",
      "say": "On a genuinely unfamiliar and appropriately annotated original dataset, define the biological target, audit native bytes, freeze group-disjoint holdout, quantify object errors, collect a failure gallery, rerun from a clean checkout and write a limitations memo. Human review determines whether conclusions are defensible.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Seven evidence files",
          "Plan, sources, splits, metrics, replay, failures, memo"
        ],
        [
          "Review decision",
          "GO / MORE ANNOTATION / NO-GO"
        ],
        [
          "Certification",
          "Always requires a human"
        ]
      ],
      "output": "",
      "note": "The local evidence checker verifies structural consistency only and deliberately refuses to certify research validity or human mastery. No solved independent Prove or delayed REVIEW is supplied."
    }
  ]
}]);})();
