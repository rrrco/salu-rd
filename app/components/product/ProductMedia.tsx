import { urlFor, blurOf } from '../../lib/image'
import type { SanityProductDetail } from '../../lib/types'
import { ProductFrame, type Frame } from './ProductFrame'
import { ProductGallery } from './ProductGallery'

/**
 * Resolves the product's images and picks the right presentation.
 *
 * The URLs are built here, on the server, so `urlFor()` and the Sanity client
 * stay out of the browser bundle: the gallery receives plain strings. The photo's
 * package size travels with its URL, in the order the CMS holds it — the main
 * image, then the gallery — because there is no size to sort by that survives
 * `100 pcs LATEX` and `18gx1 1/2"`, both real labels in this dataset.
 *
 * Three cases, in order of how common they are: one photo renders a static
 * frame, several mount the gallery, none falls through to the category icon so
 * the layout can never collapse, whatever the CMS contains.
 */
export function ProductMedia({
  product,
  sizes,
  priority = false,
}: {
  product: SanityProductDetail
  sizes: string
  priority?: boolean
}) {
  const frames: Frame[] = [product.image, ...(product.gallery ?? [])]
    .filter((image) => Boolean(image?.asset))
    .map((image) => ({
      src: urlFor(image!, 'natural'),
      blur: blurOf(image),
      label: image!.label,
    }))

  if (frames.length > 1) {
    return (
      <ProductGallery frames={frames} alt={product.name} sizes={sizes} priority={priority} />
    )
  }

  return (
    <ProductFrame
      frame={frames[0]}
      alt={product.name}
      iconKey={product.iconKey}
      sizes={sizes}
      priority={priority}
    />
  )
}
