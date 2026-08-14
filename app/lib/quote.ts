/**
 * The quote list, as data.
 *
 * Pure on purpose: no DOM, no storage, no clock. `quote-store.ts` owns all
 * three and calls in here, which is what lets `quote.test.ts` run under
 * `node --test` with no browser and no build step. Anything here that reached
 * for `Date.now()` or `localStorage` would spend that property.
 *
 * Every function returns a new array rather than mutating, because the store
 * hands these straight to `useSyncExternalStore` and React compares by
 * reference.
 */

export type QuoteLine = {
  /** Identity. One line per product: the CMS slug is the only id a list
   *  sitting in a browser for a month can still resolve after a re-publish. */
  slug: string
  name: string
  /** Set only when the product declares exactly one package size, so the
   *  message never claims a presentation the buyer did not choose. See
   *  `soleSize`. */
  size?: string
  qty: number
}

export const QUOTE_STORAGE_KEY = 'salu.quote.v1'

/** Per line. A buyer ordering more than this is having a conversation, not
 *  filling a form, and the stepper should not let a stuck finger reach 400. */
export const MAX_QTY = 99

/** The whole list. Guards against a hand-edited or corrupted blob turning into
 *  a WhatsApp URL no phone will open. */
export const MAX_LINES = 40

/**
 * A list older than this is discarded on load.
 *
 * Without it, someone who browsed the catalog in March opens the site in June
 * and finds a quote they have no memory of building. Prices, packaging and the
 * catalog itself have all moved by then.
 */
export const QUOTE_TTL_MS = 30 * 24 * 60 * 60 * 1000

/** What actually goes into storage. `v` is checked on read, so bumping it
 *  retires every stored list of the old shape instead of half-parsing it. */
type StoredQuote = {
  v: 1
  updatedAt: number
  lines: QuoteLine[]
}

/**
 * The package size to attach to a line, or nothing.
 *
 * A product's sizes are collected from its photo labels, so two shots of the
 * same box yield the same size twice: dedupe first. One size after that is
 * unambiguous and gets attached. Two or more means the buyer has a choice this
 * list does not ask them to make, so the line carries no size and the
 * conversation settles it, which is where they land anyway.
 */
export function soleSize(sizes?: readonly string[]): string | undefined {
  if (!sizes?.length) return undefined
  const unique = [...new Set(sizes)]
  return unique.length === 1 ? unique[0] : undefined
}

/** Adds one unit, or a new line at qty 1. Existing lines keep their position:
 *  a list that reorders itself under the buyer's finger is disorienting. */
export function addLine(
  lines: readonly QuoteLine[],
  line: Omit<QuoteLine, 'qty'>
): QuoteLine[] {
  const existing = lines.find((l) => l.slug === line.slug)
  if (existing) return setQty(lines, line.slug, existing.qty + 1)
  if (lines.length >= MAX_LINES) return [...lines]
  return [...lines, { ...line, qty: 1 }]
}

/** Clamped to `[0, MAX_QTY]`, and 0 removes the line: the stepper's minus is
 *  the same control as the delete, so it has to reach the same end state. */
export function setQty(
  lines: readonly QuoteLine[],
  slug: string,
  qty: number
): QuoteLine[] {
  const clamped = Math.min(Math.max(Math.trunc(qty), 0), MAX_QTY)
  if (clamped === 0) return removeLine(lines, slug)
  return lines.map((l) => (l.slug === slug ? { ...l, qty: clamped } : l))
}

export function removeLine(lines: readonly QuoteLine[], slug: string): QuoteLine[] {
  return lines.filter((l) => l.slug !== slug)
}

/** Units, not lines. The badge counts what the buyer asked for. */
export function countItems(lines: readonly QuoteLine[]): number {
  return lines.reduce((total, line) => total + line.qty, 0)
}

/**
 * The message the seller receives.
 *
 * One WhatsApp deep link carries the whole list, which is the entire point of
 * the feature: the previous flow opened one chat per product. Forty lines come
 * to roughly 1.6k characters encoded, inside what `wa.me` and both mobile
 * clients handle, which is why `MAX_LINES` exists.
 */
export function quoteMessage(lines: readonly QuoteLine[]): string {
  const items = lines.map((line, i) => {
    const size = line.size ? ` (${line.size})` : ''
    return `${i + 1}. ${line.name}${size} x ${line.qty}`
  })

  return [
    'Hola SALU, quisiera cotizar estos productos:',
    '',
    ...items,
    '',
    'Enviado desde el catálogo web.',
  ].join('\n')
}

function isLine(value: unknown): value is QuoteLine {
  if (typeof value !== 'object' || value === null) return false
  const line = value as Record<string, unknown>
  return (
    typeof line.slug === 'string' &&
    line.slug.length > 0 &&
    typeof line.name === 'string' &&
    line.name.length > 0 &&
    (line.size === undefined || typeof line.size === 'string') &&
    typeof line.qty === 'number' &&
    Number.isInteger(line.qty) &&
    line.qty > 0 &&
    line.qty <= MAX_QTY
  )
}

/**
 * Reads a stored blob back into lines, or gives up and returns none.
 *
 * Hand-rolled rather than a schema library: this runs in the browser bundle on
 * every first paint, and the shape is four fields. Anything unparseable,
 * mis-versioned, expired or malformed yields an empty list, because the only
 * safe fallback for a corrupted quote is no quote.
 *
 * `now` is a parameter so this file stays free of the clock.
 */
export function parseQuote(raw: string | null, now: number): QuoteLine[] {
  if (!raw) return []

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }

  if (typeof parsed !== 'object' || parsed === null) return []
  const quote = parsed as Partial<StoredQuote>

  if (quote.v !== 1) return []
  if (typeof quote.updatedAt !== 'number' || !Number.isFinite(quote.updatedAt)) return []
  if (now - quote.updatedAt > QUOTE_TTL_MS) return []
  if (!Array.isArray(quote.lines)) return []

  const lines = quote.lines.filter(isLine)
  return lines.length > MAX_LINES ? lines.slice(0, MAX_LINES) : lines
}

export function serialiseQuote(lines: readonly QuoteLine[], now: number): string {
  const stored: StoredQuote = { v: 1, updatedAt: now, lines: [...lines] }
  return JSON.stringify(stored)
}
