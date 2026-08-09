import { WhatsappLogo } from '@phosphor-icons/react/ssr'
import { ButtonLink } from '../ui/Button'
import { whatsappUrl, WHATSAPP_MESSAGES } from '../../lib/site'
import { PhotoSlot } from '../ui/PhotoSlot'

/**
 * Full-bleed editorial band. This is where Tier 1 photography runs at scale and
 * the background of the photo becomes the point rather than a problem.
 *
 * Copy sits on `.photo-scrim`, a left-weighted gradient, so it stays legible
 * whatever the supplied photo turns out to look like. Never set type directly
 * on a raw image.
 *
 * Replaces a section that hotlinked a dog photo from another company's
 * WordPress upload.
 */
export function AnimalBand() {
  return (
    <section id="animal" aria-labelledby="animal-title" className="on-dark relative">
      <PhotoSlot
        src="/photos/animal.jpg"
        alt=""
        ratio="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]"
        sizes="100vw"
        scrim
        note="Foto 21:9 - un perro sano, tomada en horizontal, con espacio limpio en el tercio izquierdo para el texto"
        className="rounded-none"
      >
        <div className="absolute inset-0 z-[4] flex items-center">
          <div className="mx-auto w-full max-w-(--container-content) px-(--space-gutter)">
            <div className="flex max-w-[46ch] flex-col items-start gap-5">
              <h2 id="animal-title" className="text-h2 font-semibold text-white">
                Soluciones completas para la salud animal
              </h2>
              <p className="text-lead text-teal-100">
                Un catálogo curado de medicamentos y suministros certificados:
                antibióticos, antiparasitarios, biológicos y consumibles
                quirúrgicos. Precios competitivos y respaldo técnico en cada
                pedido.
              </p>
              <ButtonLink
                href={whatsappUrl(WHATSAPP_MESSAGES.general)}
                size="lg"
                className="mt-2"
              >
                <WhatsappLogo size={18} aria-hidden="true" />
                Cotizar por WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
      </PhotoSlot>
    </section>
  )
}
