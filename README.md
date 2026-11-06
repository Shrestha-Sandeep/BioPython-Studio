# BioPython Studio

A focused, beginner-to-applied **scientific Python training app for a biologist with microscopy experience**. Executable exercises, attributed book/course adaptations and real microscopy images are used to teach general Python, NumPy, quantitative image analysis, Pandas, statistical reasoning, bioinformatics and introductory scientific machine learning. No arcade characters or streaks.

**[Open the current GitHub-connected app](https://biopython-two.vercel.app/)** · [Complete curriculum](CURRICULUM.md) · [Companion research notebook](notebooks/BioPython_Research_Companion.ipynb)

## Goal and current development focus

**Goal:** enable a biologist with little Python experience to independently write, debug and explain a reproducible microscopy analysis using real, appropriately documented data.

| Milestone | Evidence needed |
|---|---|
| **1 — Current: validate beginner teaching** | First-15 practice, representative independent and delayed checks, explanations reviewed by a person, and reported difficulties addressed. |
| 2 — Independent Python foundations | A small biological project combining values, control flow, collections, functions and files without a supplied solution. |
| 3 — Defensible microscopy workflow | Real-image provenance/axes, ROI/segmentation/measurement, and an explanation of calibration and validation limits. |
| 4 — Reproducibility | A notebook and traceable outputs another person can reproduce from a clean environment. |

**Current study path: Python → Microscopy → NGS → ML. Every implemented exercise and activity stage is open.** This user-directed presentation supersedes the earlier optional-path and prerequisite-lock policy. The prerequisite graph remains a teaching-order guide, with stable competency IDs and preserved saved progress. Further content expansion remains paused while pilot evidence is evaluated; existing content is freely browsable.

Milestone 1 uses a small, explicit evaluation protocol for one learner:

1. Practice the frozen first 15 activities; record confusion or technical blockers with the existing feedback control.
2. Collect unassisted changed-input evidence for **008 (specimen labels), 025 (QC function), and 038 (array shape/axes)**. These are representative existing competencies, not three new lessons or a certification of all 15.
3. For those same competencies, complete fresh delayed checks at least 24 hours after independent evidence. Hints and self-declared outside help count as assistance; assisted practice may need two review intervals. Failed/repeated prompts do not create retained evidence, and exhausted prompts require human follow-up.
4. Explain the code in your own words. A person reviews inputs/outputs, reasoning and a relevant boundary or scientific limitation against the saved code. Text edits invalidate the review; earlier reviewed explanations are preserved in history.
5. Review each reported explanation need or technical issue and record what changed. New feedback reopens the need for review. Export the pilot evidence report, then make a human decision about teaching quality, unresolved software issues and the next increment.

The main screen shows the current exercise on one course path. Optional goals, reports, feedback, backups and review rubrics are collapsed under Progress & study tools. That panel recommends pilot actions and reports what evidence is missing. A report can become **ready for human sign-off**; it never automatically certifies teaching effectiveness, approves a release or expands the curriculum. Timing uses the learner’s device clock, and outside assistance/reviewer judgments are self-reported. CI/runtime verification remains separate in [TEST_REPORT.md](TEST_REPORT.md). Use the full progress export for backups; the narrower pilot report includes selected code, attempts, explanations and feedback for review.

Every development increment must identify **the milestone, the concrete learner problem, the evidence that will show improvement, and the next unresolved action**. The PR template records those choices. The immediate next work is collecting genuine pilot evidence and correcting demonstrated friction; foundation expansion resumes after that review.

## v3 development preview

The `feature/v3-pilot-milestone` evaluation branch is stacked on `feature/v3-foundations-collections`; that continuation is stacked on the `feature/v3-learning-engine-pilot` branch and builds on the unchanged frozen design in [PR #1](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/1), above the 61-lesson baseline. This work is a development preview; production and the curriculum PR remain unmerged.

- The preview includes **28 current activities**, plus preserved historical exercises in the same course menu. Predict, Run, Investigate, Modify, Write and Debug can be opened directly; navigation never awards completion. The first-15 pilot group remains available for evaluation, while `recommended_complete_route` defines the single visible course order. Authentic HPA microscopy is visible from the first activity.
- A real Pyodide Worker executes examples and assessments, including traceback/help behavior, changed-input and edge checks, explicit floating-point input types, bounded loops, and progressive hints.
- Evidence distinguishes explored, guided, independent, needs review and retained. Independent evidence requires a successful blank-editor check without hints. Delayed transfer opens after 24 hours, uses one of three fresh input sets, and cannot award retention from a corrected failed attempt or a repeated prompt. Automated clock advancement tests the mechanism; it is not evidence of actual learner retention.
- A **single 156-competency route** runs Python → Microscopy → NGS → ML in prerequisite-safe teaching order. The current and historical exercise sets produce **78 distinct available competency entries** (28 current activities plus nonoverlapping historical exercises). Main navigation prefers current activities and deduplicates legacy aliases. This is not a claim that 78 competencies have completed the full v3 upgrade. The original 61 IDs/drafts stay addressable through legacy links and exports. Unimplemented content is not represented as runnable.
- The notebook-workflow activity includes a genuine two-cell Python lab: values persist between runs, edits do not execute automatically, and Restart kernel terminates the Worker and starts a new Python runtime. Download a valid `.ipynb` containing your own cell drafts with no stored outputs; open it in Jupyter and Restart & Run All. The app remains a focused learning tool, with assessment namespaces isolated from notebook state.
- The continuation teaches ID parsing, range/enumerate, bounded while loops, break/continue, list copying, tuple unpacking, dictionaries/nested records, sets, comprehensions, dictionary iteration and length-checked zip pairing. It preserves original data during list edits and rejects silently truncated pairings.
- Optional activity feedback records clarity/difficulty notes locally and in progress exports so a real learner can document pilot friction without awarding mastery.
- Transfer practice is always available. Opening an early prompt records exposure and consumes that prompt from the fresh-review pool; it never awards independent or retained evidence. Exhausted prompts remain available for practice. Due reviews have a visible reminder. Failed checks show the actual failing input and traceback. Progress imports restore untouched landing records and the saved position; existing substantive drafts remain protected in conflicts.
- V3 state lives in `biopython_studio_v3`. The original `biopython_studio_personal_v1` key stays intact; complete raw legacy snapshots, aliases, drafts and hint history are preserved. Legacy completion never awards v3 mastery. Export/import keeps conflicting records in an archive rather than overwriting local drafts. On another device, the [legacy page](legacy.html) can reopen imported historical drafts when the original key is absent.

The frozen syllabus and [manifest](curriculum/v3_manifest.json) remain authoritative. Activity content is in `curriculum/v3_pilot.json`; state/graph rules are in `learning-state.js`; the UI is `pilot.js`; both old and new Python assessments execute in `worker.js`. No framework, backend account or AI service was introduced.

## Existing 61-lesson implementation

- **61 sequential, executable exercises:** 25 original lessons followed by 36 additional intermediate/specialist exercises. Each has a specific task, preloaded variables, editable real Python, hints, verified outputs and changed-input evaluation. The course navigator stays collapsed by default.
- **Real HPA microscopy photographs** fetched from the publisher as needed, with image arrays derived from the decoded blue channel. The visually displayed field matches the inspected teaching array. Truncated downloads are rejected with a Retry control.
- **Real browser Python (Pyodide)** loads scientific libraries on demand. Tested local Python equivalence includes NumPy, Pandas, SciPy, scikit-image, Matplotlib, Biopython and scikit-learn. A first cold download may require substantial time and internet access.
- **Progress is saved locally** in `biopython_studio_personal_v1`, preserving all old lesson identifiers; progress does not synchronize between browsers or devices.
- **Runnable notebook** with HPA download, SHA-256 provenance, segmentation of candidate regions, biological-replicate-aware tables, figures and CSV/JSON exports. An optional cell can read a real user-supplied TIFF/OME-TIFF.

## Scientific limitations

The HPA images are **RGB fluorescence JPEG composites, not raw calibrated fluorescence data**. Any pixel sizes used in the exercises are explicitly illustrative. Binary masks, connected regions, local peaks and machine-learning labels are not verified biological objects; a validated exopher/aggregate/cell detector would require appropriately annotated reference images, acquisition controls and independent evaluation. The FASTA/FASTQ, NGS, experimental metadata, physical-unit and machine-learning datasets are authored teaching examples. Do not infer drug effects or statistical independence from microscope fields.

The in-app course teaches executable scientific Python but is **not an AI conversational tutor, full Jupyter environment, clinical predictor, or validated raw-TIFF analysis tool**. Use the companion notebook for genuine Jupyter transfer and optional real local TIFF inspection.

## References and attribution

Two primary curricular references: [Guillaume Witz, Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner) and [Jake VanderPlas, Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/). Selective references include [Introduction to Bioimage Analysis](https://bioimagebook.github.io/), [Bio-image Analysis Notebooks](https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/), [The Carpentries Image Processing](https://datacarpentry.github.io/image-processing/), [Python for Biologists](https://www.pythonforbiologists.org/), [Biopython tutorial](https://biopython.org/DIST/docs/tutorial/Tutorial.html) and [scikit-learn documentation](https://scikit-learn.org/stable/user_guide.html).

Image credit: **Human Protein Atlas**, including [HPA-8346](https://images.proteinatlas.org/8346/22_C1_1_blue_red_green.jpg), [HPA-46658](https://images.proteinatlas.org/46658/784_B12_1_blue_red_green.jpg), and [HPA-23394](https://images.proteinatlas.org/23394/182_H7_1_blue_red_green.jpg). See [HPA data terms](https://www.proteinatlas.org/about/licence), currently CC BY 4.0; Thul PJ et al., *Science* (2017), DOI 10.1126/science.aal3321. The images are requested from the publisher with explicit attributions. The array worked examples now adapt MIT-licensed VanderPlas code and BSD-licensed Witz exercises, credited in Notes & book exercise and [reuse notices](docs/THIRD_PARTY_NOTICES.md). Existing independent checks and saved drafts are retained. The book exercise selection is reused within existing competencies instead of adding duplicate lessons. Further expansion should first map a suitable licensed source exercise to the existing competency, then add only the missing context, feedback and changed-input checks. Separately licensed book prose is linked rather than adapted.

## Run and test

Static deployment: host this repository as files (Vercel, GitHub Pages or a local HTTP server). Python runs in a Web Worker via an external Pyodide CDN. No server-side account is necessary. The Python execution boundary is for *the learner's own code*, not a hardened arbitrary-code sandbox.

```bash
python -m pip install numpy pandas scipy scikit-image scikit-learn biopython matplotlib pytest pillow playwright nbformat requests ipython
python -m pytest -q tests/test_harness.py tests/test_chunk1.py tests/test_full.py tests/test_notebook.py tests/test_curriculum_v3_contract.py tests/test_pilot.py
node --test tests/test_learning_state.cjs tests/test_milestones.cjs tests/test_course_path.cjs
python -m playwright install chromium
python tests/test_complete_ui.py
python tests/test_pilot_ui.py  # live CDN + HPA access; no mocked runtime
```

See [TEST_REPORT.md](TEST_REPORT.md) for verification status and outstanding live-browser checks. The frozen v3 design is authoritative for development; GitHub `main` remains the production line and Vercel is the deployment target. Keep app UI minimal, maintain this README/CURRICULUM rather than spawning blueprints, and preserve the original 25 lesson IDs. BioCompute and AppDeploy ImageLab are separate projects.