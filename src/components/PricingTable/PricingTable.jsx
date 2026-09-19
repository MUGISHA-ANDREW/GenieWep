import { formatPriceWithUnit } from '@/utils/formatters'

/**
 * The catalogue's two-column price tables (Sections 4–7).
 *
 * Renders a real <table> for semantics and screen readers, wrapped in a
 * horizontally scrollable container so narrow screens never force the page
 * body to scroll sideways.
 */
export const PricingTable = ({ items, columnLabel = 'Package', compact = true }) => (
  <div className="overflow-x-auto rounded-xl border border-line shadow-[var(--shadow-card)]">
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
