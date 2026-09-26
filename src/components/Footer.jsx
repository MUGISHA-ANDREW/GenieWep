import { FaWhatsapp } from 'react-icons/fa'
import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6'
import { FiGlobe, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import Logo from '@/components/Logo'
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
import { LEGAL_LINKS } from '@/utils/legal'

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

const linkClass =
  'text-sm text-surface-300 transition-colors duration-200 hover:text-azure-400'

const ColumnHeading = ({ children }) => (
  <h2 className="mb-5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-surface-300/70">
    {children}
  </h2>
)

/**
 * The footer.
 *
 * `navy-950` in both themes — the darkest surface on the site, so the page
 * ends on a floor rather than fading out. Everything in here therefore uses
 * the fixed `surface-*` text ramp instead of the themed `--c-body`, which
 * would invert to near-black on the light theme and vanish.
 */
export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-navy-700/60 bg-navy-950 text-surface-200">
      <div className="container-page pt-12 pb-24 sm:pb-14 sm:pt-14 md:py-16">
        {/*
          The brand block takes a wider column of its own and the four link
          columns share the rest. Five equal columns would leave the tagline a
          150px gutter to live in, which is how it ends up wrapping every
          second word.
        */}
        {/* Two columns even on a phone: the short link lists sit side by side
            instead of stacking into one very long scroll. The brand block and
            the contact details, whose lines are too long to halve, span both. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-8">
          <div className="col-span-2 lg:col-span-1 lg:pr-8">
            <Logo onDark />

            <p className="mt-6 max-w-xs text-sm leading-relaxed text-surface-300">
              {COMPANY.tagline}
            </p>

            {/* Places to follow the company, not ways to reach it about a
                project — the enquiry channels stay together on the right. */}
            <ul className="mt-6 flex items-center gap-2 sm:gap-1">
              {SOCIAL_LINKS.map((social) => {
                const SocialIcon = SOCIAL_ICONS[social.icon]

                return (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${COMPANY.shortName} on ${social.label} (opens in a new tab)`}
                      /* 40px box as the tap target — WCAG 2.5.8 asks for 24px
                         minimum and a thumb wants more. */
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-navy-700/60 text-surface-300 transition-colors duration-200 hover:border-azure-500/50 hover:text-azure-400"
                    >
                      <SocialIcon aria-hidden="true" className="h-4 w-4" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <nav aria-label="Footer navigation">
            <ColumnHeading>Pages</ColumnHeading>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <ColumnHeading>Services</ColumnHeading>
            <ul className="space-y-3">
              {CORE_SERVICES.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link to="/services" className={linkClass}>
                    {/* The catalogue titles carry a parenthetical technology
                        note — "(Django / React)". It belongs on the services
                        page, not in a footer column. */}
                    {service.title.replace(/\s*\(.*\)$/, '')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <ColumnHeading>Contact</ColumnHeading>
            <ul className="space-y-3">
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} inline-flex items-start gap-2.5`}
                >
                  <FaWhatsapp
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-whatsapp"
                  />
                  {CONTACT.phoneDisplay}
                  <span className="sr-only">
                    on WhatsApp (opens in a new tab)
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={PHONE_LINK}
                  className={`${linkClass} inline-flex items-start gap-2.5`}
                >
                  <FiPhone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                  Call {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={EMAIL_LINK}
                  className={`${linkClass} inline-flex items-start gap-2.5 break-all`}
                >
                  <FiMail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.websiteUrl}
                  className={`${linkClass} inline-flex items-start gap-2.5`}
                >
                  <FiGlobe aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                  {CONTACT.website}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-surface-300">
                <FiMapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                {CONTACT.location}
              </li>
            </ul>
          </div>

          <nav aria-label="Legal" className="col-span-2 md:col-span-1">
            <ColumnHeading>Legal</ColumnHeading>
            <ul className="flex flex-wrap gap-x-6 gap-y-3 md:block md:space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t sm:mt-14 border-navy-700/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-surface-300/80">
            &copy; {year} {COMPANY.name}. All rights reserved.
          </p>
          <p className="text-xs text-surface-300/80">
            {COMPANY.label} &middot; {CONTACT.location}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
