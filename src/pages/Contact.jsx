import { FaWhatsapp } from 'react-icons/fa'
import { FiGlobe, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'

import ContactForm from '@/components/Form/ContactForm'
import Card from '@/components/Card/Card'
import Seo from '@/components/Seo'
import {
  CONTACT,
  EMAIL_LINK,
  PHONE_LINK,
  WHATSAPP_LINK,
} from '@/utils/constants'

const CHANNELS = [
  {
    id: 'whatsapp',
    icon: FaWhatsapp,
    label: 'WhatsApp',
    value: CONTACT.phoneDisplay,
    href: WHATSAPP_LINK,
    hint: 'Fastest reply — usually within a few hours.',
    external: true,
    /* WhatsApp is recognised by its green long before the label is read, so
       this one glyph keeps the brand colour instead of the site accent. */
    tile: 'text-whatsapp-dark',
  },
  {
    id: 'phone',
    icon: FiPhone,
    label: 'Phone',
    value: CONTACT.phoneDisplay,
    href: PHONE_LINK,
    hint: 'Available during business hours.',
    external: false,
  },
  {
    id: 'email',
    icon: FiMail,
    label: 'Email',
    value: CONTACT.email,
    href: EMAIL_LINK,
    hint: 'Best for detailed briefs and documents.',
    external: false,
  },
  {
    id: 'website',
    icon: FiGlobe,
    label: 'Website',
    value: CONTACT.website,
    href: CONTACT.websiteUrl,
    hint: null,
    external: true,
  },
]

const Contact = () => (
  <>
    <Seo
      title="Contact Us"
      description="Get in touch with GenieWep Technologies for a free consultation and a fixed-price quote. WhatsApp +256 767 267 209 or send us a message."
      path="/contact"
    />

    <section className="bg-navy-900">
      <div className="container-page py-16 md:py-20">
        <p className="eyebrow mb-5">
          Contact
        </p>
        <h1 className="max-w-3xl text-3xl text-white md:text-4xl">
          Let&apos;s build something great together
        </h1>
        <p className="mt-5 max-w-2xl text-base text-surface-200 md:text-lg">
          Send us your project details and we will come back with a clear scope,
          timeline and fixed price.
        </p>
      </div>
    </section>

    <div className="bg-canvas py-16 md:py-24">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          {/* Channels */}
          <aside>
            <h2 className="text-xl text-title">Reach us directly</h2>
            <p className="mt-3 text-sm leading-relaxed text-body">
              Prefer to talk first? Use whichever channel suits you.
            </p>

            <ul className="mt-8 space-y-4">
              {CHANNELS.map((channel) => (
                <li key={channel.id}>
                  <Card hoverable className="p-5">
                    <a
                      href={channel.href}
                      {...(channel.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="flex items-start gap-4"
                    >
                      {/* Bare glyph: the tinted tiles behind icons are gone
                          site-wide, so `tile` now only carries a colour. */}
                      <span
                        className={`inline-flex shrink-0 ${channel.tile ?? 'text-link'}`}
                      >
                        {/* Member expression: the component reference already
                            exists on the module-scope CHANNELS entry. */}
                        <channel.icon aria-hidden="true" className="h-7 w-7" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-bold uppercase tracking-wider text-dim">
                          {channel.label}
                        </span>
                        <span className="mt-0.5 block break-words text-sm font-semibold text-title">
                          {channel.value}
                        </span>
                        {channel.hint && (
                          <span className="mt-1 block text-xs text-dim">
                            {channel.hint}
                          </span>
                        )}
                      </span>
                    </a>
                  </Card>
                </li>
              ))}

              <li>
                <Card className="p-5">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex shrink-0 text-link">
                      <FiMapPin aria-hidden="true" className="h-7 w-7" />
                    </span>
                    <span>
                      <span className="block text-xs font-bold uppercase tracking-wider text-dim">
                        Location
                      </span>
                      <span className="mt-0.5 block text-sm font-semibold text-title">
                        {CONTACT.location}
                      </span>
                    </span>
                  </div>
                </Card>
              </li>
            </ul>
          </aside>

          {/* Form */}
          <div>
            <Card className="p-6 md:p-8">
              <h2 className="mb-2 text-xl text-title">Send us a message</h2>
              <p className="mb-8 text-sm text-body">
                Fields marked with an asterisk are required.
              </p>
              <ContactForm />
            </Card>
          </div>
        </div>
      </div>
    </div>
  </>
)

export default Contact
