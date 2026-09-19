import { Link } from 'react-router-dom'

import logoSrc from '@/assets/images/logo2.jpeg'
import { COMPANY } from '@/utils/constants'

/**
 * Brand lockup: the faceted G monogram beside the wordmark.
 *
 * `logo2.jpeg` is a wide mockup render (roughly 3:2) with the monogram centred
 * on a dark slate ground, so it is cropped to a square with `object-cover` and
 * `object-center` rather than being squashed to fit. The monogram's own facets
 * run from `accent-500` to `accent-300`, which is where the azure palette was
 * sampled from — so the tile reads as a deliberate brand mark against the white
 * header rather than a pasted photo. Its background is neutral slate, a shade
 * cooler than `steel-800`; the vector swap below closes that last gap.
 *
 * Swap `logoSrc` for an SVG once the client provides a vector version
 * (PROJECT_BRIEF.md §8 action items); the crop classes can then be dropped.
 */
export const Logo = ({ onDark = false, className = '' }) => (
  <Link
    to="/"
    className={`group inline-flex items-center gap-3 ${className}`}
    aria-label={`${COMPANY.name} — home`}
  >
    <img
      src={logoSrc}
      alt=""
      width="40"
      height="40"
      className="h-10 w-10 rounded-lg object-cover object-center shadow-sm ring-1 ring-steel-900/10 transition-transform duration-300 ease-[var(--ease-brand)] group-hover:scale-105"
    />
    <span className="flex flex-col leading-tight">
      <span
        className={`text-base font-extrabold tracking-tight ${
          onDark ? 'text-white' : 'text-title'
        }`}
      >
        GenieWep
      </span>
      <span
        className={`text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${
          onDark ? 'text-accent-300' : 'text-link'
        }`}
      >
        Technologies
      </span>
    </span>
  </Link>
)

export default Logo
