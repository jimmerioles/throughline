# 0004: Re-layout on zoom settle

- Status: Accepted
- Date: 2026-11-20
- Deciders: Jim Merioles
- Related: [Architecture](../architecture.md), [Design system](../design-system.md)

## Context

HTML drawn into a canvas is a snapshot. If the camera scales the snapshot far beyond its layout size, text softens. If the DOM re-lays out on every zoom event, the main thread can jank. If the snapshot is fixed at a large supersample, memory grows.

The demo has ten cards. The goal is crisp text at 0.66x and 2.4x without a continuous layout loop.

## Decision

Keep a `renderScale` state separate from the camera.

- The camera updates immediately on every zoom event.
- The snapshot scales with the camera during the gesture.
- `renderScale` updates at most every 150ms during the gesture.
- A trailing 170ms timeout sets `renderScale` to the final zoom.
- The card is laid out at the new size and drawn at 1:1 after the gesture.
- Presentation uses a viewport-aware scale so the largest card's DOM box fits the canvas.
- Fit animations use the larger of the current and target zoom.

## Consequences

### Positive

- Text is crisp after the gesture without re-layout on every event.
- Panning has no layout cost.
- Presentation can zoom further without clipping the snapshot.
- The demo stays within a reasonable memory budget.

### Negative

- Text is soft for a few frames during a fast zoom.
- The render scale can differ from the camera zoom, which is a debugging trap.
- At 100 or more cards, re-layout on settle would need to become level-of-detail.

### Neutral

- The strategy is specific to a small board. It is documented so it can be replaced deliberately.

## Alternatives considered

- **Scale only, no re-layout.** Rejected: text softens badly at 2x and above.
- **Re-layout on every zoom event.** Rejected: unnecessary main-thread work and jank risk.
- **Fixed 4x supersample.** Rejected: memory and layout cost on every card.
- **WebGL texture with mipmaps.** Rejected: not needed for a 2D board, and it loses automatic 2D hit testing.
