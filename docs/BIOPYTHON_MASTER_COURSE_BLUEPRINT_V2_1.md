# BioPython Studio — Master Course Content & Chapter-Generation Blueprint

**Version:** 2.1 — final learning-platform research integration; inspectable execution and scientific-transfer specifications  
**Date:** 7 November 2026  
**Status:** DESIGN-REVIEW TARGET 95+/100 IN EACH DIMENSION; NOT A CLAIM OF EXPERIMENTALLY VERIFIED LEARNING OR MOTIVATION / NOT COMPLETED CHAPTERS OR AN INTEGRATED APPLICATION  
**Primary purpose:** Direct the systematic creation, verification and one-chapter-at-a-time integration of high-quality Python-for-biology course content into the **frozen BioPython Studio UI-first interface**.  
**Audience:** One scientifically experienced learner (molecular biology, genetics and fluorescence microscopy) with foundational but incomplete Python fluency.  
**Source precedence:** Frozen 156-competency v3 manifest → 26-mission Witz-first route → this authoring blueprint → individual chapter packages. The blueprint does **not** supersede stable curriculum IDs, modify prior progress, or unfreeze the interface.

> **Operational directive:** Do not generate all 26 finished chapters in one batch. Develop one chapter to the acceptance criteria below, test it, then import it through a controlled content integration. Repeat. Existing P01–P03 material in draft PR #10 is **prototype content**, not certified complete chapters.

## Contents

> **Version 2.1 principle:** High-quality content must both *teach transferable Python* and *create a reason to return voluntarily*. Both are evaluated separately. A score target is not a measured learning outcome.

1. [Executive decisions and scope](#1-executive-decisions-and-scope)
2. [Curriculum authority, identity and route](#2-curriculum-authority-identity-and-route)
3. [Learning science, motivational design and adaptive instruction](#3-learning-science-and-instructional-design)
4. [Required anatomy of every chapter](#4-required-anatomy-of-every-chapter)
5. [Mini-goal and activity authoring rules](#5-mini-goal-and-activity-authoring-rules)
6. [Source research and copyright strategy](#6-source-research-and-copyright-strategy)
7. [Real biological data and asset contract](#7-real-biological-data-and-asset-contract)
8. [Scientific accuracy and reproducibility contract](#8-scientific-accuracy-and-reproducibility-contract)
9. [Content package and machine-readable import contract](#9-content-package-and-machine-readable-import-contract)
10. [Runtime, assessment, progress and accessibility](#10-runtime-assessment-progress-and-accessibility)
11. [Chapter-to-UI integration protocol](#11-chapter-to-ui-integration-protocol)
12. [Quality gates, review and release criteria](#12-quality-gates-review-and-release-criteria)
13. [Detailed 26-chapter syllabus](#13-detailed-26-chapter-syllabus)
14. [Canonical 156-competency coverage catalog](#14-canonical-156-competency-coverage-catalog)
15. [Reusable chapter-writing template](#15-reusable-chapter-writing-template)
16. [Development sequence, risk register and change policy](#16-development-sequence-risk-register-and-change-policy)
17. [References and verified source links](#17-references-and-verified-source-links)
18. [Empirical pilot and 95-point review standard](#18-empirical-pilot-and-95-point-review-standard)
19. [Learning-platform research synthesis and final implementation specifications](#19-learning-platform-research-synthesis-and-final-implementation-specifications)

---

## 1. Executive decisions and scope

### 1.1 Product outcome

Teach a molecular biologist and microscopist to **understand, write, debug, validate, explain and reproduce actual scientific Python programs**, beginning with simple specimen records and culminating in an auditable microscopy image-analysis pipeline. Reuse those skills in introductory sequence/NGS analysis and group-safe biological machine learning.

The application is not primarily an IDE clone, a digital bookshelf, a sequence of trivially passing snippets, a motivational game, a collection of disconnected quiz cards, or an attempt to train a full-stack developer. A chapter succeeds when the learner can independently perform a scientific programming task, not when material has merely been displayed.

### 1.2 Frozen decisions

| Topic | Binding decision | Implication for chapter authors |
|---|---|---|
| Course authority | 156 distinct competencies, 14 modules; 61 historical IDs mapped | Never silently renumber or redefine an existing competency |
| Presentation | 26 cumulative Witz-led missions, Python → Microscopy → NGS → ML | Chapters are missions, not 156 separate screens |
| Navigation | One visible recommended path; access to all chapters remains unlocked | Prerequisites advise and flag preparation; they do not conceal content |
| Primary intellectual spine | Guillaume Witz, *Image Processing for Beginners* | Audit notebooks/exercises carefully and preserve a source-to-content trace |
| Complementary sources | VanderPlas, Python for Biologists, Bankhead, Carpentries, Bio-image Analysis Notebooks, official Python/NumPy/Pandas/scikit-image/Biopython/scikit-learn docs | Add depth where demonstrably needed; do not create repetitive parallel courses |
| Learning framework | Learn → Apply → Prove, including Predict → Run → Investigate → Modify → Write → Debug/Transfer | Worked code fades toward a blank editor and unfamiliar task |
| Scientific validity | Provenance, units, replicate structure, annotations, validation and limitations | Every quantitative claim specifies what its data support |
| Interface | Frozen CodeMirror-based UI-first workspace | Import content into existing surfaces; no discretionary redesign |
| Computing | Actual Python execution, not mocked output | Test snippets in CPython and (for browser lessons) real Pyodide |
| Learner progress | Preserve drafts, old keys, aliases and evidential distinctions | Never award independent mastery based on migrated guided completion |
| Learning approach | Quiet, focused, task-first, no streaks, XP or decorative dashboards | Short active prompt; deeper textbook explanation available on demand |
| Development | One chapter, complete verification, then controlled import | Do not write or merge the entire course at once |

### 1.3 Scope boundaries

**Included:** essential programming foundations; NumPy; scientific figures; Pandas; real microscopy images; image interpretation, filtering and segmentation; reproducible biological measurements and statistics; basic Biopython/NGS; defensible introductory ML; independent research-style projects; local Jupyter/terminal/Git transition.

**Not required for course completion:** application/web development, arbitrary deep-learning architectures, massive genomics pipelines, production cluster/cloud infrastructure, complex image registration, commercial microscope-instrument control, or state-of-the-art instance segmentation. Those are possible future electives only if the user's goals materially change.

**Other project boundaries:** Do not modify BioCompute or ImageLab. Do not resurrect old competing UI prototypes. Do not use the blueprint as permission to merge outstanding draft PRs or deploy to production.

### 1.4 Success standard

A successful learner can open a new biological dataset, articulate the experimental question and unit of analysis, identify relevant metadata, select appropriate Python tools, write and debug an analysis, test inputs and assumptions, produce a traceable output, and explain what the result does **not** establish. Learner independence and scientific validity outrank chapter count or visual polish.

### 1.5 The dual excellence objective: proficiency *and* voluntary continuation

A course that is cognitively rigorous but dull will be abandoned; a course that feels lively but fails independent transfer is not worth building. The v2 objective is to clear **two separate, weighted design reviews at ≥95/100 each**: (1) pedagogical alignment/transfer, and (2) autonomous motivation/continuity. The rubric in §18 operationalizes this target; scores are not to be invented before review.

- **Pedagogical promise:** the learner can write, troubleshoot, transfer and scientifically audit code without an accompanying solution.
- **Motivational promise:** the learner sees a meaningful scientific result early, has choices and manageable difficulty, can stop and resume without friction, and feels progress through growing competence rather than streaks.
- **Success is behavioral:** a completed mini-goal leaves an inspectable artifact; an independent challenge can fail without punishment; return after interruption is easy and self-directed.
- **No manipulative retention:** no badges, XP, guilt, artificial scarcity, daily deadlines, leaderboards, popup encouragement or coercive notifications.
- **Do not conflate:** confidence/interest surveys are useful feedback but not proof of mastery; passing reference tests is not proof of motivation or retention.

### 1.6 One evolving scientific workbench, not 26 disconnected tutorials

Introduce the **research story** immediately: a set of attributed fluorescence image files has accompanying specimen/field metadata and needs a reproducible measurement report. The learner first organizes the *records* (P01–P06), then operates on image arrays (I01 onward), then builds and validates the pipeline (I13). The images may be displayed as genuine contextual material before NumPy is taught; never pretend that P01 code already performs image analysis. Each chapter ships a small, visible addition to a cumulative, exportable project. Specialist NGS and ML paths start a new project that reuses existing Python skills instead of reteaching them.

This creates **goal continuity** without hiding prerequisite structure. A chapter's result should visibly unlock a useful next operation: label files → validate records → filter fields → build metadata → write reusable functions → load image arrays → measure → validate → report.

---

## 2. Curriculum authority, identity and route

### 2.1 Authoritative sources of truth

- **Competencies:** `curriculum/v3_manifest.json` on `docs/frozen-v3-curriculum` — exact semantic IDs, titles, prerequisites, default route, optional paths and mappings from all 61 historical IDs. Corresponding readable design is `docs/CURRICULUM_V3_FROZEN.md` in draft PR #1.
- **Mission presentation:** `curriculum/witz_spine.json` and `docs/WITZ_FIRST_LEARNING_SPINE.md` on `feature/witz-first-learning-spine`, draft PR #7. The 26 missions assign each of the 156 competency numbers **exactly once**.
- **Frozen interface:** `docs/UI_DESIGN_FROZEN.md` on `feature/ui-first-ide-workspace`, draft PR #9; preservation baseline `frozen/ui-v2-2026-11-06` (frozen reviewed commit `34736ad6f565f22beee3b3fd259b315a197ed376`).
- **Existing content drafts:** `content/` on `content/textbook-foundations-v1`, draft PR #10; its initial P01–P03 chapters, 12 activities and 37 CPython reference fixtures are prototypes, **not completed lessons**.

**Identity rule:** The canonical stable ID is the `bps3.*` semantic ID from v3 manifest, not the ordinal number. In this document, numbers such as `001` are human-readable shorthand. Store and validate **both** in a final content package; canonical IDs win if order changes.

### 2.2 Three layers, no duplication

1. **Competency** — smallest distinct learnable programming or scientific-decision capability. Canonical and stable; e.g., `038` shape/ndim.
2. **Mini-goal** — one concrete learner action and result that may teach, practice or combine several competencies. Has its own stable ID and clear proof condition.
3. **Chapter/mission** — a cumulative scientific deliverable encompassing several mini-goals and a genuine independent task. One of P01–P06, I01–I13, N01–N04 or L01–L03.

An **activity** is a runnable interaction within a mini-goal (predict, modify, write, debug, transfer). An activity is not automatically a competency, and a chapter is not automatically a single lesson.

Do not inflate counts with recap quizzes, duplicate solutions, multi-part explanations or report-writing practice; such work belongs under existing competencies as reinforcement. Track **introduced**, **practiced**, **independently demonstrated**, and **retained** separately.

### 2.3 Fixed topology and paths

| Stage | Chapters | Competencies | End product |
|---|---:|---:|---|
| Python | P01–P06 | 36 | Verified, reusable specimen metadata/QC script and local Python handoff |
| Microscopy | I01–I13 | 91 | Traceable multi-image fluorescence pipeline with measurement/validation/report |
| Sequence/NGS | N01–N04 | 17 | Small defensible sequence/NGS QC analysis |
| ML | L01–L03 | 12 | Group-safe baseline prediction pipeline and assessment |
| **Total** | **26** | **156** | Cumulative scientific programming capability |

These presentation-stage allocations reflect the verified Witz-first **26-mission** map, not an alternate 14-module syllabus. In the v3 manifest, NumPy/Pandas/plots/statistics are foundation/shared modules, but are taught in the microscopy-applied stage. That is intentional.

The v3 syllabus also describes a 127-competency default microscopy route, plus 17 sequence/NGS and 12 ML competencies. The route is a recommendation, not an access lock. **An early genuine fluorescence image may be displayed for context on day one**, with correct attribution; do not require NumPy processing before its prerequisites.

### 2.4 Ordering, ownership and prerequisite auditing

- For every new mini-goal, list `introduced_competency_ids` and `reused_competency_ids`. At chapter acceptance, every assigned competency must be explicitly introduced or demonstrated and included in an assessment map.
- Respect the DAG in v3 even where numeric order differs: for instance, looping over lists (012) needs list indexing (016). Teach the smaller prerequisite first in the actual sequence.
- Do not require completion of unrelated microscopy material before allowing sequence or ML preview. Offer a clearly labeled readiness note when relevant prerequisites are missing.
- Annotate planned lessons as planned, not available or complete. A mission may be visible before its package exists.
- Changes in chapter order must preserve competency IDs, activity IDs where semantically unchanged, old progress, and transparent migration mappings.

---

## 3. Learning science and instructional design

### 3.1 The core learner model

Assume high biological literacy and strong intuition for microscopy, controls, measurement error and experimental design, but limited comfort with Python syntax, abstract programming terminology and debugging. Avoid elementary explanations of basic biology. Use biological context to reduce irrelevant cognitive load, not to hide the programming concept.

Prefer a clear progression: **what we want scientifically → what information we have → the Python construct that helps → actual code → expected result → limitations → new situation**. Python terminology must still be taught accurately so skills transfer outside biological examples.

### 3.2 Learn → Apply → Prove

**Learn** (supported): show a short biological problem, ask for a prediction, run authentic Python, inspect its state/output and experiment with a small change. Introduce concise technical vocabulary and show an explanation that addresses why the code works. Use gradually faded worked examples.

**Apply** (partial support): require the learner to combine recently learned ideas in an existing cumulative scientific program. Supply context and input data, but not a near-complete solution. The learner should produce a named intermediate artifact (e.g., a validated specimen ID, an ROI mask, a CSV report).

**Prove** (independent): present a materially different problem with a blank or minimally scaffolded editor, unfamiliar data, boundary cases and scientific interpretation. The supplied solution must not be visible until the attempt is finished or explicitly abandoned. A later transfer on new data strengthens retained evidence.

The underlying PRIMM-inspired sequence (Predict → Run → Investigate → Modify → Make) is extended here to **Write / Debug / Transfer**; it is a teaching sequence, not a mandate for six separate screens per mini-goal. Group small phases when they form one coherent interaction.

### 3.3 Worked examples and fade-out policy

- Start with one small correct worked example (preferably 5–15 lines, longer only where necessary).
- Ask for a prediction that reveals a specific misconception, not an arbitrary recall fact.
- Show input and genuine output or traceback; explain only the few lines necessary to understand the result.
- Modify one semantic element at a time. Avoid changing five new constructs at once.
- Request an independent rewrite from an empty editor after guided practice.
- Revisit a previously taught concept through a later real task, explicitly tagged **retrieval/practice**, not a new competency.
- For advanced chapters, progressively replace line-by-line guidance with API references, scientific requirements and acceptance tests.

### 3.4 Common failure modes to design against

| Failure | Prevention |
|---|---|
| Reading text feels like learning but writing remains difficult | Every substantive mini-goal includes blank-editor creation or debugging |
| Learner can only repeat a memorized snippet | Test changed data shape, naming, values, boundary and biological context |
| Hardcoded answers pass | Verify behavior on multiple inputs and inspect the intended computation, not only final string |
| Completion equated to mastery | Separate exposure, guided completion, immediate independent success and delayed transfer |
| Repeated syntax lectures in every chapter | Assign concept ownership once and link/retrieve it later |
| Overly verbose screens | Show one active task and concise explanation; place deeper text in collapsible reading area |
| Too much biology, too little Python | Every task must require a real programming operation and explain that operation |
| Too much generic coding, too little relevance | Scientific data/model appears from the start and increases in authenticity |
| No awareness of confounders | Ask for units, exclusions, calibration, annotation or replicate validity when meaningful |

### 3.5 Hint and feedback rules

- Two or three progressively revealing hints: **conceptual direction → specific API/data-structure clue → partial skeleton**, never immediately reveal the completed independent solution.
- Distinguish syntax errors, runtime exceptions, incorrect output, bad scientific interpretation and nondeterministic behavior.
- Explain the failed assumption and point to a useful part of the traceback; do not fabricate confidence or claim the user has mastered a topic because one test passed.
- If a solution is accepted, explain an important reason it works, not a lengthy generic compliment.
- If a scientifically invalid method produces numerically correct results, raise a separate **scientific validity warning**.
- Treat assistance level as data: viewed solution, hints used and independent completion must be distinguishable.

### 3.6 Retention and proficiency

A later unseen challenge should test whether the skill is available without the just-seen worked example. There is no requirement for a particular streak, XP reward or gamified study schedule. For personal use, a quiet `needs review` state with one recommended next task is enough. Consider several-day spacing as a design target but do not fabricate a review timestamp or claim real delayed learning when merely replaying a test immediately.

### 3.7 Motivation contract: meaningful success, autonomy and competence

Use *self-determination theory* as a **design lens**, not a guarantee. The course should support (a) **competence** through transparent challenge and specific, actionable feedback; (b) **autonomy** through control over pace, example context, hint use and assessment timing; and (c) **connection/purpose** through authentic research work, with optional discussion or AI tutoring—not forced social participation. The learner's biology expertise should be respected: don't require introductory biology lectures to access basic Python.

**Required per mini-goal:**

1. **Scientific question:** one clear question in plain language, e.g. "Which image records have missing specimen IDs?"
2. **Why this Python tool now:** show why the exact construct (list, loop, array operation, function) advances that question.
3. **Visible first result:** a real stdout/table/image/plot/traceback with interpretation, preferably from the first runnable interaction rather than a long passive reading segment; **no invented runtime behavior**.
4. **Learner action:** a small choice or modification affecting that result, not decorative clicking.
5. **Demonstrated progress:** one tangible named artifact, e.g. `validated_samples.csv` or a reproducible function, not a completion badge.
6. **Optional depth:** an expandable explanation, optional harder challenge, or alternate biological context without forcing extra tasks.
7. **Natural stopping point:** saved code, result, question resolved and the exact useful next action (or a one-click way to resume the current problem).

**Default screen:** active goal, brief why, input, editor, Run, relevant output, optional hint. Show progress as *what the script can now do*, not an attention-grabbing percentage. Avoid praise unrelated to observable performance, countdowns and guilt after a gap. A boring prerequisite should be taught through the smallest honest scientific task that makes it relevant, not disguised as a fake experiment.

### 3.8 A session loop deliberately designed for returnability

A **session** can be one mini-goal or an intermediate part of a larger one. Offer *suggested* stopping points rather than mandatory time limits. An approximately 10–20-minute route can be the authoring default for an ordinary session, but the learner may take much less/more time; do not grade duration.

| Moment | Learner sees/does | Author/engine requirement |
|---|---|---|
| Re-enter (10–30 seconds) | Last meaningful result and **one specific next action** | Restore exact chapter/goal/phase, code, dataset and unsolved problem; no mandatory re-reading |
| Orient | "Today: identify missing field IDs" plus brief scientific why | One sentence, no oversized lesson overview |
| First action | Predict or run a minimal genuine program | No avoidable theory-only barrier; immediate authentic output or honest error |
| Build | Change parameters, inspect behavior, author code | Challenge stays proximal to what was just learned; runnable partial results |
| Check | See what works, what fails, why, and what to try next | Feedback includes the failed input or a debugging clue, not a generic red cross |
| Close | Save functioning artifact and optional retrieval prompt | Explicit outcome: "Now your script flags missing IDs"; stop or continue freely |

**Interruption-resilient design:** leaving mid-task never penalizes progress, starts an unwanted timer, clears drafts or forces a chapter restart. Offline or failing package loads show a recovery step and keep work intact. On return after weeks, offer a short *optional* refresher with two code-reading tasks, not compulsory repetition of whole chapters.

### 3.9 Adaptive difficulty with transparent, reversible decisions

Implement **simple inspectable rules first**; don't imply a sophisticated AI tutor or an empirically optimal model. Each mini-goal has a **diagnostic** (optional 1–2 short tasks that genuinely assess the exact competency), a guided route, a lighter remediation step and a harder transfer. All are paths to the **same owned competency**, not new course branches.

| Evidence/learner choice | Immediate adaptation | Mastery implication |
|---|---|---|
| Existing skill demonstrated on a new input without hints | Offer direct Apply/Prove and skip redundant exposition | Can award independent evidence only after valid unfamiliar proof |
| New concept / learner chooses guided | Show brief worked example and one faded step before independent attempt | Guided/explored only |
| First error | Show actual failed case and contextual explanation of one likely cause | No penalty; rerun enabled |
| Same conceptual error twice | Offer a focused variable trace/array visualization or simpler comparison task | Guided support; retry original problem |
| Repeated unsuccessful attempts or learner declares stuck | Offer **choice**: one smaller worked subproblem, relevant docs, progressive hint or return later | Do not reveal full solution by default; cannot claim independence from a revealed answer |
| Rapid success on several similar tasks | Reduce scaffolding, offer a materially changed transfer or advance | Do not force rote repetition; review later |
| Low energy / short available time | Offer a real small task or save-and-stop | No fabricated mastery, no pressure to continue |
| Learner wants to explore | Provide optional scientifically sound extension | Remain on syllabus; extension not an obligatory new competency |

The engine should never silently lower expectations after errors. **Adapt the path, not the standard.** Always provide a visible **"Try independently"** route and allow moving backward or skipping freely. Track assistance level with consent; avoid opaque competence scores based on clicks or time. If a worked solution is viewed, label the resulting completion guided even if its tests pass.

### 3.10 Feedback that improves understanding rather than discourages

Follow three questions: **What is the goal? What went wrong/right? What is the next useful action?** On a coding failure, distinguish: syntax/indentation; undefined name/type/shape; wrong control flow; unexpectedly empty input; wrong numeric calculation; data/provenance error; scientific inference beyond the available evidence. Avoid revealing the correct program too soon.

**Feedback sequence:**

1. Report the **actual** outcome, relevant failing input, stdout/stderr or traceback and the implicated code line where possible.
2. Localize a single likely mechanism, e.g. "The list still contains `None` when compared to a float." Distinguish hypotheses from detected causes.
3. Ask a high-value debugging action: print the type, inspect array shape, compare two lines, test the exact boundary, check source metadata.
4. Offer 2–3 progressive hints **on request** and, if still stuck, a minimal **faded** worked example. The last resort is the annotated solution with guided-status labeling.
5. On success, describe the **specific capability evidenced** and one limitation, e.g. "The parser rejects malformed plate codes; uniqueness across batches is not yet checked." No generic flattery.
6. For scientific code, provide a separate scientific-validity result rather than using successful execution as a validity signal.

Never turn deliberately obscure exceptions into a game. Introduce simple syntax errors before complex semantic bugs; explain why hidden scientific bugs may require annotation, metadata or controls rather than another code run.

### 3.11 Retrieval, spacing and transfer without surveillance

Use retrieval in real programming contexts rather than trivia. When a competency becomes usable, schedule a short **optional** fresh-input review near the next session, a few days later and after a longer interval (e.g. 1–3 weeks) if the learner keeps using the course. These intervals are **starting heuristics**, not validated optimal intervals for this user. A review should take minutes, test *creation or debugging* and require a changed input or representation. Interleave previously learned syntax inside later scientific tasks without adding a new competency screen.

A successful immediate Prove ≠ retained mastery. Record **explored → guided → independent → retained (unseen delayed)**, plus **needs review**, supported by actual evidence. Do not erase prior evidence because a later review fails; record the new finding and offer targeted remediation. Timed reminders are opt-in only; no streaks or negative language for missed reviews.

### 3.12 Autonomy without fragmenting the course

At a handful of meaningful points, offer equivalent contexts for a *single* concept: microscope-field metadata, a DNA-record table or a simple experimental time series. Examples differ in scientific setting, not learning objective or difficulty. Default is the microscopy story; all alternate versions must share competency IDs, assessment criteria and scientifically honest data. Keep alternative paths hidden until useful; avoid 3 parallel course maps.

Allow the learner to choose **read explanation / try directly / see a smaller example**. A choice is substantive only if it affects the work; theme selectors and decorations are not a motivation design. Optional AI assistance should target explanation and debugging, not provide unsolicited motivational text or replace independent problem solving.

### 3.13 The content author's engagement smoke test

Before accepting each mini-goal, answer explicitly:

- **Meaning:** Can the learner tell in one sentence which real scientific task this supports?
- **Time to action:** Can they run or modify meaningful Python without first reading pages of theory?
- **Cognitive load:** Is only one genuinely new programming idea introduced at a time for beginners (or clearly explained combinations at later stages)?
- **Agency:** Can a competent learner skip repetition and can a struggling learner request support without a penalty?
- **Failure recovery:** Does each likely error lead to a useful debugging action rather than generic "incorrect"?
- **Artifact:** Does the goal produce a real change to code, input understanding, figure or table?
- **Stop/resume:** Can the learner safely leave and restart exactly where their reasoning stopped?
- **Evidence:** Does the independent transfer require a new reasoning step rather than changed constants?
- **Scientific validity:** Is the biological conclusion no stronger than the data?

If an ordinary mini-goal fails two or more of these, rewrite it before producing another chapter. **The goal is not to entertain with novelty; it is to remove boredom and frustration caused by poor instructional sequencing.**

---

## 4. Required anatomy of every chapter

A chapter is **not complete** unless the following exist, with evidence. Authors may vary the number of sections and activities; the contract, not page count, is fixed.

### 4.1 Chapter header and contract

- Stable mission ID, learner-facing title, version/status, author/reviewer and source references.
- One-sentence practical outcome, tangible deliverable and independent transfer problem.
- Exact canonical competency IDs and immediate prerequisites; concept ownership and reused earlier skills.
- Runtime target (`browser_pyodide`, `local_python`, `jupyter`, or dual with explicit limitations); packages and versions.
- Estimated effort as *optional planning guidance*, never a grading or mastery proxy.
- Required dataset/asset IDs, source/license references and expected observable outputs.

### 4.2 Full textbook content, but task-first delivery

An independent Markdown chapter must be readable like an excellent short textbook: context; accurate conceptual progression; appropriate definitions; detailed stepwise explanation of key code; annotated expected output; alternative approaches where meaningful; typical mistakes and their causal explanations; small exercises; optional deeper notes; a realistic scientific example; summary of decisions and a self-check. Avoid enormous narrative repetition, basic biological lectures or copied textbook prose.

The UI initially shows only **mini-goal, immediate task, input/editor, Run, output and relevant image**. Deeper chapter text lives in a readable, accessible expandable panel. In the UI, do not require scrolling through theory before reaching the editor. Images appear only when relevant to the task, except a small attributed early contextual image.

### 4.3 Required exercises and assessments

For every *substantive* mini-goal, provide a prediction, runnable demonstration, at least one meaningful modification, one learner-authored attempt, two or three hints, common failure explanations and changed-input reference checks. For each chapter, provide:

1. A cumulative **Apply** deliverable that reuses its mini-goals.
2. An independently solvable **Prove** problem on unfamiliar inputs, with a stated rubric.
3. At least one deliberate **debugging or failure-investigation** task suited to the topic.
4. A scientific interpretation/caution appropriate to the subject; factual correctness is independently checked.
5. A later retrieval/transfer prompt that can be assigned without exposing the old worked solution.
6. Instructor reference solutions and output/asset expectations in **author-side** material.

Do **not** force 7 brand-new assessment screens into a chapter simply because it has 7 mini-goals. Some goals can combine into one integrated activity, provided coverage and evidence remain explicit.

### 4.4 Quality of examples

Use compact realistic scientific names (`specimen_id`, `field_id`, `pixel_size_um`, `replicate_id`), small but meaningful data and self-contained setup. Examples should make values and units interpretable, use deterministic seeds where appropriate, test both simple and nontrivial inputs, and avoid magic constants. E.g., a microscope-field focus-score toy example must explicitly say the score/cutoff is illustrative, not a validated universal QC cutoff.

### 4.5 Mandatory learner-experience specification (v2)

In addition to the full textbook content and formal assessment, every chapter must include a short **experience design brief** specifying:

- **Scientific hook:** a genuine image, data artifact, question or result tied to the larger microscopy pipeline (or sequence/ML specialist goal).
- **First runnable outcome:** what appears when the learner runs code early in the chapter; provide an honest fallback if required data are unavailable.
- **Cumulative artifact delta:** exactly what new ability/file/function/figure the project gains by completing the chapter; specify where it is saved and how it can be re-used.
- **Mini-goal progression:** 4–8 *typical*, but derive number from content; each with an observable artifact, plausible difficulty and explicit owner competency/assessment evidence.
- **Two routes:** standard supported sequence and diagnostic fast route; one recovery micro-task for the most likely misconception.
- **Meaningful learner choice:** optional scientific context, extra challenge or direct-try route when appropriate; none forces a separate curriculum.
- **Engagement stop points:** where the learner can pause after a meaningful result; resume instruction says exactly what to do next.
- **Transfer novelty:** what genuinely changes on the unseen challenge (data representation, biological condition, faulty assumption), and how its reasoning differs from the example.
- **Feedback prototypes:** one wrong program → actual feedback explanation → retry, and one correct program → specific factual feedback.
- **Small-scope acceptance:** at least one short session works end-to-end before claiming the full chapter is learner-ready.

The experience brief is authoring metadata **not a new dashboard**. The UI shows at most one relevant piece at a time. A chapter that is technically correct but offers no meaningful early action or recovery route is **not content-complete** under the v2 standard.

### 4.6 Inspectability, scientific failure and cumulative artifact requirements (v2.1)

Every chapter-generation brief must explicitly decide **which internal state should become inspectable**, **which plausible failure must be diagnosed**, and **what reusable scientific artifact survives the chapter**. Use a lightweight `inspection_plan`, `failure_case_plan` and `artifact_contract`; do **not** demand a new visible panel or complex debugger for every lesson. The detailed per-chapter guidance and priority rules are in §19.

- Plain-Python chapters: where useful, illustrate line execution, variable values and changing collections; prefer genuine execution-derived traces to canned diagrams. Default learner view remains the normal code editor and output.
- Image-analysis chapters: identify at least one meaningful intermediate image/mask/table or object-overlay that the learner can inspect after **running real Python**. Store correspondence between input, transformation parameters and output.
- Scientific failure: give at least one *plausible but wrong* analysis result, learner diagnosis and a principled revision or explicit decision to withhold interpretation. Contrived syntax typos alone are insufficient for advanced chapters.
- Retained artifact: name the script/function/notebook/table/figure/manifest produced, its required input assumptions and how a later mission imports or reuses it; do not regenerate an unrelated artifact for every exercise.
- Independence: author alternative approaches **after** learner completion or as optional deeper material. Never prefill the Prove answer or infer mastery from a visually convincing overlay.

### 4.7 Supporting materials

Every chapter provides an index of variables and concepts introduced, a glossary of essential technical terms, package/API links, source-to-task audit, asset ledger, independent answer key, test fixtures, acceptable alternative solutions and documented scientific limitations. The end result must be portable: a learner can revisit it without the UI, and the UI can import it without manually retyping the chapter.

---

## 5. Mini-goal and activity authoring rules

### 5.1 A mini-goal is an outcome, not a topic

**Weak:** “Understand loops.”  
**Strong:** “Use a `for` loop to process all microscope fields while retaining each field ID; report whether a changed cutoff excludes any record.”

Each mini-goal definition records:

| Field | Required meaning |
|---|---|
| `mini_goal_id` | Stable, namespaced, never reused for an unrelated objective |
| `action` | Observable learner action, written with an active verb |
| `why` | A concrete scientific or programming reason |
| `concepts` | New constructs and previously taught dependencies |
| `inputs` | Typed input schema and authentic/synthetic data distinction |
| `evidence` | Output that can be validated plus a reasoning question |
| `common_failure` | One or more meaningful bugs/misconceptions |
| `hints` | Progressive, assistance-aware hints |
| `edge_cases` | At least missing/empty/boundary or other relevant cases |
| `transfer` | Unfamiliar task differing in material way from practice |
| `scientific_caution` | Any interpretation, metadata or control caveat |
| `scientific_hook` | Specific research question or artifact motivating the action |
| `first_visible_result` | Authentic early output/plot/image state after running real code |
| `artifact_delta` | New reusable code/data/figure produced, not a decorative score |
| `support_routes` | Normal, fast-diagnostic, and remediation/return-to-task variants |
| `choice` | Optional meaningful control over pace, context or help |
| `pause_resume` | Safe checkpoint and exact next useful action |
| `feedback_examples` | One validated incorrect case and helpful retry; one correct interpretation |
| `novelty_of_prove` | Why unseen transfer is cognitively new (not changed constants) |
| `engagement_risks` | Likely point of boredom/confusion and preventive design |

### 5.2 Minimum diversity in a chapter

Across a chapter, mix: code prediction, running/inspecting output, modifying code, writing from scratch, fixing a bug, interpreting a figure/table, investigating a scientific assumption and end-to-end transfer. Use open coding more than multiple-choice. After early chapters, most assessments should require nontrivial code composition or an explicit methodological decision.

### 5.3 Programmatic checking

- Author-side reference programs run on at least **three meaningfully different inputs** for ordinary exercises (including an edge case where applicable); advanced tasks need more.
- Assert behavior/invariants (types, data shape, values or tolerances, metadata relations) rather than matching one hardcoded output or exact variable spelling when many correct approaches exist.
- For numerical results, specify tolerance, missing-value policy, units and dtype. Use `math.isclose()` / `numpy.isclose()`-style comparisons where floating error matters; avoid exact string matching for floats.
- For real-image outputs, compare dimensions, masks/overlays, ROI bounds, region statistics and error metrics with traceable reference data—not screenshots alone.
- For stochastic ML and simulation tasks, fix seeds for reproducibility and explain why a seed does not guarantee all cross-platform numerical results.
- Keep an author-visible test log with every failing fixture and the actual traceback/output.
- Never grade biological correctness solely by accepting Python that executes. Include explicit interpretation checks or a review rubric when needed.

### 5.4 Independence and answer handling

A browser-delivered lesson may contain visible client-side checking logic; such checks cannot be meaningfully secret to a determined user. For a single-user local learning tool, this is acceptable if labeled as **self-assessment** rather than invulnerable proctoring. Separate reference answers, complete tests and instructor notes from the normal learner bundle anyway to avoid accidental spoilers. An optional trusted remote evaluator would need its own conscious architecture/security decision; it is **not required** for the offline-first course.

The `Prove` task must ask for structurally new work: altered dataset organization, an unfamiliar parameter, a hidden edge case or a scientific inference absent from the worked example. Merely renaming a variable or replacing `4` with `6` is insufficient independent transfer.

---
## 6. Source research and copyright strategy

### 6.1 Mandatory source inventory before writing a chapter

Before authoring a chapter, inspect **relevant original source material**, not only the earlier mapping title. Record exact upstream repository URL, specific revision or blob SHA, notebook path and actual cell index, the concept/exercise taught, a short synopsis in original words, dependencies, data access, expected behavior, known obsolete APIs, reuse-rights status and what is genuinely new in our lesson.

Use a simple, auditable decision per source exercise: **reuse with license compliance**, **adapt to a better learning task**, **reference only**, or **skip as duplicate/out of scope**. Record why. Do not claim “all Witz exercises implemented” merely because all seven exercise notebooks are referenced. A source mapping is not a finished runnable lesson.

For source extraction, audit the nine numbered Witz notebooks (`01`–`09`), exercise notebooks `e01`, `e02`, `e03`, `e04`, `e05`, `e06` and `e08`, the Functions/Structures appendices and `Demo.ipynb`. The version used for this blueprint is the public `guiwitz/PyImageCourse_beginner` repository, which Witz describes as deliberately focused on quickly reaching practical image-processing scripts, **not exhaustive Python coverage**.

### 6.2 Who teaches what

| Source | Use as primary support for | Do not assume |
|---|---|---|
| **Witz — Image Processing for Beginners** | Beginner scientific Python, image arrays, image viewing, thresholds, filters, connected regions, repeatable pipeline and real HPA examples | That it covers Git, statistical design, robust annotations or every Python foundation in sufficient depth |
| **Jake VanderPlas — Python Data Science Handbook** | NumPy, Pandas, Matplotlib, Jupyter/IPython, basic scikit-learn concepts | That its prose can be rewritten/copied or that old package examples run unchanged on a current environment |
| **Martin Jones — Python for Biologists** | Beginner text processing, files, functions, loops and biology-oriented examples | That the entire book or its solutions are freely licensed for direct incorporation |
| **Pete Bankhead — Introduction to Bioimage Analysis** | Pixel semantics, measurement validity, microscopy assumptions, channels and calibration | That a conceptual image example supplies a validated dataset by itself |
| **Bio-image Analysis Notebooks** | Supplemental segmentation, measurement and advanced applied image-analysis approaches | That every advanced notebook is suitable for a novice browser runtime |
| **Carpentries Image Processing** | Carefully staged authentic image tasks and transferrable practice | That its original data carry the same license as the teaching website |
| **Python, NumPy, Pandas, Matplotlib, scikit-image, Biopython, scikit-learn official docs** | Current API semantics, import behavior, edge cases and testing | That arbitrary copied website text/code has uniform reuse rights |
| **OME file-format documentation** | Axis order, metadata, calibration and TIFF/OME-TIFF limitations | That an arbitrary `.tif` includes valid OME metadata or channel identity |

### 6.3 License and attribution rules

- **Witz notebooks:** The referenced repository is BSD-3-Clause; preserve relevant copyright, license and attribution whenever original code is included. Do not assume separate images have the identical code license.
- **Human Protein Atlas:** Witz's README describes its historical course image files as CC BY-SA 3.0; the **current HPA website** states CC BY 4.0 for copyrightable database content, while warning about possible third-party constraints and requiring specific image and website citations. **Do not resolve this discrepancy by guessing.** Identify the particular upstream image/version and applicable terms, record license evidence, include direct image/gene URL, credit and required attribution, and seek clarification when necessary. A historical local TIFF may have originated from a JPEG RGB composite; never infer raw microscope data from a filename.
- **Python Data Science Handbook:** Code examples are MIT-licensed; explanatory book text is CC BY-NC-ND. Write original explanations or link to the source; do not copy, paraphrase by close transformation or include adapted book chapters as our own.
- **Other sources:** Confirm each source repository's current license and any separate dataset/media licenses before copying assets. If unsure, link out and author a fresh example.
- **No synthetic microscope images masquerading as authentic data.** Synthetic toy arrays are appropriate for teaching arithmetic or controlled tests if explicitly identified as synthetic.

### 6.4 Known source-map discrepancy

The Witz-first mission file currently references e01 cells 5–6 for P02 conditions. Those cells concern creating multiword text and `.upper()`; the `if/elif/else` material is in Witz 08, not e01. P02 source attribution must be refined at authoring time. Also e01 cells 7–9 are image import/display tasks better taught when the learner can work with images. **Audit actual cells before declaring source coverage.** This is a source reference correction, not permission to alter frozen competency mappings.

### 6.5 Citation, content originality and reproducibility

Each chapter should cite sources at point of substantive inspiration, include a compact “Further reading” section, and carry a machine-readable source map linking each activity to source URLs and version/revision. Preserve the original question when licensing permits **only when reuse adds teaching value**; otherwise cite and write an independent problem, and label direct adaptations. Pin versions of example code or explicitly test maintained library APIs before release. Exact licensing and citations belong in an `assets.yml`/JSON-like ledger and in the packaged notices; merely writing “source: Witz” is inadequate for individual images.

---

## 7. Real biological data and asset contract

### 7.1 Dataset categories

1. **Toy data:** small explicitly synthetic numeric lists, DNA strings and arrays used to isolate one new programming concept. No source image needed; disclose that the numbers are invented.
2. **Authentic visual data:** licensed HPA or similar fluorescence images with known provenance. Appropriate for demonstrating appearance, pixel layout, channels and relative image patterns; not necessarily calibrated for absolute quantification.
3. **Research-grade quantitative imaging data:** real image arrays with reliable intensity bit depth, acquisition parameters and axis/physical calibration where needed. Use for physically meaningful ROI/region measurements; metadata and processing provenance must accompany them.
4. **Annotated reference data:** independent human-reviewed labels/masks/points and annotation protocol needed for segmentation/detection quality claims.
5. **Sequence/tabular data:** public biological sequence records, FASTA/FASTQ, count matrices or realistic published datasets with consent, licensing and appropriate sample/replicate metadata.

Avoid reliance on third-party hotlinked images for the **only** copy of a required learning asset. Bundle or cache files when rights allow; keep an explicit original-source link and integrity hash. Show a clear retry/fallback if remote source access fails; do not silently substitute an unrelated image and claim the same experiment.

### 7.2 Required per-asset ledger fields

| Metadata | Requirement |
|---|---|
| Asset ID and display name | Stable, meaningful ID; original filename retained when possible |
| Source and rights | Original provider, direct URL, asset-level license, publication/source citation, attribution text, license check date |
| Integrity | SHA-256, file size, MIME type and expected dimensions |
| Type and authenticity | `synthetic`, `real_visual`, `real_quantitative`, `annotated_reference`, `sequence`, `tabular` |
| Biological context | Organism/cell line, channel identity, stain/protein if known, sample/condition identity and sampling unit |
| Image semantics | Axes (e.g., `YX`, `CYX`, `TCZYX`), dtype, bit depth, shape, color meaning, original-vs-composite status |
| Physical calibration | Pixel width/height, units and authoritative metadata source; `unknown` is allowed and preferred to a guess |
| Transformations | Cropping, resizing, compression, normalization or generated masks, with method and saved original link |
| Availability | Whether bundled, cached or remote; asset load retry and fallback strategy |
| Verification | Which lessons use it, what property was checked, whether all required metadata were validated |

Keep both original data and the preprocessed teaching copy when licensing/storage permit. Any crop or recoloring requires an explicit derivation record. A rendering must not be treated as the source of quantitative measurements unless its limitations are the point of the exercise.

### 7.3 Image standards and numerical limits

- Distinguish `(row, column)` NumPy indexing from `(x, y)` display coordinates. State the origin and orientation.
- Never infer channel meaning from RGB color alone. A red/green/blue composite is often a rendered mapping, not independent raw channels.
- Never infer the calibration of a TIFF solely from a filename or displayed scale bar. Inspect OME metadata or an independently recorded acquisition calibration.
- For 3D/time-lapse data, inspect axes explicitly; no assumption that the third dimension is a color channel. Handle Z/T/channel confusion as a named error case.
- For 8-bit and 16-bit intensities, discuss dtype, overflow, clipping, saturation and display normalization separately.
- For segmentation exercises, overlay candidate masks, compare missed/extra candidates, document border/touching objects and require independent annotations before claiming detection accuracy.

### 7.4 Media manifest example (illustrative; do not treat placeholders as a bundled dataset)

```yaml
id: example_hpa_nuclear_visual_01
kind: real_visual
provider: Human Protein Atlas
source_url: TO_BE_VERIFIED
license: TO_BE_VERIFIED_PER_IMAGE_AND_VERSION
attribution: TO_BE_VERIFIED
sha256: TO_BE_FILLED_AFTER_ASSET_RETRIEVAL
shape: TO_BE_INSPECTED
axes: TO_BE_INSPECTED
channel_meaning: NOT_ASSUMED_FROM_RGB
physical_pixel_size_um: null
allowed_use: image_orientation_and_relative_pixel_demonstration
quantitative_calibration_validated: false
```

---

## 8. Scientific accuracy and reproducibility contract

### 8.1 Every quantitative example answers these questions

**What is being measured?** Define feature, unit and uncertainty. **At what level?** Pixel, ROI, region, field, cell, animal, culture, specimen or independent biological replicate. **What was excluded?** Record selection/exclusion rules and missingness. **What was assumed?** Calibration, channel identity, background model, threshold, annotation, independence, model split. **How can it fail?** Give at least one falsifying case or stress test.

A correct Python calculation does not automatically imply a valid biological measurement. The course must explicitly teach this distinction rather than merely listing it as a disclaimer.

### 8.2 Microscopy quality boundaries

- Threshold masks identify bright/foreground pixels; connected components are **candidate regions**, not automatically cells, puncta, exophers or organelles.
- Strongly colored display images can misrepresent intensities; show when contrast adjustments affect only visualization and when numeric processing actually changes values.
- Background correction and filtering can change morphology or measurement; compare before/after and document parameters.
- ROI selection can create observer or condition-dependent bias; define selection/annotation policy before comparing conditions where possible.
- A single perfect demonstration image does not prove robust segmentation. Stress-test on varied backgrounds, densities, shapes, bit depths and artifacts.
- Image-derived signal localization ratios require defensible masks/compartments and documented treatment of overlap, leakage, flat-field or background effects as applicable.
- Time-lapse displacement requires calibrated pixel size and frame interval; track identity/mergers cannot be inferred merely from nearest coordinates in all cases.

### 8.3 Experimental design and statistics

- Explicitly distinguish biological and technical replicates. Fields from one specimen are usually not independent biological replicates.
- Paired observations must retain their pairing keys. Do not break pairs when shuffling or merging data.
- Describe the **estimand** (what effect is being compared), not just the p-value or whether a bar is higher.
- Explain SD vs SEM, uncertainty, robust summaries and bootstrapping at the correct biological-replicate level.
- Exclusions, missing values and acquisition batches must be visible in the provenance and considered for possible group-dependent bias.
- No universal statistical test chosen automatically from a chart appearance; state assumptions and whether they are reasonable for the teaching data.
- Do not equate a bootstrap CI, p-value or ML confidence with causal validity.

### 8.4 Sequence and ML validity

- DNA ambiguity policy and empty input behavior must be explicit. Sequence quality trimming is a documented QC rule, not an arbitrary method for increasing apparent quality.
- FASTQ Phred interpretation and coordinate conventions require careful validation. Coverage/CPM alone are not a complete variant or differential-expression analysis.
- ML splits must be group-aware where fields, cells or images share biological specimens, subjects, acquisition sessions or experimental batches. Fit preprocessing only on training folds. Compare with a trivial baseline.
- Evaluate on genuinely held-out groups, report class balance, error modes and calibration limitations. A high score from leaked replicates is not evidence of generalization.

### 8.5 Reproducibility metadata in all advanced chapters

Record data source and hashes, code/source version, dependencies, execution environment, random seed if relevant, sample/replicate identifier hierarchy, parameters, calibration, processing sequence, expected outputs, test results and limitations. Provide a reproducible export (script/notebook) in chapters that teach file workflows or full research projects. Treat local environment setup as an authentic task rather than pretending it occurred inside Pyodide.

---

## 9. Content package and machine-readable import contract

### 9.1 Contract principles

The source-of-truth chapter content must be **UI-agnostic**: readable Markdown for explanations plus structured activity/mini-goal metadata, data/assets and author-side checks. Do not scatter lesson text across `src/*.js` or hardcode images in the UI. The existing `content/manifest.json` is a first prototype, not final schema approval. Design schema compatibility consciously, with version numbers and migration paths.

The UI adapter should consume chapter content without changing the frozen visual layout. Initial integration is permitted to add a content loader, genuine Python runtime, scientific output/assessment support and progress migration; changing the layout requires a separate demonstrated usability/accessibility/scientific reason.

### 9.2 Recommended directory structure (target contract, not pre-existing files)

```text
content/
  catalog.json                    # lists chapters, versions, paths, availability
  chapters/
    P01/
      chapter.md                  # readable original textbook narrative
      chapter.json                # mission/competency/prerequisite metadata
      mini_goals.json             # ordered mini-goals with exact IDs
      activities.json             # learner-facing tasks and code examples
      datasets/                   # small local input files, when required
      assets/                     # licensed images; per-asset rights confirmed
      asset_manifest.json         # provenance, hashes and calibration limitations
      sources.json                # exact source attribution and revisions
      instructor/                 # not included in normal learner bundle
        reference_solutions.py
        author_tests.py
        rubrics.md
      validation_report.md        # test results and documented limitations
    P02/
      ...
  licenses/
    THIRD_PARTY_NOTICES.md
```

A package can initially keep the legacy pilot's `content/chapters/P01.md` + combined `foundations.json` layout if an adapter translates it **without altering stable activity IDs**. The future per-chapter structure above is recommended for independent cherry-picking/import. Do not rename old files or introduce another schema until the pilot importer demonstrates the migration safely.

### 9.3 Illustrative machine-readable chapter descriptor

This is a **design example**, not a claim that the frozen UI already supports these fields.

```json
{
  "content_spec_version": "1.0.0",
  "chapter_id": "P01",
  "chapter_version": "1.0.0",
  "status": "content_reviewed",
  "stage": "Python",
  "title": "Run your first scientific program",
  "canonical_competency_ids": [
    "bps3.m00.run_a_scientific_python_cell",
    "bps3.m00.read_an_error_traceback"
  ],
  "competency_numbers_excerpt_only": ["001", "002"],
  "chapter_markdown": "chapters/P01/chapter.md",
  "mini_goals_path": "chapters/P01/mini_goals.json",
  "activities_path": "chapters/P01/activities.json",
  "runtime": {"browser": "pyodide", "local_required_for": []},
  "asset_manifest_path": "chapters/P01/asset_manifest.json",
  "sources_path": "chapters/P01/sources.json",
  "author_side_tests_path": "chapters/P01/instructor/author_tests.py",
  "progress_namespace": "bps3",
  "replaces_legacy_ids": ["sample"],
  "publication": "NOT_AUTO_RELEASED"
}
```

**Important:** The sample above lists only two canonical IDs **as an excerpt**; real P01 must map all seven assigned skills and exactly match the frozen v3 manifest. Schema validation should reject this incomplete example if it were mistakenly treated as a completed chapter. `status` must reflect actual evidence and not be manually advanced by writing files alone.

#### v2 experience metadata example (nonbinding until importer pilot)

Keep learner-experience policy **declarative**. Example of fields the adapter might consume after schema validation; no new visible UI components are implied:

```json
{
  "mini_goal_id": "P03.MG04",
  "scientific_question": "Which microscope fields have missing focus scores?",
  "first_result": {"kind": "stdout", "expected_role": "missing-record-count"},
  "artifact_delta": "A field-ID-preserving quality-control function",
  "supported_routes": ["guided", "diagnostic_fast", "remedial_subproblem"],
  "supports_stop_resume": true,
  "independent_transfer_change": "The second dataset changes record structure and contains missing scores",
  "optional_review_policy": "fresh-input; no fixed deadline",
  "ui_default": "single_task_only",
  "status": "PROPOSED_SCHEMA_NOT_YET_IMPLEMENTED"
}
```

**Do not directly serialize learned difficulty tiers from total attempts** or store personal labels such as "weak programmer". The final importer should validate these fields, provide defaults for existing P01–P03 prototype activities and explicitly version any schema changes. Do not rename existing `P01-A` / similar activity IDs as a side effect of introducing mini-goals.

### 9.4 Activity record contract

Each activity includes: `activity_id`, `mini_goal_id`, `chapter_id`, `competency_ids`, phase (`learn|apply|prove|review`), objective, prior competencies, instructions, starter code, dataset/input references, expected output or rubric, reference annotations, hints, scientifically honest caveats, source links, changed-input fixture pointers, transfer relationship and available runtime. Keep an explicit `view` field to distinguish a figure, code, table, histogram or image overlay when output type matters; do not invent a new UI pane for every activity.

For scientific tasks also include typed units/axes/replicate IDs, numerical tolerance or rubric, known failure scenarios and explicit distinctions between image display and scientific calculation.

### 9.5 Optional v2.1 inspection and artifact metadata

The importer should permit **backward-compatible, optional** records describing `inspection_plan`, `analysis_snapshots`, `failure_case`, `artifact_outputs`, `solution_comparison`, and `fiji_bridge`. These are *content declarations* (expected data type, author output artifact, label, trigger, asset path, assessment policy), not JavaScript callbacks or untrusted source to execute. Content authors may include them before the UI supports them; the loader must safely ignore unimplemented optional fields, and it must reject a lesson marked `requires_feature` if the relevant feature is absent.

- All actual image snapshots must be derived from the learner's executed Python, or labeled as **author reference/example output**. Never show a supplied reference mask as if the learner generated it.
- A snapshot is valid only for its exact `run_id`, source input/checksum, parameter set, spatial axes/coordinate reference, and dataset/ROI version; invalidate changed downstream results.
- An optional execution trace is for **small, whitelisted, bounded plain-Python snippets**, not arbitrary NumPy internals, large image arrays, large objects, or persistent exhaustive tracing. Treat trace viewing as guided assistance where it exposes reasoning used in a Prove task.
- Generated figures and tables use the pre-existing output/viewer surfaces. New visual modes require a demonstrated scientific or accessibility need and explicit frozen-UI exception review.

### 9.6 Content schema, versions and links

- **IDs:** Stable, namespaced semantic IDs. Never derive persistence identity from chapter position, title or array index.
- **Versions:** Semantic content version for each chapter; backward-compatible typo/clarification edits keep existing IDs. Concept changes require versioned migration and explicit retest.
- **References:** Use relative internal asset paths and source URLs. Verify each internal path and every bundled integrity hash. Prefer repo-root-relative paths at the manifest boundary to avoid loader ambiguity.
- **Paths:** No host-specific absolute paths, Vercel preview URLs or temporary sandbox paths in committed content.
- **Data-only:** learner-facing content should be declarative; do not embed arbitrary JS evaluation expressions in lesson JSON. Store author tests in trusted test code, not as eval strings passed to a browser.
- **Markdown:** allow headings, paragraphs, tables, lists, fenced Python, inline code, figures with alt text and links. Sanitize any rendered Markdown/HTML before displaying it; never treat third-party notebook HTML as automatically safe.
- **Separation:** build a learner bundle without instructor solutions, answer keys or author fixtures wherever possible. A determined user can still inspect client-side tests, so do not promise tamper-resistant grading.
- **Licensing:** source notices travel with every package; no asset is automatically copied merely because its source URL is present.

### 9.7 Content import boundary (stable data vs variable app implementation)

An importer should receive a chapter package, validate schema/IDs, resolve source/asset references, map mini-goals to the existing Learn/Apply/Prove area, initialize code in the existing editor only when appropriate, execute Python through the runtime bridge, show stdout/stderr/plots/measurements in existing panes, and persist progress using canonical IDs. The importer should reject incomplete, duplicate or incompatible content loudly and safely; **never partially overwrite existing learner records**.

---

## 10. Runtime, assessment, progress and accessibility

### 10.1 Two valid execution lanes

**Browser lane:** True Pyodide in a dedicated Web Worker; load only required pinned packages for a lesson, expose actual stdout/stderr/tracebacks, support cancellation/reset and errors. Provide clean-namespace graded runs and explicitly state when a notebook-like persistent session is used. Verify native package support rather than assuming arbitrary Python wheels will install. In particular, `micropip` and `pyodide.loadPackage()` have different package-resolution capabilities.

**Local lane:** Real terminal/Python/venv/Jupyter/Git activities for skills that require a filesystem, environment management, command-line tools, larger datasets, or locally validated software packages. Export or provide downloadable files and exact setup/verification instructions. If a chapter is `local_required`, show that state honestly; do not claim a browser simulation completed an actual Git commit or virtual environment.

### 10.2 Runtime and failure contracts

- First run: report loading, package installation/import progress and meaningful failure cause without unsupported claims of readiness.
- Run: actual Python, real output and exception capture; no canned stdout for an “expected” code string.
- Repeated run: consistent behavior with a documented reset/persistence model.
- Assessment: execute learner code against multiple changed inputs in an isolated environment; detect nontermination and reset the worker where supported. Do not freeze the UI during long calculations.
- User code should not run inside a privileged server context by default. Browser execution is isolated from the app main thread but **not a general hardened sandbox**; avoid promises of secure arbitrary-code isolation.
- Package imports: test NumPy/Pandas/Matplotlib/scikit-image/Biopython/scikit-learn per chapter and pinned runtime version before release; browser availability may change. Use a local alternative where unsupported.
- Data handling: fetch/load real image files with correct CORS or bundled assets; verify dimensions/channels and repair errors without substituting unrelated data.
- Network/offline: explain what remains usable after the initial runtime and assets have loaded. A working static UI offline is not proof that uncached scientific packages or remote images will work offline.

### 10.3 Progress model and migration

Use `unseen`, `explored`, `guided`, `independent`, `retained`, and `needs_review` as evidence states, not as a simplistic linear percentage. Store `chapter_id`, `mini_goal_id`, `activity_id`, canonical competency ID(s), content version, hints/solutions seen, timestamps, local draft and attempt evidence. Distinguish user code drafts from solution metadata. Treat failed attempts as normal learning history, not as evidence of incompetence.

The 61 old lesson IDs must remain mapped through the frozen v3 `legacy_migration`. Preserve old localStorage keys/records until an independently tested migration succeeds. A chapter import must not reset drafts or inflate mastery. Offer backup/export/import, test restores of fresh/partial/legacy/corrupted records, and keep schema-versioned migrations idempotent.

**Critical UI-first mismatch:** Current frozen UI-first prototype saves drafts keyed by stage/mode, not by a full stable chapter/activity ID. A later importer must add versioned per-activity persistence while preserving or migrating these stage drafts, rather than overwriting them. This requires an explicit compatibility test. No UI or storage code change is authorized by this blueprint alone.

### 10.4 Focus, continuity and voluntary engagement (implementation contract)

The frozen IDE already has an uncluttered Learn/Apply/Prove surface and saved editor drafts. Keep those controls. To support adult self-study effectively, the content adapter and later engine should additionally:

- Persist **exact chapter/mini-goal/phase, current code, relevant dataset revision, displayed output where safe, assistance exposure and explicit next action**; never rely solely on a global stage-keyed draft if separate activities need independent work.
- Make pause/resume correct after tab close, reload, network interruption, device switch *when an export/import is used* and content-version updates; do not promise automatic cross-device synchronization.
- Provide a fast **"resume my unfinished task"** entry, preserving edits and scroll/focus when practical. Never reinsert starter code over a saved attempt without confirmation.
- After a long absence, ask optionally: **resume directly** or **do a 2-minute refresh**; never automatically demote competence or restart the course.
- Support high-contrast code and outputs; keyboard-based editor/Run/navigate/hint/next interactions must remain reliable; respect font-size scaling and reduced-motion preferences.
- Keep source/data/extended explanation available on demand but hidden during focus. Do not display streaks, activity timers, completion-score celebrations, push prompts or mandatory knowledge checks at every page transition.
- Handle predictable failures gracefully: unavailable image, local asset load error, package download, Pyodide initialization, unsupported TIFF/OME-TIFF, code exception and failing author check. Preserve work and give actionable, context-specific recovery.
- If optional local learning diagnostics are logged, record only minimal task evidence and *explain* its purpose. Allow export and deletion; do not require accounts or external analytics.

**Acceptance test:** close the app halfway through an unsolved goal after editing code, reopen it, and verify the original draft, correct goal and one next action remain. Also run a returning-after-gap test. A broken resume is a motivational failure, not merely a persistence bug.

### 10.5 Accessibility and concentration

Dark-first/light-optional; readable code font; sufficient contrast; keyboard navigation in editor, results, image viewer and collapsible lesson area; screen-reader labels for controls; alt descriptions for science figures; non-color-only distinctions; responsive single-column phone mode. Avoid hidden functions that appear active, gratuitous celebratory animations, motivational prompts, streaks, badges, ranking pages and progress dashboards. Keep a one-task active presentation and move optional references/hints into disclosure areas.

Respect the established keyboard workflow wherever it does not conflict with code editor operations, and verify shortcuts across desktop/mobile/focus contexts. Never hijack Shift+Enter in a way that causes inadvertent loss of unexecuted code. Provide a normal accessible alternative to shortcuts.

---

## 11. Chapter-to-UI integration protocol

### 11.1 The safe strategy

The frozen UI branch and Witz-first content branches descend from related but **different experimental histories**. **Do not merge a whole content branch, Witz pilot branch or chain of draft PRs into the frozen UI by default.** That risks reintroducing duplicate lesson systems, navigation, old HTML/CSS or unintended runtime code.

Instead, for **one reviewed chapter at a time**, use a controlled **content-only transfer**: copy/cherry-pick narrowly scoped `content/` files and licensed assets (plus a tested loader/bridge when it is being introduced), identify any necessary dependency on v3 IDs, and test the result as a separate integration PR against a branch based on the UI-first head. Resolve actual conflicts with the current GitHub state before importing. Keep the frozen preservation branch unchanged.

### 11.2 First chapter is a technical pilot

**P01** is the first end-to-end import target because it has no external scientific package dependencies. It should prove Markdown rendering, code initialization, genuine Python execution, stdout/tracebacks, changed-input tests, hint state, per-activity persistence, fallback on failure, restore/reload and an independent task. A small attributed real microscopy image can appear as introductory scientific context, but no unsupported quantitative image exercise is required.

Do not complete all 26 chapters before this pilot. Once P01 works, lock a stable content adapter/schema and proceed to P02, P03 ... . Later I01 separately validates genuine image loading/axes and image-pane behavior.

### 11.3 Per-chapter import checklist

1. **Reconcile branches:** inspect latest source/head commits of frozen UI, v3 manifest, Witz spine and the chapter content branch. Note exact SHAs and avoid importing unrelated changes.
2. **Validate package:** all IDs and prerequisites match canonical manifest, references resolve, rights are recorded, author tests pass, no malformed Markdown/JSON or inaccessible assets.
3. **Validate safety:** learner package excludes accidental answer keys and any unsafe HTML; reference code is not executed automatically outside the test environment.
4. **Prepare integration PR:** target the current UI-first integration head (not the frozen preservation branch); include only intended chapter files, datasets and minimal adapter bridge changes.
5. **Map to existing UI:** display chapter title/mini-goal, Learn/Apply/Prove, code editor, output panes and image workspace without modifying the design language.
6. **Test real execution:** CPython examples match actual Pyodide behavior; stdout/stderr, import errors and chart/image outputs appear correctly; no fake “success” state.
7. **Test user data:** existing per-stage drafts and any old 61-lesson state survive; refresh, browser close, export/import and changed chapter version do not destroy progress.
8. **Test scientific outputs:** compare expected arrays/masks/tables with reference data and interpret known caveats correctly.
9. **Test UX/accessibility:** mobile, desktop, keyboard, screen-reader semantics, focus and long outputs; one active task without clutter.
10. **Review evidence and merge only accepted content:** archive test results and rollout decision; leave production unmodified until technical release gates pass.

### 11.4 What should change after first integration?

**Expected recurring change:** add new validated chapter data, associated datasets, licensing information, tests and a catalog entry. **Not expected:** building a new navigation page, changing typography, changing UI panels, rewriting the course engine, duplicating progress storage or pasting lesson text into JavaScript. Add optional UI capabilities only when a genuine new chapter type requires them, with a narrowly scoped test (e.g., a real histogram or Z/T data browser).

### 11.5 Rollback and forward compatibility

Every integration PR lists imported package IDs, versions, asset hashes and source commit, with a rollback path that restores the previous content catalog without deleting learner records. Before deleting or renaming a lesson, explicitly migrate its canonical IDs and drafts. A failed future chapter should be removable without making already accepted chapters fail.

---

## 12. Quality gates, review and release criteria

### 12.1 Five distinct statuses

| Status | Evidence required | Claim allowed |
|---|---|---|
| **Planned** | Syllabus, competencies and source candidates | Chapter exists in the roadmap only |
| **Draft** | Original explanation and candidate activities | Authoring in progress, may have errors/gaps |
| **Content-complete** | Full chapter, coverage map, source/asset audit, author tests, rubric, reviewer sign-off | Offline-readable teaching package is complete |
| **Integrated** | Real UI, Pyodide/local execution, data load, persistence, feedback and accessibility tests | Chapter works in a development preview |
| **Learner-validated** | Representative genuine learner attempts, independently observed transfer and corrected usability issues | Teaching design has practical evidence; not a claim of universal mastery |

**A green CI check does not by itself advance a chapter from Draft to Content-complete.** P01–P03 in draft PR #10 remain Draft until all acceptance items are met.

### 12.2 Content-complete gate (chapter author/reviewer)

- [ ] Chapter scope, deliverable, competency coverage and prerequisite DAG checked against frozen sources.
- [ ] Actual upstream notebook cells, current API docs and supplementary sources reviewed; source/exercise ledger complete.
- [ ] Original textbook narrative is logically sequenced, accurate and understandable without app UI.
- [ ] Every mini-goal has an observable outcome, appropriately varied learning activities, graded hint strategy and changed-input transfer.
- [ ] A cumulative Apply project and meaningful blank-editor Prove task are present.
- [ ] Test data include normal, boundary/empty/missing and concept-specific adversarial cases; author solutions pass them in CPython.
- [ ] Expected stdout, figures/tables and code tracebacks are verified; numerical tolerances documented.
- [ ] Explicit scientific boundaries, interpretation prompts and controls/confounders are included where relevant.
- [ ] Every required asset has source/license/provenance/hash and loads from an authorized location.
- [ ] Accessible media text, Markdown quality, code formatting and source links checked.
- [ ] No unnecessary repetition or motivational clutter; the chapter's practical objective is obvious.
- [ ] Human editorial review passed; status and test evidence recorded.

### 12.3 Learner-engagement content gate (new mandatory criteria)

A chapter may pass CPython/Markdown/source checks and still be **blocked** if its content fails:

- [ ] The first relevant action has a realistic, reproducible, visible result without an avoidable reading wall.
- [ ] Every mini-goal links an observable programming skill to an authentic scientific purpose.
- [ ] There is one continuous, accumulative deliverable rather than disconnected syntax puzzles.
- [ ] Worked examples fade, and an optional diagnostic route avoids rote repetition for already-familiar material.
- [ ] Two plausible incorrect attempts have actionable, truthful help and a route back to the original problem.
- [ ] Optional choice or deeper exploration exists where it changes the learning activity (not merely appearance).
- [ ] Learner may stop after a result, resume without lost drafts, and skip nonessential repetition.
- [ ] Independent Prove requires unfamiliar reasoning, not a re-skinned worked answer.
- [ ] Biology interpretation and numerical results are kept scientifically honest.
- [ ] The chapter has a **named observable success** and two testable short-session paths: normal and recovering-from-stuck.

Document *how* each is met with IDs/files/test evidence, not just unchecked boilerplate. A high score in the review rubric cannot override a missing safety, execution, provenance or data-preservation gate.

### 12.4 Integrated gate (UI/runtime)

- [ ] Actual Pyodide or local Python executes the chapter tasks, not a mocked renderer.
- [ ] Exercises receive genuine variable inputs and show actual wrong-input failures with useful feedback.
- [ ] All assets load under browser CORS/hosting conditions or an honest documented fallback.
- [ ] UI remains responsive during package load/long execution and can recover after exception/timeout.
- [ ] Progress and editor drafts survive reload, route change, import/export and legacy state migration.
- [ ] Normal learner bundle does not accidentally disclose complete answers.
- [ ] Desktop/mobile/keyboard/accessibility/focus checks pass without redesigning frozen shell.
- [ ] Source and third-party rights notices travel with distributed content.
- [ ] No unsupported biological measurement/segmentation or calibration claims.
- [ ] Integration PR lists exact content and base SHAs, QA evidence, blockers and rollback path.

### 12.5 Course-level release gates

- **G0 — real runtime/provenance:** deployed browser test for cold Pyodide load, actual package imports, image load/CORS, stdout/check and persistence. A READY deployment or mocked worker is insufficient.
- **G1 — pedagogical pilot:** complete 12–15-activity pilot with assistance-aware feedback, writing/debugging and independent changed-input proof.
- **G2 — migration:** all 61 legacy IDs and state/backup fixtures preserved; robust new progress model.
- **G3 — reproducibility handoff:** local terminal, virtual environment, files, notebook, Git and test workflows actually completed, not simulated.
- **G4 — scientific credibility:** calibrated/annotated imaging where quantitative claims require it; biological replicate/statistics validity.
- **G5 — optional paths and general release:** NGS and ML transfers, accessibility, recovery, latency, independent user testing and release QA.

The gates reflect prior frozen v3 and UI blueprint decisions. They are **not assertions that current UI-first code already passes them**.

### 12.6 Stop/repair criteria

Stop chapter expansion and repair the platform if any of these appear: loss of saved learner work; false Python execution; inaccurate image provenance; inability to import one accepted chapter without manual copy/paste into UI code; unreproducible reference examples; scientific claims built on incorrect axes/calibration; inability to distinguish guided versus independent evidence; a content schema change that breaks previously accepted chapters. Fix the cause before scaling the course.

---
## 13. Detailed 26-chapter syllabus

**How to read:** The chapter mission ID and the competency numbers are canonical presentation assignments from the Witz-first spine. Each mini-goal is a **proposed chapter-authoring unit** with a specific action; the detailed activity count must be determined when the chapter is written and validated. The mini-goal list is complete with respect to each chapter’s assigned v3 competency numbers, but it is **not a claim that the activities have been implemented**.

The Apply and Prove tasks below are *design requirements*. Authors must convert them into executable, independently assessed activities with original code, datasets and tested reference outcomes.

### 13.1 Python — 6 chapters

#### P01 — Run your first scientific program

**Mission:** Understand real Python execution, numerical types, scientific variable names and useful tracebacks, not only a Run button.

**Assigned v3 competencies:** 001, 002, 003, 004, 005, 006, 007 (7). **Target runtime:** browser_pyodide.

**Final deliverable:** A fresh-run script printing a specimen identifier and a correctly calculated, labeled measurement.

**Mini-goals / required teaching content:**

1. **Execute the simplest scientific cell** (competency 001). Predict stdout; run assignment and print separately; distinguish source text, execution and result.
2. **Name biological records** (competency 005). Use variables for a specimen ID, observation count and measurement; explain assignment and naming.
3. **Calculate meaningful quantities** (competency 006). Perform arithmetic with explicit units and scale; distinguish numeric expression from displayed output.
4. **Inspect types and Boolean values** (competency 007). Compare int, float and bool and recognize an unexpected string when a number is required.
5. **Read a failed run** (competency 002). Intentionally trigger and diagnose a NameError or ZeroDivisionError using actual traceback lines.
6. **Find help in documentation** (competency 003). Use help/docstrings and a current API page; identify inputs and return values.
7. **Understand notebook state** (competency 004). Contrast a clean script with out-of-order notebook cells; correct a stale result.

**Apply — cumulative task:** From a blank editor create a parameterized specimen summary for two observations; print a numeric result and an interpretable label.

**Prove — independent transfer:** Given changed names and calibration, recompute a report without hardcoding values and explain why an intentionally stale notebook cell is wrong.

**Required failure/edge investigations:** Misspelled identifiers, missing print(), numeric text versus number, unit confusion, dividing by zero and stale cell state.

**Data and assets:** Synthetic specimen ID/count/scale records. A real attributed microscope image may appear only as motivating context.

**Source audit focus:** Witz 01 cells 0–24 and e01 1–4; Python tutorial; VanderPlas IPython introduction.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Show a real, attributed fluorescence image as context, then have Python print its specimen label and an illustrative measurement; the image is not yet numerically analyzed.
- **First meaningful artifact:** An executable specimen report that can be changed for a second sample within the first learning interaction.
- **Difficulty, autonomy and recovery:** Let the learner bypass known variables via a changed-input test; for repeated NameErrors use a two-variable trace, then return to the report.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### P02 — Create trustworthy sample labels

**Mission:** Construct human-readable sample identifiers and implement transparent decision rules.

**Assigned v3 competencies:** 008, 009, 010, 011 (4). **Target runtime:** browser_pyodide.

**Final deliverable:** An identifier formatter, a small parser and a documented QC decision with a reason.

**Mini-goals / required teaching content:**

1. **Create informative text** (competency 008). Use f-strings, formatting, case and string methods to produce stable sample labels.
2. **Parse a structured identifier** (competency 009). Use split and structural checks; report malformed components rather than guessing.
3. **Compare numerical values** (competency 010). Inspect comparisons, Boolean expressions, inclusive versus exclusive boundaries and type mismatches.
4. **Write conditional QC rules** (competency 011). Use if/elif/else to assign a decision and specific reason under a predeclared rule.

**Apply — cumulative task:** Format records from strain, plate and condition, then validate labels and attach a simple quality flag.

**Prove — independent transfer:** Process unfamiliar labels including extra separators, missing plate digits and borderline QC values; report exactly why each fails.

**Required failure/edge investigations:** Empty strings, underscores inside fields, numeric strings, off-by-one boundaries and QC thresholds selected after observing groups.

**Data and assets:** Toy identifiers and focus scores; thresholds are illustrative and not calibrated instrument rules.

**Source audit focus:** Witz 01 variables/strings; e01 cells 5–6 for text; Witz 08 for conditionals; Python for Biologists.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Reveal that two similarly named image files belong to different conditions, making identifier errors visibly consequential.
- **First meaningful artifact:** A validator that explains *why* a label fails and preserves the original input.
- **Difficulty, autonomy and recovery:** Fast route: validate unfamiliar IDs; recovery: contrast text splitting with structural validation using a small annotated case.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### P03 — Filter recorded microscope fields

**Mission:** Iterate through recorded fields without silently losing identity, missingness or excluded observations.

**Assigned v3 competencies:** 012, 013, 014, 015, 016, 017, 018 (7). **Target runtime:** browser_pyodide.

**Final deliverable:** A reusable simple field-QC report listing accepted, rejected and missing field identifiers.

**Mini-goals / required teaching content:**

1. **Index and slice collections** (competency 016). Retrieve first/last/subsets and explain zero-based positions and excluded slice end.
2. **Change lists without corrupting inputs** (competency 017). Append to a copy and contrast aliasing with independent output lists.
3. **Unpack immutable records** (competency 018). Represent and unpack (field_id, score) pairs and explain tuple immutability.
4. **Iterate over measurements** (competency 012). Use for and if to process every record and summarize accepted observations.
5. **Number fields predictably** (competency 013). Use range/enumerate; separate array index from displayed field number.
6. **Bound repeated work** (competency 014). Write a while loop with explicit termination and avoid indexing beyond list length.
7. **Skip and stop intentionally** (competency 015). Use continue/break without silently hiding missing or rejected records.

**Apply — cumulative task:** Build a field-filter script that returns accepted IDs, missing IDs, rejected IDs, and a consistent summary count.

**Prove — independent transfer:** Process a new record set with changed cutoff, zero records, missing values and nonmonotonic field labels; explain biological unit of analysis.

**Required failure/edge investigations:** None compared with float, duplicate IDs, list mutation, infinite loops, forgotten exclusions and fields treated as biological replicates.

**Data and assets:** Synthetic field records with sample and field identity and explicit training-only scores.

**Source audit focus:** Witz 08, exercise e08 cells 1–6 and Structures appendix.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Show a small field-QC report where dropping a missing focus value would silently change the accepted sample count.
- **First meaningful artifact:** A runnable accepted/rejected/missing field-ID summary, using a new list rather than rewriting source observations.
- **Difficulty, autonomy and recovery:** Offer optional direct filtering; if stuck on loop scope use a per-iteration trace, then retry with a changed list.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### P04 — Organize experimental metadata

**Mission:** Model experimental metadata so sample identities, conditions, channels and measurements can be reliably joined later.

**Assigned v3 competencies:** 019, 020, 021, 022, 023, 024 (6). **Target runtime:** browser_pyodide.

**Final deliverable:** Validated specimen lookup with duplicate, missing and inconsistent metadata reports.

**Mini-goals / required teaching content:**

1. **Map IDs to properties** (competency 019). Construct dictionaries keyed by stable sample IDs with strain, condition, acquisition run and replicate group.
2. **Navigate nested records** (competency 020). Access nested dictionaries, handle absent keys explicitly and compare flat versus nested schemas.
3. **Detect repeated keys** (competency 021). Use sets to find duplicates without mistaking different fields from one specimen as duplicate specimens.
4. **Transform records concisely** (competency 022). Build a small comprehension only after an equivalent explicit loop is understood.
5. **Traverse dictionary metadata** (competency 023). Iterate items/keys/values and preserve meaning when constructing derived tables.
6. **Pair related observations** (competency 024). Use zip with explicit length checks; show the danger of silent truncation.

**Apply — cumulative task:** Create a reproducible dictionary-based specimen inventory for microscope images and flag records needing manual review.

**Prove — independent transfer:** Given inconsistent metadata from a second acquisition batch, detect missing field, repeated specimen key and mismatched paired arrays.

**Required failure/edge investigations:** KeyError, ambiguous uniqueness level, shared mutable defaults, silent zip truncation, accidental field/specimen mixing.

**Data and assets:** Synthetic but realistic strain/specimen/field/channel records; define specimen as the independent unit separately.

**Source audit focus:** Witz Structures appendix; Python for Biologists dictionaries; Python standard-library reference.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Present a metadata table with one missing record and two duplicate IDs and ask which image could be misattributed.
- **First meaningful artifact:** A queryable specimen-to-field metadata map with duplicate warnings.
- **Difficulty, autonomy and recovery:** Use either a microscope-image or DNA-sample record context; provide a nested-dict path visualizer after repeated KeyErrors.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### P05 — Make a reusable analysis function

**Mission:** Move from pasted calculation blocks to clear, testable, reusable scientific code.

**Assigned v3 competencies:** 025, 026, 027, 028, 029, 030 (6). **Target runtime:** browser_pyodide.

**Final deliverable:** Parameterized, documented measurement/QC function with tests and well-defined invalid-input behavior.

**Mini-goals / required teaching content:**

1. **Return a calculated result** (competency 025). Define a function, call it, compare return with print and use a meaningful scientific name.
2. **Pass parameters and defaults** (competency 026). Eliminate hardcoded thresholds and make optional arguments scientifically explicit.
3. **Understand scope** (competency 027). Contrast local variables, arguments and outer state; avoid hidden dependencies.
4. **Write a small code contract** (competency 028). Add docstring and type hints describing inputs, units, output and exceptions.
5. **Handle failures intentionally** (competency 029). Raise meaningful exceptions and catch only expected errors without swallowing actual bugs.
6. **Use imports and modules** (competency 030). Import small library functions and move reusable code into a module.

**Apply — cumulative task:** Write a well-documented function computing a microscope-field quality report from explicit records and parameters.

**Prove — independent transfer:** Use the same function on unfamiliar data with empty inputs, missing values and an invalid cutoff, diagnosing at least one introduced bug.

**Required failure/edge investigations:** Missing return, mutable default, global state, overly broad except, incorrect type hints and untested parameters.

**Data and assets:** Small structured field records reused from P03/P04.

**Source audit focus:** Witz Functions appendix and 01 cells 25–34; Python for Biologists functions; Python documentation.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Contrast a copied QC calculation with one callable function applied to two plates.
- **First meaningful artifact:** A small parameterized function with normal/boundary/invalid-input evidence.
- **Difficulty, autonomy and recovery:** Experienced learner may write the function immediately; recovery simplifies return/parameter distinction before returning to the same task.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### P06 — Save and reproduce a real script

**Mission:** Make coding portable from a web lesson to an actual local research working environment.

**Assigned v3 competencies:** 031, 032, 033, 034, 035, 036 (6). **Target runtime:** local_python + jupyter; browser preview only.

**Final deliverable:** A small repository/folder containing a runnable script, sample metadata, tests, environment documentation and Git history.

**Mini-goals / required teaching content:**

1. **Read and write plain files** (competency 031). Use pathlib/UTF-8 context managers and distinguish file paths from contents.
2. **Create a real environment** (competency 032). Create/activate a local venv, install pinned dependencies, identify Python executable and explain clean setup.
3. **Serialize metadata** (competency 033). Read/write JSON or CSV while preserving IDs, numeric types and missing-value rules.
4. **Write reproducible tests** (competency 034). Create meaningful pytest-style checks with valid, boundary and failure inputs.
5. **Package a tiny workflow** (competency 035). Separate script, reusable module, inputs, outputs and README with a clean entry point.
6. **Record a Git change** (competency 036). Inspect status/diff, commit intended changes and reproduce a fresh checkout.

**Apply — cumulative task:** Run the whole sample-QC workflow from a fresh local directory with a README and tests.

**Prove — independent transfer:** Reconstruct the workflow in a new clean environment from versioned source and show a real test result and Git commit.

**Required failure/edge investigations:** Wrong working directory, accidental absolute paths, missing dependencies, binary-vs-text handling, overwriting files, incomplete Git staging.

**Data and assets:** Locally generated synthetic CSV/JSON and exact environment instructions.

**Source audit focus:** Python documentation, Python for Biologists file handling, VanderPlas notebooks; Git and pytest official docs.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Show how a result disappears or changes after running out-of-order notebook cells or from a different working directory.
- **First meaningful artifact:** A saved and retested script with explicit inputs, version/requirements and repeatable output.
- **Difficulty, autonomy and recovery:** Offer a local-Jupyter handoff checklist, not fake browser emulation; recovery begins with a minimal known-working local file path.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

### 13.2 Microscopy — 13 chapters

#### I01 — Open a real microscopy image

**Mission:** Recognize images as typed numerical arrays with provenance, channels and coordinate conventions.

**Assigned v3 competencies:** 037, 038, 039, 071, 072, 073, 074, 075 (8). **Target runtime:** browser_pyodide.

**Final deliverable:** An attributed real-image loading notebook/report showing source, shape, pixel values, axes and channel interpretation.

**Mini-goals / required teaching content:**

1. **Create a typed numerical array** (competency 037). Use NumPy arrays, dtype inspection and comparison with nested Python lists.
2. **Read shape and dimensionality** (competency 038). Explain rows/columns/channels and use shape/ndim without guessing physical size.
3. **Index rows, columns and planes** (competency 039). Extract known pixel values; distinguish Python indexing from image (x,y) readout.
4. **Establish image provenance** (competency 071). Document source/version/license, biological identity and what measurements are appropriate.
5. **Decode a source image** (competency 072). Read a genuine file into an array and verify dimensions against a source manifest.
6. **Inspect RGB/channels** (competency 073). Distinguish composite display colors from independently acquired fluorescence channels.
7. **Explain coordinates** (competency 074). Relate row-column indexing, origin and image orientation.
8. **Interpret bit depth** (competency 075). Check dtype, intensity range and saturation; contrast 8-bit composites with 16-bit quantitative arrays.

**Apply — cumulative task:** Load a correctly credited real fluorescence image, inspect and report its numeric properties and channel caveats.

**Prove — independent transfer:** Given an unfamiliar image, identify dtype, axes, channels and what its pixels cannot establish about absolute signal.

**Required failure/edge investigations:** Axis swap, wrong channel assumption, image load failure, scaling a JPEG as calibrated image and interpreting dtype from display alone.

**Data and assets:** Real HPA visual image with verified image-level rights; optional local metadata-rich raw image with calibration.

**Source audit focus:** Witz 02/e02 and 03/e03; NumPy; Bankhead; HPA source and license.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Load a licensed real fluorescence image and display it beside its NumPy array shape without inferring calibrated signal.
- **First meaningful artifact:** An image-provenance note and reliable shape/channel/dtype inspector.
- **Difficulty, autonomy and recovery:** Fast route on array indexing; recovery uses a 3×3 numeric grid before accessing the real image.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### I02 — Crop and inspect image planes

**Mission:** Select biologically meaningful image regions while preserving original data and axis/calibration metadata.

**Assigned v3 competencies:** 040, 041, 077, 079, 080, 081 (6). **Target runtime:** browser_pyodide + local_python/jupyter for OME-TIFF.

**Final deliverable:** Documented ROI crop and selected Z/channel/time plane with correct pixel bounds and units.

**Mini-goals / required teaching content:**

1. **Slice an array region** (competency 040). Use NumPy slicing with exclusive stop bounds and test dimensions of crop.
2. **Distinguish view and copy** (competency 041). Demonstrate shared-memory changes in a view versus an independent copy.
3. **Select a biological ROI** (competency 077). Define ROI coordinates and preserve crop offset and original image ID.
4. **Convert pixels to area** (competency 079). Use measured pixel size along both axes and correct squared-unit conversion, or mark unknown.
5. **Inspect stack axes** (competency 080). Identify C/Z/T from valid metadata; avoid fixed third-axis assumptions.
6. **Read OME-TIFF locally** (competency 081). Inspect metadata in a real Jupyter/local Python environment and document axis order.

**Apply — cumulative task:** Extract a valid ROI from an attributed multichannel image and report its origin, dimensions and optional calibrated area.

**Prove — independent transfer:** Perform the same analysis for a differently shaped image or axis order and identify missing calibration before reporting µm².

**Required failure/edge investigations:** Off-by-one crop, empty ROI, out-of-bounds, reshaping rather than slicing, view mutation and wrong channel/Z selection.

**Data and assets:** One verified multichannel image and a small OME-TIFF example with explicit source metadata.

**Source audit focus:** Witz 03/e03, OME-TIFF documentation, Bankhead.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Invite the learner to crop a biological ROI whose coordinates must remain valid when the image dimensions change.
- **First meaningful artifact:** An overlay showing the selected ROI, original-image link and valid crop dimensions.
- **Difficulty, autonomy and recovery:** Provide a small index-boundary animation/trace only if slicing fails; do not automatically fix the ROI for the learner.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### I03 — Calculate useful pixel measurements

**Mission:** Use vectorized NumPy operations and correct missing-data/precision policies to measure regions.

**Assigned v3 competencies:** 042, 043, 044, 045, 046, 047, 048, 049, 050, 078 (10). **Target runtime:** browser_pyodide.

**Final deliverable:** A parameterized ROI/mask measurement producing transparent pixel statistics and validity checks.

**Mini-goals / required teaching content:**

1. **Vectorize numerical operations** (competency 042). Apply NumPy ufuncs to arrays; compare elementwise operations with explicit loops.
2. **Use broadcasting correctly** (competency 043). Explain shape compatibility and identify a silent channel/row broadcast bug.
3. **Build Boolean masks** (competency 044). Create logical masks from explicit threshold rules and inspect selected-pixel count.
4. **Assign through masks safely** (competency 045). Modify a copy with Boolean indexing and inspect unintended source mutation.
5. **Aggregate on chosen axes** (competency 046). Use mean/sum/min/max with axis; explain what dimension is removed.
6. **Treat missing numbers** (competency 047). Separate NaN/missing-data policy from biological zero measurements.
7. **Calculate percentiles and ranks** (competency 048). Compare robust percentile estimates across changed distributions.
8. **Use random simulation with a seed** (competency 049). Generate controlled noise for a *synthetic* stress test with reproducible seed.
9. **Avoid numeric overflow** (competency 050). Check uint8/uint16 overflow and explicit safe casting before subtraction.
10. **Quantify an ROI** (competency 078). Measure signal in the selected ROI with explicit mask bounds and units.

**Apply — cumulative task:** Implement a function that measures a selected image region and returns a compact summary with dtype and mask provenance.

**Prove — independent transfer:** Handle a new image shape, bit depth, missing pixels and an empty mask; explain why an apparently valid mean could be misleading.

**Required failure/edge investigations:** Broadcast mistakes, silent overflow, zero-size mask, divide by zero, NaN, wrong axis and dtype conversion.

**Data and assets:** Verified real image plus small labeled toy arrays and synthetic noise examples.

**Source audit focus:** Witz 02/e02 and 03/e03; VanderPlas NumPy; NumPy docs.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Show why a seemingly plausible mean intensity changes after dtype overflow or incorrect broadcasting.
- **First meaningful artifact:** A reusable numeric ROI measurement with units/tolerance and a valid mask.
- **Difficulty, autonomy and recovery:** Optional vectorized advanced route; recovery focuses on array shapes and one-element numeric inspection.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### I04 — Display an interpretable microscopy image

**Mission:** Produce honest scientific displays and plots that separate rendered appearance from underlying data.

**Assigned v3 competencies:** 063, 064, 065, 067, 076, 082 (6). **Target runtime:** browser_pyodide.

**Final deliverable:** A figure showing verified channel view, pixel distribution and annotated regions with correct scales/labels.

**Mini-goals / required teaching content:**

1. **Make a basic scientific plot** (competency 063). Create Matplotlib figure/axes, labels and reproducible saved output.
2. **Plot quantitative relationships** (competency 064). Use scatter/line representations for independent variables and identify misleading ordering.
3. **Show distributions** (competency 065). Choose histogram bins and compare intensity distributions.
4. **Build compound figures** (competency 067). Arrange panels with consistent axis labels and color legends.
5. **Adjust display only** (competency 076). Change vmin/vmax without changing original image pixels; show the difference.
6. **Interpret image histograms** (competency 082). Connect intensity distributions to later thresholding without assuming bimodality.

**Apply — cumulative task:** Prepare a compact, readable multi-panel figure with channel image and intensity histogram.

**Prove — independent transfer:** Given an unfamiliar image and an intentionally misleading display, diagnose contrast/axis/color-limit choices and repair the figure.

**Required failure/edge investigations:** Color map that hides data, mislabeled units, clipping, histogram normalized incorrectly, direct figure mutation.

**Data and assets:** Verified microscopy image and its numeric array; no synthetic false biological labels.

**Source audit focus:** Witz 03/e03; VanderPlas Matplotlib; Bankhead visualizations.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Display the same fluorescence data under two contrast settings and ask which scientific conclusions remain invariant.
- **First meaningful artifact:** A labeled channel figure and histogram whose raw array is unchanged.
- **Difficulty, autonomy and recovery:** Offer direct plot task or guided Matplotlib skeleton; clarify image display vs data modification after error.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### I05 — Separate image foreground from background

**Mission:** Understand how pre-processing, noise and threshold selection influence candidate objects.

**Assigned v3 competencies:** 083, 084, 085, 086, 087, 088 (6). **Target runtime:** browser_pyodide.

**Final deliverable:** Documented image/foreground mask pipeline with parameter sensitivity comparison.

**Mini-goals / required teaching content:**

1. **Estimate background** (competency 083). Compare simple estimators, apply subtraction in safe numeric dtype and examine negative/clip policy.
2. **Apply Gaussian smoothing** (competency 084). Connect filter scale to image feature size and signal loss.
3. **Choose a denoising method** (competency 085). Compare noise models and one alternative denoiser without magical defaults.
4. **Create a global mask** (competency 086). Build a Boolean foreground mask and visualize overlay against source.
5. **Compare threshold algorithms** (competency 087). Compare manual/automatic thresholds and describe assumptions, not just the count.
6. **Quantify sensitivity** (competency 088). Vary cutoffs systematically and plot candidate area/count sensitivity.

**Apply — cumulative task:** Generate a per-image mask with documented preprocessing, visual overlay and sensitivity plot.

**Prove — independent transfer:** On a new image with uneven background or changed signal distribution, identify which threshold rule fails and explain why.

**Required failure/edge investigations:** Uint subtraction wrapping, excessive smoothing, uneven illumination, empty masks, contrast enhancement mistaken for raw measurement.

**Data and assets:** At least two verified real images with different appearance and a synthetic controlled example.

**Source audit focus:** Witz 04/e04, 05/e05, scikit-image filters, Bankhead.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Reveal how a threshold shifts a visible candidate mask and why one setting does not generalize.
- **First meaningful artifact:** A reproducible threshold comparison with image/mask overlay and sensitivity summary.
- **Difficulty, autonomy and recovery:** If a novice changes several parameters simultaneously, provide a one-parameter experiment before independent comparison.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### I06 — Clean a mask and label candidate nuclei

**Mission:** Turn imperfect pixel masks into candidate regions while auditing touching, small and boundary objects.

**Assigned v3 competencies:** 089, 090, 091, 092, 093, 094, 095 (7). **Target runtime:** browser_pyodide.

**Final deliverable:** Parameterized segmentation with per-object table, overlay and annotated limitations.

**Mini-goals / required teaching content:**

1. **Apply binary morphology** (competency 089). Compare opening/closing/erosion/dilation with chosen structure scale.
2. **Label connected components** (competency 090). Assign region IDs; understand connectivity and label background.
3. **Filter by candidate size** (competency 091). Use measured area and physical units only when calibration exists.
4. **Treat border objects** (competency 092). Audit whether excluding touching-edge regions is justified and recorded.
5. **Investigate touching candidates** (competency 093). Explore separation strategies and identify over-/under-segmentation.
6. **Reason about 3D** (competency 094). Explain why 2D masks do not automatically solve volumetric segmentation.
7. **Compose a parameterized pipeline** (competency 095). Create reusable processing sequence with checks and recorded parameters.

**Apply — cumulative task:** Generate a reproducible candidate nucleus-like object table and annotated overlays across more than one image.

**Prove — independent transfer:** Find split/merge and edge-object errors in unfamiliar data; avoid claiming that connected components are validated nuclei.

**Required failure/edge investigations:** Connectivity choice, border exclusion bias, object merging, mixed units, empty region set, 2D/3D confusion.

**Data and assets:** Real HPA teaching images plus a separately annotated small reference mask when making accuracy statements.

**Source audit focus:** Witz 04–06 and e05/e06; scikit-image segmentation; Bankhead.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Show how touching nuclei-like regions merge despite an attractive mask, prompting a failure-aware segmentation task.
- **First meaningful artifact:** An inspectable labeled-object overlay and candidate table with clear limitations.
- **Difficulty, autonomy and recovery:** Optional morphological parameter exploration; recovery isolates a 5×5 binary example for connected-component reasoning.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### I07 — Clean a scientific measurements table

**Mission:** Use Pandas with a trustworthy schema and explicit missingness/identifier policies.

**Assigned v3 competencies:** 051, 052, 053, 054, 055, 056, 057 (7). **Target runtime:** browser_pyodide.

**Final deliverable:** Validated per-field measurement table with documented cleaning/audit log.

**Mini-goals / required teaching content:**

1. **Construct a DataFrame** (competency 051). Create records with typed columns; inspect rows/dtypes before calculations.
2. **Load typed CSV** (competency 052). Read an external table without losing leading zeros or silently changing ID types.
3. **Select the needed observations** (competency 053). Use loc/iloc and column selection with clear index/label semantics.
4. **Validate schema** (competency 054). Check required columns, types, allowed values and unit consistency.
5. **Normalize identifiers** (competency 055). Standardize whitespace/case only where scientifically justified and preserve originals.
6. **Audit duplicates** (competency 056). Detect duplicate keys, distinguishing valid repeated fields from invalid repeated identifiers.
7. **Handle missing records** (competency 057). Report missingness explicitly; compare exclusion versus retained flag.

**Apply — cumulative task:** Import a supplied microscopy measurement CSV and export an auditable cleaned table plus QC warnings.

**Prove — independent transfer:** Given a new table with conflicting sample IDs, unexpected types and missing rows, repair or flag problems without losing valid replicates.

**Required failure/edge investigations:** Float-converted IDs, chained assignment pitfalls, silent dropna, many-to-one mistakes and duplicate legitimate fields.

**Data and assets:** Small real-derived or correctly synthetic field measurement CSV with sample/field/replicate columns.

**Source audit focus:** VanderPlas Pandas; Witz 06; Pandas IO and data validation docs.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Open a measurement CSV that looks valid but hides duplicate IDs and inconsistent data types.
- **First meaningful artifact:** A non-destructive DataFrame QC report listing unresolved rows.
- **Difficulty, autonomy and recovery:** Fast route for experienced Pandas users; recovery uses a two-column table and typed CSV example.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### I08 — Merge measurements and make a report

**Mission:** Link measurement and experimental metadata while preventing row inflation and ambiguous grouping.

**Assigned v3 competencies:** 058, 059, 060, 061, 062, 066, 069, 070 (8). **Target runtime:** browser_pyodide.

**Final deliverable:** Traceable joined table and readable figures suitable for a reproducible experiment summary.

**Mini-goals / required teaching content:**

1. **Join compatible tables** (competency 058). Choose keys and validation cardinality; demonstrate a duplicate-key explosion.
2. **Aggregate responsibly** (competency 059). Groupby fields/conditions, keeping replicate identity distinct from field count.
3. **Reshape representations** (competency 060). Use long and wide formats with stable id and channel columns.
4. **Handle categories and time** (competency 061). Parse timestamps and ordered categories without accidental lexicographic ordering.
5. **Export analysis-ready data** (competency 062). Save tables with schema/version/source information and deterministic ordering.
6. **Compare observed groups** (competency 066). Create paired/group figures with raw replicate values rather than only bars.
7. **Design readable scientific figures** (competency 069). Choose scales, legends and accessible colors without hiding variation.
8. **Export high-quality figures** (competency 070). Save correctly labeled figures, preserving fonts/resolution and a provenance reference.

**Apply — cumulative task:** Build a reproducible figure and table export from joined sample/imaging metadata with join checks.

**Prove — independent transfer:** Diagnose a misleading plot caused by a multiplicative join and correct it on unfamiliar input files.

**Required failure/edge investigations:** Many-to-many joins, dropped identifiers, time-zone confusion, plot of fields instead of replicates, unlabeled axes.

**Data and assets:** Two related CSVs with explicit sample/field keys and batch data.

**Source audit focus:** Witz 06/07; VanderPlas Pandas and Matplotlib; Pandas merge documentation.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Show how joining a table can accidentally multiply sample rows and alter a treatment average.
- **First meaningful artifact:** A traceable merged dataset and labeled figure with join-validation evidence.
- **Difficulty, autonomy and recovery:** Advanced path diagnoses a deliberately bad join; recovery visualizes row keys before the join.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### I09 — Measure nuclear features and protein signal

**Mission:** Interpret region labels as measurement compartments, not proof of biological identity.

**Assigned v3 competencies:** 096, 097, 098, 099, 100, 101 (6). **Target runtime:** browser_pyodide.

**Final deliverable:** Region properties and nuclear/edge/cytoplasmic candidate intensity report with validation overlays.

**Mini-goals / required teaching content:**

1. **Measure region properties** (competency 096). Calculate area, centroid and morphology from labeled regions with a typed output table.
2. **Measure channel signal** (competency 097). Extract mean/integrated intensity under masks, documenting background and saturation.
3. **Compare compartment signals** (competency 098). Define nucleus versus edge or cytoplasm masks and a ratio with denominator checks.
4. **Audit colocalization** (competency 099). Distinguish overlap, correlation and actual molecular interaction; inspect controls.
5. **Find candidate puncta** (competency 100). Use peak detection with minimum distance/intensity rule and inspect false detections.
6. **Analyze spatial proximity** (competency 101). Compute distances with coordinate and physical-unit consistency.

**Apply — cumulative task:** Create a labeled object table with per-compartment fluorescence summaries and overlays for quality review.

**Prove — independent transfer:** On an unfamiliar multichannel image, detect wrong-channel measurement, touching-mask artifacts or zero-denominator localization ratios.

**Required failure/edge investigations:** Signal bleed-through, background choice, missing segmentation, mask mismatch, saturated regions and correlation mistaken for interaction.

**Data and assets:** Verified multichannel image, source-channel description and independently checked masks where performance is claimed.

**Source audit focus:** Witz 06/e06, Witz Demo; Bankhead; scikit-image regionprops.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Compare raw channel and nuclear ROI overlays to demonstrate how an incorrect mask changes localization measurements.
- **First meaningful artifact:** A compartment measurement table linked to region labels and source pixels.
- **Difficulty, autonomy and recovery:** Offer either protein localization or puncta example; recovery separates region-label interpretation from intensity quantification.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### I10 — Validate tracking and segmentation

**Mission:** Check whether extracted objects and trajectories agree with independent reference annotations.

**Assigned v3 competencies:** 102, 103, 104, 105, 106, 107 (6). **Target runtime:** browser_pyodide.

**Final deliverable:** Segmentation/detection validation and a small tracking error report with explicit ambiguity.

**Mini-goals / required teaching content:**

1. **Calculate displacement** (competency 102). Compute movement from paired positions using time and pixel calibration when available.
2. **Recognize tracking ambiguity** (competency 103). Identify mergers, splits, missed observations and unreasonable nearest-neighbor assumptions.
3. **Define annotation standards** (competency 104). Write independent annotation instructions, class definitions and ambiguity rules.
4. **Evaluate pixel masks** (competency 105). Compute precision/recall or overlap appropriately and inspect disagreement overlays.
5. **Evaluate object detections** (competency 106). Match predicted/reference objects by declared rule; count TP/FP/FN and errors.
6. **Stress-test the pipeline** (competency 107). Compare performance on varying backgrounds, densities and annotation quality.

**Apply — cumulative task:** Evaluate candidate segmentation and motion on a held-out annotated set and produce an error taxonomy.

**Prove — independent transfer:** Find systematic false positives in new reference annotations and justify how ambiguous touching objects are scored.

**Required failure/edge investigations:** Masks scored against self-generated truth, leakage from tuning set, pixel/object metric confusion, wrong matching distance.

**Data and assets:** Independent human-annotated subset with provenance plus recorded acquisition intervals/calibration when motion is quantified.

**Source audit focus:** Witz 09; scikit-image and Bankhead validation concepts.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Present a segmentation result that looks plausible but fails against independently marked reference objects.
- **First meaningful artifact:** A transparent pixel/object error report and one corrected pipeline assumption.
- **Difficulty, autonomy and recovery:** Fast route calculates precision/recall from reference objects; recovery builds a four-case confusion table.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### I11 — Respect biological replicates and batches

**Mission:** Separate acquisition structure from experimental independence before drawing treatment conclusions.

**Assigned v3 competencies:** 108, 109, 110, 111, 112, 113, 114 (7). **Target runtime:** browser_pyodide.

**Final deliverable:** Replicate-level dataset and documented QC/batch accounting with a defined comparison.

**Mini-goals / required teaching content:**

1. **Identify experimental units** (competency 108). Trace specimen/animal/culture IDs separately from fields, cells and images.
2. **Audit pairing** (competency 109). Compute matched changes by stable pair ID and identify missing pairs.
3. **Audit QC exclusions** (competency 110). Track rejected/missing observations by group and assess selection bias.
4. **Define an estimand** (competency 111). State the treatment effect of interest and its observational unit.
5. **Aggregate at correct level** (competency 112). Summarize fields within biological replicate before group comparison.
6. **Detect batch confounding** (competency 113). Investigate acquisition day/operator/run versus condition correlation.
7. **Implement transparent normalization** (competency 114). Describe reference/batch normalization and evaluate its potential to remove biological signal.

**Apply — cumulative task:** Produce per-replicate treatment summaries with a QC and batch report.

**Prove — independent transfer:** Expose pseudoreplication and batch confounding in a convincing-looking figure from unfamiliar data.

**Required failure/edge investigations:** Treating 100 fields as n=100 animals, post-hoc exclusion, pairing errors, normalization absorbing treatment effect.

**Data and assets:** Hierarchical data with field→animal/specimen→batch→condition identity and known missingness.

**Source audit focus:** Bankhead measurement validity; VanderPlas/Pandas; robust statistics resources.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Contrast a convincing 200-field plot with the same data summarized at the true biological-replicate level.
- **First meaningful artifact:** A per-replicate summary showing sample units, exclusions and acquisition batches.
- **Difficulty, autonomy and recovery:** Learner chooses a microscopy or small plate-assay dataset; if confused, recover with a nested-field/specimen diagram.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### I12 — Report uncertainty without misleading plots

**Mission:** Choose statistics and figures based on the real unit of replication and clearly defined comparison.

**Assigned v3 competencies:** 068, 115, 116, 117, 118, 119, 120, 121, 122 (9). **Target runtime:** browser_pyodide.

**Final deliverable:** Reproducible replicate-level figure and statistical narrative with effect size and limitations.

**Mini-goals / required teaching content:**

1. **Distinguish SD and SEM** (competency 115). Explain biological variability versus uncertainty of mean under stated assumptions.
2. **Choose robust summaries** (competency 116). Compare mean, median and spread under skew/outliers.
3. **Build confidence intervals** (competency 117). Compute/interpret an interval, distinguishing parameter uncertainty from sample range.
4. **Bootstrap correctly** (competency 118). Resample independent experimental units, preserving within-replicate field structure.
5. **Choose a defensible comparison** (competency 119). Select paired/unpaired/nonparametric logic based on design, not graph appearance.
6. **Report effect size and multiplicity** (competency 120). State direction/magnitude, uncertainty and multiple-testing limitations.
7. **Show replicate-level evidence** (competency 121). Plot paired/raw replicate values and uncertainty without hiding the sample distribution.
8. **Build a reproducible summary** (competency 122). Combine input manifest, analysis code, figure, estimates, exclusions and conclusions.
9. **Visualize uncertainty** (competency 068). Show valid error bars/intervals and explain which statistical object they represent.

**Apply — cumulative task:** Create a scientific results page with per-replicate observations, uncertainty, effect size and caveats.

**Prove — independent transfer:** Given a changed experimental design, argue why one statistical summary is invalid and produce a corrected figure/report.

**Required failure/edge investigations:** SEM used as SD, field-level bootstrap, unaccounted batch, cherry-picked tests, p-value interpreted as effect size.

**Data and assets:** Hierarchical independent biological replicates with clearly documented acquisition design.

**Source audit focus:** VanderPlas figures, statistics references, domain-specific experimental-design literature.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Show the difference between within-sample variability and uncertainty of a treatment mean before any statistical test.
- **First meaningful artifact:** A replicate-level figure with stated effect, uncertainty and interpretation.
- **Difficulty, autonomy and recovery:** Advanced route critiques a flawed figure; recovery contrasts SD/SEM using a tiny explicit replicate table.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### I13 — Build the complete image-analysis pipeline

**Mission:** Integrate the entire programming and microscopy path into independently defensible analysis.

**Assigned v3 competencies:** 150, 151, 152, 153, 154 (5). **Target runtime:** browser_pyodide + local_python/jupyter as needed.

**Final deliverable:** Versioned code, provenance, masks, measurements, validation, figures and limitations for a real-image nuclear/edge localization project.

**Mini-goals / required teaching content:**

1. **Debug an unfamiliar analysis** (competency 150). Identify and fix bugs in another author’s scientific script using real tracebacks and checks.
2. **Clean a new metadata collection** (competency 151). Audit and join an unfamiliar file collection with clear provenance and missingness.
3. **Create a figure independently** (competency 152). Choose appropriate plot types, labels and uncertainty for new observations.
4. **Audit a novel microscopy result** (competency 153). Detect wrong axes/channels/calibration and questionable segmentation or replicate claims.
5. **Finish a real-image project** (competency 154). Integrate image processing, measurement, validation, statistics and reproducible reporting without a supplied complete solution.

**Apply — cumulative task:** Build a multi-image nuclear-versus-edge candidate localization pipeline inspired by Witz, with method and biological validity clearly separated.

**Prove — independent transfer:** Run the pipeline on unseen images/metadata; provide a reproducibility package and short scientific report including failures and unresolved interpretations.

**Required failure/edge investigations:** Unsupported fluorescence calibration, training on evaluation images, undocumented segmentation params, unjustified localization interpretation.

**Data and assets:** Verified Witz HPA Cell Atlas images and independent annotated/calibrated assets where required by scientific claims.

**Source audit focus:** Witz 07, Demo, prior chapters; Bankhead and official image-analysis APIs.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Offer an unfamiliar set of real, rights-cleared fluorescence images with a concrete but bounded localization question.
- **First meaningful artifact:** A complete reproducible pipeline with overlays, tables, validations, constraints and a short scientific report.
- **Difficulty, autonomy and recovery:** Let the learner choose one biologically defensible extension; if stuck, isolate the failing stage rather than reveal the entire pipeline.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

### 13.3 Sequence/NGS — 4 chapters

#### N01 — Validate a new DNA sequence

**Mission:** Transfer string/loop/validation skills to biologically correct sequence handling.

**Assigned v3 competencies:** 123, 124, 125, 126 (4). **Target runtime:** browser_pyodide.

**Final deliverable:** Sequence validation, GC fraction, reverse-complement and translation functions with ambiguity policies.

**Mini-goals / required teaching content:**

1. **Validate DNA alphabet** (competency 123). Check case, DNA bases, empty input and IUPAC ambiguity symbols with explicit policy.
2. **Calculate GC fraction** (competency 124). Define denominator for ambiguous bases, avoid zero-length division and interpret result.
3. **Reverse-complement DNA** (competency 125). Construct strand-aware transformation with ambiguity support and tests.
4. **Translate a coding sequence** (competency 126). Use codon table, reading frame and stop/partial-codon policy.

**Apply — cumulative task:** Create a small standalone DNA QC utility and document conventions.

**Prove — independent transfer:** Analyze previously unseen ambiguous and empty sequences and explain how ambiguity policy changes GC fraction.

**Required failure/edge investigations:** RNA U versus DNA T confusion, reading frame errors, ambiguous bases counted inconsistently, empty denominators.

**Data and assets:** Public or synthetic sequence strings with documented ambiguity and coding status.

**Source audit focus:** Python for Biologists, Biopython tutorial, IUPAC base definitions.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Check whether DNA of a specimen can be trusted when ambiguous bases are present, not merely print a string.
- **First meaningful artifact:** A sequence validator with explicit ambiguity/GC/translation policies and changed-input output.
- **Difficulty, autonomy and recovery:** Optional direct coding; recovery contrasts a short unambiguous and ambiguous read.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### N02 — Read real FASTA and FASTQ records

**Mission:** Use Biopython records and file parsers while retaining sequence IDs and base-quality semantics.

**Assigned v3 competencies:** 127, 128, 129, 130 (4). **Target runtime:** browser_pyodide.

**Final deliverable:** Robust FASTA/FASTQ reading/writing script with ID, interval and record validation.

**Mini-goals / required teaching content:**

1. **Create Biopython sequence records** (competency 127). Use Seq/SeqRecord with identifiers and annotations.
2. **Read/write FASTA** (competency 128). Parse and export records without losing primary identifiers or sequence content.
3. **Extract genomic intervals** (competency 129). State 0/1-based and half-open/inclusive coordinate conventions correctly.
4. **Parse FASTQ qualities** (competency 130). Read FASTQ, inspect Phred quality values and validate sequence/quality length alignment.

**Apply — cumulative task:** Implement an input-validation and sequence-summary utility for a small real FASTA/FASTQ dataset.

**Prove — independent transfer:** Given new records with malformed quality length and surprising identifiers, report exact failures rather than silently discard.

**Required failure/edge investigations:** Wrong coordinates, duplicate sequence IDs, FASTQ encoding assumptions, newline/multiline parsing errors.

**Data and assets:** Licensed public FASTA/FASTQ samples and small synthetic malformed fixtures.

**Source audit focus:** Official Biopython Tutorial; NCBI sequence format references.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Display a real, permitted sequence record with both identity and sequence metadata and trace a parsing failure.
- **First meaningful artifact:** An auditable FASTA/FASTQ reader that preserves record IDs and quality lengths.
- **Difficulty, autonomy and recovery:** Alternate context: a gene fragment or read-QC sample; recovery uses one minimal well-formed record.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### N03 — Inspect read quality and k-mers

**Mission:** Summarize sequence read quality and motifs under documented policies.

**Assigned v3 competencies:** 131, 132, 133, 134 (4). **Target runtime:** browser_pyodide.

**Final deliverable:** Small FASTQ QC and k-mer/alignments report with explicit quality thresholds.

**Mini-goals / required teaching content:**

1. **Summarize quality profiles** (competency 131). Compute per-cycle/per-read Phred statistics, handle variable-length reads.
2. **Trim by a declared rule** (competency 132). Implement and test an explicit tail-trimming policy, preserving read IDs.
3. **Count k-mers** (competency 133). Count overlapping k-mers, ambiguous inputs and short sequences.
4. **Perform basic alignments** (competency 134). Configure small pairwise alignment scores and inspect ties/gaps.

**Apply — cumulative task:** Produce read-quality plots and a small transparent QC record.

**Prove — independent transfer:** Apply the same processing to different read lengths, quality distributions and ambiguous bases; justify differences.

**Required failure/edge investigations:** Discarding missing reads, off-by-one trimming, false certainty from Q scores, reverse-complement mishandling.

**Data and assets:** Licensed small FASTQ set plus synthetic error cases; full large-read dataset not required.

**Source audit focus:** Official Biopython Tutorial, NGS quality definitions and Pandas/Matplotlib prior lessons.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Show quality degradation across cycles and ask whether a trimming rule changes usable sequence content.
- **First meaningful artifact:** A tested per-cycle quality summary and small QC report.
- **Difficulty, autonomy and recovery:** Harder route critiques an overaggressive trim; recovery practices Phred-score interpretation with four bases.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### N04 — Summarize coverage and count features

**Mission:** Connect sequencing mapping summaries with coverage and simple count normalization while stating limitations.

**Assigned v3 competencies:** 135, 136, 137, 138, 155 (5). **Target runtime:** browser_pyodide + local_python/jupyter for larger or unsupported dependencies.

**Final deliverable:** Auditable introductory NGS QC report with mapping, coverage, count tables and normalization caveats.

**Mini-goals / required teaching content:**

1. **Interpret mapping metrics** (competency 135). Summarize mapped/unmapped reads, multimapping and reference assumptions.
2. **Calculate reference coverage** (competency 136). Compute depth from intervals with coordinate and zero-coverage checks.
3. **Construct a count matrix** (competency 137). Join feature/replicate counts without duplicate-key inflation.
4. **Calculate CPM** (competency 138). Normalize counts for library size and explain what CPM cannot correct.
5. **Complete a sequence-QC project** (competency 155). Independently process and document an unfamiliar small NGS dataset.

**Apply — cumulative task:** Build a compact, reproducible sequence-analysis notebook/report with methodological caveats.

**Prove — independent transfer:** Reanalyze an unfamiliar count/coverage dataset and explain why CPM alone is not differential-expression inference.

**Required failure/edge investigations:** Wrong interval convention, zero library total, count normalization conflated with statistical modeling, sample mismatch.

**Data and assets:** Small reference sequence, interval/mapping summary and traceable count matrix.

**Source audit focus:** Official Biopython docs, Python for Biologists, genomic analysis method documentation.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Compare two libraries with different sizes to show why raw feature counts are not automatically comparable.
- **First meaningful artifact:** A documented coverage/count summary with a precise statement of CPM limitations.
- **Difficulty, autonomy and recovery:** Advanced route audits a count matrix; recovery starts with a tiny two-feature/two-library example.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

### 13.4 Machine learning — 3 chapters

#### L01 — Frame a biologically safe prediction

**Mission:** Define an answerable ML task and prevent sample-dependent information leaking into evaluation.

**Assigned v3 competencies:** 139, 140, 141, 142 (4). **Target runtime:** browser_pyodide.

**Final deliverable:** Feature/target table with group-aware split and train-only preprocessing contract.

**Mini-goals / required teaching content:**

1. **Define a prediction target** (competency 139). Distinguish prediction from causal inference; choose labels and usable features.
2. **Identify leakage** (competency 140). Find direct label proxies and batch/replicate leakage before model fitting.
3. **Design a group-aware split** (competency 141). Keep related images/fields from one specimen within the same partition.
4. **Build preprocessing correctly** (competency 142). Fit transformations only on training data and reuse fitted pipeline on hold-out.

**Apply — cumulative task:** Build an explicit schema and a leakage-audited train/test split for image-derived features.

**Prove — independent transfer:** Find hidden leakage in new specimen/field data, including shared source image or batch identity.

**Required failure/edge investigations:** Random split of many fields from one organism, preprocessing fitted on all data, target leakage through IDs.

**Data and assets:** Group-labeled biological feature table, clear sampling/label definitions.

**Source audit focus:** VanderPlas ML fundamentals; scikit-learn model-selection and pipeline docs.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Show a dramatically inflated validation score caused by splitting two fields from the same biological specimen across train/test.
- **First meaningful artifact:** A group-aware split with a machine-checkable no-leakage assertion.
- **Difficulty, autonomy and recovery:** Optional direct design critique; recovery draws the specimen→fields hierarchy before implementing splitting.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### L02 — Train interpretable baseline models

**Mission:** Learn whether simple transparent methods beat a trivial predictor without contaminating evaluation.

**Assigned v3 competencies:** 143, 144, 145, 146 (4). **Target runtime:** browser_pyodide.

**Final deliverable:** Comparable dummy, linear and regularized classification/regression baselines with a valid evaluation workflow.

**Mini-goals / required teaching content:**

1. **Construct a dummy baseline** (competency 143). Set majority/mean baseline and compare against real models.
2. **Fit linear regression** (competency 144). Train an interpretable regression model and inspect residuals/units.
3. **Fit regularized classification** (competency 145). Use a pipeline with scaling and regularization; inspect coefficients and decision rule.
4. **Compare a small tree** (competency 146). Inspect model complexity, overfitting and feature importance limitations.

**Apply — cumulative task:** Fit and compare appropriate baselines under same split and measurement conditions.

**Prove — independent transfer:** Investigate a new dataset where a high training score is caused by batch correlation or preprocessing leakage.

**Required failure/edge investigations:** Improper scaling, unfixed random seed, class imbalance, reporting only training accuracy, feature importance overinterpretation.

**Data and assets:** Small specimen-grouped table with numeric fluorescence features and realistic labels.

**Source audit focus:** VanderPlas ML; scikit-learn user guide, pipelines and baselines.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Set a dummy predictor as a baseline so model complexity must demonstrate actual value.
- **First meaningful artifact:** A versioned regression/classification experiment comparing transparent baselines.
- **Difficulty, autonomy and recovery:** Fast route implements a scikit-learn pipeline; recovery contrasts labels/features/preprocessing with a 6-row table.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---

#### L03 — Evaluate truly unseen biological data

**Mission:** Judge whether a model generalizes across biologically independent groups rather than memorizing shared images.

**Assigned v3 competencies:** 147, 148, 149, 156 (4). **Target runtime:** browser_pyodide.

**Final deliverable:** Held-out and group-cross-validated report with errors, calibration and reproducibility limitations.

**Mini-goals / required teaching content:**

1. **Cross-validate by group** (competency 147). Use group-aware folds; compare with naive folds to reveal optimistic results.
2. **Evaluate imbalance** (competency 148). Report precision/recall and relevant class-aware metrics instead of accuracy alone.
3. **Inspect errors and calibration** (competency 149). Plot confusion patterns, inspect confidence calibration and discuss uncertainty.
4. **Complete the independent ML project** (competency 156). Produce a reproducible report from a genuinely unseen biological dataset and explain limitations.

**Apply — cumulative task:** Finish an auditable baseline model project with group-safe splits and a concise scientific interpretation.

**Prove — independent transfer:** Evaluate an unseen cohort or acquisition batch and justify what the model does not generalize to.

**Required failure/edge investigations:** Leaked hyperparameter selection, improper stratification, missing minority class, test set reused for model tuning.

**Data and assets:** Group-aware dataset with explicit hold-out and potentially shifted acquisition conditions.

**Source audit focus:** VanderPlas; scikit-learn model evaluation and cross-validation docs.

**Experience/engagement specification (required in the finished chapter):**

- **Early scientific hook:** Expose a seemingly excellent classifier that collapses on an independent specimen group.
- **First meaningful artifact:** A held-out evaluation report with errors, calibration notes and defensible scientific scope.
- **Difficulty, autonomy and recovery:** Provide a choice of microscopy-derived or simple biological tabular task; recovery revisits leakage and label balance before rerunning evaluation.
- **Returnability / independent proof:** Save an interpretable checkpoint and specify one next action. The final Prove must change the scientific data structure or underlying reasoning, not just constants; never claim independence if the guided solution was revealed.

**Acceptance:** All listed competencies have explicit reference examples, human-understandable explanations, changed-input checks and an independent transfer rubric; scientific caveats in this chapter have been reviewed. Completion cannot be inferred from this syllabus alone.

---
## 14. Canonical 156-competency coverage catalog

This appendix provides an audit-friendly **title/number-to-chapter map**. It was reconciled against the v3 competency titles and the 26-mission assignment. The canonical semantic IDs and prerequisite graph remain authoritative in `curriculum/v3_manifest.json`; do **not** replace those stable IDs with the short ordinal numbers in an import package. Every number from `001` through `156` appears once in the following table.

| # | Frozen v3 competency title | Owning chapter |
|---:|---|---|
| 001 | Run a scientific Python cell | P01 |
| 002 | Read an error traceback | P01 |
| 003 | Use documentation and help | P01 |
| 004 | Understand a notebook workflow | P01 |
| 005 | Name a specimen using variables | P01 |
| 006 | Calculate with physical quantities | P01 |
| 007 | Explain int, float and bool | P01 |
| 008 | Build informative strings | P02 |
| 009 | Parse a specimen identifier | P02 |
| 010 | Compare measurements safely | P02 |
| 011 | Write conditional quality rules | P02 |
| 012 | Iterate and summarize microscope-field lists | P03 |
| 013 | Use range and enumerate | P03 |
| 014 | Make a bounded while loop | P03 |
| 015 | Skip and stop intentionally | P03 |
| 016 | Index and slice a list | P03 |
| 017 | Change a list safely | P03 |
| 018 | Unpack immutable tuples | P03 |
| 019 | Map IDs to metadata | P04 |
| 020 | Navigate nested records | P04 |
| 021 | Deduplicate using sets | P04 |
| 022 | Express a simple comprehension | P04 |
| 023 | Iterate over dictionary records | P04 |
| 024 | Pair related arrays with zip | P04 |
| 025 | Return results from a function | P05 |
| 026 | Define parameters and defaults | P05 |
| 027 | Understand scope | P05 |
| 028 | Write docstrings and type hints | P05 |
| 029 | Raise and handle exceptions | P05 |
| 030 | Use imports and small modules | P05 |
| 031 | Read and write a text file | P06 |
| 032 | Create and run a local Python virtual environment | P06 |
| 033 | Serialize a metadata record | P06 |
| 034 | Test a function with pytest-style checks | P06 |
| 035 | Package a tiny workflow | P06 |
| 036 | Inspect and commit a reproducible Git change | P06 |
| 037 | Construct typed arrays | I01 |
| 038 | Understand shape and ndim | I01 |
| 039 | Index rows, columns and planes | I01 |
| 040 | Slice a subarray | I02 |
| 041 | Distinguish views from copies | I02 |
| 042 | Apply ufuncs and vectorization | I03 |
| 043 | Use broadcasting correctly | I03 |
| 044 | Construct Boolean masks | I03 |
| 045 | Make masked assignments | I03 |
| 046 | Aggregate over an axis | I03 |
| 047 | Treat missing numbers explicitly | I03 |
| 048 | Calculate percentiles and sorting ranks | I03 |
| 049 | Use seeded random simulation responsibly | I03 |
| 050 | Check numeric precision and overflow | I03 |
| 051 | Create and inspect a DataFrame | I07 |
| 052 | Read a typed CSV table | I07 |
| 053 | Select rows and columns | I07 |
| 054 | Validate column schemas | I07 |
| 055 | Normalize messy sample IDs | I07 |
| 056 | Find duplicates and conflicting keys | I07 |
| 057 | Handle missing records | I07 |
| 058 | Join sample and imaging tables | I08 |
| 059 | Group and aggregate descriptive data | I08 |
| 060 | Reshape wide and long tables | I08 |
| 061 | Handle timestamps and categories | I08 |
| 062 | Export a traceable dataset | I08 |
| 063 | Build a Matplotlib figure | I04 |
| 064 | Show scatter and line relationships | I04 |
| 065 | Show a numerical distribution | I04 |
| 066 | Compare grouped observations | I08 |
| 067 | Arrange multiple panels | I04 |
| 068 | Represent uncertainty | I12 |
| 069 | Choose scales and accessible design | I08 |
| 070 | Export publication-ready graphics | I08 |
| 071 | Document a real source image | I01 |
| 072 | Decode an image into an array | I01 |
| 073 | Separate color/channel data | I01 |
| 074 | Understand image coordinate conventions | I01 |
| 075 | Interpret pixel dtype and range | I01 |
| 076 | View contrast without changing data | I04 |
| 077 | Crop a biological ROI | I02 |
| 078 | Quantify a selected ROI | I03 |
| 079 | Convert pixel area to physical units | I02 |
| 080 | Inspect axes in multidimensional images | I02 |
| 081 | Inspect a TIFF/OME-TIFF in a notebook | I02 |
| 082 | Explore an intensity histogram | I04 |
| 083 | Estimate and subtract background | I05 |
| 084 | Apply Gaussian filtering | I05 |
| 085 | Choose a denoiser | I05 |
| 086 | Make a global threshold mask | I05 |
| 087 | Compare automatic thresholds | I05 |
| 088 | Quantify threshold sensitivity | I05 |
| 089 | Apply binary morphology | I06 |
| 090 | Label connected components | I06 |
| 091 | Filter components by measured size | I06 |
| 092 | Handle objects touching borders | I06 |
| 093 | Split touching candidates | I06 |
| 094 | Handle 3D segmentation limits | I06 |
| 095 | Compose a parameterized segmentation pipeline | I06 |
| 096 | Measure region properties | I09 |
| 097 | Measure intensity in regions | I09 |
| 098 | Compare compartment signals | I09 |
| 099 | Audit colocalization reasoning | I09 |
| 100 | Detect candidate puncta peaks | I09 |
| 101 | Analyze spatial proximity | I09 |
| 102 | Estimate motion from paired positions | I10 |
| 103 | Detect mergers and tracking ambiguity | I10 |
| 104 | Build a manual-annotation specification | I10 |
| 105 | Evaluate pixel masks | I10 |
| 106 | Evaluate object detections | I10 |
| 107 | Stress-test an image analysis pipeline | I10 |
| 108 | Identify independent experimental units | I11 |
| 109 | Audit paired study designs and compute matched change | I11 |
| 110 | Detect QC exclusions and bias | I11 |
| 111 | Define a treatment effect estimand | I11 |
| 112 | Aggregate within biological replicate | I11 |
| 113 | Spot acquisition-batch confounding | I11 |
| 114 | Implement a transparent normalization | I11 |
| 115 | Distinguish standard deviation from standard error | I12 |
| 116 | Choose a robust descriptive summary | I12 |
| 117 | Construct a confidence interval | I12 |
| 118 | Bootstrap at the correct unit level | I12 |
| 119 | Select a statistical comparison | I12 |
| 120 | Report effect size and multiplicity | I12 |
| 121 | Visualize replicate-level effects | I12 |
| 122 | Produce a reproducible experiment summary | I12 |
| 123 | Validate DNA bases and ambiguity policy | N01 |
| 124 | Compute and interpret DNA GC fraction | N01 |
| 125 | Reverse-complement DNA | N01 |
| 126 | Translate a coding sequence | N01 |
| 127 | Use Biopython Seq and SeqRecord | N02 |
| 128 | Parse and write FASTA | N02 |
| 129 | Extract genomic intervals | N02 |
| 130 | Parse FASTQ records | N02 |
| 131 | Summarize base-quality profiles | N03 |
| 132 | Trim reads by a documented rule | N03 |
| 133 | Count k-mers with ambiguity handling | N03 |
| 134 | Perform small pairwise alignments | N03 |
| 135 | Interpret mapping summaries | N04 |
| 136 | Compute read coverage | N04 |
| 137 | Build a count matrix | N04 |
| 138 | Calculate CPM and explain limits | N04 |
| 139 | Frame a prediction problem | L01 |
| 140 | Detect leakage before modeling | L01 |
| 141 | Design a group-aware split | L01 |
| 142 | Build a preprocessing pipeline | L01 |
| 143 | Establish a dummy baseline | L02 |
| 144 | Fit a linear regression baseline | L02 |
| 145 | Fit a regularized classifier | L02 |
| 146 | Compare one interpretable tree model | L02 |
| 147 | Cross-validate with correct groups | L03 |
| 148 | Evaluate imbalanced classes | L03 |
| 149 | Inspect errors and calibration | L03 |
| 150 | Debug an unfamiliar scientific script | I13 |
| 151 | Clean a fresh metadata dataset | I13 |
| 152 | Create a clear figure from new observations | I13 |
| 153 | Audit an unfamiliar microscopy result | I13 |
| 154 | Complete a real-image measurement project | I13 |
| 155 | Complete a small sequence/NGS QC project | N04 |
| 156 | Complete a group-safe biological ML project | L03 |

---

## 15. Reusable chapter-writing template

> **Use this template only when producing an actual individual chapter.** Replace placeholders with grounded content. If an author cannot fill an asset source, runtime support, competency mapping or test evidence, mark it `BLOCKED` and do not declare the chapter complete.

### 15.1 Authoring brief (required at start of each chapter)

```markdown
# [P01 / I01 / N01 / L01] — [Official mission title]

> Status: DRAFT / CONTENT-COMPLETE / INTEGRATED / LEARNER-VALIDATED
> Chapter version: x.y.z
> Syllabus reference: exact `curriculum/v3_manifest.json` revision
> Source-spine reference: exact `curriculum/witz_spine.json` revision
> UI target: exact frozen UI baseline/integration head SHA
> Author, source auditor, scientific reviewer, technical reviewer: [names/roles]

## Scientific outcome
- Practical biological/programming question:
- Why this matters to the final course outcome:
- Named, inspectable deliverable:
- Independent transfer challenge:

## Learning contract
- Assigned canonical competency IDs (complete, not a subset):
- Immediate prerequisites (per DAG):
- Concept first introduced here:
- Prior concepts used but not retaught:
- Requirements from later chapters that depend on this one:
- Learner runtime (browser / local / Jupyter):
- Dependencies and pinned/tested versions:
- Necessary media and datasets:
- Source notebook paths, revision SHAs and audited cell ranges:

## Learner experience and motivation brief (mandatory)
- Authentic scientific hook and underlying research workflow:
- First runnable result: exact inputs and real expected stdout/table/figure:
- Why the immediate Python construct advances the research question:
- Default short-session start and first substantial learner action:
- Cumulative project artifact delta, file/function/result and safe save location:
- Diagnostic fast route for pre-existing skills:
- Simplified recovery micro-task for a struggling learner:
- Optional meaningful choice and higher-difficulty transfer:
- Natural stop points and exact resume action (no time pressure):
- Likely boredom/frustration point and how the chapter avoids it:
- Observable evidence of competence, autonomy and scientific validity:

## Optional inspection and scientific-failure contract (mandatory authoring decision; §19)
- Is execution inspection useful? If yes: exact variable(s), line state, user trigger, event/time cap, fallback and assistance accounting:
- Is a computed intermediate image/mask/table useful? If yes: exact array type, axes, provenance/run linkage, parameter invalidation, and overlay alignment:
- Why is this inspection needed rather than plain Python output and a concise explanation?
- One syntactically valid but scientifically misleading result; how the learner can discover its cause:
- Explicit decision when the right answer is to withhold a biological inference:
- Optional Fiji-to-Python conceptual bridge; numerical equivalence claimed only if separately tested:
- Optional post-completion comparison of two valid solutions and their tradeoffs (never leaked before Prove):
- Named artifact ID, input/dependency references, output invariants, next-chapter consumer and clean-run reproduction route:
- Required runtime feature vs graceful fallback, with evidence that the frozen IDE layout stays uncluttered:

## Before you code
- One intuitive biological/scientific objective.
- One deliberately small, accurate Python example.
- One prediction question exposing a likely misconception.
- Provide an optional short explanation and direct-try route so experts aren't forced through beginner material.

## Mini-goal MG-[chapter]-01 — [observable action]
- New/reused competency IDs:
- Concept: definitions and reasoning in original prose.
- Example: runnable code with expected actual output.
- Investigate: what each relevant line or array shape means.
- Modify: a small change with a meaningful changed outcome.
- Write: independent learner code task.
- Debug: a real error/traceback or scientifically wrong assumption.
- Data and expected type/shape/units:
- 2–3 progressive hints:
- Input/edge fixtures and acceptable alternate solutions:
- Scientific caveat:
- Transfer: a materially unfamiliar problem and independent rubric.
- First real visible result and what it means:
- Learner artifact delta:
- Standard guided path and optional diagnostic bypass:
- Common twice-repeated conceptual error and targeted recovery micro-task:
- One accurate incorrect-feedback example and one correct-feedback example:
- Stop/resume checkpoint:
- Program state/result inspection: chosen view, source and limit, or why none is needed:
- Plausible failing/invalid case: symptom, diagnosis, scientific consequence and changed-input retest:
- Artifact reuse: stable output ID, validation and later import:
- Difficulty/engagement acceptance evidence:

[Repeat mini-goals until all owned competencies are evidenced.]

## Apply — cumulative chapter task
- Goal and dataset:
- Deliverable and saved artifact:
- Dependencies on earlier mini-goals:
- Reasonable constraints and exception behavior:
- Observable validation criteria:

## Prove — blank-editor independent task
- New input/context and what differs from practice:
- What is provided and what is withheld:
- Coding evidence and scientific interpretation rubric:
- Changed-input checks (normal/boundary/adversarial):
- Hint/solution exposure rule:

## Common misconceptions and failure diagnosis
- Programming errors (actual tracebacks):
- Scientific interpretation failure and detection:

## References, provenance and further reading
- Per-source links/revisions and attribution terms:
- Asset license/identity/metadata and processing history:
- Known limitations and non-claims:

## Acceptance evidence
- CPython reference tests:
- Browser-Pyodide/local test environment:
- Asset source/hash/license check:
- Accessibility review:
- Scientific reviewer decision:
- Real execution inspection / provenance of intermediates / stale-result invalidation: PASS / FAIL / NOT APPLICABLE / NOT TESTED
- Plausible scientific failure diagnosis and correct negative conclusions: PASS / FAIL / NOT APPLICABLE
- Artifact reuse, export and later-chapter handoff: PASS / FAIL / NOT TESTED
- Author-answer isolation, optional post-completion comparison and assistance accounting: PASS / FAIL
- Fiji equivalence audit (if included): PASS / FAIL / NOT APPLICABLE
- Content completion decision and unresolved blockers:
- First authentic runnable output and named artifact: PASS / FAIL
- Optional diagnostic bypass and recovery scenario: PASS / FAIL
- Manual short-session walkthrough (normal / stuck / resume): PASS / FAIL / NOT RUN
- Pedagogy rubric score /100 (≥95 design target): ...
- Motivation rubric score /100 (≥95 design target): ...
- Any critical gate failure (even if score high): ...
- Actual learner observed outcomes (if tested; distinguish from design review): ...
```

### 15.2 Example mini-goal specification (authoring model)

**Example:** P03 — “Filter recorded microscope fields while retaining every field ID.”

- **Scientific need:** A microscope acquisition contains several field records with explicit `field_id`, `specimen_id`, `focus_score` and potentially `None` for missing focus.
- **Programming concept:** Iteration and conditional filtering, with list and tuple usage as prerequisites. The mini-goal introduces/reuses exactly those IDs assigned by the frozen manifest; do not invent a new competency for a changed cutoff.
- **Predict:** What happens if the program evaluates `None >= 0.70`? Which record would be lost if it simply did `continue` without logging?
- **Run:** Execute a short genuine script, see `TypeError` for the intentionally bad comparison, then observe the corrected result.
- **Investigate:** Identify the order of the missing-value check, accepted/rejected branches, and preservation of original field identifiers.
- **Modify:** Change threshold from 0.70 to 0.75, then add a missing record and interpret the changed list sizes.
- **Write:** From a blank editor, make a function returning three ID lists without modifying the input.
- **Debug:** Fix one intentional bug that silently treats a missing field as rejected.
- **Prove:** New records have different ID format and one duplicate field; detect or flag the duplicate and produce an audit report.
- **Scientific reasoning:** These are recorded *fields*, not independent animals or experimental replicates; a focus cutoff is a toy teaching policy until validated for the actual microscope/project.
- **Reference checks:** more than one changed input, empty list, all missing, exact cutoff boundary, duplicate field; assert each record is accounted for exactly once. A valid different algorithm must not be marked wrong purely because its code looks different.

This is the appropriate level of specification before converting a mini-goal into learner and author-side JSON. The **full chapter narrative** explains and connects the concepts; the **interactive activity** contains the precise short prompt and executable inputs.

### 15.3 Author-side acceptance report template

```markdown
# Chapter Pxx — Content acceptance report

- Source revision and source exercise ledger: PASS / FAIL / BLOCKED
- All assigned canonical competencies accounted for: PASS / FAIL
- Original prose and independent learner-facing clarity: PASS / FAIL
- Worked code/outputs tested in CPython (version): PASS / FAIL
- Changed-input/edge fixtures run (count, failures): PASS / FAIL
- Clear Apply and blank-editor Prove: PASS / FAIL
- Authored reference solutions isolated from learner bundle: PASS / FAIL
- Provenance/asset license and calibration policy: PASS / FAIL / NOT APPLICABLE
- Scientific reviewer findings: ...
- Accessibility/Markdown/source-link audit: ...
- Remaining risks and limitations: ...
- Optional execution-trace contract and runtime/fallback: PASS / FAIL / N/A
- Stage inspector data provenance and stale-output tests: PASS / FAIL / N/A / NOT TESTED
- Scientific failure case and correct negative-inference rubric: PASS / FAIL
- Retained research artifact and downstream import contract: PASS / FAIL
- Frozen UI impact / explicit exception needed: NONE / REVIEW REQUIRED
- Approved status: DRAFT or CONTENT-COMPLETE (never inferred from checkboxes alone)
```

---

## 16. Development sequence, risk register and change policy

### 16.1 Recommended actual workflow (one chapter at a time)

**Step A — Reconcile, do not redesign.** Read the latest frozen v3 manifest, Witz spine, UI freeze document and the previous accepted chapter package. Confirm their revisions and existing draft status. Extract this chapter's owned competency IDs and local prerequisites. No new course taxonomy.

**Step B — Source audit.** Read source notebook cells and relevant modern documentation, identify exercises to reuse/adapt/reference/skip, check API validity and source licenses; pin data/asset origin. Confirm what a genuinely independent scientific task would look like.

**Step C — Chapter brief.** State one useful scientific output, mini-goal sequence (prerequisite safe), concepts introduced once, exact data/outputs, realistic failure cases, expected test or interpretation evidence and planned runtime.

**Step D — Full original instructional text.** Write the chapter as a standalone Markdown textbook chapter with well-paced explanations, short runnable examples and accurate expected outputs. The content should still be useful even if the UI has not imported it.

**Step E — Activity authoring.** Convert mini-goals into clean typed activity records and learner-facing coding tasks. Add progressive hints, troubleshooting, an Apply program, Prove transfer, scientific caution and author-side reference solutions/fixtures.

**Step F — Content validation.** Run CPython checks, inspect rendered Markdown, review source/asset rights, audit scientific controls and inspect chapter completeness. Repair failures before calling it content-complete.

**Step G — Small integration PR.** Transfer only this accepted content and rights-cleared assets to an integration branch based on the frozen UI-first code. Use the established adapter/engine; introduce no unrelated UI redesign or legacy app files.

**Step H — End-to-end verification.** Test live Pyodide/local execution, outputs, asset loads, progress persistence, old-state compatibility, keyboard/mobile UX, wrong answer feedback and explicit scientific limitations. Record actual passing evidence.

**Step I — Learner trial and refinement.** Work through the chapter from scratch, including blank-editor Prove. Correct confusion and missing prerequisites. Mark learner-validated only when justified. Proceed to the next chapter without changing old canonical IDs.

### 16.2 Proposed integration milestones

| Milestone | Scope | Exit evidence |
|---|---|---|
| **A. First content exemplar** | Thoroughly finish P01 (not P01–P03 simultaneously) | Content-complete rubric passed; original chapter + activity package |
| **B. Engine/adapter pilot** | Import P01 into frozen UI branch | Real Pyodide, stdout/traceback, progress and changed-input tests, no visual redesign |
| **C. Python foundation** | Finish/import P02–P06 sequentially | Script/QC project independent; local Python/Git tasks genuinely executed |
| **D. First real microscopy dataset** | I01 image source/asset import | Real attributed image loads; shape/axes/dtype correctly interpreted |
| **E. Witz quantitative sequence** | I02–I10 in order of actual prerequisites | Correct masks/measurements and annotation-based validation where needed |
| **F. Scientific validity and capstone** | I11–I13 | Replicate-correct statistics and independent real-image analysis with limitations |
| **G. Sequence elective** | N01–N04 | Reproducible small QC project, no repeated Python beginner lessons |
| **H. ML elective** | L01–L03 | Group-safe holdout evaluation and defensible baseline report |
| **I. Full release** | Legacy migration, accessibility and regression | G0–G5 release gates and production promotion approval |

Do not collapse these milestones into a fake promise of full course implementation. Each milestone produces an inspectable artifact or test result.

### 16.3 Priority risk register

| Risk | Likelihood/impact | Control / stopping criterion |
|---|---|---|
| Chapters look complete but teach too little | High / High | P01 exemplar review; blank-editor transfer; multi-input tests; author/learner distinction |
| Source-cell mapping is inaccurate | Known / Medium | Read actual notebook cells; per-exercise audit; correct citations without changing IDs |
| Excessive source copying or unclear image rights | Medium / High | License-by-asset verification; original prose; no bundling without rights evidence |
| User sees same concepts repeatedly | High / Medium | Single concept owner plus retrieval tag; canonical v3 and Witz map audit |
| Learner loses momentum during long prerequisite-only material | High / High | Authentic first action in every mini-goal; cumulative artifact; fast diagnostic route |
| User returns after a break but loses their context | High / High | Exact state/draft checkpoint, frictionless resume, optional refresh and persistence regression |
| Too many mistakes cause unnecessary abandonment | Medium / High | Calibrated hints, targeted remediation, choice to pause, no punitive mastery labels |
| Smooth exercises give false sense of skill | High / High | Materially new Prove context, delayed retrieval, no credit for merely editing worked code |
| Browser Python doesn't support lesson | High for some topics / High | Runtime capability matrix; package tests; genuine local lane |
| Imported chapters disrupt frozen UI | Medium / High | Content-only PR; adapter contract; visual acceptance and rollback |
| Historic progress is overwritten | Medium / High | Snapshot old records; idempotent migration; extensive backup/restore tests |
| Hidden checks give false confidence | High / Medium | Label self-assessment; different transfer datasets; delayed review; author-side solution isolation |
| Images lead to invalid biological claims | High without care / High | Axes, units, calibration, annotation and uncertainty review; refuse unsupported claims |
| External image links stop working | Medium / Medium | Licensed local asset/hash; honest retry; no unrelated fallback |
| Large unreviewed chapter batches | High / High | One chapter per acceptance gate; short pilot before scaling |
| Uncontrolled schema/version drift | Medium / High | Versioned contract, stable IDs, validation, explicit migrations, integration tests |

### 16.4 Change control

The frozen 156 competency inventory and prerequisite DAG remain the authority. Authors may refine mini-goal ordering, improve exercises, replace obsolete examples or clarify scientific caveats without changing canonical meaning. A genuinely missing competency, a materially changed learner objective or a scientific/technical blocker can justify a formal curriculum change only with an explicit proposal, rationale, affected ID list, prerequisite diff, progress migration plan, schema and test updates. Never edit historical learner achievements silently.

Do not allow this blueprint to proliferate into several incompatible syllabuses. It is the single detailed **authoring manual** paired with the compact frozen machine-readable manifest and Witz-first mission map. Keep additional files limited to real chapter packages, provenance records and test evidence.

### 16.5 First action after adopting this blueprint

**P01 first, with the experience brief and dual quality gates.** Show an actual attributed research image as contextual motivation, produce useful stdout immediately, preserve a small cumulative script and offer a diagnostic fast route. Audit Witz 01/e01 and the P01 draft; make all seven P01 competencies and their mini-goals sufficiently deep; write genuine explanations, reference solutions, independent challenge and test cases. Confirm 001/002/003/004/005/006/007 coverage against the frozen manifest. Run content-complete checks. Then perform a separate P01 integration into the frozen UI with real Python execution before expanding the rest of the course. Existing P02 and P03 drafts should be retained as prototypes, not discarded or falsely promoted to complete.

---

## 17. References and verified source links

### 17.1 Canonical project documents

- [BioPython Studio repository](https://github.com/Shrestha-Sandeep/BioPython-Studio)
- [Frozen v3 curriculum — draft PR #1](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/1) — 156 competencies, DAG, 61-ID alias migration.
- [Witz-first mission spine — draft PR #7](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/7) — 26 missions, exercise candidate mapping, 156-skill coverage.
- [Frozen UI-first design — draft PR #9](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/9) — approved workspace and its explicit nonfeatures.
- [Textbook content pilot — draft PR #10](https://github.com/Shrestha-Sandeep/BioPython-Studio/pull/10) — initial P01–P03 drafts, tests, source audit; not final chapters.
- [UI design freeze record](https://github.com/Shrestha-Sandeep/BioPython-Studio/blob/feature/ui-first-ide-workspace/docs/UI_DESIGN_FROZEN.md)
- [Frozen competency manifest](https://github.com/Shrestha-Sandeep/BioPython-Studio/blob/docs/frozen-v3-curriculum/curriculum/v3_manifest.json)
- [Witz-first mission manifest](https://github.com/Shrestha-Sandeep/BioPython-Studio/blob/feature/witz-first-learning-spine/curriculum/witz_spine.json)

### 17.2 Teaching and technical sources

- [Guillaume Witz, Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner) — nine main notebooks, seven exercise notebooks, appendices, demo and source-image description. Primary pedagogical spine. [README](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/README.md) and [BSD-3-Clause license](https://github.com/guiwitz/PyImageCourse_beginner/blob/master/LICENSE).
- [Jake VanderPlas, Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/) — NumPy, Pandas, Matplotlib, IPython and scikit-learn; code MIT, book text CC BY-NC-ND.
- [Martin Jones, Python for Biologists](https://www.pythonforbiologists.org/) — biology-grounded text, files, loops, functions and sequence applications.
- [Pete Bankhead, Introduction to Bioimage Analysis](https://bioimagebook.github.io/) — scientific image/measurement validity.
- [Bio-image Analysis Notebooks](https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/) — microscopy workflows and image-processing techniques.
- [Data Carpentry Image Processing](https://datacarpentry.github.io/image-processing/) — practical scientific image examples.
- [Python official tutorial](https://docs.python.org/3/tutorial/) and [Python library reference](https://docs.python.org/3/library/) — language semantics and standard library.
- [NumPy documentation](https://numpy.org/doc/stable/), [Pandas documentation](https://pandas.pydata.org/docs/), [Matplotlib documentation](https://matplotlib.org/stable/), [scikit-image documentation](https://scikit-image.org/docs/stable/) — current scientific APIs.
- [Biopython Tutorial](https://biopython.org/DIST/docs/tutorial/Tutorial.html) and [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html) — specialist paths.
- [Pyodide package-loading documentation](https://pyodide.org/en/stable/usage/loading-packages.html) and [Pyodide Web Workers](https://pyodide.org/en/stable/usage/webworker.html) — browser runtime implementation references; confirm actual release-specific APIs during integration.
- [OME-TIFF format specification](https://ome-model.readthedocs.io/en/stable/ome-tiff/specification.html) — channel/Z/time axis order and metadata limitations.
- [Human Protein Atlas licensing and citation](https://www.proteinatlas.org/about/licence) — current provider terms and image-level credit requirements. Check each asset/version.
- [PRIMM overview](https://kaporfoundation.org/strategies_guide/primm/) — predict/run/investigate/modify/make as a teaching structure; our Write/Debug/Transfer and mastery policy are a deliberate application-specific extension.

### 17.3 Evidence used to improve the pedagogical and motivational contract

- Sentance, Waite & Kallia (2019), *Teaching Computer Programming with PRIMM: A Sociocultural Perspective*, [ERIC EJ1217966](https://eric.ed.gov/?id=EJ1217966). Evaluated the PRIMM approach with secondary-school learners; supports predict/run/investigate/modify/make but is **not** proof of effectiveness for one adult self-learner.
- Shin et al. (2023), *The Effects of Worked-Out Example and Metacognitive Scaffolding on Problem-Solving Programming*, [DOI:10.1177/07356331231174454](https://doi.org/10.1177/07356331231174454). Faded worked examples plus metacognitive support were helpful in the study setting; motivates guided-to-independent fading.
- Muldner, Jennings & Chiarelli (2023), *A Review of Worked Examples in Programming Activities*, [ERIC EJ1381113](https://eric.ed.gov/?id=EJ1381113). Supports subgoals and incomplete examples with limits and open research questions.
- Carpenter, Pan & Butler (2022), *The Science of Effective Learning with Spacing and Retrieval Practice*, [Nature Reviews Psychology](https://doi.org/10.1038/s44159-022-00089-1). Supports delayed and varied retrieval; spacing should be learner-adapted rather than mechanically imposed.
- Ruitenburg et al. (2026), *Meta-analysis of retrieval, distributed and interleaved practice in authentic school classrooms*, [Educational Psychology Review](https://doi.org/10.1007/s10648-026-10225-5). Positive average effects with relevant moderators; external validity to this personalized adult course is **not directly established**.
- Wang et al. (2024), *A systematic review and meta-analysis of SDT-based interventions in education*, [Learning and Motivation](https://doi.org/10.1016/j.lmot.2024.102015). Autonomy/competence support informs a non-gamified motivation design; not a guarantee of return rates.
- Howard, Slemp & Wang (2024), *Need support and need thwarting*, [DOI:10.1177/01461672231225364](https://doi.org/10.1177/01461672231225364). Supports competence/autonomy/relatedness as meaningful dimensions of engagement.
- Hattie & Timperley (2007), *The Power of Feedback*, [DOI:10.3102/003465430298487](https://doi.org/10.3102/003465430298487). Feedback should clarify goal, current performance and next action, not merely label answers right/wrong.
- Monash University (2026), [Constructive alignment guide](https://www.monash.edu/learning-teaching/teachhq/Teaching-practices/learning-outcomes/how-to/constructive-alignment). Align learning outcomes, actual activities and assessment evidence.

**Evidence caveat:** Much of this literature comes from school or university contexts and group interventions. These are reasonable design principles to test, **not validated causal claims about this single-user course**. No numerical performance improvement or guaranteed motivation is implied.

### 17.4 Provenance of this blueprint and limits of verification

The course architecture, IDs, chapters, and branch status above were checked against connected GitHub repository documents and the listed primary/official references on 7 November 2026. The Witz exercise mapping and existing PRs represent **draft development work**. This document is a detailed plan and authoring contract, not evidence that every source notebook cell, license for every individual image, Pyodide/package combination, machine-readable schema field, browser import or learner outcome has already been experimentally validated. Such verification is explicitly required at the relevant chapter gate.

---

## 18. Empirical pilot and 95-point review standard

### 18.1 Scores are decision tools, not advertised performance facts

The **9.5+/10** ambition is operationalized here as **≥95/100 in *both* dimensions** after an independent design review. **Do not assert that either score has been achieved merely because v2 mentions these requirements.** Evidence must be recorded; missing evidence earns zero for that item or makes it `NOT TESTED`, not automatic credit. An integrated learning product can be called *learner-validated* only after genuine use, not from reviewing its specification.

The rubrics below measure **authoring/design completeness**. They do not estimate measured effectiveness, motivation or real learner outcomes. A high design score is necessary for excellence but not sufficient.

### 18.2 Pedagogical quality rubric — 100 points

| Dimension | Weight | Full-credit evidence and a common failure |
|---|---:|---|
| Competency–task–assessment alignment | 12 | Every owned canonical ID has correctly pitched worked, practice and proof evidence; no missing prerequisite |
| Technical explanations and scientific correctness | 12 | Accurate original examples, actual outputs and units; no plausible but false interpretation |
| Cognitive load and prerequisite sequencing | 10 | One manageable novel concept per early step; no artificial six-chapter syntax barrier to scientific meaning |
| Worked-example fading and independent construction | 12 | Demonstrated examples → partial support → unfamiliar blank-editor creation |
| Formative feedback and recoverability | 10 | Two real failure walkthroughs with useful debugging clues; not merely "incorrect" |
| Transfer difficulty and answer robustness | 12 | Materially changed tasks and normal/edge/adversarial fixtures, alternative solutions allowed |
| Retrieval, spacing and retention evidence | 8 | Later fresh-input review; distinction between immediate and retained mastery |
| Scientific controls and reproducibility | 12 | Provenance, calibration, proper experimental units, uncertainty and honest limitations as relevant |
| Accessibility and UI-content fit | 6 | One active task, expandable depth, readable/keyboard operable, no giant reading wall |
| Author tests and real execution | 6 | CPython plus true Pyodide/local tests as applicable, with stored error and QA evidence |
| **Total** | **100** | **Threshold for design candidate: ≥95 and no critical-gate failures** |

### 18.3 Motivational and continuity design rubric — 100 points

| Dimension | Weight | Full-credit evidence and a common failure |
|---|---:|---|
| Authentic purpose and relevance | 14 | Specific research question linked to a useful scientific result; not ornamental "biology-themed" arithmetic |
| Early tangible success and visible artifacts | 14 | First runnable interaction creates genuine output and progress builds a reusable result |
| Challenge calibration / adaptive support | 14 | Diagnostic fast route, guided route, recovery, optional transfer; transparent and reversible |
| Autonomy and personal control | 12 | Choose direct/guided/deeper paths without grade penalty; elective scientific context when suitable |
| Useful feedback and constructive failure | 12 | Error messages tell what happened and what to do next; learner can try again without penalty |
| Low-friction start/stop/resume | 12 | Accurate saved state, exact next action, interruption and long-gap recovery tested |
| Cognitive economy and uncluttered focus | 8 | Tiny immediate task; optional deeper text; no badges, streaks or forced multi-page tours |
| Cumulative narrative and genuine progress | 6 | Every chapter adds to the research pipeline instead of restarting with disconnected examples |
| Appropriate agency in pacing and review | 4 | No artificial deadlines; optional reminders/refreshers; retained mastery separate from frequency |
| Real learner feedback and iteration plan | 4 | Specific pilot questions and documented iteration after trial; not a satisfaction claim based on opinion |
| **Total** | **100** | **Threshold for design candidate: ≥95 and no critical-gate failures** |

**Critical blockers regardless of score:** mocked Python execution; a chapter whose outputs cannot be reproduced; false scientific claims; invalid/uncleared assets; lost drafts/progress; unsolvable Prove prompt; answer leak mistaken for independence; mandatory timers/gamification imposed against the learner's wishes; runtime path claimed functional when unsupported.

**Scoring procedure:** score each criterion 0 to its listed weight only after linking specific chapter activity IDs, files, runnable fixtures or real trial records. Record a short justification and one remaining weakness for every non-full score. Review **P01 and P03 first** to calibrate what full credit actually means; subsequent chapter authors use the rubric but cannot self-certify without an independent pass.

### 18.4 Pragmatic single-learner pilot: P01 → P03 before scaling

Before expanding P04–L03, conduct **two distinct tests** on integrated, real Python lessons:

**A. Unassisted programming test (pedagogy):** Begin P01 with a fresh or known state. Ask the learner to write a specimen report, explain one traceback and change scale/IDs on unfamiliar data. For P03, present a new representation of field records (different list lengths, missing values, changed threshold) and assess whether original field IDs survive filtering. Record successful independent reasoning, common errors, hints/solution exposures, scientific interpretation and any false accepts. Later repeat a genuinely unseen problem after an elapsed interval. No forced elapsed calendar interval or fake study schedule.

**B. Voluntary-return and friction test (motivation):** Observe what happens when the learner opens the app, begins a lesson, gets stuck twice, stops halfway through, resumes after a gap and chooses whether to continue. Ask three optional brief questions: (1) "Was the result scientifically worth producing?" (2) "Where did the task become too obvious or too difficult?" (3) "What would make it easy to continue next time?" Track outcome-neutral design diagnostics, not guilt metrics: time to first authentic run; time to first meaningful result; number of redundant steps skipped; failure-to-recovery success; whether code/progress persist; successful resume to the exact next action; voluntary continued study. A single learner's results are valuable for tailoring but cannot justify population-level claims.

**Failure triggers demanding redesign:** learner repeatedly spends more effort navigating than coding; no meaningful result occurs in the first interaction; repeated correct answers still force every guided step; two failures give no actionable next move; the exercise is solved by copying the demonstration; scientific errors are marked correct; unsaved work is lost; an image is unavailable without an honest fallback; returning learners are unable to remember what to do.

### 18.5 Research-derived independent QA checks (v2.1)

Extend the existing weighted rubrics **without adding unvalidated points or changing the ≥95/100 targets**. The following are evidence requirements inside the current criteria, not new scoring dimensions:

1. A plain-Python learner can explain an observed variable-state change or exception in at least one relevant chapter without receiving the full answer; trace assistance is recorded.
2. In an image-processing chapter, a change to a real Python parameter produces a fresh, provenance-linked intermediate result; stale and mismatched overlays are never shown as current output.
3. A realistic failure case can be detected, explained and corrected or responsibly left unresolved. At least one case tests scientific interpretation even when the code runs successfully.
4. A chapter's retained artifact can be executed or opened again in a later task; the original inputs and code are not silently overwritten.
5. The user can complete Prove without opening the reference answer. An alternative-solution comparison appears only afterwards and is not mandatory.
6. Authoring metadata does not force new permanent navigation elements in the frozen IDE, degrade keyboard access, or create fake scientific previews.

### 18.6 Acceptance decision and iteration discipline

- `BLUEPRINT_READY`: this specification has complete, coherent design contracts and mappings. **It does not confer a 95 score by fiat**.
- `CONTENT_COMPLETE`: chapter-level rubric reviewed and no relevant authoring/rights/CPython/science blockers; ≥95/100 in both design rubrics is the aspiration, documented honestly.
- `INTEGRATED`: real Pyodide/local execution works, content displays correctly, provenance loads, draft/progress behavior tested and the frozen UI is preserved.
- `LEARNER_VALIDATED`: the user actually completed/attempted guided and independent tasks, recovered from meaningful failure, and could resume; outcomes and limitations recorded.
- `REVIEW_REQUIRED`: any critical-failure or repeated learner-friction pattern, even if the nominal checklist score is high.

For every pilot weakness, change the **smallest responsible factor**—prompt, example, hint, difficulty, data representation, schema or proven UI bug—rather than redesigning the whole curriculum. Preserve canonical skill IDs, mission order, progress compatibility and the approved UI geometry by default.

---



---

## 19. Learning-platform research synthesis and final implementation specifications

**Purpose:** This section translates the final comparison of interactive programming education and scientific image-analysis software into *specific, testable authoring and import requirements*. It extends, but does not replace, §§3–18. The 26 mission IDs, their 156 assigned competencies, all 61 historical aliases, one-path navigation, source precedence and frozen UI remain unchanged. No new mandatory lessons or external services are authorized.

### 19.1 Evidence-to-design matrix: borrow mechanisms, not entire products

| Primary reference and verified design pattern | What BioPython Studio should borrow | What it must **not** copy or assume | Where it matters |
|---|---|---|---|
| [Exercism concept and practice exercises](https://exercism.org/docs/building/tracks/syllabus) and [exercise-authoring guidance](https://exercism.org/docs/building/tracks/concept-exercises) | Teach a focused syntax/idea once; practice it later in a distinct task; add carefully staged hints and optional post-solution approaches | Exercism's complete social/mentoring ecosystem, public competition, or the assumption that passing tests alone proves scientific understanding | P01–P06; all Apply/Prove tasks |
| [Thonny beginner IDE](https://thonny.org/) and [debugging guidance](https://github.com/thonny/thonny/blob/master/thonny/plugins/help/debuggers.rst) | Simple step-by-step execution and variables view for novices; make debugging comprehensible | A full desktop debugger, universal expression tracer, or second IDE layout | P01–P05; targeted P03 pilot |
| [Python Tutor visualizations](https://pythontutor.com/) | Show how values, list contents, frames and program flow change **because code executed** | External embedding as a required service, false claims about inspecting native C/NumPy internals, or a giant always-visible animation | P01–P05 and targeted troubleshooting |
| [CellProfiler Test Mode](https://cellprofiler-manual.s3.amazonaws.com/CellProfiler-3.0.0/help/navigation_test_menu.html) | Inspect meaningful pipeline stages, rerun with changed parameters and examine a new image before accepting a result | Reimplement CellProfiler's full module editor, image-processing algorithms, automation framework or GUI | I05, I06, I09, I13 |
| [napari's Image/Labels/Points layers](https://napari.org/stable/getting_started/layers.html) | Explicitly distinguish source images, binary masks, object labels, annotations and point detections in the existing image workspace | A complete n-dimensional napari clone, unsupported 3D rendering or editable professional annotation tools in the learning UI | I01–I03, I05–I06, I09–I10 |
| [QuPath recorded workflows](https://qupath.readthedocs.io/en/stable/docs/scripting/workflows.html) | Keep a trace of operations and parameters; teach movement from an exploratory action toward reproducible code | Assume that QuPath's Groovy scripts or plugin semantics are automatically CPython-compatible | I06, I08, I13 |
| [Fiji / ImageJ Python scripting modes](https://imagej.net/scripting/python) and [PyImageJ](https://imagej.net/scripting/pyimagej) | Short, optional conceptual bridges from familiar Fiji operations to NumPy/scikit-image and exportable Python analysis | Suggest that ImageJ macro, legacy Jython, Fiji CPython/PyImageJ and standalone Python are interchangeable | I01–I10, I13 |
| [Scrimba contextual explainers](https://docs.scrimba.com/explain/scrims) | A small selected-code explanation or relevant source note when the learner asks for it | Mandatory screencasts, AI-generated answers that replace learner reasoning, always-on chat | Optional support in all stages |

Supporting inspiration, not architectural authority: Brilliant-style parameter experimentation, DataCamp/Kaggle-style small-to-project continuity, and Rosalind-style independent biological programming problems. These do **not** justify games, timed quotas, cloud competitions or copying third-party exercises without checking their licenses. The referenced platforms demonstrate their *own* features; the BioPython design choices below are proposed adaptations, not externally validated performance claims for this app.

### 19.2 Priority policy — prevent scope creep

**Must be present in the authored content from the start (P01 pilot):** an executable learn example, a different Apply problem, a genuinely unfamiliar Prove problem, a visible real result, helpful debugging guidance, one failure case, reusable artifact, scientific interpretation, provenance and author tests. Use existing Learn/Apply/Prove and CodeMirror surfaces.

**Pilot interaction feature (P01/P03; implement only after real Python runtime):** optional, bounded inspection of simple Python execution/variables. Start with one supported exercise and measure whether it improves diagnosis. If implementation cost or accuracy is unacceptable, use *executed* step logs and targeted variable inspection rather than a full program tracer.

**Microscopy milestone (I01, I05, I06):** meaningful intermediate results in the existing viewer, with honest image/mask/label semantics, provenance and a single contextual step selector if needed. A minimum viable step selector is sufficient; no general layer editor is required.

**After a proved learning benefit:** post-solution alternative-code comparisons, context-specific Fiji equivalence cards, selected-code explanation and richer visualization. These are opt-in; none is prerequisite to completing a chapter.

**Explicit non-goals:** full visual IDE debugger; generalized live introspection into arbitrary Python packages; full napari/QuPath/CellProfiler application clones; standalone AI tutor conversation as the primary interface; video platform; gamification; mandatory accounts; cloud-based secret grading; automatic Fiji macro-to-Python translation. Whenever the simple design passes the same learning test, choose it.

### 19.3 Optional visual Python debugger: a bounded instructional tool

**Learner problem:** the novice sees a correct or incorrect output but cannot explain *why* a loop, condition, function call or list update produced it. This is most likely in P01–P05. The debugger is an on-demand *investigation method*, not a replacement for the Run button.

**Experience contract:**

1. The standard workflow remains: learner predicts → presses **Run** → examines actual stdout or traceback. Only then, where appropriate, expose **Inspect execution** (within an existing output/lesson disclosure).
2. Show the actual executed line or statement; expose a small table of variable **name, type and compact value/summary**; optionally show the current iteration index and why a condition evaluated True/False. Use text and keyboard-usable navigation, never color alone.
3. Provide **Step**, **Continue** and **Close inspection** only if the runtime truly supports those actions. If the MVP is a bounded recorded trace, label these controls **Previous step** / **Next step** rather than falsely claiming live execution control.
4. Bound trace events, execution time, total displayed size, recursion depth and object rendering. Large arrays should show `shape`, `dtype` and a bounded sample or summary—not thousands of pixel values. Hide reference-answer variables not actually in the user's run.
5. Preserve user code and normal output. Opening/closing inspection must not mutate the program, change its observed result or mark a task complete. Step logs are automatically invalidated after code/input changes until the new execution runs.
6. Show the exact error line, exception class and a targeted observation prompt after a failure. Never classify all `NameError`s as the same misconception without examining the failing context.
7. A debugger or execution trace is **guided assistance** if it reveals reasoning required in an independent check. Record that assistance; an independently assessed Prove prompt remains solvable without access to its reference trace. No independent mastery is inferred from clicking through a trace.

**Example P03-A (real Python, source record QC):** learner predicts how `accepted_ids` changes as the loop processes `[('F1',0.82),('F2',None),('F3',0.65)]` at a declared 0.70 cutoff. The optional inspection shows each iteration, `field_id`, `score`, branch taken, and the accumulating output lists. The learner then writes a solution for *different* data where a missing score must be recorded separately. The artifact is a reusable QC function or script, not the trace visualization.

**Technical feasibility boundary:** CPython tracing APIs or instrumented educational snippets are possible approaches, but the behavior, performance and portability must be **proven in the selected pinned Pyodide Web Worker** before adopting one. Interactive tracing of arbitrary native-extension calls is out of scope. Do not claim debugging support because a static diagram or pre-recorded reference trace is shown.

**Acceptance tests:** (i) loop variables match a genuinely executed program on three changed inputs; (ii) branch decisions and `None` are represented correctly; (iii) timeout / infinite loop does not hang the UI; (iv) code edit invalidates old trace; (v) keyboard and screen reader can reach the relevant state; (vi) independently correct solution is accepted with or without opening inspection.

### 19.4 Scientific analysis step inspector: keep the existing viewer and show provenance-linked stages

**Learner problem:** a final thresholded count or table looks plausible even when the background estimate, channel, crop or object filter is wrong. The learner must **see and explain the intermediate scientific state**. This is the strongest learning feature to adopt from CellProfiler and napari.

**Minimum pipeline stages for an I05–I06 demonstration:**

| Stage | Data artifact | Question the learner must answer | Important validity check |
|---|---|---|---|
| 0. Input | Original attributed image/channel | Which image and channel are being processed? | Identity, channels, axes, data range and license |
| 1. ROI | Crop / chosen plane | What pixels were included or excluded? | Bounds, origin, size and coordinate transform |
| 2. Background | Background estimate and corrected array | Does correction remove background or real structure? | Algorithm, dtype, clipping/negative values |
| 3. Threshold | Boolean foreground mask | How does changing the threshold alter included pixels? | Mask polarity, shape, sensitivity |
| 4. Morphology | Cleaned mask | Which candidates disappeared, split or merged? | Structuring element and physical scale if used |
| 5. Labels | Integer-labeled components and object table | Are counts credible and what is each connected region? | Label count, edge/touching status, validation status |
| 6. Validation | Overlay/annotation comparison | Which detections are false positives, missed or ambiguous? | Reference-annotation status, error metric and uncertainty |

The learner must **not** be required to implement every stage in I05; this is a reusable visual grammar that progressively expands through I13. For earlier chapters, a single original/processed comparison is enough.

**UI contract:** reuse the frozen **Image analysis workspace**, existing original/comparison display and the current output/measurement/histogram areas. A context-specific stage selector may appear inside an existing panel when there are actual stage results. Do not create a permanently visible pipeline editor, second navigation rail, compulsory inspector pane or an unrelated dashboard. On phone, show one image/result at a time and preserve access to the code editor.

**Result semantics:** an **original source image**, **computed gray/intensity array**, **display-only contrast view**, **binary mask**, **integer label image**, **manual reference annotation**, **predicted points** and **measurement table** are different data types with distinct legend/readout rules. A green outline must not be presented as a verified biological object without annotation. Raw OME channel or physical calibration must not be inferred from rendered RGB composite pixels. If two overlays have different axes, scales, orientation or spatial transforms, disable direct overlay and explain the mismatch.

**Provenance requirements for every displayed computed step:** `run_id`, `code_version`/hash, input asset ID/checksum, input image axes/shape, selected channel/ROI, named transformation and parameters, output shape/dtype, coordinate transform, whether intensity is calibrated, and timestamp or run-order ID. For author-provided static examples, label clearly **reference preview** and keep them separate from **your computed output**. The UI must never quietly replace a failed image read or unsupported image format with an unrelated demonstration image.

**Recompute/invalidation rule:** a change to input, channel, crop, threshold, algorithm, axes, code or pixel-scale interpretation invalidates the appropriate downstream artifacts. The UI may retain an old result as explicitly **previous run**, but it may not silently display it as the current result. Values, masks, overlays and tables associated with a failed/partial run must have a coherent status.

**Minimal I05 exercise:** use a licensed source image with documented channel semantics; run genuine Python with a 0.70 *illustrative normalized threshold* if the array really is a normalized teaching representation (or use a raw-value threshold with explicit dtype and range). Save the produced mask and bright-pixel fraction, change threshold and inspect the difference; then try a second unfamiliar image with uneven background. The learner must explain why the first threshold may fail. A toy interactive illustration can preview the concept but is **not evidence** of actual Python or calibrated segmentation.

**Acceptance tests:** match pixel-array dimensions and masks to reference CPython output; confirm source overlays align to the same coordinate system; test changed threshold, empty mask, all-foreground, NaNs/16-bit as applicable; test a mismatched-size overlay rejection; confirm stale-result invalidation; test local/offline source fallback with no image substitution; capture expected source/asset citation in exported findings.

### 19.5 Learn / Apply / Prove must mean increasingly independent work

The concise **concept exercise** introduces only the Python construct necessary for the current mini-goal. The **practice** exercise applies it in a biological context; the learner chooses code structure where several correct implementations exist. The **independent** task changes enough of the problem to prevent mechanical copying. This extends the existing v2 learning contract rather than adding a new compulsory exercise layer.

- **Learn:** run a small example, predict output, inspect one concept and make a meaningful modification. A novice should not have to read ten pages to try a two-line loop.
- **Apply:** solve a complete miniature scientific task using earlier components; include an inspectable output, error case and real author reference tests.
- **Prove:** start from a blank or appropriately sparse editor; use unfamiliar observations, different representation or changed biological context; interpret limits; reference solution and exemplar trace stay out of normal learner views.
- **After completion only:** optional **Compare approaches** explaining a loop vs comprehension, list vs dictionary, vectorized NumPy vs Python loop, threshold variants or table transformations. Compare readability, correctness, scale/efficiency and scientific interpretation. The comparison may reveal a more idiomatic approach; it should not retroactively punish a clear, correct learner solution.
- **Assessment distinction:** reference fixture passing is *technical evidence*; the decision to use a particular control or make a biological claim may require an explicit rubric. Viewing comparison text is learning activity, not new independent mastery.

**Example:** after filtering microscope records independently in P03, show two successful solutions, one using an explicit `for` loop and one using a comprehension *only after the comprehension concept has been introduced in P04*, or mark it optional advanced preview. Do not introduce syntax out of prerequisite order merely to appear sophisticated.

**Acceptance:** no duplicate concept ownership; model answers unavailable at the wrong time; alternative solutions satisfy the same semantic tests; hints reduce but do not erase independence evidence; no grading rule relies on code text matching an instructor reference exactly.

### 19.6 Fiji-to-Python bridges: leverage expertise without pretending equivalence

The intended learner can already reason about ROIs, contrast, image stacks, segmentation and ImageJ/Fiji operations. A few well-chosen bridges can turn this prior knowledge into an advantage, while maintaining the actual goal: **standalone scientific Python fluency**.

| Familiar Fiji operation (conceptual) | Python operation to learn | Explicit conceptual trap |
|---|---|---|
| Open image / inspect channels | `skimage.io.imread`, `tifffile.imread`, shape/dtype inspection, metadata where available | Display composites are not necessarily raw image channels; array axes differ by file |
| Make rectangular ROI / crop | NumPy slicing `image[y0:y1, x0:x1]` | Pixel rows are `y`, columns `x`; stop coordinates are exclusive |
| Change Brightness/Contrast display | Matplotlib `vmin`, `vmax`, normalization for *display only* | Display contrast must not silently modify quantitative pixel data |
| Subtract background | SciPy/scikit-image approach with documented method/parameters | Fiji rolling-ball and a differently implemented algorithm are **not numerically identical by default** |
| Threshold an image | Boolean NumPy mask and scikit-image thresholding | Threshold units/polarity and preprocessing change selected pixels |
| Analyze Particles | Connected components + `regionprops_table` | Candidate labels are not validated cells/puncta; touching objects remain a challenge |
| Measure several channels / ROIs | Masked intensity and region property calculations | Quantification needs verified channel interpretation and consistent masks |
| Apply operation to an image stack | Explicit axis selection and loop/vectorized processing | Z/T/C ordering and calibration are not universal |
| Save macro and record steps | Tested Python function + script + configuration and provenance | A Fiji macro is not automatically executable Python |

**Presentation:** at most one collapsed **Fiji equivalent** note for a relevant mini-goal. Never force an ImageJ menu tutorial as a prerequisite. When numerical equivalence is asserted, provide paired test data and tolerated differences; otherwise label the bridge *conceptual analogy only*. For the software integration distinctions, consult [Fiji Python modes](https://imagej.net/scripting/python) and [PyImageJ](https://imagej.net/scripting/pyimagej): legacy Fiji **Jython** uses Python 2.7 and cannot run standard NumPy/SciPy, while Fiji now also documents CPython-based integrations. Do not simplify this to "Fiji cannot use modern Python" or "Fiji scripts are normal Python".

**Acceptance:** one clearly scoped bridge when useful, no incorrect equivalence, executable Python output verified, no added clutter, and a standalone path for learners who have never used Fiji.

### 19.7 Deliberate failure cases: scientific skepticism is a learned programming skill

Each major chapter must contain **one genuine failure mode**, introduced at the correct depth. Failure can mean an exception, a wrong result that passes basic syntax/tests, a misleading display, or an inference that exceeds the data. Authors must write an actual investigation: **symptom → observation → competing explanations → diagnostic test → correction or declared limitation → independent new case**.

| Stage | Required representative challenge | What success looks like |
|---|---|---|
| Python P01–P06 | A stale notebook value, overwritten list, silently discarded field ID, malformed metadata, zero denominator or untested function | Identify root cause and produce a corrected runnable script, preserving original data |
| Numeric/images I01–I04 | Wrong axis, unexpected dtype, overflow, inverted coordinate, crop view mutation or misleading contrast stretch | Explain the numeric/image effect, check against an invariant, repair without pretending pixel calibration |
| Segmentation I05–I06 | Nonuniform background, over/underthresholding, merged objects, border artifacts or one parameter that works on one image but fails on another | Compare intermediate masks and quantify/document failure; don't invent correct nuclei counts |
| Tables/measurements I07–I10 | Duplicate join rows, incorrectly aligned mask, apparent puncta that are noise, tracking mergers, reference annotation inconsistency | Find the join/geometry/annotation fault and evaluate it against valid reference data |
| Statistics I11–I12 | Pseudoreplication, biased QC exclusions, batch confounding, confusing SEM with variability of raw values | State the correct experimental unit and change the analysis/report or withhold the conclusion |
| Full project I13 | A previously successful pipeline fails on an unseen image set with changed channels, background or object densities | Diagnose, document parameter choice, validate and report limitations; no guaranteed numeric score |
| Sequence N01–N04 | Ambiguous bases, unexpected FASTQ encoding/quality, malformed record, missing coverage/feature data or invalid normalization interpretation | Validate inputs, preserve provenance, explain the biological limit |
| ML L01–L03 | Same specimen in train and test, target leakage, minority-class collapse, preprocessing before split or overconfident model | Diagnose the leak/failure and evaluate honestly on grouped unseen data |

**Hard rule:** do not reward a learner simply for generating a number or a beautiful figure if the method was invalid. Some tasks must intentionally end with a scientific recommendation such as **"insufficient reference annotations to claim cell-count accuracy"**. The rubric needs to allow reasoned rejection of a method as a correct answer.

**Validation:** each failure scenario has a deterministic reproducer, author reference analysis, at least one misleading but syntactically valid output, and a new test case. Capture the *cause* and the *scientific implication*; avoid vague "try again" feedback.

### 19.8 A cumulative research artifact: the real progress indicator

Treat the curriculum as one evolving, reproducible **scientific workbench**, not 26 independent notebooks. The learner should be able to open a named output from an earlier mission and see it used in a later one. A compact example project tree could be:

```text
research-workbench/
  README.md                   # scientific question, data provenance, reproduction instructions
  data/                        # original licensed/synthetic examples; never silently edited
  metadata/                    # specimen registry and QC decisions
  src/                         # learner-created functions and scripts
  outputs/                     # generated images, masks, measurements and plots
  tests/                       # learner- and author-visible appropriate checks
  reports/                     # assumptions, figures, analyses and limitations
  requirements.txt             # pinned or reproducibly specified Python dependencies
```

This tree is a **future output layout**, not a request to create a new app framework or duplicate directories in GitHub now. For the browser, an equivalent downloadable artifact bundle or virtual-file representation may be appropriate. Real filesystem, Git and environment training must run in the local lane.

**Artifact contract for every chapter:**

| Field | Required property |
|---|---|
| Artifact ID and role | Stable project-relative ID, data/script/function/figure/report; exact owning chapter |
| Inputs and dependency chain | Dataset IDs, previous outputs reused and known required metadata |
| Generation mode | Learner Python / validated author reference / local manual; never ambiguous |
| Reproducible recipe | Executable code, versions, parameters and randomness policy |
| Output expectation | Invariant, type, shape/schema, units, scientifically appropriate tolerance |
| Provenance | Source URL/license if data; code/input checksum for computed output; change log |
| Safety and ethics | Biological interpretation limits, identifiable/private data policy, license restrictions |
| Handoff and export | How later chapters import/use it, how to download and reproduce locally |

**Proposed sequence:** P01 produces a small specimen report; P02 adds validated label functions; P03 a traceable field-QC record; P04 a metadata dictionary; P05 a reusable analysis function; P06 tested local files/scripts; I01–I04 introduce image array readout and interpretable displays; I05–I06 generate masks/labels; I07–I08 tables/figures; I09–I12 measurements/validation/replicate statistics; I13 exports a multi-image analysis. NGS and ML can maintain separate specialized artifact subprojects while reusing Python and reproducibility tools. Avoid artificially coupling biological sequence analysis to image measurements when that makes the science worse.

**Safety:** preserve immutable raw inputs; namespaced filenames prevent overwrites; output manifests distinguish reference data from student results; restore/export never discards old attempts; schema migrations are idempotent; no re-evaluation of old code falsely certifies new independent mastery.

**Acceptance:** a real P03 artifact opens in P04 without hand transcription; an I05 mask can be matched unambiguously to its source image; an I13 project is reproducible in local Python with documented setup and independently reviewed scientific claims.

### 19.9 Optional explanations and support without an AI dependency

The current design should work well with deterministic, locally authored instruction, actual Python feedback, short reference notes and optional selected-code explanations. An AI assistant, if later considered, is an **optional aid**, not an essential completion mechanism, source of scientific truth or automatic grader.

- Only offer help when requested or after a clear learner impasse, never a permanent floating chat window.
- Prefer *why did this line do that?* or *what does the actual traceback indicate?* over generating a complete solution.
- Ground guidance in the actual attempted code, runtime output and relevant source passage; state when the model is uncertain about scientific interpretation.
- Show the smallest useful hint; full reference solutions only after the appropriate independent attempt or explicit learner request, with transparent assistance status.
- Never send user images, unpublished lab data, credentials or stored code to external AI services without informed opt-in and suitable data handling.
- All chapters must remain completable with AI disabled. The course cannot rely on an untested LLM to provide correct feedback or determine mastery.

### 19.10 Chapter-by-chapter adoption matrix (all 26 missions)

Use this as a **mandatory planning checklist** during each chapter's writing pass. The examples specify inspection and scientific-failure *opportunities*, not 26 new permanent UI controls. The final author chooses the smallest mechanism that achieves the learning outcome. Each chapter still owns exactly its existing Witz-spine competencies and its original output contract.

| Chapter | Inspectable state or relevant familiar bridge | Required failure/reasoning challenge | Reusable artifact to retain |
|---|---|---|---|
| **P01** | Actual executed lines, `specimen_id` and type/value; show traceback location on request | Mistyped variable or notebook state that prints a plausible stale result | `specimen_report.py` or equivalent exportable snippet |
| **P02** | String split, parsed components and Boolean validation conditions | Invalid label pattern or silently ambiguous specimen ID | `sample_id_rules.py` with examples and validation policy |
| **P03** | Each field-loop iteration and accumulating accepted/rejected/missing lists | Lost field identity, `None` compared to number, off-by-one bound | `field_qc.py` plus field-level exclusion record |
| **P04** | Nested dictionary before/after update, set of duplicate IDs | Duplicated keys or mismatched metadata entries that look valid | Machine-readable specimen registry and validation summary |
| **P05** | Function call/return and compact state/scope trace | Hidden global variable, mutable default, invalid input or swallowed exception | Tested metadata/measurement helper functions |
| **P06** | Files created, exact test result, dependency/config provenance | A script works only due to current working directory or unstated package version | Tested project skeleton, `requirements`/environment notes, Git change |
| **I01** | Source image, shape, axes, dtype, channel preview; optional Fiji open-image bridge | RGB rendered image mistaken for calibrated channel or reversed row/column | Image provenance and inspection report |
| **I02** | Crop bounds and source/ROI overlay; optional Fiji rectangular-ROI bridge | Wrong coordinate origin, crop out of bounds or a view mutating original data | Reusable ROI extraction function + coordinate manifest |
| **I03** | Array shape/dtype and mask aggregation result at each key step | Broadcasting mistake, integer overflow, masked division or NaN policy | Typed NumPy measurement functions with fixtures |
| **I04** | Raw data vs display-only contrast, numeric histogram; Fiji display bridge | Saturated display interpreted as changed signal or misleading color scale | Interpretable multi-panel figure and metadata |
| **I05** | Original → background → threshold mask; Fiji threshold concept bridge | Uneven background or threshold produces unstable foreground | Threshold pipeline and sensitivity plot |
| **I06** | Binary mask → morphology → integer labels → image overlay; Fiji Analyze Particles bridge | Touching/border objects produce incorrect "cell" count | Candidate-label map, region table and parameter record |
| **I07** | Before/after table and column schema/ID count | Silent missing-row deletion or wrong inferred data type | Clean measurements CSV plus QC log |
| **I08** | Join cardinality before/after, group summaries, figure | Duplicate-key merge inflates observations or creates artificial group difference | Joined traceable dataset + exported figure |
| **I09** | Labeled region + per-channel intensities + mask alignment | Signal measured from wrong channel/misaligned mask, apparent puncta noise | Region/compartment feature table and overlay |
| **I10** | Predicted tracks/masks against reference annotations and error table | Merged objects or annotation disagreement disguises poor performance | Annotated-validation report with explicit uncertainty |
| **I11** | Field → specimen → biological replicate mapping and batch metadata | Fields incorrectly treated as independent replicates | Replicate-level dataset and sampling/QC decisions |
| **I12** | Replicate points, effect-size distribution and uncertainty | SEM used as raw variability or wrong bootstrap resampling unit | Reproducible figure/report with statistical limitations |
| **I13** | Full pipeline stage inspector + provenance/parameter history | Unseen acquisition changes break previously reliable segmentations | Reproducible multi-image project with documented limits |
| **N01** | Sequence transformations and ambiguity handling | Empty sequence or ambiguous base causes misleading GC fraction | Tested DNA sequence utility functions |
| **N02** | Record-level FASTA/FASTQ parser status and metadata | Incomplete record or FASTQ structure mismatch accepted silently | Sequence parsing/validation script |
| **N03** | Quality profile, k-mer table and before/after trimming | Fixed quality rule hides low-quality tail or ambiguous k-mers miscounted | Sequencing QC report and threshold log |
| **N04** | Coverage/count matrix with library-size context | CPM mistaken for differential-expression significance | Traceable count/coverage summary |
| **L01** | Specimen membership of train/test groups | Related measurements leak across train/test sets | Leakage-audited split manifest |
| **L02** | Dummy vs interpretable models, comparable metrics | Preprocessing outside split or misleading accuracy from imbalance | Reproducible baseline model comparison |
| **L03** | Per-group validation metrics, errors and calibration | High score from leaked groups, unstable calibration on new data | Independent model assessment and scientific caveats |

The author must specify exactly **when** the student can open these views, what data the visual is sourced from, what the learner is expected to infer, and how a wrong conclusion is corrected. If a static trace is used only as explanation, label it as such; it does not count as the learner having inspected their own execution.

### 19.11 Proposed content-schema extensions and importer behavior

These are illustrative **backward-compatible planning fields**, *not declarations that the existing content JSON or frozen UI already implements them*. Keep implementation in a future, separately reviewed adapter PR. Example of an activity declaration:

```json
{
  "activity_id": "bps3.P03.field-filter.inspection",
  "chapter_id": "P03",
  "competency_ids": ["012", "015"],
  "phase": "learn",
  "runtime": "browser_pyodide",
  "supports": {
    "execution_inspection": "optional_bounded_trace",
    "analysis_snapshots": false,
    "post_solution_comparison": true
  },
  "inspection_plan": {
    "mode": "trace_small_python",
    "visible_when": "on_request_after_run",
    "watch": ["field_id", "score", "accepted_ids", "missing_ids"],
    "max_steps": 120,
    "fallback": "actual_output_plus_authored_debug_prompt"
  },
  "failure_case": {
    "id": "bps3.P03.missing-value-boundary",
    "symptom": "None compared with a numeric cutoff",
    "expected_diagnosis": "Missing data need their own branch and log",
    "fixture_ref": "author-tests/P03/missing-value.json"
  },
  "artifact_outputs": [
    {
      "id": "workbench.python.field-qc",
      "kind": "python_script",
      "path": "research-workbench/src/field_qc.py",
      "reused_by": ["P04", "P05"]
    }
  ]
}
```

**Binding rules:**

1. Store stable IDs/links in the chapter manifest, but use a separate author-only test/solution package. `fixture_ref` above is an **authoring-only pointer**, not a URL that grants the learner the complete solution.
2. The adapter validates version compatibility, canonical competency ownership, required features and referenced assets. It must never replace learner code/progress while reading optional metadata.
3. Unknown **optional** fields are ignored with safe behavior; missing **required** capabilities are labeled and block release of the affected activity. The importer should distinguish `supported`, `fallback`, `unsupported` and `not_tested` statuses rather than hide a requirement.
4. A real tracing feature produces structured events in the isolated Python runtime and a bounded serialized view; do not embed JavaScript snippets or `eval` expressions in learner content.
5. A real image stage result binds to an executed code run and exact source asset+parameters. The learner's output and reference output must be visibly distinguishable; both use the existing viewer where possible.
6. Source figures, labels and post-solution exemplar code use relative content paths, explicit license/provenance and accessible descriptions. No runtime URL is constructed from unreviewed user-supplied HTML.
7. For offline/local mode, export a run manifest and outputs that can be checked by a local test. Do not claim interactive browser tracing supports local Git/venv actions.
8. The importer changes the smallest existing UI surface necessary; any persistent new toolbar/pane or revised navigation needs a demonstrated usability benefit and separate design-freeze exception review.

### 19.12 End-to-end acceptance scenarios

A chapter author must select applicable scenarios from this list and attach file paths/run evidence. These are not hand-wavy demo requirements:

**Scenario A — transparent loop (P03):** learner predicts the accepted IDs, runs Python against three changed record lists including missing values and a boundary, views correct stdout/variable summaries, diagnoses a failure, and independently processes a differently structured unseen record set. Closing and reopening preserves code and progress. Visual inspection remains optional.

**Scenario B — segmented image (I05–I06):** learner loads an attributed image, runs Python to produce a mask, sees the same mask as an overlay with correct coordinates, changes a threshold, observes recomputed output, and tests an unfamiliar image with uneven illumination. A mask that creates plausible objects but demonstrably poor annotation agreement must not earn a scientifically valid accuracy claim.

**Scenario C — Fiji bridge (I02/I06):** a short note connects a familiar Fiji ROI or particle-analysis concept with tested Python, explains axes or algorithm non-equivalence, and lets a learner unfamiliar with Fiji skip without missing any competency.

**Scenario D — independent project (I13):** learner exports source-reference manifest, scripts, parameters, outputs, tests and report; a clean local environment re-runs the analysis on a second image set. A changed channel layout triggers a helpful mismatch error rather than silently using the wrong channel.

**Scenario E — valid negative conclusion (I11/L01):** a numerically impressive result is scientifically indefensible because of pseudoreplication or leakage. The learner explicitly rejects the inference, changes the analysis/design or identifies which data are missing; the assessment recognizes this as correct scientific reasoning.

**Scenario F — stable content import:** adding a chapter through its data package preserves frozen IDE geometry, old 61-ID progress mapping, per-activity drafts, output provenance, solution separation and graceful feature fallbacks. Unavailable optional inspector support does not break a lesson; a declared required feature blocks that activity transparently. Existing lessons remain functional.

### 19.13 Prioritized implementation milestones (stop at evidence, not feature count)

| Order | Work | Prerequisite and acceptance | Decision |
|---|---|---|---|
| **A — Content authoring now** | Add trace questions, scientific failure scenario, post-completion comparison notes, artifact manifest to P01–P03 chapter plans | Reference outputs and scientifically correct interpretations reviewed | **Do now, without changing UI** |
| **B — Actual Python runtime** | Wire/verify pinned Pyodide worker to the frozen Run/output surfaces | Genuine outputs/tracebacks, retries, package load, persistence and reset; no fake execution | **Release blocker** |
| **C — Small inspection pilot** | Implement one bounded P03 Python execution inspection option | Three changed-input trace checks and no significant UI/performance regression | **Maybe; keep only if useful** |
| **D — Early real-image milestone** | Bundle/license-check a source image and show honest array/dtype/shape | Image loads reliably in browser; provenance and axes verified | **Required before quantitative imaging** |
| **E — I05/I06 stage inspection** | Expose actual intermediate masks/labels through existing image viewer | Stale/misaligned result tests, threshold sensitivity, scientific false-positive case | **High priority** |
| **F — Cumulative export and local handoff** | Validate artifact reuse, script/notebook export, local environment reproducibility | P06 and I13 clean-run handoffs | **High priority** |
| **G — Nice-to-have support** | Selected-code explanations, alternative solution compare and Fiji equivalence notes | Clearly improve one specific task; no clutter or dependence | **Optional** |

Do **not** block content generation on step-trace implementation or a bespoke image viewer feature. Author the observation and assessment contracts now; implement the smallest dependable visualization when the actual runtime is ready. If two consecutive prototypes add engineering cost without improving comprehension, stop and use transparent code/output/overlays instead.

### 19.14 Final anti-bloat and acceptance checklist for chapter generators

Before marking any authored chapter `CONTENT_COMPLETE`, verify:

- [ ] It retains all and only the mission's assigned 156-catalog competency IDs and correct prerequisites, with no invented skill or new mandatory route.
- [ ] Each owned concept is taught once; related concepts are retrieved via authentic practice rather than a duplicate lesson.
- [ ] The learner has a meaningful result early, with actual Python code and sourced real imagery where appropriate.
- [ ] Every relevant task has an understandable code/result inspection or debugging method; use the smallest adequate method.
- [ ] At least one plausible failure case teaches *cause* and *scientific consequence*, including a case of valid code but invalid inference for image/statistics/ML work.
- [ ] All images, masks, labels, annotations, points and measurement units are correctly identified and derived from traceable data.
- [ ] Changed inputs, boundary conditions, alternative valid solutions and source/API versions pass author reference tests.
- [ ] The chapter produces one explicitly named reusable artifact and documents its input assumptions, output invariants, provenance, and next-chapter usage.
- [ ] Independent Prove work is not mechanically copyable from the worked example or a visible inspector/reference solution.
- [ ] Assistance/review history never automatically becomes independent or retained mastery; learner progress is not destroyed on import.
- [ ] Fiji connections, post-solution comparisons and selected-code explanations are optional and require no new UI clutter.
- [ ] Real browser/local execution and UI image inspection are tested **separately** from content-only CPython tests; statuses are reported honestly.
- [ ] The design can be paused/resumed; editing/run failure does not destroy code; keyboard and reduced-motion accessibility remain usable.
- [ ] At least one actual learner pilot exposes where difficulty, inspection or features harm rather than help autonomous learning; revise the smallest relevant component.

**Final research verdict:** BioPython Studio's defensible design is **Witz-led biological problem solving + Exercism-like independent practice + optional Thonny/Python Tutor-style debugging clarity + CellProfiler-like step inspection + napari-like result semantics + Fiji-aware conceptual transfer + reproducible scientific projects**. Implement only the portions that survive real learner and correctness tests. This is the **last platform-research design pass** before implementation trials; additional feature brainstorming alone should not unfreeze the specification.

---

**Final authoring rule (v2.1):** Produce **one accurate, engaging, complete, independently testable chapter at a time** with a real early result, graduated support, an honest transfer challenge and a resumable artifact. When it passes the content gate, integrate only that chapter into the frozen UI through a controlled, reversible import. Do not advance status based on file count, apparent polish, CI alone, or a plausible-looking scientific plot.