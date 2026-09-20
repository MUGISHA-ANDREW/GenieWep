/**
 * POST /api/send-enquiry — the contact form's delivery endpoint.
 *
 * A Vercel Serverless Function. It exists so the Resend API key stays on the
 * server: the browser posts the enquiry here, and this hands it to Resend.
 *
 * Everything it does lives in `_enquiry.js`, shared with the dev middleware in
 * `vite.config.js`. Files in `api/` whose names start with `_` are not routed,
 * so that module is importable without becoming an endpoint of its own.
 */

import {
  EnquiryConfigError,
  EnquiryDeliveryError,
  EnquiryValidationError,
  deliverEnquiry,
  parseEnquiry,
} from './_enquiry.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ success: false, message: 'Method not allowed.' })
  }

  try {
    /*
     * Vercel parses a JSON body for us; the dev middleware hands over an
     * already-parsed object. A string turns up when the content type was not
     * application/json, which is worth reading rather than rejecting outright.
     */
    const payload =
      typeof request.body === 'string' ? JSON.parse(request.body) : request.body

    const enquiry = parseEnquiry(payload)

    /*
     * Honeypot tripped. Answered with a plain success: a bot that is told it
     * was filtered is a bot that tries again differently, and nothing has been
     * sent either way.
     */
    if (enquiry === null) {
      return response.status(200).json({ success: true })
    }

    await deliverEnquiry(enquiry)
    return response.status(200).json({ success: true })
  } catch (error) {
    if (error instanceof EnquiryValidationError || error instanceof SyntaxError) {
      return response.status(400).json({ success: false, message: error.message })
    }

    if (error instanceof EnquiryConfigError) {
      /*
       * 503, not 500: the code is fine, the deployment is missing
       * RESEND_API_KEY. Logged loudly because the visitor-facing message says
       * nothing useful about it, and this is the failure most likely to go
       * unnoticed after a deploy.
       */
      console.error('[send-enquiry] RESEND_API_KEY is not set — nothing was sent.')
      return response
        .status(503)
        .json({ success: false, message: 'Email delivery is not configured.' })
    }

    console.error('[send-enquiry] delivery failed:', error)
    const status = error instanceof EnquiryDeliveryError ? 502 : 500
    return response
      .status(status)
      .json({ success: false, message: 'The message could not be delivered.' })
  }
}
