# SALU División Veterinaria

Marketing site for SALU División Veterinaria, a B2B veterinary pharmaceutical
distributor in the Dominican Republic. Next.js App Router, Tailwind v4, Sanity CMS.

## Design

**[`DESIGN.md`](./DESIGN.md) is the spec.** Read it before changing anything
visual. Colors, type, spacing, radius, shadow and motion are all tokens defined
in `app/globals.css`; components consume the semantic names, never raw values.

`_design/` holds the original single-file prototype and a style guide for the
system this replaced. Historical reference only.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Environment

Copy `.env.example` to `.env.local`.

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Optional | Defaults to the project ID in `sanity.config.ts`. |
| `NEXT_PUBLIC_SANITY_DATASET` | Optional | Defaults to `production`. |

## Content

Sanity Studio is embedded at `/studio`. The only document type is `product`
(`sanity/schemas/product.ts`).

`iconKey` values must stay in sync across three files: the schema's option list,
`CATEGORIES` in `app/lib/types.ts`, and `CATEGORY_ICONS` in `app/lib/icons.tsx`.
The same contract applies to `species` and `administration`, which are mirrored
by `SPECIES` and `ADMINISTRATION` in `app/lib/types.ts`. A product with no image
falls back to its category icon, so the grid renders whatever the CMS contains.

`slug` is required and is the product's URL. Renaming one breaks any link
already shared with a customer. Every other field added since the first build
(`presentation`, `activeIngredient`, `species`, `administration`, `gallery`) is
optional, and the product view drops the rows it has no data for rather than
rendering an empty table.

Stats, purpose pillars, testimonials and contact details are not in the CMS.
They live in `app/lib/site.ts` and the section components.

After a deploy that adds, renames or removes products, run
`node scripts/indexnow.mjs`. It sends every URL in the live sitemap to Bing
through IndexNow, and ChatGPT search and Copilot answer from Bing's index.
Google ignores IndexNow and reads the sitemap on its own schedule.

## Photography

Three editorial photos go in `public/photos/`. See the README there for the shot
list and ratios. The site reserves each slot and shows a labelled placeholder
until the file exists, so adding a photo requires no code change and causes no
layout shift.

## Structure

```
app/
  productos/
    page.tsx                catalog grid
    [slug]/                 standalone product page
    @modal/(.)[slug]/       the same product, intercepted as a dialog
  components/
    product/                ProductDetail, ProductSpecs, ProductMedia, gallery, modal
    sections/               one file per landing page section
    site/                   Nav, Footer, WhatsAppFab, Logo
    ui/                     Button, Section, ProductTile, PhotoSlot, Reveal, CountUp
  lib/
    site.ts                 production URL, contact details, nav links, stats
    seo.ts                  shared share-preview fields, home structured data
    types.ts                Sanity types and the category list
    image.ts                urlFor() wrapper, honours hotspot
    icons.tsx               iconKey to Phosphor icon map
    queries.ts              GROQ
    sanity.ts               client
  globals.css               all design tokens
  sitemap.ts                /sitemap.xml, one entry per product
  robots.ts                 /robots.txt
```
