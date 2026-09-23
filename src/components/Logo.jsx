import { Link } from 'react-router-dom'

import logoSrc from '@/assets/images/logo-mark.png'
import { COMPANY } from '@/utils/constants'

/**
 * Brand lockup: the faceted G monogram beside the wordmark.
 *
 * `logo-mark.png` is the monogram cut out of the studio render on
 * transparency, so it sits directly on whatever is behind it — light header,
 * dark footer — with nothing to crop and no slate-grey tile following it
 * around.
 *
 * Still a raster. Swap `logoSrc` for an SVG once the client provides a vector
 * and the width/height hints can go.
 */
export const Logo = ({ onDark = false, className = '' }) => (
  <Link
    to="/"
    className={`group inline-flex items-center gap-2.5 ${className}`}
    aria-label={`${COMPANY.name} — home`}
  >
    <img
      src={logoSrc}
      alt=""
      width="247"
      height="256"
      className="h-9 w-auto object-contain transition-transform duration-300 ease-[var(--ease-brand)] group-hover:scale-105"
    />
    <span className="flex flex-col leading-none">
      <span
        className={`text-[0.9375rem] font-bold tracking-tight transition-colors duration-200 ${
          onDark ? 'text-white' : 'text-title group-hover:text-link'
        }`}
      >
        GenieWep
      </span>
      <span
        className={`mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.2em] ${
          onDark ? 'text-surface-300' : 'text-dim'
        }`}
      >
        Technologies
      </span>
    </span>
  </Link>
)

export default Logo
