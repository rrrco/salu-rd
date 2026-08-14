import assert from 'node:assert/strict'
import { test } from 'node:test'

import { planEnrichment } from './enrich-products.lib.mjs'

const doc = (over = {}) => ({
  _id: 'product-x',
  slug: 'x',
  name: 'X',
  hasImage: true,
  ...over,
})

test('fills only the fields the document is missing', () => {
  const { patches } = planEnrichment({
    documents: [doc({ presentation: 'Frasco 1 L' })],
    enrichment: { x: { description: 'D', presentation: 'Sobre 100 g', activeIngredient: 'A' } },
  })

  assert.deepEqual(patches[0].patch.setIfMissing, { description: 'D', activeIngredient: 'A' })
})

test('uses setIfMissing so an apply can be re-run without clobbering an editor', () => {
  const { patches } = planEnrichment({
    documents: [doc()],
    enrichment: { x: { description: 'D' } },
  })

  assert.equal(patches[0].patch.set, undefined)
  assert.deepEqual(patches[0].patch.setIfMissing, { description: 'D' })
})

test('a document that already has everything produces no patch', () => {
  const { patches, complete } = planEnrichment({
    documents: [doc({ description: 'D', imageLabel: '100 g' })],
    enrichment: { x: { description: 'D2', imageLabel: '250 ml' } },
  })

  assert.deepEqual(patches, [])
  assert.deepEqual(complete, ['x'])
})

test('sets the image label only when the image exists and carries none', () => {
  const labelled = planEnrichment({
    documents: [doc({ imageLabel: '1 L' })],
    enrichment: { x: { imageLabel: '250 ml' } },
  })
  assert.deepEqual(labelled.patches, [])

  const imageless = planEnrichment({
    documents: [doc({ hasImage: false })],
    enrichment: { x: { imageLabel: '250 ml' } },
  })
  assert.deepEqual(imageless.patches, [])

  const bare = planEnrichment({
    documents: [doc()],
    enrichment: { x: { imageLabel: '250 ml' } },
  })
  assert.deepEqual(bare.patches[0].patch.set, { 'image.label': '250 ml' })
})

test('reports a slug that is not in the dataset instead of creating it', () => {
  const { patches, unknownSlugs } = planEnrichment({
    documents: [doc()],
    enrichment: { x: { description: 'D' }, ghost: { description: 'G' } },
  })

  assert.deepEqual(unknownSlugs, ['ghost'])
  assert.deepEqual(patches.map((p) => p.slug), ['x'])
})

test('ignores the file-level metadata keys and per-entry provenance', () => {
  const { patches, uncovered } = planEnrichment({
    documents: [doc()],
    enrichment: { _note: 'not a product', x: { description: 'D', _src: 'cv' } },
  })

  assert.deepEqual(uncovered, [])
  assert.deepEqual(patches[0].patch.setIfMissing, { description: 'D' })
})

test('reports products the data file does not cover', () => {
  const { uncovered } = planEnrichment({
    documents: [doc(), doc({ _id: 'product-y', slug: 'y' })],
    enrichment: { x: { description: 'D' } },
  })

  assert.deepEqual(uncovered, ['y'])
})
