/**
 * Contact-form email delivery, browser side.
 *
 * Posts the enquiry to this site's own `/api/send-enquiry`, which hands it to
 * Resend and on to the company inbox. Nothing about Resend is visible here:
 * its API key can send mail as the whole verified domain, so it stays on the
 * server and the browser only ever talks to our own origin.
 *
 * That is the difference from the Web3Forms setup this replaced. A Web3Forms
 * access key is public by design and shipped in the bundle; a Resend key in
 * the bundle would let anyone send mail as geniewep.com. Same form, same
 * panel, but delivery now runs through `api/send-enquiry.js`.
 *
 * There is no client-side "is it configured" check any more, because there is
 * nothing in the browser to check — whether the server has a key is the
 * server's business. The form attempts delivery and reports what happened. A
 * deployment with no `RESEND_API_KEY` answers 503 and lands in the same
 * failure path as a network outage, which is correct: in both cases nobody
 * received the message, and the form says so rather than claiming otherwise.
 */

const ENDPOINT = '/api/send-enquiry'
const REQUEST_TIMEOUT_MS = 15_000

export class EmailDeliveryError extends Error {
  constructor(message = 'The enquiry could not be delivered.') {
    super(message)
    this.name = 'EmailDeliveryError'
  }
}

/**
 * Deliver one validated enquiry to the company inbox.
 *
 * @param {{name: string, email: string, phone: string, serviceType: string, message: string, botcheck?: string}} values
 * @throws {EmailDeliveryError} on timeout, network failure or a rejection
 */
export const sendEnquiryEmail = async ({
  name,
  email,
  phone,
  serviceType,
  message,
  botcheck = '',
}) => {
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
      /*
       * The honeypot travels with the rest. It is checked again on the server:
       * a bot posting straight to the endpoint never ran the form's
       * validation, so the browser's check is a convenience, not a control.
       */
      body: JSON.stringify({ name, email, phone, serviceType, message, botcheck }),
    })

    /*
     * A rejection can still arrive as JSON with success:false, so the body is
     * the authority here, not the status code alone. It can also arrive as the
     * SPA's index.html — that is what `npm run dev` serves for an unknown path
     * when the dev middleware is not running — hence the guarded parse.
     */
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
    if (error instanceof EmailDeliveryError) throw error
    throw new EmailDeliveryError(error.message)
  } finally {
    clearTimeout(timeout)
  }
}
