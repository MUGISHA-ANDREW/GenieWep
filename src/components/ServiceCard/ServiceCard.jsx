import { motion } from 'framer-motion'

import Card from '@/components/Card/Card'
import Icon from '@/components/Icon'

/** Renders one entry from CORE_SERVICES (catalogue Section 1). */
export const ServiceCard = ({ service, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.06, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <Card hoverable className="group h-full p-6">
        <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-chip text-link transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-white">
          <Icon name={service.icon} className="h-6 w-6" />
        </span>

        <h3 className="mb-2 text-lg text-title">{service.title}</h3>
        <p className="text-sm leading-relaxed text-body">{service.description}</p>
      </Card>
    </motion.div>
  )
}

export default ServiceCard
