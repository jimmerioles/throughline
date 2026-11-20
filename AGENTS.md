# AGENTS.md

Throughline is a static React and TypeScript demo of HTML-in-Canvas. The canvas path targets Chrome 157+. Every unsupported browser gets a flat fallback. Read this before changing code.

## Commands

```bash
npm run dev        # local Vite server
npm run check      # format, lint, typecheck, tests, build
npm run test:run   # Vitest once
npm run build      # production build to dist/
npm run format     # Prettier
```

Use npm. The package manager and Node version are pinned in `package.json`, `.npmrc`, and `.nvmrc`.

## Context pointers

Read the smallest document that matches the task.

| If the task is about                                        | Read                                                       |
| ----------------------------------------------------------- | ---------------------------------------------------------- |
| Product intent, scope, acceptance criteria, success signals | [docs/product/prd.md](docs/product/prd.md)                 |
| Rendering, camera, zoom, accessibility, fallback, debugging | [docs/architecture.md](docs/architecture.md)               |
| Palette, type, card anatomy, chrome, motion                 | [docs/design-system.md](docs/design-system.md)             |
| Browser matrix, manual canvas checks, release checks        | [docs/qa/manual-test-plan.md](docs/qa/manual-test-plan.md) |
| Deployment, rollback, browser support, security             | [docs/operations.md](docs/operations.md)                   |
| Case study page, routing, walkthrough script                | [docs/demo-script.md](docs/demo-script.md)                 |
| Why a technical or product choice exists                    | [docs/decisions](docs/decisions/README.md)                 |
| What to build next                                          | [docs/roadmap.md](docs/roadmap.md)                         |

If the canvas is blank, clicks land in the wrong place, or text looks soft, read the Debugging section of the architecture doc before editing.

## How the canvas path works

- `App.tsx` renders `<canvas content="drawable" layoutsubtree>` with the cards as direct children.
- Each card is an `<article drawable>` rendered by `Card.tsx`.
- `BoardCanvas.tsx` owns the camera ref, the `paint` listener, pointer input, and `requestPaint()`.
- `renderer.ts` draws the background, connectors, cards via `drawElementImage()`, present scrim, structure overlay, and selection.
- The browser keeps 2D hit testing and accessibility geometry in sync with the drawn rect. Do not pipe a returned transform.
- `renderScale` is separate from camera zoom. The snapshot scales during a gesture; the card re-lays out after the settle. Presentation chooses a viewport-aware scale so the largest card fits the canvas.

## Invariants

- Keep the cards as direct children of the canvas. A wrapper breaks the API.
- Keep `drawable` on every drawn card, and keep both `content="drawable"` and `layoutsubtree` on the canvas.
- Position cards with layout and the canvas draw call, not CSS transforms. Transforms on a drawable element are ignored for drawing.
- Design cards in `em`. Scaling the card font size must scale the whole card.
- Keep the camera in a ref and product state in React.
- Mark non-focused cards `inert` in present mode and all cards `inert` in structure mode.
- Keep the flat view working. It is the contract for Safari, Firefox, small screens, and old Chromium.
- Keep the top bar, present HUD, structure panel, and bottom controls outside the canvas.
- Keep text selectable and controls native. The accessibility story is the product.

## Editing map

| Area                                                 | Files                                               |
| ---------------------------------------------------- | --------------------------------------------------- |
| Board copy, positions, connectors, present narration | `src/board/data.ts`                                 |
| Card markup and interactive controls                 | `src/board/Card.tsx`                                |
| Card and canvas CSS                                  | `src/board/board.css`, `src/App.css`                |
| Canvas painting and overlays                         | `src/board/renderer.ts`                             |
| Camera math                                          | `src/board/camera.ts`                               |
| Pointer input, paint loop, render scale              | `src/board/BoardCanvas.tsx`                         |
| App state, modes, keyboard, export, fallback         | `src/App.tsx`                                       |
| Hash routing and the case study                      | `src/Root.tsx`, `src/routing.ts`, `src/case-study/` |
| Design tokens and base styles                        | `src/index.css`                                     |
| Tests                                                | `src/**/*.test.ts`, `src/**/*.test.tsx`             |

All visible copy for The Lumen lives in `src/board/data.ts`. Change it there, not inside the renderer.

## Definition of done

1. `npm run check` passes.
2. The flat fallback still works. Add or update a test when you change it.
3. The canvas path is checked in Chrome 157+ or Chromium 147 to 156 with `chrome://flags/#canvas-draw-element`.
4. The change is keyboard reachable and keeps focus management intact.
5. The build output works from a subpath. `vite.config.ts` uses `base: './'`.
6. A product change updates the PRD. A technical choice updates the architecture doc or an ADR.
7. Screenshots in `docs/` are refreshed when the UI changes.

If you cannot run the canvas path, say so, and list what a human should verify.

## Testing the two paths

**Canvas path**

```bash
npm run dev
```

Open Chrome 157+. For an older Chromium or Brave, enable `chrome://flags/#canvas-draw-element` and relaunch. The app sets both canvas attribute spellings.

**Fallback path**

Open Safari or Firefox, or launch Chromium without the feature flag. The app detects `drawElementImage` at runtime and renders the flat document.

**Compact path**

Use a 390x844 viewport. The app switches to the flat view at or below 760px wide or 520px tall.

**Automated**

```bash
npm run test:run
```

Vitest runs camera math, board data integrity, storage, and the flat fallback interaction. jsdom cannot run the canvas path, so that path is manual.

## Commit and PR workflow

- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- Keep one concern per commit.
- Run `npm run check` before committing.
- The pre-commit hook runs Oxlint and Prettier on staged files.
- The commit-msg hook enforces conventional commits.
- Use `.github/PULL_REQUEST_TEMPLATE.md` for the test plan and agent disclosure.

## Boundaries

- No backend, accounts, real-time collaboration, AI generation, or general-purpose whiteboard. See the roadmap.
- No analytics without a PRD update.
- No new UI, state, or canvas library without an ADR.
- No secrets, tokens, or private URLs in the repo.
