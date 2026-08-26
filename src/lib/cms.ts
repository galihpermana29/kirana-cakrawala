import { createClient, type SanityClient } from '@sanity/client';
import { fallbackHomePage, fallbackSettings } from './fallback';
import type { Page, SiteSettings } from './types';

export const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID as
  | string
  | undefined;
export const dataset =
  (import.meta.env.PUBLIC_SANITY_DATASET as string | undefined) ?? 'production';

export const client: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2025-06-01',
      // Builds always want fresh content, not the CDN cache.
      useCdn: false,
    })
  : null;

// Content fetch errors are deliberately NOT caught: a broken fetch during a
// production build must fail the deploy rather than silently publish the
// placeholder content over the live site.

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!client) return fallbackSettings;
  const settings = await client.fetch<SiteSettings | null>(
    '*[_type == "siteSettings"][0]',
  );
  if (!settings) {
    console.warn('[cms] No Site Settings document found; using placeholder.');
    return fallbackSettings;
  }
  return settings;
}

export async function getHomePage(): Promise<Page> {
  if (!client) return fallbackHomePage;
  const page = await client.fetch<Page | null>(
    '*[_type == "page" && slug.current == $slug][0]{ title, sections }',
    { slug: 'home' },
  );
  if (!page) {
    console.warn('[cms] No page with slug "home" found; using placeholder.');
    return fallbackHomePage;
  }
  return { ...page, sections: page.sections ?? [] };
}
