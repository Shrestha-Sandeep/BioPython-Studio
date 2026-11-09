# Phase 1 — Consolidated release candidate (draft; no production merge)

**Date:** 2026-11-09. **Source tree:** advanced-core draft PR #27, verified ancestor `5f424b51ff92edff95417fec3890a01b85d707d0`. **Release branch:** `release/phase1-consolidated-candidate`, **intended PR base:** `main`. This branch is a reviewable consolidation of the upstream development tree, not a separately rewritten curriculum.

## What has actually been reconciled

- Original application on `main` is an older prototype. It does **not** already contain the newer 26-chapter / 156-competency implementation.
- Draft PRs #21–#27 are stacked on previous draft work. PR #27 builds on #26, and earlier ancestors contain the real runtime, entire microscopy track, NGS, ML and advanced scientific tools. The consolidated branch uses the exact PR #27 tip as its ancestor, avoiding cherry-pick drift and duplicate implementation.
- The standard route `/` is the original **26-chapter** path (P01–P06, I01–I13, N01–N04, L01–L03); the opt-in `/?lab=advanced` is **A00, A01, A02, A03, A05, A06, A07**. A04 and X01–X05 are explicitly outside Phase 1.
- Learner drafts and settings stay **browser-local**. The original chapter keys use `biopython.<chapter>.v1`; the advanced chapter selection is separate from standard selection. This release does not add user accounts, cloud sync, migrations or false mastery certificates.
- `tests/test_release_candidate_contract.py` and `.github/workflows/release-candidate.yml` add an independent, dependency-light check of all 33 lesson manifests, route selection, source references, 156 competency IDs, 52 advanced activities and frozen-shell static assets.

## QA evidence and limits

| Gate | Evidence | Result at Phase 1 start |
|---|---|---|
| Upstream GitHub Actions | 12 complete workflows on `5f424b51` | PASS |
| Advanced actual Pyodide exercises | 208 changed-input checks reported and previously confirmed by advanced browser workflows | PASS upstream |
| Vercel deployment metadata | `dpl_2sf7jA3bSjYRu9bSMgVG3ut1HKER`, exact upstream SHA, Vercel API `READY` | READY metadata only |
| Hosted preview URL | `https://biopython-git-advancement-a00-a05-a07-core-and-qa-sunsstha-1695.vercel.app/` | Browser HTTP/functionality **not independently verified** |
| Consolidated branch CI | New release-candidate workflow and existing CI | Verify on this branch |
| Actual independent learner trial, local A00 and A07 capstone | Human learner and externally reviewed unknown real dataset | NOT DONE |
| Release to `main` and production domain | Explicit user approval required | NOT DONE |

The earlier Vercel *quota* failure is no longer a demonstrated blocker for the upstream SHA: a later preview deployment reached READY. This does **not** prove the live page and Pyodide CDN work for the learner, nor does it mean `biopython-two.vercel.app` points to the release candidate.

## Manual go/no-go checklist before merging

1. Open the exact preview and inspect the Network/Console for failures. Select each of the four standard stages and verify `/` has 26 chapters.
2. Visit `/?lab=advanced`, verify seven A chapters, execute one real Python `Run`, a changed-input `Check`, and TIFF loading.
3. In both routes, save a distinctive unsolved draft; refresh, switch stages and return, verify both drafts persist without overwriting each other. Use browser storage backup before testing if existing personal work is valuable.
4. Export a capstone `.py`, execute it in a fresh local Python environment and record Python/package versions, input hashes and outputs. Do not accept a fake browser-only Git/venv check.
5. Inspect on a mobile viewport with the lesson panel collapsed by default and manually expanded when requested.
6. Compare production/domain routing, deployment protection and Build/CI status; preserve existing production until explicitly authorized to merge.
7. Record an independent A07 annotated-dataset capstone and interpretation with a human reviewer before calling the **science** validated.

## Local commands

```sh
python -m http.server 8000
# open http://localhost:8000/ and http://localhost:8000/?lab=advanced
python tests/test_release_candidate_contract.py -v
node --test tests/preview.test.mjs tests/witz_sources.test.mjs
```

For full scientific and Pyodide regression use the existing GitHub Actions workflows; the compact release contract is an **additional structural gate**, not a substitute for real browser execution or human learning.
