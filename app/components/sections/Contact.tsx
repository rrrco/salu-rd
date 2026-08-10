import { EnvelopeSimple, ArrowUpRight } from '@phosphor-icons/react/ssr'
import { WhatsAppIcon } from '../../lib/icons'
import { Card } from '@/components/ui/card'
import ContactForm from '../ContactForm'
import { Section, SectionHead } from '../ui/Section'
import { Reveal } from '../ui/Reveal'
import { Disclosure } from '@/components/ui/disclosure'
import { SITE, whatsappUrl, WHATSAPP_MESSAGES } from '../../lib/site'

/**
 * WhatsApp first, form second.
 *
 * This section used to present the contact form as the main event, with
 * WhatsApp listed beside it as a phone number in a row of details. That
 * inverted the business: WhatsApp is where this company actually closes, and a
 * form asks for five fields and an email round trip before anyone talks.
 *
 * The hierarchy is now honest. WhatsApp is a full panel in the brand fill,
 * sized like the decision it is, opening a chat that already states the intent.
 * The form stays for buyers who prefer to send a list and wait, collapsed,
 * framed as the alternative it is.
 *
 * Position 7, after the proof sections. `#contact` is unchanged so every
 * existing CTA still lands here.
 */
export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-title">
      <Reveal>
        <SectionHead
          id="contact-title"
          title="Respuesta rápida"
          lead="Escríbenos por WhatsApp y te cotizamos al momento."
          align="center"
        />
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        {/* The primary path. Brand fill, generous target, and it opens a chat
            that already says what the buyer wants. */}
        <Reveal>
          <a
            href={whatsappUrl(WHATSAPP_MESSAGES.general)}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'group flex h-full flex-col justify-between gap-10 rounded-lg bg-brand p-8 text-white sm:p-10',
              'shadow-[0_1px_2px_rgb(6_36_40/0.24),inset_0_1px_0_rgb(255_255_255/0.22)]',
              'transition-[background-color,transform,box-shadow] duration-[180ms] ease-[var(--ease-out)]',
              'hover-fine:bg-brand-hover hover-fine:-translate-y-0.5',
              'hover-fine:shadow-[0_12px_28px_rgb(6_36_40/0.26),inset_0_1px_0_rgb(255_255_255/0.22)]',
              'active:translate-y-0 active:scale-[0.99]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]',
              'motion-reduce:transition-none motion-reduce:hover-fine:translate-y-0',
            ].join(' ')}
          >
            <span className="flex items-start justify-between gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/15">
                <WhatsAppIcon size={24} />
              </span>
              <ArrowUpRight
                size={20}
                aria-hidden="true"
                className="opacity-70 transition-transform duration-[180ms] ease-[var(--ease-out)] hover-fine:group-hover:-translate-y-0.5 hover-fine:group-hover:translate-x-0.5"
              />
            </span>

            <span className="flex flex-col gap-2">
              <span className="text-h3 font-semibold">Cotizar por WhatsApp</span>
              <span className="text-sm text-white">
                Precios y disponibilidad al momento, en horario laboral.
              </span>
              <span className="tabular mt-3 text-lg font-semibold">
                {SITE.phoneDisplay}
              </span>
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.08} className="flex h-full flex-col gap-6">
          <Card asChild
            className={[
              'group flex-row items-center gap-4 p-6',
              'transition-[border-color,transform,box-shadow] duration-[180ms] ease-[var(--ease-out)]',
              'hover-fine:border-accent hover-fine:-translate-y-0.5 hover-fine:shadow-md',
              'motion-reduce:transition-none motion-reduce:hover-fine:translate-y-0',
            ].join(' ')}
          >
          <a href={`mailto:${SITE.email}`}>
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-accent-deep">
              <EnvelopeSimple size={24} aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-fg-subtle">
                Correo electrónico
              </span>
              <span className="truncate text-fg">{SITE.email}</span>
            </span>
            <ArrowUpRight
              size={20}
              aria-hidden="true"
              className="ml-auto shrink-0 text-fg-subtle transition-transform duration-[180ms] ease-[var(--ease-out)] hover-fine:group-hover:-translate-y-0.5 hover-fine:group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </a>
          </Card>

          {/* Collapsed by default. The form is the slow path, so it should not
              out-shout the fast one just by being the tallest thing on screen. */}
          <Disclosure
            title="O envíanos un mensaje detallado"
            hint="Ideal si necesitas cotizar una lista de productos."
            className="flex-1 rounded-lg border border-border bg-surface shadow-sm"
          >
            <ContactForm />
          </Disclosure>

        </Reveal>
      </div>
    </Section>
  )
}
