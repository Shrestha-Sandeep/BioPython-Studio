# Independent transfer scoring guide

Use **after** the first unfamiliar-data attempt. The rubric measures technical transfer, not research publication readiness.

| Criterion | Points |
|---|---:|
| Original file hashes, format, axes and dtype preserved | 15 |
| Channel, ROI, physical-scale choices scientifically defended | 15 |
| Parameterized segmentation with manually reviewed diagnostic overlays | 20 |
| Per-region core/rim quantification with empty/zero denominator handling | 15 |
| Fresh-image transfer and parameter sensitivity evidence | 15 |
| Repeatable measurement table, manifest and source-preserving exports | 10 |
| Cautious interpretation and concrete controls | 10 |

**Hard failures (no pass):** overwriting sources; treating JPEG-derived RGB as calibrated raw intensity; ignoring non-singleton T/Z axes; hardcoding sample labels; counting nuclei as biological replicates; declaring a biologically validated model without independent annotations.

Suggested thresholds: at least **85/100**, with no hard failures, indicates independent introductory technical competence. At least **95/100** requires a third unfamiliar image, robust failure handling and coherent sensitivity analysis.

Keep dated copies of the first attempt, revised attempt and a delayed repeat at least one week later.
