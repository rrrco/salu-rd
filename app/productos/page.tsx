import type { Metadata } from 'next'
import Link from 'next/link'
import { CaretLeft } from '@phosphor-icons/react/ssr'
import { client } from '../lib/sanity'
import { allProductsQuery } from '../lib/queries'
import type { SanityProduct } from '../lib/types'
import CatalogClient from '../components/CatalogClient'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Catálogo de Productos',
  description:
    'Explora el catálogo completo de productos farmacéuticos, biológicos y consumibles veterinarios de SALU División Veterinaria.',
}

export default async function ProductosPage() {
  let products: SanityProduct[] = []
  try {
    products = await client.fetch(allProductsQuery)
  } catch {
    products = []
  }

  return (
    <>
      <header data-bar-color="#e6f4f6" className="border-b border-border bg-teal-50">
        <div className="mx-auto max-w-(--container-content) px-(--space-gutter) py-14">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 font-semibold text-xs uppercase tracking-[0.08em] text-fg-muted transition-colors duration-[180ms] ease-[var(--ease-out)] hover-fine:text-accent"
          >
            <CaretLeft size={14} aria-hidden="true" />
            Volver al inicio
          </Link>
          <h1 className="max-w-[18ch] text-h1 font-semibold">Catálogo de productos</h1>
          <p className="mt-4 max-w-[var(--width-prose)] text-lead text-fg-muted">
            Medicamentos, biológicos y consumibles certificados. Solicita precios y
            disponibilidad de cualquier referencia.
          </p>
        </div>
      </header>

      <div data-bar-color="#fbfcfc" className="mx-auto max-w-(--container-content) px-(--space-gutter) py-(--space-section)">
        <CatalogClient products={products} />
      </div>
    </>
  )
}
