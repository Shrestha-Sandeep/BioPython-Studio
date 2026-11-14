// A00 research-led optional advanced lab tutorial. Invented teaching data; real local exit gate required.
"use strict";
(()=>{window.BioPythonAdvancedTutorials=Object.freeze([...(window.BioPythonAdvancedTutorials||[]),{
  "id": "a00-chapter",
  "chapter": "A00",
  "title": "Make a reproducible biology project",
  "short": "Local Python, biological units, source hashes and tests",
  "minutes": "14–18 min",
  "goals": [
    "A00-G01",
    "A00-G02",
    "A00-G03",
    "A00-G04",
    "A00-G05",
    "A00-CAPSTONE"
  ],
  "steps": [
    {
      "goal": "A00-G01",
      "title": "The destination: reproducible measurements from a small CSV",
      "say": "A research report should let another scientist identify precisely what source bytes were analyzed, how fields were grouped by animal, what code was used, and which checks passed. We will build this report from a tiny invented microscopy table, then identify which tasks must actually be repeated on your own computer.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Input",
          "Invented field-level CSV"
        ],
        [
          "Scientific unit",
          "Independent animal"
        ],
        [
          "Evidence",
          "Hashes, tests and commit"
        ]
      ],
      "output": "",
      "note": "The numbers and microscope labels are invented teaching records, not validated exopher or fluorescent-puncta measurements."
    },
    {
      "goal": "A00-G01",
      "title": "Your browser and your desktop run different Python",
      "say": "The exercises here run Python through Pyodide in the browser. A local terminal, a Jupyter kernel and this browser can be three different Python interpreters. Successful browser code cannot prove a working local installation.",
      "code": "import sys\nprint(bool(sys.executable))\nprint(sys.version_info.major)",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Browser",
          "Pyodide Python"
        ],
        [
          "Desktop",
          "Separate interpreter"
        ],
        [
          "Must check",
          "Exact sys.executable"
        ]
      ],
      "output": "True\n3",
      "note": "The second line checks Python 3, not which local executable is installed. Record sys.executable and dependency versions from the real desktop."
    },
    {
      "goal": "A00-G01",
      "title": "Inspect environment identity, not a notebook title",
      "say": "The value of sys.executable identifies a runtime path. Comparing sys.prefix to sys.base_prefix is a useful virtual-environment indicator on CPython, but only a local run can establish which interpreter was used for a saved result.",
      "code": "import sys\ninside_venv = sys.prefix != sys.base_prefix\nprint(type(inside_venv).__name__)",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "sys.executable",
          "Interpreter path"
        ],
        [
          "sys.prefix",
          "Current prefix"
        ],
        [
          "sys.base_prefix",
          "Base prefix"
        ]
      ],
      "output": "bool",
      "note": "The printed type is stable; the actual inside_venv value and executable location depend on the runtime. Do not invent a desktop result."
    },
    {
      "goal": "A00-G01",
      "title": "A project environment makes dependencies deliberate",
      "say": "On a desktop, create an isolated project environment and install dependencies with that interpreter. These are shell instructions to perform locally, not executable Python or commands that this tutorial has run.",
      "code": "# Local shell — not Python editor commands:\n# python3 -m venv .venv       (macOS/Linux)\n# py -m venv .venv            (Windows)\n# python -m pip install -r projects/advanced/requirements.txt\n# python -m pytest -q tests/test_advanced_image_audit.py",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Create",
          "A local .venv"
        ],
        [
          "Install",
          "With matching python -m pip"
        ],
        [
          "Verify",
          "Real tests on desktop"
        ]
      ],
      "output": "",
      "note": "Activation is optional if the interpreter inside .venv is invoked directly. The current browser page cannot observe your terminal or Git state."
    },
    {
      "goal": "A00-G02",
      "title": "Reject obvious path traversal before reading files",
      "say": "A source directory must not silently accept a name that escapes it. The first check catches slash-prefixed absolute paths and dot-dot traversals in an illustrative POSIX name list; it is not complete cross-platform or symlink security.",
      "code": "from pathlib import PurePosixPath\nnames=['fields.csv','../secret.csv','/tmp/raw.csv']\nbad=[n for n in names if PurePosixPath(n).is_absolute() or '..' in PurePosixPath(n).parts]\nprint(bad)",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Accept",
          "fields.csv"
        ],
        [
          "Reject",
          "../secret.csv"
        ],
        [
          "Reject",
          "/tmp/raw.csv"
        ]
      ],
      "output": "['../secret.csv', '/tmp/raw.csv']",
      "note": "String checks are only a teaching first pass. Windows drive/UNC paths and symlinks need platform-aware local handling."
    },
    {
      "goal": "A00-G02",
      "title": "Resolve the full local path and enforce containment",
      "say": "The security-sensitive check happens after resolving the candidate against the declared root. An apparently nearby path can still resolve to a sibling. Resolve before opening the file and check membership with Path.is_relative_to.",
      "code": "from pathlib import Path\nroot=Path('/work/raw').resolve()\ncandidate=(root/'../other.csv').resolve()\nprint(candidate.is_relative_to(root))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Declared root",
          "/work/raw"
        ],
        [
          "Requested",
          "../other.csv"
        ],
        [
          "Contained?",
          "False"
        ]
      ],
      "output": "False",
      "note": "A real program also needs to handle symlinks, actual file permissions and a trusted source directory. This toy prints a containment decision; it opens no file."
    },
    {
      "goal": "A00-G03",
      "title": "Four microscope fields are not four animals",
      "say": "In this synthetic experiment animal A was imaged in three fields and animal B in one. Counting table rows as independent biological replicates would inflate the sample size and misrepresent uncertainty.",
      "code": "rows=[('A',4),('A',6),('A',8),('B',10)]\nprint(len(rows),len({animal for animal,_ in rows}))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Image fields",
          "4"
        ],
        [
          "Biological animals",
          "2"
        ],
        [
          "Per-animal fields",
          "A: 3 · B: 1"
        ]
      ],
      "output": "4 2",
      "note": "Actual biological independence depends on experimental design: different fields, wells and animals need not be equivalent independent units."
    },
    {
      "goal": "A00-G03",
      "title": "A pure grouping function turns fields into subject means",
      "say": "A reusable function makes the grouping rule visible and testable. Store values by animal ID, then calculate one mean per animal without rewriting individual field measurements.",
      "code": "from collections import defaultdict\ndef animal_means(rows):\n    grouped=defaultdict(list)\n    for animal,signal in rows:\n        grouped[animal].append(signal)\n    return {a:sum(v)/len(v) for a,v in grouped.items()}\nprint(sorted(animal_means([('A',4),('A',6),('B',10)])))",
      "focus": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "visual": [
        [
          "Input",
          "IDs + field values"
        ],
        [
          "Operation",
          "Group by animal"
        ],
        [
          "Output",
          "One value per animal"
        ]
      ],
      "output": "['A', 'B']",
      "note": "Means summarize the selected quantity but do not correct batch effects, verify biological independence, or make ambiguous animal IDs trustworthy."
    },
    {
      "goal": "A00-G03",
      "title": "Predict two animal means before seeing the result",
      "say": "Use the four invented field measurements. Animal A has values four, six and eight, while animal B has ten. What is the mean for each animal, and how many independent animals are represented? Write your prediction before continuing.",
      "code": "rows=[('A',4),('A',6),('A',8),('B',10)]\nanimals=sorted({a for a,_ in rows})\nmeans={a:sum(v for k,v in rows if k==a)/sum(k==a for k,_ in rows) for a in animals}\nprint(means,len(animals))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "A fields",
          "4, 6, 8"
        ],
        [
          "B fields",
          "10"
        ],
        [
          "Means and n",
          "Withheld"
        ]
      ],
      "output": "",
      "note": "Do not treat the four field rows as the number of independent biological samples. The answer is withheld until the next scene.",
      "checkpoint": true
    },
    {
      "goal": "A00-G03",
      "title": "Reveal: two animal means and biological n of two",
      "say": "The first animal's values average to six, the second animal's single recorded field is ten, and only two biological animal IDs are present. The precision of a four-row field-level calculation cannot create more animals.",
      "code": "rows=[('A',4),('A',6),('A',8),('B',10)]\nanimals=sorted({a for a,_ in rows})\nmeans={a:sum(v for k,v in rows if k==a)/sum(k==a for k,_ in rows) for a in animals}\nprint(means,len(animals))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Animal A mean",
          "6.0"
        ],
        [
          "Animal B mean",
          "10.0"
        ],
        [
          "Biological n",
          "2"
        ]
      ],
      "output": "{'A': 6.0, 'B': 10.0} 2",
      "note": "This is an illustrative aggregation; a single field for animal B does not estimate within-animal spatial variation."
    },
    {
      "goal": "A00-G04",
      "title": "An equality boundary is a real scientific rule",
      "say": "A quality filter accepting scores greater than or equal to zero point eight must accept a field measured at exactly that value. Missing measurements should remain missing, rather than being assigned a false zero.",
      "code": "samples=[('F1',0.8),('F2',0.79),('F3',None)]\npassed=[name for name,score in samples if score is not None and score>=0.8]\nprint(passed)",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "F1: 0.80",
          "Pass"
        ],
        [
          "F2: 0.79",
          "Below cutoff"
        ],
        [
          "F3: None",
          "Missing, not zero"
        ]
      ],
      "output": "['F1']",
      "note": "The fixed cutoff is an invented QC rule, not a calibrated sharpness or segmentation-quality threshold."
    },
    {
      "goal": "A00-G04",
      "title": "Tests should include failures and changed inputs",
      "say": "A test suite should catch both a wrong boundary operator and missing data. The simple function is checked at the boundary, below the boundary and with a missing score.",
      "code": "def passes(score,minimum=0.8):\n    return score is not None and score>=minimum\nassert passes(0.8)\nassert not passes(0.79)\nassert not passes(None)\nprint('3 checks passed')",
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
          "Boundary equality",
          "Expected True"
        ],
        [
          "Below minimum",
          "Expected False"
        ],
        [
          "Missing measurement",
          "Expected False"
        ]
      ],
      "output": "3 checks passed",
      "note": "The browser demonstration does not run the native project's pytest suite. Independent local execution is required."
    },
    {
      "goal": "A00-G05",
      "title": "A filename cannot identify the bytes actually analyzed",
      "say": "Hashing the original input bytes gives a content fingerprint. Even a one-byte edit changes the SHA-256 value with overwhelming probability. We display only a short prefix for teaching.",
      "code": "import hashlib\nraw=b'F01,0.80\\n'\nprint(hashlib.sha256(raw).hexdigest()[:12])",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Source name",
          "fields.csv (not enough)"
        ],
        [
          "Hash target",
          "Exact byte sequence"
        ],
        [
          "SHA-256 prefix",
          "cb0ebabb0aa3"
        ]
      ],
      "output": "cb0ebabb0aa3",
      "note": "An SHA-256 hash proves equality of bytes across two copies if matched. It does not certify biological correctness, authenticity or calibration."
    },
    {
      "goal": "A00-G05",
      "title": "Canonical JSON avoids false configuration changes",
      "say": "Two dictionaries with the same settings may have a different insertion order. Sort keys and use consistent compact separators before hashing so that logically identical settings share the same config digest.",
      "code": "import json,hashlib\none={'z':1,'channel':0}\ntwo={'channel':0,'z':1}\ncanon=lambda v:json.dumps(v,sort_keys=True,separators=(',',':')).encode('utf-8')\nprint(canon(one)==canon(two))\nprint(hashlib.sha256(canon(one)).hexdigest()[:12])",
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
          "Parameter set A",
          "channel 0, z 1"
        ],
        [
          "Parameter set B",
          "z 1, channel 0"
        ],
        [
          "Canonical digest",
          "7ac419594dcc"
        ]
      ],
      "output": "True\n7ac419594dcc",
      "note": "Normalization is explicit for this small JSON configuration. It cannot hash arbitrary Python objects without a declared serialization schema."
    },
    {
      "goal": "A00-CAPSTONE",
      "title": "Capstone: a small auditable animal-level result",
      "say": "Combine parsing, grouping and source fingerprinting into a compact report. This Python snippet really computes the numerical values from invented raw bytes; it does not prove a local Git commit, validated acquisition metadata or a fresh environment.",
      "code": "from collections import defaultdict\nimport hashlib\nraw=b'A,4\\nA,6\\nB,10\\n'\ngroups=defaultdict(list)\nfor line in raw.decode().strip().splitlines():\n    a,v=line.split(',')\n    groups[a].append(float(v))\nreport={'fields':sum(map(len,groups.values())),\n        'biological_n':len(groups),\n        'animal_means':{a:sum(v)/len(v) for a,v in groups.items()},\n        'sha_prefix':hashlib.sha256(raw).hexdigest()[:12]}\nprint(report)",
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
        10,
        11
      ],
      "visual": [
        [
          "Research output",
          "Means by animal"
        ],
        [
          "Traceability",
          "Exact source fingerprint"
        ],
        [
          "Desktop evidence",
          "Environment, pytest, Git"
        ]
      ],
      "output": "{'fields': 3, 'biological_n': 2, 'animal_means': {'A': 5.0, 'B': 10.0}, 'sha_prefix': 'aa34f67e83d9'}",
      "note": "Run a genuine previously unseen CSV/TIFF through the local bridge; record interpreter and package versions, clean pytest, source-preserving audit and Git SHA. A tutorial completion flag cannot substitute."
    },
    {
      "goal": "A00-CAPSTONE",
      "title": "Independent transfer: replay on data you have not seen",
      "say": "Return to the editor and use a different synthetic CSV with unequal fields per animal, a deliberately unsafe path and a changed configuration. Write an auditable report and locally rerun it from a fresh checkout. Keep source bytes immutable and document any unresolved scientific assumptions.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "New source",
          "Different bytes and animals"
        ],
        [
          "Independent checks",
          "Path, grouping, cutoff, hash"
        ],
        [
          "Exit gate",
          "Real desktop replay"
        ]
      ],
      "output": "",
      "note": "Do not copy the solved example as a substitute for independent A00 Apply, Prove and delayed review. The separate A00-REVIEW should be done later without prompts."
    }
  ]
}]);})();
