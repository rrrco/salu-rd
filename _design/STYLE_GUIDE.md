# SALU División Veterinaria — Design System & Style Guide

> Design tokens, component patterns, and system rules extracted directly from `salu.html`.
> All values are exact — sourced from the live code, not approximated.

---

## 1. Overview

| Property | Value |
|---|---|
| **Project** | SALU División Veterinaria — B2B veterinary product & medication supplier landing page |
| **Stack** | Single-file HTML, vanilla CSS (custom properties), vanilla JS (carousel + reCAPTCHA toggle) |
| **Design Language** | Clean, medical-grade. Sharp edges (zero border-radius on all primary UI), aqua-teal brand accent, Poppins typeface throughout. |
| **Layout engine** | CSS Grid (sections, form rows, product grid) + Flexbox (components, hero, carousel track) |
| **Max content width** | `1290px` (`.wrap`) |
| **Stats bar max width** | `1100px` |
| **Breakpoints** | `≤1100px`, `≤900px`, `≤640px` |
| **Base font** | Poppins via Google Fonts (weights 400, 500, 600, 700 — normal + italic) |
| **Reset** | Universal `box-sizing: border-box` + `margin: 0; padding: 0` |
| **Smooth scroll** | `html { scroll-behavior: smooth; }` |

**Design personality:** Professional, nature-forward, trust-building. Teal is used exclusively for trust signals, CTAs, and brand identity — it references health, water, and animal wellbeing simultaneously. Dark charcoal text on white backgrounds provides clinical clarity. Zero border-radius on all cards and buttons reinforces a B2B veterinary professionalism; the teal color alone provides warmth. A deliberate "illuminate on hover" principle — all interactive states move to *lighter* teal, never darker.

**Logo color derivation:**
- Teal animal silhouette → primary brand accent `#2AACB8`
- Charcoal wordmark → heading and body text `#222222` / `#3D3D3D`

---

## 2. Color Palette

### CSS Custom Properties

```css
:root {
  --teal:  #2AACB8;   /* Primary brand teal — CTAs, accents, icons, numbers */
  --teal2: #4DC4CE;   /* Hover teal — lighter/brighter shift on interaction */
  --dark:  #3D3D3D;   /* Body text — neutral charcoal */
  --head:  #222222;   /* Headings — near-black */
  --ease:  all 0.12s cubic-bezier(0.455, 0.03, 0.515, 0.955);
}
```

### Full Color Inventory

| Token / Value | Role | Where Used |
|---|---|---|
| `#2AACB8` (`--teal`) | Primary brand teal | Buttons, stat numbers, icon circle bg, sec-divider, product card hover border, carousel dot (active), carousel btn border/icon, avatar border, contact info borders, WhatsApp FAB bg, form focus ring, tcard-loc text |
| `#4DC4CE` (`--teal2`) | Hover teal | `.btn:hover`, `.wa-fab:hover`, carousel btn hover fill |
| `#222222` (`--head`) | Heading color | All headings (h1–h3), `.sec-title`, `.form-card-title`, `.contact-left-title`, `.tcard-name`, labels |
| `#3D3D3D` (`--dark`) | Body/default text | Paragraphs, `.stat-lbl`, `.cinfo-value`, `.prod-name`, form inputs |
| `#0A6973` | Deep ocean teal | `#products` section background |
| `#EBF8F9` | Pale aqua/mint | `#animal` section background, product card image area gradient start |
| `#C2EDF1` | Light aqua | Product card image area gradient end (`#EBF8F9 → #C2EDF1`) |
| `#f5f7f7` | Input background | Form field resting bg + resting border (invisible — matches bg) |
| `#efefef` | Divider lines | Stats bar cell borders, testimonial card border |
| `#f9f9f9` | reCAPTCHA bg | Fake captcha widget background |
| `#d3d3d3` | reCAPTCHA border | Fake captcha widget border |
| `#c1c1c1` | Checkbox border | reCAPTCHA unchecked checkbox border |
| `#fff` | White | Page bg, card bgs, button text, hero/CTA text, purpose card text |
| `#d0d0d0` | Inactive dots | Carousel pagination dots (resting) |
| `#f5a623` | Amber/gold | Star ratings `★★★★★` in testimonials |
| `#555` | Mid-grey | reCAPTCHA label + logo text |
| `rgba(0,0,0,0.15)` | Stats bar shadow | Strongest shadow — creates "floating over hero" effect |
| `rgba(0,0,0,0.10)` | Form card shadow | Medium shadow |
| `rgba(0,0,0,0.07)` | Testimonial card shadow | Lowest shadow — minimal lift |
| `rgba(42,172,184,0.40)` | WhatsApp FAB shadow | Brand-teal glow — `#2AACB8` at 40% opacity |
| `rgba(42,172,184,0.35)` | Contact info border | Dashed separator between contact info rows |
| `rgba(255,255,255,0.88)` | `.hero-desc` text | 88% white — secondary hierarchy below H1 |
| `rgba(255,255,255,0.85)` | `.hero-sub` text | 85% white — subdued italic tagline |
| `rgba(255,255,255,0.82)` | `.logo-sub` text | 82% white — "División Veterinaria" subtitle |
| `rgba(255,255,255,0.94)` | `.pur-card p` | Body text on teal cards — micro-hierarchy without color change |
| `rgba(255,255,255,0.5)` | Products `.sec-divider` | Dimmed white divider bar on dark teal section bg |
| `rgba(255,255,255,0.15)` | CTA icon | salu-img.png opacity on dark CTA gradient |
| `rgba(42,172,184,0.15)` | SVG fill in icons | Subtle inner fill on antibiotic capsule SVG icon |
| `rgba(42,172,184,0.2)` | SVG fill in icons | Pupil fill on eye icon; liquid fill on syringe |

### Color Usage Patterns

- **Teal dominates interactive surfaces** — every CTA button, icon circle, focus ring, hover state is `#2AACB8`
- **Hover always lighter** — `#2AACB8` → `#4DC4CE` (never darkened); creates luminous, upward feel
- **Backgrounds are section-level** — white, deep teal (`#0A6973`), pale aqua (`#EBF8F9`) each own a full section
- **Text never pure black** — `#222222` headings + `#3D3D3D` body = softer, more approachable reading
- **The teal family stays cohesive** — `#0A6973`, `#2AACB8`, `#4DC4CE`, `#EBF8F9` are all the same hue, sampled from logo

### Teal Color Scale

```
#0A6973  →  Deep teal       (section background — darkest)
#2AACB8  →  Brand teal      ← PRIMARY (logo silhouette)
#4DC4CE  →  Hover teal      ← INTERACTIVE STATE
#EBF8F9  →  Aqua white      (light section background — lightest)
```

### Hero & CTA Gradients

```css
/* Hero background */
background: linear-gradient(155deg, #082E32 0%, #0A5C66 40%, #18909E 80%, #2AACB8 100%);

/* CTA background */
background: linear-gradient(135deg, #062428 0%, #0A4D55 50%, #0E7A86 100%);

/* Product card image area */
background: linear-gradient(135deg, #EBF8F9 0%, #C2EDF1 100%);
```

---

## 3. Typography

### Font Family

```css
font-family: 'Poppins', sans-serif;
/* Loaded weights: 400, 500, 600, 700 — both normal and italic */
/* Google Fonts preconnect used for performance */
```

Single font family. Weight + italic carry all hierarchy. Poppins's geometric rounded letterforms mirror the soft-but-precise animal silhouette in the SALU logo.

### Complete Type Scale

| Element | Size | Weight | Style | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|---|
| `.logo-name` | `52px` | `700` | normal | `1` | `-1px` | `#fff` |
| `.logo-name` (≤640px) | `38px` | `700` | normal | `1` | `-1px` | `#fff` |
| `.hero-h1` | `52px` | `700` | italic | `1.14` | — | `#fff` |
| `.hero-h1` (≤900px) | `38px` | `700` | italic | `1.14` | — | `#fff` |
| `.hero-h1` (≤640px) | `28px` | `700` | italic | `1.14` | — | `#fff` |
| `.cta-inner h2` | `40px` | `700` | normal | `1.25` | — | `#fff` |
| `.cta-inner h2` (≤640px) | `26px` | `700` | normal | `1.25` | — | `#fff` |
| `.sec-title` | `34px` | `700` | normal | `1.2` | — | `#222222` |
| `.sec-title` (≤640px) | `28px` | `700` | normal | `1.2` | — | `#222222` |
| `.sec-title.white` | `34px` | `700` | normal | `1.2` | — | `#fff` |
| `.contact-left-title` | `32px` | `700` | normal | — | — | `#222222` |
| `.animal-left h2` | `36px` | `700` | normal | `1.25` | — | `#222222` |
| `.form-card-title` | `26px` | `700` | normal | — | — | `#222222` |
| `.pur-card h3` | `20px` | `700` | normal | `1.25` | — | `#fff` |
| `.tcard-name` | `17px` | `700` | normal | — | — | `#222222` |
| `.stat-num` | `69px` | `700` | normal | `1` | — | `#2AACB8` |
| `.stat-num` (≤640px) | `44px` | `700` | normal | `1` | — | `#2AACB8` |
| `.stat-lbl` | `19px` | `500` | normal | `1.3` | — | `#3D3D3D` |
| `.stat-lbl` (≤640px) | `14px` | `500` | normal | `1.3` | — | `#3D3D3D` |
| `.logo-sub` | `15px` | `400` | italic | — | `0.3px` | `rgba(255,255,255,0.82)` |
| `.hero-sub` | `15px` | `500` | italic | — | — | `rgba(255,255,255,0.85)` |
| `.hero-desc` | `15px` | `400` | normal | `1.75` | — | `rgba(255,255,255,0.88)` |
| `.prod-name` | `15px` | `500` | normal | `1.4` | — | `#222222` |
| `.tcard-loc` | `13px` | `500` | normal | — | `0.5px` | `#2AACB8` |
| `.tcard-quote` | `14px` | `400` | italic | `1.82` | — | `#3D3D3D` |
| `.cinfo-label` | `13px` | `600` | normal | — | `0.4px` | `#222222` |
| `.cinfo-value` | `15px` | `400` | normal | `1.4` | — | `#3D3D3D` |
| `.fgroup label` | `12px` | `600` | normal | — | `0.4px` | `#222222` |
| `.fgroup input/textarea` | `14px` | `400` | normal | — | — | `#3D3D3D` |
| `.btn` | `13px` | `600` | normal | — | `0.6px` | `#fff` |
| `.pur-card p` | `14px` | `400` | normal | `1.75` | — | `rgba(255,255,255,0.94)` |
| `.animal-left p` | `14px` | `400` | normal | `1.78` | — | `#3D3D3D` |
| `.recaptcha-label` | `14px` | `400` | normal | — | — | `#555` |
| `.recaptcha-logo-text` | `8px` | `400` | normal | — | `0.2px` | `#555` |

### Typography Combination Patterns

**Hero — layered weight + italic for drama:**
```
italic 500 15px  →  Tagline "Tu socio de confianza en salud animal"   [85% white]
italic 700 52px  →  Main H1                                            [max impact, white]
normal 400 15px  →  Description paragraph                              [88% white, leading 1.75]
normal 600 13px  →  CTA button                                         [uppercase, 0.6px tracking]
```

**Stats Block — number dominance, label as annotation:**
```
bold 700 69px   →  Number  [large teal — takes full visual real estate]
medium 500 19px →  Label   [clearly secondary — charcoal]
```

**Section Headers — consistent 2-layer rhythm:**
```
bold 700 34px  →  Section title (.sec-title)
4×48px teal bar →  Visual separator (.sec-divider)
```

**Purpose Cards — white-on-teal hierarchy:**
```
bold 700 20px     →  Card heading [pure white, line-height 1.25]
regular 400 14px  →  Body text    [94% white opacity — micro-hierarchy]
```

**Testimonials — portrait attribution chain:**
```
bold 700 17px          →  Name     [charcoal]
medium 500 13px UPPER  →  Location [teal, 0.5px tracking] ← only teal-colored text on white bg
italic 400 14px        →  Quote    [charcoal, line-height 1.82]
```

**Contact Info Rows:**
```
semibold 600 13px UPPER  →  Label  [charcoal, 0.4px tracking]
regular 400 15px         →  Value  [dark charcoal]
```

**Form Fields:**
```
semibold 600 12px UPPER  →  Label  [charcoal, 0.4px tracking]
regular 400 14px         →  Input  [dark charcoal]
```

---

## 4. Spacing System

### Section Vertical Padding

| Section | Desktop Padding | Mobile (≤640px) |
|---|---|---|
| `#hero` | `60px 20px 96px` | `60px 20px` |
| `#contact` | `100px 30px` | `60px 20px` |
| `#products` | `80px 30px` | `60px 20px` |
| `#purpose` | `100px 30px` | `60px 20px` |
| `#animal` | `80px 30px 0` (via `.animal-grid`) | inherits grid |
| `#testimonials` | `100px 30px` | `60px 20px` |
| `#cta` | `100px 30px` | `60px 20px` |

> `#hero` desktop: bottom padding is `96px` so the stats bar (`margin-top: -80px`) creates a visible 16px (~1rem) gap between the CTA button and the stats bar top.

### Component Internal Spacing

| Component | Padding |
|---|---|
| `.btn` (default) | `0 28px`, height `44px` |
| `.btn.btn-lg` | `0 36px`, height `50px` |
| `.contact-form-card` | `46px 40px 48px` |
| `.contact-form-card` (≤640px) | `30px 20px 32px` |
| `.pur-card` | `46px 32px 42px` |
| `.tcard` | `46px 40px` |
| `.tcard` (≤640px) | `30px 20px` |
| `.prod-body` | `20px 20px 22px` |
| `.stat-item` | `36px 20px` |
| `.stat-item` (≤640px) | `24px 12px` |
| `.cinfo` | `20px 0` (vertical) |
| `.cinfo:first-of-type` | `0` top padding |
| `.car-slide` | `0 20px` |
| `.car-slide` (≤640px) | `0 8px` |
| `.recaptcha-row` | `16px 18px` |
| `.wrap` | `0 30px` (horizontal only) |
| `.frow` gap | `16px` |
| `.frow` margin-bottom | `16px` |

### Grid Gaps

| Grid | Gap |
|---|---|
| `.contact-grid` | `64px` |
| `.contact-grid` (≤1100px) | `44px` |
| `.prod-grid` | `20px` |
| `.purpose-grid` | `24px` |
| `.animal-grid` | `40px` |
| `.frow` (form rows) | `16px` |
| `.prod-body` (flex) | `14px` |
| `.hero-logo` (flex) | `18px` |
| `.cinfo` icon-to-text | `18px` |
| `.car-dots` | `8px` |
| `.car-nav` | `16px` |

### Key Dimensional Values

| Element | Value |
|---|---|
| Max content width (`.wrap`) | `1290px` |
| Stats bar max-width | `1100px` |
| Stats bar width | `calc(100% - 60px)` desktop, `calc(100% - 30px)` mobile |
| Stats bar margin | `-80px auto 0` desktop, `16px auto 0` mobile (≤640px) |
| Hero min-height | `55vh` |
| Hero H1 max-width | `860px` |
| Hero desc max-width | `720px` |
| CTA heading max-width | `660px` |
| Product image area height | `200px` |
| Animal image max-width | `520px` desktop, `420px` (≤1100px) |
| Contact icon circle | `50×50px` |
| Carousel nav button | `44×44px` (desktop), `36×36px` (≤640px) |
| Carousel nav button (mobile) | `36×36px` |
| WhatsApp FAB | `58×58px`, bottom/right `28px` |
| Testimonial avatar | `80×80px` |
| `.sec-divider` | `48px wide × 4px tall` |
| `.tcard` max-width | `680px` |
| Logo image in hero | `80×90px` |
| CTA logo image | `60×68px` |

---

## 5. Component Styles

### Button

Two sizes, one style. Always sharp corners. Always teal.

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--teal);           /* #2AACB8 */
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  border-radius: 0;                  /* Sharp — intentional medical/B2B choice */
  padding: 0 28px;
  height: 44px;
  transition: var(--ease);
  cursor: pointer;
  border: none;
}
.btn:hover { background: var(--teal2); }   /* #4DC4CE — lighter, not darker */

.btn.btn-lg {
  height: 50px;
  padding: 0 36px;
}

/* Full-width form submit */
.btn-send { width: 100%; height: 50px; }
```

**Usage:** `.btn` — product "COTIZACIÓN GRATIS" inside cards. `.btn.btn-lg` — hero CTA, section CTAs, animal section, CTA section. `.btn-send` — form submit.

---

### Stats Bar

```css
.stats-bar {
  position: relative;
  z-index: 10;
  max-width: 1100px;
  width: calc(100% - 60px);
  margin: -80px auto 0;              /* Negative margin overlaps hero bottom */
  background: #fff;
  box-shadow: 0 8px 48px rgba(0,0,0,0.15);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.stat-item {
  padding: 36px 20px;
  text-align: center;
  border-right: 1px solid #efefef;
}
.stat-item:last-child { border-right: none; }

.stat-num {
  font-size: 69px;
  font-weight: 700;
  color: var(--teal);
  line-height: 1;
  margin-bottom: 8px;
}

.stat-lbl {
  font-size: 19px;
  font-weight: 500;
  color: var(--dark);
  line-height: 1.3;
}
```

**Key technique:** The stats bar lives outside `#hero` in the DOM but `margin-top: -80px` pulls it up to visually overlap the hero bottom. The hero has `padding-bottom: 96px` which creates a visible `16px` gap above the stats bar. On mobile (≤640px), the negative margin is overridden to `16px auto 0` so there's no overlap problem when hero bottom padding collapses.

---

### Product Card

```css
.prod-card {
  background: #fff;
  border: 2px solid transparent;    /* Pre-allocates space — no layout jump on hover */
  transition: var(--ease);
  display: flex;
  flex-direction: column;
}
.prod-card:hover { border-color: var(--teal); }

.prod-img-area {
  height: 200px;
  background: linear-gradient(135deg, #EBF8F9 0%, #C2EDF1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.prod-body {
  padding: 20px 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;                           /* Pushes button to bottom */
}

.prod-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--head);
  line-height: 1.4;
}
```

**Key technique:** `border: 2px solid transparent` pre-reserves border space so the layout doesn't jump 2px on hover. Product icons are inline SVGs with `stroke="var(--teal)"` and subtle `rgba(42,172,184,0.15)` fills — line-art style on the aqua gradient background.

---

### Purpose Card

```css
.pur-card {
  background: var(--teal);           /* #2AACB8 — full brand color fill */
  padding: 46px 32px 42px;
  color: #fff;
}

.pur-icon { margin-bottom: 24px; }

.pur-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 14px;
  line-height: 1.25;
}

.pur-card p {
  font-size: 14px;
  font-weight: 400;
  color: rgba(255,255,255,0.94);     /* 94% opacity — micro-hierarchy on same color bg */
  line-height: 1.75;
}
```

**Key technique:** Body text uses `rgba(255,255,255,0.94)` — a 6% transparency drop that creates tiered readability without introducing a second color. The icons are white-stroke SVG polygon gems.

---

### Contact Form Card

```css
.contact-form-card {
  background: #fff;
  box-shadow: 0 4px 40px rgba(0,0,0,0.10);
  padding: 46px 40px 48px;
}

.fgroup { display: flex; flex-direction: column; gap: 6px; }

.fgroup label {
  font-size: 12px;
  font-weight: 600;
  color: var(--head);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.fgroup input,
.fgroup textarea {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: var(--dark);
  background: #f5f7f7;
  border: 1.5px solid #f5f7f7;      /* Matches bg — borderless at rest */
  border-radius: 0;
  padding: 12px 16px;
  outline: none;
  transition: var(--ease);
  width: 100%;
}

/* Focus: bg turns white, border turns teal */
.fgroup input:focus,
.fgroup textarea:focus {
  border-color: var(--teal);
  background: #fff;
}

.fgroup textarea {
  resize: vertical;
  min-height: 110px;
}
```

**Key technique:** Input resting state uses `border: 1.5px solid #f5f7f7` (matching background) so borders are invisible at rest. On focus, `border-color: var(--teal)` and `background: #fff` — the teal ring on white is an unmistakable brand-branded focus signal.

---

### Contact Info Row

```css
.cinfo {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 20px 0;
  border-bottom: 1.5px dashed rgba(42,172,184,0.35);
}
.cinfo:first-of-type { padding-top: 0; }

.cinfo-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--teal);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cinfo-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--head);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.cinfo-value {
  font-size: 15px;
  font-weight: 400;
  color: var(--dark);
}
```

**Key technique:** `border-bottom: 1.5px dashed rgba(42,172,184,0.35)` — dashed teal at 35% opacity creates a rhythmic, elegant connector that repeats the brand color without being heavy. `flex-shrink: 0` on the icon prevents it from squishing on long text.

---

### Testimonial Card

```css
.tcard {
  background: #fff;
  border: 1px solid #efefef;
  box-shadow: 0 4px 28px rgba(0,0,0,0.07);
  padding: 46px 40px;
  text-align: center;
  max-width: 680px;
  margin: 0 auto;
}

.tcard-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid var(--teal);     /* Teal ring — brand anchor on portrait */
  object-fit: cover;
  margin: 0 auto 18px;
}

.tcard-loc {
  font-size: 13px;
  font-weight: 500;
  color: var(--teal);                /* Only teal-colored text on white background */
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.tcard-stars {
  font-size: 18px;
  color: #f5a623;                    /* Amber stars */
  letter-spacing: 2px;
  margin-bottom: 18px;
}

.tcard-quote {
  font-size: 14px;
  font-style: italic;
  color: var(--dark);
  line-height: 1.82;
}
```

---

### Carousel

```css
.car-outer {
  position: relative;
  overflow: hidden;
}

.car-track {
  display: flex;
  transition: transform 0.42s cubic-bezier(0.455, 0.03, 0.515, 0.955);
  will-change: transform;
}

.car-slide {
  min-width: 100%;
  padding: 0 20px;
}

/* Navigation buttons */
.car-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--teal);
  background: transparent;
  color: var(--teal);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--ease);
  flex-shrink: 0;
}
.car-btn:hover { background: var(--teal); color: #fff; }

/* Pagination dots */
.car-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d0d0d0;
  cursor: pointer;
  transition: var(--ease);
  border: none;
  padding: 0;
}
.car-dot.active {
  background: var(--teal);
  width: 24px;
  border-radius: 4px;               /* Active dot stretches to pill shape */
}
```

**JS behavior:** `translateX(-${index * 100}%)` on `.car-track`. Auto-advance every `5000ms`. Touch swipe support with `40px` threshold. Hover pauses auto-advance.

---

### Section Divider

```css
.sec-divider {
  width: 48px;
  height: 4px;
  background: var(--teal);
  margin-bottom: 48px;
}
.sec-divider.white { background: #fff; }
```

---

### WhatsApp FAB

```css
.wa-fab {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: var(--teal);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(42,172,184,0.40);  /* Brand-teal glow */
  z-index: 1000;
  transition: var(--ease);
}
.wa-fab:hover {
  background: var(--teal2);
  transform: scale(1.08);           /* Only transform:scale in the project */
}
```

---

### Logo Image Treatment

```html
<!-- Hero (dark gradient bg) — white silhouette via CSS filter -->
<img src="salu-img.png" style="filter: brightness(0) invert(1);" width="80" height="90" />

<!-- CTA (dark gradient bg) — white silhouette, dimmed -->
<img src="salu-img.png" style="filter: brightness(0) invert(1); opacity: 0.55;" width="60" height="68" />

<!-- White-bg sections — use salu-logo.png as-is, no filter needed -->
<img src="salu-logo.png" />
```

**Rationale:** `salu-img.png` and `salu-logo.png` have white backgrounds. `filter: brightness(0) invert(1)` converts any image to a clean white silhouette — the white bg becomes transparent-equivalent on white-text dark backgrounds. No background removal required for this technique.

---

## 6. Shadows & Elevation

| Level | Value | Used On | Effect |
|---|---|---|---|
| **0 — Flat** | none | Buttons, purpose cards, inputs (rest) | Ground-level, no elevation |
| **1 — Subtle** | `0 4px 28px rgba(0,0,0,0.07)` | Testimonial card | Very gentle lift |
| **2 — Medium** | `0 4px 40px rgba(0,0,0,0.10)` | Contact form card | Noticeable float |
| **3 — Strong** | `0 8px 48px rgba(0,0,0,0.15)` | Stats bar | Strongest — "floating over hero" illusion |
| **4 — Brand-glow** | `0 4px 20px rgba(42,172,184,0.40)` | WhatsApp FAB | Teal-colored glow — shadow matches button color |

**Patterns:**
- Shadow blur increases with importance: `28px` → `40px` → `48px`
- Y-offset is always `4px` or `8px` (positive — shadows fall down)
- No `inset` or upward shadows anywhere
- Brand-tinted shadow on FAB: `rgba(42,172,184,0.40)` = `#2AACB8` decoded to RGB at 40%

---

## 7. Animations & Transitions

### Global Easing Token

```css
--ease: all 0.12s cubic-bezier(0.455, 0.03, 0.515, 0.955);
```

This is a **Sine In Out** ease curve. At `0.12s` it's deliberately snappy — almost instant but not jarring. Applied to every interactive element for absolute consistency.

### Transition Applications

| Element | Transition | Effect |
|---|---|---|
| `.btn` | `var(--ease)` | `#2AACB8` → `#4DC4CE` background |
| `.prod-card` | `var(--ease)` | Transparent border → `#2AACB8` border |
| `.fgroup input/textarea` | `var(--ease)` | Grey bg + invisible border → white bg + teal border |
| `.car-btn` | `var(--ease)` | Transparent fill + teal outline → solid teal fill + white icon |
| `.car-dot` | `var(--ease)` | `#d0d0d0` → `#2AACB8` + width `8px` → `24px` pill |
| `.wa-fab` | `var(--ease)` | `#2AACB8` → `#4DC4CE` + `scale(1.08)` |
| `.car-track` | `transform 0.42s cubic-bezier(0.455, 0.03, 0.515, 0.955)` | Slide translation |

### Hover Direction Principle

Every hover transition moves toward **lighter and brighter** — never darker:
- `#2AACB8` → `#4DC4CE` (button, FAB)
- Transparent → `#2AACB8` (product card border)
- Teal outline → solid teal fill (carousel nav btn)
- Grey → teal (carousel dot)

This "illuminate on hover" pattern aligns with the brand tone — trustworthy and uplifting.

### Carousel Timing

- Slide transition: `0.42s` (same curve as `--ease`, 3.5× slower for intentional slide feel)
- Auto-advance interval: `5000ms`
- User interaction resets the timer
- Touch swipe threshold: `40px` minimum displacement
- `will-change: transform` on `.car-track` for GPU compositing

### Page Scroll

```css
html { scroll-behavior: smooth; }
```

All anchor links (`#contact`, `#products`) use native smooth scrolling.

---

## 8. Border Radius

**Design principle:** Zero border-radius on all containers. Circle-only on circular UI elements.

| Element | Border Radius | Rationale |
|---|---|---|
| `.btn` | `0` | Sharp — authority, precision |
| `.contact-form-card` | `0` | Clinical, sharp card |
| `.prod-card` | `0` | Product catalog feel |
| `.pur-card` | `0` | Uniform card system |
| `.tcard` | `0` | Consistent with card system |
| `.fgroup input, textarea` | `0` | Matches button/card system |
| `.cinfo-icon` | `50%` | Circle — icon container |
| `.tcard-avatar` | `50%` | Circle — portrait |
| `.car-btn` | `50%` | Circle — nav button |
| `.wa-fab` | `50%` | Circle — FAB |
| `.car-dot` | `50%` → `4px` when active | Circle → pill for active state |
| `.recaptcha-check` | `3px` | Slight softening — matches Google widget feel |

**Rule:** Container (card, button, input) → `0`. Circular element (icon, avatar, FAB, dot) → `50%`.

**Brand note:** Circular elements carry the "soft, caring" equity of the SALU logo's rounded animal silhouette. Sharp containers carry medical-grade precision. Both sides of the brand — caring and precise — are expressed through radius alone.

---

## 9. Opacity & Transparency

| Value | Where Used | Purpose |
|---|---|---|
| `rgba(255,255,255,0.88)` | `.hero-desc` | 88% white — secondary reading hierarchy below H1 |
| `rgba(255,255,255,0.85)` | `.hero-sub` | 85% white — subdued italic tagline |
| `rgba(255,255,255,0.82)` | `.logo-sub` | 82% white — "División Veterinaria" subtitle in hero |
| `rgba(255,255,255,0.94)` | `.pur-card p` | 94% — body text on teal card (micro-hierarchy) |
| `rgba(255,255,255,0.5)` | Products `.sec-divider` | 50% white divider bar on dark `#0A6973` section |
| `opacity: 0.55` | CTA `salu-img.png` | Dimmed white silhouette — decorative, not dominant |
| `rgba(42,172,184,0.35)` | `.cinfo` border-bottom | Teal dashed divider at 35% — present but not heavy |
| `rgba(42,172,184,0.40)` | `.wa-fab` box-shadow | Teal glow at 40% — brand-colored shadow |
| `rgba(42,172,184,0.15)` | SVG icon fills | Very subtle teal inner fill on product icons |
| `rgba(42,172,184,0.2)` | SVG icon fills (stronger) | Pupil/liquid fills in eye/syringe icons |
| `rgba(0,0,0,0.07)` | Testimonial card shadow | Lowest elevation shadow |
| `rgba(0,0,0,0.10)` | Form card shadow | Medium elevation shadow |
| `rgba(0,0,0,0.15)` | Stats bar shadow | Highest elevation shadow |

---

## 10. Common Tailwind CSS Equivalents

### Colors

```
bg-[#2AACB8]                  →  var(--teal) — buttons, icons, stats numbers
hover:bg-[#4DC4CE]             →  var(--teal2) — hover state
bg-[#0A6973]                   →  products section dark bg
bg-[#EBF8F9]                   →  animal section pale aqua bg
text-[#2AACB8]                 →  teal text (stat numbers, location tags)
text-[#222222]                 →  var(--head)
text-[#3D3D3D]                 →  var(--dark)
border-[#2AACB8]               →  teal border (focus, hover, carousel)
border-[rgba(42,172,184,0.35)] →  dashed contact row separator
```

### Typography

```
font-['Poppins']               →  font-family: 'Poppins'
font-bold                      →  font-weight: 700
font-semibold                  →  font-weight: 600
font-medium                    →  font-weight: 500
italic                         →  font-style: italic
tracking-[0.6px]               →  letter-spacing: 0.6px (buttons)
tracking-[0.5px]               →  letter-spacing: 0.5px (tcard-loc)
tracking-[0.4px]               →  letter-spacing: 0.4px (labels)
uppercase                      →  text-transform: uppercase
leading-[1.75]                 →  line-height: 1.75
leading-[1.82]                 →  line-height: 1.82 (testimonial quote)
```

### Layout

```
grid grid-cols-4               →  products, stats (desktop)
grid grid-cols-3               →  purpose cards
grid grid-cols-2               →  contact, animal, stats (≤900px)
grid grid-cols-1               →  collapsed mobile grids
gap-5                          →  gap: 20px (products)
gap-6                          →  gap: 24px (purpose)
gap-16                         →  gap: 64px (contact)
flex items-center justify-center →  icon circles, hero, CTA inner
flex-col                       →  prod-body, hero
flex-1                         →  prod-body stretch (pushes button to bottom)
overflow-hidden                →  carousel outer
```

### Spacing

```
px-[30px]                      →  .wrap horizontal padding
py-[100px]                     →  contact, purpose, testimonials, CTA sections
py-[80px]                      →  products section
pb-[96px]                      →  hero bottom (leaves 16px above stats bar)
max-w-[1290px]                 →  .wrap
max-w-[1100px]                 →  stats bar
max-w-[680px]                  →  testimonial card
mx-auto                        →  all centered containers
-mt-[80px]                     →  stats bar desktop overlap
mt-[16px]                      →  stats bar mobile gap
```

### Sizing

```
min-h-[55vh]                   →  hero min-height
h-[44px]                       →  .btn default height
h-[50px]                       →  .btn-lg height
h-[200px]                      →  product image area
h-[110px]                      →  textarea min-height
w-[50px] h-[50px] rounded-full →  contact icon circle
w-[58px] h-[58px] rounded-full →  WhatsApp FAB
w-[80px] h-[80px] rounded-full →  testimonial avatar
w-[44px] h-[44px] rounded-full →  carousel nav button
w-[48px] h-[4px]               →  section divider bar
rounded-none                   →  cards, buttons, inputs
rounded-full                   →  circles (icons, avatars, dots, FAB)
```

### Shadows

```
shadow-[0_4px_28px_rgba(0,0,0,0.07)]         →  testimonial card
shadow-[0_4px_40px_rgba(0,0,0,0.10)]         →  form card
shadow-[0_8px_48px_rgba(0,0,0,0.15)]         →  stats bar
shadow-[0_4px_20px_rgba(42,172,184,0.40)]    →  WhatsApp FAB glow
```

### Transitions

```
transition-all duration-[120ms] ease-[cubic-bezier(0.455,0.03,0.515,0.955)]
→  var(--ease) — all interactive elements

transition-transform duration-[420ms] ease-[cubic-bezier(0.455,0.03,0.515,0.955)]
→  carousel slide track
```

---

## 11. Page Section Architecture

| # | Section | Background | Layout | Key Pattern |
|---|---|---|---|---|
| 1 | `#hero` | `linear-gradient(155deg, #082E32 → #2AACB8)` | Flex column, centered | Stats bar overlaps with `margin-top: -80px` |
| — | `.stats-bar` | `#fff` elevated | 4-col grid (2×2 ≤900px) | Large `69px` teal numerals on white |
| 2 | `#contact` | `#fff` | 2-col grid (1fr 1fr) | Left: teal icon circles + dashed separators. Right: floating form card |
| 3 | `#products` | `#0A6973` | 4-col card grid | Deep teal bg; white cards; teal border on hover |
| 4 | `#purpose` | `#fff` | 3-col card grid | Solid teal (`#2AACB8`) cards with white text |
| 5 | `#animal` | `#EBF8F9` | 2-col (text + image) | Pale aqua bg; image align-items: flex-end (bleeds to bottom) |
| 6 | `#testimonials` | `#fff` | Carousel (max 680px card) | Overflow hidden + flex translateX; teal avatar ring |
| 7 | `#cta` | `linear-gradient(135deg, #062428 → #0E7A86)` | Flex column, centered | Dark gradient; single teal CTA button |
| — | `.wa-fab` | `#2AACB8` | Fixed, bottom-right | Always visible; teal glow shadow; scale on hover |

**Teal intensity progression through the page:**

```
Hero        →  Teal absent from content (white on dark gradient bg)
Stats bar   →  Teal at 69px numeral scale — FIRST strong brand impression on white
Contact     →  Teal icon circles + 35% dashed borders — structural repetition
Products    →  Teal as full section bg (#0A6973) — most dramatic immersion
Purpose     →  Teal card bg (#2AACB8) — brand color at full card scale
Animal      →  Pale aqua (#EBF8F9) bg — lightest, breathing room
Testimonials→  Teal avatar ring + active dot + location tag — accent only
CTA         →  Teal button on dark — final conversion action peak
```

---

## 12. Responsive Breakpoint System

### ≤1100px — Tablet Landscape

```css
.prod-grid         → 2 columns (was 4)
.contact-grid      → 1 column, gap: 44px (was 2-col, gap: 64px)
.animal-grid       → 1 column (was 2-col)
.animal-img        → max-width: 420px (was 520px)
.animal-left       → padding-bottom: 0 (was 80px)
```

### ≤900px — Tablet Portrait

```css
.hero-h1           → 38px (was 52px)
.stats-bar         → 2×2 grid (was 4×1)
.stat-item         → border-right + border-bottom grid borders
.stat-item:nth-child(even) → border-right: none
.stat-item:nth-last-child(-n+2) → border-bottom: none
.purpose-grid      → 1 column (was 3)
```

### ≤640px — Mobile

```css
/* Hero */
.hero-logo         → flex-direction: column; align-items: center
.logo-wordmark     → text-align: center
.logo-name         → 38px (was 52px)
.hero-h1           → 28px (was 52px → 38px)

/* Stats */
.stats-bar         → width: calc(100% - 30px); margin: 16px auto 0 (no overlap)
.stat-num          → 44px (was 69px)
.stat-lbl          → 14px (was 19px)
.stat-item         → padding: 24px 12px

/* Forms & grids */
.frow              → grid-template-columns: 1fr (was 2-col)
.prod-grid         → 1 column (was 2-col)

/* Carousel */
.car-slide         → padding: 0 8px (was 0 20px)
.car-btn           → 36×36px (was 44×44px)

/* Text */
.cta-inner h2      → 26px (was 40px)
.sec-title         → 28px (was 34px)

/* All sections equalized */
#hero, #contact, #products, #purpose, #testimonials, #cta
                   → padding: 60px 20px

/* Cards */
.contact-form-card → padding: 30px 20px 32px
.tcard             → padding: 30px 20px
```

---

## 13. Example Component Reference Code

### Primary Button

```html
<a href="#contact" class="btn btn-lg">OBTENER COTIZACIÓN</a>

<style>
:root { --teal: #2AACB8; --teal2: #4DC4CE; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--teal);
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  border-radius: 0;
  padding: 0 28px;
  height: 44px;
  border: none;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.12s cubic-bezier(0.455, 0.03, 0.515, 0.955);
}
.btn:hover { background: var(--teal2); }
.btn.btn-lg { height: 50px; padding: 0 36px; }
</style>
```

---

### Section Title + Divider

```html
<!-- On white background -->
<h2 class="sec-title">Nuestro Propósito</h2>
<div class="sec-divider"></div>

<!-- On dark teal background -->
<h2 class="sec-title white">Productos más vendidos</h2>
<div class="sec-divider white"></div>

<style>
.sec-title {
  font-size: 34px;
  font-weight: 700;
  color: #222222;
  line-height: 1.2;
  margin-bottom: 10px;
}
.sec-title.white { color: #fff; }

.sec-divider {
  width: 48px;
  height: 4px;
  background: #2AACB8;
  margin-bottom: 48px;
}
.sec-divider.white { background: #fff; }
</style>
```

---

### Product Card

```html
<article class="prod-card">
  <div class="prod-img-area">
    <!-- SVG icon or product image here -->
  </div>
  <div class="prod-body">
    <div class="prod-name">Antibióticos de Amplio Espectro</div>
    <a href="#contact" class="btn">COTIZACIÓN GRATIS</a>
  </div>
</article>

<style>
.prod-card {
  background: #fff;
  border: 2px solid transparent;
  transition: all 0.12s cubic-bezier(0.455, 0.03, 0.515, 0.955);
  display: flex;
  flex-direction: column;
}
.prod-card:hover { border-color: #2AACB8; }

.prod-img-area {
  height: 200px;
  background: linear-gradient(135deg, #EBF8F9 0%, #C2EDF1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.prod-body {
  padding: 20px 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.prod-name {
  font-size: 15px;
  font-weight: 500;
  color: #222222;
  line-height: 1.4;
}

.prod-body .btn { width: 100%; }
</style>
```

---

### Stats Bar

```html
<div class="stats-bar">
  <div class="stat-item">
    <div class="stat-num">18+</div>
    <div class="stat-lbl">Años de experiencia</div>
  </div>
  <div class="stat-item">
    <div class="stat-num">300+</div>
    <div class="stat-lbl">Productos en catálogo</div>
  </div>
  <div class="stat-item">
    <div class="stat-num">1.5k+</div>
    <div class="stat-lbl">Clínicas atendidas</div>
  </div>
  <div class="stat-item">
    <div class="stat-num">40+</div>
    <div class="stat-lbl">Países alcanzados</div>
  </div>
</div>

<style>
.stats-bar {
  position: relative;
  z-index: 10;
  max-width: 1100px;
  width: calc(100% - 60px);
  margin: -80px auto 0;     /* Hero must have enough bottom padding for gap */
  background: #fff;
  box-shadow: 0 8px 48px rgba(0,0,0,0.15);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.stat-item {
  padding: 36px 20px;
  text-align: center;
  border-right: 1px solid #efefef;
}
.stat-item:last-child { border-right: none; }

.stat-num {
  font-size: 69px;
  font-weight: 700;
  color: #2AACB8;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-lbl {
  font-size: 19px;
  font-weight: 500;
  color: #3D3D3D;
  line-height: 1.3;
}

@media (max-width: 640px) {
  .stats-bar { width: calc(100% - 30px); margin: 16px auto 0; }
  .stat-num { font-size: 44px; }
  .stat-lbl { font-size: 14px; }
  .stat-item { padding: 24px 12px; }
}
</style>
```

---

### Purpose Card (Solid Teal)

```html
<div class="pur-card">
  <div class="pur-icon">
    <!-- White-stroke SVG polygon icon -->
  </div>
  <h3>Garantía de Calidad</h3>
  <p>Abastecemos exclusivamente de fabricantes certificados y distribuidores autorizados...</p>
</div>

<style>
.pur-card {
  background: #2AACB8;
  padding: 46px 32px 42px;
  color: #fff;
}
.pur-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 14px;
  line-height: 1.25;
}
.pur-card p {
  font-size: 14px;
  color: rgba(255,255,255,0.94);
  line-height: 1.75;
}
.pur-icon { margin-bottom: 24px; }
</style>
```

---

### Contact Info Row

```html
<div class="cinfo">
  <div class="cinfo-icon" aria-hidden="true">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         stroke="#fff" stroke-width="2.2" stroke-linecap="round">
      <!-- icon path -->
    </svg>
  </div>
  <div class="cinfo-text">
    <div class="cinfo-label">Teléfono</div>
    <div class="cinfo-value">+54 11 4000-7890</div>
  </div>
</div>

<style>
.cinfo {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 20px 0;
  border-bottom: 1.5px dashed rgba(42,172,184,0.35);
}
.cinfo:first-of-type { padding-top: 0; }

.cinfo-icon {
  width: 50px; height: 50px;
  border-radius: 50%;
  background: #2AACB8;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.cinfo-label {
  font-size: 13px; font-weight: 600;
  color: #222222;
  text-transform: uppercase; letter-spacing: 0.4px;
}

.cinfo-value {
  font-size: 15px; font-weight: 400;
  color: #3D3D3D;
}
</style>
```

---

## 14. Key Design Decisions & Rationale

| Decision | Rationale |
|---|---|
| **`#2AACB8` as primary brand teal** | Sampled directly from the SALU logo's animal silhouette — the color system is non-negotiable and derives from brand identity |
| **`#4DC4CE` for hover (lighter, not darker)** | Lighter teal on hover creates an "illuminated" feel — uplifting, health-positive, trustworthy |
| **`#0A6973` for products section bg** | Deep darkened teal — maintains hue family while creating dramatic contrast for white product cards |
| **`#EBF8F9` for animal section bg** | Near-white pale aqua — lightest possible teal, creates breathing room after the intense products section |
| **Hero + CTA as gradients (not flat)** | Gradients from dark (`#082E32`) to brand teal (`#2AACB8`) create depth and make the white text pop without a photo dependency |
| **Zero border-radius on cards/buttons** | Clinical precision for a medical equipment brand; teal color provides the warmth the shape withholds |
| **Single font (Poppins), hierarchy via weight** | Poppins's geometric rounded character echoes the rounded animal silhouette; weight alone (400/500/600/700) creates all hierarchy |
| **Italic hero H1** | 700-weight italic at 52px creates maximum editorial drama — unusually formal for a product page, reinforces expertise |
| **Teal focus ring on form inputs** | The highest-intent interaction (filling in contact form) is reinforced with the brand color — builds trust at the critical conversion moment |
| **`border: 2px solid transparent` on product cards** | Pre-reserves border space to prevent 2px layout jump; teal border on white is unmistakably clear on hover |
| **`rgba(42,172,184,0.40)` shadow on FAB** | Brand-colored shadow makes the WhatsApp button feel native to the brand, not a third-party widget bolted on |
| **Stats bar negative margin overlap** | Visual bridge between hero and content; creates the "floating card" effect without absolute positioning complexity |
| **Teal dashed borders on contact rows** | Dashed + 35% opacity = present but not heavy; rhythmically repeats brand color through info section |
| **`opacity: 0.94` on purpose card body text** | Micro-hierarchy within solid teal backgrounds; avoids introducing any new color |
| **`filter: brightness(0) invert(1)` on logo PNG** | Turns white-bg PNG into clean white silhouette on dark gradient sections — no background removal required |
| **`all` in transition at `0.12s`** | At this speed, `all` is safe — too fast to cause jank, ensures no property is accidentally left unanimated |
| **`will-change: transform` on carousel track** | Promotes carousel to its own GPU compositor layer — prevents paint flickering during slide transitions |
