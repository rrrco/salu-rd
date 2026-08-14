import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button'
import { CategoryIcon, WhatsAppIcon } from '../../lib/icons'
import { whatsappUrl, WHATSAPP_MESSAGES } from '../../lib/site'
import { urlFor, blurOf } from '../../lib/image'
import type { SanityProduct } from '../../lib/types'

/**
 * Upgrade hover and touchstart to a full prefetch.
 *
 * The overlay is a dynamic route, so Next's default prefetch stops at the
 * nearest `loading.js` and this route has none: nothing useful arrives before
 * the click. Hovering is the cheapest signal of intent there is, so the fetch
 * starts while the pointer is still travelling and the panel is already in
 * memory by the time the button goes down. Requires
 * `experimental.dynamicOnHover` in next.config.ts; both halves are needed.
 *
 * Spread rather than written inline because `next/link` is aliased to the App
 * Router implementation at build time, which supports this prop, while the
 * types it ships are the Pages Router ones, which do not declare it. Verified
 * against next@16.1.6 (`create-compiler-aliases.js` maps `link` to
 * `next/dist/client/app-dir/link`). Recheck this on a major Next upgrade: if
 * the prop is dropped, the tiles quietly stop prefetching.
 *
 * Prefetching is production-only. In `next dev` this does nothing, so measure
 * against `next build && next start`.
 */
const PREFETCH_ON_INTENT = { unstable_dynamicOnHover: true }

/**
 * Tier 2 imagery: uniformity.
 *
 * The available product photography has backgrounds and mixed lighting, so the
 * tile does the normalising. Fixed 4:5 frame, `object-contain`, white ground.
 * No cutouts required.
 *
 * A product with no image falls through to its `iconKey` icon, so the grid can
 * never break, whatever the CMS contains.
 *
 * The whole tile is a link to the product, via a stretched pseudo-element on
 * the heading rather than an anchor wrapped around the card. One link, one
 * accessible name (the product name), a card-sized hit target, and the
 * WhatsApp button stays a sibling instead of an anchor nested inside another.
 *
 * A product with no slug has nowhere to go, so it loses the link *and* the
 * hover affordances. A border that lifts to accent on a card that cannot be
 * clicked promises something that never happens (DESIGN.md 9).
 *
 * Padding tightens below 240px of *tile* width, not below a viewport
 * breakpoint. The same phone shows this tile at ~169px in the catalog's
 * two-column grid and at full width on the home page, so a `sm:` rule would
 * squeeze the wrong one. One container query, and the tile is correct in both
 * grids and at every desktop column count without a prop to thread through.
 */
export function ProductTile({
  product,
  priority = false,
  sizes = '(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw',
}: {
  product: SanityProduct
  priority?: boolean
  sizes?: string
}) {
  const hasImage = Boolean(product.image?.asset)
  const blur = blurOf(product.image)
  /* Deduplicated: two photos of the same size are two shots of one box, and the
     tile would otherwise repeat the label. */
  const presentations = [...new Set(product.sizes ?? [])]
  const href = product.slug?.current ? `/productos/${product.slug.current}` : null

  return (
    <article
      className={[
        // `on-light` keeps the tile a white card even inside a dark band, which
        // is the composition the brand has always used and avoids the tile
        // splitting into a light image half and a dark text half.
        'on-light group @container relative flex h-full flex-col overflow-hidden rounded-lg',
        'border border-border bg-surface',
        'transition-[border-color,box-shadow,transform] duration-[180ms] ease-[var(--ease-out)]',
        href ? 'hover-fine:border-accent hover-fine:shadow-md' : '',
        // Press feedback on the card itself, scoped to the tile link so tapping
        // the WhatsApp button does not shrink the whole card underneath it.
        href ? 'has-[[data-tile-link]:active]:scale-[0.99] has-[[data-tile-link]:active]:duration-[100ms]' : '',
        'motion-reduce:transition-[border-color,box-shadow]',
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
      <div className="relative aspect-[4/5] overflow-hidden border-b border-border bg-white p-4 @max-[240px]:p-2.5">
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
              href ? 'hover-fine:group-hover:scale-[1.03]' : '',
              'motion-reduce:transform-none',
            ].join(' ')}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-accent-deep">
            <CategoryIcon iconKey={product.iconKey} size={64} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 @max-[240px]:gap-2 @max-[240px]:p-3.5">
        <h3 className="text-h3 font-medium text-fg">
          {href ? (
            <Link
              href={href}
              data-tile-link
              {...PREFETCH_ON_INTENT}
              className={[
                'after:absolute after:inset-0 after:content-[""]',
                'transition-colors duration-[180ms] ease-[var(--ease-out)]',
                'hover-fine:text-accent',
                // The ring belongs on the stretched pseudo-element, so keyboard
                // focus outlines the whole card rather than the heading text.
                'focus-visible:outline-none',
                'focus-visible:after:rounded-lg focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-[var(--color-focus)]',
              ].join(' ')}
            >
              {product.name}
            </Link>
          ) : (
            product.name
          )}
        </h3>
        {product.description && (
          <p className="line-clamp-2 text-sm text-fg-muted">{product.description}</p>
        )}

        {/* The foot: the sizes and the button, pushed to the bottom together.

            Anchoring is what keeps a row of tiles legible. Eleven of the 64
            product names wrap to two lines, and anything sitting under a name
            drops with it, so the sizes on one tile landed a line below the
            sizes on its neighbours. The button never had that problem because
            it was already anchored, so the fix is to put the sizes inside its
            anchor rather than to reserve a second line under every name and buy
            an empty row on the 53 tiles that do not need it.

            It also reads better: the size is the thing the buyer is about to
            ask the price of, and it now sits directly above the button that
            asks. */}
        <div className="mt-auto flex flex-col gap-3 @max-[240px]:gap-2">
          {/* Labelled, not bare numbers: `4 kg` on its own could be read as a
              dose. Singular when there is one, because 29 of the 64 products
              have exactly one and "Presentaciones: 4 kg" reads as a list that
              lost its other entries.

              Nothing renders when no photo carries a size, so the 22 products
              without one keep the tile they have today. */}
          {presentations.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-fg-subtle">
                {presentations.length === 1 ? 'Presentación' : 'Presentaciones'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {presentations.map((size) => (
                  <Badge key={size} variant="outline" className="tabular-nums">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Sits above the stretched link so it stays its own target, and it is
              prefilled with this product's name: the chat opens already saying
              what the buyer was looking at. */}
          {/* The 20px side padding is wider than a 134px tile can afford - at a
              320px viewport the label starts eating into it. Trading it for
              12px on a compact tile costs nothing, since `w-full` sets the
              width and the padding only ever decides the minimum. */}
          <ButtonLink
            href={whatsappUrl(WHATSAPP_MESSAGES.product(product.name))}
            className="relative z-10 w-full @max-[240px]:px-3"
          >
            <WhatsAppIcon />
            Cotizar
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}
