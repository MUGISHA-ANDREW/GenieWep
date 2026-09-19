import { Link } from 'react-router-dom'

/**
 * One button, three shapes: a router <Link> (`to`), an <a> (`href`), or a
 * <button>. Keeping them in one component means focus rings, sizing and
 * disabled styling stay identical across the site.
 */

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 ease-[var(--ease-brand)] disabled:cursor-not-allowed disabled:opacity-60'

const VARIANTS = {
  primary:
    'bg-accent-500 text-white hover:bg-accent-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-500/25 active:translate-y-0',
  /*
   * `solid` rather than a fixed steel: on a dark card this button would
   * otherwise be near-invisible dark-on-dark. The token steps lighter in dark
   * mode while keeping white text in both.
   */
  secondary:
    'bg-solid text-white hover:bg-solid-hover hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0',
  /*
   * Outline borrows the link colour rather than a fixed steel. A hard-coded
   * `border-steel-800` would vanish against the dark canvas in dark mode.
   */
  outline:
    'border-2 border-link text-link hover:bg-link hover:text-white hover:border-link',
  ghost: 'text-title hover:bg-chip',
  onDark:
    'border-2 border-white/30 text-white hover:border-white hover:bg-white/10 backdrop-blur-sm',
  /*
   * Dark label, not white. WhatsApp's own green is bright enough that white
   * text on it lands at about 2:1 — well under the 4.5:1 this site holds
   * itself to — while the brand navy on it clears 9:1. The green is exactly
   * WhatsApp's; only the label colour differs, and it stays legible on the
   * darker hover fill too.
   *
   * The floating button is a separate case: it carries the logo mark alone,
   * which WCAG exempts, so it keeps the familiar white glyph on green.
   */
  whatsapp:
    'bg-whatsapp text-steel-950 hover:bg-whatsapp-dark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-whatsapp/30 active:translate-y-0',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export const Button = ({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const classes = [
    BASE,
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    const isExternal = href.startsWith('http')
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    )
  }

  const Component = as ?? 'button'
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}

export default Button
