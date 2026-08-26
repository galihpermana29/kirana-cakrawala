import { createImageUrlBuilder } from '@sanity/image-url';
import { dataset, projectId } from './cms';
import type { SanityImage } from './types';

const builder = projectId
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

export function urlFor(source: SanityImage) {
  if (!builder) {
    throw new Error(
      'Sanity is not configured; image URLs cannot be built. ' +
        'Guard calls with image?.asset before calling urlFor().',
    );
  }
  return builder.image(source).auto('format');
}
