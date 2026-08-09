'use client'

/** `...-941x1136.png` -> 941. Sanity encodes the source dimensions in the filename. */
const DIMENSIONS_IN_FILENAME = /-(\d+)x(\d+)\.\w+$/

/**
 * Custom `next/image` loader.
 *
 * Sanity's CDN already resizes, crops and format-negotiates. Routing its output
 * through `/_next/image` re-downloads and re-encodes an image that was already
 * correct: extra latency, extra compute, and one more thing between the browser
 * and the picture. Product images were rendering broken because of that hop.
 *
 * So Sanity URLs are handed to the browser directly with the width appended,
 * and everything else (local PNGs in `public/`) still goes through Next's
 * optimizer, which is the right tool for those.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  /**
   * Configuring a custom loader disables Next's built-in `/_next/image`
   * endpoint, so local assets cannot be handed back to it: that route no longer
   * exists and every request 404s. They are served straight from `public/`
   * instead. The only local image is the logo silhouette, rendered at 30-56px,
   * so there is nothing to gain from a resize pass anyway.
   */
  if (!src.startsWith('https://cdn.sanity.io/')) return src

  const url = new URL(src)

  /**
   * Never ask for more pixels than the source has.
   *
   * Next generates a srcSet across its full device ladder, up to 3840w. These
   * product shots are 941px wide, so the top of that ladder made Sanity upscale
   * 4x and return a 9.6MB PNG. Clamping to the real source width caps the
   * largest variant at around 100KB.
   *
   * The crop box wins when present, since `rect` already narrows the source.
   */
  const rect = url.searchParams.get('rect')
  const rectWidth = rect ? Number(rect.split(',')[2]) : NaN
  const filenameMatch = url.pathname.match(DIMENSIONS_IN_FILENAME)
  const sourceWidth = filenameMatch ? Number(filenameMatch[1]) : NaN

  const maxWidth = Number.isFinite(rectWidth)
    ? rectWidth
    : Number.isFinite(sourceWidth)
      ? sourceWidth
      : Infinity

  url.searchParams.set('w', String(Math.min(width, maxWidth)))
  // `rect` defines the crop box, so width alone yields the correct aspect.
  // A fixed `h` alongside a varying `w` would stretch the image per breakpoint.
  url.searchParams.delete('h')
  url.searchParams.set('q', String(quality ?? 78))
  url.searchParams.set('auto', 'format')

  return url.toString()
}
