// Config for the `sanity` CLI - it reads this rather than sanity.config.ts for
// the project it should talk to. It is what makes these work from the repo:
//
//   npx sanity schema validate                 the Studio schema itself
//   npx sanity documents validate --yes        every document in the dataset
//
// The Studio itself is embedded in the Astro site at /admin (astro.config.mjs);
// this file does not build or deploy it.

import { loadEnv } from 'vite';
import { defineCliConfig } from 'sanity/cli';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

export default defineCliConfig({
  api: {
    projectId: env.PUBLIC_SANITY_PROJECT_ID,
    dataset: env.PUBLIC_SANITY_DATASET || 'production',
  },
});
