import { beforeEach, describe, expect, it } from 'vitest'
import { clearSaved, loadSaved, saveBoard } from './storage'

const editable = {
  headlines: ['one', 'two', 'three'],
  headlineChoice: 1,
  checklist: [true, false, true, false, true],
  approved: true,
}

describe('storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('round-trips board state', () => {
    saveBoard({ brief: { x: 1, y: 2 } }, editable)

    expect(loadSaved()).toEqual({
      version: 1,
      positions: { brief: { x: 1, y: 2 } },
      editable,
    })
  })

  it('ignores invalid saved data', () => {
    window.localStorage.setItem('throughline:board:v1', '{"version":1}')

    expect(loadSaved()).toBeNull()
  })

  it('clears saved data', () => {
    saveBoard({}, editable)
    clearSaved()

    expect(loadSaved()).toBeNull()
  })
})
