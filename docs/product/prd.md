# Product brief: Throughline

Status: v1 shipped 2026-11-20
Owner: Jim Merioles
Related: [architecture](../architecture.md), [roadmap](../roadmap.md)

## One-liner

A spatial narrative board that proves HTML-in-Canvas can make canvas UI feel like real UI.

## Problem

Canvas applications gain pixel control but lose the things that make the web usable: text layout, selection, copy and paste, form controls, translation, find-in-page, screen reader semantics, and browser autofill. Teams work around this with DOM overlays, screenshot libraries such as html2canvas, or hand-drawn text. Each workaround breaks somewhere.

HTML-in-Canvas changes that tradeoff. It lets the browser paint live DOM into a canvas while keeping hit testing and accessibility. Most public demos use it for filters and visual effects. Throughline uses it for a believable product: a board where the content is still real HTML.

## Audience

- Hiring managers and design engineers evaluating frontend craft.
- Product teams exploring spatial, canvas-heavy, or presentation interfaces.
- Browser platform teams who need a concrete accessibility story for the API.
- Developers who want a reference implementation they can read in one sitting.

## Job to be done

When a team has scattered launch thinking, they need to turn it into a story someone can review, edit, present, and approve. Throughline gives them a spatial board for that sequence.

## Product principles

1. **Real UI, not a screenshot.** Text, inputs, checkboxes, focus order, and screen reader names survive the canvas.
2. **The effect supports the content.** No shader, distortion, or filter is allowed to make the copy harder to read.
3. **One clear path.** Explore, then present, then decide. Every screen supports that path.
4. **Graceful by default.** A browser without the API still gets the content, not a blank canvas.
5. **Accessible by construction.** The accessible tree is the product, not an afterthought.

## The story

The demo content is a fictional neighborhood cinema reopening, The Lumen. The board covers the brief, audience, big idea, headline options, poster direction, voice, timeline, opening night checklist, risks, and the decision. The content is specific enough to show art direction and broad enough to be credible.

## v1 scope

### Must have

- Ten live HTML cards on an infinite, zoomable board.
- Pan, zoom, fit, select, drag by the card header, and inline editing.
- Headline editor with a selected lead.
- Opening night checklist with real checkboxes.
- Approval action with a visible stamp.
- Present mode with camera flights, arrow-key navigation, and a caption HUD.
- Structure view with card outlines, tab order, control counts, and focus management.
- PNG export of the board.
- localStorage persistence and reset.
- Flat fallback for browsers without HTML-in-Canvas.
- Compact flat view at or below 760px wide or 520px tall.
- Keyboard navigation and screen reader labels.
- CI, tests, and documentation.

### Out of scope for v1

- Accounts, a backend, or multi-user collaboration.
- Real-time presence or comments.
- File uploads or image management.
- AI generation or summarization.
- A general-purpose whiteboard or node editor.
- A custom CMS.
- Analytics by default. The demo is privacy-friendly.

## User stories and acceptance criteria

### Explore

As a visitor, I want to understand the board in five seconds and move around it without instruction.

- The board opens fitted to the viewport.
- The narrative spine and card hierarchy are visible at a glance.
- Background drag pans, wheel or pinch zooms around the pointer, and Fit returns to the whole board.
- The zoom controls work with the keyboard.
- No card is clipped when the board is fitted.

### Edit

As a producer, I want to change the board without leaving the canvas.

- Clicking into a headline focuses the real textarea and lets me type.
- The canvas repaints on every keystroke.
- Checking a task updates the card and persists after reload.
- Approving the direction changes the button state and shows the stamp.
- My edits and card positions survive a reload.
- Reset restores the original board and clears saved state.

### Present

As a presenter, I want to walk a room through the narrative.

- Present starts at the first card and dims the rest of the board.
- The camera flies to each card without losing text sharpness.
- Arrow keys move forward and back; Space moves forward; Escape exits.
- The focused card stays interactive, so I can edit a headline live.
- A caption shows the step, title, and one sentence of narration.
- The last step offers Finish.
- Screen readers and the keyboard only see the focused card and the HUD.

### Inspect

As an accessibility-minded engineer, I want to see the DOM behind the pixels.

- Structure outlines each card and labels it.
- The panel lists each card, its role, and its control count.
- Opening Structure moves focus into the panel.
- Clicking a row closes the panel, flies to the card, and focuses the card.
- Escape and the close button return focus to the Structure button.

### Recover

As a visitor on another browser, I want the content even if the API is missing.

- Unsupported browsers get the flat board, not a blank canvas.
- The flat board explains the requirement and keeps every edit working.
- Small screens get the compact flat board.
- No horizontal overflow at 390px.

### Export

As a producer, I want a shareable snapshot.

- Export produces a PNG of the current board at device resolution.
- The export excludes selection and structure overlays.
- The filename is stable and descriptive.

## Success signals

- A visitor reaches Present mode and advances at least three steps.
- A visitor edits a headline or checks a task.
- A visitor opens Structure at least once.
- No blank-canvas reports on unsupported browsers.
- Qualitative feedback mentions the text quality, the presentation, or the accessibility story.
- CI stays green on every change.

No analytics are included in v1. Measure through demos, conversations, and repository feedback.

## Risks and mitigations

| Risk                                | Mitigation                                                                                                                 |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| API changes between Chrome versions | Support both `content="drawable"` and `layoutsubtree`, feature detect the method, pin the browser matrix in the test plan. |
| The effect becomes the product      | Keep one accent, a quiet paper palette, and no distortion over body copy.                                                  |
| Accessibility regresses             | Real controls, `inert` in present mode, focus management, manual screen reader checks, and a fallback test in CI.          |
| Performance drops on large screens  | Viewport-aware render scale, paint-driven redraw, culling, no continuous animation loop.                                   |
| Chrome-only audience                | Flat fallback and compact view, with a clear explanation.                                                                  |
| localStorage surprises              | Versioned key, validation on load, Reset demo, no server state.                                                            |

## Launch checklist

- [x] Demo works in Chrome 157.
- [x] Demo works in Chromium 155 with the API flag.
- [x] Flat fallback works without the API.
- [x] Compact view works at 390px.
- [x] Present, Structure, edit, approve, persistence, reset, and export tested.
- [x] Build and lint pass.
- [x] Tests pass.
- [x] README and docs written.
- [ ] Deploy the public demo.
- [ ] Record the 60-second walkthrough.
- [ ] Publish the case study.
