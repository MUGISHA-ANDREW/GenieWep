/**
 * The raised surface every card on the site is built from.
 *
 * Border plus a 1px inset highlight along the top edge, not a heavy drop
 * shadow — see `.surface` in styles/globals.css for why. On the dark theme a
 * drop shadow is nearly invisible, so the border and the light top edge are
 * what actually make a card read as lifted off the page.
 *
 * `rounded-3xl` by default. Cards are the dominant shape on this design and
 * 24px corners are what keep a dense, dark page from reading as a dashboard;
 * callers that need a tighter radius pass their own.
 */
export const Card = ({
  as: Component = 'div',
  hoverable = false,
  className = '',
  children,
  ...props
}) => {
  const classes = [
    'surface rounded-3xl',
    hoverable ? 'surface-hover' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}

export default Card
