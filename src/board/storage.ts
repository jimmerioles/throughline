import type { EditableState, SavedBoard } from './types'

const STORAGE_KEY = 'throughline:board:v1'

export function loadSaved(): SavedBoard | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<SavedBoard>
    if (parsed.version !== 1 || !parsed.positions || !parsed.editable) {
      return null
    }
    return parsed as SavedBoard
  } catch {
    return null
  }
}

export function saveBoard(positions: SavedBoard['positions'], editable: EditableState) {
  try {
    const payload: SavedBoard = {
      version: 1,
      positions,
      editable,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Storage can be unavailable in private mode. The demo still works.
  }
}

export function clearSaved() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore.
  }
}
