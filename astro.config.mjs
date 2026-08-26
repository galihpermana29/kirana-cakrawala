// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';
import sanity from '@sanity/astro';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const projectId = env.PUBLIC_SANITY_PROJECT_ID;
const dataset = env.PUBLIC_SANITY_DATASET || 'production';

// Until PUBLIC_SANITY_PROJECT_ID is set in .env the site builds from
// placeholder content and the /admin studio route is not mounted.
export default defineConfig({
  integrations: projectId
    ? [
        sanity({
          projectId,
          dataset,
          useCdn: false,
          apiVersion: '2025-06-01',
          studioBasePath: '/admin',
        }),
        react(),
      ]
    : [],
});
