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
}

export type SanityProduct = {
  _id: string
  name: string
  slug?: { current: string }
  description?: string
  iconKey?: string
  image?: SanityImage
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
