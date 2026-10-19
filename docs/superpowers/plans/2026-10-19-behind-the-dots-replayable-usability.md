# Behind the Dots Replayable Usability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Behind the Dots easier to read and play, keep its submit control clear of Glitch, add a recurring human guide, and generate new lesson-correct scatterplots on replay.

**Architecture:** Keep the existing React and SVG game. Add a deterministic case-data generator keyed by a seed in `GameState`, with seedless saved rounds continuing to use the authored datasets. Add Rami as an inline SVG component, simplify guidance copy, and move the chase animation into the case header while the submit action sits in a reserved bottom dock.

**Tech Stack:** React 19, TypeScript, TanStack Router, inline SVG, Tailwind CSS 4, Vite.

**Specs:**
- `docs/superpowers/specs/2026-10-19-behind-the-dots-player-experience.md`
- `docs/superpowers/specs/2026-10-19-behind-the-dots-replay-data.md`

## Global Constraints

- Keep the case-file identity, Dotty, and Glitch; add Rami as the human guide.
- Use simple conversational Egyptian Arabic, larger copy, and short single-idea explanations.
- Keep the tutorial untimed and fixed; retain current scoring thresholds and the 15-second round.
- Keep the chase lane in normal document flow and reserve enough bottom space for the visible submit dock.
- Generate 12 points per main case with C1 `0.70 <= r <= 0.92`, C2 `-0.92 <= r <= -0.70`, and C3 `abs(r) <= 0.15`.
- Persist one deterministic run seed; seedless version-1 saves continue with authored data.
- Keep generation and progress local; do not introduce a backend or external data service.
- Preserve the repository's published Git history; do not rewrite commits or push without an explicit request.

## Review Focus

- A seedless in-progress save must keep the authored data until that run finishes, so its recorded answers remain valid.
- A refresh or resume must reproduce the same generated dots; a replay must start a fresh dataset.
- A failed random candidate search must fall back to a known valid dataset within the intended correlation band.
- Glitch must never cover the slider, hints, or submit action; timeout must fire once and pause or submit must stop the chase.
- At short mobile viewport heights, the action dock must stay visible and must not cover scrollable content or controls.

---

### Task 1: Generate replay datasets and preserve saved rounds

**Files:**
- Create: `src/features/behind-the-dots/engine/datasets.ts`
- Modify: `src/features/behind-the-dots/engine/gameState.ts`
- Modify: `src/features/behind-the-dots/engine/persistence.ts`
- Modify: `src/features/behind-the-dots/BehindTheDotsGame.tsx`

**Interfaces:**
- `datasets.ts` exports `generateRunCases(seed: number): readonly StoryCase[]` and `createRunSeed(previousSeed?: number | null): number`.
- `GameState` stores `runSeed: number | null`; `currentCase` resolves generated cases when a seed exists and authored cases when it is null.
- `start` receives a seed from the UI action. Seedless hydrated version-1 states remain seedless until replay.
- Strong cases add seeded jitter to a positive or negative linear signal; C3 samples y-values independently from x. Each generator tries at most 1,000 candidates before using the authored case as a fallback.

- [ ] Add deterministic seeded pseudorandom helpers and case-specific candidate generation. Generate bounded integer y-values, add jitter around a positive or negative signal for C1/C2, sample independently for C3, and accept only candidates whose Pearson value is in the spec band. Stop after 1,000 attempts and fall back to the authored case data.
- [ ] Thread `runSeed` through state creation, `start`, `replay`, hydration, and persistence. Do not add randomness inside the reducer; create the seed at the UI action boundary.
- [ ] Route every active-case consumer through the same resolved case data so the plot, answer, reveal, and saved evidence agree.
- [ ] Manually inspect the generator output for several distinct seeds and confirm all candidates and fallbacks meet point-count, range, and correlation rules; confirm a legacy seedless state resolves to authored data.

### Task 2: Add Rami and make guidance beginner-friendly

**Files:**
- Create: `src/features/behind-the-dots/components/Rami.tsx`
- Modify: `src/features/behind-the-dots/components/StoryCard.tsx`
- Modify: `src/features/behind-the-dots/BehindTheDotsGame.tsx`
- Modify: `src/features/behind-the-dots/data/dialogue.ts`
- Modify: `src/features/behind-the-dots/data/cases.ts`
- Modify: `src/features/behind-the-dots/components/ScatterGuess.tsx`
- Modify: `src/features/behind-the-dots/components/RSlider.tsx`
- Modify: `src/features/behind-the-dots/components/ScatterPlot.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- `Rami.tsx` exports `Rami({ size, mood })`, with moods for greeting, pointing, thinking, and celebration.
- `StoryCard` renders Rami as the guide; player dialogue keeps its current distinct treatment.
- Dotty and Glitch remain in `Mascot.tsx` with their existing roles.
- `ScatterGuess` accepts `submitInDock?: boolean`; when true it omits the inline submit button while retaining the slider, presets, and hint action.

- [ ] Build the original inline SVG guide with a scatterplot badge, notebook or marker, and a small set of reduced-motion-aware reactions.
- [ ] Replace Dotty's current guide-avatar use with Rami. Update the cover and guide labels/dialogue so they identify Rami consistently while keeping Dotty and Glitch in their companion and antagonist roles.
- [ ] Shorten tutorial, hint, puzzle, and result copy into one plain-language point at a time. Keep the up/down/scattered mental model and a simple correlation-versus-cause takeaway in the meeting or debrief.
- [ ] Increase primary copy to about 18px and secondary/chart labels to at least 14px; keep RTL Arabic and LTR axis labels correct. Reduce explanatory density by moving extra reasoning into a disclosure.
- [ ] Review the cover, tutorial, puzzle, and result screens in the browser for readable hierarchy, touch targets, and animation that supports rather than competes with graph reading.

### Task 3: Move Glitch away from the answer and reserve the submit action

**Files:**
- Modify: `src/features/behind-the-dots/components/Mascot.tsx`
- Modify: `src/features/behind-the-dots/BehindTheDotsGame.tsx`
- Modify: `src/features/behind-the-dots/components/ScatterGuess.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- `ChaseTimer` keeps its `seconds`, `paused`, and `onTimeout` inputs, but renders an in-flow compact lane rather than a fixed viewport overlay.
- Puzzle passes `submitInDock` to `ScatterGuess` and renders one primary submit button in a fixed, keyboard-accessible bottom dock. Puzzle content reserves matching space for the dock.

- [ ] Render the case number and compact Glitch-to-Dotty progress lane together near the top of the puzzle, with the existing 15-second timing and timeout behavior.
- [ ] Render the submit button in a bottom dock for timed puzzles, hide the duplicate inline submit with `submitInDock`, and add responsive safe-area spacing to the scrollable content so the dock does not cover controls.
- [ ] Ensure submitting, pausing, and timing out each stop or settle the chase correctly; retain accessible labels and keyboard activation.
- [ ] Manually play a round at desktop and short mobile viewport sizes. Confirm the slider, hints, graph, and submit button remain usable while Glitch advances, and confirm the timeout reveal still occurs once.

### Task 4: Build and review the finished flow

**Files:**
- Modify only files listed in Tasks 1–3 as needed.

- [ ] Run `npm run build` and fix any build errors introduced by the changes.
- [ ] Walk through a fresh run, submit before the timer ends, allow a round to time out, pause/resume, refresh an active generated run, replay, and continue an existing seedless save.
- [ ] Check reduced-motion mode and a narrow mobile viewport, then confirm the app still presents all three cases, recommendation, and debrief.
- [ ] Review the final diff for unintended generated files or changes outside the two approved specs.
