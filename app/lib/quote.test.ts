import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  addLine,
  countItems,
  MAX_LINES,
  MAX_QTY,
  parseQuote,
  quoteMessage,
  QUOTE_TTL_MS,
  removeLine,
  serialiseQuote,
  setQty,
  soleSize,
  type QuoteLine,
} from './quote.ts'

const NOW = 1_700_000_000_000

const amoxi = { slug: 'amoxisalu', name: 'Amoxisalu', size: '1 kg' }
const biosalu = { slug: 'biosalu', name: 'Biosalu' }

test('adding a product twice becomes one line of two units', () => {
  const lines = addLine(addLine([], amoxi), amoxi)
  assert.deepEqual(lines, [{ ...amoxi, qty: 2 }])
  assert.equal(countItems(lines), 2)
})

test('adding does not reorder the lines already in the list', () => {
  const lines = addLine(addLine(addLine([], amoxi), biosalu), amoxi)
  assert.deepEqual(
    lines.map((l) => l.slug),
    ['amoxisalu', 'biosalu']
  )
})

test('the input list is never mutated', () => {
  const before: QuoteLine[] = [{ ...amoxi, qty: 1 }]
  addLine(before, biosalu)
  setQty(before, 'amoxisalu', 5)
  removeLine(before, 'amoxisalu')
  assert.deepEqual(before, [{ ...amoxi, qty: 1 }])
})

test('quantity is clamped, and zero removes the line', () => {
  const one = addLine([], amoxi)
  assert.equal(setQty(one, 'amoxisalu', 500)[0].qty, MAX_QTY)
  assert.deepEqual(setQty(one, 'amoxisalu', 0), [])
  assert.deepEqual(setQty(one, 'amoxisalu', -3), [])
})

test('the list stops growing at MAX_LINES', () => {
  let lines: QuoteLine[] = []
  for (let i = 0; i < MAX_LINES + 5; i++) {
    lines = addLine(lines, { slug: `p-${i}`, name: `Producto ${i}` })
  }
  assert.equal(lines.length, MAX_LINES)
})

test('soleSize attaches an unambiguous size and nothing else', () => {
  assert.equal(soleSize(['1 kg']), '1 kg')
  // Two photos of the same box report the same size twice.
  assert.equal(soleSize(['1 kg', '1 kg']), '1 kg')
  assert.equal(soleSize(['100 g', '1 kg']), undefined)
  assert.equal(soleSize([]), undefined)
  assert.equal(soleSize(undefined), undefined)
})

test('the message numbers every line and shows the size only when known', () => {
  const lines = setQty(addLine(addLine([], amoxi), biosalu), 'amoxisalu', 2)
  assert.equal(
    quoteMessage(lines),
    [
      'Hola SALU, quisiera cotizar estos productos:',
      '',
      '1. Amoxisalu (1 kg) x 2',
      '2. Biosalu x 1',
      '',
      'Enviado desde el catálogo web.',
    ].join('\n')
  )
})

test('a serialised list reads back identically', () => {
  const lines = addLine(addLine([], amoxi), biosalu)
  assert.deepEqual(parseQuote(serialiseQuote(lines, NOW), NOW), lines)
})

test('a list older than the TTL is discarded', () => {
  const raw = serialiseQuote(addLine([], amoxi), NOW)
  assert.equal(parseQuote(raw, NOW + QUOTE_TTL_MS - 1).length, 1)
  assert.deepEqual(parseQuote(raw, NOW + QUOTE_TTL_MS + 1), [])
})

test('anything unparseable or mis-shaped yields an empty list', () => {
  const cases = [
    null,
    '',
    'not json',
    '[]',
    '"a string"',
    JSON.stringify({ v: 2, updatedAt: NOW, lines: [{ ...amoxi, qty: 1 }] }),
    JSON.stringify({ v: 1, lines: [{ ...amoxi, qty: 1 }] }),
    JSON.stringify({ v: 1, updatedAt: NOW, lines: 'nope' }),
  ]
  for (const raw of cases) {
    assert.deepEqual(parseQuote(raw, NOW), [], `expected no lines from ${String(raw)}`)
  }
})

test('a bad line is dropped without taking its neighbours with it', () => {
  const raw = JSON.stringify({
    v: 1,
    updatedAt: NOW,
    lines: [
      { ...amoxi, qty: 1 },
      { slug: 'ghost', name: 'Fantasma', qty: 0 },
      { slug: 'ghost2', qty: 1 },
      { slug: 'ghost3', name: 'Fantasma', qty: MAX_QTY + 1 },
      { ...biosalu, qty: 3 },
    ],
  })
  assert.deepEqual(
    parseQuote(raw, NOW).map((l) => l.slug),
    ['amoxisalu', 'biosalu']
  )
})
