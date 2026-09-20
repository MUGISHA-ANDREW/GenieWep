/**
 * Neutral surface used by service, project and content cards.
 *
 * No border. Cards are defined by elevation alone at the client's request —
 * the hairline `border-line` outline is gone, and so is the `accent-300` edge
 * it picked up on hover.
 *
 * That puts all the weight on the shadow, which matters in light mode: `card`
 * and `canvas` are both pure white there, so the shadow is the *only* thing
 * separating a card from the page behind it. The base elevation in theme.css
 * was lifted slightly when the border came off to keep that separation
 * readable. In dark mode the two surfaces differ, so the card reads on colour
 * as well.
 */
export const Card = ({ as: Component = 'div', hoverable = false, className = '', children, ...props }) => {
  const classes = [
    'rounded-xl bg-card shadow-[var(--shadow-card)]',
    hoverable
      ? 'transition-all duration-300 ease-[var(--ease-brand)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]'
      : '',
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
