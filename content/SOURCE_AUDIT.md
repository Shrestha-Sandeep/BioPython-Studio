# Source and rights audit — content pilot, 2026-11-06

## Primary source: Guillaume Witz

Repository: https://github.com/guiwitz/PyImageCourse_beginner  
Instructional notebook license: BSD-3-Clause. This pilot **does not copy prose, source code or image files**; all exercises and explanations below are independently authored. Witz's course structure and concepts inform the original tasks. Keep attribution, license notice and source URLs when later reusing any original notebook code.

Verified notebook structure:
- `01-Python_essentials.ipynb` — variables, execution order, functions, objects, packages and data structures. P01/P02 primarily use the variables-and-execution introduction (cells 0–24).
- `e01-Python_basics.ipynb` — exercise cells 1–6: numbers, arithmetic, types, text, uppercasing; exercise cells 7–9: imports and external image display. P01 borrows **skills only**, not prompts/solutions.
- `08-Logical_flow.ipynb` — explicit `if/elif/else`, `for`, `range` and mixed conditions (cells 2–27). Its sequence is intentionally brought forward for foundational use.
- `e08-Loops_conditions.ipynb` — 6 exercises on looping, generating values, conditionally appending to new lists. P03 applies the same underlying control-flow ideas to independent field-QC records.
- `Appendix_Structures.ipynb` — structured containers relevant to P03/P04.
- `Appendix_Functions.ipynb` — preparation for P05, not presented as fully covered here.

**Source-map correction to retain for later audit:** the existing `curriculum/witz_spine.json` marks e01 cells 5–6 as candidates for P02 labels/conditions. Those cells actually teach multi-word strings and `upper()`, not biological QC conditions. The P02 conditional material should cite Witz 08 as primary for its conditionals. No frozen competency ID is changed by this observation. Likewise, e01 cells 7–9 are image-import/plotting tasks; they belong in later image work rather than being confused with the P01 arithmetic practice.

## Supporting resources (linked and conceptually consulted, no text reuse)

- Jake VanderPlas, *Python Data Science Handbook*: https://jakevdp.github.io/PythonDataScienceHandbook/ — IPython/notebooks, debugging, later NumPy/Pandas and visualization. Repository code MIT; **book text CC BY-NC-ND**. No copying or adapting its explanatory text.
- Martin Jones, *Python for Biologists*: https://www.pythonforbiologists.org/ — biological strings, files, loops; independently written biology examples here. No assumption of open relicensing.
- Python tutorial: https://docs.python.org/3/tutorial/ — execution, values, control flow and exception semantics.

## Imaging and other later-stage sources

- Witz image data are from the Human Protein Atlas Cell Atlas (https://www.proteinatlas.org/); the Witz README reports CC BY-SA 3.0 for its images. Asset-by-asset origin, embedded metadata, attribution and license must be verified before bundling. **No image assets bundled in this initial pilot.**
- Bankhead *Introduction to Bioimage Analysis*: https://bioimagebook.github.io/
- Haase et al. *Bio-image Analysis Notebooks*: https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/
- The Carpentries image processing: https://datacarpentry.github.io/image-processing/
- scikit-image: https://scikit-image.org/docs/stable/
- Biopython Tutorial: https://biopython.org/DIST/docs/tutorial/Tutorial.html
- scikit-learn documentation: https://scikit-learn.org/stable/user_guide.html

## Attribution workflow for future assets

Record exact source URL, original creator, external license, transformation/crop details, download date, dimensions, color/channels, and verification outcome. Do not infer calibration from a rendered RGB JPEG or treat software-segmented candidates as validated biological objects.
