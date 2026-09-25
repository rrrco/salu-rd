import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { SITE } from './lib/site'
import { baseOpenGraph } from './lib/seo'

/**
 * Non-Apple fallback.
 *
 * Apple devices resolve `-apple-system` first and never select this face, so
 * `preload: false` matters: a browser only downloads a webfont once the font
 * matcher actually picks it. Without it Next emits a `<link rel="preload">`
 * that fetches Poppins on every device, including the ones rendering San
 * Francisco. With it, Apple pays nothing and Windows and Android get Poppins.
 *
 * `latin-ext` covers the Spanish diacritics the site needs.
 */
const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  // 700 is here for the hero headline, 800 for the stat numerals. Without the
  // real cut the browser synthesises one by smearing the nearest weight, which
  // looks muddy at display size.
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: false,
  variable: '--font-poppins',
})
/**
 * iOS Safari paints the status-bar inset from `theme-color`, not from the
 * page's html background - without it the strip defaults to white. The home
 * hero runs full-bleed dark, so the site default is the hero's darkest stop;
 * light-topped routes (productos) override this with their own `viewport`.
 */
export const viewport: Viewport = {
  themeColor: '#062428',
}

/** Aimed at how buyers search: "distribuidor de productos veterinarios" plus
 *  the country. Every claim is on the page: the city is in the footer, the
 *  national delivery in the footer and the catalog. */
const homeTitle = 'SALU División Veterinaria | Distribuidor de productos veterinarios en República Dominicana'
const homeDescription =
  'Distribuidor de productos veterinarios en Santiago de los Caballeros. Medicamentos, biológicos y consumibles certificados para clínicas, hospitales y distribuidores, con entrega en toda República Dominicana.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: homeTitle,
    template: '%s | SALU División Veterinaria',
  },
  description: homeDescription,
  keywords: [
    'productos veterinarios',
    'medicamentos veterinarios',
    'distribuidor veterinario',
    'República Dominicana',
    'antibióticos veterinarios',
    'antiparasitarios',
  ],
  openGraph: { ...baseOpenGraph, title: homeTitle, description: homeDescription },
  // Pages never set `twitter`, so this reaches all of them. Next fills the
  // title, description and image in from each page's `openGraph`.
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // es-DO rather than es: Bing reads the region off this attribute when it
    // decides which country's results a page belongs in.
    <html lang="es-DO" className={poppins.variable}>
      <head>
        {/* Scroll reveals server-render at opacity 0 and are revealed on
            hydration. Without this, a visitor with JavaScript disabled gets a
            blank page. Motion writes inline styles, hence !important. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      {/* Marketing chrome (Nav, Footer, FAB) lives in `(site)/layout.tsx` so
          that `/studio` renders the Sanity Studio without it. */}
      <body>{children}</body>
    </html>
  )
}
