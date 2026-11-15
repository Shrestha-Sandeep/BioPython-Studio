// A02 candidate masks, polarity, connectivity, watershed and sensitivity; invented pixels, real NumPy/scikit-image examples.
"use strict";
(()=>{window.BioPythonAdvancedTutorials=Object.freeze([...(window.BioPythonAdvancedTutorials||[]),{
  "id": "a02-chapter",
  "chapter": "A02",
  "title": "Segment candidate objects responsibly",
  "short": "Background, polarity, connected components and sensitivity",
  "minutes": "16–22 min",
  "goals": [
    "A02-G01",
    "A02-G02",
    "A02-G03",
    "A02-G04",
    "A02-G05",
    "A02-CAPSTONE"
  ],
  "steps": [
    {
      "goal": "A02-G01",
      "title": "The destination: candidate masks, not biological truth",
      "say": "A microscopy image analysis can transform one native plane into a background-corrected array, binary candidate mask, labeled regions and a parameter-sensitivity report. Each output is reproducible, but none identifies a biological object until it is checked against independent expert reference annotations.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Input",
          "Traceable image plane"
        ],
        [
          "Pipeline",
          "Subtract → mask → label"
        ],
        [
          "Result",
          "Unverified candidates"
        ]
      ],
      "output": "",
      "note": "Synthetic pixels throughout this tutorial; a visually attractive segmentation is not evidence for nuclei, exophers or accurate object detection."
    },
    {
      "goal": "A02-G01",
      "title": "Convert the original pixels to float before subtracting",
      "say": "The same source pixel can become a false bright object if you subtract background while keeping an unsigned integer type. Convert first, subtract the declared background and clip below zero before creating the mask.",
      "code": "import numpy as np\nraw=np.array([[1,5],[8,13]],dtype=np.uint16)\ncorrected=np.maximum(0,raw.astype(float)-4)\nprint(corrected.tolist())",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Native source",
          "1, 5, 8, 13"
        ],
        [
          "Background",
          "4"
        ],
        [
          "Corrected",
          "0, 1, 4, 9"
        ]
      ],
      "output": "[[0.0, 1.0], [4.0, 9.0]]",
      "note": "Background estimation depends on image structure and acquisition; a numerically safe correction does not establish a scientifically correct baseline."
    },
    {
      "goal": "A02-G01",
      "title": "A strict threshold creates only a candidate mask",
      "say": "After safe background correction, a strict cutoff of greater than three selects the pixels with corrected values four and nine. It does not establish how many biological objects these pixels represent.",
      "code": "import numpy as np\nraw=np.array([[1,5],[8,13]],dtype=np.uint16)\ncorrected=np.maximum(0,raw.astype(float)-4)\nmask=corrected>3\nprint(int(mask.sum()),mask.astype(int).tolist())",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Strict rule",
          "> 3"
        ],
        [
          "Passing pixels",
          "2"
        ],
        [
          "Mask",
          "[[0,0],[1,1]]"
        ]
      ],
      "output": "2 [[0, 0], [1, 1]]",
      "note": "The fixed threshold is a teaching fixture. Real scenes can vary in background, illumination and object intensity; threshold choice must be justified."
    },
    {
      "goal": "A02-G02",
      "title": "Bright foreground: measure the brighter-than-background regions",
      "say": "When structures are brighter than their surroundings, the simple synthetic polarity rule chooses intensity greater than a threshold. This selects two pixels in the invented two-by-two scene.",
      "code": "import numpy as np\nimage=np.array([[2,9],[1,10]],dtype=np.uint16)\nprint(int((image>5).sum()))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Foreground",
          "Bright on dark"
        ],
        [
          "Rule",
          "> 5"
        ],
        [
          "Selected",
          "2 candidate pixels"
        ]
      ],
      "output": "2",
      "note": "Bright on dark is an acquisition- and stain-dependent convention. It does not make the selected pixels biological objects."
    },
    {
      "goal": "A02-G02",
      "title": "Dark foreground requires the opposite comparison",
      "say": "Bright-field or other image modalities may show relevant features darker than their background. Reversing the threshold polarity changes which source pixels are selected, even though the same number may pass.",
      "code": "import numpy as np\nimage=np.array([[2,9],[1,10]],dtype=np.uint16)\nprint((image<5).astype(int).tolist())",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Foreground",
          "Dark on light"
        ],
        [
          "Rule",
          "< 5"
        ],
        [
          "Selected",
          "Top-left and bottom-left"
        ]
      ],
      "output": "[[1, 0], [1, 0]]",
      "note": "Polarity should be recorded and assessed from known imaging modality and representative controls, not inferred solely from mean brightness."
    },
    {
      "goal": "A02-G02",
      "title": "A bright image border is a heuristic, not proof of polarity",
      "say": "This course uses a documented starting heuristic: choose dark foreground when the median image border exceeds fifty-five percent of the expected digital range. The invented example chooses dark, but a field with bright edge artifacts could fool this rule.",
      "code": "import numpy as np\na=np.array([[240,250,240],[245,10,240],[240,235,240]])\nborder=np.r_[a[0],a[-1],a[1:-1,0],a[1:-1,-1]]\npolarity='dark' if np.median(border)>=.55*255 else 'bright'\nprint(polarity,float(np.median(border)))",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Median border",
          "240"
        ],
        [
          "55% of 255",
          "140.25"
        ],
        [
          "Heuristic",
          "Dark candidates"
        ]
      ],
      "output": "dark 240.0",
      "note": "A single border brightened by illumination or saturated artifacts could invert the result. Polarity is a hypothesis to verify against acquisition context."
    },
    {
      "goal": "A02-G03",
      "title": "Diagonal pixels form one object only with eight-connectivity",
      "say": "In a two-dimensional image, four-connectivity joins vertical and horizontal neighbors. Eight-connectivity also joins diagonal neighbors. The same two diagonal foreground pixels are two labels under the frozen A02 four-connected rule but one with eight-connectivity.",
      "code": "import numpy as np\nfrom skimage.measure import label\nmask=np.array([[1,0],[0,1]],dtype=bool)\nprint(label(mask,connectivity=1).max(),label(mask,connectivity=2).max())",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "4-connected",
          "2 regions"
        ],
        [
          "8-connected",
          "1 region"
        ],
        [
          "Biology",
          "Connectivity must be justified"
        ]
      ],
      "output": "2 1",
      "note": "Connectivity is a model choice, not a biological fact. Thin diagonal bridges can be noise, true topology or resolution-limited contact."
    },
    {
      "goal": "A02-G03",
      "title": "Size filters can erase actual tiny targets",
      "say": "A one-pixel connected component and a four-pixel component are both candidate regions. Keeping only areas of two pixels or more removes the singleton, but that discarded pixel could be a real small punctum.",
      "code": "import numpy as np\nfrom skimage.measure import label\nmask=np.array([[1,0,0,0],[0,0,1,1],[0,0,1,1],[0,0,0,0]],dtype=bool)\nlabels=label(mask,connectivity=1)\nareas=np.bincount(labels.ravel())[1:]\nprint(sorted(int(a) for a in areas if a>=2))",
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
          "Detected components",
          "1 px and 4 px"
        ],
        [
          "min_area",
          "2 px"
        ],
        [
          "Kept candidate area",
          "4 px"
        ]
      ],
      "output": "[4]",
      "note": "Do not tune a minimum-area threshold on final test annotations. A hard filter can destroy biologically relevant small objects."
    },
    {
      "goal": "A02-G03",
      "title": "Predict how many four-connected regions survive",
      "say": "This new binary grid has a two-pixel horizontal candidate, a solitary pixel, and a three-pixel connected candidate. With four-neighbor connectivity and minimum area two, predict both the surviving region count and the sorted areas before advancing.",
      "code": "import numpy as np\nfrom skimage.measure import label\nm=np.array([[1,1,0,0,1],[0,0,0,0,0],[0,0,1,1,0],[0,0,0,1,0]],dtype=bool)\nareas=np.bincount(label(m,connectivity=1).ravel())[1:]\nkept=sorted(int(x) for x in areas if x>=2)\nprint(kept,len(kept))",
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
          "Regions",
          "2 px, 1 px, 3 px"
        ],
        [
          "Filter",
          "minimum 2 px"
        ],
        [
          "Kept count",
          "Withheld"
        ]
      ],
      "output": "",
      "note": "The numerical prediction is hidden. Counting candidates under one parameter setting is not equivalent to identifying biological objects.",
      "checkpoint": true
    },
    {
      "goal": "A02-G03",
      "title": "Reveal: the small singleton disappears, two remain",
      "say": "The separate one-pixel candidate is excluded. The remaining components have areas two and three pixels, giving two surviving candidate regions. Their identity and biological relevance remain unknown.",
      "code": "import numpy as np\nfrom skimage.measure import label\nm=np.array([[1,1,0,0,1],[0,0,0,0,0],[0,0,1,1,0],[0,0,0,1,0]],dtype=bool)\nareas=np.bincount(label(m,connectivity=1).ravel())[1:]\nkept=sorted(int(x) for x in areas if x>=2)\nprint(kept,len(kept))",
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
          "Kept areas",
          "2, 3 px"
        ],
        [
          "Excluded",
          "1 px singleton"
        ],
        [
          "Remaining",
          "2 candidate regions"
        ]
      ],
      "output": "[2, 3] 2",
      "note": "An independent annotation review is needed to know whether excluding a small component was a good scientific decision."
    },
    {
      "goal": "A02-G04",
      "title": "Distance transform describes foreground depth",
      "say": "Within a binary candidate, a distance transform measures distance to the nearest background pixel. Deep interior pixels can help position watershed seeds, but plateaus or noise may produce inappropriate automatic markers.",
      "code": "import numpy as np\nfrom scipy.ndimage import distance_transform_edt\nmask=np.zeros((5,7),bool)\nmask[1:4,1:6]=True\nd=distance_transform_edt(mask)\nprint(d.shape,round(float(d.max()),1))",
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
          "Candidate",
          "One rectangular mask"
        ],
        [
          "Distance",
          "From background"
        ],
        [
          "Largest value",
          "2.0 pixels"
        ]
      ],
      "output": "(5, 7) 2.0",
      "note": "Distance transform uses pixel-space geometry; anisotropic pixels and 3D voxel sizes require explicit sampling parameters."
    },
    {
      "goal": "A02-G04",
      "title": "Two valid seeds split one connected foreground mask",
      "say": "A seeded watershed partitions a single connected foreground band from two explicit marker positions, producing two different candidate instance IDs without changing the total foreground area. The markers must be inside the candidate mask.",
      "code": "import numpy as np\nfrom scipy.ndimage import distance_transform_edt\nfrom skimage.segmentation import watershed\nmask=np.zeros((3,7),bool);mask[1,1:6]=True\nseeds=np.zeros_like(mask,dtype=np.int32);seeds[1,2]=1;seeds[1,4]=2\nlabels=watershed(-distance_transform_edt(mask),seeds,mask=mask)\nprint(sorted(np.unique(labels[labels>0]).tolist()),int((labels>0).sum()))",
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
          "Before watershed",
          "1 connected band"
        ],
        [
          "Seed markers",
          "2 inside band"
        ],
        [
          "After",
          "2 candidate IDs"
        ]
      ],
      "output": "[1, 2] 5",
      "note": "Two seed markers do not establish two real touching cells; too many seeds can create false splits."
    },
    {
      "goal": "A02-G04",
      "title": "One seed versus two seeds changes candidate object count",
      "say": "Keep the same foreground mask and change only the number of watershed seeds. This illustrates how a plausible mask can report one or two objects without any change to microscope pixels.",
      "code": "import numpy as np\nfrom scipy.ndimage import distance_transform_edt\nfrom skimage.segmentation import watershed\nm=np.zeros((3,7),bool);m[1,1:6]=True;d=distance_transform_edt(m)\na=np.zeros_like(m,dtype=int);a[1,2]=1\nb=a.copy();b[1,4]=2\nprint(watershed(-d,a,mask=m).max(),watershed(-d,b,mask=m).max())",
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
          "Same raw mask",
          "Five foreground pixels"
        ],
        [
          "One marker",
          "1 candidate"
        ],
        [
          "Two markers",
          "2 candidates"
        ]
      ],
      "output": "1 2",
      "note": "Both segmentations can look credible. Validate marker policy using independent object annotations; a pretty split is not accuracy."
    },
    {
      "goal": "A02-G05",
      "title": "Compare parameter masks using foreground overlap",
      "say": "Suppose a threshold change moves one pixel out of the mask and another into it. The two masks overlap on two of four union pixels, for an IoU of one half. Two out of six total pixels change.",
      "code": "import numpy as np\na=np.array([[1,1,0],[0,1,0]],dtype=bool)\nb=np.array([[1,0,0],[0,1,1]],dtype=bool)\niou=np.logical_and(a,b).sum()/np.logical_or(a,b).sum()\nchange=np.logical_xor(a,b).mean()\nprint(round(float(iou),3),round(float(change),3))",
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
          "Intersection/union",
          "2 / 4"
        ],
        [
          "Mask IoU",
          "0.5"
        ],
        [
          "Changed pixels",
          "2 / 6"
        ]
      ],
      "output": "0.5 0.333",
      "note": "This measures agreement between two algorithm outputs, not overlap with independent reference annotations; it cannot certify accuracy."
    },
    {
      "goal": "A02-G05",
      "title": "A perfectly stable mask can still be consistently wrong",
      "say": "An algorithm might produce exactly the same mask under two parameter choices, yielding IoU equal to one. Without an independent reference, that stability says nothing about whether the mask captures actual biological objects.",
      "code": "import numpy as np\nm=np.array([[1,0],[1,0]],dtype=bool)\niou=np.logical_and(m,m).sum()/np.logical_or(m,m).sum()\nvalidated=False\nprint(round(float(iou),1),validated)",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Mask agreement",
          "1.0"
        ],
        [
          "Ground truth",
          "Not supplied"
        ],
        [
          "Validated accuracy",
          "False"
        ]
      ],
      "output": "1.0 False",
      "note": "Stability, precision, recall and biological validity are different claims. A03 will compare candidate instances to independently annotated objects."
    },
    {
      "goal": "A02-CAPSTONE",
      "title": "Capstone: an auditable classical candidate report",
      "say": "Use a strict fixed threshold, four-neighbor connected-component labels and an explicit minimum size to obtain a small candidate report. Preserve areas in pixels and state that the candidate labels are not biologically validated.",
      "code": "import numpy as np\nfrom skimage.measure import label\nimage=np.array([[9,9,0,0],[0,0,0,6],[0,6,6,6],[0,0,0,0]])\nthreshold=5;min_area=2\nlab=label(image>threshold,connectivity=1)\nareas=sorted(int(a) for a in np.bincount(lab.ravel())[1:] if a>=min_area)\nprint({'candidate_count':len(areas),'areas_px':areas,'validated':False})",
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
          "Source",
          "Invented 4×4 pixels"
        ],
        [
          "Parameters",
          "threshold 5, min_area 2"
        ],
        [
          "Result",
          "Candidate report, not truth"
        ]
      ],
      "output": "{'candidate_count': 2, 'areas_px': [2, 4], 'validated': False}",
      "note": "For real data, run A02's local TIFF pipeline and compare parameter variants, source hashes and a failure gallery; this short example is not validation."
    },
    {
      "goal": "A02-CAPSTONE",
      "title": "Independent transfer: explain changing counts and candidate errors",
      "say": "Return to the editor with a different two-dimensional image. Decide bright versus dark foreground, background policy, four-neighbor connectivity and watershed seeds; compare at least three variants and document which objects might be split, merged or erased.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "New image",
          "Different intensities and polarity"
        ],
        [
          "Sensitivity",
          "At least 3 fixed parameter choices"
        ],
        [
          "Validation",
          "Separate annotation-based A03"
        ]
      ],
      "output": "",
      "note": "Apply, Prove and delayed A02-REVIEW remain independent and unsolved. Never treat one numeric candidate count as scientific object accuracy."
    }
  ]
}]);})();
