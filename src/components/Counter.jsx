import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/**
 * A number that counts up the first time it scrolls into view.
 *
 * Used on the hero trust strip, where the figures are the whole point of the
 * row: animating them is what makes a visitor read "5 years" rather than skim
 * past it. It counts once and then stays put.
 *
 * The value starts at its final number, not at zero, whenever it cannot be
 * animated — reduced-motion visitors, and any browser without
 * IntersectionObserver, where `useInView` would never report the element as
 * visible and the strip would sit on zeroes forever.
 */
const canObserve = () => typeof IntersectionObserver !== 'undefined'

export const Counter = ({ to, duration = 1.4, suffix = '', className = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const prefersReducedMotion = useReducedMotion()
  const isStatic = prefersReducedMotion || !canObserve()

  const [value, setValue] = useState(isStatic ? to : 0)

  useEffect(() => {
    if (isStatic || !isInView) return undefined

    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    })

    return () => controls.stop()
  }, [isInView, isStatic, to, duration])

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  )
}

export default Counter
