import { useEffect, useState } from 'react'

export type HashRoute = 'board' | 'case-study'

const CASE_STUDY_HASH = '#/case-study'

export function parseHashRoute(hash: string): HashRoute {
  const path = hash.replace(/^#/, '').replace(/\/+$/, '')
  return path === '/case-study' ? 'case-study' : 'board'
}

export function caseStudyHref(): string {
  return CASE_STUDY_HASH
}

export function useHashRoute(): HashRoute {
  const [route, setRoute] = useState<HashRoute>(() =>
    parseHashRoute(window.location.hash),
  )

  useEffect(() => {
    const update = () => setRoute(parseHashRoute(window.location.hash))
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  return route
}
