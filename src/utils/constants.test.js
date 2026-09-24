/**
 * Guards the catalogue data against drift.
 *
 * These assertions are transcribed from the GenieWep Technologies Company
 * Profile & Service Catalogue, 2026 Edition. If a price here fails, either the
 * site data is wrong or the catalogue changed — in which case update
 * PROJECT_BRIEF.md, constants.js and this file together, deliberately.
 */

import { describe, expect, it } from 'vitest'

import {
  ADDITIONAL_SERVICES,
  CERTIFICATIONS,
  CONTACT,
  CORE_SERVICES,
  DESKTOP_PACKAGES,
  MOBILE_APP_PACKAGES,
  PROJECTS,
  SOCIAL_LINKS,
  TEAM,
  WEBSITE_PACKAGES,
  WEB_APP_PACKAGES,
  WHY_CHOOSE_US,
  buildWhatsAppLink,
} from './constants'

const byId = (items, id) => items.find((item) => item.id === id)

describe('contact details', () => {
  it('matches the catalogue footer', () => {
    expect(CONTACT.website).toBe('geniewep.com')
    expect(CONTACT.email).toBe('geniewep@gmail.com')
    expect(CONTACT.phoneDisplay).toBe('+256 767 267 209')
    expect(CONTACT.whatsappNumber).toBe('256767267209')
  })

  it('builds a wa.me link with an encoded message', () => {
    const link = buildWhatsAppLink('Hello there')
    expect(link).toBe('https://wa.me/256767267209?text=Hello%20there')
  })

  /*
   * The footer and the contact page both print `location`. Asserting that it
   * is built from `city` and `country` is what stops one of the three drifting
   * when the company moves.
   */
  it('places the company in Kampala', () => {
    expect(CONTACT.city).toBe('Kampala')
    expect(CONTACT.country).toBe('Uganda')
    expect(CONTACT.location).toBe(`${CONTACT.city}, ${CONTACT.country}`)
  })
})

describe('social profiles', () => {
  /*
   * Pinned to the exact URLs the client supplied. A typo in a profile URL is
   * invisible in review and sends visitors to a 404 or, worse, to somebody
   * else's account — so the handles are asserted rather than eyeballed.
   */
  it('matches the handles the client confirmed', () => {
    expect(SOCIAL_LINKS.map((social) => social.url)).toEqual([
      'https://www.facebook.com/profile.php?id=61594174394851',
      'https://www.instagram.com/geniewep/',
      'https://x.com/GenieWep',
      'https://www.tiktok.com/@geniewep',
    ])
  })

  it('gives every profile a unique id, a label and an icon key', () => {
    const ids = SOCIAL_LINKS.map((social) => social.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(
      SOCIAL_LINKS.every((social) => Boolean(social.label && social.icon)),
    ).toBe(true)
  })
})

describe('core services (Section 1)', () => {
  it('lists all ten services', () => {
    expect(CORE_SERVICES).toHaveLength(10)
  })

  it('gives every service a unique id and an icon', () => {
    const ids = CORE_SERVICES.map((service) => service.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(CORE_SERVICES.every((service) => Boolean(service.icon))).toBe(true)
  })
})

describe('projects (Section 2)', () => {
  it('lists the four completed projects with their industries', () => {
    expect(PROJECTS).toHaveLength(4)
    expect(byId(PROJECTS, 'gvm-company').industry).toBe('Agriculture & Development')
    expect(byId(PROJECTS, 'scaval').industry).toBe('Agricultural Commodities')
    expect(byId(PROJECTS, 'nkuruba-tours').industry).toBe('Tourism')
    expect(byId(PROJECTS, 'small-beginnings-uganda').industry).toBe('NGO / Education')
  })

  it('leaves Small Beginnings Uganda without an invented URL', () => {
    expect(byId(PROJECTS, 'small-beginnings-uganda').url).toBeNull()
  })
})

describe('website packages (Section 3)', () => {
  it('prices the three tiers as published', () => {
    expect(byId(WEBSITE_PACKAGES, 'starter').price).toEqual({ min: 800_000 })
    expect(byId(WEBSITE_PACKAGES, 'business').price).toEqual({ min: 1_500_000 })
    expect(byId(WEBSITE_PACKAGES, 'executive').price).toEqual({
      min: 2_800_000,
      max: 4_000_000,
    })
  })

  it('keeps the Starter add-ons the client pays separately', () => {
    const extras = byId(WEBSITE_PACKAGES, 'starter').clientPaysSeparately
    expect(extras).toHaveLength(2)
    expect(extras[0]).toEqual({
      item: 'Domain',
      price: { min: 45_000, max: 70_000 },
      unit: 'year',
    })
    expect(extras[1]).toEqual({
      item: 'Hosting',
      price: { min: 250_000 },
      unit: 'year',
    })
  })

  it('carries the seven Starter features', () => {
    expect(byId(WEBSITE_PACKAGES, 'starter').features).toHaveLength(7)
  })

  it('notes that Business builds on Starter', () => {
    expect(byId(WEBSITE_PACKAGES, 'business').inheritsFrom).toBe('Starter')
  })
})

describe('application packages (Sections 4–6)', () => {
  it('prices web apps as published', () => {
    expect(byId(WEB_APP_PACKAGES, 'basic-web-app').price).toEqual({
      min: 2_000_000,
      max: 4_000_000,
    })
    expect(byId(WEB_APP_PACKAGES, 'business-web-app').price).toEqual({
      min: 4_000_000,
      max: 8_000_000,
    })
    expect(byId(WEB_APP_PACKAGES, 'enterprise-web-app').price).toEqual({
      min: 8_000_000,
      max: 20_000_000,
      openEnded: true,
    })
  })

  it('prices mobile apps as published', () => {
    expect(byId(MOBILE_APP_PACKAGES, 'basic-android').price).toEqual({
      min: 2_000_000,
      max: 3_500_000,
    })
    expect(byId(MOBILE_APP_PACKAGES, 'android-ios').price.openEnded).toBe(true)
  })

  it('prices desktop software as published', () => {
    expect(byId(DESKTOP_PACKAGES, 'pos-inventory').price).toEqual({
      min: 2_000_000,
      max: 5_000_000,
    })
    expect(byId(DESKTOP_PACKAGES, 'school-management').price).toEqual({
      min: 3_000_000,
      max: 8_000_000,
    })
  })
})

describe('additional services (Section 7)', () => {
  it('prices all five with the right billing units', () => {
    expect(ADDITIONAL_SERVICES).toHaveLength(5)

    const maintenance = byId(ADDITIONAL_SERVICES, 'website-maintenance')
    expect(maintenance.price).toEqual({ min: 100_000, max: 350_000 })
    expect(maintenance.unit).toBe('month')

    const domain = byId(ADDITIONAL_SERVICES, 'domain-registration')
    expect(domain.price).toEqual({ min: 45_000, max: 180_000 })
    expect(domain.unit).toBe('year')

    expect(byId(ADDITIONAL_SERVICES, 'seo-setup').unit).toBeNull()
  })
})

describe('team', () => {
  /* Two cards, one centred row. The grid in About.jsx is capped to match. */
  it('holds two members', () => {
    expect(TEAM).toHaveLength(2)
  })

  it('gives every member a unique id, a role and a focus line', () => {
    const ids = TEAM.map((member) => member.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(TEAM.every((member) => Boolean(member.role && member.focus))).toBe(true)
  })

  /*
   * These are real named people on a public page, so the pairing of name to
   * role is asserted rather than eyeballed: swapping two of them in a refactor
   * is invisible in review and misattributes somebody's job.
   */
  it('pairs each name with the role the client gave it', () => {
    expect(
      TEAM.map((member) => `${member.name} — ${member.role}`),
    ).toEqual([
      'Kasozi Aloisius — Founder & Lead Developer',
      'Mugisha Andrew — Co-Founder & Software Engineer',
    ])
  })
})

describe('certifications', () => {
  it('names the five standards the client supplied badges for', () => {
    expect(CERTIFICATIONS.map((certification) => certification.id)).toEqual([
      'anab-iso-iec-17021',
      'iso-9001-2015',
      'iso-14001-2015',
      'iso-45001',
      'r2-v3-certified',
    ])
  })

  it('describes what each badge covers', () => {
    expect(
      CERTIFICATIONS.every(
        (certification) =>
          Boolean(certification.name) &&
          Boolean(certification.standard) &&
          Boolean(certification.note),
      ),
    ).toBe(true)
  })
})

describe('why choose us (Section 8)', () => {
  it('reproduces the five claims verbatim', () => {
    expect(WHY_CHOOSE_US.map((reason) => reason.text)).toEqual([
      '5 years of software development experience',
      'Modern, responsive designs',
      'Secure, Django-based systems',
      'Fast delivery and client support',
      'Affordable pricing for the Uganda market',
    ])
  })
})
