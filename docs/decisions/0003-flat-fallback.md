# 0003: Flat fallback and compact view

- Status: Accepted
- Date: 2026-11-20
- Deciders: Jim Merioles
- Related: [Architecture](../architecture.md), [PRD](../product/prd.md)

## Context

HTML-in-Canvas is Chrome 157+ today. Safari and Firefox do not ship it. A portfolio demo that shows a blank canvas on those browsers fails the first impression and looks broken.

Small screens are also a poor fit for a spatial board. A 390px viewport cannot show ten cards at a readable scale without heavy panning.

## Decision

Use a flat document view when the API is unavailable or the viewport is small.

- Feature detect `drawElementImage` on `CanvasRenderingContext2D.prototype`.
- Use the flat view when unsupported.
- Use the compact flat view at or below 760px wide or 520px tall.
- Reuse the same card components and editable state.
- Keep only the canvas-specific controls out of the flat view.

## Consequences

### Positive

- No blank canvas, ever.
- The content and edits still work on every browser.
- The same design language carries into the fallback.
- The fallback test runs in jsdom in CI.

### Negative

- Two presentation paths to maintain.
- Present, Structure, and Export are unavailable in the flat view.
- The compact copy must explain why the canvas is missing.
- The flat view can drift from the canvas layout if the card design changes.

### Neutral

- The flat view uses the same card components, not a separate content source.
- The fallback is not a full canvas replacement. It is a graceful document view.

## Alternatives considered

- **Blank canvas with a browser note.** Rejected: hostile and looks broken.
- **html2canvas fallback.** Rejected: screenshots, accessibility loss, and another dependency.
- **Force the canvas on small screens.** Rejected: tiny text and heavy panning.
- **Desktop-only gate.** Rejected: mobile visitors still need the content.
