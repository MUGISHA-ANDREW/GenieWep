import { FiChevronRight } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'

import { NAV_LINKS } from '@/utils/constants'

/**
 * Site navigation — a floating capsule on desktop, a plain stack in the
 * mobile drawer.
 *
 * The desktop pill is a translucent blurred capsule that sits *over* the page
 * rather than a bar that caps it. The active item is a filled azure pill
 * inside it, which is the one place besides a button where the accent appears
 * as a fill — it reads as "you are here" rather than "click me" because it is
 * the only item already selected.
 */
export const Nav = ({ orientation = 'horizontal', onNavigate }) => {
  const isVertical = orientation === 'vertical'

  const linkClasses = ({ isActive }) => {
    if (isVertical) {
      return `group flex items-center justify-between rounded-xl px-4 py-3.5 text-[1.0625rem] font-semibold transition-colors ${
        isActive
          ? 'bg-azure-500/12 text-link'
          : 'text-title hover:bg-chip hover:text-link'
      }`
    }

    return `shrink-0 rounded-full px-3.5 py-2 text-[0.8125rem] font-medium leading-none transition-colors duration-200 ${
      isActive
        ? 'bg-azure-500 text-white'
        : 'text-body hover:bg-chip-hover hover:text-title'
    }`
  }

  return (
    <ul className={isVertical ? 'flex flex-col gap-1' : 'nav-pill'}>
      {NAV_LINKS.map((link) => (
        <li key={link.to}>
          <NavLink
            to={link.to}
            end={link.to === '/'}
            className={linkClasses}
            onClick={onNavigate}
          >
            {link.label}
            {/* A chevron on each row is the cue, on a phone, that the row
                goes somewhere — the same affordance a native list uses. */}
            {isVertical && (
              <FiChevronRight
                aria-hidden="true"
                className="h-4 w-4 text-dim transition-transform duration-200 group-hover:translate-x-0.5"
              />
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

export default Nav
