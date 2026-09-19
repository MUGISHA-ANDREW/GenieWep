import { NavLink } from 'react-router-dom'

import { NAV_LINKS } from '@/utils/constants'

/**
 * Primary navigation links, shared by the desktop bar and the mobile drawer.
 * `NavLink` supplies `aria-current="page"` automatically for the active route.
 */
export const Nav = ({ orientation = 'horizontal', onNavigate, onDark = false }) => {
  const isVertical = orientation === 'vertical'

  const linkClasses = ({ isActive }) => {
    const base = isVertical
      ? 'block rounded-lg px-4 py-3 text-base font-semibold transition-colors'
      : 'relative px-1 py-2 text-sm font-semibold transition-colors'

    if (isVertical) {
      return `${base} ${
        isActive ? 'bg-accent-500 text-white' : 'text-title hover:bg-chip'
      }`
    }

    const idle = onDark
      ? 'text-white/80 hover:text-white'
      : 'text-body hover:text-title'
    const active = onDark ? 'text-white' : 'text-link'

    return `${base} ${isActive ? active : idle} after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:rounded-full after:bg-accent-500 after:transition-all after:duration-300 ${
      isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
    }`
  }

  return (
    <ul
      className={
        isVertical ? 'flex flex-col gap-1' : 'flex items-center gap-7'
      }
    >
      {NAV_LINKS.map((link) => (
        <li key={link.to}>
          <NavLink to={link.to} end={link.to === '/'} className={linkClasses} onClick={onNavigate}>
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

export default Nav
