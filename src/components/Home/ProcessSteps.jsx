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
    title="Four stages, and you see the work at every one."
    description="No black box between the deposit and the launch. You approve the scope before we design, the screens before we build, and a working version at every stage after that."
  >
    <Stagger
      as="ol"
      step={0.08}
      className="relative mx-auto grid max-w-md gap-0 sm:max-w-none lg:grid-cols-4 lg:gap-6"
    >
      {/* The rule the tiles sit on. Hidden below `lg`, where the stages stack
          and a horizontal line would have nothing to connect. */}
      <span
        aria-hidden="true"
        className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-line lg:block"
      />

      {PROCESS.map((stage, index) => (
        /*
          Below `sm` each stage is a row of a vertical timeline: the icon on
          the left, on a rule that runs down to the next one, and the text
          left-aligned beside it. Centred paragraphs stacked four deep read as
          a poem; a timeline reads as a sequence.
        */
        <StaggerItem
          as="li"
          key={stage.id}
          className="relative grid grid-cols-[3.5rem_1fr] gap-x-4 pb-10 text-left last:pb-0 sm:block sm:pb-8 sm:text-center lg:pb-0"
        >
          {index < PROCESS.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-7 top-14 bottom-0 w-px bg-line sm:hidden"
            />
          )}
          <span className="tile-azure relative h-14 w-14 rounded-2xl border border-line bg-card sm:mx-auto sm:mb-5 sm:rounded-none sm:border-0 sm:bg-tint sm:ring-8 sm:ring-tint">
            <Icon name={stage.icon} className="h-6 w-6" />
          </span>

          <div className="pt-1 sm:pt-0">
            <p className="tabular mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-link sm:mb-2">
              {stage.step}
            </p>
            <h3 className="mb-2 text-base font-bold text-title sm:mb-3">{stage.title}</h3>
            <p className="max-w-xs text-sm leading-relaxed text-body sm:mx-auto">
              {stage.body}
            </p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  </Section>
)

export default ProcessSteps
