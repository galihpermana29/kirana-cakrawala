// The KCA content model. Every type here mirrors a slice of src/content/*.ts;
// docs/content-model.md is the field-by-field map between the two.

import { documentTypes } from './documents';
import { objectTypes } from './objects';
import { pageTypes } from './pages';
import { sectionTypes } from './sections';

export const schemaTypes = [
  ...objectTypes,
  ...sectionTypes,
  ...documentTypes,
  ...pageTypes,
];

export { documentTypes, objectTypes, pageTypes, sectionTypes };
export { pageTypeNames } from './pages';
