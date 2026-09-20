import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

/*
 * Every route except Home is behind React.lazy, so the first `findBy*` in a
 * route test is waiting on a dynamic import that Vite still has to transform.
 * Testing Library allows 1000ms for that by default, which the Contact chunk
 * (react-hook-form + zod) misses on a loaded machine often enough to fail the
 * suite for reasons that have nothing to do with the code under test. The wait
 * is a ceiling, not a delay: a passing assertion still resolves immediately.
 */
configure({ asyncUtilTimeout: 5000 })

afterEach(() => {
  cleanup()

  // Theme state lives on <html> and in localStorage, both of which outlive a
  // render. Without this reset, whichever test ran first decides the theme for
  // every test after it.
  window.localStorage.clear()
  delete document.documentElement.dataset.theme
})

/*
 * jsdom implements neither of these, and both are called during render:
 * framer-motion's `whileInView` uses IntersectionObserver, and several
 * components query `prefers-reduced-motion`.
 */
globalThis.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// jsdom does not implement scrollTo; ScrollToTop calls it on every navigation.
window.scrollTo = vi.fn()
