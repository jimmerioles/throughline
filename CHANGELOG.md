# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The project follows [Semantic Versioning](https://semver.org/).

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
