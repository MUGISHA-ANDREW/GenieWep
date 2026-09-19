/** Neutral surface used by service, project and content cards. */
export const Card = ({ as: Component = 'div', hoverable = false, className = '', children, ...props }) => {
  const classes = [
    'rounded-xl border border-line bg-card shadow-[var(--shadow-card)]',
    hoverable
      ? 'transition-all duration-300 ease-[var(--ease-brand)] hover:-translate-y-1 hover:border-accent-300 hover:shadow-[var(--shadow-card-hover)]'
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
