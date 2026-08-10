/**
 * Icon audit for the SALU icon language.
 *
 * Run after touching any icon:  node scripts/icon-audit.mjs
 *
 * DESIGN.md 8 has asked for one icon language since the shadcn migration, and
 * until this script existed nothing enforced it: `ICON_WEIGHT` was wired up at
 * 2 of 33 call sites and the other 31 relied on Phosphor's implicit default
 * happening to agree. A single `weight="fill"` would have passed review unseen.
 * This is the icon half of what `contrast-audit.mjs` does for color.
 *
 * Three rules:
 *   1. One stroke. Only `regular`, and only `app/lib/icons.tsx` may say
 *      otherwise, because that is where the WhatsApp brand-mark exemption lives.
 *   2. A control owns its icon size. `button.tsx` carries
 *      `[&_svg:not([class*='size-'])]:size-4`, so a `size` prop inside a
 *      Button/ButtonLink/Alert/Badge is overridden by CSS and does nothing.
 *      Dead props are worse than no props: they read as intent.
 *   3. A standalone icon takes a size off the ladder, never an ad hoc number.
 *
 * Parsed with the TypeScript compiler rather than matched with a regex: JSX
 * attributes in this codebase contain `=>` and `>` inside strings, which any
 * naive tag pattern splits in the wrong place.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import ts from 'typescript'

const ROOT = process.cwd()
const DIRS = ['app', 'components']

/** Sizes a standalone icon may use. See DESIGN.md 8. */
const LADDER = [16, 20, 24, 28, 40, 64, 96]

/** Components whose CVA already sizes any svg inside them. */
const CONTROLS = new Set(['Button', 'ButtonLink', 'Alert', 'Badge'])

/** The one file allowed to name a weight other than `regular`. */
const WEIGHT_EXEMPT = 'app/lib/icons.tsx'

/** Non-Phosphor icon components, plus the alias `Purpose` renders through. */
const EXTRA_ICONS = new Set(['CategoryIcon', 'WhatsAppIcon', 'Icon'])

const files = []
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name.endsWith('.tsx')) files.push(p)
  }
}
for (const d of DIRS) walk(join(ROOT, d))
files.sort()

let fails = 0
const fail = (where, msg) => {
  fails++
  console.log(`FAIL  ${where}\n      ${msg}`)
}

/** Icon component names this file imports, so `<X>` in one file is an icon and in another is not. */
function iconNamesIn(source) {
  const names = new Set(EXTRA_ICONS)
  source.forEachChild((node) => {
    if (!ts.isImportDeclaration(node)) return
    const spec = node.moduleSpecifier.text
    const fromPhosphor = spec.startsWith('@phosphor-icons/react')
    const fromLocalIcons = spec.endsWith('lib/icons')
    if (!fromPhosphor && !fromLocalIcons) return
    if (node.importClause?.isTypeOnly) return
    const bindings = node.importClause?.namedBindings
    if (bindings && ts.isNamedImports(bindings)) {
      for (const el of bindings.elements) names.add(el.name.text)
    }
  })
  return names
}

const tagName = (el) => {
  const n = (ts.isJsxSelfClosingElement(el) ? el : el.openingElement).tagName
  return ts.isIdentifier(n) ? n.text : null
}

const attr = (el, name) => {
  const opening = ts.isJsxSelfClosingElement(el) ? el : el.openingElement
  return opening.attributes.properties.find(
    (p) => ts.isJsxAttribute(p) && p.name.getText() === name,
  )
}

for (const abs of files) {
  const rel = relative(ROOT, abs)
  const src = ts.createSourceFile(
    rel,
    readFileSync(abs, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const icons = iconNamesIn(src)

  /** @param {ts.Node} node @param {boolean} inControl */
  const visit = (node, inControl) => {
    let nowInControl = inControl
    const isJsx = ts.isJsxSelfClosingElement(node) || ts.isJsxElement(node)

    if (isJsx) {
      const el = ts.isJsxElement(node) ? node.openingElement : node
      const name = tagName(node)
      if (name && CONTROLS.has(name)) nowInControl = true

      if (name && icons.has(name)) {
        const where = `${rel}:${src.getLineAndCharacterOfPosition(el.getStart(src)).line + 1}  <${name}>`

        const w = attr(el, 'weight')
        if (w && rel !== WEIGHT_EXEMPT) {
          const init = w.initializer
          const value = init && ts.isStringLiteral(init) ? init.text : init?.getText(src)
          if (value !== 'regular' && value !== 'ICON_WEIGHT' && value !== '{ICON_WEIGHT}') {
            fail(where, `weight ${value} - one stroke only. The brand-mark exemption lives in ${WEIGHT_EXEMPT}.`)
          }
        }

        const s = attr(el, 'size')
        if (s) {
          const init = s.initializer
          const num =
            init && ts.isJsxExpression(init) && init.expression && ts.isNumericLiteral(init.expression)
              ? Number(init.expression.text)
              : null
          if (inControl) {
            fail(where, `size prop inside a control. The CVA sizes it to 16px; this prop is dead. Remove it.`)
          } else if (num !== null && !LADDER.includes(num)) {
            fail(where, `size ${num} is off the ladder [${LADDER.join(', ')}].`)
          }
        }
      }
    }

    node.forEachChild((child) => visit(child, nowInControl))
  }

  visit(src, false)
}

console.log(
  `\n${fails === 0 ? `ALL PASS - ${files.length} files, one icon language` : `${fails} FAILURES`}`,
)
process.exit(fails === 0 ? 0 : 1)
