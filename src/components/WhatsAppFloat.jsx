import { FaWhatsapp } from 'react-icons/fa'

import { CONTACT, WHATSAPP_LINK } from '@/utils/constants'

/**
 * Persistent WhatsApp button. WhatsApp is the client's primary enquiry channel
 * (catalogue Section 8), so it stays reachable from every page and scroll
 * position without waiting for the visitor to find the contact form.
 */
export const WhatsAppFloat = () => (
  <a
    href={WHATSAPP_LINK}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Chat with GenieWep Technologies on WhatsApp at ${CONTACT.phoneDisplay} (opens in a new tab)`}
    className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-whatsapp/40 transition-transform duration-200 hover:scale-110 active:scale-100"
  >
    <FaWhatsapp aria-hidden="true" className="h-7 w-7" />
  </a>
)

export default WhatsAppFloat
