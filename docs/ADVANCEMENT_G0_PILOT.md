# G0: independent learner pilot — record before advancing

**Status: testing protocol, not evidence that a human has completed a pilot.**
Run the existing deployed draft from PR #21, not a different production version. Save the exact preview URL and commit on this form. Do not overwrite saved lessons.

## Five representative tasks

| Chapter | Pilot question | What to record |
|---|---|---|
| P01 | Can I write and change an independent scientific specimen script? | Correctness without copying; output and explanation |
| I05 | Can I explain how the image threshold changes foreground? | Correct use of real arrays and a meaningful failure case |
| I13 | Can I work with native TIFF files and reject uncalibrated biological claims? | Axes/channel inspection and runnable source-preserving export |
| N01 | Can I use a real Biopython sequence operation on a changed record? | Correctness, clarity, independent Prove |
| L01 | Can I identify experimental grouping and data leakage? | Biological-unit reasoning and a working baseline |

## Learner evidence template

For each chapter record: date; chapter and goal ID; first-attempt code; whether Learn/Apply/Prove succeeded; time used; number of hints; point of confusion; scientifically wrong-but-passing behavior; whether the result made sense; screenshot or error trace if applicable. Record *assistance used*; do not call an AI-assisted solution independent.

### Real delayed-transfer check

After returning to the topic on a later day, solve a different input without reopening previous code. Write down what you actually remembered. Automated changed-input cases on the same day are not delayed retention evidence.

## Regression inventory

- [ ] 26 original chapter packages remain present; competency totals P36/I91/N17/L12.
- [ ] Original chapter IDs, progress/local draft keys and frozen UI are unchanged.
- [ ] P01 and I13 real Pyodide execution/figure output work in browser.
- [ ] TIFF selected via **Open images** arrives unchanged in Python.
- [ ] N01 Biopython and L01 scikit-learn imports run in the real browser.
- [ ] Original 8 CI workflows remain green on the exact integration commit.
- [ ] Mobile interface and task comments remain readable.
- [ ] No new advanced pilot code is merged into production/main.

## Decision gate

**Pass G0 only after actual user evidence** confirms the beginner-to-intermediate path works and no severe blocker exists. If a pilot fails, first fix the affected original chapter (with regression testing) rather than adding harder content. The current new branch is allowed to contain isolated research scripts while G0 is pending.
