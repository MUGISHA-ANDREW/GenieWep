import { ICONS } from '@/utils/iconMap'

/**
 * Renders an icon by its string key from `constants.js`.
 *
 * The lookup resolves against a module-scope map of already-defined components,
 * so nothing is constructed during render and icon identity stays stable across
 * re-renders. Callers pass a name, never a component.
 */
export const Icon = ({ name, className = 'h-5 w-5', title, ...props }) => {
  const Glyph = ICONS[name]

  if (!Glyph) return null

  return (
    <Glyph
      className={className}
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      title={title}
      {...props}
    />
  )
}

export default Icon
