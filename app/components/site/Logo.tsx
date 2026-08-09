import Image from 'next/image'
import { SITE } from '../../lib/site'

/**
 * Silhouette plus live text, rather than the full lockup PNG. The wordmark stays
 * selectable, scales without blurring, and re-themes on dark surfaces.
 *
 * `salu-img.png` has a white background. `brightness(0) invert(1)` renders it as
 * a clean white silhouette on dark bands with no background removal needed.
 */
export function Logo({
  onDark = false,
  size = 'md',
}: {
  onDark?: boolean
  size?: 'sm' | 'md'
}) {
  const dim = size === 'sm' ? 30 : 38

  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/salu-img.png"
        alt=""
        width={dim}
        height={dim}
        className={onDark ? 'brightness-0 invert' : ''}
        priority
        unoptimized
      />
      <span className="flex flex-col leading-none">
        <span
          className={[
            'text-lg font-semibold tracking-[-0.02em]',
            onDark ? 'text-white' : 'text-fg',
          ].join(' ')}
        >
          {SITE.name}
        </span>
        <span
          className={[
            'font-semibold text-[0.5625rem] uppercase tracking-[0.14em]',
            onDark ? 'text-teal-200' : 'text-fg-subtle',
          ].join(' ')}
        >
          {SITE.division}
        </span>
      </span>
    </span>
  )
}
