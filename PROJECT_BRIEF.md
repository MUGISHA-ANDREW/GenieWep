# GenieWep Technologies — Modern Website (React) — Project Brief v2

Refined against the official **GenieWep Technologies Company Profile & Service Catalogue, 2026 Edition** (`Assets/GenieWep_Technologies_Company_Profile_2026.pdf`). All copy, pricing, and service data below are sourced from that document so the site never contradicts the printed catalogue. Update this file first whenever the catalogue changes, then propagate to `src/utils/constants.js`.

---

## 1. Project Overview

Build a modern, scalable, React-based marketing and lead-generation website for **GenieWep Technologies**, a Ugandan software development startup with 5 years of experience serving businesses, schools, NGOs, SACCOs, tourism companies, and startups. The site showcases services and pricing, displays a real portfolio, and converts visitors into inquiries via a contact form and WhatsApp.

## 2. Client Information

| Field | Value |
|---|---|
| Company | GenieWep Technologies |
| Location | Kampala, Uganda |
| Website | geniewep.com |
| WhatsApp | +256 767 267 209 |
| Email | geniewep@gmail.com |
| Facebook | https://www.facebook.com/profile.php?id=61594174394851 |
| Instagram | https://www.instagram.com/geniewep/ |
| X | https://x.com/GenieWep |
| TikTok | https://www.tiktok.com/@geniewep |
| Experience | 5 years of software development |
| Markets served | Businesses, Schools, NGOs, SACCOs, Tourism companies, Startups |

**Mission:** To empower organizations through affordable, innovative, and reliable software solutions.

**Vision:** To become one of Uganda's leading software technology companies providing world-class digital products across Africa.

## 3. Core Services (verbatim from catalogue, Section 1)

- Business Websites
- Corporate Websites
- Web Applications (Django / React)
- Mobile Applications (Android & iOS)
- Desktop Applications
- UI/UX Design
- Website Maintenance
- Domain & Hosting Setup
- Professional Business Emails
- SEO & Google Search Optimization

> Note for the dev team: GenieWep's own backend stack is Django. If a backend is built for this site (contact form persistence, admin, etc.), prefer **Django REST Framework** for the API — it reinforces the "Secure, Django-based systems" claim used in their own marketing (Section 8) rather than contradicting it with an unrelated stack.

## 4. Portfolio — Completed Projects (Section 2)

| Project | URL | Industry |
|---|---|---|
| GVM Company | gvmcompany.com | Agriculture & Development |
| SCAVAL | scaval.com | Agricultural Commodities |
| Nkuruba Community Tours | nkurubatours.com | Tourism |
| Small Beginnings Uganda | — | NGO / Education |

Use these as live outbound links where a public site exists (GVM, SCAVAL, Nkuruba). Small Beginnings Uganda has no listed URL — use a screenshot/case-study card instead of a link, or confirm a URL with the client before linking.

## 5. Pricing — Single Source of Truth

All prices are in **UGX** and must be centralized in `src/utils/constants.js` (or a `pricing.json`) rather than hard-coded per component, so a catalogue update only requires one edit. Format all UGX values with a locale-aware formatter (see §9).

### 5.1 Website Packages (Section 3) — "Updated Uganda Market Rates"

**Starter — UGX 800,000** — *Best for small businesses*
- Up to 5 pages · Mobile responsive design · Contact form · WhatsApp integration · Google Maps · Basic SEO · Free SSL setup
- Client pays separately: Domain UGX 45,000–70,000/year · Hosting UGX 250,000/year

**Business — UGX 1,500,000** — *Best for growing companies (includes everything in Starter, plus:)*
- Up to 12 pages · Blog/News section · Email notifications · Photo gallery · Professional email setup (info@company.com) · Speed optimization · Social media integration

**Executive — UGX 2,800,000 – 4,000,000** — *Best for NGOs, tourism companies and corporate organizations*
- Unlimited pages · Dynamic blog · Admin dashboard for content updates · Multiple contact forms · Up to 5 professional emails · Advanced SEO · Security optimization · Training after delivery

### 5.2 Web Application Packages (Section 4)

| Package | Price (UGX) |
|---|---|
| Basic Web App (Bookings, School Portal, Inventory) | 2M – 4M |
| Business Web App (SACCO, CRM, HR, POS) | 4M – 8M |
| Enterprise Web App | 8M – 20M+ |

Features: login systems, dashboards, reports, payments, APIs, role management.

### 5.3 Mobile App Packages (Section 5)

| Package | Price (UGX) |
|---|---|
| Basic Android App | 2M – 3.5M |
| Business Mobile App | 4M – 7M |
| Android + iOS App | 7M – 15M+ |

### 5.4 Desktop Application Packages (Section 6)

| Software | Price (UGX) |
|---|---|
| POS / Inventory | 2M – 5M |
| School Management | 3M – 8M |
| Custom Business Software | 5M – 15M+ |

### 5.5 Additional Services (Section 7)

| Service | Price (UGX) |
|---|---|
| Website Maintenance | 100K – 350K / month |
| Professional Email Setup | 150K – 300K |
| SEO Setup | 300K – 800K |
| Domain Registration | 45K – 180K / year |
| Hosting Management | 250K – 600K / year |

## 6. Why Choose GenieWep (Section 8, use verbatim as trust signals)

- 5 years of software development experience
- Modern, responsive designs
- Secure, Django-based systems
- Fast delivery and client support
- Affordable pricing for the Uganda market

---

## 7. Technology Stack

> **Status: implemented.** Versions below are what actually shipped. Where they
> differ from the original plan, the reason is given.

| Concern | Planned | Shipped | Note |
|---|---|---|---|
| Framework | React 18+ | **React 19.2** | Satisfies "18+". Enables native `<title>`/`<meta>` hoisting. |
| Build tool | Vite or CRA | **Vite 8** (Rolldown) | Rolldown requires `manualChunks` as a function; the manual chunk map was dropped in favour of its default strategy. |
| Styling | Tailwind CSS | **Tailwind 4** | CSS-first config. There is no `tailwind.config.js`; tokens live in `src/styles/theme.css` under `@theme`. |
| Routing | React Router v6 | **React Router 7** | APIs used here are unchanged from v6. |
| Forms | React Hook Form + Zod | **RHF 7 + Zod 4** | As planned. |
| API | Axios or Fetch | **Fetch** | No extra dependency; timeout via `AbortController`. |
| Icons | React Icons / Heroicons | **React Icons** | Feather set, plus Font Awesome for the WhatsApp glyph. |
| Animation | Framer Motion | **Framer Motion 13** | As planned. |
| Testing | Jest + RTL | **Vitest + RTL** | Vitest shares the Vite config, so the `@` alias and JSX transform work without a second toolchain. Same API as Jest. |
| Page metadata | (not specified) | **React 19 native** | `react-helmet` would now be redundant weight. |
| Hosting | Vercel / Netlify / Amplify | **Config for Vercel + Netlify** | `vercel.json` and `public/_redirects` both ship. |
| Backend | Django REST Framework | **Not built** | Contact endpoint is env-driven; see §14 and the README. |

## 8. Existing Brand Assets (already in `Assets/`)

The repo already has real brand media — use these before sourcing stock imagery:

| File | Status |
|---|---|
| `logo2.jpeg` | **Source only.** Kept as the origin of `src/assets/images/logo-mark.png` and of the site palette; nothing renders the JPEG itself any more. |
| `logo-mark.png` (generated) | **In use.** Header logo and favicon. The monogram keyed off the mockup's slate wall onto transparency, 247×256, plus a square 192×192 copy at `public/logo-mark.png` for the favicon and iOS icon. |
| `logo.jpeg` | Not used. Full lockup on a slate ground; the header renders its own wordmark beside the monogram. |
| `src/assets/certifications/*.png` (generated) | **In use.** The five accreditation badges, cut out of the client-supplied strip and keyed off its flat olive ground. See §8.1. |
| `img.jpeg` | **In use.** Hero poster, About page image, and the social share card. |
| `image.jpeg` | **Do not use.** Same render as `img.jpeg` but the wall tagline reads "INNOVATION THROUGH CODE SINCE [current year]" — an unreplaced placeholder that would be visible to prospects. |
| `video.mp4` | **In use** as the hero background loop, at full opacity. The scrim over it is a left-weighted gradient, heavy under the text and clear on the right where the wordmark animation plays. Contrast figures and how to re-check them are in the comment on that element in `pages/Home.jsx` — do it if the video is re-cut. |
| `img1.mp4`, `video1.mp4`, `video2.mp4`, `video3.mp4` | Not used. Available for a showreel or project media. |

Action items:
- Regenerate or retire `image.jpeg` — it carries a visible placeholder-text defect.
- Get a vector (SVG) version of the logo. `logo-mark.png` closed the transparency gap, but it is still a raster cut out of a mockup render.
- Compress the hero video for web (H.264 MP4 + WebM, muted/autoplay-safe).

### 8.1 Certifications — content still owed

The five badges on the About page (ANAB / ISO/IEC 17021-1, ISO 9001:2015,
ISO 14001:2015, ISO 45001, R2v3) came from a client-supplied image, not from the
2026 catalogue, which does not mention certification anywhere.

Two things to confirm with the client before this page goes live, because these
are verifiable public claims about accreditation:

1. **That the company holds them, in its own name.** Badge artwork is easy to
   come by; the certificates are not. Ask for the certificate PDFs.
2. **That the ANAB mark belongs here at all.** It reads "ACCREDITED —
   MANAGEMENT SYSTEMS CERTIFICATION BODY", which is the mark of a body that
   *certifies other organizations* against ISO standards, not of a company that
   holds a certification. Likewise R2v3 covers electronics refurbishment and
   recycling, which is not a service in §3.

`CERTIFICATIONS` in `constants.js` deliberately carries no certificate numbers,
issuing bodies or expiry dates. Add them from the certificates once they arrive
— they are the detail that makes the row checkable rather than decorative. If a
claim cannot be substantiated, delete its entry: the strip renders whatever the
array holds, down to none.

## 9. UGX Currency Formatting

Implement a single formatter in `src/utils/formatters.js`, e.g.:

```js
export const formatUGX = (amount) =>
  new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0,
  }).format(amount);
```

For ranges (e.g. "2M – 4M", "UGX 2,800,000 – 4,000,000"), store `min`/`max` numeric fields in the pricing data and render `${formatUGX(min)} – ${formatUGX(max)}` rather than hand-typed strings, so formatting stays consistent everywhere the range appears.

## 10. Folder Structure

> **Status: implemented.** This is the structure as built.

```
src/
├── components/
│   ├── Header.jsx, Footer.jsx, Logo.jsx
│   ├── Navigation/Nav.jsx       # shared by desktop bar and mobile drawer
│   ├── Button/, Card/
│   ├── ServiceCard/, ProjectCard/
│   ├── PricingTable/
│   │   ├── PricingCard.jsx      # website tiers with feature lists
│   │   └── PricingTable.jsx     # the §5.2–5.5 rate tables
│   ├── Form/
│   │   ├── ContactForm.jsx
│   │   └── ContactForm.test.jsx
│   ├── Modal/Modal.jsx
│   ├── Icon.jsx, Section.jsx, Seo.jsx
│   ├── ScrollToTop.jsx, PageLoader.jsx
│   └── ErrorBoundary.jsx, WhatsAppFloat.jsx
│
├── pages/                       # Home, About, Services, Projects, Contact, NotFound
├── hooks/                       # useFetch, useLocalStorage, useWindowScroll, useScrollLock
├── utils/                       # constants, formatters, validation, api, iconMap (+ tests)
├── styles/
│   ├── theme.css                # @theme design tokens
│   └── globals.css              # base layer and shared component classes
├── assets/images/, assets/videos/
├── test/                        # setup.js, routes.test.jsx
├── App.jsx, main.jsx, index.css
```

Four planned files were deliberately not created:

- **`tailwind.config.js` and `variables.css`** — Tailwind 4 configures in CSS. Both collapse into `styles/theme.css`.
- **`NavStyles.css` and `FormStyles.css`** — Tailwind utilities cover both components. Empty companion stylesheets would be dead files.
- **`hooks/useForm.js`** — react-hook-form supplies this. A hand-rolled duplicate would be dead code. `useScrollLock` was added instead, which the nav and modal both genuinely need.
- **`assets/logo.svg`** — the client supplied raster logos only. `logo.jpeg` is in use; swap when a vector arrives.

## 11. Key Pages & Components

### Home
- Hero section (tagline + CTA; candidate hero video from §8) with mission/vision framing
- Featured services overview (from the 10-item list in §3)
- Recent projects showcase (4 real projects from §4)
- "Why Choose GenieWep" trust section (verbatim list, §6)
- Pricing preview (starting price per category, linking to full Services page)
- Contact CTA

### Services
- Full pricing tables for Website, Web App, Mobile App, Desktop App, and Additional Services (§5), rendered from `constants.js` via the `PricingTable` component
- Tabs or accordion by category
- Clear "Best for..." framing per tier, as in the catalogue

### Projects / Portfolio
- Grid of the 4 real projects (§4) with thumbnail, name, industry tag, description, outbound link where available
- Optional filter by industry (Agriculture, Tourism, NGO/Education)

### About
- Mission & vision (verbatim, §2)
- 5-year experience highlight, markets served (businesses, schools, NGOs, SACCOs, tourism, startups)
- **Team** (`#team`) — two cards in one centred row, driven by `TEAM` in `constants.js`: circular portrait, name, job title, then what the person does. A member with no headshot in `TEAM_PHOTOS` falls back to `placeholder-avatar.png`, the same circle at the same size, so a real photo can be dropped in without touching the markup. A member with no `name` leads with the role instead. See §17.
- **Certifications** — the accreditation badge row, driven by `CERTIFICATIONS`. Drawn on `.band-light`, which stays light in dark mode because third-party marks arrive with their colours fixed. See §8.1 for what still needs confirming.
- Why Choose GenieWep (§6)
- Tech stack overview (Django/React, matching their real delivery stack)

### Contact
- Form fields: Name, Email, Phone, Service Type (dropdown sourced from §3/§5 categories), Message
- Zod validation, success/error states
- Direct WhatsApp link: `https://wa.me/256767267209`
- `mailto:geniewep@gmail.com`

### Blog (optional)
- Deferred unless the client wants case studies; not present in the source catalogue

---

## 12. Core Features

- Responsive, mobile-first design
- Fast load times (Lighthouse 90+)
- SEO meta tags + Open Graph tags
- Validated contact form wired to an email service — see §12.1
- WhatsApp deep link (`wa.me/256767267209`)
- Smooth transitions (Framer Motion)
- Mobile hamburger nav
- Pricing tables driven by `constants.js`, not hard-coded JSX
- Portfolio showcase using real client projects (§4)
- Lazy-loaded images/video, code-split routes
- **Dark mode — implemented.** Light/dark toggle in the header, defaulting to the visitor's OS setting until they choose. Built on semantic colour tokens rather than `dark:` variants; see the Theming section of the README.

### 12.1 Contact form delivery — how "Send message" reaches the inbox

Pressing **Send message** POSTs the enquiry to this site's own
`/api/send-enquiry`, a Vercel Serverless Function, which hands it to **Resend**
for delivery to `geniewep@gmail.com`. On success the visitor sees **"Message
delivered — we will get back to you shortly"**. Nothing else happens: no second
tab, no app switch.

| Piece | File |
|---|---|
| Browser: POSTs the enquiry, reports the outcome | `src/utils/email.js` |
| Browser: the form and its result panel | `src/components/Form/ContactForm.jsx` |
| Server: the HTTP route | `api/send-enquiry.js` |
| Server: validation, the Resend call, the email body | `api/_enquiry.js` |
| Local dev: runs the route inside `vite dev` | `vite.config.js` |

**Why a serverless function, when Web3Forms needed none.** A Web3Forms access
key is public by design — it only ever delivers to the one address it was
registered against, so shipping it in the bundle costs nothing. A Resend API
key is the opposite: it can send mail as the entire verified domain. In the
browser it would let anyone send mail as geniewep.com. So it stays on the
server, the browser only ever talks to our own origin, and the front end knows
nothing about Resend at all. `api/enquiry.test.js` and `src/utils/email.test.js`
both assert this — one that the key goes in the `Authorization` header server
side, the other that the browser request carries no key and never addresses
`resend.com`.

**Setup — one signup, and note that two of the three steps are easy to miss:**

1. Create a key at https://resend.com/api-keys (Sending access is enough).
2. **Verify `geniewep.com` at https://resend.com/domains** and set `RESEND_FROM`
   to an address on it, e.g. `GenieWep Website <website@geniewep.com>`. This is
   the step that decides whether real enquiries arrive. Until the domain is
   verified the code falls back to Resend's shared `onboarding@resend.dev`
   sender, which **only delivers to the email address that owns the Resend
   account** — fine for one smoke test, useless in production.
3. Local: copy `.env.example` to `.env.local` and fill in `RESEND_API_KEY`.
   Vercel: add `RESEND_API_KEY` (and `RESEND_FROM`) under Settings →
   Environment Variables for Production and Preview.

Unlike the `VITE_*` vars, these are read at request time rather than inlined at
build time, so changing them does **not** need a rebuild — but the function
does need to have been deployed at least once.

Then submit the live form and confirm the mail arrives. Resend's free tier
covers 3,000 emails a month, far above what this site will produce.

**The form never claims a delivery that did not happen.** Every failure lands
in the same place — "That did not send… nobody has seen it yet" — with WhatsApp
offered as the recovery path and everything the visitor typed preserved:

| What went wrong | Server | Logged |
|---|---|---|
| `RESEND_API_KEY` not set | 503 | `RESEND_API_KEY is not set — nothing was sent.` |
| Resend rejected it (unverified sender, bad key) | 502 | the reason Resend gave |
| Malformed or missing fields | 400 | — |
| Honeypot filled in | 200, nothing sent | — |

The honeypot answers success on purpose: a bot told it was filtered comes back
with the field left blank, and nothing was sent either way.

The server re-validates everything the browser already checked with Zod. That
check is worth nothing here — the endpoint is a public URL and anything can
POST to it. The message is also HTML-escaped before it goes into the email
body, since it is attacker-controlled text landing in someone's mail client.


## 13. Design Considerations

- **Colour scheme — "Azure & Aqua", implemented.** A light-blue brand: azure is the primary hue, sampled from the faceted G monogram in `Assets/logo2.jpeg`, and aqua is its neighbour on the wheel, used only for the gradient that runs through the accent rules and the dark bands. Neutrals are tinted toward the same blue rather than left grey, and the dark bands are ocean blue rather than slate. This supersedes both the earlier "Steel & Sapphire" slate direction and the navy/cyan one taken from the PDF cover. One warm amber note is reserved for the "Most popular" pricing badge; WhatsApp keeps its own green wherever it appears.
- **Typography — figmaSans, then the platform UI face.** `--font-sans` in `styles/theme.css` is `figmaSans, "figmaSans Fallback", "SF Pro Display", system-ui, helvetica, sans-serif`, at the client's request. This supersedes the earlier Inter direction, and the Google Fonts `<link>` has been removed from `index.html` along with it: figmaSans is not a hosted webfont, so nothing is downloaded for it and the stack resolves to it only where it is installed locally. Everyone else gets `system-ui` — Segoe UI on Windows, Roboto on Android, SF on Apple. The upside is a first paint with zero font requests and no FOUT; the trade-off is that the site's letterforms now vary by platform. Reinstating a hosted webfont means adding it back to both files.
- **Motion — one vocabulary, one set of numbers.** Scroll entrances go through `components/Reveal.jsx` (`Reveal`, `Stagger`, `StaggerItem`): 28px of travel, `--ease-brand`, `-60px` viewport margin, once per element. Looping ambient movement (`animate-drift`, `animate-halo`, `animate-pan`) is CSS, defined as `--animate-*` tokens in `theme.css`. Active-state indicators that move between siblings use a shared `layoutId`. Every one of these is silenced by `prefers-reduced-motion` — via the CSS block in `globals.css`, `MotionConfig reducedMotion="user"` in `App.jsx`, and `useReducedMotion()` inside the motion components.
- **Spacing:** 8px grid
- **Imagery:** Use real assets from §8 first; supplement with tech-stack icons for service cards
- **Accessibility:** WCAG 2.1 AA, semantic HTML
- **Loading/error states:** Explicit feedback on form submit and any API calls

## 14. API Integration (if backend is built)

- `POST /api/contact` — submit contact form (name, email, phone, service type, message)
- `GET /api/services` — service catalogue (mirrors §3/§5, but source of truth stays in `constants.js` on the frontend unless a CMS is introduced)
- `GET /api/projects` — portfolio projects (§4)
- `POST /api/newsletter` — optional

## 15. Performance Requirements

- Lighthouse: Performance 90+, Accessibility 95+, Best Practices 90+, SEO 100
- Page load < 3s on 4G
- WebP images with fallbacks; compressed/transcoded video (see §8)
- Route-level code splitting
- CDN for static assets

## 16. Success Criteria

Verified in the build:

- [x] All pages responsive (mobile-first Tailwind; tables scroll in their own container)
- [x] All five pricing tables (§5) match the catalogue exactly, sourced from `constants.js` — locked by `constants.test.js`
- [x] Portfolio shows all 4 real projects with correct industries and links, each with a home-page screenshot above its description (Small Beginnings Uganda excepted — no public URL to capture)
- [x] SEO meta tags, Open Graph, canonical URLs, JSON-LD structured data, sitemap, robots.txt
- [x] Accessibility: semantic landmarks, skip link, visible focus rings, labelled form fields, `aria-live` regions, reduced-motion support
- [x] WhatsApp deep links present site-wide — footer, floating button, pricing cards, form fallback. Deliberately not in the header, so the nav carries one primary action.
- [x] Form validation robust — 14 tests covering every rule, the WhatsApp hand-over, blocked popups and each email-delivery outcome
- [x] Route-level code splitting; all 49 tests pass; lint clean
- [x] Light/dark theme toggle, persisted, with no flash of the wrong theme on load
- [x] Social profiles (Facebook, Instagram, X, TikTok) in the footer and in the JSON-LD `sameAs`, pinned by `constants.test.js`

Needs a deployed URL or client input to close:

- [ ] Contact form email delivery — built and tested end to end, but needs a Resend API key in `RESEND_API_KEY` and `geniewep.com` verified at https://resend.com/domains. Until then the form reports that the message was not delivered and offers WhatsApp. See §12.1.

- [ ] Load time < 3s on 4G — measure against the deployed site
- [ ] Lighthouse 90+ — measure against the deployed site
- [ ] Cross-browser pass (Chrome, Firefox, Safari, Edge)
- [ ] Analytics integrated — `VITE_GA_MEASUREMENT_ID` is stubbed in `.env.example`, not yet wired
- [ ] Real project screenshots replacing the placeholder tiles

## 17. Development Timeline

| Phase | Duration | Deliverables |
|---|---|---|
| Setup & Planning | 2–3 days | Project scaffold, `constants.js` pricing data entry, design system |
| Component Development | 5–7 days | Reusable components incl. `PricingTable`, layouts, styling |
| Page Development | 5–7 days | Home, Services, Projects, About, Contact |
| Integration & Testing | 3–4 days | Form + WhatsApp integration, responsiveness, cross-browser |
| Optimization & Deployment | 2–3 days | Performance, SEO, asset compression (§8), deployment |
| **Total** | **17–24 days** | **Production-ready website** |

## 18. Deployment Checklist

- [ ] **`RESEND_API_KEY` set on Vercel — this is what makes the contact form send.** See §12.1.
- [ ] **`geniewep.com` verified in Resend and `RESEND_FROM` set to an address on it.** Without this the default sender only delivers to the Resend account owner, so real enquiries never arrive.
- [ ] Environment variables configured (see `.env.example`)
- [ ] Domain DNS pointed to geniewep.com
- [ ] SSL certificate installed
- [ ] Analytics tracking implemented
- [ ] Sitemap + robots.txt
- [ ] All forms tested end-to-end
- [ ] Video/image assets compressed (§8)
- [ ] Pricing data double-checked against the source PDF before go-live

---

## Changes from the original brief

For traceability, this refinement:
1. Replaced generic service descriptions with the exact 10-item service list and mission/vision text from the catalogue.
2. Added full UGX pricing for all five package families (website, web app, mobile, desktop, additional services) — the original brief had no pricing data at all.
3. Added real portfolio data (project names, URLs, industries) in place of placeholder project names.
4. Added a `PricingTable` component and a `constants.js`/formatter-driven approach so pricing lives in one place and stays consistent with the catalogue.
5. Added §8 inventorying the brand assets already sitting in `Assets/` (logo, images, 5 videos) so the build doesn't source stock media unnecessarily.
6. Noted the Django/React stack mismatch: GenieWep markets itself as "Secure, Django-based systems," so any backend built for this site should be Django REST Framework, not an unrelated stack.
7. Removed the invented "Team member profiles" / generic testimonial claims not present in the catalogue — no testimonials or team bios exist in the source document, so treat those as backlog items requiring new content from the client, not launch-blocking features.
8. Added the About-page team section at the client's request (§11). Now two cards, confirmed by the client: Kasozi Alosious (Founder & Lead Developer) and Mugisha Andrew (Co-Founder & Software Engineer). Mugisha Andrew's headshot is cropped to a 512px square at `src/assets/team/mugisha-andrew.jpg`; Kasozi Alosious runs on the generic placeholder avatar. **Still owed: a headshot for Kasozi Alosious.** Adding it is one line in `TEAM_PHOTOS` — same circle at the same size, so nothing else moves.
9. Added the certification badge row at the client's request, from artwork the client supplied directly rather than from the catalogue. **Not yet substantiated — see §8.1 before launch.**
10. Replaced the Inter webfont with the client's figmaSans stack (§13) and cut the Google Fonts request.
