import { describe, expect, it } from 'vitest'
import {
  clamp,
  fitCamera,
  isCardVisible,
  presentCamera,
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
})
