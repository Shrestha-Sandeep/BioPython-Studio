// I10 — synthetic segmentation truth and frame-to-frame identity audit.
"use strict";
(() => {
window.BioPythonImagingTutorials=Object.freeze([...(window.BioPythonImagingTutorials||[]),{
  "id": "i10-chapter",
  "chapter": "I10",
  "title": "Validate tracking and segmentation",
  "short": "Annotation contracts, object F1 and motion identity",
  "minutes": "10–14 min",
  "goals": [
    "I10-G01",
    "I10-G02",
    "I10-G03",
    "I10-G04",
    "I10-G05",
    "I10-G06",
    "I10-CAPSTONE"
  ],
  "steps": [
    {
      "title": "The destination: test whether analysis is valid, not just visually plausible",
      "say": "An attractive candidate segmentation or a smoothly moving point can be scientifically wrong. Here we use synthetic masks, hand-defined reference labels and invented tracking positions to learn what validation metrics actually mean. The published microscopy image is only teaching context, not independently annotated reference truth.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Candidates",
          "Synthetic masks and detections"
        ],
        [
          "Validation",
          "Reference plus explicit matching"
        ],
        [
          "Limit",
          "Not genuine manual ground truth"
        ]
      ],
      "output": "",
      "note": "Published Witz/HPA rendered PNGs are not training masks, ground-truth annotations, calibrated coordinates or real tracking data.",
      "goal": "I10-G01",
      "preview": {
        "image": "otsu-nuclei-mask",
        "label": "Published Witz/HPA mask illustration; never used as independently annotated ground truth"
      }
    },
    {
      "title": "Displacement needs positions, scale and elapsed time",
      "say": "An object observed at row zero column zero and then row three column four has a five-pixel displacement. Given a fictional scale of zero point two micrometers per pixel and two seconds elapsed, the corresponding mean speed would be zero point five micrometers per second—but only if the two observations truly belong to one object.",
      "code": "import numpy as np\nbefore=np.array([0.,0.])\nafter=np.array([3.,4.])\ndistance_px=float(np.linalg.norm(after-before))\nspeed_um_s=distance_px*0.2/2.0\nprint(distance_px,round(speed_um_s,2))",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Displacement",
          "5 pixels"
        ],
        [
          "Synthetic scale",
          "0.2 µm/px"
        ],
        [
          "Speed",
          "0.5 µm/s"
        ]
      ],
      "output": "5.0 0.5",
      "note": "A plausible displacement is not a tracking identity; actual pixel scale, frame timing and object correspondence require evidence.",
      "goal": "I10-G01"
    },
    {
      "title": "Two detections are not automatically one trajectory",
      "say": "Euclidean displacement tells us how far two coordinates are apart, but the labels on successive frames may represent different biological objects. We therefore keep a separate correspondence-verification flag instead of calling an arbitrary pairing a tracked cell.",
      "code": "import numpy as np\npoint_t0=np.array([1.,1.])\npoint_t1=np.array([4.,5.])\nprint('Distance px:',float(np.linalg.norm(point_t1-point_t0)))\nprint('Identity verified:',False)",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Two observed points",
          "5 px apart"
        ],
        [
          "Known correspondence",
          "False"
        ],
        [
          "Consequence",
          "cannot infer motion"
        ]
      ],
      "output": "Distance px: 5.0\nIdentity verified: False",
      "note": "Identity across frames needs tracking validation; proximity alone cannot resolve swaps, loss of focus or biological divisions.",
      "goal": "I10-G01"
    },
    {
      "title": "Nearest neighbors require a distance margin",
      "say": "One previous point has two plausible successors at distances one and one point two pixels. The runner-up is only zero point two pixels farther away. When choosing a match, we should inspect the gap rather than simply taking the lowest number.",
      "code": "import numpy as np\nfrom scipy.spatial.distance import cdist\nprevious=np.array([[0.,0.]])\ncandidates=np.array([[1.,0.],[1.2,0.]])\ndist=np.sort(cdist(previous,candidates)[0])\nprint([round(float(v),1) for v in dist])\nprint(round(float(dist[1]-dist[0]),1))",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "Nearest",
          "1.0 px"
        ],
        [
          "Second",
          "1.2 px"
        ],
        [
          "Gap",
          "0.2 px"
        ]
      ],
      "output": "[1.0, 1.2]\n0.2",
      "note": "A small distance gap is an ambiguity warning, not evidence that either candidate is the same object.",
      "goal": "I10-G02"
    },
    {
      "title": "Near-ties should be flagged rather than concealed",
      "say": "Our declared ambiguity rule flags two nearest detections whose separation in distance is at most zero point five pixels. Both candidates can be legitimate, and the correct solution may require earlier frames, velocity constraints or a human reviewer.",
      "code": "import numpy as np\ndistance=np.array([1.2,1.0])\nnearest=np.sort(distance)\nambiguous=bool(nearest.size>=2 and nearest[1]-nearest[0]<=0.5)\nprint(ambiguous)\nprint(round(float(nearest[1]-nearest[0]),2))",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Near match",
          "1.0 px"
        ],
        [
          "Runner-up",
          "1.2 px"
        ],
        [
          "Ambiguous",
          "True"
        ]
      ],
      "output": "True\n0.2",
      "note": "A binary ambiguity heuristic is study-specific and cannot solve occlusion or out-of-plane motion.",
      "goal": "I10-G02"
    },
    {
      "title": "An annotation must identify its source and coordinate convention",
      "say": "A synthetic reference mask is useful for testing a formula only when its image ID, annotator, array shape and y-x coordinate order are recorded. A real annotation must additionally have a clear acquisition source and independent review policy.",
      "code": "import numpy as np\ntruth=np.array([[0,1,0],[0,1,0],[0,0,0]],bool)\naudit={'image_id':'SYN01','annotator':'training-author',\n       'shape':truth.shape,'axis_order':'yx','validated':False}\nprint(audit['image_id'],audit['shape'])\nprint(audit['validated'])",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Image ID",
          "SYN01"
        ],
        [
          "Axes",
          "yx, shape 3×3"
        ],
        [
          "Validated",
          "False"
        ]
      ],
      "output": "SYN01 (3, 3)\nFalse",
      "note": "Synthetic author-created truth is not independent human annotation of actual microscope data.",
      "goal": "I10-G03"
    },
    {
      "title": "Reject annotations outside the image bounds",
      "say": "A point with row three is outside a three-row image, whose last valid row is two. We validate coordinate dimensionality, integer type and bounds against the supplied mask before using annotations to score automated detections.",
      "code": "shape=(3,3)\npoints=[(0,1),(3,1)]\ndef valid(yx):\n    return (len(yx)==2 and all(isinstance(v,int) for v in yx)\n            and all(0<=v<limit for v,limit in zip(yx,shape)))\nprint([valid(p) for p in points])\nprint(sum(valid(p) for p in points))",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "Valid",
          "(0,1)"
        ],
        [
          "Outside",
          "(3,1)"
        ],
        [
          "Accepted",
          "1 of 2"
        ]
      ],
      "output": "[True, False]\n1",
      "note": "Out-of-bounds coordinates must be rejected; changing array shape or axis order changes annotation meaning.",
      "goal": "I10-G03"
    },
    {
      "title": "Background accuracy can hide total foreground failure",
      "say": "In a hundred-pixel image, one true object pixel and one predicted foreground pixel occupy different positions. The prediction gets ninety-eight background pixels correct, giving ninety-eight percent accuracy, yet pixel intersection-over-union is zero. Accuracy alone conceals the missed candidate.",
      "code": "import numpy as np\ntruth=np.zeros((10,10),bool);truth[1,1]=True\npred=np.zeros((10,10),bool);pred[1,2]=True\naccuracy=float(np.mean(truth==pred))\niou=float(np.logical_and(truth,pred).sum()/np.logical_or(truth,pred).sum())\nprint(round(accuracy,2),round(iou,2))",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Accuracy",
          "98%"
        ],
        [
          "Foreground IoU",
          "0"
        ],
        [
          "Problem",
          "mostly background"
        ]
      ],
      "output": "0.98 0.0",
      "note": "Even high foreground IoU would not prove object identity or biological segmentation on unseen annotated images.",
      "goal": "I10-G04"
    },
    {
      "title": "Predict the pixel-mask overlap before revealing it",
      "say": "The synthetic truth selects pixels at positions zero and one; the prediction selects positions zero and two. Count their intersection and union, then predict the IoU. The answer is withheld until the next scene.",
      "code": "import numpy as np\ntruth=np.array([1,1,0,0],bool)\npred=np.array([1,0,1,0],bool)\nunion=np.logical_or(truth,pred).sum()\nprint(round(float(np.logical_and(truth,pred).sum()/union),2))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Truth",
          "1,1,0,0"
        ],
        [
          "Prediction",
          "1,0,1,0"
        ],
        [
          "Predict",
          "IoU = ?"
        ]
      ],
      "output": "",
      "note": "Do not use the next scene's answer until you have worked through intersection and union yourself.",
      "goal": "I10-G04",
      "checkpoint": true
    },
    {
      "title": "Reveal: one intersection pixel, three union pixels",
      "say": "Truth and prediction share exactly one selected pixel but select three pixels in their union. The resulting pixel IoU is about zero point three three. For two entirely empty masks, our declared convention returns one, while explicitly noting there is no positive reference object.",
      "code": "import numpy as np\ntruth=np.array([1,1,0,0],bool)\npred=np.array([1,0,1,0],bool)\nintersection=int(np.logical_and(truth,pred).sum())\nunion=int(np.logical_or(truth,pred).sum())\nempty=np.zeros(3,bool)\nempty_iou=1.0 if not np.logical_or(empty,empty).any() else 0.0\nprint(intersection,union,round(intersection/union,2))\nprint(empty_iou)",
      "focus": [
        7,
        8,
        9
      ],
      "visual": [
        [
          "Intersection",
          "1 px"
        ],
        [
          "Union",
          "3 px"
        ],
        [
          "IoU",
          "0.33"
        ]
      ],
      "output": "1 3 0.33\n1.0",
      "note": "Both-empty IoU=1 is an explicit mathematical convention, not evidence that real objects were detected.",
      "goal": "I10-G04"
    },
    {
      "title": "One-to-one matching avoids reusing the same detection",
      "say": "A distance matrix between two reference coordinates and two new detections can be assigned globally using the Hungarian algorithm. Each candidate is used at most once, unlike naive independent nearest-neighbor choices that may select the same detection twice.",
      "code": "import numpy as np\nfrom scipy.spatial.distance import cdist\nfrom scipy.optimize import linear_sum_assignment\nbefore=np.array([[0.,0.],[0.,6.]])\nafter=np.array([[0.,1.],[0.,7.]])\ncost=cdist(before,after)\nrows,cols=linear_sum_assignment(cost)\nprint(rows.tolist(),cols.tolist())\nprint([float(cost[r,c]) for r,c in zip(rows,cols)])",
      "focus": [
        7,
        8,
        9
      ],
      "visual": [
        [
          "Reference",
          "two coordinates"
        ],
        [
          "Assignment",
          "0→0 and 1→1"
        ],
        [
          "Matched distances",
          "1 and 1 px"
        ]
      ],
      "output": "[0, 1] [0, 1]\n[1.0, 1.0]",
      "note": "A low-cost one-to-one assignment is a geometric hypothesis; the algorithm does not certify biological identity.",
      "goal": "I10-G05"
    },
    {
      "title": "A radius must reject implausible forced assignments",
      "say": "A minimum-cost assignment may pair a far-away detection simply because it has no other choice. Apply a declared radius of one pixel after Hungarian matching, and report unmatched references and detections separately instead of counting the distant pair as a true positive.",
      "code": "import numpy as np\nfrom scipy.spatial.distance import cdist\nfrom scipy.optimize import linear_sum_assignment\nbefore=np.array([[0.,0.],[0.,2.]])\nafter=np.array([[0.,0.2],[0.,8.]])\ndist=cdist(before,after)\nrows,cols=linear_sum_assignment(dist)\ntp=sum(float(dist[r,c])<=1 for r,c in zip(rows,cols))\nprint(tp,len(after)-tp,len(before)-tp)",
      "focus": [
        7,
        8,
        9
      ],
      "visual": [
        [
          "Within radius",
          "1 match"
        ],
        [
          "False positive",
          "1"
        ],
        [
          "False negative",
          "1"
        ]
      ],
      "output": "1 1 1",
      "note": "Radius rejection after assignment may be suboptimal compared with an unmatched-aware assignment model; state this implementation limit.",
      "goal": "I10-G05"
    },
    {
      "title": "Object-level precision and recall use true one-to-one counts",
      "say": "With two valid candidate-reference matches, one unmatched detection and one unmatched reference, object-level precision and recall both equal two-thirds. Dice or pixel IoU alone would not reveal this object-level mismatch structure.",
      "code": "tp,fp,fn=2,1,1\nprecision=tp/(tp+fp)\nrecall=tp/(tp+fn)\nf1=2*precision*recall/(precision+recall)\nprint(round(precision,2),round(recall,2),round(f1,2))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "TP",
          "2"
        ],
        [
          "FP and FN",
          "1 each"
        ],
        [
          "Object F1",
          "0.67"
        ]
      ],
      "output": "0.67 0.67 0.67",
      "note": "Object-count F1 depends on explicit matching criteria and credible reference annotations.",
      "goal": "I10-G05"
    },
    {
      "title": "Perturb thresholds instead of reporting only the best result",
      "say": "One small synthetic image has true positives at values five, seven and ten. Thresholding above four captures all three, above six loses one and above eight loses two. Report the entire sensitivity series rather than picking the one threshold with the most flattering IoU.",
      "code": "import numpy as np\nimage=np.array([0,5,7,10])\ntruth=np.array([0,1,1,1],bool)\niou=[]\nfor t in (4,6,8):\n    pred=image>t\n    union=int(np.logical_or(pred,truth).sum())\n    iou.append(round(float(np.logical_and(pred,truth).sum()/union),2))\nprint(iou)",
      "focus": [
        7,
        8,
        9
      ],
      "visual": [
        [
          "Threshold 4",
          "IoU 1.0"
        ],
        [
          "Threshold 6",
          "IoU 0.67"
        ],
        [
          "Threshold 8",
          "IoU 0.33"
        ]
      ],
      "output": "[1.0, 0.67, 0.33]",
      "note": "Selecting a threshold using the same reference used for evaluation inflates apparent performance; hold out independent images.",
      "goal": "I10-G06"
    },
    {
      "title": "A single corner artifact changes the score",
      "say": "A synthetic image contains a true candidate in its center and a spurious bright corner. Thresholding above five selects both, producing IoU one-half against the authored truth. Removing the corner in a separate copy changes the score; the source remains unmodified.",
      "code": "import numpy as np\nimage=np.zeros((3,3),int);image[1,1]=8;image[0,0]=10\ntruth=np.zeros((3,3),bool);truth[1,1]=True\ndef iou(mask):\n    return float(np.logical_and(mask,truth).sum()/np.logical_or(mask,truth).sum())\ncleaned=image.copy();cleaned[0,0]=0\nprint(round(iou(image>5),2),round(iou(cleaned>5),2))\nprint(bool(image[0,0]==10))",
      "focus": [
        6,
        7,
        8
      ],
      "visual": [
        [
          "Original",
          "IoU 0.5"
        ],
        [
          "Modified copy",
          "IoU 1.0"
        ],
        [
          "Source",
          "unchanged"
        ]
      ],
      "output": "0.5 1.0\nTrue",
      "note": "Removing an artifact using knowledge of a test reference would leak evaluation information; in real work, define a predeclared cleanup rule.",
      "goal": "I10-G06"
    },
    {
      "title": "Capstone: produce an auditable synthetic validation report",
      "say": "Combine explicit pixel-mask IoU with one-to-one point matching and a declared fictional speed calibration. A separate reference mask produces an IoU of one-half, and two unambiguous paired synthetic positions each move one pixel. Preserve inputs and label the reference and correspondence unverified.",
      "code": "import numpy as np\nfrom scipy.spatial.distance import cdist\nfrom scipy.optimize import linear_sum_assignment\ntruth=np.array([[1,0,0],[0,0,0]],bool)\npred=np.array([[1,1,0],[0,0,0]],bool)\nbefore=np.array([[0.,0.],[0.,6.]])\nafter=np.array([[0.,1.],[0.,7.]])\noriginal=pred.copy()\niou=float(np.logical_and(truth,pred).sum()/np.logical_or(truth,pred).sum())\ncost=cdist(before,after)\nrows,cols=linear_sum_assignment(cost)\nspeeds=[float(cost[i,j])*0.2/2 for i,j in zip(rows,cols)]\nprint('Pixel IoU:',round(iou,2))\nprint('Mean speed:',round(float(np.mean(speeds)),2),'um/s')\nprint('Source preserved:',bool(np.array_equal(pred,original)),'Validated:',False)",
      "focus": [
        13,
        14,
        15
      ],
      "visual": [
        [
          "Pixel IoU",
          "0.5"
        ],
        [
          "Speed",
          "0.1 µm/s synthetic"
        ],
        [
          "Validated",
          "False"
        ]
      ],
      "output": "Pixel IoU: 0.5\nMean speed: 0.1 um/s\nSource preserved: True Validated: False",
      "note": "The authored synthetic truth and coordinate correspondences are not independent experimental or biological validation.",
      "goal": "I10-CAPSTONE"
    },
    {
      "title": "Report the limitations before any biological conclusion",
      "say": "A reproducible candidate score is valuable only with its assumptions. State the source and annotation contract, matching radius, threshold policy, calibration, frame timing and potential identity swaps before anyone calls the output validated cell tracking.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Audit",
          "annotations and parameters"
        ],
        [
          "Check",
          "identities and biological units"
        ],
        [
          "Claim",
          "no validated biology yet"
        ]
      ],
      "output": "",
      "note": "Real scientific validation requires held-out manual annotation, agreement and calibration, not simply a passing exercise.",
      "goal": "I10-CAPSTONE"
    },
    {
      "title": "Independent transfer: challenge a new synthetic segmentation",
      "say": "Return to the Python editor with a different mask, reference annotation and two sets of frame coordinates. Include one ambiguous near-tie and one unmatched object. Calculate pixel IoU, one-to-one TP/FP/FN and speed only for credible correspondences; document every rejected case.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "New input",
          "masks, positions and elapsed time"
        ],
        [
          "Prove",
          "IoU, one-to-one and ambiguity"
        ],
        [
          "Explain",
          "remaining identity limits"
        ]
      ],
      "output": "",
      "note": "Independent transfer must be a new, self-written Python solution, without copying the tutorial's completed calculations.",
      "goal": "I10-CAPSTONE"
    }
  ]
}]);
})();
