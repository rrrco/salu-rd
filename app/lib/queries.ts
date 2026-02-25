import { groq } from 'next-sanity'

export const productsQuery = groq`
  *[_type == "product" && featured == true] | order(order asc) {
    _id, name, slug, iconKey, "imageUrl": image.asset->url
  }
`
