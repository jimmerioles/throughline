import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import {
  clamp,
  easeInOutCubic,
  fitCamera,
  lerpCamera,
  MAX_ZOOM,
  MIN_ZOOM,
  presentCamera,
  zoomAroundPoint,
} from './camera'
import { Card } from './Card'
import { BOARD_BOUNDS } from './data'
import { renderBoard } from './renderer'
import type {
  BoardCard,
  Camera,
  Connection,
  EditableState,
  Viewport,
} from './types'

export interface BoardHandle {
  fit: (animate?: boolean) => void
  showCard: (cardId: string, animate?: boolean) => Promise<void>
  animateTo: (
    camera: Camera,
    options?: { duration?: number; scale?: number },
  ) => Promise<void>
  setCamera: (camera: Camera) => void
  getCamera: () => Camera
  getViewport: () => Viewport
  getCanvas: () => HTMLCanvasElement | null
  requestPaint: () => void
  zoomBy: (factor: number) => void
  focusCard: (cardId: string) => void
}

interface BoardCanvasProps {
  cards: BoardCard[]
  connections: Connection[]
  editable: EditableState
  selectedId: string | null
  mode: 'explore' | 'present'
  presentId: string | null
  showStructure: boolean
  onSelect: (id: string | null) => void
  onCameraChange: (camera: Camera) => void
  onCardsCommit: (cards: BoardCard[]) => void
  onInteraction: () => void
  onHeadlineChange: (index: number, value: string) => void
  onHeadlineChoice: (index: number) => void
  onChecklistToggle: (index: number) => void
  onApprove: () => void
}

interface PanState {
  pointerId: number
  startX: number
  startY: number
  cameraX: number
  cameraY: number
  moved: boolean
}

interface DragState {
  id: string
  pointerId: number
  startX: number
  startY: number
  cardX: number
  cardY: number
  zoom: number
  moved: boolean
}

function getInsets(viewport: Viewport) {
  const compact = viewport.width < 760
  return compact
    ? { top: 106, right: 12, bottom: 98, left: 12 }
    : { top: 88, right: 32, bottom: 96, left: 32 }
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export const BoardCanvas = forwardRef<BoardHandle, BoardCanvasProps>(
  function BoardCanvas(
    {
      cards,
      connections,
      editable,
      selectedId,
      mode,
      presentId,
      showStructure,
      onSelect,
      onCameraChange,
      onCardsCommit,
      onInteraction,
      onHeadlineChange,
      onHeadlineChoice,
      onChecklistToggle,
      onApprove,
    },
    ref,
  ) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const cameraRef = useRef<Camera>({ x: 0, y: 0, zoom: 1 })
    const viewportRef = useRef<Viewport>({ width: 0, height: 0 })
    const dprRef = useRef(1)
    const elementsRef = useRef<Map<string, HTMLElement>>(new Map())
    const cardsRef = useRef<BoardCard[]>(cards.map((card) => ({ ...card })))
    const selectedIdRef = useRef(selectedId)
    const modeRef = useRef(mode)
    const presentIdRef = useRef(presentId)
    const showStructureRef = useRef(showStructure)
    const onCameraChangeRef = useRef(onCameraChange)
    const onSelectRef = useRef(onSelect)
    const onCardsCommitRef = useRef(onCardsCommit)
    const onInteractionRef = useRef(onInteraction)
    const panRef = useRef<PanState | null>(null)
    const dragRef = useRef<DragState | null>(null)
    const animationRef = useRef<number | null>(null)
    const animationResolveRef = useRef<(() => void) | null>(null)
    const lastNotifyRef = useRef(0)
    const lastScaleRef = useRef(0)
    const scaleTimerRef = useRef<number | null>(null)
    const hasFittedRef = useRef(false)
    const hasInteractedRef = useRef(false)
    const [renderScale, setRenderScale] = useState(0.7)
    const [panning, setPanning] = useState(false)
    const [dragging, setDragging] = useState(false)

    selectedIdRef.current = selectedId
    modeRef.current = mode
    presentIdRef.current = presentId
    showStructureRef.current = showStructure
    onCameraChangeRef.current = onCameraChange
    onSelectRef.current = onSelect
    onCardsCommitRef.current = onCardsCommit
    onInteractionRef.current = onInteraction

    useEffect(() => {
      if (!dragRef.current) {
        cardsRef.current = cards.map((card) => ({ ...card }))
      }
    }, [cards])

    const notifyCamera = useCallback((force = false) => {
      const now = performance.now()
      if (!force && now - lastNotifyRef.current < 70) return
      lastNotifyRef.current = now
      onCameraChangeRef.current(cameraRef.current)
    }, [])

    const scheduleRenderScale = useCallback((zoom: number) => {
      const now = performance.now()
      if (now - lastScaleRef.current > 150) {
        lastScaleRef.current = now
        setRenderScale(zoom)
      }
      if (scaleTimerRef.current !== null) {
        window.clearTimeout(scaleTimerRef.current)
      }
      scaleTimerRef.current = window.setTimeout(() => {
        scaleTimerRef.current = null
        lastScaleRef.current = performance.now()
        setRenderScale(cameraRef.current.zoom)
      }, 170)
    }, [])

    const cancelAnimation = useCallback(() => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      if (animationResolveRef.current) {
        animationResolveRef.current()
        animationResolveRef.current = null
      }
    }, [])

    const animateTo = useCallback(
      (
        target: Camera,
        options?: { duration?: number; scale?: number },
      ): Promise<void> => {
        const canvas = canvasRef.current
        if (!canvas || !viewportRef.current.width) {
          cameraRef.current = target
          return Promise.resolve()
        }

        cancelAnimation()
        const nextScale = options?.scale
        if (nextScale !== undefined) {
          setRenderScale(nextScale)
        }

        const start = { ...cameraRef.current }
        const duration = prefersReducedMotion() ? 1 : (options?.duration ?? 720)
        const startTime = performance.now()

        return new Promise<void>((resolve) => {
          const begin = () => {
            const tick = (now: number) => {
              const progress = Math.min(1, (now - startTime) / duration)
              const eased = easeInOutCubic(progress)
              cameraRef.current = lerpCamera(start, target, eased)
              notifyCamera()
              canvas.requestPaint()
              if (progress < 1) {
                animationRef.current = requestAnimationFrame(tick)
              } else {
                cameraRef.current = target
                animationRef.current = null
                notifyCamera(true)
                canvas.requestPaint()
                animationResolveRef.current = null
                resolve()
              }
            }
            animationRef.current = requestAnimationFrame(tick)
          }

          animationResolveRef.current = resolve
          if (options?.scale !== undefined) {
            requestAnimationFrame(begin)
          } else {
            begin()
          }
        })
      },
      [cancelAnimation, notifyCamera],
    )

    const fit = useCallback(
      (animate = false) => {
        const viewport = viewportRef.current
        if (!viewport.width) return
        const target = fitCamera(viewport, BOARD_BOUNDS, getInsets(viewport))
        hasInteractedRef.current = false
        if (animate) {
          const scale = Math.max(cameraRef.current.zoom, target.zoom)
          void animateTo(target, { duration: 720, scale })
        } else {
          cameraRef.current = target
          setRenderScale(target.zoom)
          notifyCamera(true)
          canvasRef.current?.requestPaint()
        }
      },
      [animateTo, notifyCamera],
    )

    const showCard = useCallback(
      (cardId: string, animate = true): Promise<void> => {
        const card = cardsRef.current.find((item) => item.id === cardId)
        if (!card) return Promise.resolve()
        hasInteractedRef.current = true
        const viewport = viewportRef.current
        const maxCardWidth = Math.max(
          ...cardsRef.current.map((item) => item.width),
        )
        const maxCardHeight = Math.max(
          ...cardsRef.current.map((item) => item.height),
        )
        const scale = clamp(
          Math.min(
            (viewport.width - 32) / maxCardWidth,
            (viewport.height - 32) / maxCardHeight,
          ),
          1.4,
          3.2,
        )
        const target = presentCamera(card, viewport)
        if (!animate) {
          setRenderScale(scale)
          cameraRef.current = target
          notifyCamera(true)
          canvasRef.current?.requestPaint()
          return Promise.resolve()
        }
        return animateTo(target, {
          duration: 760,
          scale,
        })
      },
      [animateTo, notifyCamera],
    )

    const setCamera = useCallback(
      (camera: Camera) => {
        cancelAnimation()
        cameraRef.current = camera
        notifyCamera(true)
        canvasRef.current?.requestPaint()
      },
      [cancelAnimation, notifyCamera],
    )

    const zoomBy = useCallback(
      (factor: number) => {
        const viewport = viewportRef.current
        const camera = cameraRef.current
        const nextZoom = clamp(camera.zoom * factor, MIN_ZOOM, MAX_ZOOM)
        cameraRef.current = zoomAroundPoint(
          camera,
          viewport.width / 2,
          viewport.height / 2,
          nextZoom,
        )
        hasInteractedRef.current = true
        notifyCamera(true)
        canvasRef.current?.requestPaint()
        scheduleRenderScale(nextZoom)
        onInteractionRef.current()
      },
      [notifyCamera, scheduleRenderScale],
    )

    useImperativeHandle(
      ref,
      () => ({
        fit,
        showCard,
        animateTo,
        setCamera,
        getCamera: () => cameraRef.current,
        getViewport: () => viewportRef.current,
        getCanvas: () => canvasRef.current,
        requestPaint: () => canvasRef.current?.requestPaint(),
        zoomBy,
        focusCard: (cardId: string) => {
          elementsRef.current.get(cardId)?.focus({ preventScroll: true })
        },
      }),
      [fit, showCard, animateTo, setCamera, zoomBy],
    )

    useLayoutEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const resize = () => {
        const rect = canvas.getBoundingClientRect()
        const width = Math.max(1, rect.width)
        const height = Math.max(1, rect.height)
        const dpr = window.devicePixelRatio || 1
        viewportRef.current = { width, height }
        dprRef.current = dpr
        const backingWidth = Math.round(width * dpr)
        const backingHeight = Math.round(height * dpr)
        if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
          canvas.width = backingWidth
          canvas.height = backingHeight
        }
        if (!hasFittedRef.current) {
          hasFittedRef.current = true
          fit(false)
        } else if (!hasInteractedRef.current) {
          fit(false)
        } else {
          canvas.requestPaint()
        }
      }

      const observer = new ResizeObserver(resize)
      observer.observe(canvas)
      window.addEventListener('resize', resize)
      resize()
      return () => {
        observer.disconnect()
        window.removeEventListener('resize', resize)
      }
    }, [fit])

    useLayoutEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const map = new Map<string, HTMLElement>()
      canvas
        .querySelectorAll<HTMLElement>('[data-card-id]')
        .forEach((element) => {
          const id = element.dataset.cardId
          if (id) map.set(id, element)
        })
      elementsRef.current = map
      canvas.requestPaint()
    }, [cards])

    useLayoutEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const context = canvas.getContext('2d')
      if (!context) return

      const paint = () => {
        const viewport = viewportRef.current
        if (!viewport.width || !viewport.height) return
        renderBoard({
          ctx: context,
          viewport,
          camera: cameraRef.current,
          cards: cardsRef.current,
          connections,
          elements: elementsRef.current,
          selectedId: selectedIdRef.current,
          mode: modeRef.current,
          presentId: presentIdRef.current,
          showStructure: showStructureRef.current,
          dpr: dprRef.current,
        })
      }

      canvas.addEventListener('paint', paint)
      canvas.requestPaint()
      let cancelled = false
      document.fonts?.ready
        .then(() => {
          if (!cancelled) canvas.requestPaint()
        })
        .catch(() => {
          // Font loading can fail in restricted environments.
        })
      return () => {
        cancelled = true
        canvas.removeEventListener('paint', paint)
      }
    }, [connections])

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.requestPaint()
    }, [selectedId, mode, presentId, showStructure, cards, renderScale])

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const handleWheel = (event: WheelEvent) => {
        if (modeRef.current === 'present') return
        event.preventDefault()
        hasInteractedRef.current = true
        onInteractionRef.current()

        const rect = canvas.getBoundingClientRect()
        const px = event.clientX - rect.left
        const py = event.clientY - rect.top
        const camera = cameraRef.current
        const delta = event.deltaY * (event.ctrlKey ? 0.0045 : 0.0016)
        const nextZoom = clamp(
          camera.zoom * Math.exp(-delta),
          MIN_ZOOM,
          MAX_ZOOM,
        )
        if (Math.abs(nextZoom - camera.zoom) < 0.0001) return

        cameraRef.current = zoomAroundPoint(camera, px, py, nextZoom)
        notifyCamera()
        canvas.requestPaint()
        scheduleRenderScale(nextZoom)
      }

      canvas.addEventListener('wheel', handleWheel, { passive: false })
      return () => canvas.removeEventListener('wheel', handleWheel)
    }, [notifyCamera, scheduleRenderScale])

    useEffect(() => {
      return () => {
        if (scaleTimerRef.current !== null) {
          window.clearTimeout(scaleTimerRef.current)
        }
        cancelAnimation()
      }
    }, [cancelAnimation])

    const handleCardPointerDown = useCallback(
      (event: ReactPointerEvent<HTMLElement>, card: BoardCard) => {
        if (modeRef.current === 'present' && presentIdRef.current !== card.id) {
          return
        }
        event.stopPropagation()
        onSelectRef.current(card.id)
        if (showStructureRef.current || modeRef.current === 'present') {
          return
        }
        const target = event.target as HTMLElement
        if (!target.closest('[data-drag-handle]')) {
          onInteractionRef.current()
          return
        }
        if (event.button !== 0) return

        event.preventDefault()
        const element = event.currentTarget
        element.setPointerCapture(event.pointerId)
        element.focus({ preventScroll: true })
        dragRef.current = {
          id: card.id,
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          cardX: card.x,
          cardY: card.y,
          zoom: cameraRef.current.zoom,
          moved: false,
        }
        hasInteractedRef.current = true
        setDragging(true)
        onInteractionRef.current()
      },
      [],
    )

    const handleCanvasPointerDown = useCallback(
      (event: ReactPointerEvent<HTMLCanvasElement>) => {
        if (event.button !== 0) return
        if (event.target !== event.currentTarget) return
        if (modeRef.current === 'present') return

        const canvas = event.currentTarget
        canvas.setPointerCapture(event.pointerId)
        panRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          cameraX: cameraRef.current.x,
          cameraY: cameraRef.current.y,
          moved: false,
        }
        hasInteractedRef.current = true
        setPanning(true)
        onInteractionRef.current()
      },
      [],
    )

    const handleCanvasPointerMove = useCallback(
      (event: ReactPointerEvent<HTMLCanvasElement>) => {
        const drag = dragRef.current
        if (drag) {
          const dx = (event.clientX - drag.startX) / drag.zoom
          const dy = (event.clientY - drag.startY) / drag.zoom
          if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
            drag.moved = true
          }
          const card = cardsRef.current.find((item) => item.id === drag.id)
          if (card) {
            card.x = drag.cardX + dx
            card.y = drag.cardY + dy
            canvasRef.current?.requestPaint()
            onInteractionRef.current()
          }
          return
        }

        const pan = panRef.current
        if (!pan) return
        const dx = event.clientX - pan.startX
        const dy = event.clientY - pan.startY
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          pan.moved = true
        }
        cameraRef.current = {
          ...cameraRef.current,
          x: pan.cameraX + dx,
          y: pan.cameraY + dy,
        }
        notifyCamera()
        canvasRef.current?.requestPaint()
      },
      [notifyCamera],
    )

    const handleCanvasPointerUp = useCallback(() => {
      const drag = dragRef.current
      if (drag) {
        dragRef.current = null
        setDragging(false)
        if (drag.moved) {
          onCardsCommitRef.current(
            cardsRef.current.map((card) => ({ ...card })),
          )
        }
        return
      }

      const pan = panRef.current
      if (pan) {
        panRef.current = null
        setPanning(false)
        if (!pan.moved) {
          onSelectRef.current(null)
        }
      }
    }, [])

    return (
      <canvas
        ref={canvasRef}
        className={`board-canvas${panning ? ' is-panning' : ''}${dragging ? ' is-dragging' : ''}`}
        content="drawable"
        layoutsubtree=""
        aria-label="Throughline board. Drag the background to pan, scroll to zoom, and tab through the cards to explore the real HTML content."
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onPointerCancel={handleCanvasPointerUp}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            editable={editable}
            scale={renderScale}
            selected={selectedId === card.id && mode === 'explore'}
            interactive={
              !showStructure && (mode === 'explore' || card.id === presentId)
            }
            onPointerDown={handleCardPointerDown}
            onHeadlineChange={onHeadlineChange}
            onHeadlineChoice={onHeadlineChoice}
            onChecklistToggle={onChecklistToggle}
            onApprove={onApprove}
          />
        ))}
      </canvas>
    )
  },
)
