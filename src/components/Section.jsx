import Reveal from '@/components/Reveal'

/**
 * Section wrapper with the catalogue's heading treatment: a small uppercase
 * eyebrow, the accent rule, then the heading. Animates in once on scroll.
 *
 * The entrance is delegated to `Reveal` rather than configured here, so the
 * distance, easing and viewport margin match every other element on the site
 * and reduced-motion handling only has to be right in one place.
 */

/*
 * `light` is the page ground (`canvas`), not `card`. The two are both white in
 * light mode but diverge in dark mode, where cards must sit slightly raised
 * above the page behind them.
 */
const TONES = {
  light: 'bg-canvas',
  tinted: 'bg-tint',
  dark: 'band-dark text-surface-100',
}

export const Section = ({
  id,
  eyebrow,
  title,
  description,
  tone = 'light',
  align = 'left',
  className = '',
  containerClassName = '',
  children,
}) => {
  const isDark = tone === 'dark'
  const isCentered = align === 'center'

  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${TONES[tone] ?? TONES.light} ${className}`}
    >
      <div className={`container-page ${containerClassName}`}>
        {(eyebrow || title || description) && (
          <Reveal
            as="header"
            duration={0.5}
            margin="-80px"
            className={`mb-12 max-w-3xl ${isCentered ? 'mx-auto text-center' : ''}`}
          >
            {eyebrow && (
              <p
                className={`mb-3 text-xs font-bold uppercase tracking-[0.18em] ${
                  isDark ? 'text-accent-400' : 'text-link'
                }`}
              >
                {eyebrow}
              </p>
            )}

            {title && (
              <h2
                className={`accent-rule ${isCentered ? 'accent-rule-center' : ''} text-3xl md:text-4xl ${
                  isDark ? 'text-white' : 'text-title'
                }`}
              >
                {title}
              </h2>
            )}

            {description && (
              <p
                className={`mt-4 text-base leading-relaxed md:text-lg ${
                  isDark ? 'text-surface-200' : 'text-body'
                }`}
              >
                {description}
              </p>
            )}
          </Reveal>
        )}

        {children}
      </div>
    </section>
  )
}

export default Section
