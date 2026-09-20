import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiArrowRight, FiCheck } from 'react-icons/fi'

import Button from '@/components/Button/Button'
import Counter from '@/components/Counter'
import Icon from '@/components/Icon'
import PricingCard from '@/components/PricingTable/PricingCard'
import ProjectCard from '@/components/ProjectCard/ProjectCard'
import Reveal, { Stagger, StaggerItem } from '@/components/Reveal'
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
    {/* Background video, muted and decorative. Plays at full opacity. */}
    <video
      className="absolute inset-0 -z-10 h-full w-full object-cover"
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
    {/*
      Scrim, shaped rather than flat.

      This used to be a near-opaque wash over a video held at 14% — the footage
      was texture, not picture. It is now the other way round, so the only job
      left is keeping white text legible over moving footage whose brightness
      nobody controls.

      A gradient does that without hiding the video: from `md` up the text
      column ends around 61% of the container, so the scrim holds its weight to
      62% and then falls away to almost nothing, leaving the right-hand third —
      where the animated wordmark plays — effectively uncovered. Below `md` the
      text runs the full width and there is no empty side to clear, so it falls
      back to one flat tint.

      Worst-case contrast for white text, sampled off the live page across nine
      frames of the loop at 1440px: eyebrow 13.8:1, headline 8.6:1, lede 9.0:1,
      trust strip 11.2:1. At 390px, all above 7:1. The binding one is the lede,
      which is small text and so needs 4.5:1.

      Re-measure if `hero.mp4` is ever re-cut. A brighter grade is exactly the
      change that would quietly push the headline under, and it would do it
      without touching a line of this file.
    */}
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-steel-950/68 md:bg-transparent md:bg-linear-to-r md:from-steel-950/90 md:via-steel-950/72 md:via-62% md:to-steel-950/8"
    />
    {/*
      Sapphire bloom, echoing the faceted highlights in the logo. It drifts on
      a 9-second loop, which is slow enough that a visitor never catches it
      moving — they only notice that the hero is not a flat picture.
    */}
    <div
      aria-hidden="true"
      className="absolute -right-40 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-accent-500/10 blur-3xl animate-drift"
    />
    {/* Aqua counterweight, drifting against the bloom on a longer delay. */}
    <div
      aria-hidden="true"
      className="absolute -bottom-52 -left-32 -z-10 h-[26rem] w-[26rem] rounded-full bg-aqua-500/10 blur-3xl animate-drift [animation-delay:-4.5s]"
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
          Building{' '}
          {/*
            Two words in the brand gradient, panning slowly across itself. The
            effect only works because it is rare — the rest of the headline
            stays plain white, so the eye lands here first.
          */}
          <span className="text-brand-gradient animate-pan">digital solutions</span>{' '}
          for businesses, schools, NGOs and startups.
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
          {/*
            Counts up once when the strip scrolls into view. The figures are
            the reason the row exists, so they get the one animation on the
            page that draws the eye to a number rather than to a shape.
          */}
          <div>
            <dt className="sr-only">Years of experience</dt>
            <dd>
              <Counter
                to={COMPANY.yearsExperience}
                suffix="+"
                className="block text-3xl font-extrabold text-accent-400"
              />
              <span className="mt-1 block text-sm text-surface-300">
                Years of experience
              </span>
            </dd>
          </div>
          <div>
            <dt className="sr-only">Projects delivered</dt>
            <dd>
              <Counter
                to={PROJECTS.length}
                className="block text-3xl font-extrabold text-accent-400"
              />
              <span className="mt-1 block text-sm text-surface-300">
                Client projects delivered
              </span>
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="sr-only">Services offered</dt>
            <dd>
              <Counter
                to={CORE_SERVICES.length}
                className="block text-3xl font-extrabold text-accent-400"
              />
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
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl text-white md:text-4xl">
            Let&apos;s build something great together
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-surface-200">
            Tell us what you need and we will come back with a clear scope, timeline
            and fixed price.
          </p>

          <Stagger
            as="ul"
            step={0.1}
            delay={0.15}
            className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            {['Free consultation', 'Fixed pricing', 'Training after delivery'].map(
              (item) => (
                <StaggerItem
                  as="li"
                  key={item}
                  from="left"
                  className="flex items-center gap-2 text-sm text-surface-200"
                >
                  <FiCheck aria-hidden="true" className="h-4 w-4 text-accent-400" />
                  {item}
                </StaggerItem>
              ),
            )}
          </Stagger>

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
        </Reveal>
      </div>
    </section>
  </>
)

export default Home
