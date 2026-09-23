/**
 * Smoke tests: every route renders, shows its heading, and puts the catalogue's
 * real data on the page. These are the tests that would catch a broken import,
 * a bad lazy route, or pricing that silently stopped rendering.
 */

import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import App from '@/App'
import { ThemeProvider } from '@/context/ThemeProvider'
import { TEAM } from '@/utils/constants'

const renderAt = (route) =>
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </ThemeProvider>,
  )

/**
 * The site header. Queried by tag rather than by the `banner` landmark role,
 * because the role only resolves once the element is attached in the expected
 * document position and that made these assertions brittle.
 */
const getHeader = () => {
  const header = document.querySelector('header')
  if (!header) throw new Error('No <header> rendered.')
  return header
}

describe('routing', () => {
  it('renders the home page hero', async () => {
    renderAt('/')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /we design, build and maintain/i,
      }),
    ).toBeInTheDocument()
  })

  it('shows website package pricing on the home page', async () => {
    renderAt('/')

    expect(await screen.findByText('UGX 800,000')).toBeInTheDocument()
    expect(screen.getByText('UGX 1,500,000')).toBeInTheDocument()
    expect(screen.getByText('UGX 2,800,000 – 4,000,000')).toBeInTheDocument()
  })

  it('renders the services page and its pricing tabs', async () => {
    renderAt('/services')

    expect(
      await screen.findByRole('heading', { level: 1, name: /clear packages/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Websites' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Mobile Apps' })).toBeInTheDocument()
  })

  it('switches the services tab to the mobile app table', async () => {
    const user = userEvent.setup()
    renderAt('/services')

    await user.click(await screen.findByRole('tab', { name: 'Mobile Apps' }))

    expect(
      await screen.findByRole('heading', { name: 'Mobile App Packages' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Basic Android App')).toBeInTheDocument()
    // Full figures, not the catalogue's "2M – 3.5M" shorthand.
    expect(screen.getByText('2,000,000 – 3,500,000')).toBeInTheDocument()
    expect(screen.getByText('7,000,000 – 15,000,000+')).toBeInTheDocument()
  })

  it('renders every completed project on the projects page', async () => {
    renderAt('/projects')

    expect(
      await screen.findByRole('heading', { level: 1, name: /work we have delivered/i }),
    ).toBeInTheDocument()

    for (const name of [
      'GVM Company',
      'SCAVAL',
      'Nkuruba Community Tours',
      'Small Beginnings Uganda',
    ]) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument()
    }
  })

  it('filters projects by industry', async () => {
    const user = userEvent.setup()
    renderAt('/projects')

    await user.click(await screen.findByRole('button', { name: 'Tourism' }))

    expect(
      screen.getByRole('heading', { name: 'Nkuruba Community Tours' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'SCAVAL' })).not.toBeInTheDocument()
  })

  it('renders the about page mission and vision', async () => {
    renderAt('/about')

    expect(
      await screen.findByRole('heading', { level: 1, name: /ugandan software company/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/empower organizations through affordable/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/one of Uganda's leading software technology companies/i),
    ).toBeInTheDocument()
  })

  it('renders the team and certification sections on the about page', async () => {
    renderAt('/about')

    expect(
      await screen.findByRole('heading', { name: /the people who build your software/i }),
    ).toBeInTheDocument()

    /*
      Derived from TEAM rather than hard-coded, because the card heading is the
      person's name once the client supplies one and the role until then. This
      asserts the card renders whichever of the two is current, and keeps
      passing on the day the names land.
    */
    for (const member of TEAM) {
      expect(
        screen.getByRole('heading', { name: member.name ?? member.role }),
      ).toBeInTheDocument()
    }

    expect(
      screen.getByRole('heading', { name: /accredited to international standards/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /ISO 9001:2015 certification badge/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /R2v3 Certified certification badge/i }),
    ).toBeInTheDocument()
  })

  it('renders the contact page form', async () => {
    renderAt('/contact')

    expect(
      await screen.findByRole('heading', { level: 1, name: /build something great/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it.each([
    ['/terms', /terms & conditions/i],
    ['/privacy', /privacy policy/i],
    ['/cookies', /cookie policy/i],
  ])('renders %s', async (route, heading) => {
    renderAt(route)

    expect(
      await screen.findByRole('heading', { level: 1, name: heading }),
    ).toBeInTheDocument()
    expect(screen.getByText(/last updated/i)).toBeInTheDocument()
  })

  /*
   * The cookie policy states that no analytics or advertising tag is loaded.
   * That is true today and is the kind of claim that quietly becomes a lie the
   * moment someone wires up VITE_GA_MEASUREMENT_ID, so it is asserted rather
   * than trusted.
   */
  it('keeps the cookie policy honest about there being no analytics', async () => {
    renderAt('/cookies')

    expect(await screen.findByText(/no analytics/i)).toBeInTheDocument()

    const scripts = [...document.querySelectorAll('script[src]')].map((s) => s.src)
    expect(scripts.some((src) => /googletagmanager|google-analytics|gtag/.test(src))).toBe(
      false,
    )
  })

  it('renders a 404 for an unknown route', async () => {
    renderAt('/does-not-exist')

    expect(
      await screen.findByRole('heading', { level: 1, name: /page not found/i }),
    ).toBeInTheDocument()
  })
})

describe('global chrome', () => {
  it('keeps WhatsApp reachable outside the header', async () => {
    renderAt('/')

    await waitFor(() => {
      const whatsappLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href')?.includes('wa.me/256767267209'))

      expect(whatsappLinks.length).toBeGreaterThan(0)
    })
  })

  it('does not put a WhatsApp button in the header', async () => {
    renderAt('/')

    const header = getHeader()
    const headerWhatsApp = within(header)
      .queryAllByRole('link')
      .filter((link) => link.getAttribute('href')?.includes('wa.me'))

    expect(headerWhatsApp).toHaveLength(0)
  })

  it('links all three legal documents from the footer', async () => {
    renderAt('/')

    const footer = document.querySelector('footer')
    for (const name of [/terms & conditions/i, /privacy policy/i, /cookie policy/i]) {
      expect(within(footer).getByRole('link', { name })).toBeInTheDocument()
    }
  })

  it('puts Kampala in the footer', async () => {
    renderAt('/')

    const footer = document.querySelector('footer')
    expect(footer).not.toBeNull()
    expect(within(footer).getByText('Kampala, Uganda')).toBeInTheDocument()
  })

  it('renders a skip link for keyboard users', async () => {
    renderAt('/')

    expect(
      await screen.findByRole('link', { name: /skip to main content/i }),
    ).toBeInTheDocument()
  })
})

/*
 * Dark is the brand default now, not a preference inherited from the OS —
 * see the note on `DEFAULT_THEME` in context/ThemeProvider.jsx and the inline
 * script in index.html, which have to agree with each other and with this.
 * So a fresh visitor starts dark and the toggle offers *light*.
 */
describe('theme toggle', () => {
  it('starts dark and offers a light theme switch', async () => {
    renderAt('/')

    expect(document.documentElement.dataset.theme).toBe('dark')

    const header = getHeader()
    expect(
      within(header).getAllByRole('button', { name: /switch to light theme/i })
        .length,
    ).toBeGreaterThan(0)
  })

  it('switches the document to light and back', async () => {
    const user = userEvent.setup()
    renderAt('/')

    const header = getHeader()
    const [toggle] = within(header).getAllByRole('button', {
      name: /switch to light theme/i,
    })

    expect(toggle).toHaveAttribute('aria-pressed', 'true')

    await user.click(toggle)

    expect(document.documentElement.dataset.theme).toBe('light')

    const [backToDark] = within(header).getAllByRole('button', {
      name: /switch to dark theme/i,
    })
    expect(backToDark).toHaveAttribute('aria-pressed', 'false')

    await user.click(backToDark)
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('remembers the choice in localStorage', async () => {
    const user = userEvent.setup()
    renderAt('/')

    const header = getHeader()
    const [toggle] = within(header).getAllByRole('button', {
      name: /switch to light theme/i,
    })

    await user.click(toggle)

    expect(window.localStorage.getItem('geniewep-theme')).toBe('light')
  })
})
