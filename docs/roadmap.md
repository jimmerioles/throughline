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

## Next

The next milestone is the public case study. It has two deliverables:

1. A case study page on the same site with the problem, the approach, the architecture, performance notes, accessibility notes, limitations, and a short walkthrough video.
2. A 60-second walkthrough script that a presenter or a recording can follow without narration improvisation.

Why this is next: the demo exists, but a hiring manager or product lead needs the argument in one scroll. The case study turns the demo into a portfolio piece.

Acceptance criteria:

- A visitor can understand the HTML-in-Canvas value without opening DevTools.
- The page includes a 60-second video or a looping capture.
- The page includes a before/after against html2canvas for text quality and accessibility.
- The page includes real numbers: card count, paint behavior, zoom behavior, present transition.
- The page is linked from the demo and the README.

## Later

- A small before/after comparison route against html2canvas with text quality, selection, accessibility, and timing.
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
