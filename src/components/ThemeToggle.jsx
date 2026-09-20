import { AnimatePresence, motion } from 'framer-motion'
import { FiMoon, FiSun } from 'react-icons/fi'

import useTheme from '@/hooks/useTheme'

/**
 * Light/dark switch.
 *
 * Rendered as a real toggle button: `aria-pressed` reports the current state
 * and the label says what clicking will do, so a screen-reader user is never
 * left guessing which way the switch is facing. The icon shows the theme you
 * would move to, which is the convention most people already read correctly.
 */
export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-line text-title transition-colors hover:bg-chip ${className}`}
    >
      {/*
        The two glyphs cross-fade through a quarter turn, which makes the
        toggle feel like it moved the sun and moon rather than swapping one
        image for another. Both are absolutely positioned so neither reflows
        the button while they overlap, and `mode="wait"` keeps them from
        stacking on a fast double-click.
      */}
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isDark ? 'sun' : 'moon'}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? (
            <FiSun aria-hidden="true" className="h-[1.15rem] w-[1.15rem]" />
          ) : (
            <FiMoon aria-hidden="true" className="h-[1.15rem] w-[1.15rem]" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export default ThemeToggle
