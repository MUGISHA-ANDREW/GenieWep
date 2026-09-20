import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import ContactForm from './ContactForm'

/*
 * Delivery is mocked at the module boundary: these tests are about what the
 * form promises the visitor. The request it makes is covered in email.test.js,
 * and what the server does with it in api/_enquiry.test.js.
 */
vi.mock('@/utils/email', () => ({
  sendEnquiryEmail: vi.fn(),
}))

const { sendEnquiryEmail } = await import('@/utils/email')

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
 * jsdom has no window.open. The form is not supposed to call it at all any
 * more, so the spy is here to prove that rather than to make it work.
 */
let openSpy

beforeEach(() => {
  openSpy = vi.spyOn(window, 'open').mockReturnValue({ opener: {} })
  sendEnquiryEmail.mockReset()
  sendEnquiryEmail.mockResolvedValue({ success: true })
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

describe('ContactForm delivery', () => {
  it('posts the enquiry and reports it delivered', async () => {
    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText(/^message delivered$/i)).toBeInTheDocument()
    expect(screen.getByText(/get back to you shortly/i)).toBeInTheDocument()

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

  it('shows progress while the request is in flight', async () => {
    // Resolves only when released, so the assertion lands mid-flight.
    let release
    sendEnquiryEmail.mockReturnValue(new Promise((resolve) => { release = resolve }))

    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText(/sending your message/i)).toBeInTheDocument()

    release({ success: true })
    expect(await screen.findByText(/^message delivered$/i)).toBeInTheDocument()
  })

  /*
   * The form used to open WhatsApp on every submission, from the days when it
   * was the only channel. Now that Send actually delivers, that is a second
   * tab nobody asked for, appearing at the same moment the panel says the
   * message arrived — which reads as though it did not.
   */
  it('does not throw a WhatsApp tab at a visitor who chose email', async () => {
    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await screen.findByText(/^message delivered$/i)
    expect(openSpy).not.toHaveBeenCalled()

    // Still reachable, as an offer rather than a fallback.
    const link = screen.getByRole('link', { name: /chat on whatsapp too/i })
    expect(link.getAttribute('href')).toContain('wa.me/256767267209')

    // Nothing suggests the email needs following up by mail.
    expect(screen.queryByRole('link', { name: /email us instead/i })).not.toBeInTheDocument()
  })

  it('clears the form once the message is actually delivered', async () => {
    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await screen.findByText(/^message delivered$/i)
    await user.click(screen.getByRole('button', { name: /send another message/i }))

    expect(screen.getByLabelText(/full name/i)).toHaveValue('')
  })
})

describe('ContactForm when delivery fails', () => {
  /*
   * One failure path covers them all, deliberately. The browser cannot tell a
   * network outage from a deployment missing RESEND_API_KEY from Resend
   * rejecting an unverified sender — in every case nobody received the
   * message, so the form must say exactly that and offer a way through.
   */
  beforeEach(() => {
    sendEnquiryEmail.mockRejectedValue(new Error('delivery failed'))
  })

  it('never claims delivery', async () => {
    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText(/could not deliver your message/i)).toBeInTheDocument()
    expect(screen.getByText(/nobody has seen it yet/i)).toBeInTheDocument()
    expect(screen.queryByText(/^message delivered$/i)).not.toBeInTheDocument()
  })

  it('offers WhatsApp with every field already in the message', async () => {
    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await screen.findByText(/could not deliver your message/i)

    const link = screen.getByRole('link', { name: /send on whatsapp/i })
    const url = new URL(link.getAttribute('href'))
    expect(url.host).toBe('wa.me')

    const text = decodeURIComponent(url.searchParams.get('text'))
    expect(text).toContain('Name: Jane Nakato')
    expect(text).toContain('Email: jane@example.com')
    expect(text).toContain('Phone: +256700000000')
    expect(text).toContain('Service: Business / Corporate Website')
    expect(text).toContain('We need a five page website for our SACCO.')

    expect(screen.getByRole('link', { name: /email us instead/i })).toHaveAttribute(
      'href',
      'mailto:geniewep@gmail.com',
    )
  })

  it('keeps the typed details so nothing has to be retyped', async () => {
    const user = userEvent.setup()
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await screen.findByText(/could not deliver your message/i)
    await user.click(screen.getByRole('button', { name: /back to the form/i }))

    expect(screen.getByLabelText(/full name/i)).toHaveValue('Jane Nakato')
    expect(screen.getByLabelText(/project details/i)).toHaveValue(
      'We need a five page website for our SACCO.',
    )
  })
})
