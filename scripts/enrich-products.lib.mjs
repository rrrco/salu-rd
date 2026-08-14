/**
 * The pure half of `enrich-products.mjs`: documents + enrichment in, patches out.
 *
 * Nothing here touches the network or the filesystem, so the one property that
 * matters — a field an editor has already filled is never overwritten — is
 * checkable without a dataset. The script keeps the I/O.
 */

/** Document fields this enrichment is allowed to fill. */
const FIELDS = ['description', 'presentation', 'activeIngredient']

/** Keys carrying provenance (`_src`) or review notes (`_dupe`), not document data. */
export const isMeta = (key) => key.startsWith('_')

/**
 * Resolve the enrichment file against the documents already in the dataset.
 *
 * Everything goes out as `setIfMissing`, which is what makes a re-run a no-op:
 * the first apply fills the blanks and every later one leaves whatever an editor
 * has since written. The image label is the one `set`, because `setIfMissing` on
 * `image.label` would create a label on a document with no image at all — so it
 * is emitted only when the document has an image and that image has no label.
 *
 * A slug in the data file that is not in the dataset is reported rather than
 * created: this enriches products, it does not invent them.
 */
export function planEnrichment({ documents, enrichment }) {
  const bySlug = new Map(documents.map((d) => [d.slug, d]))
  const entries = Object.entries(enrichment).filter(([slug]) => !isMeta(slug))

  const patches = []
  const unknownSlugs = []
  const complete = []

  for (const [slug, fields] of entries) {
    const doc = bySlug.get(slug)
    if (!doc) {
      unknownSlugs.push(slug)
      continue
    }

    const setIfMissing = {}
    for (const key of FIELDS) {
      if (fields[key] && !doc[key]) setIfMissing[key] = fields[key]
    }

    const set = {}
    if (fields.imageLabel && doc.hasImage && !doc.imageLabel) {
      set['image.label'] = fields.imageLabel
    }

    if (!Object.keys(setIfMissing).length && !Object.keys(set).length) {
      complete.push(slug)
      continue
    }

    patches.push({
      slug,
      name: doc.name,
      patch: {
        id: doc._id,
        ...(Object.keys(setIfMissing).length ? { setIfMissing } : {}),
        ...(Object.keys(set).length ? { set } : {}),
      },
    })
  }

  const covered = new Set(entries.map(([slug]) => slug))
  return {
    patches,
    unknownSlugs,
    complete,
    uncovered: documents.filter((d) => !covered.has(d.slug)).map((d) => d.slug),
  }
}
