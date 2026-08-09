import Image from 'next/image'
import { WhatsappLogo } from '@phosphor-icons/react/ssr'
import { ButtonLink } from '@/components/ui/button'
import { RevealGroup, RevealItem } from '../ui/Reveal'
import { HeroStats } from './Stats'
import { whatsappUrl, WHATSAPP_MESSAGES } from '../../lib/site'

/**
 * Full-bleed brand moment.
 *
 * The split hero this replaces was the default SaaS composition: copy left,
 * image right. Competent and completely anonymous. The original site's hero was
 * the better idea, so this returns to its structure, a centred message on an
 * immersive teal field with the figures layered at the bottom, and rebuilds the
 * parts that dated it: the flat gradient, the italic display face, the opaque
 * white card, and the tiny uppercase button.
 *
 * The hero slides under the transparent nav via a negative top margin, so the
 * colour runs to the very top of the viewport. `Nav` switches to its dark
 * treatment while it sits over this section.
 *
 * Four text elements, as the spec allows: eyebrow, headline, subtext, CTAs. The
 * brand mark is a mark, not a fifth line of type, and the nav carries the
 * wordmark so the hero does not repeat it.
 */
export function Hero() {
  return (
    <section
      id="hero"
      data-bar-color="#062428"
      className="hero-surface on-dark relative -mt-(--nav-h) flex min-h-[100dvh] flex-col overflow-hidden pt-(--nav-h)"
    >
      <div className="mx-auto flex w-full max-w-(--container-content) flex-1 flex-col px-(--space-gutter)">
        <RevealGroup className="flex flex-1 flex-col items-center justify-center gap-6 py-14 text-center">
          <RevealItem>
            <Image
              src="/salu-img.png"
              alt=""
              width={60}
              height={60}
              priority
              unoptimized
              className="brightness-0 invert"
            />
          </RevealItem>

          <RevealItem>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-100">
              Tu socio de confianza en salud animal
            </p>
          </RevealItem>

          <RevealItem>
            {/* 700, one step above every other heading on the site, which sit
                at 600. The hero is the one place that should shout.

                Tracking tightens as the weight goes up: heavier strokes eat
                into the counters and the gaps between letters read wider than
                they are, so -0.035em keeps the line optically even. Apple's
                rule that tracking is size- and weight-specific, never a single
                value for everything. */}
            <h1 className="mx-auto max-w-[22ch] text-[clamp(2.125rem,1.35rem+2.9vw,3.625rem)] font-bold leading-[1.06] tracking-[-0.035em] text-white">
              Productos veterinarios premium para cada práctica
            </h1>
          </RevealItem>

          <RevealItem>
            <p className="mx-auto max-w-[54ch] text-lead text-teal-100">
              Productos farmacéuticos certificados, biológicos y consumibles para
              clínicas, hospitales y distribuidores en República Dominicana.
            </p>
          </RevealItem>

          <RevealItem>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
              {/* WhatsApp is the channel this business actually closes on, so
                  it is the primary action, not a floating button in the corner. */}
              <ButtonLink href={whatsappUrl(WHATSAPP_MESSAGES.general)} size="lg">
                <WhatsappLogo size={18} aria-hidden="true" />
                Cotizar por WhatsApp
              </ButtonLink>
              <ButtonLink href="/productos" variant="inverse" size="lg">
                Ver productos
              </ButtonLink>
            </div>
          </RevealItem>
        </RevealGroup>

        <div className="pb-10 sm:pb-14">
          <HeroStats />
        </div>
      </div>
    </section>
  )
}
