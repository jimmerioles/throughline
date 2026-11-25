import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clearSaved, loadSaved, saveBoard } from './storage'

const STORAGE_KEY = 'throughline:board:v1'

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
    window.localStorage.setItem(STORAGE_KEY, '{"version":1}')

    expect(loadSaved()).toBeNull()
  })

  it('treats malformed JSON as empty', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not json')

    expect(loadSaved()).toBeNull()
  })

  it('does not throw when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage is blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage is blocked')
    })
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('Storage is blocked')
    })

    expect(loadSaved()).toBeNull()
    expect(() => saveBoard({}, editable)).not.toThrow()
    expect(() => clearSaved()).not.toThrow()
  })

  it('clears saved data', () => {
    saveBoard({}, editable)
    clearSaved()

    expect(loadSaved()).toBeNull()
  })
})
