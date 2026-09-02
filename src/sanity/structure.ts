// The Studio's left-hand list: Site Settings and the six pages pinned at the
// top - one of each, so they are opened directly rather than listed - then the
// repeatable collections under them.

import type { StructureResolver } from 'sanity/structure';
import { pageTypes } from './schemaTypes/pages';

/* Documents there is exactly one of. The id is the type name, which is what
   the seed writes and what the pages fetch. */
export const singletonIds = ['siteSettings', ...pageTypes.map((page) => page.name)];

export const singletonTypes = new Set(singletonIds);

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Kirana Cakrawala')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings'),
        ),
      S.divider(),
      ...pageTypes.map((page) =>
        S.listItem()
          .title(page.title ?? page.name)
          .id(page.name)
          .child(
            S.document()
              .schemaType(page.name)
              .documentId(page.name)
              .title(page.title ?? page.name),
          ),
      ),
      S.divider(),
      S.documentTypeListItem('pillar').title('Pillars'),
      S.documentTypeListItem('article').title('Articles'),
      S.documentTypeListItem('partnerCategory').title('Partner Categories'),
      S.documentTypeListItem('mapPin').title('Map Pins'),
    ]);
