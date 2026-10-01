import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import Card from '@/components/Card/Card'
import Icon from '@/components/Icon'

/**
 * One service, as a card: an azure icon tile, the name, what it is, and the
 * concrete things it includes as chips along the bottom.
 *
 * The chips are the part that does the work. "Web Applications" plus a
 * sentence is a category; "Web Applications" plus `Dashboards` `Payments`
 * `Role management` is a scope a client can recognise their own project in.
 * They come from the catalogue rather than being written here.
 *
 * The icon shifts shade on hover — see `.tile-azure` in styles/globals.css.
 * It is the only colour change on the card, so the whole card responds from
 * one point rather than everything shifting at once.
 *
 * Pass `to` and the whole card becomes a link with an "Explore" cue along the
 * bottom — used on the home page, where the card is a door into the catalogue
 * rather than the catalogue itself.
 */
export const ServiceCard = ({ service, index = 0, to }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{
      duration: 0.45,
      delay: Math.min(index * 0.06, 0.3),
      ease: [0.22, 1, 0.36, 1],
    }}
    className="h-full"
  >
    <Card
      as={to ? Link : 'div'}
      to={to}
      hoverable
      className="group flex h-full flex-col p-5 sm:p-7"
    >
      <span className="tile-azure mb-4 shrink-0 self-start sm:mb-5">
        <Icon name={service.icon} className="h-7 w-7" />
      </span>

      <h3 className="mb-2 text-base font-bold text-title">{service.title}</h3>

      <p className="mb-5 flex-1 text-sm leading-relaxed text-body">
        {service.description}
      </p>

      {service.includes && (
        <ul className="flex flex-wrap gap-1.5">
          {service.includes.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-line bg-chip/60 px-2.5 py-1 text-[0.6875rem] font-medium text-dim transition-colors duration-200 group-hover:border-azure-500/25 group-hover:text-body"
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      {to && (
        <span className="mt-6 inline-flex items-center gap-2 border-t border-line pt-5 text-sm font-semibold text-link">
          Explore service
          <FiArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </span>
      )}
    </Card>
  </motion.div>
)

export default ServiceCard
