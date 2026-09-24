import Card from '@/components/Card/Card'
import Icon from '@/components/Icon'
import { Stagger, StaggerItem } from '@/components/Reveal'
import { HEADLINE_FACTS } from '@/utils/constants'

/**
 * The credibility strip directly under the hero.
 *
 * Four facts, each in its own card with an azure icon tile. Two of the values
 * are counted from the catalogue data rather than typed in, so the strip
 * cannot advertise a project count the portfolio does not back up — see the
 * note on `HEADLINE_FACTS` in constants.js.
 *
 * No counting-up animation. The figures here are small and honest; animating a
 * 4 up from 0 draws attention to exactly that.
 */
export const FactStrip = () => (
  <section className="border-y border-line bg-tint">
    <div className="container-page py-10 sm:py-12 lg:py-14">
      <Stagger
        as="dl"
        step={0.06}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {HEADLINE_FACTS.map((fact) => (
          <StaggerItem as="div" key={fact.id}>
            <Card className="flex h-full items-center gap-4 px-5 py-4">
              <span className="tile-azure shrink-0">
                <Icon name={fact.icon} className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <dt className="sr-only">{fact.label}</dt>
                <dd>
                  <span className="tabular block text-lg font-bold leading-tight text-title">
                    {fact.value}
                  </span>
                  <span className="mt-0.5 block text-sm text-dim">
                    {fact.label}
                  </span>
                </dd>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  </section>
)

export default FactStrip
