import { ArrowRight } from '@phosphor-icons/react/ssr'
import { ButtonLink } from '../ui/Button'
import { ProductTile } from '../ui/ProductTile'
import { SectionHead } from '../ui/Section'
import { Reveal } from '../ui/Reveal'
import type { SanityProduct } from '../../lib/types'

/**
 * Light band.
 *
 * This was the page's dark section until the hero became a full-bleed teal
 * field. Two deep-teal bands in a row read as one long muddy stretch, and the
 * products lost the separation that made them the focus. The dark moments are
 * now the hero and the closing CTA, bookending a light middle.
 *
 * Product photography also reads better on a light ground, which is what a
 * catalog section is for.
 *
 * This section holds the page's second and last eyebrow. See DESIGN.md 5.
 */
export function FeaturedProducts({ products }: { products: SanityProduct[] }) {
  return (
    <section id="products" className="bg-teal-50">
      <div className="mx-auto max-w-(--container-content) px-(--space-gutter) py-(--space-section)">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            id="products-title"
            eyebrow="Catálogo"
            title="Productos más vendidos"
          />
          <ButtonLink href="/productos" className="group shrink-0">
            Ver catálogo
            {/* Nudges forward on hover: the arrow means "onward", so it should
                move that way when the pointer arrives. */}
            <ArrowRight
              size={15}
              aria-hidden="true"
              className="transition-transform duration-[180ms] ease-[var(--ease-out)] hover-fine:group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </ButtonLink>
        </Reveal>

        {products.length > 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <Reveal key={product._id} delay={i * 0.06} className="h-full">
                <ProductTile
                  product={product}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </Reveal>
            ))}
          </div>
        ) : (
          /* Sanity is unreachable. Degrade to a route out, never a broken grid. */
          <div className="mt-12 rounded-lg border border-border p-12 text-center">
            <p className="text-lead text-fg-muted">
              El catálogo no está disponible en este momento.
            </p>
            <ButtonLink href="#contact" className="mt-6">
              Solicitar por WhatsApp
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  )
}
