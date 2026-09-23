import { FiGitCommit } from 'react-icons/fi'

import Section from '@/components/Section'
import Icon from '@/components/Icon'
import { Stagger, StaggerItem } from '@/components/Reveal'
import { PROCESS } from '@/utils/constants'

/**
 * How a project runs: four stages on a single connecting line.
 *
 * The line is drawn once behind the row and inset by half a column at each
 * end, so it starts at the first tile and stops at the last rather than
 * running off into the margins. Four separate cards with arrows between them
 * would say these are four separate things; one line says they are one thing
 * with four moments in it, which is the accurate claim.
 *
 * Vertical on mobile, where a horizontal timeline would either scroll
 * sideways or compress each stage to two words.
 */
export const ProcessSteps = () => (
  <Section
    tone="tinted"
    size="md"
    align="center"
    eyebrow="How we work"
    eyebrowIcon={FiGitCommit}
    title="Four stages, and you see the work at every one."
    description="No black box between the deposit and the launch. You approve the scope before we design, the screens before we build, and a working version at every stage after that."
  >
    <Stagger
      as="ol"
      step={0.08}
      className="relative grid gap-8 lg:grid-cols-4 lg:gap-6"
    >
      {/* The rule the tiles sit on. Hidden below `lg`, where the stages stack
          and a horizontal line would have nothing to connect. */}
      <span
        aria-hidden="true"
        className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-line lg:block"
      />

      {PROCESS.map((stage) => (
        <StaggerItem as="li" key={stage.id} className="relative text-center">
          <span className="tile-azure mx-auto mb-5 h-14 w-14 ring-8 ring-tint">
            <Icon name={stage.icon} className="h-6 w-6" />
          </span>

          <p className="tabular mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-link">
            {stage.step}
          </p>
          <h3 className="mb-3 text-base font-bold text-title">{stage.title}</h3>
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-body">
            {stage.body}
          </p>
        </StaggerItem>
      ))}
    </Stagger>
  </Section>
)

export default ProcessSteps
