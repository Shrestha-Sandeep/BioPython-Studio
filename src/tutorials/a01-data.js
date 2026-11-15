// A01 native TIFF and calibration tutorial: synthetic source bytes, real library examples.
"use strict";
(()=>{window.BioPythonAdvancedTutorials=Object.freeze([...(window.BioPythonAdvancedTutorials||[]),{
  "id": "a01-chapter",
  "chapter": "A01",
  "title": "Audit a native microscopy TIFF",
  "short": "Axes, 16-bit pixels, scale evidence and original bytes",
  "minutes": "16–22 min",
  "goals": [
    "A01-G01",
    "A01-G02",
    "A01-G03",
    "A01-G04",
    "A01-CAPSTONE"
  ],
  "steps": [
    {
      "goal": "A01-G01",
      "title": "The destination: audit the native plane before measuring anything",
      "say": "A credible image-analysis report starts with original image bytes. It records the decoded pixel type, exact axes, selected channel and Z plane, and whether scale was independently verified. This lesson first builds an honest synthetic sixteen-bit TIFF and then takes its contents through a real Python audit.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Source",
          "Synthetic 16-bit TIFF"
        ],
        [
          "Selection",
          "Explicit T, C, Z"
        ],
        [
          "Output",
          "Traceable YX audit"
        ]
      ],
      "output": "",
      "note": "A synthetic TIFF proves software mechanics, not genuine acquisition calibration, specimen identity or biological segmentation."
    },
    {
      "goal": "A01-G01",
      "title": "Five axes describe different experimental dimensions",
      "say": "The letters T, C, Z, Y and X mean time, channel, focal plane, image row and image column. A NumPy shape alone provides lengths; an explicitly documented axis order tells us what those lengths mean.",
      "code": "import numpy as np\naxes='TCZYX'\ndata=np.zeros((2,3,2,2,3),dtype=np.uint16)\nprint(data.shape,axes,data.dtype)",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Axis order",
          "T C Z Y X"
        ],
        [
          "Shape",
          "2 · 3 · 2 · 2 · 3"
        ],
        [
          "Pixel type",
          "uint16"
        ]
      ],
      "output": "(2, 3, 2, 2, 3) TCZYX uint16",
      "note": "This axis order is declared for an invented array; real TIFF axes must be read from trustworthy source metadata and checked against shape."
    },
    {
      "goal": "A01-G01",
      "title": "Selecting T1, C2 and Z0 keeps only Y and X",
      "say": "The first three indices select one time, channel and focal plane. The remaining two axes form a two-row, three-column image. The returned values demonstrate precisely which numerical plane was selected.",
      "code": "import numpy as np\ndata=np.arange(72,dtype=np.uint16).reshape(2,3,2,2,3)\nplane=data[1,2,0]\nprint(plane.tolist())",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Chosen time",
          "T = 1"
        ],
        [
          "Channel / Z",
          "C = 2, Z = 0"
        ],
        [
          "Plane YX",
          "[[60,61,62],[63,64,65]]"
        ]
      ],
      "output": "[[60, 61, 62], [63, 64, 65]]",
      "note": "A plausible looking image from the wrong channel or Z plane can invalidate downstream biological comparisons."
    },
    {
      "goal": "A01-G01",
      "title": "Name-based selectors prevent silent axis confusion",
      "say": "Instead of relying on guessed positions, build indices from the declared axis string. The same logic can be adapted to source files whose dimension order differs, once the axes are validated.",
      "code": "import numpy as np\naxes='TCZYX'\ndata=np.arange(72,dtype=np.uint16).reshape(2,3,2,2,3)\nchosen={'T':1,'C':2,'Z':0}\nselectors=tuple(chosen.get(axis,slice(None)) for axis in axes)\nplane=data[selectors]\nprint(plane.shape,int(plane[0,0]),int(plane[-1,-1]))",
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
          "Axis names",
          "T · C · Z"
        ],
        [
          "Remaining",
          "Y · X"
        ],
        [
          "Result",
          "(2,3), first 60, last 65"
        ]
      ],
      "output": "(2, 3) 60 65",
      "note": "A production helper must also reject duplicate axes, missing Y/X, and unselected multi-valued T/C/Z, as the existing native image auditor does."
    },
    {
      "goal": "A01-G01",
      "title": "Reject invalid channel choices rather than guessing",
      "say": "The invented stack has three channels, numbered zero through two. Channel three does not exist. A safe audit stops with an informative error rather than selecting an arbitrary fallback image.",
      "code": "shape=(2,3,2,2,3)\nrequested_channel=3\ntry:\n    if not 0<=requested_channel<shape[1]:\n        raise ValueError('invalid channel')\nexcept ValueError:\n    print('rejected channel 3')",
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
          "Valid C values",
          "0, 1, 2"
        ],
        [
          "Requested",
          "3"
        ],
        [
          "Outcome",
          "Reject and document"
        ]
      ],
      "output": "rejected channel 3",
      "note": "The local A01 utility refuses unspecified selectors for multi-valued dimensions; do not infer missing acquisition channels."
    },
    {
      "goal": "A01-G02",
      "title": "Native 40000 is valid uint16; uint8 conversion destroys it",
      "say": "A sixteen-bit pixel can store forty thousand, but an eight-bit array cannot represent it. Blind casting wraps the value to sixty-four; a bright pixel may appear dark after a destructive conversion.",
      "code": "import numpy as np\nnative=np.array([40000],dtype=np.uint16)\npreview=native.astype(np.uint8)\nprint(native.tolist(),preview.tolist())",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Native 16-bit",
          "40000"
        ],
        [
          "Forced 8-bit",
          "64"
        ],
        [
          "Consequence",
          "Lost numeric fidelity"
        ]
      ],
      "output": "[40000] [64]",
      "note": "This casting example is deliberately unsafe and shown to make the failure visible; it is not a recommended image display method."
    },
    {
      "goal": "A01-G02",
      "title": "Unsigned subtraction can wrap a negative number",
      "say": "Subtracting two hundred from a uint16 pixel of one hundred should yield minus one hundred mathematically. Instead, unsigned arithmetic wraps to a large positive integer, which could look like a dramatic biological signal.",
      "code": "import numpy as np\npixels=np.array([100,1000],dtype=np.uint16)\nunsafe=pixels-np.uint16(200)\nprint(unsafe.tolist())",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Original",
          "100, 1000"
        ],
        [
          "Background",
          "200"
        ],
        [
          "Wrong uint16",
          "65436, 800"
        ]
      ],
      "output": "[65436, 800]",
      "note": "The wraparound is a numerical datatype effect, not fluorescence or background. Never subtract directly in unsigned dtype."
    },
    {
      "goal": "A01-G02",
      "title": "Cast before subtracting, then apply the stated floor",
      "say": "Convert source pixels to a wide numeric type before background correction. The mathematical negative value can then be clipped to zero with an explicit documented policy, while preserving the unmodified original.",
      "code": "import numpy as np\npixels=np.array([100,1000],dtype=np.uint16)\ncorrected=np.maximum(0,pixels.astype(np.float64)-200)\nprint(corrected.tolist(),pixels.tolist())",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Safe float result",
          "0.0, 800.0"
        ],
        [
          "Original values",
          "100, 1000"
        ],
        [
          "Mutation",
          "None"
        ]
      ],
      "output": "[0.0, 800.0] [100, 1000]",
      "note": "Background correction has experimental assumptions; numerical safety does not prove that the estimated background is physically appropriate."
    },
    {
      "goal": "A01-G02",
      "title": "Predict the native-pixel candidate count",
      "say": "A synthetic native row contains one hundred twenty, eleven hundred and fifty thousand. If the strict illustrative cutoff is greater than one thousand, how many values pass? Predict the result before revealing it.",
      "code": "import numpy as np\npixels=np.array([120,1100,50000],dtype=np.uint16)\nprint(int((pixels>1000).sum()))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Pixel values",
          "120, 1100, 50000"
        ],
        [
          "Rule",
          "> 1000"
        ],
        [
          "Passing pixels",
          "Withheld"
        ]
      ],
      "output": "",
      "note": "This threshold produces candidate pixels, not cells or verified exophers. The number is deliberately withheld for prediction.",
      "checkpoint": true
    },
    {
      "goal": "A01-G02",
      "title": "Reveal: two values exceed the strict threshold",
      "say": "Eleven hundred and fifty thousand exceed one thousand, while one hundred twenty does not. The reproducible numerical result is two candidate pixels, not a count of biological objects.",
      "code": "import numpy as np\npixels=np.array([120,1100,50000],dtype=np.uint16)\nprint(int((pixels>1000).sum()))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "120",
          "Below cutoff"
        ],
        [
          "1100 and 50000",
          "Above cutoff"
        ],
        [
          "Passing pixels",
          "2"
        ]
      ],
      "output": "2",
      "note": "Connectivity, morphology, annotations and biological identity require additional methods and validation."
    },
    {
      "goal": "A01-G02",
      "title": "Change the display mapping, not the original pixels",
      "say": "A display preview may limit large intensities to make other pixels visible. Show that the preview's maximum is one while the source still contains its original fifty-thousand value.",
      "code": "import numpy as np\nnative=np.array([200,1000,50000],dtype=np.uint16)\ndisplay=np.clip(native,0,1000)/1000\nprint(int(native.max()),float(display.max()))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Native maximum",
          "50000"
        ],
        [
          "Display maximum",
          "1.0"
        ],
        [
          "Data integrity",
          "Original unchanged"
        ]
      ],
      "output": "50000 1.0",
      "note": "A LUT/preview is not a measurement. Its contrast settings and truncation must never be silently substituted for native intensity."
    },
    {
      "goal": "A01-G03",
      "title": "An OME pixel-size declaration is not calibrated evidence",
      "say": "Metadata may declare a physical pixel size, such as zero point two micrometres per pixel. Until that value is independently checked for the acquisition and analysis path, a scientific report must leave the physical area unknown.",
      "code": "area_px=25\ndeclared_um_per_px=0.2\nscale_verified=False\nphysical_area=area_px*declared_um_per_px**2 if scale_verified else None\nprint(physical_area)",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Declared scale",
          "0.2 µm/px"
        ],
        [
          "Verified?",
          "No"
        ],
        [
          "Reported area",
          "Unknown"
        ]
      ],
      "output": "None",
      "note": "Do not interpret a stored OME physical size as calibration automatically. Where a real experiment has validated scale, record how it was verified."
    },
    {
      "goal": "A01-G03",
      "title": "With verified scale, area uses the square of pixel size",
      "say": "If an independent calibration supports zero point two micrometres per pixel, a region covering twenty-five pixels has an area of one square micrometre. This is geometry, not a verified size of an actual biological structure.",
      "code": "area_px=25\nverified_um_per_px=0.2\narea_um2=area_px*verified_um_per_px**2\nprint(round(area_um2,2))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Region area",
          "25 px²"
        ],
        [
          "Verified scale",
          "0.2 µm/px"
        ],
        [
          "Physical area",
          "1.0 µm²"
        ]
      ],
      "output": "1.0",
      "note": "For non-square pixels, use verified X and Y scale separately. Biological masks and segmentation still need independent assessment."
    },
    {
      "goal": "A01-G04",
      "title": "A real Python round-trip decodes synthetic TIFF bytes",
      "say": "The Python tifffile library can encode a small invented sixteen-bit image into TIFF bytes and read it back. Comparing its decoded axes, dtype and pixel value is more meaningful than displaying a drawn matrix and claiming a file was processed.",
      "code": "import io,numpy as np,tifffile\nnative=np.array([[100,40000],[500,65535]],dtype=np.uint16)\nstream=io.BytesIO()\ntifffile.imwrite(stream,native,photometric='minisblack')\nwith tifffile.TiffFile(io.BytesIO(stream.getvalue())) as image:\n    series=image.series[0]\n    decoded=series.asarray()\n    print(series.axes,series.shape,series.dtype.name,int(decoded[0,1]))",
      "focus": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "visual": [
        [
          "Real operation",
          "Encode and decode TIFF"
        ],
        [
          "Decoded dtype",
          "uint16"
        ],
        [
          "Native pixel",
          "40000"
        ]
      ],
      "output": "YX (2, 2) uint16 40000",
      "note": "These are genuinely encoded and decoded synthetic bytes; they are not acquired microscope data and contain no independent biological ground truth."
    },
    {
      "goal": "A01-G04",
      "title": "Fingerprint original bytes, not a rendered screenshot",
      "say": "A SHA-256 is computed on the TIFF byte stream before decoding. Reading an image must not alter its source bytes. Check that the digest is unchanged and contains sixty-four hexadecimal characters.",
      "code": "import io,hashlib,numpy as np,tifffile\nimage=np.array([[100,40000]],dtype=np.uint16)\nstream=io.BytesIO()\ntifffile.imwrite(stream,image,photometric='minisblack')\nbefore=hashlib.sha256(stream.getvalue()).hexdigest()\n_ = tifffile.imread(io.BytesIO(stream.getvalue()))\nafter=hashlib.sha256(stream.getvalue()).hexdigest()\nprint(before==after,len(before))",
      "focus": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "visual": [
        [
          "Hash target",
          "Original TIFF bytes"
        ],
        [
          "Read operation",
          "Non-mutating"
        ],
        [
          "SHA-256",
          "Same 64 hex digits"
        ]
      ],
      "output": "True 64",
      "note": "Do not hardcode a TIFF digest across encoder versions. Byte identity does not prove correct microscope metadata or scale."
    },
    {
      "goal": "A01-CAPSTONE",
      "title": "Capstone: a source-aware native-pixel audit",
      "say": "Integrate the source bytes, decoded YX shape, sixteen-bit intensity and candidate-pixel count into one concise report. Use an explicit threshold and leave unverified physical calibration false. The reported candidate pixels are only numerical threshold hits.",
      "code": "import io,hashlib,numpy as np,tifffile\noriginal=np.array([[100,40000],[500,65535]],dtype=np.uint16)\nbuffer=io.BytesIO()\ntifffile.imwrite(buffer,original,photometric='minisblack')\nraw=buffer.getvalue()\nwith tifffile.TiffFile(io.BytesIO(raw)) as t:\n    s=t.series[0];plane=s.asarray()\n    report={'shape':tuple(plane.shape),'native_dtype':s.dtype.name,\n            'candidate_pixels':int((plane>1000).sum()),\n            'sha256_length':len(hashlib.sha256(raw).hexdigest()),\n            'scale_verified':False}\nprint(report)",
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
        11,
        12
      ],
      "visual": [
        [
          "Native source",
          "Synthetic TIFF bytes"
        ],
        [
          "Pixel candidates",
          "Threshold only"
        ],
        [
          "Physical scale",
          "Unverified"
        ]
      ],
      "output": "{'shape': (2, 2), 'native_dtype': 'uint16', 'candidate_pixels': 2, 'sha256_length': 64, 'scale_verified': False}",
      "note": "Local A01 image_audit.py provides real-source memory limits, explicit axes and metadata checks; this short capstone is not a substitute for its real-data verification."
    },
    {
      "goal": "A01-CAPSTONE",
      "title": "Independent transfer: audit a different image without hints",
      "say": "Now take a different multi-channel synthetic source with a different channel, focal plane and native intensities. Check axis selection, source digest, pixel fidelity, candidate threshold and calibration flags independently. For actual microscopy, repeat on an original TIFF and document provenance.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "New source",
          "Independent T/C/Z decision"
        ],
        [
          "Numerical check",
          "No uint16 conversion loss"
        ],
        [
          "Research claim",
          "Source and calibration limits"
        ]
      ],
      "output": "",
      "note": "Independent Prove, delayed A01-REVIEW and a new local real-source audit remain unsolved. Human validation of pixels and acquisition metadata is essential."
    }
  ]
}]);})();
