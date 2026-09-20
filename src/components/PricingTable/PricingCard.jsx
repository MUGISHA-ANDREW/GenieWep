import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'

import Button from '@/components/Button/Button'
import { buildWhatsAppLink } from '@/utils/constants'
import { formatPrice, formatPriceWithUnit } from '@/utils/formatters'

/**
 * A website package tier (catalogue Section 3).
 * Price strings are produced by `formatPrice`, never typed by hand.
 */
export const PricingCard = ({ pkg, index = 0 }) => {
  const enquiry = buildWhatsAppLink(
    `Hello GenieWep Technologies, I am interested in the ${pkg.name}. Could you share more details?`,
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.1, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      {/*
        Borderless, like every other card on the site. The featured tier used
        to be outlined in `accent-500` with a matching ring; it now stands out
        on elevation plus the amber badge and its lighter header band, which
        were always doing most of that work anyway.
      */}
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-xl bg-card transition-shadow duration-300 ${
          pkg.featured
            ? 'shadow-[var(--shadow-card-hover)]'
            : 'shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]'
        }`}
      >
        {/* The badge carries the palette's one warm note — see styles/theme.css */}
        {pkg.featured && (
          <span className="absolute right-4 top-4 z-10 rounded-full bg-highlight-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-steel-900">
            Most popular
          </span>
        )}

        {/*
          Header band, mirroring the catalogue's dark package headers.
          The min-height keeps all three bands level across the row: the
          Executive tier's price wraps to two lines and would otherwise sit
          noticeably deeper than its neighbours.
        */}
        <div
          /* No rule under the band: it is a dark fill against a light card, so
             the colour change is the edge. */
          className={`flex min-h-28 flex-col justify-center px-6 py-5 ${
            pkg.featured ? 'bg-band-featured' : 'bg-band'
          }`}
        >
          <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
          <p className="mt-1 text-2xl font-extrabold text-accent-300">
            {formatPrice(pkg.price)}
          </p>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="mb-1 text-sm italic text-dim">{pkg.bestFor}</p>

          {pkg.inheritsFrom && (
            <p className="mb-4 text-sm font-semibold text-link">
              Includes everything in {pkg.inheritsFrom}, plus:
            </p>
          )}

          <ul className={`space-y-3 ${pkg.inheritsFrom ? '' : 'mt-4'}`}>
            {pkg.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-body">
                <FiCheck
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent-500"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {pkg.clientPaysSeparately && (
            <div className="mt-6 rounded-lg bg-tint p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-title">
                Client pays separately
              </p>
              <ul className="space-y-1">
                {pkg.clientPaysSeparately.map((extra) => (
                  <li key={extra.item} className="text-sm text-body">
                    {extra.item}: {formatPriceWithUnit(extra.price, extra.unit)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 pt-2">
            <Button
              href={enquiry}
              variant={pkg.featured ? 'primary' : 'outline'}
              fullWidth
            >
              Request this package
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PricingCard
