import { MotionConfig } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import ErrorBoundary from '@/components/ErrorBoundary'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import PageLoader from '@/components/PageLoader'
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
export const App = () => (
  <MotionConfig reducedMotion="user">
    <a href="#main-content" className="skip-link rounded-lg bg-steel-800 px-4 py-2 text-sm font-semibold text-white">
      Skip to main content
    </a>

    <ScrollToTop />
    <Header />

    <main id="main-content">
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </main>

    <Footer />
    <WhatsAppFloat />
  </MotionConfig>
)

export default App
