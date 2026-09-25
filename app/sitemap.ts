import type { MetadataRoute } from 'next'
import { SITE } from './lib/site'
import { client } from './lib/sanity'
import { sitemapQuery } from './lib/queries'

export const revalidate = 60

/**
 * `/sitemap.xml`: the home page, the catalog, and one entry per product.
 *
 * A product carries its Sanity `_updatedAt`. The catalog carries the newest of
 * those, because it changes exactly when a product does. The home page gets no
 * date: nothing records when its copy last changed, and a made-up date teaches
 * Google to ignore the field.
 *
 * If Sanity is unreachable the sitemap still lists the two fixed pages rather
 * than failing, same as every other Sanity read on the site.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: { slug: string; _updatedAt: string }[] = []
  try {
    products = await client.fetch(sitemapQuery)
  } catch {
    products = []
  }

  const newest = products.map((p) => p._updatedAt).sort().at(-1)

  return [
    { url: SITE.url },
    { url: `${SITE.url}/productos`, lastModified: newest },
    ...products.map((p) => ({
      url: `${SITE.url}/productos/${p.slug}`,
      lastModified: p._updatedAt,
    })),
  ]
}
