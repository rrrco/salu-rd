'use client'

import { useMemo, useState } from 'react'
import { MagnifyingGlass, X } from '@phosphor-icons/react/ssr'
import { ProductTile } from './ui/ProductTile'
import { ButtonLink } from './ui/Button'
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
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle"
          />
          <label htmlFor="catalog-search" className="sr-only">
            Buscar productos
          </label>
          <input
            id="catalog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o descripción"
            className="w-full rounded-sm border border-border-strong bg-surface py-3 pl-11 pr-10 text-body text-fg placeholder:text-fg-subtle transition-[border-color] duration-[180ms] ease-[var(--ease-out)] focus:border-accent focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-fg-subtle transition-colors duration-[180ms] ease-[var(--ease-out)] hover-fine:text-fg"
            >
              <X size={14} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {availableCategories.length > 1 ? (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
            <CategoryChip
              label="Todos"
              active={category === null}
              onClick={() => setCategory(null)}
            />
            {availableCategories.map((c) => (
              <CategoryChip
                key={c.key}
                label={c.label}
                active={category === c.key}
                onClick={() => setCategory(category === c.key ? null : c.key)}
              />
            ))}
          </div>
        ) : null}

        <p className="font-semibold text-xs uppercase tracking-[0.08em] text-fg-subtle" aria-live="polite">
          {filtered.length === 1
            ? '1 producto'
            : `${filtered.length} productos`}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, i) => (
            <ProductTile key={product._id} product={product} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-surface px-6 py-20 text-center">
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
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setCategory(null)
                }}
                className="inline-flex h-11 items-center justify-center rounded-md border border-border-strong px-6 font-semibold text-xs uppercase tracking-[0.06em] font-medium text-fg transition-[border-color,color] duration-[180ms] ease-[var(--ease-out)] active:scale-[0.97] hover-fine:border-accent hover-fine:text-accent"
              >
                Limpiar filtros
              </button>
            ) : null}
            <ButtonLink href="/#contact">Cotizar</ButtonLink>
          </div>
        </div>
      )}
    </div>
  )
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'rounded-full border px-4 py-2 font-semibold text-xs uppercase tracking-[0.06em]',
        'transition-[background-color,border-color,color] duration-[180ms] ease-[var(--ease-out)]',
        'active:scale-[0.97]',
        active
          ? 'border-accent bg-brand text-on-brand'
          : 'border-border bg-surface text-fg-muted hover-fine:border-accent hover-fine:text-accent',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
