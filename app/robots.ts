import type { MetadataRoute } from 'next'
import { SITE } from './lib/site'

/**
 * `/robots.txt`: every crawler may read everything.
 *
 * `/studio` stays crawlable on purpose. It already answers with a `noindex`
 * tag, and blocking it here would stop crawlers from ever reading that tag.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE.url}/sitemap.xml`,
  }
}
