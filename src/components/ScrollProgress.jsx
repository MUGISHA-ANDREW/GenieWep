import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'

/**
 * Reading-progress bar across the very top of the viewport.
 *
 * It sits above the sticky header (`z-60` against the header's `z-50`) and is
 * 2px tall, so it reads as an edge on the header rather than as a second bar
 * competing with it. Purely decorative — `aria-hidden`, because the scrollbar
 * already tells assistive technology where the visitor is in the document.
 *
 * `scaleX` on a full-width element rather than an animated `width`: a transform
 * stays on the compositor, so the bar cannot make scrolling janky on the
 * mid-range Android phones most of this site's traffic arrives on.
 */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()
  const prefersReducedMotion = useReducedMotion()

  /*
   * The spring smooths the trackpad-and-momentum jitter that makes a raw
   * progress bar twitch. Reduced-motion visitors get the unsmoothed value: the
   * bar still reports position, it just stops easing toward it.
   */
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: prefersReducedMotion ? scrollYProgress : smoothed }}
      className="fixed left-0 top-0 z-60 h-0.5 w-full origin-left bg-linear-to-r from-azure-600 via-azure-500 to-azure-300"
    />
  )
}

export default ScrollProgress
