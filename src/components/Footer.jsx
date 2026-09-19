import { FaWhatsapp } from 'react-icons/fa'
import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6'
import { FiGlobe, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import {
  COMPANY,
  CONTACT,
  CORE_SERVICES,
  EMAIL_LINK,
  NAV_LINKS,
  PHONE_LINK,
  SOCIAL_LINKS,
  WHATSAPP_LINK,
} from '@/utils/constants'

/**
 * Maps the `icon` keys on `SOCIAL_LINKS` to components. Kept here rather than
 * in constants.js so the data file never imports React.
 */
const SOCIAL_ICONS = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  x: FaXTwitter,
  tiktok: FaTiktok,
}

export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-steel-900 text-surface-200">
      <div className="container-page py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="text-lg font-extrabold text-white">{COMPANY.name}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent-400">
              {COMPANY.label}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-surface-300">
              {COMPANY.tagline}
            </p>

            {/*
              Social row sits with the brand rather than in the contact column:
              these are places to follow the company, not ways to reach it about
              a project. The enquiry channels stay together on the right.
            */}
            <ul className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const SocialIcon = SOCIAL_ICONS[social.icon]

                return (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${COMPANY.shortName} on ${social.label} (opens in a new tab)`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-surface-200 ring-1 ring-white/12 transition-all duration-200 ease-[var(--ease-brand)] hover:-translate-y-0.5 hover:bg-accent-500 hover:text-white hover:ring-accent-400"
                    >
                      <SocialIcon aria-hidden="true" className="h-4 w-4" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Pages */}
          <nav aria-label="Footer navigation">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Pages
            </h2>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-surface-300 transition-colors hover:text-accent-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Services
            </h2>
            <ul className="space-y-2.5">
              {CORE_SERVICES.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link
                    to="/services"
                    className="text-sm text-surface-300 transition-colors hover:text-accent-400"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h2>
            <ul className="space-y-3">
              <li>
                <a
                  href={CONTACT.websiteUrl}
                  className="flex items-start gap-3 text-sm text-surface-300 transition-colors hover:text-accent-400"
                >
                  <FiGlobe aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                  {CONTACT.website}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-surface-300 transition-colors hover:text-accent-400"
                >
                  <FaWhatsapp
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-whatsapp"
                  />
                  {CONTACT.phoneDisplay}
                  <span className="sr-only">on WhatsApp (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={PHONE_LINK}
                  className="flex items-start gap-3 text-sm text-surface-300 transition-colors hover:text-accent-400"
                >
                  <FiPhone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                  Call {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={EMAIL_LINK}
                  className="flex items-start gap-3 text-sm break-all text-surface-300 transition-colors hover:text-accent-400"
                >
                  <FiMail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-surface-300">
                <FiMapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                {CONTACT.country}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs text-surface-300">
            &copy; {year} {COMPANY.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
