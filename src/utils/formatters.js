/**
 * Money and text formatting.
 *
 * Every UGX value rendered anywhere on the site goes through this module, so a
 * price range never gets hand-typed into JSX and drift from the catalogue is
 * impossible. See PROJECT_BRIEF.md §9.
 *
 * Price objects come from `utils/constants.js` and have the shape:
 *   { min: number, max?: number, openEnded?: boolean }
 */

const CURRENCY = 'UGX'

const groupedNumber = new Intl.NumberFormat('en-UG', {
  maximumFractionDigits: 0,
})

/**
 * Full UGX amount, e.g. formatUGX(800000) -> "UGX 800,000".
 * `currencyDisplay: 'code'` is deliberately avoided: some runtimes render UGX
 * as "USh" or insert a non-breaking space, which would make the site disagree
 * with the printed catalogue.
 */
export const formatUGX = (amount) => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return ''
  return `${CURRENCY} ${groupedNumber.format(amount)}`
}

/** Number only, no currency code: 800000 -> "800,000". */
export const formatAmount = (amount) => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return ''
  return groupedNumber.format(amount)
}

/**
 * Compact form used by the catalogue's tables: 2_000_000 -> "2M",
 * 3_500_000 -> "3.5M", 350_000 -> "350K".
 */
export const formatCompact = (amount) => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return ''

  if (Math.abs(amount) >= 1_000_000) {
    const millions = amount / 1_000_000
    return `${trimTrailingZero(millions)}M`
  }

  if (Math.abs(amount) >= 1_000) {
    const thousands = amount / 1_000
    return `${trimTrailingZero(thousands)}K`
  }

  return groupedNumber.format(amount)
}

const trimTrailingZero = (value) =>
  value
    .toFixed(1)
    .replace(/\.0$/, '')
    .replace(/(\.\d)0$/, '$1')

/**
 * Render a price object exactly as the catalogue does.
 *
 *   formatPrice({ min: 800000 })                       -> "UGX 800,000"
 *   formatPrice({ min: 2800000, max: 4000000 })        -> "UGX 2,800,000 – 4,000,000"
 *   formatPrice({ min: 8e6, max: 2e7, openEnded: true },
 *               { compact: true })                     -> "8M – 20M+"
 *
 * The currency code is printed once, matching the catalogue's own typography.
 * An en dash (–) separates the bounds, not a hyphen.
 */
export const formatPrice = (price, { compact = false, withCurrency = true } = {}) => {
  if (!price || typeof price.min !== 'number') return ''

  const format = compact ? formatCompact : formatAmount
  const prefix = withCurrency ? `${CURRENCY} ` : ''

  const hasRange = typeof price.max === 'number' && price.max !== price.min
  const suffix = price.openEnded ? '+' : ''

  if (!hasRange) {
    return `${prefix}${format(price.min)}${suffix}`
  }

  return `${prefix}${format(price.min)} – ${format(price.max)}${suffix}`
}

/**
 * Price plus a billing unit: "UGX 100,000 – 350,000 / month".
 * `unit` is null for one-off services, which then render without a suffix.
 */
export const formatPriceWithUnit = (price, unit, options) => {
  const base = formatPrice(price, options)
  if (!base) return ''
  return unit ? `${base} / ${unit}` : base
}

/** "Starting from" label used on summary cards. */
export const formatFromPrice = (price, options) =>
  price ? `From ${formatPrice({ min: price.min }, options)}` : ''

/* ------------------------------------------------------------------ */
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */

/** Strip the protocol for display: "https://scaval.com" -> "scaval.com". */
export const formatDomain = (url) => {
  if (!url) return ''
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

/** Long-form date for blog posts / case studies. */
export const formatDate = (value) => {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-UG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
