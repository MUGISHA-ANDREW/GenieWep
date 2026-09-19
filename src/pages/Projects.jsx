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

      <section className="band-dark">
        <div className="container-page py-16 md:py-20">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-400">
            Projects Completed
          </p>
          <h1 className="max-w-3xl text-4xl text-white md:text-5xl">
            Work we have delivered
          </h1>
          <p className="mt-5 max-w-2xl text-base text-surface-200 md:text-lg">
            A selection of the organizations we have built for across Uganda.
          </p>
        </div>
      </section>

      <Section>
        {/* Industry filter */}
        <div className="mb-10 flex flex-wrap gap-2">
          {PROJECT_CATEGORIES.map((category) => {
            const isActive = category === activeCategory
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-accent-500 text-white'
                    : 'bg-chip text-body hover:bg-chip-hover hover:text-title'
                }`}
              >
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
            <h2 className="text-3xl text-title">Your project could be next</h2>
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
