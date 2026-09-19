import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import ContactForm from './ContactForm'

/*
 * Email delivery is mocked at the module boundary: these tests are about what
 * the form promises the visitor, not about Web3Forms' wire format. The real
 * request shape is covered in email.test.js.
 */
vi.mock('@/utils/email', () => ({
  isEmailDeliveryConfigured: vi.fn(() => false),
  sendEnquiryEmail: vi.fn(),
}))

const { isEmailDeliveryConfigured, sendEnquiryEmail } = await import('@/utils/email')

const renderForm = () =>
  render(
    <MemoryRouter>
      <ContactForm />
    </MemoryRouter>,
  )

const fillValidForm = async (user) => {
  await user.type(screen.getByLabelText(/full name/i), 'Jane Nakato')
  await user.type(screen.getByLabelText(/email address/i), 'jane@example.com')
  await user.type(screen.getByLabelText(/phone number/i), '+256 700 000 000')
  await user.selectOptions(
    screen.getByLabelText(/service needed/i),
    'Business / Corporate Website',
  )
  await user.type(
    screen.getByLabelText(/project details/i),
    'We need a five page website for our SACCO.',
  )
}

/*
 * jsdom has no window.open, and submitting a valid form always reaches for it,
 * so every suite in this file needs the spy — not just the submission one.
 */
let openSpy

beforeEach(() => {
  openSpy = vi.spyOn(window, 'open').mockReturnValue({ opener: {} })
  // Default: no delivery key, the state a fresh checkout is in.
  isEmailDeliveryConfigured.mockReturnValue(false)
  sendEnquiryEmail.mockReset()
})

afterEach(() => {
  openSpy.mockRestore()
})

describe('ContactForm validation', () => {
  it('blocks submission and reports every missing field', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText(/please enter your full name/i)).toBeInTheDocument()
    expect(screen.getByText(/email address is required/i)).toBeInTheDocument()
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument()
    expect(screen.getByText(/please choose the service you need/i)).toBeInTheDocument()
  })

  it('rejects a malformed email address', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText(/email address/i), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(
      await screen.findByText(/please enter a valid email address/i),
    ).toBeInTheDocument()
  })

  it('rejects a phone number that is too short', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText(/phone number/i), '0700')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText(/enter a valid phone number/i)).toBeInTheDocument()
  })

  it('accepts a Ugandan number written with spaces', async () => {
    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(screen.queryByText(/enter a valid phone number/i)).not.toBeInTheDocument()
  })

  it('rejects a message that is too short', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText(/project details/i), 'Hi')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText(/at least 10 characters/i)).toBeInTheDocument()
  })
})

describe('ContactForm submission', () => {
  /*
   * There is no backend. Submitting hands the enquiry to WhatsApp, so these
   * assert on what `window.open` was actually called with — that URL is the
   * whole delivery mechanism.
   */
  it('opens WhatsApp with every field in the message', async () => {
    const fakeTab = { opener: {} }
    openSpy.mockReturnValue(fakeTab)

    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(openSpy).toHaveBeenCalledTimes(1)
    const [url, target] = openSpy.mock.calls[0]
    expect(target).toBe('_blank')

    expect(url).toContain('wa.me/256767267209')
    const text = decodeURIComponent(new URL(url).searchParams.get('text'))
    expect(text).toContain('Name: Jane Nakato')
    expect(text).toContain('Email: jane@example.com')
    expect(text).toContain('Phone: +256700000000')
    expect(text).toContain('Service: Business / Corporate Website')
    expect(text).toContain('We need a five page website for our SACCO.')

    // The new tab must not keep a handle on this window.
    expect(fakeTab.opener).toBeNull()
  })

  it('never claims the message was sent, only handed to WhatsApp', async () => {
    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText(/finish in whatsapp/i)).toBeInTheDocument()
    expect(screen.queryByText(/message sent/i)).not.toBeInTheDocument()
  })

  it('offers a manual link when the browser blocks the popup', async () => {
    openSpy.mockReturnValue(null)

    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText(/blocked the whatsapp window/i)).toBeInTheDocument()

    const link = screen.getByRole('link', { name: /open whatsapp/i })
    expect(link.getAttribute('href')).toContain('wa.me/256767267209')
    expect(link.getAttribute('href')).toContain('Jane%20Nakato')

    expect(screen.getByRole('link', { name: /email us instead/i })).toHaveAttribute(
      'href',
      'mailto:geniewep@gmail.com',
    )
  })

  it('keeps the typed details when the popup was blocked', async () => {
    openSpy.mockReturnValue(null)

    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await screen.findByText(/blocked the whatsapp window/i)
    await user.click(screen.getByRole('button', { name: /back to the form/i }))

    expect(screen.getByLabelText(/full name/i)).toHaveValue('Jane Nakato')
  })
})

describe('ContactForm email delivery', () => {
  it('posts the enquiry and reports it sent', async () => {
    isEmailDeliveryConfigured.mockReturnValue(true)
    sendEnquiryEmail.mockResolvedValue({ success: true })

    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText(/^message sent$/i)).toBeInTheDocument()
    expect(screen.getByText(/in our inbox/i)).toBeInTheDocument()

    expect(sendEnquiryEmail).toHaveBeenCalledTimes(1)
    expect(sendEnquiryEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Jane Nakato',
        email: 'jane@example.com',
        phone: '+256700000000',
        serviceType: 'Business / Corporate Website',
        message: 'We need a five page website for our SACCO.',
      }),
    )
  })

  it('opens WhatsApp before awaiting the email, so the popup survives', async () => {
    isEmailDeliveryConfigured.mockReturnValue(true)

    // Resolve only when released, so the assertion lands while the POST is
    // still in flight. If window.open were awaited behind it, it would not
    // have been called yet — and in a real browser it would be blocked.
    let release
    sendEnquiryEmail.mockReturnValue(new Promise((resolve) => { release = resolve }))

    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText(/sending your message/i)).toBeInTheDocument()
    expect(openSpy).toHaveBeenCalledTimes(1)

    release({ success: true })
    expect(await screen.findByText(/^message sent$/i)).toBeInTheDocument()
  })

  it('falls back to WhatsApp and never claims sent when delivery fails', async () => {
    isEmailDeliveryConfigured.mockReturnValue(true)
    sendEnquiryEmail.mockRejectedValue(new Error('network down'))

    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText(/could not deliver your enquiry by email/i)).toBeInTheDocument()
    expect(screen.queryByText(/^message sent$/i)).not.toBeInTheDocument()

    // The WhatsApp link still carries everything they typed.
    const link = screen.getByRole('link', { name: /reopen whatsapp/i })
    expect(link.getAttribute('href')).toContain('Jane%20Nakato')
  })

  it('keeps the typed details when delivery fails', async () => {
    isEmailDeliveryConfigured.mockReturnValue(true)
    sendEnquiryEmail.mockRejectedValue(new Error('network down'))

    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await screen.findByText(/could not deliver your enquiry by email/i)
    await user.click(screen.getByRole('button', { name: /back to the form/i }))

    expect(screen.getByLabelText(/full name/i)).toHaveValue('Jane Nakato')
  })

  it('does not attempt delivery when no key is configured', async () => {
    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await screen.findByText(/finish in whatsapp/i)
    expect(sendEnquiryEmail).not.toHaveBeenCalled()
  })
})
