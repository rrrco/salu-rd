/**
 * The pure half of `seed-products.mjs`: manifest in, documents out.
 *
 * Nothing here reads the filesystem, the network or the clock, so the import
 * plan — and in particular the duplicate policy, which is the part that can hurt
 * a live dataset — is checkable without a dataset. The script keeps the I/O.
 */

/**
 * A slug already in the dataset is never overwritten and never dropped: the
 * import would otherwise either clobber a product an editor has since filled in
 * or lose a photo set without saying so. The new document gets a suffix instead,
 * and the caller reports it so the duplicate can be merged or deleted in the
 * Studio. Slug is the route key for /productos/[slug], so it has to stay unique.
 */
export const uniqueSlug = (slug, taken) => {
  if (!taken.has(slug)) return slug
  let n = 2
  while (taken.has(`${slug}-${n}`)) n += 1
  return `${slug}-${n}`
}

/**
 * Resolve every manifest entry against the slugs already in the dataset.
 *
 * `takenSlugs` is not mutated — the running set is local, so two manifest
 * entries colliding on the same base can never be handed the same suffix.
 * `iconKey` is looked up on the *manifest* slug rather than the resolved one:
 * `florvet-2` is still the antibiotic `florvet` is, and looking it up after the
 * rename would silently drop the category for exactly the duplicates.
 */
export function planImport({ manifest, takenSlugs, iconBySlug = {} }) {
  const taken = new Set(takenSlugs)
  const pending = manifest.map((product) => {
    const slug = uniqueSlug(product.slug, taken)
    taken.add(slug)
    return {
      ...product,
      slug,
      renamedFrom: slug === product.slug ? null : product.slug,
      iconKey: iconBySlug[product.slug],
    }
  })

  return {
    pending,
    renamed: pending.filter((p) => p.renamedFrom),
    noIcon: pending.filter((p) => !p.iconKey).map((p) => p.slug),
    lowConfidence: manifest.flatMap((p) =>
      p.presentations
        .filter((pr) => pr.confidence === 'low')
        .map((pr) => ({ slug: p.slug, label: pr.label, file: pr.file }))
    ),
  }
}

/**
 * One product becomes one document: the smallest package is the main image and
 * the rest become the gallery, each carrying the size it shows. `toAssetRef`
 * turns a filename into the `_sanityAsset` string the Sanity CLI uploads from —
 * injected so this stays free of path and URL concerns.
 */
export function buildDocuments({ pending, toAssetRef, featured = false, startOrder = 0 }) {
  let order = startOrder
  return pending.map((p) => {
    const [first, ...rest] = p.presentations
    const image = ({ file, label }) => ({
      _sanityAsset: toAssetRef(file),
      ...(label ? { label } : {}),
    })
    return {
      _id: `product-${p.slug}`,
      _type: 'product',
      name: p.name,
      slug: { _type: 'slug', current: p.slug },
      ...(p.iconKey ? { iconKey: p.iconKey } : {}),
      image: image(first),
      ...(rest.length ? { gallery: rest.map((pr) => ({ _type: 'image', ...image(pr) })) } : {}),
      featured,
      order: ++order,
    }
  })
}
