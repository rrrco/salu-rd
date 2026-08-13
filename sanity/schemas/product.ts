import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * The only document type in the project.
 *
 * Three groups rather than one long scroll: what the buyer reads, the technical
 * sheet they check before quoting, and the switches that place the product on
 * the site. An editor adding a product fills the first tab and is done; the rest
 * is optional and the site degrades cleanly without it.
 *
 * `iconKey` and `species` option values are mirrored in `app/lib/types.ts`
 * (`CATEGORIES`, `SPECIES`). Adding one here requires adding it there.
 */

const SPECIES_OPTIONS = [
  { title: 'Bovino', value: 'bovino' },
  { title: 'Porcino', value: 'porcino' },
  { title: 'Equino', value: 'equino' },
  { title: 'Canino', value: 'canino' },
  { title: 'Felino', value: 'felino' },
  { title: 'Aves', value: 'aves' },
  { title: 'Ovino y caprino', value: 'ovino-caprino' },
]

const ADMINISTRATION_OPTIONS = [
  { title: 'Oral', value: 'oral' },
  { title: 'Inyectable', value: 'inyectable' },
  { title: 'Tópica', value: 'topica' },
  { title: 'Intramamaria', value: 'intramamaria' },
  { title: 'Oftálmica', value: 'oftalmica' },
]

const CATEGORY_TITLES: Record<string, string> = {
  antibiotics: 'Antibióticos',
  antiparasitic: 'Antiparasitarios',
  vaccines: 'Vacunas',
  supplements: 'Suplementos',
  wounds: 'Heridas',
  sedatives: 'Sedantes',
  antiinflammatory: 'Antiinflamatorios',
  ophthalmic: 'Oftálmicos',
}

/**
 * The same product is photographed once per package size, and each photo carries
 * the size it shows. That is a caption on the image, not a variant: the site has
 * no cart, price or stock, so a presentation is a photo with a name. Sanity image
 * fields take custom `fields`, so this needs no new document type and no
 * migration — an image saved without a label behaves exactly as before.
 *
 * Distinct from the document-level `presentation` string, which describes the
 * product as a whole on the technical sheet.
 */
const imageLabelField = defineField({
  name: 'label',
  title: 'Presentación',
  type: 'string',
  description: 'El tamaño que muestra esta foto. Por ejemplo: 30 ml, 1 L, 1 galón.',
})

export default defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenido', default: true },
    { name: 'spec', title: 'Ficha técnica' },
    { name: 'site', title: 'Sitio' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      group: 'content',
      validation: (r) => r.required(),
    }),
    /* Required and unique because it is now a route key: the product page lives
       at /productos/[slug]. A product saved without one would be unreachable. */
    defineField({
      name: 'slug',
      title: 'Enlace',
      type: 'slug',
      group: 'content',
      description: 'Se genera del nombre. Es la dirección del producto en el sitio, así que cambiarla rompe los enlaces ya compartidos.',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 4,
      group: 'content',
      description: 'Dos o tres frases. Se muestra completa en la página del producto y recortada a tres líneas en el catálogo.',
    }),
    defineField({
      name: 'image',
      title: 'Imagen principal',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      description: 'Empaque sobre fondo blanco. Sin imagen se muestra el ícono de la categoría.',
      fields: [imageLabelField],
    }),
    defineField({
      name: 'gallery',
      title: 'Galería',
      type: 'array',
      group: 'content',
      description: 'Imágenes adicionales: otros ángulos, la etiqueta, la presentación. Opcional.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [imageLabelField],
        }),
      ],
      options: { layout: 'grid' },
    }),

    defineField({
      name: 'presentation',
      title: 'Presentación',
      type: 'string',
      group: 'spec',
      description: 'Por ejemplo: Frasco 100 ml, Caja x 10 viales, Sobre 50 g.',
    }),
    defineField({
      name: 'activeIngredient',
      title: 'Principio activo',
      type: 'string',
      group: 'spec',
      description: 'Por ejemplo: Amoxicilina trihidratada 15%.',
    }),
    defineField({
      name: 'species',
      title: 'Especies',
      type: 'array',
      group: 'spec',
      of: [defineArrayMember({ type: 'string' })],
      options: { list: SPECIES_OPTIONS, layout: 'grid' },
    }),
    defineField({
      name: 'administration',
      title: 'Vía de administración',
      type: 'string',
      group: 'spec',
      options: { list: ADMINISTRATION_OPTIONS },
    }),

    defineField({
      name: 'iconKey',
      title: 'Categoría',
      type: 'string',
      group: 'site',
      description: 'Define el ícono de respaldo y el filtro del catálogo.',
      options: {
        list: Object.entries(CATEGORY_TITLES).map(([value, title]) => ({ title, value })),
      },
    }),
    defineField({
      name: 'featured',
      title: 'Mostrar en inicio',
      type: 'boolean',
      group: 'site',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Orden',
      type: 'number',
      group: 'site',
      description: 'Menor primero. Los productos sin orden quedan al final, alfabéticamente.',
    }),
  ],
  orderings: [
    {
      title: 'Orden',
      name: 'order',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Nombre',
      name: 'name',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  /* The document list reads as a catalog rather than a column of names: the
     packshot, the product, and the line an editor most often needs to check. */
  preview: {
    select: { title: 'name', media: 'image', iconKey: 'iconKey', presentation: 'presentation' },
    prepare({ title, media, iconKey, presentation }) {
      const parts = [CATEGORY_TITLES[iconKey as string], presentation].filter(Boolean)
      return { title, media, subtitle: parts.join(' · ') || undefined }
    },
  },
})
