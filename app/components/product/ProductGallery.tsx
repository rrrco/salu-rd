'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProductFrame, type Frame } from './ProductFrame'

/**
 * Several photos of one product: the main frame plus a thumbnail row.
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

  return (
    <div className="flex flex-col gap-3">
      <ProductFrame frame={frames[active]} alt={alt} sizes={sizes} priority={priority} />

      <ul className="flex flex-wrap gap-2" aria-label="Imágenes del producto">
        {frames.map((frame, i) => {
          const isActive = i === active
          return (
            <li key={frame.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver imagen ${i + 1} de ${frames.length}`}
                aria-current={isActive ? 'true' : undefined}
                className={[
                  'relative block size-16 cursor-pointer overflow-hidden rounded-md bg-white p-1.5',
                  'border transition-[border-color,transform] duration-[180ms] ease-[var(--ease-out)]',
                  'active:scale-[0.97] active:duration-[100ms]',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]',
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
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
