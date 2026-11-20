# 0002: DOM-backed cards on a single 2D canvas

- Status: Accepted
- Date: 2026-11-20
- Deciders: Jim Merioles
- Related: [Architecture](../architecture.md)

## Context

The board needs a camera, cards, connectors, selection, presentation, and export. It also needs the cards to remain real DOM for HTML-in-Canvas.

A generic scene graph would add abstraction before the product proves the interaction. A DOM overlay would make the canvas camera and the DOM camera drift. A separate canvas per card would multiply contexts and complicate export.

## Decision

Use one full-screen 2D canvas. Render the cards as direct children, laid out at the canvas origin and sized at the current render scale. Keep a map of card IDs to DOM elements. Draw each card at its screen rect with `drawElementImage()`.

The camera lives in a ref. React owns product state. The canvas owns the paint loop and pointer interaction.

## Consequences

### Positive

- One canvas, one paint event, one export surface.
- The cards keep native DOM behavior and accessibility.
- Hit testing and focus are handled by the browser in 2D.
- The architecture is small enough to read in one sitting.

### Negative

- The direct-child requirement constrains the component tree.
- The card DOM layout position is not the visual position. Debugging requires understanding the geometry sync.
- A future WebGL or WebGPU path would need `updateElementGeometry()` and more math.
- Large card counts would need culling, caching, and virtualization.

### Neutral

- Connectors, grid, grain, headings, selection, and overlays are canvas drawing, not DOM.
- The top bar, HUD, and structure panel stay outside the canvas.

## Alternatives considered

- **A DOM overlay with CSS transforms.** Rejected: the overlay and canvas drift, and export becomes a second screenshot.
- **One canvas per card.** Rejected: more contexts, more paint coordination, harder export.
- **WebGL textures from the start.** Rejected: the first version does not need 3D, and 2D gives automatic hit testing.
- **A retained-mode scene graph library.** Rejected: unnecessary abstraction for ten cards.
