import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { BoardCanvas } from './board/BoardCanvas'
import type { BoardHandle } from './board/BoardCanvas'
import { clamp } from './board/camera'
import { Card } from './board/Card'
import {
  CARDS,
  CHECKLIST_ITEMS,
  CONNECTIONS,
  DEFAULT_EDITABLE,
  PRESENT_STEPS,
} from './board/data'
import { clearSaved, loadSaved, saveBoard } from './board/storage'
import type {
  BoardCard,
  Camera,
  EditableState,
  SavedBoard,
} from './board/types'
import './App.css'

function IconPlay() {
  return (
    <svg viewBox="0 0 16 16" className="icon" aria-hidden="true">
      <path d="M5 3.2v9.6L12.4 8 5 3.2Z" fill="currentColor" />
    </svg>
  )
}

function IconGrid() {
  return (
    <svg viewBox="0 0 16 16" className="icon" aria-hidden="true">
      <rect x="2" y="2" width="4.5" height="4.5" rx="0.8" />
      <rect x="9.5" y="2" width="4.5" height="4.5" rx="0.8" />
      <rect x="2" y="9.5" width="4.5" height="4.5" rx="0.8" />
      <rect x="9.5" y="9.5" width="4.5" height="4.5" rx="0.8" />
    </svg>
  )
}

function IconDownload() {
  return (
    <svg viewBox="0 0 16 16" className="icon" aria-hidden="true">
      <path d="M8 2.5v7.2M5.2 7l2.8 2.8L10.8 7" />
      <path d="M2.8 11.2v1.3c0 0.6 0.5 1 1 1h8.4c0.5 0 1-0.4 1-1v-1.3" />
    </svg>
  )
}

function IconMinus() {
  return (
    <svg viewBox="0 0 16 16" className="icon" aria-hidden="true">
      <path d="M3 8h10" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg viewBox="0 0 16 16" className="icon" aria-hidden="true">
      <path d="M8 3v10M3 8h10" />
    </svg>
  )
}

function IconFit() {
  return (
    <svg viewBox="0 0 16 16" className="icon" aria-hidden="true">
      <path d="M6 2.5H2.5V6M10 2.5h3.5V6M6 13.5H2.5V10M10 13.5h3.5V10" />
    </svg>
  )
}

function IconArrowLeft() {
  return (
    <svg viewBox="0 0 16 16" className="icon" aria-hidden="true">
      <path d="M10.5 3.5 6 8l4.5 4.5" />
    </svg>
  )
}

function IconArrowRight() {
  return (
    <svg viewBox="0 0 16 16" className="icon" aria-hidden="true">
      <path d="M5.5 3.5 10 8l-4.5 4.5" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg viewBox="0 0 16 16" className="icon" aria-hidden="true">
      <path d="m3.5 3.5 9 9M12.5 3.5l-9 9" />
    </svg>
  )
}

function IconReset() {
  return (
    <svg viewBox="0 0 16 16" className="icon" aria-hidden="true">
      <path d="M3 7.5a5 5 0 1 1 1.5 3.6" />
      <path d="M3 3.2v4.3h4.3" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg viewBox="0 0 16 16" className="icon" aria-hidden="true">
      <path d="m2.8 8.4 3.4 3.4 7-7.6" />
    </svg>
  )
}

function IconCaseStudy() {
  return (
    <svg viewBox="0 0 16 16" className="icon" aria-hidden="true">
      <path d="M4 2.5h5l3 3v8H4z" />
      <path d="M9 2.5v3h3M6 8h4M6 10.5h4" />
    </svg>
  )
}

function BrandMark() {
  return (
    <svg viewBox="0 0 28 28" className="brand-mark__svg" aria-hidden="true">
      <rect x="2" y="2" width="24" height="24" rx="7" />
      <path d="M8 20 20 8" />
      <circle cx="19.5" cy="19.5" r="2.2" />
    </svg>
  )
}

function normalizeSavedEditable(saved: SavedBoard | null): EditableState {
  const candidate = saved?.editable
  const headlines =
    Array.isArray(candidate?.headlines) &&
    candidate.headlines.length === DEFAULT_EDITABLE.headlines.length
      ? candidate.headlines.map((line) => String(line))
      : [...DEFAULT_EDITABLE.headlines]
  const headlineChoice =
    typeof candidate?.headlineChoice === 'number' &&
    candidate.headlineChoice >= 0 &&
    candidate.headlineChoice < headlines.length
      ? candidate.headlineChoice
      : DEFAULT_EDITABLE.headlineChoice
  const checklist =
    Array.isArray(candidate?.checklist) &&
    candidate.checklist.length === CHECKLIST_ITEMS.length
      ? candidate.checklist.map(Boolean)
      : [...DEFAULT_EDITABLE.checklist]
  const approved =
    typeof candidate?.approved === 'boolean'
      ? candidate.approved
      : DEFAULT_EDITABLE.approved

  return { headlines, headlineChoice, checklist, approved }
}

function getCardMeta(card: BoardCard): string {
  switch (card.kind) {
    case 'headlines':
      return 'group · 6 controls · 3 editable lines'
    case 'checklist':
      return 'group · 5 controls · 5 checkboxes'
    case 'decision':
      return 'group · 1 control · 1 button'
    default:
      return 'group · 0 controls'
  }
}

function supportsHtmlInCanvas(): boolean {
  if (typeof CanvasRenderingContext2D === 'undefined') return false
  return (
    'drawElementImage' in
    (CanvasRenderingContext2D.prototype as CanvasRenderingContext2D)
  )
}

const COMPACT_QUERY = '(max-width: 760px), (max-height: 520px)'

function App() {
  const saved = useMemo(() => loadSaved(), [])
  const [cards, setCards] = useState<BoardCard[]>(() =>
    CARDS.map((card) => {
      const position = saved?.positions[card.id]
      return {
        ...card,
        ...(position &&
        Number.isFinite(position.x) &&
        Number.isFinite(position.y)
          ? { x: position.x, y: position.y }
          : {}),
      }
    }),
  )
  const [editable, setEditable] = useState<EditableState>(() =>
    normalizeSavedEditable(saved),
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode, setMode] = useState<'explore' | 'present'>('explore')
  const [presentIndex, setPresentIndex] = useState(0)
  const [showStructure, setShowStructure] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [hintVisible, setHintVisible] = useState(true)
  const boardRef = useRef<BoardHandle>(null)
  const structureButtonRef = useRef<HTMLButtonElement>(null)
  const structureCloseRef = useRef<HTMLButtonElement>(null)
  const isUnsupported = useMemo(() => !supportsHtmlInCanvas(), [])
  const [isCompact, setIsCompact] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia(COMPACT_QUERY).matches,
  )
  const flatView = isUnsupported || isCompact
  const step = PRESENT_STEPS[presentIndex]

  useEffect(() => {
    const query = window.matchMedia(COMPACT_QUERY)
    const handleChange = () => {
      const compact = query.matches
      setIsCompact(compact)
      if (compact) {
        setMode('explore')
        setShowStructure(false)
        setPresentIndex(0)
      }
    }
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const positions = Object.fromEntries(
        cards.map((card) => [card.id, { x: card.x, y: card.y }]),
      )
      saveBoard(positions, editable)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [cards, editable])

  useEffect(() => {
    if (showStructure) {
      structureCloseRef.current?.focus()
    }
  }, [showStructure])

  useEffect(() => {
    const timer = window.setTimeout(() => setHintVisible(false), 9000)
    return () => window.clearTimeout(timer)
  }, [])

  const handleCameraChange = useCallback((camera: Camera) => {
    setZoom(Math.round(camera.zoom * 100))
  }, [])

  const handleCardsCommit = useCallback((nextCards: BoardCard[]) => {
    setCards(nextCards)
  }, [])

  const handleInteraction = useCallback(() => {
    setHintVisible(false)
  }, [])

  const handleHeadlineChange = useCallback((index: number, value: string) => {
    setEditable((current) => ({
      ...current,
      headlines: current.headlines.map((line, lineIndex) =>
        lineIndex === index ? value : line,
      ),
    }))
  }, [])

  const handleHeadlineChoice = useCallback((index: number) => {
    setEditable((current) => ({ ...current, headlineChoice: index }))
  }, [])

  const handleChecklistToggle = useCallback((index: number) => {
    setEditable((current) => ({
      ...current,
      checklist: current.checklist.map((checked, itemIndex) =>
        itemIndex === index ? !checked : checked,
      ),
    }))
  }, [])

  const handleApprove = useCallback(() => {
    setEditable((current) => ({ ...current, approved: true }))
  }, [])

  const startPresent = useCallback(() => {
    setShowStructure(false)
    setSelectedId(null)
    setMode('present')
    setPresentIndex(0)
    requestAnimationFrame(() => {
      void boardRef.current?.showCard(PRESENT_STEPS[0].cardId, true)
    })
  }, [])

  const goToStep = useCallback((index: number) => {
    const nextIndex = clamp(index, 0, PRESENT_STEPS.length - 1)
    setPresentIndex(nextIndex)
    void boardRef.current?.showCard(PRESENT_STEPS[nextIndex].cardId, true)
  }, [])

  const exitPresent = useCallback(() => {
    setMode('explore')
    setPresentIndex(0)
    requestAnimationFrame(() => boardRef.current?.fit(true))
  }, [])

  const toggleStructure = useCallback(() => {
    setShowStructure((current) => !current)
    setSelectedId(null)
  }, [])

  const exportPng = useCallback(() => {
    const canvas = boardRef.current?.getCanvas()
    if (!canvas) return

    flushSync(() => {
      setShowStructure(false)
      setSelectedId(null)
    })

    const handlePaint = () => {
      canvas.removeEventListener('paint', handlePaint)
      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'the-lumen-board.png'
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      }, 'image/png')
    }

    canvas.addEventListener('paint', handlePaint)
    canvas.requestPaint()
  }, [])

  const resetDemo = useCallback(() => {
    clearSaved()
    setCards(CARDS.map((card) => ({ ...card })))
    setEditable({
      headlines: [...DEFAULT_EDITABLE.headlines],
      headlineChoice: DEFAULT_EDITABLE.headlineChoice,
      checklist: [...DEFAULT_EDITABLE.checklist],
      approved: DEFAULT_EDITABLE.approved,
    })
    setSelectedId(null)
    setMode('explore')
    setShowStructure(false)
    setPresentIndex(0)
    requestAnimationFrame(() => boardRef.current?.fit(true))
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping = Boolean(
        target?.closest('input, textarea, select, [contenteditable="true"]'),
      )

      if (flatView) {
        if (event.key === 'Escape' && isTyping) {
          target?.blur()
        }
        return
      }

      if (event.key === 'Escape') {
        if (isTyping) {
          target?.blur()
          return
        }
        if (mode === 'present') {
          exitPresent()
          return
        }
        if (showStructure) {
          setShowStructure(false)
          requestAnimationFrame(() => structureButtonRef.current?.focus())
          return
        }
        setSelectedId(null)
        return
      }

      if (isTyping || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      const isButton = Boolean(target?.closest('button, a, [role="button"]'))

      if (mode === 'present') {
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          if (presentIndex >= PRESENT_STEPS.length - 1) {
            exitPresent()
          } else {
            goToStep(presentIndex + 1)
          }
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()
          goToStep(presentIndex - 1)
        } else if (event.key === ' ' && !isButton) {
          event.preventDefault()
          if (presentIndex >= PRESENT_STEPS.length - 1) {
            exitPresent()
          } else {
            goToStep(presentIndex + 1)
          }
        }
        return
      }

      if (event.key === 'p' || event.key === 'P') {
        event.preventDefault()
        startPresent()
      } else if (event.key === 'f' || event.key === 'F') {
        event.preventDefault()
        boardRef.current?.fit(true)
      } else if (event.key === 's' || event.key === 'S') {
        event.preventDefault()
        toggleStructure()
      } else if (event.key === 'e' || event.key === 'E') {
        event.preventDefault()
        exportPng()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    mode,
    showStructure,
    presentIndex,
    flatView,
    startPresent,
    goToStep,
    exitPresent,
    toggleStructure,
    exportPng,
  ])

  const cardProps = {
    editable,
    onHeadlineChange: handleHeadlineChange,
    onHeadlineChoice: handleHeadlineChoice,
    onChecklistToggle: handleChecklistToggle,
    onApprove: handleApprove,
  }

  return (
    <div
      className={`app${mode === 'present' ? ' is-presenting' : ''}${flatView ? ' is-flat' : ''}`}
    >
      {mode === 'explore' ? (
        <header className={`topbar${flatView ? ' topbar--flat' : ''}`}>
          <div className="brand">
            <span className="brand-mark">
              <BrandMark />
            </span>
            <span className="brand__name">Throughline</span>
            <span className="topbar__divider" aria-hidden="true" />
            <span className="brand__project">The Lumen</span>
            <span className="brand__sub">Reopening campaign</span>
          </div>

          <div className="topbar__actions">
            <a
              className="button button--ghost"
              href="#/case-study"
              aria-label="Read the case study"
            >
              <IconCaseStudy />
              <span>Case study</span>
            </a>
            {flatView ? (
              <span className="topbar__flat-note">
                {isUnsupported
                  ? 'Flat preview · Chrome 157+ for the canvas'
                  : 'Compact view · best on a larger screen'}
              </span>
            ) : (
              <>
                <button
                  type="button"
                  ref={structureButtonRef}
                  className={`button button--ghost${showStructure ? ' is-active' : ''}`}
                  aria-expanded={showStructure}
                  aria-controls="structure-panel"
                  aria-label="Structure view"
                  onClick={toggleStructure}
                >
                  <IconGrid />
                  <span>Structure</span>
                </button>
                <button
                  type="button"
                  className="button button--ghost"
                  aria-label="Export PNG"
                  onClick={exportPng}
                >
                  <IconDownload />
                  <span>Export</span>
                </button>
                <button
                  type="button"
                  className="button button--primary"
                  aria-label="Present the board"
                  onClick={startPresent}
                >
                  <IconPlay />
                  <span>Present</span>
                </button>
              </>
            )}
          </div>
        </header>
      ) : null}

      {!flatView ? (
        <h1 className="sr-only">Throughline: The Lumen reopening campaign</h1>
      ) : null}

      {flatView ? (
        <main className="flat-board">
          <div className="flat-board__intro">
            <p className="eyebrow">
              {isUnsupported ? 'Flat preview' : 'Compact view'}
            </p>
            <h1>The Lumen</h1>
            <p>
              {isUnsupported
                ? 'This board uses HTML-in-Canvas, a Chrome 157+ API. You are seeing the same content as a normal document. Every edit, checkbox, and approval still works.'
                : 'The spatial canvas is best on a larger screen. Here is the same board as a flat document. Every edit, checkbox, and approval still works.'}
            </p>
            <p className="flat-board__note">
              {isUnsupported
                ? 'Open this page in Chrome 157+ to see the spatial canvas.'
                : 'Resize wider, or open on desktop, to see the spatial canvas.'}
            </p>
          </div>

          <div className="flat-board__grid">
            {cards.map((card) => (
              <Card key={card.id} card={card} scale={1} flat {...cardProps} />
            ))}
          </div>

          <footer className="flat-board__footer">
            <button type="button" className="text-button" onClick={resetDemo}>
              <IconReset />
              Reset demo
            </button>
            <span className="api-badge">
              <span className="api-badge__dot" />
              Throughline
            </span>
          </footer>
        </main>
      ) : (
        <BoardCanvas
          ref={boardRef}
          cards={cards}
          connections={CONNECTIONS}
          selectedId={selectedId}
          mode={mode}
          presentId={mode === 'present' ? (step?.cardId ?? null) : null}
          showStructure={showStructure}
          onSelect={setSelectedId}
          onCameraChange={handleCameraChange}
          onCardsCommit={handleCardsCommit}
          onInteraction={handleInteraction}
          {...cardProps}
        />
      )}

      {!flatView && mode === 'explore' ? (
        <>
          <div className="zoombar" aria-label="Zoom controls">
            <button
              type="button"
              className="zoombar__button"
              onClick={() => boardRef.current?.zoomBy(1 / 1.18)}
              aria-label="Zoom out"
            >
              <IconMinus />
            </button>
            <span className="zoombar__value">{zoom}%</span>
            <button
              type="button"
              className="zoombar__button"
              onClick={() => boardRef.current?.zoomBy(1.18)}
              aria-label="Zoom in"
            >
              <IconPlus />
            </button>
            <span className="zoombar__divider" aria-hidden="true" />
            <button
              type="button"
              className="zoombar__fit"
              onClick={() => boardRef.current?.fit(true)}
            >
              <IconFit />
              Fit
            </button>
          </div>

          <div
            className={`hint${hintVisible && !showStructure ? '' : ' is-hidden'}`}
          >
            <span>Drag to pan</span>
            <span className="hint__dot" aria-hidden="true" />
            <span>Scroll to zoom</span>
            <span className="hint__dot" aria-hidden="true" />
            <span>Click a card to edit</span>
          </div>

          <div className="bottomright">
            <button type="button" className="text-button" onClick={resetDemo}>
              <IconReset />
              Reset demo
            </button>
            <span
              className="api-badge"
              title="Real HTML drawn inside a canvas. Chrome 157+."
            >
              <span className="api-badge__dot" />
              HTML-in-Canvas
            </span>
          </div>
        </>
      ) : null}

      {!flatView && mode === 'present' && step ? (
        <section className="present-hud" aria-label="Presentation controls">
          <div
            className="present-hud__progress"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={PRESENT_STEPS.length}
            aria-valuenow={presentIndex + 1}
            aria-label="Presentation progress"
          >
            <span
              style={{
                width: `${((presentIndex + 1) / PRESENT_STEPS.length) * 100}%`,
              }}
            />
          </div>

          <div className="present-hud__top">
            <span className="present-hud__eyebrow">
              Throughline · The Lumen
            </span>
            <span className="present-hud__count">
              {String(presentIndex + 1).padStart(2, '0')} /{' '}
              {String(PRESENT_STEPS.length).padStart(2, '0')}
            </span>
          </div>

          <div className="present-hud__main" aria-live="polite">
            <div className="present-hud__copy">
              <h2>{step.title}</h2>
              <p>{step.narration}</p>
            </div>
            <div className="present-hud__buttons">
              <button
                type="button"
                className="icon-button"
                onClick={() => goToStep(presentIndex - 1)}
                disabled={presentIndex === 0}
                aria-label="Previous card"
              >
                <IconArrowLeft />
              </button>
              {presentIndex < PRESENT_STEPS.length - 1 ? (
                <button
                  type="button"
                  className="button button--primary"
                  onClick={() => goToStep(presentIndex + 1)}
                >
                  <span>Next</span>
                  <IconArrowRight />
                </button>
              ) : (
                <button
                  type="button"
                  className="button button--primary"
                  onClick={exitPresent}
                >
                  <span>Finish</span>
                  <IconCheck />
                </button>
              )}
              <button
                type="button"
                className="icon-button"
                onClick={exitPresent}
                aria-label="Exit presentation"
              >
                <IconClose />
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {!flatView && mode === 'explore' && showStructure ? (
        <aside
          id="structure-panel"
          className="structure-panel"
          aria-label="The DOM behind the pixels"
        >
          <div className="structure-panel__header">
            <div>
              <p className="eyebrow">The DOM behind the pixels</p>
              <h2>Every card is a real element.</h2>
            </div>
            <button
              type="button"
              ref={structureCloseRef}
              className="icon-button"
              onClick={() => {
                setShowStructure(false)
                requestAnimationFrame(() => structureButtonRef.current?.focus())
              }}
              aria-label="Close structure view"
            >
              <IconClose />
            </button>
          </div>

          <p className="structure-panel__intro">
            Text, focus order, names, and controls survive the canvas. Exit this
            view and press Tab to move through the real controls. Click a row to
            fly to that card.
          </p>

          <ol className="structure-list">
            {cards.map((card, index) => (
              <li key={card.id}>
                <button
                  type="button"
                  onClick={() => {
                    setShowStructure(false)
                    setSelectedId(card.id)
                    void boardRef.current?.showCard(card.id, true)
                    requestAnimationFrame(() =>
                      boardRef.current?.focusCard(card.id),
                    )
                  }}
                >
                  <span className="structure-list__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="structure-list__body">
                    <strong>{card.title}</strong>
                    <small>{getCardMeta(card)}</small>
                  </span>
                  <IconArrowRight />
                </button>
              </li>
            ))}
          </ol>

          <div className="structure-panel__footer">
            <span>Chrome 157+</span>
            <span>drawElementImage()</span>
          </div>
        </aside>
      ) : null}

      <div className="screen-vignette" aria-hidden="true" />
    </div>
  )
}

export default App
