/**
 * Single source of truth for everything printed in the
 * GenieWep Technologies Company Profile & Service Catalogue (2026 Edition).
 *
 * Rule: no price, service name, or project detail is hard-coded in a component.
 * When the catalogue changes, edit this file (and PROJECT_BRIEF.md) only.
 *
 * Money is stored as plain UGX numbers. Rendering is handled by
 * `formatUGX` / `formatPrice` in `utils/formatters.js` so every price on the
 * site is formatted identically.
 */

/* ------------------------------------------------------------------ */
/* Company                                                             */
/* ------------------------------------------------------------------ */

export const COMPANY = {
  name: 'GenieWep Technologies',
  shortName: 'GenieWep',
  label: 'Uganda Software Company',
  tagline: 'Building Digital Solutions for Businesses, Schools, NGOs and Startups.',
  yearsExperience: 5,
  catalogueEdition: '2026 Edition',

  summary:
    'GenieWep Technologies is a Ugandan software development startup specializing in designing and developing modern digital solutions for businesses, schools, NGOs, SACCOs, tourism companies, and startups.',

  experienceStatement:
    'With 5 years of software development experience, we build secure, responsive, and scalable applications that help organizations grow digitally.',

  mission:
    'To empower organizations through affordable, innovative, and reliable software solutions.',

  vision:
    "To become one of Uganda's leading software technology companies providing world-class digital products across Africa.",

  markets: [
    'Businesses',
    'Schools',
    'NGOs',
    'SACCOs',
    'Tourism companies',
    'Startups',
  ],
}

export const CONTACT = {
  website: 'geniewep.com',
  websiteUrl: 'https://geniewep.com',
  email: 'geniewep@gmail.com',
  phoneDisplay: '+256 767 267 209',
  phoneE164: '+256767267209',
  whatsappNumber: '256767267209',
  city: 'Kampala',
  country: 'Uganda',
  /* What the footer and the contact page print. Kept as one string rather than
     joined at each call site, so the city and country never drift apart. */
  location: 'Kampala, Uganda',
}

/**
 * Confirmed social profiles.
 *
 * `icon` keys are resolved to react-icons components in `components/Footer`
 * rather than stored here, so this file stays free of JSX imports and can be
 * read by tests and build scripts without pulling in React.
 *
 * Order is by the channels the client actually posts on, not alphabetically.
 */
export const SOCIAL_LINKS = [
  {
    id: 'facebook',
    label: 'Facebook',
    icon: 'facebook',
    url: 'https://www.facebook.com/profile.php?id=61594174394851',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: 'instagram',
    url: 'https://www.instagram.com/geniewep/',
  },
  {
    id: 'x',
    label: 'X',
    icon: 'x',
    url: 'https://x.com/GenieWep',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: 'tiktok',
    url: 'https://www.tiktok.com/@geniewep',
  },
]

/** Pre-filled WhatsApp deep link. Works on mobile and WhatsApp Web. */
export const buildWhatsAppLink = (
  message = `Hello ${COMPANY.name}, I would like to discuss a project.`,
) => `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`

/**
 * Turns a validated contact-form submission into the WhatsApp message body.
 *
 * The contact form has no backend: submitting hands the enquiry to WhatsApp,
 * so this is the actual wire format of every enquiry the company receives.
 * Labelled lines rather than prose, because the recipient is reading it on a
 * phone and needs the phone number and service at a glance.
 */
export const buildEnquiryMessage = ({
  name,
  email,
  phone,
  serviceType,
  message,
}) =>
  [
    `Hello ${COMPANY.name}, I would like to discuss a project.`,
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Service: ${serviceType}`,
    '',
    message,
  ].join('\n')

export const WHATSAPP_LINK = buildWhatsAppLink()
export const EMAIL_LINK = `mailto:${CONTACT.email}`
export const PHONE_LINK = `tel:${CONTACT.phoneE164}`

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
]

/* ------------------------------------------------------------------ */
/* Core services — catalogue Section 1                                 */
/* ------------------------------------------------------------------ */

/** `icon` keys are resolved to react-icons components in components/ServiceCard. */
export const CORE_SERVICES = [
  {
    id: 'business-websites',
    title: 'Business Websites',
    icon: 'globe',
    description:
      'Fast, mobile-first websites that turn visitors into enquiries for small and growing Ugandan businesses.',
  },
  {
    id: 'corporate-websites',
    title: 'Corporate Websites',
    icon: 'building',
    description:
      'Polished multi-page sites for established organizations that need authority, structure and scale.',
  },
  {
    id: 'web-applications',
    title: 'Web Applications (Django / React)',
    icon: 'code',
    description:
      'Secure dashboards, portals and internal systems built on Django with React front-ends.',
  },
  {
    id: 'mobile-applications',
    title: 'Mobile Applications (Android & iOS)',
    icon: 'mobile',
    description:
      'Native and cross-platform apps that put your service in your customers pockets.',
  },
  {
    id: 'desktop-applications',
    title: 'Desktop Applications',
    icon: 'desktop',
    description:
      'Offline-capable POS, inventory and school management software for day-to-day operations.',
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    icon: 'design',
    description:
      'Interface design and prototyping that makes complex products feel simple to use.',
  },
  {
    id: 'website-maintenance',
    title: 'Website Maintenance',
    icon: 'maintenance',
    description:
      'Ongoing updates, backups, security patches and content changes so your site never goes stale.',
  },
  {
    id: 'domain-hosting',
    title: 'Domain & Hosting Setup',
    icon: 'server',
    description:
      'Domain registration, hosting configuration and free SSL so you launch on solid infrastructure.',
  },
  {
    id: 'business-email',
    title: 'Professional Business Emails',
    icon: 'mail',
    description:
      'Branded mailboxes such as info@yourcompany.com, configured and ready across all devices.',
  },
  {
    id: 'seo',
    title: 'SEO & Google Search Optimization',
    icon: 'search',
    description:
      'Technical SEO, Google Business setup and on-page optimization so customers find you first.',
  },
]

/* ------------------------------------------------------------------ */
/* Portfolio — catalogue Section 2                                     */
/* ------------------------------------------------------------------ */

export const PROJECTS = [
  {
    id: 'gvm-company',
    name: 'GVM Company',
    domain: 'gvmcompany.com',
    /*
     * The apex host does not answer on 443 — https://gvmcompany.com hangs
     * until the browser gives up. Only the www host serves TLS, so the link
     * points there while `domain` keeps the clean name for display.
     */
    url: 'https://www.gvmcompany.com',
    industry: 'Agriculture & Development',
    category: 'Agriculture',
    description:
      'Corporate website for an agriculture and development company, presenting programmes and partners to a national audience.',
  },
  {
    id: 'scaval',
    name: 'SCAVAL',
    domain: 'scaval.com',
    url: 'https://scaval.com',
    industry: 'Agricultural Commodities',
    category: 'Agriculture',
    description:
      'Trade-facing site for an agricultural commodities business, built to communicate supply capability and credibility to buyers.',
  },
  {
    id: 'nkuruba-tours',
    name: 'Nkuruba Community Tours',
    domain: 'nkurubatours.com',
    url: 'https://nkurubatours.com',
    industry: 'Tourism',
    category: 'Tourism',
    description:
      'Tourism website showcasing community-led experiences around Lake Nkuruba, with enquiry capture for international visitors.',
  },
  {
    id: 'small-beginnings-uganda',
    name: 'Small Beginnings Uganda',
    // No public URL is listed in the 2026 catalogue. Confirm with the client
    // before adding one — see PROJECT_BRIEF.md §4.
    domain: null,
    url: null,
    industry: 'NGO / Education',
    category: 'NGO / Education',
    description:
      'Digital presence for an NGO working in education, built to support donor confidence and programme visibility.',
  },
]

export const PROJECT_CATEGORIES = [
  'All',
  ...Array.from(new Set(PROJECTS.map((project) => project.category))),
]

/* ------------------------------------------------------------------ */
/* Website packages — catalogue Section 3                              */
/* ------------------------------------------------------------------ */

export const WEBSITE_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Package',
    price: { min: 800_000 },
    bestFor: 'Best for small businesses.',
    featured: false,
    features: [
      'Up to 5 pages',
      'Mobile responsive design',
      'Contact form',
      'WhatsApp integration',
      'Google Maps',
      'Basic SEO',
      'Free SSL setup',
    ],
    clientPaysSeparately: [
      { item: 'Domain', price: { min: 45_000, max: 70_000 }, unit: 'year' },
      { item: 'Hosting', price: { min: 250_000 }, unit: 'year' },
    ],
  },
  {
    id: 'business',
    name: 'Business Package',
    price: { min: 1_500_000 },
    bestFor: 'Best for growing companies.',
    inheritsFrom: 'Starter',
    featured: true,
    features: [
      'Up to 12 pages',
      'Blog / News section',
      'Email notifications',
      'Photo gallery',
      'Professional email setup (info@company.com)',
      'Speed optimization',
      'Social media integration',
    ],
  },
  {
    id: 'executive',
    name: 'Executive Package',
    price: { min: 2_800_000, max: 4_000_000 },
    bestFor: 'Best for NGOs, tourism companies and corporate organizations.',
    featured: false,
    features: [
      'Unlimited pages',
      'Dynamic blog',
      'Admin dashboard for content updates',
      'Multiple contact forms',
      'Up to 5 professional emails',
      'Advanced SEO',
      'Security optimization',
      'Training after delivery',
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Web application packages — catalogue Section 4                      */
/* ------------------------------------------------------------------ */

export const WEB_APP_PACKAGES = [
  {
    id: 'basic-web-app',
    name: 'Basic Web App',
    detail: 'Bookings, School Portal, Inventory',
    price: { min: 2_000_000, max: 4_000_000 },
  },
  {
    id: 'business-web-app',
    name: 'Business Web App',
    detail: 'SACCO, CRM, HR, POS',
    price: { min: 4_000_000, max: 8_000_000 },
  },
  {
    id: 'enterprise-web-app',
    name: 'Enterprise Web App',
    detail: null,
    price: { min: 8_000_000, max: 20_000_000, openEnded: true },
  },
]

export const WEB_APP_FEATURES_NOTE =
  'Features include login systems, dashboards, reports, payments, APIs, and role management.'

/* ------------------------------------------------------------------ */
/* Mobile app packages — catalogue Section 5                           */
/* ------------------------------------------------------------------ */

export const MOBILE_APP_PACKAGES = [
  {
    id: 'basic-android',
    name: 'Basic Android App',
    price: { min: 2_000_000, max: 3_500_000 },
  },
  {
    id: 'business-mobile',
    name: 'Business Mobile App',
    price: { min: 4_000_000, max: 7_000_000 },
  },
  {
    id: 'android-ios',
    name: 'Android + iOS App',
    price: { min: 7_000_000, max: 15_000_000, openEnded: true },
  },
]

/* ------------------------------------------------------------------ */
/* Desktop application packages — catalogue Section 6                  */
/* ------------------------------------------------------------------ */

export const DESKTOP_PACKAGES = [
  {
    id: 'pos-inventory',
    name: 'POS / Inventory',
    price: { min: 2_000_000, max: 5_000_000 },
  },
  {
    id: 'school-management',
    name: 'School Management',
    price: { min: 3_000_000, max: 8_000_000 },
  },
  {
    id: 'custom-business-software',
    name: 'Custom Business Software',
    price: { min: 5_000_000, max: 15_000_000, openEnded: true },
  },
]

/* ------------------------------------------------------------------ */
/* Additional services — catalogue Section 7                           */
/* ------------------------------------------------------------------ */

export const ADDITIONAL_SERVICES = [
  {
    id: 'website-maintenance',
    name: 'Website Maintenance',
    price: { min: 100_000, max: 350_000 },
    unit: 'month',
  },
  {
    id: 'professional-email-setup',
    name: 'Professional Email Setup',
    price: { min: 150_000, max: 300_000 },
    unit: null,
  },
  {
    id: 'seo-setup',
    name: 'SEO Setup',
    price: { min: 300_000, max: 800_000 },
    unit: null,
  },
  {
    id: 'domain-registration',
    name: 'Domain Registration',
    price: { min: 45_000, max: 180_000 },
    unit: 'year',
  },
  {
    id: 'hosting-management',
    name: 'Hosting Management',
    price: { min: 250_000, max: 600_000 },
    unit: 'year',
  },
]

/* ------------------------------------------------------------------ */
/* Grouping used by the Services page tabs                             */
/* ------------------------------------------------------------------ */

export const SERVICE_CATEGORIES = [
  {
    id: 'websites',
    label: 'Websites',
    heading: 'Website Packages',
    note: 'Updated Uganda Market Rates',
    type: 'cards',
    items: WEBSITE_PACKAGES,
  },
  {
    id: 'web-apps',
    label: 'Web Apps',
    heading: 'Web Application Packages',
    note: WEB_APP_FEATURES_NOTE,
    type: 'table',
    items: WEB_APP_PACKAGES,
    columnLabel: 'Package',
  },
  {
    id: 'mobile-apps',
    label: 'Mobile Apps',
    heading: 'Mobile App Packages',
    note: null,
    type: 'table',
    items: MOBILE_APP_PACKAGES,
    columnLabel: 'Package',
  },
  {
    id: 'desktop-apps',
    label: 'Desktop Apps',
    heading: 'Desktop Application Packages',
    note: null,
    type: 'table',
    items: DESKTOP_PACKAGES,
    columnLabel: 'Software',
  },
  {
    id: 'additional',
    label: 'Additional',
    heading: 'Additional Services',
    note: null,
    type: 'table',
    items: ADDITIONAL_SERVICES,
    columnLabel: 'Service',
  },
]

/* ------------------------------------------------------------------ */
/* Why choose us — catalogue Section 8 (verbatim)                      */
/* ------------------------------------------------------------------ */

export const WHY_CHOOSE_US = [
  { id: 'experience', text: '5 years of software development experience', icon: 'award' },
  { id: 'design', text: 'Modern, responsive designs', icon: 'design' },
  { id: 'secure', text: 'Secure, Django-based systems', icon: 'shield' },
  { id: 'delivery', text: 'Fast delivery and client support', icon: 'bolt' },
  { id: 'pricing', text: 'Affordable pricing for the Uganda market', icon: 'wallet' },
]

/* ------------------------------------------------------------------ */
/* Contact form — service type dropdown                                */
/* ------------------------------------------------------------------ */

export const SERVICE_TYPE_OPTIONS = [
  'Business / Corporate Website',
  'Web Application (Django / React)',
  'Mobile Application (Android & iOS)',
  'Desktop Application',
  'UI/UX Design',
  'Website Maintenance',
  'Domain & Hosting Setup',
  'Professional Business Emails',
  'SEO & Google Search Optimization',
  'Other',
]

/* ------------------------------------------------------------------ */
/* Tech stack shown on the About page                                  */
/* ------------------------------------------------------------------ */

export const TECH_STACK = [
  { name: 'Django', note: 'Secure backends and admin dashboards' },
  { name: 'React', note: 'Fast, modern front-ends' },
  { name: 'Python', note: 'APIs, automation and integrations' },
  { name: 'PostgreSQL', note: 'Reliable relational data' },
  { name: 'Android & iOS', note: 'Native and cross-platform mobile' },
  { name: 'Tailwind CSS', note: 'Responsive design systems' },
]

/* ------------------------------------------------------------------ */
/* Team — About page                                                   */
/* ------------------------------------------------------------------ */

/**
 * The team grid on the About page — three cards, one row.
 *
 * The three roles are the ones a client actually meets: who scopes the work,
 * who designs it, who builds the part they look at.
 *
 * Names are as the client supplied them — these are real people, so the
 * spellings are transcribed rather than normalised. `Alosious` is not a typo
 * for `Aloysius`.
 *
 * There is deliberately no `photo` field. Headshots are keyed by `id` in
 * `TEAM_PHOTOS` in `components/TeamCard/TeamCard.jsx`, which keeps this file
 * free of bundler-resolved imports — the same split used for the project
 * screenshots — and means the photo exists in exactly one place. A flag here
 * as well would be a second copy of the same fact, free to disagree with it.
 * A member with no entry in that map falls back to the generic placeholder
 * avatar: same circle, same size, so adding the real headshot later shifts
 * nothing on the page.
 *
 * Still owed by the client: a headshot for Kasozi Alosious, as a square crop
 * (PROJECT_BRIEF.md §17). His card runs on the placeholder until it arrives.
 */
export const TEAM = [
  {
    id: 'lead-developer',
    name: 'Kasozi Alosious',
    role: 'Founder & Lead Developer',
    focus:
      'Scopes every project, designs the data model and writes the Django that the rest of the system hangs off.',
  },
  {
    id: 'software-engineer',
    name: 'Mugisha Andrew',
    role: 'Co-Founder & Software Engineer',
    focus:
      'Works across the stack: the React front-end a client sees, the Django behind it, and the integrations that join the two.',
  },
]

/* ------------------------------------------------------------------ */
/* Certifications & accreditation — About page                         */
/* ------------------------------------------------------------------ */

/**
 * Standards the company holds, shown as a badge row on the About page.
 *
 * Not from the 2026 catalogue — the client supplied the badge artwork directly.
 * Each `id` matches a keyed PNG in `src/assets/certifications/`, resolved to an
 * import in `components/Certifications/CertificationStrip.jsx` so this file
 * stays free of bundler-resolved paths.
 *
 * These are claims about accreditation, so nothing here is embellished: the
 * text states only what is printed on the badge itself. Certificate numbers,
 * issuing bodies and expiry dates are deliberately absent rather than guessed —
 * add them once the client sends the certificates.
 */
export const CERTIFICATIONS = [
  {
    id: 'anab-iso-iec-17021',
    name: 'ANAB Accredited',
    standard: 'ISO/IEC 17021-1',
    note: 'Accredited by the ANSI National Accreditation Board as a management systems certification body.',
  },
  {
    id: 'iso-9001-2015',
    name: 'ISO 9001:2015',
    standard: 'Quality management',
    note: 'A documented quality management system behind every delivery, not just the large ones.',
  },
  {
    id: 'iso-14001-2015',
    name: 'ISO 14001:2015',
    standard: 'Environmental management',
    note: 'Environmental management practices covering how the business runs and disposes of equipment.',
  },
  {
    id: 'iso-45001',
    name: 'ISO 45001',
    standard: 'Occupational health & safety',
    note: 'Health and safety management for staff on site and on client premises.',
  },
  {
    id: 'r2-v3-certified',
    name: 'R2v3 Certified',
    standard: 'Responsible recycling',
    note: 'Responsible handling of electronics that reach the end of their working life.',
  },
]
