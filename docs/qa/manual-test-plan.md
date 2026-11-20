# Manual test plan

The canvas path cannot run in jsdom. These checks cover the parts automated tests cannot: the HTML-in-Canvas integration, real browser hit testing, screen reader semantics, and visual quality.

Run the relevant rows before a release or a public share.

## Environments

| Environment                                                    | Why                                                      |
| -------------------------------------------------------------- | -------------------------------------------------------- |
| Chrome 157+ on a desktop                                       | Primary target. API on by default.                       |
| Chromium 147 to 156 with `chrome://flags/#canvas-draw-element` | Legacy `layoutsubtree` path and the older attribute set. |
| Brave Stable with the flag                                     | Common Chromium derivative.                              |
| Safari current                                                 | Flat fallback.                                           |
| Firefox current                                                | Flat fallback.                                           |
| 1440x900 viewport                                              | Primary demo size.                                       |
| 1920x1080 viewport                                             | Large screen and presentation.                           |
| 1024x600 viewport                                              | Small laptop and short window.                           |
| 390x844 viewport                                               | Compact flat view.                                       |
| 760x900 and 761x900                                            | Compact breakpoint.                                      |

## Smoke test

1. `npm ci`
2. `npm run check`
3. `npm run dev`
4. Open the local URL in Chrome 157+.
5. Confirm the board appears fitted, with all ten cards visible.
6. Confirm the console has no errors.

Pass condition: no blank canvas, no console errors, all cards readable.

## Explore

- [ ] Board is centered and fitted on load.
- [ ] Board title, cards, connectors, and footer are visible.
- [ ] Drag on the background pans the board.
- [ ] Scroll zooms around the pointer.
- [ ] Zoom label updates.
- [ ] Minus and plus buttons zoom.
- [ ] Fit returns to the whole board.
- [ ] Cards remain crisp after zoom settles.
- [ ] A card can be dragged by its header.
- [ ] Dragging a card updates its connectors.
- [ ] Clicking the background deselects.
- [ ] Clicking a card selects it.
- [ ] Selected card has a border and a dashed outline.
- [ ] Hovering a card changes its border.
- [ ] The hint fades after the first interaction or nine seconds.

## Editing

- [ ] Clicking a headline textarea focuses it.
- [ ] The caret and selection appear at the drawn position.
- [ ] Typing updates the canvas on each keystroke.
- [ ] The textarea wraps rather than clipping horizontally.
- [ ] Enter blurs the headline.
- [ ] Choosing a different radio moves the lead badge.
- [ ] Checking and unchecking a task updates the card.
- [ ] The checked task has a line-through and a green box.
- [ ] Mark approved disables the button and shows the stamp.
- [ ] Reload preserves positions, headlines, lead choice, tasks, and approval.
- [ ] Reset restores the original board.
- [ ] Reset clears `throughline:board:v1` in localStorage.

## Present

- [ ] Present starts at The brief and dims the board.
- [ ] The camera flies to the card without a soft final frame.
- [ ] The HUD shows step 01 / 10 and the progress line.
- [ ] ArrowRight and Space advance.
- [ ] ArrowLeft goes back.
- [ ] The previous button is disabled on step one.
- [ ] The final step shows Finish.
- [ ] Finish exits and fits the board.
- [ ] Escape exits.
- [ ] The focused card can still be edited.
- [ ] Non-focused cards are not clickable or tabbable.
- [ ] The poster step shows the full poster, including its bottom caption.
- [ ] The HUD narration is readable at 1440x900 and 1920x1080.

## Structure

- [ ] Structure opens the panel and outlines every visible card.
- [ ] Each card has a number badge and a label.
- [ ] The panel lists ten cards with roles and control counts.
- [ ] Focus moves to the close button.
- [ ] Tabbing moves through the list.
- [ ] Clicking a row closes the panel, flies to the card, and focuses it.
- [ ] Escape returns focus to the Structure button.
- [ ] The close button returns focus to the Structure button.
- [ ] The hint is hidden while Structure is open.
- [ ] Export while Structure is open produces a clean board without the overlay.

## Export

- [ ] Export downloads `the-lumen-board.png`.
- [ ] The PNG has the paper background, cards, connectors, title, and footer.
- [ ] The PNG has no selection outline, HUD, panel, or browser UI.
- [ ] The PNG matches the current board view.
- [ ] Export does not throw if the canvas is missing.

## Keyboard and screen reader

- [ ] Tab order is top bar, cards in narrative order, then controls.
- [ ] Each card group has an accessible name.
- [ ] Card titles are headings.
- [ ] Focus rings are visible on cards, inputs, radios, checkboxes, and buttons.
- [ ] A screen reader announces the card group and its controls.
- [ ] In Present mode, the screen reader only sees the focused card and HUD.
- [ ] The HUD announces step changes.
- [ ] The Structure panel is reachable and its rows are buttons.
- [ ] Escape closes overlays without trapping focus.
- [ ] `prefers-reduced-motion` removes unnecessary motion.

## Fallback and responsive

- [ ] Safari shows the flat board with the Chrome 157+ note.
- [ ] Firefox shows the flat board.
- [ ] Chrome with the API disabled shows the flat board.
- [ ] Flat board editing, checklist, and approval work.
- [ ] Flat board has no present, structure, or export controls.
- [ ] Keyboard shortcuts do not change the flat view mode.
- [ ] At 760x900, the compact flat view appears with compact copy.
- [ ] At 761x900, the canvas view appears.
- [ ] At 390x844, the compact view has no horizontal scroll.
- [ ] At 390x844, the cards scale and remain readable.
- [ ] At 520px tall, the compact view appears.

## Performance

- [ ] Pan is smooth at 1440x900.
- [ ] Zoom is smooth and settles crisp.
- [ ] Present transition is under one second.
- [ ] No long task above 50ms during normal use.
- [ ] Memory does not climb after repeated Present, Structure, and Fit cycles.
- [ ] No console warnings about detached resources or missing paint events.

## Release checklist

- [ ] `npm run check` passes.
- [ ] Manual smoke, explore, edit, present, structure, export, fallback, and accessibility sections pass.
- [ ] README screenshots still match the UI.
- [ ] `CHANGELOG.md` updated.
- [ ] Deployed build opened from the public URL.
- [ ] Chrome 157 and one fallback browser checked on the public URL.
