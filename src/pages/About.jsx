import { motion } from 'framer-motion'
import { FiArrowRight, FiEye, FiTarget } from 'react-icons/fi'

import Button from '@/components/Button/Button'
import Card from '@/components/Card/Card'
import Icon from '@/components/Icon'
import Section from '@/components/Section'
import Seo from '@/components/Seo'
import aboutImage from '@/assets/images/img.jpeg'
import { COMPANY, TECH_STACK, WHY_CHOOSE_US } from '@/utils/constants'

const About = () => (
  <>
    <Seo
      title="About Us"
      description="GenieWep Technologies is a Ugandan software development startup with 5 years of experience building secure, responsive and scalable applications."
      path="/about"
    />

    <section className="band-dark">
      <div className="container-page py-16 md:py-20">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-400">
          About {COMPANY.shortName}
        </p>
        <h1 className="max-w-3xl text-4xl text-white md:text-5xl">
          A Ugandan software company building for Africa
        </h1>
        <p className="mt-5 max-w-3xl text-base text-surface-200 md:text-lg">
          {COMPANY.summary}
        </p>
      </div>
    </section>

    {/* Story + image */}
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="accent-rule text-3xl text-title">
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
            <ul className="flex flex-wrap gap-2">
              {COMPANY.markets.map((market) => (
                <li
                  key={market}
                  className="rounded-full bg-chip px-3.5 py-1.5 text-sm font-medium text-title"
                >
                  {market}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={aboutImage}
            alt="The GenieWep Technologies logo mounted on a slate wall in a modern office reception"
            width="800"
            height="600"
            loading="lazy"
            decoding="async"
            className="w-full rounded-xl object-cover shadow-[var(--shadow-card-hover)]"
          />
        </motion.div>
      </div>
    </Section>

    {/* Mission & vision */}
    <Section tone="tinted" align="center" title="Mission & Vision">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-accent-500 p-8">
          <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent-500/10 text-link">
            <FiTarget aria-hidden="true" className="h-5 w-5" />
          </span>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-link">
            Mission
          </h3>
          <p className="text-base leading-relaxed text-body">{COMPANY.mission}</p>
        </Card>

        <Card className="border-l-4 border-l-steel-700 p-8">
          <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-steel-700/10 text-title">
            <FiEye aria-hidden="true" className="h-5 w-5" />
          </span>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-title">
            Vision
          </h3>
          <p className="text-base leading-relaxed text-body">{COMPANY.vision}</p>
        </Card>
      </div>
    </Section>

    {/* Why choose us */}
    <Section
      eyebrow="Why GenieWep"
      title="Why choose GenieWep Technologies?"
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_CHOOSE_US.map((reason) => (
          <li key={reason.id}>
            <Card hoverable className="flex h-full items-start gap-4 p-5">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chip text-link">
                <Icon name={reason.icon} className="h-5 w-5" />
              </span>
              <span className="pt-2 text-sm font-medium text-title">
                {reason.text}
              </span>
            </Card>
          </li>
        ))}
      </ul>
    </Section>

    {/* Tech stack */}
    <Section
      tone="tinted"
      eyebrow="Tech Stack"
      title="The tools we build with"
      description="We choose proven, well-supported technology so your system stays maintainable long after launch."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TECH_STACK.map((tech) => (
          <Card key={tech.name} hoverable className="p-6">
            <h3 className="mb-1 text-base text-title">{tech.name}</h3>
            <p className="text-sm text-body">{tech.note}</p>
          </Card>
        ))}
      </div>
    </Section>

    <section className="band-dark">
      <div className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl text-white">Work with us</h2>
          <p className="mt-4 text-base text-surface-200">
            Tell us about your organization and what you need built.
          </p>
          <div className="mt-8">
            <Button to="/contact" size="lg">
              Get in touch
              <FiArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  </>
)

export default About
