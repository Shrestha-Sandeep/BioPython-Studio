# Witz course material and microscopy image attribution

The primary source of this application is Guillaume Witz and the University of Bern's *Image Processing for Beginners*, https://github.com/guiwitz/PyImageCourse_beginner.

**Notebook teaching content and exercise prompts:** BSD-3-Clause, as preserved verbatim below. Our own user interface and original tasks are distinct; reuse does not imply University of Bern endorsement.

**Microscopy source imagery:** Original Witz example data originate from the Human Protein Atlas Cell Atlas (Thul PJ et al., *Science* 2017, DOI 10.1126/science.aal3321). Witz's `images/LICENSE.txt` and README document CC Attribution-ShareAlike 3.0 for their copied image set. Image copies/derived output figures retain this attribution and applicable share-alike terms. The application does **not** claim these visualizations are calibrated raw fluorescence measurements. For source-specific conditions, consult the upstream repository and HPA.

**Bundled figures:** Each PNG below is a reproduced notebook cell output (not generated or hand-drawn by BioPython Studio). These PNGs are for teaching context; valid quantitative pixel analysis must use the source TIFF rather than screen pixels from charts. Figures are based on HPA source imagery.

| Bundled image | Witz notebook | Output cell |
|---|---|---:|
| `fluorescence-examples.png` | `Demo.ipynb` | 3 |
| `fluorescence-single.png` | `Demo.ipynb` | 12 |
| `otsu-nuclei-mask.png` | `Demo.ipynb` | 17 |
| `nuclear-intensity-histogram.png` | `04-Thresholding.ipynb` | 13 |
| `threshold-mask.png` | `04-Thresholding.ipynb` | 16 |
| `labeled-nuclei.png` | `06-Regions.ipynb` | 10 |

Original data examples include `images/8346_22_C1_1.tif` and `images/46658_784_B12_1.tif` in the upstream Witz repository. These TIFFs are linked but not currently packaged locally due to their substantial size; **a PNG copied from a plotting output must not substitute for a raw TIFF**.

## Witz course BSD-3-Clause license (verbatim)

BSD 3-Clause License

Copyright (c) 2021, University of Bern, Mathematical Institute and Microscopy
Imaging Center, Guillaume Witz

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
