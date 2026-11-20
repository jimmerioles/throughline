export type CardKind =
  | 'brief'
  | 'audience'
  | 'idea'
  | 'headlines'
  | 'poster'
  | 'voice'
  | 'timeline'
  | 'checklist'
  | 'risks'
  | 'decision'

export interface BoardCard {
  id: string
  kind: CardKind
  kicker: string
  title: string
  x: number
  y: number
  width: number
  height: number
}

export interface Connection {
  from: string
  to: string
}

export interface Camera {
  x: number
  y: number
  zoom: number
}

export interface Viewport {
  width: number
  height: number
}

export interface EditableState {
  headlines: string[]
  headlineChoice: number
  checklist: boolean[]
  approved: boolean
}

export interface PresentStep {
  cardId: string
  title: string
  narration: string
}

export interface SavedBoard {
  version: 1
  positions: Record<string, Pick<BoardCard, 'x' | 'y'>>
  editable: EditableState
}
