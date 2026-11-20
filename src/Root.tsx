import { useEffect, useRef } from 'react'
import App from './App'
import { CaseStudy } from './case-study/CaseStudy'
import { useHashRoute } from './routing'
import type { HashRoute } from './routing'

const TITLES = {
  board: 'Throughline · The Lumen',
  'case-study': 'Throughline case study · Canvas speed. HTML manners.',
} as const

export function Root() {
  const route = useHashRoute()
  const previousRoute = useRef<HashRoute | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle(
      'case-study-route',
      route === 'case-study',
    )
    return () => document.documentElement.classList.remove('case-study-route')
  }, [route])

  useEffect(() => {
    document.title = TITLES[route]
    window.scrollTo(0, 0)

    if (route === 'case-study') {
      const main = document.getElementById('case-study-main')
      main?.focus({ preventScroll: true })
    } else if (previousRoute.current === 'case-study') {
      document.querySelector<HTMLElement>('[data-case-study-link]')?.focus()
    }

    previousRoute.current = route
  }, [route])

  return route === 'case-study' ? <CaseStudy /> : <App />
}
