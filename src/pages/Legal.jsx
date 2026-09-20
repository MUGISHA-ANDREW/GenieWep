import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import Reveal from '@/components/Reveal'
import Seo from '@/components/Seo'
import { CONTACT, EMAIL_LINK } from '@/utils/constants'
import { LEGAL_DOCUMENTS, LEGAL_LINKS, LEGAL_UPDATED } from '@/utils/legal'

/**
 * Renders one of the three legal documents from `utils/legal.js`.
 *
 * One component for all three: they share a layout, and three separate pages
 * would mean three places to fix a heading style. The route picks the document
 * by key, so `/terms`, `/privacy` and `/cookies` are three routes over one
 * code path — and all three sit in a single lazy chunk, which is the right
 * trade for pages a visitor reaches once.
 *
 * Deliberately narrow: `max-w-3xl` puts these at roughly 75 characters a line.
 * Legal copy is the text on a site least likely to be read, so the one thing
 * worth spending on is making it readable.
 */
export const Legal = ({ id }) => {
  const doc = LEGAL_DOCUMENTS[id]

  /*
   * A bad `id` is a routing mistake in this repo, not something a visitor can
   * do — the routes in App.jsx pass literals. Rendering nothing beats throwing
   * a blank page inside the ErrorBoundary.
   */
  if (!doc) return null

  const others = LEGAL_LINKS.filter((link) => link.to !== doc.slug)

  return (
    <>
      <Seo title={doc.title} description={doc.description} path={doc.slug} />

      <section className="band-dark">
        <div className="container-page py-16 md:py-20">
          <Reveal>
            <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-400">
              <span aria-hidden="true" className="h-px w-8 bg-accent-400/70" />
              Legal
            </p>
            <h1 className="max-w-3xl text-4xl text-white md:text-5xl">{doc.title}</h1>
            <p className="mt-5 max-w-2xl text-base text-surface-200 md:text-lg">
              {doc.intro}
            </p>
            <p className="mt-6 text-sm text-surface-300">
              Last updated {LEGAL_UPDATED}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="bg-canvas py-16 md:py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            {doc.sections.map((section, index) => (
              <Reveal
                as="section"
                key={section.heading}
                delay={Math.min(index * 0.04, 0.2)}
                margin="-40px"
                className="mb-10 last:mb-0"
              >
                <h2 className="mb-3 text-xl text-title md:text-2xl">
                  {section.heading}
                </h2>
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mb-3 text-base leading-relaxed text-body last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </Reveal>
            ))}

            {/* Questions about a policy go to a person, not into the void. */}
            <Reveal margin="-40px" className="mt-14 border-t border-line pt-8">
              <h2 className="mb-3 text-xl text-title">Questions about this?</h2>
              <p className="text-base leading-relaxed text-body">
                Email{' '}
                <a
                  href={EMAIL_LINK}
                  className="font-semibold text-link underline decoration-accent-300 decoration-2 underline-offset-4 transition-colors hover:text-link-strong"
                >
                  {CONTACT.email}
                </a>{' '}
                and a person will answer.
              </p>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {others.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-link transition-colors hover:text-link-strong"
                    >
                      {link.label}
                      <FiArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  )
}

export default Legal
