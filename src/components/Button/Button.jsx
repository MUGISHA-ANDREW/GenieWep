import { Link } from 'react-router-dom'

/**
 * One button, three shapes: a router <Link> (`to`), an <a> (`href`), or a
 * <button>. Keeping them in one component means focus rings, sizing and
 * disabled styling stay identical across the site.
 *
 * `rounded-xl` throughout, matching the card and tile radii — on a design this
 * rounded a square-cornered button reads as a leftover from another site.
 */

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ease-[var(--ease-brand)] disabled:cursor-not-allowed disabled:opacity-60'

const VARIANTS = {
  /*
   * The only filled azure element on a page, and the only one carrying the
   * azure glow. White on azure-600 measures 5.2:1; azure-500 is a touch
   * brighter and lands under 4.5, so it stays a hover state rather than a
   * resting fill.
   */
  primary:
    'bg-azure-600 text-white shadow-[var(--shadow-azure)] hover:bg-azure-500 hover:-translate-y-0.5 active:translate-y-0',
  /*
   * The companion to `primary`: a raised neutral surface that sits beside it
   * without competing. `chip` rather than the fixed navy `solid` token —
   * `solid` stays dark in both themes and was pairing a near-black fill with
   * near-black themed text on the light theme.
   */
  secondary:
    'border border-line bg-chip text-title hover:border-azure-500/40 hover:bg-chip-hover hover:-translate-y-0.5 active:translate-y-0',
  /* A card-coloured button for use inside a card, where `secondary` would
     disappear into the surface behind it. */
  outline:
    'border border-line bg-card/80 text-title hover:border-azure-500/40 hover:text-link',
  ghost: 'text-title hover:bg-chip',
  /* For the navy bands, where `border-line` is invisible. */
  onDark:
    'border border-white/20 text-white hover:border-white/60 hover:bg-white/10',
  /*
   * Dark label, not white. WhatsApp's own green is bright enough that white
   * text on it lands at about 2:1 — well under the 4.5:1 this site holds
   * itself to — while a near-black label on it clears 9:1. The green is
   * exactly WhatsApp's; only the label colour differs, and it stays legible on
   * the darker hover fill too.
   *
   * The floating button is a separate case: it carries the logo mark alone,
   * which WCAG exempts, so it keeps the familiar white glyph on green.
   */
  whatsapp:
    'bg-whatsapp text-navy-950 hover:bg-whatsapp-dark hover:-translate-y-0.5 active:translate-y-0',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm sm:px-7 sm:py-3.5 sm:text-base',
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
