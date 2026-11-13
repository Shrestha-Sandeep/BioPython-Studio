# I04 iterative tutorial QA and review record

**Date:** 2026-11-13
**Branch:** feature/imaging-tutorial-cycle-i04
**Parent:** feature/imaging-tutorial-cycle-i03
**Research blueprint:** docs/tutorials/I04_RESEARCH_BLUEPRINT.md

## Scope completed

Six shipped goals I04-G01–G06 and capstone preserved; 16 narrated, learner-paced scenes covering figure/axes labels, line vs scatter meaning, histogram bins and counts, two-panel plotting, imshow display settings, and synthetic RGB display-pixel histograms. Exactly one prediction checkpoint with a withheld answer; independent changed-input task has no worked solution.

Twelve targeted original diagrams, including a clear distinction between connected lines and scatter points, histogram bins with actual counts, and two distinct gray display mappings of unchanged sample numbers. The published Witz/HPA PNG appears only as a **credited rendered microscopy example**, not as original calibrated detector values or the origin of synthetic observations.

## Research and revision loop

1. **Research first:** Witz notebooks, Bankhead image/display distinction, Matplotlib figure/axes/imshow, NumPy histogram bin semantics; committed I04 blueprint before implementation.
2. **Early scientific correction:** The first narrated histogram counts were written as [1,2,0,1], but np.histogram([1,1,2,3], bins=[0,1,2,3,4]) returns [0,2,1,1]. Corrected narrative, value cards and stdout before CI.
3. **Prediction integrity correction:** The first display-contrast explanation gave away the source-array equality check before asking for a prediction. Reordered disclosure: scene 9 only displays color limits; scene 10 withholds the equality answer; scene 11 reveals verified True.
4. **Automated QA failure:** The first run found three out-of-range highlighted code lines because a shared snippet was shortened. Corrected all three by comparing every focus value against its current code length.
5. **Final QA:** GitHub Actions run **43408750287** on code SHA **b7423acd819d9827727bfaa7f21a7197e3d8b37f** completed **SUCCESS**. It includes Node module/schema and 50 I01–I04 SVG checks, fresh Python NumPy/Matplotlib stdout comparisons, changed-input contrast/histogram tests, and Chromium mobile 390px + desktop 1280px chapter navigation, prediction, image loading and editor/progress isolation.

## Review result

**GO for implementation review and continuation to I05.** Technical and scientific guardrails pass the automated gates. No unassisted learning-outcome study has yet been performed, so no unsupported "9.5/10 learner effectiveness" claim. The UI-first-2 production app and progress storage remain unchanged; this is a stacked development branch.
