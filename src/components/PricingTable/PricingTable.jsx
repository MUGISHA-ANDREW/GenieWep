import { formatPriceWithUnit } from '@/utils/formatters'

/**
 * The catalogue's two-column price tables (Sections 4–7).
 *
 * Renders a real <table> for semantics and screen readers, wrapped in a
 * horizontally scrollable container so narrow screens never force the page
 * body to scroll sideways.
 *
 * `compact` is off. The printed catalogue abbreviates these to "2M – 4M" and
 * this used to match it, but at the client's request the site now spells them
 * out: "2,000,000 – 4,000,000". A visitor comparing quotes should not have to
 * expand an abbreviation to count the zeroes, and the tables have the width.
 * Note that this is a deliberate divergence from the PDF — see
 * PROJECT_BRIEF.md §9.
 *
 * The wrapper is borderless like the cards. The row rules below stay: they are
 * table structure rather than a card edge, and they are what lets the eye
 * track a package across to its price.
 */
export const PricingTable = ({ items, columnLabel = 'Package', compact = false }) => (
  <div className="overflow-x-auto rounded-xl shadow-[var(--shadow-card)]">
    <table className="w-full min-w-[32rem] border-collapse text-left">
      <thead>
        <tr className="bg-steel-800 text-white">
          <th scope="col" className="px-6 py-4 text-sm font-bold">
            {columnLabel}
          </th>
          <th scope="col" className="px-6 py-4 text-right text-sm font-bold">
            Price (UGX)
          </th>
        </tr>
      </thead>

      <tbody>
        {items.map((item, index) => (
          <tr
            key={item.id}
            className={`border-t border-line transition-colors hover:bg-chip ${
              index % 2 === 1 ? 'bg-tint' : 'bg-card'
            }`}
          >
            <th scope="row" className="px-6 py-4 text-sm font-medium text-title">
              {item.name}
              {item.detail && (
                <span className="block text-xs font-normal text-dim">
                  {item.detail}
                </span>
              )}
            </th>
            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-bold text-link-strong">
              {/*
                `withCurrency: false` matches the catalogue, where the UGX unit
                lives in the column header rather than on every row.
              */}
              {formatPriceWithUnit(item.price, item.unit, {
                compact,
                withCurrency: false,
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default PricingTable
