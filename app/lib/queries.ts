import { groq } from 'next-sanity'

/** Shared projection. Returns the raw image object (asset expanded, hotspot and
 *  crop intact) so `urlFor()` can honour the hotspot and emit a blur LQIP. */
const productFields = groq`
  _id,
  name,
  slug,
  description,
  iconKey,
  image {
    hotspot,
    crop,
    asset-> {
      _id,
      url,
      metadata { lqip, dimensions }
    }
  }
`

export const productsQuery = groq`
  *[_type == "product" && featured == true] | order(order asc) [0..2] {
    ${productFields}
  }
`

export const allProductsQuery = groq`
  *[_type == "product"] | order(order asc, name asc) {
    ${productFields}
  }
`
