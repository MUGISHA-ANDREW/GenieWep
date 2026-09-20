/**
 * Terms & Conditions, Privacy Policy and Cookie Policy.
 *
 * Kept as data, not three near-identical JSX pages, so the wording is edited
 * in one file and the three routes stay typographically identical.
 *
 * ── Read this before publishing ──────────────────────────────────────────────
 * These are drafted specifically against what this site actually does — the
 * contact form posts to `/api/send-enquiry`, Resend delivers it to
 * geniewep@gmail.com, the theme choice sits in localStorage, and nothing else
 * is collected. Every factual statement below is true of the code as it stands
 * and was written by reading it, not copied from a generic template.
 *
 * They are still not legal advice, and two things are deliberately absent
 * because only the client can supply them:
 *
 *   1. **Company registration details.** No registration number, registered
 *      office or trading name is claimed, because inventing one on a legal
 *      page is worse than omitting it.
 *   2. **Project contract terms** — deposits, milestones, refunds, who owns
 *      the source code on delivery, warranty periods. These belong in the
 *      signed proposal, not in website terms, and guessing at them would
 *      create commitments the client never agreed to. §"Quotes and pricing"
 *      says exactly that instead.
 *
 * Have a Ugandan lawyer review before go-live, and see PROJECT_BRIEF.md §19.
 *
 * ── Keeping them true ────────────────────────────────────────────────────────
 * The cookie policy states that the site sets no tracking cookies. That is
 * currently accurate: there is no analytics code anywhere in `src/`. Wiring up
 * `VITE_GA_MEASUREMENT_ID` would make it false and would require a consent
 * banner, so update this file in the same commit.
 */

import { CONTACT } from './constants'

/**
 * Shown as "Last updated" on each document. Bump it whenever the wording
 * changes — a policy with a stale date is a policy nobody trusts.
 */
export const LEGAL_UPDATED = '20 September 2026'

export const LEGAL_DOCUMENTS = {
  terms: {
    slug: '/terms',
    navLabel: 'Terms & Conditions',
    title: 'Terms & Conditions',
    description:
      'The terms on which GenieWep Technologies makes this website available, and how they relate to quotes and project agreements.',
    intro: `These terms cover your use of ${CONTACT.website}. They are not the agreement for a software project — that is the signed proposal for your specific work, and where the two differ, the proposal wins.`,
    sections: [
      {
        heading: 'Who we are',
        body: [
          'GenieWep Technologies is a software development company based in Kampala, Uganda. We design and build websites, web applications, mobile applications and desktop software.',
          `You can reach us at ${CONTACT.email} or on ${CONTACT.phoneDisplay}.`,
        ],
      },
      {
        heading: 'Using this website',
        body: [
          'You may read this site, and download or print pages from it, for your own use or to share with colleagues while considering whether to work with us.',
          'You may not copy the text, images, layout or code of this site to build or market a competing service, present our work as your own, or attempt to gain unauthorised access to any part of the site or the systems behind it.',
        ],
      },
      {
        heading: 'Quotes and pricing',
        body: [
          'Prices shown on the Services page are our published rates in Ugandan Shillings at the time of writing. They tell you what a piece of work typically costs. They are not a quotation, and they are not an offer we are bound to.',
          'A binding price comes from a written quotation for your specific scope, and holds for the period stated on it. Where a range is shown, the final figure depends on scope, integrations and how much content and design work we are asked to do.',
          'Everything about how a project actually runs — payment schedule, milestones, revisions, who owns the source code on delivery, what happens if either side stops — lives in that written proposal and not on this page.',
        ],
      },
      {
        heading: 'Our portfolio',
        body: [
          'The projects shown on this site were built by us for the clients named. Those clients own their own brands, content and trade marks; we show the work to demonstrate ours.',
          'Screenshots are point-in-time captures. A client may have redesigned their site since, so what you see here may not match what is live today.',
        ],
      },
      {
        heading: 'Accuracy and availability',
        body: [
          'We keep this site accurate and current as best we can, but we do not warrant that it is free of errors or that it will always be available. Nothing on it is professional advice you should act on without talking to us first.',
          'The site links to third-party services — WhatsApp and our social profiles. We do not control those and are not responsible for them.',
        ],
      },
      {
        heading: 'Liability',
        body: [
          'To the extent the law allows, we are not liable for loss arising from your use of this website, or from relying on information published on it, where no contract between us is in place. Nothing here limits liability that cannot lawfully be limited.',
        ],
      },
      {
        heading: 'Changes and governing law',
        body: [
          'We may update these terms. The date at the top of this page tells you when they last changed, and the version published here is the one that applies.',
          'These terms are governed by the laws of Uganda, and the courts of Uganda have jurisdiction over any dispute about them.',
        ],
      },
    ],
  },

  privacy: {
    slug: '/privacy',
    navLabel: 'Privacy Policy',
    title: 'Privacy Policy',
    description:
      'What GenieWep Technologies collects when you use this website or send us an enquiry, why, and how to have it deleted.',
    intro:
      'The short version: the only personal information this site collects is what you type into the contact form, and it goes straight to our email inbox. There is no account to create, no tracking, and nothing is sold.',
    sections: [
      {
        heading: 'What we collect, and when',
        body: [
          'We collect personal information in exactly one place: the contact form. When you submit it, we receive the name, email address, phone number, service you selected and the message you wrote.',
          'We ask for a phone number because most of our clients prefer a call or a WhatsApp reply to an email. If you would rather not give one, email us directly instead.',
        ],
      },
      {
        heading: 'How your enquiry reaches us',
        body: [
          `Submitting the form sends it to our own server, which passes it to Resend — an email delivery service — for delivery to ${CONTACT.email}. Resend handles the message in transit and keeps a delivery record. Their privacy terms are at resend.com/legal/privacy-policy.`,
          'Your email address is set as the reply-to on that message, so when we answer you, you hear from us directly.',
        ],
      },
      {
        heading: 'Why we are allowed to hold it',
        body: [
          'You gave it to us in order to be contacted about a project. We use it for that, and for the follow-up conversation about the work you asked about. We do not use it for anything else.',
          'We do not send marketing email. You will not be added to a mailing list for filling in the form.',
        ],
      },
      {
        heading: 'Who else sees it',
        body: [
          'Nobody outside GenieWep Technologies, other than the service providers that make the site work: Resend delivers your enquiry, Vercel hosts the site, and Google provides the inbox the enquiry lands in.',
          'We do not sell personal information, share it with advertisers, or pass it to anyone else, unless we are legally required to.',
        ],
      },
      {
        heading: 'How long we keep it',
        body: [
          'Your enquiry stays in our email inbox. If it becomes a project, it stays as long as we keep that project record. If it does not, we delete it once the conversation is clearly over — normally within two years.',
        ],
      },
      {
        heading: 'Server logs',
        body: [
          'Our host, Vercel, records standard technical information for every request: IP address, browser and page requested. This is how a web server works, and we use it only for security and diagnosing faults. We do not use it to build a profile of you.',
        ],
      },
      {
        heading: 'Your choices',
        body: [
          `Write to ${CONTACT.email} and ask, and we will tell you what we hold about you, correct it, or delete it. If you ask us to delete your enquiry we will, unless we need it for a live project or a legal obligation.`,
          'If you are unhappy with how we have handled your information, tell us first — we would rather fix it. You can also complain to the Personal Data Protection Office of Uganda.',
        ],
      },
      {
        heading: "Children's information",
        body: [
          'This site is aimed at organizations, not children, and we do not knowingly collect information from anyone under 18. If you believe a child has sent us something, tell us and we will delete it.',
        ],
      },
      {
        heading: 'Changes',
        body: [
          'If this policy changes, the date at the top of the page changes with it. Material changes to how we use existing enquiry information will be told to the people affected, not just posted here.',
        ],
      },
    ],
  },

  cookies: {
    slug: '/cookies',
    navLabel: 'Cookie Policy',
    title: 'Cookie Policy',
    description:
      'This site sets no tracking or advertising cookies. The one thing it stores is your light or dark theme choice.',
    intro:
      'This site does not set tracking cookies, advertising cookies, or any cookie that would follow you to another website. It stores one thing in your browser, and only because you asked it to.',
    sections: [
      {
        heading: 'What is stored',
        body: [
          'When you use the light/dark switch in the header, your choice is saved in your browser under the key "geniewep-theme". That is the only thing this site writes to your device.',
          'It is kept in local storage rather than a cookie, which means it is never attached to a network request and is never sent to us. It exists so the site opens in the theme you picked instead of flashing the wrong one at you.',
        ],
      },
      {
        heading: 'What we do not do',
        body: [
          'No analytics. There is no Google Analytics, no Meta pixel, no heatmap or session recorder, and no advertising or retargeting tag on this site. We cannot tell you how many people visited a page, because we do not measure it.',
          'No third-party cookies are set by us. Embedded third-party services set their own if you use them — following a link to WhatsApp or one of our social profiles takes you to their site, where their rules apply.',
        ],
      },
      {
        heading: 'Why there is no cookie banner',
        body: [
          'Consent banners exist for storage that is not strictly necessary — tracking, profiling, advertising. Remembering a setting you deliberately chose is not that, so there is nothing here to ask you to agree to.',
          'If we ever add analytics, this policy will be updated and we will ask before setting anything.',
        ],
      },
      {
        heading: 'Clearing it',
        body: [
          'Clearing site data for this domain in your browser settings removes the saved theme. Nothing else is affected, and the site will simply follow your operating system\'s light or dark setting again.',
        ],
      },
    ],
  },
}

/** Footer "Legal" column, in the order it renders. */
export const LEGAL_LINKS = Object.values(LEGAL_DOCUMENTS).map((doc) => ({
  to: doc.slug,
  label: doc.navLabel,
}))
