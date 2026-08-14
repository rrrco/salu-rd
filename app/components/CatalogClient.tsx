'use client'

import { useMemo, useState } from 'react'
import { MagnifyingGlass, X } from '@phosphor-icons/react/ssr'
import { ProductTile } from './ui/ProductTile'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { CATEGORIES, type SanityProduct } from '../lib/types'

/** Strips diacritics so "oftalmico" matches "oftálmico". */
function normalise(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

export default function CatalogClient({ products }: { products: SanityProduct[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  /** Only offer chips for categories that actually have products. */
  const availableCategories = useMemo(() => {
    const present = new Set(products.map((p) => p.iconKey).filter(Boolean))
    return CATEGORIES.filter((c) => present.has(c.key))
  }, [products])

  const filtered = useMemo(() => {
    const q = normalise(query.trim())
    return products.filter((p) => {
      if (category && p.iconKey !== category) return false
      if (!q) return true
      // Searches description too. The previous build matched on name only, so a
      // product was invisible unless the buyer already knew its brand name.
      return normalise(`${p.name} ${p.description ?? ''}`).includes(q)
    })
  }, [products, query, category])

  const isFiltered = query.trim() !== '' || category !== null

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <div className="relative max-w-md">
          <MagnifyingGlass
            size={20}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle"
          />
          <label htmlFor="catalog-search" className="sr-only">
            Buscar productos
          </label>
          <Input
            id="catalog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o descripción"
            className="pl-11 pr-10"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-fg-subtle transition-colors duration-[180ms] ease-[var(--ease-out)] hover-fine:text-fg"
            >
              <X size={16} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {availableCategories.length > 1 ? (
          /* Single-select group: Radix gives the chip row roving-tabindex
             arrow-key navigation and `aria-pressed` semantics for free.
             Deselecting the active chip yields '' - mapped back to "all". */
          <ToggleGroup
            type="single"
            variant="chip"
            aria-label="Filtrar por categoría"
            value={category ?? 'all'}
            onValueChange={(value) => setCategory(!value || value === 'all' ? null : value)}
          >
            <ToggleGroupItem value="all">Todos</ToggleGroupItem>
            {availableCategories.map((c) => (
              <ToggleGroupItem key={c.key} value={c.key}>
                {c.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        ) : null}

        <p className="font-semibold text-xs uppercase tracking-[0.08em] text-fg-subtle" aria-live="polite">
          {filtered.length === 1
            ? '1 producto'
            : `${filtered.length} productos`}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {/* Two columns from the narrowest phone up. One column at 390px meant
              a single tile filled the viewport and the catalog read as 64
              full-screen pages; two puts four products in view at once, which
              is what a buyer scanning for a reference needs. The tiles go
              compact on their own at that width - see ProductTile. */}
          {filtered.map((product, i) => (
            <ProductTile key={product._id} product={product} priority={i < 4} />
          ))}
        </div>
      ) : (
        <Card className="items-center gap-4 px-6 py-20 text-center shadow-none">
          <h2 className="text-h3 font-semibold">
            {products.length === 0
              ? 'El catálogo no está disponible'
              : 'Sin resultados'}
          </h2>
          <p className="max-w-[46ch] text-fg-muted">
            {products.length === 0
              ? 'No pudimos cargar los productos en este momento. Escríbenos y te enviamos el catálogo directamente.'
              : 'No encontramos productos que coincidan. Prueba con otro término o escríbenos y lo buscamos por ti.'}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {isFiltered && products.length > 0 ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('')
                  setCategory(null)
                }}
                className="px-6 text-xs uppercase tracking-[0.06em]"
              >
                Limpiar filtros
              </Button>
            ) : null}
            <ButtonLink href="/#contact">Cotizar</ButtonLink>
          </div>
        </Card>
      )}
    </div>
  )
}
