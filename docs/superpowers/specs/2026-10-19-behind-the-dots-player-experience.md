# Behind the Dots Player Experience Design

## Goal

Make Behind the Dots welcoming and easy to play for a first-time player while keeping the case-file presentation, Dotty, and Glitch that give the game its identity.

## Audience and success

The player may have no statistics background and should understand what to do from a short instruction and the graph itself. They can read the whole prompt comfortably, move the guess control, and submit while Glitch is chasing. The guide should feel like a friendly teammate who stays with the player from the cover through the debrief.

## Character and tone

- Add an original illustrated guide named Rami: a warm, confident young analyst with a hoodie, a scatterplot badge, and a small notebook or marker. Use an inline SVG component so the character stays sharp at every size and can have a few lightweight expression or gesture animations.
- Keep Dotty as the friendly data-point companion and Glitch as the scrambled-data antagonist. The three characters have clear, consistent roles.
- Show Rami on the cover and beside short guidance, tutorial, hint, and result messages. Use a few purposeful animation states for greeting, pointing, thinking, and celebrating.
- Write in simple conversational Egyptian Arabic. Give one instruction or explanation at a time, describe patterns as “up,” “down,” or “scattered,” and avoid statistical terms before the player needs them.
- Keep the essential takeaway that two things moving together does not prove one caused the other, phrased simply in the meeting or debrief.

## Puzzle screen and controls

- Replace the viewport-fixed chase scene at the bottom with a compact, in-flow chase lane beside the case heading. Glitch remains visible and advances along a progress track toward Dotty; it never covers game controls.
- Keep the primary answer button in a reserved bottom action dock during timed puzzle rounds. Add matching bottom space to the scrollable game content so the dock does not cover the graph, slider, or hints. The button remains visible on short screens and reachable by keyboard.
- Stop the chase when the player submits, the timer expires, or the game is paused. Retain the current 15-second round and timeout scoring behavior.
- Keep the graph, guess slider, quick presets, and hint control. Increase reading and touch sizes; target 18px for main copy and 14px minimum for secondary labels and chart text.
- Keep tutorial rounds untimed. Teach one pattern at a time with a short prompt and a visual example. Offer the option to skip the tutorial on later runs.
- Keep result screens compact: show the guess, actual relationship, score, and one plain-language explanation. Place extra reasoning behind an optional disclosure rather than a paragraph in the main flow.

## Motion and accessibility

- Use short, friendly motion for character reactions, entering a new case, and Glitch's chase. Keep dots stationary while the player is forming a guess.
- Preserve the existing reduced-motion support. Ensure the timer and controls remain usable without relying on animation or color alone.
- Respect the current right-to-left Arabic layout and keep English axis labels readable left-to-right.

## Scope

This design changes the Behind the Dots presentation and copy. It does not change the case sequence, scoring thresholds, target lessons, or the analyst's final recommendation.
