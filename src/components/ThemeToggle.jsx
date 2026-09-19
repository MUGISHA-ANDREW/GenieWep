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
      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-title transition-colors hover:bg-chip ${className}`}
    >
      {isDark ? (
        <FiSun aria-hidden="true" className="h-[1.15rem] w-[1.15rem]" />
      ) : (
        <FiMoon aria-hidden="true" className="h-[1.15rem] w-[1.15rem]" />
      )}
    </button>
  )
}

export default ThemeToggle
