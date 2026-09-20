import { MotionConfig, motion, useReducedMotion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import ErrorBoundary from '@/components/ErrorBoundary'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import PageLoader from '@/components/PageLoader'
import ScrollProgress from '@/components/ScrollProgress'
import ScrollToTop from '@/components/ScrollToTop'
import WhatsAppFloat from '@/components/WhatsAppFloat'

/*
 * Routes are code-split (PROJECT_BRIEF.md §15). Home is eager-loaded because it
 * is the landing route for most visitors and lazy-loading it would only add a
 * loading flash to the first paint.
 */
import Home from '@/pages/Home'

const About = lazy(() => import('@/pages/About'))
const Services = lazy(() => import('@/pages/Services'))
const Projects = lazy(() => import('@/pages/Projects'))
const Contact = lazy(() => import('@/pages/Contact'))
const NotFound = lazy(() => import('@/pages/NotFound'))

/*
 * `reducedMotion="user"` makes every Framer Motion component honour the
 * visitor's prefers-reduced-motion setting: transforms and fades are skipped
 * and elements jump straight to their final state. The CSS media query in
 * globals.css cannot do this on its own, because Framer Motion animates from
 * JavaScript rather than with CSS transitions.
 */
/**
 * Fades and lifts each route as it mounts.
 *
 * Keyed on the pathname, which remounts the wrapper on every navigation and
 * replays the entrance. Deliberately not wrapped in `AnimatePresence`: an exit
 * animation would hold the outgoing page in the tree while the incoming one is
 * already mounted, so for a few hundred milliseconds the document would carry
 * two `<h1>`s and two copies of every landmark. A short enter-only transition
 * buys the same sense of movement with none of that.
 *
 * 0.35s and 12px: long enough to register after `ScrollToTop` has jumped the
 * viewport, short enough that it never stands between a visitor and the
 * content they clicked for.
 */
const RouteTransition = ({ children }) => {
  const { pathname } = useLocation()
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) return children

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export const App = () => (
  <MotionConfig reducedMotion="user">
    <a href="#main-content" className="skip-link rounded-lg bg-steel-800 px-4 py-2 text-sm font-semibold text-white">
      Skip to main content
    </a>

    <ScrollProgress />
    <ScrollToTop />
    <Header />

    <main id="main-content">
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <RouteTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RouteTransition>
        </Suspense>
      </ErrorBoundary>
    </main>

    <Footer />
    <WhatsAppFloat />
  </MotionConfig>
)

export default App
