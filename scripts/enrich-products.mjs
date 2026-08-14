/**
 * Fill in `description`, `presentation`, `activeIngredient` and the main image's
 * `label` for products already in the dataset.
 *
 * The seed import (`seed-products.mjs`) created one document per photo set and
 * carried whatever the vision model read off each photo. It could not read a
 * package size for 22 of them, and it never had a description to give at all.
 * This script closes both gaps from sources that are checkable:
 *
 *   cv     continentalvet.com, the manufacturer's own product page — most of the
 *          catalog is theirs, and their page carries the description AND the
 *          "Presentación:" line the photo did not show
 *   label  read off the original WhatsApp photo in ai-image-standardizer/input-done,
 *          which still has real text (the Sanity images are AI-regenerated and
 *          their label text is garbled, so they are useless for this)
 *   web    a search, for the handful of non-Continental brands
 *
 * Nothing here overwrites a field an editor has already filled: every patch uses
 * `setIfMissing`, so re-running is a no-op on anything already answered. That is
 * the whole safety story — the script is idempotent and additive, and a wrong
 * value has to be corrected in the Studio rather than silently re-applied.
 *
 *   Preview what would change (no writes, no credentials):
 *     node scripts/enrich-products.mjs
 *
 *   Apply it (needs SANITY_WRITE_TOKEN, or run via the Sanity CLI session):
 *     SANITY_WRITE_TOKEN=... node scripts/enrich-products.mjs --apply
 *
 * Flags:
 *   --apply           actually write; without it the script only prints a diff
 *   --data <path>     the enrichment file (default scripts/product-enrichment.json)
 *   --dataset <name>  default: production
 */
import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { isMeta, planEnrichment } from './enrich-products.lib.mjs'

const argv = process.argv.slice(2)
const flag = (name) => argv.includes(`--${name}`)
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback
}

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DATA = opt('data', join(REPO_ROOT, 'scripts/product-enrichment.json'))
const DATASET = opt('dataset', process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production')
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '90vh2vk9'
const APPLY = flag('apply')

const API = `https://${PROJECT_ID}.api.sanity.io/v2025-01-01`

const enrichment = JSON.parse(await readFile(DATA, 'utf8'))

// The dataset is public, so reading the current state needs no credentials.
const query = `*[_type == "product"]{ _id, "slug": slug.current, name, description, presentation, activeIngredient, "imageLabel": image.label, "hasImage": defined(image.asset) }`
const res = await fetch(`${API}/data/query/${DATASET}?query=${encodeURIComponent(query)}`)
if (!res.ok) throw new Error(`query failed: ${res.status} ${await res.text()}`)
const documents = (await res.json()).result

const { patches, unknownSlugs, complete, uncovered } = planEnrichment({ documents, enrichment })

const entryCount = Object.keys(enrichment).filter((k) => !isMeta(k)).length
console.log(`dataset   ${DATASET}`)
console.log(`data      ${DATA}`)
console.log(`${documents.length} products in the dataset, ${entryCount} in the enrichment file`)
console.log(`${patches.length} to patch, ${complete.length} already complete\n`)

for (const p of patches) {
  const fields = { ...(p.patch.setIfMissing ?? {}), ...(p.patch.set ?? {}) }
  console.log(`  ${p.slug}`)
  for (const [k, v] of Object.entries(fields)) {
    console.log(`      ${k.padEnd(16)} ${String(v).slice(0, 96)}${String(v).length > 96 ? '…' : ''}`)
  }
}

if (unknownSlugs.length) {
  console.log(`\n!!  ${unknownSlugs.length} slug(s) in the data file are not in ${DATASET}: ${unknownSlugs.join(', ')}`)
}
if (uncovered.length) {
  console.log(`\n!!  ${uncovered.length} product(s) have no entry in the data file: ${uncovered.join(', ')}`)
}

if (!APPLY) {
  console.log('\nPreview only. Re-run with --apply to write.')
  process.exit(0)
}

const token = process.env.SANITY_WRITE_TOKEN
if (!token) {
  console.error('\nSANITY_WRITE_TOKEN is not set. Refusing to write.')
  process.exit(1)
}

const mutate = await fetch(`${API}/data/mutate/${DATASET}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ mutations: patches.map(({ patch }) => ({ patch })) }),
})
if (!mutate.ok) throw new Error(`mutate failed: ${mutate.status} ${await mutate.text()}`)

console.log(`\nPatched ${patches.length} documents in ${DATASET}.`)
