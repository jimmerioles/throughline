import type { BoardCard, Camera, Viewport } from './types'

export interface Insets {
  top: number
  right: number
  bottom: number
  left: number
}

export interface Bounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export const MIN_ZOOM = 0.3
export const MAX_ZOOM = 2.8

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function fitCamera(
  viewport: Viewport,
  bounds: Bounds,
  insets: Insets,
): Camera {
  const availableWidth = Math.max(1, viewport.width - insets.left - insets.right)
  const availableHeight = Math.max(1, viewport.height - insets.top - insets.bottom)
  const boundsWidth = Math.max(1, bounds.maxX - bounds.minX)
  const boundsHeight = Math.max(1, bounds.maxY - bounds.minY)
  const zoom = clamp(
    Math.min(availableWidth / boundsWidth, availableHeight / boundsHeight),
    MIN_ZOOM,
    MAX_ZOOM,
  )

  return {
    zoom,
    x:
      insets.left +
      (availableWidth - boundsWidth * zoom) / 2 -
      bounds.minX * zoom,
    y:
      insets.top +
      (availableHeight - boundsHeight * zoom) / 2 -
      bounds.minY * zoom,
  }
}

export function presentCamera(card: BoardCard, viewport: Viewport): Camera {
  const zoom = clamp(
    Math.min(
      (viewport.width * 0.62) / card.width,
      (viewport.height * 0.56) / card.height,
    ),
    0.7,
    2.4,
  )

  const centerX = card.x + card.width / 2
  const centerY = card.y + card.height / 2

  return {
    zoom,
    x: viewport.width / 2 - centerX * zoom,
    y: viewport.height * 0.43 - centerY * zoom,
  }
}

export function zoomAroundPoint(
  camera: Camera,
  px: number,
  py: number,
  nextZoom: number,
): Camera {
  const ratio = nextZoom / camera.zoom
  return {
    zoom: nextZoom,
    x: px - (px - camera.x) * ratio,
    y: py - (py - camera.y) * ratio,
  }
}

export function screenToWorld(camera: Camera, px: number, py: number) {
  return {
    x: (px - camera.x) / camera.zoom,
    y: (py - camera.y) / camera.zoom,
  }
}

export function isCardVisible(
  card: BoardCard,
  camera: Camera,
  viewport: Viewport,
  margin = 120,
): boolean {
  const x = card.x * camera.zoom + camera.x
  const y = card.y * camera.zoom + camera.y
  const width = card.width * camera.zoom
  const height = card.height * camera.zoom
  return (
    x + width > -margin &&
    x < viewport.width + margin &&
    y + height > -margin &&
    y < viewport.height + margin
  )
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t
}

export function lerpCamera(from: Camera, to: Camera, t: number): Camera {
  return {
    x: lerp(from.x, to.x, t),
    y: lerp(from.y, to.y, t),
    zoom: lerp(from.zoom, to.zoom, t),
  }
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function sameCamera(a: Camera, b: Camera): boolean {
  return (
    Math.abs(a.x - b.x) < 0.01 &&
    Math.abs(a.y - b.y) < 0.01 &&
    Math.abs(a.zoom - b.zoom) < 0.0001
  )
}
