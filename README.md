<div align="center">

https://github.com/user-attachments/assets/4aae4e5c-f9ca-4218-81da-2fea569c7219

[![Tests](https://github.com/jimmerioles/throughline/actions/workflows/test.yml/badge.svg)](https://github.com/jimmerioles/throughline/actions/workflows/test.yml) [![Deploy to GitHub Pages](https://github.com/jimmerioles/throughline/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/jimmerioles/throughline/actions/workflows/deploy-pages.yml)

**Live demo:** https://jimmerioles.github.io/throughline/

**Case study:** https://jimmerioles.github.io/throughline/#/case-study

</div>

# Throughline

**A spatial narrative board for shaping a launch story. Built with HTML-in-Canvas, React, TypeScript, and Vite.**

Throughline is a working product demo for HTML-in-Canvas. Ten real HTML cards tell the launch story for The Lumen, a fictional neighborhood cinema, on a board you can pan, zoom, edit, present, and export. The cards are painted into a canvas, but their text, controls, focus order, and screen reader names stay native.

It is built for design engineers and product teams evaluating spatial interfaces, and for anyone who wants a concrete accessibility story for the API. The [case study](https://jimmerioles.github.io/throughline/#/case-study) goes deeper on the problem, the API, and the tradeoffs.

## What you can do

- Pan, zoom, fit, select, and drag ten live HTML cards on an infinite board.
- Click into a headline and type. The canvas repaints on every keystroke.
- Use real radios, checkboxes, textareas, and buttons with native keyboard support.
- Present the narrative with camera flights, arrow-key navigation, and a caption HUD.
- Open Structure to see the real DOM, tab order, and control counts behind the pixels.
- Export the current board as a PNG.
- Persist edits and card positions in localStorage, then reset to the original board.
- Get a flat, fully editable fallback in Safari, Firefox, and small viewports.

## Run it

```bash
npm ci
npm run dev        # local dev server
npm run build      # production build
npm run test:run   # tests once
npm run preview    # serve the build
npm run check      # format, lint, typecheck, tests, build
```

Open the local URL in Chrome 157 or later. For Chromium 147 to 156 or Brave, enable `chrome://flags/#canvas-draw-element` and relaunch.

## Use it

- Drag the background to pan. Scroll to zoom. Press `F` or click Fit to return.
- Click a card to select it; drag the card header to move it.
- Click a headline to edit it. Check opening night tasks, choose a lead headline, and approve the direction.
- Press `P` or click Present. Use ArrowLeft and ArrowRight to move, Space to advance, and Escape to exit.
- Press `S` or click Structure to inspect the DOM. Press `E` or click Export for a PNG.
- Click Reset demo to clear saved state.

## How it works

The canvas contains the cards as direct children, each marked `drawable`. A paint listener redraws the board, and `drawElementImage()` paints each live card at its screen position. The browser keeps hit testing and accessibility geometry in sync with the drawn rect, so selection, carets, focus rings, and inputs keep working. Read [docs/architecture.md](docs/architecture.md) for the camera, render scale, fallback, and performance details.

## Limits

- HTML-in-Canvas is Chrome 157+ today. Safari and Firefox get the flat fallback.
- The board is desktop-first. Touch pan works, but pinch zoom is not implemented.
- CSS transforms on drawable elements are ignored for drawing; the board moves the camera instead.
- The exported PNG is the current board view, not a print layout.
- Structure is a semantic map, not a live accessibility tree inspector.

## Tests

`npm run test:run` covers camera math, board data, storage, routing, and the flat fallback, including persistence, reset, and compact view. The canvas path is manual; see the [manual test plan](docs/qa/manual-test-plan.md).

## Docs

[Product brief](docs/product/prd.md) · [Architecture](docs/architecture.md) · [Manual test plan](docs/qa/manual-test-plan.md) · [Roadmap](docs/roadmap.md)

## Credits

Film, product, and code by [Jim Merioles](https://github.com/jimmerioles). Type set in Fraunces, Instrument Sans, and DM Mono via Fontsource. [MIT](LICENSE) © 2026 Jim Merioles.
