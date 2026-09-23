import { motion } from 'framer-motion'
import { FiArrowRight, FiEye, FiTarget } from 'react-icons/fi'

import Button from '@/components/Button/Button'
import Card from '@/components/Card/Card'
import CertificationStrip from '@/components/Certifications/CertificationStrip'
import Icon from '@/components/Icon'
import Reveal, { Stagger, StaggerItem } from '@/components/Reveal'
import Section from '@/components/Section'
import Seo from '@/components/Seo'
import TeamCard from '@/components/TeamCard/TeamCard'
import aboutImage from '@/assets/images/img.jpeg'
import {
  CERTIFICATIONS,
  COMPANY,
  TEAM,
  TECH_STACK,
  WHY_CHOOSE_US,
} from '@/utils/constants'

const About = () => (
  <>
    <Seo
      title="About Us"
      description="GenieWep Technologies is a Ugandan software development startup based in Kampala, with 5 years of experience building secure, responsive and scalable applications."
      path="/about"
    />

    <section className="bg-navy-900">
      <div className="container-page py-16 md:py-20">
        {/* Walks the eyebrow, headline and summary in one after the other. */}
        <Stagger step={0.1}>
          <StaggerItem
            as="p"
            className="eyebrow mb-5"
          >
            About {COMPANY.shortName}
          </StaggerItem>
          <StaggerItem as="h1" className="max-w-3xl text-4xl text-white md:text-5xl">
            A Ugandan software company building for Africa
          </StaggerItem>
          <StaggerItem
            as="p"
            className="mt-5 max-w-3xl text-base text-surface-200 md:text-lg"
          >
            {COMPANY.summary}
          </StaggerItem>
        </Stagger>
      </div>
    </section>

    {/* Story + image */}
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal from="left">
          <h2 className="text-2xl text-title md:text-3xl">
            Five years of building software that works
          </h2>
          <p className="mt-4 text-base leading-relaxed text-body">
            {COMPANY.experienceStatement}
          </p>
          <p className="mt-4 text-base leading-relaxed text-body">
            We work with organizations at every stage, from a small business
            getting online for the first time to an established NGO that needs a
            content dashboard its own team can run.
          </p>

          <div className="mt-8">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-title">
              Who we build for
            </h3>
            {/*
              The chips arrive one at a time and lift under the cursor. Six
              static pills read as a legend; six that respond read as a list of
              sectors the company actually works in.
            */}
            <Stagger as="ul" step={0.06} className="flex flex-wrap gap-2">
              {COMPANY.markets.map((market) => (
                <StaggerItem
                  as="li"
                  key={market}
                  className="cursor-default rounded-full bg-chip px-3.5 py-1.5 text-sm font-medium text-title transition-all duration-200 ease-[var(--ease-brand)] hover:-translate-y-0.5 hover:bg-azure-500 hover:text-white"
                >
                  {market}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="group overflow-hidden rounded-xl shadow-[var(--shadow-surface-lg)]"
        >
          <img
            src={aboutImage}
            alt="The GenieWep Technologies logo mounted on a slate wall in a modern office reception"
            width="800"
            height="600"
            loading="lazy"
            decoding="async"
            /* The zoom lives on the image and the clipping on the wrapper, so
               the corners stay rounded while it scales. */
            className="w-full object-cover transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-105"
          />
        </motion.div>
      </div>
    </Section>

    {/* Mission & vision */}
    <Section tone="tinted" align="center" title="Mission & Vision">
      <div className="grid gap-6 md:grid-cols-2">
        <Reveal from="left">
          {/* The 4px accent bar that used to run down the left of these two
              cards is gone with the rest of the borders. Mission and vision
              are still told apart by their icon and heading colour. */}
          <Card hoverable className="h-full p-8">
            {/* Bare glyph: the tinted tiles behind icons are gone site-wide. */}
            <span className="mb-4 inline-flex text-link">
              <FiTarget aria-hidden="true" className="h-8 w-8" />
            </span>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-link">
              Mission
            </h3>
            <p className="text-base leading-relaxed text-body">{COMPANY.mission}</p>
          </Card>
        </Reveal>

        <Reveal from="right" delay={0.1}>
          <Card hoverable className="h-full p-8">
            <span className="mb-4 inline-flex text-title">
              <FiEye aria-hidden="true" className="h-8 w-8" />
            </span>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-title">
              Vision
            </h3>
            <p className="text-base leading-relaxed text-body">{COMPANY.vision}</p>
          </Card>
        </Reveal>
      </div>
    </Section>

    {/*
      The team.
      Cards lead with the discipline rather than a person, because the client
      has not supplied names, photos or bios yet — see the note on TEAM in
      constants.js for what changes when they do.
    */}
    <Section
      id="team"
      eyebrow="The Team"
      title="The people who build your software"
      description="A small senior team, which is why the person who scopes your project is the person who builds it. No handover to a junior after the deposit clears."
    >
      {/*
        Two cards, so the row is capped and centred rather than stretched
        across the full container — two 640px-wide cards would read as banners
        rather than as people. Add `lg:grid-cols-3` and drop the max-width if a
        third member joins.
      */}
      <ul className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
        {TEAM.map((member, index) => (
          <TeamCard key={member.id} member={member} index={index} />
        ))}
      </ul>
    </Section>

    {/*
      Accreditation.
      `bg-surface-50` rather than a themed tone: these are third-party marks with
      their colours fixed, and the ANAB badge carries its own white field, so
      the surface behind them has to stay light in dark mode too. Anything in
      here uses the fixed `navy-*` and `surface-*` ramps for the same reason.
    */}
    {CERTIFICATIONS.length > 0 && (
      <section className="bg-surface-50 border-y border-navy-900/8">
        <div className="container-page py-16 md:py-24">
          <Reveal className="mb-12 max-w-3xl">
            <p className="eyebrow mb-5">
              Certifications
            </p>
            <h2 className="text-2xl text-navy-900 md:text-3xl">
              Accredited to international standards
            </h2>
            <p className="mt-4 text-base leading-relaxed text-navy-700 md:text-lg">
              The standards we hold ourselves to on quality, environment, safety
              and responsible disposal. Hover a badge for what it covers.
            </p>
          </Reveal>

          <CertificationStrip />
        </div>
      </section>
    )}

    {/* Why choose us */}
    <Section tone="tinted" eyebrow="Why GenieWep" title="Why choose GenieWep Technologies?">
      <Stagger as="ul" step={0.07} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_CHOOSE_US.map((reason) => (
          <StaggerItem as="li" key={reason.id}>
            <Card hoverable className="group flex h-full items-start gap-4 p-5">
              <span className="inline-flex shrink-0 text-link transition-colors duration-300 group-hover:text-azure-500">
                <Icon name={reason.icon} className="h-7 w-7" />
              </span>
              <span className="pt-2 text-sm font-medium text-title">
                {reason.text}
              </span>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>

    {/* Tech stack */}
    <Section
      eyebrow="Tech Stack"
      title="The tools we build with"
      description="We choose proven, well-supported technology so your system stays maintainable long after launch."
    >
      <Stagger as="div" step={0.06} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TECH_STACK.map((tech) => (
          <StaggerItem key={tech.name}>
            <Card hoverable className="h-full p-6">
              <h3 className="mb-1 text-base text-title">{tech.name}</h3>
              <p className="text-sm text-body">{tech.note}</p>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>

    <section className="bg-navy-900">
      <div className="container-page py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-white sm:text-3xl">Work with us</h2>
          <p className="mt-4 text-base text-surface-200">
            Tell us about your organization and what you need built.
          </p>
          <div className="mt-8">
            <Button to="/contact" size="lg">
              Get in touch
              <FiArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  </>
)

export default About
