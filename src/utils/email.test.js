/**
 * Guards the request the browser makes to our own delivery endpoint.
 *
 * The contact form mocks this module, so nothing else checks that the POST
 * carries every field. A wrong field name here fails silently in production:
 * the request succeeds and the enquiry arrives missing its phone number.
 *
 * What the server then does with it — the Resend call, the honeypot, the
 * rejection paths — is covered in `api/enquiry.test.js`.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { EmailDeliveryError, sendEnquiryEmail } from './email'

const VALUES = {
  name: 'Jane Nakato',
  email: 'jane@example.com',
  phone: '+256700000000',
  serviceType: 'Business / Corporate Website',
  message: 'We need a five page website for our SACCO.',
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
    vi.unstubAllGlobals()
  })

  it('posts every field to the site own endpoint', async () => {
    fetch.mockResolvedValue(jsonResponse({ success: true }))

    await sendEnquiryEmail(VALUES)

    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, init] = fetch.mock.calls[0]

    /*
     * Same-origin and relative. An absolute URL to Resend would mean the API
     * key had been moved into the browser, which is the one thing this whole
     * arrangement exists to prevent.
     */
    expect(url).toBe('/api/send-enquiry')
    expect(url).not.toMatch(/resend\.com/)
    expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('application/json')

    expect(JSON.parse(init.body)).toEqual({
      name: 'Jane Nakato',
      email: 'jane@example.com',
      phone: '+256700000000',
      serviceType: 'Business / Corporate Website',
      message: 'We need a five page website for our SACCO.',
      company: '',
    })
  })

  it('forwards the honeypot so the server can check it too', async () => {
    fetch.mockResolvedValue(jsonResponse({ success: true }))

    await sendEnquiryEmail({ ...VALUES, company: 'spam-bot' })

    expect(JSON.parse(fetch.mock.calls[0][1].body).company).toBe('spam-bot')
  })

  it('never leaks an API key into the request', async () => {
    fetch.mockResolvedValue(jsonResponse({ success: true }))

    await sendEnquiryEmail(VALUES)

    const [, init] = fetch.mock.calls[0]
    expect(init.headers.Authorization).toBeUndefined()
    expect(init.body).not.toMatch(/re_[A-Za-z0-9]/)
  })

  it('throws when the server reports a failure', async () => {
    fetch.mockResolvedValue(
      jsonResponse({ success: false, message: 'Email delivery is not configured.' }, false, 503),
    )

    await expect(sendEnquiryEmail(VALUES)).rejects.toBeInstanceOf(EmailDeliveryError)
  })

  /*
   * What a dev server without the API middleware actually returns for an
   * unknown path: the SPA shell, with a 200. The status alone would read as
   * success, so the body has to be the authority.
   */
  it('treats a 200 that is not JSON as a failure, not a delivery', async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.reject(new SyntaxError('Unexpected token <')),
    })

    await expect(sendEnquiryEmail(VALUES)).rejects.toBeInstanceOf(EmailDeliveryError)
  })

  it('throws when the network is down', async () => {
    fetch.mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(sendEnquiryEmail(VALUES)).rejects.toBeInstanceOf(EmailDeliveryError)
  })
})
