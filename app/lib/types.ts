/** Shape returned by the product projection in `queries.ts`. */
export type SanityImage = {
  asset?: {
    _id: string
    url: string
    metadata?: {
      lqip?: string
      dimensions?: { width: number; height: number; aspectRatio: number }
    }
  }
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string
  /** Package size this photo shows ("30 ml", "1 galón"). Optional: most images
   *  are a single packshot with nothing to disambiguate. */
  label?: string
}

/** Shape returned by `productFields`: everything a catalog tile needs, nothing
 *  more. The grid ships one of these per product, so it stays deliberately thin. */
export type SanityProduct = {
  _id: string
  name: string
  slug?: { current: string }
  description?: string
  iconKey?: string
  image?: SanityImage
}

/** Shape returned by `productDetailFields`. Every added field is optional: a
 *  product with none of them still renders as image, description and CTA. */
export type SanityProductDetail = SanityProduct & {
  presentation?: string
  activeIngredient?: string
  species?: string[]
  administration?: string
  gallery?: SanityImage[]
}

/** Product categories. Values match the `iconKey` option list in the Sanity
 *  schema exactly, so adding one here requires adding it there too. */
export const CATEGORIES = [
  { key: 'antibiotics', label: 'Antibióticos' },
  { key: 'antiparasitic', label: 'Antiparasitarios' },
  { key: 'vaccines', label: 'Vacunas' },
  { key: 'supplements', label: 'Suplementos' },
  { key: 'wounds', label: 'Heridas' },
  { key: 'sedatives', label: 'Sedantes' },
  { key: 'antiinflammatory', label: 'Antiinflamatorios' },
  { key: 'ophthalmic', label: 'Oftálmicos' },
] as const

export type CategoryKey = (typeof CATEGORIES)[number]['key']

/** Target species. Values match the `species` option list in the Sanity schema
 *  exactly, same contract as `CATEGORIES` above. */
export const SPECIES = [
  { key: 'bovino', label: 'Bovino' },
  { key: 'porcino', label: 'Porcino' },
  { key: 'equino', label: 'Equino' },
  { key: 'canino', label: 'Canino' },
  { key: 'felino', label: 'Felino' },
  { key: 'aves', label: 'Aves' },
  { key: 'ovino-caprino', label: 'Ovino y caprino' },
] as const

/** Routes of administration. Values match the `administration` option list. */
export const ADMINISTRATION = [
  { key: 'oral', label: 'Oral' },
  { key: 'inyectable', label: 'Inyectable' },
  { key: 'topica', label: 'Tópica' },
  { key: 'intramamaria', label: 'Intramamaria' },
  { key: 'oftalmica', label: 'Oftálmica' },
] as const

/** Falls back to the raw value so a key added in Studio but not here still
 *  renders something legible instead of disappearing. */
export function labelOf(
  list: ReadonlyArray<{ key: string; label: string }>,
  value?: string
) {
  if (!value) return undefined
  return list.find((item) => item.key === value)?.label ?? value
}
