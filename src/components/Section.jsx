import Reveal from '@/components/Reveal'

/**
 * Section wrapper with the site's heading treatment: the heading, then a
 * supporting line. Animates in once on scroll.
 *
 * The entrance is delegated to `Reveal` rather than configured here, so the
 * distance, easing and viewport margin match every other element on the site
 * and reduced-motion handling only has to be right in one place.
 *
 * Vertical rhythm lives here too — pages choose a `tone` and a `size`, never
 * their own `py-` value, which is what stops the site from acquiring five
 * different ideas of how much air a section needs.
 */

const TONES = {
  /* `canvas` is the page ground. `card` would be wrong: the two are near
     identical in light mode but diverge in dark, where a card sits above the
     page rather than being it. */
  light: 'bg-canvas',
  tinted: 'bg-tint',
  dark: 'bg-navy-900',
}

const SIZES = {
  compact: 'py-12 sm:py-16',
  md: 'py-16 sm:py-20 lg:py-24',
  lg: 'py-20 sm:py-24 lg:py-32',
}

export const Section = ({
  id,
  title,
  description,
  tone = 'light',
  size = 'md',
  align = 'left',
  divided = false,
  className = '',
  containerClassName = '',
  children,
}) => {
  const isDark = tone === 'dark'
  const isCentered = align === 'center'

  return (
    <section
      id={id}
      className={[
        SIZES[size] ?? SIZES.md,
        TONES[tone] ?? TONES.light,
        divided ? 'border-t border-line' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={`container-page ${containerClassName}`}>
        {(title || description) && (
          <Reveal
            as="header"
            duration={0.5}
            margin="-80px"
            className={`mb-10 max-w-2xl sm:mb-12 md:mb-16 ${isCentered ? 'mx-auto text-center' : ''}`}
          >

            {title && (
              <h2
                className={`text-2xl leading-[1.2] sm:text-3xl lg:text-[2rem] ${
                  isDark ? 'text-white' : 'text-title'
                }`}
              >
                {title}
              </h2>
            )}

            {description && (
              <p
                className={`mt-4 text-base leading-relaxed sm:mt-5 ${
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
