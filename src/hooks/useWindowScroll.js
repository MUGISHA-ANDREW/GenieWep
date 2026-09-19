import { useEffect, useState } from 'react'

/**
 * Tracks vertical scroll position, throttled to one update per animation frame.
 * Used by the header to switch from transparent to solid on scroll.
 *
 * @param {number} threshold pixels after which `isScrolled` flips to true
 */
export const useWindowScroll = (threshold = 24) => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let frame = null

    const handleScroll = () => {
      if (frame !== null) return
      frame = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        frame = null
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [])

  return { scrollY, isScrolled: scrollY > threshold }
}

export default useWindowScroll
