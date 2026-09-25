# Fraud ML learning

A build-and-learn project: fraud detection modelling for health insurance extras claims, built stage by stage to understand how a data scientist approaches the problem. It isn't a production model. Each stage has a script and a `NOTES.md` written in plain English after the code ran, using the real results.

Everything runs locally in plain Python (scikit-learn, pandas, matplotlib). There are no notebooks and no cloud services, and all the data is synthetic.

## Setup

```bash
cd fraud-ml-learning
pip install -r requirements.txt
python src/generate.py                                   # writes data/ (git-ignored, about 13 MB)
python stages/00-data-generator/check-dataset.py
```

The generator is seeded, so every run produces identical data.

## Layout

- `src/generate.py`: the synthetic claims generator.
- `src/features.py`: data loading and the rule signals shared across stages.
- `stages/`: one folder per stage, each with its script, `NOTES.md`, `output.txt` and figures.
- `data/`: generated files, not committed. The observable files are `claims.csv`, `members.csv`, `practices.csv` and `practitioners.csv`. The ground truth is in `claims_truth.csv`, `members_truth.csv` and `practices_truth.csv`, which are never used as model inputs.

All identifiers are fictional: BSBs use the unassigned `000` prefix, IP addresses come from private and shared (non-routable) ranges, and provider numbers use a made-up `PRV-` format.

## Stages

| Stage | Question | Status |
|---|---|---|
| [0: data generator](stages/00-data-generator/NOTES.md) | Can the honest cases be made genuinely hard? | Done |
| 1: why accuracy is useless | What does a fraud team actually measure? | To do |
| 2: claim-level baseline | How far do single-claim features get? | To do |
| 3: aggregate features | How much lift do the event-strategy features add, and how much of it is real? | To do |
| 4: label bias | What happens when only caught fraud is labelled? | To do |
| 5: leakage | How do you spot a feature that knows the answer? | To do |
| 6: thresholds and cost | Where should the review line sit? | To do |
| 7: explainability | Can a rejection be explained to a member and an ombudsman? | To do |
| 8: drift | What happens when fraudsters adapt? | To do |

## Results so far

**Stage 0.** 49,392 extras claims from 18,063 members over FY2025-26, with 540 planted frauds (1.09%): 148 device ring, 148 bank ring, 122 distance and 122 upcoding. Honest confounders (shared family devices, reception kiosks, corporate accounts, travel, IP geolocation error) are built in. Applied naively, the three current rule signals flag 10,740 claims, of which only 3.2% are fraud; they catch 345 of the 540 frauds and only 15 of the 122 upcoded claims.

The summary for a data scientist will be completed after Stage 8.
