import { useEffect, useMemo, useState } from 'react'

import { STORAGE_KEY, ThemeContext } from '@/context/theme-context'

/** Returns 'light' | 'dark' when the visitor has chosen, or null if not. */
const readStoredPreference = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    // Private window or blocked storage — fall back to the brand default.
    return null
  }
}

/**
 * Theme state for the whole site.
 *
 * Dark is the brand default, not a preference. A visitor who has never used
 * the toggle gets the dark identity regardless of their operating system
 * setting — this site is designed dark first, and a light-mode OS should not
 * silently swap it for the secondary treatment.
 *
 * That is a deliberate change from the old behaviour, which followed
 * `prefers-color-scheme` until the visitor chose. The two are kept in step
 * with the inline script in index.html, which resolves the same rule before
 * first paint so the page never flashes the wrong theme. If you change the
 * rule here, change it there in the same commit.
 *
 * Once the visitor does use the toggle, their choice wins and persists.
 */
const DEFAULT_THEME = 'dark'

export const ThemeProvider = ({ children }) => {
  const [preference, setPreference] = useState(readStoredPreference)

  const theme = preference ?? DEFAULT_THEME

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    try {
      if (preference) {
        window.localStorage.setItem(STORAGE_KEY, preference)
      } else {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // Storage unavailable; the theme still applies for this session.
    }
  }, [preference])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      /* True until the visitor has made a choice of their own. Nothing in the
         UI reads it today; it is here so a "reset to default" control does not
         need the provider changed to exist. */
      usesDefault: preference === null,
      toggleTheme: () => setPreference(theme === 'dark' ? 'light' : 'dark'),
      setTheme: setPreference,
      resetTheme: () => setPreference(null),
    }),
    [theme, preference],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
