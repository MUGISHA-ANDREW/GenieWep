# GenieWep Technologies — Website

Marketing and lead-generation site for [GenieWep Technologies](https://geniewep.com), a Ugandan software development company. Built with React and Vite.

All service, pricing and portfolio content comes from the **Company Profile & Service Catalogue, 2026 Edition** (`Assets/GenieWep_Technologies_Company_Profile_2026.pdf`). The brief that drove this build is in [PROJECT_BRIEF.md](PROJECT_BRIEF.md).

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint with oxlint |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Tests in watch mode |
| `npm run test:coverage` | Tests with a coverage report |

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 (Rolldown) |
| Styling | Tailwind CSS 4 (CSS-first config) |
| Routing | React Router 7 |
| Forms | React Hook Form + Zod 4 |
| Animation | Framer Motion |
| Icons | React Icons (Feather + Font Awesome) |
| Testing | Vitest + React Testing Library |

Three versions landed ahead of the brief and are worth knowing about:

- **Tailwind 4** replaces `tailwind.config.js` with CSS-first config. Design tokens live in [`src/styles/theme.css`](src/styles/theme.css) inside an `@theme` block, not a JS config file.
- **React Router 7** is installed rather than v6. The APIs used here are unchanged.
- **React 19** hoists `<title>` and `<meta>` natively, so [`src/components/Seo.jsx`](src/components/Seo.jsx) handles per-page metadata with no `react-helmet` dependency.

---

## Theming

The site ships a light and a dark theme, switched by the toggle in the header.

Colour is defined in two layers in [`src/styles/theme.css`](src/styles/theme.css):

- **Fixed brand ramps** (`steel-*`, `accent-*`, `aqua-*`, `surface-*`, `whatsapp`) are absolute. A dark page band stays dark in light mode by design, so these never change.
- **Semantic roles** (`canvas`, `card`, `title`, `body`, `line`, `link`, `band`, `solid`) are plain CSS variables exposed through `@theme inline`. Swapping `data-theme` on the root element re-colours the entire site. There is not a single `dark:` variant anywhere in the components.

Write `bg-card` and `text-body`, not `bg-white` and `text-ink-700`. A hard-coded light value is the one thing that will break dark mode.

Three roles exist purely to prevent dark-on-dark: `band` for the pricing card header, `solid` for the secondary button fill, and `link`, which steps lighter in dark mode because `accent-600` is unreadable on a dark card.

The palette is **"Azure & Aqua"**: azure (`accent-*`) is the light-blue brand hue and the only interactive colour; aqua (`aqua-*`) is its neighbour on the wheel and appears only as the far end of the brand gradient, never as something clickable. Every neutral is tinted toward the same blue instead of being left grey. Two exceptions are deliberate and documented in `theme.css`: `highlight-400` (amber) for the "Most popular" pricing badge, and `whatsapp` / `whatsapp-dark`, which are WhatsApp's own brand green and belong to WhatsApp rather than to us.

Three shared classes in [`src/styles/globals.css`](src/styles/globals.css) carry the look: `.band-dark` (the gradient dark band behind page heroes and closing CTAs), `.accent-rule` (the azure-to-aqua rule above section headings) and `.text-brand-gradient` (one or two headline words, no more).

Theme state lives in [`src/context/ThemeProvider.jsx`](src/context/ThemeProvider.jsx). A visitor with no stored preference follows their operating system and keeps following it. Once they click the toggle, their choice persists in localStorage. An inline script in `index.html` applies the theme before first paint, so dark-mode visitors never see a flash of white.

## Motion

Framer Motion animates from JavaScript, so the `prefers-reduced-motion` media query in `globals.css` cannot stop it. `MotionConfig reducedMotion="user"` in [`src/App.jsx`](src/App.jsx) handles that globally: visitors who ask for reduced motion get the final state with no movement.

## Where the content lives

**[`src/utils/constants.js`](src/utils/constants.js) is the single source of truth.** Every price, service name, project and contact detail is defined there once. No component hard-codes a price.

To change a price, edit that file and the matching assertion in [`src/utils/constants.test.js`](src/utils/constants.test.js). The test suite deliberately fails when catalogue data changes, so a price never drifts silently.

Money is stored as plain numbers (`{ min: 800000 }`) and rendered through [`src/utils/formatters.js`](src/utils/formatters.js). That module owns every UGX string on the site, including ranges like `UGX 2,800,000 – 4,000,000` and the compact table form `8M – 20M+`.

---

## Project structure

```
src/
├── components/
│   ├── Button/, Card/, ServiceCard/, ProjectCard/
│   ├── PricingTable/       PricingCard (tiers) + PricingTable (rate tables)
│   ├── Form/               ContactForm + its tests
│   ├── Navigation/         Nav links, shared by desktop bar and mobile drawer
│   ├── Modal/
│   ├── Header.jsx, Footer.jsx, Logo.jsx, Icon.jsx, Section.jsx
│   ├── Seo.jsx, ScrollToTop.jsx, PageLoader.jsx
│   ├── ErrorBoundary.jsx, WhatsAppFloat.jsx
│
├── pages/                  Home, About, Services, Projects, Contact, NotFound
├── hooks/                  useFetch, useLocalStorage, useWindowScroll, useScrollLock
├── utils/                  constants, formatters, validation, api, iconMap
├── styles/                 theme.css (design tokens), globals.css (base layer)
├── assets/                 images and video imported by components
└── test/                   setup + route smoke tests
```

The `@` alias points at `src/`, so imports read `@/utils/constants`.

---

## Contact form

Submitting does two things, in this order:

1. **Opens WhatsApp** with the enquiry pre-filled, so the visitor can start a conversation immediately.
2. **Emails the enquiry to the company inbox** through Web3Forms, so it arrives whether or not they finish the WhatsApp step.

**Step 2 needs a key.** Get a free access key at [web3forms.com](https://web3forms.com/#start) — enter the inbox enquiries should land in and the key is emailed to you — then set `VITE_WEB3FORMS_KEY` in `.env.local` (and in the host's environment variables for production). Until that is set, the form falls back to WhatsApp only and never claims an email was delivered.

The key is public by design. It is compiled into the bundle and anyone can read it, which is fine: it only ever delivers to the address it was registered with, so a scraper can spam that inbox but cannot read anything or redirect submissions.

Four details are load-bearing:

- **The order matters.** `window.open` runs before any `await`. A popup is only permitted while the click's user gesture is live, and awaiting the POST first would spend it — WhatsApp would be blocked on every submission. Keep any future network call after the open.
- **`window.open` takes no `noopener` in the features string.** Passing it makes browsers return `null` even on success, which would make every successful hand-over look blocked. The code opens plainly, then sets `tab.opener = null`.
- **"Message sent" appears only when the POST succeeded.** Every other outcome names the step still outstanding, because claiming delivery is a lie the company only discovers when an enquiry never arrives.
- **Failures keep the typed values.** A blocked popup or a failed POST returns the visitor to a form that still has their text.

`buildEnquiryMessage` in `src/utils/constants.js` is the WhatsApp wire format; `sendEnquiryEmail` in `src/utils/email.js` is the email one. The form also carries a honeypot field — bots that fill it fail validation client-side and nothing is sent or opened.


---

## Testing

49 tests across 4 files:

| File | Covers |
|---|---|
| `src/utils/formatters.test.js` | UGX formatting, ranges, compact notation |
| `src/utils/constants.test.js` | Every catalogue price and project, against the PDF |
| `src/test/routes.test.jsx` | All six routes render; tabs, filters and the theme toggle work |
| `src/components/Form/ContactForm.test.jsx` | Validation rules, the WhatsApp hand-over, blocked popups, and each email-delivery outcome |
| `src/utils/email.test.js` | The Web3Forms request shape, and that `success: false` on HTTP 200 counts as a failure |

---

## Deployment

The build output in `dist/` is a static SPA. Rewrite rules for deep links ship for both hosts: `public/_redirects` for Netlify, `vercel.json` for Vercel. The Vercel config also sets security headers and long-lived caching for hashed assets.

**Before going live:**

- [ ] Set `VITE_WEB3FORMS_KEY` in the host's environment and confirm a test enquiry reaches geniewep@gmail.com
- [ ] Point DNS at the host and confirm SSL
- [ ] Replace `public/og-image.jpg` with a purpose-made 1200x630 social card
- [ ] Add `VITE_GA_MEASUREMENT_ID` and wire up analytics
- [ ] Compress `src/assets/videos/hero.mp4` and add a WebM source
- [ ] Swap the raster logo for an SVG once the client supplies one
- [ ] Replace the placeholder project tiles with real screenshots

---

## Known gaps

These are content decisions for the client, not bugs:

- **Small Beginnings Uganda has no screenshot.** With no public URL there is nothing to capture, so its card keeps the lettered placeholder tile. The other three carry real home-page captures in `src/assets/projects/`, which go stale if a client redesigns.
- **Small Beginnings Uganda has no URL.** The catalogue lists no domain, so its card does not link anywhere. Confirm the URL before adding one.
- **No testimonials or team bios.** Neither exists in the source catalogue. Both need new content from the client before they can ship.
- **Logo is a JPEG.** `logo2.jpeg` is used for the header and favicon, cropped square to the monogram. A transparent SVG would render better at small sizes and would let the crop classes go.
- **One supplied asset is defective.** `Assets/image.jpeg` shows the wall tagline "INNOVATION THROUGH CODE SINCE [current year]", an unreplaced placeholder. It is not used anywhere. `Assets/img.jpeg` is the clean version of the same render and is used for the hero and the social share card. Regenerate or retire the defective file.
#   G e n i e W e p  
 