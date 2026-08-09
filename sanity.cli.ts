import { defineCliConfig } from 'sanity/cli'

/**
 * Lets `npx sanity <command>` target the project without repeating
 * `--project`/`--dataset` on every call. Mirrors sanity.config.ts.
 */
export default defineCliConfig({
  api: {
    projectId: '90vh2vk9',
    dataset: 'production',
  },
})
