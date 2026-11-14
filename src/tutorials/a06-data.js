// A06 batch source provenance, manifest and true independent biological-unit tutorial.
"use strict";
(()=>{window.BioPythonAdvancedTutorials=Object.freeze([...(window.BioPythonAdvancedTutorials||[]),{
  "id": "a06-chapter",
  "chapter": "A06",
  "title": "Build a reproducible TIFF batch workflow",
  "short": "Pure processing, axis safety, manifest preflight and source hashes",
  "minutes": "18–24 min",
  "goals": [
    "A06-G01",
    "A06-G02",
    "A06-G03",
    "A06-G04",
    "A06-G05",
    "A06-G06",
    "A06-CAPSTONE"
  ],
  "steps": [
    {
      "goal": "A06-G01",
      "title": "Destination: several native TIFFs become one auditable analysis report",
      "say": "The full research workflow takes a manifest of original microscope sources, validates image metadata and IDs, applies one declared analysis method per field, and exports labelled candidate masks plus measurements grouped by real biological subjects. A repeatable result requires source and configuration identity.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Original inputs",
          "Native TIFF plus manifest"
        ],
        [
          "Processing",
          "Source-preserving per-field"
        ],
        [
          "Export",
          "Labels, hashes and animal CSV"
        ]
      ],
      "output": "",
      "note": "A scientifically interpretable batch still requires independent annotation and validated biological groups; this tutorial uses synthetic inputs only."
    },
    {
      "goal": "A06-G01",
      "title": "Separate a pure numerical operation from reading files",
      "say": "A pure function can be tested on a tiny array without the microscope, GUI or file system. Convert from uint16 before subtracting background and count strictly greater-than-threshold candidates.",
      "code": "import numpy as np\nsource=np.array([1,5,10],dtype=np.uint16)\ncorrected=np.maximum(0,source.astype(float)-4)\nprint(corrected.tolist(),int((corrected>2).sum()))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Native source",
          "1, 5, 10"
        ],
        [
          "Corrected float",
          "0, 1, 6"
        ],
        [
          "Candidate pixels",
          "1"
        ]
      ],
      "output": "[0.0, 1.0, 6.0] 1",
      "note": "This numeric candidate-pixel count is not a cell or exopher count; no source original is modified."
    },
    {
      "goal": "A06-G01",
      "title": "A reusable function handles changed inputs without mutable state",
      "say": "The same transformation is called twice with different input measurements. A test can assert both outputs from scratch rather than depending on stale notebook variables or manually selected images.",
      "code": "def count(pixels,background,threshold):\n    corrected=[max(0,float(x)-background) for x in pixels]\n    return sum(x>threshold for x in corrected)\nprint(count([1,5,10],4,2),count([1,2,3],0,1))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Dataset 1",
          "1 candidate pixel"
        ],
        [
          "Dataset 2",
          "2 candidate pixels"
        ],
        [
          "Pure transform",
          "No hidden state"
        ]
      ],
      "output": "1 2",
      "note": "Use native source bytes and explicit units when applying this to images. Changed-output software correctness alone does not establish segmentation validity."
    },
    {
      "goal": "A06-G02",
      "title": "A five-axis stack requires named dimension metadata",
      "say": "An image with declared TCZYX dimensions has time, channels, Z, rows and columns. The source shape describes the data, but the axis string is needed to identify which dimensions must be selected.",
      "code": "axes='TCZYX';shape=(2,3,2,4,5)\nprint(shape[axes.index('Y')],shape[axes.index('X')])",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Dimensions",
          "T2 C3 Z2 Y4 X5"
        ],
        [
          "Spatial result",
          "4 rows × 5 columns"
        ],
        [
          "Must choose",
          "T, C and Z"
        ]
      ],
      "output": "4 5",
      "note": "Never guess axes from array shape alone; the actual TIFF series and accompanying metadata must be checked."
    },
    {
      "goal": "A06-G02",
      "title": "Refuse to analyze multiple unspecified channels or planes",
      "say": "A multi-channel, multi-time, multi-Z image is ambiguous when no selectors are supplied. The preflight checker should identify every unselected non-singleton axis instead of silently choosing index zero.",
      "code": "axes='TCZYX';shape=(2,3,2,4,5);selection={}\nmissing=sorted(a for a,n in zip(axes,shape) if a in 'TCZ' and n>1 and a not in selection)\nprint(missing)",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Ambiguous dimensions",
          "T, C, Z"
        ],
        [
          "Selected",
          "None"
        ],
        [
          "Outcome",
          "Reject batch"
        ]
      ],
      "output": "['C', 'T', 'Z']",
      "note": "A program must reject unsupported axes and invalid index bounds as well, not infer a microscope acquisition order."
    },
    {
      "goal": "A06-G02",
      "title": "Explicit selectors yield one declared YX plane",
      "say": "When T1, C2 and Z0 are explicitly selected on a synthetic stack, only the Y and X dimensions remain. Verify shape and first selected pixel to catch accidental channel swapping.",
      "code": "import numpy as np\naxes='TCZYX';a=np.arange(240,dtype=np.uint16).reshape(2,3,2,4,5)\nchosen={'T':1,'C':2,'Z':0}\nplane=a[tuple(chosen.get(x,slice(None)) for x in axes)]\nprint(plane.shape,int(plane[0,0]))",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Chosen axes",
          "T1, C2, Z0"
        ],
        [
          "YX",
          "4 × 5"
        ],
        [
          "First pixel",
          "200"
        ]
      ],
      "output": "(4, 5) 200",
      "note": "This is a declared synthetic TCZYX array; the native local A06 program must independently inspect and enforce original image-series axes."
    },
    {
      "goal": "A06-G03",
      "title": "A repeated image ID makes a manifest ambiguous",
      "say": "A single ID cannot refer reliably to two different image sources. Detect duplicate image identifiers during preflight before creating any output folder or overwriting a prior measurement.",
      "code": "ids=['F1','F2','F2']\nseen=set();duplicate=set()\nfor item in ids:\n    if item in seen:duplicate.add(item)\n    seen.add(item)\nprint(sorted(duplicate))",
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
          "IDs",
          "F1, F2, F2"
        ],
        [
          "Duplicated",
          "F2"
        ],
        [
          "Decision",
          "Do not run"
        ]
      ],
      "output": "['F2']",
      "note": "A duplicate ID may be a genuine replicate with incorrect metadata; never repair it by renaming silently without source traceability."
    },
    {
      "goal": "A06-G03",
      "title": "Missing original TIFFs must be reported, not skipped",
      "say": "A manifest can name source F3 even if its file was not supplied. Skipping missing images would produce a deceptively complete table, so the batch should refuse the run with a specific missing-source error.",
      "code": "rows=[('F1',True),('F2',True),('F3',False)]\nprint(sorted(ident for ident,exists in rows if not exists))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Declared images",
          "F1, F2, F3"
        ],
        [
          "Source absent",
          "F3"
        ],
        [
          "Safe result",
          "Preflight failure"
        ]
      ],
      "output": "['F3']",
      "note": "A Boolean exists flag is a synthetic exercise; local code must check actual file existence, allowed root paths and source TIFF decoding."
    },
    {
      "goal": "A06-G03",
      "title": "Predict whether this batch can begin safely",
      "say": "An invented manifest contains three declared field records, a repeated field identifier and a source file that is absent. Inspect the rows, decide whether the batch may start, and predict the reason codes before proceeding.",
      "code": "rows=[('F1',True),('F2',True),('F2',True),('F3',False)]\nids=[x for x,_ in rows]\ndup=sorted({x for x in ids if ids.count(x)>1})\nmissing=sorted({x for x,exists in rows if not exists})\nprint({'duplicates':dup,'missing_sources':missing,'can_start':not(dup or missing)})",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Rows",
          "F1, F2, F2, F3"
        ],
        [
          "One file",
          "Missing"
        ],
        [
          "Can start?",
          "Withheld"
        ]
      ],
      "output": "",
      "note": "The safety decision is intentionally hidden until the next scene. Source integrity and a complete manifest matter more than producing a table.",
      "checkpoint": true
    },
    {
      "goal": "A06-G03",
      "title": "Reveal: reject duplicated IDs and absent sources",
      "say": "The duplicate ID F2 and missing source F3 are both logged, and can_start is false. A fail-closed preflight is a success for research integrity, even when it produces no segmentation output.",
      "code": "rows=[('F1',True),('F2',True),('F2',True),('F3',False)]\nids=[x for x,_ in rows]\ndup=sorted({x for x in ids if ids.count(x)>1})\nmissing=sorted({x for x,exists in rows if not exists})\nprint({'duplicates':dup,'missing_sources':missing,'can_start':not(dup or missing)})",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Duplicate image",
          "F2"
        ],
        [
          "Missing source",
          "F3"
        ],
        [
          "Can start",
          "False"
        ]
      ],
      "output": "{'duplicates': ['F2'], 'missing_sources': ['F3'], 'can_start': False}",
      "note": "A production batch must also reject invalid group assignments, path escapes, unsafe output roots and ambiguous channels before processing."
    },
    {
      "goal": "A06-G04",
      "title": "Hash the original image bytes, not a preview filename",
      "say": "A content fingerprint identifies a precise byte sequence. Even a single-byte change usually yields a different SHA-256. Both original hashes should be stored alongside the image IDs in the batch manifest.",
      "code": "import hashlib\none=b'F01-original-tiff'\ntwo=one+b'!'\nprint(len(hashlib.sha256(one).hexdigest()),hashlib.sha256(one).digest()!=hashlib.sha256(two).digest())",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Digest size",
          "64 hexadecimal characters"
        ],
        [
          "Modified source",
          "Different hash"
        ],
        [
          "Proof",
          "Byte identity only"
        ]
      ],
      "output": "64 True",
      "note": "Hash equality does not verify correct microscopy axes, calibration, source consent or scientific validity."
    },
    {
      "goal": "A06-G04",
      "title": "Configuration identity and environment versions are separate evidence",
      "say": "Canonical JSON makes a fixed segmentation policy hashable regardless of dictionary insertion order. Record package versions independently: the same config and source may behave differently across software environments.",
      "code": "import hashlib,json\ncfg={'threshold':5,'background':2}\nother={'background':2,'threshold':5}\nencode=lambda d:json.dumps(d,sort_keys=True,separators=(',',':')).encode()\nprint(encode(cfg)==encode(other),len(hashlib.sha256(encode(cfg)).hexdigest()))",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Parameters",
          "Threshold and background"
        ],
        [
          "Canonical JSON",
          "Independent of key order"
        ],
        [
          "Environment",
          "Must also be recorded"
        ]
      ],
      "output": "True 64",
      "note": "A fixed configuration hash is not a substitute for a documented interpreter, package versions and real input source hashes."
    },
    {
      "goal": "A06-G05",
      "title": "A threshold boundary deserves an explicit regression test",
      "say": "The rule specifies pixel values strictly greater than five. An implementation mistakenly changed to greater-than-or-equal would count the boundary pixel and alter downstream candidate counts.",
      "code": "pixels=[4,5,6]\nexpected=sum(x>5 for x in pixels)\nwrong=sum(x>=5 for x in pixels)\nprint(expected,wrong,expected!=wrong)",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Rule",
          "Strictly > 5"
        ],
        [
          "Correct count",
          "1"
        ],
        [
          "Regression",
          ">= gives 2"
        ]
      ],
      "output": "1 2 True",
      "note": "A green regression test demonstrates adherence to a declared numeric rule, not that a threshold is scientifically appropriate for any tissue."
    },
    {
      "goal": "A06-G05",
      "title": "Deliberately test invalid input, not just valid images",
      "say": "A missing threshold or negative size limit should trigger a clear error before analysis. Here a tiny validator detects a negative area setting and refuses to proceed.",
      "code": "def valid_min_area(x):\n    if not isinstance(x,int) or x<1:raise ValueError('min_area')\n    return x\ntry:valid_min_area(0)\nexcept ValueError as e:print(type(e).__name__,str(e))",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Input",
          "min_area = 0"
        ],
        [
          "Check",
          "At least 1 pixel"
        ],
        [
          "Result",
          "ValueError"
        ]
      ],
      "output": "ValueError min_area",
      "note": "Real segmentation settings include connectivity, physical-unit uncertainty, masks, image dtype and configured output paths that require additional tests."
    },
    {
      "goal": "A06-G06",
      "title": "Compare source, configuration and result fingerprints across runs",
      "say": "A run is not equivalent to a previous run if its parameters changed, even when the source hash and displayed output happen to match. Report every mismatching manifest field explicitly.",
      "code": "first={'source_hash':'aaa','config_hash':'bbb','output_hash':'ccc'}\nsecond={'source_hash':'aaa','config_hash':'other','output_hash':'ccc'}\ndifference=sorted(k for k in first if first[k]!=second[k])\nprint(difference,len(difference)==0)",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Source hash",
          "Equal"
        ],
        [
          "Config hash",
          "Different"
        ],
        [
          "Exact replay?",
          "No"
        ]
      ],
      "output": "['config_hash'] False",
      "note": "Equal output bytes under altered settings do not establish analysis-procedure equivalence; environment and source lineage still matter."
    },
    {
      "goal": "A06-G06",
      "title": "Identical numbers can conceal a different software environment",
      "say": "Two runs produce the same value but report different package-version identifiers. The output matches, yet a complete reproducibility report must disclose the changed environment.",
      "code": "one={'result':3,'environment':'python-3.12'}\ntwo={'result':3,'environment':'python-3.13'}\nprint(one['result']==two['result'],one['environment']==two['environment'])",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Output",
          "Same 3"
        ],
        [
          "Environment",
          "Version changed"
        ],
        [
          "Interpretation",
          "Not identical setup"
        ]
      ],
      "output": "True False",
      "note": "A changed environment is not necessarily an invalid output, but without details the user cannot confidently reproduce or interpret exact computational equivalence."
    },
    {
      "goal": "A06-CAPSTONE",
      "title": "Capstone: deterministic candidate counts with animal hierarchy",
      "say": "A tiny synthetic batch exports each field's thresholded pixel count and the mean candidate pixels for each parent animal. A single worm's multiple images contribute to one animal-level mean, not multiple independent samples.",
      "code": "fields=[('F1','A',[0,8]),('F2','A',[9,9]),('F3','B',[1,4])]\ncounts={field:sum(v>5 for v in pixels) for field,animal,pixels in fields}\nanimals=sorted({animal for _,animal,_ in fields})\nmeans={a:sum(counts[f] for f,x,_ in fields if x==a)/sum(x==a for _,x,_ in fields) for a in animals}\nprint({'field_counts':counts,'animal_means':means,'source_fields':len(fields),'biological_n':len(animals),'candidate_only':True})",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Image fields",
          "F1, F2, F3"
        ],
        [
          "Animal A",
          "Two fields"
        ],
        [
          "Interpretation",
          "Candidate only"
        ]
      ],
      "output": "{'field_counts': {'F1': 1, 'F2': 2, 'F3': 0}, 'animal_means': {'A': 1.5, 'B': 0.0}, 'source_fields': 3, 'biological_n': 2, 'candidate_only': True}",
      "note": "The batch output is a candidate-pixel fixture, not verified object counts; the real A06 CLI includes TIFF reading, source hashes, exclusion logs and failure markers."
    },
    {
      "goal": "A06-CAPSTONE",
      "title": "Independent transfer: reproduce a new original TIFF batch",
      "say": "Apply the workflow to a genuinely new batch of at least two original TIFFs with explicit channel selection, a complete manifest and a new output directory. Verify exact source hashes before and after, record environment versions and inspect failure cases.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "New original sources",
          "At least 2 TIFFs"
        ],
        [
          "QA evidence",
          "Manifest + hashes + output"
        ],
        [
          "Scientific gate",
          "Annotation and human review"
        ]
      ],
      "output": "",
      "note": "The independent A06-REVIEW and Prove tasks stay unanswered. The real local source-safe CLI and clean-checkout rerun are required for mastery."
    }
  ]
}]);})();
