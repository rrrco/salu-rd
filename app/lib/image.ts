import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './sanity'
import type { SanityImage } from './types'

const builder = createImageUrlBuilder(client)

/**
 * Build a Sanity CDN URL with the hotspot honoured.
 *
 * The schema sets `hotspot: true` on the product image, which the previous
 * build ignored by reading `image.asset->url` directly and shipping full-size
 * originals.
 *
 * `aspect` requests a crop box: the builder turns width/height into a `rect`
 * param anchored on the hotspot. The final pixel width is chosen per breakpoint
 * by `imageLoader`, so the size passed here only sets the crop shape, not the
 * delivered resolution.
 */
export function urlFor(source: SanityImage, aspect: 'square' | 'natural' = 'square') {
  const b = builder.image(source).auto('format').quality(78)
  // The requested size only sets the crop shape. `imageLoader` replaces `w` per
  // breakpoint and clamps it to the source, so nothing is ever upscaled.
  if (aspect === 'square') return b.width(1200).height(1200).fit('crop').url()
  return b.width(1600).url()
}

/** Base64 LQIP from Sanity's asset metadata, for `next/image` blur placeholder. */
export function blurOf(source?: SanityImage) {
  return source?.asset?.metadata?.lqip
}
