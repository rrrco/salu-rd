import { groq } from 'next-sanity'

/** Shared image projection. Returns the raw image object (asset expanded,
 *  hotspot and crop intact) so `urlFor()` can honour the hotspot and emit a
 *  blur LQIP. `label` is the package size this particular photo shows — see the
 *  image fields in `sanity/schemas/product.ts`. */
const imageFields = groq`
  label,
  hotspot,
  crop,
  asset-> {
    _id,
    url,
    metadata { lqip, dimensions }
  }
`

/** Card projection. The catalog ships one of these per product, so it carries
 *  only what a tile draws. The spec fields live in `productDetailFields`.
 *
 *  `sizes` is the package sizes the product comes in, read off the photos that
 *  show them. Projected as bare strings rather than by shipping the gallery to
 *  the tile: the tile draws three words, and the assets behind them would be
 *  64 products' worth of payload for a grid that renders one image each.
 *  `coalesce` covers a product with no gallery at all, where `gallery[].label`
 *  is null and null would swallow the whole concatenation. */
const productFields = groq`
  _id,
  name,
  slug,
  description,
  iconKey,
  image { ${imageFields} },
  "sizes": array::compact([image.label] + coalesce(gallery[].label, []))
`

/** Detail projection: the card plus the technical sheet and the gallery. */
const productDetailFields = groq`
  ${productFields},
  presentation,
  activeIngredient,
  species,
  administration,
  gallery[] { ${imageFields} }
`

/** The home page trio. `order` exists for exactly this list — the three
 *  products the business wants seen first. Everywhere else is alphabetical. */
export const productsQuery = groq`
  *[_type == "product" && featured == true] | order(order asc) [0..2] {
    ${productFields}
  }
`

export const allProductsQuery = groq`
  *[_type == "product"] | order(name asc) {
    ${productFields}
  }
`

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    ${productDetailFields}
  }
`

/** Feeds `generateStaticParams`. Guards on `defined()` because slug was optional
 *  before it became a route key, so older documents may still lack one. */
export const productSlugsQuery = groq`
  *[_type == "product" && defined(slug.current)].slug.current
`

/**
 * The product page in one round trip.
 *
 * `related` is nested rather than fetched after the product, because it needs
 * the product's `iconKey` and asking for it separately means waiting for the
 * first response before the second can even start. `^` reaches the enclosing
 * product, so Sanity resolves both in a single pass.
 *
 * Four siblings in the same category, current product excluded. Nothing rather
 * than unrelated products: a wrong suggestion is worse than no suggestion when
 * the buyer is comparing medicines.
 */
export const productPageQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    ${productDetailFields},
    "related": *[
      _type == "product" &&
      iconKey == ^.iconKey &&
      _id != ^._id &&
      defined(slug.current)
    ] | order(name asc) [0..3] {
      ${productFields}
    }
  }
`
