/**
 * Generate the copy-and-paste sheet used to load the catalog into WhatsApp
 * Business by hand.
 *
 * WhatsApp Business (the phone app, not the Platform API) has no import: every
 * product is typed in on a phone, one field at a time. So this renders the live
 * dataset as a single page of copy buttons, sized for a thumb, with a tick box
 * per product so a half-finished session can be resumed.
 *
 * It writes into `public/`, which means the sheet ships with the site and opens
 * from a plain URL on any phone. That is deliberate: an HTML file sent through
 * WhatsApp is downloaded and opened by a local viewer that blocks remote images,
 * so the packshots come out blank. Served over HTTP they load normally.
 *
 * The page is derived state and is regenerated, never hand-edited. Re-run it
 * after any content change or the sheet quietly drifts from the site:
 *
 *   node scripts/build-whatsapp-sheet.mjs
 *
 * Flags:
 *   --out <path>      default: public/catalogo-whatsapp.html
 *   --dataset <name>  default: production
 */
import { writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const argv = process.argv.slice(2)
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback
}

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = opt('out', join(REPO_ROOT, 'public/catalogo-whatsapp.html'))
const DATASET = opt('dataset', process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production')
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '90vh2vk9'
const SITE = 'https://saludivisionveterinaria.com'

/**
 * Copy a product still lacking a `description` in the Studio. Rendered with a
 * "texto sugerido" marker so nobody mistakes it for approved wording, and
 * dropped automatically the moment the real field is filled.
 */
const SUGGESTED = {
  'mascarilla-quirurgica-desechable':
    'Mascarilla quirúrgica desechable de tres capas, no estéril, con elásticos para las orejas y clip nasal ajustable. De un solo uso, para manejo clínico y de granja.',
  'promotor-continental':
    'Mezcla de aminoácidos y vitaminas en solución oral, de alta solubilidad en el agua de bebida y apta para cualquier especie. Indicada en el tratamiento y la prevención de la desnutrición, para mejorar la fertilidad y la postura en aves, y como coadyuvante en estrés, convalecencia, gestación y lactancia.',
}

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Every size the product is sold in, deduped. The document-level `presentation`
 * describes the product as a whole; the image labels describe the specific
 * package each photo shows. Both are real answers to "what sizes?", so the sheet
 * offers the union rather than picking one.
 */
const sizesOf = (p) => [...new Set([p.presentation, p.imgLabel, ...(p.gal ?? [])].filter(Boolean))]

const query = `*[_type == "product"]{ "slug": slug.current, name, description, presentation, "imgLabel": image.label, "gal": gallery[].label, "img": image.asset->url }`
const res = await fetch(
  `https://${PROJECT_ID}.apicdn.sanity.io/v2025-01-01/data/query/${DATASET}?query=${encodeURIComponent(query)}`
)
if (!res.ok) throw new Error(`query failed: ${res.status} ${await res.text()}`)

const products = (await res.json()).result
  .sort((a, b) => a.name.localeCompare(b.name, 'es'))
  .map((p) => {
    const sizes = sizesOf(p)
    const body = p.description || SUGGESTED[p.slug] || ''
    return {
      slug: p.slug,
      name: p.name,
      needsText: !p.description,
      thumb: p.img ? `${p.img}?w=320&h=320&fit=fill&bg=ffffff&fm=jpg&q=75` : null,
      link: `${SITE}/productos/${p.slug}`,
      description: sizes.length ? `${body}\n\nPresentaciones: ${sizes.join(', ')}` : body,
    }
  })

const pending = products.filter((p) => p.needsText)

const card = (p, i) => `
<article class="p">
  <div class="ph">
    <label class="tick"><input type="checkbox" class="done" aria-label="Marcar ${esc(p.name)} como listo"><span></span></label>
    ${p.thumb ? `<img src="${esc(p.thumb)}" alt="" width="56" height="56" loading="lazy">` : '<div class="noimg" aria-hidden="true"></div>'}
    <div class="pt"><b>${esc(p.name)}</b><small>${i + 1} de ${products.length}${p.needsText ? ' · texto sugerido' : ''}</small></div>
  </div>
  <div class="f"><div class="fl">Nombre</div><div class="fv">${esc(p.name)}</div><button type="button" class="c" data-copy="${esc(p.name)}">Copiar</button></div>
  <div class="f"><div class="fl">Descripción</div><div class="fv d">${esc(p.description)}</div><button type="button" class="c" data-copy="${esc(p.description)}">Copiar</button></div>
  <div class="f"><div class="fl">Enlace del sitio</div><div class="fv m">${esc(p.link)}</div><button type="button" class="c" data-copy="${esc(p.link)}">Copiar</button></div>
  <div class="f"><div class="fl">Código (SKU)</div><div class="fv m">${esc(p.slug)}</div><button type="button" class="c" data-copy="${esc(p.slug)}">Copiar</button></div>
</article>`

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Catálogo SALU para WhatsApp Business</title>
<style>
  :root {
    --bg:#fff; --fg:#101413; --dim:#5d6b68; --line:#e2e7e6;
    --accent:#0b7d78; --warn:#8a5a00; --warnbg:#fff8e6; --chip:#f1f5f4;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg:#000; --fg:#fff; --dim:#9aa8a5; --line:#202624;
      --accent:#3fd0c6; --warn:#e0b45c; --warnbg:#1a1509; --chip:#121716;
    }
  }
  * { box-sizing:border-box; }
  body {
    margin:0; background:var(--bg); color:var(--fg);
    font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    -webkit-text-size-adjust:100%;
  }
  .w { max-width:720px; margin:0 auto; padding:20px 16px 64px; }
  h1 { font-size:21px; line-height:1.25; margin:0 0 4px; letter-spacing:-.01em; }
  h2 { font-size:14px; text-transform:uppercase; letter-spacing:.07em; color:var(--dim); margin:32px 0 10px; font-weight:600; }
  p { margin:0 0 12px; }
  .lede { color:var(--dim); margin-bottom:20px; }
  ol.steps { margin:0 0 4px; padding-left:20px; }
  ol.steps li { margin-bottom:8px; }
  .note { background:var(--warnbg); border-left:3px solid var(--warn); padding:12px 14px; margin:0 0 16px; }
  .note b { color:var(--warn); }
  .bar { position:sticky; top:0; z-index:2; background:var(--bg); border-bottom:1px solid var(--line);
         padding:10px 0; margin-bottom:4px; font-size:14px; color:var(--dim); display:flex; gap:10px; align-items:center; }
  .bar b { color:var(--fg); font-variant-numeric:tabular-nums; }
  .track { flex:1; height:4px; background:var(--chip); border-radius:2px; overflow:hidden; }
  .track i { display:block; height:100%; width:0; background:var(--accent); transition:width .18s ease; }
  .p { border-top:1px solid var(--line); padding:16px 0 6px; }
  .p.ok { opacity:.42; }
  .ph { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
  .ph img, .noimg { width:56px; height:56px; border-radius:6px; object-fit:cover; background:var(--chip); flex:none; }
  .pt { min-width:0; }
  .pt b { display:block; font-size:17px; line-height:1.25; }
  .pt small { color:var(--dim); font-size:12.5px; }
  .tick { flex:none; display:inline-flex; align-items:center; justify-content:center;
          width:34px; height:34px; margin:-6px 0 -6px -6px; cursor:pointer; position:relative; }
  .tick input { position:absolute; opacity:0; width:34px; height:34px; margin:0; cursor:pointer; }
  .tick span { width:21px; height:21px; border:2px solid var(--line); border-radius:5px; display:block; }
  .tick input:checked + span { background:var(--accent); border-color:var(--accent);
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='white' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 8.5l3.2 3.2L13 5'/%3E%3C/svg%3E"); }
  .tick input:focus-visible + span { outline:2px solid var(--accent); outline-offset:2px; }
  .f { display:grid; grid-template-columns:1fr auto; gap:6px 12px; align-items:start; padding:8px 0; }
  .fl { grid-column:1/-1; font-size:11.5px; text-transform:uppercase; letter-spacing:.06em; color:var(--dim); }
  .fv { font-size:15px; white-space:pre-wrap; word-break:break-word; }
  .fv.d { font-size:14.5px; }
  .fv.m { font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:13px; color:var(--dim); }
  .c { font:inherit; font-size:13px; font-weight:600; color:var(--accent); background:none;
       border:1px solid var(--line); border-radius:7px; padding:8px 12px; cursor:pointer;
       min-height:38px; white-space:nowrap; align-self:start; }
  .c:active { background:var(--chip); }
  .c.ok { color:#fff; background:var(--accent); border-color:var(--accent); }
  footer { border-top:1px solid var(--line); margin-top:36px; padding-top:14px; color:var(--dim); font-size:13.5px; }
  @media (max-width:420px) { .fv.d { font-size:14px; } .c { padding:8px 10px; } }
</style>
</head>
<body>
<div class="w">

<h1>Catálogo SALU para WhatsApp Business</h1>
<p class="lede">${products.length} productos, tal como están hoy en el sitio. Cada uno trae el nombre, la descripción y el enlace listos para copiar y pegar.</p>

<h2>Cómo usarlo</h2>
<ol class="steps">
  <li>Abre <b>WhatsApp Business</b>, entra a Herramientas para la empresa y luego a Catálogo.</li>
  <li>Toca <b>Agregar artículo</b>, sube la foto y pega cada campo con el botón <b>Copiar</b>.</li>
  <li>Marca la casilla de la izquierda al terminar cada producto para no perder el hilo.</li>
</ol>
<p class="lede">El precio es el único campo que no está aquí. Para las fotos, abre el enlace del producto y guarda la imagen desde el sitio.</p>
${
  pending.length
    ? `<div class="note"><b>Nota</b><p style="margin:8px 0 0">${pending
        .map((p) => esc(p.name))
        .join(' y ')} todavía no ${pending.length > 1 ? 'tienen' : 'tiene'} descripción propia en el sistema. Abajo va un texto sugerido, marcado como tal, para que puedas avanzar igual.</p></div>`
    : ''
}
<div class="bar"><b><span id="n">0</span>/${products.length}</b><span class="track"><i id="pg"></i></span><span id="lbl">listos</span></div>

${products.map(card).join('\n')}

<footer>
  Página generada desde el contenido real del sitio. Si el catálogo cambia, pide una versión nueva antes de una actualización grande.
</footer>

</div>
<script>
(function () {
  var flash = function (btn) {
    var old = btn.textContent;
    btn.textContent = 'Copiado';
    btn.classList.add('ok');
    setTimeout(function () { btn.textContent = old; btn.classList.remove('ok'); }, 1300);
  };
  var fallback = function (text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    try { document.execCommand('copy'); flash(btn); } catch (e) { /* leave the button alone */ }
    document.body.removeChild(ta);
  };
  var copy = function (text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { flash(btn); }, function () { fallback(text, btn); });
    } else {
      fallback(text, btn);
    }
  };

  var buttons = document.querySelectorAll('button.c');
  for (var i = 0; i < buttons.length; i++) {
    (function (btn) {
      btn.addEventListener('click', function () { copy(btn.getAttribute('data-copy'), btn); });
    })(buttons[i]);
  }

  var ticks = document.querySelectorAll('input.done');
  var n = document.getElementById('n');
  var pg = document.getElementById('pg');
  var lbl = document.getElementById('lbl');
  var total = ticks.length;
  var STORE = 'salu-wa-done';

  var save = function () {
    var out = [];
    for (var j = 0; j < ticks.length; j++) if (ticks[j].checked) out.push(j);
    try { localStorage.setItem(STORE, out.join(',')); } catch (e) { /* private mode, session only */ }
  };
  var restore = function () {
    try {
      var raw = localStorage.getItem(STORE);
      if (!raw) return;
      var on = raw.split(',');
      for (var j = 0; j < on.length; j++) if (ticks[on[j]]) ticks[on[j]].checked = true;
    } catch (e) { /* private mode, session only */ }
  };
  var tally = function () {
    var c = 0;
    for (var j = 0; j < ticks.length; j++) {
      if (ticks[j].checked) c++;
      ticks[j].closest('.p').classList.toggle('ok', ticks[j].checked);
    }
    n.textContent = c;
    pg.style.width = (total ? (c / total) * 100 : 0) + '%';
    lbl.textContent = c === total ? 'todo listo' : 'listos';
  };

  for (var k = 0; k < ticks.length; k++) {
    ticks[k].addEventListener('change', function () { save(); tally(); });
  }
  restore();
  tally();
})();
</script>
</body>
</html>`

await writeFile(OUT, html)
console.log(`${products.length} products${pending.length ? `, ${pending.length} on suggested text` : ''}`)
console.log(`${Math.round(Buffer.byteLength(html) / 1024)} KB -> ${OUT}`)
