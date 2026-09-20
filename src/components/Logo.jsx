import { Link } from 'react-router-dom'

import logoSrc from '@/assets/images/logo-mark.png'
import { COMPANY } from '@/utils/constants'

/**
 * Brand lockup: the faceted G monogram beside the wordmark.
 *
 * `logo-mark.png` is the monogram cut out of the studio render on transparency.
 * The site used to point at `logo2.jpeg` and crop it square, which meant the
 * mockup's slate wall came along as a dark tile behind the mark — a rounded
 * rectangle of the wrong grey sitting in a white header on every page. With an
 * alpha channel there is nothing to crop and nothing to hide: `object-contain`
 * keeps the monogram's own 247:256 proportions and it sits directly on whatever
 * is behind it, light or dark.
 *
 * Still a raster. Swap `logoSrc` for an SVG once the client provides a vector
 * (PROJECT_BRIEF.md §8 action items) and the width/height hints can go.
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
      width="247"
      height="256"
      /*
        Lifts and grows very slightly on hover. The mark is only 40px tall, so
        anything more than this reads as a wobble rather than as a response.
      */
      className="h-10 w-auto object-contain transition-transform duration-300 ease-[var(--ease-brand)] group-hover:-translate-y-0.5 group-hover:scale-105"
    />
    <span className="flex flex-col leading-tight">
      <span
        className={`text-base font-extrabold tracking-tight transition-colors duration-200 ${
          onDark ? 'text-white' : 'text-title group-hover:text-link'
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
