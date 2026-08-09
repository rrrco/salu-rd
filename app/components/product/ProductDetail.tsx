import type { ReactNode } from 'react'
import { WhatsappLogo } from '@phosphor-icons/react/ssr'
import { Badge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button'
import { CATEGORIES, labelOf, type SanityProductDetail } from '../../lib/types'
import { whatsappUrl, WHATSAPP_MESSAGES } from '../../lib/site'
import { ProductMedia } from './ProductMedia'
import { ProductSpecs } from './ProductSpecs'

/**
 * The product, as read by a buyer. One component, two containers.
 *
 * The overlay and the standalone page show the same thing at different scales,
 * so the arrangement is shared and only the grid ratio, the gaps and the image
 * `sizes` differ. Writing this twice is how the two views drift apart, and a
 * catalog whose overlay says something different to its page is worse than
 * having no overlay at all.
 *
 * The page passes its `h1` in as `title`; the modal does not, because there the
 * name belongs in the sticky dialog bar where it cannot scroll away.
 *
 * The media is capped rather than left to fill its column. These are packshots
 * on white, so a frame scaled to a 500px column is mostly empty white with a
 * sachet in the middle, and it buries the copy that answers the buyer's actual
 * question. The product should be legible, not monumental.
 */
export function ProductDetail({
  product,
  title,
  variant,
}: {
  product: SanityProductDetail
  title?: ReactNode
  variant: 'modal' | 'page'
}) {
  const isPage = variant === 'page'
  const category = labelOf(CATEGORIES, product.iconKey)

  return (
    <div
      className={
        isPage
          ? 'grid gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start lg:gap-16'
          : 'grid gap-6 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center sm:gap-8'
      }
    >
      {/* The column is a fixed track, so the frame fills it. Below the split the
          grid is one column and the frame would run the full width, hence the
          cap and the centring. */}
      <div
        className={[
          'mx-auto w-full',
          isPage
            ? 'max-w-[20rem] lg:mx-0 lg:max-w-none lg:sticky lg:top-[calc(var(--nav-h)+2rem)]'
            : 'max-w-[13rem] sm:mx-0 sm:max-w-none',
        ].join(' ')}
      >
        <ProductMedia
          product={product}
          priority={isPage}
          sizes={isPage ? '(min-width: 1024px) 352px, 320px' : '(min-width: 640px) 240px, 208px'}
        />
      </div>

      <div className="flex flex-col items-start gap-5">
        {category ? (
          <Badge className="uppercase tracking-[0.08em]">{category}</Badge>
        ) : null}

        {title ?? null}

        {product.description ? (
          <p className="max-w-(--width-prose) text-lead text-fg-muted">{product.description}</p>
        ) : null}

        <ProductSpecs product={product} />

        {/* WhatsApp is what this business closes on, so it is the primary
            control here as it is everywhere else, prefilled with the product
            name so the chat opens already saying what the buyer was reading. */}
        <div className="mt-1 flex w-full flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={whatsappUrl(WHATSAPP_MESSAGES.product(product.name))}
            size={isPage ? 'lg' : 'md'}
            className="w-full sm:w-auto"
          >
            <WhatsappLogo size={18} aria-hidden="true" />
            Cotizar por WhatsApp
          </ButtonLink>
          <ButtonLink
            href="/#contact"
            variant="secondary"
            size={isPage ? 'lg' : 'md'}
            className="w-full sm:w-auto"
          >
            Escríbenos
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}
