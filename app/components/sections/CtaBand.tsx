import Image from 'next/image'
import { WhatsAppIcon } from '../../lib/icons'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '../ui/Reveal'
import { whatsappUrl, WHATSAPP_MESSAGES } from '../../lib/site'

/**
 * Closing band. The one gradient left in the system, kept because it is the
 * final conversion moment and the teal ramp reads as a deliberate crescendo
 * here rather than as decoration.
 *
 * One CTA. The label matches the "cotizar" intent used in the nav and hero, so
 * the page never presents two differently-worded buttons that do the same thing.
 */
export function CtaBand() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-title"
      data-bar-color="#0a4d55"
      className="on-dark bg-[linear-gradient(135deg,var(--color-teal-950)_0%,var(--color-teal-800)_50%,var(--color-teal-600)_100%)]"
    >
      <div className="mx-auto max-w-(--container-content) px-(--space-gutter) py-(--space-section)">
        <Reveal className="flex flex-col items-center gap-7 text-center">
          <Image
            src="/salu-img.png"
            alt=""
            width={56}
            height={56}
            className="opacity-55 brightness-0 invert"
            unoptimized
          />
          <h2 id="cta-title" className="max-w-[22ch] text-h1 font-semibold text-white">
            ¿Listo para abastecer tu práctica con productos veterinarios premium?
          </h2>
          <ButtonLink href={whatsappUrl(WHATSAPP_MESSAGES.general)} size="lg">
            <WhatsAppIcon />
            Cotizar por WhatsApp
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  )
}
