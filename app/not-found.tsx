import type { Metadata } from 'next'
import Image from 'next/image'
import { ButtonLink } from '@/components/ui/button'
import { RevealGroup, RevealItem } from './components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Página no encontrada',
}

/**
 * Sits at the root, outside `(site)`, so it renders without the marketing
 * chrome: the hero's full-bleed teal field carries the whole viewport and a
 * nav or footer would only dilute it. Both global unmatched URLs and the
 * `notFound()` calls in `productos` land here.
 *
 * 800 is the stat-numeral weight, one step past the hero's 700 - the numeral
 * is the page, so it gets the heaviest cut Poppins loads. Tracking tightens
 * with the weight (see the hero headline note).
 */
export default function NotFound() {
  return (
    <section className="hero-surface on-dark flex min-h-[100dvh] flex-col overflow-hidden">
      <RevealGroup className="mx-auto flex w-full max-w-(--container-content) flex-1 flex-col items-center justify-center gap-6 px-(--space-gutter) py-14 text-center">
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
          <h1 className="text-[clamp(5.5rem,3.5rem+12vw,11rem)] font-extrabold leading-none tracking-[-0.045em] text-white">
            404
          </h1>
        </RevealItem>

        <RevealItem>
          <p className="mx-auto max-w-[46ch] text-lead text-teal-100">
            Esta página no existe o fue movida.
          </p>
        </RevealItem>

        <RevealItem>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/" variant="inverse" size="lg">
              Volver al inicio
            </ButtonLink>
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  )
}
