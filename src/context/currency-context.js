import { createContext } from 'react'

/**
 * Context object and storage key, kept in their own module so that
 * `CurrencyProvider.jsx` exports a component and nothing else. Mixing a
 * context export into a component file breaks React Fast Refresh.
 */
export const CURRENCY_STORAGE_KEY = 'geniewep-currency'

export const CurrencyContext = createContext(null)
