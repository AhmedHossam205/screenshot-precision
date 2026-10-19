# Behind the Dots Replay Data Design

## Goal

Give repeat players new scatterplots while keeping each case's intended relationship, answer quality, and story accurate.

## Recommended approach

Generate each run's three case datasets from one saved deterministic seed. Keep the tutorial data fixed. When a player starts a new run, create a new seed and generate the datasets once; derive feedback and score from each generated dataset's actual Pearson correlation. Reopening or refreshing an active run reuses its seed and therefore shows the same dots. Replaying starts with a new seed.

## Data rules

- Keep the three existing case IDs, business questions, axis labels, order, and 12 points per case.
- Keep each case's established lesson: case C1 is strongly positive with `0.70 <= r <= 0.92`; case C2 is strongly negative with `-0.92 <= r <= -0.70`; case C3 has little or no linear relationship with `abs(r) <= 0.15`.
- Generate integer y-values within each case's current observed range (C1: 4–19, C2: 5–30, C3: 4–18). Keep x-values and their case-specific meaning unchanged. For C1 and C2, add seeded jitter to a positive or negative linear signal; for C3, sample y-values independently of x. Accept a candidate only when its calculated correlation is inside that case's band.
- Do not reveal generated correlation values before submission. Continue using the existing scoring function after submission; all result, score, evidence, and debrief values use the same generated data.
- Keep generation deterministic from the seed and stable for the duration of a run. A new replay seed should differ from the previous seed.

## Saved progress

- Persist the seed with the saved game state so pause, reload, and resume preserve the same data.
- Preserve existing version-1 in-progress saves that have no seed: let them finish against the existing authored datasets. A fresh run after that uses generated data. This avoids changing the correct answer underneath any already-recorded guesses.
- Do not add a backend or send player data anywhere; generation and save data remain local.

## Boundaries and failure handling

Use at most 1,000 candidate attempts per case. If no candidate meets a case's correlation band, return a known authored dataset for that case so the round always starts with valid, teachable data. Ensure the new seed differs from the previous run's seed. Confirm each accepted dataset has 12 matching x/y points, remains within its y-value bounds, and falls in its intended correlation band.

## Scope

This changes only replay-time data for the three main cases. Tutorial data and story copy remain fixed. The player's data interpretation, correlation calculation, and scoring thresholds remain unchanged.
