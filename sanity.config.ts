import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'SALU División Veterinaria',
  basePath: '/studio',

  projectId: '90vh2vk9',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
