import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

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

export const metadata: Metadata = {
  metadataBase: new URL('https://saludivisionveterinaria.com'),
  title: {
    default: 'SALU División Veterinaria | Productos y Medicamentos Veterinarios',
    template: '%s | SALU División Veterinaria',
  },
  description:
    'SALU División Veterinaria provee productos farmacéuticos certificados, biológicos y consumibles veterinarios a clínicas, hospitales y distribuidores en República Dominicana.',
  keywords: [
    'productos veterinarios',
    'medicamentos veterinarios',
    'distribuidor veterinario',
    'República Dominicana',
    'antibióticos veterinarios',
    'antiparasitarios',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_DO',
    siteName: 'SALU División Veterinaria',
    title: 'SALU División Veterinaria | Productos y Medicamentos Veterinarios',
    description:
      'Productos farmacéuticos certificados, biológicos y consumibles veterinarios para clínicas, hospitales y distribuidores en República Dominicana.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={poppins.variable}>
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
