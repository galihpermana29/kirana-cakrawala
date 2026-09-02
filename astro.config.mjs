// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';
import sanity from '@sanity/astro';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const projectId = env.PUBLIC_SANITY_PROJECT_ID;
const dataset = env.PUBLIC_SANITY_DATASET || 'production';

// The site is built from the Sanity dataset and has no fallback content, so a
// missing project id is a broken build, not a degraded one.
if (!projectId) {
  throw new Error(
    'PUBLIC_SANITY_PROJECT_ID is not set. Copy .env.example to .env for local ' +
      "work, and set it in the hosting provider's build environment.",
  );
}

export default defineConfig({
  integrations: [
    sanity({
      projectId,
      dataset,
      useCdn: false,
      apiVersion: '2025-06-01',
      studioBasePath: '/admin',
    }),
    react(),
  ],
});
