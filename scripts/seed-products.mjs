/**
 * Bulk-import the standardized product photos as `product` documents.
 *
 * The images are the output of ~/Documents/code/projects/ai-image-standardizer,
 * renamed to kebab-case product slugs. Each file becomes one product: the image
 * is uploaded as a Sanity asset and referenced from a new document whose slug is
 * the filename. Products whose slug already exists are skipped, so this is safe
 * to re-run after adding more photos.
 *
 * This script only *writes an NDJSON file*; the Sanity CLI does the uploading,
 * so the whole thing runs on your `sanity login` session and needs no API token.
 * The `_sanityAsset: "image@file://..."` refs tell the importer to upload each
 * local file and swap in the resulting asset reference.
 *
 *   Preview what would be created:
 *     node scripts/seed-products.mjs
 *
 *   Write the NDJSON, then import it:
 *     node scripts/seed-products.mjs --out /tmp/products.ndjson
 *     npx sanity dataset import /tmp/products.ndjson production
 *
 * Flags:
 *   --out <path>        write NDJSON here instead of printing a preview
 *   --featured          mark the new products as featured (default: false, so
 *                       they do not flood the homepage — the 3 existing ones
 *                       stay the only featured products until you choose more)
 *   --dir <path>        image source directory
 *   --dataset <name>    dataset to check for existing slugs (default: production)
 */
import { createClient } from '@sanity/client'
import { readdir, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { homedir } from 'node:os'

const argv = process.argv.slice(2)
const flag = (name) => argv.includes(`--${name}`)
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback
}

const OUT = opt('out', null)
const FEATURED = flag('featured')
const DIR = opt('dir', join(homedir(), 'Documents/code/projects/salu-rd/SALU PRODUCTOS'))
const DATASET = opt('dataset', process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production')
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '90vh2vk9'
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp'])

/**
 * Only the categories I could infer from the product name with confidence.
 * Anything absent is left unset — pick it in the Studio rather than guess here.
 * Keys are slugs; values must match the `iconKey` list in sanity/schemas/product.ts.
 */
const ICON_BY_SLUG = {
  'amoflox-150': 'antibiotics',
  'amoflox-25': 'antibiotics',
  'amoxivet': 'antibiotics',
  'coligen': 'antibiotics',
  'colistyn': 'antibiotics',
  'doxiciclina-bromexina': 'antibiotics',
  'florvet': 'antibiotics',
  'florvet-premix': 'antibiotics',
  'florvet-soluble': 'antibiotics',
  'fosfomicina-t-b': 'antibiotics',
  'neocin': 'antibiotics',
  'neotetrafur-plus': 'antibiotics',
  'tilmicovet': 'antibiotics',
  'coxycox': 'antiparasitic',
  'fenbendazol-cv-22': 'antiparasitic',
  'ivermectina': 'antiparasitic',
  'nexcard-spectra': 'antiparasitic',
  'dynavit-200': 'supplements',
  'hepato-ren': 'supplements',
  'integrador-b-k-200': 'supplements',
  'vitamina-e-selenio': 'supplements',
  'vitamina-k': 'supplements',
  'vitaminas-b-k': 'supplements',
  'kerkus-plata': 'wounds',
  'kerkus-talco': 'wounds',
  'yodol': 'wounds',
}

/** `vitamina-e+selenio.png` -> `vitamina-e-selenio` */
const toSlug = (file) =>
  basename(file, extname(file))
    .toLowerCase()
    .replace(/[+_\s]+/g, '-')
    .replace(/-+/g, '-')

/**
 * `vitamina-e+selenio` -> `Vitamina E + Selenio`. Spanish connectors stay
 * lowercase, one- and two-letter tokens are acronyms (UG, CV, B, K) and get
 * uppercased, everything else is capitalized.
 */
const LOWER = new Set(['en', 'de', 'del', 'la', 'el', 'y', 'con'])
const toName = (file) =>
  basename(file, extname(file))
    .replace(/\+/g, ' + ')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((t) => {
      if (t === '+') return '+'
      if (/^\d+$/.test(t)) return t
      const low = t.toLowerCase()
      if (LOWER.has(low)) return low
      if (low.length <= 2) return low.toUpperCase()
      return low[0].toUpperCase() + low.slice(1)
    })
    .join(' ')

// The dataset is public, so reading the existing slugs needs no credentials.
const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2025-01-01',
  useCdn: false,
})

const files = (await readdir(DIR))
  .filter((f) => IMAGE_EXT.has(extname(f).toLowerCase()))
  .sort()

const existing = await client.fetch('*[_type == "product"]{ "slug": slug.current, order }')
const taken = new Set(existing.map((p) => p.slug).filter(Boolean))
let order = Math.max(0, ...existing.map((p) => p.order ?? 0))

const pending = files.map((f) => ({ file: f, slug: toSlug(f), name: toName(f) }))
const fresh = pending.filter((p) => !taken.has(p.slug))
const skipped = pending.filter((p) => taken.has(p.slug))

console.log(`${DIR}\n${files.length} images -> ${fresh.length} new, ${skipped.length} already in ${DATASET}\n`)
if (skipped.length) console.log(`skipping: ${skipped.map((p) => p.slug).join(', ')}\n`)

const noIcon = fresh.filter((p) => !ICON_BY_SLUG[p.slug]).map((p) => p.slug)

if (!OUT) {
  for (const p of fresh) {
    console.log(`  ${p.name.padEnd(28)} ${p.slug.padEnd(26)} ${ICON_BY_SLUG[p.slug] ?? '—'}`)
  }
  if (noIcon.length) console.log(`\nno iconKey (set in Studio): ${noIcon.join(', ')}`)
  console.log('\nPreview only. Re-run with --out <file> to write the NDJSON.')
  process.exit(0)
}

const docs = fresh.map((p) => ({
  _id: `product-${p.slug}`,
  _type: 'product',
  name: p.name,
  slug: { _type: 'slug', current: p.slug },
  ...(ICON_BY_SLUG[p.slug] ? { iconKey: ICON_BY_SLUG[p.slug] } : {}),
  image: { _sanityAsset: `image@${pathToFileURL(join(DIR, p.file)).href}` },
  featured: FEATURED,
  order: ++order,
}))

await writeFile(OUT, docs.map((d) => JSON.stringify(d)).join('\n') + '\n')

console.log(`Wrote ${docs.length} documents to ${OUT}\n`)
if (noIcon.length) console.log(`Set iconKey in the Studio for: ${noIcon.join(', ')}\n`)
console.log(`Next:  npx sanity dataset import ${OUT} ${DATASET}`)
