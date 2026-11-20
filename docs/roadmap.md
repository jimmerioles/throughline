# Roadmap

## Vision

Make Throughline the reference demo for HTML-in-Canvas as a product surface, not a visual effect. The board should be understandable in five seconds, usable in five minutes, and worth writing about.

## Now: v1

Shipped 2026-11-20.

- Ten live HTML cards in a 2D canvas.
- Explore, edit, present, inspect, and export.
- Persistence and reset.
- Flat fallback and compact view.
- CI, tests, and documentation.

## Case study

Shipped 2026-11-20. The page is deployed at [jimmerioles.github.io/throughline/#/case-study](https://jimmerioles.github.io/throughline/#/case-study). The recording is the remaining release task.

- A public case study at `#/case-study` with the problem, an html2canvas comparison, the architecture, performance notes, accessibility notes, limitations, and next steps.
- Hash routing for the board and the case study, with no router dependency.
- A 60-second walkthrough script with a 15-second cut and recording notes in [demo-script.md](demo-script.md).
- A poster that points to the shot list and states that the recording is pending.
- A route test and optimized screenshots for the page.
- README, CHANGELOG, architecture, and QA documentation updated.

Acceptance criteria:

- [x] A visitor can understand the HTML-in-Canvas value without opening DevTools.
- [ ] The page includes a 60-second video or a looping capture. The script is ready; the recording is pending.
- [x] The page includes a before/after against html2canvas for text quality, selection, and accessibility.
- [x] The page includes real numbers: card count, paint behavior, zoom behavior, present transition.
- [x] The page is linked from the demo and the README.

## Next

1. **Record the walkthrough.** Follow [demo-script.md](demo-script.md), capture at 1440x900 in Chrome 157, and replace the poster with the video.
2. **Publish a frame trace.** Measure paint counts and frame pacing on a mid-range laptop, then replace the design budgets with measured numbers where possible.
3. **Add a live comparison route.** Keep the editorial table and add a runnable html2canvas side-by-side for visitors who want the details.

## Later

- A 2x and 4x export path using `captureElementImage()` and `OffscreenCanvas`.
- A new-card flow with a small card type system.
- A WebGL version of the same board for depth, blur, and transitions.
- A second story to prove the board is a product, not a one-off skin.
- A worker-based export with progress.
- A reduced test harness for the canvas path using Chrome DevTools Protocol.

## Not planned

- Accounts, billing, or a backend.
- Real-time collaboration or presence.
- AI generation.
- A general-purpose whiteboard, node editor, or design tool.
- A native app wrapper.

## Decision gates

Add a feature only if it does at least one of these:

- Makes the HTML-in-Canvas argument sharper.
- Improves the path from explore to present to approve.
- Removes a real failure mode for a visitor.
- Produces a reusable artifact, such as a comparison page or a test harness.

If a feature is only more surface area, it waits.
