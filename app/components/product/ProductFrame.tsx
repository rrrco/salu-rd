import Image from 'next/image'
import { CategoryIcon } from '../../lib/icons'

/** A resolved image, ready to render. Built server-side by `ProductMedia` so
 *  `urlFor()` and the Sanity client never reach the browser bundle. `label` is
 *  the package size this photo shows ("30 ml", "1 L"), absent on most products. */
export type Frame = { src: string; blur?: string; label?: string }

/**
 * The product photo, in the frame `ProductTile` established.
 *
 * 4:5 to match the source shots, `object-contain` on white because these are
 * packshots and the whole product has to be visible. White ground, not a tint:
 * every packshot is shot on white, so a tinted ground shows as coloured bands
 * where the contained image does not reach.
 *
 * A frame that knows its package size says so, top left, where the contained
 * packshot leaves white. The same product is shot once per size and the shots
 * are near identical at a glance, so without the size the buyer is looking at
 * three photos of the same bottle. It rides the frame rather than the thumbnail
 * row alone, so a product with a single labelled photo — most of the labelled
 * catalog — states its size too.
 *
 * No `'use client'` and no server-only imports, so the same component renders
 * on the server for a single image and inside the client gallery for several.
 */
export function ProductFrame({
  frame,
  alt,
  iconKey,
  priority = false,
  sizes,
  className,
}: {
  frame?: Frame
  alt: string
  iconKey?: string
  priority?: boolean
  sizes: string
  className?: string
}) {
  return (
    <div
      className={[
        'relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-white p-6 sm:p-8',
        className ?? '',
      ].join(' ')}
    >
      {frame ? (
        <>
          <Image
            src={frame.src}
            alt={frame.label ? `${alt} — ${frame.label}` : alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder={frame.blur ? 'blur' : undefined}
            blurDataURL={frame.blur}
            className="object-contain"
          />
          {frame.label ? (
            <span className="absolute left-3 top-3 rounded-full border border-border bg-surface/90 px-2.5 py-0.5 text-xs font-medium text-fg-muted">
              {frame.label}
            </span>
          ) : null}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-accent-deep">
          <CategoryIcon iconKey={iconKey} size={96} />
        </div>
      )}
    </div>
  )
}
