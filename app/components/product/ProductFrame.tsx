import Image from 'next/image'
import { CategoryIcon } from '../../lib/icons'

/** A resolved image, ready to render. Built server-side by `ProductMedia` so
 *  `urlFor()` and the Sanity client never reach the browser bundle. */
export type Frame = { src: string; blur?: string }

/**
 * The product photo, in the frame `ProductTile` established.
 *
 * 4:5 to match the source shots, `object-contain` on white because these are
 * packshots and the whole product has to be visible. White ground, not a tint:
 * every packshot is shot on white, so a tinted ground shows as coloured bands
 * where the contained image does not reach.
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
        <Image
          src={frame.src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={frame.blur ? 'blur' : undefined}
          blurDataURL={frame.blur}
          className="object-contain"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-accent-deep">
          <CategoryIcon iconKey={iconKey} size={96} />
        </div>
      )}
    </div>
  )
}
