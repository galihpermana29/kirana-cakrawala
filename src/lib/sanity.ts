// The site's one connection to the Sanity dataset it is built from.
//
// Every page fetches through here at build time, and nothing falls back: a
// dataset that cannot be reached, or a document that is not in it, fails the
// build. A page with a hole in it must never reach the live site, so a broken
// fetch has to break the deploy instead.

import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const projectId = String(import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? '').trim();
const dataset = String(import.meta.env.PUBLIC_SANITY_DATASET ?? '').trim() || 'production';

if (!projectId) {
  throw new Error(
    'PUBLIC_SANITY_PROJECT_ID is not set, so there is no content to build the ' +
      'site from. Set it in .env (see .env.example) and in the hosting ' +
      "provider's build environment.",
  );
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-06-01',
  // A build wants the dataset as it is now, not the CDN's copy of it.
  useCdn: false,
  // Drafts are the editor's business; the site is built from what is published.
  perspective: 'published',
});

const images = createImageUrlBuilder({ projectId, dataset });

/* The projection every picture is fetched through: the asset reference, the
   alt text, and where the file came from. resolveImages swaps the reference
   for a Sanity CDN url before the value leaves this module, so nothing
   downstream has to know Sanity's own image shape. */
export const IMAGE = '{"ref": asset._ref, alt, sourceUrl}';

/* Only the projection above produces an object with a string `ref`, so this
   walk cannot mistake anything else for a picture. */
function resolveImages(value: unknown): void {
  if (Array.isArray(value)) {
    value.forEach(resolveImages);
    return;
  }
  if (!value || typeof value !== 'object') return;
  const node = value as Record<string, unknown>;
  if (typeof node.ref === 'string') {
    node.src = images.image(node.ref).auto('format').url();
    delete node.ref;
    return;
  }
  Object.values(node).forEach(resolveImages);
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/* One document, or a build failure naming what is missing. */
export async function fetchDocument<T>(
  what: string,
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  let result: T | null;
  try {
    result = await client.fetch<T | null>(query, params);
  } catch (error) {
    throw new Error(
      `Could not read ${what} from Sanity (${projectId}/${dataset}): ${describe(error)}`,
    );
  }
  if (result === null || result === undefined) {
    throw new Error(
      `${what} is not in the ${dataset} dataset. Seed it with ` +
        '"npm run seed", or publish it in the Studio at /admin.',
    );
  }
  resolveImages(result);
  return result;
}

/* A collection that the site cannot render an empty version of. */
export async function fetchList<T>(
  what: string,
  query: string,
  params: Record<string, unknown> = {},
): Promise<T[]> {
  let result: T[] | null;
  try {
    result = await client.fetch<T[] | null>(query, params);
  } catch (error) {
    throw new Error(
      `Could not read ${what} from Sanity (${projectId}/${dataset}): ${describe(error)}`,
    );
  }
  if (!Array.isArray(result) || result.length === 0) {
    throw new Error(
      `No ${what} in the ${dataset} dataset. Seed them with "npm run seed", ` +
        'or publish them in the Studio at /admin.',
    );
  }
  resolveImages(result);
  return result;
}

/* A build renders seventeen routes off the same handful of documents, so each
   one is fetched once and shared. The cache lives as long as the build - but
   the dev server keeps modules alive between requests, so caching there would
   pin every page to the content from the first load until a restart. In dev,
   fetch fresh every time; a Studio publish then shows on the next refresh. */
const loaded = new Map<string, Promise<unknown>>();

export function once<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (import.meta.env.DEV) return load();
  const existing = loaded.get(key);
  if (existing) return existing as Promise<T>;
  const promise = load();
  loaded.set(key, promise);
  return promise;
}
