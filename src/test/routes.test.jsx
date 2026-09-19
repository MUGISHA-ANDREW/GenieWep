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
        name: /building digital solutions/i,
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
    expect(screen.getByText('2M – 3.5M')).toBeInTheDocument()
    expect(screen.getByText('7M – 15M+')).toBeInTheDocument()
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

  it('renders the contact page form', async () => {
    renderAt('/contact')

    expect(
      await screen.findByRole('heading', { level: 1, name: /build something great/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
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

  it('renders a skip link for keyboard users', async () => {
    renderAt('/')

    expect(
      await screen.findByRole('link', { name: /skip to main content/i }),
    ).toBeInTheDocument()
  })
})

describe('theme toggle', () => {
  it('offers a dark theme switch in the header', async () => {
    renderAt('/')

    const header = getHeader()
    expect(
      within(header).getAllByRole('button', { name: /switch to dark theme/i }).length,
    ).toBeGreaterThan(0)
  })

  it('switches the document to dark and back', async () => {
    const user = userEvent.setup()
    renderAt('/')

    const header = getHeader()
    const [toggle] = within(header).getAllByRole('button', {
      name: /switch to dark theme/i,
    })

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await user.click(toggle)

    expect(document.documentElement.dataset.theme).toBe('dark')

    const [backToLight] = within(header).getAllByRole('button', {
      name: /switch to light theme/i,
    })
    expect(backToLight).toHaveAttribute('aria-pressed', 'true')

    await user.click(backToLight)
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('remembers the choice in localStorage', async () => {
    const user = userEvent.setup()
    renderAt('/')

    const header = getHeader()
    const [toggle] = within(header).getAllByRole('button', {
      name: /switch to dark theme/i,
    })

    await user.click(toggle)

    expect(window.localStorage.getItem('geniewep-theme')).toBe('dark')
  })
})
