# 0001: Use HTML-in-Canvas instead of html2canvas

- Status: Accepted
- Date: 2026-11-20
- Deciders: Jim Merioles
- Related: [Architecture](../architecture.md), [PRD](../product/prd.md)

## Context

The product needs rich text, inputs, checkboxes, selection, copy and paste, translation, find-in-page, and screen reader semantics inside a canvas. Screenshot libraries such as html2canvas render a snapshot. The snapshot loses interaction and accessibility, can be slow, and is brittle with fonts, shadows, and complex CSS.

The HTML-in-Canvas API lets the browser paint live DOM into a 2D, WebGL, or WebGPU context. The drawn content stays in the DOM, so hit testing and accessibility survive.

## Decision

Use HTML-in-Canvas as the primary rendering path, with runtime feature detection and a flat fallback.

- Canvas opt-in: `content="drawable"` plus the legacy `layoutsubtree` attribute.
- Drawable cards: direct children with the `drawable` attribute.
- Draw: `ctx.drawElementImage(card, x, y, width, height)`.
- Redraw: the canvas `paint` event.

## Consequences

### Positive

- Text stays real text. It wraps, selects, copies, translates, and reads correctly.
- Inputs, radios, checkboxes, and buttons keep native behavior.
- The browser keeps 2D hit testing in sync with the drawn position.
- The demo can make a credible accessibility argument.

### Negative

- The API is Chrome 157+ today. A fallback is mandatory.
- Drawn elements must be direct children of the canvas.
- CSS transforms on a drawn element are ignored for drawing.
- The API is young and may change. Feature detection and browser testing are required.

### Neutral

- The demo is a 2D board. WebGL and WebGPU would need explicit geometry updates.

## Alternatives considered

- **html2canvas.** Rejected: screenshots, accessibility loss, font and CSS fidelity risk.
- **Manual `fillText`.** Rejected: no wrapping, no selection, no rich text, no accessibility.
- **DOM overlay on a canvas background.** Rejected: the overlay drifts from the canvas camera and cannot be exported as one surface without another screenshot.
- **Iframe or same-origin page capture.** Rejected: no support for arbitrary cross-origin content, brittle, and still a screenshot.
- **WebGL text libraries.** Rejected: text quality, internationalization, selection, and accessibility are all worse.
