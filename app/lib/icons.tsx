import {
  Pill,
  Bug,
  Syringe,
  Leaf,
  Bandaids,
  Moon,
  FirstAid,
  Eye,
  WhatsappLogo,
} from '@phosphor-icons/react/ssr'
// Values come from `/ssr`, which has no type exports; types come from `/lib`,
// which has no value exports. The root barrel is never imported.
import type { Icon } from '@phosphor-icons/react/lib'

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
 * The one exemption to `ICON_WEIGHT`.
 *
 * A third-party brand mark is a logo, not an icon, and renders the way its
 * owner draws it. WhatsApp's mark is solid everywhere WhatsApp controls it, so
 * an outlined version reads as an approximation of someone else's identity
 * rather than as a member of our icon set.
 *
 * This constant exists so the exemption has exactly one home. Adding a second
 * `fill` anywhere else is the drift `scripts/icon-audit.mjs` exists to catch.
 */
export const BRAND_ICON_WEIGHT = 'fill' as const

/**
 * WhatsApp is the primary conversion path on every surface (DESIGN.md 6), so
 * its mark renders at eleven call sites. A wrapper is not premature
 * abstraction at that count: it is eleven fewer chances to forget the weight.
 *
 * No `size` default. Inside a `Button`/`ButtonLink` the CVA owns the size, and
 * a prop there would be dead code; standalone callers pass a ladder value.
 */
export function WhatsAppIcon({
  size,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <WhatsappLogo
      size={size}
      weight={BRAND_ICON_WEIGHT}
      className={className}
      aria-hidden="true"
    />
  )
}

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
