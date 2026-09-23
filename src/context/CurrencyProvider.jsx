import { useEffect, useMemo, useState } from 'react'

import { CURRENCY_STORAGE_KEY, CurrencyContext } from '@/context/currency-context'
import { BASE_CODE, detectCurrencyCode, isSupported } from '@/utils/currency'
import { fallbackRates, loadRates } from '@/utils/fx'

/** Returns a stored currency code, or null if the visitor has not chosen. */
const readStoredCode = () => {
  try {
    const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY)
    /* Validated against the bundled table rather than the live one, because
       this runs before the live table has loaded. Anything it lets through is
       re-checked once the real rates arrive. */
    return stored && isSupported(stored) ? stored : null
  } catch {
    // Private window or blocked storage — fall back to detection.
    return null
  }
}

/**
 * Which currency the price catalogue is displayed in, and the rates behind it.
 *
 * ── Order of events ─────────────────────────────────────────────────────────
 * The first render uses the bundled snapshot and UGX, so prices are on screen
 * immediately and identically for everyone — no spinner, no layout shift, and
 * nothing that depends on a network call having finished. An effect then
 * fetches live rates (cached for 12 hours) and detects the visitor's currency,
 * and the prices settle into their local form a moment later.
 *
 * Detection is deliberately *not* done in the `useState` initialiser: it reads
 * `Intl` and `navigator`, which keeps the first render cheap and lets this
 * module be imported by a test or a build script with no browser present.
 *
 * ── Three-value choice ──────────────────────────────────────────────────────
 * `choice` stays null until the visitor picks a currency themselves, so
 * detection keeps applying until they overrule it. Their pick then persists.
 */
export const CurrencyProvider = ({ children }) => {
  const [choice, setChoice] = useState(readStoredCode)
  const [detected, setDetected] = useState(BASE_CODE)
  const [fx, setFx] = useState(fallbackRates)

  useEffect(() => {
    let cancelled = false

    loadRates().then((loaded) => {
      if (cancelled) return
      setFx(loaded)
      setDetected(detectCurrencyCode(loaded.rates))
    })

    return () => {
      cancelled = true
    }
  }, [])

  const requested = choice ?? detected
  /* A currency the live table cannot price falls back to what we bill in,
     rather than rendering blanks across the catalogue. */
  const code = isSupported(requested, fx.rates) ? requested : BASE_CODE

  useEffect(() => {
    try {
      if (choice) {
        window.localStorage.setItem(CURRENCY_STORAGE_KEY, choice)
      } else {
        window.localStorage.removeItem(CURRENCY_STORAGE_KEY)
      }
    } catch {
      // Storage unavailable; the choice still applies for this session.
    }
  }, [choice])

  const value = useMemo(
    () => ({
      code,
      rates: fx.rates,
      /* The date the rates were published, and whether they came from the
         provider or from the bundled snapshot. Both are printed under the
         prices, so a stale table announces itself. */
      ratesAsOf: fx.asOf,
      ratesAreLive: fx.isLive,
      /* True while the visitor is seeing something other than the currency the
         company invoices in — which is when the UI has to say so. */
      isConverted: code !== BASE_CODE,
      /* True until they have made a choice of their own, so the switcher can
         present detection as a suggestion rather than as a decision. */
      isDetected: choice === null,
      setCurrency: setChoice,
    }),
    [code, choice, fx],
  )

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  )
}

export default CurrencyProvider
