import { useRef } from 'react'
// Optimized copies of the screenshots in docs/. The originals stay in docs/ for the README.
import compactShot from './images/compact.webp'
import previewShot from './images/preview.webp'
import presentShot from './images/present.webp'
import structureShot from './images/structure.webp'
import './case-study.css'

function IconArrowLeft() {
  return (
    <svg viewBox="0 0 16 16" className="icon" aria-hidden="true">
      <path d="M10.5 3.5 6 8l4.5 4.5" />
    </svg>
  )
}

function IconArrowDown() {
  return (
    <svg viewBox="0 0 16 16" className="icon" aria-hidden="true">
      <path d="M8 3v9M4.5 8.5 8 12l3.5-3.5" />
    </svg>
  )
}

function IconArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" className="icon" aria-hidden="true">
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
    </svg>
  )
}

function CaseStudyMark() {
  return (
    <svg viewBox="0 0 28 28" className="cs-brand__svg" aria-hidden="true">
      <rect x="2" y="2" width="24" height="24" rx="7" />
      <path d="M8 20 20 8" />
      <circle cx="19.5" cy="19.5" r="2.2" />
    </svg>
  )
}

const FACTS = [
  { label: 'Role', value: 'Product design and frontend' },
  { label: 'Stack', value: 'React, TypeScript, Vite' },
  { label: 'Canvas', value: 'HTML-in-Canvas, Chrome 157+' },
  { label: 'Status', value: 'v1.0, November 2026' },
]

const COMPARISON = [
  {
    criterion: 'Text quality',
    before:
      'Text is rasterized once at capture size. Zoom in and the glyphs soften with the image.',
    after:
      'Live text is laid out at the render scale and drawn 1:1 after a zoom settles.',
  },
  {
    criterion: 'Selection',
    before:
      'The result is a bitmap. There is no caret, no text selection, and nothing to copy.',
    after: 'Native selection, caret movement, and copy work inside the canvas.',
  },
  {
    criterion: 'Accessibility',
    before:
      'A picture of a form. The semantics are gone unless a second DOM layer rebuilds them.',
    after:
      'The cards are the accessibility tree: names, headings, groups, and native controls.',
  },
]

const SHOTS = [
  {
    time: '0:00 to 0:06',
    title: 'Open on the fitted board',
    action: 'Load the demo at 1440x900. Leave the board untouched.',
    screen:
      'All ten cards fit in one view, with the title, connectors, and the hint visible.',
    narration:
      'This is Throughline. Ten real HTML cards, fitted to one canvas.',
  },
  {
    time: '0:06 to 0:16',
    title: 'Pan, then zoom',
    action:
      'Drag the background, then scroll slowly into the big idea card. Stop around 75 to 100 percent, while all three headline rows are still visible.',
    screen:
      'The camera moves. The snapshot scales during the gesture, then the card is crisp once the zoom settles. The headline card stays in frame.',
    narration:
      'Pan and zoom behave like a canvas. The text catches up when the gesture stops.',
  },
  {
    time: '0:16 to 0:27',
    title: 'Edit a headline and check a task',
    action:
      'Click into the second headline, type a new line, then click a checklist item.',
    screen:
      'The real textarea takes focus. The canvas repaints on each keystroke. The checkbox ticks.',
    narration:
      'These are real controls. Click a headline, type, check a task. The canvas repaints as I work.',
  },
  {
    time: '0:27 to 0:35',
    title: 'Approve the direction',
    action:
      'Pan up until The decision card is fully in frame, then click Mark approved. Hold for one beat.',
    screen:
      'The button changes to Direction approved and the red stamp lands fully in frame.',
    narration:
      'Approve the direction and the stamp lands. The state survives a reload.',
  },
  {
    time: '0:35 to 0:50',
    title: 'Present three cards',
    action: 'Press Present, then press ArrowRight three times.',
    screen:
      'The board dims, the camera flies to each card, and the HUD carries the narration.',
    narration:
      'Present flies card to card. The HUD carries the narration. Arrow keys move forward and back.',
  },
  {
    time: '0:50 to 1:00',
    title: 'Show the DOM, then fit',
    action:
      'Press Escape, wait for the automatic fit, open Structure, close it, then click Fit.',
    screen:
      'The board returns to the fitted view, then outlines and a real list of cards appear. The panel closes and the whole board returns.',
    narration:
      'Structure shows the DOM behind the pixels: roles, controls, tab order. Then Fit brings the whole board back.',
  },
]

const STEPS = [
  {
    title: 'The canvas is the parent.',
    body: 'Each card is a direct child of the canvas with the drawable attribute. The browser still lays the card out, so hit testing and accessibility geometry follow the rectangle that gets drawn.',
  },
  {
    title: 'The browser supplies the pixels.',
    body: 'React does not run a render loop. The canvas listens for paint and calls drawElementImage() for each visible card. Typing in a headline fires a paint, so the canvas updates without a timer.',
  },
  {
    title: 'The camera stays separate from the layout.',
    body: 'Pan is a camera translation. Zoom moves the camera immediately, then relays out the cards at the new scale after a 150 ms throttle and a 170 ms settle. The snapshot is scaled during the gesture and drawn 1:1 after it.',
  },
  {
    title: 'The DOM is the interface and the fallback.',
    body: 'Focus, selection, and screen readers use the cards, not a parallel model. When drawElementImage() is missing, the same components render as a flat document with the same controls.',
  },
]

const STATS = [
  { value: '10', label: 'live cards', note: 'one 2D context' },
  { value: '0', label: 'idle frames', note: 'no loop at rest' },
  { value: '720 ms', label: 'fit flight', note: 'cubic ease-in-out' },
  { value: '760 ms', label: 'present flight', note: 'per card' },
  { value: '0.3x to 2.8x', label: 'zoom range', note: 'wheel and buttons' },
  { value: '3.2x', label: 'present scale cap', note: 'largest card fits' },
]

const ACCESSIBILITY = [
  {
    title: 'Names and headings survive.',
    body: 'Every card is a group with an accessible name. Card titles are headings under one page heading. The cards are the accessibility tree, not a description of it.',
  },
  {
    title: 'Controls are native.',
    body: 'Headlines are textareas, leads are radios, tasks are checkboxes, and approval is a button. Tab order follows the narrative order.',
  },
  {
    title: 'Presentation removes the rest.',
    body: 'Present mode marks every card except the focused one inert and removes its pointer events. A screen reader and keyboard only see the card being presented and the HUD.',
  },
  {
    title: 'Structure is a real list.',
    body: 'The panel lists the true cards, their roles, and control counts. Opening it moves focus to the close button. Closing it returns focus to the Structure button.',
  },
  {
    title: 'Motion is optional.',
    body: 'Camera flights and transitions shorten when the visitor prefers reduced motion. The board still lands on the target.',
  },
  {
    title: 'This page follows the same rules.',
    body: 'One heading, semantic landmarks, a skip link, visible focus, and no meaning that depends on color alone.',
  },
]

const LIMITATIONS = [
  'HTML-in-Canvas is Chrome 157+ today. Safari and Firefox get the flat document, which keeps every edit and control but loses the spatial view.',
  'The demo stays in 2D. A curved 3D surface and text selection do not map cleanly, and the board does not need either.',
  'Touch pan works, but pinch zoom is not implemented. Small screens switch to the compact flat view instead.',
  'Export writes the current board view as a PNG, not a separate print layout.',
  'Structure is a semantic map of the cards, not a live accessibility tree inspector.',
  'The performance figures are constants and budgets from the build, not a published benchmark. A frame trace on a mid-range laptop is still to come.',
]

const NEXT = [
  {
    title: 'Record the walkthrough',
    body: 'Follow the 60-second script, capture it at 1440x900 in Chrome 157, and replace the poster with the video.',
  },
  {
    title: 'Publish the public demo',
    body: 'Finish the Pages deployment, then check the canvas path and the flat fallback from the public URL.',
  },
  {
    title: 'Publish a frame trace',
    body: 'Measure paint counts and frame pacing on a mid-range laptop, then publish the numbers beside the current budgets.',
  },
  {
    title: '2x and 4x export',
    body: 'Use captureElementImage() and OffscreenCanvas to export above device resolution without blocking the board.',
  },
  {
    title: 'A second story',
    body: 'Run a different board through the same components to prove the pattern is a product, not a one-off skin.',
  },
  {
    title: 'A WebGL path',
    body: 'Keep the same DOM cards and add depth, blur, and transitions with explicit geometry updates.',
  },
]

export function CaseStudy() {
  const shotsTitleRef = useRef<HTMLHeadingElement>(null)

  const showShots = () => {
    const title = shotsTitleRef.current
    title?.scrollIntoView({ block: 'start' })
    title?.focus({ preventScroll: true })
  }

  return (
    <div className="case-study">
      <a
        className="cs-skip"
        href="#case-study-main"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById('case-study-main')?.focus()
        }}
      >
        Skip to the case study
      </a>

      <header className="cs-topbar" aria-label="Case study">
        <a className="cs-brand" href="#/" aria-label="Throughline home">
          <span className="cs-brand__mark">
            <CaseStudyMark />
          </span>
          <span className="cs-brand__name">Throughline</span>
          <span className="cs-brand__divider" aria-hidden="true" />
          <span className="cs-brand__section">Case study</span>
        </a>
        <a className="cs-back" href="#/">
          <IconArrowLeft />
          <span>Back to the board</span>
        </a>
      </header>

      <main id="case-study-main" className="cs-main" tabIndex={-1}>
        <article>
          <header className="cs-hero">
            <div className="cs-shell">
              <p className="cs-kicker">
                <span className="cs-kicker__dot" aria-hidden="true" />
                HTML-in-Canvas · Case study
              </p>
              <h1 className="cs-hero__title">
                Canvas speed. <br />
                HTML manners.
              </h1>
              <p className="cs-hero__lede">
                Throughline is a spatial narrative board where ten cards pan,
                zoom, and present like canvas objects, while every headline,
                checkbox, and button stays real HTML. It answers a simple
                question: can a canvas interface keep the things that make the
                web usable?
              </p>

              <div className="cs-hero__bottom">
                <div className="cs-actions">
                  <a className="cs-button cs-button--primary" href="#/">
                    <span>Open the board</span>
                    <IconArrowUpRight />
                  </a>
                  <button
                    type="button"
                    className="cs-button cs-button--ghost"
                    onClick={showShots}
                  >
                    <span>Read the shot list</span>
                    <IconArrowDown />
                  </button>
                </div>

                <dl className="cs-facts">
                  {FACTS.map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <figure className="cs-figure cs-figure--hero">
                <img
                  src={previewShot}
                  alt="The Throughline board at 1440 by 900, with ten paper cards arranged around a narrative spine on a warm canvas."
                  width={1440}
                  height={900}
                />
                <figcaption>
                  The board at 1440x900. Every card is live DOM, drawn into one
                  canvas.
                </figcaption>
              </figure>
            </div>
          </header>

          <div className="cs-shell cs-sections">
            <section className="cs-section" aria-labelledby="problem-title">
              <div className="cs-section__aside">
                <span className="cs-section__number">01</span>
                <p className="cs-kicker">The problem</p>
              </div>
              <div className="cs-section__body">
                <h2 id="problem-title">
                  Canvas interfaces keep losing the document.
                </h2>
                <p className="cs-lede">
                  Canvas is where interfaces go when they need to feel spatial:
                  a map, a timeline, a node graph, a film board. The trade is
                  familiar. You gain pixel control and lose the document.
                </p>
                <p>
                  Text layout, selection, copy and paste, find in page,
                  translation, form controls, and screen reader semantics are
                  not automatic on a canvas. Teams work around the gap in three
                  ways:
                </p>
                <ul className="cs-list">
                  <li>
                    <strong>A DOM overlay.</strong> Real controls float above
                    the canvas. Now there are two sources of truth for position,
                    focus, and state, and they drift.
                  </li>
                  <li>
                    <strong>A screenshot library.</strong> Tools such as
                    html2canvas turn a live subtree into pixels. The image looks
                    right and behaves like an image.
                  </li>
                  <li>
                    <strong>Hand-drawn text.</strong> The canvas draws every
                    glyph. The result is a picture of an interface with no
                    inside.
                  </li>
                </ul>
                <p>
                  Each workaround treats HTML as something to imitate.
                  HTML-in-Canvas treats it as something to draw.
                </p>

                <div className="cs-compare">
                  <h3>Before and after html2canvas</h3>
                  <p className="cs-compare__intro">
                    html2canvas is a useful tool when the output should be an
                    image. Throughline needs an interface that survives being
                    drawn.
                  </p>
                  <table>
                    <caption className="sr-only">
                      A comparison of html2canvas and Throughline for text
                      quality, selection, and accessibility
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Criterion</th>
                        <th scope="col">html2canvas</th>
                        <th scope="col">Throughline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON.map((row) => (
                        <tr key={row.criterion}>
                          <th scope="row">{row.criterion}</th>
                          <td data-label="html2canvas">{row.before}</td>
                          <td data-label="Throughline">{row.after}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="cs-section" aria-labelledby="what-title">
              <div className="cs-section__aside">
                <span className="cs-section__number">02</span>
                <p className="cs-kicker">What it is</p>
              </div>
              <div className="cs-section__body">
                <h2 id="what-title">
                  A director's board that happens to live in a canvas.
                </h2>
                <p className="cs-lede">
                  The demo is a treatment for The Lumen, a fictional
                  neighborhood cinema reopening. Ten cards cover the brief,
                  audience, big idea, headline options, poster direction, voice,
                  timeline, opening night checklist, risks, and the decision.
                </p>
                <p>
                  It is meant to be used, not just watched. Pan the board.
                  Rewrite a headline. Check a task. Approve the direction and
                  watch the stamp land. Then present the sequence with camera
                  flights, inspect the DOM behind the pixels, and export a PNG.
                  Reload and your edits are still there.
                </p>

                <div className="cs-statement">
                  <p>
                    A board you can edit, present, approve, and export without
                    giving up the web.
                  </p>
                </div>

                <p>
                  The effect is deliberately quiet. There is one accent, a paper
                  palette, and no shader over the copy. If the canvas
                  disappeared, the content would still be a good document. That
                  is the point.
                </p>
              </div>
            </section>

            <section className="cs-section" aria-labelledby="walkthrough-title">
              <div className="cs-section__aside">
                <span className="cs-section__number">03</span>
                <p className="cs-kicker">The walkthrough</p>
              </div>
              <div className="cs-section__body">
                <h2 id="walkthrough-title">The board in sixty seconds.</h2>
                <p className="cs-lede">
                  The video is not recorded yet. The script is finished, so the
                  next recording session has a fixed route: six shots, no
                  improvisation, and a result on screen for every beat.
                </p>

                <div className="cs-walkthrough">
                  <figure className="cs-poster">
                    <div className="cs-poster__frame">
                      <div className="cs-poster__meta">
                        <span>Walkthrough</span>
                        <span>60 sec</span>
                      </div>
                      <p className="cs-poster__title">
                        The board in one minute.
                      </p>
                      <p className="cs-poster__copy">
                        Camera flights, live edits, and the DOM behind the
                        pixels.
                      </p>
                      <div className="cs-poster__actions">
                        <p className="cs-poster__status">
                          <span className="cs-poster__dot" aria-hidden="true" />
                          Recording pending
                        </p>
                        <button
                          type="button"
                          className="cs-poster__button"
                          onClick={showShots}
                        >
                          Read the shot list
                          <IconArrowDown />
                        </button>
                      </div>
                      <div className="cs-poster__ticks" aria-hidden="true" />
                    </div>
                    <figcaption>
                      The production script ships in{' '}
                      <code>docs/demo-script.md</code> with the 15-second cut
                      and recording notes.
                    </figcaption>
                  </figure>

                  <div className="cs-shotlist">
                    <h3 id="shot-list-title" ref={shotsTitleRef} tabIndex={-1}>
                      The 60-second shot list
                    </h3>
                    <ol className="cs-shots" aria-labelledby="shot-list-title">
                      {SHOTS.map((shot) => (
                        <li key={shot.time}>
                          <p className="cs-shots__time">{shot.time}</p>
                          <div>
                            <h4>{shot.title}</h4>
                            <dl>
                              <div>
                                <dt>Action</dt>
                                <dd>{shot.action}</dd>
                              </div>
                              <div>
                                <dt>On screen</dt>
                                <dd>{shot.screen}</dd>
                              </div>
                              <div>
                                <dt>Narration</dt>
                                <dd>"{shot.narration}"</dd>
                              </div>
                            </dl>
                          </div>
                        </li>
                      ))}
                    </ol>
                    <p className="cs-small">
                      A 15-second cut and the full recording notes are in the
                      production script.
                    </p>

                    <figure className="cs-figure cs-figure--walkthrough">
                      <img
                        src={presentShot}
                        alt="Presentation mode showing the big idea card enlarged on a dimmed board, with a narration bar across the bottom."
                        width={1440}
                        height={900}
                      />
                      <figcaption>
                        Present mode. The camera flies to one card while the HUD
                        carries the narration.
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </div>
            </section>

            <section className="cs-section" aria-labelledby="how-title">
              <div className="cs-section__aside">
                <span className="cs-section__number">04</span>
                <p className="cs-kicker">How it works</p>
              </div>
              <div className="cs-section__body">
                <h2 id="how-title">Four ideas hold the whole thing up.</h2>
                <p className="cs-lede">
                  The architecture is small on purpose. There is no scene graph,
                  no custom layout engine, and no second copy of the content.
                </p>

                <ol className="cs-steps">
                  {STEPS.map((step, index) => (
                    <li key={step.title}>
                      <span className="cs-steps__number" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3>{step.title}</h3>
                        <p>{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="cs-code">
                  <p className="cs-code__label">The API setup</p>
                  <pre>
                    <code>{`<canvas content="drawable" layoutsubtree>
  <article drawable>...</article>
  <article drawable>...</article>
</canvas>

ctx.drawElementImage(card, x, y, width, height)`}</code>
                  </pre>
                </div>

                <p>
                  The browser keeps 2D hit testing and accessibility geometry in
                  sync with the drawn rectangle. The demo does not pipe a
                  transform back into the page, and the cards are never
                  positioned with CSS transforms. That is what keeps clicks,
                  selection, and focus in the right place.
                </p>
              </div>
            </section>

            <section className="cs-section" aria-labelledby="performance-title">
              <div className="cs-section__aside">
                <span className="cs-section__number">05</span>
                <p className="cs-kicker">Performance</p>
              </div>
              <div className="cs-section__body">
                <h2 id="performance-title">
                  Nothing moves until something changes.
                </h2>
                <p className="cs-lede">
                  Throughline draws ten cards in one 2D context. There is no
                  animation loop at rest. A paint happens when a card changes,
                  the camera moves, the selection changes, or the mode changes.
                </p>

                <dl className="cs-stats">
                  {STATS.map((stat) => (
                    <div key={stat.label}>
                      <dt>{stat.label}</dt>
                      <dd>
                        <strong>{stat.value}</strong>
                        <span>{stat.note}</span>
                      </dd>
                    </div>
                  ))}
                </dl>

                <p>
                  During a zoom gesture the render scale updates at most every
                  150 ms. A trailing timer settles it at the final camera zoom
                  after 170 ms. During the gesture the existing snapshot is
                  scaled, which can look briefly soft. After the settle the card
                  is laid out at the new size and drawn 1:1.
                </p>
                <p>
                  These figures are constants and design budgets from the build,
                  not a lab benchmark. The target is 60fps pan on a 2020 laptop
                  and no long task over 50 ms during normal use. The frame trace
                  has not been published yet, and the limitations below say so.
                </p>
              </div>
            </section>

            <section
              className="cs-section"
              aria-labelledby="accessibility-title"
            >
              <div className="cs-section__aside">
                <span className="cs-section__number">06</span>
                <p className="cs-kicker">Accessibility</p>
              </div>
              <div className="cs-section__body">
                <h2 id="accessibility-title">
                  The accessible tree is the product.
                </h2>
                <p className="cs-lede">
                  HTML-in-Canvas is interesting because it does not ask for a
                  parallel accessibility model. The cards that get drawn are the
                  same cards that get focused, read, and edited.
                </p>

                <div className="cs-cols">
                  <ul className="cs-list cs-list--tight">
                    {ACCESSIBILITY.map((item) => (
                      <li key={item.title}>
                        <strong>{item.title}</strong> {item.body}
                      </li>
                    ))}
                  </ul>
                  <figure className="cs-figure cs-figure--accessibility">
                    <img
                      src={structureShot}
                      alt="Structure view outlining every card on the board, with a panel listing ten cards, their roles, and control counts."
                      width={1440}
                      height={900}
                    />
                    <figcaption>
                      Structure view. The panel lists the real cards and their
                      controls.
                    </figcaption>
                  </figure>
                </div>

                <p>
                  The project also keeps a flat fallback for browsers without
                  the API. It is the same board as a normal document, with the
                  same controls. On a small screen it becomes the compact view
                  instead. The canvas is an enhancement, not the only way in.
                </p>
              </div>
            </section>

            <section className="cs-section" aria-labelledby="limitations-title">
              <div className="cs-section__aside">
                <span className="cs-section__number">07</span>
                <p className="cs-kicker">Limitations</p>
              </div>
              <div className="cs-section__body">
                <h2 id="limitations-title">What this does not claim.</h2>
                <p className="cs-lede">
                  A demo is more convincing when it says where the edges are.
                  These are the current ones.
                </p>

                <div className="cs-cols">
                  <ul className="cs-list cs-list--tight">
                    {LIMITATIONS.map((limitation) => (
                      <li key={limitation}>{limitation}</li>
                    ))}
                  </ul>
                  <figure className="cs-figure cs-figure--compact">
                    <img
                      src={compactShot}
                      alt="The compact flat view of the same board at a mobile width, with the cards stacked in a single column."
                      width={780}
                      height={1688}
                    />
                    <figcaption>
                      The flat compact view at 390px. Same content, same
                      controls, no canvas.
                    </figcaption>
                  </figure>
                </div>
              </div>
            </section>

            <section className="cs-section" aria-labelledby="next-title">
              <div className="cs-section__aside">
                <span className="cs-section__number">08</span>
                <p className="cs-kicker">What is next</p>
              </div>
              <div className="cs-section__body">
                <h2 id="next-title">
                  The next version should make the argument sharper.
                </h2>
                <p className="cs-lede">
                  The demo has proven the interaction. The remaining work is
                  evidence, reach, and a second story.
                </p>

                <ol className="cs-next">
                  {NEXT.map((item, index) => (
                    <li key={item.title}>
                      <span aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </div>
        </article>
      </main>

      <footer className="cs-footer">
        <div className="cs-shell cs-footer__inner">
          <div>
            <p className="cs-footer__mark">Throughline</p>
            <p className="cs-footer__note">
              A demo, not a product. The Lumen is a fictional cinema. Built with
              React, TypeScript, and Vite.
            </p>
          </div>
          <div className="cs-footer__links">
            <a className="cs-back" href="#/">
              <IconArrowLeft />
              <span>Back to the board</span>
            </a>
            <button
              type="button"
              className="cs-small cs-footer__button"
              onClick={showShots}
            >
              Read the shot list
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
