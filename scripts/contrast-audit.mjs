/**
 * Contrast audit for the SALU palette.
 *
 * Run after touching any color token:  node scripts/contrast-audit.mjs
 *
 * Every pairing the site actually uses is listed here with the ratio it needs.
 * There are no exemptions: moving the brand from #2AACB8 to #00818F cleared the
 * last one. If this prints anything other than ALL PASS, a token regressed.
 */
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
const L = (h) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) }
const cr = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
const mix = (fg, bg, a) => {
  const px = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const [f, b] = [px(fg), px(bg)]
  return '#' + f.map((v, i) => Math.round(v * a + b[i] * (1 - a)).toString(16).padStart(2, '0')).join('')
}

let fails = 0
const P = (label, a, b, need) => {
  const v = cr(a, b); const ok = v >= need; if (!ok) fails++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${v.toFixed(2)}:1 (need ${need})  ${label}`)
}

// --- tokens ---------------------------------------------------------------
const paper = '#FBFCFC', white = '#ffffff', card = '#ffffff'
const band = '#0A6973', footer = '#E6F4F6', teal50 = '#E6F4F6', teal100 = '#EBF8F9'
const brand = '#00818F', brandHover = '#0A6973', onBrand = '#ffffff'
const teal400 = '#2AACB8'
const accent = '#00818F', accentDark = '#0A6973', focus = '#0E7A86'
const fg = '#16201F', fgMuted = '#47585A', fgSubtle = '#5E7072', borderStrong = '#7A8C8E'
const onDarkAccent = '#4DC4CE', onDarkMuted = '#C2EDF1'

console.log('== BRAND ==')
P('white label on brand button', onBrand, brand, 4.5)
P('white label on brand hover', onBrand, brandHover, 4.5)
P('brand accent text on paper', accent, paper, 4.5)
P('WhatsApp panel copy, white on brand', white, brand, 4.5)
P('tinted button label on teal-100', accentDark, teal100, 4.5)
P('inverse button label ink-900 on white', fg, white, 4.5)
P('inverse button hover label on teal-50', fg, teal50, 4.5)
P('brand fill boundary vs teal-50 section', brand, teal50, 3)

console.log('\n== EVERYTHING ELSE ==')
console.log('-- light surfaces --')
P('body ink-900 on paper', fg, paper, 4.5)
P('muted ink-600 on paper', fgMuted, paper, 4.5)
P('subtle/placeholder ink-500 on paper', fgSubtle, paper, 4.5)
P('subtle ink-500 on white card', fgSubtle, card, 4.5)
P('body ink-600 on teal-50 section', fgMuted, teal50, 4.5)
P('heading ink-900 on teal-50', fg, teal50, 4.5)
P('icon accent-deep on teal-100 tile', accentDark, teal100, 4.5)

console.log('-- control boundaries (WCAG 1.4.11) --')
P('input border on white card', borderStrong, card, 3)
P('secondary button border on paper', borderStrong, paper, 3)
P('focus ring on paper', focus, paper, 3)
P('focus ring on white card', focus, card, 3)
P('inactive carousel dot on teal-50', borderStrong, teal50, 3)


console.log('-- hero gradient (measured at the bloom peak, its brightest point) --')
const heroBloom = mix(teal400, band, 0.25)
const heroPanel = white // solid white card since the stats redesign
P('h1 white on bloom', white, heroBloom, 4.5)
P('subtext teal-100 on bloom', '#EBF8F9', heroBloom, 4.5)
P('eyebrow teal-100 on bloom (12px)', '#EBF8F9', heroBloom, 4.5)
P('stat numerals teal-700 on white panel', accentDark, heroPanel, 4.5)
P('stat labels teal-700 on white panel', accentDark, heroPanel, 4.5)
P('secondary button border on bloom', mix(white, heroBloom, 0.68), heroBloom, 3)
P('secondary button label on bloom', white, heroBloom, 4.5)
P('focus ring teal-200 on bloom', '#C2EDF1', heroBloom, 3)
P('inverse button fill boundary vs bloom', white, heroBloom, 3)

console.log('-- dark band (teal-700) --')
P('heading white on band', white, band, 4.5)
P('body teal-200 on band', onDarkMuted, band, 4.5)
P('accent eyebrow teal-300 on band', onDarkAccent, band, 3)
P('section eyebrow accent-deep on teal-50', accentDark, teal50, 4.5)
P('secondary btn border on band', mix(white, band, 0.6), band, 3)
P('focus ring teal-200 on band', onDarkMuted, band, 3)
/* The quote count in the nav. Same pair as the `inverse` button, listed again
   under its own name so changing ink-900 shows what else it takes with it. */
P('quote count ink-900 on white badge', fg, white, 4.5)
P('quote badge fill boundary vs band', white, band, 3)

console.log('-- footer (ink-950) --')
P('footer body ink-600 on teal-50', fgMuted, footer, 4.5)
P('footer icons accent-deep on teal-50', accentDark, footer, 4.5)
P('footer heading ink-500 on teal-50', fgSubtle, footer, 4.5)

console.log('-- product tile (on-light inside dark band) --')
P('tile heading ink-900 on white', fg, card, 4.5)
P('tile body ink-600 on white', fgMuted, card, 4.5)
P('tile border on white', borderStrong, card, 3)

console.log('-- product dialog (panel over the scrim) --')
/* The scrim is teal-950 over the catalog, which is paper behind white tiles.
   Paper is the lighter of the two, so it is the harder boundary: if the panel
   separates from that, it separates from everything.

   45% was the first choice and measured 2.87:1, under the 3:1 WCAG 1.4.11 asks
   for a control boundary. 50% is the floor that clears it, measured without the
   backdrop blur so the ratio holds where the filter is unsupported. */
const scrim = mix('#062428', paper, 0.5)
P('dialog panel boundary vs scrim', card, scrim, 3)
P('category badge accent-deep on teal-100', accentDark, teal100, 4.5)
P('spec label ink-500 on white panel', fgSubtle, card, 4.5)
P('spec divider on white panel', borderStrong, card, 3)
P('active thumbnail border accent on white', accent, card, 3)

console.log('-- form --')
P('error text on white card', '#b42318', card, 4.5)
P('error border on white card', '#b42318', card, 3)
P('label ink-900 on white card', fg, card, 4.5)

console.log(`\n${fails === 0 ? 'ALL PASS - no exceptions remain' : fails + ' FAILURES'}`)
process.exit(fails === 0 ? 0 : 1)
