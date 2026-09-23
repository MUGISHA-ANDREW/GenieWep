import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'

import Button from '@/components/Button/Button'
import Card from '@/components/Card/Card'
import { buildWhatsAppLink } from '@/utils/constants'
import { formatPrice, formatPriceWithUnit } from '@/utils/formatters'

/**
 * One website package.
 *
 * The recommended tier is marked by an azure border, an azure badge and an
 * azure price — no scale-up, no glow, no second shadow. The tier the client
 * wants to sell should be obvious, not loud, and on a dark page an enlarged
 * card mostly just breaks the row.
 *
 * `mt-auto` on the button pins it to the bottom of whichever column is
 * tallest, so the three do not step down the page.
 */
export const PricingCard = ({ pkg, index = 0 }) => {
  const enquiry = buildWhatsAppLink(
    `Hello GenieWep Technologies, I am interested in the ${pkg.name}. Could you share more details?`,
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.09, 0.28),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <Card
        className={`relative flex h-full flex-col p-6 sm:p-7 ${
          pkg.featured ? 'border-azure-500/45' : ''
        }`}
      >
        {pkg.featured && (
          <span className="absolute right-6 top-6 rounded-full bg-azure-500/15 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-link">
            Most popular
          </span>
        )}

        <h3 className="text-base font-bold text-title">{pkg.name}</h3>
        <p className="mt-1 text-sm italic text-dim">{pkg.bestFor}</p>

        <p
          className={`tabular mt-5 text-2xl font-bold ${
            pkg.featured ? 'text-link' : 'text-title'
          }`}
        >
          {formatPrice(pkg.price)}
        </p>

        <div className="my-6 h-px bg-line" />

        {pkg.inheritsFrom && (
          <p className="mb-4 text-sm font-semibold text-title">
            Everything in {pkg.inheritsFrom}, plus:
          </p>
        )}

        <ul className="space-y-3">
          {pkg.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-sm text-body"
            >
              <FiCheck
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-link"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {pkg.clientPaysSeparately && (
          <div className="mt-6 rounded-2xl border border-line bg-chip/50 p-4">
            <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-dim">
              Billed separately
            </p>
            <ul className="space-y-1">
              {pkg.clientPaysSeparately.map((extra) => (
                <li key={extra.item} className="tabular text-sm text-body">
                  {extra.item}: {formatPriceWithUnit(extra.price, extra.unit)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto pt-8">
          <Button
            href={enquiry}
            variant={pkg.featured ? 'primary' : 'outline'}
            fullWidth
          >
            Request this package
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export default PricingCard
