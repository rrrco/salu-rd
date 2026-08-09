import Image from 'next/image'
import { ButtonLink } from './Button'
import { WhatsappLogo } from '@phosphor-icons/react/ssr'
import { CategoryIcon } from '../../lib/icons'
import { whatsappUrl, WHATSAPP_MESSAGES } from '../../lib/site'
import { urlFor, blurOf } from '../../lib/image'
import type { SanityProduct } from '../../lib/types'

/**
 * Tier 2 imagery: uniformity.
 *
 * The available product photography has backgrounds and mixed lighting, so the
 * tile does the normalising. Fixed 1:1 frame, `object-cover`, one gradient
 * ground. No cutouts required.
 *
 * A product with no image falls through to its `iconKey` icon, so the grid can
 * never break, whatever the CMS contains.
 */
export function ProductTile({
  product,
  priority = false,
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw',
}: {
  product: SanityProduct
  priority?: boolean
  sizes?: string
}) {
  const hasImage = Boolean(product.image?.asset)
  const blur = blurOf(product.image)

  return (
    <article
      className={[
        // `on-light` keeps the tile a white card even inside a dark band, which
        // is the composition the brand has always used and avoids the tile
        // splitting into a light image half and a dark text half.
        'on-light group flex h-full flex-col overflow-hidden rounded-lg',
        'border border-border bg-surface',
        'transition-[border-color,box-shadow] duration-[180ms] ease-[var(--ease-out)]',
        'hover-fine:border-accent',
        'hover-fine:shadow-md',
      ].join(' ')}
    >
      {/* A 4:5 frame, matching the source shots (941x1136). The previous square
          crop cut 195px off the bottom of every product.

          `object-contain` with padding, not `object-cover`: these are packshots,
          not scenery. The whole product has to be visible or the buyer cannot
          tell what they are looking at.

          The ground is white, not a teal gradient. Every packshot is shot on
          white, so a tinted ground showed as coloured bands above and below the
          product where the contained image did not reach. White makes the
          photo's own background disappear into the card. */}
      <div className="relative aspect-[4/5] overflow-hidden border-b border-border bg-white p-4">
        {hasImage ? (
          <Image
            src={urlFor(product.image!, 'natural')}
            alt={product.name}
            fill
            sizes={sizes}
            priority={priority}
            placeholder={blur ? 'blur' : undefined}
            blurDataURL={blur}
            className={[
              'object-contain',
              'transition-transform duration-[420ms] ease-[var(--ease-out)]',
              'hover-fine:group-hover:scale-[1.03]',
              'motion-reduce:transform-none',
            ].join(' ')}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-accent-deep">
            <CategoryIcon iconKey={product.iconKey} size={64} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-h3 font-medium text-fg">{product.name}</h3>
        {product.description && (
          <p className="line-clamp-3 text-sm text-fg-muted">{product.description}</p>
        )}
        {/* Primary, and prefilled with this product's name: the chat opens
            already saying what the buyer was looking at. */}
        <ButtonLink
          href={whatsappUrl(WHATSAPP_MESSAGES.product(product.name))}
          className="mt-auto w-full"
        >
          <WhatsappLogo size={16} aria-hidden="true" />
          Cotizar
        </ButtonLink>
      </div>
    </article>
  )
}

/** Matches the tile's shape so the grid does not reflow while loading. */
export function ProductTileSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface">
      <div className="aspect-[4/5] animate-pulse bg-surface-sunken" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded-sm bg-surface-sunken" />
        <div className="h-4 w-full animate-pulse rounded-sm bg-surface-sunken" />
        <div className="h-4 w-2/3 animate-pulse rounded-sm bg-surface-sunken" />
        <div className="mt-auto h-11 w-full animate-pulse rounded-md bg-surface-sunken" />
      </div>
    </div>
  )
}
