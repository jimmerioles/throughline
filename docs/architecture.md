# Architecture

Throughline is a static single-page application. There is no backend, no account system, and no network data. The browser is the runtime.

## Context

The demo uses the HTML-in-Canvas API in Chrome 157 and later. The API lets a canvas paint live DOM subtrees with `drawElementImage()` while the browser keeps hit testing and accessibility in sync with the drawn position.

The product needs three things at once:

1. A spatial camera over a board of cards.
2. Text, inputs, checkboxes, and buttons that behave like real UI.
3. A fallback when the API is unavailable.

The architecture optimizes for those three requirements, not for a general scene graph.

## Runtime map

```
src/
  main.tsx                 React entry, font imports, global CSS, root render
  Root.tsx                 hash route switch between the board and the case study
  routing.ts               hash parsing and the route hook
  App.tsx                  app shell, modes, keyboard, persistence, export
  board/
    BoardCanvas.tsx        canvas element, camera, paint loop, pointer input
    Card.tsx               the real HTML cards
    renderer.ts            background, connectors, cards, overlays
    camera.ts              fit, present, zoom, and animation math
    data.ts                The Lumen content and board layout
    storage.ts             localStorage schema and IO
    types.ts               shared types
  case-study/
    CaseStudy.tsx          the public case study page
    case-study.css         editorial layout for the case study
    images/                optimized WebP copies of the docs screenshots
  index.css                design tokens and base styles
  App.css                  app chrome, HUD, panel, flat view
  board/board.css          card typography and content
```

`Root.tsx` chooses between the board and the case study. `App.tsx` owns product state: cards, editable content, selection, mode, presentation step, structure visibility, zoom label, and fallback selection. `BoardCanvas.tsx` owns the camera and the render loop. `Card.tsx` is the only place that knows what each card looks like.

## Routing and the case study

The site has two hash routes and no router dependency.

| Hash           | View                           |
| -------------- | ------------------------------ |
| empty or `#/`  | The Lumen board                |
| `#/case-study` | The public case study          |
| anything else  | The board, as the safe default |

Hash routing was chosen because the build uses `base: './'` and deploys to GitHub Pages. The route never touches the path, so the same build works at a domain root, a repository subpath, or a local preview. There is no server rewrite to configure.

`Root` updates `document.title` and renders the matching view. Entering the case study moves focus to its `main` landmark. The case study is normal DOM: it does not call the canvas API and it does not import the board. It shares the tokens and fonts only.

Returning to the board mounts `App` again. That is deliberate: `App` loads the saved board from localStorage, and `BoardCanvas` fits the camera on mount. The route change is infrequent, so a fresh board is more predictable than preserving a camera that was left behind.

The case study uses optimized WebP copies of the screenshots in `docs/`. The PNG originals stay in `docs/` for the README and documentation.

## Rendering lifecycle

1. React renders `<canvas content="drawable" layoutsubtree>` with the cards as direct children.
2. A `ResizeObserver` sizes the canvas backing store to `clientWidth * devicePixelRatio` and records the CSS viewport.
3. The camera lives in a ref. Pan, zoom, fit, and presentation update it and call `canvas.requestPaint()`.
4. The canvas `paint` event calls `renderBoard()`.
5. `renderBoard()` clears the canvas and draws:
   - the paper gradient, grain, and dot grid;
   - the board heading and footer;
   - connectors;
   - each visible card with `ctx.drawElementImage(card, x, y, width, height)`;
   - the present scrim and the focused card, or the structure overlay;
   - the selection outline.
6. When a card's DOM changes, the browser fires `paint` automatically. When only the camera, selection, or mode changes, the component calls `requestPaint()`.

The canvas keeps a map of card IDs to DOM elements. It is built with `querySelectorAll('[data-card-id]')` after each cards render.

## Why the cards sit at the canvas origin

The API requires the drawn element to be a direct child of the canvas and to have the `drawable` attribute. The card DOM boxes are laid out at the origin and sized at the current render scale. The canvas draws each card at its screen position.

This has three benefits:

- The elements are always direct children with generated boxes.
- The browser syncs hit testing to the drawn rect, so clicks, selection, and focus land in the right place.
- The camera can move without changing the card's content or DOM order.

The tradeoff is that a card's DOM layout position is not its visual position. The API handles the mapping in 2D. Any future WebGL or WebGPU path would need `canvas.updateElementGeometry()` instead.

## Render scale

Text quality is the main visual risk. The board uses a deliberate scale strategy.

### Explore mode

The cards' font size and box size are based on a `renderScale` state. On a wheel or pinch zoom:

- The camera updates immediately on every event.
- The snapshot is scaled by the canvas transform while the gesture is active.
- `renderScale` is updated at most every 150ms during the gesture.
- A trailing timeout sets `renderScale` to the final camera zoom after 170ms.

The card is laid out at the new size and drawn at 1:1 once the gesture settles. The user sees a brief soft frame during fast zoom, then crisp text.

### Present mode

Presentation zooms further than explore. The scale must be large enough that the largest card's DOM box still fits the canvas, otherwise the browser can clip the snapshot at the canvas edge.

`showCard()` computes:

```
scale = clamp(
  min((viewport.width - 32) / maxCardWidth,
      (viewport.height - 32) / maxCardHeight),
  1.4,
  3.2
)
```

The cards are laid out at that scale, while the camera target uses the presentation framing. The snapshot is downscaled during the flight, so the visible card stays crisp and no card's layout box exceeds the canvas.

### Fit animations

Fit uses the larger of the current zoom and the target zoom as the render scale, so the snapshot is downscaled while flying out, not upscaled.

## Interaction model

| Action    | Implementation                                                                                       |
| --------- | ---------------------------------------------------------------------------------------------------- |
| Pan       | Pointer down on the canvas background, pointer capture, camera translation.                          |
| Zoom      | Non-passive wheel listener, zoom around the pointer, clamp 0.3 to 2.8.                               |
| Select    | Card pointer down selects the card. The canvas draws a dashed accent outline.                        |
| Drag      | Pointer down on the card header, pointer capture, world delta divided by zoom, commit on pointer up. |
| Edit      | Native textarea, radios, checkboxes, and buttons inside the card.                                    |
| Present   | `showCard()` animates the camera with `requestAnimationFrame`, cubic easing, and a 760ms duration.   |
| Structure | Toggle overlay; cards become inert; panel takes focus.                                               |
| Export    | Clear overlays, wait for the next `paint`, then `canvas.toBlob()`.                                   |

Present mode disables pan, zoom, and card dragging. The focused card remains interactive. Non-focused cards are `inert` and have `pointer-events: none`.

Structure mode makes every card inert. The panel is the interface until it closes.

## Accessibility

The cards are the accessibility tree. There is no parallel semantic model.

- Each card is a `role="group"` with an accessible name from its kicker and title.
- Card titles are `h2` elements under a visually hidden page `h1`.
- Controls are native: radios, textareas, checkboxes, buttons.
- Focus order follows the narrative order.
- `inert` removes non-focused cards in presentation mode.
- The Structure view lists the real cards and their control counts.
- Opening Structure focuses the close button. Closing it returns focus to the Structure button.
- Choosing a card in Structure flies to it and focuses the card.
- The canvas draws focus rings, carets, and selection through the browser's HTML-in-Canvas integration.
- `prefers-reduced-motion` collapses camera flights to a 1 ms transition and shortens CSS transitions. The camera still lands on the target.

The Structure view is a semantic map, not a live browser accessibility tree inspector. The cards themselves are the live tree.

## Persistence

`localStorage` holds one versioned key:

```
throughline:board:v1
```

The payload contains only card positions and editable state:

```json
{
  "version": 1,
  "positions": {
    "brief": { "x": 40, "y": 140 }
  },
  "editable": {
    "headlines": ["...", "...", "..."],
    "headlineChoice": 0,
    "checklist": [true, true, false, true, false],
    "approved": false
  }
}
```

Load validates the version and shape. Invalid data is ignored. Reset clears the key and restores the defaults.

The camera is intentionally not persisted. The demo always opens fitted, which keeps the first impression consistent.

## Fallback

`supportsHtmlInCanvas()` checks for `drawElementImage` on `CanvasRenderingContext2D.prototype`.

The flat view is used when:

- the API is unavailable; or
- the viewport is at or below 760px wide; or
- the viewport is at or below 520px tall.

The flat view renders the same card components in a responsive flex layout with a paper background. Editing, checklist, and approval still work. Present, Structure, and Export are hidden because they depend on the canvas.

The compact copy changes depending on why the flat view is active: unsupported browser or small viewport.

## Performance

v1 renders 10 cards.

- Redraw happens on `paint`, camera changes, selection, mode changes, and render scale changes.
- Cards outside the viewport are culled.
- The grain texture is generated once and cached as a `CanvasPattern`.
- Pan does not re-layout cards.
- Camera animation is the only continuous `requestAnimationFrame` loop.
- The CSS hover transition triggers a small number of paint events, not a loop.

Targets:

- 60fps pan and zoom on a 2020 laptop.
- No long tasks above 50ms during normal use.
- Present transitions complete in under one second.
- No blank first paint on a normal connection.

At 100 or more cards, the next steps are level-of-detail snapshots, offscreen caching, DOM virtualization, and worker export with `captureElementImage()` and `OffscreenCanvas`.

## Testing

- Vitest covers camera math, board data integrity, storage round-trips, the flat fallback interaction, and the hash route between the board and the case study.
- Testing Library runs the fallback path in jsdom. The canvas path is tested manually because jsdom does not implement HTML-in-Canvas.
- The manual test plan covers the canvas path in Chrome 157+, older Chromium with the flag, unsupported browsers, compact viewports, keyboard, screen reader spot checks, and the case study route.
- CI runs format check, lint, typecheck, tests, and build.

## Deployment

The app builds to static files in `dist`. `vite.config.ts` sets `base: './'`, so the build works at a domain root or a repository subpath.

The case study uses hash routes, so it needs no server rewrite on GitHub Pages or other static hosts.

The included GitHub Actions workflow deploys to GitHub Pages on pushes to `main`. Any static host works with the same build output.

## Constraints and known limits

- HTML-in-Canvas is Chrome 157+ today. Safari and Firefox do not ship it.
- Drawn elements must be direct children of the canvas and carry `drawable`.
- CSS transforms on a drawn element are ignored for drawing.
- 2D contexts sync hit testing automatically. WebGL and WebGPU need explicit geometry updates.
- A curved 3D surface and text selection do not map cleanly, so the demo stays 2D.
- The exported PNG is the current board view, not a separate print layout.
- The board is desktop-first. Touch pan works, but pinch zoom is not implemented.

## Debugging

**Blank canvas**

1. Confirm the browser supports `drawElementImage`.
2. Confirm the canvas has `content="drawable"` and older builds have `layoutsubtree`.
3. Confirm every card has `drawable` and is a direct child.
4. Confirm the canvas has received `requestPaint()` and the `paint` listener is attached.
5. Open the console. Missing cards usually mean the elements are not direct children or the paint handler threw.

**Clicks land in the wrong place**

1. Confirm the draw call and the DOM layout use the same CSS coordinate system.
2. Confirm the render scale matches the intended draw scale after the gesture settles.
3. In WebGL or WebGPU, confirm `updateElementGeometry()` runs after camera changes.

**Text looks soft**

1. Check whether the render scale is lagging the camera zoom.
2. Let the zoom settle for 200ms.
3. For presentation, confirm the scale fits the largest card's DOM box.
