# Design system

Throughline looks like a director's treatment board, not a SaaS dashboard. The visual language is warm paper, ink, one oxide-red accent, and a small amount of cinema green. The interface should feel assembled by a person, while the typography and spacing stay precise.

## Intent

- Make the board feel physical without making it skeuomorphic.
- Let the content carry the art direction.
- Keep effects secondary to reading.
- Use one accent for action and selection.
- Make the canvas chrome quiet enough that the cards are the focus.

## Palette

| Token            | Value                     | Use                                                   |
| ---------------- | ------------------------- | ----------------------------------------------------- |
| `--ink`          | `#1d1c19`                 | Primary text, dark card surface, primary button       |
| `--paper`        | `#f7f1e5`                 | Card surface, light text on ink                       |
| `--paper-deep`   | `#ede3d2`                 | Secondary paper tone                                  |
| `--board`        | `#e7dcc9`                 | Page background, flat view base                       |
| `--accent`       | `#bf4a2f`                 | Selection, lead headline, stamp, primary action hover |
| `--accent-soft`  | `rgba(191, 74, 47, 0.12)` | Chosen headline row, focus glow                       |
| `--green`        | `#2f5a4c`                 | Approved state, low risk, success                     |
| `--green-deep`   | `#223b33`                 | Poster surface                                        |
| `--amber`        | `#b9812f`                 | Medium risk                                           |
| Ink alpha tokens | `--ink-80` to `--ink-08`  | Borders, muted labels, dividers                       |

The canvas background adds a radial warm gradient, a low-alpha grain tile, and a dot grid. The grain is generated once and reused. The grid is drawn in screen space and scales with the camera.

## Typography

| Role    | Family                   | Use                                                              |
| ------- | ------------------------ | ---------------------------------------------------------------- |
| Display | Fraunces Variable        | Board title, card titles, big idea, poster date, flat view title |
| Sans    | Instrument Sans Variable | Body copy, UI labels, narration                                  |
| Mono    | DM Mono                  | Kickers, metadata, buttons, dates, owners, stamps                |

Rules:

- Display type is tight: line-height `1.02` to `1.08`, letter-spacing `-0.02em` to `-0.035em`.
- Mono labels are uppercase, `0.4em` to `0.56em` inside cards, `9px` to `11px` in chrome.
- Body copy stays at or above `0.7em` inside cards and `12px` in chrome.
- Do not set long body copy in the display face.
- Do not use more than two weights in one card.

## Card scale

Cards are designed at a base font size of `18px`. Every internal dimension is in `em`, so changing the card font size scales typography, padding, borders, shadows, and tape together.

This is what makes the zoom strategy work. The canvas draws the card snapshot at the camera scale, while the DOM lays the card out at the render scale.

- Card widths range from `260px` to `380px` at base.
- Card heights range from `230px` to `370px` at base.
- The fixed sizes keep connectors, camera framing, and presentation predictable.
- Copy is written to fit the base card, not to overflow and scroll.

## Card anatomy

```
.article.card
  .card__tape              translucent tape at the top center
  .card__surface
    header.card__header    kicker and drag grip
    .card__body            content by card kind
    footer.card__footer    collection label and accent dot
```

- The tape is inside the card's border box because the canvas clips snapshots to that box.
- The header is the drag handle. The body is for reading, selecting, and editing.
- The footer is a quiet collection mark, not navigation.
- The card's border is `0.075em` ink. Selected cards switch to the accent.
- The outer shadow is drawn on the canvas. The CSS shadow is only a small inner depth cue.

## Card kinds

| Kind      | Visual role                                                       |
| --------- | ----------------------------------------------------------------- |
| Brief     | Paper card with title, lede, and a three-column fact row          |
| Audience  | Paper card with an italic pull quote and a red statistic          |
| Big idea  | Ink card with cream display type and a lighter red kicker         |
| Headlines | Paper card with three editable rows, radio lead, and a lead badge |
| Poster    | Paper card containing a deep green screen-print poster            |
| Voice     | Paper card with numbered principles and one italic line           |
| Timeline  | Paper card with four milestones on a rule                         |
| Checklist | Paper card with five real checkboxes and owners                   |
| Risks     | Paper card with severity dots and text labels                     |
| Decision  | Paper card with a dark approval button and a rotated stamp        |

The mix of paper, ink, and deep green creates rhythm. Keep that rhythm: most cards are paper, one statement card is ink, one artifact card is green.

## Chrome

- Top bar: translucent paper, 62px tall, brand on the left, actions on the right.
- Zoom bar: bottom left, paper pill, minus, percentage, plus, Fit.
- Hint: bottom center, paper pill, fades after the first interaction or nine seconds.
- Utility pill: bottom right, Reset demo and the HTML-in-Canvas badge.
- Present HUD: dark ink bar with a red progress line, step count, title, narration, and controls.
- Structure panel: paper sheet on the right, outlined cards behind it, numbered badges, and a real DOM list.

Chrome should never compete with the cards. If a control needs a bright color, use the accent once.

## Motion

- Camera flights use cubic ease-in-out over 720ms for Fit and 760ms for presentation.
- Present step changes update the caption immediately and animate the camera.
- Hover transitions are 140ms.
- The hint fades over 500ms.
- Respect `prefers-reduced-motion`; the stylesheet shortens transitions and camera flights collapse to a single frame.
- Do not add looping motion to the board. The only continuous loop is an active camera flight.

## Accessibility

- Focus rings use the accent with a 2px outline or an inset surface ring.
- Selection is not color-only: the selected card gets a border and a dashed outline with corner dots.
- Risk severity includes a text label, not just a dot color.
- Timeline milestones include dates and labels.
- Buttons and inputs use native elements and visible labels.
- The card group has an accessible name. Titles are headings.
- The flat view is a normal document with the same controls.

## Do and do not

Do:

- Keep one accent action per card.
- Use paper texture, tape, and thin rules for warmth.
- Let display type carry the big idea.
- Write copy that fits the card.
- Test the card at 0.66x and 1.3x zoom.

Do not:

- Add a glassmorphism panel over the board.
- Apply shaders or distortion to body copy.
- Add a second bright accent.
- Use pure white or pure black.
- Let a card scroll internally.
- Use CSS transforms on a drawable card for layout.
