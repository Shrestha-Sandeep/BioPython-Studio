// I06 — synthetic candidate masks and explicit morphological, labeling, and 3D assumptions.
"use strict";
(() => {
window.BioPythonImagingTutorials=Object.freeze([...(window.BioPythonImagingTutorials||[]),{
  "id": "i06-chapter",
  "chapter": "I06",
  "title": "Clean a mask and label candidate nuclei",
  "short": "Morphology, connectivity, exclusions and 3D limits",
  "minutes": "9–13 min",
  "goals": [
    "I06-G01",
    "I06-G02",
    "I06-G03",
    "I06-G04",
    "I06-G05",
    "I06-G06",
    "I06-G07",
    "I06-CAPSTONE"
  ],
  "steps": [
    {
      "title": "What a segmentation can and cannot claim",
      "say": "Start with a published teaching figure showing candidate fluorescent structures. Here we work on small invented binary arrays, not raw microscope pixel data. Cleaning a thresholded mask, assigning labels and reporting exclusions can create an auditable candidate-object workflow, but cannot independently prove these are nuclei.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Destination",
          "Candidate objects + exclusions"
        ],
        [
          "Source",
          "Synthetic binary arrays"
        ],
        [
          "Boundary",
          "Not a validated nucleus count"
        ]
      ],
      "output": "",
      "note": "The Witz and Human Protein Atlas figure is rendered teaching context, never the source of our numerical counts.",
      "goal": "I06-G01",
      "preview": {
        "image": "otsu-nuclei-mask",
        "label": "Published Witz/HPA threshold example; not measured by the synthetic code below"
      }
    },
    {
      "title": "Closing fills a hole; opening may erase a ring",
      "say": "On a seven-by-seven synthetic mask with a hollow three-by-three square, closing with a radius-one disk fills the center. Opening with the same footprint instead removes this thin ring completely. The operation and footprint are scientific decisions, not harmless cosmetic cleanup.",
      "code": "import numpy as np\nfrom skimage.morphology import opening, closing, disk\nmask = np.zeros((7, 7), dtype=bool)\nmask[2:5, 2:5] = True\nmask[3, 3] = False\nprint(int(mask.sum()), int(closing(mask, footprint=disk(1)).sum()))\nprint(int(opening(mask, footprint=disk(1)).sum()))",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "Input",
          "8 foreground pixels"
        ],
        [
          "Closing",
          "9 selected"
        ],
        [
          "Opening",
          "0 selected"
        ]
      ],
      "output": "8 9\n0",
      "note": "Both operations change candidate geometry; neither reveals whether the removed or filled pixels reflect biology.",
      "goal": "I06-G01"
    },
    {
      "title": "Opening removes an isolated candidate, possibly a real punctum",
      "say": "Opening combines erosion and dilation. A small isolated bright pixel disappears when we use a disk of radius one, while part of a larger square survives. This could improve a noisy mask or destroy a meaningful small punctum.",
      "code": "import numpy as np\nfrom skimage.morphology import opening, disk\nmask = np.zeros((5,5), dtype=bool)\nmask[1:4,1:4] = True\nmask[0,0] = True\ncleaned = opening(mask, footprint=disk(1))\nprint(int(mask.sum()), int(cleaned.sum()), bool(cleaned[0,0]))",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "Raw",
          "10 pixels"
        ],
        [
          "Opened",
          "5 pixels"
        ],
        [
          "Isolated",
          "removed"
        ]
      ],
      "output": "10 5 False",
      "note": "Set physical feature-scale expectations before morphology; a visually cleaner mask is not proof of better sensitivity.",
      "goal": "I06-G01"
    },
    {
      "title": "Four-neighbor connectivity keeps diagonals separate",
      "say": "The three foreground pixels in an identity matrix touch only at corners. Under connectivity one in two dimensions, each has its own connected-component label. The result is a count of three computational components, not three nuclei.",
      "code": "import numpy as np\nfrom skimage.measure import label\nmask = np.eye(3, dtype=bool)\nlabels = label(mask, connectivity=1)\nprint(labels.tolist())\nprint(int(labels.max()))",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "4-neighbor",
          "No diagonal links"
        ],
        [
          "Components",
          "3 candidates"
        ],
        [
          "Meaning",
          "Not a cell count"
        ]
      ],
      "output": "[[1, 0, 0], [0, 2, 0], [0, 0, 3]]\n3",
      "note": "Connectivity=1 means four-neighbor adjacency for a two-dimensional image; other dimensions require care.",
      "goal": "I06-G02"
    },
    {
      "title": "Eight-neighbor connectivity merges diagonal components",
      "say": "When connectivity equals two in two dimensions, diagonal touching also connects pixels. On the same unchanged identity matrix, the three corner-touching foreground pixels now become one computational component. Connectivity is a parameter that affects apparent object number.",
      "code": "import numpy as np\nfrom skimage.measure import label\nmask = np.eye(3, dtype=bool)\nprint(int(label(mask, connectivity=1).max()))\nprint(int(label(mask, connectivity=2).max()))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "4-neighbor",
          "3 labels"
        ],
        [
          "8-neighbor",
          "1 label"
        ],
        [
          "Same data",
          "Different assumption"
        ]
      ],
      "output": "3\n1",
      "note": "Neither neighbor rule is universally correct; choose one using sampling geometry and an annotated validation set.",
      "goal": "I06-G02"
    },
    {
      "title": "Predict before revealing the component count",
      "say": "Four foreground pixels sit along the diagonal of this four-by-four synthetic array. If we use connectivity one, only edge-sharing pixels are connected. Predict the number of connected components before advancing to the reveal.",
      "code": "import numpy as np\nfrom skimage.measure import label\nmask = np.eye(4, dtype=bool)\nprint(int(label(mask, connectivity=1).max()))",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Mask",
          "Four diagonal pixels"
        ],
        [
          "Rule",
          "Edges only"
        ],
        [
          "Predict",
          "How many labels?"
        ]
      ],
      "output": "",
      "note": "The output remains withheld; use the definition of four-neighbor adjacency rather than guessing from appearance.",
      "goal": "I06-G02",
      "checkpoint": true
    },
    {
      "title": "Reveal: four diagonal pixels form four labels",
      "say": "With four-neighbor connectivity, all four diagonal pixels are separate. The computed component count is four. With eight-neighbor connectivity the exact same mask would yield just one component, illustrating why the count must be paired with parameters.",
      "code": "import numpy as np\nfrom skimage.measure import label\nmask = np.eye(4, dtype=bool)\nprint(int(label(mask, connectivity=1).max()))\nprint(int(label(mask, connectivity=2).max()))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Connectivity 1",
          "4 candidates"
        ],
        [
          "Connectivity 2",
          "1 candidate"
        ],
        [
          "Source",
          "unchanged"
        ]
      ],
      "output": "4\n1",
      "note": "A sensitivity report can show both counts, but an independent annotation is required to choose biologically valid settings.",
      "goal": "I06-G02"
    },
    {
      "title": "Filter by area and keep the rejected candidates auditable",
      "say": "We label a four-pixel square and an isolated one-pixel candidate using four-neighbor connectivity. We then keep only regions with area at least two pixels. This removes one whole candidate and keeps its reason available in a report.",
      "code": "import numpy as np\nfrom skimage.measure import label, regionprops\nmask = np.zeros((5,5), dtype=bool)\nmask[1:3,1:3] = True\nmask[2,4] = True\nregions = regionprops(label(mask, connectivity=1))\nprint(sorted(int(r.area) for r in regions))\nprint(sorted(int(r.area) for r in regions if r.area >= 2))",
      "focus": [
        6,
        7,
        8
      ],
      "visual": [
        [
          "Detected",
          "Areas 1 and 4 px"
        ],
        [
          "Keep ≥ 2",
          "Area 4 px"
        ],
        [
          "Rejected",
          "Area 1 px"
        ]
      ],
      "output": "[1, 4]\n[4]",
      "note": "These areas are counts of synthetic pixels, not square micrometers without independently verified pixel calibration.",
      "goal": "I06-G03"
    },
    {
      "title": "Use explicit inclusive area cutoffs",
      "say": "A region exactly at the minimum-area cutoff must be treated consistently. Here a four-pixel region is retained when the allowed interval includes four, while a one-pixel singleton is excluded. Avoid assuming semantics of version-dependent convenience APIs.",
      "code": "import numpy as np\nfrom skimage.measure import label, regionprops\nmask = np.zeros((5,5), dtype=bool)\nmask[1:3,1:3] = True\nmask[2,4] = True\nareas = [int(r.area) for r in regionprops(label(mask, connectivity=1))]\nprint(sorted(a for a in areas if 2 <= a <= 4))\nprint(sum(a < 2 or a > 4 for a in areas))",
      "focus": [
        6,
        7,
        8
      ],
      "visual": [
        [
          "Keep",
          "2 ≤ area ≤ 4"
        ],
        [
          "Retained",
          "[4]"
        ],
        [
          "Excluded",
          "1"
        ]
      ],
      "output": "[4]\n1",
      "note": "The cutoff is inclusive on both ends and expressed in pixels; preserve excluded IDs in a real analysis audit.",
      "goal": "I06-G03"
    },
    {
      "title": "Border touching creates a censoring decision",
      "say": "An object touching an acquisition border may be truncated. The synthetic array has two candidates, but the two-pixel component on the top edge is removed by clear_border. Report both the original count and the count remaining.",
      "code": "import numpy as np\nfrom skimage.measure import label\nfrom skimage.segmentation import clear_border\nmask = np.zeros((5,5), dtype=bool)\nmask[0,1:3] = True\nmask[2:4,2:4] = True\nprint(int(label(mask, connectivity=1).max()))\nprint(int(label(clear_border(mask), connectivity=1).max()))",
      "focus": [
        6,
        7,
        8
      ],
      "visual": [
        [
          "Before",
          "2 candidates"
        ],
        [
          "Border excluded",
          "1 candidate"
        ],
        [
          "Remaining",
          "1 candidate"
        ]
      ],
      "output": "2\n1",
      "note": "Border exclusion is a study-level rule; do not remove inconvenient objects selectively between conditions.",
      "goal": "I06-G04"
    },
    {
      "title": "A crop can manufacture a new border",
      "say": "A square near the center of a six-by-six original image does not touch the acquisition boundary. After cropping a smaller region around it, the same object touches the crop border and gets rejected. Always distinguish original-image borders from analysis-ROI borders.",
      "code": "import numpy as np\nfrom skimage.segmentation import clear_border\nmask = np.zeros((6,6), dtype=bool)\nmask[2:4,2:4] = True\nroi = mask[2:5,2:5]\nprint(int(clear_border(mask).sum()))\nprint(int(clear_border(roi).sum()))",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "Full image",
          "4 pixels retained"
        ],
        [
          "New crop",
          "0 retained"
        ],
        [
          "Lesson",
          "Border is contextual"
        ]
      ],
      "output": "4\n0",
      "note": "A region of interest creates artificial boundaries; its exclusion rule needs scientific justification.",
      "goal": "I06-G04"
    },
    {
      "title": "Two watershed markers partition one touching foreground",
      "say": "Watershed can split touching foreground when we provide two explicit seeds and a distance transform. This particular three-by-five rectangle divides into two marker-derived regions of different sizes. Those labels are algorithmic hypotheses, not validated individual cells.",
      "code": "import numpy as np\nfrom scipy import ndimage as ndi\nfrom skimage.segmentation import watershed\nmask = np.zeros((3,5), dtype=bool)\nmask[:,1:4] = True\nseeds = np.zeros_like(mask, dtype=int)\nseeds[1,1], seeds[1,3] = 1, 2\nlabels = watershed(-ndi.distance_transform_edt(mask), seeds, mask=mask)\nprint(np.unique(labels).tolist())\nprint(int((labels==1).sum()), int((labels==2).sum()))",
      "focus": [
        8,
        9,
        10
      ],
      "visual": [
        [
          "Foreground",
          "One connected block"
        ],
        [
          "Seeds",
          "Two chosen markers"
        ],
        [
          "Result",
          "Two candidate labels"
        ]
      ],
      "output": "[0, 1, 2]\n6 3",
      "note": "Watershed marker placement is part of the input; wrong markers can fabricate or erase apparent object boundaries.",
      "goal": "I06-G05"
    },
    {
      "title": "One marker changes the very same watershed result",
      "say": "Now keep the same foreground pixels and distance transform, but supply only a single valid marker. The watershed returns one foreground label instead of two. This illustrates sensitivity to marker generation, separate from threshold choice.",
      "code": "import numpy as np\nfrom scipy import ndimage as ndi\nfrom skimage.segmentation import watershed\nmask = np.zeros((3,5), dtype=bool)\nmask[:,1:4] = True\nseeds = np.zeros_like(mask, dtype=int)\nseeds[1,1] = 1\nlabels = watershed(-ndi.distance_transform_edt(mask), seeds, mask=mask)\nprint(np.unique(labels).tolist())",
      "focus": [
        7,
        8,
        9
      ],
      "visual": [
        [
          "Same mask",
          "9 foreground pixels"
        ],
        [
          "Seed count",
          "1"
        ],
        [
          "Labels",
          "[0, 1]"
        ]
      ],
      "output": "[0, 1]",
      "note": "Without independent annotation, choosing the seed count to match an expected biological answer risks circular validation.",
      "goal": "I06-G05"
    },
    {
      "title": "A 2D projection hides separation across z",
      "say": "Two pixels at the same XY coordinate occur in first and third optical sections of a three-plane volume, with an empty middle section. Three-dimensional face connectivity correctly yields two disconnected candidate voxels, but XY max-projection collapses them onto one foreground pixel.",
      "code": "import numpy as np\nfrom skimage.measure import label\nvolume = np.zeros((3,3,3), dtype=bool)\nvolume[0,1,1] = True\nvolume[2,1,1] = True\nprint(int(label(volume, connectivity=1).max()))\nprint(int(label(volume.max(axis=0), connectivity=1).max()))",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "3D mask",
          "2 candidates"
        ],
        [
          "XY projection",
          "1 candidate"
        ],
        [
          "Reason",
          "Z separation lost"
        ]
      ],
      "output": "2\n1",
      "note": "A projection is lossy and may merge distinct axial objects; three-dimensional validation requires actual z-stack metadata.",
      "goal": "I06-G06"
    },
    {
      "title": "Adjacent z-plane voxels really are connected in 3D",
      "say": "The preceding separation works only because one full empty optical section lies between the foreground voxels. Here two voxels in adjacent z planes at the same XY location are face-connected under three-dimensional connectivity one, so they form one component.",
      "code": "import numpy as np\nfrom skimage.measure import label\nvolume = np.zeros((2,3,3), dtype=bool)\nvolume[:,1,1] = True\nprint(int(label(volume, connectivity=1).max()))\nprint(volume.shape)",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Z planes",
          "Adjacent"
        ],
        [
          "Connectivity 1",
          "1 candidate"
        ],
        [
          "Shape",
          "(2, 3, 3)"
        ]
      ],
      "output": "1\n(2, 3, 3)",
      "note": "Volume shape alone cannot reveal z spacing, axial resolution or whether separated signals are biologically distinct.",
      "goal": "I06-G06"
    },
    {
      "title": "Make candidate segmentation reusable and source-preserving",
      "say": "A reusable function takes the numerical image, strict threshold and minimum pixel area as parameters. Four-neighbor labeling and area filtering return component areas and their count. A copied source confirms the inputs have not been overwritten.",
      "code": "import numpy as np\nfrom skimage.measure import label, regionprops\ndef measure_candidates(image, threshold, min_area):\n    mask = np.asarray(image) > threshold\n    regions = regionprops(label(mask, connectivity=1))\n    areas = sorted(int(r.area) for r in regions if r.area >= min_area)\n    return areas, len(areas)\nraw = np.array([[0,5,5,0,6],[0,5,5,0,0],[0,0,0,0,0]])\noriginal = raw.copy()\nprint(measure_candidates(raw, threshold=4, min_area=2))\nprint(bool(np.array_equal(raw, original)))",
      "focus": [
        9,
        10,
        11
      ],
      "visual": [
        [
          "Input",
          "New numeric array"
        ],
        [
          "Output",
          "[4], count 1"
        ],
        [
          "Guarantee",
          "Source unchanged"
        ]
      ],
      "output": "([4], 1)\nTrue",
      "note": "Parameterization improves reproducibility but cannot establish nucleus or cell identity without annotations.",
      "goal": "I06-G07"
    },
    {
      "title": "Capstone: log size and border exclusions separately",
      "say": "Create a complete audit on a synthetic intensity array. Thresholding yields three candidate regions: a four-pixel interior square, a two-pixel edge region and a singleton. One fails the size cutoff, one fails the border rule, and one remains; keep the original input and verified=False.",
      "code": "import numpy as np\nfrom skimage.measure import label, regionprops\nfrom skimage.segmentation import clear_border\nraw = np.zeros((6,6), dtype=int)\nraw[1:3,1:3] = 8\nraw[0:2,4] = 7\nraw[4,3] = 6\noriginal = raw.copy()\nlabels = label(raw > 5, connectivity=1)\nregions = regionprops(labels)\nkept = np.zeros_like(raw, dtype=bool)\nfor region in regions:\n    if region.area >= 2:\n        kept[labels == region.label] = True\nafter_area = int(label(kept, connectivity=1).max())\nremaining = int(label(clear_border(kept), connectivity=1).max())\nprint('Candidates:', len(regions))\nprint('Size rejected:', sum(r.area < 2 for r in regions))\nprint('Border rejected:', after_area - remaining)\nprint('Kept:', remaining, 'Verified:', False)\nprint('Source preserved:', bool(np.array_equal(raw, original)))",
      "focus": [
        19,
        20,
        21
      ],
      "visual": [
        [
          "Candidates",
          "3 initial labels"
        ],
        [
          "Exclusions",
          "1 size + 1 border"
        ],
        [
          "Report",
          "1 kept; unverified"
        ]
      ],
      "output": "Candidates: 3\nSize rejected: 1\nBorder rejected: 1\nKept: 1 Verified: False\nSource preserved: True",
      "note": "This is an auditable synthetic candidate analysis, not quantitative validation of the published microscope picture.",
      "goal": "I06-CAPSTONE"
    },
    {
      "title": "Independent transfer: audit a genuinely new mask",
      "say": "Return to the Python editor and design a different mask with a diagonal contact, an isolated small candidate and a border-touching candidate. Predict each exclusion, apply explicit connectivity and area rules, and compare full-image with cropped borders. Do not copy the worked solution.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Create",
          "New mask with edge cases"
        ],
        [
          "Prove",
          "Report all exclusions"
        ],
        [
          "Explain",
          "What would validate nuclei?"
        ]
      ],
      "output": "",
      "note": "Independent transfer requires writing and running a new solution, without copying the completed tutorial script.",
      "goal": "I06-CAPSTONE"
    }
  ]
}]);
})();
