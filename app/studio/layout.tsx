import type { ReactNode } from 'react'

/**
 * The studio page is a client component, so this layout carries the route's
 * metadata: next-sanity's defaults mark `/studio` noindex and set the viewport
 * the Studio expects. The marketing chrome lives in `(site)/layout.tsx` and
 * never renders here (#13).
 */
export { metadata, viewport } from 'next-sanity/studio'

export default function StudioLayout({ children }: { children: ReactNode }) {
  return children
}
