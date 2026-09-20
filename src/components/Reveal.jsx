import { motion, useReducedMotion } from 'framer-motion'

/**
 * Scroll-triggered entrance animation, shared by every section on the site.
 *
 * Before this existed, each page hand-rolled the same `initial` / `whileInView`
 * / `transition` block with its own easing and its own idea of how far an
 * element should travel, which is how a site ends up with four slightly
 * different fades. The numbers live here now: one distance, one easing curve,
 * one viewport margin.
 *
 * `once` is the default. A section that re-animates every time it scrolls back
 * into view reads as a glitch rather than as polish on the second pass.
 *
 * On `prefers-reduced-motion` this renders the plain element with no motion
 * props at all. `MotionConfig reducedMotion="user"` in App.jsx would already
 * snap the animation to its end state, but skipping the wrapper entirely also
 * drops the IntersectionObserver that would never usefully fire.
 */

/* Travel direction. Named for where the element comes *from*. */
const OFFSETS = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: -32 },
  right: { x: 32 },
  fade: {},
}

const EASE = [0.22, 1, 0.36, 1]

export const Reveal = ({
  as = 'div',
  from = 'up',
  delay = 0,
  duration = 0.55,
  scale,
  once = true,
  margin = '-60px',
  className = '',
  children,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion()
  const Component = motion[as] ?? motion.div

  if (prefersReducedMotion) {
    const Plain = as
    return (
      <Plain className={className} {...props}>
        {children}
      </Plain>
    )
  }

  const offset = OFFSETS[from] ?? OFFSETS.up

  return (
    <Component
      initial={{ opacity: 0, ...offset, ...(scale ? { scale } : {}) }}
      whileInView={{ opacity: 1, x: 0, y: 0, ...(scale ? { scale: 1 } : {}) }}
      viewport={{ once, margin }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * Container that walks its children in, one after the next.
 *
 * `delayChildren` rather than a computed delay per child: the stagger is the
 * container's job, so a card component never has to know its own index. The
 * existing `index`-based cards (service, project, pricing) predate this and are
 * left alone — they are already staggered, just from the other direction.
 */
export const Stagger = ({
  as = 'div',
  step = 0.08,
  delay = 0,
  once = true,
  margin = '-60px',
  className = '',
  children,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion()
  const Component = motion[as] ?? motion.div

  if (prefersReducedMotion) {
    const Plain = as
    return (
      <Plain className={className} {...props}>
        {children}
      </Plain>
    )
  }

  return (
    <Component
      initial="hidden"
      whileInView="shown"
      viewport={{ once, margin }}
      transition={{ staggerChildren: step, delayChildren: delay }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * One step of a `Stagger`. Reads its state from the container through variant
 * names, so the timing stays in one place.
 */
export const StaggerItem = ({
  as = 'div',
  from = 'up',
  duration = 0.5,
  className = '',
  children,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion()
  const Component = motion[as] ?? motion.div

  if (prefersReducedMotion) {
    const Plain = as
    return (
      <Plain className={className} {...props}>
        {children}
      </Plain>
    )
  }

  const offset = OFFSETS[from] ?? OFFSETS.up

  return (
    <Component
      variants={{
        hidden: { opacity: 0, ...offset },
        shown: { opacity: 1, x: 0, y: 0 },
      }}
      transition={{ duration, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Reveal
