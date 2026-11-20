import { isCardVisible } from './camera'
import { BOARD_FOOTER, BOARD_SUBTITLE, BOARD_TITLE } from './data'
import type { BoardCard, Camera, Connection, Viewport } from './types'

const DISPLAY_FONT = '"Fraunces Variable", Georgia, serif'
const SANS_FONT = '"Instrument Sans Variable", system-ui, sans-serif'
const MONO_FONT = '"DM Mono", monospace'

const INK = '#1d1c19'
const PAPER = '#f7f1e5'
const ACCENT = '#bf4a2f'

let grainPattern: CanvasPattern | null = null

interface RenderOptions {
  ctx: CanvasRenderingContext2D
  viewport: Viewport
  camera: Camera
  cards: BoardCard[]
  connections: Connection[]
  elements: Map<string, HTMLElement>
  selectedId: string | null
  mode: 'explore' | 'present'
  presentId: string | null
  showStructure: boolean
  dpr: number
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, r)
}

function getGrain(ctx: CanvasRenderingContext2D): CanvasPattern | null {
  if (grainPattern) return grainPattern
  const tile = document.createElement('canvas')
  tile.width = 96
  tile.height = 96
  const tileContext = tile.getContext('2d')
  if (!tileContext) return null
  const image = tileContext.createImageData(96, 96)
  for (let index = 0; index < image.data.length; index += 4) {
    const value = Math.random() * 255
    image.data[index] = value
    image.data[index + 1] = value
    image.data[index + 2] = value
    image.data[index + 3] = 14
  }
  tileContext.putImageData(image, 0, 0)
  grainPattern = ctx.createPattern(tile, 'repeat')
  return grainPattern
}

function screenRect(card: BoardCard, camera: Camera) {
  return {
    x: card.x * camera.zoom + camera.x,
    y: card.y * camera.zoom + camera.y,
    width: card.width * camera.zoom,
    height: card.height * camera.zoom,
  }
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  viewport: Viewport,
  camera: Camera,
) {
  const gradient = ctx.createRadialGradient(
    viewport.width * 0.38,
    viewport.height * 0.32,
    0,
    viewport.width * 0.5,
    viewport.height * 0.5,
    Math.max(viewport.width, viewport.height) * 0.85,
  )
  gradient.addColorStop(0, '#efe7d8')
  gradient.addColorStop(1, '#e1d4be')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, viewport.width, viewport.height)

  const grain = getGrain(ctx)
  if (grain) {
    ctx.save()
    ctx.globalAlpha = 0.45
    ctx.fillStyle = grain
    ctx.fillRect(0, 0, viewport.width, viewport.height)
    ctx.restore()
  }

  let spacing = 30 * camera.zoom
  if (spacing < 13) spacing *= 2
  const offsetX = ((camera.x % spacing) + spacing) % spacing
  const offsetY = ((camera.y % spacing) + spacing) % spacing
  const radius = Math.min(1.2, Math.max(0.65, 0.9 * camera.zoom))

  ctx.save()
  ctx.fillStyle = 'rgba(29, 28, 25, 0.13)'
  ctx.beginPath()
  for (let x = offsetX; x < viewport.width; x += spacing) {
    for (let y = offsetY; y < viewport.height; y += spacing) {
      ctx.moveTo(x + radius, y)
      ctx.arc(x, y, radius, 0, Math.PI * 2)
    }
  }
  ctx.fill()
  ctx.restore()
}

function drawBoardHeading(ctx: CanvasRenderingContext2D, camera: Camera) {
  ctx.save()
  ctx.translate(camera.x, camera.y)
  ctx.scale(camera.zoom, camera.zoom)

  ctx.fillStyle = ACCENT
  ctx.fillRect(48, 34, 26, 2)

  ctx.font = `500 8.5px ${MONO_FONT}`
  ctx.fillStyle = 'rgba(29, 28, 25, 0.55)'
  ctx.fillText('SPATIAL NARRATIVE BOARD', 48, 56)

  ctx.font = `560 39px ${DISPLAY_FONT}`
  ctx.fillStyle = INK
  ctx.fillText(BOARD_TITLE, 47, 94)

  ctx.font = `400 11px ${SANS_FONT}`
  ctx.fillStyle = 'rgba(29, 28, 25, 0.62)'
  ctx.fillText(BOARD_SUBTITLE, 48, 112)

  ctx.font = `400 8px ${MONO_FONT}`
  ctx.fillStyle = 'rgba(29, 28, 25, 0.4)'
  ctx.fillText(BOARD_FOOTER.toUpperCase(), 48, 1072)

  ctx.fillStyle = 'rgba(29, 28, 25, 0.28)'
  ctx.beginPath()
  ctx.arc(39, 1069, 2.2, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

interface Anchor {
  startX: number
  startY: number
  cp1x: number
  cp1y: number
  cp2x: number
  cp2y: number
  endX: number
  endY: number
}

function anchors(
  source: ReturnType<typeof screenRect>,
  target: ReturnType<typeof screenRect>,
): Anchor {
  const sourceX = source.x + source.width / 2
  const sourceY = source.y + source.height / 2
  const targetX = target.x + target.width / 2
  const targetY = target.y + target.height / 2
  const dx = targetX - sourceX
  const dy = targetY - sourceY

  if (Math.abs(dx) >= Math.abs(dy)) {
    const right = dx >= 0
    const startX = right ? source.x + source.width : source.x
    const endX = right ? target.x : target.x + target.width
    const bend = Math.max(28, Math.abs(endX - startX) * 0.38)
    return {
      startX,
      startY: sourceY,
      cp1x: startX + (right ? bend : -bend),
      cp1y: sourceY,
      cp2x: endX + (right ? -bend : bend),
      cp2y: targetY,
      endX,
      endY: targetY,
    }
  }

  const down = dy >= 0
  const startY = down ? source.y + source.height : source.y
  const endY = down ? target.y : target.y + target.height
  const bend = Math.max(28, Math.abs(endY - startY) * 0.38)
  return {
    startX: sourceX,
    startY,
    cp1x: sourceX,
    cp1y: startY + (down ? bend : -bend),
    cp2x: targetX,
    cp2y: endY + (down ? -bend : bend),
    endX: targetX,
    endY,
  }
}

function drawConnections(
  ctx: CanvasRenderingContext2D,
  cards: BoardCard[],
  connections: Connection[],
  camera: Camera,
) {
  const byId = new Map(cards.map((card) => [card.id, card]))
  ctx.save()
  ctx.strokeStyle = 'rgba(29, 28, 25, 0.26)'
  ctx.fillStyle = 'rgba(29, 28, 25, 0.38)'
  ctx.lineWidth = 1.15
  ctx.lineCap = 'round'

  for (const connection of connections) {
    const source = byId.get(connection.from)
    const target = byId.get(connection.to)
    if (!source || !target) continue
    const start = screenRect(source, camera)
    const end = screenRect(target, camera)
    const anchor = anchors(start, end)

    ctx.beginPath()
    ctx.moveTo(anchor.startX, anchor.startY)
    ctx.bezierCurveTo(
      anchor.cp1x,
      anchor.cp1y,
      anchor.cp2x,
      anchor.cp2y,
      anchor.endX,
      anchor.endY,
    )
    ctx.stroke()

    const angle = Math.atan2(
      anchor.cp2y - anchor.endY,
      anchor.cp2x - anchor.endX,
    )
    ctx.beginPath()
    ctx.moveTo(anchor.endX, anchor.endY)
    ctx.lineTo(
      anchor.endX + Math.cos(angle + 0.55) * 6,
      anchor.endY + Math.sin(angle + 0.55) * 6,
    )
    ctx.lineTo(
      anchor.endX + Math.cos(angle - 0.55) * 6,
      anchor.endY + Math.sin(angle - 0.55) * 6,
    )
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.arc(anchor.startX, anchor.startY, 2, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

function drawCardShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  zoom: number,
  strong = false,
) {
  const radius = Math.min(7 * zoom, 18)
  ctx.save()
  ctx.shadowColor = strong ? 'rgba(20, 15, 10, 0.5)' : 'rgba(46, 34, 20, 0.2)'
  ctx.shadowBlur = (strong ? 44 : 17) * zoom
  ctx.shadowOffsetY = (strong ? 18 : 7) * zoom
  ctx.fillStyle = strong ? 'rgba(0,0,0,0.01)' : PAPER
  roundRect(ctx, x + 1, y + 1, width - 2, height - 2, radius)
  ctx.fill()
  ctx.restore()
}

function drawCard(
  ctx: CanvasRenderingContext2D,
  card: BoardCard,
  element: HTMLElement,
  camera: Camera,
  strong = false,
) {
  const rect = screenRect(card, camera)
  drawCardShadow(
    ctx,
    rect.x,
    rect.y,
    rect.width,
    rect.height,
    camera.zoom,
    strong,
  )
  ctx.drawElementImage(element, rect.x, rect.y, rect.width, rect.height)
}

function drawSelection(
  ctx: CanvasRenderingContext2D,
  card: BoardCard,
  camera: Camera,
) {
  const rect = screenRect(card, camera)
  const radius = Math.min(7 * camera.zoom + 5, 22)
  const offset = 5
  ctx.save()
  ctx.strokeStyle = ACCENT
  ctx.lineWidth = 1.5
  ctx.setLineDash([6, 4])
  roundRect(
    ctx,
    rect.x - offset,
    rect.y - offset,
    rect.width + offset * 2,
    rect.height + offset * 2,
    radius,
  )
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = ACCENT
  for (const [x, y] of [
    [rect.x - offset, rect.y - offset],
    [rect.x + rect.width + offset, rect.y - offset],
    [rect.x - offset, rect.y + rect.height + offset],
    [rect.x + rect.width + offset, rect.y + rect.height + offset],
  ]) {
    ctx.beginPath()
    ctx.arc(x, y, 2.2, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function drawStructureOverlay(
  ctx: CanvasRenderingContext2D,
  cards: BoardCard[],
  camera: Camera,
  viewport: Viewport,
) {
  ctx.save()
  ctx.fillStyle = 'rgba(18, 17, 15, 0.72)'
  ctx.fillRect(0, 0, viewport.width, viewport.height)

  cards.forEach((card, index) => {
    const rect = screenRect(card, camera)
    if (
      rect.x + rect.width < 0 ||
      rect.y + rect.height < 0 ||
      rect.x > viewport.width ||
      rect.y > viewport.height
    ) {
      return
    }

    ctx.strokeStyle = 'rgba(247, 241, 229, 0.72)'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    roundRect(
      ctx,
      rect.x + 4,
      rect.y + 4,
      rect.width - 8,
      rect.height - 8,
      Math.min(6 * camera.zoom + 3, 16),
    )
    ctx.stroke()
    ctx.setLineDash([])

    const badge = String(index + 1).padStart(2, '0')
    ctx.font = `500 10px ${MONO_FONT}`
    const badgeWidth = ctx.measureText(badge).width + 12
    ctx.fillStyle = ACCENT
    roundRect(ctx, rect.x + 8, rect.y + 8, badgeWidth, 18, 9)
    ctx.fill()
    ctx.fillStyle = PAPER
    ctx.fillText(badge, rect.x + 14, rect.y + 21)

    const label = card.title
    ctx.font = `500 10px ${SANS_FONT}`
    const labelWidth = ctx.measureText(label).width + 16
    ctx.fillStyle = 'rgba(18, 17, 15, 0.86)'
    roundRect(ctx, rect.x + 8, rect.y + rect.height - 26, labelWidth, 18, 4)
    ctx.fill()
    ctx.fillStyle = PAPER
    ctx.fillText(label, rect.x + 16, rect.y + rect.height - 13)
  })

  ctx.restore()
}

export function renderBoard(options: RenderOptions) {
  const {
    ctx,
    viewport,
    camera,
    cards,
    connections,
    elements,
    selectedId,
    mode,
    presentId,
    showStructure,
    dpr,
  } = options

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, viewport.width, viewport.height)

  drawBackground(ctx, viewport, camera)
  if (mode !== 'present') {
    drawBoardHeading(ctx, camera)
  }
  drawConnections(ctx, cards, connections, camera)

  const focusedCard =
    mode === 'present' ? cards.find((card) => card.id === presentId) : undefined

  for (const card of cards) {
    if (focusedCard && card.id === focusedCard.id) continue
    if (!isCardVisible(card, camera, viewport)) continue
    const element = elements.get(card.id)
    if (!element) continue
    drawCard(ctx, card, element, camera)
  }

  if (focusedCard) {
    const element = elements.get(focusedCard.id)
    if (element) {
      ctx.fillStyle = 'rgba(16, 15, 13, 0.84)'
      ctx.fillRect(0, 0, viewport.width, viewport.height)
      drawCard(ctx, focusedCard, element, camera, true)
    }
  }

  if (showStructure) {
    drawStructureOverlay(ctx, cards, camera, viewport)
  } else if (mode === 'explore' && selectedId) {
    const selected = cards.find((card) => card.id === selectedId)
    if (selected && isCardVisible(selected, camera, viewport, 200)) {
      drawSelection(ctx, selected, camera)
    }
  }
}
