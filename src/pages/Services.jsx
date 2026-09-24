import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { FiArrowRight } from 'react-icons/fi'

import Button from '@/components/Button/Button'
import CurrencySwitcher, {
  CurrencyNote,
} from '@/components/Currency/CurrencySwitcher'
import PricingCard from '@/components/PricingTable/PricingCard'
import PricingTable from '@/components/PricingTable/PricingTable'
import Section from '@/components/Section'
import Seo from '@/components/Seo'
import ServiceCard from '@/components/ServiceCard/ServiceCard'
import {
  CORE_SERVICES,
  SERVICE_CATEGORIES,
  WHATSAPP_LINK,
} from '@/utils/constants'

/** Renders whichever shape the active category declares: cards or a table. */
const CategoryPanel = ({ category }) => (
  <motion.div
    key={category.id}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="mb-8">
      <h3 className="text-xl text-title">{category.heading}</h3>
      {category.note && <p className="mt-2 text-sm text-dim">{category.note}</p>}
    </div>

    {category.type === 'cards' ? (
      <div className="grid gap-6 lg:grid-cols-3">
        {category.items.map((pkg, index) => (
          <PricingCard key={pkg.id} pkg={pkg} index={index} />
        ))}
      </div>
    ) : (
      <PricingTable items={category.items} columnLabel={category.columnLabel} />
    )}
  </motion.div>
)

const Services = () => {
  const [activeId, setActiveId] = useState(SERVICE_CATEGORIES[0].id)
  const activeCategory =
    SERVICE_CATEGORIES.find((category) => category.id === activeId) ??
    SERVICE_CATEGORIES[0]

  return (
    <>
      <Seo
        title="Services & Pricing"
        description="Website, web application, mobile app and desktop software packages with transparent UGX pricing for the Uganda market."
        path="/services"
      />

      {/* Page header */}
      <section className="bg-navy-900">
        <div className="container-page py-16 md:py-20">
          <h1 className="max-w-3xl text-3xl text-white md:text-4xl">
            Clear packages, Uganda market rates
          </h1>
          <p className="mt-5 max-w-2xl text-base text-surface-200 md:text-lg">
            Every price below is taken directly from our 2026 service catalogue.
            Need something in between? We scope custom work to fit your budget.
          </p>
        </div>
      </section>

      {/* Pricing tabs */}
      <Section>
        <div
          role="tablist"
          aria-label="Service categories"
          className="mb-10 flex flex-wrap gap-2 border-b border-line pb-4"
        >
          {SERVICE_CATEGORIES.map((category) => {
            const isActive = category.id === activeId
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                id={`tab-${category.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${category.id}`}
                onClick={() => setActiveId(category.id)}
                /*
                 * Accent for the active tab, matching the Projects filter.
                 * A dark fill read as *less* prominent than the inactive chips
                 * once the page itself went dark.
                 *
                 * The fill is a shared `layoutId` element that slides between
                 * tabs, the same treatment as the Projects filter — five tabs
                 * that light up in place give no sense of which one you left.
                 */
                className={`relative rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'bg-chip text-body hover:bg-chip-hover hover:text-title'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="service-tab-fill"
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-lg bg-azure-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {category.label}
              </button>
            )
          })}
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-dim">Show prices in</p>
          <CurrencySwitcher />
        </div>

        <div
          role="tabpanel"
          id={`panel-${activeCategory.id}`}
          aria-labelledby={`tab-${activeCategory.id}`}
        >
          <CategoryPanel category={activeCategory} />
        </div>

        <CurrencyNote className="mt-8" />

        <p className="mt-4 text-sm text-dim">
          Every price reflects our 2026 catalogue. Domain and hosting are billed
          separately where indicated.
        </p>
      </Section>

      {/* Full service list */}
      <Section
        tone="tinted"
        title="Full service list"
        description="Ten services covering the whole lifecycle, from first design to ongoing maintenance."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="bg-navy-900">
        <div className="container-page py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl text-white sm:text-3xl">Not sure which package fits?</h2>
            <p className="mt-4 text-base text-surface-200">
              Send us a short description of your project and we will recommend the
              right scope, with a fixed price.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button to="/contact" size="lg">
                Request a quote
                <FiArrowRight aria-hidden="true" className="h-4 w-4" />
              </Button>
              <Button href={WHATSAPP_LINK} variant="whatsapp" size="lg">
                <FaWhatsapp aria-hidden="true" className="h-5 w-5" />
                Ask on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Services
