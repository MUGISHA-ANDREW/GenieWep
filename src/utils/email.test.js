/**
 * Guards the Web3Forms request shape.
 *
 * The contact form mocks this module, so nothing else checks that the body we
 * POST is the one Web3Forms expects. A wrong field name here fails silently in
 * production: the request succeeds and the enquiry arrives missing its phone
 * number, or with no reply-to address.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const VALUES = {
  name: 'Jane Nakato',
  email: 'jane@example.com',
  phone: '+256700000000',
  serviceType: 'Business / Corporate Website',
  message: 'We need a five page website for our SACCO.',
}

/** Re-import the module with a given key, since it reads env at module scope. */
const loadWith = async (key) => {
  vi.resetModules()
  vi.stubEnv('VITE_WEB3FORMS_KEY', key)
  return import('./email')
}

const jsonResponse = (body, ok = true, status = 200) => ({
  ok,
  status,
  json: () => Promise.resolve(body),
})

describe('sendEnquiryEmail', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('reports itself unconfigured when no key is set', async () => {
    const { isEmailDeliveryConfigured, sendEnquiryEmail, EmailNotConfiguredError } =
      await loadWith('')

    expect(isEmailDeliveryConfigured()).toBe(false)
    await expect(sendEnquiryEmail(VALUES)).rejects.toBeInstanceOf(
      EmailNotConfiguredError,
    )
    expect(fetch).not.toHaveBeenCalled()
  })

  it('posts every field Web3Forms needs', async () => {
    const { isEmailDeliveryConfigured, sendEnquiryEmail } = await loadWith('test-key')
    fetch.mockResolvedValue(jsonResponse({ success: true, message: 'ok' }))

    expect(isEmailDeliveryConfigured()).toBe(true)
    await sendEnquiryEmail(VALUES)

    const [url, options] = fetch.mock.calls[0]
    expect(url).toBe('https://api.web3forms.com/submit')
    expect(options.method).toBe('POST')
    expect(options.headers['Content-Type']).toBe('application/json')

    const body = JSON.parse(options.body)
    expect(body.access_key).toBe('test-key')
    expect(body.name).toBe(VALUES.name)
    expect(body.email).toBe(VALUES.email)
    expect(body.phone).toBe(VALUES.phone)
    expect(body.service).toBe(VALUES.serviceType)
    expect(body.message).toBe(VALUES.message)

    // Reply-to must be the enquirer, or hitting reply answers Web3Forms.
    expect(body.replyto).toBe(VALUES.email)
    expect(body.subject).toContain('Jane Nakato')
    expect(body.subject).toContain('Business / Corporate Website')
  })

  it('treats success:false as a failure even on HTTP 200', async () => {
    const { sendEnquiryEmail, EmailDeliveryError } = await loadWith('test-key')
    fetch.mockResolvedValue(
      jsonResponse({ success: false, message: 'Invalid access key' }),
    )

    await expect(sendEnquiryEmail(VALUES)).rejects.toBeInstanceOf(EmailDeliveryError)
    await expect(sendEnquiryEmail(VALUES)).rejects.toThrow(/invalid access key/i)
  })

  it('fails on a non-ok response', async () => {
    const { sendEnquiryEmail, EmailDeliveryError } = await loadWith('test-key')
    fetch.mockResolvedValue(jsonResponse(null, false, 500))

    await expect(sendEnquiryEmail(VALUES)).rejects.toBeInstanceOf(EmailDeliveryError)
  })

  it('surfaces a timeout as a delivery error', async () => {
    const { sendEnquiryEmail, EmailDeliveryError } = await loadWith('test-key')
    fetch.mockRejectedValue(Object.assign(new Error('aborted'), { name: 'AbortError' }))

    await expect(sendEnquiryEmail(VALUES)).rejects.toBeInstanceOf(EmailDeliveryError)
    await expect(sendEnquiryEmail(VALUES)).rejects.toThrow(/timed out/i)
  })
})
