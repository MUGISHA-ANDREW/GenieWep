/**
 * Currency conversion and detection.
 *
 * These are prices, so the tests are about not being wrong in public: that a
 * converted figure is in the right ballpark, that a range stays a range, and
 * that a Ugandan visitor is never quoted in Kenyan shillings on a Ugandan
 * company's site.
 */

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  BASE_CODE,
  COMMON_CODES,
  convertFromUGX,
  currencyName,
  detectCurrencyCode,
  isSupported,
  symbolFor,
  withSymbol,
} from './currency'
import { FALLBACK_RATES } from './fx'
import { formatPrice } from './formatters'

const UGX = 'UGX'
const KES = 'KES'
const USD = 'USD'

afterEach(() => {
  vi.restoreAllMocks()
})

/** Points `Intl.DateTimeFormat().resolvedOptions().timeZone` at a given zone. */
const mockEnvironment = ({ timeZone, language }) => {
  const original = Intl.DateTimeFormat
  vi.spyOn(Intl, 'DateTimeFormat').mockImplementation((...args) => {
    const instance = new original(...args)
    return {
      ...instance,
      resolvedOptions: () => ({ ...instance.resolvedOptions(), timeZone }),
    }
  })

  vi.stubGlobal('navigator', { language, languages: [language] })
}

describe('the currency table', () => {
  it('bills in the currency the company actually invoices in', () => {
    expect(BASE_CODE).toBe('UGX')
    expect(FALLBACK_RATES.UGX).toBe(1)
  })

  it('covers far more than the switcher shortlist', () => {
    /* The point of the rewrite: anyone, anywhere, sees their own money. */
    expect(Object.keys(FALLBACK_RATES).length).toBeGreaterThan(100)
    for (const code of ['XOF', 'BIF', 'IDR', 'JPY', 'BRL', 'PKR', 'VND']) {
      expect(isSupported(code)).toBe(true)
    }
  })

  it('offers a shortlist that the rate table can actually price', () => {
    const codes = COMMON_CODES
    expect(new Set(codes).size).toBe(codes.length)
    expect(codes[0]).toBe(BASE_CODE)
    expect(codes.every((code) => isSupported(code))).toBe(true)
  })

  it('rejects a code the rate table does not carry', () => {
    expect(isSupported('XYZ')).toBe(false)
    expect(isSupported(undefined)).toBe(false)
  })

  it('names and labels currencies outside the shortlist', () => {
    expect(currencyName('KES')).toBe('Kenyan Shilling')
    expect(currencyName('BIF')).toMatch(/Burundian/i)
    /* East African symbols are pinned so they do not depend on the locale. */
    expect(symbolFor('UGX')).toBe('UGX')
    expect(symbolFor('KES')).toBe('KSh')
    expect(symbolFor('USD')).toBe('$')
  })
})

describe('conversion', () => {
  it('leaves UGX untouched, to the shilling', () => {
    expect(convertFromUGX(800_000, UGX)).toBe(800_000)
    expect(convertFromUGX(2_800_000, UGX)).toBe(2_800_000)
  })

  it('converts into the right order of magnitude', () => {
    /* The Starter package is UGX 800,000. Roughly KSh 28,000 and USD 220 —
       asserted as bands rather than exact figures, so a rate review that moves
       the table a few percent does not break the suite, while a rate typed in
       with a misplaced zero does. */
    const kes = convertFromUGX(800_000, KES)
    expect(kes).toBeGreaterThan(20_000)
    expect(kes).toBeLessThan(40_000)

    const usd = convertFromUGX(800_000, USD)
    expect(usd).toBeGreaterThan(150)
    expect(usd).toBeLessThan(350)
  })

  it('rounds to figures that read as prices', () => {
    /* Nobody publishes "KSh 28,070". Every converted figure should be round
       enough that a human would have written it. */
    for (const amount of [800_000, 1_500_000, 2_800_000, 15_000_000]) {
      for (const currency of [KES, USD, 'TZS', 'XOF', 'IDR']) {
        const converted = convertFromUGX(amount, currency)
        const magnitude = Math.abs(converted)
        const step =
          magnitude < 100 ? 5
            : magnitude < 1_000 ? 10
              : magnitude < 10_000 ? 100
                : magnitude < 100_000 ? 1_000
                  : magnitude < 1_000_000 ? 10_000
                    : 100_000
        expect(converted % step).toBe(0)
      }
    }
  })

  it('returns null rather than NaN for a bad amount or an unknown code', () => {
    expect(convertFromUGX(undefined, KES)).toBeNull()
    expect(convertFromUGX(Number.NaN, KES)).toBeNull()
    expect(convertFromUGX(800_000, 'XYZ')).toBeNull()
  })

  it('converts for currencies well outside the shortlist', () => {
    for (const code of ['XOF', 'IDR', 'JPY', 'BRL', 'PKR']) {
      const converted = convertFromUGX(800_000, code)
      expect(converted).toBeGreaterThan(0)
      expect(Number.isFinite(converted)).toBe(true)
    }
  })

  it('spaces multi-character symbols and closes up single glyphs', () => {
    expect(withSymbol('26,000', KES)).toBe('KSh 26,000')
    expect(withSymbol('210', USD)).toBe('$210')
    expect(withSymbol('', KES)).toBe('')
  })
})

describe('formatting a price in another currency', () => {
  it('defaults to UGX when no currency is passed', () => {
    expect(formatPrice({ min: 800_000 })).toBe('UGX 800,000')
  })

  it('relabels and converts when one is', () => {
    expect(formatPrice({ min: 800_000 }, { currency: KES })).toMatch(/^KSh [\d,]+$/)
    expect(formatPrice({ min: 800_000 }, { currency: USD })).toMatch(/^\$\d+$/)
  })

  it('falls back to the real UGX price rather than a blank cell', () => {
    /* A rate table that cannot price this currency must not leave a hole
       where a price should be. */
    expect(formatPrice({ min: 800_000 }, { currency: 'XYZ' })).toBe('UGX 800,000')
  })

  it('keeps a range a range after both bounds are rounded', () => {
    const range = formatPrice({ min: 2_800_000, max: 4_000_000 }, { currency: KES })
    expect(range).toContain('–')

    /* The two bounds must not round together into a single figure. */
    const [low, high] = range.replace('KSh ', '').split(' – ')
    expect(low).not.toBe(high)
  })

  it('carries the open-ended marker across', () => {
    expect(
      formatPrice({ min: 8e6, max: 2e7, openEnded: true }, { currency: USD }),
    ).toMatch(/\+$/)
  })
})

describe('detection', () => {
  /*
   * The one that matters commercially. `Africa/Kampala` is a link to
   * `Africa/Nairobi` in the IANA database, so a browser in Uganda reports
   * Nairobi — and a naive zone lookup would quote every Ugandan visitor in
   * Kenyan shillings.
   */
  it('does not mistake a Ugandan visitor for a Kenyan one', () => {
    mockEnvironment({ timeZone: 'Africa/Nairobi', language: 'en-US' })
    expect(detectCurrencyCode()).toBe('UGX')
  })

  it('trusts the language tag inside East Africa when it names a country there', () => {
    mockEnvironment({ timeZone: 'Africa/Nairobi', language: 'en-KE' })
    expect(detectCurrencyCode()).toBe('KES')

    mockEnvironment({ timeZone: 'Africa/Nairobi', language: 'sw-TZ' })
    expect(detectCurrencyCode()).toBe('TZS')
  })

  it('uses an unambiguous zone directly', () => {
    mockEnvironment({ timeZone: 'Africa/Lagos', language: 'en-US' })
    expect(detectCurrencyCode()).toBe('NGN')

    mockEnvironment({ timeZone: 'Europe/London', language: 'en-GB' })
    expect(detectCurrencyCode()).toBe('GBP')
  })

  /*
   * This used to assert USD for everyone outside East Africa, back when the
   * site carried ten hand-picked currencies. It now prices in whatever the
   * visitor's own country uses, so a Canadian sees Canadian dollars.
   */
  it('prices a visitor from anywhere in their own currency', () => {
    mockEnvironment({ timeZone: 'America/New_York', language: 'en-CA' })
    expect(detectCurrencyCode()).toBe('CAD')

    mockEnvironment({ timeZone: 'Asia/Kolkata', language: 'en-IN' })
    expect(detectCurrencyCode()).toBe('INR')

    mockEnvironment({ timeZone: 'Africa/Abidjan', language: 'fr-CI' })
    expect(detectCurrencyCode()).toBe('XOF')

    mockEnvironment({ timeZone: 'Asia/Tokyo', language: 'ja-JP' })
    expect(detectCurrencyCode()).toBe('JPY')
  })

  it('falls back to the billing currency for a country we have no rate for', () => {
    mockEnvironment({ timeZone: 'Pacific/Auckland', language: 'en-ZZ' })
    expect(detectCurrencyCode()).toBe('UGX')
  })

  it('falls back to the billing currency when it can tell nothing', () => {
    mockEnvironment({ timeZone: 'Antarctica/Troll', language: undefined })
    expect(detectCurrencyCode()).toBe('UGX')
  })
})
