/** node --test scripts/ */
import assert from 'node:assert/strict'
import { test } from 'node:test'

import { buildDocuments, planImport, uniqueSlug } from './seed-products.lib.mjs'

const p = (slug, presentations) => ({ slug, name: slug, presentations })
const ref = (file) => `image@file:///img/${file}`

test('uniqueSlug leaves a free slug alone and suffixes a taken one', () => {
  assert.equal(uniqueSlug('florvet', new Set()), 'florvet')
  assert.equal(uniqueSlug('florvet', new Set(['florvet'])), 'florvet-2')
  assert.equal(uniqueSlug('florvet', new Set(['florvet', 'florvet-2'])), 'florvet-3')
})

test('an existing slug is renamed, never overwritten and never dropped', () => {
  const { pending, renamed } = planImport({
    manifest: [p('florvet', [{ label: '1 L', file: 'florvet__1-l.jpg' }])],
    takenSlugs: ['florvet'],
  })

  assert.equal(pending.length, 1, 'the duplicate is still imported')
  assert.equal(pending[0].slug, 'florvet-2')
  assert.deepEqual(
    renamed.map((r) => [r.renamedFrom, r.slug]),
    [['florvet', 'florvet-2']],
    'and is reported so it can be merged in the Studio'
  )
})

test('two manifest entries colliding on one taken slug get distinct suffixes', () => {
  const { pending } = planImport({
    manifest: [p('florvet', [{ file: 'a.jpg' }]), p('florvet', [{ file: 'b.jpg' }])],
    takenSlugs: ['florvet'],
  })

  assert.deepEqual(pending.map((x) => x.slug), ['florvet-2', 'florvet-3'])
})

test('planImport does not mutate the caller\'s slug set', () => {
  const taken = new Set(['florvet'])
  planImport({ manifest: [p('florvet', [{ file: 'a.jpg' }])], takenSlugs: taken })
  assert.deepEqual([...taken], ['florvet'])
})

test('a renamed product keeps the iconKey of the slug it came from', () => {
  const { pending, noIcon } = planImport({
    manifest: [p('florvet', [{ file: 'a.jpg' }])],
    takenSlugs: ['florvet'],
    iconBySlug: { florvet: 'antibiotics' },
  })

  assert.equal(pending[0].iconKey, 'antibiotics')
  assert.deepEqual(noIcon, [])
})

test('low-confidence labels are surfaced under the manifest slug', () => {
  const { lowConfidence } = planImport({
    manifest: [
      p('salu', [
        { label: '250 ml', file: 'salu__250-ml.jpg', confidence: 'low' },
        { label: '1 L', file: 'salu__1-l.jpg', confidence: 'high' },
      ]),
    ],
    takenSlugs: [],
  })

  assert.deepEqual(lowConfidence, [{ slug: 'salu', label: '250 ml', file: 'salu__250-ml.jpg' }])
})

test('the smallest package is the main image, the rest is the gallery', () => {
  const { pending } = planImport({
    manifest: [
      p('saluvitamin-ug', [
        { label: '30 ml', file: 'saluvitamin-ug__30-ml.jpg' },
        { label: '1 L', file: 'saluvitamin-ug__1-l.jpg' },
        { label: '1 galón', file: 'saluvitamin-ug__1-galon.jpg' },
      ]),
    ],
    takenSlugs: [],
  })
  const [doc] = buildDocuments({ pending, toAssetRef: ref })

  assert.equal(doc.image._sanityAsset, ref('saluvitamin-ug__30-ml.jpg'))
  assert.equal(doc.image.label, '30 ml')
  assert.deepEqual(doc.gallery, [
    { _type: 'image', _sanityAsset: ref('saluvitamin-ug__1-l.jpg'), label: '1 L' },
    { _type: 'image', _sanityAsset: ref('saluvitamin-ug__1-galon.jpg'), label: '1 galón' },
  ])
})

test('a single-photo product gets no gallery key at all', () => {
  const { pending } = planImport({
    manifest: [p('apetipet', [{ label: '100 ml', file: 'apetipet__100-ml.jpg' }])],
    takenSlugs: [],
  })
  const [doc] = buildDocuments({ pending, toAssetRef: ref })

  assert.equal('gallery' in doc, false)
})

test('a null label is omitted rather than written as null', () => {
  const { pending } = planImport({
    manifest: [p('coligen', [{ label: null, file: 'coligen.jpg' }])],
    takenSlugs: [],
  })
  const [doc] = buildDocuments({ pending, toAssetRef: ref })

  assert.equal('label' in doc.image, false)
})

test('order continues past the highest order already in the dataset', () => {
  const { pending } = planImport({
    manifest: [p('a', [{ file: 'a.jpg' }]), p('b', [{ file: 'b.jpg' }])],
    takenSlugs: [],
  })
  const docs = buildDocuments({ pending, toAssetRef: ref, startOrder: 38 })

  assert.deepEqual(docs.map((d) => d.order), [39, 40])
})
