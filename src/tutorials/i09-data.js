// I09 — synthetic candidate labels, channel statistics, peak detection and spatial proximity.
"use strict";
(() => {
window.BioPythonImagingTutorials=Object.freeze([...(window.BioPythonImagingTutorials||[]),{
  "id": "i09-chapter",
  "chapter": "I09",
  "title": "Measure nuclear features and protein signal",
  "short": "Candidate region properties, intensity, association and proximity",
  "minutes": "10–14 min",
  "goals": [
    "I09-G01",
    "I09-G02",
    "I09-G03",
    "I09-G04",
    "I09-G05",
    "I09-G06",
    "I09-CAPSTONE"
  ],
  "steps": [
    {
      "title": "The destination: measurable candidate signal, not biological proof",
      "say": "Previously, the learning workflow produced candidate region labels and tables of invented imaging values. Now we will compute explicit geometric, channel-intensity and spatial features from new synthetic label arrays. The credited published microscopy figure is context only. These calculations cannot independently verify nuclei, puncta or molecular interactions.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Candidate mask",
          "not validated nuclei"
        ],
        [
          "Input",
          "Synthetic label + channel arrays"
        ],
        [
          "Report",
          "Measurements + limits"
        ]
      ],
      "output": "",
      "note": "Credited Witz/HPA PNG is rendered teaching context, not the source of any synthetic numerical values.",
      "goal": "I09-G01",
      "preview": {
        "image": "fluorescence-single",
        "label": "Published Witz/Human Protein Atlas teaching figure; synthetic arrays below are unrelated"
      }
    },
    {
      "title": "Measure object labels, pixel area and row-column centroids",
      "say": "The label image has two synthetic candidate objects. One spans two pixels in the top row, the other two pixels in the last column. Regionprops ignores background zero and gives centroids in row, column order, also called y, x. Labels must stay attached to measurements.",
      "code": "import numpy as np\nfrom skimage.measure import regionprops\nlabels = np.array([[0,1,1,0],\n                   [0,0,0,0],\n                   [0,0,0,2],\n                   [0,0,0,2]])\nrows = [(int(r.label),int(r.area),tuple(round(float(v),1) for v in r.centroid))\n        for r in regionprops(labels)]\nprint(rows)",
      "focus": [
        7,
        8,
        9
      ],
      "visual": [
        [
          "Label 1",
          "2 px; centroid y=0"
        ],
        [
          "Label 2",
          "2 px; centroid y=2.5"
        ],
        [
          "Coordinates",
          "row, column"
        ]
      ],
      "output": "[(1, 2, (0.0, 1.5)), (2, 2, (2.5, 3.0))]",
      "note": "Area is measured in source pixels and region labels are computational IDs, not confirmed nuclei.",
      "goal": "I09-G01"
    },
    {
      "title": "Two spatial dimensions require a squared calibration factor",
      "say": "A pixel width of zero point two micrometers makes each pixel area zero point zero four square micrometers. Multiply pixel count by the square of pixel size, not the pixel size itself. Here calibration is supplied as a fictional teaching value.",
      "code": "pixel_um = 0.2\nareas_px = [2,8]\nareas_um2 = [round(a * pixel_um**2,2) for a in areas_px]\nprint(areas_um2)",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Pixel size",
          "0.2 µm / pixel"
        ],
        [
          "Pixel area",
          "0.04 µm²"
        ],
        [
          "Region areas",
          "0.08 and 0.32 µm²"
        ]
      ],
      "output": "[0.08, 0.32]",
      "note": "Actual microscope calibration must come from acquisition metadata; invented example scale is not measured provenance.",
      "goal": "I09-G01"
    },
    {
      "title": "Sample the exact channel values under each candidate region",
      "say": "A separately supplied synthetic signal array is aligned pixel-for-pixel to the labels. Regionprops evaluates intensity within each labeled footprint and returns two candidate means: five and nine. The background label zero does not contribute to either region's mean.",
      "code": "import numpy as np\nfrom skimage.measure import regionprops\nlabels = np.array([[1,1,0],[0,0,2]])\nsignal = np.array([[4.,6.,2.],[1.,3.,9.]])\nprint([(int(r.label),float(r.intensity_mean))\n       for r in regionprops(labels,intensity_image=signal)])",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Candidate 1",
          "values 4,6; mean 5"
        ],
        [
          "Candidate 2",
          "value 9; mean 9"
        ],
        [
          "Channel",
          "synthetic intensity"
        ]
      ],
      "output": "[(1, 5.0), (2, 9.0)]",
      "note": "Intensity means from a synthetic array are not calibrated fluorophore concentrations or corrected photon counts.",
      "goal": "I09-G02"
    },
    {
      "title": "A channel-label shape mismatch must fail visibly",
      "say": "The region-label image is two by two, but the supplied signal image has three rows. Computing means without spatial alignment would associate unrelated pixels with candidate IDs. We catch the library's shape error and explicitly report that this input is unusable.",
      "code": "import numpy as np\nfrom skimage.measure import regionprops\nlabels = np.array([[1,0],[0,2]])\nsignal = np.zeros((3,2),dtype=float)\ntry:\n    regionprops(labels,intensity_image=signal)\nexcept ValueError as error:\n    print(type(error).__name__)\nprint('Aligned:',labels.shape==signal.shape)",
      "focus": [
        7,
        8,
        9
      ],
      "visual": [
        [
          "Labels",
          "2 × 2"
        ],
        [
          "Signal",
          "3 × 2"
        ],
        [
          "Decision",
          "reject"
        ]
      ],
      "output": "ValueError\nAligned: False",
      "note": "Even same-shaped arrays can be misregistered; actual channel alignment needs independent acquisition checks.",
      "goal": "I09-G02"
    },
    {
      "title": "Outside a candidate mask is not automatically cytoplasm",
      "say": "Compare a supplied two-pixel candidate mask against its complement in a six-pixel frame. The candidate mean is six, the outside mean is two and their ratio is three. These outside pixels include uncontrolled background, not a validated cytoplasmic region.",
      "code": "import numpy as np\nmask = np.array([[1,1,0],[0,0,0]],bool)\nsignal = np.array([[8.,4.,2.],[2.,2.,2.]])\ninside = float(signal[mask].mean())\noutside = float(signal[~mask].mean())\nprint(inside,outside,round(inside/outside,2))",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Inside",
          "mean 6"
        ],
        [
          "Outside",
          "mean 2"
        ],
        [
          "Ratio",
          "3, not localization proof"
        ]
      ],
      "output": "6.0 2.0 3.0",
      "note": "A nucleus-versus-cytoplasm claim requires independently segmented complete cell compartments and background corrections.",
      "goal": "I09-G03"
    },
    {
      "title": "No outside pixels means no defensible inside-outside ratio",
      "say": "If the entire array is selected, the complement contains zero pixels. Calling its mean zero would invent a measurement and cause division-by-zero artifacts. Report a missing ratio explicitly when either required compartment is empty.",
      "code": "import numpy as np\nmask = np.ones((2,2),dtype=bool)\nsignal = np.array([[2.,4.],[6.,8.]])\noutside = signal[~mask]\nratio = None if outside.size==0 else float(signal[mask].mean()/outside.mean())\nprint(outside.size,ratio)",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Candidate",
          "full image"
        ],
        [
          "Outside",
          "0 pixels"
        ],
        [
          "Ratio",
          "None"
        ]
      ],
      "output": "0 None",
      "note": "An empty ROI is a scientifically meaningful exclusion, not a numerical value to replace with zero.",
      "goal": "I09-G03"
    },
    {
      "title": "Predict the inside-outside mean ratio before revealing it",
      "say": "Two candidate pixels contain values five and seven. Four other pixels each contain two. Predict the ratio of the candidate mean divided by the outside mean, using this explicit array and Boolean mask. The answer remains withheld until you advance.",
      "code": "import numpy as np\nmask = np.array([[1,1,0],[0,0,0]],bool)\nsignal = np.array([[5.,7.,2.],[2.,2.,2.]])\nprint(float(signal[mask].mean()/signal[~mask].mean()))",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Inside values",
          "5 and 7"
        ],
        [
          "Outside values",
          "2,2,2,2"
        ],
        [
          "Predict",
          "mean ratio = ?"
        ]
      ],
      "output": "",
      "note": "Checkpoint output is withheld; distinguish average intensity from total intensity and keep outside-mask semantics explicit.",
      "goal": "I09-G03",
      "checkpoint": true
    },
    {
      "title": "Reveal: candidate mean six divided by outside mean two",
      "say": "The two candidate values average to six, whereas all four outside-mask pixels average to two. Their ratio is three. This arithmetic is valid, but it cannot show nuclear enrichment without a valid cell compartment and controls.",
      "code": "import numpy as np\nmask = np.array([[1,1,0],[0,0,0]],bool)\nsignal = np.array([[5.,7.,2.],[2.,2.,2.]])\nprint(float(signal[mask].mean()),float(signal[~mask].mean()))\nprint(float(signal[mask].mean()/signal[~mask].mean()))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Inside mean",
          "6"
        ],
        [
          "Outside mean",
          "2"
        ],
        [
          "Ratio",
          "3"
        ]
      ],
      "output": "6.0 2.0\n3.0",
      "note": "Whole-frame complementary pixels are not an independently established cytoplasmic region.",
      "goal": "I09-G03"
    },
    {
      "title": "Pearson correlation measures pixel association, not interaction",
      "say": "Consider two synthetic channels whose three pixel values increase proportionally. Their Pearson correlation is positive one. That is perfect linear association for these values, not evidence that proteins physically interact or occupy the same nanoscale structure.",
      "code": "import numpy as np\na = np.array([1.,2.,3.])\nb = np.array([2.,4.,6.])\nr = float(np.corrcoef(a,b)[0,1])\nprint(round(r,2))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Channel A",
          "1,2,3"
        ],
        [
          "Channel B",
          "2,4,6"
        ],
        [
          "Pearson r",
          "1.0"
        ]
      ],
      "output": "1.0",
      "note": "Shared illumination/background, bleed-through, pixel sampling and ROI selection can confound image colocalization.",
      "goal": "I09-G04"
    },
    {
      "title": "A constant channel makes Pearson undefined",
      "say": "If all pixels in a channel have the same value, their standard deviation is zero. The Pearson denominator is then zero; returning a plausible coefficient would mislead the interpretation. Guard the calculation and return None instead of a fabricated correlation.",
      "code": "import numpy as np\na = np.array([1.,2.,3.])\nb = np.array([4.,4.,4.])\nr = None if np.std(a)==0 or np.std(b)==0 else float(np.corrcoef(a,b)[0,1])\nprint(r)\nprint(bool(np.std(b)==0))",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Signal A",
          "varies"
        ],
        [
          "Signal B",
          "constant"
        ],
        [
          "r",
          "undefined"
        ]
      ],
      "output": "None\nTrue",
      "note": "An undefined correlation must be reported as such; exclusion decisions and acquisition artifacts need documentation.",
      "goal": "I09-G04"
    },
    {
      "title": "A threshold-based overlap fraction depends on its denominator",
      "say": "Within a declared four-pixel ROI, channel A exceeds its threshold at two pixels. Channel B exceeds its threshold at just one of those two A-positive pixels. The conditional overlap fraction is one-half, and is not a standard Manders coefficient unless intensities and exact definitions match.",
      "code": "import numpy as np\nroi = np.array([1,1,1,0],bool)\na = np.array([5,0,7,9])\nb = np.array([1,0,0,10])\na_pos = roi & (a>4)\nb_pos = roi & (b>0)\ndenom = int(a_pos.sum())\noverlap = None if denom==0 else float((a_pos & b_pos).sum()/denom)\nprint(denom,overlap)",
      "focus": [
        7,
        8,
        9
      ],
      "visual": [
        [
          "A-positive",
          "2 pixels in ROI"
        ],
        [
          "Both positive",
          "1 pixel in ROI"
        ],
        [
          "Fraction",
          "0.5"
        ]
      ],
      "output": "2 0.5",
      "note": "Threshold-based binary overlap is one possible metric; it is not proof of molecular colocalization.",
      "goal": "I09-G04"
    },
    {
      "title": "Peak detection produces candidate coordinates, not punctum identities",
      "say": "A five-by-five synthetic signal matrix contains two separated local intensity maxima at coordinates row one column one and row three column three. An explicit threshold and separation rule selects both as candidate peaks. Peak coordinates use y,x order.",
      "code": "import numpy as np\nfrom skimage.feature import peak_local_max\nsignal = np.zeros((5,5),dtype=float)\nsignal[1,1],signal[3,3] = 9,8\npoints = peak_local_max(signal,threshold_abs=5,min_distance=1,exclude_border=False)\nprint(sorted(points.tolist()))",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Threshold",
          ">5 a.u."
        ],
        [
          "Peaks",
          "[1,1] and [3,3]"
        ],
        [
          "Status",
          "candidate maxima"
        ]
      ],
      "output": "[[1, 1], [3, 3]]",
      "note": "A local maximum can represent noise, saturation, autofluorescence or an artifact; validate against suitable biological and imaging controls.",
      "goal": "I09-G05"
    },
    {
      "title": "Border policy can hide a genuine edge candidate",
      "say": "The same signal array contains a bright pixel on the top edge and another in the middle. The default-style edge exclusion removes the top candidate, while allowing borders retains both. Record exclude_border explicitly; neither rule is universally valid.",
      "code": "import numpy as np\nfrom skimage.feature import peak_local_max\nsignal = np.zeros((5,5),dtype=float)\nsignal[0,2],signal[2,2] = 9,7\nkept = peak_local_max(signal,threshold_abs=5,min_distance=1,exclude_border=True)\nall_peaks = peak_local_max(signal,threshold_abs=5,min_distance=1,exclude_border=False)\nprint(sorted(kept.tolist()))\nprint(sorted(all_peaks.tolist()))",
      "focus": [
        6,
        7,
        8
      ],
      "visual": [
        [
          "Exclude edge",
          "[2,2]"
        ],
        [
          "Allow edge",
          "[0,2], [2,2]"
        ],
        [
          "Need",
          "document border"
        ]
      ],
      "output": "[[2, 2]]\n[[0, 2], [2, 2]]",
      "note": "Border loss can bias punctum counts; sensor boundaries, cropped ROIs and acquisition quality all matter.",
      "goal": "I09-G05"
    },
    {
      "title": "Measure nearest-center distance in row-column coordinates",
      "say": "Two synthetic candidate spots occur at coordinates zero-zero and three-four. Their distance to the reference candidate center at zero-zero is zero and five pixels, respectively, using a Euclidean distance matrix. Coordinate ordering must remain consistent.",
      "code": "import numpy as np\nfrom scipy.spatial.distance import cdist\npoints_yx = np.array([[0,0],[3,4]],float)\ncenters_yx = np.array([[0,0]],float)\ndist_px = cdist(points_yx,centers_yx).min(axis=1)\nprint(dist_px.tolist())",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Point 1",
          "0 px"
        ],
        [
          "Point 2",
          "5 px"
        ],
        [
          "Convention",
          "y,x"
        ]
      ],
      "output": "[0.0, 5.0]",
      "note": "Two-dimensional spatial proximity cannot show 3D trafficking or physical molecular interaction.",
      "goal": "I09-G06"
    },
    {
      "title": "Only real calibration converts pixel distances into micrometers",
      "say": "If a fictional isotropic scale is zero point two micrometers per pixel, the previous five-pixel distance corresponds to one micrometer. This multiplication is legitimate for the supplied scale but does not establish that the source instrument was correctly calibrated.",
      "code": "import numpy as np\ndist_px = np.array([0.,5.])\npixel_um = 0.2\nprint((dist_px*pixel_um).tolist())",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Pixel distances",
          "0 and 5 px"
        ],
        [
          "Supplied scale",
          "0.2 µm/px"
        ],
        [
          "Physical example",
          "0 and 1 µm"
        ]
      ],
      "output": "[0.0, 1.0]",
      "note": "Z spacing and axial resolution may differ; never infer 3D distance from 2D coordinates.",
      "goal": "I09-G06"
    },
    {
      "title": "Capstone: a source-preserving candidate-region signal report",
      "say": "Create one coherent record from a synthetic region-label map, synthetic signal pixels and candidate spot coordinates. Return each region's label, pixel area and within-region mean, plus nearest centroid distances. Confirm the original arrays were unchanged and mark the result unverified.",
      "code": "import numpy as np\nfrom skimage.measure import regionprops\nfrom scipy.spatial.distance import cdist\nlabels = np.array([[1,1,0],[0,0,0],[0,0,2]])\nsignal = np.array([[4.,6.,0.],[0.,1.,0.],[0.,0.,9.]])\noriginal_labels,original_signal = labels.copy(),signal.copy()\nregions = regionprops(labels,intensity_image=signal)\nrows = [(int(r.label),int(r.area),float(r.intensity_mean)) for r in regions]\ncenters = np.array([r.centroid for r in regions])\nspots = np.array([[0,0],[2,2]])\nnearest = cdist(spots,centers).min(axis=1).tolist()\nprint('Candidates:',rows)\nprint('Nearest px:',nearest)\nprint('Source unchanged:',bool(np.array_equal(labels,original_labels) and np.array_equal(signal,original_signal)))\nprint('Verified:',False)",
      "focus": [
        13,
        14,
        15
      ],
      "visual": [
        [
          "Candidate 1",
          "2 px; mean signal 5"
        ],
        [
          "Candidate 2",
          "1 px; mean signal 9"
        ],
        [
          "Status",
          "unverified synthetic"
        ]
      ],
      "output": "Candidates: [(1, 2, 5.0), (2, 1, 9.0)]\nNearest px: [0.5, 0.0]\nSource unchanged: True\nVerified: False",
      "note": "This code does not determine a real nucleus, molecular colocalization or a calibrated punctum distance in the published Witz/HPA picture.",
      "goal": "I09-CAPSTONE"
    },
    {
      "title": "Independent transfer: can you detect a misleading protein-signal claim?",
      "say": "Return to the real Python editor and create new label and channel arrays containing an empty outside mask, a constant second channel and a possible edge peak. Compute per-region means, guarded correlation, candidate peaks and distances. Explain which biological controls would be needed before reporting localization or interaction.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Change",
          "New labels and channel arrays"
        ],
        [
          "Prove",
          "Guard undefined statistics"
        ],
        [
          "Explain",
          "Controls and independence"
        ]
      ],
      "output": "",
      "note": "Independent transfer requires fresh, executable student-written Python and a defensible limitation statement, not copying this worked solution.",
      "goal": "I09-CAPSTONE"
    }
  ]
}]);
})();
