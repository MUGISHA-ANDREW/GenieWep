import { FiGlobe } from 'react-icons/fi'

import useCurrency from '@/hooks/useCurrency'
import {
  BASE_CODE,
  COMMON_CODES,
  currencyName,
  isSupported,
  symbolFor,
} from '@/utils/currency'

/**
 * Lets the visitor pick the currency the catalogue is priced in.
 *
 * A native `<select>`, not a custom dropdown. A list of currencies on a phone
 * is exactly the case the platform picker is good at — it gets the scroll
 * wheel, type-ahead, keyboard handling and screen-reader announcement right
 * for free, and a hand-built listbox would be a week of work to reach the same
 * place.
 *
 * ── What is in the list ─────────────────────────────────────────────────────
 * The site can price in any of the 166 currencies the rate provider publishes,
 * but a dropdown of 166 options is a phone book, not a control. So the list is
 * the markets this company actually sells into — plus the visitor's own
 * currency spliced in at the top whenever detection lands outside that set, so
 * a visitor from anywhere still finds their money already selected.
 *
 * It sits beside the prices rather than in the header. Currency is a detail of
 * one section, and the detection behind it is a guess, so the control belongs
 * where the guess is visible.
 */
export const CurrencySwitcher = ({ className = '' }) => {
  const { code, rates, setCurrency } = useCurrency()

  /* Only offer what the loaded rate table can actually price. */
  const common = COMMON_CODES.filter((option) => isSupported(option, rates))
  const isOutsideList = !common.includes(code)

  const optionLabel = (option) =>
    `${option} — ${currencyName(option)} (${symbolFor(option)})`

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <FiGlobe aria-hidden="true" className="h-4 w-4 shrink-0 text-dim" />

      <label htmlFor="currency-switcher" className="sr-only">
        Show prices in
      </label>

      <select
        id="currency-switcher"
        value={code}
        onChange={(event) => setCurrency(event.target.value)}
        /* 16px on phones: iOS zooms the whole page into any control set
           smaller than that the moment it is tapped. */
        className="min-w-0 flex-1 cursor-pointer truncate rounded-xl border border-line bg-card py-2.5 pl-3 pr-8 text-base font-semibold sm:max-w-[16rem] sm:flex-none sm:py-2 sm:text-sm text-title transition-colors hover:border-azure-500/40 focus:outline-none"
      >
        {/* The detected currency, when it is not one of the regulars. Grouped
            separately so it reads as "yours" rather than as an odd entry
            wedged into an otherwise regional list. */}
        {isOutsideList && (
          <optgroup label="Your currency">
            <option value={code}>{optionLabel(code)}</option>
          </optgroup>
        )}

        <optgroup label="Common">
          {common.map((option) => (
            <option key={option} value={option}>
              {optionLabel(option)}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  )
}

/**
 * The sentence that keeps the converted figures honest.
 *
 * Prints only when the visitor is looking at something other than UGX, because
 * on the UGX view there is nothing to disclaim — that is the actual price.
 *
 * The date comes from the rate table itself, so a stale snapshot says so on
 * the page instead of quietly misquoting, and it names whether the figure came
 * from today's rates or the bundled fallback.
 */
export const CurrencyNote = ({ className = '' }) => {
  const { code, isConverted, ratesAsOf, ratesAreLive } = useCurrency()

  if (!isConverted) return null

  return (
    <p className={`text-sm leading-relaxed text-dim ${className}`}>
      Shown in {currencyName(code)} as a guide, converted at the{' '}
      {ratesAreLive ? 'rate for' : 'last rate we stored,'} {ratesAsOf}. Projects
      are quoted and invoiced in {currencyName(BASE_CODE)}s.
    </p>
  )
}

export default CurrencySwitcher
