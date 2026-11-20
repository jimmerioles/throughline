# 0005: Build a narrative board, not a general whiteboard

- Status: Accepted
- Date: 2026-11-20
- Deciders: Jim Merioles
- Related: [PRD](../product/prd.md), [Roadmap](../roadmap.md)

## Context

Most HTML-in-Canvas demos are visual effects: CRT filters, distortion, liquid text, or 3D cards. They show the API but not why a product team would adopt it. A generic whiteboard is a crowded category and invites comparison with Figma, Miro, and tldraw, where a demo cannot win.

The stronger story is a focused product with a real job, where the canvas adds spatial narrative and the DOM adds trustworthy UI.

## Decision

Build Throughline as a spatial narrative board with a presentation mode and an approval step. Do not build a general-purpose whiteboard, node editor, or design tool.

The demo story is The Lumen, a fictional neighborhood cinema reopening campaign.

## Consequences

### Positive

- One clear verb: shape a story.
- The demo content can show art direction and product taste.
- Present mode creates a memorable portfolio moment.
- The scope stays small enough to finish and explain.

### Negative

- The product is narrower than a whiteboard.
- The sample story is opinionated and must be replaced for another use case.
- The board does not support arbitrary content types or collaboration.

### Neutral

- The card system can grow later if the story needs it.
- The board is still spatial enough to demonstrate the API.

## Alternatives considered

- **CRT or shader filter demo.** Rejected: crowded, and the effect can overshadow the text argument.
- **Generic whiteboard.** Rejected: crowded category, broad scope, weak narrative.
- **Chart library with HTML labels.** Rejected for v1: useful but less distinctive, and less visual.
- **Accessible canvas game.** Rejected for v1: strong talk material, but a larger content and game-design effort.
