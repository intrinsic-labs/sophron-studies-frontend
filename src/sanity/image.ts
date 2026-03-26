import { createImageUrlBuilder } from '@sanity/image-url';
import type { Image } from 'sanity';

import { dataset, projectId } from './config';

const imageBuilder = createImageUrlBuilder({
  projectId,
  dataset,
});

export const urlFor = (source: any) => imageBuilder.image(source).auto('format');

export const urlForImage = (source: Image | null | undefined) => {
  if (!source?.asset?._ref) {
    return null;
  }

  return urlFor(source).fit('max').url();
};
