import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaWhatsapp } from 'react-icons/fa'
import { FiAlertCircle, FiCheckCircle, FiSend } from 'react-icons/fi'

import Button from '@/components/Button/Button'
import {
  EMAIL_LINK,
  SERVICE_TYPE_OPTIONS,
  buildEnquiryMessage,
  buildWhatsAppLink,
} from '@/utils/constants'
import { isEmailDeliveryConfigured, sendEnquiryEmail } from '@/utils/email'
import { contactDefaultValues, contactSchema } from '@/utils/validation'

const FIELD_BASE =
  'w-full rounded-lg border bg-card px-4 py-3 text-sm text-title transition-colors placeholder:text-dim/70 focus:outline-none'

const fieldClasses = (hasError) =>
  `${FIELD_BASE} ${
    hasError
      ? 'border-err-line focus:border-err-text'
      : 'border-line-strong focus:border-accent-500'
  }`

/** Inline error text, wired to its input through aria-describedby. */
const FieldError = ({ id, message }) =>
  message ? (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-err-text">
      <FiAlertCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  ) : null

/**
 * The panel shown after submitting, driven by what actually happened.
 *
 * Only `email: 'sent'` is allowed to say the message was sent, because that is
 * the only state where it reached the company without the visitor doing
 * anything else. Every other state describes the step still outstanding.
 */
const outcomeCopy = ({ email, opened }) => {
  if (email === 'pending') {
    return {
      tone: 'border-line bg-tint',
      heading: 'Sending your message…',
      body: 'Delivering your enquiry to our inbox.',
    }
  }

  if (email === 'sent') {
    return {
      tone: 'border-ok-line bg-ok-bg',
      heading: 'Message sent',
      body: opened
        ? 'Your enquiry is in our inbox and we reply within one business day. We also opened WhatsApp if you would like an answer sooner.'
        : 'Your enquiry is in our inbox and we reply within one business day.',
    }
  }

  if (email === 'failed') {
    return {
      tone: 'border-warn-line bg-warn-bg',
      heading: 'Send it on WhatsApp',
      body: 'We could not deliver your enquiry by email just now. Your details are already filled into a WhatsApp chat — press send there and we will pick it up.',
    }
  }

  // 'off' — no delivery key configured, so WhatsApp is the only channel.
  return opened
    ? {
        tone: 'border-ok-line bg-ok-bg',
        heading: 'Finish in WhatsApp',
        body: 'Your details are ready in a WhatsApp chat with us. Press send there and we will reply within one business day.',
      }
    : {
        tone: 'border-warn-line bg-warn-bg',
        heading: 'Open WhatsApp to send',
        body: 'Your browser blocked the WhatsApp window. Use the button below to open the chat with your details already filled in.',
      }
}

export const ContactForm = () => {
  /*
   * `handoff` is null while editing, and otherwise records what became of the
   * submission: the WhatsApp link, whether the browser let us open it, and how
   * the email delivery went ('pending' | 'sent' | 'failed' | 'off').
   */
  const [handoff, setHandoff] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: contactDefaultValues,
    mode: 'onBlur',
  })

  const onSubmit = async (values) => {
    const link = buildWhatsAppLink(buildEnquiryMessage(values))

    /*
     * WhatsApp opens first, before any await. A popup is only allowed while
     * the click's user gesture is still live, and awaiting the email POST
     * first would spend it — the tab would be blocked on every submission.
     *
     * Deliberately not `window.open(link, '_blank', 'noopener')` either:
     * passing noopener in the features string makes browsers return null even
     * on success, which would make every successful hand-over look blocked.
     * Opening plainly and then severing `opener` gets both the reference and
     * the isolation.
     */
    const tab = window.open(link, '_blank')
    if (tab) tab.opener = null

    const configured = isEmailDeliveryConfigured()
    setHandoff({ link, opened: Boolean(tab), email: configured ? 'pending' : 'off' })

    if (!configured) {
      // WhatsApp is the only channel, so clear only once it has the message.
      if (tab) reset()
      return
    }

    try {
      await sendEnquiryEmail(values)
      setHandoff((current) => ({ ...current, email: 'sent' }))
      reset()
    } catch {
      // Keep the typed values: the enquiry has not reached anyone yet, and the
      // visitor may want to retry or copy their text out.
      setHandoff((current) => ({ ...current, email: 'failed' }))
    }
  }

  if (handoff) {
    const { tone, heading, body } = outcomeCopy(handoff)
    const pending = handoff.email === 'pending'
    const delivered = handoff.email === 'sent'

    return (
      <div
        role="status"
        aria-live="polite"
        className={`rounded-xl border p-8 text-center ${tone}`}
      >
        {pending ? (
          <span
            aria-hidden="true"
            className="mx-auto mb-4 block h-12 w-12 animate-spin rounded-full border-4 border-line border-t-accent-500"
          />
        ) : delivered ? (
          <FiCheckCircle
            aria-hidden="true"
            className="mx-auto mb-4 h-12 w-12 text-ok-text"
          />
        ) : (
          <FaWhatsapp
            aria-hidden="true"
            className="mx-auto mb-4 h-12 w-12 text-whatsapp-dark"
          />
        )}

        <h3 className="mb-2 text-xl text-title">{heading}</h3>
        <p className="mb-6 text-sm text-body">{body}</p>

        {!pending && (
          <>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={handoff.link} variant="whatsapp" size="sm">
                <FaWhatsapp aria-hidden="true" className="h-4 w-4" />
                {handoff.opened ? 'Reopen WhatsApp' : 'Open WhatsApp'}
              </Button>
              <Button href={EMAIL_LINK} variant="outline" size="sm">
                Email us instead
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setHandoff(null)}
              className="mt-6 text-sm font-semibold text-link underline underline-offset-4 transition-colors hover:text-link-strong"
            >
              {delivered ? 'Send another message' : 'Back to the form'}
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company (leave blank)</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register('company')} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-title">
            Full name <span className="text-err-text">*</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Nakato"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={fieldClasses(errors.name)}
            {...register('name')}
          />
          <FieldError id="name-error" message={errors.name?.message} />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-title">
            Email address <span className="text-err-text">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={fieldClasses(errors.email)}
            {...register('email')}
          />
          <FieldError id="email-error" message={errors.email?.message} />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-title">
            Phone number <span className="text-err-text">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+256 767 267 209"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className={fieldClasses(errors.phone)}
            {...register('phone')}
          />
          <FieldError id="phone-error" message={errors.phone?.message} />
        </div>

        <div>
          <label htmlFor="serviceType" className="mb-1.5 block text-sm font-semibold text-title">
            Service needed <span className="text-err-text">*</span>
          </label>
          <select
            id="serviceType"
            aria-invalid={Boolean(errors.serviceType)}
            aria-describedby={errors.serviceType ? 'serviceType-error' : undefined}
            className={fieldClasses(errors.serviceType)}
            {...register('serviceType')}
          >
            <option value="">Select a service…</option>
            {SERVICE_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError id="serviceType-error" message={errors.serviceType?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-title">
          Project details <span className="text-err-text">*</span>
        </label>
        <textarea
          id="message"
          rows={6}
          placeholder="Tell us about your project, timeline and budget…"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={`${fieldClasses(errors.message)} resize-y`}
          {...register('message')}
        />
        <FieldError id="message-error" message={errors.message?.message} />
      </div>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
        <Button type="submit" size="lg">
          <FiSend aria-hidden="true" className="h-4 w-4" />
          Send message
        </Button>
      </div>
    </form>
  )
}

export default ContactForm
