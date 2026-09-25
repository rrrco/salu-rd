import { cache } from 'react'
import { client } from './sanity'
import { productBySlugQuery, productPageQuery } from './queries'
import type { SanityProduct, SanityProductDetail } from './types'

/**
 * Product reads, deduplicated per request.
 *
 * `generateMetadata` and the page component both need the same product, and
 * Next calls them separately. Without `cache()` that is two round trips to
 * Sanity for one page view, doubling the time to first byte for no reason.
 * `cache()` gives them one shared promise for the life of the request.
 *
 * The key is the slug string, not an object: `cache()` compares arguments with
 * `Object.is`, so an inline object would allocate a fresh reference on every
 * call and never hit.
 *
 * Both readers swallow errors. Every other Sanity read on this site does the
 * same, and the caller turns an empty result into a 404, which is a working
 * page. The alternative is an unstyled crash on a network blip.
 *
 * Both take the slug exactly as the route params hand it over, which is still
 * percent-encoded: `/productos/vitaminas-b+k` arrives as `vitaminas-b%2Bk` and
 * matches no document unless it is decoded first. A malformed escape makes
 * `decodeURIComponent` throw, which the catch turns into a 404 like any other
 * unknown slug.
 */

export type ProductPageData = SanityProductDetail & { related?: SanityProduct[] }

/** The product plus its related siblings, in one query. Used by the page. */
export const getProductPage = cache(async (slug: string): Promise<ProductPageData | null> => {
  try {
    return await client.fetch(productPageQuery, { slug: decodeURIComponent(slug) })
  } catch {
    return null
  }
})

/** The product alone. Used by the overlay, which shows no related products, so
 *  asking for them would be payload the buyer never sees. */
export const getProduct = cache(async (slug: string): Promise<SanityProductDetail | null> => {
  try {
    return await client.fetch(productBySlugQuery, { slug: decodeURIComponent(slug) })
  } catch {
    return null
  }
})
