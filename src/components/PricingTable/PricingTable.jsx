import { Stagger, StaggerItem } from '@/components/Reveal'
import useCurrency from '@/hooks/useCurrency'
import { formatPriceWithUnit } from '@/utils/formatters'

/**
 * A priced list — web apps, mobile apps, desktop software, add-ons.
 *
 * A definition list on hairlines rather than a bordered table with a filled
 * header row. Two columns of information do not need table furniture to be
 * read, and at 390px a real `<table>` either scrolls sideways or crushes the
 * price against the name.
 *
 * `tabular` on the price so the digits line up down the column. It is a small
 * thing and it is the difference between a price list and a price table.
 */
export const PricingTable = ({ items, columnLabel = 'Package', compact = false }) => {
  const { code: currency, rates } = useCurrency()

  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-line pb-3">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-dim">
          {columnLabel}
        </span>
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-dim">
          Price ({currency})
        </span>
      </div>

      <Stagger as="dl" step={0.05}>
        {items.map((item) => (
          <StaggerItem
            key={item.id}
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line py-4 transition-colors hover:bg-chip/40"
          >
            <dt className="min-w-0">
              <span className="block text-[0.9375rem] font-semibold text-title">
                {item.name}
              </span>
              {item.detail && (
                <span className="mt-0.5 block text-sm text-dim">
                  {item.detail}
                </span>
              )}
            </dt>
            <dd className="tabular whitespace-nowrap text-[0.9375rem] font-bold text-link">
              {/* `withCurrency: false` matches the catalogue, where the unit
                  lives in the column header rather than on every row — which
                  is also why the header prints the active currency code. */}
              {formatPriceWithUnit(item.price, item.unit, {
                compact,
                withCurrency: false,
                currency,
                rates,
              })}
            </dd>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}

export default PricingTable
