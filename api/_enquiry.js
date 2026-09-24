/**
 * Contact-form delivery, server side.
 *
 * Resend's API key is a secret — unlike a Web3Forms access key it can send
 * mail as the whole verified domain, so it must never reach the browser. That
 * is the entire reason this file exists: the site is otherwise a static bundle
 * with no server, and every enquiry now goes out through one function instead.
 *
 * The logic lives here rather than in the route handler so the Vercel function
 * and the local dev middleware in `vite.config.js` run the same code. A dev
 * shim that reimplements delivery is a shim that drifts, and the drift only
 * shows up in production.
 *
 * Environment (all server-side; no VITE_ prefix, so Vite cannot inline them):
 *   RESEND_API_KEY  required. From https://resend.com/api-keys
 *   RESEND_FROM     optional. Defaults to Resend's shared testing sender.
 *   ENQUIRY_TO      optional. Defaults to the address in constants.js.
 *   GMAIL_USER, GMAIL_APP_PASSWORD
 *                   optional. When both are set, the enquirer's confirmation
 *                   goes out through that Gmail account instead of Resend.
 *                   Resend cannot mail arbitrary visitors until a domain is
 *                   verified; Gmail can, from the day it is configured.
 */

import nodemailer from 'nodemailer'

import { CONTACT, COMPANY } from '../src/utils/constants.js'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const REQUEST_TIMEOUT_MS = 15_000

/*
 * Resend will only deliver from a domain verified in the account. Until
 * geniewep.com is verified, `onboarding@resend.dev` is the shared sender
 * Resend provides — it works immediately but will only deliver to the address
 * that owns the Resend account, which makes it fine for a smoke test and
 * useless for real enquiries. See PROJECT_BRIEF.md §12.1.
 */
const DEFAULT_FROM = 'GenieWep Website <onboarding@resend.dev>'

export class EnquiryConfigError extends Error {
  constructor(message = 'Email delivery is not configured on the server.') {
    super(message)
    this.name = 'EnquiryConfigError'
  }
}

export class EnquiryValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'EnquiryValidationError'
  }
}

export class EnquiryDeliveryError extends Error {
  constructor(message = 'The enquiry could not be delivered.') {
    super(message)
    this.name = 'EnquiryDeliveryError'
  }
}

const MAX = { name: 80, email: 160, phone: 40, serviceType: 80, message: 2000 }

/**
 * Re-validates what arrived over the wire.
 *
 * The browser already checked all of this with Zod, which is worth nothing
 * here: this endpoint is a public URL and anything can POST to it. Deliberately
 * not sharing the Zod schema — it pulls `SERVICE_TYPE_OPTIONS` and a dependency
 * into the function for rules that, server side, only need to answer "is this
 * a plausible, bounded string".
 */
export const parseEnquiry = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw new EnquiryValidationError('Expected a JSON object.')
  }

  // Honeypot: hidden from people, irresistible to bots. Anything in it is a
  // bot, and the quiet accept below means it never learns why nothing arrived.
  if (typeof payload.botcheck === 'string' && payload.botcheck.trim() !== '') {
    return null
  }

  const clean = {}
  for (const field of ['name', 'email', 'phone', 'serviceType', 'message']) {
    const value = payload[field]
    if (typeof value !== 'string' || value.trim() === '') {
      throw new EnquiryValidationError(`Missing required field: ${field}.`)
    }
    if (value.length > MAX[field]) {
      throw new EnquiryValidationError(`Field is too long: ${field}.`)
    }
    clean[field] = value.trim()
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) {
    throw new EnquiryValidationError('Invalid email address.')
  }

  return clean
}

/** Escapes interpolated text so a quote in a message cannot break the markup. */
const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const buildBody = ({ name, email, phone, serviceType, message }) => {
  const rows = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone],
    ['Service', serviceType],
  ]

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#0b2740;max-width:560px">
      <h2 style="margin:0 0 4px;font-size:18px">New website enquiry</h2>
      <p style="margin:0 0 20px;color:#56748c;font-size:13px">via ${escapeHtml(CONTACT.website)}</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:6px 12px 6px 0;color:#56748c;white-space:nowrap;vertical-align:top">${label}</td>
            <td style="padding:6px 0"><strong>${escapeHtml(value)}</strong></td>
          </tr>`,
          )
          .join('')}
      </table>
      <p style="margin:20px 0 6px;color:#56748c;font-size:13px">Project details</p>
      <div style="white-space:pre-wrap;border-left:3px solid #0a7bb8;padding:4px 0 4px 14px;font-size:14px">${escapeHtml(
        message,
      )}</div>
      <p style="margin:24px 0 0;color:#56748c;font-size:12px">
        Reply to this email to answer ${escapeHtml(name)} directly.
      </p>
    </div>`

  const text = [
    'New website enquiry',
    `via ${CONTACT.website}`,
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Project details:',
    message,
  ].join('\n')

  return { html, text }
}

/**
 * The acknowledgement the enquirer gets: proof the form worked, and a promise
 * of a reply. Deliberately short and without a copy of their message — it goes
 * to an address nobody has verified, so it should carry as little as possible.
 */
const buildConfirmation = ({ name, serviceType }) => {
  const firstName = name.split(/\s+/)[0]

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#0b2740;max-width:560px">
      <h2 style="margin:0 0 16px;font-size:18px">Thanks, ${escapeHtml(firstName)} — your message was received</h2>
      <p style="margin:0 0 12px;font-size:14px;line-height:1.6">
        Your ${escapeHtml(serviceType)} enquiry reached the ${escapeHtml(COMPANY.name)} team.
        We will contact you in less than 24 hours.
      </p>
      <p style="margin:0 0 12px;font-size:14px;line-height:1.6">
        Need us sooner? Call or WhatsApp ${escapeHtml(CONTACT.phoneDisplay)}.
      </p>
      <p style="margin:24px 0 0;color:#56748c;font-size:12px">
        ${escapeHtml(COMPANY.name)} · ${escapeHtml(CONTACT.location)} · ${escapeHtml(CONTACT.website)}
      </p>
    </div>`

  const text = [
    `Thanks, ${firstName} — your message was received.`,
    '',
    `Your ${serviceType} enquiry reached the ${COMPANY.name} team. We will contact you in less than 24 hours.`,
    '',
    `Need us sooner? Call or WhatsApp ${CONTACT.phoneDisplay}.`,
    '',
    `${COMPANY.name} · ${CONTACT.location} · ${CONTACT.website}`,
  ].join('\n')

  return { html, text }
}

/** One POST to Resend. */
const sendEmail = async (apiKey, message) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      throw new EnquiryDeliveryError(
        result?.message ?? `Resend rejected the message (${response.status}).`,
      )
    }

    return result
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new EnquiryDeliveryError('The request to Resend timed out.')
    }
    if (error instanceof EnquiryDeliveryError) throw error
    throw new EnquiryDeliveryError(error.message)
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Sends the enquirer's acknowledgement: through Gmail when GMAIL_USER and
 * GMAIL_APP_PASSWORD are set, otherwise through Resend (which only reaches
 * visitors once RESEND_FROM is on a verified domain).
 */
const sendConfirmation = async (enquiry, { apiKey, from, inbox, env }) => {
  const { html, text } = buildConfirmation(enquiry)
  const subject = `We received your message — ${COMPANY.name}`

  if (env.GMAIL_USER && env.GMAIL_APP_PASSWORD) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD },
      connectionTimeout: REQUEST_TIMEOUT_MS,
      socketTimeout: REQUEST_TIMEOUT_MS,
    })
    return transport.sendMail({
      from: `${COMPANY.name} <${env.GMAIL_USER}>`,
      to: enquiry.email,
      replyTo: inbox,
      subject,
      html,
      text,
    })
  }

  return sendEmail(apiKey, {
    from,
    to: [enquiry.email],
    reply_to: inbox,
    subject,
    html,
    text,
    headers: { 'X-Entity-Ref-ID': `${COMPANY.shortName}-confirmation` },
  })
}

/**
 * Hands one validated enquiry to Resend: the enquiry itself to the company
 * inbox, then an acknowledgement to the enquirer.
 *
 * Only the first is load-bearing. If the acknowledgement fails the enquiry has
 * still arrived, so that failure is logged rather than reported to the
 * visitor as "did not send" — which would invite a duplicate.
 *
 * @throws {EnquiryConfigError}   when RESEND_API_KEY is unset
 * @throws {EnquiryDeliveryError} on timeout, network failure or a rejection
 */
export const deliverEnquiry = async (enquiry, env = process.env) => {
  const apiKey = env.RESEND_API_KEY
  if (!apiKey) throw new EnquiryConfigError()

  const from = env.RESEND_FROM || DEFAULT_FROM
  const inbox = env.ENQUIRY_TO || CONTACT.email
  const { html, text } = buildBody(enquiry)

  const result = await sendEmail(apiKey, {
    from,
    to: [inbox],

    /*
     * `reply_to` is the enquirer, so hitting reply in Gmail answers the
     * client rather than the sending domain. The subject leads with the
     * service and the name so the inbox is triageable from the
     * notification list alone.
     */
    reply_to: enquiry.email,
    subject: `New ${enquiry.serviceType} enquiry from ${enquiry.name}`,
    html,
    text,
    headers: { 'X-Entity-Ref-ID': `${COMPANY.shortName}-enquiry` },
  })

  try {
    await sendConfirmation(enquiry, { apiKey, from, inbox, env })
  } catch (error) {
    console.warn('[send-enquiry] confirmation to enquirer not sent:', error.message)
  }

  return result
}
