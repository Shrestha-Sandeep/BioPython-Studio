# A05 — Biological statistics at the correct experimental unit

**Status:** Fully implemented scientific Python CLI and optional browser learning pilot. The program analyzes animal-level or matched-pair data and intentionally refuses unsupported small-N inference.

## Scientific question first

If ten fields are measured in one worm, the experiment still has **one independently sampled worm**, not ten biological replicates. Data need declared independent units, a prespecified design and transparent exclusions. A confidence interval from cluster resampling does not prove causality.

Input tidy CSV:

```csv
animal_id,condition,field_id,signal,exclusion_reason,pair_id
worm01,control,f001,4.0,,
worm01,control,f002,6.0,,
worm02,control,f003,3.0,,
worm03,control,f004,5.0,,
worm04,treated,f005,9.0,,
worm05,treated,f006,8.0,,
worm06,treated,f007,7.0,,
```

The file above contains 6 independent worms, with two technical fields from worm01. Values are **illustrative** only; never treat the result as a real biological experiment.

Run from repo root:

```sh
python -m pip install -r projects/advanced/requirements.txt
python -m projects.advanced.a05.analysis \
  --input /path/to/measurements.csv \
  --out outputs/a05-run-001 \
  --control control --treatment treated \
  --design unpaired --seed 4721 --draws 2000
```

Outputs: `animal_summary.csv`, `analysis.json`, and `animal_units.png`. The report contains original source SHA-256, exclusion audit, biological N, group means, effect estimate, resampling policy, percentile bootstrap CI and package versions.

**Paired design:** set `--design paired` and populate a stable `pair_id` on every row. Every pair must have a control and treatment unit; only **complete independent pairs** are resampled. The tool requires at least three pairs; likewise unpaired groups require at least three independent biological units each. Treat small sample CIs cautiously.

### Scientific limitations

- Animal/field IDs are metadata declarations. The code cannot independently verify that two animal labels represent two different animals.
- Exclusions must have been specified before examining the results; the tool records reasons but cannot determine whether they were post hoc.
- Area/fluorescence units need independently calibrated source metadata; the script does not convert arbitrary intensity to absolute molecules.
- Bootstrap resampling is percentile-based and may be unstable for small N or complex hierarchical designs; mixed-effects analysis is not automatically superior.
- No p-value is computed by default, and a demonstrated effect does not establish causality.

### Pass evidence

Explain the difference between field-pooled and animal-aggregated means. Run a paired and unpaired **synthetic** test, then independently use an actual permitted study with documented animal units; reproduce the output from a fresh environment. Record the design decision and any failed assumptions.
