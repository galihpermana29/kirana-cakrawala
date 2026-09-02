import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemaTypes';
import { singletonTypes, structure } from './src/sanity/structure';

/* The Studio is bundled by Vite, where the environment arrives on
   import.meta.env; the `sanity` CLI loads this same file in plain Node, where
   it arrives on process.env. Read whichever is there. */
function env(name: string): string | undefined {
  const fromVite = import.meta.env?.[name];
  if (typeof fromVite === 'string' && fromVite) return fromVite;
  const fromNode = typeof process !== 'undefined' ? process.env?.[name] : undefined;
  return fromNode || undefined;
}

const projectId = env('PUBLIC_SANITY_PROJECT_ID') ?? '';
const dataset = env('PUBLIC_SANITY_DATASET') ?? 'production';

/* Site Settings and the six pages exist exactly once, so they cannot be
   created from the "new document" menu or deleted from their own editor. */
const singletonActions = new Set(['publish', 'discardChanges', 'restore']);

export default defineConfig({
  name: 'kirana-cakrawala',
  title: 'Kirana Cakrawala',
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? prev.filter(({ action }) => action && singletonActions.has(action))
        : prev,
  },
});
