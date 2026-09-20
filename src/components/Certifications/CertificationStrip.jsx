import { motion, useReducedMotion } from 'framer-motion'

import anabBadge from '@/assets/certifications/anab-iso-iec-17021.png'
import iso14001Badge from '@/assets/certifications/iso-14001-2015.png'
import iso45001Badge from '@/assets/certifications/iso-45001.png'
import iso9001Badge from '@/assets/certifications/iso-9001-2015.png'
import r2Badge from '@/assets/certifications/r2-v3-certified.png'
import { CERTIFICATIONS } from '@/utils/constants'

/**
 * Badge artwork, keyed by the `id` on CERTIFICATIONS — the same split used for
 * the project screenshots and the social icons, so constants.js stays a plain
 * data file with no bundler-resolved imports.
 *
 * All five are transparent PNGs cut out of the single strip the client sent.
 * They must stay transparent: the strip arrived on a flat olive ground that
 * matched nothing on this site, and the whole point of keying it out is that
 * each badge now sits on the page instead of on a coloured rectangle. The one
 * exception is the white field inside the ANAB mark, which is part of the mark
 * and cannot be removed — which is why this row is drawn on a light band in
 * both themes rather than on the page canvas.
 */
const BADGES = {
  'anab-iso-iec-17021': anabBadge,
  'iso-9001-2015': iso9001Badge,
  'iso-14001-2015': iso14001Badge,
  'iso-45001': iso45001Badge,
  'r2-v3-certified': r2Badge,
}

/**
 * The accreditation row on the About page.
 *
 * Each badge is a figure with its standard named underneath, not a bare logo
 * wall: a visitor who does not recognise the R2 mark still learns what it
 * certifies. The note only appears on hover and focus, so the row stays a row
 * and does not turn into five paragraphs.
 */
export const CertificationStrip = () => {
  const prefersReducedMotion = useReducedMotion()

  /* Nothing to show is a real state: a claim that cannot be substantiated gets
     deleted from CERTIFICATIONS, and the caller drops the whole band. */
  if (CERTIFICATIONS.length === 0) return null

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {CERTIFICATIONS.map((certification, index) => (
        <motion.li
          key={certification.id}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{
            duration: 0.45,
            delay: Math.min(index * 0.08, 0.4),
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/*
            No card behind the badge — the white plates are gone at the
            client's request, so each mark sits straight on the band. That only
            works because the band is `band-light` in both themes: the ANAB
            mark carries its own white field, which would read as a floating
            slab on any dark surface.

            `tabIndex` and `group-focus-within` rather than hover alone: the
            note under each badge is real information, so it has to be reachable
            by keyboard and not only by mouse.
          */}
          <figure
            tabIndex={0}
            className="group flex h-full flex-col items-center rounded-xl px-4 py-6 text-center transition-transform duration-300 ease-[var(--ease-brand)] hover:-translate-y-1 focus-visible:-translate-y-1"
          >
            <img
              src={BADGES[certification.id]}
              /*
                The caption below names the certification, so the alt text says
                what the badge is rather than repeating the name into a screen
                reader twice.
              */
              alt={`${certification.name} certification badge`}
              loading="lazy"
              decoding="async"
              className="h-16 w-auto object-contain transition-transform duration-300 ease-[var(--ease-brand)] group-hover:scale-110 group-focus-visible:scale-110 md:h-20"
            />

            <figcaption className="mt-4">
              <span className="block text-sm font-bold text-steel-900">
                {certification.name}
              </span>
              <span className="mt-0.5 block text-xs font-medium text-steel-700">
                {certification.standard}
              </span>
              {/*
                Collapsed to nothing until hover or focus. `grid-rows-[0fr]` to
                `[1fr]` animates a height the browser can actually interpolate,
                which `height: auto` is not.
              */}
              <span className="mt-0 grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-[var(--ease-brand)] group-hover:mt-2 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:mt-2 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100">
                <span className="overflow-hidden text-xs leading-relaxed text-steel-700">
                  {certification.note}
                </span>
              </span>
            </figcaption>
          </figure>
        </motion.li>
      ))}
    </ul>
  )
}

export default CertificationStrip
