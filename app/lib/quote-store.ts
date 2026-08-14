'use client'

import { useSyncExternalStore } from 'react'
import {
  addLine,
  countItems,
  parseQuote,
  QUOTE_STORAGE_KEY,
  removeLine,
  serialiseQuote,
  setQty,
  type QuoteLine,
} from './quote'

/**
 * The quote list, as browser state.
 *
 * A module-level store rather than a context provider: the three things that
 * read it (the nav button, the mobile bar, the panel) all live in the site
 * layout, and the add buttons live inside server-rendered product tiles. A
 * provider would have to wrap the whole tree and would push every one of those
 * tiles across the client boundary for a value they never render.
 *
 * `useSyncExternalStore` rather than `useState` + an effect, because the same
 * value is read by four components that share no parent, and because it is the
 * one hook that gets the server snapshot right. All the logic lives in
 * `quote.ts`; this file is the seam where the DOM, the clock and storage
 * arrive.
 *
 * Not persisted here: whether the panel is open. That is view state which
 * should not survive a reload, so it lives beside the lines but never reaches
 * storage.
 */

/** Stable empty reference. `useSyncExternalStore` compares snapshots by
 *  identity, so returning a fresh `[]` would re-render on every check. */
const EMPTY: readonly QuoteLine[] = []

let lines: readonly QuoteLine[] = EMPTY
let open = false
let hydrated = false
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

/**
 * Hydration happens on first subscribe, never at module scope.
 *
 * React renders the client tree once against the server HTML before it
 * subscribes, and the server has no `localStorage`. Reading storage at import
 * time would make that first render disagree with the markup and blow up
 * hydration. Subscribing runs after mount, so filling the store there and
 * emitting is a normal update.
 */
function hydrate() {
  hydrated = true

  window.addEventListener('storage', (event) => {
    // `key` is null when storage was cleared wholesale; both cases concern us.
    if (event.key !== null && event.key !== QUOTE_STORAGE_KEY) return
    lines = read()
    emit()
  })

  const stored = read()
  if (stored.length === 0) return
  lines = stored
  // Out of the subscribe call itself: React is mid-commit when it runs.
  queueMicrotask(emit)
}

function read(): readonly QuoteLine[] {
  try {
    const parsed = parseQuote(window.localStorage.getItem(QUOTE_STORAGE_KEY), Date.now())
    return parsed.length > 0 ? parsed : EMPTY
  } catch {
    // Safari in private mode, storage disabled by policy, quota games. The
    // quote still works for this page view; it just does not survive it.
    return EMPTY
  }
}

function write(next: readonly QuoteLine[]) {
  try {
    if (next.length === 0) window.localStorage.removeItem(QUOTE_STORAGE_KEY)
    else window.localStorage.setItem(QUOTE_STORAGE_KEY, serialiseQuote(next, Date.now()))
  } catch {
    /* see `read` */
  }
}

function commit(next: readonly QuoteLine[]) {
  lines = next.length === 0 ? EMPTY : next
  write(lines)
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (!hydrated) hydrate()
  return () => {
    listeners.delete(listener)
  }
}

/* --- Reads ---------------------------------------------------------------
   One hook per shape rather than one hook returning an object: every snapshot
   has to be referentially stable, and an object literal never is. */

export function useQuoteLines(): readonly QuoteLine[] {
  return useSyncExternalStore(
    subscribe,
    () => lines,
    () => EMPTY
  )
}

/** Units, not lines. Drives the badge and the bar's copy. */
export function useQuoteCount(): number {
  return useSyncExternalStore(
    subscribe,
    () => countItems(lines),
    () => 0
  )
}

/** The line for one product, or `undefined`. Lets an add button show what it
 *  already did without every button re-rendering on every other button. */
export function useQuoteLine(slug: string): QuoteLine | undefined {
  return useSyncExternalStore(
    subscribe,
    () => lines.find((line) => line.slug === slug),
    () => undefined
  )
}

export function useQuoteOpen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => open,
    () => false
  )
}

/* --- Writes ------------------------------------------------------------- */

export function addToQuote(line: Omit<QuoteLine, 'qty'>) {
  commit(addLine(lines, line))
}

export function setQuoteQty(slug: string, qty: number) {
  commit(setQty(lines, slug, qty))
}

export function removeFromQuote(slug: string) {
  commit(removeLine(lines, slug))
}

export function clearQuote() {
  commit(EMPTY)
}

export function setQuoteOpen(next: boolean) {
  if (open === next) return
  open = next
  emit()
}

export function openQuote() {
  setQuoteOpen(true)
}
