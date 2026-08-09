import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CaretLeft } from '@phosphor-icons/react/ssr'
import { client } from '../../lib/sanity'
import { productSlugsQuery } from '../../lib/queries'
import { getProductPage } from '../../lib/products'
import { urlFor } from '../../lib/image'
import { ProductDetail } from '../../components/product/ProductDetail'
import { ProductTile } from '../../components/ui/ProductTile'

export const revalidate = 60

/* Opens on the light teal-50 bar, so the iOS status-bar inset matches it
   instead of the site's dark default. Same treatment as /productos. */
export const viewport: Viewport = {
  themeColor: '#e6f4f6',
}

export async function generateStaticParams() {
  try {
    const slugs: string[] = await client.fetch(productSlugsQuery)
    return slugs.map((slug) => ({ slug }))
  } catch {
    /* No prerendered products rather than a failed build. The route still
       renders on demand and revalidates. */
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  // Shares one request-scoped fetch with the page component below.
  const product = await getProductPage(slug)

  if (!product) return { title: 'Producto no encontrado' }

  const description =
    product.description ??
    `${product.name}. Solicita precio y disponibilidad a SALU División Veterinaria.`

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      type: 'website',
      images: product.image?.asset ? [{ url: urlFor(product.image, 'natural') }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductPage(slug)

  if (!product) notFound()

  const related = product.related ?? []

  return (
    <>
      <div data-overscroll-ground="light" data-bar-color="#e6f4f6" className="border-b border-border bg-teal-50">
        <div className="mx-auto max-w-(--container-content) px-(--space-gutter) py-5">
          <Link
            href="/productos"
            className="inline-flex items-center gap-1.5 font-semibold text-xs uppercase tracking-[0.08em] text-fg-muted transition-colors duration-[180ms] ease-[var(--ease-out)] hover-fine:text-accent"
          >
            <CaretLeft size={14} aria-hidden="true" />
            Volver al catálogo
          </Link>
        </div>
      </div>

      <div data-bar-color="#fbfcfc" className="mx-auto max-w-(--container-content) px-(--space-gutter) py-(--space-section)">
        <ProductDetail
          product={product}
          variant="page"
          title={<h1 className="text-h1 font-semibold text-fg">{product.name}</h1>}
        />

        {/* Same category only. A wrong suggestion is worse than no suggestion
            when the buyer is comparing medicines. */}
        {related.length > 0 ? (
          <section className="mt-(--space-section) border-t border-border pt-12">
            <h2 className="text-h2 font-semibold text-fg">Productos relacionados</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductTile key={item._id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  )
}
