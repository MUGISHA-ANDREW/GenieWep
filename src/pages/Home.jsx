import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiArrowRight, FiCheck } from 'react-icons/fi'

import Button from '@/components/Button/Button'
import Icon from '@/components/Icon'
import PricingCard from '@/components/PricingTable/PricingCard'
import ProjectCard from '@/components/ProjectCard/ProjectCard'
import Section from '@/components/Section'
import Seo from '@/components/Seo'
import ServiceCard from '@/components/ServiceCard/ServiceCard'
/*
 * `img.jpeg`, not `image.jpeg`. The latter is the same office-signage render
 * but its wall tagline still reads "INNOVATION THROUGH CODE SINCE [current
 * year]" — an unreplaced placeholder. It must not appear anywhere public.
 */
import heroPoster from '@/assets/images/img.jpeg'
import heroVideo from '@/assets/videos/hero.mp4'
import {
  COMPANY,
  CORE_SERVICES,
  PROJECTS,
  WEBSITE_PACKAGES,
  WHATSAPP_LINK,
  WHY_CHOOSE_US,
} from '@/utils/constants'

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
}

const Hero = () => (
  <section className="relative isolate overflow-hidden bg-steel-900">
    {/* Ambient background video, muted and decorative */}
    {/*
      Held at low opacity behind a heavy scrim so the footage reads as ambient
      texture. Any wordmark inside the video would otherwise ghost through and
      compete with the headline sitting on top of it.
    */}
    <video
      className="absolute inset-0 -z-10 h-full w-full object-cover opacity-14"
      src={heroVideo}
      poster={heroPoster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    />
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-linear-to-br from-steel-950/96 via-steel-900/92 to-steel-800/88"
    />
    {/* Sapphire bloom, echoing the faceted highlights in the logo */}
    <div
      aria-hidden="true"
      className="absolute -right-40 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-accent-500/10 blur-3xl"
    />

    <div className="container-page py-20 md:py-28 lg:py-32">
      <motion.div
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.1 }}
        className="max-w-3xl"
      >
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-400"
        >
          {COMPANY.label}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl leading-tight text-white sm:text-5xl lg:text-6xl"
        >
          Building digital solutions for businesses, schools, NGOs and startups.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-surface-200 md:text-lg"
        >
          {COMPANY.experienceStatement}
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-col gap-3 sm:flex-row"
        >
          <Button to="/contact" size="lg">
            Start your project
            <FiArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
          <Button href={WHATSAPP_LINK} variant="whatsapp" size="lg">
            <FaWhatsapp aria-hidden="true" className="h-5 w-5" />
            Chat on WhatsApp
          </Button>
        </motion.div>

        {/* Trust strip */}
        <motion.dl
          variants={fadeUp}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 grid max-w-2xl grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-3"
        >
          <div>
            <dt className="sr-only">Years of experience</dt>
            <dd>
              <span className="block text-3xl font-extrabold text-accent-400">
                {COMPANY.yearsExperience}+
              </span>
              <span className="mt-1 block text-sm text-surface-300">
                Years of experience
              </span>
            </dd>
          </div>
          <div>
            <dt className="sr-only">Projects delivered</dt>
            <dd>
              <span className="block text-3xl font-extrabold text-accent-400">
                {PROJECTS.length}
              </span>
              <span className="mt-1 block text-sm text-surface-300">
                Client projects delivered
              </span>
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="sr-only">Services offered</dt>
            <dd>
              <span className="block text-3xl font-extrabold text-accent-400">
                {CORE_SERVICES.length}
              </span>
              <span className="mt-1 block text-sm text-surface-300">
                Services under one roof
              </span>
            </dd>
          </div>
        </motion.dl>
      </motion.div>
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

    {/* Services */}
    <Section
      eyebrow="Core Services"
      title="What we do"
      description="From a first business website to a full enterprise system, we design, build and maintain the software your organization runs on."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CORE_SERVICES.slice(0, 6).map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>

      <div className="mt-10">
        <Button to="/services" variant="outline">
          View all services and pricing
          <FiArrowRight aria-hidden="true" className="h-4 w-4" />
        </Button>
      </div>
    </Section>

    {/* Projects */}
    <Section
      tone="tinted"
      eyebrow="Projects Completed"
      title="Work we have delivered"
      description="Real systems running for real organizations across agriculture, tourism and the NGO sector."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </Section>

    {/* Why choose us */}
    <Section
      tone="dark"
      eyebrow="Why GenieWep"
      title="Why choose GenieWep Technologies?"
      description="Five reasons Ugandan organizations trust us with the systems their work depends on."
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_CHOOSE_US.map((reason, index) => (
          <motion.li
            key={reason.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 0.45,
              delay: Math.min(index * 0.07, 0.3),
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-500/15 text-accent-400">
              <Icon name={reason.icon} className="h-5 w-5" />
            </span>
            <span className="pt-2 text-sm font-medium text-surface-100">
              {reason.text}
            </span>
          </motion.li>
        ))}
      </ul>
    </Section>

    {/* Pricing preview */}
    <Section
      eyebrow="Website Packages"
      title="Transparent pricing, Uganda market rates"
      description="Every package below is a fixed scope with no hidden costs. Web, mobile and desktop application pricing is on the services page."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {WEBSITE_PACKAGES.map((pkg, index) => (
          <PricingCard key={pkg.id} pkg={pkg} index={index} />
        ))}
      </div>

      <div className="mt-10">
        <Button to="/services" variant="outline">
          Compare all packages
          <FiArrowRight aria-hidden="true" className="h-4 w-4" />
        </Button>
      </div>
    </Section>

    {/* Closing CTA */}
    <section className="band-dark">
      <div className="container-page py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl text-white md:text-4xl">
            Let&apos;s build something great together
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-surface-200">
            Tell us what you need and we will come back with a clear scope, timeline
            and fixed price.
          </p>

          <ul className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {['Free consultation', 'Fixed pricing', 'Training after delivery'].map(
              (item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-surface-200">
                  <FiCheck aria-hidden="true" className="h-4 w-4 text-accent-400" />
                  {item}
                </li>
              ),
            )}
          </ul>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/contact" size="lg">
              Request a quote
              <FiArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
            <Button href={WHATSAPP_LINK} variant="whatsapp" size="lg">
              <FaWhatsapp aria-hidden="true" className="h-5 w-5" />
              WhatsApp us
            </Button>
          </div>
        </div>
      </div>
    </section>
  </>
)

export default Home
