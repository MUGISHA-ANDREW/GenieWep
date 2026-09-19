import { createContext } from 'react'

/**
 * Context object and storage key, kept in their own module so that
 * `ThemeProvider.jsx` exports a component and nothing else. Mixing a context
 * export into a component file breaks React Fast Refresh during development.
 */
export const STORAGE_KEY = 'geniewep-theme'

export const ThemeContext = createContext(null)
