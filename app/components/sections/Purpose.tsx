import { ShieldCheck, Truck, Microscope } from '@phosphor-icons/react/ssr'
import type { Icon } from '@phosphor-icons/react/lib'
import { Card } from '@/components/ui/card'
import { Section, SectionHead } from '../ui/Section'
import { PhotoSlot } from '../ui/PhotoSlot'
import { Reveal } from '../ui/Reveal'
import { ICON_WEIGHT } from '../../lib/icons'

const PILLARS: { title: string; body: string; icon: Icon }[] = [
  {
    title: 'Satisfacción del Cliente',
    body: 'La satisfacción de cada cliente es nuestra prioridad número uno. Trabajamos de cerca con clínicas, hospitales y distribuidores para entender sus necesidades y superar sus expectativas en cada interacción.',
    icon: ShieldCheck,
  },
  {
    title: 'Entregas Rápidas y Confiables',
    body: 'Ofrecemos el mejor servicio del mercado gracias a entregas rápidas y puntuales. Nuestra cadena logística garantiza que los productos lleguen cuando los necesitas, sin retrasos ni complicaciones.',
    icon: Truck,
  },
  {
    title: 'Apoyo Científico',
    body: 'Nuestro equipo de veterinarios y farmacólogos matriculados brinda orientación técnica para ayudarte a seleccionar los productos, dosis y protocolos de tratamiento adecuados para cada escenario clínico.',
    icon: Microscope,
  },
]

/**
 * One shape for all three. No per-card overrides: the moment one pillar gets a
 * different internal layout to make it fit a grid cell, the set stops reading
 * as a set and starts reading as a mistake.
 */
function Pillar({ pillar }: { pillar: (typeof PILLARS)[number] }) {
  const Icon = pillar.icon
  return (
    <Card className="h-full gap-4 bg-teal-50 p-8 shadow-none">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand text-on-brand">
        <Icon size={24} weight={ICON_WEIGHT} aria-hidden="true" />
      </span>
      <h3 className="text-h3 font-semibold">{pillar.title}</h3>
      <p className="text-sm text-fg-muted">{pillar.body}</p>
    </Card>
  )
}

/**
 * Bento with real rhythm: two pillars beside a tall photo, the third as a wide
 * bar below. Four cells for four pieces of content, no empty tiles.
 *
 * Replaces three identical solid-teal cards in a row, which is both the generic
 * feature-row pattern and, at full brand saturation, visually louder than the
 * products section it sat next to.
 *
 * The photo cell is what keeps this from being an all-typography grid.
 */
export function Purpose() {
  return (
    <Section id="purpose" labelledBy="purpose-title">
      <Reveal>
        <SectionHead
          id="purpose-title"
          title="Nuestro propósito"
          lead="Tres compromisos que definen cómo trabajamos con cada clínica, hospital y distribuidor."
        />
      </Reveal>

      <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-12">
        {/* Three identical cards, stacked. The asymmetry lives in the 7/5 split
            against the photo, not in the cards, so the pillars stay a set. */}
        <div className="flex flex-col gap-5 lg:col-span-7">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.06}>
              <Pillar pillar={pillar} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12} className="lg:col-span-5">
          <PhotoSlot
            src="/photos/delivery.jpg"
            alt="Camión de reparto cargado con cajas de productos veterinarios SALU"
            ratio="aspect-[4/3] lg:aspect-auto lg:h-full"
            sizes="(min-width: 1024px) 40vw, 100vw"
            note="Foto 3:4 vertical - cajas de producto en su entorno real, o una entrega en curso"
            className="h-full w-full"
          />
        </Reveal>
      </div>
    </Section>
  )
}
