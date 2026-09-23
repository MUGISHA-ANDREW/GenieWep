import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaWhatsapp } from 'react-icons/fa'
import { FiAlertCircle, FiCheckCircle, FiSend } from 'react-icons/fi'

import Button from '@/components/Button/Button'
import {
  COMPANY,
  EMAIL_LINK,
  SERVICE_TYPE_OPTIONS,
  buildEnquiryMessage,
  buildWhatsAppLink,
} from '@/utils/constants'
import { sendEnquiryEmail } from '@/utils/email'
import { contactDefaultValues, contactSchema } from '@/utils/validation'

const FIELD_BASE =
  'w-full rounded-lg border bg-card px-4 py-3 text-sm text-title transition-colors placeholder:text-dim/70 focus:outline-none'

const fieldClasses = (hasError) =>
  `${FIELD_BASE} ${
    hasError
      ? 'border-err-line focus:border-err-text'
      : 'border-line-strong focus:border-azure-500'
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
 * Only `email: 'sent'` is allowed to say the message was delivered, because
 * that is the only state where it reached the company without the visitor
 * doing anything else. The other states describe the step still outstanding —
 * including a deployment with no `RESEND_API_KEY`, which fails like any other
 * outage rather than quietly pretending to have sent something.
 */
const outcomeCopy = ({ email }) => {
  if (email === 'pending') {
    return {
      tone: 'bg-tint',
      heading: 'Sending your message…',
      body: 'Delivering your enquiry to our inbox.',
    }
  }

  if (email === 'sent') {
    return {
      tone: 'bg-ok-bg',
      heading: 'Message delivered',
      body: `Your message has arrived in the ${COMPANY.shortName} inbox. We will get back to you shortly — usually within one business day.`,
    }
  }

  // 'failed' — the POST never landed, or the server could not send it on.
  return {
    tone: 'bg-warn-bg',
    heading: 'That did not send',
    body: 'We could not deliver your message just now, so nobody has seen it yet. Send it on WhatsApp instead — your details are already filled in — or email us directly.',
  }
}

export const ContactForm = () => {
  /*
   * `handoff` is null while editing, and otherwise records what became of the
   * submission: the prefilled WhatsApp link, and how delivery went
   * ('pending' | 'sent' | 'failed').
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
    /*
     * Pressing Send delivers the message to the company inbox and nothing else
     * happens: no second tab, no app switch. WhatsApp used to open on every
     * submission, which was right when it was the only channel and wrong now —
     * a visitor who asked to send an email should not have a chat window
     * thrown at them, and a popup appearing alongside "delivered" reads as
     * though the send did not work.
     *
     * It stays one click away on the panel below, and on failure it is the
     * recovery path, which is the one case where it earns the interruption.
     * The link is built up front so it is ready either way.
     */
    const link = buildWhatsAppLink(buildEnquiryMessage(values))
    setHandoff({ link, email: 'pending' })

    try {
      await sendEnquiryEmail(values)
      setHandoff({ link, email: 'sent' })
      reset()
    } catch {
      // Keep the typed values: the enquiry has not reached anyone yet, and the
      // visitor may want to retry or copy their text out.
      setHandoff({ link, email: 'failed' })
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
        /* Borderless like the cards. The tinted fill still carries the state,
           and the icon above says it again without relying on colour. */
        className={`rounded-xl p-8 text-center ${tone}`}
      >
        {pending ? (
          <span
            aria-hidden="true"
            className="mx-auto mb-4 block h-12 w-12 animate-spin rounded-full border-4 border-line border-t-azure-500"
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

        <h3 className="mb-2 text-lg text-title">{heading}</h3>
        <p className="mb-6 text-sm text-body">{body}</p>

        {!pending && (
          <>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              {/*
                After a delivered message this is an offer, not a fallback —
                "instead" would suggest the email did not land. Everywhere else
                it is the way the enquiry actually reaches someone.
              */}
              <Button href={handoff.link} variant="whatsapp" size="sm">
                <FaWhatsapp aria-hidden="true" className="h-4 w-4" />
                {delivered ? 'Chat on WhatsApp too' : 'Send on WhatsApp'}
              </Button>

              {/* Pointless once the message is already in that inbox. */}
              {!delivered && (
                <Button href={EMAIL_LINK} variant="outline" size="sm">
                  Email us instead
                </Button>
              )}
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
