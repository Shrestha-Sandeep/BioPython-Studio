# BioPython Studio — Optional Advanced Research Lab

**Implementation (development branch):** A00, A01, A02, A03, A05, A06 and A07. The conditional A04 3D/time-lapse project and elective X01–X05 remain outside this core milestone.

The lab is available at `/?lab=advanced` when serving **this branch**. The existing 26-chapter course remains at `/` with separate saved progress. Browser learning examples use real Python/Pyodide on *synthetic teaching inputs*. Research projects below use actual local Python and can accept independently sourced TIFF/OME-TIFF datasets.

## Local science workflow

1. [A00 — Interpreter, safe files, venv, Git and source fingerprints](a00/README.md)
2. [A01 — Original TIFF/OME-TIFF axes, scale, intensity diagnostics](a01/README.md)
3. [A02 — Classical masks, LoG puncta candidates, core/rim and sensitivity](a02/README.md)
4. [A03 — Independent annotation, one-to-one object evaluation and agreement](a03/README.md)
5. [A05 — Biological sampling, animal-level statistics, paired design and confidence intervals](a05/README.md)
6. [A06 — Audited batch TIFF analysis and per-animal A05 handoff](a06/README.md)
7. [A07 — Independent unfamiliar-data research capstone and evidence rubric](a07/README.md)

The recommended workflow is A00→A01→A02→A03→A05→A06→A07. A04 is optional after A03, only for real properly annotated 3D or time-series data.

### Source and safety rules

- Never overwrite native images or work directly on the only copy.
- A TIFF container, OME pixel-size declaration, successful GitHub CI check or plausible mask does **not** certify calibrated raw instrument data.
- Keep restricted or personally identifiable laboratory data outside this repository and external LLM endpoints.
- Candidate objects are **not** confirmed biological objects without suitable annotations, controls and transfer tests.
- Image, field, animal, acquisition session and experimental replicate identities must be separated before statistical inference.
- A green Python/browser test does not verify that a learner can independently repeat the analysis, or that an exopher detection model is biologically valid.

## Real-data evidence

See [the BBBC038 65-image official test benchmark](../../docs/BBBC038_REAL_BENCHMARK_2026-11-08.md) and [BBBC039 50-image 16-bit evaluation](../../docs/A02B_REAL_MODALITY_TEST_2026-11-08.md). These are original annotated public image evaluations, not fictitious synthetic accuracy measurements. Their biological sources, mask conventions and sampling conditions differ.

## Release state

Core coding exercises and local analysis scripts are **working research pilots**. A07 cannot be completed without the learner's *independent* evidence packet and scientific review. No unreviewed autonomous merge into `main`, hosted production deployment, or a "9.5+/10" teaching outcome is implied.
