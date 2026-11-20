import { memo, useId } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import {
  CHECKLIST_ITEMS,
  RISKS,
  TIMELINE,
} from './data'
import type { BoardCard, EditableState } from './types'

interface CardProps {
  card: BoardCard
  editable: EditableState
  scale: number
  flat?: boolean
  selected?: boolean
  interactive?: boolean
  onPointerDown?: (
    event: ReactPointerEvent<HTMLElement>,
    card: BoardCard,
  ) => void
  onHeadlineChange?: (index: number, value: string) => void
  onHeadlineChoice?: (index: number) => void
  onChecklistToggle?: (index: number) => void
  onApprove?: () => void
}

const BASE_FONT = 18

function GripIcon() {
  return (
    <svg viewBox="0 0 14 20" aria-hidden="true" focusable="false">
      <circle cx="4" cy="4" r="1.2" />
      <circle cx="10" cy="4" r="1.2" />
      <circle cx="4" cy="10" r="1.2" />
      <circle cx="10" cy="10" r="1.2" />
      <circle cx="4" cy="16" r="1.2" />
      <circle cx="10" cy="16" r="1.2" />
    </svg>
  )
}

function CardBody({
  card,
  editable,
  checkboxPrefix,
  onHeadlineChange,
  onHeadlineChoice,
  onChecklistToggle,
  onApprove,
}: Omit<CardProps, 'scale' | 'flat' | 'selected' | 'interactive' | 'onPointerDown'> & {
  checkboxPrefix: string
}) {
  switch (card.kind) {
    case 'brief':
      return (
        <>
          <h2 className="card__title">Reopen The Lumen.</h2>
          <p className="card__lede">
            A six-week campaign to bring the neighborhood back into the dark,
            together.
          </p>
          <dl className="facts">
            <div>
              <dt>Budget</dt>
              <dd>$40k</dd>
            </div>
            <div>
              <dt>Window</dt>
              <dd>6 weeks</dd>
            </div>
            <div>
              <dt>Opening</dt>
              <dd>Dec 12</dd>
            </div>
          </dl>
        </>
      )

    case 'audience':
      return (
        <>
          <h2 className="card__title">Lapsed regulars.</h2>
          <blockquote className="quote">
            “I miss seeing a film with people who don’t know each other.”
          </blockquote>
          <p className="attribution">Maya, 34 · regular since 2009</p>
          <div className="stat">
            <strong>68%</strong>
            <span>of locals would go more if it felt like an event.</span>
          </div>
          <p className="source">Lumen survey · n=214</p>
        </>
      )

    case 'idea':
      return (
        <>
          <span className="idea__label">North star</span>
          <p className="idea__statement">
            A cinema is a room full of strangers feeling the same thing.
          </p>
          <p className="idea__sub">
            Sell the feeling, not the film. The dark is the product.
          </p>
        </>
      )

    case 'headlines':
      return (
        <>
          <p className="card__note">
            Pick the lead. Edit the line. The campaign follows.
          </p>
          <div className="headlines">
            {editable.headlines.map((line, index) => {
              const chosen = editable.headlineChoice === index
              return (
                <div
                  className={`headline${chosen ? ' is-chosen' : ''}`}
                  key={index}
                >
                  <input
                    className="headline__radio"
                    type="radio"
                    name="lead-headline"
                    checked={chosen}
                    onChange={() => onHeadlineChoice?.(index)}
                    aria-label={`Make headline ${index + 1} the lead`}
                  />
                  <span className="headline__index" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <textarea
                    className="headline__input"
                    value={line}
                    onChange={(event) =>
                      onHeadlineChange?.(index, event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        event.currentTarget.blur()
                      }
                    }}
                    aria-label={`Headline ${index + 1}`}
                    spellCheck={false}
                    rows={2}
                  />
                  {chosen ? (
                    <span className="headline__lead" aria-hidden="true">
                      Lead
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        </>
      )

    case 'poster':
      return (
        <>
          <div className="poster" aria-label="Poster concept">
            <div className="poster__top">
              <span>The Lumen</span>
              <span>Est. 1927</span>
            </div>
            <div className="poster__orb" aria-hidden="true" />
            <div className="poster__rule" aria-hidden="true" />
            <div className="poster__bottom">
              <span>Reopening</span>
              <strong>Dec 12</strong>
            </div>
            <p className="poster__tag">A room. A film. A feeling.</p>
          </div>
          <p className="poster__caption">
            Screen print · two colors · test on the marquee
          </p>
        </>
      )

    case 'voice':
      return (
        <>
          <h2 className="card__title">Warm. Wry. Inviting.</h2>
          <ul className="principles">
            <li>
              <span>01</span>Warm, not nostalgic.
            </li>
            <li>
              <span>02</span>Wry, not clever.
            </li>
            <li>
              <span>03</span>Inviting, not exclusive.
            </li>
          </ul>
          <p className="voice__line">“We saved you a seat.”</p>
        </>
      )

    case 'timeline':
      return (
        <>
          <div className="timeline">
            {TIMELINE.map((milestone, index) => (
              <div
                className={`milestone${index === TIMELINE.length - 1 ? ' is-final' : ''}`}
                key={milestone.date}
              >
                <span className="milestone__dot" aria-hidden="true" />
                <span className="milestone__date">{milestone.date}</span>
                <span className="milestone__label">{milestone.label}</span>
              </div>
            ))}
          </div>
          <p className="card__note">
            Six weeks from the first tease to opening night.
          </p>
        </>
      )

    case 'checklist':
      return (
        <>
          <h2 className="card__title">The room is ready when…</h2>
          <ul className="checklist">
            {CHECKLIST_ITEMS.map((item, index) => {
              const id = `${checkboxPrefix}-${index}`
              return (
                <li key={item.label}>
                  <input
                    id={id}
                    type="checkbox"
                    checked={editable.checklist[index] ?? false}
                    onChange={() => onChecklistToggle?.(index)}
                  />
                  <label htmlFor={id}>{item.label}</label>
                  <span className="checklist__owner">{item.owner}</span>
                </li>
              )
            })}
          </ul>
        </>
      )

    case 'risks':
      return (
        <>
          <h2 className="card__title">What could go wrong</h2>
          <ul className="risks">
            {RISKS.map((risk) => (
              <li key={risk.label}>
                <span
                  className={`risk__dot risk__dot--${risk.level}`}
                  aria-hidden="true"
                />
                <span className="risk__label">{risk.label}</span>
                <span className="risk__level">{risk.level}</span>
              </li>
            ))}
          </ul>
          <p className="card__note">
            Mitigation: lead with the feeling, not the past.
          </p>
        </>
      )

    case 'decision':
      return (
        <>
          <h2 className="card__title">Approve the direction.</h2>
          <p className="card__lede">
            Sign off the big idea and the lead headline so production can start
            Monday.
          </p>
          <div className="decision__row">
            <button
              type="button"
              className="decision__button"
              onClick={onApprove}
              disabled={editable.approved}
            >
              {editable.approved ? 'Direction approved' : 'Mark approved'}
            </button>
            {editable.approved ? <span className="stamp">Approved</span> : null}
          </div>
          <p className="decision__meta">Owner: Mara · due Friday</p>
        </>
      )

    default:
      return null
  }
}

export const Card = memo(function Card({
  card,
  editable,
  scale,
  flat = false,
  selected = false,
  interactive = true,
  onPointerDown,
  onHeadlineChange,
  onHeadlineChoice,
  onChecklistToggle,
  onApprove,
}: CardProps) {
  const checkboxPrefix = useId()

  const style = flat
    ? {
        position: 'relative' as const,
        width: card.width,
        height: card.height,
        fontSize: BASE_FONT,
      }
    : {
        position: 'absolute' as const,
        left: 0,
        top: 0,
        width: card.width * scale,
        height: card.height * scale,
        fontSize: BASE_FONT * scale,
        pointerEvents: interactive ? ('auto' as const) : ('none' as const),
      }

  return (
    <article
      className={`card card--${card.kind}${flat ? ' card--flat' : ''}`}
      style={style}
      data-card-id={card.id}
      data-selected={selected ? 'true' : undefined}
      drawable=""
      role="group"
      aria-label={`${card.kicker}: ${card.title}`}
      tabIndex={interactive ? 0 : -1}
      inert={!interactive ? true : undefined}
      onPointerDown={(event) => onPointerDown?.(event, card)}
    >
      <span className="card__tape" aria-hidden="true" />
      <div className="card__surface">
        <header className="card__header" data-drag-handle>
          <span className="card__kicker">{card.kicker}</span>
          <span className="card__grip" aria-hidden="true">
            <GripIcon />
          </span>
        </header>
        <div className="card__body">
          <CardBody
            card={card}
            editable={editable}
            checkboxPrefix={checkboxPrefix}
            onHeadlineChange={onHeadlineChange}
            onHeadlineChoice={onHeadlineChoice}
            onChecklistToggle={onChecklistToggle}
            onApprove={onApprove}
          />
        </div>
        <footer className="card__footer">
          <span>The Lumen · 2026</span>
          <span className="card__footer-dot" aria-hidden="true" />
        </footer>
      </div>
    </article>
  )
})
