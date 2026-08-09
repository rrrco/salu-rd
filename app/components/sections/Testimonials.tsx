import { Quotes } from '@phosphor-icons/react/ssr'
import { Card } from '@/components/ui/card'
import { Section, SectionHead } from '../ui/Section'
import { Reveal } from '../ui/Reveal'

/**
 * All three quotes on screen, in cards.
 *
 * Two revisions got here. First a carousel, which hid two thirds of the social
 * proof behind an arrow. Then bare columns on hairline rules, which showed
 * everything but had nothing holding it together: the quotes are different
 * lengths, so every attribution landed at a different height and the section
 * read as unfinished.
 *
 * Cards fix that by giving the content a shape. Equal-height cells mean the
 * rule above each attribution lands on exactly the same baseline across all
 * three, which is the detail that makes a row of testimonials look composed
 * rather than dumped. `mt-auto` pins the attribution to the bottom; the card
 * stretches, the quote does not.
 *
 * The location was dropped from each attribution. All three are in the Dominican
 * Republic, as is the whole company, so repeating it three times added nothing
 * and made only the middle column wrap to two lines.
 */
const TESTIMONIALS = [
  {
    name: 'Dra. Valentina Ruiz',
    role: 'Clínica veterinaria',
    quote:
      'SALU ha sido nuestro proveedor de cabecera durante más de tres años. La entrega es rápida y confiable, exactamente lo que una clínica ocupada necesita.',
  },
  {
    name: 'Carlos Medina',
    role: 'Distribuidor veterinario',
    quote:
      'La disponibilidad de productos y la consistencia de calidad lo son todo. SALU cumple en ambos aspectos cada vez.',
  },
  {
    name: 'Dra. Ana Lima',
    role: 'Hospital veterinario',
    quote:
      'Cambiamos nuestro hospital a la línea de antibióticos y cuidado de heridas de SALU el año pasado, y los resultados clínicos han sido excelentes.',
  },
]

function initialsOf(name: string) {
  return name
    .replace(/^Dra?\.\s*/i, '')
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export function Testimonials() {
  return (
    <Section id="testimonials" labelledBy="testimonials-title" barColor="#e6f4f6" className="bg-teal-50">
      <Reveal>
        <SectionHead
          id="testimonials-title"
          title="Lo que dicen nuestros socios veterinarios"
          align="center"
        />
      </Reveal>

      <div className="mt-14 grid items-stretch gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((testimonial, i) => (
          <Reveal key={testimonial.name} delay={i * 0.08} className="h-full">
            {/* No hover state. The card is not a link and does nothing when
                clicked, so a lift or a border change would promise an
                interaction that does not exist. Every animation needs a
                reason; "it looks nice" is not one. */}
            <Card asChild className="h-full gap-5 p-8">
              <figure>
              <Quotes
                size={22}

                aria-hidden="true"
                className="shrink-0 text-brand"
              />

              <blockquote className="text-lead text-fg">{testimonial.quote}</blockquote>

              {/* mt-auto pins this to the bottom of a stretched card, so the
                  rule sits at the same height in all three. */}
              <figcaption className="mt-auto flex items-center gap-3.5 border-t border-border pt-6">
                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-accent-deep"
                >
                  {initialsOf(testimonial.name)}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-semibold text-fg">{testimonial.name}</span>
                  <span className="truncate text-sm text-fg-muted">{testimonial.role}</span>
                </span>
              </figcaption>
              </figure>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
