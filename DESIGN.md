# SALU División Veterinaria - Design System

> The forward spec. Every component in this repo consumes these tokens.
>
> `_design/STYLE_GUIDE.md` documents the **previous** system (Poppins, zero-radius, floating stats bar). It is kept as a historical audit. It is not the spec. This file is.

---

## 0. Brand foundation

**Who this is for.** A B2B veterinary pharmaceutical distributor in the Dominican Republic selling to clinics, hospitals and distributors. The buyer is a licensed professional making a supply decision, not a consumer making an impulse purchase.

**What that means for the design.**

| Principle | Consequence |
|---|---|
| Credibility over charm | Restrained motion, honest numbers, no decorative flourishes |
| Legibility over density | Generous line-height, one accent, high contrast |
| The teal is the brand | `#2AACB8` is sampled from the logo silhouette and is non-negotiable |
| Illuminate on hover | Borders, icons and text accents move **lighter** on hover. Filled buttons are the exception and deepen, so their white label stays legible. See 1.3. |

**Language.** Spanish, Dominican, tú-form. Quote-driven: every CTA asks for a cotización, never a purchase.

**Logo.** `public/salu-img.png` is the dog-and-cat silhouette. On dark surfaces apply `filter: brightness(0) invert(1)` to render it white. The wordmark is live text next to the silhouette, never an image, so it stays selectable and scalable.

---

## 1. Color

### 1.1 Teal ramp

Every step is sampled from a color already present in the original build. Nothing is invented.

| Token | Hex | Origin | Use |
|---|---|---|---|
| `--color-teal-950` | `#062428` | CTA gradient start | Deepest band backgrounds |
| `--color-teal-900` | `#082E32` | Hero gradient start | Footer |
| `--color-teal-800` | `#0A4D55` | CTA gradient mid | Gradient stops |
| `--color-teal-700` | `#0A6973` | Products section bg | **Full-bleed dark bands** |
| `--color-teal-600` | `#0E7A86` | CTA gradient end | Gradient stops, dark-surface borders |
| `--color-teal-500` | `#18909E` | Hero gradient stop | **Brand fill hover**, gradient stops |
| `--color-teal-400` | `#2AACB8` | **Logo silhouette** | **BRAND PRIMARY.** Fills, accent text, numerals, icons |
| `--color-teal-300` | `#4DC4CE` | Original hover teal | Accent on dark bands, icon and border hover |
| `--color-teal-200` | `#C2EDF1` | Product tile gradient end | Tile gradients, dark-surface body text |
| `--color-teal-100` | `#EBF8F9` | Animal section bg | Tile gradients, tinted surfaces |
| `--color-teal-50` | `#F5FBFC` | Derived | Lightest tinted section |

### 1.2 Neutral ramp

Cool and slightly teal-tinted so it harmonises with the accent. One family only. Never mix in a warm gray.

| Token | Hex | Use |
|---|---|---|
| `--color-ink-950` | `#0B1314` | Footer background |
| `--color-ink-900` | `#16201F` | Primary text, headings |
| `--color-ink-600` | `#47585A` | Body text, secondary |
| `--color-ink-500` | `#5E7072` | Captions, placeholders, subtle text |
| `--color-ink-400` | `#7A8C8E` | Control boundaries only. Fails AA as text. |
| `--color-ink-200` | `#D9E3E4` | Borders, dividers |
| `--color-ink-100` | `#EDF2F2` | Sunken surfaces |
| `--color-ink-50` | `#F7FAFA` | Subtle fills |
| `--color-paper` | `#FBFCFC` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, form card |

### 1.3 Brand: `#00818F`

The logo turquoise `#2AACB8` is the mark's colour, but it never worked as an interface colour: white on it measured **2.73:1** and it measured **2.66:1** as text on paper, both far under the 4.5:1 AA asks for. The site carried that as a documented exception for several revisions.

`#00818F` is the same hue one notch deeper and clears AA in both directions:

| Pairing | Was | Now |
|---|---|---|
| White label on the brand fill | 2.73:1 | **4.63:1** |
| Brand as text on paper | 2.66:1 | **4.50:1** |
| White on the hover fill | 2.08:1 | **6.40:1** |

**There are no remaining exceptions in the system.** `node scripts/contrast-audit.mjs` prints `ALL PASS`.

The logo mark keeps its original turquoise, and `teal-400` stays in the ramp for the hero gradient bloom and light tints.

| Token | Value | Role |
|---|---|---|
| `--color-brand` | `#00818F` | Fills and accent text |
| `--color-on-brand` | `white` | Labels on a brand fill |
| `--color-brand-hover` | `teal-700` | Deepens, so the label gains contrast |
| `--color-accent-deep` | `teal-700` | Eyebrows and icons on tinted grounds |
| `--color-focus` | `teal-600` | Functional, not brand expression |

**Section tints must be visible.** `teal-50` was `#F5FBFC`, 1.8% off paper, which meant adjacent sections looked identical. It is now `#E6F4F6`, a 10% step. Eyebrows on tinted grounds use `accent-deep`, since `#00818F` drops to 4.1:1 there.

### 1.4 Semantic layer

**Components reference semantics. Components never reference raw ramp steps.** A component that hardcodes `teal-400` instead of `brand` is a bug.

```
--color-bg              → paper       bg-bg
--color-surface         → white       bg-surface
--color-surface-sunken  → ink-50      bg-surface-sunken
--color-fg              → ink-900     text-fg
--color-fg-muted        → ink-600     text-fg-muted
--color-fg-subtle       → ink-500     text-fg-subtle    ink-400 is 3.4:1, too low for text
--color-fg-inverse      → white       text-fg-inverse
--color-brand           → teal-400    bg-brand
--color-on-brand        → white       text-on-brand
--color-brand-hover     → teal-500    deepens on hover, see 1.3
--color-accent          → teal-400    text-accent / border-accent
--color-accent-hover    → teal-300
--color-accent-deep     → teal-700    icons on pale tints
--color-border          → ink-200     decorative only: dividers, card edges
--color-border-strong   → ink-400     control boundaries, meets 3:1
--color-focus           → teal-600
--color-error           → #b42318     text-error
```

`border` and `border-strong` are not interchangeable. Anything that bounds an interactive control (input, secondary button, chip, carousel button) uses `border-strong`, because 1.4.11 requires 3:1 for control boundaries. `border` is for dividers and card edges, which carry no state.

Tailwind v4 compiles utilities to `var(--color-*)`, so remapping these names on an ancestor re-themes every descendant. That is exactly how `.on-dark` works: it is one class, not a parallel set of `dark:` variants on every element.

Dark bands (`#products`, `#cta`, footer) invert via a `.on-dark` scope that remaps the same semantic names. Sections never flip theme; the page is light throughout and dark bands are surfaces within it.

### 1.5 Rules

- **One accent.** `#2AACB8`, everywhere. No section introduces a second.
- **One accent family.** Brand turquoise and deep teal are the same hue from the same ramp. No section introduces a second accent.
- **Hover goes lighter, except on filled buttons.** Borders, icons and accents illuminate. A filled button deepens so its white label gains contrast rather than losing it.
- **No pure black, no pure white text.** Headings are `ink-900`, not `#000`.
- **Amber `#f5a623` is retired** along with the star rating it colored, which was an identical five stars on all three testimonials.
- **Every pairing is measured, not eyeballed.** The full audit is in section 8.

---

## 2. Typography

### 2.1 Families

**San Francisco, via the platform stack.** No webfont, no download, no flash.

```
--font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text",
             var(--font-poppins), "Helvetica Neue", Arial, sans-serif;
```

Apple's own guidance is to reach for the system face before a custom one, and here it is the right call twice over. SF ships optical sizing (it swaps to the Display cut above roughly 20pt, where the letterforms are drawn tighter and finer), per-size tracking tables, and legibility tuning that a webfont cannot match. It also costs zero bytes and never flashes.

**Off Apple the fallback is Poppins, not Segoe UI or Roboto.** Poppins is the face the brand originally shipped with, and its geometric, rounded letterforms echo the logo silhouette, so Windows and Android get something chosen rather than whatever the OS happens to bundle.

Poppins is loaded through `next/font/google` with **`preload: false`**, and that flag is the whole trick. A browser only downloads a webfont once the font matcher actually selects it. `-apple-system` resolves first on Apple, so Poppins is never selected and never fetched there. Setting `preload: true` (the default) would emit a `<link rel="preload">` and pull the file down on every device, including the ones rendering San Francisco. Next also generates a metric-adjusted `Poppins Fallback` (`size-adjust`, `ascent-override`) so the swap causes no layout shift.

Weights 400, 500 and 600 only, subsets `latin` and `latin-ext` for Spanish diacritics.

**No mono in the UI.** An earlier pass used a mono face for eyebrows, labels and stat numerals. It read as a developer tool rather than an Apple-grade interface. Small caps labels are now the sans face at **weight 600** with open tracking, and numerals use SF's own **tabular figures** (`.tabular`) rather than a monospaced font: fixed advance width so a count-up cannot shift the layout, while staying in the page's voice. `--font-mono` remains defined for genuinely code-like content.

**Weight ladder.** Section headings sit at **600**; the hero headline alone sits at **700**. One step of separation is enough to make the hero lead without any other heading competing with it. SF Semibold carries the section titles with presence but no blockiness, and weight carries hierarchy more gracefully than size alone.

Poppins is loaded at 400/500/600/700 so the non-Apple fallback has a real Bold cut. Without it the browser synthesises one by smearing the Semibold, which turns muddy at display size.

**Tracking tightens as weight and size go up.** The hero runs `-0.035em` against `-0.02em` on section titles: heavier strokes eat into the counters, so the gaps between letters read wider than they measure. Tracking is size- and weight-specific, never one value for everything.

### 2.2 Scale

Fluid via `clamp()`. One system, not three breakpoint overrides.

| Token | Clamp | Use |
|---|---|---|
| `--text-display` | `clamp(2.5rem, 1.6rem + 3.6vw, 4.25rem)` | Hero H1 only |
| `--text-h1` | `clamp(2rem, 1.4rem + 2.4vw, 3.25rem)` | Page H1, CTA band |
| `--text-h2` | `clamp(1.75rem, 1.3rem + 1.8vw, 2.5rem)` | Section titles |
| `--text-h3` | `clamp(1.125rem, 1rem + 0.5vw, 1.375rem)` | Card titles |
| `--text-lead` | `clamp(1rem, 0.95rem + 0.3vw, 1.125rem)` | Hero body, section lead |
| `--text-body` | `0.9375rem` | Default body |
| `--text-sm` | `0.875rem` | Secondary |
| `--text-xs` | `0.75rem` | Labels, chips, captions |

Headings: `letter-spacing: -0.02em`, `line-height: 1.08` at display sizes, `1.15` at h2/h3.
Body: `line-height: 1.7`, `max-width: 65ch`.

### 2.3 Rules

- Emphasis within a headline uses **italic or weight of the same family**. Never inject a second family into a headline.
- Stat numerals carry `font-variant-numeric: tabular-nums` so count-up animation never jitters layout width.
- Italic words containing descenders (`y g j p q`) need `line-height` at least `1.1` plus bottom padding reserve.
- **Quotation marks are set as type, never drawn as icons.** The testimonial mark was Phosphor `Quotes` at 22px outline, where the two hollow commas read as a lowercase "gg" and the reader had to decode the one glyph on the page that should have been instant. It is now the real `&ldquo;` at `3.5rem` in `teal-300`, `select-none` so it stays out of the clipboard. Punctuation belongs to the type system, which is also why it was always going to lose the fight with the icon-weight rule in 8.
- No gradient text.

---

## 3. Space, shape, elevation

### 3.1 Space

Base unit `4px`. Section rhythm:

| Token | Value | Use |
|---|---|---|
| `--space-section` | `clamp(4rem, 2rem + 8vw, 7.5rem)` | Vertical section padding |
| `--space-gutter` | `clamp(1.25rem, 0.5rem + 3vw, 2.5rem)` | Horizontal page gutter |
| `--width-content` | `1240px` | Max content width |
| `--width-prose` | `65ch` | Max measure for body copy |

### 3.2 Radius

Documented mixed system. Replaces the previous zero-radius-everywhere language, chosen to echo the logo's flowing silhouette.

| Token | Value | Applies to |
|---|---|---|
| `--radius-sm` | `6px` | Inputs, small controls |
| `--radius-md` | `10px` | Buttons, tiles, chips |
| `--radius-lg` | `16px` | Cards, panels, image blocks |
| `--radius-full` | `9999px` | Badges and tags only |
| `50%` | - | Circular: avatars, icon circles, FAB |

**Rule: containers 16 · interactive 10 · inputs 6 · badges pill · circular elements circle.** Never exceed 16px. Buttons are never pill-shaped; pill CTAs read consumer, not pharma.

### 3.3 Elevation

Shadows are teal-tinted. A pure-black shadow on a light teal-adjacent page reads muddy.

| Token | Value |
|---|---|
| `--shadow-sm` | `0 1px 2px rgb(11 19 20 / .04), 0 2px 8px rgb(10 105 115 / .05)` |
| `--shadow-md` | `0 2px 4px rgb(11 19 20 / .04), 0 8px 24px rgb(10 105 115 / .07)` |
| `--shadow-lg` | `0 4px 8px rgb(11 19 20 / .05), 0 16px 48px rgb(10 105 115 / .10)` |
| `--shadow-accent` | `0 4px 20px rgb(42 172 184 / .35)` (WhatsApp FAB only) |

Prefer a `1px` border plus negative space over a shadow. Use elevation only where it communicates real layering.

---

## 4. Motion

### 4.1 Tokens

```
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1)     entering, exiting
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)    on-screen movement
--dur-press:  140ms    --dur-enter: 240ms
--dur-hover:  180ms    --dur-panel: 320ms
```

### 4.2 Hard rules

- **`transition: all` is banned.** Always name the properties.
- **`ease-in` is banned on UI.** It delays the initial movement, exactly when the user is watching.
- **Animate `transform` and `opacity` only.** Never `width`, `height`, `top`, `left`.
- **Never animate from `scale(0)`.** Start at `0.95` or higher with opacity.
- Prefer CSS **transitions** over keyframes for anything that can retarget mid-flight.
- Every hover animation sits behind `@media (hover: hover) and (pointer: fine)`.
- Everything degrades under `prefers-reduced-motion`. Motion becomes opacity-only, never zero feedback.

### 4.3 Inventory - every animation must justify itself

| Animation | Spec | Why it exists |
|---|---|---|
| Hero entry stagger | opacity + `translateY(12px)`, 60ms stagger | Hierarchy: reveals reading order |
| Section scroll-reveal | `whileInView`, `once: true`, `amount: 0.3` | Storytelling |
| Stat count-up | 1.4s on enter, tabular-nums | The numbers are the message |
| Button press | `scale(0.97)`, `--dur-press` | Feedback |
| Tile hover | image `scale(1.03)`, border to accent | Affordance |
| Form states | pending to success | State transition |
| Disclosure open/close | height 0 to auto, 340ms in / 240ms out, opacity delayed 60ms on enter | A native `<details>` snaps; the layout jumped hundreds of pixels in one frame |
| Disclosure glyph | plus rotates 135° into a cross, critically damped spring | One glyph doing both states, no hard cut between two icons |
| Mobile nav sheet | fade + 8px travel, links stagger at 40ms | The sheet arrives rather than cutting in; the cascade shows reading order |
| Product dialog, desktop | fade + `translateY(4px)` + `scale(0.98)`, 240ms in / 160ms out | A panel that cuts in over the grid reads as a page change rather than a layer above it. `0.98` and not `0.95`: the surface is large, and a deep scale on a large surface reads as a zoom |
| Product dialog, mobile | fade + `translateY(16px)` from the bottom edge, same 240/160 | Enough travel to say where it came from, nowhere near a full off-screen slide |
| Product dialog scrim | `teal-950/50` + 4px backdrop blur, fades with the panel | The catalog behind is dense with packshots on white, which stay legible under a flat scrim and compete with the panel |
| Product tile press | card `scale(0.99)`, `--dur-press`, scoped to the tile link | The whole card is one target now, so the whole card answers the press |
| Arrow affordances | translate 2px toward their direction on hover | An arrow means "onward", so it should move that way |
| Quote drawer, desktop | `translateX(100%)`, `--dur-panel` in / 240ms out, no fade | A full slide where the centred panel gets 4px: the panel is a layer over the page and only has to say so, the drawer is furniture attached to one side and has to say which side |
| Quote bar entry | fade + `translateY(12px)`, 240ms, no exit | It arrives from below the edge it sits on. No exit keyframe: it leaves because the buyer emptied the list, and animating that out keeps a bar on screen describing a quote that is gone |
| WhatsApp FAB lift | `translateY(-64px)`, 180ms, below `lg` only | The quote bar takes the bottom edge. The FAB moves rather than hides: a control that vanishes because you added a product is a control the buyer then has to go looking for |

**Not in this system:** scroll hijack, pinned sections, parallax, marquees, magnetic cursors, custom cursors, infinite loops. A supply buyer wants the quote form, not a ride.

---

## 5. Component contracts

> **Implementation note (shadcn/ui migration).** UI primitives now live in
> `components/ui/` and are built on shadcn/ui (Radix primitives + CVA + `cn()`),
> installed via `npx shadcn@latest add` and then restyled to this document.
> The tokens above are unchanged: shadcn's variable names are aliased to the
> semantic tokens in an `@theme inline` bridge in `app/globals.css`, so
> `.on-dark` / `.on-light` remapping flows through every component. The
> contracts below still govern; when regenerating or adding a shadcn
> component, re-apply the restyle rules (no `dark:`, no bare `hover:` — use
> `hover-fine:` — named-property transitions on `--ease-out`, token radii,
> Phosphor icons, repo focus outline).

### Button

Three variants, three sizes. `--radius-md`. Sentence case, sans face, weight 600, `0.02em` tracking.

Sizes are `md` (h-11), `lg` (h-13) and `icon` — a 44px square carrying a glyph and no label, for a bar control that has no room for one. `icon` sets its own glyph size, since the 16px an inline icon takes beside a label is far too small alone in a 44px target.

| Variant | Rest | Hover | Notes |
|---|---|---|---|
| `primary` | `brand` fill, white label | deepens to `teal-700` | The default. Every CTA on the site. |
| `inverse` | white fill, `ink-900` label | tints to `teal-50` | For dark grounds. An outlined button on the hero read as a hole in the background. |
| `secondary` | `surface` fill, `border-strong` | border and label to `accent` | Light grounds only. |
| `tinted` | `teal-100` fill, `accent-deep` label | `teal-200` | Apple's tinted button. Available, not currently used. |
| `secondary` | transparent, `border` 1px, `text` | `accent` border and text | |
| `ghost` | transparent, `text-muted` | `text` | Nav and inline links |

On dark bands all three invert via `.on-dark`. All carry `:active { transform: scale(0.97) }` and a visible `:focus-visible` ring at `--color-focus`.

CTA labels: max 3 words, must never wrap at desktop.

### Field

Label **above**, `--font-mono`, `--text-xs`, uppercase. Input `--radius-sm`, `surface-sunken` fill with a matching border so it reads borderless at rest. Focus turns the fill white and the border `accent`. Error text **below** the input in `--color-error`, and `aria-invalid` plus `aria-describedby` are wired. Never placeholder-as-label.

### ProductTile

`--radius-lg`, 1px `border`, `surface`. Image area is a fixed `4:5` on white with `object-contain`: these are packshots, not scenery, and every one is shot on white. No image means the `iconKey` icon renders instead, so the grid can never break. Hover raises border to `accent` and scales the image `1.03`. Border is 1px at rest and 1px on hover with only the color changing, so there is no layout shift.

**The whole tile is a link** to `/productos/[slug]`, via `after:absolute after:inset-0` on the heading's anchor rather than an anchor wrapped around the card: one link, the product name as its accessible name, a card-sized hit target, and the WhatsApp button stays a sibling with `z-10` instead of an anchor nested inside another. Keyboard focus rings the stretched pseudo-element, so the outline traces the card.

A product with **no slug** loses the link *and* the hover affordances. A border that lifts to `accent` on a card that cannot be clicked is the §9 anti-pattern, so the two have to move together.

**Padding responds to the tile, not the viewport.** The tile is a `@container`, and below `240px` of its own width the image padding drops to 10px, the body to 14px and the CTA's side padding to 12px. The same phone renders this tile at 169px in the catalog's two-column grid and at 350px on the home page, so a `sm:` rule would tighten the wrong one. One container query keeps it right in both grids and at every desktop column count, with no density prop to thread through.

### ProductDialog

Radix Dialog, one component, three materials, selected by `variant`. Below the breakpoint both variants are the same bottom sheet, capped at `88dvh` with only the top corners at `--radius-lg`: a phone has one good place to put a panel and the distinction has nowhere to exist there.

| `variant` | Above the breakpoint | Breakpoint | Used by |
|---|---|---|---|
| `panel` (default) | centred, `max-w-3xl`, capped at `min(85dvh, 52rem)`, `--radius-lg`, `--shadow-lg` | `sm` | the product overlay |
| `drawer` | docked to the right edge, `h-dvh`, `26rem`, square corners | `lg` | the quote |

The breakpoints differ on purpose. The product overlay is opened from a tile at every width, so it changes material as soon as there is room. The quote's entry point changes hands at `lg` (bar below, nav glyph above), so its material changes where its control does and the panel always arrives from the edge the control sits on.

Positioning is a `pointer-events-none` flex wrapper, not `translate(-50%, -50%)`. That leaves `transform` free for the animation; a centred dialog that also animates transform has to bake the offsets into every keyframe, and every future keyframe has to remember. The wrapper passes clicks through to the scrim so dismiss-on-outside-press still fires.

`transform-origin` stays centred. A modal is not anchored to a trigger, so it is the exception to the origin-aware rule that governs popovers. Enter and exit are CSS keyframes, not transitions, because Radix waits for `animationend` before unmounting.

The product name lives in the sticky header bar, not in the body: on a phone the packshot is the tallest thing in the sheet, and a title under it means the buyer opens a product and cannot see which product it is. The close control matches `SheetCloseButton` exactly.

### Quote (cotización)

A buyer collecting eight references used to open eight WhatsApp chats. The quote is a list in the browser that ends in one message. No prices, no checkout, no database: `localStorage` under `salu.quote.v1`, discarded after 30 days, and the only thing it can produce is a prefilled WhatsApp deep link.

**It is a cotización, never a carrito.** Nothing here has a price and nothing gets paid for, so the word and the glyph are a clipboard, not a shopping cart. A cart promises a transaction that never arrives.

Four parts:

| Part | Where | When |
|---|---|---|
| `AddToQuoteButton` | tile, product page, product overlay | always, if the product has a slug |
| `QuoteNavButton` | nav bar, `lg` and up | always, with a `teal-300` count badge when the list is not empty |
| `QuoteBar` | fixed to the bottom edge, below `lg` | only when the list is not empty |
| `QuotePanel` | site layout, once | on demand, from either control |

The two entry points are deliberate opposites and never both visible. The nav is sticky at every scroll position, so on desktop a permanent glyph there is enough and a bar underneath would be a second copy of the same button. On a phone the header already carries a WhatsApp glyph and a hamburger and has no room for a third control, so the bar is the only copy - and it costs nothing until the first product goes in.

**The tile foot is 75/25**, `grid-cols-[3fr_minmax(0,1fr)]`: WhatsApp keeps the primary, because the buyer of one reference should not lose today's one-tap path to a feature built for the buyer of eight. `minmax(0,...)` and not a bare `1fr`, or the button's min-content pushes the track past its quarter and overflows the card. Below 150px of *tile* the two stack, which is the same container-query logic the tile's padding already uses: at a 320px screen a quarter is 31px and three-quarters is narrower than the word "Cotizar".

The panel is `Dialog`'s `drawer` variant: the same bottom sheet as everything else below `lg`, docked to the right edge above it. A running list belongs against an edge and that is where every buyer already looks for one, so it is worth the variant; reusing `Dialog` to get it means the scrim, the focus trap and the sheet half all stay shared.

Reverse states, all four: the stepper's minus, the per-line trash, "Vaciar cotización" behind a two-press confirm, and the panel's own close. Adding is the only irreversible-looking act, and it isn't.

The pure half lives in `app/lib/quote.ts` with no DOM, no storage and no clock, which is what lets `app/lib/quote.test.ts` run under `node --test`. `app/lib/quote-store.ts` is the seam where all three arrive.

### ProductSpecs

A `<dl>`, one row per field that has a value, nothing rendered when none do. Every spec field is optional in the CMS and an empty row reads as missing data rather than as data that does not apply. Labels are the small-caps sans treatment; `species` renders as `outline` badges.

### Badge

`--radius-full`, the one place a pill is allowed (§3.2), which is exactly what distinguishes a label from a control here since buttons are never pill-shaped. Two variants: `tinted` (`teal-100` fill, `accent-deep` label) for the category, `outline` for set members like species.

### Section

Every section is `--space-section` vertical, `--space-gutter` horizontal, `--width-content` max. Headline alone by default. **Eyebrow budget: at most one eyebrow per three sections.** With eight sections that is two total, and the hero holds one of them.

---

## 6. Page architecture

Anchor IDs are contractual. Existing CTAs link to them.

| # | Section | Layout family | Surface |
|---|---|---|---|
| - | Nav | sticky bar, max 72px, single line | dark teal band on every route; transparent over the hero at rest, face fades in on scroll |
| 1 | `#hero` | full-bleed centred brand field, figures on a glass panel | teal gradient, **dark** |
| 2 | `#products` | asymmetric grid, white tiles | `teal-50` |
| 3 | `#purpose` | 7/5 split, three identical pillars beside a photo | paper |
| 4 | `#animal` | full-bleed photo band with copy overlay | photo, **dark** |
| 5 | `#testimonials` | three equal-height cards | `teal-50` |
| 6 | `#contact` | 2-col rails plus form | paper |
| 7 | `#cta` | centred close band | `teal-950` to `teal-600`, **dark** |
| - | Footer | multi-column | `teal-50`, light |

Seven sections, seven distinct layout families. No family repeats.

**WhatsApp is the primary conversion path, everywhere.** It is what this business actually closes on, so it is the primary button in the nav, the hero, every product tile, the photo band, the closing CTA and the footer, and it is a full brand-filled panel in `#contact`. The email form is the slow path and sits collapsed beside it. Product tiles prefill the message with the product name, so the chat opens already saying what the buyer was looking at.

**On mobile the nav CTA is a glyph, not a row in the menu.** Below `lg` the bar carries a bare WhatsApp glyph (`size="icon"`, 44px, on the same grid and the same 24px rung of the ladder as the hamburger beside it) rather than hiding the conversion path one tap deep inside the sheet. No surface: a second filled button in a bar this narrow competes with the logo, and the pair reads as two nav controls. The glyph is flat white — the bar is a dark band on every route and at every scroll position, so there is one ground to sit on. The full-width filled `Cotizar por WhatsApp` stays inside the sheet — while the menu is open, the bar glyph is behind the overlay. The floating FAB stays on every breakpoint; the redundancy is deliberate, since a thumb-height target costs nothing to leave in place.

**Dark moments bookend a light middle**: the hero and the closing CTA, with the photo band as the one dark beat between them. An earlier version had a dark hero followed immediately by a dark products band, which read as one long muddy stretch and cost the products their separation. Product photography also sits better on a light ground.

The figures live **inside** the hero, layered on the gradient, rather than as a separate band below it. That is the original design's instinct; only the material changed.

`#contact` deliberately sits at position 7. In the previous build it was position 3, asking for conversion before establishing any trust.

### Beyond the landing page

`/productos` is the full catalog: search, category chips, grid. `/productos/[slug]` is a single product.

The catalog grid is **two columns from the narrowest phone**, then 3 at `lg` and 4 at `xl`. One column at 390px gave each tile the whole viewport, so 64 products read as 64 full-screen pages and a buyer scanning for a reference saw one at a time. Two columns put four in view. The home page grid keeps its single mobile column: it carries three tiles, not 64, and there is nothing to scan.

**The search sticks under the nav; the chips do not.** A 64-product scroll should not have to be undone to type a name. The bar pins at `--nav-h` and takes a paper band and a hairline only once pinned, so the page at rest gains no chrome — the stuck state comes from an `IntersectionObserver` on a sentinel, the same pattern the nav uses for `data-scrolled`. The category chips wrap to three rows on a phone, and pinning 120px of filters would spend a sixth of the viewport on controls that are usually already set.

Filtering from the pinned bar **pulls the catalog back under the nav** if it had scrolled above it. Narrowing 64 products to 4 takes the page from 14,000px to 2,400px and the browser clamps the scroll, which otherwise strands the buyer past the end of results they cannot see. Nothing moves when the catalog is already in view, so typing never fights the page.

A product opened **from the catalog** is intercepted by the `@modal` slot and rendered as a dialog over the live grid, so the buyer's search term and category filter survive. The same URL loaded directly, refreshed or shared renders the standalone page. One `ProductDetail` feeds both; only the grid ratio, the gaps and the image `sizes` differ, because a catalog whose overlay says something different to its page is worse than having no overlay.

Tiles on the home page are **not** intercepted, since interception is scoped to `/productos`. That is deliberate: the catalog has expensive local state worth preserving and the home grid has none. A second root-level slot to make them match would be dead options.

The standalone page is a new layout family, not a repeat: media column left and sticky, copy right, related products of the same category below. The media is capped at `22rem` rather than left to fill its column, because a packshot scaled to a 500px track is mostly empty white with a sachet in the middle.

**The overlay has to open instantly, and instant is a measurement, not an opinion.** Measured click to panel-visible on a production build:

| | Before | After |
|---|---|---|
| Cold, no hover | 324ms | 324ms |
| Cold, pointer rested on the tile first | 380ms | **18ms** |
| Returning to a product already seen | 105ms | **11ms** |

Three changes get that, and all three are needed:

- **`unstable_dynamicOnHover` on the tile link** plus **`experimental.dynamicOnHover`** in `next.config.ts`. The overlay is a dynamic route, so Next's default prefetch reaches only the nearest `loading.js` and this route has none, meaning nothing arrived before the click. Hover and touchstart now trigger the full fetch. Neither half works alone.
- **`experimental.staleTimes: { dynamic: 120, static: 180 }`.** The client router may reuse a product it already holds for two minutes, so going back into one costs no server round trip. Kept short of a long cache on purpose: an edit in Studio still reaches a browsing buyer quickly.
- **One GROQ query per page and `cache()` around the read.** The product and its related siblings were two sequential Sanity calls, the second unable to start until the first returned, and `generateMetadata` fetched the product a second time. Now `productPageQuery` nests `related` under `^`, and `getProductPage` in `app/lib/products.ts` is request-deduplicated.

Two things to remember when judging this: **prefetching is disabled in `next dev`**, so any timing has to be taken against `next build && next start`; and Next cancels prefetches for links outside the viewport, so a link has to actually be on screen for hovering it to mean anything.

There is deliberately **no skeleton** for the overlay. With prefetch on intent the panel is already in memory on desktop, so a loading state would only ever flash, and a flash of chrome that resolves in 18ms reads as a glitch rather than as progress. The tile's own press feedback acknowledges the tap.

---

## 7. Imagery

The available photography has backgrounds and inconsistent lighting. The system absorbs that rather than fighting it.

### Tier 1 - editorial

Large or full-bleed photo blocks where the background is a **feature**. A unifying treatment makes mixed sources read as one set:

```css
.photo-editorial   { filter: saturate(0.88); }
.photo-editorial::after {
  background: color-mix(in oklab, var(--color-teal-700) 15%, transparent);
  mix-blend-mode: multiply;
}
```

Copy over a photo always sits on a scrim, never on the raw image.

**Slots.** Each reserves its aspect ratio, so an unsupplied photo costs zero CLS.

| Slot | File | Ratio | Content |
|---|---|---|---|
| Hero panel | `public/photos/hero.jpg` | 4:5 | Vet or clinic staff handling a SALU product, animal present, clinic visible |
| Animal band | `public/photos/animal.jpg` | 21:9 | Healthy dog, wide, clean left third for copy |
| Purpose cell | `public/photos/delivery.jpg` | 4:3 | Product cases in situ, or a delivery shot |

### Tier 2 - catalog

Fixed `1:1`, `object-cover`, gradient tile. Uniform regardless of source. Falls back to the `iconKey` icon.

### Delivery

All Sanity images go through `urlFor()` in `app/lib/image.ts`, which wraps `@sanity/image-url` and honours the `hotspot: true` already set on the schema. Every image is `next/image` with explicit `sizes`. `priority` on the hero only. **No raw `<img>` tags.**

---

## 8. Accessibility floor

Non-negotiable, checked before any change ships.

```bash
node scripts/contrast-audit.mjs   # 34 pairings, must print ALL PASS
node scripts/icon-audit.mjs       # icon language, must print ALL PASS
```

Every color pairing the site actually uses is in that script, with the ratio it needs. Change a color token, run it, and it tells you what broke. The previous build had five failing pairings, including every primary button on the site; none of them were visible without measuring.

- WCAG **AA**: 4.5:1 body, 3:1 for 18px+ and UI boundaries.
- Visible `:focus-visible` ring on every interactive element. Never `outline: none` without a replacement.
- Labels above inputs, errors below, `aria-invalid` and `aria-describedby` wired.
- Carousel is keyboard operable with real `<button>` controls and `aria-label`s.
- Decorative images `alt=""`. Meaningful images carry real Spanish alt text.
- Icons that stand alone carry `aria-label`. Icons beside text are `aria-hidden`.
- **One icon language.** Every glyph is Phosphor at `regular` weight, matching SF Symbols' single-family, single-stroke logic. The app previously mixed `fill` (WhatsApp, quotes), `bold` (arrows) and `light` (placeholders), so a solid WhatsApp glyph sat beside an outlined envelope and read as two different icon sets. Paired icons also share a container: same circle, same size, same stroke, and that container is `size-12` with a 24px glyph wherever it appears.
- **The exemption, and it is the only one: third-party brand marks.** `WhatsappLogo` renders at `fill`, through the `WhatsAppIcon` wrapper in `app/lib/icons.tsx`. A logo is not an icon; it is someone else's identity, and it renders the way its owner draws it. WhatsApp's mark is solid everywhere WhatsApp controls it, so an outlined copy reads as an approximation rather than as the real thing. The wrapper exists because the mark appears at eleven call sites and the exemption should have exactly one home.
- **A control owns its icon size; a standalone icon takes one off the ladder.** `button.tsx` carries `[&_svg:not([class*='size-'])]:size-4`, and `alert.tsx` and `badge.tsx` do the same, so an icon inside any of them is sized by CSS. A `size` prop there is overridden and does nothing. Pass no size inside a control. Outside one, use the ladder:

  | Size | Role |
  |---|---|
  | 16 | Inline beside text |
  | 20 | Affordances and controls: arrows, search, close |
  | 24 | Glyph in a `size-12` circle, and the nav bar's own controls - hamburger and WhatsApp - which pair at this size |
  | 28 | The WhatsApp FAB |
  | 40 | States and placeholders |
  | 64 / 96 | Product fallback art: tile, then detail frame |

  Before this ladder the app used ten sizes assigned per file rather than per role, `ArrowUpRight` appeared at both 20 and 18 inside `#contact` doing the same job twice, and nine `size` props inside buttons were dead. The sizes looked deliberate in the source and were not.
- `prefers-reduced-motion` honoured everywhere.
- `min-h-[100dvh]`, never `h-screen`. iOS Safari's address bar makes `100vh` jump.

---

## 9. Anti-patterns

This codebase drifted before. These are the specific regressions to refuse.

**From the previous build:**
- Hardcoding `#2AACB8`. There is a token. `grep '#2AACB8' app/` outside `globals.css` must return nothing.
- `transition: all 0.12s ...` copy-pasted per component.
- Large inline `style={{}}` objects. Style with utilities against tokens.
- Raw `<img>` with an eslint-disable comment above it.
- Hotlinking another company's assets.
- Shipping a form that submits to `action="#"`, or a captcha that gates nothing.
- Letting the type scale drift from the spec without updating the spec.
- **A `size` prop on an icon inside a control that already sizes it.** `button.tsx`, `alert.tsx` and `badge.tsx` all set the svg size in CSS, which wins. The prop reads as a deliberate choice and does nothing, so the next person tunes a number that has never had any effect. `scripts/icon-audit.mjs` fails on it.

**General:**
- Em-dashes (`—`) and en-dashes (`–`) in any visible string. Use a hyphen, a comma, or two sentences.
- Section-number eyebrows (`01 / Productos`), scroll cues, version labels, decorative status dots.
- Three identical feature cards in a row.
- **A carousel for content that fits on one screen.** Testimonials were behind arrows: three short quotes, two of them hidden, most readers never pressing next. A carousel earns its place only when there is more breadth than the screen can hold.
- **Stripping chrome until content has nothing to sit in.** The replacement for that carousel was bare text on hairline rules. It showed everything and looked unfinished: uneven quote lengths left every attribution at a different height. Minimal is not the same as unstructured. Where items in a row vary in length, give them equal-height cells and pin the footer with `mt-auto`, so the dividers land on one baseline.
- **Burying the real conversion path.** The contact section once led with a five-field form while WhatsApp, the channel that actually closes, was a phone number in a list beside it. Match the visual hierarchy to the business, not to what is conventional for a website.
- **Hover states on things that are not interactive.** A lift or border change on a static card promises a click that never happens.
- A second accent color appearing in one section.
- Fake-precise invented statistics. The three stats are client-supplied and real.
- Generic placeholder names or stock avatars standing in for real people.
