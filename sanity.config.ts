import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { colorInput } from '@sanity/color-input';
import { schemaTypes } from './src/sanity/schemaTypes';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? '';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production';

export default defineConfig({
  name: 'kirana-cakrawala',
  title: 'Kirana Cakrawala',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document().schemaType('siteSettings').documentId('siteSettings'),
              ),
            S.divider(),
            S.documentTypeListItem('page').title('Pages'),
          ]),
    }),
    colorInput(),
  ],
  schema: { types: schemaTypes },
});
