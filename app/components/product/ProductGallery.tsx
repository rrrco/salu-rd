'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProductFrame, type Frame } from './ProductFrame'

/**
 * Several photos of one product: the main frame plus a thumbnail row.
 *
 * The photos are usually the same product in different package sizes, so each
 * thumbnail is captioned with the size it shows and the active size is repeated
 * on the frame. Without that the row is three near-identical bottles and the
 * buyer has no way to ask for the one they want.
 *
 * Thumbnails, not arrows. A carousel earns its place only when there is more
 * breadth than the screen can hold (DESIGN.md 9), and a product has three or
 * four shots at most, all of which fit in one row. Showing every option beats
 * hiding them behind a next button nobody presses.
 *
 * Only mounted when there is more than one image, so a single-photo product
 * ships no client JavaScript for its media.
 */
export function ProductGallery({
  frames,
  alt,
  sizes,
  priority = false,
}: {
  frames: Frame[]
  alt: string
  sizes: string
  priority?: boolean
}) {
  const [active, setActive] = useState(0)

  /* Sizes come from the CMS one photo at a time, so a product can have them on
     some photos and not others. The caption line is decided once for the row
     rather than per thumbnail: a row where only two of four carry text sits at
     ragged heights, and the empty ones read as a missing image, not a missing
     caption. */
  const hasLabels = frames.some((frame) => frame.label)

  return (
    <div className="flex flex-col gap-3">
      <ProductFrame frame={frames[active]} alt={alt} sizes={sizes} priority={priority} />

      <ul
        className="flex flex-wrap gap-2"
        aria-label={hasLabels ? 'Presentaciones' : 'Imágenes del producto'}
      >
        {frames.map((frame, i) => {
          const isActive = i === active
          return (
            <li key={frame.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={frame.label ? `Ver ${frame.label}` : `Ver imagen ${i + 1} de ${frames.length}`}
                aria-current={isActive ? 'true' : undefined}
                className={[
                  'flex cursor-pointer flex-col items-center gap-1',
                  'transition-transform duration-[180ms] ease-[var(--ease-out)]',
                  'active:scale-[0.97] active:duration-[100ms]',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]',
                ].join(' ')}
              >
                <span
                  className={[
                    'relative block size-16 overflow-hidden rounded-md bg-white p-1.5',
                    'border transition-[border-color] duration-[180ms] ease-[var(--ease-out)]',
                    isActive ? 'border-accent' : 'border-border hover-fine:border-border-strong',
                  ].join(' ')}
                >
                  <Image
                    src={frame.src}
                    alt=""
                    fill
                    sizes="64px"
                    placeholder={frame.blur ? 'blur' : undefined}
                    blurDataURL={frame.blur}
                    className="object-contain p-1.5"
                  />
                </span>

                {hasLabels ? (
                  <span
                    className={[
                      'block max-w-20 text-center text-xs leading-4',
                      isActive ? 'font-semibold text-fg' : 'text-fg-subtle',
                    ].join(' ')}
                  >
                    {/* Wraps rather than truncates: the labels are already terse,
                        and "100 pcs LATEX" cut to "100 pcs…" loses the one word
                        that tells two boxes apart. The thumbnails stay aligned
                        either way, because the caption hangs below them.
                        A non-breaking space, not an empty string, so an
                        unlabelled photo keeps the line it would have had. */}
                    {frame.label ?? ' '}
                  </span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
