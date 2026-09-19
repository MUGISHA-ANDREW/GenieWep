/**
 * Contact form schema (Zod v4) shared by the form UI and any future backend
 * validation. Field list follows PROJECT_BRIEF.md §11: Name, Email, Phone,
 * Service Type, Message.
 */

import { z } from 'zod'

import { SERVICE_TYPE_OPTIONS } from './constants'

/**
 * Accepts the formats Ugandan clients actually type:
 *   +256 767 267 209 · 0767267209 · 256767267209
 * Spaces, dashes and brackets are tolerated and stripped before checking.
 */
const PHONE_PATTERN = /^\+?\d{9,15}$/

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(80, 'Name is too long.'),

  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .pipe(z.email('Please enter a valid email address.')),

  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required.')
    .transform((value) => value.replace(/[\s()-]/g, ''))
    .refine((value) => PHONE_PATTERN.test(value), {
      message: 'Enter a valid phone number, e.g. +256 767 267 209.',
    }),

  serviceType: z
    .string()
    .min(1, 'Please choose the service you need.')
    .refine((value) => SERVICE_TYPE_OPTIONS.includes(value), {
      message: 'Please choose a service from the list.',
    }),

  message: z
    .string()
    .trim()
    .min(10, 'Please tell us a little more about your project (at least 10 characters).')
    .max(2000, 'Message is too long. Please keep it under 2000 characters.'),

  /**
   * Honeypot. Hidden from humans via CSS; bots fill it in. A non-empty value
   * fails validation, so no request is ever sent.
   */
  company: z.string().max(0, 'Submission rejected.').optional().or(z.literal('')),
})

export const contactDefaultValues = {
  name: '',
  email: '',
  phone: '',
  serviceType: '',
  message: '',
  company: '',
}
