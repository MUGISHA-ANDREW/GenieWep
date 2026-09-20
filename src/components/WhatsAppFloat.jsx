import { FaWhatsapp } from 'react-icons/fa'

import { CONTACT, WHATSAPP_LINK } from '@/utils/constants'

/**
 * Persistent WhatsApp button. WhatsApp is the client's primary enquiry channel
 * (catalogue Section 8), so it stays reachable from every page and scroll
 * position without waiting for the visitor to find the contact form.
 *
 * The expanding halo is what stops it reading as page furniture after the
 * first scroll. It is a sibling element rather than a ring on the button
 * itself, because a transform on the button would fight the hover scale, and
 * it sits behind the button with `-z-10` so it never intercepts the tap.
 *
 * No text label on it, deliberately. This button carries WhatsApp's green,
 * which white text sits on at roughly 2:1 — see the `whatsapp` variant in
 * Button/Button.jsx, where the label is brand navy for exactly that reason.
 * The glyph alone is a logo, which WCAG exempts; a white "Chat with us" beside
 * it would not be.
 */
export const WhatsAppFloat = () => (
  <a
    href={WHATSAPP_LINK}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Chat with GenieWep Technologies on WhatsApp at ${CONTACT.phoneDisplay} (opens in a new tab)`}
    className="group fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-whatsapp/40 transition-all duration-300 ease-[var(--ease-brand)] hover:scale-110 hover:shadow-xl hover:shadow-whatsapp/50 active:scale-100"
  >
    <span
      aria-hidden="true"
      className="absolute inset-0 -z-10 rounded-full bg-whatsapp animate-halo"
    />
    <FaWhatsapp
      aria-hidden="true"
      className="h-7 w-7 transition-transform duration-300 ease-[var(--ease-brand)] group-hover:rotate-12"
    />
  </a>
)

export default WhatsAppFloat
