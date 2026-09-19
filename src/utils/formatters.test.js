import { describe, expect, it } from 'vitest'

import {
  formatAmount,
  formatCompact,
  formatDomain,
  formatPrice,
  formatPriceWithUnit,
  formatUGX,
} from './formatters'

describe('formatUGX', () => {
  it('renders a grouped amount with the UGX code', () => {
    expect(formatUGX(800_000)).toBe('UGX 800,000')
    expect(formatUGX(2_800_000)).toBe('UGX 2,800,000')
  })

  it('returns an empty string for non-numeric input', () => {
    expect(formatUGX(undefined)).toBe('')
    expect(formatUGX(Number.NaN)).toBe('')
  })
})

describe('formatCompact', () => {
  it('uses the catalogue’s M and K shorthand', () => {
    expect(formatCompact(2_000_000)).toBe('2M')
    expect(formatCompact(3_500_000)).toBe('3.5M')
    expect(formatCompact(20_000_000)).toBe('20M')
    expect(formatCompact(350_000)).toBe('350K')
    expect(formatCompact(45_000)).toBe('45K')
  })
})

describe('formatPrice', () => {
  it('renders a single price without a range', () => {
    expect(formatPrice({ min: 1_500_000 })).toBe('UGX 1,500,000')
  })

  it('prints the currency once for a range, as the catalogue does', () => {
    expect(formatPrice({ min: 2_800_000, max: 4_000_000 })).toBe(
      'UGX 2,800,000 – 4,000,000',
    )
  })

  it('marks open-ended ranges with a trailing plus', () => {
    expect(
      formatPrice(
        { min: 8_000_000, max: 20_000_000, openEnded: true },
        { compact: true, withCurrency: false },
      ),
    ).toBe('8M – 20M+')
  })

  it('collapses a range whose bounds are equal', () => {
    expect(formatPrice({ min: 250_000, max: 250_000 })).toBe('UGX 250,000')
  })

  it('returns an empty string for a missing price', () => {
    expect(formatPrice(null)).toBe('')
    expect(formatPrice({})).toBe('')
  })
})

describe('formatPriceWithUnit', () => {
  it('appends a billing unit when one is given', () => {
    expect(
      formatPriceWithUnit({ min: 100_000, max: 350_000 }, 'month', {
        compact: true,
        withCurrency: false,
      }),
    ).toBe('100K – 350K / month')
  })

  it('omits the suffix for one-off services', () => {
    expect(
      formatPriceWithUnit({ min: 150_000, max: 300_000 }, null, {
        compact: true,
        withCurrency: false,
      }),
    ).toBe('150K – 300K')
  })
})

describe('text helpers', () => {
  it('strips the protocol and trailing slash from a URL', () => {
    expect(formatDomain('https://scaval.com')).toBe('scaval.com')
    expect(formatDomain('https://gvmcompany.com/')).toBe('gvmcompany.com')
    expect(formatDomain(null)).toBe('')
  })

  it('groups a bare amount without a currency code', () => {
    expect(formatAmount(1_500_000)).toBe('1,500,000')
  })
})
