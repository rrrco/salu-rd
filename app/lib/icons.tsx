import {
  Pill,
  Bug,
  Syringe,
  Leaf,
  Bandaids,
  Moon,
  FirstAid,
  Eye,
} from '@phosphor-icons/react/ssr'
import type { Icon } from '@phosphor-icons/react'

/**
 * Product category icons.
 *
 * Keys match the `iconKey` option list in `sanity/schemas/product.ts` exactly.
 * Changing a key here without changing it there breaks the fallback for every
 * product in that category.
 *
 * These replace eight hand-rolled inline SVGs that each hardcoded `#2AACB8`.
 * Color now comes from `currentColor`, so the icon re-themes inside `.on-dark`.
 */
export const CATEGORY_ICONS: Record<string, Icon> = {
  antibiotics: Pill,
  antiparasitic: Bug,
  vaccines: Syringe,
  supplements: Leaf,
  wounds: Bandaids,
  sedatives: Moon,
  antiinflammatory: FirstAid,
  ophthalmic: Eye,
}

/**
 * One stroke weight across the whole project.
 *
 * The app previously mixed `fill` (WhatsApp, quotes), `bold` (arrows) and
 * `light` (the photo placeholder), so a filled WhatsApp glyph sat next to an
 * outlined envelope and read as two different icon sets. SF Symbols are a
 * single family at a consistent stroke, and that is what this matches.
 */
export const ICON_WEIGHT = 'regular' as const

/**
 * Renders the icon for a category, falling back when the key is missing or
 * unrecognised.
 *
 * The lookup happens inside this component rather than returning a component
 * from a helper, so callers never hold a component value produced at render
 * time. Colour comes from `currentColor`.
 */
export function CategoryIcon({
  iconKey,
  size = 64,
  className,
}: {
  iconKey?: string
  size?: number
  className?: string
}) {
  const Cmp = CATEGORY_ICONS[iconKey ?? ''] ?? CATEGORY_ICONS.antibiotics
  return <Cmp size={size} weight={ICON_WEIGHT} className={className} aria-hidden="true" />
}
