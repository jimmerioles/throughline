import { useEffect } from 'react'
import App from './App'
import { CaseStudy } from './case-study/CaseStudy'
import { useHashRoute } from './routing'

const TITLES = {
  board: 'Throughline · The Lumen',
  'case-study': 'Throughline case study · Canvas speed. HTML manners.',
} as const

export function Root() {
  const route = useHashRoute()

  useEffect(() => {
    document.title = TITLES[route]
    if (route !== 'case-study') return

    const main = document.getElementById('case-study-main')
    main?.focus({ preventScroll: true })
  }, [route])

  return route === 'case-study' ? <CaseStudy /> : <App />
}
