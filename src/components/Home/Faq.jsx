import { FiChevronDown, FiHelpCircle } from 'react-icons/fi'

import Button from '@/components/Button/Button'
import Reveal, { Stagger, StaggerItem } from '@/components/Reveal'
import { FAQS } from '@/utils/constants'

/**
 * Frequently asked questions.
 *
 * Built on native `<details>` / `<summary>` rather than React state. The
 * browser gives keyboard support, the correct expanded/collapsed announcement
 * and the ability to find collapsed text with the browser's own find — all of
 * which a hand-rolled accordion has to reimplement and usually gets wrong.
 * The chevron rotation is the only thing CSS adds.
 *
 * Asymmetric two-column layout: the heading sticks in the left column while
 * the answers scroll past it on the right. That is what keeps the section from
 * reading as an undifferentiated wall of questions.
 */
export const Faq = () => (
  <section className="bg-canvas py-16 sm:py-20 lg:py-24">
    <div className="container-page">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
        <Reveal className="lg:sticky lg:top-28">
          <p className="eyebrow mb-5">
            <FiHelpCircle aria-hidden="true" className="h-3.5 w-3.5" />
            Questions
          </p>
          <h2 className="mb-4 text-3xl leading-[1.15] text-title sm:text-4xl">
            What clients ask before they commit.
          </h2>
          <p className="mb-6 max-w-md text-base leading-relaxed text-body">
            Pricing, hosting, what happens after launch, and who actually does
            the work. Open a question for a direct answer.
          </p>
          <Button to="/contact" variant="secondary">
            Ask us something else
          </Button>
        </Reveal>

        <Stagger as="div" step={0.05} className="space-y-3">
          {FAQS.map((faq) => (
            <StaggerItem key={faq.id}>
              <details className="surface surface-hover group rounded-2xl open:border-azure-500/35">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left marker:content-none sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-[0.9375rem] font-semibold text-title sm:text-base">
                    {faq.question}
                  </h3>
                  <FiChevronDown
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-link transition-transform duration-300 group-open:rotate-180"
                  />
                </summary>
                <div className="border-t border-line px-5 pt-4 pb-5 text-sm leading-relaxed text-body sm:px-6 sm:pb-6">
                  {faq.answer}
                </div>
              </details>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  </section>
)

export default Faq
