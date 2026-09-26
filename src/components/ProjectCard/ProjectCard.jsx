import { motion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'

import Card from '@/components/Card/Card'
import gvmShot from '@/assets/projects/gvm-company.jpg'
import nkurubaShot from '@/assets/projects/nkuruba-tours.jpg'
import scavalShot from '@/assets/projects/scaval.jpg'
import smallBeginningsShot from '@/assets/projects/small-beginnings-uganda.jpg'

/**
 * One portfolio entry: the live site's home page above, the facts below.
 *
 * The screenshot is the strongest asset this site has, so it gets the top
 * two-thirds of the card and a slow zoom on hover. The industry badge sits on
 * the image at the top-left over a dark blur — over a mostly-white screenshot
 * a translucent white chip washes out completely.
 *
 * The photo map lives here rather than in constants.js so the data file stays
 * free of bundler-resolved imports and can be read by tests and build scripts
 * without pulling in the asset pipeline.
 */
const SCREENSHOTS = {
  'gvm-company': gvmShot,
  scaval: scavalShot,
  'nkuruba-tours': nkurubaShot,
  'small-beginnings-uganda': smallBeginningsShot,
}

export const ProjectCard = ({ project, index = 0 }) => {
  const hasUrl = Boolean(project.url)
  const screenshot = SCREENSHOTS[project.id]

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.07, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <Card hoverable className="group flex h-full flex-col overflow-hidden">
        <div className="relative flex aspect-16/10 items-center justify-center overflow-hidden border-b border-line bg-chip">
          {screenshot ? (
            <img
              src={screenshot}
              /* The heading directly below already names the project, so the
                 alt says what the picture adds — that this is the live site —
                 rather than repeating the name into a screen reader twice. */
              alt={`Home page of the ${project.name} website`}
              width="1440"
              height="810"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-105"
            />
          ) : (
            /* No screenshot supplied yet. A monogram rather than a broken
               frame, so the grid does not look like it failed to load. */
            <span className="text-5xl font-bold text-line-strong/40">
              {project.name.charAt(0)}
            </span>
          )}

          <span className="absolute left-3 top-3 rounded-full bg-navy-950/75 px-2.5 py-1 text-[0.6875rem] font-semibold text-azure-300 ring-1 ring-white/10 backdrop-blur-sm">
            {project.industry}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="text-base font-bold text-title">{project.name}</h3>

          {project.domain && (
            <p className="mt-0.5 text-sm font-medium text-link">
              {project.domain}
            </p>
          )}

          <p className="mt-3 mb-5 flex-1 text-sm leading-relaxed text-body">
            {project.description}
          </p>

          {hasUrl ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-title transition-colors hover:text-link"
            >
              Visit site
              <FiArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 ease-[var(--ease-brand)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            /* Small Beginnings Uganda has no public URL in the 2026
               catalogue. Saying so plainly beats linking somewhere that is
               not theirs. */
            <span className="text-sm font-medium text-dim">
              Case study available on request
            </span>
          )}
        </div>
      </Card>
    </motion.article>
  )
}

export default ProjectCard
