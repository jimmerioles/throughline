## Summary

What changed, and why?

## Type of change

- [ ] Feature
- [ ] Fix
- [ ] Refactor
- [ ] Documentation
- [ ] Tooling or CI
- [ ] Accessibility
- [ ] Performance

## Test plan

Describe what you ran and what you checked by hand.

- [ ] `npm run check`
- [ ] Canvas view in Chrome 157+
- [ ] Older Chromium with `chrome://flags/#canvas-draw-element`
- [ ] Flat fallback in a browser without HTML-in-Canvas
- [ ] Compact view at 390px wide
- [ ] Keyboard-only path
- [ ] Screen reader spot check
- [ ] Present mode
- [ ] Structure view
- [ ] PNG export

## Screenshots or recordings

Include before and after when the change is visual.

## Agent-assisted work

If an agent helped, name it and list what it changed, what it verified, and what a human still needs to review.

## Checklist

- [ ] The change is scoped to one concern.
- [ ] I updated the relevant docs or ADR.
- [ ] I did not add secrets, tokens, or private URLs.
- [ ] The fallback path still works.
- [ ] The change respects the direct-child and `drawable` requirements of HTML-in-Canvas.
