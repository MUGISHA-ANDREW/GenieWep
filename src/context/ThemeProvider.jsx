import { useEffect, useMemo, useState } from 'react'

import { STORAGE_KEY, ThemeContext } from '@/context/theme-context'

const getSystemTheme = () =>
  window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

/** Returns 'light' | 'dark' when the visitor has chosen, or null to follow the OS. */
const readStoredPreference = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    // Private window or blocked storage — fall back to following the system.
    return null
  }
}

/**
 * Theme state for the whole site.
 *
 * Three-value model behind a two-state toggle: `preference` stays null until the
 * visitor actually picks a side, so a first-time visitor inherits their OS
 * setting and keeps inheriting it if they later change it. Once they click the
 * toggle, their choice wins and persists.
 *
 * The matching `data-theme` attribute is also set by an inline script in
 * index.html before first paint, so the page never flashes the wrong theme.
 */
export const ThemeProvider = ({ children }) => {
  const [preference, setPreference] = useState(readStoredPreference)
  const [systemTheme, setSystemTheme] = useState(getSystemTheme)

  const theme = preference ?? systemTheme

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

  // Keep following the OS for as long as no explicit choice has been made.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event) => setSystemTheme(event.matches ? 'dark' : 'light')

    query.addEventListener?.('change', handleChange)
    return () => query.removeEventListener?.('change', handleChange)
  }, [])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      followsSystem: preference === null,
      toggleTheme: () => setPreference(theme === 'dark' ? 'light' : 'dark'),
      setTheme: setPreference,
      useSystemTheme: () => setPreference(null),
    }),
    [theme, preference],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
