import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { useLocation } from 'react-router-dom'

import Button from '@/components/Button/Button'
import Logo from '@/components/Logo'
import Nav from '@/components/Navigation/Nav'
import ThemeToggle from '@/components/ThemeToggle'
import useScrollLock from '@/hooks/useScrollLock'
import useWindowScroll from '@/hooks/useWindowScroll'

export const Header = () => {
  const { isScrolled } = useWindowScroll(16)
  const { pathname } = useLocation()

  /*
   * The drawer records which route it was opened on. If the route since
   * changed, it reads as closed. Deriving this during render closes the menu on
   * every navigation — link clicks, logo clicks and browser back alike — without
   * a reset effect that would trigger a second render pass on every route change.
   */
  const [menu, setMenu] = useState({ isOpen: false, path: pathname })
  const isMenuOpen = menu.isOpen && menu.path === pathname

  const setIsMenuOpen = (open) => setMenu({ isOpen: open, path: pathname })

  useScrollLock(isMenuOpen)

  // Close on Escape.
  useEffect(() => {
    if (!isMenuOpen) return undefined

    const handleKeyDown = (event) => {
      // The raw setter is used here rather than the `setIsMenuOpen` helper:
      // `setMenu` is stable across renders, so the effect does not need to be
      // torn down and re-attached on every render.
      if (event.key === 'Escape') {
        setMenu((current) => ({ ...current, isOpen: false }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? 'border-line bg-card/95 shadow-sm backdrop-blur-md'
          : 'border-transparent bg-card'
      }`}
    >
      <div className="container-page flex h-18 items-center justify-between gap-4 py-3">
        <Logo />

        {/* Desktop navigation */}
        <nav aria-label="Main navigation" className="hidden lg:block">
          <Nav />
        </nav>

        {/*
          WhatsApp deliberately does not appear here. It stays on the floating
          button, in the footer and on the contact page, so the header keeps one
          primary action instead of competing CTAs.
        */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Button to="/contact" variant="secondary" size="sm">
            Get a quote
          </Button>
        </div>

        {/* Mobile: toggle sits outside the drawer so it is always reachable */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-title transition-colors hover:bg-chip"
          >
            {isMenuOpen ? (
              <FiX aria-hidden="true" className="h-6 w-6" />
            ) : (
              <FiMenu aria-hidden="true" className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-card lg:hidden"
          >
            <nav aria-label="Mobile navigation" className="container-page py-5">
              <Nav orientation="vertical" onNavigate={() => setIsMenuOpen(false)} />

              <div className="mt-5">
                <Button to="/contact" variant="secondary" fullWidth>
                  Get a quote
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
