import { describe, expect, it } from 'vitest'
import {
  MAX_ZOOM,
  MIN_ZOOM,
  clamp,
  easeInOutCubic,
  fitCamera,
  isCardVisible,
  lerpCamera,
  presentCamera,
  sameCamera,
  screenToWorld,
  zoomAroundPoint,
} from './camera'
import type { BoardCard, Viewport } from './types'

const viewport: Viewport = { width: 1440, height: 900 }
const bounds = { minX: 0, minY: 0, maxX: 1000, maxY: 1000 }
const insets = { top: 100, right: 100, bottom: 100, left: 100 }

const card: BoardCard = {
  id: 'test',
  kind: 'brief',
  kicker: '01 / Test',
  title: 'Test card',
  x: 100,
  y: 100,
  width: 300,
  height: 200,
}

describe('camera', () => {
  it('clamps values', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(11, 0, 10)).toBe(10)
  })

  it('fits bounds inside the insets and centers them', () => {
    const camera = fitCamera(viewport, bounds, insets)
    const centerX = (insets.left + (viewport.width - insets.right)) / 2
    const centerY = (insets.top + (viewport.height - insets.bottom)) / 2

    expect(camera.zoom).toBeGreaterThan(0)
    expect(
      ((bounds.minX + bounds.maxX) / 2) * camera.zoom + camera.x,
    ).toBeCloseTo(centerX)
    expect(
      ((bounds.minY + bounds.maxY) / 2) * camera.zoom + camera.y,
    ).toBeCloseTo(centerY)
  })

  it('keeps the point under the pointer fixed while zooming', () => {
    const camera = { x: 40, y: 30, zoom: 0.8 }
    const pointer = { x: 600, y: 400 }
    const before = screenToWorld(camera, pointer.x, pointer.y)
    const next = zoomAroundPoint(camera, pointer.x, pointer.y, 1.6)
    const after = screenToWorld(next, pointer.x, pointer.y)

    expect(after.x).toBeCloseTo(before.x)
    expect(after.y).toBeCloseTo(before.y)
    expect(next.zoom).toBe(1.6)
  })

  it('centers a card for presentation', () => {
    const camera = presentCamera(card, viewport)
    const centerX = (card.x + card.width / 2) * camera.zoom + camera.x
    const centerY = (card.y + card.height / 2) * camera.zoom + camera.y

    expect(centerX).toBeCloseTo(viewport.width / 2)
    expect(centerY).toBeCloseTo(viewport.height * 0.43)
  })

  it('culls cards outside the viewport', () => {
    const camera = { x: 0, y: 0, zoom: 1 }

    expect(isCardVisible(card, camera, viewport)).toBe(true)
    expect(isCardVisible({ ...card, x: 2000, y: 2000 }, camera, viewport)).toBe(
      false,
    )
  })

  it('keeps a margin around cards near the viewport edge', () => {
    const camera = { x: 0, y: 0, zoom: 1 }

    expect(
      isCardVisible({ ...card, x: -card.width - 100, y: 0 }, camera, viewport),
    ).toBe(true)
    expect(
      isCardVisible({ ...card, x: -card.width - 200, y: 0 }, camera, viewport),
    ).toBe(false)
  })

  it('clamps fit and presentation zoom at both ends', () => {
    const hugeBounds = { minX: 0, minY: 0, maxX: 100000, maxY: 100000 }
    const tinyBounds = { minX: 0, minY: 0, maxX: 1, maxY: 1 }

    expect(fitCamera(viewport, hugeBounds, insets).zoom).toBe(MIN_ZOOM)
    expect(fitCamera(viewport, tinyBounds, insets).zoom).toBe(MAX_ZOOM)
    expect(
      presentCamera({ ...card, width: 10000, height: 10000 }, viewport).zoom,
    ).toBe(0.7)
    expect(presentCamera({ ...card, width: 1, height: 1 }, viewport).zoom).toBe(
      2.4,
    )
  })

  it('interpolates between cameras', () => {
    const from = { x: 0, y: 0, zoom: 1 }
    const to = { x: 100, y: 200, zoom: 2 }

    expect(lerpCamera(from, to, 0)).toEqual(from)
    expect(lerpCamera(from, to, 0.5)).toEqual({ x: 50, y: 100, zoom: 1.5 })
    expect(lerpCamera(from, to, 1)).toEqual(to)
  })

  it('eases camera motion and compares cameras within tolerance', () => {
    const from = { x: 0, y: 0, zoom: 1 }

    expect(easeInOutCubic(0)).toBe(0)
    expect(easeInOutCubic(0.25)).toBeCloseTo(0.0625)
    expect(easeInOutCubic(0.5)).toBe(0.5)
    expect(easeInOutCubic(0.75)).toBeCloseTo(0.9375)
    expect(easeInOutCubic(1)).toBe(1)
    expect(sameCamera(from, { x: 0.005, y: 0.005, zoom: 1.00005 })).toBe(true)
    expect(sameCamera(from, { x: 0.02, y: 0, zoom: 1 })).toBe(false)
  })
})
