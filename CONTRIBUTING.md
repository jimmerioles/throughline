# Contributing

Throughline is a focused demo, not a general whiteboard. Contributions should make the HTML-in-Canvas argument sharper, improve the explore to present to approve path, remove a real failure mode, or produce a reusable artifact.

## Setup

Requirements:

- Node 20.19 or later. Node 24 LTS is pinned in `.nvmrc`.
- npm 11 or later.
- Chrome 157+ for the canvas path.

```bash
npm ci
npm run dev
```

For older Chromium or Brave, enable `chrome://flags/#canvas-draw-element` and relaunch.

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build
npm run preview      # preview the build
npm run check        # format, lint, typecheck, tests, build
npm run typecheck
npm run lint
npm run format
npm run test
npm run test:run
npm run test:coverage
```

## Branches and commits

- Branch from `main`.
- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- Keep commits small and focused.
- The commit-msg hook validates the message with commitlint.
- The pre-commit hook runs Oxlint and Prettier on staged files.

Examples:

```
feat: add a keyboard shortcut for export
fix: keep poster card inside the present scale
docs: record the zoom render scale decision
```

## Code style

- TypeScript strict mode. Avoid `any`.
- Function components and hooks. No class components.
- Prettier owns formatting. Do not hand-format around it.
- Oxlint owns lint. Fix warnings rather than suppressing them.
- Keep card internals in `em` so the render scale works.
- Keep product copy in `src/board/data.ts`.
- Prefer the existing camera, renderer, and card patterns over a new abstraction.

## Testing

- Add a unit test for camera math, data, or storage changes.
- Add or update the Testing Library test when the flat fallback changes.
- The canvas path needs a manual check. Use `docs/qa/manual-test-plan.md`.
- Run `npm run check` before opening a pull request.

Automated tests cover the fallback. They do not cover `drawElementImage`, `paint`, or real browser hit testing.

## Pull requests

Use the pull request template. Include:

- What changed and why.
- The test plan, including the canvas path and the fallback path.
- Screenshots or a recording for visual changes.
- Any agent assistance and what a human still needs to review.
- A docs or ADR update when the change alters behavior or architecture.

## Accessibility

Accessibility is a product requirement, not a follow-up.

- Keep native controls.
- Keep focus order in narrative order.
- Preserve `inert` behavior in present and structure modes.
- Test the keyboard path.
- Spot check a screen reader when the DOM structure changes.
- Never use color alone to carry meaning.

## Agent-assisted contributions

Agents are welcome. The repository is set up for them:

- Read `AGENTS.md` first.
- Use the docs as the source of truth.
- Include the agent name and a verification list in the pull request.
- A human reviews the canvas path and the accessibility impact.
