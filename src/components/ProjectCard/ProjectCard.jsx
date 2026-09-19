import { motion } from 'framer-motion'
import { FiExternalLink } from 'react-icons/fi'

import Card from '@/components/Card/Card'
import gvmShot from '@/assets/projects/gvm-company.jpg'
import nkurubaShot from '@/assets/projects/nkuruba-tours.jpg'
import scavalShot from '@/assets/projects/scaval.jpg'
import smallBeginningsShot from '@/assets/projects/small-beginnings-uganda.jpg'

/**
 * Home-page screenshots, keyed by project id and captured at 1440x810. That is
 * a little wider than the 16:10 frame below, so object-cover trims ~5% off each
 * side — the price of a capture short enough that no site's below-the-fold
 * content creeps into the bottom of its thumbnail.
 *
 * Keyed here rather than stored on PROJECTS so `constants.js` stays a plain
 * data file with no bundler-resolved imports, the same split used for the
 * service and social icons.
 *
 * These are point-in-time captures of live client sites. If a client redesigns,
 * the card silently shows their old site until the file is re-captured.
 */
const SCREENSHOTS = {
  'gvm-company': gvmShot,
  scaval: scavalShot,
  'nkuruba-tours': nkurubaShot,
  'small-beginnings-uganda': smallBeginningsShot,
}

/**
 * Renders one entry from PROJECTS (catalogue Section 2).
 *
 * Small Beginnings Uganda has no public URL in the 2026 catalogue, so this
 * component renders a non-linked card for it rather than inventing a domain —
 * its screenshot still shows, just without a 'Visit site' link.
 */
export const ProjectCard = ({ project, index = 0 }) => {
  const hasUrl = Boolean(project.url)
  const screenshot = SCREENSHOTS[project.id]

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.08, 0.32),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <Card hoverable className="group flex h-full flex-col overflow-hidden">
        <div className="relative flex aspect-16/10 items-center justify-center overflow-hidden bg-linear-to-br from-steel-800 to-steel-600">
          {screenshot ? (
            <img
              src={screenshot}
              /*
                The heading directly below already names the project, so the
                alt says what the picture adds — that this is the live site —
                instead of repeating the name into a screen reader twice.
              */
              alt={`Home page of the ${project.name} website`}
              width="1440"
              height="810"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            /* No capture on file for this project: the initial keeps the
               grid from looking broken. See PROJECT_BRIEF.md §8. */
            <span className="text-5xl font-extrabold text-white/15 transition-transform duration-500 group-hover:scale-110">
              {project.name.charAt(0)}
            </span>
          )}

          {/*
            Over a photo the old bg-white/10 chip washed out, so the badge sits
            on the brand navy at 70% with a blur — legible on every screenshot
            without hiding the image behind a slab.
          */}
          <span className="absolute left-4 top-4 rounded-full bg-steel-950/70 px-3 py-1 text-xs font-semibold text-accent-300 ring-1 ring-white/15 backdrop-blur-sm">
            {project.industry}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="mb-1 text-lg text-title">{project.name}</h3>

          {project.domain && (
            <p className="mb-3 text-sm font-medium text-link">{project.domain}</p>
          )}

          <p className="mb-5 flex-1 text-sm leading-relaxed text-body">
            {project.description}
          </p>

          {hasUrl ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-title transition-colors hover:text-link"
            >
              Visit site
              <FiExternalLink aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
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
