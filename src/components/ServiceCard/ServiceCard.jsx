import { motion } from 'framer-motion'

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
 * The icon tile fills with azure on hover — see `.tile-azure` in
 * styles/globals.css. It is the only colour change on the card, so the whole
 * card lights up from one point rather than everything shifting at once.
 */
export const ServiceCard = ({ service, index = 0 }) => (
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
    <Card hoverable className="group flex h-full flex-col p-6 sm:p-7">
      <span className="tile-azure mb-5 h-13 w-13 shrink-0">
        <Icon name={service.icon} className="h-6 w-6" />
      </span>

      <h3 className="mb-2 text-lg font-bold text-title">{service.title}</h3>

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
    </Card>
  </motion.div>
)

export default ServiceCard
