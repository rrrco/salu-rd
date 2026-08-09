'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Keeps the WebKit browser bars in tune with whatever band touches each
 * screen edge, per https://medium.com/@evkirkiles/coloring-the-webkit-browser-bars-28d75cd8cf7f
 *
 * Mechanism (WebKit-specific):
 * - The STATUS BAR (top) obeys the `theme-color` meta tag, which can be
 *   rewritten from JS.
 * - The NAVIGATION BAR (bottom) reads only `document.body`'s
 *   background-color and ignores theme-color entirely.
 * - While a theme-color meta exists, the bottom bar repaints only when the
 *   status bar does - so after changing the body color we nudge the meta's
 *   alpha for one frame to force a repaint.
 *
 * Two IntersectionObservers watch every `[data-bar-color]` band through
 * hairline slots at the very top and very bottom of the viewport; whichever
 * band occupies a slot donates its color to that bar. No scroll listener -
 * the observers fire only at band boundaries.
 *
 * Without JS the static defaults still hold: the per-route `theme-color`
 * meta (layout.tsx / productos/page.tsx) and the body/html grounds in
 * globals.css.
 */
export function BrowserBars() {
  const pathname = usePathname()

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const bands = Array.from(document.querySelectorAll<HTMLElement>('[data-bar-color]'))
    if (!meta || bands.length === 0) return

    const colorOf = (el: Element) => el.getAttribute('data-bar-color') ?? ''

    const topBar = new IntersectionObserver(
      (entries) => {
        const band = entries.filter((e) => e.isIntersecting)[0]?.target
        if (band) meta.setAttribute('content', colorOf(band))
      },
      // A slot 0.05% tall at the very top of the viewport.
      { rootMargin: '-0.05% 0px -99.9% 0px' }
    )

    const bottomBar = new IntersectionObserver(
      (entries) => {
        const band = entries.filter((e) => e.isIntersecting)[0]?.target
        if (!band) return
        document.body.style.backgroundColor = colorOf(band)
        // Force the status-bar repaint the bottom bar piggybacks on: nudge
        // the meta's alpha for one frame, then restore it.
        const current = meta.getAttribute('content') ?? ''
        meta.setAttribute('content', current + 'fe')
        requestAnimationFrame(() => meta.setAttribute('content', current))
      },
      // A slot 0.05% tall at the very bottom of the viewport.
      { rootMargin: '-99.9% 0px -0.05% 0px' }
    )

    for (const band of bands) {
      topBar.observe(band)
      bottomBar.observe(band)
    }

    return () => {
      topBar.disconnect()
      bottomBar.disconnect()
      // Back to the static ground (globals.css) between routes.
      document.body.style.backgroundColor = ''
    }
  }, [pathname])

  return null
}
