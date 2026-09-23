/**
 * Exchange rates, for displaying the UGX catalogue in a visitor's own money.
 *
 * ── What a rate here means ──────────────────────────────────────────────────
 * Every number is "how many units of that currency one UGX buys". UGX is 1 by
 * definition, and it is the only figure on this site that is not a display
 * convenience: the catalogue is priced, quoted and invoiced in shillings.
 *
 * ── Live first, snapshot second ─────────────────────────────────────────────
 * Rates are fetched once per session from open.er-api.com, which is free,
 * needs no API key and republishes daily across 166 currencies. The result is
 * cached in localStorage for 12 hours so a returning visitor pays no network
 * cost at all.
 *
 * If that request fails — offline, blocked, rate-limited, provider down — the
 * snapshot below takes over and the prices still render. That is the whole
 * reason the snapshot exists: a marketing page must never show a blank where a
 * price should be because somebody else's API had a bad morning.
 *
 * The snapshot is a real capture from 23 September 2026. It ages, which is
 * exactly why `asOf` travels with the rates and is printed under the prices —
 * a stale table announces itself instead of quietly misquoting.
 *
 * Regenerate it with:
 *   curl -s https://open.er-api.com/v6/latest/UGX -o rates.json
 * then update the table and `FALLBACK_AS_OF` together in one commit.
 */

/** Human-readable date of the bundled snapshot. */
export const FALLBACK_AS_OF = '23 September 2026'

const ENDPOINT = 'https://open.er-api.com/v6/latest/UGX'
const CACHE_KEY = 'geniewep-fx'
const CACHE_TTL_MS = 12 * 60 * 60 * 1000
const REQUEST_TIMEOUT_MS = 6000

/** UGX -> currency. One UGX buys this many units. */
export const FALLBACK_RATES = Object.freeze({
  AED: 0.000949,
  AFN: 0.016415,
  ALL: 0.020243,
  AMD: 0.092257,
  ANG: 0.000462,
  AOA: 0.241313,
  ARS: 0.391066,
  AUD: 0.000357,
  AWG: 0.000462,
  AZN: 0.000432,
  BAM: 0.000441,
  BBD: 0.000517,
  BDT: 0.031192,
  BGN: 0.000441,
  BHD: 9.7e-05,
  BIF: 0.764706,
  BMD: 0.000258,
  BND: 0.000326,
  BOB: 0.002794,
  BRL: 0.001306,
  BSD: 0.000258,
  BTN: 0.024452,
  BWP: 0.003604,
  BYN: 0.000773,
  BZD: 0.000517,
  CAD: 0.000357,
  CDF: 0.586915,
  CHF: 0.000212,
  CLF: 6e-06,
  CLP: 0.240741,
  CNH: 0.001701,
  CNY: 0.001736,
  COP: 0.810735,
  CRC: 0.11333,
  CUP: 0.0062,
  CVE: 0.02486,
  CZK: 0.005392,
  DJF: 0.045915,
  DKK: 0.001656,
  DOP: 0.015089,
  DZD: 0.033982,
  EGP: 0.013229,
  ERN: 0.003875,
  ETB: 0.040978,
  EUR: 0.000224,
  FJD: 0.000566,
  FKP: 0.000193,
  FOK: 0.001668,
  GBP: 0.000193,
  GEL: 0.00066,
  GGP: 0.000193,
  GHS: 0.002934,
  GIP: 0.000193,
  GMD: 0.018885,
  GNF: 2.232554,
  GTQ: 0.001938,
  GYD: 0.053107,
  HKD: 0.001993,
  HNL: 0.006818,
  HRK: 0.001699,
  HTG: 0.033187,
  HUF: 0.080624,
  IDR: 4.588235,
  ILS: 0.000772,
  IMP: 0.000193,
  INR: 0.024345,
  IQD: 0.332234,
  IRR: 351.094891,
  ISK: 0.030809,
  JEP: 0.000193,
  JMD: 0.040061,
  JOD: 0.000183,
  JPY: 0.040695,
  KES: 0.032896,
  KGS: 0.022215,
  KHR: 1.027246,
  KID: 0.000359,
  KMF: 0.110918,
  KRW: 0.350301,
  KWD: 7.8e-05,
  KYD: 0.000215,
  KZT: 0.113903,
  LAK: 5.58707,
  LBP: 23.122693,
  LKR: 0.084085,
  LRD: 0.043938,
  LSL: 0.004195,
  LYD: 0.001617,
  MAD: 0.002419,
  MDL: 0.004441,
  MGA: 1.113294,
  MKD: 0.013634,
  MMK: 0.534538,
  MNT: 0.917943,
  MOP: 0.002065,
  MRU: 0.010167,
  MUR: 0.012125,
  MVR: 0.003927,
  MWK: 0.44368,
  MXN: 0.004369,
  MYR: 0.001034,
  MZN: 0.016219,
  NAD: 0.004195,
  NGN: 0.348588,
  NIO: 0.009347,
  NOK: 0.002396,
  NPR: 0.039123,
  NZD: 0.000444,
  OMR: 9.9e-05,
  PAB: 0.000258,
  PEN: 0.000857,
  PGK: 0.001132,
  PHP: 0.015909,
  PKR: 0.070488,
  PLN: 0.000966,
  PYG: 1.501271,
  QAR: 0.00094,
  RON: 0.001166,
  RSD: 0.025969,
  RUB: 0.021382,
  RWF: 0.380065,
  SAR: 0.000969,
  SBD: 0.002018,
  SCR: 0.003729,
  SDG: 0.117428,
  SEK: 0.002503,
  SGD: 0.000324,
  SHP: 0.000193,
  SLE: 0.006304,
  SLL: 6.304063,
  SOS: 0.145102,
  SRD: 0.009599,
  SSP: 1.435986,
  STN: 0.005524,
  SYP: 0.030989,
  SZL: 0.004195,
  THB: 0.008471,
  TJS: 0.002359,
  TMT: 0.000896,
  TND: 0.000746,
  TOP: 0.000607,
  TRY: 0.0124,
  TTD: 0.001734,
  TVD: 0.000359,
  TWD: 0.008075,
  TZS: 0.680096,
  UAH: 0.011349,
  UGX: 1.0,
  USD: 0.000257,
  UYU: 0.010201,
  UZS: 3.001584,
  VES: 0.22066,
  VND: 6.514797,
  VUV: 0.029832,
  WST: 0.000691,
  XAF: 0.147891,
  XCD: 0.000698,
  XCG: 0.000462,
  XDR: 0.00019,
  XOF: 0.147891,
  XPF: 0.026904,
  YER: 0.060095,
  ZAR: 0.004188,
  ZMW: 0.005009,
  ZWG: 0.006896,
  ZWL: 0.006901,
})

const readCache = () => {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw)
    if (!cached?.rates?.UGX) return null
    if (Date.now() - cached.storedAt > CACHE_TTL_MS) return null
    return { rates: cached.rates, asOf: cached.asOf, isLive: true }
  } catch {
    /* Blocked storage, or a cache written by an older version of this file. */
    return null
  }
}

const writeCache = (rates, asOf) => {
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ rates, asOf, storedAt: Date.now() }),
    )
  } catch {
    /* Storage unavailable; the rates still apply for this session. */
  }
}

/** The bundled snapshot, shaped like a fetch result. */
export const fallbackRates = () => ({
  rates: FALLBACK_RATES,
  asOf: FALLBACK_AS_OF,
  isLive: false,
})

/**
 * Resolves the rate table: cache, then network, then the bundled snapshot.
 *
 * Never rejects. Every failure path returns the snapshot, because the caller
 * is rendering prices and has nothing useful to do with an error.
 */
export const loadRates = async () => {
  const cached = readCache()
  if (cached) return cached

  /* The timeout matters more than the request. Prices render from the snapshot
     immediately and are corrected when this resolves, so a provider that hangs
     must not keep the tab busy. */
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(ENDPOINT, { signal: controller.signal })
    if (!response.ok) return fallbackRates()

    const payload = await response.json()
    if (payload?.result !== 'success' || !payload?.rates?.UGX) {
      return fallbackRates()
    }

    const asOf = payload.time_last_update_utc
      ? new Date(payload.time_last_update_utc).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : FALLBACK_AS_OF

    writeCache(payload.rates, asOf)
    return { rates: payload.rates, asOf, isLive: true }
  } catch {
    return fallbackRates()
  } finally {
    clearTimeout(timeout)
  }
}
