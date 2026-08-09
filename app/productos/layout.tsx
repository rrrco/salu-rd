import type { ReactNode } from 'react'

/**
 * Exists to hold the `@modal` slot.
 *
 * A product opened from the catalog is intercepted by `@modal/(.)[slug]` and
 * rendered here, over the live grid, so the buyer's search term and category
 * filter survive. The same URL loaded directly, refreshed or shared skips the
 * interception and renders `[slug]/page.tsx` as a real page.
 *
 * `@modal` is a slot, so it adds no segment to the URL: `(.)` inside it matches
 * `[slug]` as a sibling.
 */
export default function ProductosLayout({
  children,
  modal,
}: {
  children: ReactNode
  modal: ReactNode
}) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
