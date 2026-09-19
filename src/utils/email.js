/**
 * Contact-form email delivery.
 *
 * This is a static site with no server, so the browser cannot send mail
 * itself. Submissions are relayed through Web3Forms, which posts them to the
 * inbox registered against the access key and needs no backend of our own.
 *
 * The access key is deliberately public — Web3Forms issues it for client-side
 * use and it only ever delivers to the address it was registered with, so a
 * scraper who lifts it can spam that inbox but cannot read anything or point
 * submissions somewhere else. It still lives in `VITE_WEB3FORMS_KEY` rather
 * than in this file, so the repo is not tied to one company's inbox.
 *
 * When the key is unset, `sendEnquiryEmail` throws `EmailNotConfiguredError`
 * and the form falls back to the WhatsApp hand-over. It never reports a
 * delivery that did not happen.
 */

import { COMPANY, CONTACT } from './constants'

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY ?? ''
const ENDPOINT = 'https://api.web3forms.com/submit'
const REQUEST_TIMEOUT_MS = 15_000

export class EmailNotConfiguredError extends Error {
  constructor(message = 'No Web3Forms access key is configured.') {
    super(message)
    this.name = 'EmailNotConfiguredError'
  }
}

export class EmailDeliveryError extends Error {
  constructor(message = 'The enquiry could not be delivered.') {
    super(message)
    this.name = 'EmailDeliveryError'
  }
}

export const isEmailDeliveryConfigured = () => Boolean(ACCESS_KEY)

/**
 * Deliver one validated enquiry to the company inbox.
 *
 * @param {{name: string, email: string, phone: string, serviceType: string, message: string}} values
 * @throws {EmailNotConfiguredError} when no access key is set
 * @throws {EmailDeliveryError} on timeout, network failure or a rejection
 */
export const sendEnquiryEmail = async ({
  name,
  email,
  phone,
  serviceType,
  message,
}) => {
  if (!ACCESS_KEY) throw new EmailNotConfiguredError()

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: ACCESS_KEY,

        /*
         * The subject carries the name and service so the inbox is triageable
         * from the notification list alone, and `replyto` is the enquirer, so
         * hitting reply in Gmail answers the client rather than Web3Forms.
         */
        subject: `New ${serviceType} enquiry from ${name}`,
        from_name: `${COMPANY.shortName} website`,
        replyto: email,

        name,
        email,
        phone,
        service: serviceType,
        message,
        submitted_at: new Date().toISOString(),
        source: CONTACT.website,
      }),
    })

    // A rejection still comes back as JSON with success:false, so the body is
    // the authority here, not the status code alone.
    const result = await response.json().catch(() => null)

    if (!response.ok || !result?.success) {
      throw new EmailDeliveryError(
        result?.message ?? `Delivery failed with status ${response.status}.`,
      )
    }

    return result
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new EmailDeliveryError('The request timed out.')
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}
