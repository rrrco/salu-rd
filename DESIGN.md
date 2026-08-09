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

**Logo.** `public/salu-img.png` is the dog-and-cat silhouette. On dark surfaces apply `filter: brightness(0) invert(1)` to render it white. `public/salu-logo.png` is the full lockup with wordmark; prefer the silhouette plus live text so the wordmark stays selectable and scalable.

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
| Arrow affordances | translate 2px toward their direction on hover | An arrow means "onward", so it should move that way |

**Not in this system:** scroll hijack, pinned sections, parallax, marquees, magnetic cursors, custom cursors, infinite loops. A supply buyer wants the quote form, not a ride.

---

## 5. Component contracts

### Button

Three variants, two sizes. `--radius-md`. Sentence case, sans face, weight 600, `0.02em` tracking.

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

`--radius-lg`, 1px `border`, `surface`. Image area is a fixed `1:1` on the `teal-100` to `teal-200` gradient with `object-cover`. No image means the `iconKey` icon renders instead, so the grid can never break. Hover raises border to `accent` and scales the image `1.03`. Border is 1px at rest and 1px on hover with only the color changing, so there is no layout shift.

### Section

Every section is `--space-section` vertical, `--space-gutter` horizontal, `--width-content` max. Headline alone by default. **Eyebrow budget: at most one eyebrow per three sections.** With eight sections that is two total, and the hero holds one of them.

---

## 6. Page architecture

Anchor IDs are contractual. Existing CTAs link to them.

| # | Section | Layout family | Surface |
|---|---|---|---|
| - | Nav | sticky bar, max 72px, single line | transparent over the hero, translucent light once scrolled |
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

**Dark moments bookend a light middle**: the hero and the closing CTA, with the photo band as the one dark beat between them. An earlier version had a dark hero followed immediately by a dark products band, which read as one long muddy stretch and cost the products their separation. Product photography also sits better on a light ground.

The figures live **inside** the hero, layered on the gradient, rather than as a separate band below it. That is the original design's instinct; only the material changed.

`#contact` deliberately sits at position 7. In the previous build it was position 3, asking for conversion before establishing any trust.

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
```

Every color pairing the site actually uses is in that script, with the ratio it needs. Change a color token, run it, and it tells you what broke. The previous build had five failing pairings, including every primary button on the site; none of them were visible without measuring.

- WCAG **AA**: 4.5:1 body, 3:1 for 18px+ and UI boundaries.
- Visible `:focus-visible` ring on every interactive element. Never `outline: none` without a replacement.
- Labels above inputs, errors below, `aria-invalid` and `aria-describedby` wired.
- Carousel is keyboard operable with real `<button>` controls and `aria-label`s.
- Decorative images `alt=""`. Meaningful images carry real Spanish alt text.
- Icons that stand alone carry `aria-label`. Icons beside text are `aria-hidden`.
- **One icon language.** Every glyph is Phosphor at `regular` weight, matching SF Symbols' single-family, single-stroke logic. The app previously mixed `fill` (WhatsApp, quotes), `bold` (arrows) and `light` (placeholders), so a solid WhatsApp glyph sat beside an outlined envelope and read as two different icon sets. Paired icons also share a container: same circle, same size, same stroke.
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
