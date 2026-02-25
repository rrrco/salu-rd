import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
    }),
    defineField({
      name: 'iconKey',
      title: 'Ícono',
      type: 'string',
      options: {
        list: [
          'antibiotics',
          'antiparasitic',
          'vaccines',
          'supplements',
          'wounds',
          'sedatives',
          'antiinflammatory',
          'ophthalmic',
        ],
      },
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'featured',
      title: 'Mostrar en inicio',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Orden',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Orden',
      name: 'order',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
