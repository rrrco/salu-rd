import type { ReactNode } from 'react'
import { Nav } from '../components/site/Nav'
import { Footer } from '../components/site/Footer'
import { BrowserBars } from '../components/site/BrowserBars'
import { WhatsAppFab } from '../components/site/WhatsAppFab'

/**
 * Marketing chrome for every public route. `/studio` sits outside this group
 * on purpose: the Sanity Studio owns its whole viewport, and the fixed
 * WhatsApp FAB would overlap its controls (#13).
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand"
      >
        Saltar al contenido
      </a>
      <Nav />
      {/* main carries the paper ground; body deliberately holds the footer's
          teal-50 so the canvas below the page matches it (globals.css). */}
      <main id="main" className="bg-bg">{children}</main>
      <Footer />
      <BrowserBars />
      <WhatsAppFab />
    </>
  )
}
