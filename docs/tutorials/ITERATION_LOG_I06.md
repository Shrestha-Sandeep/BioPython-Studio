# I06 tutorial iteration log — candidate labels, exclusion policy, and z awareness

**Date:** 2026-11-13  
**Blueprint:** `docs/tutorials/I06_RESEARCH_BLUEPRINT.md` committed before implementation  
**Branch:** `feature/imaging-tutorial-cycle-i06`  
**Review state:** GO for code/content review; not a learner mastery claim and not production.

## Scientific scope

18 scenes cover all seven canonical I06 goals and the capstone: explicit morphology footprints, four/eight connectivity, pixel-area exclusion thresholds, acquisition versus crop borders, marker-controlled watershed, true separated-z volumes versus XY projections, and parameterized source-preserving reports. One checkpoint withholds the four-neighbor diagonal count until the next scene; the last scene requires a fresh self-written input.

The 16 original I06 diagrams increase the imaging diagram library from 61 to 77. Pair diagrams distinguish supplied synthetic binary masks from their algorithmic labels or cleaned masks. Credited Witz/HPA imagery is displayed as separate, non-calibrated teaching context; the tutorial never claims to measure or count verified nuclei from that source.

## API audit

- Pinned test stack: NumPy 2.3.5, scikit-image 0.26.0; code also uses SciPy distance transforms.
- `skimage.morphology.binary_opening`/`binary_closing` are deprecated in 0.26; new tutorial examples deliberately use `opening`/`closing` with explicit footprints.
- The 0.26 `remove_small_objects(max_size=...)` boundary semantics differ from the previous `min_size`. To avoid ambiguity, tutorials use `regionprops` with explicit inclusive inequalities.
- 3D separated-voxel example includes an *empty* intermediate optical section. Adjacent z voxels would be one 3D connected component. This distinction was tested before publishing the example.

## QA and corrective cycle

1. Initial fresh CPython matrix tests locally confirmed morphology area changes, four/eight component counts, strict area screens, border clearing, two/one watershed marker output, XY projection loss, and source-preserving capstone.
2. GitHub Actions run **43517628485**: numerical and unit/diagram checks PASSED, browser check FAILED. Root cause: the *browser test's expected output* was written as literal backslash-n instead of a newline for the two-line prediction reveal. This was a test expectation bug, not an algorithm result.
3. Corrected the browser test without weakening the expected scientific result, commit **417a309798c35242d96175e43b2ca5ed8e6ba999**; no lesson result was modified to satisfy the test.
4. GitHub Actions run **43517969941**: complete imaging tutorial workflow **SUCCESS**, including JS syntax, exact real CPython outputs, changed-input checks, original diagram checks, published image loading, mobile viewport 390px, desktop 1280px, independent prediction privacy and no editor/localStorage mutation. UI-first-2 and consolidated release-contract workflows also passed.

## Outstanding evidence

Passing automated QA does not demonstrate nucleus detection accuracy, valid biological replicate identity, manually annotated object F1, usable narration with every installed voice, or independent learner skill. These require review/real learning tasks.

**Verdict:** GO to I07 research; retain I06 as draft PR #42 until chapter sequence is reviewed. Production `main` remains untouched.
