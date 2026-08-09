import { createClient } from '@sanity/client'

/**
 * `sanity.config.ts` hardcodes these while this client read them only from env,
 * so a missing `.env.local` made `createClient` throw at module scope and took
 * the whole build down. Defaults keep the two in sync and let the project build
 * from a fresh clone. Both values are public by design.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '90vh2vk9'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2025-01-01',
})
