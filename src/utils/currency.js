/**
 * Local-currency display for the price catalogue.
 *
 * ── The rule this file exists to protect ────────────────────────────────────
 * UGX is the price. Every figure in `constants.js` is a real Ugandan Shilling
 * amount the company quotes and invoices in, and nothing here changes that.
 * What this module does is *show* that amount in the visitor's own money, so a
 * buyer in Nairobi or Lagos or London does not have to open a converter to
 * find out whether a website is within budget.
 *
 * Converted figures are therefore indicative, and the UI says so wherever one
 * appears. Presenting a converted number as if it were the contract price is
 * how you end up in an argument about an invoice.
 *
 * ── Coverage ────────────────────────────────────────────────────────────────
 * Any currency the rate provider publishes — 166 of them — not a hand-picked
 * shortlist. Detection maps the visitor's country to its currency through the
 * table below; formatting is delegated to `Intl.NumberFormat`, which already
 * knows the symbol, the grouping and the symbol's position for every ISO
 * currency in existence. Hand-maintaining that would be a bug farm.
 */

import { FALLBACK_RATES } from './fx.js'

/** The currency the company actually bills in, and the ultimate fallback. */
export const BASE_CODE = 'UGX'

/* ------------------------------------------------------------------ */
/* Country -> currency                                                 */
/* ------------------------------------------------------------------ */

/**
 * ISO 3166 country to ISO 4217 currency.
 *
 * Complete enough that a visitor from anywhere the company might plausibly
 * hear from sees their own money. Countries that use a shared currency (the
 * eurozone, the CFA franc zones, the dollarised economies) are listed
 * individually, because that is the only way to get them right.
 */
const COUNTRY_CURRENCY = {
  // East Africa — the home region
  UG: 'UGX', KE: 'KES', TZ: 'TZS', RW: 'RWF', BI: 'BIF', SS: 'SSP',
  ET: 'ETB', SO: 'SOS', DJ: 'DJF', ER: 'ERN',
  // Rest of Africa
  NG: 'NGN', ZA: 'ZAR', GH: 'GHS', EG: 'EGP', MA: 'MAD', DZ: 'DZD',
  TN: 'TND', LY: 'LYD', SD: 'SDG', ZM: 'ZMW', ZW: 'ZWL', MW: 'MWK',
  MZ: 'MZN', AO: 'AOA', BW: 'BWP', NA: 'NAD', LS: 'LSL', SZ: 'SZL',
  MG: 'MGA', MU: 'MUR', SC: 'SCR', CV: 'CVE', GM: 'GMD', GN: 'GNF',
  LR: 'LRD', SL: 'SLE', CD: 'CDF', MR: 'MRU', ST: 'STN',
  // CFA franc — West (XOF)
  BJ: 'XOF', BF: 'XOF', CI: 'XOF', GW: 'XOF', ML: 'XOF', NE: 'XOF',
  SN: 'XOF', TG: 'XOF',
  // CFA franc — Central (XAF)
  CM: 'XAF', CF: 'XAF', TD: 'XAF', CG: 'XAF', GQ: 'XAF', GA: 'XAF',
  // Europe — eurozone
  AT: 'EUR', BE: 'EUR', HR: 'EUR', CY: 'EUR', EE: 'EUR', FI: 'EUR',
  FR: 'EUR', DE: 'EUR', GR: 'EUR', IE: 'EUR', IT: 'EUR', LV: 'EUR',
  LT: 'EUR', LU: 'EUR', MT: 'EUR', NL: 'EUR', PT: 'EUR', SK: 'EUR',
  SI: 'EUR', ES: 'EUR', ME: 'EUR', XK: 'EUR', AD: 'EUR', MC: 'EUR',
  SM: 'EUR', VA: 'EUR',
  // Europe — outside the euro
  GB: 'GBP', CH: 'CHF', NO: 'NOK', SE: 'SEK', DK: 'DKK', IS: 'ISK',
  PL: 'PLN', CZ: 'CZK', HU: 'HUF', RO: 'RON', BG: 'BGN', RS: 'RSD',
  UA: 'UAH', RU: 'RUB', BY: 'BYN', MD: 'MDL', MK: 'MKD', AL: 'ALL',
  BA: 'BAM', TR: 'TRY',
  // Americas
  US: 'USD', CA: 'CAD', MX: 'MXN', BR: 'BRL', AR: 'ARS', CL: 'CLP',
  CO: 'COP', PE: 'PEN', UY: 'UYU', PY: 'PYG', BO: 'BOB', VE: 'VES',
  GT: 'GTQ', CR: 'CRC', PA: 'PAB', DO: 'DOP', JM: 'JMD', TT: 'TTD',
  HN: 'HNL', NI: 'NIO', CU: 'CUP', BS: 'BSD', BB: 'BBD', BZ: 'BZD',
  HT: 'HTG', SR: 'SRD', GY: 'GYD', EC: 'USD', SV: 'USD',
  // Middle East
  AE: 'AED', SA: 'SAR', QA: 'QAR', KW: 'KWD', BH: 'BHD', OM: 'OMR',
  JO: 'JOD', LB: 'LBP', IL: 'ILS', IQ: 'IQD', IR: 'IRR', YE: 'YER',
  SY: 'SYP',
  // Asia
  IN: 'INR', PK: 'PKR', BD: 'BDT', LK: 'LKR', NP: 'NPR', CN: 'CNY',
  JP: 'JPY', KR: 'KRW', TW: 'TWD', HK: 'HKD', MO: 'MOP', SG: 'SGD',
  MY: 'MYR', ID: 'IDR', TH: 'THB', VN: 'VND', PH: 'PHP', KH: 'KHR',
  LA: 'LAK', MM: 'MMK', BN: 'BND', MN: 'MNT', KZ: 'KZT', UZ: 'UZS',
  KG: 'KGS', TJ: 'TJS', TM: 'TMT', AZ: 'AZN', GE: 'GEL', AM: 'AMD',
  AF: 'AFN', BT: 'BTN', MV: 'MVR',
  // Oceania
  AU: 'AUD', NZ: 'NZD', FJ: 'FJD', PG: 'PGK', WS: 'WST', TO: 'TOP',
  VU: 'VUV', SB: 'SBD',
}

/**
 * A curated shortlist for the switcher.
 *
 * The full table above is for *detecting* what to show someone. A dropdown of
 * 166 options is not a control, it is a phone book — so the switcher offers
 * the markets this company actually sells into, and the visitor's own currency
 * is spliced in at the top when detection finds something outside the list.
 */
export const COMMON_CODES = [
  'UGX', 'KES', 'TZS', 'RWF', 'NGN', 'ZAR', 'GHS',
  'USD', 'EUR', 'GBP', 'AED', 'INR',
]

/**
 * Symbol overrides.
 *
 * `Intl` renders UGX as "USh" in a Ugandan locale and "UGX" elsewhere. The
 * printed catalogue says UGX, so that one is pinned. The East African
 * neighbours are pinned for the opposite reason: a Kenyan should read "KSh"
 * whatever language their laptop is set to, and `Intl` only volunteers that
 * when the locale happens to be Kenyan.
 *
 * Everything else is left to `Intl`, which gets it right in 166 currencies
 * without help.
 */
const SYMBOL_OVERRIDES = {
  UGX: 'UGX',
  KES: 'KSh',
  TZS: 'TSh',
  RWF: 'RF',
}

/** Names for the shortlist. `Intl.DisplayNames` covers the rest at runtime. */
const CURRENCY_NAMES = {
  UGX: 'Ugandan Shilling',
  KES: 'Kenyan Shilling',
  TZS: 'Tanzanian Shilling',
  RWF: 'Rwandan Franc',
  NGN: 'Nigerian Naira',
  ZAR: 'South African Rand',
  GHS: 'Ghanaian Cedi',
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'Pound Sterling',
  AED: 'UAE Dirham',
  INR: 'Indian Rupee',
}

/** The display name for a currency, asking the platform before giving up. */
export const currencyName = (code) => {
  if (CURRENCY_NAMES[code]) return CURRENCY_NAMES[code]
  try {
    const names = new Intl.DisplayNames(['en'], { type: 'currency' })
    return names.of(code) ?? code
  } catch {
    return code
  }
}

/** True when the rate table can price in this currency. */
export const isSupported = (code, rates = FALLBACK_RATES) =>
  Boolean(code && rates?.[code])

/* ------------------------------------------------------------------ */
/* Detection                                                           */
/* ------------------------------------------------------------------ */

/**
 * Unambiguous IANA zones for markets worth pinning.
 *
 * Deliberately short. The language tag carries the region for most visitors;
 * this table is for the cases where it does not, and for East Africa, where a
 * zone alone is actively misleading — see `AMBIGUOUS_ZONES`.
 */
const TIMEZONE_COUNTRY = {
  'Africa/Lagos': 'NG',
  'Africa/Johannesburg': 'ZA',
  'Africa/Accra': 'GH',
  'Africa/Cairo': 'EG',
  'Europe/London': 'GB',
}

/**
 * Zones shared by several of our markets, where the zone proves nothing.
 *
 * `Africa/Kampala` and `Africa/Dar_es_Salaam` are not real zones: in the IANA
 * database they are *links* to `Africa/Nairobi`, so a browser in Kampala
 * reports Nairobi. This was confirmed on the client's own machine, which
 * returns exactly that. Mapping Nairobi straight to Kenya would quote every
 * Ugandan visitor in shillings that are not theirs, on a Ugandan company's
 * website — so the zone is marked ambiguous and resolved by language instead.
 */
const AMBIGUOUS_ZONES = {
  'Africa/Nairobi': ['UG', 'KE', 'TZ'],
}

const timezoneOf = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null
  } catch {
    return null
  }
}

const countryFromLanguage = () => {
  try {
    const tag = navigator.languages?.[0] ?? navigator.language
    if (!tag) return null
    /* `Intl.Locale` is the clean way to pull the region subtag out, but it is
       recent enough to be worth a fallback to splitting the tag by hand. */
    if (typeof Intl.Locale === 'function') {
      return new Intl.Locale(tag).region ?? null
    }
    const parts = tag.split('-')
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : null
  } catch {
    return null
  }
}

/**
 * The currency to show a first-time visitor.
 *
 * In order of confidence:
 *   1. A pinned, unambiguous timezone     -> that country's currency
 *   2. A shared East African zone whose
 *      language tag names one of the
 *      countries it covers                -> that country's currency
 *   3. A shared zone, no useful tag       -> UGX, the currency billed and the
 *                                            company's home market
 *   4. A country from the language tag    -> its currency
 *   5. Anything else                      -> UGX
 *
 * Every branch is a guess, which is why the switcher sits beside the prices
 * rather than being buried in a footer.
 */
export const detectCurrencyCode = (rates = FALLBACK_RATES) => {
  const settle = (code) => (isSupported(code, rates) ? code : BASE_CODE)

  const zone = timezoneOf()
  const language = countryFromLanguage()

  if (zone && TIMEZONE_COUNTRY[zone]) {
    return settle(COUNTRY_CURRENCY[TIMEZONE_COUNTRY[zone]])
  }

  const candidates = zone ? AMBIGUOUS_ZONES[zone] : null
  if (candidates) {
    /* Only trust the language tag here if it names a country this zone could
       actually be. An en-US tag inside East Africa tells us nothing. */
    if (language && candidates.includes(language)) {
      return settle(COUNTRY_CURRENCY[language])
    }
    return BASE_CODE
  }

  if (language && COUNTRY_CURRENCY[language]) {
    return settle(COUNTRY_CURRENCY[language])
  }
  return BASE_CODE
}

/* ------------------------------------------------------------------ */
/* Conversion                                                          */
/* ------------------------------------------------------------------ */

/**
 * Rounds a converted amount to something that reads as a price.
 *
 * A straight division produces "KSh 26,317" and "$206", which look like what
 * they are — the output of a calculator. Prices are round, so the step scales
 * with the magnitude. The loss of precision is deliberate and is exactly why
 * the UI calls these figures indicative.
 *
 * Currencies with very large units (IDR, VND, IRR) land in the top band and
 * round to the nearest hundred thousand, which is right: nobody quotes those
 * to the rupiah either.
 */
const roundToPriceStep = (amount) => {
  const abs = Math.abs(amount)
  let step
  if (abs < 100) step = 5
  else if (abs < 1_000) step = 10
  else if (abs < 10_000) step = 100
  else if (abs < 100_000) step = 1_000
  else if (abs < 1_000_000) step = 10_000
  else step = 100_000
  return Math.round(amount / step) * step
}

/**
 * Converts a UGX amount into `code`, rounded to a readable figure.
 *
 * Returns null when the amount or the rate is unusable, so the caller renders
 * nothing rather than "NaN" where a price should be.
 */
export const convertFromUGX = (amountUGX, code, rates = FALLBACK_RATES) => {
  if (typeof amountUGX !== 'number' || Number.isNaN(amountUGX)) return null
  if (code === BASE_CODE) return amountUGX

  const rate = rates?.[code]
  if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) return null

  return roundToPriceStep(amountUGX * rate)
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

const groupers = new Map()

/** A cached plain-number formatter. `Intl` instances are expensive to build. */
const grouper = (locale) => {
  const key = locale ?? 'en'
  if (!groupers.has(key)) {
    groupers.set(
      key,
      new Intl.NumberFormat(key, { maximumFractionDigits: 0 }),
    )
  }
  return groupers.get(key)
}

/**
 * The symbol for a currency: our override, else whatever `Intl` narrows it to,
 * else the ISO code.
 *
 * `narrowSymbol` throws on some older Safari builds, hence the ladder.
 */
export const symbolFor = (code) => {
  if (SYMBOL_OVERRIDES[code]) return SYMBOL_OVERRIDES[code]

  for (const display of ['narrowSymbol', 'symbol']) {
    try {
      const parts = new Intl.NumberFormat('en', {
        style: 'currency',
        currency: code,
        currencyDisplay: display,
      }).formatToParts(1)
      const symbol = parts.find((part) => part.type === 'currency')?.value
      if (symbol) return symbol
    } catch {
      /* Try the next display mode. */
    }
  }
  return code
}

/**
 * A grouped amount with its symbol attached.
 *
 * Multi-character symbols take a space ("KSh 26,000"); single glyphs do not
 * ("$206", "£154"), which is how each is conventionally written.
 */
export const formatMoney = (amount, code, { locale } = {}) => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return ''
  const symbol = symbolFor(code)
  const joiner = symbol.length > 1 ? ' ' : ''
  return `${symbol}${joiner}${grouper(locale).format(amount)}`
}

/** Symbol joined to an already-formatted amount or range. */
export const withSymbol = (formattedAmount, code) => {
  if (!formattedAmount) return ''
  const symbol = symbolFor(code)
  const joiner = symbol.length > 1 ? ' ' : ''
  return `${symbol}${joiner}${formattedAmount}`
}
