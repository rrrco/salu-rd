import { WhatsappLogo } from '@phosphor-icons/react/ssr'
import { ButtonLink } from '@/components/ui/button'
import { whatsappUrl, WHATSAPP_MESSAGES } from '../../lib/site'
import { PhotoSlot } from '../ui/PhotoSlot'

/**
 * Full-bleed editorial band. This is where Tier 1 photography runs at scale and
 * the background of the photo becomes the point rather than a problem.
 *
 * Copy sits on `.photo-scrim` so it stays legible whatever the supplied photo
 * turns out to look like. Never set type directly on a raw image. The scrim is
 * left-weighted from `sm` up, where the copy is capped at 46ch against the left
 * edge, and switches to a near-flat wash at 4:5 where the copy runs full width.
 *
 * Replaces a section that hotlinked a dog photo from another company's
 * WordPress upload.
 */
export function AnimalBand() {
  return (
    <section id="animal" aria-labelledby="animal-title" data-bar-color="#062428" className="on-dark relative">
      <PhotoSlot
        src="/photos/animal.jpg"
        alt=""
        ratio="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]"
        sizes="100vw"
        scrim
        note="Foto 21:9 - ganado sano (bovinos, aves, equinos, porcinos) o un veterinario en campo, tomada en horizontal, con espacio limpio en el tercio izquierdo para el texto"
        className="rounded-none"
      >
        <div className="absolute inset-0 z-[4] flex items-center">
          <div className="mx-auto w-full max-w-(--container-content) px-(--space-gutter)">
            <div className="flex max-w-[46ch] flex-col items-start gap-5">
              {/* Steps down from `text-h2` below `sm`. At 4:5 the band is
                  nearly square and the headline, lead and button all have to
                  sit inside it; the shared token's 28px floor made the headline
                  run three lines and crowd everything under it. Line-height and
                  tracking are carried over by hand so the smaller size keeps the
                  same optical density as the token. */}
              <h2
                id="animal-title"
                className="text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-h2"
              >
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
