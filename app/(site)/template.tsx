import type { ReactNode } from 'react'

/**
 * Page-to-page transition. `template.tsx` remounts on every navigation, so
 * the `page-enter` animation (globals.css) replays: a 240ms opacity fade on
 * the strong ease-out.
 *
 * Opacity only, on purpose - the hero's Reveal group already owns the
 * vertical movement and replays on remount; a translate here would double it.
 * Pure CSS, so it costs zero client JS, runs off the main thread while the
 * new route hydrates, degrades to nothing under `prefers-reduced-motion`
 * (global reset) and without JS (`noscript` never blocks paint).
 *
 * Upgrade path once stable: `experimental.viewTransition` in next.config +
 * React's <ViewTransition>. Do not combine both - remove this file then.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>
}
