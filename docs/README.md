# Documentation

Start with the document that matches the question.

## Product

- [Product brief](product/prd.md): problem, audience, scope, acceptance criteria, risks.
- [Roadmap](roadmap.md): what shipped, what is next, what is not planned.
- [Walkthrough script](demo-script.md): 60-second and 15-second shot lists, recording notes, and the recording checklist.

## Engineering

- [Architecture](architecture.md): runtime map, routing, rendering lifecycle, zoom strategy, accessibility, fallback, performance, debugging.
- [Design system](design-system.md): palette, type, card anatomy, chrome, motion, do and do not.
- [Manual test plan](qa/manual-test-plan.md): browser matrix, interaction checks, accessibility checks, release checklist.
- [Operations](operations.md): local development, deployment, rollback, incident playbooks, security, privacy.

## Decisions

- [ADR index](decisions/README.md)
- [0001: Use HTML-in-Canvas instead of html2canvas](decisions/0001-use-html-in-canvas.md)
- [0002: DOM-backed cards on a single 2D canvas](decisions/0002-dom-backed-cards.md)
- [0003: Flat fallback and compact view](decisions/0003-flat-fallback.md)
- [0004: Re-layout on zoom settle](decisions/0004-zoom-render-scale.md)
- [0005: Build a narrative board, not a general whiteboard](decisions/0005-narrative-board.md)

## Screenshots

- `preview.png`: the board in explore mode.
- `present.png`: presentation mode.
- `structure.png`: the DOM behind the pixels.
- `compact.png`: the compact flat view.
- `case-study.png`: the public case study page at 1440x900.
- `case-study-mobile.png`: the case study at 390x844 in a 2x capture.

## Agent instructions

- [AGENTS.md](../AGENTS.md): commands, repository map, conventions, guardrails, and definition of done for coding agents.
