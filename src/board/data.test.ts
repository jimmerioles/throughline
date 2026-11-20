import { describe, expect, it } from 'vitest'
import {
  BOARD_BOUNDS,
  CARDS,
  CHECKLIST_ITEMS,
  CONNECTIONS,
  DEFAULT_EDITABLE,
  PRESENT_STEPS,
} from './data'

describe('board data', () => {
  it('has unique card ids', () => {
    const ids = CARDS.map((card) => card.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('only connects known cards', () => {
    const ids = new Set(CARDS.map((card) => card.id))

    for (const connection of CONNECTIONS) {
      expect(ids.has(connection.from)).toBe(true)
      expect(ids.has(connection.to)).toBe(true)
    }
  })

  it('presents every card exactly once', () => {
    expect(PRESENT_STEPS.map((step) => step.cardId)).toEqual(
      CARDS.map((card) => card.id),
    )
  })

  it('keeps every card inside the board bounds', () => {
    for (const card of CARDS) {
      expect(card.x).toBeGreaterThanOrEqual(BOARD_BOUNDS.minX)
      expect(card.y).toBeGreaterThanOrEqual(BOARD_BOUNDS.minY)
      expect(card.x + card.width).toBeLessThanOrEqual(BOARD_BOUNDS.maxX)
      expect(card.y + card.height).toBeLessThanOrEqual(BOARD_BOUNDS.maxY)
    }
  })

  it('matches editable state to the rendered controls', () => {
    expect(DEFAULT_EDITABLE.headlines).toHaveLength(3)
    expect(DEFAULT_EDITABLE.checklist).toHaveLength(CHECKLIST_ITEMS.length)
    expect(DEFAULT_EDITABLE.headlineChoice).toBeGreaterThanOrEqual(0)
    expect(DEFAULT_EDITABLE.headlineChoice).toBeLessThan(
      DEFAULT_EDITABLE.headlines.length,
    )
  })
})
