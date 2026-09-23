import { FiMoon, FiSun } from 'react-icons/fi'

import useTheme from '@/hooks/useTheme'

/**
 * Light/dark switch.
 *
 * Dark is the brand default (see the inline script in index.html), so for most
 * visitors this reads as "switch to light" — an escape hatch rather than a
 * headline feature. The glyph swaps without a rotation: a control people touch
 * once and never look at again does not need a flourish.
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
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-dim transition-colors hover:bg-chip hover:text-title ${className}`}
    >
      {isDark ? (
        <FiSun aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" />
      ) : (
        <FiMoon aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" />
      )}
    </button>
  )
}

export default ThemeToggle
