/**
 * Server-side delivery: validation, the Resend request shape, and the failure
 * modes the browser can only see as "it did not send".
 *
 * This is the half of the contact form that no browser test can reach. It is
 * also where the secret is, so two of these assert things about the key rather
 * than about email.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  EnquiryConfigError,
  EnquiryDeliveryError,
  EnquiryValidationError,
  deliverEnquiry,
  parseEnquiry,
} from './_enquiry.js'

const VALUES = {
  name: 'Jane Nakato',
  email: 'jane@example.com',
  phone: '+256700000000',
  serviceType: 'Business / Corporate Website',
  message: 'We need a five page website for our SACCO.',
}

const ENV = { RESEND_API_KEY: 're_test_key' }

const resendOk = () => ({
  ok: true,
  status: 200,
  json: () => Promise.resolve({ id: 'f1b3…' }),
})

describe('parseEnquiry', () => {
  it('accepts and trims a complete enquiry', () => {
    expect(parseEnquiry({ ...VALUES, name: '  Jane Nakato  ' })).toEqual(VALUES)
  })

  /*
   * The browser validated all of this with Zod already, which counts for
   * nothing: this endpoint is a public URL and anything can POST to it.
   */
  it.each(['name', 'email', 'phone', 'serviceType', 'message'])(
    'rejects a missing %s even though the form would have caught it',
    (field) => {
      expect(() => parseEnquiry({ ...VALUES, [field]: '' })).toThrow(
        EnquiryValidationError,
      )
    },
  )

  it('rejects a malformed email address', () => {
    expect(() => parseEnquiry({ ...VALUES, email: 'not-an-email' })).toThrow(
      EnquiryValidationError,
    )
  })

  it('rejects an oversized message rather than mailing it on', () => {
    expect(() => parseEnquiry({ ...VALUES, message: 'x'.repeat(2001) })).toThrow(
      EnquiryValidationError,
    )
  })

  it('rejects a non-object body', () => {
    expect(() => parseEnquiry(null)).toThrow(EnquiryValidationError)
    expect(() => parseEnquiry('a string')).toThrow(EnquiryValidationError)
  })

  /*
   * Null, not a throw: the caller answers a tripped honeypot with a plain
   * success and sends nothing. A bot told it was filtered is a bot that comes
   * back with the field left blank.
   */
  it('signals a tripped honeypot without raising', () => {
    expect(parseEnquiry({ ...VALUES, botcheck: 'spam-bot' })).toBeNull()
  })

  it('ignores an empty honeypot, which is what a person submits', () => {
    expect(parseEnquiry({ ...VALUES, botcheck: '' })).toEqual(VALUES)
  })
})

describe('deliverEnquiry', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('refuses to send when no API key is configured', async () => {
    await expect(deliverEnquiry(VALUES, {})).rejects.toBeInstanceOf(EnquiryConfigError)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('posts to Resend with the key in the Authorization header', async () => {
    fetch.mockResolvedValue(resendOk())

    await deliverEnquiry(VALUES, ENV)

    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe('https://api.resend.com/emails')
    expect(init.method).toBe('POST')
    expect(init.headers.Authorization).toBe('Bearer re_test_key')
  })

  it('addresses the company inbox and replies to the enquirer', async () => {
    fetch.mockResolvedValue(resendOk())

    await deliverEnquiry(VALUES, ENV)

    const body = JSON.parse(fetch.mock.calls[0][1].body)
    expect(body.to).toEqual(['geniewep@gmail.com'])
    // Hitting reply in Gmail must answer the client, not the sending domain.
    expect(body.reply_to).toBe('jane@example.com')
    expect(body.subject).toBe(
      'New Business / Corporate Website enquiry from Jane Nakato',
    )
  })

  it('lets the destination be overridden without touching the code', async () => {
    fetch.mockResolvedValue(resendOk())

    await deliverEnquiry(VALUES, { ...ENV, ENQUIRY_TO: 'someone-else@example.com' })

    expect(JSON.parse(fetch.mock.calls[0][1].body).to).toEqual([
      'someone-else@example.com',
    ])
  })

  it('carries every field in both the html and the plain-text part', async () => {
    fetch.mockResolvedValue(resendOk())

    await deliverEnquiry(VALUES, ENV)

    const { html, text } = JSON.parse(fetch.mock.calls[0][1].body)
    for (const value of Object.values(VALUES)) {
      expect(html).toContain(value)
      expect(text).toContain(value)
    }
  })

  /*
   * The message is attacker-controlled text landing in an HTML email. Escaping
   * it is the difference between a quoted brief and markup running in whatever
   * client opens the mail.
   */
  it('escapes html in the message instead of passing it through', async () => {
    fetch.mockResolvedValue(resendOk())

    await deliverEnquiry(
      { ...VALUES, message: '<script>alert("xss")</script> & "quoted"' },
      ENV,
    )

    const { html } = JSON.parse(fetch.mock.calls[0][1].body)
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('&amp;')
  })

  it('reports a rejection from Resend rather than returning quietly', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 422,
      json: () => Promise.resolve({ message: 'The from address is not verified.' }),
    })

    await expect(deliverEnquiry(VALUES, ENV)).rejects.toBeInstanceOf(
      EnquiryDeliveryError,
    )
  })

  it('reports a network failure', async () => {
    fetch.mockRejectedValue(new TypeError('fetch failed'))

    await expect(deliverEnquiry(VALUES, ENV)).rejects.toBeInstanceOf(
      EnquiryDeliveryError,
    )
  })

  it('sends the enquirer an acknowledgement after the enquiry', async () => {
    fetch.mockResolvedValue(resendOk())

    await deliverEnquiry(VALUES, ENV)

    expect(fetch).toHaveBeenCalledTimes(2)
    const body = JSON.parse(fetch.mock.calls[1][1].body)
    expect(body.to).toEqual(['jane@example.com'])
    expect(body.reply_to).toBe('geniewep@gmail.com')
    expect(body.text).toContain('Thanks, Jane')
    expect(body.text).toContain('reply shortly')
  })

  it('still succeeds when only the acknowledgement fails', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    fetch.mockResolvedValueOnce(resendOk()).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: () => Promise.resolve({ message: 'You can only send testing emails to your own address.' }),
    })

    await expect(deliverEnquiry(VALUES, ENV)).resolves.toBeTruthy()
    expect(console.warn).toHaveBeenCalled()
  })
})
