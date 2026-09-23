import { FiMapPin } from 'react-icons/fi'

import { CONTACT } from '@/utils/constants'

/*
 * The hero visual: a globe turned to Africa, with a pulsing marker on Kampala.
 *
 * Drawn as inline SVG rather than shipped as an image. The continent is two
 * paths, the graticule is a handful of ellipses, and the whole thing is a few
 * kilobytes of markup already in the document — against a PNG that would be a
 * separate request, would need a second file for the light theme, and could
 * not recolour itself when the accent moves.
 *
 * It says the one thing the hero copy does not: this is a Ugandan company,
 * and it works beyond Uganda.
 *
 * The sphere is light and the continent is azure, so the brightest object on
 * a dark page is the one carrying the message. `aria-hidden` on the drawing
 * itself, with the location stated underneath as real text — a screen reader
 * gets "Kampala, Uganda" rather than a description of a picture of a globe.
 */

/*
 * Africa, simplified.
 *
 * Coordinates are in the 400x400 viewBox, with the sphere centred at (200,200)
 * at r=150. The outline is traced from the real coastline at low resolution:
 * the Mediterranean edge across the top, the Red Sea and the Horn on the
 * right, the East African coast running south to the Cape, then back up
 * through the Gulf of Guinea and the West African bulge. It is not
 * survey-accurate and is not trying to be — at 300px across, the silhouette
 * is the only part anyone reads, and the silhouette is right.
 */
const AFRICA =
  'M142 116 L232 110 C244 118 250 136 252 152 C256 162 268 170 276 176 ' +
  'C268 186 256 190 250 196 C252 214 254 234 248 252 ' +
  'C242 272 232 292 220 310 C214 318 204 316 200 306 ' +
  'C194 290 190 272 186 258 C180 244 170 236 158 230 ' +
  'C146 226 134 222 126 212 C118 200 116 184 120 168 ' +
  'C124 150 132 130 142 116 Z'

const MADAGASCAR =
  'M268 246 C274 244 278 252 277 262 C276 276 272 288 266 294 ' +
  'C262 297 258 294 258 288 C258 272 262 256 268 246 Z'

/*
 * Kampala, placed by longitude and latitude rather than by eye.
 *
 * The path above spans roughly 17°W to 51°E (x 118 → 276) and 37°N to 35°S
 * (y 110 → 312). Uganda's capital sits at 32.6°E, 0.3°N, which lands at
 * (231, 212) — about 58% across and 53% down the viewBox.
 */
const KAMPALA = { left: '57.8%', top: '53%' }

/* Rotating ring of ticks. Generated rather than typed out, because 48
   hand-written <line> elements is 48 chances to fat-finger a coordinate. */
const TICKS = Array.from({ length: 48 }, (_, index) => {
  const angle = (index / 48) * Math.PI * 2
  const long = index % 4 === 0
  const inner = long ? 176 : 182
  return {
    key: index,
    x1: 200 + Math.cos(angle) * inner,
    y1: 200 + Math.sin(angle) * inner,
    x2: 200 + Math.cos(angle) * 190,
    y2: 200 + Math.sin(angle) * 190,
    long,
  }
})

export const AfricaGlobe = () => (
  <div className="relative mx-auto w-full max-w-[21rem] sm:max-w-[25rem]">
    {/* Soft azure pool behind the sphere. Blurred and low-alpha, so it reads
        as the globe being lit rather than as a ring around it. */}
    <div
      aria-hidden="true"
      className="absolute inset-10 -z-10 rounded-full bg-azure-500/25 blur-3xl"
    />

    <div className="surface animate-float rounded-[1.75rem] p-5 sm:p-6">
      <div className="relative aspect-square w-full">
        {/* The tick ring, turning once every 34 seconds — slow enough that a
            visitor never catches it moving, only notices the globe is not a
            static picture. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full animate-orbit-slow text-line-strong"
        >
          {TICKS.map((tick) => (
            <line
              key={tick.key}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke="currentColor"
              strokeWidth={tick.long ? 2 : 1}
              strokeLinecap="round"
              opacity={tick.long ? 0.8 : 0.4}
            />
          ))}
        </svg>

        <svg
          viewBox="0 0 400 400"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            {/*
              Sphere shading: light from the upper left, falling away toward a
              cool terminator on the lower right. The same light direction as
              the inset highlight on every card, so the globe belongs to the
              same scene as the rest of the page.
            */}
            <radialGradient id="globe-body" cx="34%" cy="26%" r="82%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="52%" stopColor="#e3ebf3" />
              <stop offset="100%" stopColor="#a0b2c5" />
            </radialGradient>

            <linearGradient id="globe-africa" x1="0.1" y1="0" x2="0.7" y2="1">
              <stop offset="0%" stopColor="#63a3e3" />
              <stop offset="100%" stopColor="#216eba" />
            </linearGradient>

            {/* Clips the graticule to the sphere so the lines stop at the limb
                instead of running off into the card. */}
            <clipPath id="globe-clip">
              <circle cx="200" cy="200" r="150" />
            </clipPath>
          </defs>

          <circle cx="200" cy="200" r="150" fill="url(#globe-body)" />

          <g
            clipPath="url(#globe-clip)"
            stroke="#5c718a"
            fill="none"
            strokeWidth="1"
            opacity="0.28"
          >
            {/* Parallels */}
            <line x1="50" y1="200" x2="350" y2="200" />
            <ellipse cx="200" cy="200" rx="150" ry="52" />
            <ellipse cx="200" cy="200" rx="150" ry="104" />
            {/* Meridians */}
            <line x1="200" y1="50" x2="200" y2="350" />
            <ellipse cx="200" cy="200" rx="52" ry="150" />
            <ellipse cx="200" cy="200" rx="104" ry="150" />
          </g>

          <g clipPath="url(#globe-clip)">
            <path d={AFRICA} fill="url(#globe-africa)" />
            <path d={MADAGASCAR} fill="url(#globe-africa)" />
          </g>

          {/* The limb. Without it the lit sphere bleeds into the card at the
              top-left, where both are near-white. */}
          <circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke="#5c718a"
            strokeWidth="1.5"
            opacity="0.45"
          />
        </svg>

        {/* Kampala. Positioned over the globe rather than inside the SVG so
            the pulse can be a CSS animation on a real element. */}
        <span
          aria-hidden="true"
          className="absolute block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2"
          style={{ left: KAMPALA.left, top: KAMPALA.top }}
        >
          <span className="absolute inset-0 animate-pin rounded-full bg-navy-950" />
          <span className="absolute inset-0 rounded-full bg-navy-950 ring-2 ring-white" />
        </span>
      </div>

      {/* The caption is the accessible name for the whole visual. */}
      <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas/90 px-3 py-1.5 text-xs font-semibold text-title">
        <FiMapPin aria-hidden="true" className="h-3.5 w-3.5 text-link" />
        {CONTACT.location}
      </p>
    </div>
  </div>
)

export default AfricaGlobe
