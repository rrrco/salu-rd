import type { Metadata } from 'next'
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
  // 700 is here for the hero headline. Without a real Bold cut the browser
  // synthesises one by smearing the Semibold, which looks muddy at display size.
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
  variable: '--font-poppins',
})
import { Nav } from './components/site/Nav'
import { Footer } from './components/site/Footer'
import { WhatsAppFab } from './components/site/WhatsAppFab'

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
      <body>
        <a
          href="#main"
          className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand"
        >
          Saltar al contenido
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  )
}
