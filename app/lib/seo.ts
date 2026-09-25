import type { Metadata } from 'next'
import { SITE } from './site'

export const SITE_NAME = `${SITE.name} ${SITE.division}`

/**
 * Open Graph fields every page shares.
 *
 * Next replaces `openGraph` wholesale when a page defines its own, it does not
 * merge it with the layout's. A page that sets a title or an image has to
 * spread these back in or it loses the site name, the locale and the fallback
 * image that WhatsApp shows in a link preview.
 */
export const baseOpenGraph = {
  type: 'website',
  locale: 'es_DO',
  siteName: SITE_NAME,
  images: [
    {
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Camión de reparto cargado con cajas de productos veterinarios SALU',
    },
  ],
} satisfies Metadata['openGraph']

/**
 * Organization and WebSite markup for the home page.
 *
 * Every value here is already visible on the site, in the footer and the
 * contact section. Keep it that way: Google treats markup that claims more than
 * the page shows as spam. `WebSite` is what gives Google the site name it
 * prints above the result.
 */
export const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE.url}/#organization`,
      name: SITE_NAME,
      url: SITE.url,
      logo: `${SITE.url}/salu-img.png`,
      email: SITE.email,
      telephone: `+${SITE.phoneE164}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: SITE.city,
        addressCountry: 'DO',
      },
      areaServed: { '@type': 'Country', name: SITE.country },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      name: SITE_NAME,
      url: SITE.url,
      inLanguage: 'es-DO',
      publisher: { '@id': `${SITE.url}/#organization` },
    },
  ],
}
