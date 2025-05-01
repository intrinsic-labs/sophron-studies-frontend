import createImageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';

const imageBuilder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
});

export const urlForImage = (source: Image) => {
  if (!source?.asset?._ref) {
    return null;
  }
  
  // Hotspot/crop is automatically respected when the source includes this data
  return imageBuilder.image(source).auto('format').fit('max').url();
}; 