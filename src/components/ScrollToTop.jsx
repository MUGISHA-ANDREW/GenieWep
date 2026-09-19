import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets scroll position on route change. Without this, navigating from the
 * bottom of one page lands the visitor mid-way down the next one.
 * Honours `prefers-reduced-motion` by jumping instead of smooth-scrolling.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion ? 'auto' : 'instant' })
  }, [pathname])

  return null
}

export default ScrollToTop
