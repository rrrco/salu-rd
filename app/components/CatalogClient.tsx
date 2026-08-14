'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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

/** Reads `--nav-h` in pixels. The sticky bar and the observer that watches it
 *  both hang off the nav's height, and neither should hardcode it. */
function navHeight() {
  return parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
  )
}

/**
 * Reports whether a sticky element has been pinned yet.
 *
 * CSS has no "currently stuck" state, so a 1px sentinel is parked at the
 * element's resting position and the observer's root is pulled down by the
 * nav's own height: the sentinel leaves that box at exactly the moment the
 * element stops moving. A scroll listener would answer the same two-valued
 * question on every frame.
 *
 * Attach `sentinelRef` to a zero-flow element at the sticky element's resting
 * top, not inside the sticky element itself - anything within it is pinned too
 * and would never leave the viewport.
 */
function useStuck() {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: `-${navHeight()}px 0px 0px 0px` }
    )
    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [])

  return { sentinelRef, stuck }
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
  const { sentinelRef, stuck } = useStuck()

  /**
   * Searching from the pinned bar has to leave you looking at the results.
   *
   * Narrowing 64 products to 4 takes the page from 14,000px to 2,400px, and the
   * browser clamps the scroll position to whatever is left. Type "vitamina"
   * from deep in the catalog and you land past the end of your own results,
   * with the search bar pushed off the top by the end of its column.
   *
   * So when a filter changes and the catalog has scrolled above the nav, pull
   * its top back under the nav. That is the search bar's pinned position, so
   * the frame reads bar, filters, count, results, which is where anyone who
   * just typed a query wants to be. Sitting at the top already means the offset
   * is positive and nothing moves, so typing does not fight the page.
   */
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const offset = sentinel.getBoundingClientRect().top - navHeight()
    if (offset < 0) window.scrollBy({ top: offset, behavior: 'instant' })
  }, [query, category, sentinelRef])

  return (
    <div className="relative flex flex-col gap-5">
      {/* Out of flow, so it costs the column no gap slot. It marks where the
          search bar rests, which is the top of the catalog because the search
          is the first thing in it. */}
      <div ref={sentinelRef} aria-hidden="true" className="absolute inset-x-0 top-0 h-px" />

      {/* The search follows you down the catalog. 64 products is a long scroll,
          and a buyer who remembers the name of the reference they want should
          not have to travel back to the top to type it.

          It is a child of the column that spans the whole catalog, not of the
          filter block: a sticky element only travels inside its own parent, and
          nested in a 250px block it would come unpinned almost immediately.

          Only the search sticks. The category chips wrap to three rows on a
          phone, and pinning 120px of filters would spend a sixth of the
          viewport on controls the buyer has usually already set.

          `-my-3 py-3` paints a band 12px taller than the input on each side
          while taking none of that height in flow, so the resting page keeps
          the spacing it had. The negative gutter margin does the same
          horizontally - without it the tiles would scroll past in the strips
          either side of the content column. Background and border arrive only
          once pinned, so nothing about the page at rest changes. */}
      <div
        data-stuck={stuck || undefined}
        className={[
          'sticky top-[var(--nav-h)] z-30',
          '-mx-(--space-gutter) px-(--space-gutter) -my-3 py-3',
          'border-b border-transparent',
          'data-[stuck]:border-border data-[stuck]:bg-bg',
          'transition-[background-color,border-color] duration-[180ms] ease-[var(--ease-out)]',
        ].join(' ')}
      >
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

      {/* `mt-3` on top of the column's own gap keeps the 32px the results had
          under the count when the filters were their own nested block. */}
      {filtered.length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
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
        <Card className="mt-3 items-center gap-4 px-6 py-20 text-center shadow-none">
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
