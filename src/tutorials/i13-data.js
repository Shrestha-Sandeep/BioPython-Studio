// I13 — source-aware real published PNG candidate analysis and honest image overlay.
"use strict";
(() => {
window.BioPythonImagingTutorials=Object.freeze([...(window.BioPythonImagingTutorials||[]),{
  "id": "i13-chapter",
  "chapter": "I13",
  "title": "Build the complete image-analysis pipeline",
  "short": "Real image bytes, source provenance, ROI, threshold and overlay",
  "minutes": "12–18 min",
  "goals": [
    "I13-G01",
    "I13-G02",
    "I13-G03",
    "I13-G04",
    "I13-G05",
    "I13-CAPSTONE"
  ],
  "steps": [
    {
      "title": "The destination: follow real image bytes all the way to an honest report",
      "say": "This final chapter connects debugging, source metadata, visualization, image processing and a reproducible audit. We will genuinely decode the credited Witz and Human Protein Atlas PNG from the repository. It is a rendered published figure, not original calibrated fluorescence or manually validated nuclei; any computed regions describe image-display pixels only.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Source",
          "Credited published PNG"
        ],
        [
          "Python",
          "ROI, threshold, labels and overlay"
        ],
        [
          "Claim",
          "Rendered-pixel candidates only"
        ]
      ],
      "output": "",
      "note": "The PNG is not a raw 16-bit image: neither cell identity nor true fluorescence concentration can be determined from this rendered figure.",
      "goal": "I13-G01",
      "preview": {
        "image": "fluorescence-single",
        "label": "Actual bundled Witz/HPA rendered figure; upcoming Python analyzes its RGB display pixels, not raw instrument signal"
      }
    },
    {
      "title": "Fix uint8 overflow before trusting image arithmetic",
      "say": "Unsigned eight-bit arithmetic wraps when exceeding two hundred fifty-five. Adding twenty to a pixel value of two hundred fifty produces fourteen in uint8, not two hundred seventy. Casting to float before arithmetic preserves the intended number, though it still does not correct an image's photometric calibration.",
      "code": "import numpy as np\nraw=np.array([250],dtype=np.uint8)\nwrapped=raw+np.array([20],dtype=np.uint8)\nsafe=raw.astype(float)+20\nprint(wrapped.tolist())\nprint(safe.tolist())",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "uint8",
          "250 + 20 → 14"
        ],
        [
          "float",
          "250 + 20 → 270"
        ],
        [
          "Source",
          "not modified"
        ]
      ],
      "output": "[14]\n[270.0]",
      "note": "Wrong dtypes can silently corrupt analysis; a rendered image's original processing cannot be undone by float conversion.",
      "goal": "I13-G01"
    },
    {
      "title": "Use y/x order and half-open ROI indices",
      "say": "NumPy image arrays index rows first, then columns: image y zero to y one, x zero to x one. The synthetic five-by-six array shows that a crop with rows one through three and columns two through four produces a three-by-three region whose first row begins at value eight.",
      "code": "import numpy as np\nimage=np.arange(30).reshape(5,6)\nroi=image[1:4,2:5]\nprint(roi.shape)\nprint(roi[0].tolist())",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Rows",
          "[1:4]"
        ],
        [
          "Columns",
          "[2:5]"
        ],
        [
          "Output",
          "3 × 3 crop"
        ]
      ],
      "output": "(3, 3)\n[8, 9, 10]",
      "note": "Cropping the wrong axis can still produce plausible values; always record coordinate conventions and source dimensions.",
      "goal": "I13-G01"
    },
    {
      "title": "Detect duplicate image metadata IDs instead of guessing",
      "say": "A microscope acquisition table may list the same image ID twice. Duplicates can signal repeated acquisitions, renamed files or clerical errors. Here img1 occurs twice, and an audit reports that fact without silently discarding either source row.",
      "code": "from collections import Counter\nids=['img1','img1','img2']\ncounts=Counter(ids)\nduplicates=sorted(k for k,n in counts.items() if n>1)\nprint(duplicates)\nprint(len(ids))",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Raw image IDs",
          "img1, img1, img2"
        ],
        [
          "Duplicate",
          "img1"
        ],
        [
          "Action",
          "flag"
        ]
      ],
      "output": "['img1']\n3",
      "note": "The correct metadata entry requires source evidence, not arbitrary `drop_duplicates` or selecting the first record.",
      "goal": "I13-G02"
    },
    {
      "title": "Validate source-to-metadata joins and report unmatched IDs",
      "say": "An image measurement table contains img1 and img2, but the metadata registry only knows img1. A left many-to-one merge preserves both measurements and marks img2 as unmatched. Missing source metadata must not vanish from the final report.",
      "code": "import pandas as pd\nmeasurements=pd.DataFrame({'image_id':['img1','img2'],'value':[2,4]})\nmetadata=pd.DataFrame({'image_id':['img1'],'condition':['ctrl']})\njoined=measurements.merge(metadata,on='image_id',how='left',\n                          validate='many_to_one',indicator=True)\nprint(joined.loc[joined['_merge']=='left_only','image_id'].tolist())\nprint(len(joined))",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "img1",
          "metadata present"
        ],
        [
          "img2",
          "unmatched"
        ],
        [
          "Source",
          "2 rows retained"
        ]
      ],
      "output": "['img2']\n2",
      "note": "Missing metadata prevent reliable treatment or biological-unit attribution to that image.",
      "goal": "I13-G02"
    },
    {
      "title": "Show individual experimental units in an actual figure",
      "say": "A Matplotlib scatter plot can display one observation per assumed independent preparation in each condition instead of hiding all data behind a bar. This demonstration uses invented replicate-level values, separate from the published image's displayed RGB pixels.",
      "code": "import matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt\nfig,ax=plt.subplots()\na=ax.scatter([0,0],[3,4],label='Control units')\nb=ax.scatter([1,1],[5,7],label='Treated units')\nax.set(xlabel='Condition',ylabel='Synthetic per-unit response (a.u.)')\nprint(len(a.get_offsets()),len(b.get_offsets()))\nplt.close(fig)",
      "focus": [
        7,
        8,
        9
      ],
      "visual": [
        [
          "Control",
          "2 source points"
        ],
        [
          "Treated",
          "2 source points"
        ],
        [
          "Plot",
          "real Matplotlib"
        ]
      ],
      "output": "2 2",
      "note": "The figure is descriptive and assumes preparations are independent; it does not establish a treatment effect.",
      "goal": "I13-G03"
    },
    {
      "title": "An axis must disclose measurement units and status",
      "say": "For an image-derived dataset, y-axis units are part of the scientific result. Here the values are fictional arbitrary units, not calibrated nuclear fluorescence. Label the plotted units and source clearly so the reader does not mistake the figure for a measured microscope experiment.",
      "code": "import matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt\nfig,ax=plt.subplots()\nax.scatter([0,1],[3,5])\nax.set_ylabel('Synthetic response (arbitrary units)')\nprint(ax.get_ylabel())\nprint('Source validated:',False)\nplt.close(fig)",
      "focus": [
        7,
        8,
        9
      ],
      "visual": [
        [
          "Y axis",
          "synthetic a.u."
        ],
        [
          "Independent data",
          "unverified"
        ],
        [
          "Conclusion",
          "no biology claim"
        ]
      ],
      "output": "Synthetic response (arbitrary units)\nSource validated: False",
      "note": "Real fluorescence reports require a calibrated data source, imaging corrections, channel records and defensible replicate metadata.",
      "goal": "I13-G03"
    },
    {
      "title": "Keep a machine-readable image provenance manifest",
      "say": "Before quantitative processing, name the file kind, source, axes, channel semantics and validation state. Our bundled input is a rendered RGB publication figure, not a raw instrument acquisition. A correct report therefore sets raw_calibrated and segmentation_validated to false.",
      "code": "source={'file_kind':'rendered Witz/HPA PNG',\n        'axes':'yxc','raw_calibrated':False,\n        'segmentation_validated':False}\nprint(source['axes'],source['file_kind'])\nprint(source['raw_calibrated'],source['segmentation_validated'])",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Axes",
          "y, x, RGB channel"
        ],
        [
          "Source",
          "rendered Witz/HPA PNG"
        ],
        [
          "Validation",
          "False"
        ]
      ],
      "output": "yxc rendered Witz/HPA PNG\nFalse False",
      "note": "A plausible filename or image size cannot substitute for acquisition metadata and human reference annotations.",
      "goal": "I13-G04"
    },
    {
      "title": "Parameter sensitivity is not scientific validation",
      "say": "A synthetic pixel array with values zero, one hundred ten, one hundred eighty and two hundred fifty yields different foreground counts at strict thresholds of one hundred and two hundred. Reporting both is more honest than showing only the visually pleasing mask.",
      "code": "import numpy as np\nvalues=np.array([0,110,180,250])\nprint([int((values>t).sum()) for t in (100,200)])\nprint('Validated nuclei:',False)",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Threshold >100",
          "3 selected pixels"
        ],
        [
          "Threshold >200",
          "1 selected pixel"
        ],
        [
          "Difference",
          "not accuracy"
        ]
      ],
      "output": "[3, 1]\nValidated nuclei: False",
      "note": "Threshold changes in a rendered RGB figure do not establish cell counts or original protein localization.",
      "goal": "I13-G04"
    },
    {
      "title": "Load actual Witz/HPA PNG bytes from the repository",
      "say": "The next code genuinely opens the checked-in figure through Pillow and converts it to RGB. The source file must be available in a local repository checkout at the shown relative path. In the browser learning editor, first import the image or use the provided image_path rather than assuming the repository file is mounted.",
      "code": "from pathlib import Path\nimport numpy as np\nfrom PIL import Image\npath=Path('assets/witz/fluorescence-single.png')\nif not path.is_file():\n    raise FileNotFoundError('Run from repository root or import the image into the Python filesystem')\nwith Image.open(path) as src:\n    rgb=np.asarray(src.convert('RGB'))\nprint(path.name,rgb.ndim,rgb.shape[-1],rgb.dtype.name)",
      "focus": [
        7,
        8,
        9
      ],
      "visual": [
        [
          "File",
          "fluorescence-single.png"
        ],
        [
          "Decode",
          "real Pillow RGB"
        ],
        [
          "Result",
          "3 channels; uint8"
        ]
      ],
      "output": "fluorescence-single.png 3 3 uint8",
      "note": "Decoded RGB values are display-pixel components; they are not calibrated fluorophore intensity or original Witz/HPA microscopy TIFF.",
      "goal": "I13-G05"
    },
    {
      "title": "RGB channels of a rendered figure are not fluorescent acquisition channels",
      "say": "The actual local published PNG has been converted to RGB and is three dimensional, with red, green and blue display components. Selecting the green display component is a reproducible operation on an image, but it is not equivalent to reading a raw GFP channel.",
      "code": "from pathlib import Path\nimport numpy as np\nfrom PIL import Image\nrgb=np.asarray(Image.open(Path('assets/witz/fluorescence-single.png')).convert('RGB'))\nprint(rgb.ndim,rgb.shape[-1])\nprint('Raw fluorescence:',False)",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Image dimensions",
          "y × x × 3"
        ],
        [
          "Green display band",
          "index 1"
        ],
        [
          "Raw fluorescence",
          "False"
        ]
      ],
      "output": "3 3\nRaw fluorescence: False",
      "note": "Rendered channel brightness, labels, legends and composited figures can contribute to the measured RGB pixels.",
      "goal": "I13-G05"
    },
    {
      "title": "Crop a real 48-by-48 ROI and preserve source orientation",
      "say": "Now genuinely index the first forty-eight rows and columns of the rendered PNG's green display component. The 48-by-48 ROI contains two thousand three hundred four source display pixels. It is a coordinate-defined image patch, not a biologically annotated nucleus.",
      "code": "from pathlib import Path\nimport numpy as np\nfrom PIL import Image\nrgb=np.asarray(Image.open(Path('assets/witz/fluorescence-single.png')).convert('RGB'))\nroi=rgb[0:48,0:48,1]\nprint(roi.shape,int(roi.size))\nprint('Original has three display channels:',rgb.shape[-1]==3)",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "ROI rows",
          "0–47"
        ],
        [
          "ROI columns",
          "0–47"
        ],
        [
          "Pixel count",
          "2304"
        ]
      ],
      "output": "(48, 48) 2304\nOriginal has three display channels: True",
      "note": "Choose a scientifically meaningful ROI only after inspecting the source; this corner is an instructional coordinate example.",
      "goal": "I13-G05"
    },
    {
      "title": "Apply a real strict threshold and label rendered-pixel candidates",
      "say": "The forty-eight-by-forty-eight crop can be thresholded strictly above one hundred twenty-seven and labeled with four-neighbor connectivity. This code actually measures components from decoded published RGB pixels; their count is a rendered-picture statistic, not a count of real nuclei. No fixed biological number is claimed.",
      "code": "from pathlib import Path\nimport numpy as np\nfrom PIL import Image\nfrom skimage.measure import label,regionprops\nrgb=np.asarray(Image.open(Path('assets/witz/fluorescence-single.png')).convert('RGB'))\nroi=rgb[:48,:48,1]\nmask=roi>127\nlabels=label(mask,connectivity=1)\nareas=[int(r.area) for r in regionprops(labels)]\nprint('ROI pixels:',int(mask.size))\nprint('Candidates:',len(areas))\nprint('Calibrated:',False)",
      "focus": [
        10,
        11,
        12
      ],
      "visual": [
        [
          "Data",
          "actual decoded PNG"
        ],
        [
          "Filter",
          "strict >127"
        ],
        [
          "Output",
          "candidate regions only"
        ]
      ],
      "output": "",
      "note": "The candidate count is computed from the PNG and must not be interpreted as segmented nuclei; it is not hardcoded before testing the file.",
      "goal": "I13-G05"
    },
    {
      "title": "Predict a candidate count on a separate synthetic mask",
      "say": "Before seeing a correct numeric reveal, trace a small invented threshold array. Two connected selected pixels form one region; two lower isolated pixels should be treated according to the four-neighbor rule. Predict the number of labels without looking ahead.",
      "code": "import numpy as np\nfrom skimage.measure import label\ntoy=np.array([[0,8,0],[0,8,0],[5,0,5]])\nmask=toy>4\nprint(int(label(mask,connectivity=1).max()))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Above threshold",
          "4 pixels"
        ],
        [
          "Connectivity",
          "4-neighbor"
        ],
        [
          "Predict",
          "candidate labels = ?"
        ]
      ],
      "output": "",
      "note": "This checkpoint uses a synthetic array, not the unknowable biological identity of source rendered pixels.",
      "goal": "I13-G05",
      "checkpoint": true
    },
    {
      "title": "Reveal: four selected pixels form three candidate labels",
      "say": "The two vertical pixels connect into one component; the two bottom corners each form separate four-connected components. The mask therefore has four foreground pixels and three computational candidate regions. This is purely a threshold-and-connectivity result.",
      "code": "import numpy as np\nfrom skimage.measure import label\ntoy=np.array([[0,8,0],[0,8,0],[5,0,5]])\nmask=toy>4\nprint(int(label(mask,connectivity=1).max()),int(mask.sum()))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Connected vertical",
          "1 region"
        ],
        [
          "Isolated corners",
          "2 regions"
        ],
        [
          "Total",
          "3 labels, 4 pixels"
        ]
      ],
      "output": "3 4",
      "note": "Real-image candidate labels require further human validation; this synthetic exercise proves only the labeling rule.",
      "goal": "I13-G05"
    },
    {
      "title": "Capstone: genuinely render a source-image ROI candidate overlay",
      "say": "Run from the repository checkout, decode the real Witz/HPA rendered PNG, preserve a copy, crop a 48-by-48 green-display ROI, threshold, label components and create a Matplotlib overlay with the true source pixels and a transparent candidate mask. We can verify real figure bytes without claiming any of these are true nuclei.",
      "code": "from pathlib import Path\nimport io\nimport numpy as np\nfrom PIL import Image\nfrom skimage.measure import label,regionprops\nimport matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt\npath=Path('assets/witz/fluorescence-single.png')\nrgb=np.asarray(Image.open(path).convert('RGB'))\noriginal=rgb.copy()\nroi=rgb[:48,:48,1]\nmask=roi>127\nlabels=label(mask,connectivity=1)\nareas=[int(r.area) for r in regionprops(labels)]\nfig,ax=plt.subplots()\nax.imshow(roi,cmap='gray')\nax.imshow(np.ma.masked_where(~mask,mask),cmap='autumn',alpha=0.4)\nax.set(title='Rendered PNG ROI; unverified candidates',xlabel='x pixels',ylabel='y pixels')\nbuf=io.BytesIO()\nfig.savefig(buf,format='png',dpi=100)\nprint('ROI:',roi.shape,'source preserved:',bool(np.array_equal(rgb,original)))\nprint('Real overlay bytes:',len(buf.getvalue())>100,'calibrated:',False)\nplt.close(fig)",
      "focus": [
        22,
        23,
        24
      ],
      "visual": [
        [
          "Source",
          "real PNG decoded"
        ],
        [
          "Overlay",
          "real Matplotlib + threshold"
        ],
        [
          "Claim",
          "unverified display candidates"
        ]
      ],
      "output": "ROI: (48, 48) source preserved: True\nReal overlay bytes: True calibrated: False",
      "note": "This overlays rendered picture pixels and cannot reproduce nuclear localization in original HPA raw images.",
      "goal": "I13-CAPSTONE"
    },
    {
      "title": "Record source file hash and validation limitations",
      "say": "A reproducible audit should include source bytes, image path, channel, ROI, threshold, connectivity, candidate definitions and flags for calibration and annotation validity. A SHA-256 hash confirms source identity without converting the published screenshot into raw microscopy.",
      "code": "from pathlib import Path\nfrom hashlib import sha256\npath=Path('assets/witz/fluorescence-single.png')\nhash_value=sha256(path.read_bytes()).hexdigest()\naudit={'source':path.name,'roi':[0,48,0,48],\n       'channel':'rendered RGB green','threshold_gt':127,\n       'connectivity_2d':1,'raw_calibrated':False,\n       'segmentation_validated':False}\nprint('Hash chars:',len(hash_value),'ROI:',audit['roi'])\nprint(audit['raw_calibrated'],audit['segmentation_validated'])",
      "focus": [
        8,
        9,
        10
      ],
      "visual": [
        [
          "SHA-256",
          "64 hex characters"
        ],
        [
          "ROI",
          "48×48 at origin"
        ],
        [
          "Calibrated/validated",
          "False/False"
        ]
      ],
      "output": "Hash chars: 64 ROI: [0, 48, 0, 48]\nFalse False",
      "note": "Reproducibility is not biological validation; a raw TIFF, calibration and independent annotations would be needed for scientific claims.",
      "goal": "I13-CAPSTONE"
    },
    {
      "title": "Independent transfer: a new real-image ROI and threshold audit",
      "say": "Return to the real Python editor. Import the credited image if your browser Python filesystem does not already have it, then select a different forty-eight-by-forty-eight ROI and display component. Compute actual candidate counts at two predeclared thresholds, draw a true overlay and export an audit including source ID and unverified status. Do not reuse the completed crop.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "New ROI",
          "different coordinates and display component"
        ],
        [
          "Prove",
          "two thresholds and true overlay"
        ],
        [
          "Report",
          "source hash and valid limits"
        ]
      ],
      "output": "",
      "note": "This independent task uses a genuinely new region; do not claim raw acquisition fluorescence or biological cell identity from a published RGB figure.",
      "goal": "I13-CAPSTONE"
    }
  ]
}]);
})();
