import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { FiArrowRight } from 'react-icons/fi'

import Button from '@/components/Button/Button'
import ProjectCard from '@/components/ProjectCard/ProjectCard'
import Section from '@/components/Section'
import Seo from '@/components/Seo'
import { PROJECTS, PROJECT_CATEGORIES } from '@/utils/constants'

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('All')

  const visibleProjects = useMemo(
    () =>
      activeCategory === 'All'
        ? PROJECTS
        : PROJECTS.filter((project) => project.category === activeCategory),
    [activeCategory],
  )

  return (
    <>
      <Seo
        title="Projects & Portfolio"
        description="Websites and systems delivered by GenieWep Technologies for clients in agriculture, agricultural commodities, tourism and the NGO sector."
        path="/projects"
      />

      <section className="bg-navy-900">
        <div className="container-page py-16 md:py-20">
          <p className="eyebrow mb-5">
            Projects Completed
          </p>
          <h1 className="max-w-3xl text-3xl text-white md:text-4xl">
            Work we have delivered
          </h1>
          <p className="mt-5 max-w-2xl text-base text-surface-200 md:text-lg">
            A selection of the organizations we have built for across Uganda.
          </p>
        </div>
      </section>

      <Section>
        {/*
          Industry filter.

          The accent pill is a single shared element that slides from the old
          filter to the new one (`layoutId`), instead of one pill switching off
          while another switches on. It reads as the selection moving, which is
          what actually happened. The pill is behind the label, so the label
          keeps its own colour transition on top of it.
        */}
        <div className="mb-10 flex flex-wrap gap-2">
          {PROJECT_CATEGORIES.map((category) => {
            const isActive = category === activeCategory
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'bg-chip text-body hover:bg-chip-hover hover:text-title'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="project-filter-pill"
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-full bg-azure-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {category}
              </button>
            )
          })}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <p aria-live="polite" className="mt-8 text-sm text-dim">
          Showing {visibleProjects.length} of {PROJECTS.length} projects.
        </p>
      </Section>

      <section className="bg-tint">
        <div className="container-page py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl text-title sm:text-3xl">Your project could be next</h2>
            <p className="mt-4 text-base text-body">
              Tell us what you are building and we will show you how we would
              approach it.
            </p>
            <div className="mt-8">
              <Button to="/contact" size="lg">
                Start a conversation
                <FiArrowRight aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Projects
