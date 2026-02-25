import { groq } from 'next-sanity'

export const productsQuery = groq`
  *[_type == "product" && featured == true] | order(order asc) [0..2] {
    _id, name, slug, iconKey, "imageUrl": image.asset->url
  }
`

export const allProductsQuery = groq`
  *[_type == "product"] | order(order asc, name asc) {
    _id, name, slug, iconKey, "imageUrl": image.asset->url
  }
`
