import { TECH_STACK } from '@/utils/constants'

/**
 * The technology strip: a slow horizontal loop of the stack the company
 * builds on.
 *
 * The track holds the list twice and slides exactly half its own width, so the
 * second copy lands where the first started and the loop never visibly
 * restarts. Both ends are masked into the page so cards fade rather than
 * popping in at a hard edge, and hovering pauses it — a strip that keeps
 * moving while you are trying to read one of its labels is actively hostile.
 *
 * `aria-hidden` on the duplicate track: it is the same six items again, and a
 * screen reader should hear the list once.
 */

const TechCard = ({ tech }) => (
  <li className="surface mx-2 flex shrink-0 items-center gap-4 rounded-2xl px-6 py-4">
    <span className="h-8 w-px shrink-0 bg-azure-500" />
    <span>
      <span className="block text-sm font-bold text-title">{tech.name}</span>
      <span className="mt-0.5 block text-xs text-dim">{tech.note}</span>
    </span>
  </li>
)

export const TechMarquee = () => (
  <div className="marquee py-2">
    <div className="marquee-track">
      <ul className="flex shrink-0 items-center">
        {TECH_STACK.map((tech) => (
          <TechCard key={tech.name} tech={tech} />
        ))}
      </ul>
      <ul aria-hidden="true" className="flex shrink-0 items-center">
        {TECH_STACK.map((tech) => (
          <TechCard key={`${tech.name}-copy`} tech={tech} />
        ))}
      </ul>
    </div>
  </div>
)

export default TechMarquee
