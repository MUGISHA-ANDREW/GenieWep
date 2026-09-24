import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiArrowRight } from 'react-icons/fi'

import Button from '@/components/Button/Button'
import Card from '@/components/Card/Card'
import CurrencySwitcher, {
  CurrencyNote,
} from '@/components/Currency/CurrencySwitcher'
import Faq from '@/components/Home/Faq'
import FactStrip from '@/components/Home/FactStrip'
import ProcessSteps from '@/components/Home/ProcessSteps'
import TechMarquee from '@/components/Home/TechMarquee'
import AfricaGlobe from '@/components/Globe/AfricaGlobe'
import Icon from '@/components/Icon'
import PricingCard from '@/components/PricingTable/PricingCard'
import ProjectCard from '@/components/ProjectCard/ProjectCard'
import Reveal, { Stagger, StaggerItem } from '@/components/Reveal'
import Section from '@/components/Section'
import Seo from '@/components/Seo'
import ServiceCard from '@/components/ServiceCard/ServiceCard'
import {
  COMPANY,
  CORE_SERVICES,
  PROJECTS,
  WEBSITE_PACKAGES,
  WHATSAPP_LINK,
  WHY_CHOOSE_US,
} from '@/utils/constants'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

const transition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] }

/**
 * The hero: the claim on the left, a globe turned to Africa on the right.
 *
 * Two columns rather than a centred stack, and a drawn visual rather than a
 * stock photograph. The globe is inline SVG — see components/Globe — and says
 * the one thing the copy does not: this is a Ugandan company that works beyond
 * Uganda.
 *
 * `.aurora` puts two very soft radial pools behind the whole band, which is
 * what stops a flat dark page from looking like a black rectangle. They are
 * the only gradients on the site.
 */
const Hero = () => (
  <section className="aurora relative overflow-hidden border-b border-line bg-canvas">
    <div className="container-page py-16 sm:py-20 lg:py-24">
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 xl:gap-16">
        <motion.div initial="initial" animate="animate" transition={{ staggerChildren: 0.08 }}>

          <motion.h1
            variants={fadeUp}
            transition={transition}
            className="text-[1.75rem] leading-[1.15] text-title sm:text-[2.125rem] lg:text-[2.5rem]"
          >
            We design, build and maintain the{' '}
            {/* Two words in azure. The effect only works because it is rare —
                the rest of the headline stays plain, so the eye lands here. */}
            <span className="text-azure-gradient">digital systems</span> your
            organization runs on.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={transition}
            className="mt-6 max-w-xl text-base leading-relaxed text-body sm:text-lg"
          >
            {COMPANY.summary}
          </motion.p>

          {/* A single line of scope, between the lede and the buttons. It
              answers "what do they actually do" before anyone has to click. */}
          <motion.ul
            variants={fadeUp}
            transition={transition}
            className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-dim"
          >
            {/*
              The separator dot trails each item rather than leading the next
              one. Leading dots look fine on one line and wrong the moment the
              list wraps, because the new line then opens with a bullet.
            */}
            {['Websites', 'Web & mobile apps', 'Custom software', 'Hosting & support'].map(
              (item, index, all) => (
                <li key={item} className="flex items-center gap-4">
                  {item}
                  {index < all.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full bg-line-strong"
                    />
                  )}
                </li>
              ),
            )}
          </motion.ul>

          <motion.div
            variants={fadeUp}
            transition={transition}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button to="/contact" size="lg">
              Get a free consultation
              <FiArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
            <Button to="/projects" variant="secondary" size="lg">
              See our work
            </Button>
          </motion.div>
        </motion.div>

        {/* The globe gets a plain fade with a touch more delay and no movement
            of its own. It is a large object; sliding it in makes the whole
            hero feel like it is assembling itself. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <AfricaGlobe />
        </motion.div>
      </div>
    </div>
  </section>
)

const Home = () => (
  <>
    <Seo
      title="Software Development Company in Uganda"
      description="GenieWep Technologies builds websites, web apps, mobile apps and desktop software for businesses, schools, NGOs, SACCOs and tourism companies in Uganda."
      path="/"
    />

    <Hero />
    <FactStrip />

    {/* Services */}
    <Section
      title="Software that solves practical business problems."
      description="From a first business website to a system your whole operation runs on — designed, built and maintained by the same small team."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CORE_SERVICES.slice(0, 6).map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>

      {/* The catalogue link as a full-width bar rather than a stray button —
          it closes the section instead of dangling under it. */}
      <Reveal className="mt-8">
        <Card className="flex flex-col items-start justify-between gap-5 px-6 py-6 sm:flex-row sm:items-center sm:px-8">
          <div>
            <h3 className="text-base font-bold text-title">
              Need the full service catalogue?
            </h3>
            <p className="mt-1 text-sm text-body">
              All {CORE_SERVICES.length} services, with published UGX pricing
              for every package.
            </p>
          </div>
          <Button to="/services" className="shrink-0">
            View services &amp; pricing
            <FiArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        </Card>
      </Reveal>
    </Section>

    <ProcessSteps />

    {/* Projects */}
    <Section
      title="Built, launched, and still running."
      description="Real systems for real organizations across agriculture, commodities trading, tourism and the NGO sector."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      <Reveal className="mt-10">
        <Button to="/projects" variant="secondary">
          See all projects
          <FiArrowRight aria-hidden="true" className="h-4 w-4" />
        </Button>
      </Reveal>
    </Section>

    {/* Why GenieWep */}
    <Section
      tone="tinted"
      title="Why Ugandan organizations pick us."
      description="Five things the company will put in writing, taken straight from our 2026 catalogue. No awards, no invented client counts."
    >
      <Stagger as="ul" step={0.06} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_CHOOSE_US.map((reason) => (
          <StaggerItem as="li" key={reason.id}>
            <Card hoverable className="group flex h-full items-start gap-4 p-6">
              <span className="tile-azure shrink-0 pt-1.5">
                <Icon name={reason.icon} className="h-7 w-7" />
              </span>
              <span className="pt-2.5 text-[0.9375rem] font-semibold text-title">
                {reason.text}
              </span>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>

    {/* Tech stack */}
    <Section
      size="compact"
      align="center"
      title="Proven tools, chosen so the system outlives the project."
      description="Nothing here is experimental. Every one of these has a large community, long-term support, and other developers who can pick it up if you ever need them to."
      containerClassName="!max-w-none !px-0"
      headingClassName=""
    >
      <TechMarquee />
    </Section>

    {/* Pricing */}
    <Section
      tone="tinted"
      title="Published prices, Uganda market rates."
      description="Every package is a fixed scope with no hidden costs. Web, mobile and desktop application pricing is on the services page."
    >
      {/* The switcher sits directly above the prices it changes, so the
          relationship needs no explaining. */}
      <Reveal className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-dim">Show prices in</p>
        <CurrencySwitcher />
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-3">
        {WEBSITE_PACKAGES.map((pkg, index) => (
          <PricingCard key={pkg.id} pkg={pkg} index={index} />
        ))}
      </div>

      <CurrencyNote className="mt-6 max-w-2xl" />

      <Reveal className="mt-10">
        <Button to="/services" variant="secondary">
          Compare all packages
          <FiArrowRight aria-hidden="true" className="h-4 w-4" />
        </Button>
      </Reveal>
    </Section>

    <Faq />

    {/* Closing CTA */}
    <section className="aurora relative overflow-hidden border-t border-line bg-canvas">
      <div className="container-page py-16 sm:py-20">
        <Reveal>
          <Card className="px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
            <div className="grid items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
              <div>
                <h2 className="text-2xl leading-[1.2] text-title sm:text-3xl">
                  Have a digital project in mind?
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-body">
                  Tell us what you are building. We will come back with a clear
                  scope, a timeline and a fixed price — at no cost.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button to="/contact" size="lg" fullWidth>
                  Start a project
                  <FiArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
                <Button
                  href={WHATSAPP_LINK}
                  variant="whatsapp"
                  size="lg"
                  fullWidth
                >
                  <FaWhatsapp aria-hidden="true" className="h-5 w-5" />
                  WhatsApp us
                </Button>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  </>
)

export default Home
