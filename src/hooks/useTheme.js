import { useContext } from 'react'

import { ThemeContext } from '@/context/theme-context'

/** Reads the current theme. Throws if used outside the provider, which is a bug. */
export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (context === null) {
    throw new Error('useTheme must be used inside a ThemeProvider.')
  }

  return context
}

export default useTheme
