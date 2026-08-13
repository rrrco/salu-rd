/**
 * Bulk-import the standardized product photos as `product` documents.
 *
 * The photos come from the ai-image-standardizer repo, which shoots the same
 * product once per package size and names the files `slug__presentation.jpg`.
 * Its `products.json` is the contract between the two repos: it groups those
 * files back into products, smallest package first, with the label it read off
 * each photo. This script consumes that manifest, so one product becomes one
 * document with a switchable gallery rather than one document per file:
 *
 *   image   = presentations[0]        (with its label)
 *   gallery = presentations[1..]      (each with its label)
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
 *   --manifest <path>   the standardizer's products.json
 *   --dir <path>        image source directory, where the manifest's filenames
 *                       are resolved
 *   --dataset <name>    dataset to check for existing slugs (default: production)
 */
import { createClient } from '@sanity/client'
import { access, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { homedir } from 'node:os'

import { buildDocuments, planImport } from './seed-products.lib.mjs'

const argv = process.argv.slice(2)
const flag = (name) => argv.includes(`--${name}`)
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback
}

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const OUT = opt('out', null)
const FEATURED = flag('featured')
const DIR = opt('dir', join(REPO_ROOT, 'SALU PRODUCTOS'))
const MANIFEST = opt(
  'manifest',
  join(homedir(), 'Developer/projects/ai-image-standardizer/output/products.json')
)
const DATASET = opt('dataset', process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production')
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '90vh2vk9'

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

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'))

// Fail before touching the network: a manifest that outran the image folder
// would otherwise surface as an opaque error deep inside `sanity dataset import`.
const missing = []
for (const product of manifest) {
  for (const { file } of product.presentations) {
    try {
      await access(join(DIR, file))
    } catch {
      missing.push(`${product.slug}: ${file}`)
    }
  }
}
if (missing.length) {
  console.error(`${missing.length} file(s) in the manifest are not in ${DIR}:\n`)
  for (const m of missing) console.error(`  ${m}`)
  process.exit(1)
}

// The dataset is public, so reading the existing slugs needs no credentials.
const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2025-01-01',
  useCdn: false,
})

const existing = await client.fetch('*[_type == "product"]{ "slug": slug.current, order }')
const startOrder = Math.max(0, ...existing.map((p) => p.order ?? 0))

const { pending, renamed, noIcon, lowConfidence } = planImport({
  manifest,
  takenSlugs: existing.map((p) => p.slug).filter(Boolean),
  iconBySlug: ICON_BY_SLUG,
})

const images = manifest.reduce((n, p) => n + p.presentations.length, 0)
console.log(`manifest  ${MANIFEST}`)
console.log(`images    ${DIR}`)
console.log(`${manifest.length} products / ${images} images -> ${pending.length} new documents in ${DATASET}\n`)

if (!OUT) {
  for (const p of pending) {
    const labels = p.presentations.map((pr) => pr.label ?? '—').join(', ')
    console.log(
      `  ${p.name.padEnd(34)} ${p.slug.padEnd(32)} ${String(p.iconKey ?? '—').padEnd(14)} ${p.presentations.length}x  ${labels}`
    )
  }
}

if (renamed.length) {
  console.log(`\n!!  ${renamed.length} slug(s) already exist in ${DATASET} and were NOT overwritten.`)
  console.log('    They are created under a new slug — merge or delete the duplicate in the Studio:')
  for (const p of renamed) console.log(`      ${p.renamedFrom}  ->  ${p.slug}`)
}
if (lowConfidence.length) {
  console.log(`\n!!  ${lowConfidence.length} label(s) the vision model was unsure of — check against the photo:`)
  for (const l of lowConfidence) {
    console.log(`      ${l.slug}: ${l.label ?? '(sin presentación)'}  ${l.file}`)
  }
}
if (noIcon.length) {
  console.log(`\nno iconKey (set in Studio): ${noIcon.join(', ')}`)
}

if (!OUT) {
  console.log('\nPreview only. Re-run with --out <file> to write the NDJSON.')
  process.exit(0)
}

const docs = buildDocuments({
  pending,
  toAssetRef: (file) => `image@${pathToFileURL(join(DIR, file)).href}`,
  featured: FEATURED,
  startOrder,
})

await writeFile(OUT, docs.map((d) => JSON.stringify(d)).join('\n') + '\n')

console.log(`\nWrote ${docs.length} documents to ${OUT}`)
console.log(`Next:  npx sanity dataset import ${OUT} ${DATASET}`)
