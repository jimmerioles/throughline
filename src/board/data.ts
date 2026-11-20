import type { BoardCard, Connection, EditableState, PresentStep } from './types'

export const BOARD_TITLE = 'The Lumen'
export const BOARD_SUBTITLE = 'A reopening campaign · Dec 2026'
export const BOARD_FOOTER =
  'Throughline · a spatial narrative board · made with HTML-in-Canvas'

export const CARDS: BoardCard[] = [
  {
    id: 'brief',
    kind: 'brief',
    kicker: '01 / The brief',
    title: 'Reopen The Lumen',
    x: 40,
    y: 140,
    width: 340,
    height: 250,
  },
  {
    id: 'audience',
    kind: 'audience',
    kicker: '02 / Audience',
    title: 'Lapsed regulars',
    x: 420,
    y: 70,
    width: 280,
    height: 260,
  },
  {
    id: 'idea',
    kind: 'idea',
    kicker: '03 / The big idea',
    title: 'The big idea',
    x: 740,
    y: 120,
    width: 340,
    height: 250,
  },
  {
    id: 'headlines',
    kind: 'headlines',
    kicker: '04 / Headlines',
    title: 'Headline options',
    x: 1120,
    y: 60,
    width: 340,
    height: 360,
  },
  {
    id: 'poster',
    kind: 'poster',
    kicker: '05 / Poster',
    title: 'Poster direction',
    x: 1500,
    y: 100,
    width: 260,
    height: 370,
  },
  {
    id: 'voice',
    kind: 'voice',
    kicker: '06 / Voice',
    title: 'Voice principles',
    x: 420,
    y: 350,
    width: 280,
    height: 250,
  },
  {
    id: 'timeline',
    kind: 'timeline',
    kicker: '07 / Timeline',
    title: 'Launch timeline',
    x: 740,
    y: 420,
    width: 380,
    height: 250,
  },
  {
    id: 'checklist',
    kind: 'checklist',
    kicker: '08 / Opening night',
    title: 'Opening night checklist',
    x: 1160,
    y: 430,
    width: 300,
    height: 300,
  },
  {
    id: 'risks',
    kind: 'risks',
    kicker: '09 / Risks',
    title: 'Risks',
    x: 420,
    y: 640,
    width: 300,
    height: 250,
  },
  {
    id: 'decision',
    kind: 'decision',
    kicker: '10 / The decision',
    title: 'The decision',
    x: 1120,
    y: 760,
    width: 340,
    height: 240,
  },
]

export const CONNECTIONS: Connection[] = [
  { from: 'brief', to: 'audience' },
  { from: 'audience', to: 'idea' },
  { from: 'idea', to: 'headlines' },
  { from: 'headlines', to: 'poster' },
  { from: 'idea', to: 'voice' },
  { from: 'voice', to: 'timeline' },
  { from: 'headlines', to: 'timeline' },
  { from: 'timeline', to: 'checklist' },
  { from: 'checklist', to: 'decision' },
  { from: 'risks', to: 'decision' },
  { from: 'idea', to: 'risks' },
]

export const PRESENT_STEPS: PresentStep[] = [
  {
    cardId: 'brief',
    title: 'The brief',
    narration:
      'The Lumen has been dark for two years. The job is to make opening night feel like the neighborhood’s living room.',
  },
  {
    cardId: 'audience',
    title: 'The audience',
    narration:
      'Our people are lapsed regulars. They do not need more films. They need a reason to leave the house.',
  },
  {
    cardId: 'idea',
    title: 'The big idea',
    narration:
      'A cinema is a room full of strangers feeling the same thing. That is the product. Sell the feeling, not the film.',
  },
  {
    cardId: 'headlines',
    title: 'The headlines',
    narration:
      'Three ways in. Edit a line and the board updates. The campaign follows whichever headline leads.',
  },
  {
    cardId: 'poster',
    title: 'The poster',
    narration:
      'Two colors, one image, no nostalgia for its own sake. The marquee does the rest.',
  },
  {
    cardId: 'voice',
    title: 'The voice',
    narration:
      'Warm, wry, inviting. We saved you a seat. Never clever for the sake of being clever.',
  },
  {
    cardId: 'timeline',
    title: 'The timeline',
    narration:
      'Six weeks from the first teaser to opening night. Tickets drop two weeks before the doors open.',
  },
  {
    cardId: 'checklist',
    title: 'Opening night',
    narration:
      'The room is ready when the details are. Print, staff, marquee, press, and the lobby playlist.',
  },
  {
    cardId: 'risks',
    title: 'The risks',
    narration:
      'The biggest risk is nostalgia without relevance. The mitigation is to lead with the feeling, not the past.',
  },
  {
    cardId: 'decision',
    title: 'The decision',
    narration:
      'Approve the direction and production starts Monday. That is the whole job of this board.',
  },
]

export const DEFAULT_EDITABLE: EditableState = {
  headlines: [
    'Stories worth leaving the house for.',
    'The dark is better together.',
    'Come for the film. Stay for the feeling.',
  ],
  headlineChoice: 0,
  checklist: [true, true, false, true, false],
  approved: false,
}

export const CHECKLIST_ITEMS = [
  { label: 'Final print test', owner: 'Projection' },
  { label: 'Staff briefing', owner: 'House' },
  { label: 'Marquee letters', owner: 'Facilities' },
  { label: 'Press list confirmed', owner: 'Comms' },
  { label: 'Lobby playlist', owner: 'Mara' },
]

export const RISKS = [
  { label: 'Nostalgia without relevance', level: 'high' },
  { label: 'Ticket price feels high', level: 'medium' },
  { label: 'Opening night overshadows the run', level: 'low' },
]

export const TIMELINE = [
  { date: 'Nov 03', label: 'Teaser posters' },
  { date: 'Nov 17', label: 'Ticket drop' },
  { date: 'Dec 05', label: 'Press night' },
  { date: 'Dec 12', label: 'Opening night' },
]

export const BOARD_BOUNDS = {
  minX: 20,
  minY: 20,
  maxX: 1800,
  maxY: 1100,
}
