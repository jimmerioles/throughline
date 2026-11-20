# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- A public case study at `#/case-study` with the problem, an html2canvas comparison, the architecture, performance budgets, accessibility notes, limitations, and next steps.
- Hash routing for the board and the case study, with no router dependency.
- A "Case study" link in the demo top bar and "Back to the board" links on the case study.
- A route test that covers the case study hash, the forward link, and the return to the board.
- A 60-second walkthrough script and a 15-second cut in `docs/demo-script.md`, with recording notes.
- A case study poster that links to the shot list and marks the video as recording pending.
- A case study screenshot in `docs/case-study.png`.

### Changed

- The README, roadmap, architecture, and manual test plan now cover the case study route and the walkthrough.
- The case study page uses optimized WebP copies of the screenshots in `docs/`.

### Fixed

- Camera flights now collapse under `prefers-reduced-motion` instead of always running for the full 720 ms or 760 ms.

### Notes

- The demo is live at <https://jimmerioles.github.io/throughline/>. The canvas path was verified in Chrome 157 and the flat fallback in Firefox 158 on 2026-11-20.
- The walkthrough video is not recorded yet. The script is the deliverable; the page does not fake a video.
- The public deployment is still pending.

## [1.0.0] - 2026-11-20

### Added

- Throughline, a spatial narrative board for The Lumen cinema campaign.
- Ten live HTML cards painted into a 2D canvas with `drawElementImage()`.
- Pan, zoom, fit, card selection, header drag, and inline headline editing.
- Opening night checklist with real checkboxes.
- Approval action with a stamp.
- Present mode with camera flights, arrow-key navigation, and a caption HUD.
- Structure view with card outlines, tab order, control counts, and focus management.
- PNG export.
- localStorage persistence and reset.
- Flat fallback for browsers without HTML-in-Canvas.
- Compact flat view at or below 760px wide or 520px tall.
- Keyboard navigation, screen reader labels, `inert` present mode, and reduced motion support.
- Unit tests for camera math, board data, storage, and the flat fallback interaction.
- CI with format check, lint, typecheck, tests, and build.
- GitHub Pages deployment workflow.
- Dependabot for npm and GitHub Actions.
- Product brief, architecture, design system, manual test plan, operations guide, roadmap, and ADRs.
- Agent instructions in `AGENTS.md`.
- Repository tooling: Prettier, Oxlint, Husky, lint-staged, commitlint, EditorConfig, and VS Code recommendations.
