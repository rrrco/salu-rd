import { Badge } from '@/components/ui/badge'
import { ADMINISTRATION, SPECIES, labelOf, type SanityProductDetail } from '../../lib/types'

type Row = { term: string; value: React.ReactNode }

/**
 * The technical sheet, as a definition list.
 *
 * Every field is optional in the CMS, and a row with nothing in it is worse
 * than no row: an empty table reads as missing data rather than as data that
 * does not apply. So rows are built from what exists, and the whole block
 * returns null when nothing does. A product with no spec data degrades to
 * image, description and CTA, which is exactly what the catalog shows today.
 */
export function ProductSpecs({ product }: { product: SanityProductDetail }) {
  const species = (product.species ?? [])
    .map((key) => labelOf(SPECIES, key))
    .filter(Boolean) as string[]

  const rows: Row[] = []

  if (product.presentation) {
    rows.push({ term: 'Presentación', value: product.presentation })
  }
  if (product.activeIngredient) {
    rows.push({ term: 'Principio activo', value: product.activeIngredient })
  }
  if (product.administration) {
    rows.push({ term: 'Vía', value: labelOf(ADMINISTRATION, product.administration) })
  }
  if (species.length > 0) {
    rows.push({
      term: 'Especies',
      value: (
        <span className="flex flex-wrap gap-1.5">
          {species.map((label) => (
            <Badge key={label} variant="outline">
              {label}
            </Badge>
          ))}
        </span>
      ),
    })
  }

  if (rows.length === 0) return null

  return (
    <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border">
      {rows.map((row) => (
        <div
          key={row.term}
          className="grid gap-1 bg-surface px-4 py-3.5 sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-4"
        >
          <dt className="font-semibold text-xs uppercase tracking-[0.08em] text-fg-subtle">
            {row.term}
          </dt>
          <dd className="text-sm text-fg">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
