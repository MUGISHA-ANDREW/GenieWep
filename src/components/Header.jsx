import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { FiMail, FiMenu, FiX } from 'react-icons/fi'
import { useLocation } from 'react-router-dom'

import Button from '@/components/Button/Button'
import Logo from '@/components/Logo'
import Nav from '@/components/Navigation/Nav'
import ThemeToggle from '@/components/ThemeToggle'
import useScrollLock from '@/hooks/useScrollLock'
import useWindowScroll from '@/hooks/useWindowScroll'
import { CONTACT, EMAIL_LINK, WHATSAPP_LINK } from '@/utils/constants'

/**
 * Sticky header: logo left, floating nav capsule centred, actions right.
 *
 * The bar itself is transparent over the page at rest and gains a blurred
 * translucent background plus a hairline once the page has scrolled under it.
 * Height stays fixed — a header that shrinks as you scroll costs a repaint on
 * every frame and buys nothing.
 */
export const Header = () => {
  const { isScrolled } = useWindowScroll(12)
  const { pathname } = useLocation()

  /*
   * The drawer records which route it was opened on. If the route has since
   * changed, it reads as closed. Deriving this during render closes the menu
   * on every navigation — link clicks, logo clicks and browser back alike —
   * without a reset effect that would cost a second render pass each time.
   */
  const [menu, setMenu] = useState({ isOpen: false, path: pathname })
  const isMenuOpen = menu.isOpen && menu.path === pathname

  const setIsMenuOpen = (open) => setMenu({ isOpen: open, path: pathname })

  useScrollLock(isMenuOpen)

  useEffect(() => {
    if (!isMenuOpen) return undefined

    const handleKeyDown = (event) => {
      // The raw setter rather than the helper: `setMenu` is stable across
      // renders, so the listener does not need re-attaching on every one.
      if (event.key === 'Escape') {
        setMenu((current) => ({ ...current, isOpen: false }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        isScrolled || isMenuOpen
          ? 'border-b border-line bg-canvas/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-page flex h-18 items-center justify-between gap-4">
        <Logo />

        {/* The capsule is centred in the bar rather than sitting beside the
            logo, which is what makes it read as floating over the page. */}
        <nav
          aria-label="Main navigation"
          className="absolute left-1/2 hidden -translate-x-1/2 xl:block"
        >
          <Nav />
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Button to="/contact" size="sm">
            Get a free consultation
          </Button>
        </div>

        {/* Mobile: the toggle sits outside the drawer so it stays reachable
            without opening the menu first. */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-card/60 text-title transition-colors hover:border-azure-500/40 hover:text-link"
          >
            {isMenuOpen ? (
              <FiX aria-hidden="true" className="h-5 w-5" />
            ) : (
              <FiMenu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Between lg and xl the capsule does not fit but the drawer is
            unnecessary, so the nav falls back to the drawer trigger only at
            lg and below — this covers the gap. */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:block xl:hidden"
        >
          <Nav />
        </nav>
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
            /* Fills the rest of the screen rather than stopping at its content,
               so the page does not show through underneath a half-height sheet
               — the menu reads as a screen of its own, the way a native app's
               does. It scrolls internally on a short landscape phone. */
            className="overflow-hidden border-t border-line bg-canvas lg:hidden"
          >
            <div className="container-page flex h-[calc(100dvh-4.5rem)] flex-col overflow-y-auto overscroll-contain py-6">
              <nav aria-label="Mobile navigation">
                <Nav
                  orientation="vertical"
                  onNavigate={() => setIsMenuOpen(false)}
                />
              </nav>

              <div className="mt-6 mb-8">
                <Button to="/contact" size="lg" fullWidth>
                  Get a free consultation
                </Button>
              </div>

              {/* The two channels people actually use, spelled out. This is
                  the bottom of the menu, which is where someone who did not
                  find the page they wanted goes looking. */}
              <ul className="mt-auto space-y-4 border-t border-line pt-6 pb-[env(safe-area-inset-bottom)]">
                <li>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm font-medium text-body transition-colors hover:text-link"
                  >
                    <FaWhatsapp
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-whatsapp"
                    />
                    {CONTACT.phoneDisplay}
                    <span className="sr-only">
                      on WhatsApp (opens in a new tab)
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={EMAIL_LINK}
                    className="flex items-center gap-3 text-sm font-medium break-all text-body transition-colors hover:text-link"
                  >
                    <FiMail aria-hidden="true" className="h-4 w-4 shrink-0" />
                    {CONTACT.email}
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
