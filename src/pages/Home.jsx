import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiArrowDown, FiArrowRight, FiCheck } from 'react-icons/fi'

import Button from '@/components/Button/Button'
import Counter from '@/components/Counter'
import Icon from '@/components/Icon'
import PricingCard from '@/components/PricingTable/PricingCard'
import ProjectCard from '@/components/ProjectCard/ProjectCard'
import Reveal, { Stagger, StaggerItem } from '@/components/Reveal'
import Section from '@/components/Section'
import Seo from '@/components/Seo'
import ServiceCard from '@/components/ServiceCard/ServiceCard'
import heroImage from '@/assets/images/hero-grid.jpg'
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
    {/*
      Background image, decorative.

      This replaced the `hero.mp4` loop. A still costs one 117kb request
      against the video's ~965kb, decodes on first paint instead of waiting on
      buffering, and cannot be blocked by a phone's data-saver — and the
      wireframe terrain reads as the same thing at any moment, which is exactly
      what a looping ambient video was being used for.

      `fetchPriority="high"` and no lazy loading: this is the largest element
      above the fold, so it is the LCP. Deferring it would be deferring the
      metric.
    */}
    <img
      src={heroImage}
      alt=""
      width="1200"
      height="675"
      fetchPriority="high"
      decoding="async"
      aria-hidden="true"
      className="absolute inset-0 -z-10 h-full w-full object-cover"
    />
    {/*
      Scrim, in two layers.

      The horizontal layer does the same job it did over the video: heavy under
      the text column, which ends around 58% of the container from `md` up,
      then clearing to nothing so the terrain is visible on the right. Below
      `md` the text runs full width, so it falls back to one flat tint.

      The vertical layer is a light 45% lift off the bottom edge only. The grid
      brightens toward the horizon, and this keeps the trust strip clear of it
      without dimming the part of the picture worth showing. A heavier version
      of this layer was tried first and crushed the terrain to almost nothing —
      it measured beautifully and looked like a plain navy block.

      Worst-case contrast for white text, measured off the live page by hiding
      each run and sampling the pixels behind it — at 1440px: eyebrow 17.0:1,
      headline 12.8:1, lede 12.0:1, trust strip 10.6:1. At 390px: 13.5, 12.6,
      12.8, 8.7. The binding one is the lede, small text needing 4.5:1. The
      uncovered right-hand side sits at 2.2:1, which is the picture showing
      through as intended — nothing is set on it.

      Re-measure if the image is ever swapped. A brighter one is exactly the
      change that would quietly push the trust strip under, and it would do it
      without touching a line of this file.
    */}
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-steel-950/68 md:bg-transparent md:bg-linear-to-r md:from-steel-950/88 md:via-steel-950/66 md:via-58% md:to-transparent"
    />
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-linear-to-t from-steel-950/45 via-transparent via-30% to-transparent"
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
        {/*
          The rule before the eyebrow is borrowed from the reference layout the
          client sent. It gives the label something to sit against on a busy
          photographic background, where an unanchored line of small caps reads
          as debris. A span rather than the `.accent-rule` class, which stacks
          its bar above the text instead of beside it.
        */}
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-400"
        >
          <span aria-hidden="true" className="h-px w-8 bg-accent-400/70" />
          {COMPANY.label}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          /* One step down at every breakpoint (was 4xl/5xl/6xl). At 6xl the
             headline ran to three lines on a laptop and crowded the terrain
             out of its own hero. */
          className="text-3xl leading-tight text-white sm:text-4xl lg:text-5xl"
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

    {/*
      Scroll cue, bottom-right, from the reference layout. A full-bleed image
      hero gives no edge to hint that the page continues, which is the one real
      problem with the shape — this is the cheapest fix for it.

      Hidden below `lg`: on a phone the hero does not fill the viewport and the
      next section is already visible, so the cue would be pointing at
      something the visitor can see. `aria-hidden` because a scrollbar already
      says this to assistive technology, and the bounce is CSS so the
      reduced-motion block in globals.css stops it.
    */}
    <div
      aria-hidden="true"
      /*
        Bottom-centre, not bottom-right as in the reference: the floating
        WhatsApp button is pinned to that corner on every page, and the two
        overlapped.
      */
      className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-surface-300 lg:flex"
    >
      Scroll to explore
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-white/25">
        <FiArrowDown className="h-4 w-4 animate-bounce" />
      </span>
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
            className="flex items-start gap-4 rounded-xl bg-white/5 p-5 backdrop-blur-sm"
          >
            <span className="inline-flex shrink-0 text-accent-400">
              <Icon name={reason.icon} className="h-7 w-7" />
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
